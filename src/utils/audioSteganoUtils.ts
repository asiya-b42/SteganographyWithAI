
// Web worker for audio processing
let worker: Worker | null = null;

const getWorker = (): Worker => {
  if (!worker) {
    const workerUrl = new URL('../workers/audioSteganoWorker.ts', import.meta.url);
    worker = new Worker(workerUrl, { type: 'module' });
  }
  return worker;
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
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(event.target.result as ArrayBuffer);
        resolve(audioBuffer);
      } catch (error) {
        reject(new Error('Failed to decode audio file. The file might be corrupted or in an unsupported format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read audio file'));
    };
    
    reader.readAsArrayBuffer(audioFile);
  });
};

// Embed data in the LSB of audio samples
export const embedDataInAudio = async (audioFile: File, data: string): Promise<Blob> => {
  try {
    // Check if Web Workers are supported
    if (typeof Worker === 'undefined') {
      throw new Error('Your browser does not support Web Workers, which are required for this operation');
    }
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data provided to embed');
    }
    
    // Get audio buffer
    const audioBuffer = await getAudioBuffer(audioFile);
    
    return new Promise((resolve, reject) => {
      // Set up worker
      const worker = getWorker();
      
      // Set up the worker message handler
      worker.onmessage = async (e) => {
        const { success, error, operation, modifiedChannelData, sampleRate, numberOfChannels, progress } = e.data;
        
        if (progress !== undefined && operation === 'embed') {
          // You could dispatch an event or update state to show progress
          console.log(`Embedding progress: ${Math.round(progress * 100)}%`);
          return;
        }
        
        if (!success) {
          reject(new Error(error || 'Failed to embed data in audio'));
          return;
        }
        
        if (operation === 'embed' && modifiedChannelData && sampleRate) {
          try {
            // Create a new audio context
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a new buffer with the same properties as the original
            const newBuffer = audioCtx.createBuffer(
              numberOfChannels || audioBuffer.numberOfChannels,
              audioBuffer.length,
              sampleRate || audioBuffer.sampleRate
            );
            
            // Set the modified channel data for channel 0
            newBuffer.getChannelData(0).set(modifiedChannelData);
            
            // Copy the other channels if any
            for (let i = 1; i < audioBuffer.numberOfChannels; i++) {
              newBuffer.getChannelData(i).set(audioBuffer.getChannelData(i));
            }
            
            // Create an offline context for rendering
            const offlineCtx = new OfflineAudioContext(
              newBuffer.numberOfChannels,
              newBuffer.length,
              newBuffer.sampleRate
            );
            
            // Create a buffer source
            const source = offlineCtx.createBufferSource();
            source.buffer = newBuffer;
            source.connect(offlineCtx.destination);
            source.start(0);
            
            // Render the buffer
            const renderedBuffer = await offlineCtx.startRendering();
            
            // Convert to WAV
            const wavData = encodeWAV(renderedBuffer.getChannelData(0), renderedBuffer.sampleRate);
            const outputBlob = new Blob([wavData], { type: 'audio/wav' });
            
            resolve(outputBlob);
          } catch (error) {
            reject(new Error('Failed to create audio output: ' + (error instanceof Error ? error.message : 'Unknown error')));
          }
        }
      };
      
      // Send the audio buffer to the worker
      worker.postMessage({
        operation: 'embed',
        audioBuffer,
        message: data
      });
    });
  } catch (error) {
    console.error('Error embedding data in audio:', error);
    throw error;
  }
};

// Extract data from the LSB of audio samples
export const extractDataFromAudio = async (audioFile: File): Promise<string> => {
  try {
    // Check if Web Workers are supported
    if (typeof Worker === 'undefined') {
      throw new Error('Your browser does not support Web Workers, which are required for this operation');
    }
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }
    
    // Get audio buffer
    const audioBuffer = await getAudioBuffer(audioFile);
    
    return new Promise((resolve, reject) => {
      // Set up worker
      const worker = getWorker();
      
      // Set up the worker message handler
      worker.onmessage = (e) => {
        const { success, error, operation, extractedMessage, progress } = e.data;
        
        if (progress !== undefined && operation === 'extract') {
          // You could dispatch an event or update state to show progress
          console.log(`Extraction progress: ${Math.round(progress * 100)}%`);
          return;
        }
        
        if (!success) {
          reject(new Error(error || 'Failed to extract data from audio'));
          return;
        }
        
        if (operation === 'extract' && extractedMessage) {
          resolve(extractedMessage);
        }
      };
      
      // Send the audio buffer to the worker
      worker.postMessage({
        operation: 'extract',
        audioBuffer
      });
    });
  } catch (error) {
    console.error('Error extracting data from audio:', error);
    throw error;
  }
};

// Utility to detect hidden message in audio
export const detectHiddenMessageInAudio = async (audioFile: File): Promise<{ hasHiddenContent: boolean; confidence: number }> => {
  try {
    // Check if Web Workers are supported
    if (typeof Worker === 'undefined') {
      throw new Error('Your browser does not support Web Workers, which are required for this operation');
    }
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }
    
    // Get audio buffer
    const audioBuffer = await getAudioBuffer(audioFile);
    
    return new Promise((resolve, reject) => {
      // Set up worker
      const worker = getWorker();
      
      // Set up the worker message handler
      worker.onmessage = (e) => {
        const { success, error, operation, detectionResult, progress } = e.data;
        
        if (progress !== undefined && operation === 'detect') {
          // You could dispatch an event or update state to show progress
          console.log(`Detection progress: ${Math.round(progress * 100)}%`);
          return;
        }
        
        if (!success) {
          reject(new Error(error || 'Failed to analyze audio for hidden content'));
          return;
        }
        
        if (operation === 'detect' && detectionResult) {
          resolve(detectionResult);
        }
      };
      
      // Send the audio buffer to the worker
      worker.postMessage({
        operation: 'detect',
        audioBuffer
      });
    });
  } catch (error) {
    console.error('Error detecting hidden message in audio:', error);
    throw error;
  }
};

// Function to encode audio data to WAV format - unchanged
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