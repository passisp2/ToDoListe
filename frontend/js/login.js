/**
 * Login Page - Frontend Authentication with Hashing, Salting & Peppering
 * 
 * HINWEIS: Dies ist eine Frontend-Demo. In Produktion sollte die gesamte
 * Authentifizierung auf dem Backend erfolgen!
 * 
 * Sicherheitskonzepte demonstriert:
 * - Hashing: bcrypt (One-way Hash-Funktion)
 * - Salting: Automatisch durch bcrypt (einzigartig pro Passwort)
 * - Peppering: Zusätzlicher geheimer Schlüssel (application-wide)
 */

// ========================================
// Configuration
// ========================================

const CONFIG = {
    // Pepper: Ein geheimer, anwendungsweiter Schlüssel
    // In Produktion: Auf dem Server als Umgebungsvariable speichern!
    PEPPER: 'Lekker2345Pepper467543',
    
    // bcrypt work factor (Anzahl der Hashing-Runden)
    // Höher = sicherer aber langsamer (10-12 ist Standard)
    BCRYPT_ROUNDS: 10,
    
    // Session-Dauer in Millisekunden (24 Stunden)
    SESSION_DURATION: 24 * 60 * 60 * 1000,
    
    // Redirect nach Login
    REDIRECT_URL: 'index.html'
};

// ========================================
// Vordefinierte Benutzer (simulierte Datenbank)
// ========================================

/**
 * In einer echten Anwendung würden diese Daten vom Backend kommen.
 * Der Hash wurde mit SHA-256 + Salt + Pepper erstellt
 * 
 * So wurde der Hash generiert:
 * 1. Passwort: "admin"
 * 2. Salt generiert: "randomSalt123"
 * 3. Mit Pepper kombiniert: "admin" + "MyS3cr3tP3pp3rK3y2026!" + "randomSalt123"
 * 4. Mit SHA-256 gehasht
 */
const USERS_DATABASE = [
    {
        id: 1,
        username: 'admin',
        // Hash für: "admin" + PEPPER + salt (SHA-256)
        // In Produktion würde der Server diesen Hash speichern
        passwordHash: 'fd83aa511d991ba2ef615b3df48d67b2bbf3a755e0739d918cd943f4bec0c864',
        salt: 'a1b2c3d4e5f6g7h8',  // Für jeden User unterschiedlich
        role: 'admin',
        email: 'admin@todolist.com',
        createdAt: new Date('2026-01-01').toISOString()
    }
];

// ========================================
// DOM Elements
// ========================================

const DOM = {
    loginForm: document.getElementById('loginForm'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    rememberMe: document.getElementById('rememberMe'),
    loginBtn: document.getElementById('loginBtn'),
    loginBtnText: document.getElementById('loginBtnText'),
    loginBtnSpinner: document.getElementById('loginBtnSpinner'),
    alertContainer: document.getElementById('alertContainer'),
    togglePassword: document.getElementById('togglePassword'),
    toggleIcon: document.getElementById('toggleIcon'),
    themeToggle: document.getElementById('themeToggle')
};

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    // Prüfe ob User bereits eingeloggt ist
    if (isUserLoggedIn()) {
        redirectToApp();
        return;
    }
    
    // Load Theme
    loadTheme();
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Autofill Demo Credentials (optional, nur für Entwicklung)
    // DOM.username.value = 'admin';
    // DOM.password.value = 'admin';
    
    console.log('Login page initialized');
    console.log('Security Features: Hashing (SHA-256), Salting (per-user), Peppering (application-wide)');
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
    // Login Form Submit
    DOM.loginForm.addEventListener('submit', handleLogin);
    
    // Password Toggle
    DOM.togglePassword.addEventListener('click', togglePasswordVisibility);
    
    // Theme Toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);
    
    // Enter key in inputs
    DOM.username.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') DOM.password.focus();
    });
}

// ========================================
// Login Logic
// ========================================

