import crypto from 'crypto';

export const generateKeyPair = () => {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();

  const publicKey = ecdh.getPublicKey();
  const x = publicKey.slice(1, 33).toString('base64');
  const y = publicKey.slice(33, 65).toString('base64');

  const publicKeyJwk = {
    kty: 'EC',
    crv: 'P-256',
    x: x,
    y: y,
    ext: true
  };

  return { publicKeyJwk, ecdh };
};

export const computeSharedSecret = (ecdh, clientPublicKeyJwk) => {
  try {
    // Convert JWK components to Buffer
    const x = Buffer.from(clientPublicKeyJwk.x, 'base64');
    const y = Buffer.from(clientPublicKeyJwk.y, 'base64');

    // Reconstruct public key in raw format
    const publicKeyRaw = Buffer.concat([
      Buffer.from([0x04]), // Uncompressed point format
      x,
      y
    ]);

    return ecdh.computeSecret(publicKeyRaw);
  } catch (error) {
    console.error('Error computing shared secret:', error);
    throw error;
  }
};