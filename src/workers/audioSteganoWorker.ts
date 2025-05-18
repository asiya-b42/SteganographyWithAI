// Audio steganography web worker

// Binary conversion utilities
const textToBinary = (text: string): string => {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const bin = charCode.toString(2);
    binary += '0'.repeat(8 - bin.length) + bin; // Ensure 8 bits per character
  }
  return binary;
};

const binaryToText = (binary: string): string => {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    const charCode = parseInt(byte, 2);
    text += String.fromCharCode(charCode);
  }
  return text;
};

// Listen for messages from the main thread
self.addEventListener('message', async (e) => {
  const { operation, audioBuffer, message } = e.data;
  
  try {
    if (operation === 'embed') {
      // Get audio data from the channel
      const channelData = audioBuffer.getChannelData(0);
      
      // Convert data to binary
      const binary = textToBinary(message);
      
      // Ensure the audio can hold all the data
      if (binary.length > channelData.length) {
        self.postMessage({
          success: false,
          error: `Audio too short to store data. Can store ${channelData.length} bits, but got ${binary.length} bits.`
        });
        return;
      }
      
      // Store the length of the data (32 bits) at the beginning
      const dataLength = binary.length;
      const lengthBinary = dataLength.toString(2).padStart(32, '0');
      
      // Combine length and data
      const fullBinary = lengthBinary + binary;
      
      // Create a copy of the channel data
      const modifiedChannelData = new Float32Array(channelData);
      
      // Embed data with progress updates
      for (let i = 0; i < fullBinary.length; i++) {
        // Send progress updates at regular intervals
        if (i % 1000 === 0) {
          self.postMessage({
            progress: i / fullBinary.length,
            operation: 'embed'
          });
        }
        
        // Replace the least significant bit
        const bit = parseInt(fullBinary[i], 2);
        const mask = 0.00001; // Small enough to not affect audio quality
        
        // Make the value even or odd based on the bit
        const currentValue = modifiedChannelData[i];
        const isEven = Math.floor(Math.abs(currentValue) * 10000) % 2 === 0;
        
        if ((bit === 1 && isEven) || (bit === 0 && !isEven)) {
          modifiedChannelData[i] += mask;
        }
      }
      
      // Send the modified channel data back
      self.postMessage({
        success: true,
        operation: 'embed',
        modifiedChannelData: modifiedChannelData,
        sampleRate: audioBuffer.sampleRate,
        numberOfChannels: audioBuffer.numberOfChannels
      });
    } 
    else if (operation === 'extract') {
      // Get audio data
      const channelData = audioBuffer.getChannelData(0);
      
      // Extract the length (first 32 bits) with progress updates
      let binary = '';
      
      for (let i = 0; i < 32; i++) {
        if (i % 10 === 0) {
          self.postMessage({
            progress: i / 32 * 0.1, // First 10% of the process
            operation: 'extract'
          });
        }
        
        const value = channelData[i];
        const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
        binary += isEven ? '0' : '1';
      }
      
      // Parse the length
      const dataLength = parseInt(binary, 2);
      if (isNaN(dataLength) || dataLength <= 0 || dataLength > channelData.length - 32) {
        self.postMessage({
          success: false,
          error: 'Invalid or corrupted data in audio.'
        });
        return;
      }
      
      // Extract the data with progress updates
      binary = '';
      
      for (let i = 32; i < 32 + dataLength; i++) {
        // Send progress updates at regular intervals
        if ((i - 32) % 1000 === 0) {
          self.postMessage({
            progress: 0.1 + (i - 32) / dataLength * 0.9, // Remaining 90% of the process
            operation: 'extract'
          });
        }
        
        const value = channelData[i];
        const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
        binary += isEven ? '0' : '1';
      }
      
      // Convert binary to text
      const text = binaryToText(binary);
      
      // Send the extracted message back
      self.postMessage({
        success: true,
        operation: 'extract',
        extractedMessage: text
      });
    }
    else if (operation === 'detect') {
      // Get audio data
      const channelData = audioBuffer.getChannelData(0);
      
      // Statistical analysis of LSBs
      let anomalyScore = 0;
      
      // Check first 32 bits for a valid length
      let binary = '';
      
      for (let i = 0; i < 32; i++) {
        const value = channelData[i];
        const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
        binary += isEven ? '0' : '1';
      }
      
      // First 10% of detection completed
      self.postMessage({
        progress: 0.1,
        operation: 'detect'
      });
      
      const potentialLength = parseInt(binary, 2);
      const validLengthPattern = potentialLength > 0 && potentialLength < channelData.length - 32;
      
      // If the length seems valid, increase suspicion
      if (validLengthPattern) {
        anomalyScore += 0.4;
      }
      
      // Analyze LSB distribution
      let lsbZeros = 0;
      let lsbOnes = 0;
      
      // Sample audio samples
      const sampleSize = Math.min(10000, channelData.length);
      const step = Math.floor(channelData.length / sampleSize);
      
      for (let i = 0; i < channelData.length; i += step) {
        // Send progress updates at regular intervals
        if (i % (step * 100) === 0) {
          self.postMessage({
            progress: 0.1 + (i / channelData.length) * 0.6, // 10% to 70% of the process
            operation: 'detect'
          });
        }
        
        const value = channelData[i];
        const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
        
        if (isEven) lsbZeros++;
        else lsbOnes++;
      }
      
      // Calculate ratio
      const ratio = Math.abs(lsbZeros / (lsbZeros + lsbOnes) - 0.5);
      
      // Natural audio tends to have a more random distribution of LSBs
      if (ratio < 0.05) {
        // Very uniform distribution - suspicious
        anomalyScore += 0.3;
      } else if (ratio < 0.1) {
        // Moderately uniform - somewhat suspicious
        anomalyScore += 0.15;
      }
      
      // 70% of detection completed
      self.postMessage({
        progress: 0.7,
        operation: 'detect'
      });
      
      // Check for patterns in LSBs
      let patternScore = 0;
      let consecutiveMatches = 0;
      
      for (let i = 32; i < channelData.length - 8; i++) {
        // Send progress updates at regular intervals
        if (i % 1000 === 0) {
          self.postMessage({
            progress: 0.7 + (i - 32) / (channelData.length - 32) * 0.3, // 70% to 100% of the process
            operation: 'detect'
          });
        }
        
        const value = channelData[i];
        const nextValue = channelData[i + 1];
        
        const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
        const isNextEven = Math.floor(Math.abs(nextValue) * 10000) % 2 === 0;
        
        // Check for patterns typical of hidden ASCII data
        if ((isEven && isNextEven) || (!isEven && !isNextEven)) {
          consecutiveMatches++;
        } else {
          consecutiveMatches = 0;
        }
        
        if (consecutiveMatches > 4) {
          patternScore += 0.1;
          consecutiveMatches = 0;
        }
      }
      
      anomalyScore += Math.min(patternScore, 0.3);
      
      // Final decision
      const hasHiddenContent = anomalyScore > 0.5;
      const confidence = Math.min(anomalyScore, 0.95);
      
      // Send the detection result back
      self.postMessage({
        success: true,
        operation: 'detect',
        detectionResult: {
          hasHiddenContent,
          confidence
        }
      });
    }
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      operation
    });
  }
});