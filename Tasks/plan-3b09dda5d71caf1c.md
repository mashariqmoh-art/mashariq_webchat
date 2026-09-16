# Mashariq WebChat — Educational Build Plan

A step-by-step build plan for the WhatsApp-like web chat application, starting from the existing `schema.sql` and empty `server/` + `website/` folders.

## Scope

Build a working v1 with: user registration/login (JWT), 1:1 direct messaging, group chat, real-time message delivery with Socket.IO, an admin panel for user/conversation/role management, and a SQLite database loaded from the existing `DB_Schema/schema.sql`.

## Summary

We will build the project in small **vertical slices** (one complete feature at a time) using two independent npm projects (`server/` and `website/`), with a small set of focused tests and a minimal admin site added last. Each step explains what it adds, why it is needed, how to implement it, and the benefit to the learner.

---

## 1. Foundation — Database & Project Skeleton

### 1.1 Initialize the server project

**WHAT:** Create `server/package.json`, install core packages, and create an `index.js` entry point.

**WHY:** The backend needs a package manifest and dependencies before any code can run.

**HOW:**
- Run `npm init` in `server/`
- Install: `express`, `better-sqlite3`, `bcryptjs`, `jsonwebtoken`, `socket.io`, `cors`, `dotenv`
- Install dev: `nodemon`
- Add scripts: `dev` (nodemon src/index.js) and `start` (node src/index.js)
- Create `server/src/index.js` that listens on port 3001

**BENEFIT:** Students see how a Node.js project is bootstrapped and which library solves which problem (Express for HTTP, better-sqlite3 for the DB, Socket.IO for realtime, etc.)

> **Recommendation:** Keep `server/` and `website/` as separate npm projects.
> **Pros:** No monorepo complexity, easy to run independently, matches the existing folder layout.
> **Cons:** Small duplication of types/constants between frontend and backend.

### 1.2 Initialize the website project

**WHAT:** Create `website/package.json` with React + Vite and a starter `index.html`.

**WHY:** The frontend needs its own build/dev pipeline separate from the backend.

**HOW:**
- Run `npm create vite@latest website/ -- --template react` (or manually init Vite)
- Add scripts: `dev` (vite), `build`, `preview`
- Clean up the default `App.jsx` and `main.jsx` so they render a simple `<h1>Mashariq WebChat</h1>`

**BENEFIT:** Students learn how Vite is configured and how the React dev server works.

### 1.3 Wire the database to the server

**WHAT:** Create `server/src/db/db.js` that opens `chat.sqlite`, runs `schema.sql`, and exports a `db` object.

**WHY:** The schema already exists; the server needs to load it so the app has tables and seed data.

**HOW:**
- Load `DB_Schema/schema.sql` and execute it with `db.exec(fs.readFileSync(...))`
- Run `db.pragma('foreign_keys = ON')` after opening
- Export `db` so routes and sockets can import it
- Add `*.sqlite` to `.gitignore`

**BENEFIT:** Students understand the "schema as source of truth" rule: SQL is loaded automatically on startup.

### 1.4 Verify with a health endpoint

**WHAT:** Add `GET /api/health` that returns `{ ok: true }`.

**WHY:** Confirms the server, Express, and database can start without errors.

**HOW:**
- Add a `/api/health` route in `server/src/index.js`
- Run `npm run dev` in `server/`
- Test with `curl http://localhost:3001/api/health`

**BENEFIT:** A quick sanity check before moving to real features.

---

## 2. Authentication Slice

### 2.1 Create the user table helpers

**WHAT:** Add `server/src/db/users.js` with functions to create a user, find by email, and find by SID.

**WHY:** Auth needs to read and write user records securely.

**HOW:**
- `createUser({ name, email, nickName, mobileNo, password })` → hash password with `bcryptjs.hashSync(password, 10)`, insert into `table_User`
- `findUserByEmail(email)` → select by email
- `findUserBySID(sid)` → select by SID

**BENEFIT:** Students learn to never store plain-text passwords and to centralize DB queries in one module.

### 2.2 Build the register and login endpoints

**WHAT:** Add `server/src/routes/auth.js` with `POST /api/auth/register` and `POST /api/auth/login`.

**WHY:** Users need accounts and a way to prove who they are.

