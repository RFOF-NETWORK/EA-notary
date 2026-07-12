export class SessionManager {
  static startSession(username, role, address, cleartextMnemonic) {
    try {
      sessionStorage.setItem('session_active', 'true');
      sessionStorage.setItem('session_user', username);
      sessionStorage.setItem('session_role', role);
      sessionStorage.setItem('session_address', address);
    } catch (e) {
      console.error("SessionStorage blockiert:", e);
      return false;
    }

    // Cold-Phrase sicher im RAM
    window.CURRENT_COLD_PHRASE = cleartextMnemonic;
    return true;
  }

  static getSession() {
    try {
      if (sessionStorage.getItem('session_active') === 'true') {
        const username = sessionStorage.getItem('session_user');
        const role = sessionStorage.getItem('session_role');
        const address = sessionStorage.getItem('session_address');

        // Schutz gegen unvollständige Session
        if (!username || !role || !address) return null;

        return { username, role, address };
      }
    } catch (e) {
      console.error("SessionStorage nicht verfügbar:", e);
    }
    return null;
  }

  static endSession() {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error("Session konnte nicht gelöscht werden:", e);
    }

    // Vollständiger Reload ohne Race-Condition
    window.location.replace(window.location.origin + window.location.pathname);
  }
}
