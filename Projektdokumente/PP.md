# PowerPoint-Informationsquelle: ToDo-Liste / Taskboard

Diese Datei ist als Grundlage fuer eine PowerPoint gedacht. Sie ist bewusst so geschrieben, dass auch externe Kunden ohne tiefe technische Vorkenntnisse verstehen, was das Projekt leistet, warum bestimmte Entscheidungen getroffen wurden und welche Mockups/Screenshots sinnvoll eingesetzt werden koennen.

## Kurzfassung fuer die Praesentation

Unser Projekt ist eine webbasierte ToDo-Listen-Anwendung. Nutzer koennen sich registrieren, anmelden, Aufgaben erstellen, Listen und Tags organisieren, Faelligkeiten setzen und ihre Aufgaben in verschiedenen Ansichten betrachten. Die Anwendung besteht aus einem modernen Frontend, einem Python/Flask-Backend und einer MariaDB-Datenbank. Dadurch ist sie nicht nur ein Design-Mockup, sondern eine lauffaehige Web-App mit echter Datenhaltung, Authentifizierung und API-Kommunikation.

Der fachliche Nutzen liegt darin, Aufgaben zentral, uebersichtlich und alltagstauglich zu verwalten. Der technische Ansatz wurde bewusst pragmatisch gewaehlt: ein leichtgewichtiges Frontend mit HTML, CSS, Bootstrap und Vanilla JavaScript, ein gut strukturiertes Backend mit Flask, SQLAlchemy und Pydantic sowie Docker Compose fuer eine reproduzierbare lokale Umgebung.

## Zielgruppe und Tonalitaet

- Zielgruppe: Kunden, externe Stakeholder, fachliche Entscheider, nicht zwingend Entwickler.
- Ton: verstaendlich, loesungsorientiert, wenig Fachjargon.
- Kernaussage: Die Anwendung hilft Nutzern, Aufgaben strukturiert zu erfassen, zu priorisieren und wiederzufinden. Die technische Umsetzung ist modular, erweiterbar und sicherheitsbewusst.
- Mockups sollten die Benutzerfuehrung zeigen: Login, Registrierung, Dashboard, Aufgaben-Detailansicht, Kalenderansicht, Listen/Tags.

## Zentrale Botschaften

1. Die Anwendung loest ein alltaegliches Organisationsproblem: Aufgaben gehen in Notizen, Chats oder E-Mails schnell unter.
2. Nutzer bekommen eine zentrale, uebersichtliche Arbeitsflaeche fuer Aufgaben, Listen, Tags und Faelligkeiten.
3. Die Oberflaeche ist bewusst einfach gehalten, damit sie ohne Schulung nutzbar ist.
4. Das Projekt ist technisch in klare Schichten getrennt: Frontend, Backend, Datenbank.
5. Sicherheit wurde von Anfang an beruecksichtigt: Registrierung, Login, Passwort-Hashing, geschuetzte API-Endpunkte.
6. Die Architektur erlaubt spaetere Erweiterungen wie echtes Teilen von Listen, Erinnerungen, Drag-and-Drop oder Team-Funktionen.

---

# Folie 1: Projekttitel

## Titel

ToDo-Liste / Taskboard

## Untertitel

Eine webbasierte Anwendung zur einfachen Verwaltung persoenlicher und arbeitsbezogener Aufgaben.

## Inhalt auf der Folie

- Aufgaben zentral erfassen
- Nach Listen, Tags und Faelligkeit strukturieren
- Auf Desktop, Tablet und Smartphone nutzbar
- Mit Login, Datenbank und echter Backend-Anbindung

## Passendes Mockup

Dashboard-Ansicht der Anwendung, idealerweise mit Sidebar, Aufgabenliste und geoeffneter Detailansicht.

## Sprechtext

"Wir stellen eine ToDo-Listen-Anwendung vor, mit der Nutzer ihre Aufgaben zentral verwalten koennen. Im Fokus steht eine einfache Bedienung: Aufgaben erfassen, sortieren, priorisieren und abhaken. Das Projekt ist nicht nur ein statischer Entwurf, sondern eine lauffaehige Web-App mit Benutzerkonto, Datenbank und Backend."

---

# Folie 2: Ausgangssituation und Problem

## Ziel der Folie

