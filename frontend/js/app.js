/**
 * Todo List Application - Frontend JavaScript
 * Vorbereitet für Backend-Integration
 */

// ========================================
// Application State
// ========================================

const AppState = {
    tasks: [],
    lists: [],
    tags: [],
    currentView: 'today',
    calendarWeekOffset: 0,
    selectedListFilter: null,
    selectedTask: null,
    filterQuery: '',
    theme: 'light',
    language: 'de',
    currentUser: null, // Aktuell eingeloggter Benutzer
    sharedListsData: {} // Speichert Sharing-Informationen pro Liste
};

const STORAGE_KEYS = {
    CURRENT_VIEW: 'todo_current_view',
    LANGUAGE: 'language'
};

const SUPPORTED_LANGUAGES = ['de', 'en'];

const I18N = {
    de: {
        page_title: 'ToDo Liste',
        brand_overline: 'Produktiv bleiben',
        brand_title: 'Taskboard',
        nav_tasks: 'Aufgaben',
        nav_today: 'Heute',
        nav_upcoming: 'Demnächst',
        nav_overview: 'Überblick',
        nav_calendar: 'Kalender',
        nav_lists: 'Listen',
        invite: 'Einladen',
        new_list: 'Neue Liste',
        nav_tags: 'Tags',
        add_tag: 'Tag hinzufügen',
        settings: 'Einstellungen',
        logout: 'Abmelden',
        page_overline: 'Dein Fokus heute',
        page_subtitle: 'Plane, priorisiere und hake Aufgaben sauber ab.',
        search_placeholder: 'Aufgaben durchsuchen...',
        add_task: 'Neue Aufgabe',
        task_header: 'Aufgabe:',
        task_title_placeholder: 'Aufgabentitel',
        description: 'Beschreibung',
        description_placeholder: 'Beschreibung hinzufügen...',
        list_label: 'Liste:',
        no_list_available: 'Keine Liste verfügbar',
        due_date: 'Fälligkeitsdatum:',
        tags_label: 'Tags:',
        select_tag: 'Tag auswählen...',
        cancel: 'Abbrechen',
        save_changes: 'Speichern',
        add_new_list: 'Neue Liste erstellen',
        list_name: 'Listenname',
        color: 'Farbe',
        save_list: 'Liste speichern',
        add_new_tag: 'Neuen Tag erstellen',
        edit_tag: 'Tag bearbeiten',
        tag_name: 'Tag-Name',
        choose_color: 'Wähle eine Farbe',
        tag_hint: 'Die Textfarbe wird automatisch angepasst für beste Lesbarkeit',
        save_tag: 'Tag speichern',
        share_intro: 'Geben Sie den Benutzernamen ein, mit dem Sie die Liste',
        share_intro_suffix: 'teilen möchten:',
        username: 'Benutzername',
        username_placeholder: 'z.B. max.mustermann',
        permissions: 'Berechtigungen',
        permission_read: 'Nur ansehen',
        permission_edit: 'Bearbeiten',
        shared_with: 'Geteilt mit:',
        not_shared_yet: 'Diese Liste wurde noch nicht geteilt.',
        share_title: 'Liste teilen',
        share: 'Teilen',
        confirm: 'Bestätigen',
        ok: 'OK',
        theme: 'Theme',
        theme_light: 'Hell',
        theme_dark: 'Dunkel',
        language: 'Sprache',
        close: 'Schließen',
        view_today: 'Heute',
        view_upcoming: 'Demnächst',
        view_overview: 'Überblick',
        view_calender: 'Kalender',
        preview: 'Vorschau',
        no_tasks_found: 'Keine Aufgaben gefunden',
        calendar_prev_week: 'Vorherige Woche',
        calendar_next_week: 'Nächste Woche',
        calendar_no_tasks: 'Keine Aufgaben',
        data_reload_failed: 'Daten konnten nicht neu geladen werden.',
        data_load_failed: 'Daten konnten nicht geladen werden.',
        task_create_default: 'Neue Aufgabe',
        task_create_failed: 'Aufgabe konnte nicht erstellt werden.',
        task_status_failed: 'Status konnte nicht gespeichert werden.',
        task_saved: 'Aufgabe gespeichert',
        task_save_failed: 'Aufgabe konnte nicht gespeichert werden.',
        task_delete_confirm: 'Möchten Sie diese Aufgabe wirklich löschen?',
        task_delete_title: 'Aufgabe löschen',
        task_deleted: 'Aufgabe gelöscht',
        task_delete_failed: 'Aufgabe konnte nicht gelöscht werden.',
        tasks_load_failed: 'Aufgaben konnten nicht geladen werden.',
        list_name_required: 'Bitte geben Sie einen Namen für die Liste ein.',
        list_created: 'Liste erstellt',
        list_create_failed: 'Liste konnte nicht erstellt werden.',
        share_only_owner: 'Sie können nur eigene Listen teilen.',
        share_username_required: 'Bitte geben Sie einen Benutzernamen ein.',
        share_self_forbidden: 'Sie können die Liste nicht mit sich selbst teilen.',
        share_already_exists: 'Diese Liste wurde bereits mit diesem Benutzer geteilt.',
        list_shared_with: 'Liste mit {username} geteilt',
        list_unshared_with: 'Liste nicht mehr mit {username} geteilt',
        share_permission_read: 'Ansehen',
        share_permission_edit: 'Bearbeiten',
        tag_delete_title: 'Tag löschen',
        tag_delete_confirm: 'Möchten Sie den Tag "{tag}" wirklich löschen?\nEr wird aus allen Aufgaben entfernt.',
        tag_name_required: 'Bitte geben Sie einen Namen für den Tag ein.',
        tag_exists: 'Dieser Tag existiert bereits.',
        tag_updated: 'Tag aktualisiert',
        tag_update_failed: 'Tag konnte nicht aktualisiert werden.',
        tag_created: 'Tag erstellt',
        tag_create_failed: 'Tag konnte nicht erstellt werden.',
        tag_deleted: 'Tag gelöscht',
        tag_delete_failed: 'Tag konnte nicht gelöscht werden.',
        logout_confirm: 'Möchten Sie sich wirklich abmelden?',
        logout_title: 'Abmelden',
        theme_changed: 'Theme auf {mode} geändert',
        theme_mode_dark: 'Dark Mode',
        theme_mode_light: 'Light Mode',
        hint_title: 'Hinweis',
        confirm_title: 'Bestätigung',
        api_failed: 'API-Anfrage fehlgeschlagen ({status})'
    },
    en: {
        page_title: 'ToDo List',
        brand_overline: 'Stay productive',
        brand_title: 'Taskboard',
        nav_tasks: 'Tasks',
        nav_today: 'Today',
        nav_upcoming: 'Upcoming',
        nav_overview: 'Overview',
        nav_calendar: 'Calendar',
        nav_lists: 'Lists',
        invite: 'Invite',
        new_list: 'New list',
        nav_tags: 'Tags',
        add_tag: 'Add tag',
        settings: 'Settings',
        logout: 'Log out',
        page_overline: 'Your focus today',
        page_subtitle: 'Plan, prioritize, and complete your tasks with clarity.',
        search_placeholder: 'Search tasks...',
        add_task: 'New task',
        task_header: 'Task:',
        task_title_placeholder: 'Task title',
        description: 'Description',
        description_placeholder: 'Add description...',
        list_label: 'List:',
        no_list_available: 'No list available',
        due_date: 'Due date:',
        tags_label: 'Tags:',
        select_tag: 'Select tag...',
        cancel: 'Cancel',
        save_changes: 'Save changes',
        add_new_list: 'Add new list',
        list_name: 'List name',
        color: 'Color',
        save_list: 'Save list',
        add_new_tag: 'Add new tag',
        edit_tag: 'Edit tag',
        tag_name: 'Tag name',
        choose_color: 'Choose a color',
        tag_hint: 'Text color is adjusted automatically for best readability',
        save_tag: 'Save tag',
        share_intro: 'Enter the username you want to share the list',
        share_intro_suffix: 'with:',
        username: 'Username',
        username_placeholder: 'e.g. john.doe',
        permissions: 'Permissions',
        permission_read: 'Read only',
        permission_edit: 'Edit',
        shared_with: 'Shared with:',
        not_shared_yet: 'This list has not been shared yet.',
        share_title: 'Share list',
        share: 'Share',
        confirm: 'Confirm',
        ok: 'OK',
        theme: 'Theme',
        theme_light: 'Light',
        theme_dark: 'Dark',
        language: 'Language',
        close: 'Close',
        view_today: 'Today',
        view_upcoming: 'Upcoming',
        view_overview: 'Overview',
        view_calender: 'Calendar',
        preview: 'Preview',
        no_tasks_found: 'No tasks found',
        calendar_prev_week: 'Previous week',
        calendar_next_week: 'Next week',
        calendar_no_tasks: 'No tasks',
        data_reload_failed: 'Could not reload data.',
        data_load_failed: 'Could not load data.',
        task_create_default: 'New task',
        task_create_failed: 'Could not create task.',
        task_status_failed: 'Could not save status.',
        task_saved: 'Task saved',
        task_save_failed: 'Could not save task.',
        task_delete_confirm: 'Do you really want to delete this task?',
        task_delete_title: 'Delete task',
        task_deleted: 'Task deleted',
        task_delete_failed: 'Could not delete task.',
        tasks_load_failed: 'Could not load tasks.',
        list_name_required: 'Please enter a name for the list.',
        list_created: 'List created',
        list_create_failed: 'Could not create list.',
        share_only_owner: 'You can only share your own lists.',
        share_username_required: 'Please enter a username.',
        share_self_forbidden: 'You cannot share the list with yourself.',
        share_already_exists: 'This list is already shared with this user.',
        list_shared_with: 'List shared with {username}',
        list_unshared_with: 'List no longer shared with {username}',
        share_permission_read: 'Read',
        share_permission_edit: 'Edit',
        tag_delete_title: 'Delete tag',
        tag_delete_confirm: 'Do you really want to delete the tag "{tag}"?\nIt will be removed from all tasks.',
        tag_name_required: 'Please enter a name for the tag.',
        tag_exists: 'This tag already exists.',
        tag_updated: 'Tag updated',
        tag_update_failed: 'Could not update tag.',
        tag_created: 'Tag created',
        tag_create_failed: 'Could not create tag.',
        tag_deleted: 'Tag deleted',
        tag_delete_failed: 'Could not delete tag.',
        logout_confirm: 'Do you really want to log out?',
        logout_title: 'Log out',
        theme_changed: 'Theme changed to {mode}',
        theme_mode_dark: 'Dark mode',
        theme_mode_light: 'Light mode',
        hint_title: 'Info',
        confirm_title: 'Confirmation',
        api_failed: 'API request failed ({status})'
    }
};

