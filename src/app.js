(function(window) {
    // 1. Definition der globalen Routen-Konfiguration basierend auf realen Views
    const getRoutes = () => ({
        login: window.LoginView,
        dashboard: window.DashboardView,
        import: window.WalletImportView
    });

    let currentRoute = "login";

    // 2. Zentrale Navigations-Logik
    const navigateTo = (route) => {
        const routes = getRoutes();
        const view = routes[route];
        const appContainer = document.getElementById("app");

        if (!appContainer) {
            console.error("FEHLER: #app Container wurde nicht gefunden!");
            return;
        }
        if (!view) {
            console.error("FEHLER: View für '" + route + "' nicht geladen!");
            return;
        }

        currentRoute = route;
        appContainer.innerHTML = view.render();

        // Init NACH dem Rendern
        requestAnimationFrame(() => {
            if (typeof view.init === "function") {
                view.init(navigateTo);
            }
        });
    };

    // 3. Überprüfung, ob alle globalen Mindest-Abhängigkeiten geladen sind
    const checkDependencies = () => {
        // Kern-Module MÜSSEN vorhanden sein, um den Loop zu passieren
        return (
            window.LoginView &&
            window.AuthService &&
            window.SessionManager
        );
    };

    // 4. Start-Logik mit Sicherheits-Warteschleife
    const startApp = () => {
        if (checkDependencies()) {
            console.log("App-Start: Kern-Systeme bereit.");
            
            // Session-Check für automatische Weiterleitung
            const session = window.SessionManager.getSession();
            if (session) {
                // Falls eine Session existiert, leite zum Dashboard weiter
                currentRoute = "dashboard";
            }
            
            navigateTo(currentRoute);
        } else {
            console.warn("App-Start: Warte auf Core-Komponenten...");
            setTimeout(startApp, 100);
        }
    };

    // 5. Initialisierung
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM geladen. Initialisiere EA-notary...");
        startApp();
    });
})(window);
