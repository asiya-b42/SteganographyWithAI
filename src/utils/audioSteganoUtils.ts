// Simplified and More Reliable Audio Steganography Implementation

// Constants and Configuration
const SIGNATURE = "STEGA";  // 5-character signature
const SIGNATURE_THRESHOLD = 0.4;  // Very lenient threshold (40%)
const MIN_VOLUME_THRESHOLD = 0.005;  // Ultra-low threshold for weak signals
const MODIFICATION_VALUE = 0.02;  // Strong modification value
const SAMPLES_PER_BIT = 7;  // High redundancy
const FILTER_WINDOW_SIZE = 5;  // Noise reduction window size

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

// Embed data in audio with enhanced reliability
export const embedDataInAudio = async (audioFile: File, data: string): Promise<Blob> => {
  try {
    const audioContext = getAudioContext();
    const audioBuffer = await getAudioBuffer(audioFile);
    const binaryData = textToBinary(data);
    const binarySignature = textToBinary(SIGNATURE);
    const dataLength = binaryData.length;
    const lengthBinary = dataLength.toString(2).padStart(32, '0');
    const fullBinary = binarySignature + lengthBinary + binaryData;
    
    console.log(`Embedding: Signature(${binarySignature.length}bits) + Length(${lengthBinary.length}bits) + Data(${binaryData.length}bits)`);
    
    const channelData = audioBuffer.getChannelData(0);
    if (fullBinary.length * SAMPLES_PER_BIT > channelData.length) {
      throw new Error(`Audio file too short to store data (${fullBinary.length} bits needed)`);
    }
    
    const modifiedChannelData = new Float32Array(channelData);
    
    for (let i = 0; i < fullBinary.length; i++) {
      const bit = parseInt(fullBinary[i], 2);
      for (let j = 0; j < SAMPLES_PER_BIT; j++) {
        const position = i * SAMPLES_PER_BIT + j;
        if (position >= modifiedChannelData.length) break;
        
        // Enhanced embedding with stronger signal
        if (bit === 1) {
          modifiedChannelData[position] = Math.max(MODIFICATION_VALUE, 
            Math.abs(modifiedChannelData[position]) + MODIFICATION_VALUE);
        } else {
          modifiedChannelData[position] = Math.min(-MODIFICATION_VALUE, 
            -Math.abs(modifiedChannelData[position]) - MODIFICATION_VALUE);
        }
      }
    }
    
    const outputBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    outputBuffer.copyToChannel(modifiedChannelData, 0);
    
    // Copy original data to other channels if any
    for (let i = 1; i < audioBuffer.numberOfChannels; i++) {
      outputBuffer.copyToChannel(audioBuffer.getChannelData(i), i);
    }
    
    return new Blob([audioBufferToWav(outputBuffer)], { type: 'audio/wav' });
  } catch (error) {
    console.error('Error in embedDataInAudio:', error);
    throw error;
  }
};

// Extract data from audio with improved reliability
export const extractDataFromAudio = async (audioFile: File): Promise<string> => {
  try {
    if (!audioFile || !audioFile.type.startsWith('audio/')) {
      throw new Error('Invalid audio file');
    }

    const audioBuffer = await getAudioBuffer(audioFile);
    const rawData = audioBuffer.getChannelData(0);
    
    // Apply signal processing
    const channelData = new Float32Array(rawData.length);
    const halfWindow = Math.floor(FILTER_WINDOW_SIZE / 2);
    
    // First pass: Moving average filter
    for (let i = 0; i < rawData.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - halfWindow); j <= Math.min(rawData.length - 1, i + halfWindow); j++) {
        sum += rawData[j];
        count++;
      }
      channelData[i] = sum / count;
    }
    
    // Second pass: Signal amplification
    for (let i = 0; i < channelData.length; i++) {
      channelData[i] = Math.sign(channelData[i]) * Math.pow(Math.abs(channelData[i]), 0.8);
    }

    // Find best signature match
    const signatureLength = SIGNATURE.length * 8;
    let bestScore = 0;
    let bestOffset = 0;
    
    // Try multiple starting positions
    for (let offset = 0; offset < SAMPLES_PER_BIT * 2; offset++) {
      let score = 0;
      let binary = '';
      
      // Extract signature bits
      for (let i = 0; i < signatureLength; i++) {
        let posSum = 0;
        let negSum = 0;
        
        for (let j = 0; j < SAMPLES_PER_BIT; j++) {
          const pos = offset + i * SAMPLES_PER_BIT + j;
          if (pos >= channelData.length) continue;
          
          const value = channelData[pos];
          if (value > 0) posSum += value;
          else negSum -= value;
        }
        
        binary += (posSum >= negSum) ? '1' : '0';
      }
      
      // Check signature match
      const extracted = binaryToText(binary);
      for (let i = 0; i < SIGNATURE.length; i++) {
        if (extracted[i] === SIGNATURE[i]) {
          score += 1;
        }
        if (Math.abs(extracted.charCodeAt(i) - SIGNATURE.charCodeAt(i)) <= 2) {
          score += 0.25;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestOffset = offset;
      }
    }

    if (bestScore < SIGNATURE.length * SIGNATURE_THRESHOLD) {
      console.warn(`Low signature match score: ${bestScore}/${SIGNATURE.length}`);
      throw new Error('No hidden message found (weak signature)');
    }

    console.log(`Found signature with score ${bestScore}/${SIGNATURE.length} at offset ${bestOffset}`);

    // Read length bits
    let lengthBinary = '';
    const lengthStart = bestOffset + signatureLength * SAMPLES_PER_BIT;
    
    for (let i = 0; i < 32; i++) {
      let sum = 0;
      let count = 0;
      
      for (let j = 0; j < SAMPLES_PER_BIT; j++) {
        const pos = lengthStart + i * SAMPLES_PER_BIT + j;
        if (pos >= channelData.length) continue;
        sum += channelData[pos];
        count++;
      }
      
      lengthBinary += (sum >= 0) ? '1' : '0';
    }
    
    const messageLength = parseInt(lengthBinary, 2);
    if (isNaN(messageLength) || messageLength <= 0 || 
        messageLength > (channelData.length / SAMPLES_PER_BIT) - signatureLength - 32) {
      throw new Error('Invalid message length detected');
    }
    
    // Extract message bits
    let messageBinary = '';
    const messageStart = lengthStart + 32 * SAMPLES_PER_BIT;
    
    for (let i = 0; i < messageLength; i++) {
      let sum = 0;
      let count = 0;
      
      for (let j = 0; j < SAMPLES_PER_BIT; j++) {
        const pos = messageStart + i * SAMPLES_PER_BIT + j;
        if (pos >= channelData.length) continue;
        sum += channelData[pos];
        count++;
      }
      
      messageBinary += (sum >= 0) ? '1' : '0';
    }
    
    const extractedMessage = binaryToText(messageBinary);
    if (!extractedMessage || extractedMessage.length === 0) {
      throw new Error('Failed to extract valid text');
    }
    
    return extractedMessage;
  } catch (error) {
    console.error('Error in extractDataFromAudio:', error);
    throw error;
  }
};

