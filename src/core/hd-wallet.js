// src/core/hd-wallet.js

// Annahme: Du hast diese Libraries als ES-Module unter vendor eingebunden.
// Pfade ggf. an deine Struktur anpassen

import { wordlist, generateMnemonic, validateMnemonic as bip39Validate, mnemonicToSeedSync } from '../vendor/scure-bip39/index.js';
import { HDKey } from '../vendor/scure-bip32/index.js';
import { getPublicKey } from '../vendor/noble-secp256k1/index.js';
import { keccak_256 } from '../vendor/noble-hashes/sha3.js';
import { SYSTEM_CONFIG } from '../config.js';

export class HDWalletEngine {

    // 🔐 Deterministische Mnemonic aus Master-Key (PBKDF2-Output)
    // masterKey: ArrayBuffer oder Uint8Array
    static async generateDeterministicMnemonic(masterKey, words = 12) {
        // 1. Entropie aus masterKey (SHA-256)
        const keyBytes = masterKey instanceof Uint8Array ? masterKey : new Uint8Array(masterKey);
        const entropyBuffer = await crypto.subtle.digest("SHA-256", keyBytes);
        const entropy = new Uint8Array(entropyBuffer);

        // 2. Entropie auf passende Länge für 12/24 Wörter kürzen
        // 12 Wörter → 128 Bit Entropie
        // 24 Wörter → 256 Bit Entropie
        let entropyBits;
        if (words === 24) {
            entropyBits = entropy.slice(0, 32); // 256 Bit
        } else {
            entropyBits = entropy.slice(0, 16); // 128 Bit
        }

        // 3. Mnemonic aus Entropie generieren (BIP39-konform)
        const mnemonic = generateMnemonic(wordlist, entropyBits);
        return mnemonic;
    }

    // ✅ BIP39-Validierung (12 oder 24 Wörter)
    static validateMnemonic(mnemonic) {
        const phrase = mnemonic.trim().toLowerCase();
        const parts = phrase.split(/\s+/g);

        if (parts.length !== 12 && parts.length !== 24) {
            return false;
        }

        return bip39Validate(phrase, wordlist);
    }

    // 🧠 Seed aus Mnemonic (BIP39)
    static mnemonicToSeed(mnemonic) {
        const phrase = mnemonic.trim().toLowerCase();
        const seed = mnemonicToSeedSync(phrase); // Uint8Array
        return seed;
    }

    // 🧩 Echte Ethereum-Adresse aus Mnemonic (BIP32 + secp256k1 + Keccak-256)
    static async deriveAddressFromMnemonic(mnemonic) {
        const seed = this.mnemonicToSeed(mnemonic);

        // 1. BIP32 Root aus Seed
        const root = HDKey.fromMasterSeed(seed);

        // 2. Ableitungspfad aus SYSTEM_CONFIG (m/44'/60'/0'/0/0)
        const child = root.derive(SYSTEM_CONFIG.DERIVATION_PATH);

        if (!child.privateKey) {
            throw new Error("Kein Private Key aus BIP32-Ableitung verfügbar.");
        }

        const privateKey = child.privateKey; // Uint8Array

        // 3. secp256k1 Public Key (uncompressed)
        const publicKey = getPublicKey(privateKey, false); // 65 Bytes, 0x04 + X + Y

        // 4. Keccak-256 über Public Key (ohne Prefix 0x04)
        const pubKeyNoPrefix = publicKey.slice(1); // 64 Bytes
        const hash = keccak_256(pubKeyNoPrefix);   // Uint8Array (32 Bytes)

        // 5. Letzte 20 Bytes → Ethereum-Adresse
        const addressBytes = hash.slice(-20);
        const hex = Array.from(addressBytes).map(b => b.toString(16).padStart(2, '0')).join('');

        return "0x" + hex;
    }

    // 🧩 Optional: zweite „silent“ Wallet aus gleichem Seed (z.B. System-Wallet)
    static async deriveSecondaryAddressFromMnemonic(mnemonic, customPath) {
        const seed = this.mnemonicToSeed(mnemonic);
        const root = HDKey.fromMasterSeed(seed);
        const path = customPath || "m/44'/60'/0'/0/1"; // z.B. zweites Konto

        const child = root.derive(path);
        if (!child.privateKey) {
            throw new Error("Kein Private Key aus BIP32-Ableitung verfügbar (Secondary).");
        }

        const publicKey = getPublicKey(child.privateKey, false);
        const pubKeyNoPrefix = publicKey.slice(1);
        const hash = keccak_256(pubKeyNoPrefix);
        const addressBytes = hash.slice(-20);
        const hex = Array.from(addressBytes).map(b => b.toString(16).padStart(2, '0')).join('');

        return "0x" + hex;
    }
}