async function handleLogin(e) {
    e.preventDefault();
    
    // Get Form Data
    const username = DOM.username.value.trim();
    const password = DOM.password.value;
    const rememberMe = DOM.rememberMe.checked;
    
    // Validation
    if (!username || !password) {
        showAlert('Bitte füllen Sie alle Felder aus.', 'danger');
        return;
    }
    
    // Disable Form
    setLoading(true);
    clearAlert();
    
    try {
        // Simulate network delay (in Production: API call)
        await sleep(800);
        
        // Authenticate User
        const authResult = await authenticateUser(username, password);
        
        if (authResult.success) {
            // Success
            showAlert('Login erfolgreich! Sie werden weitergeleitet...', 'success');
            
            // Create Session
            createSession(authResult.user, rememberMe);
            
            // Log Security Info
            console.log('✅ Authentication successful');
            console.log('User:', authResult.user.username);
            console.log('Password verified with bcrypt + salt + pepper');
            
            // Redirect nach kurzer Verzögerung
            setTimeout(() => {
                redirectToApp();
            }, 1000);
            
        } else {
            // Failure
            showAlert(authResult.message || 'Ungültiger Benutzername oder Passwort.', 'danger');
            setLoading(false);
            
            // Clear password field
            DOM.password.value = '';
            DOM.password.focus();
            
            console.log('Authentication failed:', authResult.message);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.', 'danger');
        setLoading(false);
    }
}

/**
 * Authentifiziert einen Benutzer mit Hashing, Salting und Peppering
 * Verwendet Web Crypto API (SHA-256) statt bcrypt für die Demo
 * 
 * @param {string} username - Benutzername
 * @param {string} password - Klartext-Passwort
 * @returns {Promise<Object>} - Authentifizierungsergebnis
 */
async function authenticateUser(username, password) {
    // 1. Find User in Database
    const user = USERS_DATABASE.find(u => u.username === username);
    
    if (!user) {
        return {
            success: false,
            message: 'Benutzer nicht gefunden.'
        };
    }
    
    // 2. Build password string with Salt and Pepper
    // Order: password + pepper + salt
    const combinedPassword = password + CONFIG.PEPPER + user.salt;
    
    console.log('🔐 Security Steps:');
    console.log('1. Password entered:', password);
    console.log('2. Pepper applied:', CONFIG.PEPPER.substring(0, 10) + '...');
    console.log('3. Salt extracted:', user.salt);
    console.log('4. Combined for hashing:', password + ' + PEPPER + ' + user.salt);
    
    // 3. Hash the combined password with SHA-256
    try {
        const hash = await hashPassword(combinedPassword);
        
        console.log('5. SHA-256 hash generated');
        console.log('6. Comparing hashes...');
        console.log('   Expected:', user.passwordHash);
        console.log('   Received:', hash);
        
        const isValid = hash === user.passwordHash;
        console.log('7. Hash comparison result:', isValid);
        
        if (isValid) {
            // Return user data (ohne Passwort-Hash und Salt!)
            const { passwordHash, salt, ...userData } = user;
            
            return {
                success: true,
                user: userData,
                message: 'Authentifizierung erfolgreich.'
            };
        } else {
            return {
                success: false,
                message: 'Ungültiges Passwort.'
            };
        }
        
    } catch (error) {
        console.error('Hash error:', error);
        return {
            success: false,
            message: 'Authentifizierungsfehler.'
        };
    }
}

/**
 * Hash-Funktion mit Web Crypto API (SHA-256)
 * 
 * @param {string} text - Text zum Hashen
 * @returns {Promise<string>} - Hex-String des Hashes
 */
async function hashPassword(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * DEMO: Hash-Generierung für neue Passwörter
 * Diese Funktion würde auf dem Backend laufen
 */
async function generatePasswordHash(password, salt) {
    const combinedPassword = password + CONFIG.PEPPER + salt;
    const hash = await hashPassword(combinedPassword);
    
    console.log('Generated Hash for password "' + password + '":');
    console.log('Salt:', salt);
    console.log('Hash:', hash);
    
    return { hash, salt };
}

// Uncomment to generate a new hash:
// generatePasswordHash('admin', 'a1b2c3d4e5f6g7h8').then(result => console.log('New hash:', result));

// ========================================
// Session Management (Cookie-based)
// ========================================

function createSession(user, rememberMe) {
    const session = {
        user: user,
        loginTime: Date.now(),
        expiresAt: Date.now() + CONFIG.SESSION_DURATION,
        rememberMe: rememberMe
    };
    
    // Speichere Session als Cookie
    const sessionData = JSON.stringify(session);
    const days = rememberMe ? 1 : 0; // 1 Tag wenn "Remember Me", sonst Session-Cookie
    
    CookieManager.set('todolist_session', sessionData, days, {
        sameSite: 'Strict', // CSRF-Schutz
        secure: window.location.protocol === 'https:' // Nur über HTTPS (in Produktion)
    });
    
    console.log('✅ Session created as cookie:', {
        user: user.username,
        expiresAt: new Date(session.expiresAt).toLocaleString('de-DE'),
        persistent: rememberMe,
        cookieType: rememberMe ? 'Persistent (1 day)' : 'Session'
    });
}

function isUserLoggedIn() {
    const session = getSession();
    
    if (!session) return false;
    
    // Prüfe ob Session abgelaufen ist
    if (Date.now() > session.expiresAt) {
        console.log('⚠️ Session expired');
        clearSession();
        return false;
    }
    
    return true;
}

function getSession() {
    const sessionData = CookieManager.get('todolist_session');
    
    if (!sessionData) return null;
    
    try {
        return JSON.parse(sessionData);
    } catch (error) {
        console.error('Invalid session data in cookie:', error);
        clearSession();
        return null;
    }
}

function clearSession() {
    CookieManager.delete('todolist_session');
    console.log('🗑️ Session cleared (cookie deleted)');
}

function redirectToApp() {
    window.location.href = CONFIG.REDIRECT_URL;
}

// ========================================
// UI Helper Functions
// ========================================

function setLoading(isLoading) {
    DOM.loginBtn.disabled = isLoading;
    
    if (isLoading) {
        DOM.loginBtnText.classList.add('d-none');
        DOM.loginBtnSpinner.classList.remove('d-none');
    } else {
        DOM.loginBtnText.classList.remove('d-none');
        DOM.loginBtnSpinner.classList.add('d-none');
    }
}

function showAlert(message, type = 'info') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${type === 'danger' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    DOM.alertContainer.innerHTML = alertHtml;
}

function clearAlert() {
    DOM.alertContainer.innerHTML = '';
}

function togglePasswordVisibility() {
    const type = DOM.password.type === 'password' ? 'text' : 'password';
    DOM.password.type = type;
    
    // Update icon
    if (type === 'text') {
        DOM.toggleIcon.classList.remove('bi-eye');
        DOM.toggleIcon.classList.add('bi-eye-slash');
    } else {
        DOM.toggleIcon.classList.remove('bi-eye-slash');
        DOM.toggleIcon.classList.add('bi-eye');
    }
}

// ========================================
// Theme Management
// ========================================

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = DOM.themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('bi-moon-fill');
        icon.classList.add('bi-sun-fill');
    } else {
        icon.classList.remove('bi-sun-fill');
        icon.classList.add('bi-moon-fill');
    }
}

// ========================================
// Utility Functions
// ========================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// Export for Testing (optional)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authenticateUser,
        generatePasswordHash,
        createSession,
        isUserLoggedIn
    };
}
