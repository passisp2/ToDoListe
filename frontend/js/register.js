/**
 * Register Page - Frontend registration flow with live validation.
 */

const CONFIG = {
    REGISTER_ENDPOINTS: ['/auth/register', '/api/auth/register'],
    REDIRECT_URL: 'login.html',
    MIN_PASSWORD_LENGTH: 8
};

const I18N = {
    de: {
        page_title: 'Registrierung - ToDo Liste',
        title: 'ToDo Liste',
        subtitle: 'Neues Konto erstellen',
        email_label: 'E-Mail',
        email_placeholder: 'E-Mail eingeben',
        password_label: 'Passwort',
        password_placeholder: 'Passwort erstellen',
        confirm_label: 'Passwort wiederholen',
        confirm_placeholder: 'Passwort wiederholen',
        strength_label: 'Passwortstärke',
        strength_weak: 'Schwach',
        strength_fair: 'Okay',
        strength_good: 'Gut',
        strength_strong: 'Stark',
        rule_length: 'Mindestens 8 Zeichen',
        rule_special: 'Mindestens 1 Sonderzeichen',
        rule_digit: 'Mindestens 1 Zahl',
        rule_upper: 'Mindestens 1 Großbuchstabe',
        rule_lower: 'Mindestens 1 Kleinbuchstabe',
        register_btn: 'Registrieren',
        register_loading: 'Registrierung läuft...',
        have_account: 'Bereits ein Konto?',
        login_link: 'Zum Login',
        email_invalid: 'Bitte geben Sie eine gültige E-Mail ein.',
        confirm_invalid: 'Passwörter stimmen nicht überein.',
        form_invalid_toast: 'Bitte korrigieren Sie die markierten Felder.',
        register_success: 'Registrierung erfolgreich. Weiterleitung zum Login...',
        register_error: 'Registrierung fehlgeschlagen.',
        request_error: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
        theme_title: 'Theme wechseln'
    },
    en: {
        page_title: 'Register - ToDo List',
        title: 'ToDo List',
        subtitle: 'Create a new account',
        email_label: 'Email',
        email_placeholder: 'Enter email',
        password_label: 'Password',
        password_placeholder: 'Create password',
        confirm_label: 'Confirm password',
        confirm_placeholder: 'Repeat password',
        strength_label: 'Password strength',
        strength_weak: 'Weak',
        strength_fair: 'Fair',
        strength_good: 'Good',
        strength_strong: 'Strong',
        rule_length: 'At least 8 characters',
        rule_special: 'At least 1 special character',
        rule_digit: 'At least 1 number',
        rule_upper: 'At least 1 uppercase letter',
        rule_lower: 'At least 1 lowercase letter',
        register_btn: 'Register',
        register_loading: 'Registering...',
        have_account: 'Already have an account?',
        login_link: 'Go to login',
        email_invalid: 'Please enter a valid email address.',
        confirm_invalid: 'Passwords do not match.',
        form_invalid_toast: 'Please fix the highlighted fields.',
        register_success: 'Registration successful. Redirecting to login...',
        register_error: 'Registration failed.',
        request_error: 'Network error. Please try again.',
        theme_title: 'Toggle theme'
    }
};

