// src/core/crypto.js

export class CryptoEngine {
  // PBKDF2 aus Username + Passwort → Master-Key (AES-GCM 256 Bit)
  static async deriveMasterKey(username, password) {
    const enc = new TextEncoder();
    const salt = enc.encode(username.toLowerCase().trim()); // deterministischer Salt aus Username
    const baseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const masterKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100_000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return masterKey;
  }

  // Master-Key → hex-Repräsentation (für deterministische Mnemonic-Ableitung)
  static async keyToHex(masterKey) {
    const raw = await crypto.subtle.exportKey('raw', masterKey);
    const bytes = new Uint8Array(raw);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // AES-GCM Verschlüsselung (Ciphertext + IV)
  static async encryptData(plaintext, masterKey) {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertextBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
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

    return {
      ciphertext: ciphertextHex,
      iv: ivHex
    };
  }

  // AES-GCM Entschlüsselung (optional, falls du Cold-Phrase wiederherstellen willst)
  static async decryptData(ciphertextHex, ivHex, masterKey) {
    const hexToBytes = hex =>
      new Uint8Array(
        hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      );

    const ciphertext = hexToBytes(ciphertextHex);
    const iv = hexToBytes(ivHex);

    const plaintextBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      masterKey,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(plaintextBuffer);
  }
}
