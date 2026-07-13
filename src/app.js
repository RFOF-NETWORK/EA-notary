/**
 * 🚀 App.js: Zentrale Steuerung und Routing-Logik
 */
import { LoginView } from './views/login.js';
import { DashboardView } from './views/dashboard.js';
import { AdminPanelView } from './views/admin-panel.js';
import { SessionManager } from './core/session.js';

const appContainer = document.getElementById("app");

// Routen-Mapping: Verknüpfung der Views
const routes = {
    login: LoginView,
    dashboard: DashboardView,
    admin: AdminPanelView
};

/**
 * Zentrale Navigationsfunktion
 * Lädt die View, rendert das DOM und führt die View-spezifische Initialisierung aus.
 */
export const navigateTo = (route) => {
    const view = routes[route] || routes.login;
    
    // UI-Aktualisierung
    appContainer.innerHTML = view.render();
    
    // Initialisierung der Logik (mit Übergabe der Navigation für interne Logik)
    if (view.init) {
        view.init(navigateTo);
    }
};

// Initialisierung bei App-Start
document.addEventListener("DOMContentLoaded", () => {
    console.log("PRAI-Core Initialisiert: System bereit.");
    
    const session = SessionManager.getSession();
    
    // Intelligente Start-Weiche basierend auf Session-Status und Rolle
    if (session) {
        navigateTo(session.role === "admin" ? 'admin' : 'dashboard');
    } else {
        navigateTo('login');
    }
});