Zeigen, warum eine solche Anwendung gebraucht wird.

## Inhalt auf der Folie

- Aufgaben entstehen an vielen Stellen: E-Mail, Chat, Meetings, private Notizen.
- Ohne zentrale Struktur werden Aufgaben vergessen oder doppelt gepflegt.
- Faelligkeiten, Prioritaeten und Zusammenhaenge sind oft nicht auf einen Blick sichtbar.
- Nutzer brauchen eine einfache, schnelle und verlaessliche Uebersicht.

## Passendes Mockup

Ein Mockup oder Bild, das Unordnung bzw. viele offene Aufgaben zeigt. Alternativ ein "Vorher"-Ausschnitt mit unstrukturierter Liste.

## Sprechtext

"Viele Menschen verwalten Aufgaben heute verteilt ueber mehrere Kanaele. Dadurch fehlt der Ueberblick: Was ist heute wichtig, was kommt spaeter, was ist bereits erledigt? Unsere Anwendung bringt diese Informationen an einen zentralen Ort."

---

# Folie 3: Unsere Loesung

## Ziel der Folie

Das Produkt aus Kundensicht erklaeren.

## Inhalt auf der Folie

- Zentrale Aufgabenverwaltung im Browser
- Aufgaben mit Titel, Beschreibung, Liste, Faelligkeitsdatum und Tag
- Verschiedene Ansichten fuer unterschiedliche Arbeitsweisen:
  - Heute
  - Demnaechst
  - Ueberblick
  - Kalender
- Suche nach Titel oder Beschreibung
- Detailbereich zum schnellen Bearbeiten

## Passendes Mockup

Dashboard mit mehreren Aufgaben, sichtbaren Listen und Tags.

## Sprechtext

"Die Loesung ist ein Taskboard im Browser. Nutzer sehen direkt, was heute relevant ist, koennen in andere Ansichten wechseln und Aufgaben mit wenigen Klicks bearbeiten. Listen und Tags helfen dabei, private und berufliche Themen voneinander zu trennen."

---

# Folie 4: Typischer Nutzerablauf

## Ziel der Folie

Die Anwendung als einfache User Journey darstellen.

## Inhalt auf der Folie

1. Nutzer registriert sich oder meldet sich an.
2. Nutzer legt eine Liste an, zum Beispiel "Arbeit" oder "Privat".
3. Nutzer erstellt eine Aufgabe.
4. Nutzer setzt Faelligkeitsdatum und optional einen Tag.
5. Nutzer findet die Aufgabe in der Heute-, Demnaechst-, Ueberblick- oder Kalenderansicht wieder.
6. Nutzer hakt die Aufgabe ab oder bearbeitet sie in der Detailansicht.

## Passende Mockups

- Registrierung
- Login
- Aufgabe anlegen / Detail-Sidebar
- Kalender- oder Heute-Ansicht

## Sprechtext

"Der Ablauf ist bewusst nah am Alltag gehalten. Erst anmelden, dann Aufgaben erfassen und strukturieren. Danach kann der Nutzer je nach Situation entscheiden: Was muss heute erledigt werden, was steht diese Woche an oder was gehoert zu einer bestimmten Liste?"

---

# Folie 5: Hauptfunktionen

## Ziel der Folie

Die wichtigsten Features kompakt sichtbar machen.

## Inhalt auf der Folie

| Bereich | Funktion |
| --- | --- |
| Aufgaben | Erstellen, bearbeiten, loeschen, erledigt markieren |
| Listen | Eigene Listen mit Namen und Farbe anlegen |
| Tags | Tags mit eigener Farbe erstellen, bearbeiten und loeschen |
| Ansichten | Heute, Demnaechst, Ueberblick, Kalender |
| Suche | Aufgaben nach Titel oder Beschreibung finden |
| Details | Beschreibung, Liste, Faelligkeit und Tag bearbeiten |
| Konto | Registrierung, Login, Logout, Session-Pruefung |
| Darstellung | Responsive Layout, Light-/Dark-Theme |

## Passendes Mockup

Eine zusammengesetzte Folie mit kleinen Ausschnitten aus Dashboard, Tag-Modal, Listen-Modal und Detailbereich.

## Sprechtext

