/**
 * 🛡️ AuthService: Modulare Schnittstelle für Login- und Registrierungsprozesse
 */
import { SYSTEM_CONFIG } from '../config.js';
import * as Crypto from './crypto.js';
import * as HDWallet from './hd-wallet.js';
import { SessionManager } from './session.js';

export const AuthService = {
    processLoginOrRegister: async function(username, password, customMnemonic = null) {
        try {
            // 1. Master-Key ableiten
            const masterKey = await Crypto.deriveMasterKey(username, password);

            // 2. Mnemonic validieren oder erzeugen
            let mnemonic = customMnemonic ? customMnemonic.trim() : null;
            if (mnemonic) {
                if (!HDWallet.validateMnemonic(mnemonic)) {
                    return { success: false, error: "Ungültige BIP39-Wortliste." };
                }
            } else {
                mnemonic = await HDWallet.generateDeterministicMnemonic(masterKey);
            }

            // 3. Echte Ethereum-Adresse ableiten
            const visibleAddress = await HDWallet.deriveAddressFromMnemonic(mnemonic);

            // 4. Admin-Erkennung
            const normalizedUser = username.toLowerCase().trim();
            const isAdminByAddress = (visibleAddress.toLowerCase() === SYSTEM_CONFIG.ADMIN_WALLET_ADDRESS.toLowerCase());
            const isAdminByUsername = (normalizedUser === SYSTEM_CONFIG.ADMIN_USERNAME.toLowerCase());
            const isAdmin = isAdminByAddress || isAdminByUsername;
            const role = isAdmin ? "admin" : "user";

            // 5. Cold-Phrase verschlüsseln
            const encryptedPhrase = await Crypto.encryptData(mnemonic, masterKey);

            const record = {
                username: normalizedUser,
                visibleAddress: visibleAddress,
                ciphertext: encryptedPhrase.ciphertext,
                iv: encryptedPhrase.iv
            };

            // 6. LocalStorage speichern
            try {
                localStorage.setItem('user_' + record.username, JSON.stringify(record));
            } catch (e) {
                return { success: false, error: "LocalStorage blockiert." };
            }

            // 7. Session starten
            try {
                SessionManager.startSession(username, role, visibleAddress, mnemonic);
            } catch (e) {
                return { success: false, error: "Session konnte nicht gestartet werden." };
            }

            return { success: true, role: role, address: visibleAddress };

        } catch (e) {
            return { success: false, error: "Interner Fehler: " + e.message };
        }
    }
};
