// Key generation and management
export const generateAESKey = async () => {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  } catch (error) {
    console.error('Error generating AES key:', error);
    throw error;
  }
};

// Message encryption
export const encryptMessage = async (message, key) => {
  try {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedMessage = new TextEncoder().encode(message);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encodedMessage
    );

    // Convert ArrayBuffer to Base64 for safe transmission
    const encryptedArray = Array.from(new Uint8Array(encryptedData));
    const ivArray = Array.from(iv);

    return {
      iv: ivArray,
      encryptedMessage: encryptedArray
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

// Message decryption
export const decryptMessage = async (encryptedData, key) => {
  try {
    const { encryptedMessage, iv } = encryptedData;
    
    const encryptedUint8 = new Uint8Array(encryptedMessage);
    const ivUint8 = new Uint8Array(iv);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivUint8
      },
      key,
      encryptedUint8
    );

    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

// Export key for transmission
export const exportKey = async (key) => {
  try {
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(exportedKey));
  } catch (error) {
    console.error('Key export error:', error);
    throw error;
  }
};

// Import key received from server
export const importKey = async (keyData) => {
  try {
    const keyArray = new Uint8Array(keyData);
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyArray,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    return key;
  } catch (error) {
    console.error('Key import error:', error);
    throw error;
  }
};