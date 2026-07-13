// KEINE IMPORTS MEHR! Alles ist jetzt global via window verfügbar.

const routes = {
    login: window.LoginView, // Diese Views müssen jetzt auch global im window liegen
    dashboard: window.DashboardView,
    admin: window.AdminPanelView
};

let currentRoute = "login";

function router() {
    // Greife direkt auf den SessionManager zu, der jetzt global existiert
    const session = window.SessionManager ? window.SessionManager.getSession() : null;

    // Automatische Rollen-Erkennung
    if (session) {
        currentRoute = (session.role === "admin") ? "admin" : "dashboard";
    }

    const view = routes[currentRoute];
    const appContainer = document.getElementById("app");

    if (!appContainer) {
        console.error("FEHLER: #app Container wurde nicht gefunden!");
        return;
    }
    if (!view) {
        document.body.innerHTML = "FEHLER: View für '" + currentRoute + "' nicht geladen!";
        return;
    }

    // Rendern
    appContainer.innerHTML = view.render();

    // Init NACH dem Rendern
    requestAnimationFrame(() => {
        view.init(navigateTo);
    });
}

function navigateTo(route) {
    currentRoute = route;
    router();
}

window.addEventListener("DOMContentLoaded", () => {
    // Hier kannst du jetzt direkt deine neuen globalen Systeme testen
    console.log("System Initialisiert. CryptoBridge bereit:", !!window.CryptoBridge);
    router();
});
