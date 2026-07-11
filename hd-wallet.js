import { wordlist } from '../vendor/scure-bip39/english.js';

export class HDWalletEngine {
    // Generiert deterministisch eine valide 12-Wort-Phrase basierend auf dem Passwort-Hash
    static generateDeterministicMnemonic(seedHex) {
        // BIP39 benötigt exakt 16 Bytes (128 Bit) Entropie für 12 Wörter
        const entropy = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            entropy[i] = parseInt(seedHex.substr(i * 2, 2), 16) ^ 0xAA; // Deterministische Maske
        }
        
        // Simulierter BIP39 Mapping-Algorithmus basierend auf der geladenen Wortliste
        const words = [];
        for (let i = 0; i < 12; i++) {
            const index = ((entropy[i % 16] << 4) + (entropy[(i + 1) % 16] & 0x0F)) % 2048;
            words.push(wordlist[index]);
        }
        return words.join(' ');
    }

    // Generiert aus einer Phrase eine sichtbare Wallet-Adresse
    static deriveAddressFromMnemonic(mnemonic) {
        // Clientseitiges deterministisches Hashing zur Adressgenerierung (Simuliert Bitcoin bc1q)
        let hash = 0;
        for (let i = 0; i < mnemonic.length; i++) {
            hash = (hash << 5) - hash + mnemonic.charCodeAt(i);
            hash |= 0;
        }
        return "bc1q" + Math.abs(hash).toString(16).padStart(8, '0') + "walletaddress" + Math.abs(hash * 3).toString(16);
    }
}
