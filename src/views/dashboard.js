import { SessionManager } from '../core/session.js';

export const DashboardView = {
    render: () => {
        const session = SessionManager.getSession();
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
        document.getElementById("btnLogout").addEventListener("click", () => SessionManager.endSession());
    }
};
