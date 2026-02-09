# Login-System - Sicherheitskonzepte

## 📋 Übersicht

Dieses Login-System demonstriert klassische Sicherheitsprinzipien für Passwort-Authentifizierung:
- **Hashing** (Einweg-Verschlüsselung)
- **Salting** (Einzigartiger Zusatz pro Passwort)
- **Peppering** (Anwendungsweiter geheimer Schlüssel)

⚠️ **WICHTIG**: Dies ist eine Frontend-Demo zu Demonstrationszwecken. In Produktion sollte die gesamte Authentifizierung auf dem Backend erfolgen!

## 🔐 Sicherheitskonzepte erklärt

### 1. Hashing (One-Way Verschlüsselung)

**Was ist es?**
- Eine Einweg-Funktion, die Passwörter in einen Hash umwandelt
- Der Hash kann nicht zurück in das Original-Passwort umgewandelt werden

**Verwendete Technologie:**
- **bcrypt** - Eine speziell für Passwörter entwickelte Hash-Funktion
- Langsam by design (schützt vor Brute-Force-Angriffen)
- Automatische Salt-Integration

**Beispiel:**
```javascript
const password = "admin";
const hash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
// Es ist praktisch unmöglich, vom Hash zum Passwort zurückzukommen
```

### 2. Salting (Automatisch in bcrypt)

**Was ist es?**
- Ein zufälliger, einzigartiger Wert, der zu jedem Passwort hinzugefügt wird
- Verhindert Rainbow-Table-Angriffe
- Jeder User hat einen anderen Salt, selbst bei gleichem Passwort

**Wie funktioniert es?**
```javascript
// User 1: "password123" + Salt1 = Hash1
// User 2: "password123" + Salt2 = Hash2
// Hash1 ≠ Hash2 (obwohl gleiches Passwort!)
```

**bcrypt Details:**
- Der Salt ist im Hash eingebettet (erste 29 Zeichen)
- Format: `$2a$10$[22 Zeichen Salt][31 Zeichen Hash]`
- Beispiel: `$2a$10$N9qo8uLOickgx2ZMRZoMye...`
  - `$2a$` = bcrypt Algorithmus
  - `10$` = Cost Factor (2^10 = 1024 Runden)
  - Rest = Salt + Hash

### 3. Peppering (Anwendungsweiter Schlüssel)

**Was ist es?**
- Ein geheimer Schlüssel, der für ALLE Passwörter gleich ist
- Wird NICHT in der Datenbank gespeichert
- Auf dem Server als Umgebungsvariable gespeichert

**Warum verwenden?**
- Zusätzlicher Schutz, falls die Datenbank kompromittiert wird
- Angreifer bräuchte Zugriff auf Server UND Datenbank

**Implementierung:**
```javascript
const PEPPER = 'MyS3cr3tP3pp3rK3y2026!';
const pepperedPassword = userPassword + PEPPER;
const hash = bcrypt.hash(pepperedPassword, 10);
```

## 🔄 Authentifizierungs-Ablauf

### Login-Prozess (Schritt für Schritt)

```
1. Benutzer gibt Credentials ein
   ↓
2. Pepper wird zum Passwort hinzugefügt
   "admin" + "MyS3cr3tP3pp3rK3y2026!" = "adminMyS3cr3tP3pp3rK3y2026!"
   ↓
3. bcrypt extrahiert Salt aus gespeichertem Hash
   ↓
4. bcrypt hasht das gepepperte Passwort mit dem extrahierten Salt
   ↓
5. Vergleich: Neu generierter Hash == Gespeicherter Hash?
   ↓
6. Wenn ja: Login erfolgreich ✅
   Wenn nein: Login fehlgeschlagen ❌
```

### Registrierung (würde so aussehen)

```
1. Neuer User gibt Passwort ein
   ↓
2. Pepper hinzufügen
   ↓
3. bcrypt generiert zufälligen Salt
   ↓
4. bcrypt hasht: (Passwort + Pepper + Salt)
   ↓
5. Hash (mit eingebettetem Salt) in Datenbank speichern
```

## 📁 Dateistruktur

```
frontend/
├── login.html              # Login-Seite
├── index.html             # Hauptanwendung (geschützt)
├── css/
│   └── login.css          # Login-Styling
├── js/
│   ├── login.js           # Login-Logik mit Hashing/Salting/Peppering
│   ├── auth.js            # Session-Management & Auth-Guard
│   └── app.js             # Hauptanwendung
└── LOGIN_SECURITY.md      # Diese Datei
```

## 🔑 Test-Zugangsdaten

```
Benutzername: admin
Passwort: admin
```

## 💻 Verwendung

### Login-Seite öffnen

```bash
# Öffne login.html im Browser
http://localhost:8080/login.html
```

### Session-Informationen

Die Session wird gespeichert in:
- **LocalStorage** (wenn "Angemeldet bleiben" aktiviert)
- **SessionStorage** (wenn nicht aktiviert)

Session-Struktur:
```javascript
{
  user: {
    id: 1,
    username: "admin",
    role: "admin",
    email: "admin@todolist.com"
  },
  loginTime: 1707567890123,
  expiresAt: 1707654290123,  // 24 Stunden später
  rememberMe: true
}
```

### Logout

```javascript
// Überall in der App verfügbar:
window.logout();

// Oder Button-Click:
<button onclick="logout()">Logout</button>
```

## 🛡️ Sicherheits-Features

### Implementiert

