CREATE DATABASE IF NOT EXISTS project_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE project_management;

CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  fullName    VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  createdAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  userId      INT           NOT NULL,
  name        VARCHAR(150)  NOT NULL,
  description TEXT,
  status      ENUM('Not Started','In Progress','Completed') NOT NULL DEFAULT 'Not Started',
  startDate   DATE,
  endDate     DATE,
  createdAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_projects_userId (userId),
  INDEX idx_projects_status (status)
);

CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  projectId   INT           NOT NULL,
  name        VARCHAR(150)  NOT NULL,
  description TEXT,
  priority    ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  status      ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
  dueDate     DATE,
  createdAt   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_tasks_projectId (projectId),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority)
);
