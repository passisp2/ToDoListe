/**
 * Todo List Application - Frontend JavaScript
 * Vorbereitet für Backend-Integration
 */

// ========================================
// Application State
// ========================================

const AppState = {
    tasks: [],
    lists: [
        { id: 'personal', name: 'Personal', color: '#9b59b6', owner: 'admin', sharedWith: [] },
        { id: 'work', name: 'Work', color: '#3498db', owner: 'admin', sharedWith: [] }
    ],
    tags: [
        { name: 'high', color: '#dc3545' },
        { name: 'medium', color: '#ffc107' },
        { name: 'low', color: '#198754' }
    ],
    currentView: 'today',
    selectedTask: null,
    filterQuery: '',
    theme: 'light',
    currentUser: 'admin', // Aktuell eingeloggter Benutzer
    sharedListsData: {} // Speichert Sharing-Informationen pro Liste
};

// ========================================
// Sample Data (wird später vom Backend kommen)
// ========================================

const sampleTasks = [
    {
        id: 1,
        title: 'Task 1',
        description: '',
        completed: false,
        list: 'personal',
        dueDate: null,
        tags: [],
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Task 2',
        description: '',
        completed: false,
        list: 'work',
        dueDate: null,
        tags: [],
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: 'Task 3',
        description: 'This is a sample description for Task 3. It shows how the task detail view works.',
        completed: false,
        list: 'personal',
        dueDate: '2025-11-20',
        tags: ['low'],
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        title: 'Task 4',
        description: '',
        completed: false,
        list: 'work',
        dueDate: null,
        tags: ['medium'],
        createdAt: new Date().toISOString()
    }
];

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
    shareListBtn: document.getElementById('shareListBtn'),
    shareUsername: document.getElementById('shareUsername'),
    shareListName: document.getElementById('shareListName'),
    sharedUsersContainer: document.getElementById('sharedUsersContainer')
};

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Lade Sample-Daten (später vom Backend)
    AppState.tasks = [...sampleTasks];
    
    // Lade aktuellen Benutzer aus Session
    loadCurrentUser();
    
    // Lade geteilte Listen aus localStorage
    loadSharedLists();
    
    // Lade gespeichertes Theme
    loadTheme();
    
    // Render initial view
    renderTasks();
    renderLists();
    renderTags();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Todo List App initialized successfully');
    console.log('Current user:', AppState.currentUser);
}

/**
 * Lädt den aktuellen Benutzer aus der Session
 */
function loadCurrentUser() {
    // Versuche Benutzername aus Session-Cookie zu laden
    if (typeof window.CookieManager !== 'undefined') {
        const session = window.CookieManager.get('todo_session');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                AppState.currentUser = sessionData.username || 'admin';
            } catch (e) {
                AppState.currentUser = 'admin';
            }
        }
    }
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
                    list.owner = shareInfo.owner || AppState.currentUser;
                    list.sharedWith = shareInfo.sharedWith || [];
                } else {
                    list.owner = list.owner || AppState.currentUser;
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
    preview.textContent = tagName || 'Vorschau';
}

// ========================================
// Modal Helper Functions
// ========================================

/**
 * Zeigt ein Info-Modal mit einer Nachricht
 * @param {string} message - Die anzuzeigende Nachricht
 * @param {string} title - Der Modal-Titel (optional)
 */
