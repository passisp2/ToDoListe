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
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_list FOREIGN KEY (list_id) REFERENCES lists(id)
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

-- Optionale Seed-Daten
INSERT INTO users (email, password_hash, locale, theme)
SELECT 'admin@todolist.com', 'demo_hash_replace_me', 'de-DE', 'light'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@todolist.com'
);

INSERT INTO lists (slug, name, color, owner_user_id)
SELECT 'personal', 'Personal', '#9b59b6', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM lists WHERE slug = 'personal'
);

INSERT INTO lists (slug, name, color, owner_user_id)
SELECT 'work', 'Work', '#3498db', NULL
WHERE NOT EXISTS (
  SELECT 1 FROM lists WHERE slug = 'work'
);

INSERT INTO tags (name, color)
SELECT 'high', '#dc3545'
WHERE NOT EXISTS (
  SELECT 1 FROM tags WHERE name = 'high'
);

INSERT INTO tags (name, color)
SELECT 'medium', '#ffc107'
WHERE NOT EXISTS (
  SELECT 1 FROM tags WHERE name = 'medium'
);

INSERT INTO tags (name, color)
SELECT 'low', '#198754'
WHERE NOT EXISTS (
  SELECT 1 FROM tags WHERE name = 'low'
);

INSERT INTO tasks (title, description, completed, due_date, list_id)
SELECT 'Beispielaufgabe', 'Diese Zeile stammt aus init.sql', 0, NULL, lists.id
FROM lists
WHERE lists.slug = 'personal'
  AND NOT EXISTS (SELECT 1 FROM tasks WHERE title = 'Beispielaufgabe');