// ========================================
// DOM Elements
// ========================================

const DOM = {
    tasksList: document.getElementById('tasksList'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    taskDetailSidebar: document.getElementById('taskDetailSidebar'),
    closeTaskDetail: document.getElementById('closeTaskDetail'),
    taskDetailForm: document.getElementById('taskDetailForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskDescription: document.getElementById('taskDescription'),
    taskList: document.getElementById('taskList'),
    taskDueDate: document.getElementById('taskDueDate'),
    taskTags: document.getElementById('taskTags'),
    cancelTaskBtn: document.getElementById('cancelTaskBtn'),
    searchInput: document.getElementById('searchInput'),
    pageTitle: document.getElementById('pageTitle'),
    addListBtn: document.getElementById('addListBtn'),
    saveListBtn: document.getElementById('saveListBtn'),
    listName: document.getElementById('listName'),
    listColor: document.getElementById('listColor'),
    listContainer: document.getElementById('listContainer'),
    logoutBtn: document.getElementById('logoutBtn'),
    addTagBtn: document.getElementById('addTagBtn'),
    saveTagBtn: document.getElementById('saveTagBtn'),
    tagName: document.getElementById('tagName'),
    tagColor: document.getElementById('tagColor'),
    tagsContainer: document.getElementById('tagsContainer'),
    themeLight: document.getElementById('themeLight'),
    themeDark: document.getElementById('themeDark'),
    appLanguage: document.getElementById('appLanguage'),
    shareListBtn: document.getElementById('shareListBtn'),
    shareUsername: document.getElementById('shareUsername'),
    shareListName: document.getElementById('shareListName'),
    sharedUsersContainer: document.getElementById('sharedUsersContainer')
};

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    void initializeApp();
});