function showInfoModal(message, title = 'Hinweis') {
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
function showConfirmModal(message, title = 'Bestätigung') {
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
    updateTagPreview('Vorschau', DOM.tagColor.value);
    
    // Reset editingTagIndex when modal closes
    const tagModal = document.getElementById('addTagModal');
    tagModal.addEventListener('hide.bs.modal', () => {
        editingTagIndex = null;
        DOM.tagName.value = '';
        DOM.tagColor.value = '#dc3545';
        updateTagPreview('Vorschau', '#dc3545');
        document.querySelector('#addTagModal .modal-title').textContent = 'Add New Tag';
    });
    
    // Theme
    DOM.themeLight.addEventListener('change', handleThemeChange);
    DOM.themeDark.addEventListener('change', handleThemeChange);
    
    // Logout
    DOM.logoutBtn.addEventListener('click', handleLogout);
}

// ========================================
// Task Rendering
// ========================================

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    DOM.tasksList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        DOM.tasksList.innerHTML = `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-1"></i>
                <p class="mt-2">Keine Aufgaben gefunden</p>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        DOM.tasksList.appendChild(taskElement);
    });
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

function handleAddTask() {
    const newTask = {
        id: Date.now(),
        title: 'Neue Aufgabe',
        description: '',
        completed: false,
        list: 'personal',
        dueDate: null,
        tags: [],
        createdAt: new Date().toISOString()
    };
    
    AppState.tasks.unshift(newTask);
    AppState.selectedTask = newTask.id;
    
    renderTasks();
    openTaskDetail(newTask.id);
    
    // Focus on title input
    setTimeout(() => {
        DOM.taskTitle.select();
    }, 100);
    
    // TODO: Backend API call
    // await API.createTask(newTask);
}

function handleTaskToggle(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        
        // TODO: Backend API call
        // await API.updateTask(taskId, { completed: task.completed });
    }
}

function handleSaveTask(e) {
    e.preventDefault();
    
    const taskId = AppState.selectedTask;
    const task = AppState.tasks.find(t => t.id === taskId);
    
    if (task) {
        task.title = DOM.taskTitle.value;
        task.description = DOM.taskDescription.value;
        task.list = DOM.taskList.value;
        task.dueDate = DOM.taskDueDate.value || null;
        
        // Update tags
        const selectedTag = DOM.taskTags.value;
        if (selectedTag && !task.tags.includes(selectedTag)) {
            task.tags = [selectedTag];
        } else if (!selectedTag) {
            task.tags = [];
        }
        
        renderTasks();
        closeTaskDetail();
        
        // TODO: Backend API call
        // await API.updateTask(taskId, task);
        
        showNotification('Aufgabe gespeichert', 'success');
    }
}

async function deleteTask(taskId) {
    const confirmed = await showConfirmModal(
        'Möchten Sie diese Aufgabe wirklich löschen?',
        'Aufgabe löschen'
    );
    
    if (confirmed) {
        AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
        renderTasks();
        closeTaskDetail();
        
        // TODO: Backend API call
        // await API.deleteTask(taskId);
        
        showNotification('Aufgabe gelöscht', 'info');
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
    DOM.taskList.value = task.list || 'personal';
    DOM.taskDueDate.value = task.dueDate || '';
    DOM.taskTags.value = task.tags[0] || '';
    
    // Show sidebar
    DOM.taskDetailSidebar.classList.remove('d-none');
    DOM.taskDetailSidebar.classList.add('show');
    
    // Adjust main content width on desktop
    const mainContent = document.querySelector('.main-content');
    if (window.innerWidth >= 992) {
        mainContent.classList.remove('col-lg-7', 'centered');
        mainContent.classList.add('col-lg-6');
    }
}

function closeTaskDetail() {
    DOM.taskDetailSidebar.classList.add('d-none');
    DOM.taskDetailSidebar.classList.remove('show');
    AppState.selectedTask = null;
    
    // Reset main content width - zentriere wenn geschlossen
    const mainContent = document.querySelector('.main-content');
    if (window.innerWidth >= 992) {
        mainContent.classList.remove('col-lg-6');
        mainContent.classList.add('col-lg-7', 'centered');
    }
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
    
    // Filter by search query
    if (AppState.filterQuery) {
        const query = AppState.filterQuery.toLowerCase();
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query)
        );
    }
    
    return filtered;
}

function handleSearch(e) {
    AppState.filterQuery = e.target.value;
    renderTasks();
}

function handleViewChange(e) {
    e.preventDefault();
    
    const view = e.currentTarget.dataset.view;
    AppState.currentView = view;
    
    // Update active state
    document.querySelectorAll('[data-view]').forEach(link => {
        link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Update page title
    const titles = {
        'today': 'Today',
        'upcoming': 'Upcoming',
        'overview': 'Overview',
        'calender': 'Calender'
    };
    DOM.pageTitle.textContent = titles[view] || 'Today';
    
    renderTasks();
}

function handleListFilter(e) {
    e.preventDefault();
    
    const listId = e.currentTarget.dataset.list;
    
    // TODO: Implement list filtering
    console.log('Filter by list:', listId);
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
        const isOwner = list.owner === AppState.currentUser;
        const sharedIcon = isShared ? '<i class="bi bi-people-fill text-muted ms-1" title="Geteilt"></i>' : '';
        const shareButton = isOwner ? `<i class="bi bi-share list-share-btn" data-list-id="${list.id}" title="Liste teilen"></i>` : '';
        
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
        
        // Add event listener for list filter
        listItem.querySelector('a').addEventListener('click', handleListFilter);
        
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
    AppState.lists.forEach(list => {
        const option = document.createElement('option');
        option.value = list.id;
        option.textContent = list.name;
        DOM.taskList.appendChild(option);
    });
}

function handleAddListClick(e) {
    e.preventDefault();
    
    // Show modal using Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('addListModal'));
    modal.show();
}

function handleSaveList() {
    const name = DOM.listName.value.trim();
    const color = DOM.listColor.value;
    
    if (!name) {
        showInfoModal('Bitte geben Sie einen Namen für die Liste ein.', 'Fehler');
        return;
    }
    
    const newList = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        color: color,
        owner: AppState.currentUser,
        sharedWith: []
    };
    
    AppState.lists.push(newList);
    
    // Re-render lists (includes sidebar and dropdown)
    renderLists();
    
    // Clear form
    DOM.listName.value = '';
    DOM.listColor.value = '#3498db';
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addListModal'));
    modal.hide();
    
    // TODO: Backend API call
    // await API.createList(newList);
    
    showNotification('Liste erstellt', 'success');
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
        showInfoModal('Sie können nur eigene Listen teilen.', 'Fehler');
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
        DOM.sharedUsersContainer.innerHTML = '<p class="text-muted small">Diese Liste wurde noch nicht geteilt.</p>';
        return;
    }
    
    DOM.sharedUsersContainer.innerHTML = '';
    
    list.sharedWith.forEach((share, index) => {
        const userItem = document.createElement('div');
        userItem.className = 'd-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded';
        userItem.innerHTML = `
            <div>
                <i class="bi bi-person-circle me-2"></i>
                <strong>${share.username}</strong>
                <span class="badge bg-secondary ms-2">${share.permission === 'edit' ? 'Bearbeiten' : 'Ansehen'}</span>
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
        showInfoModal('Bitte geben Sie einen Benutzernamen ein.', 'Fehler');
        return;
    }
    
    if (username === AppState.currentUser) {
        showInfoModal('Sie können die Liste nicht mit sich selbst teilen.', 'Fehler');
        return;
    }
    
    const list = AppState.lists.find(l => l.id === currentSharingListId);
    if (!list) return;
    
    // Prüfe ob bereits geteilt
    if (list.sharedWith.some(s => s.username === username)) {
        showInfoModal('Diese Liste wurde bereits mit diesem Benutzer geteilt.', 'Fehler');
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
    
    showNotification(`Liste mit ${username} geteilt`, 'success');
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
    
    showNotification(`Liste nicht mehr mit ${removedUser.username} geteilt`, 'info');
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
        deleteBtn.title = 'Tag löschen';
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
    DOM.taskTags.innerHTML = '<option value="">Select tag...</option>';
    AppState.tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag.name;
        option.textContent = tag.name;
        DOM.taskTags.appendChild(option);
    });
}

