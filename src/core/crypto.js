(function(window) {
  // Globales Objekt anstatt Export
  window.CryptoEngine = {
    // PBKDF2 aus Username + Passwort → Master-Key (AES-GCM 256 Bit)
    deriveMasterKey: async function(username, password) {
      const enc = new TextEncoder();
      const salt = enc.encode(username.toLowerCase().trim());
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
          iterations: 100000, // Unterstrich entfernt für maximale Kompatibilität
          hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      return masterKey;
    },

    // Master-Key → hex-Repräsentation
    keyToHex: async function(masterKey) {
      const raw = await crypto.subtle.exportKey('raw', masterKey);
      const bytes = new Uint8Array(raw);
      return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    },

    // AES-GCM Verschlüsselung
    encryptData: async function(plaintext, masterKey) {
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
    },

    // AES-GCM Entschlüsselung
    decryptData: async function(ciphertextHex, ivHex, masterKey) {
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
  };
})(window);
