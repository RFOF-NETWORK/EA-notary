export class SessionManager {
    static startSession(username, role, address, cleartextMnemonic) {
        sessionStorage.setItem("session_active", "true");
        sessionStorage.setItem("session_user", username);
        sessionStorage.setItem("session_role", role);
        sessionStorage.setItem("session_address", address);
        // Die Klartext-Phrase bleibt NUR im RAM für die aktive Sitzung
        window.CURRENT_COLD_PHRASE = cleartextMnemonic; 
    }

    static getSession() {
        if (sessionStorage.getItem("session_active") === "true") {
            return {
                username: sessionStorage.getItem("session_user"),
                role: sessionStorage.getItem("session_role"),
                address: sessionStorage.getItem("session_address")
            };
        }
        return null;
    }

    static endSession() {
        sessionStorage.clear();
        window.CURRENT_COLD_PHRASE = null;
        window.location.reload();
    }
}