let editingTagIndex = null;

function handleSaveTag() {
    const name = DOM.tagName.value.trim().toLowerCase();
    const color = DOM.tagColor.value;
    
    if (!name) {
        showInfoModal('Bitte geben Sie einen Namen für den Tag ein.', 'Fehler');
        return;
    }
    
    // Prüfe ob wir einen Tag bearbeiten
    if (editingTagIndex !== null) {
        const oldTag = AppState.tags[editingTagIndex];
        
        // Prüfe ob neuer Name schon existiert (aber nicht der aktuelle Tag)
        if (AppState.tags.some((t, idx) => t.name === name && idx !== editingTagIndex)) {
            showInfoModal('Dieser Tag existiert bereits.', 'Fehler');
            return;
        }
        
        // Update Tag
        AppState.tags[editingTagIndex] = {
            name: name,
            color: color
        };
        
        // Update alle Tasks mit diesem Tag
        AppState.tasks.forEach(task => {
            task.tags = task.tags.map(t => t === oldTag.name ? name : t);
        });
        
        renderTasks();
        showNotification('Tag aktualisiert', 'success');
        editingTagIndex = null;
    } else {
        // Neuer Tag
        // Prüfe ob Tag bereits existiert
        if (AppState.tags.some(t => t.name === name)) {
            showInfoModal('Dieser Tag existiert bereits.', 'Fehler');
            return;
        }
        
        const newTag = {
            name: name,
            color: color
        };
        
        AppState.tags.push(newTag);
        
        // TODO: Backend API call
        // await API.createTag(newTag);
        
        showNotification('Tag erstellt', 'success');
    }
    
    // Re-render tags
    renderTags();
    
    // Clear form
    DOM.tagName.value = '';
    DOM.tagColor.value = 'danger';
    
    // Reset Modal Title
    document.querySelector('#addTagModal .modal-title').textContent = 'Add New Tag';
    
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
    document.querySelector('#addTagModal .modal-title').textContent = 'Tag bearbeiten';
    
    // Open modal
    const modal = new bootstrap.Modal(document.getElementById('addTagModal'));
    modal.show();
}

