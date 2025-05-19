// Simplified and More Reliable Audio Steganography Implementation

// Type definitions
declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}

// Get a properly supported AudioContext instance
const getAudioContext = (): AudioContext => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    throw new Error('Web Audio API is not supported in this browser');
  }
  return new AudioCtx();
};

// Binary conversion utilities
const textToBinary = (text: string): string => {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    binary += charCode.toString(2).padStart(8, '0');
  }
  return binary;
};

const binaryToText = (binary: string): string => {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    if (i + 8 <= binary.length) {
      const byte = binary.substr(i, 8);
      const charCode = parseInt(byte, 2);
      text += String.fromCharCode(charCode);
    }
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
        const audioContext = getAudioContext();
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

/**
 * SIMPLIFIED AUDIO STEGANOGRAPHY APPROACH
 * 
 * Rather than using LSB modification which is prone to corruption during 
 * WAV encoding, this implementation uses a more robust approach:
 * 
 * 1. We use a larger magnitude for modifications (0.01)
 * 2. We add redundancy for the header data
 * 3. We use a direct embedding approach with fewer steps
 * 4. We include a signature to verify valid data
 */

// Constants
const SIGNATURE = "STEGA"; // 5-character signature
const MIN_VOLUME_THRESHOLD = 0.05; // Only embed in samples with sufficient volume
const MODIFICATION_VALUE = 0.01; // Larger modification for better robustness

// Embed data in audio
export const embedDataInAudio = async (audioFile: File, data: string): Promise<Blob> => {
  try {
    // Get audio buffer from file
    const audioBuffer = await getAudioBuffer(audioFile);
    
    // Convert data to binary
    const binaryData = textToBinary(data);
    const binarySignature = textToBinary(SIGNATURE);
    
    // Create length prefix (32 bits)
    const dataLength = binaryData.length;
    const lengthBinary = dataLength.toString(2).padStart(32, '0');
    
    // Combine signature + length + data
    const fullBinary = binarySignature + lengthBinary + binaryData;
    console.log(`Embedding: Signature(${binarySignature.length}bits) + Length(${lengthBinary.length}bits) + Data(${binaryData.length}bits)`);
    
    // Make sure audio is long enough
    const channelData = audioBuffer.getChannelData(0);
    if (fullBinary.length * 3 > channelData.length) { // *3 for redundancy
      throw new Error(`Audio file too short to store data (${fullBinary.length} bits needed, only ${Math.floor(channelData.length/3)} available)`);
    }
    
    // Create a copy of the audio data
    const modifiedChannelData = new Float32Array(channelData);
    
    // Embed each bit with redundancy (repeat 3 times)
    for (let i = 0; i < fullBinary.length; i++) {
      const bit = parseInt(fullBinary[i], 2);
      
      // Embed the same bit in 3 consecutive samples for redundancy
      for (let j = 0; j < 3; j++) {
        const position = i * 3 + j;
        
        // Skip very quiet parts of audio (less noticeable and more reliable)
        if (Math.abs(modifiedChannelData[position]) < MIN_VOLUME_THRESHOLD) {
          continue;
        }
        
        // Simple embedding strategy: add or subtract a small value based on the bit
        if (bit === 1) {
          // For bit 1, make sure sample is positive
          modifiedChannelData[position] = Math.abs(modifiedChannelData[position]) + MODIFICATION_VALUE;
        } else {
          // For bit 0, make sure sample is negative
          modifiedChannelData[position] = -Math.abs(modifiedChannelData[position]) - MODIFICATION_VALUE;
        }
      }
    }
    
    // Create audio buffer with modified data
    const audioContext = getAudioContext();
    const outputBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    // Copy modified data to first channel
    outputBuffer.copyToChannel(modifiedChannelData, 0);
    
    // Copy original data to other channels (if any)
    for (let i = 1; i < audioBuffer.numberOfChannels; i++) {
      outputBuffer.copyToChannel(audioBuffer.getChannelData(i), i);
    }
    
    // Convert to WAV format
    const wav = audioBufferToWav(outputBuffer);
    return new Blob([wav], { type: 'audio/wav' });
  } catch (error) {
    console.error('Error in embedDataInAudio:', error);
    throw error;
  }
};

// Extract data from audio
export const extractDataFromAudio = async (audioFile: File): Promise<string> => {
  try {
    // Get audio buffer from file
    const audioBuffer = await getAudioBuffer(audioFile);
    const channelData = audioBuffer.getChannelData(0);
    
    // Determine signature length in bits
    const signatureLength = SIGNATURE.length * 8;
    
    // Extract signature with redundancy
    let signatureBinary = '';
    for (let i = 0; i < signatureLength; i++) {
      const votes = [0, 0]; // Count votes for bit 0 and 1
      
      // Read 3 samples for each bit (redundancy)
      for (let j = 0; j < 3; j++) {
        const position = i * 3 + j;
        if (position >= channelData.length) break;
        
        // Sample is positive = bit 1, negative = bit 0
        votes[channelData[position] >= 0 ? 1 : 0]++;
      }
      
      // Majority vote determines the bit
      signatureBinary += votes[1] > votes[0] ? '1' : '0';
    }
    
    // Convert signature to text and verify
    const extractedSignature = binaryToText(signatureBinary);
    console.log("Extracted signature:", extractedSignature);
    
    if (extractedSignature !== SIGNATURE) {
      throw new Error(`No hidden message found. Invalid signature: ${extractedSignature}`);
    }
    
    // Extract length data with redundancy (32 bits)
    let lengthBinary = '';
    for (let i = 0; i < 32; i++) {
      const votes = [0, 0];
      
      for (let j = 0; j < 3; j++) {
        const position = (signatureLength + i) * 3 + j;
        if (position >= channelData.length) break;
        
        votes[channelData[position] >= 0 ? 1 : 0]++;
      }
      
      lengthBinary += votes[1] > votes[0] ? '1' : '0';
    }
    
    // Parse data length
    const dataLength = parseInt(lengthBinary, 2);
    console.log("Extracted data length:", dataLength, "bits");
    
    // Validate data length
    if (isNaN(dataLength) || dataLength <= 0 || dataLength > (channelData.length / 3) - signatureLength - 32) {
      throw new Error(`Invalid data length (${dataLength} bits) detected`);
    }
    
    // Extract message data with redundancy
    let dataBinary = '';
    for (let i = 0; i < dataLength; i++) {
      const votes = [0, 0];
      
      for (let j = 0; j < 3; j++) {
        const position = (signatureLength + 32 + i) * 3 + j;
        if (position >= channelData.length) break;
        
        votes[channelData[position] >= 0 ? 1 : 0]++;
      }
      
      dataBinary += votes[1] > votes[0] ? '1' : '0';
    }
    
    // Convert binary data to text
    return binaryToText(dataBinary);
  } catch (error) {
    console.error('Error in extractDataFromAudio:', error);
    throw error;
  }
};

// Detect hidden content in audio
export const detectHiddenMessageInAudio = async (audioFile: File): Promise<{ hasHiddenContent: boolean; confidence: number }> => {
  try {
    // Get audio buffer
    const audioBuffer = await getAudioBuffer(audioFile);
    const channelData = audioBuffer.getChannelData(0);
    
    // Try to extract the signature
    const signatureLength = SIGNATURE.length * 8;
    let signatureBinary = '';
    
    for (let i = 0; i < signatureLength; i++) {
      const votes = [0, 0];
      
      for (let j = 0; j < 3; j++) {
        const position = i * 3 + j;
        if (position >= channelData.length) break;
        
        votes[channelData[position] >= 0 ? 1 : 0]++;
      }
      
      signatureBinary += votes[1] > votes[0] ? '1' : '0';
    }
    
    // Convert signature to text and check
    const extractedSignature = binaryToText(signatureBinary);
    
    // If exact signature match, very confident
    if (extractedSignature === SIGNATURE) {
      return { hasHiddenContent: true, confidence: 0.95 };
    }
    
    // Check for partial signature match
    const matchScore = [...SIGNATURE].filter((char, i) => extractedSignature[i] === char).length / SIGNATURE.length;
    
    if (matchScore > 0.6) {
      return { hasHiddenContent: true, confidence: matchScore * 0.9 };
    }
    
    // If no signature match, perform statistical analysis
    let positiveCount = 0;
    let negativeCount = 0;
    let patternCount = 0;
    
    // Sample a portion of the audio
    const sampleSize = Math.min(10000, channelData.length);
    
    for (let i = 0; i < sampleSize; i++) {
      const value = channelData[i];
      
      if (value > 0) positiveCount++;
      else negativeCount++;
      
      // Check for patterns of 3 consistent values (our redundancy pattern)
      if (i >= 2) {
        const sign1 = channelData[i-2] >= 0;
        const sign2 = channelData[i-1] >= 0;
        const sign3 = channelData[i] >= 0;
        
        if ((sign1 === sign2) && (sign2 === sign3)) {
          patternCount++;
        }
      }
    }
    
    // Calculate metrics
    const balanceRatio = Math.abs(positiveCount - negativeCount) / sampleSize;
    const patternRatio = patternCount / sampleSize;
    
    // Natural audio usually has more varied patterns
    let confidence = 0;
    
    // Very balanced positive/negative ratio is suspicious
    if (balanceRatio < 0.1) confidence += 0.3;
    
    // High pattern ratio is suspicious
    if (patternRatio > 0.5) confidence += 0.3;
    
    return {
      hasHiddenContent: confidence > 0.3,
      confidence: Math.min(confidence, 0.7) // Cap confidence for statistical detection
    };
  } catch (error) {
    console.error('Error in detectHiddenMessageInAudio:', error);
    throw error;
  }
};

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels * 2; // 2 bytes per sample
  const sampleRate = buffer.sampleRate;
  
  const wav = new ArrayBuffer(44 + length);
  const view = new DataView(wav);
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // File length
  view.setUint32(4, 36 + length, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (1 = PCM)
  view.setUint16(20, 1, true);
  // Channel count
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * 2, true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, length, true);
  
  // Write the PCM samples
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return wav;
}

// Helper function to write strings to DataView
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
