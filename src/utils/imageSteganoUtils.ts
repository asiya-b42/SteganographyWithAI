// Image steganography utilities

// Helper function to get a new blank canvas
const getCanvas = (width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return { canvas, ctx };
};

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

// Embed data in the LSB of the image
export const embedDataInImage = async (imageFile: File, data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas
        const { canvas, ctx } = getCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Convert data to binary
        const binary = textToBinary(data);
        
        // Ensure the image can hold all the data
        // Each pixel can store 3 bits (one in each RGB channel)
        const maxBits = (pixels.length / 4) * 3; // RGBA, but we only use RGB
        if (binary.length > maxBits) {
          reject(new Error(`Image too small to store data. Can store ${Math.floor(maxBits / 8)} bytes, but got ${Math.ceil(binary.length / 8)} bytes.`));
          return;
        }
        
        // Store the length of the data (32 bits) at the beginning
        const dataLength = binary.length;
        const lengthBinary = dataLength.toString(2).padStart(32, '0');
        
        // Combine length and data
        const fullBinary = lengthBinary + binary;
        
        // Embed data
        let bitIndex = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          // Skip alpha channel
          for (let j = 0; j < 3; j++) {
            if (bitIndex < fullBinary.length) {
              // Replace the least significant bit
              pixels[i + j] = (pixels[i + j] & 0xFE) | parseInt(fullBinary[bitIndex], 2);
              bitIndex++;
            } else {
              break;
            }
          }
          if (bitIndex >= fullBinary.length) break;
        }
        
        // Update image data
        ctx.putImageData(imageData, 0, 0);
        
        // Get image URL
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    // Load image
    img.src = URL.createObjectURL(imageFile);
  });
};

// Extract data from the LSB of the image
export const extractDataFromImage = async (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas
        const { canvas, ctx } = getCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Extract the length (first 32 bits)
        let binary = '';
        let bitIndex = 0;
        
        // Extract the length
        for (let i = 0; i < pixels.length && bitIndex < 32; i += 4) {
          // Skip alpha channel
          for (let j = 0; j < 3 && bitIndex < 32; j++) {
            binary += (pixels[i + j] & 0x01).toString();
            bitIndex++;
          }
        }
        
        // Parse the length
        const dataLength = parseInt(binary.substring(0, 32), 2);
        if (isNaN(dataLength) || dataLength <= 0 || dataLength > (pixels.length / 4) * 3) {
          reject(new Error('Invalid or corrupted data in image.'));
          return;
        }
        
        // Extract the data
        binary = '';
        bitIndex = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
          // Skip alpha channel
          for (let j = 0; j < 3; j++) {
            if (bitIndex >= 32) {
              // After the length bits
              binary += (pixels[i + j] & 0x01).toString();
            }
            bitIndex++;
            if (bitIndex >= 32 + dataLength) break;
          }
          if (bitIndex >= 32 + dataLength) break;
        }
        
        // Convert binary to text
        const text = binaryToText(binary.substring(0, dataLength));
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    // Load image
    img.src = URL.createObjectURL(imageFile);
  });
};

// Utility to detect hidden message in image
export const detectHiddenMessageInImage = async (imageFile: File): Promise<{ hasHiddenContent: boolean; confidence: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas
        const { canvas, ctx } = getCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Statistical analysis of LSBs
        let anomalyScore = 0;
        let totalPixels = pixels.length / 4;
        
        // Check first 32 bits for a valid length
        let binary = '';
        let bitIndex = 0;
        
        for (let i = 0; i < pixels.length && bitIndex < 32; i += 4) {
          for (let j = 0; j < 3 && bitIndex < 32; j++) {
            binary += (pixels[i + j] & 0x01).toString();
            bitIndex++;
          }
        }
        
        const potentialLength = parseInt(binary, 2);
        const validLengthPattern = potentialLength > 0 && potentialLength < totalPixels * 3;
        
        // If the length seems valid, increase suspicion
        if (validLengthPattern) {
          anomalyScore += 0.4;
        }
        
        // Analyze LSB distribution
        let lsbZeros = 0;
        let lsbOnes = 0;
        
        // Sample pixels
        const sampleSize = Math.min(10000, pixels.length / 4);
        const step = Math.floor(pixels.length / 4 / sampleSize);
        
        for (let i = 0; i < pixels.length; i += 4 * step) {
          for (let j = 0; j < 3; j++) {
            const lsb = pixels[i + j] & 0x01;
            if (lsb === 0) lsbZeros++;
            else lsbOnes++;
          }
        }
        
        // Calculate ratio
        const ratio = Math.abs(lsbZeros / (lsbZeros + lsbOnes) - 0.5);
        
        // Natural images tend to have a more random distribution of LSBs
        // Images with hidden data often have a more uniform distribution
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
        
        for (let i = 0; i < pixels.length - 8; i += 4) {
          const pattern = [
            pixels[i] & 0x01,
            pixels[i + 1] & 0x01,
            pixels[i + 2] & 0x01,
          ];
          
          // Check if this matches a pattern for ASCII characters
          if ((pattern[0] === 0 && pattern[1] === 0) || (pattern[1] === 0 && pattern[2] === 0)) {
            consecutiveMatches++;
          } else {
            consecutiveMatches = 0;
          }
          
          if (consecutiveMatches > 5) {
            patternScore += 0.1;
            consecutiveMatches = 0;
          }
        }
        
        anomalyScore += Math.min(patternScore, 0.3);
        
        // Final decision
        const hasHiddenContent = anomalyScore > 0.5;
        const confidence = Math.min(anomalyScore, 0.95);
        
        resolve({ hasHiddenContent, confidence });
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    // Load image
    img.src = URL.createObjectURL(imageFile);
  });
};