async function initializeApp() {
    loadCurrentUser();
    loadTheme();
    loadLanguage();
    loadPersistedView();
    setupEventListeners();
    applyLanguage();
    applyCurrentViewUI();

    await refreshAllData();
    renderTasks();
    renderLists();
    renderTags();
    syncDetailLayoutState();

    document.addEventListener('auth:user-ready', (event) => {
        const email = event?.detail?.email;
        if (!email || email === AppState.currentUser) {
            return;
        }
        AppState.currentUser = email;
        void refreshAllData()
            .then(() => {
                renderTasks();
                renderLists();
                renderTags();
            })
            .catch(() => {
                showNotification(t('data_reload_failed'), 'danger');
            });
    });

    console.log('Todo List App initialized successfully');
    console.log('Current user:', AppState.currentUser);
}

/**
 * Lädt den aktuellen Benutzer aus der Session
 */
function loadCurrentUser() {
    // Auth-User kommt aus auth.js (/auth/me + Refresh).
    if (typeof window.getCurrentUser === 'function') {
        const user = window.getCurrentUser();
        if (user?.email) {
            AppState.currentUser = user.email;
            return;
        }
    }

    try {
        const cached = localStorage.getItem('authUser');
        if (cached) {
            const user = JSON.parse(cached);
            if (user?.email) {
                AppState.currentUser = user.email;
                return;
            }
        }
    } catch (e) {
        console.error('Error loading authUser from localStorage:', e);
    }

    AppState.currentUser = null;
}

/**
 * Lädt geteilte Listen aus localStorage
 */
function loadSharedLists() {
    try {
        const sharedData = localStorage.getItem('sharedLists');
        if (sharedData) {
            AppState.sharedListsData = JSON.parse(sharedData);
            
            // Aktualisiere lists mit Sharing-Informationen
            AppState.lists.forEach(list => {
                const shareInfo = AppState.sharedListsData[list.id];
                if (shareInfo) {
                    list.owner = shareInfo.owner || list.owner || null;
                    list.sharedWith = shareInfo.sharedWith || [];
                } else {
                    list.owner = list.owner || null;
                    list.sharedWith = list.sharedWith || [];
                }
            });
        }
    } catch (e) {
        console.error('Error loading shared lists:', e);
    }
}

/**
 * Speichert geteilte Listen in localStorage
 */
function saveSharedLists() {
    try {
        // Erstelle sharedListsData aus den Listen
        const sharedData = {};
        AppState.lists.forEach(list => {
            if (list.sharedWith && list.sharedWith.length > 0) {
                sharedData[list.id] = {
                    owner: list.owner,
                    sharedWith: list.sharedWith
                };
            }
        });
        
        AppState.sharedListsData = sharedData;
        localStorage.setItem('sharedLists', JSON.stringify(sharedData));
    } catch (e) {
        console.error('Error saving shared lists:', e);
    }
}

async function refreshAllData() {
    try {
        const [lists, tags, tasks] = await Promise.all([
            API.getLists(),
            API.getTags(),
            API.getTasks()
        ]);
        AppState.lists = Array.isArray(lists) ? lists : [];
        AppState.tags = Array.isArray(tags) ? tags : [];
        AppState.tasks = Array.isArray(tasks) ? tasks : [];
        loadSharedLists();
    } catch (error) {
        console.error('Error loading API data:', error);
        showNotification(t('data_load_failed'), 'danger');
    }
}

async function refreshTasksFromApi() {
    const tasks = await API.getTasks();
    AppState.tasks = Array.isArray(tasks) ? tasks : [];
}

function loadPersistedView() {
    const savedView = localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW);
    if (savedView && ['today', 'upcoming', 'overview', 'calender'].includes(savedView)) {
        AppState.currentView = savedView;
    }
}

function applyCurrentViewUI() {
    document.querySelectorAll('[data-view]').forEach(link => {
        link.classList.toggle('active', link.dataset.view === AppState.currentView);
    });
    DOM.pageTitle.textContent = getViewTitle(AppState.currentView);
}

function setCurrentView(view) {
    if (!['today', 'upcoming', 'overview', 'calender'].includes(view)) {
        return;
    }
    AppState.currentView = view;
    localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, view);
    applyCurrentViewUI();
}

function t(key, vars = {}) {
    const translations = I18N[AppState.language] || I18N.de;
    const template = translations[key] || I18N.de[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
}

function getLocale() {
    return AppState.language === 'en' ? 'en-US' : 'de-DE';
}

function getViewTitle(view) {
    return t(`view_${view}`);
}

function loadLanguage() {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'de';
    AppState.language = SUPPORTED_LANGUAGES.includes(saved) ? saved : 'de';
}

function applyLanguage() {
    document.documentElement.lang = AppState.language;
    document.title = t('page_title');

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        element.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        element.setAttribute('placeholder', t(key));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
        const key = element.dataset.i18nTitle;
        element.setAttribute('title', t(key));
    });

    if (DOM.appLanguage) {
        DOM.appLanguage.value = AppState.language;
    }

    applyCurrentViewUI();
}

// ========================================
// Color Utility Functions
// ========================================

/**
 * Berechnet die Luminanz einer Hex-Farbe
 * @param {string} hex - Hex-Farbcode (z.B. "#ff5733")
 * @returns {number} - Luminanz-Wert zwischen 0 und 1
 */