const DOM = {
    registerForm: document.getElementById('registerForm'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    emailError: document.getElementById('emailError'),
    confirmError: document.getElementById('confirmError'),
    passwordRules: document.getElementById('passwordRules'),
    strengthValue: document.getElementById('strengthValue'),
    strengthBar: document.getElementById('strengthBar'),
    registerBtn: document.getElementById('registerBtn'),
    registerBtnText: document.getElementById('registerBtnText'),
    registerBtnSpinner: document.getElementById('registerBtnSpinner'),
    togglePassword: document.getElementById('togglePassword'),
    togglePasswordIcon: document.getElementById('togglePasswordIcon'),
    toggleConfirmPassword: document.getElementById('toggleConfirmPassword'),
    toggleConfirmIcon: document.getElementById('toggleConfirmIcon'),
    themeToggle: document.getElementById('themeToggle'),
    langSelect: document.getElementById('langSelect'),
    toastContainer: document.getElementById('toastContainer')
};

let currentLang = 'de';

document.addEventListener('DOMContentLoaded', () => {
    initializeRegister();
});

function initializeRegister() {
    loadTheme();
    loadLanguage();
    applyTranslations();
    setupEventListeners();
    updatePasswordState();
    updateSubmitState();
}

function setupEventListeners() {
    DOM.registerForm.addEventListener('submit', handleRegister);
    DOM.email.addEventListener('input', () => {
        validateEmailField(true);
        updateSubmitState();
    });
    DOM.password.addEventListener('input', () => {
        updatePasswordState();
        validateConfirmPassword(true);
        updateSubmitState();
    });
    DOM.confirmPassword.addEventListener('input', () => {
        validateConfirmPassword(true);
        updateSubmitState();
    });

    DOM.togglePassword.addEventListener('click', () => {
        togglePasswordVisibility(DOM.password, DOM.togglePasswordIcon);
    });
    DOM.toggleConfirmPassword.addEventListener('click', () => {
        togglePasswordVisibility(DOM.confirmPassword, DOM.toggleConfirmIcon);
    });

    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
}

function getTranslations() {
    return I18N[currentLang] || I18N.de;
}

function loadLanguage() {
    const savedLang = localStorage.getItem('language') || 'de';
    currentLang = I18N[savedLang] ? savedLang : 'de';
    DOM.langSelect.value = currentLang;
    document.documentElement.setAttribute('lang', currentLang);
}

function setLanguage(lang) {
    currentLang = I18N[lang] ? lang : 'de';
    localStorage.setItem('language', currentLang);
    document.documentElement.setAttribute('lang', currentLang);
    applyTranslations();
    updatePasswordState();
    validateEmailField(false);
    validateConfirmPassword(false);
}

function applyTranslations() {
    const t = getTranslations();
    document.title = t.page_title;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });
    DOM.themeToggle.setAttribute('title', t.theme_title);
}

function validateEmailField(showErrors) {
    const t = getTranslations();
    const email = DOM.email.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) {
        DOM.email.classList.remove('is-valid', 'is-invalid');
        DOM.emailError.textContent = '';
        return false;
    }

    if (emailValid) {
        DOM.email.classList.add('is-valid');
        DOM.email.classList.remove('is-invalid');
        DOM.emailError.textContent = '';
        return true;
    }

    DOM.email.classList.remove('is-valid');
    if (showErrors) {
        DOM.email.classList.add('is-invalid');
        DOM.emailError.textContent = t.email_invalid;
    }
    return false;
}

function getPasswordChecks(password) {
    return {
        length: password.length >= CONFIG.MIN_PASSWORD_LENGTH,
        special: /[^A-Za-z0-9]/.test(password),
        digit: /\d/.test(password),
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password)
    };
}

function updatePasswordState() {
    const password = DOM.password.value;
    const checks = getPasswordChecks(password);
    const passed = Object.values(checks).filter(Boolean).length;
    const strengthPercent = Math.round((passed / 5) * 100);

    renderPasswordHints(checks);
    renderStrengthMeter(strengthPercent, passed);
}

function renderPasswordHints(checks) {
    DOM.passwordRules.querySelectorAll('.password-rule').forEach((item) => {
        const rule = item.dataset.rule;
        const icon = item.querySelector('i');
        const isValid = checks[rule];
        item.classList.toggle('valid', isValid);
        icon.className = isValid ? 'bi bi-check-circle-fill' : 'bi bi-circle';
    });
}

