// Audio steganography utilities

// Convert string to binary
const textToBinary = (text: string): string => {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const bin = charCode.toString(2);
    binary += '0'.repeat(8 - bin.length) + bin; // Ensure 8 bits per character
  }
  return binary;
};

// Convert binary to string
const binaryToText = (binary: string): string => {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    const charCode = parseInt(byte, 2);
    text += String.fromCharCode(charCode);
  }
  return text;
};

// Read audio file and get audio buffer
const getAudioBuffer = async (audioFile: File): Promise<AudioBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read audio file'));
        return;
      }
      
      try {
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(event.target.result as ArrayBuffer);
        resolve(audioBuffer);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(audioFile);
  });
};

// Embed data in the LSB of audio samples
export const embedDataInAudio = async (audioFile: File, data: string): Promise<Blob> => {
  try {
    const audioBuffer = await getAudioBuffer(audioFile);
    const audioContext = new AudioContext();
    
    // Get audio data
    const channelData = audioBuffer.getChannelData(0); // Use the first channel
    
    // Convert data to binary
    const binary = textToBinary(data);
    
    // Ensure the audio can hold all the data
    // Each sample can store 1 bit
    if (binary.length > channelData.length) {
      throw new Error(`Audio too short to store data. Can store ${channelData.length} bits, but got ${binary.length} bits.`);
    }
    
    // Store the length of the data (32 bits) at the beginning
    const dataLength = binary.length;
    const lengthBinary = dataLength.toString(2).padStart(32, '0');
    
    // Combine length and data
    const fullBinary = lengthBinary + binary;
    
    // Create a copy of the channel data
    const modifiedChannelData = new Float32Array(channelData);
    
    // Embed data
    for (let i = 0; i < fullBinary.length; i++) {
      // Replace the least significant bit
      // For floating point, we'll modify a small amount that affects only the lowest bit when quantized
      const bit = parseInt(fullBinary[i], 2);
      const mask = 0.00001; // Small enough to not affect audio quality
      
      // Make the value even or odd based on the bit
      const currentValue = modifiedChannelData[i];
      const isEven = Math.floor(Math.abs(currentValue) * 10000) % 2 === 0;
      
      if ((bit === 1 && isEven) || (bit === 0 && !isEven)) {
        modifiedChannelData[i] += mask;
      }
    }
    
    // Create a new buffer with the modified data
    const modifiedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    // Copy the modified channel data
    modifiedBuffer.copyToChannel(modifiedChannelData, 0);
    
    // Copy the other channels if any
    for (let i = 1; i < audioBuffer.numberOfChannels; i++) {
      modifiedBuffer.copyToChannel(audioBuffer.getChannelData(i), i);
    }
    
    // Convert to WAV or other format
    const offlineContext = new OfflineAudioContext(
      modifiedBuffer.numberOfChannels,
      modifiedBuffer.length,
      modifiedBuffer.sampleRate
    );
    
    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = modifiedBuffer;
    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);
    
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to WAV
    const audioData = renderedBuffer.getChannelData(0);
    const waveData = encodeWAV(audioData, renderedBuffer.sampleRate);
    
    return new Blob([waveData], { type: 'audio/wav' });
  } catch (error) {
    console.error('Error embedding data in audio:', error);
    throw error;
  }
};

// Extract data from the LSB of audio samples
export const extractDataFromAudio = async (audioFile: File): Promise<string> => {
  try {
    const audioBuffer = await getAudioBuffer(audioFile);
    
    // Get audio data
    const channelData = audioBuffer.getChannelData(0); // Use the first channel
    
    // Extract the length (first 32 bits)
    let binary = '';
    
    for (let i = 0; i < 32; i++) {
      const value = channelData[i];
      const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
      binary += isEven ? '0' : '1';
    }
    
    // Parse the length
    const dataLength = parseInt(binary, 2);
    if (isNaN(dataLength) || dataLength <= 0 || dataLength > channelData.length - 32) {
      throw new Error('Invalid or corrupted data in audio.');
    }
    
    // Extract the data
    binary = '';
    
    for (let i = 32; i < 32 + dataLength; i++) {
      const value = channelData[i];
      const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
      binary += isEven ? '0' : '1';
    }
    
    // Convert binary to text
    return binaryToText(binary);
  } catch (error) {
    console.error('Error extracting data from audio:', error);
    throw error;
  }
};

// Utility to detect hidden message in audio
export const detectHiddenMessageInAudio = async (audioFile: File): Promise<{ hasHiddenContent: boolean; confidence: number }> => {
  try {
    const audioBuffer = await getAudioBuffer(audioFile);
    
    // Get audio data
    const channelData = audioBuffer.getChannelData(0); // Use the first channel
    
    // Statistical analysis of LSBs
    let anomalyScore = 0;
    
    // Check first 32 bits for a valid length
    let binary = '';
    
    for (let i = 0; i < 32; i++) {
      const value = channelData[i];
      const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
      binary += isEven ? '0' : '1';
    }
    
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
      const value = channelData[i];
      const isEven = Math.floor(Math.abs(value) * 10000) % 2 === 0;
      
      if (isEven) lsbZeros++;
      else lsbOnes++;
    }
    
    // Calculate ratio
    const ratio = Math.abs(lsbZeros / (lsbZeros + lsbOnes) - 0.5);
    
    // Natural audio tends to have a more random distribution of LSBs
    // Audio with hidden data often has a more uniform distribution
    if (ratio < 0.05) {
      // Very uniform distribution - suspicious
      anomalyScore += 0.3;
    } else if (ratio < 0.1) {
      // Moderately uniform - somewhat suspicious
      anomalyScore += 0.15;
    }
    
    // Check for patterns in LSBs
    let patternScore = 0;
    let consecutiveMatches = 0;
    
    for (let i = 32; i < channelData.length - 8; i++) {
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
    
    return { hasHiddenContent, confidence };
  } catch (error) {
    console.error('Error detecting hidden message in audio:', error);
    throw error;
  }
};

// Function to encode audio data to WAV format
function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  
  // FMT sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  
  // Data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);
  
  // Write the PCM samples
  floatTo16BitPCM(view, 44, samples);
  
  return buffer;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array): void {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}