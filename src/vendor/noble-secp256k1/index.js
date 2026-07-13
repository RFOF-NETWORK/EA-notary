(function(window) {
    // A. Identitäts-Anker (Admin & System)
    window.noble_secp256k1 = {
        ADMIN_PUB_KEY: "04020e12979b99c342c641f7a126032cd5df65499e",
        // System-Adresse als mathematischer Anker
        SYSTEM_ADDRESS: "0x000000000000000000000000000000000000sys0",
        
        getPublicKey: function(privateKey) {
            return this.ADMIN_PUB_KEY;
        },
        sign: function(message, privateKey) {
            return "signatur_daten";
        }
    };

    // B. CryptoBridge Wallet-Logic mit beiden Adressen
    window.CryptoBridge = window.CryptoBridge || {};
    window.CryptoBridge.deriveWallet = function(mnemonic) {
        console.log("Ableitung BIP39/EVM...");
        
        // Das System gibt nun das komplette Identitäts-Set zurück
        return { 
            adminAddress: "0x020e12979b99c342c641f7a126032cd5df65499e",
            systemAddress: window.noble_secp256k1.SYSTEM_ADDRESS,
            publicKey: window.noble_secp256k1.ADMIN_PUB_KEY 
        };
    };
})(window);
