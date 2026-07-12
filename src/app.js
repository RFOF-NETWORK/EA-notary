import { SessionManager } from './core/session.js';
import { LoginView } from './views/login.js';
import { DashboardView } from './views/dashboard.js';
import { AdminPanelView } from './views/admin-panel.js';

const routes = {
    login: LoginView,
    dashboard: DashboardView,
    admin: AdminPanelView
};

let currentRoute = "login";

function router() {
    const session = SessionManager.getSession();

    // Automatische Rollen-Erkennung
    if (session) {
        currentRoute = (session.role === "admin") ? "admin" : "dashboard";
    }

    const view = routes[currentRoute];
    const appContainer = document.getElementById("app");

    if (!appContainer || !view) {
        console.error("Router-Fehler: Container oder View fehlt.");
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

// GitHub Pages: Router erst starten, wenn DOM sicher geladen ist
window.addEventListener("DOMContentLoaded", () => {
    router();
});
