// Common binary conversion utilities

/**
 * Converts text to binary representation
 * @param text - The text to convert
 * @returns Binary string representation (8 bits per character)
 */
export const textToBinary = (text: string): string => {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const bin = charCode.toString(2);
    binary += '0'.repeat(8 - bin.length) + bin; // Ensure 8 bits per character
  }
  return binary;
};

/**
 * Converts binary string back to text
 * @param binary - Binary string (8 bits per character)
 * @returns Decoded text
 */
export const binaryToText = (binary: string): string => {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    const charCode = parseInt(byte, 2);
    text += String.fromCharCode(charCode);
  }
  return text;
};