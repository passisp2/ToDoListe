/**
 * Authentication Guard - Session Management for Main App
 * Cookie-based Session Management
 * Dieses Skript prüft ob ein Benutzer eingeloggt ist
 */

(function() {
    'use strict';
    
    const AUTH_CONFIG = {
        LOGIN_PAGE: 'login.html',
        SESSION_COOKIE: 'todolist_session'
    };
    
    /**
     * Prüft die Session beim Laden der Seite
     */
    function checkAuth() {
        const session = getSession();
        
        // Keine Session gefunden
        if (!session) {
            console.log('⚠️ No session cookie found - redirecting to login');
            redirectToLogin();
            return false;
        }
        
        // Session abgelaufen
        if (isSessionExpired(session)) {
            console.log('⚠️ Session expired - redirecting to login');
            clearSession();
            redirectToLogin();
            return false;
        }
        
        // Session gültig
        console.log('✅ Valid session cookie found for user:', session.user.username);
        console.log('   Session expires:', new Date(session.expiresAt).toLocaleString('de-DE'));
        displayUserInfo(session.user);
        return true;
    }
    
    /**
     * Holt die Session aus dem Cookie
     */
    function getSession() {
        if (!window.CookieManager) {
            console.error('CookieManager not loaded!');
            return null;
        }
        
        const sessionData = CookieManager.get(AUTH_CONFIG.SESSION_COOKIE);
        
        if (!sessionData) return null;
        
        try {
            return JSON.parse(sessionData);
        } catch (error) {
            console.error('Invalid session data in cookie:', error);
            clearSession();
            return null;
        }
    }
    
    /**
     * Prüft ob die Session abgelaufen ist
     */
    function isSessionExpired(session) {
        const now = Date.now();
        const expiresAt = session.expiresAt;
        const isExpired = now > expiresAt;
        
        if (isExpired) {
            const expiredSince = Math.floor((now - expiresAt) / 1000 / 60);
            console.log(`Session expired ${expiredSince} minutes ago`);
        }
        
        return isExpired;
    }
    
    /**
     * Löscht die Session (Cookie)
     */
    function clearSession() {
        if (window.CookieManager) {
            CookieManager.delete(AUTH_CONFIG.SESSION_COOKIE);
            console.log('🗑️ Session cookie deleted');
        }
    }
    
    /**
     * Leitet zum Login weiter
     */
    function redirectToLogin() {
        // Verhindere Endlos-Redirect wenn wir schon auf der Login-Seite sind
        if (!window.location.pathname.includes('login.html')) {
            console.log('➡️ Redirecting to login page...');
            window.location.href = AUTH_CONFIG.LOGIN_PAGE;
        }
    }
    
    /**
     * Zeigt Benutzer-Informationen an (optional)
     */
    function displayUserInfo(user) {
        console.log('👤 Logged in as:', user.username, '(' + user.role + ')');
        console.log('📧 Email:', user.email);
        
        // Optional: Füge User-Info zum DOM hinzu
        // z.B. im Header oder Sidebar
    }
    
    /**
     * Logout-Funktion (global verfügbar machen)
     */
    function logout() {
        console.log('🚪 Logging out...');
        
        // Hole Session-Info vor dem Löschen
        const session = getSession();
        if (session) {
            console.log('   Closing session for user:', session.user.username);
            const sessionDuration = Math.floor((Date.now() - session.loginTime) / 1000 / 60);
            console.log('   Session duration:', sessionDuration, 'minutes');
        }
        
        // Lösche Session
        clearSession();
        
        // Redirect
        redirectToLogin();
    }
    
    /**
     * Session-Info anzeigen (für Debugging)
     */
    function getSessionInfo() {
        const session = getSession();
        if (!session) {
            console.log('No active session');
            return null;
        }
        
        const now = Date.now();
        const timeRemaining = Math.floor((session.expiresAt - now) / 1000 / 60);
        const sessionDuration = Math.floor((now - session.loginTime) / 1000 / 60);
        
        const info = {
            user: session.user.username,
            role: session.user.role,
            loginTime: new Date(session.loginTime).toLocaleString('de-DE'),
            expiresAt: new Date(session.expiresAt).toLocaleString('de-DE'),
            timeRemaining: `${timeRemaining} minutes`,
            sessionDuration: `${sessionDuration} minutes`,
            persistent: session.rememberMe
        };
        
        console.table(info);
        return info;
    }
    
    // Globale Funktionen verfügbar machen
    window.logout = logout;
    window.getSessionInfo = getSessionInfo;
    
    // Beim Laden der Seite Auth prüfen
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        checkAuth();
    }
    
})();
