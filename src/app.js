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

    if (session) {
        currentRoute = (session.role === "admin") ? "admin" : "dashboard";
    }

    const view = routes[currentRoute];
    const appContainer = document.getElementById("app");

    if (!appContainer || !view) return;

    // Render
    appContainer.innerHTML = view.render();

    // Init AFTER DOM exists
    setTimeout(() => {
        view.init(navigateTo);
    }, 0);
}

function navigateTo(route) {
    currentRoute = route;
    router();
}

window.addEventListener("DOMContentLoaded", () => {
    router();
});
