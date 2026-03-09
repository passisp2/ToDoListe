/**
 * Authentication guard for protected pages using backend JWT cookies.
 */

(function () {
    'use strict';

    const AUTH_CONFIG = {
        LOGIN_PAGE: 'login.html',
        ME_ENDPOINTS: ['/auth/me', '/api/auth/me'],
        REFRESH_ENDPOINTS: ['/auth/refresh', '/api/auth/refresh'],
        LOGOUT_ENDPOINTS: ['/auth/logout', '/api/auth/logout']
    };

    let currentUser = null;

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

    async function safeJson(response) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    async function fetchCurrentUser() {
        const meResponse = await fetchWithFallback(AUTH_CONFIG.ME_ENDPOINTS, { method: 'GET' });
        if (meResponse.status === 200) {
            const user = await safeJson(meResponse);
            return user;
        }
        return null;
    }

    async function tryRefresh() {
        const refreshResponse = await fetchWithFallback(AUTH_CONFIG.REFRESH_ENDPOINTS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        });
        return refreshResponse.status === 200;
    }

    async function checkAuth() {
        let user = await fetchCurrentUser();
        if (!user) {
            const refreshed = await tryRefresh();
            if (!refreshed) {
                redirectToLogin();
                return false;
            }
            user = await fetchCurrentUser();
            if (!user) {
                redirectToLogin();
                return false;
            }
        }

        currentUser = user;
        localStorage.setItem('authUser', JSON.stringify(user));
        window.__authUser = user;
        document.dispatchEvent(new CustomEvent('auth:user-ready', { detail: user }));
        return true;
    }

    function redirectToLogin() {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = AUTH_CONFIG.LOGIN_PAGE;
        }
    }

    async function logout() {
        try {
            await fetchWithFallback(AUTH_CONFIG.LOGOUT_ENDPOINTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: '{}'
            });
        } finally {
            localStorage.removeItem('authUser');
            window.__authUser = null;
            redirectToLogin();
        }
    }

    function getCurrentUser() {
        if (currentUser) {
            return currentUser;
        }
        try {
            const cached = localStorage.getItem('authUser');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }

    async function getSessionInfo() {
        const user = getCurrentUser() || (await fetchCurrentUser());
        if (!user) {
            return null;
        }
        return user;
    }

    window.logout = logout;
    window.getSessionInfo = getSessionInfo;
    window.getCurrentUser = getCurrentUser;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            void checkAuth();
        });
    } else {
        void checkAuth();
    }
})();