"Die Kernfunktionen decken den kompletten Grundprozess einer Aufgabenverwaltung ab. Wichtig war uns, nicht nur Aufgaben anzuzeigen, sondern sie sinnvoll einordnen zu koennen: nach Listen, Tags, Datum und Status."

---

# Folie 6: Oberflaeche und Bedienkonzept

## Ziel der Folie

Erklaeren, warum die UI so aufgebaut ist.

## Inhalt auf der Folie

- Sidebar links: Navigation, Suche, Listen, Tags und Einstellungen.
- Hauptbereich: Aufgaben der aktuell gewaehlten Ansicht.
- Detailbereich rechts: Aufgabe bearbeiten, ohne die Uebersicht komplett zu verlassen.
- Farben helfen bei Orientierung, z. B. fuer Listen und Tags.
- Bootstrap sorgt fuer konsistente Komponenten und responsive Darstellung.
- Toasts und Modale geben klare Rueckmeldungen bei Aktionen.

## Passendes Mockup

Dashboard mit markierter Sidebar, Aufgabenliste und Detail-Sidebar.

## Sprechtext

"Die Oberflaeche ist in drei Bereiche gegliedert: Orientierung links, Arbeit in der Mitte, Details rechts. Dadurch bleibt die Anwendung uebersichtlich, auch wenn viele Aufgaben vorhanden sind. Farben und Icons unterstuetzen die Orientierung, ohne die Ansicht zu ueberladen."

---

# Folie 7: Kalender- und Fokusansichten

## Ziel der Folie

Zeigen, dass die Anwendung unterschiedliche Arbeitsweisen unterstuetzt.

## Inhalt auf der Folie

- "Heute" zeigt offene Aufgaben fuer den aktuellen Tag und Aufgaben ohne Datum.
- "Demnaechst" zeigt kommende Aufgaben.
- "Ueberblick" zeigt alle Aufgaben.
- "Kalender" ordnet Aufgaben einer Wochenansicht zu.
- Listenfilter und Suche koennen die Ansicht weiter eingrenzen.

## Passendes Mockup

Kalenderansicht mit einer Wochenuebersicht.

## Sprechtext

"Nicht jeder arbeitet gleich. Manche Nutzer wollen nur sehen, was heute wichtig ist. Andere planen eher ueber eine Woche. Deshalb gibt es mehrere Ansichten, die dieselben Aufgaben aus unterschiedlichen Blickwinkeln zeigen."

---

# Folie 8: Architektur einfach erklaert

## Ziel der Folie

Die technische Struktur fuer Nicht-Entwickler verstaendlich machen.

## Inhalt auf der Folie

Die Anwendung besteht aus drei Hauptteilen:

| Schicht | Aufgabe |
| --- | --- |
| Frontend | Alles, was der Nutzer im Browser sieht und bedient |
| Backend | Verarbeitet Logik, prueft Eingaben, schuetzt Daten und stellt API-Endpunkte bereit |
| Datenbank | Speichert Nutzer, Listen, Aufgaben, Tags und Zuordnungen dauerhaft |

Vereinfachter Datenfluss:

Nutzeraktion im Browser -> API-Anfrage -> Backend prueft und verarbeitet -> Datenbank speichert -> Antwort zurueck ins Frontend

## Passendes Mockup

Eine einfache Architektur-Grafik mit drei Bloecken: Frontend, Backend, Datenbank. Pfeile zwischen den Bloecken reichen aus.

## Sprechtext

"Wir haben das Projekt in klare Schichten getrennt. Das Frontend kuemmert sich um die Bedienung, das Backend um Regeln und Sicherheit, die Datenbank um dauerhafte Speicherung. Diese Trennung macht das Projekt wartbarer und spaeter leichter erweiterbar."

---

# Folie 9: Warum diese Technologien?

## Ziel der Folie

Die technischen Entscheidungen in Kundensprache begruenden.

## Inhalt auf der Folie

