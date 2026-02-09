-- Placeholder-Init für MariaDB
-- Dieses Skript wird vom Service "db-init" ausgeführt (Profil "init").
-- Beispiel: einfache Tasks-Tabelle. Bei Bedarf anpassen/erweitern.

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open','done') DEFAULT 'open',
  due_date DATE,
  priority TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Beispiel-Datensatz
INSERT INTO tasks (title, description, status, priority)
VALUES ('Beispielaufgabe', 'Diese Zeile stammt aus init.sql', 'open', 1);
