import { SYSTEM_CONFIG } from '../config.js';
import { CryptoEngine } from './crypto.js';
import { HDWalletEngine } from './hd-wallet.js';
import { SessionManager } from './session.js';

export class AuthService {
    static async processLoginOrRegister(username, password, customMnemonic = null) {
        try {
            // 1. Master-Key ableiten
            const masterKey = await CryptoEngine.deriveMasterKey(username, password);
            const seedHex = await CryptoEngine.keyToHex(masterKey);

            // 2. Mnemonic validieren oder generieren
            let mnemonic = customMnemonic?.trim();
            if (mnemonic) {
                if (!HDWalletEngine.validateMnemonic(mnemonic)) {
                    return { success: false, error: "Ungültige BIP39-Wortliste." };
                }
            } else {
                mnemonic = HDWalletEngine.generateDeterministicMnemonic(seedHex);
            }

            // 3. Adresse ableiten
            const visibleAddress = HDWalletEngine.deriveAddressFromMnemonic(mnemonic);

            // 4. Admin-Erkennung
            const isAdmin = (visibleAddress === SYSTEM_CONFIG.ADMIN_WALLET_ADDRESS);
            const role = isAdmin ? "admin" : "user";

            // 5. Cold-Phrase verschlüsseln
            const encryptedPhrase = await CryptoEngine.encryptData(mnemonic, masterKey);

            const record = {
                username: username.toLowerCase().trim(),
                visibleAddress,
                ciphertext: encryptedPhrase.ciphertext,
                iv: encryptedPhrase.iv
            };

            // 6. LocalStorage speichern (mit Fehlerfang)
            try {
                localStorage.setItem(`user_${record.username}`, JSON.stringify(record));
            } catch (e) {
                return { success: false, error: "LocalStorage blockiert." };
            }

            // 7. Session starten
            try {
                SessionManager.startSession(username, role, visibleAddress, mnemonic);
            } catch (e) {
                return { success: false, error: "Session konnte nicht gestartet werden." };
            }

            return { success: true, role, address: visibleAddress };

        } catch (e) {
            return { success: false, error: "Interner Fehler: " + e.message };
        }
    }
}
