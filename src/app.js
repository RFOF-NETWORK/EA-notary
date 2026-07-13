(function(window) {
    // 1. Definition der globalen Routen-Konfiguration
    const getRoutes = () => ({
        login: window.LoginView,
        dashboard: window.DashboardView,
        admin: window.AdminPanelView
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
            view.init(navigateTo);
        });
    };

    // 3. Überprüfung, ob alle globalen Abhängigkeiten geladen sind
    const checkDependencies = () => {
        return (
            window.LoginView &&
            window.DashboardView &&
            window.AdminPanelView &&
            window.AuthService &&
            window.SessionManager
        );
    };

    // 4. Start-Logik mit Sicherheits-Warteschleife
    const startApp = () => {
        if (checkDependencies()) {
            console.log("App-Start: Alle Systeme bereit.");
            
            // Session-Check
            const session = window.SessionManager.getSession();
            if (session) {
                currentRoute = (session.role === "admin") ? "admin" : "dashboard";
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