| Technologie | Warum sie eingesetzt wurde |
| --- | --- |
| HTML/CSS/JavaScript | Direkte, browsernahe Umsetzung ohne schweres Frontend-Framework |
| Bootstrap 5.3.3 | Schneller Aufbau responsiver und vertrauter UI-Komponenten |
| Bootstrap Icons | Einheitliche Icons fuer Navigation und Aktionen |
| Flask | Leichtgewichtiges Python-Framework fuer API und Web-App |
| SQLAlchemy | Strukturierter Zugriff auf die relationale Datenbank |
| Alembic | Versionierte Datenbank-Aenderungen |
| MariaDB | Bewaehrte relationale Datenbank fuer strukturierte Daten |
| Pydantic | Pruefung und klare Struktur von Eingabe- und Ausgabedaten |
| Argon2 | Sicheres Hashing von Passwoertern |
| PyJWT | Sitzungslogik ueber JSON Web Tokens |
| Docker Compose | Einheitliche lokale Entwicklungs- und Demo-Umgebung |
| pytest | Automatisierte Tests fuer Kernfunktionen |

## Passendes Mockup

Keine UI zwingend noetig. Sinnvoll ist eine Stack-Grafik oder Logo-Leiste.

## Sprechtext

"Die Technologien wurden pragmatisch gewaehlt. Wir wollten eine Loesung, die verstaendlich, lauffaehig und erweiterbar ist. Bootstrap beschleunigt die Oberflaeche, Flask haelt das Backend schlank, und Docker Compose sorgt dafuer, dass die Umgebung reproduzierbar gestartet werden kann."

---

# Folie 10: Datenmodell einfach erklaert

## Ziel der Folie

Zeigen, welche Informationen gespeichert werden.

## Inhalt auf der Folie

- Nutzer: E-Mail, Passwort-Hash, Sprache/Theme, Zeitstempel
- Listen: Name, Farbe, Besitzer
- Aufgaben: Titel, Beschreibung, Status, Faelligkeitsdatum, Liste, Besitzer
- Tags: Name und Farbe
- Task-Tags: Verbindung zwischen Aufgaben und Tags
- Listenfreigaben: Datenmodell fuer geteilte Listen ist vorbereitet

## Einfaches Beispiel

Ein Nutzer besitzt die Liste "Arbeit". In dieser Liste liegt die Aufgabe "Praesentation vorbereiten". Die Aufgabe hat ein Faelligkeitsdatum und den Tag "Wichtig".

## Passendes Mockup

Eine vereinfachte Datenmodell-Grafik: Nutzer -> Liste -> Aufgabe -> Tag.

## Sprechtext

"Das Datenmodell bildet genau das ab, was Nutzer in der Oberflaeche sehen: Nutzer haben Listen, Listen enthalten Aufgaben, Aufgaben koennen Tags und Faelligkeiten haben. Dadurch bleiben die Daten strukturiert und koennen spaeter erweitert werden."

---

# Folie 11: Sicherheit und Benutzerkonten

## Ziel der Folie

Vertrauen schaffen und Sicherheitsgrundlagen erklaeren.

## Inhalt auf der Folie

- Registrierung mit E-Mail und Passwort.
- Passwortregeln im Frontend und Backend.
- Passwoerter werden nicht im Klartext gespeichert, sondern mit Argon2 gehasht.
- Login setzt geschuetzte HTTP-only Cookies fuer die Sitzung.
- API-Endpunkte fuer Aufgaben, Listen und Tags sind nur nach Anmeldung erreichbar.
- Token-Refresh sorgt dafuer, dass Sitzungen nutzerfreundlich erneuert werden koennen.
- Logout entfernt die Authentifizierungs-Cookies.

## Passendes Mockup

Login- und Registrierungsansicht, optional mit sichtbarer Passwortstaerke.

## Sprechtext

"Sicherheit wurde nicht erst am Ende betrachtet. Bereits bei Registrierung und Login gibt es Passwortregeln, gehashte Passwoerter und geschuetzte Sitzungs-Cookies. Fachlich bedeutet das: Aufgaben sind an ein Benutzerkonto gebunden und API-Zugriffe werden geprueft."

---

# Folie 12: Vorgehensweise im Projekt

## Ziel der Folie

Erklaeren, wie und warum das Team so vorgegangen ist.

## Inhalt auf der Folie