**HOW:**
- Register: validate email/password, call `createUser`, return success
- Login: find user by email, compare password with `bcryptjs.compareSync`, issue a JWT with `jsonwebtoken.sign({ userSID, nickName })`, return `{ token, user }`
- Mount `auth.js` in `index.js` at `/api/auth`

**BENEFIT:** Students see the full registration/login flow: hashing, validation, token creation.

### 2.3 Add the auth middleware

**WHAT:** Create `server/src/middleware/auth.js` that verifies the `Authorization: Bearer <token>` header and attaches `req.user`.

**WHY:** Protected routes need to know who is calling them.

**HOW:**
- Extract the token from the header
- Verify with `jwt.verify(token, JWT_SECRET)`
- On success, attach `req.user` and call `next()`
- On failure, return `401 Unauthorized`

**BENEFIT:** Students understand middleware and how JWTs protect routes.

### 2.4 Test the auth flow

**WHAT:** Write a small test or use `curl` to register a user, log in, and call a protected route.

**WHY:** Catches mistakes before building more features.

**HOW:**
- Add a `GET /api/me` protected route that returns `req.user`
- Use curl or a small `server/tests/auth.test.js` (if test tooling is added)

**BENEFIT:** Students learn to verify auth end-to-end before relying on it.

---

## 3. Conversations Slice

### 3.1 Add conversation DB helpers

**WHAT:** Create `server/src/db/conversations.js` with functions to create a 1:1 conversation, add members, list a user's conversations, and find one by SID.

**WHY:** Messages belong inside conversations; users need to know which conversations they are in.

**HOW:**
- `createConversation({ creatorSID, otherUserSID })` → insert into `table_Conversation` (isGroup=0), then add two members to `table_ConversationMember`
- `getConversationsForUser(userSID)` → join `table_ConversationMember` + `table_Conversation`
- `getConversationBySID(sid)` → select one conversation with its members

**BENEFIT:** Students learn how 1:1 relationships are modeled (conversation + exactly two members).

### 3.2 Build conversation REST endpoints

**WHAT:** Add `server/src/routes/conversations.js` with protected endpoints.

**WHY:** The frontend needs to list and create conversations.

**HOW:**
- `GET /api/conversations` → list current user's conversations
- `POST /api/conversations` with `{ otherUserSID }` → create a 1:1 conversation
- `GET /api/conversations/:sid` → get details + members of one conversation

**BENEFIT:** Students build a REST API and understand route parameters and ownership checks.

### 3.3 Create the chat layout in React

**WHAT:** Build `website/src/chat/ChatLayout.jsx` with a left sidebar (conversation list) and right panel (message area).

**WHY:** Provides the visual structure for the chat app.

**HOW:**
- Create `chat/ChatLayout.jsx`, `chat/ConversationList.jsx`, `chat/MessageView.jsx`
- Use `fetch` (or an `apiClient` we will add later) to load `/api/conversations`
- Render a placeholder for the message view

**BENEFIT:** Students start connecting React components to real backend data.

### 3.4 Create a shared API client

**WHAT:** Add `website/src/shared/api.js` that wraps `fetch` and attaches the JWT token.

**WHY:** Centralizes how the frontend talks to the backend.

**HOW:**
- `api.get(url)` / `api.post(url, body)` helpers
- Read `token` from `localStorage`
- Attach `Authorization: Bearer <token>` header
- Return JSON or throw on error

**BENEFIT:** Students see how to keep API logic out of components.

---

## 4. Real-Time Messaging Slice

### 4.1 Add message DB helpers

**WHAT:** Create `server/src/db/messages.js` to insert and fetch messages.

**WHY:** Messages must be saved before they are broadcast.

**HOW:**
- `createMessage({ conversationSID, senderSID, content })` → insert into `table_Message`
- `getMessagesForConversation(conversationSID)` → select by conversation, ordered by `createdAt` ASC

**BENEFIT:** Students learn the data path for a chat message.

### 4.2 Build the message REST endpoints

**WHAT:** Add `server/src/routes/messages.js`.

**WHY:** When a user opens a conversation, the frontend fetches existing messages.

**HOW:**
- `GET /api/conversations/:sid/messages` → return messages the user is allowed to see (member check)
- `POST /api/conversations/:sid/messages` → save a message (HTTP fallback)