function calculateLuminance(hex) {
    // Entferne # falls vorhanden
    hex = hex.replace('#', '');
    
    // Konvertiere Hex zu RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Relative Luminanz Berechnung (WCAG-Standard)
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Bestimmt die optimale Textfarbe (schwarz oder weiß) basierend auf der Hintergrundfarbe
 * @param {string} backgroundColor - Hex-Farbcode der Hintergrundfarbe
 * @returns {string} - '#ffffff' für weiß oder '#000000' für schwarz
 */
function getContrastTextColor(backgroundColor) {
    const luminance = calculateLuminance(backgroundColor);
    // Wenn Luminanz > 0.5, ist die Farbe hell → verwende schwarzen Text
    // Ansonsten verwende weißen Text
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Aktualisiert die Tag-Vorschau im Modal
 * @param {string} tagName - Name des Tags
 * @param {string} tagColor - Hex-Farbcode
 */
function updateTagPreview(tagName, tagColor) {
    const preview = document.getElementById('tagPreview');
    if (!preview) return;
    
    const textColor = getContrastTextColor(tagColor);
    preview.style.backgroundColor = tagColor;
    preview.style.color = textColor;
    preview.textContent = tagName || t('preview');
}

// ========================================
// Modal Helper Functions
// ========================================

/**
 * Zeigt ein Info-Modal mit einer Nachricht
 * @param {string} message - Die anzuzeigende Nachricht
 * @param {string} title - Der Modal-Titel (optional)
 */
function showInfoModal(message, title = t('hint_title')) {
    const modalElement = document.getElementById('infoModal');
    const modalTitle = document.getElementById('infoModalTitle');
    const modalBody = document.getElementById('infoModalBody');
    
    modalTitle.textContent = title;
    modalBody.textContent = message;
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

/**
 * Zeigt ein Bestätigungs-Modal und gibt ein Promise zurück
 * @param {string} message - Die anzuzeigende Nachricht
 * @param {string} title - Der Modal-Titel (optional)
 * @returns {Promise<boolean>} - Promise das true bei Bestätigung und false bei Abbruch zurückgibt
 */
function showConfirmModal(message, title = t('confirm_title')) {
    return new Promise((resolve) => {
        const modalElement = document.getElementById('confirmModal');
        const modalTitle = document.getElementById('confirmModalTitle');
        const modalBody = document.getElementById('confirmModalBody');
        const confirmBtn = document.getElementById('confirmModalBtn');
        
        modalTitle.textContent = title;
        modalBody.textContent = message;
        
        const modal = new bootstrap.Modal(modalElement);
        
        // Event Handler für Bestätigung
        const handleConfirm = () => {
            modal.hide();
            cleanup();
            resolve(true);
        };
        
        // Event Handler für Abbruch
        const handleCancel = () => {
            cleanup();
            resolve(false);
        };
        
        // Cleanup-Funktion
        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            modalElement.removeEventListener('hidden.bs.modal', handleCancel);
        };
        
        // Event Listeners hinzufügen
        confirmBtn.addEventListener('click', handleConfirm);
        modalElement.addEventListener('hidden.bs.modal', handleCancel, { once: true });
        
        modal.show();
    });
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
    // Task Events
    DOM.addTaskBtn.addEventListener('click', handleAddTask);
    DOM.closeTaskDetail.addEventListener('click', closeTaskDetail);
    DOM.cancelTaskBtn.addEventListener('click', closeTaskDetail);
    DOM.taskDetailForm.addEventListener('submit', handleSaveTask);
    
    // Search
    DOM.searchInput.addEventListener('input', handleSearch);
    
    // Navigation
    document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', handleViewChange);
    });
    
    // Lists
    DOM.addListBtn.addEventListener('click', handleAddListClick);
    DOM.saveListBtn.addEventListener('click', handleSaveList);
    
    // List filters
    document.querySelectorAll('[data-list]').forEach(link => {
        link.addEventListener('click', handleListFilter);
    });
    
    // Share List
    DOM.shareListBtn.addEventListener('click', handleShareList);
    
    // Tags
    DOM.saveTagBtn.addEventListener('click', handleSaveTag);
    
    // Tag Preview Updates
    DOM.tagColor.addEventListener('input', () => {
        updateTagPreview(DOM.tagName.value, DOM.tagColor.value);
    });
    
    DOM.tagName.addEventListener('input', () => {
        updateTagPreview(DOM.tagName.value, DOM.tagColor.value);
    });
    
    // Initialize tag preview on page load
    updateTagPreview(t('preview'), DOM.tagColor.value);
    
    // Reset editingTagIndex when modal closes
    const tagModal = document.getElementById('addTagModal');
    tagModal.addEventListener('hide.bs.modal', () => {
        editingTagIndex = null;
        DOM.tagName.value = '';
        DOM.tagColor.value = '#dc3545';
        updateTagPreview(t('preview'), '#dc3545');
        document.querySelector('#addTagModal .modal-title').textContent = t('add_new_tag');
    });
    
    // Theme
    DOM.themeLight.addEventListener('change', handleThemeChange);
    DOM.themeDark.addEventListener('change', handleThemeChange);

    if (DOM.appLanguage) {
        DOM.appLanguage.addEventListener('change', handleLanguageChange);
    }
    
    // Logout
    DOM.logoutBtn.addEventListener('click', handleLogout);

    // Layout sync
    window.addEventListener('resize', syncDetailLayoutState);
}

// ========================================
// Task Rendering
// ========================================

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    DOM.tasksList.innerHTML = '';
    DOM.tasksList.classList.remove('calendar-view');

    if (AppState.currentView === 'calender') {
        renderCalendarWeek(filteredTasks);
        return;
    }

    if (filteredTasks.length === 0) {
        DOM.tasksList.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-1"></i>
                <p class="mt-2">${t('no_tasks_found')}</p>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        DOM.tasksList.appendChild(taskElement);
    });
}

function toIsoDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getWeekStartMonday(baseDate) {
    const result = new Date(baseDate);
    result.setHours(0, 0, 0, 0);
    const day = (result.getDay() + 6) % 7; // Monday = 0
    result.setDate(result.getDate() - day + AppState.calendarWeekOffset * 7);
    return result;
}

function createCalendarTaskCard(task) {
    const card = document.createElement('div');
    card.className = `calendar-task-card ${task.completed ? 'completed' : ''}`;
    card.dataset.taskId = task.id;

    const top = document.createElement('div');
    top.className = 'calendar-task-top';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', (e) => e.stopPropagation());
    checkbox.addEventListener('change', () => handleTaskToggle(task.id));

    const title = document.createElement('div');
    title.className = 'calendar-task-title';
    title.textContent = task.title;

    top.appendChild(checkbox);
    top.appendChild(title);
    card.appendChild(top);

    const meta = document.createElement('div');
    meta.className = 'calendar-task-meta';

    if (task.list) {
        const listObj = AppState.lists.find(l => l.id === task.list);
        if (listObj) {
            const listBadge = document.createElement('span');
            listBadge.className = 'badge';
            const textColor = getContrastTextColor(listObj.color);
            listBadge.style.backgroundColor = listObj.color;
            listBadge.style.color = textColor;
            listBadge.textContent = listObj.name;
            meta.appendChild(listBadge);
        }
    }

    if (task.tags.length > 0) {
        task.tags.slice(0, 2).forEach(tagName => {
            const tagObj = AppState.tags.find(t => t.name === tagName);
            if (!tagObj) {
                return;
            }
            const tagBadge = document.createElement('span');
            tagBadge.className = 'badge';
            const textColor = getContrastTextColor(tagObj.color);
            tagBadge.style.backgroundColor = tagObj.color;
            tagBadge.style.color = textColor;
            tagBadge.textContent = tagObj.name;
            meta.appendChild(tagBadge);
        });
    }

    if (meta.children.length > 0) {
        card.appendChild(meta);
    }

    card.addEventListener('click', () => openTaskDetail(task.id));
    return card;
}