function renderStrengthMeter(percent, passedRules) {
    const t = getTranslations();
    let label = t.strength_weak;
    let colorClass = 'bg-danger';

    if (passedRules >= 4) {
        label = t.strength_strong;
        colorClass = 'bg-success';
    } else if (passedRules === 3) {
        label = t.strength_good;
        colorClass = 'bg-primary';
    } else if (passedRules === 2) {
        label = t.strength_fair;
        colorClass = 'bg-warning';
    }

    DOM.strengthBar.style.width = `${percent}%`;
    DOM.strengthBar.className = `progress-bar ${colorClass}`;
    DOM.strengthValue.textContent = label;
}

function validateConfirmPassword(showErrors) {
    const t = getTranslations();
    const password = DOM.password.value;
    const confirmPassword = DOM.confirmPassword.value;

    if (!confirmPassword) {
        DOM.confirmPassword.classList.remove('is-valid', 'is-invalid');
        DOM.confirmError.textContent = '';
        return false;
    }

    const valid = password === confirmPassword;
    if (valid) {
        DOM.confirmPassword.classList.add('is-valid');
        DOM.confirmPassword.classList.remove('is-invalid');
        DOM.confirmError.textContent = '';
        return true;
    }

    DOM.confirmPassword.classList.remove('is-valid');
    if (showErrors) {
        DOM.confirmPassword.classList.add('is-invalid');
        DOM.confirmError.textContent = t.confirm_invalid;
    }
    return false;
}

function isPasswordValid() {
    const checks = getPasswordChecks(DOM.password.value);
    return Object.values(checks).every(Boolean);
}

function isFormValid() {
    return validateEmailField(true) && isPasswordValid() && validateConfirmPassword(true);
}

function updateSubmitState() {
    DOM.registerBtn.disabled = !(validateEmailField(false) && isPasswordValid() && validateConfirmPassword(false));
}

async function handleRegister(e) {
    e.preventDefault();
    const t = getTranslations();

    if (!isFormValid()) {
        showToast(t.form_invalid_toast, 'danger');
        return;
    }

    setLoading(true);

    const payload = {
        email: DOM.email.value.trim(),
        password: DOM.password.value
    };

    try {
        const response = await registerRequest(payload);
        const body = await safeParseJson(response);

        if (response.status === 201) {
            showToast(t.register_success, 'success');
            setTimeout(() => {
                window.location.href = `${CONFIG.REDIRECT_URL}?email=${encodeURIComponent(payload.email)}`;
            }, 1200);
            return;
        }

        if (response.status === 400) {
            showToast(body?.error || t.register_error, 'danger');
            return;
        }

        showToast(t.register_error, 'danger');
    } catch {
        showToast(t.request_error, 'danger');
    } finally {
        setLoading(false);
    }
}

async function registerRequest(payload) {
    let lastResponse = null;
    for (const endpoint of CONFIG.REGISTER_ENDPOINTS) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.status !== 404) {
            return response;
        }
        lastResponse = response;
    }
    return lastResponse;
}

async function safeParseJson(response) {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function setLoading(isLoading) {
    DOM.registerBtn.disabled = isLoading || !isFormValid();
    DOM.registerBtnText.classList.toggle('d-none', isLoading);
    DOM.registerBtnSpinner.classList.toggle('d-none', !isLoading);
}

function showToast(message, type = 'info') {
    const iconByType = {
        success: 'check-circle-fill',
        danger: 'exclamation-triangle-fill',
        info: 'info-circle-fill'
    };
    const bgByType = {
        success: 'text-bg-success',
        danger: 'text-bg-danger',
        info: 'text-bg-primary'
    };

    const toast = document.createElement('div');
    toast.className = `toast align-items-center ${bgByType[type] || bgByType.info} border-0`;
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-${iconByType[type] || iconByType.info} me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    DOM.toastContainer.appendChild(toast);
    const toastInstance = new bootstrap.Toast(toast, { delay: 3500 });
    toastInstance.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

function togglePasswordVisibility(input, icon) {
    const nextType = input.type === 'password' ? 'text' : 'password';
    input.type = nextType;
    if (nextType === 'text') {
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
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