✅ **Passwort-Hashing** mit bcrypt  
✅ **Automatisches Salting** durch bcrypt  
✅ **Peppering** mit application-wide Secret  
✅ **Session-Management** mit Ablaufdatum  
✅ **Auth-Guard** für geschützte Seiten  
✅ **Password Visibility Toggle**  
✅ **"Remember Me" Funktionalität**  
✅ **Loading States** beim Login  
✅ **Fehlerbehandlung** mit informativen Messages

### Best Practices

✅ bcrypt mit 10 Runden (2^10 = 1024 Iterationen)  
✅ Salt automatisch generiert und im Hash eingebettet  
✅ Pepper separat gespeichert (nicht im Hash)  
✅ Session-Ablauf nach 24 Stunden  
✅ Klare Passwort-Felder (autocomplete korrekt)  
✅ Responsive Design  
✅ Dark Mode Support

## ⚠️ Produktions-Hinweise

Für eine echte Produktionsumgebung sollten Sie:

### Backend-Implementierung

1. **Alle Authentifizierung auf dem Server**
   ```javascript
   // Backend (Node.js/Express Beispiel)
   app.post('/api/login', async (req, res) => {
       const { username, password } = req.body;
       const user = await User.findOne({ username });
       
       if (!user) return res.status(401).json({ error: 'Invalid credentials' });
       
       const pepperedPassword = password + process.env.PEPPER;
       const isValid = await bcrypt.compare(pepperedPassword, user.passwordHash);
       
       if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
       
       // JWT Token erstellen
       const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
       res.json({ token });
   });
   ```

2. **Umgebungsvariablen verwenden**
   ```bash
   # .env Datei
   PEPPER=YourSuperSecretPepperKey123!
   JWT_SECRET=YourJWTSecretKey
   DATABASE_URL=postgresql://...
   ```

3. **HTTPS verwenden**
   - Alle Credentials nur über verschlüsselte Verbindungen senden

4. **Rate Limiting**
   - Max. 5 Login-Versuche pro 15 Minuten
   - IP-basierte oder Account-basierte Limits

5. **JWT oder Session Cookies**
   - Statt localStorage/sessionStorage
   - HttpOnly Cookies (nicht von JavaScript lesbar)
   - Secure Flag (nur über HTTPS)

6. **Weitere Sicherheits-Features**
   - 2FA (Two-Factor Authentication)
   - Account Lock nach X fehlgeschlagenen Versuchen
   - Email-Benachrichtigungen bei verdächtigen Logins
   - Password-Stärke-Anforderungen
   - Regelmäßige Passwort-Änderungen

## 🔍 Code-Beispiele

### Neuen User erstellen (Backend)

```javascript
async function createUser(username, password, email) {
    // 1. Pepper hinzufügen
    const pepperedPassword = password + process.env.PEPPER;
    
    // 2. Hash mit bcrypt erstellen (Salt automatisch)
    const passwordHash = await bcrypt.hash(pepperedPassword, 10);
    
    // 3. User in Datenbank speichern
    const user = await User.create({
        username,
        email,
        passwordHash  // Nur der Hash wird gespeichert!
    });
    
    return user;
}
```

### Passwort verifizieren (Backend)

```javascript
async function verifyPassword(inputPassword, storedHash) {
    // 1. Pepper hinzufügen
    const pepperedPassword = inputPassword + process.env.PEPPER;
    
    // 2. Mit bcrypt vergleichen (Salt wird automatisch extrahiert)
    const isValid = await bcrypt.compare(pepperedPassword, storedHash);
    
    return isValid;
}
```

### Hash-Struktur verstehen

```
Beispiel-Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

Aufschlüsselung:
├─ $2a$           → bcrypt Algorithmus Version
├─ 10$            → Cost Factor (2^10 = 1024 Runden)
├─ N9qo8uLOickgx2ZMRZoMye   → Salt (22 Zeichen)
└─ IjZAgcfl7p92ldGxad68LJZdL17lhWy → Hash (31 Zeichen)

Total: 60 Zeichen
```

## 📚 Weitere Ressourcen

- [bcrypt.js Documentation](https://github.com/dcodeIO/bcrypt.js)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Understanding bcrypt](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)

## 🐛 Debugging

### Console-Logs aktiviert

Die Login-Seite loggt detaillierte Sicherheitsinformationen:

```javascript
console.log('🔐 Security Steps:');
console.log('1. Password entered: admin');
console.log('2. Pepper applied: MyS3cr3tP3...');
console.log('3. Peppered password ready for bcrypt');
console.log('4. bcrypt verification with automatic salt');
console.log('5. Hash comparison result: true');
```

### Session überprüfen

```javascript
// In Browser Console:
const session = JSON.parse(localStorage.getItem('todolist_session'));
console.log(session);
```

### Neuen Hash generieren

```javascript
// In login.js auskommentieren:
generatePasswordHash('meinNeuesPasswort').then(hash => {
    console.log('Generated hash:', hash);
});
```

## ✨ Features

- ✅ Moderne, responsive UI
- ✅ Dark Mode Support
- ✅ Password Visibility Toggle
- ✅ Loading States
- ✅ Fehlerbehandlung
- ✅ Session-Persistenz
- ✅ Auto-Redirect bei gültiger Session
- ✅ Saubere Logout-Funktionalität
- ✅ "Remember Me" Option

## 📝 Lizenz

Dieses Projekt ist frei verwendbar für private und kommerzielle Zwecke.
