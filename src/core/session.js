export class SessionManager {
  static startSession(username, role, address, cleartextMnemonic) {
    sessionStorage.setItem('session_active', 'true');
    sessionStorage.setItem('session_user', username);
    sessionStorage.setItem('session_role', role);
    sessionStorage.setItem('session_address', address);
    Object.defineProperty(window, 'CURRENT_COLD_PHRASE', {
      value: cleartextMnemonic,
      writable: false,
      configurable: false
    });
  }

  static getSession() {
    if (sessionStorage.getItem('session_active') === 'true') {
      return {
        username: sessionStorage.getItem('session_user'),
        role: sessionStorage.getItem('session_role'),
        address: sessionStorage.getItem('session_address')
      };
    }
    return null;
  }

  static endSession() {
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = window.location.origin + window.location.pathname;
    }, 100);
  }
}
