-- Init-Schema für lokale Entwicklung.
-- Primäre Quelle für Schema-Änderungen bleibt Alembic (backend/migrations).

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  locale VARCHAR(16) NULL,
  theme VARCHAR(20) NULL
);

CREATE TABLE IF NOT EXISTS lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#3498db',
  owner_user_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_lists_owner_user FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL DEFAULT '#198754',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  due_date DATE NULL,
  list_id INT NULL,
  owner_user_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_list FOREIGN KEY (list_id) REFERENCES lists(id),
  CONSTRAINT fk_tasks_owner FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS task_tags (
  task_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id, tag_id),
  CONSTRAINT fk_task_tags_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS list_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  list_id INT NOT NULL,
  shared_with_user_id INT NOT NULL,
  permission ENUM('read', 'edit') NOT NULL DEFAULT 'read',
  shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_list_user_share (list_id, shared_with_user_id),
  CONSTRAINT fk_list_shares_list FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
  CONSTRAINT fk_list_shares_user FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed-Daten für den Testuser (admin@todolist.com / admin123)
-- Zeigt alle Features: Listen, Tags, Tasks (offen/erledigt,
-- mit/ohne Fälligkeitsdatum, mit Tags, ohne Liste).
-- ============================================================

INSERT INTO users (email, password_hash, locale, theme)
SELECT 'admin@todolist.com', '$argon2id$v=19$m=65536,t=3,p=4$QOmH4xlC8hRRN0AgAtFRoA$9Ib+yp9s3c1EvDQZKFkwhWUfTcUIm8Zv6U0gwqf3SDg', 'de-DE', 'light'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@todolist.com');

-- Listen (owner = admin-User, id=1)
INSERT INTO lists (slug, name, color, owner_user_id)
SELECT 'arbeit', 'Arbeit', '#3498db', 1
WHERE NOT EXISTS (SELECT 1 FROM lists WHERE slug = 'arbeit');

INSERT INTO lists (slug, name, color, owner_user_id)
SELECT 'privat', 'Privat', '#9b59b6', 1
WHERE NOT EXISTS (SELECT 1 FROM lists WHERE slug = 'privat');

INSERT INTO lists (slug, name, color, owner_user_id)
SELECT 'einkauf', 'Einkauf', '#27ae60', 1
WHERE NOT EXISTS (SELECT 1 FROM lists WHERE slug = 'einkauf');

-- Tags (global, kein Owner)
INSERT INTO tags (name, color) SELECT 'Dringend', '#dc3545' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Dringend');
INSERT INTO tags (name, color) SELECT 'Wichtig',  '#fd7e14' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Wichtig');
INSERT INTO tags (name, color) SELECT 'Optional', '#6c757d' WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Optional');

-- Tasks in Liste "Arbeit"
INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Projektpräsentation vorbereiten',
       'Folien für das Q2-Review erstellen und Agenda abstimmen.',
       0, CURRENT_DATE + INTERVAL 3 DAY,
       (SELECT id FROM lists WHERE slug = 'arbeit'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Projektpräsentation vorbereiten');

INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Code-Review für PR #42 durchführen',
       'Branch feature/auth-refactor auf Sicherheitslücken prüfen.',
       0, CURRENT_DATE + INTERVAL 1 DAY,
       (SELECT id FROM lists WHERE slug = 'arbeit'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Code-Review für PR #42 durchführen');

INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Stand-up-Meeting-Notizen dokumentieren',
       'Erledigte Punkte aus dem Weekly ins Confluence übertragen.',
       1, NULL,
       (SELECT id FROM lists WHERE slug = 'arbeit'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Stand-up-Meeting-Notizen dokumentieren');

-- Tasks in Liste "Privat"
INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Zahnarzttermin buchen',
       'Halbjährliche Kontrolle ist überfällig.',
       0, CURRENT_DATE + INTERVAL 7 DAY,
       (SELECT id FROM lists WHERE slug = 'privat'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Zahnarzttermin buchen');

INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Steuererklärung einreichen',
       'Unterlagen von Steuerberater abholen und ELSTER-Formular ausfüllen.',
       0, CURRENT_DATE + INTERVAL 14 DAY,
       (SELECT id FROM lists WHERE slug = 'privat'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Steuererklärung einreichen');

INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Wohnung putzen',
       NULL,
       1, NULL,
       (SELECT id FROM lists WHERE slug = 'privat'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Wohnung putzen');

-- Tasks in Liste "Einkauf"
INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Lebensmittel für die Woche',
       'Milch, Brot, Käse, Tomaten, Pasta, Olivenöl.',
       0, CURRENT_DATE,
       (SELECT id FROM lists WHERE slug = 'einkauf'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Lebensmittel für die Woche');

INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Neues HDMI-Kabel bestellen',
       'Mindestens 2m, 4K-fähig.',
       0, NULL,
       (SELECT id FROM lists WHERE slug = 'einkauf'), 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Neues HDMI-Kabel bestellen');

-- Task ohne Liste (zeigt Inbox/owner_user_id-Feature)
INSERT INTO tasks (title, description, completed, due_date, list_id, owner_user_id)
SELECT 'Idee: Side-Project für Habit Tracker',
       'Konzept ausarbeiten – Stack: FastAPI + React.',
       0, NULL, NULL, 1
WHERE NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Idee: Side-Project für Habit Tracker');

-- Tags zu Tasks zuweisen
INSERT INTO task_tags (task_id, tag_id)
SELECT t.id, tg.id FROM tasks t JOIN tags tg ON tg.name = 'Dringend'
WHERE t.title = 'Projektpräsentation vorbereiten'
  AND NOT EXISTS (SELECT 1 FROM task_tags WHERE task_id = t.id AND tag_id = tg.id);

INSERT INTO task_tags (task_id, tag_id)
SELECT t.id, tg.id FROM tasks t JOIN tags tg ON tg.name = 'Dringend'
WHERE t.title = 'Code-Review für PR #42 durchführen'
  AND NOT EXISTS (SELECT 1 FROM task_tags WHERE task_id = t.id AND tag_id = tg.id);

INSERT INTO task_tags (task_id, tag_id)
SELECT t.id, tg.id FROM tasks t JOIN tags tg ON tg.name = 'Wichtig'
WHERE t.title = 'Steuererklärung einreichen'
  AND NOT EXISTS (SELECT 1 FROM task_tags WHERE task_id = t.id AND tag_id = tg.id);

INSERT INTO task_tags (task_id, tag_id)
SELECT t.id, tg.id FROM tasks t JOIN tags tg ON tg.name = 'Optional'
WHERE t.title = 'Neues HDMI-Kabel bestellen'
  AND NOT EXISTS (SELECT 1 FROM task_tags WHERE task_id = t.id AND tag_id = tg.id);
