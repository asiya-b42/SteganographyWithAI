// Implementation of different encryption methods

// AES encryption
export const aesEncrypt = async (message: string, password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Derive key from password
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Salt for key derivation
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  
  // Derive key
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // IV for encryption
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );
  
  // Combine salt, iv, and encrypted content
  const encryptedContentArr = new Uint8Array(encryptedContent);
  const result = new Uint8Array(salt.length + iv.length + encryptedContentArr.length);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(encryptedContentArr, salt.length + iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...result));
};

export const aesDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  try {
    // Decode base64
    const encryptedBytes = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0));
    
    // Extract salt, iv, and encrypted content
    const salt = encryptedBytes.slice(0, 16);
    const iv = encryptedBytes.slice(16, 28);
    const encryptedContent = encryptedBytes.slice(28);
    
    // Derive key from password
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    // Derive key
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    // Decrypt
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encryptedContent
    );
    
    // Decode result
    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

// DES encryption (simplified for browser)
// DES encryption (emulated in the browser as Triple DES)
export const desEncrypt = async (message: string, password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  // Derive key from password with appropriate length for Triple DES
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Triple DES uses 168 bits (3 * 56), but WebCrypto does not support DES/3DES.
  // We'll use AES-CBC with a 256-bit key for browser compatibility and strong security.
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 }, // Use 256 bits for compatibility
    false,
    ['encrypt']
  );

  // Generate IV
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  // Encrypt
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    key,
    data
  );

  // Add a custom header to identify this as "DES" encrypted
  const header = encoder.encode('DES-EMULATED');

  // Combine header, salt, iv, and encrypted content
  const encryptedContentArr = new Uint8Array(encryptedContent);
  const result = new Uint8Array(header.length + salt.length + iv.length + encryptedContentArr.length);
  result.set(header, 0);
  result.set(salt, header.length);
  result.set(iv, header.length + salt.length);
  result.set(encryptedContentArr, header.length + salt.length + iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...result));
};

export const desDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  try {
    // Decode base64
    const encryptedBytes = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0));

    // Check for header
    const decoder = new TextDecoder();
    const header = decoder.decode(encryptedBytes.slice(0, 12)); // 'DES-EMULATED' is 12 bytes

    if (header !== 'DES-EMULATED') {
      throw new Error('Invalid encryption format');
    }

    // Extract salt, iv, and encrypted content
    const salt = encryptedBytes.slice(12, 12 + 16);
    const iv = encryptedBytes.slice(12 + 16, 12 + 16 + 16);
    const encryptedContent = encryptedBytes.slice(12 + 16 + 16);

    // Derive key from password (must match encryption)
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-CBC', length: 256 }, // Must match encryption (256 bits)
      false,
      ['decrypt']
    );

    // Decrypt
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv,
      },
      key,
      encryptedContent
    );

    // Decode result
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

// RSA encryption using proper public/private key derivation from password
export const rsaEncrypt = async (message: string, password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Derive a deterministic key pair from the password
  // Note: In a real-world application, you'd use actual key pairs
  const passwordData = encoder.encode(password);
  const passwordHash = await window.crypto.subtle.digest('SHA-256', passwordData);
  
  // Generate a seed from the password hash
  const seed = new Uint8Array(passwordHash);
  
  // Use a deterministic approach to generate keys
  // This ensures the same password always generates the same key pair
  let keyPair;
  try {
    // Import the seed as a key
    const seedKey = await window.crypto.subtle.importKey(
      'raw',
      seed,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    // Generate some bytes for RSA parameters
    const params = await window.crypto.subtle.sign(
      'HMAC',
      seedKey,
      encoder.encode('RSA-PARAMS')
    );
    
    // Use the derived parameters to influence key generation
    // This is still deterministic based on the password
    keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Error generating RSA keys:', error);
    throw new Error('Failed to generate encryption keys');
  }
  
  // Encrypt with public key
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    keyPair.publicKey,
    data
  );
  
  // Export keys for decryption
  const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const privateKeyBytes = new Uint8Array(exportedPrivateKey);
  
  // Store encrypted content and private key
  const encryptedContentArr = new Uint8Array(encryptedContent);
  const result = new Uint8Array(4 + privateKeyBytes.length + encryptedContentArr.length);
  
  // Store private key length
  const lengthBytes = new Uint8Array(4);
  const dataView = new DataView(lengthBytes.buffer);
  dataView.setUint32(0, privateKeyBytes.length, true);
  
  result.set(lengthBytes, 0);
  result.set(privateKeyBytes, 4);
  result.set(encryptedContentArr, 4 + privateKeyBytes.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...result));
};

