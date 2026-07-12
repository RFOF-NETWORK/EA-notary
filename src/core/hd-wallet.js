import { wordlist } from '../vendor/scure-bip39/english.js';

export class HDWalletEngine {

    static generateDeterministicMnemonic(seedHex) {
        // 128 Bit Entropie aus seedHex
        const entropy = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            entropy[i] = parseInt(seedHex.substr(i * 2, 2), 16);
        }

        // Checksum erzeugen (SHA-256)
        const checksum = crypto.subtle.digest("SHA-256", entropy);
        
        return checksum.then(buffer => {
            const hash = new Uint8Array(buffer);
            const bits = [...entropy, hash[0]]; // 128 + 8 = 136 Bits

            const words = [];
            let bitIndex = 0;

            for (let i = 0; i < 12; i++) {
                let idx = 0;
                for (let j = 0; j < 11; j++) {
                    const byteIndex = Math.floor((bitIndex + j) / 8);
                    const bitOffset = 7 - ((bitIndex + j) % 8);
                    idx = (idx << 1) | ((bits[byteIndex] >> bitOffset) & 1);
                }
                words.push(wordlist[idx]);
                bitIndex += 11;
            }

            return words.join(" ");
        });
    }

    static deriveAddressFromMnemonic(mnemonic) {
        // Stabiler Hash (SHA-256)
        const encoder = new TextEncoder();
        const data = encoder.encode(mnemonic.trim().toLowerCase());

        return crypto.subtle.digest("SHA-256", data).then(buffer => {
            const hash = new Uint8Array(buffer);
            const hex = [...hash].map(b => b.toString(16).padStart(2, '0')).join('');
            return "bc1q" + hex.slice(0, 8) + "walletaddress" + hex.slice(8);
        });
    }
}