function renderCalendarWeek(filteredTasks) {
    DOM.tasksList.classList.add('calendar-view');

    const weekStart = getWeekStartMonday(new Date());
    const dayDates = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + index);
        return day;
    });
    const dayKeys = dayDates.map(toIsoDateLocal);

    const tasksByDay = new Map(dayKeys.map(key => [key, []]));
    filteredTasks.forEach(task => {
        if (!task.dueDate || !tasksByDay.has(task.dueDate)) {
            return;
        }
        tasksByDay.get(task.dueDate).push(task);
    });

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const locale = getLocale();
    const weekLabel = `${weekStart.toLocaleDateString(locale)} - ${weekEnd.toLocaleDateString(locale)}`;

    const calendarShell = document.createElement('section');
    calendarShell.className = 'calendar-shell';

    const toolbar = document.createElement('div');
    toolbar.className = 'calendar-toolbar';
    toolbar.innerHTML = `
        <button class="btn btn-sm calendar-nav-btn" type="button" data-calendar-nav="prev">
            <i class="bi bi-chevron-left"></i> ${t('calendar_prev_week')}
        </button>
        <div class="calendar-toolbar-title">${weekLabel}</div>
        <button class="btn btn-sm calendar-nav-btn" type="button" data-calendar-nav="next">
            ${t('calendar_next_week')} <i class="bi bi-chevron-right"></i>
        </button>
    `;

    toolbar.querySelector('[data-calendar-nav="prev"]').addEventListener('click', () => {
        AppState.calendarWeekOffset -= 1;
        renderTasks();
    });
    toolbar.querySelector('[data-calendar-nav="next"]').addEventListener('click', () => {
        AppState.calendarWeekOffset += 1;
        renderTasks();
    });

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    dayDates.forEach((dayDate, index) => {
        const dayKey = dayKeys[index];
        const dayColumn = document.createElement('div');
        const isToday = dayKey === toIsoDateLocal(new Date());
        dayColumn.className = `calendar-day-column ${isToday ? 'is-today' : ''}`.trim();
        dayColumn.innerHTML = `
            <div class="calendar-day-header">
                <div class="calendar-day-name">${dayDate.toLocaleDateString(locale, { weekday: 'long' })}</div>
                <div class="calendar-day-date">${dayDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' })}</div>
            </div>
            <div class="calendar-day-body"></div>
        `;

        const body = dayColumn.querySelector('.calendar-day-body');
        const dayTasks = tasksByDay.get(dayKey) || [];
        if (dayTasks.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day-empty';
            empty.textContent = t('calendar_no_tasks');
            body.appendChild(empty);
        } else {
            dayTasks.forEach(task => {
                body.appendChild(createCalendarTaskCard(task));
            });
        }

        grid.appendChild(dayColumn);
    });

    const gridWrap = document.createElement('div');
    gridWrap.className = 'calendar-grid-wrap';
    gridWrap.appendChild(grid);

    calendarShell.appendChild(toolbar);
    calendarShell.appendChild(gridWrap);
    DOM.tasksList.appendChild(calendarShell);
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `list-group-item d-flex align-items-start ${task.completed ? 'completed' : ''}`;
    div.dataset.taskId = task.id;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => handleTaskToggle(task.id));
    
    // Task Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';
    
    const titleP = document.createElement('p');
    titleP.className = 'task-title';
    titleP.textContent = task.title;
    contentDiv.appendChild(titleP);
    
    // Task Meta (Tags, List, Date)
    if (task.tags.length > 0 || task.list || task.dueDate) {
        const metaDiv = document.createElement('div');
        metaDiv.className = 'task-meta';
        
        // List badge
        if (task.list) {
            const listObj = AppState.lists.find(l => l.id === task.list);
            if (listObj) {
                const badge = document.createElement('span');
                badge.className = 'badge';
                
                // Setze Custom-Farben mit automatischer Textfarbe
                const textColor = getContrastTextColor(listObj.color);
                badge.style.backgroundColor = listObj.color;
                badge.style.color = textColor;
                
                badge.textContent = listObj.name;
                metaDiv.appendChild(badge);
            }
        }
        
        // Due date badge
        if (task.dueDate) {
            const dateBadge = document.createElement('span');
            dateBadge.className = 'badge bg-secondary';
            dateBadge.innerHTML = `<i class="bi bi-calendar3"></i> ${formatDate(task.dueDate)}`;
            metaDiv.appendChild(dateBadge);
        }
        
        // Tag badges
        task.tags.forEach(tagName => {
            const tagObj = AppState.tags.find(t => t.name === tagName);
            if (tagObj) {
                const tagBadge = document.createElement('span');
                tagBadge.className = 'badge';
                
                // Setze Custom-Farben mit automatischer Textfarbe
                const textColor = getContrastTextColor(tagObj.color);
                tagBadge.style.backgroundColor = tagObj.color;
                tagBadge.style.color = textColor;
                
                tagBadge.textContent = tagObj.name;
                metaDiv.appendChild(tagBadge);
            }
        });
        
        contentDiv.appendChild(metaDiv);
    }
    
    // Arrow icon
    const arrow = document.createElement('i');
    arrow.className = 'bi bi-chevron-right task-arrow';
    
    // Assembly
    div.appendChild(checkbox);
    div.appendChild(contentDiv);
    div.appendChild(arrow);
    
    // Click handler for task detail
    contentDiv.addEventListener('click', () => openTaskDetail(task.id));
    arrow.addEventListener('click', () => openTaskDetail(task.id));
    
    return div;
}

// ========================================
// Task Management
// ========================================

async function handleAddTask() {
    try {
        const defaultList = AppState.lists[0]?.id || null;
        const createdTask = await API.createTask({
            title: t('task_create_default'),
            description: '',
            completed: false,
            list: defaultList,
            dueDate: null,
            tags: []
        });
        AppState.tasks.unshift(createdTask);
        AppState.selectedTask = createdTask.id;

        renderTasks();
        openTaskDetail(createdTask.id);

        setTimeout(() => {
            DOM.taskTitle.select();
        }, 100);
    } catch (error) {
        showInfoModal(error.message || t('task_create_failed'), t('hint_title'));
    }
}