1. Zuerst wurde die Nutzeroberflaeche und der fachliche Ablauf geplant.
2. Danach wurden Mockups bzw. UI-Entwuerfe fuer die wichtigsten Screens erstellt.
3. Das Frontend wurde mit HTML, CSS, Bootstrap und JavaScript umgesetzt.
4. Anschliessend wurde ein Backend mit REST-API aufgebaut.
5. Datenbankmodelle und Migrationen wurden erstellt, damit Daten dauerhaft gespeichert werden.
6. Authentifizierung, Passwortsicherheit und geschuetzte Routen wurden integriert.
7. Tests pruefen zentrale Funktionen wie Registrierung, Login, Passwortregeln und Task-API.

## Warum diese Reihenfolge?

- Erst die Nutzerperspektive klaeren, damit die Technik das richtige Problem loest.
- Danach die Datenstruktur ableiten, damit Frontend und Backend zusammenpassen.
- Frueh testen, damit wichtige Funktionen bei Aenderungen nicht versehentlich kaputtgehen.

## Passendes Mockup

Timeline-Grafik oder Prozessfolie: Idee -> Mockup -> Frontend -> Backend -> Datenbank -> Tests.

## Sprechtext

"Wir sind bewusst vom Nutzer aus gestartet. Erst wenn klar ist, wie Aufgaben erfasst und bearbeitet werden sollen, lohnt sich die technische Umsetzung. Danach wurden Frontend, Backend und Datenbank Schritt fuer Schritt verbunden."

---

# Folie 13: Qualitaetssicherung

## Ziel der Folie

Zeigen, dass das Projekt ueber eine reine Demo hinaus technisch abgesichert ist.

## Inhalt auf der Folie

- Automatisierte Backend-Tests mit pytest.
- Tests fuer Registrierung, Login, Logout und Token-Refresh.
- Tests fuer Passwort-Hashing und Passwortregeln.
- Tests fuer Aufgaben-, Listen- und Tag-API.
- Pydantic validiert API-Daten, damit fehlerhafte Eingaben abgefangen werden.
- Alembic dokumentiert Datenbank-Aenderungen nachvollziehbar.
- Docker Compose macht lokale Starts und Demos reproduzierbar.

## Passendes Mockup

Optional ein Screenshot der Testausgabe oder eine kleine Qualitaets-Checkliste.

## Sprechtext

"Neben der Oberflaeche haben wir auch technische Qualitaet beruecksichtigt. Tests pruefen zentrale Backend-Funktionen. Validierung und Datenbankmigrationen helfen, Fehler frueh zu erkennen und Aenderungen nachvollziehbar zu machen."

---

# Folie 14: Aktueller Stand

## Ziel der Folie

Transparent zeigen, was umgesetzt ist und was vorbereitet ist.

## Umgesetzt

- Login, Registrierung, Logout
- Geschuetzte Startseite mit Session-Pruefung
- Aufgaben erstellen, bearbeiten, loeschen und abhaken
- Listen erstellen und loeschen
- Tags erstellen, bearbeiten und loeschen
- Ansichten: Heute, Demnaechst, Ueberblick, Kalender
- Suche und Listenfilter
- Detail-Sidebar fuer Aufgaben
- Light-/Dark-Theme
- REST-API fuer Auth, Tasks, Lists und Tags
- MariaDB-Datenmodell mit Migrationen
- Docker-Setup und Seed-Daten fuer lokale Demo
- Backend-Tests fuer zentrale Funktionen

## Vorbereitet / teilweise umgesetzt

- Listenfreigaben sind im Datenmodell vorbereitet.
- In der Oberflaeche gibt es ein Teilen-Modal; die dauerhafte Backend-API fuer das aktive Teilen von Listen ist noch ein naechster Ausbauschritt.
- Theme und Locale sind im User-Modell vorgesehen; aktuell wird das Theme im Browser gespeichert.

## Passendes Mockup

Feature-Uebersicht mit Haken oder ein Dashboard-Screenshot.

## Sprechtext

"Der aktuelle Stand deckt den Kern einer ToDo-Anwendung ab. Einige Erweiterungen sind bereits vorbereitet, zum Beispiel geteilte Listen. Das ist wichtig, weil die Architektur damit nicht in einer Sackgasse endet, sondern auf Wachstum ausgelegt ist."

---

# Folie 15: Demo-Ablauf fuer die Praesentation

## Ziel der Folie

Einen einfachen Ablauf fuer eine Live-Demo oder Screenshot-Strecke definieren.

## Demo-Schritte