**BENEFIT:** Students learn to check membership before returning private data.

### 4.3 Add Socket.IO to the server

**WHAT:** Integrate Socket.IO in `server/src/index.js` and create `server/src/sockets/chat.js`.

**WHY:** Messages need to arrive instantly without polling.

**HOW:**
- Attach Socket.IO to the Express server
- Verify the JWT in the Socket.IO `auth` handshake
- Handle `join` event: `socket.join('conv_<conversationSID>')` after membership check
- Handle `message` event: save to DB, emit `message` to the room
- Handle `typing` event: broadcast `typing` to the room except sender

**BENEFIT:** Students learn rooms, handshake auth, and realtime broadcasting.

### 4.4 Add the Socket.IO client

**WHAT:** Create `website/src/shared/socket.js` that connects with the JWT in `auth`.

**WHY:** The React UI needs a realtime connection.

**HOW:**
- Initialize `io('http://localhost:3001', { auth: { token } })`
- Expose `emit`/`on` helpers and connection state
- Add `useSocket` hook in `website/src/chat/useSocket.js` for components

**BENEFIT:** Students see how to bridge Socket.IO into React components.

### 4.5 Build the message composer and message list

**WHAT:** Add `website/src/chat/MessageComposer.jsx` and `website/src/chat/MessageList.jsx`.

**WHY:** Users need to read and send messages.

**HOW:**
- `MessageList` fetches history via `GET /api/conversations/:sid/messages` and appends realtime messages
- `MessageComposer` emits `message` event on Enter/click, also shows a local optimistic message

**BENEFIT:** Students build the core chat loop: fetch history, join room, send, receive, display.

### 4.6 Test the chat loop

**WHAT:** Open two browser tabs, log in as two different users, and exchange a message.

**WHY:** Verifies end-to-end realtime delivery.

**HOW:**
- Create two users (register or seed)
- Create a conversation between them
- Send a message from one tab and confirm it appears in the other

**BENEFIT:** Students get a visible, working feature that motivates the next steps.

---

## 5. Group Chat Slice

### 5.1 Extend conversation helpers for groups

**WHAT:** Update `server/src/db/conversations.js` to support `isGroup=1`, group names, and multiple members.

**WHY:** Group chats are a natural extension of 1:1 conversations.

**HOW:**
- `createGroup({ creatorSID, name, memberSIDs })` → insert conversation with isGroup=1, add all members
- `addMemberToConversation({ conversationSID, userSID })` for future admin use

**BENEFIT:** Students see how the same tables support both 1:1 and groups with one flag.

### 5.2 Add group REST endpoint

**WHAT:** Add `POST /api/groups` in `conversations.js`.

**WHY:** Users can create group conversations.

**HOW:**
- Accept `{ name, memberSIDs }`
- Creator is automatically a member
- Return the new group SID

**BENEFIT:** Students reuse the existing REST patterns for a new feature.

### 5.3 Update the UI to distinguish 1:1 vs group

**WHAT:** Update `ConversationList` to show a group icon or group name.

**WHY:** Users need to see which conversations are groups.

**HOW:**
- Use `isGroup` flag from the API response
- Show a different icon or label for groups

**BENEFIT:** Students conditionally render UI based on data flags.

---

## 6. Minimal Admin Slice

### 6.1 Add permission-check middleware

**WHAT:** Create `server/src/middleware/requirePermission.js`.

**WHY:** Admin actions must check the RBAC tables defined in the schema.

**HOW:**
- Read user's roles from `table_UserRole`
- Read permissions for those roles from `table_RolePermission`
- Compare against the required permission name
- Return `403 Forbidden` if missing

**BENEFIT:** Students learn how role-based access control is implemented at the code level.

### 6.2 Seed the first admin user

**WHAT:** Add a script `server/scripts/seedAdmin.js` or a SQL seed to create `admin@example.com` with the `admin` role.

**WHY:** You cannot log in as an admin until one exists.

**HOW:**
- Insert a user with a known hashed password
- Assign `table_UserRole` with `role_SID=1` (admin)
- Print instructions to the console

**BENEFIT:** Students see how seed data and roles combine to create an admin account.

