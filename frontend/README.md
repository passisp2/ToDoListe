# Todo Liste - Frontend

Eine moderne, responsive Todo-Listen-Anwendung gebaut mit **Bootstrap 5.3.3** und Vanilla JavaScript.

## 📋 Features

### ✅ Implementiert

- **Responsive Design** - Funktioniert auf Desktop, Tablet und Mobile
- **Task Management**
  - Aufgaben erstellen, bearbeiten und löschen
  - Aufgaben als erledigt markieren
  - Aufgabenbeschreibungen
  - Fälligkeitsdaten
  - Tags (high, medium, low)
- **Listen**
  - Personal und Work Listen vordefiniert
  - Eigene Listen erstellen mit individuellen Farben
- **Views**
  - Today - Aufgaben für heute
  - Upcoming - Zukünftige Aufgaben
  - Overview - Alle Aufgaben
  - Calender - Aufgaben mit Datum
- **Suche** - Aufgaben nach Titel oder Beschreibung durchsuchen
- **Detail-Sidebar** - Detaillierte Aufgabenansicht mit allen Informationen

### 🔄 Vorbereitet für Backend-Integration

Das Frontend ist vollständig vorbereitet für die Backend-Integration:

- **API-Modul** in `js/app.js` mit vorbereiteten Endpunkten
- Alle CRUD-Operationen haben API-Aufrufe vorbereitet (aktuell auskommentiert)
- State Management für lokale Daten
- Klare Trennung zwischen UI und Datenlogik

## 🚀 Installation & Start

### Voraussetzungen

- Ein moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Ein lokaler Webserver (optional für Entwicklung)

### Methode 1: Direktes Öffnen

Öffnen Sie einfach die `index.html` Datei in Ihrem Browser:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Methode 2: Mit lokalem Webserver (empfohlen)

#### Python

```bash
# Python 3
python -m http.server 8000

# Öffnen Sie http://localhost:8000
```

#### Node.js (mit npx)

```bash
npx http-server -p 8000

# Öffnen Sie http://localhost:8000
```

#### Live Server (VS Code Extension)

1. Installieren Sie die "Live Server" Extension in VS Code
2. Rechtsklick auf `index.html`
3. Wählen Sie "Open with Live Server"

## 📁 Projektstruktur

```
frontend/
├── index.html          # Haupt-HTML-Datei
├── css/
│   └── style.css      # Custom Styling
├── js/
│   └── app.js         # Anwendungslogik
└── README.md          # Diese Datei
```

## 🎨 Design

Das Design basiert auf modernen UI/UX Prinzipien:

- **Klare Hierarchie** - Wichtige Elemente sind gut sichtbar
- **Konsistente Farben** - Bootstrap-Farbpalette mit Custom-Erweiterungen
- **Intuitive Navigation** - Sidebar mit klaren Kategorien
- **Responsive Layout** - Anpassung an alle Bildschirmgrößen
- **Accessibility** - Semantisches HTML und ARIA-Labels

## 🔧 Technologie-Stack

- **HTML5** - Semantisches Markup
- **Bootstrap 5.3.3** - UI Framework
- **Bootstrap Icons** - Icon-Bibliothek
- **Vanilla JavaScript (ES6+)** - Keine Framework-Abhängigkeiten
- **CSS3** - Custom Styling und Animationen

## 🔌 Backend-Integration

### API-Endpunkte vorbereitet

Das Frontend erwartet folgende API-Endpunkte:

#### Tasks

```javascript
GET    /api/tasks           # Alle Aufgaben abrufen
POST   /api/tasks           # Neue Aufgabe erstellen
PUT    /api/tasks/:id       # Aufgabe aktualisieren
DELETE /api/tasks/:id       # Aufgabe löschen
```

#### Lists

```javascript
GET    /api/lists           # Alle Listen abrufen
POST   /api/lists           # Neue Liste erstellen
```

### Datenstruktur

#### Task Object

```javascript
{
  id: Number,              // Eindeutige ID
  title: String,           // Aufgabentitel
  description: String,     // Beschreibung
  completed: Boolean,      // Status
  list: String,            // Listen-ID (z.B. 'personal')
  dueDate: String|null,    // ISO-Datum (YYYY-MM-DD)
  tags: Array<String>,     // Tags (z.B. ['high', 'medium'])
  createdAt: String        // ISO-Timestamp
}
```

#### List Object