async function handleDeleteTag(index) {
    const tag = AppState.tags[index];
    
    const confirmed = await showConfirmModal(
        `Möchten Sie den Tag "${tag.name}" wirklich löschen?\nEr wird aus allen Tasks entfernt.`,
        'Tag löschen'
    );
    
    if (!confirmed) {
        return;
    }
    
    // Remove tag from all tasks
    AppState.tasks.forEach(task => {
        task.tags = task.tags.filter(t => t !== tag.name);
    });
    
    // Remove tag
    AppState.tags.splice(index, 1);
    
    // Re-render
    renderTags();
    renderTasks();
    
    // TODO: Backend API call
    // await API.deleteTag(tag.name);
    
    showNotification('Tag gelöscht', 'info');
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
    
    showNotification(`Theme zu ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'} geändert`, 'success');
}

// ========================================
// Utility Functions
// ========================================

function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('de-DE', options);
}

function showNotification(message, type = 'info') {
    // TODO: Implement toast notifications with Bootstrap
    console.log(`[${type.toUpperCase()}] ${message}`);
}

async function handleLogout(e) {
    e.preventDefault();
    
    const confirmed = await showConfirmModal(
        'Möchten Sie sich wirklich abmelden?',
        'Abmelden'
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
// API Integration (Vorbereitet für Backend)
// ========================================

const API = {
    baseURL: '/api', // Wird später konfiguriert
    
    // Tasks
    async getTasks() {
        // return await fetch(`${this.baseURL}/tasks`).then(r => r.json());
        return AppState.tasks;
    },
    
    async createTask(task) {
        // return await fetch(`${this.baseURL}/tasks`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(task)
        // }).then(r => r.json());
        console.log('API: Create task', task);
    },
    
    async updateTask(id, updates) {
        // return await fetch(`${this.baseURL}/tasks/${id}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(updates)
        // }).then(r => r.json());
        console.log('API: Update task', id, updates);
    },
    
    async deleteTask(id) {
        // return await fetch(`${this.baseURL}/tasks/${id}`, {
        //     method: 'DELETE'
        // }).then(r => r.json());
        console.log('API: Delete task', id);
    },
    
    // Lists
    async getLists() {
        // return await fetch(`${this.baseURL}/lists`).then(r => r.json());
        return AppState.lists;
    },
    
    async createList(list) {
        // return await fetch(`${this.baseURL}/lists`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(list)
        // }).then(r => r.json());
        console.log('API: Create list', list);
    }
};

// ========================================
// Export for potential module usage
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, API };
}
