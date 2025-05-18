// Browser feature compatibility check utilities

interface CompatibilityResult {
  webCryptoSupported: boolean;
  webWorkersSupported: boolean;
  canvasSupported: boolean;
  audioContextSupported: boolean;
  filesystemApiSupported: boolean;
  allFeaturesSupported: boolean;
  unsupportedFeatures: string[];
}

/**
 * Checks if the browser supports all required features for the app
 */
export const checkBrowserCompatibility = (): CompatibilityResult => {
  // Check Web Crypto API
  const webCryptoSupported = 
    typeof window !== 'undefined' && 
    !!window.crypto && 
    !!window.crypto.subtle;
  
  // Check Web Workers
  const webWorkersSupported = 
    typeof window !== 'undefined' && 
    !!window.Worker;
  
  // Check Canvas support
  const canvasSupported = 
    typeof document !== 'undefined' && 
    !!document.createElement('canvas').getContext('2d');
  
  // Check Audio Context
  const audioContextSupported = 
    typeof window !== 'undefined' && 
    (!!window.AudioContext || !!window.webkitAudioContext);
  
  // Check File API
  const filesystemApiSupported = 
    typeof window !== 'undefined' && 
    !!window.File && 
    !!window.FileReader && 
    !!window.Blob;
  
  // Collect unsupported features
  const unsupportedFeatures: string[] = [];
  
  if (!webCryptoSupported) unsupportedFeatures.push('Web Cryptography API');
  if (!webWorkersSupported) unsupportedFeatures.push('Web Workers');
  if (!canvasSupported) unsupportedFeatures.push('Canvas');
  if (!audioContextSupported) unsupportedFeatures.push('Audio API');
  if (!filesystemApiSupported) unsupportedFeatures.push('File System API');
  
  // Check if all required features are supported
  const allFeaturesSupported = unsupportedFeatures.length === 0;
  
  return {
    webCryptoSupported,
    webWorkersSupported,
    canvasSupported,
    audioContextSupported,
    filesystemApiSupported,
    allFeaturesSupported,
    unsupportedFeatures
  };
};

/**
 * Use this hook to check browser compatibility at runtime
 */
export const useCompatibilityCheck = (): CompatibilityResult => {
  if (typeof window === 'undefined') {
    // Default to false for SSR
    return {
      webCryptoSupported: false,
      webWorkersSupported: false,
      canvasSupported: false,
      audioContextSupported: false,
      filesystemApiSupported: false,
      allFeaturesSupported: false,
      unsupportedFeatures: ['Server-Side Rendering']
    };
  }
  
  return checkBrowserCompatibility();
};