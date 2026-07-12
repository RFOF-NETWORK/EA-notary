import { SYSTEM_CONFIG } from 'src/config.js';
import { CryptoEngine } from 'src/core/crypto.js';
import { HDWalletEngine } from 'src/core/hd-wallet.js';
import { SessionManager } from 'src/corw/session.js';

export class AuthService {
    static async processLoginOrRegister(username, password, customMnemonic = null) {
        try {
            // 1. Master-Key ableiten (PBKDF2)
            const masterKey = await CryptoEngine.deriveMasterKey(username, password);

            // 2. Mnemonic validieren oder deterministisch erzeugen
            let mnemonic = customMnemonic?.trim();
            if (mnemonic) {
                if (!HDWalletEngine.validateMnemonic(mnemonic)) {
                    return { success: false, error: "Ungültige BIP39-Wortliste." };
                }
            } else {
                mnemonic = await HDWalletEngine.generateDeterministicMnemonic(masterKey);
            }

            // 3. Echte Ethereum-Adresse ableiten
            const visibleAddress = await HDWalletEngine.deriveAddressFromMnemonic(mnemonic);

            // 4. Admin-Erkennung (Adresse ODER Benutzername)
            const normalizedUser = username.toLowerCase().trim();
            const isAdminByAddress = (visibleAddress.toLowerCase() === SYSTEM_CONFIG.ADMIN_WALLET_ADDRESS.toLowerCase());
            const isAdminByUsername = (normalizedUser === SYSTEM_CONFIG.ADMIN_USERNAME.toLowerCase());
            const isAdmin = isAdminByAddress || isAdminByUsername;

            const role = isAdmin ? "admin" : "user";

            // 5. Cold-Phrase verschlüsseln (AES-GCM)
            const encryptedPhrase = await CryptoEngine.encryptData(mnemonic, masterKey);

            const record = {
                username: normalizedUser,
                visibleAddress,
                ciphertext: encryptedPhrase.ciphertext,
                iv: encryptedPhrase.iv
            };

            // 6. LocalStorage speichern
            try {
                localStorage.setItem(`user_${record.username}`, JSON.stringify(record));
            } catch (e) {
                return { success: false, error: "LocalStorage blockiert." };
            }

            // 7. Session starten (Cold-Phrase nur im RAM)
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
