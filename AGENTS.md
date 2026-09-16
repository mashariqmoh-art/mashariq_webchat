# Mashariq WebChat — Project Guide

WhatsApp-like web chat app. Text-only for v1; designed to extend to WebRTC later.

## Stack

- **Frontend:** React + Vite (plain JavaScript)
- **Backend:** Node.js + Express + Socket.IO
- **Database:** SQLite (file-based, via `better-sqlite3`)
- **Auth:** JWT + bcrypt

## Repository layout

```
mashariq_webchat/
├── DB_Schema/          # Database schema (source of truth) + diagram
├── Learning/          # Reference notes for the team (not app code)
├── server/             # Node.js backend
│   └── src/
│       ├── db/          # SQLite connection, schema loading, queries
│       ├── routes/      # REST API endpoints (auth, users, conversations, messages)
│       ├── sockets/     # Socket.IO realtime handlers (join, message, typing)
│       └── middleware/ # Express middleware (auth, admin-only RBAC checks)
├── website/            # React frontend
│   └── src/
│       ├── chat/       # Chat UI (conversation list, message view, composer)
│       ├── admin/      # Admin site (users, conversations, roles, stats)
│       └── shared/     # Shared frontend code (api client, socket client, types)
└── readme.md           # Project intro + contributors
```

## Folder responsibilities

### `DB_Schema/`
Database schema definition.

| File | Role |
|---|---|
| `schema.sql` | **Source of truth.** SQLite DDL + seed data. Edit this first. |
| `WebChat_schema_drawdb.json` | Derived artifact for visualizing the ER diagram in [drawDB](https://drawdb.vercel.app). Do not edit as the primary way to change the schema. |
| `README.md` | Explains the SQL-vs-JSON workflow. |

**Naming conventions** (defined in `schema.sql` header):
- Tables: `table_<Entity>` (e.g. `table_User`)
- Primary keys: `SID` (every table)
- Foreign keys: `<name>_SID` (e.g. `conversation_SID`, `user_SID`)
- Fields: camelCase (e.g. `nickName`, `createdAt`)
- Booleans: `INTEGER` (0/1)
- Timestamps: `TEXT` (ISO8601 via `datetime('now')`)

**Tables:**
| Table | Purpose |
|---|---|
| `table_User` | All users (chat participants + admins), with bcrypt password hash |
| `table_Conversation` | Chat threads; `isGroup=0` for 1:1 DMs, `isGroup=1` for groups |
| `table_ConversationMember` | Who is in which conversation; `isGroupAdmin` flag |
| `table_Message` | All chat messages, with `sender_SID` and `messageType_SID` |
| `table_MessageType` | Lookup table (text, image, video, call_signal) |
| `table_Permission` | Granular admin operations (e.g. `users.create`) |
| `table_Role` | Roles (admin, moderator, user) |
| `table_UserRole` | User ↔ role junction |
| `table_RolePermission` | Role ↔ permission junction |

**Workflow:** Edit `schema.sql` → regenerate the JSON to keep the diagram in sync. If they disagree, **SQL wins**.

### `server/src/`
Backend application code (Node.js + Express + Socket.IO).

| Subfolder | Responsibility |
|---|---|
| `db/` | Opens the SQLite file, loads `schema.sql`, exposes query helpers. All database access goes through here. |
| `routes/` | REST API endpoints. Planned: `auth` (login/register), `users`, `conversations`, `messages`. |
| `sockets/` | Socket.IO event handlers. Planned: `join` (join conversation room), `message` (send + broadcast), `typing`. |
| `middleware/` | Express middleware. Planned: `auth` (verify JWT), `requirePermission` (RBAC check for admin endpoints). |

### `website/src/`
Frontend application code (React + Vite).

| Subfolder | Responsibility |
|---|---|
| `chat/` | Chat interface. Planned: conversation list, message view, message composer. |
| `admin/` | Admin site. Planned: user management, conversation management, role/permission assignment, stats. |
| `shared/` | Code shared between chat and admin. Planned: API client (fetch wrapper), Socket.IO client, shared types/constants. |

### `Learning/`
Team reference notes (e.g. `Git_Info.txt`). Not part of the running application.

## Build & run commands

> TODO: fill in once the server and frontend are initialized.
>
> Expected:
> - `server/`: `npm install`, `npm run dev` (Express + Socket.IO on port 3001)
> - `website/`: `npm install`, `npm run dev` (Vite dev server on port 5173)

## Conventions

- **Source of truth for schema:** `DB_Schema/schema.sql`. Never edit the JSON to change the schema.
- **Database:** SQLite. Use `better-sqlite3` (synchronous, simple). Enable FKs at startup via `db.pragma('foreign_keys = ON')`.
- **Realtime:** Socket.IO. Each conversation is a room (`socket.join(conversation_SID)`). Server persists messages to SQLite, then broadcasts to the room.
- **Auth:** JWT in `Authorization` header for REST; JWT in Socket.IO `auth` handshake for realtime.
- **RBAC:** Admin endpoints check `requirePermission('users.create')` etc. Permissions are stored in the DB (see `table_Permission`).
- **WebRTC extension:** Reuse the Socket.IO connection for signaling (`offer`/`answer`/`ice-candidate` events). Add new `messageType` rows (e.g. `call_signal`) rather than new tables.

## Contributors
- Hefny
- Shahad Atiah
- AbdAllah
