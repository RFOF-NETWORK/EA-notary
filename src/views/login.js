import { AuthService } from '../core/auth.js';

export const LoginView = {
    render: () => `
        <div class="crypto-card">
            <h2>Crypto Gateway Login / Register</h2>
            <p style="font-size:0.85em; color:#888;">Hinweis: Admins loggen sich regulär ein, das System erkennt die feste Adresse automatisch.</p>
            <input type="text" id="username" placeholder="Benutzername / Username" required />
            <input type="password" id="password" placeholder="Sicheres Passwort" required />
            
            <div class="accordion">
                <button type="button" onclick="document.getElementById('bip39-import').classList.toggle('hidden')">
                    ➕ Bestehende BIP39 Wallet importieren (Optional)
                </button>
                <textarea id="bip39-import" class="hidden" placeholder="Füge hier deine 12 konformen Wörter ein, falls vorhanden..."></textarea>
            </div>

            <button id="btnLogin" class="btn-primary">Einloggen / Registrieren</button>
            <div id="login-error" class="error hidden"></div>
        </div>
    `,
    init: (navigateTo) => {
        document.getElementById("btnLogin").addEventListener("click", async () => {
            const user = document.getElementById("username").value;
            const pass = document.getElementById("password").value;
            const customMnemonic = document.getElementById("bip39-import").value.trim();
            const errDiv = document.getElementById("login-error");

            if (!user || !pass) {
                errDiv.textContent = "Bitte Benutzername und Passwort eingeben.";
                errDiv.classList.remove("hidden");
                return;
            }

            errDiv.classList.add("hidden");
            const result = await AuthService.processLoginOrRegister(user, pass, customMnemonic || null);
            
            if (result.success) {
                navigateTo(result.role === "admin" ? "admin" : "dashboard");
            }
        });
    }
};
