-- ============================================================
-- Mashariq WebChat — SQLite Schema
-- ============================================================
-- Converted from the original MySQL design with the following
-- decisions applied:
--   1. Single `users` table (chat users + admins merged).
--   2. Unified `conversations` table (1:1 and group in one place).
--   3. SQLite syntax (AUTOINCREMENT, INTEGER for booleans, inline FKs).
--   4. Added missing `senderId` on messages.
--   5. Added UNIQUE constraints on all junction tables.
--   6. Added UNIQUE on 1:1 conversation member pairs.
--   7. Removed the invalid empty index.
--   8. ON DELETE CASCADE on memberships/messages so deleting a
--      user cleans up their data instead of orphaning it.
--   9. `content` is TEXT (not VARCHAR(255)) so messages aren't truncated.
--  10. `messageType` backed by a lookup table (no magic numbers).
-- ============================================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- USERS — everyone (chat participants and admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,           -- full name
    email       TEXT    NOT NULL UNIQUE,
    nickName    TEXT    NOT NULL UNIQUE,           -- display name in chat
    mobileNo    TEXT    NOT NULL,
    password    TEXT    NOT NULL,                  -- bcrypt hash, never plain text
    isActive    INTEGER NOT NULL DEFAULT 1,       -- 0=disabled, 1=active
    createdAt   TEXT    NOT NULL DEFAULT (datetime('now')),
    createdBy   INTEGER REFERENCES users(id) ON DELETE SET NULL
                                            -- which admin created this user (NULL for self-registered)
);

-- ============================================================
-- CONVERSATIONS — 1:1 (isGroup=0) or group (isGroup=1)
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT,                              -- group name; NULL for 1:1
    isGroup     INTEGER NOT NULL DEFAULT 0,       -- 0=direct message, 1=group
    createdBy   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    createdAt   TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- CONVERSATION MEMBERSHIP — who is in which conversation
-- ============================================================
CREATE TABLE IF NOT EXISTS conversation_members (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversationId  INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    userId          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    isAdmin         INTEGER NOT NULL DEFAULT 0,   -- group admin (0/1)
    joinedAt        TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(conversationId, userId)                 -- prevents duplicate memberships
);

-- For a 1:1 conversation, enforce that exactly two members exist.
-- (Enforced in app logic, not via SQL, since SQLite has no CHECK on row counts.)

-- ============================================================
-- MESSAGES — all chat messages (1:1 and group)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversationId  INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    senderId        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT    NOT NULL,              -- message body (TEXT = unlimited length)
    messageType     INTEGER NOT NULL DEFAULT 0 REFERENCES message_types(id),
    createdAt       TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversationId, createdAt);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(senderId);

-- ============================================================
-- MESSAGE TYPES — lookup table (extensible for future media/WebRTC)
-- ============================================================
CREATE TABLE IF NOT EXISTS message_types (
    id          INTEGER PRIMARY KEY,               -- 0,1,2... (matches messageType above)
    name        TEXT    NOT NULL UNIQUE,
    description TEXT
);
INSERT OR IGNORE INTO message_types (id, name, description) VALUES
    (0, 'text',         'Plain text message'),
    (1, 'image',        'Image attachment (future)'),
    (2, 'video',        'Video attachment (future)'),
    (3, 'call_signal',  'WebRTC signaling payload (future)');

-- ============================================================
-- RBAC — Role-Based Access Control for the admin site
-- ============================================================
-- Permissions: granular operations an admin can perform
CREATE TABLE IF NOT EXISTS permissions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    opCode      INTEGER NOT NULL UNIQUE,           -- numeric code used in code
    name        TEXT    NOT NULL UNIQUE,           -- e.g. 'users.create'
    description TEXT
);

-- Roles: groups of permissions (e.g. 'admin', 'moderator')
CREATE TABLE IF NOT EXISTS roles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    isDelegated INTEGER NOT NULL DEFAULT 0,       -- 1=role can be delegated to others
    isActive    INTEGER NOT NULL DEFAULT 1
);

-- Which users have which roles
CREATE TABLE IF NOT EXISTS user_roles (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    userId    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roleId    INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    isActive  INTEGER NOT NULL DEFAULT 1,
    UNIQUE(userId, roleId)
);

-- Which roles grant which permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    roleId        INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permissionId  INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    isActive      INTEGER NOT NULL DEFAULT 1,
    UNIQUE(roleId, permissionId)
);

-- ============================================================
-- SEED DATA — default roles and permissions
-- ============================================================
INSERT OR IGNORE INTO roles (id, name, isDelegated, isActive) VALUES
    (1, 'admin',     0, 1),   -- full access to admin site
    (2, 'moderator', 1, 1),   -- can manage users/groups but not system settings
    (3, 'user',      0, 1);    -- regular chat user (no admin access)

INSERT OR IGNORE INTO permissions (opCode, name, description) VALUES
    (100, 'users.read',     'View users'),
    (101, 'users.create',   'Create users'),
    (102, 'users.update',   'Edit users'),
    (103, 'users.disable',  'Disable users'),
    (110, 'groups.read',    'View groups/conversations'),
    (111, 'groups.create',  'Create groups'),
    (112, 'groups.update',  'Edit groups'),
    (113, 'groups.delete',  'Delete groups'),
    (120, 'messages.read',  'Read all messages (moderation)'),
    (130, 'settings.read',  'View system settings'),
    (131, 'settings.update','Edit system settings');

-- Admin role gets every permission
INSERT OR IGNORE INTO role_permissions (roleId, permissionId)
SELECT 1, id FROM permissions;