// Detect hidden content in audio with improved detection
export const detectHiddenMessageInAudio = async (audioFile: File): Promise<{ hasHiddenContent: boolean; confidence: number }> => {
  try {
    const audioBuffer = await getAudioBuffer(audioFile);
    const rawData = audioBuffer.getChannelData(0);
    
    // Apply basic signal processing
    const channelData = new Float32Array(rawData.length);
    const halfWindow = Math.floor(FILTER_WINDOW_SIZE / 2);
    
    for (let i = 0; i < rawData.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - halfWindow); j <= Math.min(rawData.length - 1, i + halfWindow); j++) {
        sum += rawData[j];
        count++;
      }
      channelData[i] = sum / count;
    }

    // Try to find signature pattern
    const signatureLength = SIGNATURE.length * 8;
    let bestScore = 0;
    
    for (let offset = 0; offset < SAMPLES_PER_BIT * 4; offset++) {
      let score = 0;
      let binary = '';
      
      for (let i = 0; i < signatureLength; i++) {
        let posSum = 0;
        let negSum = 0;
        
        for (let j = 0; j < SAMPLES_PER_BIT; j++) {
          const pos = offset + i * SAMPLES_PER_BIT + j;
          if (pos >= channelData.length) continue;
          
          const value = channelData[pos];
          if (value > 0) posSum += value;
          else negSum -= value;
        }
        
        binary += (posSum >= negSum) ? '1' : '0';
      }
      
      const extracted = binaryToText(binary);
      for (let i = 0; i < SIGNATURE.length; i++) {
        if (extracted[i] === SIGNATURE[i]) {
          score += 1;
        }
        if (Math.abs(extracted.charCodeAt(i) - SIGNATURE.charCodeAt(i)) <= 2) {
          score += 0.25;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
      }
    }

    // Statistical analysis for additional confidence
    const sampleSize = Math.min(20000, channelData.length);
    let patternCount = 0;
    let signalStrength = 0;
    
    for (let i = 0; i < sampleSize - SAMPLES_PER_BIT; i++) {
      let consistent = true;
      const direction = channelData[i] >= 0;
      
      for (let j = 1; j < SAMPLES_PER_BIT; j++) {
        if ((channelData[i + j] >= 0) !== direction) {
          consistent = false;
          break;
        }
      }
      
      if (consistent) {
        patternCount++;
      }
      
      signalStrength += Math.abs(channelData[i]);
    }
    
    const patternRatio = patternCount / (sampleSize - SAMPLES_PER_BIT);
    const avgSignalStrength = signalStrength / sampleSize;
    
    // Calculate final confidence
    let confidence = (bestScore / SIGNATURE.length) * 0.7;  // 70% weight to signature match
    
    if (patternRatio > 0.3) {  // Natural audio rarely has such consistent patterns
      confidence += 0.2;
    }
    
    if (avgSignalStrength > MIN_VOLUME_THRESHOLD) {
      confidence += 0.1;
    }
    
    // Cap confidence at 95%
    confidence = Math.min(0.95, confidence);
    
    return {
      hasHiddenContent: confidence >= SIGNATURE_THRESHOLD,
      confidence
    };
  } catch (error) {
    console.error('Error in detectHiddenMessageInAudio:', error);
    throw error;
  }
};

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels * 2;
  const sampleRate = buffer.sampleRate;
  
  const wav = new ArrayBuffer(44 + length);
  const view = new DataView(wav);
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
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