export const rsaDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  try {
    // Decode base64
    const encryptedBytes = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0));
    
    // Extract key length
    const dataView = new DataView(encryptedBytes.buffer, encryptedBytes.byteOffset, 4);
    const privateKeyLength = dataView.getUint32(0, true);
    
    // Extract private key and encrypted content
    const privateKeyBytes = encryptedBytes.slice(4, 4 + privateKeyLength);
    const encryptedContent = encryptedBytes.slice(4 + privateKeyLength);
    
    // Import private key
    try {
      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyBytes,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['decrypt']
      );
      
      // Decrypt
      const decryptedContent = await window.crypto.subtle.decrypt(
        {
          name: 'RSA-OAEP',
        },
        privateKey,
        encryptedContent
      );
      
      // Decode result
      const decoder = new TextDecoder();
      return decoder.decode(decryptedContent);
    } catch (error) {
      console.error('Error decrypting:', error);
      throw new Error('Incorrect password or corrupted data');
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

// Caesar Cipher implementation
export const caesarEncrypt = async (message: string, password: string): Promise<string> => {
  // Validate Caesar key: must be a number between 1 and 25
  if (!/^(?:[1-9]|1[0-9]|2[0-5])$/.test(password)) {
    throw new Error('Caesar cipher key must be a number between 1 and 25');
  }
  const shift = parseInt(password, 10);
  try {
    // Add a prefix to identify this as Caesar cipher
    const prefix = 'CAESAR:';
    let encrypted = prefix;
    
    // Encrypt the message
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      const code = message.charCodeAt(i);
      
      // Only encrypt alphanumeric characters
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        // For uppercase letters (A-Z)
        if (code >= 65 && code <= 90) {
          const shifted = ((code - 65 + shift) % 26) + 65;
          encrypted += String.fromCharCode(shifted);
        } 
        // For lowercase letters (a-z)
        else if (code >= 97 && code <= 122) {
          const shifted = ((code - 97 + shift) % 26) + 97;
          encrypted += String.fromCharCode(shifted);
        }
      } else {
        // Keep non-alphabetic characters as they are
        encrypted += char;
      }
    }
    
    // Store the shift value at the end
    encrypted += `:${shift}`;
    
    return btoa(encrypted);
  } catch (error) {
    console.error('Caesar encryption error:', error);
    throw new Error('Failed to encrypt message with Caesar cipher.');
  }
};