1. Registrierung oder Login zeigen.
2. Dashboard oeffnen und die vier Hauptansichten erklaeren.
3. Neue Liste erstellen, z. B. "Kundenprojekt".
4. Neuen Tag erstellen, z. B. "Wichtig".
5. Neue Aufgabe anlegen.
6. Aufgabe in der Detailansicht bearbeiten: Beschreibung, Liste, Faelligkeitsdatum, Tag.
7. Aufgabe in der Heute- oder Kalenderansicht wiederfinden.
8. Aufgabe als erledigt markieren.
9. Kurz Logout zeigen.

## Passende Mockups

Falls keine Live-Demo genutzt wird, reichen Screenshots dieser Schritte als Storyboard.

## Sprechtext

"Die Demo sollte nicht alle technischen Details zeigen, sondern den Nutzen nachvollziehbar machen: Aufgabe anlegen, einordnen, wiederfinden und erledigen. Das ist der Kernprozess der Anwendung."

---

# Folie 16: Nutzen fuer Kunden / Anwender

## Ziel der Folie

Den fachlichen Mehrwert zusammenfassen.

## Inhalt auf der Folie

- Weniger vergessene Aufgaben durch zentrale Ablage.
- Bessere Priorisierung durch Heute-, Demnaechst- und Kalenderansicht.
- Schnellere Orientierung durch Listen, Tags und Farben.
- Einfache Bedienung durch vertraute Web-Komponenten.
- Geringe Einstiegshuerde, da die Anwendung im Browser laeuft.
- Technische Basis fuer spaetere Team- und Kollaborationsfunktionen.

## Passendes Mockup

Dashboard-Screenshot mit einer "Heute"-Ansicht und klar sichtbaren Aufgaben.

## Sprechtext

"Der wichtigste Nutzen ist Uebersicht. Nutzer sehen schneller, was relevant ist, und koennen Aufgaben leichter priorisieren. Gleichzeitig ist die technische Basis so aufgebaut, dass spaeter weitere Funktionen sinnvoll ergaenzt werden koennen."

---

# Folie 17: Moegliche Weiterentwicklung

## Ziel der Folie

Perspektive geben und zeigen, dass das Projekt ausbaubar ist.

## Inhalt auf der Folie

- Echte Backend-Funktion fuer Listenfreigaben und Teamarbeit
- Erinnerungen und Benachrichtigungen bei Faelligkeiten
- Drag-and-Drop zum Sortieren von Aufgaben
- Wiederkehrende Aufgaben
- Unteraufgaben
- Prioritaeten getrennt von Tags
- Export oder Druckansicht
- Verbesserte Kalenderfunktionen
- Profilseite fuer Theme, Sprache und Kontoeinstellungen
- Rollen- und Rechtekonzept fuer Teams

## Passendes Mockup

Roadmap-Grafik oder Zukunftsfolie mit drei Phasen: Jetzt, Naechster Schritt, Spaeter.

## Sprechtext

"Die jetzige Version bildet den Kernprozess ab. Darauf aufbauend koennen Funktionen ergaenzt werden, die vor allem fuer Teams oder professionelle Nutzung wichtig sind: Teilen, Erinnerungen, Rollen und bessere Planung."

---

# Folie 18: Abschluss

## Ziel der Folie

Die Kernbotschaft noch einmal klar formulieren.

## Inhalt auf der Folie

- Web-App zur strukturierten Aufgabenverwaltung
- Einfache Bedienung mit klaren Ansichten
- Echte technische Grundlage mit Backend, Datenbank und Authentifizierung
- Modular aufgebaut und erweiterbar
- Geeignet als Basis fuer weitere Produktivitaets- und Teamfunktionen

## Passendes Mockup

Starker finaler Dashboard-Screenshot oder Collage aus Login, Dashboard und Kalender.

## Sprechtext

"Zusammengefasst ist unser Projekt eine solide Grundlage fuer digitales Aufgabenmanagement. Es verbindet eine einfache, verstaendliche Oberflaeche mit einer echten technischen Architektur im Hintergrund. Damit kann die Anwendung sowohl demonstriert als auch sinnvoll weiterentwickelt werden."

---

## Empfohlene Mockups und Screenshots

Diese Screens eignen sich besonders gut fuer die PowerPoint:

