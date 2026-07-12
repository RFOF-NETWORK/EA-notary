import { AuthService } from '../core/auth.js';

export const LoginView = {
    render: () => `
        <div class="crypto-card">
            <h2>Crypto Gateway Login / Register</h2>
            <p style="font-size:0.85em; color:#888;">Hinweis: Admins loggen sich regulär ein, das System erkennt die feste Adresse automatisch.</p>

            <input type="text" id="username" placeholder="Benutzername / Username" required />
            <input type="password" id="password" placeholder="Sicheres Passwort" required />

            <div class="accordion">
                <button type="button" id="toggleImport">
                    ➕ Bestehende BIP39 Wallet importieren (Optional)
                </button>
                <textarea id="bip39-import" class="hidden" placeholder="Füge hier deine 12 konformen Wörter ein, falls vorhanden..."></textarea>
            </div>

            <button id="btnLogin" class="btn-primary">Einloggen / Registrieren</button>
            <div id="login-error" class="error hidden"></div>
        </div>
    `,

    init: (navigateTo) => {
        const btnLogin = document.getElementById("btnLogin");
        const toggleImport = document.getElementById("toggleImport");

        if (!btnLogin || !toggleImport) return;

        toggleImport.addEventListener("click", () => {
            document.getElementById("bip39-import").classList.toggle("hidden");
        });

        btnLogin.addEventListener("click", async () => {
            const user = document.getElementById("username").value.trim();
            const pass = document.getElementById("password").value.trim();
            const customMnemonic = document.getElementById("bip39-import").value.trim();
            const errDiv = document.getElementById("login-error");

            if (!user || !pass) {
                errDiv.textContent = "Bitte Benutzername und Passwort eingeben.";
                errDiv.classList.remove("hidden");
                return;
            }

            errDiv.classList.add("hidden");

            try {
                const result = await AuthService.processLoginOrRegister(
                    user,
                    pass,
                    customMnemonic || null
                );

                if (!result.success) {
                    errDiv.textContent = result.error || "Unbekannter Fehler.";
                    errDiv.classList.remove("hidden");
                    return;
                }

                navigateTo(result.role === "admin" ? "admin" : "dashboard");

            } catch (e) {
                errDiv.textContent = "Interner Fehler: " + e.message;
                errDiv.classList.remove("hidden");
            }
        });
    }
};