```javascript
{
  id: String,              // Listen-ID
  name: String,            // Listen-Name
  color: String            // Hex-Farbe (z.B. '#9b59b6')
}
```

### Integration durchführen

1. Öffnen Sie `js/app.js`
2. Suchen Sie nach `// TODO: Backend API call`
3. Entfernen Sie die Kommentare bei den API-Aufrufen
4. Konfigurieren Sie `API.baseURL` mit Ihrer Backend-URL
5. Implementieren Sie Error Handling und Loading States

Beispiel:

```javascript
// Vorher (auskommentiert)
// await API.updateTask(taskId, { completed: task.completed });

// Nachher (aktiviert mit Error Handling)
try {
  await API.updateTask(taskId, { completed: task.completed });
  showNotification('Aufgabe aktualisiert', 'success');
} catch (error) {
  console.error('Fehler beim Aktualisieren:', error);
  showNotification('Fehler beim Speichern', 'error');
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 991px
- **Desktop**: ≥ 992px

## 🎯 Best Practices implementiert

### HTML

- ✅ Semantisches HTML5
- ✅ ARIA-Labels für Accessibility
- ✅ Meta-Tags für SEO und Mobile
- ✅ Bootstrap-konforme Struktur

### CSS

- ✅ CSS Custom Properties (Variablen)
- ✅ Mobile-First Ansatz
- ✅ BEM-ähnliche Namenskonvention
- ✅ Kommentierte Sektionen
- ✅ Optimierte Animationen

### JavaScript

- ✅ ES6+ Syntax
- ✅ Modulare Struktur
- ✅ Event Delegation
- ✅ State Management
- ✅ Kommentierte Funktionen
- ✅ Prepared Statements für API
- ✅ Error Handling vorbereitet

## 🔒 Sicherheit

Für die Produktion beachten Sie:

- [ ] CSRF-Token implementieren
- [ ] XSS-Schutz (Input Sanitization)
- [ ] HTTPS verwenden
- [ ] API-Authentication (JWT, OAuth)
- [ ] Rate Limiting
- [ ] Content Security Policy

## 🚧 Erweiterungsmöglichkeiten

### Kurzfristig

- [ ] Drag & Drop für Tasks
- [ ] Multi-Select für Batch-Operationen
- [ ] Keyboard Shortcuts
- [ ] Toast Notifications
- [ ] Dark Mode Toggle
- [ ] Task Prioritäten
- [ ] Subtasks

### Mittelfristig

- [ ] Kalender-View mit Drag & Drop
- [ ] Recurring Tasks
- [ ] File Attachments
- [ ] Comments/Notes
- [ ] Task Templates
- [ ] Export/Import (JSON, CSV)
- [ ] Offline Support (Service Worker)

### Langfristig

- [ ] Team Collaboration
- [ ] Real-time Updates (WebSockets)
- [ ] Activity Timeline
- [ ] Analytics Dashboard
- [ ] Mobile Apps (React Native, Flutter)
- [ ] Desktop Apps (Electron)
- [ ] AI-powered Task Suggestions

## 🐛 Bekannte Limitierungen

- Aktuell nur lokale Datenspeicherung (wird beim Neuladen zurückgesetzt)
- Keine Authentifizierung implementiert
- Keine Backend-Verbindung (vorbereitet aber nicht aktiv)

## 📝 Lizenz

Dieses Projekt ist frei verwendbar für private und kommerzielle Zwecke.

## 👨‍💻 Entwicklung

### Code-Style

- Einrückung: 4 Spaces
- Quotes: Single Quotes für JS, Double Quotes für HTML
- Semicolons: Ja
- Kommentare: Deutsch und Englisch gemischt

### Git Workflow

```bash
# Feature Branch erstellen
git checkout -b feature/neue-funktion

# Änderungen committen
git add .
git commit -m "feat: Neue Funktion hinzugefügt"

# Pushen und Pull Request erstellen
git push origin feature/neue-funktion
```

## 📞 Support

Bei Fragen oder Problemen:

1. Überprüfen Sie die Browser-Konsole auf Fehler
2. Stellen Sie sicher, dass alle Dateien korrekt geladen werden
3. Testen Sie mit einem anderen Browser
4. Überprüfen Sie die Network-Requests (F12 > Network Tab)

## 🎉 Viel Erfolg!

Dieses Frontend ist production-ready und wartet nur noch auf die Backend-Integration!
