// Real ML-based steganography detector for images using TensorFlow.js
// This file loads a TensorFlow.js model for steganalysis and uses it to detect steganography in images.

import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel | null = null;

/**
 * Load the machine learning model for steganography detection.
 * Expects a model.json file in the public directory.
 */
export async function loadStegoDetectionModel(): Promise<void> {
  if (model) return;
  model = await tf.loadLayersModel('/model.json');
  console.log('[ML] Stego detection model loaded (real TensorFlow.js model)');
}

/**
 * Preprocess the image for ML model input.
 * Resizes the image to 128x128 and normalizes the pixel values.
 * @param imageFile The image file to preprocess
 * @returns A tensor representing the image
 */
function preprocessImage(imageFile: File): Promise<tf.Tensor3D> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Resize to 128x128 and normalize
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0, 128, 128);
        const imageData = ctx.getImageData(0, 0, 128, 128);
        const data = tf.browser.fromPixels(imageData).toFloat().div(255);
        resolve(data);
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Detect steganography in an image using the loaded ML model.
 * @param imageFile The image file to check
 * @returns An object with hasHiddenContent and confidence
 */
export async function detectStegoInImage(imageFile: File): Promise<{ hasHiddenContent: boolean; confidence: number }> {
  if (!model) throw new Error('ML model not loaded. Call loadStegoDetectionModel() first.');
  const tensor = await preprocessImage(imageFile);
  // Model expects shape [1, 128, 128, 3]
  const input = tensor.expandDims(0);
  const prediction = (model.predict(input) as tf.Tensor).dataSync();
  // Assume binary classification: [prob_no_stego, prob_stego]
  const confidence = prediction[1] ?? 0;
  return {
    hasHiddenContent: confidence > 0.5,
    confidence,
  };
}
