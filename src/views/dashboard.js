import { SessionManager } from 'src/core/session.js';

export const DashboardView = {
    render: () => {
        const session = SessionManager.getSession();

        if (!session || session.role !== "user") {
            return `
                <div class="crypto-card">
                    <h2>Keine gültige Benutzersitzung aktiv</h2>
                    <p>Bitte erneut anmelden.</p>
                </div>
            `;
        }

        return `
            <div class="crypto-card">
                <span class="badge user-badge">Extensioned User</span>
                <h2>Willkommen, ${session.username}</h2>
                
                <div class="wallet-box">
                    <label>🔥 DEINE SICHTBARE HOT-WALLET ADRESSE:</label>
                    <div class="address-string">${session.address}</div>
                </div>

                <div class="wallet-box cold-box">
                    <label>❄️ COLD WALLET STATUS (Unsichtbar im System):</label>
                    <div class="status-secured">🔒 Sicher verschlüsselt im LocalStorage verankert. Niemand hat Zugriff.</div>
                </div>

                <button id="btnLogout" class="btn-secondary">Sicher Ausloggen (Logout)</button>
            </div>
        `;
    },

    init: () => {
        const btn = document.getElementById("btnLogout");
        if (btn) {
            btn.addEventListener("click", () => SessionManager.endSession());
        }
    }
};
