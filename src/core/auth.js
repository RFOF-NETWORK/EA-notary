import { SYSTEM_CONFIG } from '../config.js';
import { CryptoEngine } from './crypto.js';
import { HDWalletEngine } from './hd-wallet.js';
import { SessionManager } from './session.js';

export class AuthService {
    static async processLoginOrRegister(username, password, customMnemonic = null) {
        const masterKey = await CryptoEngine.deriveMasterKey(username, password);
        const seedHex = await CryptoEngine.keyToHex(masterKey);
        
        // 1. Verwende existierende BIP39 Wallet oder generiere sie automatisch deterministisch
        let mnemonic = customMnemonic;
        if (!mnemonic) {
            mnemonic = HDWalletEngine.generateDeterministicMnemonic(seedHex);
        }

        // 2. Leite die sichtbare Adresse ab
        const visibleAddress = HDWalletEngine.deriveAddressFromMnemonic(mnemonic);

        // 3. Der Dreh: Überprüfung auf Admin-Status
        const isAdmin = (visibleAddress === SYSTEM_CONFIG.ADMIN_WALLET_ADDRESS);
        const role = isAdmin ? "admin" : "extensioned_user";

        // 4. Verschlüssele die unsichtbare Phrase ("Cold") für den lokalen Speicher
        const encryptedPhrase = await CryptoEngine.encryptData(mnemonic, masterKey);
        
        // Speicher-Objekt für LocalStorage vorbereiten
        const record = {
            username: username.toLowerCase().trim(),
            visibleAddress: visibleAddress,
            ciphertext: encryptedPhrase.ciphertext,
            iv: encryptedPhrase.iv
        };

        localStorage.setItem(`user_${record.username}`, JSON.stringify(record));
        
        // In sicherer temporärer Session speichern
        SessionManager.startSession(username, role, visibleAddress, mnemonic);

        return { success: true, role: role, address: visibleAddress };
    }
}
