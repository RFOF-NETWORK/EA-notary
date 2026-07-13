(function(window) {
    // Zugriff auf globale Vendor-Objekte
    const wordlist = window.BIP39_WORDLIST;
    const HDKey = window.HDKey;
    const getPublicKey = window.noble_secp256k1.getPublicKey;
    const keccak_256 = window.keccak_256;
    const SYSTEM_CONFIG = window.SYSTEM_CONFIG;

    window.HDWalletEngine = {
        
        // 🔐 Deterministische Mnemonic aus Master-Key
        generateDeterministicMnemonic: async function(masterKey, words = 12) {
            const keyBytes = masterKey instanceof Uint8Array ? masterKey : new Uint8Array(masterKey);
            const entropyBuffer = await crypto.subtle.digest("SHA-256", keyBytes);
            const entropy = new Uint8Array(entropyBuffer);

            let entropyBits = (words === 24) ? entropy.slice(0, 32) : entropy.slice(0, 16);
            
            // Nutze window.generateMnemonic (aus deinem bip39-vendor)
            return window.generateMnemonic(wordlist, entropyBits);
        },

        // ✅ BIP39-Validierung
        validateMnemonic: function(mnemonic) {
            const phrase = mnemonic.trim().toLowerCase();
            const parts = phrase.split(/\s+/g);
            if (parts.length !== 12 && parts.length !== 24) return false;
            
            // Nutze window.bip39Validate (aus deinem bip39-vendor)
            return window.bip39Validate(phrase, wordlist);
        },

        // 🧠 Seed aus Mnemonic
        mnemonicToSeed: function(mnemonic) {
            return window.mnemonicToSeedSync(mnemonic.trim().toLowerCase());
        },

        // 🧩 Echte Ethereum-Adresse aus Mnemonic
        deriveAddressFromMnemonic: async function(mnemonic) {
            const seed = this.mnemonicToSeed(mnemonic);
            const root = HDKey.fromMasterSeed(seed);
            const child = root.derive(SYSTEM_CONFIG.DERIVATION_PATH);

            if (!child.privateKey) throw new Error("Kein Private Key verfügbar.");

            // secp256k1 Public Key (uncompressed)
            const publicKey = getPublicKey(child.privateKey, false); 
            const pubKeyNoPrefix = publicKey.slice(1);
            
            // Keccak-256 Hashing
            const hash = keccak_256(pubKeyNoPrefix); 
            const addressBytes = hash.slice(-20);
            const hex = Array.from(addressBytes).map(b => b.toString(16).padStart(2, '0')).join('');

            return "0x" + hex;
        }
    };
})(window);