async function handleTaskToggle(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) {
        return;
    }

    const nextCompleted = !task.completed;
    task.completed = nextCompleted;
    renderTasks();

    try {
        const updated = await API.updateTask(taskId, { completed: nextCompleted });
        Object.assign(task, updated);
    } catch (error) {
        task.completed = !nextCompleted;
        renderTasks();
        showNotification(error.message || t('task_status_failed'), 'danger');
    }
}

async function handleSaveTask(e) {
    e.preventDefault();

    const taskId = AppState.selectedTask;
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) {
        return;
    }

    const selectedTag = DOM.taskTags.value;
    const payload = {
        title: DOM.taskTitle.value.trim(),
        description: DOM.taskDescription.value,
        list: DOM.taskList.value || null,
        dueDate: DOM.taskDueDate.value || null,
        tags: selectedTag ? [selectedTag] : []
    };

    try {
        const updated = await API.updateTask(taskId, payload);
        Object.assign(task, updated);
        renderTasks();
        closeTaskDetail();
        showNotification(t('task_saved'), 'success');
    } catch (error) {
        showInfoModal(error.message || t('task_save_failed'), t('hint_title'));
    }
}

async function deleteTask(taskId) {
    const confirmed = await showConfirmModal(
        t('task_delete_confirm'),
        t('task_delete_title')
    );
    
    if (confirmed) {
        try {
            await API.deleteTask(taskId);
            AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
            renderTasks();
            closeTaskDetail();
            showNotification(t('task_deleted'), 'info');
        } catch (error) {
            showInfoModal(error.message || t('task_delete_failed'), t('hint_title'));
        }
    }
}

// ========================================
// Task Detail Sidebar
// ========================================

function openTaskDetail(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    AppState.selectedTask = taskId;
    
    // Populate form
    DOM.taskTitle.value = task.title;
    DOM.taskDescription.value = task.description || '';
    DOM.taskList.value = task.list || AppState.lists[0]?.id || '';
    DOM.taskDueDate.value = task.dueDate || '';
    DOM.taskTags.value = task.tags[0] || '';
    
    // Show sidebar
    DOM.taskDetailSidebar.classList.remove('d-none');
    DOM.taskDetailSidebar.classList.add('show');
    syncDetailLayoutState();
}

function closeTaskDetail() {
    DOM.taskDetailSidebar.classList.add('d-none');
    DOM.taskDetailSidebar.classList.remove('show');
    AppState.selectedTask = null;
    syncDetailLayoutState();
}

function syncDetailLayoutState() {
    const isDesktop = window.innerWidth >= 992;
    const detailVisible = !DOM.taskDetailSidebar.classList.contains('d-none');
    document.body.classList.toggle('detail-open', isDesktop && detailVisible);
}

// ========================================
// Filtering and Search
// ========================================

function getFilteredTasks() {
    let filtered = [...AppState.tasks];
    
    // Filter by view
    const today = new Date().toISOString().split('T')[0];
    
    switch (AppState.currentView) {
        case 'today':
            filtered = filtered.filter(task => 
                !task.completed && (task.dueDate === today || !task.dueDate)
            );
            break;
        case 'upcoming':
            filtered = filtered.filter(task => 
                !task.completed && task.dueDate && task.dueDate > today
            );
            break;
        case 'overview':
            // Show all tasks
            break;
        case 'calender':
            filtered = filtered.filter(task => task.dueDate);
            break;
    }

    if (AppState.selectedListFilter) {
        filtered = filtered.filter(task => task.list === AppState.selectedListFilter);
    }
    
    // Filter by search query
    if (AppState.filterQuery) {
        const query = AppState.filterQuery.toLowerCase();
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(query) ||
            (task.description || '').toLowerCase().includes(query)
        );
    }
    
    return filtered;
}

function handleSearch(e) {
    AppState.filterQuery = e.target.value;
    renderTasks();
}

async function handleViewChange(e) {
    e.preventDefault();
    
    const view = e.currentTarget.dataset.view;
    setCurrentView(view);

    if (view === 'overview') {
        try {
            await refreshTasksFromApi();
        } catch (error) {
            showNotification(error.message || t('tasks_load_failed'), 'danger');
        }
    }

    renderTasks();
}

function handleListFilter(e) {
    e.preventDefault();
    const listId = e.currentTarget.dataset.list;
    AppState.selectedListFilter = AppState.selectedListFilter === listId ? null : listId;

    document.querySelectorAll('[data-list]').forEach(link => {
        link.classList.remove('active');
    });
    if (AppState.selectedListFilter) {
        e.currentTarget.classList.add('active');
    }

    renderTasks();
}

// ========================================
// List Management
// ========================================

function renderLists() {
    // Clear current list items (except the "Add List" button)
    const listItems = DOM.listContainer.querySelectorAll('[data-list]');
    listItems.forEach(item => {
        if (item.parentElement) {
            item.parentElement.remove();
        }
    });
    
    // Re-render all lists from AppState
    AppState.lists.forEach(list => {
        const listItem = document.createElement('li');
        listItem.className = 'nav-item';
        
        // Prüfe ob Liste geteilt ist
        const isShared = list.sharedWith && list.sharedWith.length > 0;
        const isOwner = Boolean(AppState.currentUser) && list.owner === AppState.currentUser;
        const sharedIcon = isShared ? `<i class="bi bi-people-fill text-muted ms-1" title="${t('shared_with')}"></i>` : '';
        const shareButton = isOwner ? `<i class="bi bi-share list-share-btn" data-list-id="${list.id}" title="${t('share')}"></i>` : '';
        
        listItem.innerHTML = `
            <a class="nav-link d-flex justify-content-between align-items-center" href="#" data-list="${list.id}">
                <span>
                    <span class="badge rounded-circle me-2" style="background-color: ${list.color};">&nbsp;</span>
                    ${list.name}
                    ${sharedIcon}
                </span>
                ${shareButton}
            </a>
        `;
        
        const listLink = listItem.querySelector('a');
        if (AppState.selectedListFilter === list.id) {
            listLink.classList.add('active');
        }
        listLink.addEventListener('click', handleListFilter);
        
        // Add event listener for share button
        const shareBtn = listItem.querySelector('.list-share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openShareListModal(list.id);
            });
        }
        
        // Insert before "Add List" button
        DOM.listContainer.insertBefore(listItem, DOM.addListBtn.parentElement);
    });
    
    // Update list dropdown in task detail
    DOM.taskList.innerHTML = '';
    if (AppState.lists.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = t('no_list_available');
        DOM.taskList.appendChild(option);
    } else {
        AppState.lists.forEach(list => {
            const option = document.createElement('option');
            option.value = list.id;
            option.textContent = list.name;
            DOM.taskList.appendChild(option);
        });
    }
}

