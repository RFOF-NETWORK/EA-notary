/**
 * 🔐 Krypto-Engine: Modulare Schnittstelle für AES-GCM Operationen
 */

// PBKDF2 aus Username + Passwort → Master-Key (AES-GCM 256 Bit)
export async function deriveMasterKey(username, password) {
  const enc = new TextEncoder();
  const salt = enc.encode(username.toLowerCase().trim());
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Master-Key → hex-Repräsentation
export async function keyToHex(masterKey) {
  const raw = await crypto.subtle.exportKey('raw', masterKey);
  const bytes = new Uint8Array(raw);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// AES-GCM Verschlüsselung
export async function encryptData(plaintext, masterKey) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    masterKey,
    enc.encode(plaintext)
  );

  const ciphertextBytes = new Uint8Array(ciphertextBuffer);
  const ciphertextHex = Array.from(ciphertextBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const ivHex = Array.from(iv)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { ciphertext: ciphertextHex, iv: ivHex };
}

// AES-GCM Entschlüsselung
export async function decryptData(ciphertextHex, ivHex, masterKey) {
  const hexToBytes = hex =>
    new Uint8Array(
      hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );

  const ciphertext = hexToBytes(ciphertextHex);
  const iv = hexToBytes(ivHex);

  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    masterKey,
    ciphertext
  );

  return new TextDecoder().decode(plaintextBuffer);
}
