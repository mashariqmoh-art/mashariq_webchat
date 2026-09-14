-- ============================================================
-- Mashariq WebChat — SQLite Schema (source of truth)
-- ============================================================
-- Naming conventions (following the original drawDB design):
--   - Tables:    table_<Entity>           e.g. table_User, table_Conversation
--   - Fields:    camelCase                e.g. nickName, mobileNo, createdAt
--   - Primary keys: SID                    (every table uses SID as its PK column)
--   - Foreign keys: <name>_SID            e.g. createdBy_SID, conversation_SID
--   - Booleans:  INTEGER (0/1)
--   - Timestamps: TEXT (ISO8601 via datetime('now'))
-- ============================================================

PRAGMA foreign_keys = ON;

-- ============================================================
-- USERS — everyone (chat participants and admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS table_User (
    SID            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL UNIQUE,           -- full name
    email         TEXT    NOT NULL UNIQUE,
    nickName      TEXT    NOT NULL UNIQUE,           -- display name in chat
    mobileNo      TEXT    NOT NULL,
    password      TEXT    NOT NULL,                  -- bcrypt hash, never plain text
    isActive      INTEGER NOT NULL DEFAULT 1,       -- 0=disabled, 1=active
    createdAt     TEXT    NOT NULL DEFAULT (datetime('now')),
    createdBy_SID INTEGER REFERENCES table_User(SID) ON DELETE SET NULL
                                              -- which admin created this user (NULL for self-registered)
);

-- ============================================================
-- CONVERSATIONS — 1:1 (isGroup=0) or group (isGroup=1)
-- ============================================================
CREATE TABLE IF NOT EXISTS table_Conversation (
    SID            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT,                              -- group name; NULL for 1:1
    isGroup       INTEGER NOT NULL DEFAULT 0,       -- 0=direct message, 1=group
    createdBy_SID INTEGER NOT NULL REFERENCES table_User(SID) ON DELETE CASCADE,
    createdAt     TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- CONVERSATION MEMBERSHIP — who is in which conversation
-- ============================================================
CREATE TABLE IF NOT EXISTS table_ConversationMember (
    SID              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_SID INTEGER NOT NULL REFERENCES table_Conversation(SID) ON DELETE CASCADE,
    user_SID        INTEGER NOT NULL REFERENCES table_User(SID) ON DELETE CASCADE,
    isGroupAdmin    INTEGER NOT NULL DEFAULT 0,     -- group admin (0/1)
    joinedAt        TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(conversation_SID, user_SID)             -- prevents duplicate memberships
);

-- For a 1:1 conversation, enforce that exactly two members exist.
-- (Enforced in app logic, not via SQL, since SQLite has no CHECK on row counts.)

-- ============================================================
-- MESSAGES — all chat messages (1:1 and group)
-- ============================================================
CREATE TABLE IF NOT EXISTS table_Message (
    SID              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_SID INTEGER NOT NULL REFERENCES table_Conversation(SID) ON DELETE CASCADE,
    sender_SID      INTEGER NOT NULL REFERENCES table_User(SID) ON DELETE CASCADE,
    content         TEXT    NOT NULL,                -- message body (TEXT = unlimited length)
    messageType_SID INTEGER NOT NULL DEFAULT 0 REFERENCES table_MessageType(SID),
    createdAt       TEXT    NOT NULL DEFAULT (datetime('now')),
    -- Enforce that the sender is a member of this conversation.
    -- Requires table_ConversationMember UNIQUE(conversation_SID, user_SID) (declared above).
    -- A message from a non-member is rejected at the DB layer (FK violation).
    FOREIGN KEY (conversation_SID, sender_SID)
        REFERENCES table_ConversationMember(conversation_SID, user_SID)
        ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_message_conversation ON table_Message(conversation_SID, createdAt);
CREATE INDEX IF NOT EXISTS idx_message_sender ON table_Message(sender_SID);

-- ============================================================
-- MESSAGE TYPES — lookup table (extensible for future media/WebRTC)
-- ============================================================
CREATE TABLE IF NOT EXISTS table_MessageType (
    SID          INTEGER PRIMARY KEY,                 -- 0,1,2... (matches messageType_SID above)
    name        TEXT    NOT NULL UNIQUE,
    description TEXT
);
INSERT OR IGNORE INTO table_MessageType (SID, name, description) VALUES
    (0, 'text',         'Plain text message'),
    (1, 'image',        'Image attachment (future)'),
    (2, 'video',        'Video attachment (future)'),
    (3, 'call_signal',  'WebRTC signaling payload (future)');

-- ============================================================
-- RBAC — Role-Based Access Control for the admin site
-- ============================================================
-- Permissions: granular operations an admin can perform
CREATE TABLE IF NOT EXISTS table_Permission (
    SID          INTEGER PRIMARY KEY AUTOINCREMENT,
    opCode      INTEGER NOT NULL UNIQUE,             -- numeric code used in code
    name        TEXT    NOT NULL UNIQUE,             -- e.g. 'users.create'
    description TEXT
);

-- Roles: groups of permissions (e.g. 'admin', 'moderator')
CREATE TABLE IF NOT EXISTS table_Role (
    SID          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    isDelegated INTEGER NOT NULL DEFAULT 0,         -- 1=role can be delegated to others
    isActive    INTEGER NOT NULL DEFAULT 1
);

-- Which users have which roles
CREATE TABLE IF NOT EXISTS table_UserRole (
    SID        INTEGER PRIMARY KEY AUTOINCREMENT,
    user_SID  INTEGER NOT NULL REFERENCES table_User(SID) ON DELETE CASCADE,
    role_SID  INTEGER NOT NULL REFERENCES table_Role(SID) ON DELETE CASCADE,
    isActive  INTEGER NOT NULL DEFAULT 1,
    UNIQUE(user_SID, role_SID)
);

-- Which roles grant which permissions
CREATE TABLE IF NOT EXISTS table_RolePermission (
    SID              INTEGER PRIMARY KEY AUTOINCREMENT,
    role_SID        INTEGER NOT NULL REFERENCES table_Role(SID) ON DELETE CASCADE,
    permission_SID  INTEGER NOT NULL REFERENCES table_Permission(SID) ON DELETE CASCADE,
    isActive        INTEGER NOT NULL DEFAULT 1,
    UNIQUE(role_SID, permission_SID)
);

-- ============================================================
-- SEED DATA — default roles and permissions
-- ============================================================
INSERT OR IGNORE INTO table_Role (SID, name, isDelegated, isActive) VALUES
    (1, 'admin',     0, 1),   -- full access to admin site
    (2, 'moderator', 1, 1),   -- can manage users/groups but not system settings
    (3, 'user',      0, 1);    -- regular chat user (no admin access)

INSERT OR IGNORE INTO table_Permission (opCode, name, description) VALUES
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
INSERT OR IGNORE INTO table_RolePermission (role_SID, permission_SID)
SELECT 1, SID FROM table_Permission;
