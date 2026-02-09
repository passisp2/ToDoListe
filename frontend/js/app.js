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
        { id: 'personal', name: 'Personal', color: '#9b59b6' },
        { id: 'work', name: 'Work', color: '#3498db' }
    ],
    tags: ['high', 'medium', 'low'],
    currentView: 'today',
    selectedTask: null,
    filterQuery: ''
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
    logoutBtn: document.getElementById('logoutBtn')
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
    
    // Render initial view
    renderTasks();
    renderLists();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Todo List App initialized successfully');
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
                badge.className = `badge list-${task.list}`;
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
        task.tags.forEach(tag => {
            const tagBadge = document.createElement('span');
            tagBadge.className = `badge tag-${tag}`;
            tagBadge.textContent = tag;
            metaDiv.appendChild(tagBadge);
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

function deleteTask(taskId) {
    if (confirm('Möchten Sie diese Aufgabe wirklich löschen?')) {
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
    if (window.innerWidth >= 992) {
        document.querySelector('.main-content').classList.remove('col-lg-7');
        document.querySelector('.main-content').classList.add('col-lg-6');
    }
}

function closeTaskDetail() {
    DOM.taskDetailSidebar.classList.add('d-none');
    DOM.taskDetailSidebar.classList.remove('show');
    AppState.selectedTask = null;
    
    // Reset main content width
    if (window.innerWidth >= 992) {
        document.querySelector('.main-content').classList.remove('col-lg-6');
        document.querySelector('.main-content').classList.add('col-lg-7');
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
    const listItems = DOM.listContainer.querySelectorAll('[data-list]');
    
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
        alert('Bitte geben Sie einen Namen für die Liste ein.');
        return;
    }
    
    const newList = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        color: color
    };
    
    AppState.lists.push(newList);
    
    // Add to sidebar
    const listItem = document.createElement('li');
    listItem.className = 'nav-item';
    listItem.innerHTML = `
        <a class="nav-link" href="#" data-list="${newList.id}">
            <span class="badge rounded-circle me-2" style="background-color: ${newList.color};">&nbsp;</span>
            ${newList.name}
        </a>
    `;
    
    // Insert before "Add List" button
    DOM.listContainer.insertBefore(listItem, DOM.addListBtn.parentElement);
    
    // Re-render lists
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

function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Möchten Sie sich wirklich abmelden?')) {
        // TODO: Backend API call for logout
        // await API.logout();
        
        console.log('Logged out');
        // Redirect to login page or clear session
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
