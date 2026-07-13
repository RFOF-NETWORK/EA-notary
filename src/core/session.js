/**
 * 👤 SessionManager: Verwaltet den Zustand und nutzt die Krypto-Engine
 */
import { encryptData, decryptData } from './crypto.js'; 

// Wir nutzen keine globale window-Variable mehr, sondern exportieren die Klasse/Funktionen
export const SessionManager = {
    startSession: function(username, role, address, cleartextMnemonic) {
        try {
            sessionStorage.setItem('session_active', 'true');
            sessionStorage.setItem('session_user', username);
            sessionStorage.setItem('session_role', role);
            sessionStorage.setItem('session_address', address);
            
            // Cold-Phrase sicher im RAM (nun als lokale Modul-Variable)
            this.currentColdPhrase = cleartextMnemonic;
            return true;
        } catch (e) {
            console.error("SessionStorage blockiert:", e);
            return false;
        }
    },

    getSession: function() {
        if (sessionStorage.getItem('session_active') === 'true') {
            return {
                username: sessionStorage.getItem('session_user'),
                role: sessionStorage.getItem('session_role'),
                address: sessionStorage.getItem('session_address')
            };
        }
        return null;
    },

    endSession: function() {
        sessionStorage.clear();
        this.currentColdPhrase = null;
        window.location.replace(window.location.origin + window.location.pathname);
    }
};
