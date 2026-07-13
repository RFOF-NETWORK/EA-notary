// Zentrale Imports
import { LoginView } from './views/login.js';
import { DashboardView } from './views/dashboard.js';
import { SessionManager } from './core/session.js';

const appContainer = document.getElementById("app");

const routes = {
    login: LoginView,
    dashboard: DashboardView
};

export const navigateTo = (route) => {
    const view = routes[route];
    if (view) {
        appContainer.innerHTML = view.render();
        if (view.init) view.init(navigateTo);
    }
};

// Start
document.addEventListener("DOMContentLoaded", () => {
    console.log("App gestartet.");
    const session = SessionManager.getSession();
    navigateTo(session ? 'dashboard' : 'login');
});
