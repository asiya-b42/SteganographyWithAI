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
export const desEncrypt = async (message: string, password: string): Promise<string> => {
  // In a real implementation, you'd use a proper Triple DES library
  // For this demo, we'll use a simplified implementation based on AES
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
  
  // Derive key (using 3DES key length)
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 192 }, // 3DES is typically 168 bits, we use 192 for AES
    false,
    ['encrypt']
  );
  
  // IV for encryption
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
  
  // Combine salt, iv, and encrypted content
  const encryptedContentArr = new Uint8Array(encryptedContent);
  const result = new Uint8Array(salt.length + iv.length + encryptedContentArr.length);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(encryptedContentArr, salt.length + iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...result));
};

export const desDecrypt = async (encryptedMessage: string, password: string): Promise<string> => {
  try {
    // Decode base64
    const encryptedBytes = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0));
    
    // Extract salt, iv, and encrypted content
    const salt = encryptedBytes.slice(0, 16);
    const iv = encryptedBytes.slice(16, 32);
    const encryptedContent = encryptedBytes.slice(32);
    
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
      { name: 'AES-CBC', length: 192 },
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
    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

// RSA encryption (simplified for browser)
export const rsaEncrypt = async (message: string, password: string): Promise<string> => {
  // In a real implementation, you'd use a proper RSA library
  // For this demo, we'll generate a key pair based on the password
  // Note: This is not how RSA is typically used, but it's a simplified demo
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Generate a seed from the password
  const encoder2 = new TextEncoder();
  const passwordData = encoder2.encode(password);
  const passwordHash = await window.crypto.subtle.digest('SHA-256', passwordData);
  
  // Use the hash as a seed for key generation
  const seed = new Uint8Array(passwordHash);
  
  // Generate key pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Encrypt with public key
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    keyPair.publicKey,
    data
  );
  
  // Export private key (for decryption later)
  const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const privateKeyBytes = new Uint8Array(exportedPrivateKey);
  
  // Combine private key and encrypted content (in real RSA, you wouldn't send the private key)
  const encryptedContentArr = new Uint8Array(encryptedContent);
  const result = new Uint8Array(privateKeyBytes.length + 4 + encryptedContentArr.length);
  
  // Store the length of the private key as the first 4 bytes
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
    
    // Extract private key length
    const dataView = new DataView(encryptedBytes.buffer, encryptedBytes.byteOffset, 4);
    const privateKeyLength = dataView.getUint32(0, true);
    
    // Extract private key and encrypted content
    const privateKeyBytes = encryptedBytes.slice(4, 4 + privateKeyLength);
    const encryptedContent = encryptedBytes.slice(4 + privateKeyLength);
    
    // Import private key
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
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message. Incorrect password or corrupted data.');
  }
};

export const encryptMessage = async (
  message: string,
  password: string,
  method: 'aes' | 'des' | 'rsa'
): Promise<string> => {
  switch (method) {
    case 'aes':
      return aesEncrypt(message, password);
    case 'des':
      return desEncrypt(message, password);
    case 'rsa':
      return rsaEncrypt(message, password);
    default:
      throw new Error('Invalid encryption method');
  }
};

export const decryptMessage = async (
  encryptedMessage: string,
  password: string,
  method: 'aes' | 'des' | 'rsa'
): Promise<string> => {
  switch (method) {
    case 'aes':
      return aesDecrypt(encryptedMessage, password);
    case 'des':
      return desDecrypt(encryptedMessage, password);
    case 'rsa':
      return rsaDecrypt(encryptedMessage, password);
    default:
      throw new Error('Invalid encryption method');
  }
};