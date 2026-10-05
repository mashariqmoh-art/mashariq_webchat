# DB_Schema

## Files

| File | Role |
|---|---|
| `schema.sql` | **Single source of truth.** The actual SQLite schema. Edit this. |
| `WebChat_schema_drawdb.json` | Derived artifact. For visualizing the ER diagram in [drawDB](https://drawdb.vercel.app). Do NOT edit by hand as the primary way to change the schema. |

## Tables

| Table | What it does |
|---|---|
| `table_User` | Stores every user — name, email, nickname, mobile number, and password hash. Both chat users and admins live here. |
| `table_Conversation` | A chat thread. `isGroup=0` means a private 1:1 chat, `isGroup=1` means a group chat. |
| `table_ConversationMember` | Links users to conversations — who is in which chat, and whether they are a group admin. |
| `table_Message` | Every message sent in a chat — who sent it, where, its text, and when. |
| `table_MessageType` | Lookup list of message kinds (text, image, video, call signal). Lets us add new types later without changing the schema. |
| `table_Permission` | Granular admin actions the system knows about (e.g. `users.create`, `groups.delete`). |
| `table_Role` | Named roles like `admin`, `moderator`, `user`. A role is a bundle of permissions. |
| `table_UserRole` | Assigns roles to users — which user has which role. |
| `table_RolePermission` | Assigns permissions to roles — what each role is allowed to do. |

## Workflow

1. Make schema changes in `schema.sql`.
2. Regenerate the drawDB JSON (or update it) to keep the diagram in sync.
3. The JSON exists only so the IDE / drawDB app can render the diagram. It does not drive the database.

## Why this order

SQL is what actually runs against SQLite and what the Node.js server loads. If the JSON and SQL ever disagree, **the SQL wins**.