### 6.3 Build minimal admin users endpoint

**WHAT:** Add `server/src/routes/admin.js` with `GET /api/admin/users` and `POST /api/admin/users`.

**WHY:** The admin can list and create users to test chat.

**HOW:**
- Protect with `requirePermission('users.read')` and `users.create`
- `GET` returns a list of users
- `POST` creates a user and optionally assigns a role

**BENEFIT:** Students connect RBAC to real admin endpoints.

### 6.4 Build a minimal admin UI

**WHAT:** Create `website/src/admin/AdminPanel.jsx` with a user list and create-user form.

**WHY:** Provides a web UI for the most important admin action (user management).

**HOW:**
- Add a route or simple conditional rendering
- Fetch `/api/admin/users`
- Render a table and a form to create users
- Only accessible by users with the right permission

**BENEFIT:** Students see the full admin feature from DB role to UI.

---

## 7. Polish & Verification

### 7.1 Add `.env` handling

**WHAT:** Create `.env` files for `JWT_SECRET` and ports, and a `.env.example` template.

**WHY:** Secrets and config should not be hard-coded.

**HOW:**
- `server/.env` with `JWT_SECRET` and `PORT`
- `website/.env` with `VITE_API_URL`
- Add `.env` to `.gitignore`

**BENEFIT:** Students learn to keep secrets out of source control.

### 7.2 Add CORS and security basics

**WHAT:** Configure `cors` on the server to allow `http://localhost:5173`.

**WHY:** The frontend dev server runs on a different port.

**HOW:**
- `app.use(cors({ origin: 'http://localhost:5173', credentials: true }))`

**BENEFIT:** Students understand why CORS errors happen and how to fix them.

### 7.3 Add light tests

**WHAT:** Add a minimal test for auth and for sending a message.

**WHY:** Students learn the testing pattern without full coverage overhead.

**HOW:**
- Install `vitest` (or `jest`) in `server/`
- Test `POST /api/auth/register` and `POST /api/auth/login`
- Test `POST /api/conversations/:sid/messages` (member check)

**BENEFIT:** Students see tests as a safety net for critical paths.

### 7.4 Document build & run commands

**WHAT:** Update `readme.md` and `AGENTS.md` with exact `npm install` / `npm run dev` instructions.

**WHY:** The team needs to know how to start the project.

**HOW:**
- `readme.md`: quick start (server + website in two terminals)
- `AGENTS.md`: fill in the "Build & run commands" section

**BENEFIT:** Students finish with a reproducible project.

---

## Verification Checklist

- [ ] Server starts and `GET /api/health` returns `ok`
- [ ] Register/login returns a JWT
- [ ] Protected `GET /api/me` works only with a valid token
- [ ] Two users can create a 1:1 conversation
- [ ] Messages sent in one tab appear in another in real time
- [ ] Group creation and group messaging work
- [ ] Admin can create/disable users
- [ ] `.env` files keep secrets out of git
- [ ] `npm run dev` in both folders works side by side

---

## Risks / Considerations

- **Data loss:** `chat.sqlite` is ignored, so every fresh clone starts empty. This is fine for learning but not for production.
- **WebRTC future:** The `table_MessageType` already includes `call_signal`, so signaling events can reuse Socket.IO later. This plan leaves WebRTC for a v2.
- **Socket.IO auth:** Tokens are checked at the handshake, but expired tokens while connected are not re-verified on each event. For v1 this is acceptable; for production, add periodic re-auth.
- **Admin panel scope:** We are intentionally building only user creation/listing in admin; full role/permission/stats UI can be a v2 enhancement.

---

## Next Decision Points for You

1. **Test runner:** Would you prefer `vitest` (fast, modern) or `jest` (very common)? My recommendation: `vitest` for consistency with the Vite frontend.
2. **State management:** Do you want to use plain React `useState`/`useContext`, or introduce a library like Zustand? My recommendation: plain React for v1, Zustand for v2 when the chat state grows.
3. **Styling:** Should we use plain CSS, a CSS framework like Tailwind, or a UI library like Material UI? My recommendation: plain CSS modules for v1 to keep the learning focused on React/Node, or Tailwind if the team already knows it.

Please review and tell me if any step should be changed, split, or skipped before I start implementing.
