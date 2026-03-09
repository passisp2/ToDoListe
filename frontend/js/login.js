/**
 * Login Page - Backend authentication flow.
 */

const CONFIG = {
    LOGIN_ENDPOINTS: ['/auth/login', '/api/auth/login'],
    ME_ENDPOINTS: ['/auth/me', '/api/auth/me'],
    REFRESH_ENDPOINTS: ['/auth/refresh', '/api/auth/refresh'],
    REDIRECT_URL: 'index.html'
};

const DOM = {
    loginForm: document.getElementById('loginForm'),
    email: document.getElementById('email'),
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

document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
});

async function initializeLogin() {
    loadTheme();
    prefillEmailFromQuery();
    setupEventListeners();

    const alreadyAuthenticated = await ensureAuthenticated();
    if (alreadyAuthenticated) {
        redirectToApp();
    }
}

function prefillEmailFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    if (email) {
        DOM.email.value = email;
    }
}

function setupEventListeners() {
    DOM.loginForm.addEventListener('submit', handleLogin);
    DOM.togglePassword.addEventListener('click', togglePasswordVisibility);
    DOM.themeToggle.addEventListener('click', toggleTheme);

    DOM.email.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            DOM.password.focus();
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();

    const email = DOM.email.value.trim().toLowerCase();
    const password = DOM.password.value;
    const rememberMe = DOM.rememberMe.checked;

    if (!isValidEmail(email) || !password) {
        showAlert('Bitte geben Sie eine gueltige E-Mail und ein Passwort ein.', 'danger');
        return;
    }

    setLoading(true);
    clearAlert();

    try {
        const response = await postWithFallback(CONFIG.LOGIN_ENDPOINTS, {
            email,
            password,
            remember_me: rememberMe
        });
        const body = await safeParseJson(response);

        if (response.status === 200) {
            showAlert('Login erfolgreich. Sie werden weitergeleitet...', 'success');
            if (body?.user) {
                localStorage.setItem('authUser', JSON.stringify(body.user));
            }
            setTimeout(redirectToApp, 700);
            return;
        }

        if (response.status === 401) {
            showAlert('Ungueltige Anmeldedaten. Bitte pruefen Sie E-Mail und Passwort.', 'danger');
            window.alert('Warnung: Ungueltige Anmeldedaten.');
            DOM.password.value = '';
            DOM.password.focus();
            return;
        }

        showAlert(body?.error || 'Login fehlgeschlagen. Bitte erneut versuchen.', 'danger');
    } catch {
        showAlert('Netzwerkfehler. Bitte versuchen Sie es erneut.', 'danger');
    } finally {
        setLoading(false);
    }
}

async function ensureAuthenticated() {
    const me = await fetchWithFallback(CONFIG.ME_ENDPOINTS, { method: 'GET' });
    if (me.status === 200) {
        const user = await safeParseJson(me);
        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
        }
        return true;
    }

    const refreshed = await postWithFallback(CONFIG.REFRESH_ENDPOINTS, {});
    if (refreshed.status !== 200) {
        return false;
    }

    const meAfterRefresh = await fetchWithFallback(CONFIG.ME_ENDPOINTS, { method: 'GET' });
    if (meAfterRefresh.status === 200) {
        const user = await safeParseJson(meAfterRefresh);
        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
        }
        return true;
    }
    return false;
}

async function fetchWithFallback(endpoints, init) {
    let last = null;
    for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
            credentials: 'include',
            ...init
        });
        if (response.status !== 404) {
            return response;
        }
        last = response;
    }
    return last;
}

async function postWithFallback(endpoints, payload) {
    return fetchWithFallback(endpoints, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

async function safeParseJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setLoading(isLoading) {
    DOM.loginBtn.disabled = isLoading;
    DOM.loginBtnText.classList.toggle('d-none', isLoading);
    DOM.loginBtnSpinner.classList.toggle('d-none', !isLoading);
}

function showAlert(message, type = 'info') {
    DOM.alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${type === 'danger' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function clearAlert() {
    DOM.alertContainer.innerHTML = '';
}

function togglePasswordVisibility() {
    const type = DOM.password.type === 'password' ? 'text' : 'password';
    DOM.password.type = type;
    if (type === 'text') {
        DOM.toggleIcon.classList.remove('bi-eye');
        DOM.toggleIcon.classList.add('bi-eye-slash');
    } else {
        DOM.toggleIcon.classList.remove('bi-eye-slash');
        DOM.toggleIcon.classList.add('bi-eye');
    }
}

function redirectToApp() {
    window.location.href = CONFIG.REDIRECT_URL;
}

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