function handleAddListClick(e) {
    e.preventDefault();
    
    // Show modal using Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('addListModal'));
    modal.show();
}

async function handleSaveList() {
    const name = DOM.listName.value.trim();
    const color = DOM.listColor.value;
    
    if (!name) {
        showInfoModal(t('list_name_required'), t('hint_title'));
        return;
    }
    
    try {
        const newList = await API.createList({ name, color });
        AppState.lists.push(newList);
        renderLists();

        DOM.listName.value = '';
        DOM.listColor.value = '#3498db';

        const modal = bootstrap.Modal.getInstance(document.getElementById('addListModal'));
        modal.hide();
        showNotification(t('list_created'), 'success');
    } catch (error) {
        showInfoModal(error.message || t('list_create_failed'), t('hint_title'));
    }
}

// ========================================
// List Sharing
// ========================================

let currentSharingListId = null;

function openShareListModal(listId) {
    const list = AppState.lists.find(l => l.id === listId);
    if (!list) return;
    
    // Prüfe ob Benutzer der Besitzer ist
    if (list.owner !== AppState.currentUser) {
        showInfoModal(t('share_only_owner'), t('hint_title'));
        return;
    }
    
    currentSharingListId = listId;
    
    // Setze den Listennamen im Modal
    DOM.shareListName.textContent = list.name;
    
    // Zeige bereits geteilte Benutzer an
    renderSharedUsers(list);
    
    // Clear input
    DOM.shareUsername.value = '';
    
    // Open modal
    const modal = new bootstrap.Modal(document.getElementById('shareListModal'));
    modal.show();
}

function renderSharedUsers(list) {
    if (!list.sharedWith || list.sharedWith.length === 0) {
        DOM.sharedUsersContainer.innerHTML = `<p class="text-muted small">${t('not_shared_yet')}</p>`;
        return;
    }
    
    DOM.sharedUsersContainer.innerHTML = '';
    
    list.sharedWith.forEach((share, index) => {
        const userItem = document.createElement('div');
        userItem.className = 'shared-user-row d-flex justify-content-between align-items-center mb-2 p-2';
        userItem.innerHTML = `
            <div>
                <i class="bi bi-person-circle me-2"></i>
                <strong>${share.username}</strong>
                <span class="badge bg-secondary ms-2">${share.permission === 'edit' ? t('share_permission_edit') : t('share_permission_read')}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="removeSharedUser(${index})">
                <i class="bi bi-x-lg"></i>
            </button>
        `;
        DOM.sharedUsersContainer.appendChild(userItem);
    });
}

function handleShareList() {
    const username = DOM.shareUsername.value.trim();
    const permission = document.querySelector('input[name="sharePermission"]:checked').value;
    
    if (!username) {
        showInfoModal(t('share_username_required'), t('hint_title'));
        return;
    }
    
    if (username === AppState.currentUser) {
        showInfoModal(t('share_self_forbidden'), t('hint_title'));
        return;
    }
    
    const list = AppState.lists.find(l => l.id === currentSharingListId);
    if (!list) return;
    
    // Prüfe ob bereits geteilt
    if (list.sharedWith.some(s => s.username === username)) {
        showInfoModal(t('share_already_exists'), t('hint_title'));
        return;
    }
    
    // Füge neuen Share hinzu
    list.sharedWith.push({
        username: username,
        permission: permission,
        sharedAt: new Date().toISOString()
    });
    
    // Speichere in localStorage
    saveSharedLists();
    
    // Re-render
    renderSharedUsers(list);
    renderLists();
    
    // Clear input
    DOM.shareUsername.value = '';
    
    showNotification(t('list_shared_with', { username }), 'success');
}

function removeSharedUser(index) {
    const list = AppState.lists.find(l => l.id === currentSharingListId);
    if (!list) return;
    
    const removedUser = list.sharedWith[index];
    list.sharedWith.splice(index, 1);
    
    // Speichere in localStorage
    saveSharedLists();
    
    // Re-render
    renderSharedUsers(list);
    renderLists();
    
    showNotification(t('list_unshared_with', { username: removedUser.username }), 'info');
}

// Mache removeSharedUser global verfügbar
window.removeSharedUser = removeSharedUser;

// ========================================
// Tag Management
// ========================================

function renderTags() {
    DOM.tagsContainer.innerHTML = '';
    
    AppState.tags.forEach((tag, index) => {
        // Tag Container mit Edit/Delete Buttons
        const tagWrapper = document.createElement('span');
        tagWrapper.className = 'tag-wrapper position-relative d-inline-block';
        tagWrapper.style.marginRight = '8px';
        tagWrapper.style.marginBottom = '8px';
        
        const badge = document.createElement('span');
        badge.className = 'badge tag-badge';
        
        // Setze Custom-Farben mit automatischer Textfarbe
        const textColor = getContrastTextColor(tag.color);
        badge.style.backgroundColor = tag.color;
        badge.style.color = textColor;
        
        badge.textContent = tag.name;
        badge.style.cursor = 'pointer';
        badge.style.paddingRight = '8px';
        
        // Delete button (X icon)
        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'bi bi-x-circle-fill ms-1';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '0.9rem';
        deleteBtn.style.color = textColor; // Icon hat die gleiche Farbe wie Text
        deleteBtn.title = t('tag_delete_title');
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            handleDeleteTag(index);
        };
        
        // Edit on click
        badge.onclick = () => handleEditTag(index);
        
        tagWrapper.appendChild(badge);
        badge.appendChild(deleteBtn);
        DOM.tagsContainer.appendChild(tagWrapper);
    });
    
    // Update tag dropdown in task detail
    DOM.taskTags.innerHTML = `<option value="">${t('select_tag')}</option>`;
    AppState.tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.name;
        option.textContent = tag.name;
        DOM.taskTags.appendChild(option);
    });
}

let editingTagIndex = null;

