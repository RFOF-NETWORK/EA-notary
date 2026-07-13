/**
 * 🛡️ AdminPanelView: Visualisierung des zentralen Kontrollzentrums
 */
import { SessionManager } from '../core/session.js';

export const AdminPanelView = {
    render: () => {
        const session = SessionManager.getSession();

        // Schutz: Rollenbasierte Validierung
        if (!session || session.role !== "admin") {
            return `
                <div class="crypto-card admin-card">
                    <h2>Keine Admin-Sitzung aktiv</h2>
                    <p>Bitte erneut anmelden.</p>
                </div>
            `;
        }

        return `
            <div class="crypto-card admin-card">
                <span class="badge admin-badge">🛡️ SYSTEM ADMINISTRATOR</span>
                <h2>Zentrales Kontrollzentrum</h2>
                <p>Das System hat dich automatisch über deine fest codierte Wallet-Adresse authentifiziert.</p>
                
                <div class="wallet-box">
                    <label>ADMIN ADRESSE (Fest codiert in config.js):</label>
                    <div class="address-string">${session.address}</div>
                </div>

                <div class="admin-actions">
                    <h3>Globale Repository-Steuerung</h3>
                    <p>Alle angeschlossenen Extensioned User Wallets sind über kryptografische Hashes gesichert.</p>
                </div>

                <button id="btnLogout" class="btn-secondary">Admin-Sitzung beenden</button>
            </div>
        `;
    },

    init: () => {
        const btn = document.getElementById("btnLogout");

        // Event-Binding: Sitzungsbeendigung
        if (btn) {
            btn.addEventListener("click", () => {
                SessionManager.endSession();
                // Hier könnte ein Redirect zur Login-View folgen
            });
        }
    }
};
