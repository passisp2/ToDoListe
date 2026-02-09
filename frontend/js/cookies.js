/**
 * Cookie Management Utility
 * Sicheres Cookie-Handling für Session-Management
 */

const CookieManager = {
    /**
     * Setzt ein Cookie mit Sicherheitseinstellungen
     * 
     * @param {string} name - Cookie-Name
     * @param {string} value - Cookie-Wert
     * @param {number} days - Ablaufdauer in Tagen
     * @param {Object} options - Zusätzliche Optionen
     */
    set: function(name, value, days, options = {}) {
        let expires = '';
        
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        
        // Security flags
        const secure = options.secure !== false && window.location.protocol === 'https:' ? '; Secure' : '';
        const sameSite = options.sameSite || 'Lax'; // Lax, Strict, or None
        const path = options.path || '/';
        
        // Encode value to handle special characters
        const encodedValue = encodeURIComponent(value);
        
        const cookieString = `${name}=${encodedValue}${expires}; path=${path}; SameSite=${sameSite}${secure}`;
        
        document.cookie = cookieString;
        
        console.log('🍪 Cookie set:', name, {
            expires: days ? `${days} days` : 'session',
            secure: !!secure,
            sameSite,
            path
        });
    },
    
    /**
     * Liest ein Cookie
     * 
     * @param {string} name - Cookie-Name
     * @returns {string|null} - Cookie-Wert oder null
     */
    get: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                const value = c.substring(nameEQ.length, c.length);
                return decodeURIComponent(value);
            }
        }
        
        return null;
    },
    
    /**
     * Löscht ein Cookie
     * 
     * @param {string} name - Cookie-Name
     * @param {Object} options - Zusätzliche Optionen (muss mit set() übereinstimmen)
     */
    delete: function(name, options = {}) {
        const path = options.path || '/';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
        console.log('🗑️ Cookie deleted:', name);
    },
    
    /**
     * Prüft ob ein Cookie existiert
     * 
     * @param {string} name - Cookie-Name
     * @returns {boolean}
     */
    exists: function(name) {
        return this.get(name) !== null;
    },
    
    /**
     * Listet alle Cookies auf (für Debugging)
     * 
     * @returns {Object} - Objekt mit allen Cookies
     */
    getAll: function() {
        const cookies = {};
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            const eqPos = c.indexOf('=');
            if (eqPos > -1) {
                const name = c.substring(0, eqPos);
                const value = c.substring(eqPos + 1);
                cookies[name] = decodeURIComponent(value);
            }
        }
        
        return cookies;
    }
};

// Make globally available
if (typeof window !== 'undefined') {
    window.CookieManager = CookieManager;
}