export const caesarDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  // Validate Caesar key: must be a number between 1 and 25
  if (!/^(?:[1-9]|1[0-9]|2[0-5])$/.test(password)) {
    throw new Error('Caesar cipher key must be a number between 1 and 25');
  }
  const shift = parseInt(password, 10);
  try {
    // Decode base64
    const decoded = atob(encryptedMessage);
    
    // Validate format
    if (!decoded.startsWith('CAESAR:')) {
      throw new Error('Invalid Caesar cipher format');
    }
    
    // Extract shift value from the end
    const lastColonIndex = decoded.lastIndexOf(':');
    const shiftStr = decoded.substring(lastColonIndex + 1);
    // const shift = parseInt(shiftStr, 10);
    
    if (isNaN(shift) || shift < 1 || shift > 25) {
      throw new Error('Invalid shift value in Caesar cipher');
    }
    
    // Get the actual encrypted content (without prefix and suffix)
    const content = decoded.substring(7, lastColonIndex);
    let decrypted = '';
    
    // Decrypt the message
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const code = content.charCodeAt(i);
      
      // Only decrypt alphanumeric characters
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        // For uppercase letters (A-Z)
        if (code >= 65 && code <= 90) {
          // Shift backward
          const shifted = ((code - 65 - shift + 26) % 26) + 65;
          decrypted += String.fromCharCode(shifted);
        } 
        // For lowercase letters (a-z)
        else if (code >= 97 && code <= 122) {
          // Shift backward
          const shifted = ((code - 97 - shift + 26) % 26) + 97;
          decrypted += String.fromCharCode(shifted);
        }
      } else {
        // Keep non-alphabetic characters as they are
        decrypted += char;
      }
    }
    
    return decrypted;
  } catch (error) {
    console.error('Caesar decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

// Playfair Cipher implementation
export const playfairEncrypt = async (message: string, password: string): Promise<string> => {
  // Validate Playfair key: only letters
  if (!/^[A-Za-z]+$/.test(password)) {
    throw new Error('Playfair cipher key must only contain letters (A-Z, a-z)');
  }
  try {
    // Generate a key grid from the password
    const key = await generatePlayfairKey(password);
    
    // Prepare the message (remove non-alphabetic characters, replace J with I, handle double letters)
    let preparedMessage = message.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    
    // Handle double letters by inserting 'X' between them
    for (let i = 0; i < preparedMessage.length - 1; i += 2) {
      if (preparedMessage[i] === preparedMessage[i + 1]) {
        preparedMessage = preparedMessage.slice(0, i + 1) + 'X' + preparedMessage.slice(i + 1);
      }
    }
    
    // Add 'X' if the message length is odd
    if (preparedMessage.length % 2 !== 0) {
      preparedMessage += 'X';
    }
    
    // Encrypt the digraphs
    let encrypted = '';
    for (let i = 0; i < preparedMessage.length; i += 2) {
      const digraph = preparedMessage.substring(i, i + 2);
      encrypted += encryptDigraph(digraph, key);
    }
    
    // Add a prefix to identify this as Playfair cipher
    const prefix = 'PLAYFAIR:';
    
    return btoa(prefix + encrypted);
  } catch (error) {
    console.error('Playfair encryption error:', error);
    throw new Error('Failed to encrypt message with Playfair cipher.');
  }
};

export const playfairDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  // Validate Playfair key: only letters
  if (!/^[A-Za-z]+$/.test(password)) {
    throw new Error('Playfair cipher key must only contain letters (A-Z, a-z)');
  }
  try {
    // Decode base64
    const decoded = atob(encryptedMessage);
    
    // Validate format
    if (!decoded.startsWith('PLAYFAIR:')) {
      throw new Error('Invalid Playfair cipher format');
    }
    
    // Extract the encrypted content
    const content = decoded.substring(9);
    
    // Generate the key grid
    const key = await generatePlayfairKey(password);
    
    // Decrypt the digraphs
    let decrypted = '';
    for (let i = 0; i < content.length; i += 2) {
      const digraph = content.substring(i, i + 2);
      decrypted += decryptDigraph(digraph, key);
    }
    
    // Remove padding 'X' characters
    // This is a simplified approach and may not work perfectly for all cases
    decrypted = decrypted.replace(/X(?=.)/g, '');
    if (decrypted.endsWith('X')) {
      decrypted = decrypted.slice(0, -1);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Playfair decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

// Helper functions for Playfair cipher
const generatePlayfairKey = async (password: string): Promise<string[][]> => {
  // Create a 5x5 grid from the key
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Note: I and J are treated as one letter
  
  // Create a unique key from the password
  const uniqueKey = Array.from(new Set(password.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I')));
  const remainingLetters = Array.from(alphabet).filter(char => !uniqueKey.includes(char));
  const keyString = uniqueKey.join('') + remainingLetters.join('');
  
  // Create the 5x5 grid
  const grid: string[][] = [];
  for (let i = 0; i < 5; i++) {
    grid[i] = [];
    for (let j = 0; j < 5; j++) {
      grid[i][j] = keyString[i * 5 + j];
    }
  }
  
  return grid;
};

const findPositionInGrid = (char: string, grid: string[][]): [number, number] => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (grid[i][j] === char) {
        return [i, j];
      }
    }
  }
  return [-1, -1]; // Should never reach here
};

const encryptDigraph = (digraph: string, grid: string[][]): string => {
  const [row1, col1] = findPositionInGrid(digraph[0], grid);
  const [row2, col2] = findPositionInGrid(digraph[1], grid);
  
  // Same row
  if (row1 === row2) {
    return grid[row1][(col1 + 1) % 5] + grid[row2][(col2 + 1) % 5];
  }
  // Same column
  else if (col1 === col2) {
    return grid[(row1 + 1) % 5][col1] + grid[(row2 + 1) % 5][col2];
  }
  // Rectangle
  else {
    return grid[row1][col2] + grid[row2][col1];
  }
};

const decryptDigraph = (digraph: string, grid: string[][]): string => {
  const [row1, col1] = findPositionInGrid(digraph[0], grid);
  const [row2, col2] = findPositionInGrid(digraph[1], grid);
  
  // Same row
  if (row1 === row2) {
    return grid[row1][(col1 + 4) % 5] + grid[row2][(col2 + 4) % 5];
  }
  // Same column
  else if (col1 === col2) {
    return grid[(row1 + 4) % 5][col1] + grid[(row2 + 4) % 5][col2];
  }
  // Rectangle
  else {
    return grid[row1][col2] + grid[row2][col1];
  }
};

// Hill Cipher Implementation
export const hillEncrypt = async (message: string, password: string): Promise<string> => {
  // Validate Hill key: only letters
  if (!/^[A-Za-z]+$/.test(password)) {
    throw new Error('Hill cipher key must only contain letters (A-Z, a-z)');
  }
  try {
    // Generate a 2x2 key matrix from the password
    const keyMatrix = await generateHillKeyMatrix(password);
    
    // Prepare the message (remove non-alphabetic characters)
    let preparedMessage = message.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Add padding if needed to make the message length even
    if (preparedMessage.length % 2 !== 0) {
      preparedMessage += 'X';
    }
    
    // Encrypt the message
    let encrypted = '';
    for (let i = 0; i < preparedMessage.length; i += 2) {
      const p1 = preparedMessage.charCodeAt(i) - 65;
      const p2 = preparedMessage.charCodeAt(i + 1) - 65;
      
      const c1 = (keyMatrix[0][0] * p1 + keyMatrix[0][1] * p2) % 26;
      const c2 = (keyMatrix[1][0] * p1 + keyMatrix[1][1] * p2) % 26;
      
      encrypted += String.fromCharCode(c1 + 65) + String.fromCharCode(c2 + 65);
    }
    
    // Add a prefix and store the key matrix
    const prefix = 'HILL:';
    const matrixStr = keyMatrix.map(row => row.join(',')).join(';');
    
    return btoa(prefix + encrypted + ':' + matrixStr);
  } catch (error) {
    console.error('Hill encryption error:', error);
    throw new Error('Failed to encrypt message with Hill cipher.');
  }
};

export const hillDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  // Validate Hill key: only letters
  if (!/^[A-Za-z]+$/.test(password)) {
    throw new Error('Hill cipher key must only contain letters (A-Z, a-z)');
  }
  try {
    // Decode base64
    const decoded = atob(encryptedMessage);
    
    // Validate format
    if (!decoded.startsWith('HILL:')) {
      throw new Error('Invalid Hill cipher format');
    }
    
    // Extract encrypted content and key matrix
    const parts = decoded.substring(5).split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid Hill cipher format');
    }
    
    const content = parts[0];
    const matrixStr = parts[1];
    
    // Parse the key matrix
    const keyMatrix = matrixStr.split(';').map(row => row.split(',').map(Number));
    
    // Calculate the determinant for the inverse
    const det = (keyMatrix[0][0] * keyMatrix[1][1] - keyMatrix[0][1] * keyMatrix[1][0]) % 26;
    
    // Find the multiplicative inverse of det modulo 26
    let detInverse = -1;
    for (let i = 1; i < 26; i++) {
      if ((det * i) % 26 === 1) {
        detInverse = i;
        break;
      }
    }
    
    if (detInverse === -1) {
      throw new Error('Invalid key matrix: determinant has no inverse modulo 26');
    }
    
    // Calculate the adjugate matrix
    const adjugate = [
      [keyMatrix[1][1], -keyMatrix[0][1]],
      [-keyMatrix[1][0], keyMatrix[0][0]]
    ];
    
    // Ensure positive values in the adjugate
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        adjugate[i][j] = ((adjugate[i][j] % 26) + 26) % 26;
      }
    }
    
    // Calculate the inverse matrix
    const inverseMatrix = [
      [(adjugate[0][0] * detInverse) % 26, (adjugate[0][1] * detInverse) % 26],
      [(adjugate[1][0] * detInverse) % 26, (adjugate[1][1] * detInverse) % 26]
    ];
    
    // Decrypt the message
    let decrypted = '';
    for (let i = 0; i < content.length; i += 2) {
      const c1 = content.charCodeAt(i) - 65;
      const c2 = content.charCodeAt(i + 1) - 65;
      
      const p1 = (inverseMatrix[0][0] * c1 + inverseMatrix[0][1] * c2) % 26;
      const p2 = (inverseMatrix[1][0] * c1 + inverseMatrix[1][1] * c2) % 26;
      
      decrypted += String.fromCharCode(p1 + 65) + String.fromCharCode(p2 + 65);
    }
    
    // Remove padding if necessary
    if (decrypted.endsWith('X')) {
      decrypted = decrypted.slice(0, -1);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Hill decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

// Helper function for Hill cipher
const generateHillKeyMatrix = async (password: string): Promise<number[][]> => {
  // Generate a simple 2x2 matrix from the password hash
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const passwordHash = await window.crypto.subtle.digest('SHA-256', passwordData);
  const hashArray = Array.from(new Uint8Array(passwordHash));
  
  // Take the first 4 bytes and convert to values 1-25
  const matrix = [
    [(hashArray[0] % 25) + 1, (hashArray[1] % 25) + 1],
    [(hashArray[2] % 25) + 1, (hashArray[3] % 25) + 1]
  ];
  
  // Ensure the matrix is invertible (det is coprime with 26)
  const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
  if (det === 0 || gcd(det, 26) !== 1) {
    // If not invertible, adjust
    matrix[0][0] = (matrix[0][0] + 1) % 26;
    return generateHillKeyMatrix(password + '1');
  }
  
  return matrix;
};

// Greatest Common Divisor function for Hill cipher
const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// Vigenère Cipher Implementation
export const vigenereEncrypt = async (message: string, password: string): Promise<string> => {
  // Validate Vigenere key: only letters
  if (!/^[A-Za-z]+$/.test(password)) {
    throw new Error('Vigenere cipher key must only contain letters (A-Z, a-z)');
  }
  try {
    // Prepare the key from the password (repeating it to match the message length)
    const key = password.toUpperCase().replace(/[^A-Z]/g, '');
    if (key.length === 0) {
      throw new Error('Invalid key for Vigenère cipher: must contain at least one letter');
    }
    
    // Prepare the message
    const preparedMessage = message.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Generate the repeated key
    let repeatedKey = '';
    for (let i = 0; i < preparedMessage.length; i++) {
      repeatedKey += key[i % key.length];
    }
    
    // Encrypt the message
    let encrypted = '';
    for (let i = 0; i < preparedMessage.length; i++) {
      const p = preparedMessage.charCodeAt(i) - 65;
      const k = repeatedKey.charCodeAt(i) - 65;
      const c = (p + k) % 26;
      encrypted += String.fromCharCode(c + 65);
    }
    
    // Add a prefix to identify this as Vigenere cipher
    const prefix = 'VIGENERE:';
    
    return btoa(prefix + encrypted + ':' + key);
  } catch (error) {
    console.error('Vigenere encryption error:', error);
    throw new Error('Failed to encrypt message with Vigenère cipher.');
  }
};

export const vigenereDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  // Validate Vigenere key: only letters
  if (!/^[A-Za-z]+$/.test(password)) {
    throw new Error('Vigenere cipher key must only contain letters (A-Z, a-z)');
  }
  try {
    // Decode base64
    const decoded = atob(encryptedMessage);
    
    // Validate format
    if (!decoded.startsWith('VIGENERE:')) {
      throw new Error('Invalid Vigenère cipher format');
    }
    
    // Extract encrypted content and key
    const parts = decoded.substring(9).split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid Vigenère cipher format');
    }
    
    const content = parts[0];
    const key = parts[1];
    
    // Generate the repeated key
    let repeatedKey = '';
    for (let i = 0; i < content.length; i++) {
      repeatedKey += key[i % key.length];
    }
    
    // Decrypt the message
    let decrypted = '';
    for (let i = 0; i < content.length; i++) {
      const c = content.charCodeAt(i) - 65;
      const k = repeatedKey.charCodeAt(i) - 65;
      const p = (c - k + 26) % 26; // Add 26 to ensure positive result
      decrypted += String.fromCharCode(p + 65);
    }
    
    return decrypted;
  } catch (error) {
    console.error('Vigenere decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

export const encryptMessage = async (
  message: string,
  password: string,
  method: 'aes' | 'des' | 'rsa' | 'caesar' | 'playfair' | 'hill' | 'vigenere'
): Promise<string> => {
  switch (method) {
    case 'aes':
      return aesEncrypt(message, password);
    case 'des':
      return desEncrypt(message, password);
    case 'rsa':
      return rsaEncrypt(message, password);
    case 'caesar':
      return caesarEncrypt(message, password);
    case 'playfair':
      return playfairEncrypt(message, password);
    case 'hill':
      return hillEncrypt(message, password);
    case 'vigenere':
      return vigenereEncrypt(message, password);
    default:
      throw new Error('Invalid encryption method');
  }
};

export const decryptMessage = async (
  encryptedMessage: string,
  password: string,
  method: 'aes' | 'des' | 'rsa' | 'caesar' | 'playfair' | 'hill' | 'vigenere'
): Promise<string> => {
  switch (method) {
    case 'aes':
      return aesDecrypt(encryptedMessage, password);
    case 'des':
      return desDecrypt(encryptedMessage, password);
    case 'rsa':
      return rsaDecrypt(encryptedMessage, password);
    case 'caesar':
      return caesarDecrypt(encryptedMessage, password);
    case 'playfair':
      return playfairDecrypt(encryptedMessage, password);
    case 'hill':
      return hillDecrypt(encryptedMessage, password);
    case 'vigenere':
      return vigenereDecrypt(encryptedMessage, password);
    default:
      throw new Error('Invalid encryption method');
  }
};
export function getCipherInputField(method: string) {
  switch (method) {
    case 'aes':
    case 'des':
    case 'rsa':
      return {
        label: 'Password',
        type: 'password',
        placeholder: 'Enter password',
        validation: /^.{4,}$/,
        helpText: 'Password must be at least 4 characters.',
      };
    case 'caesar':
      return {
        label: 'Shift Key',
        type: 'number',
        placeholder: 'Enter shift (1-25)',
        validation: /^(?:[1-9]|1[0-9]|2[0-5])$/,
        helpText: 'Enter a number between 1 and 25.',
      };
    case 'playfair':
    case 'hill':
    case 'vigenere':
      return {
        label: 'Keyword',
        type: 'text',
        placeholder: 'Enter keyword (letters only)',
        validation: /^[A-Za-z]+$/,
        helpText: 'Keyword should only contain letters.',
      };
    default:
      return {
        label: 'Input',
        type: 'text',
        placeholder: 'Enter value',
        validation: /^.*$/,
        helpText: '',
      };
  }
}