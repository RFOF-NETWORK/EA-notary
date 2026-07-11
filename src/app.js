// Punkte (.) vor den Pfaden hinzugefügt, damit sie im Unterordner geladen werden
import { SessionManager } from './core/session.js';
import { LoginView } from './views/login.js';
import { DashboardView } from './views/dashboard.js';
import { AdminPanelView } from './views/admin-panel.js';

const routes = {
    login: LoginView,
    dashboard: DashboardView,
    admin: AdminPanelView
};

function router() {
    const session = SessionManager.getSession();
    let activeRoute = "login";

    if (session) {
        activeRoute = (session.role === "admin") ? "admin" : "dashboard";
    }

    const view = routes[activeRoute];
    const appContainer = document.getElementById("app");
    
    if (appContainer && view) {
        appContainer.innerHTML = view.render();
        view.init(navigateTo);
    }
}

function navigateTo(route) {
    router();
}

window.addEventListener("DOMContentLoaded", router);