| Mockup / Screenshot | Zweck in der Praesentation |
| --- | --- |
| Login-Seite | Zeigt Benutzerkonto und Einstieg |
| Registrierungsseite | Zeigt Onboarding und Passwortregeln |
| Dashboard "Heute" | Wichtigster Produkt-Screen |
| Dashboard mit geoeffneter Detail-Sidebar | Zeigt Bearbeitung ohne Kontextwechsel |
| Kalenderansicht | Zeigt Planung ueber eine Woche |
| Listen-Modal | Zeigt individuelle Strukturierung |
| Tag-Modal | Zeigt Priorisierung/Kategorisierung |
| Einstellungen / Theme | Zeigt Personalisierung |
| Optional: Testausgabe oder Architekturdiagramm | Zeigt technische Reife |

## Einfache Begriffserklaerungen fuer externe Zuhorer

| Begriff | Kundengerechte Erklaerung |
| --- | --- |
| Frontend | Der sichtbare Teil der Anwendung im Browser |
| Backend | Der unsichtbare Teil, der Logik, Sicherheit und Datenverarbeitung uebernimmt |
| API | Schnittstelle, ueber die Frontend und Backend miteinander sprechen |
| Datenbank | Ort, an dem Nutzer, Aufgaben, Listen und Tags dauerhaft gespeichert werden |
| Docker Compose | Werkzeug, um mehrere technische Bausteine gemeinsam und reproduzierbar zu starten |
| Migration | Nachvollziehbare Aenderung an der Datenbankstruktur |
| Passwort-Hashing | Sichere Speicherung von Passwoertern, ohne das echte Passwort abzulegen |
| JWT | Technisches Verfahren, um eine angemeldete Sitzung zu erkennen |

## Quellen im Projekt

Diese Dateien belegen die wichtigsten Aussagen:

- Projektueberblick und Setup: `README.md`
- Docker-Setup: `docker-compose.yml`
- Flask-App und Routing: `backend/app.py`
- Authentifizierung: `backend/routes/auth.py`
- Aufgaben-/Listen-/Tag-API: `backend/routes/todo.py`
- Datenbankverbindung: `backend/database.py`
- Datenmodelle: `backend/models/`
- API-Schemata und Validierung: `backend/schemas/`
- Sicherheitsservices: `backend/services/`
- Migrationen: `backend/migrations/versions/`
- Seed-Daten: `db/init.sql`
- Hauptoberflaeche: `frontend/index.html`
- Login und Registrierung: `frontend/login.html`, `frontend/register.html`
- Frontend-Logik und API-Client: `frontend/js/app.js`
- Auth-Guard im Browser: `frontend/js/auth.js`
- Backend-Tests: `backend/tests/`

## Kurzer Gesamtsprechtext

"Unser Projekt ist eine webbasierte ToDo-Listen-Anwendung. Nutzer koennen sich anmelden, Aufgaben erstellen, diese nach Listen und Tags strukturieren, Faelligkeiten setzen und in verschiedenen Ansichten wiederfinden. Die Bedienung ist bewusst einfach gehalten: links befindet sich die Navigation, in der Mitte die Aufgabenliste und rechts die Detailbearbeitung.

Technisch besteht die Anwendung aus Frontend, Backend und Datenbank. Das Frontend ist mit HTML, CSS, Bootstrap und JavaScript umgesetzt. Das Backend nutzt Python mit Flask und stellt eine REST-API bereit. Die Daten werden in MariaDB gespeichert und ueber SQLAlchemy verarbeitet. Alembic sorgt dafuer, dass Datenbank-Aenderungen versioniert bleiben.

Beim Vorgehen sind wir von der Nutzerperspektive ausgegangen: Erst wurden die zentralen Ablaufe und Mockups geplant, danach Frontend, Backend und Datenbank verbunden. Sicherheit wurde ebenfalls beruecksichtigt: Passwoerter werden mit Argon2 gehasht, API-Endpunkte sind geschuetzt und Sitzungen laufen ueber HTTP-only Cookies.

Der aktuelle Stand deckt die wichtigsten Funktionen einer ToDo-App ab und bildet gleichzeitig eine Grundlage fuer Erweiterungen wie echte Teamfreigaben, Erinnerungen oder wiederkehrende Aufgaben."

