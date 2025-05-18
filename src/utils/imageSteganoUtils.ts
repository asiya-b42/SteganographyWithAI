import { textToBinary, binaryToText } from './binaryUtils';

// Helper function to get a new blank canvas
const getCanvas = (width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return { canvas, ctx };
};

// Create a web worker for image processing
let worker: Worker | null = null;

const getWorker = (): Worker => {
  if (!worker) {
    const workerUrl = new URL('../workers/imageSteganoWorker.ts', import.meta.url);
    worker = new Worker(workerUrl, { type: 'module' });
  }
  return worker;
};

// Embed data in the LSB of the image
export const embedDataInImage = async (imageFile: File, data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      reject(new Error('No image file provided'));
      return;
    }
    
    if (!data || data.length === 0) {
      reject(new Error('No data provided to embed'));
      return;
    }
    
    // Check if Web Workers are supported
    if (typeof Worker === 'undefined') {
      // Fallback to the original implementation if workers aren't supported
      // (Original code would go here)
      reject(new Error('Your browser does not support Web Workers, which are required for this operation'));
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      try {
        // Create canvas
        const { canvas, ctx } = getCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Set up worker
        const worker = getWorker();
        
        // Set up the worker message handler
        worker.onmessage = (e) => {
          const { success, error, operation, modifiedImageData, progress } = e.data;
          
          if (progress !== undefined && operation === 'embed') {
            // You could dispatch an event or update state to show progress
            console.log(`Embedding progress: ${Math.round(progress * 100)}%`);
            return;
          }
          
          if (!success) {
            reject(new Error(error || 'Failed to embed data in image'));
            return;
          }
          
          if (operation === 'embed' && modifiedImageData) {
            // Create a new ImageData object from the worker's data
            const newImageData = new ImageData(
              new Uint8ClampedArray(modifiedImageData.data),
              modifiedImageData.width,
              modifiedImageData.height
            );
            
            // Put the modified image data back
            ctx.putImageData(newImageData, 0, 0);
            
            // Get image URL
            resolve(canvas.toDataURL('image/png'));
          }
        };
        
        // Send the image data to the worker
        // Send the image data to the worker
        worker.postMessage({
          operation: 'embed',
          imageData,
          message: data
        });
      } catch (error) {
        console.error('Error embedding data in image:', error);
        reject(new Error('Failed to embed data in image: ' + (error instanceof Error ? error.message : 'Unknown error')));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image. The file might be corrupted.'));
    };
    
    // Load image
    img.src = URL.createObjectURL(imageFile);
  });
};

// Extract data from the LSB of the image
export const extractDataFromImage = async (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      reject(new Error('No image file provided'));
      return;
    }
    
    // Check if Web Workers are supported
    if (typeof Worker === 'undefined') {
      reject(new Error('Your browser does not support Web Workers, which are required for this operation'));
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      try {
        // Create canvas
        const { canvas, ctx } = getCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
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
            reject(new Error(error || 'Failed to extract data from image'));
            return;
          }
          
          if (operation === 'extract' && extractedMessage) {
            resolve(extractedMessage);
          }
        };
        
        // Send the image data to the worker
        worker.postMessage({
          operation: 'extract',
          imageData
        });
      } catch (error) {
        console.error('Error extracting data from image:', error);
        reject(new Error('Failed to extract data from image: ' + (error instanceof Error ? error.message : 'Unknown error')));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image. The file might be corrupted.'));
    };
    
    // Load image
    img.src = URL.createObjectURL(imageFile);
  });
};

// Utility to detect hidden message in image
export const detectHiddenMessageInImage = async (imageFile: File): Promise<{ hasHiddenContent: boolean; confidence: number }> => {
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      reject(new Error('No image file provided'));
      return;
    }
    
    // Check if Web Workers are supported
    if (typeof Worker === 'undefined') {
      reject(new Error('Your browser does not support Web Workers, which are required for this operation'));
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      try {
        // Create canvas
        const { canvas, ctx } = getCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
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
            reject(new Error(error || 'Failed to analyze image for hidden content'));
            return;
          }
          
          if (operation === 'detect' && detectionResult) {
            resolve(detectionResult);
          }
        };
        
        // Send the image data to the worker
        worker.postMessage({
          operation: 'detect',
          imageData
        });
      } catch (error) {
        console.error('Error detecting hidden message in image:', error);
        reject(new Error('Failed to analyze image: ' + (error instanceof Error ? error.message : 'Unknown error')));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image. The file might be corrupted.'));
    };
    
    // Load image
    img.src = URL.createObjectURL(imageFile);
  });
};