async function handleSaveTag() {
    const name = DOM.tagName.value.trim().toLowerCase();
    const color = DOM.tagColor.value;
    
    if (!name) {
        showInfoModal(t('tag_name_required'), t('hint_title'));
        return;
    }
    
    // Prüfe ob wir einen Tag bearbeiten
    if (editingTagIndex !== null) {
        const oldTag = AppState.tags[editingTagIndex];
        
        // Prüfe ob neuer Name schon existiert (aber nicht der aktuelle Tag)
        if (AppState.tags.some((t, idx) => t.name === name && idx !== editingTagIndex)) {
            showInfoModal(t('tag_exists'), t('hint_title'));
            return;
        }
        
        try {
            const updatedTag = await API.updateTag(oldTag.name, {
                name,
                color
            });

            AppState.tags[editingTagIndex] = updatedTag;
            AppState.tasks.forEach(task => {
                task.tags = task.tags.map(t => t === oldTag.name ? updatedTag.name : t);
            });

            renderTasks();
            showNotification(t('tag_updated'), 'success');
            editingTagIndex = null;
        } catch (error) {
            showInfoModal(error.message || t('tag_update_failed'), t('hint_title'));
            return;
        }
    } else {
        // Neuer Tag
        // Prüfe ob Tag bereits existiert
        if (AppState.tags.some(t => t.name === name)) {
            showInfoModal(t('tag_exists'), t('hint_title'));
            return;
        }
        
        try {
            const newTag = await API.createTag({
                name,
                color
            });
            AppState.tags.push(newTag);
            showNotification(t('tag_created'), 'success');
        } catch (error) {
            showInfoModal(error.message || t('tag_create_failed'), t('hint_title'));
            return;
        }
    }
    
    // Re-render tags
    renderTags();
    
    // Clear form
    DOM.tagName.value = '';
    DOM.tagColor.value = '#dc3545';
    
    // Reset Modal Title
    document.querySelector('#addTagModal .modal-title').textContent = t('add_new_tag');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTagModal'));
    modal.hide();
}

function handleEditTag(index) {
    const tag = AppState.tags[index];
    
    // Set editing mode
    editingTagIndex = index;
    
    // Fill form
    DOM.tagName.value = tag.name;
    DOM.tagColor.value = tag.color;
    
    // Update preview
    updateTagPreview(tag.name, tag.color);
    
    // Change modal title
    document.querySelector('#addTagModal .modal-title').textContent = t('edit_tag');
    
    // Open modal
    const modal = new bootstrap.Modal(document.getElementById('addTagModal'));
    modal.show();
}

async function handleDeleteTag(index) {
    const tag = AppState.tags[index];
    
    const confirmed = await showConfirmModal(
        t('tag_delete_confirm', { tag: tag.name }),
        t('tag_delete_title')
    );
    
    if (!confirmed) {
        return;
    }
    
    try {
        await API.deleteTag(tag.name);

        AppState.tasks.forEach(task => {
            task.tags = task.tags.filter(t => t !== tag.name);
        });
        AppState.tags.splice(index, 1);

        renderTags();
        renderTasks();
        showNotification(t('tag_deleted'), 'info');
    } catch (error) {
        showInfoModal(error.message || t('tag_delete_failed'), t('hint_title'));
    }
}

// ========================================
// Theme Management
// ========================================

function loadTheme() {
    // Lade Theme aus localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    AppState.theme = savedTheme;
    
    // Setze data-theme Attribut
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Setze Radio Button
    if (savedTheme === 'dark') {
        DOM.themeDark.checked = true;
    } else {
        DOM.themeLight.checked = true;
    }
}

function handleThemeChange(e) {
    const newTheme = e.target.value;
    AppState.theme = newTheme;
    
    // Setze data-theme Attribut
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Speichere in localStorage
    localStorage.setItem('theme', newTheme);
    
    const mode = newTheme === 'dark' ? t('theme_mode_dark') : t('theme_mode_light');
    showNotification(t('theme_changed', { mode }), 'success');
}

function handleLanguageChange(e) {
    const nextLanguage = e.target.value;
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) {
        return;
    }

    AppState.language = nextLanguage;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, nextLanguage);
    applyLanguage();
    renderLists();
    renderTags();
    renderTasks();
    updateTagPreview(DOM.tagName.value, DOM.tagColor.value);
    syncDetailLayoutState();
}

// ========================================
// Utility Functions
// ========================================

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(getLocale(), options);
}

function showNotification(message, type = 'info') {
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

    let container = document.getElementById('appToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'appToastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1080';
        document.body.appendChild(container);
    }

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
    container.appendChild(toast);
    const toastInstance = new bootstrap.Toast(toast, { delay: 3200 });
    toastInstance.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

async function handleLogout(e) {
    e.preventDefault();
    
    const confirmed = await showConfirmModal(
        t('logout_confirm'),
        t('logout_title')
    );
    
    if (confirmed) {
        // Rufe globale logout() Funktion aus auth.js auf
        if (typeof window.logout === 'function') {
            window.logout();
        } else {
            console.error('Logout function not available');
            window.location.href = 'login.html';
        }
    }
}

// ========================================
// API Integration
// ========================================

const API = {
    baseURL: '/api',

    async request(path, init = {}) {
        const headers = { ...(init.headers || {}) };
        const requestInit = {
            method: init.method || 'GET',
            credentials: 'include',
            headers
        };

        if (init.body !== undefined) {
            headers['Content-Type'] = 'application/json';
            requestInit.body = JSON.stringify(init.body);
        }

        const response = await fetch(`${this.baseURL}${path}`, requestInit);
        let body = null;
        try {
            body = await response.json();
        } catch {
            body = null;
        }

        if (!response.ok) {
            const message = body?.error || t('api_failed', { status: response.status });
            const error = new Error(message);
            error.status = response.status;
            throw error;
        }
        return body;
    },

    async getTasks() {
        return this.request('/tasks');
    },

    async createTask(task) {
        return this.request('/tasks', { method: 'POST', body: task });
    },

    async updateTask(id, updates) {
        return this.request(`/tasks/${id}`, { method: 'PUT', body: updates });
    },

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, { method: 'DELETE' });
    },

    async getLists() {
        return this.request('/lists');
    },

    async createList(list) {
        return this.request('/lists', { method: 'POST', body: list });
    },

    async getTags() {
        return this.request('/tags');
    },

    async createTag(tag) {
        return this.request('/tags', { method: 'POST', body: tag });
    },

    async updateTag(tagName, payload) {
        const encodedTag = encodeURIComponent(tagName);
        return this.request(`/tags/${encodedTag}`, { method: 'PUT', body: payload });
    },

    async deleteTag(tagName) {
        const encodedTag = encodeURIComponent(tagName);
        return this.request(`/tags/${encodedTag}`, { method: 'DELETE' });
    }
};

// ========================================
// Export for potential module usage
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, API };
}
