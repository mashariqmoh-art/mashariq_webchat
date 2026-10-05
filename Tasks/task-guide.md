# Mashariq WebChat — Task Guide (Plain English)

This file explains, in simple words, what each task file in this folder is about.
Think of it as a quick tour of the whole project, one step at a time.

---

## 1. Foundation — Getting the project ready

### task-1.1-init-server.md
Set up the backend. We create a Node.js project inside the `server/` folder,
install the libraries we need (Express for the web server, SQLite for the database,
bcrypt for passwords, JWT for login tokens, Socket.IO for real-time, etc.), and
create the main file that starts the server on port 3001.

### task-1.2-init-website.md
Set up the frontend. We create a React project inside the `website/` folder using
Vite (a fast dev tool), install Bootstrap for styling, and make a simple page that
says "Mashariq WebChat". The dev server runs on port 5174.

### task-1.3-wire-database.md
Connect the database to the server. We write a file that opens a SQLite database
file (`chat.sqlite`), runs our `schema.sql` to create all the tables, and turns on
foreign keys (so relationships between tables are enforced). After this, the server
has a real database it can read and write to.

### task-1.4-verify-health.md
Make sure everything works together. We add a simple `/api/health` endpoint that
returns `{ ok: true }` and test it. This confirms the server, Express, and the
database all start without errors before we build real features.

---

## 2. Authentication — Letting users sign up and log in

### task-2.1-user-helpers.md
Write database functions for users. We create functions to add a new user (with a
hashed password — never plain text), find a user by email, and find a user by their
ID. All database code for users lives in one file so it stays organized.

### task-2.2-auth-endpoints.md
Build the register and login API endpoints. Register takes a user's details and
creates an account. Login checks the email and password, and if correct, gives back
a JWT token. This token proves who the user is for all future requests.

### task-2.3-auth-middleware.md
Create a middleware that checks the JWT token. Every protected route (like viewing
your conversations) will run this middleware first. It reads the token from the
request header, verifies it, and attaches the user info to the request. If the token
is missing or invalid, it returns "401 Unauthorized".

### task-2.4-test-auth.md
Test the whole auth flow end to end. We register a user, log in, get a token, and
use it to call a protected route (`/api/me`). This catches mistakes early before we
build more features on top of auth.

---

## 3. Conversations — Letting users start chats

### task-3.1-conversation-helpers.md
Write database functions for conversations. We create functions to start a 1:1
conversation between two users, add members to a conversation, list all conversations
a user is part of, and get details of one conversation. This is the data layer for
chatting.

### task-3.2-conversation-endpoints.md
Build the REST API for conversations. The frontend can list the user's conversations,
create a new 1:1 conversation with another user, and get details of a specific
conversation (including who's in it). These endpoints are protected — you must be
logged in.

### task-3.3-chat-layout.md
Build the chat screen in React. We create a layout with a sidebar on the left
(showing the list of conversations) and a main panel on the right (where messages
will appear). We fetch the conversation list from the backend and display it.

### task-3.4-api-client.md
Create a shared API helper for the frontend. Instead of writing `fetch()` calls in
every component, we make one file with `api.get()` and `api.post()` functions that
automatically attach the JWT token from localStorage. This keeps API logic in one
place.

---

## 4. Real-Time Messaging — Sending and receiving messages instantly

### task-4.1-message-helpers.md
Write database functions for messages. We create functions to save a new message to
the database and to fetch all messages in a conversation (ordered by time, oldest
first). Every message is stored before it's sent to other users.

### task-4.2-message-endpoints.md
Build the REST API for messages. When a user opens a conversation, the frontend
fetches the message history. There's also a POST endpoint to send a message via HTTP
(as a fallback to Socket.IO). Both check that the user is a member of the conversation
before returning or saving anything.

### task-4.3-socketio-server.md
Add real-time support to the server using Socket.IO. When a user opens a conversation,
they join a "room" for that conversation. When someone sends a message, the server
saves it to the database and instantly broadcasts it to everyone in that room. We also
handle "typing" indicators. The JWT is checked when the socket connects.

### task-4.4-socketio-client.md
Create the Socket.IO client for the frontend. We write a file that connects to the
server with the user's JWT token, and a React hook (`useSocket`) that lets components
easily send and listen for real-time events.

### task-4.5-composer-list.md
Build the message UI. The MessageList shows the conversation history (loaded from the
API) and appends new messages as they arrive in real time. The MessageComposer is the
input box where you type a message and press Enter to send it. It also shows your
message immediately (optimistic UI) before the server confirms it.

### task-4.6-test-chat-loop.md
Test real-time chat with two browser tabs. We log in as two different users in two
tabs, create a conversation between them, and send a message from one tab. The message
should appear instantly in the other tab. This proves the whole real-time loop works.

---

## 5. Group Chat — Letting users chat in groups

### task-5.1-group-helpers.md
Extend the conversation database functions to support groups. A group is just a
conversation with `isGroup=1`, a name, and more than two members. We add a function to
create a group with a name and a list of members, and a function to add a member to an
existing conversation.

### task-5.2-group-endpoint.md
Add a REST endpoint to create groups. The user sends a group name and a list of user
IDs. The creator is automatically a member. The endpoint returns the new group's ID.
This reuses the same patterns as the 1:1 conversation endpoint.

### task-5.3-group-ui.md
Update the conversation list to show groups differently. If a conversation is a group,
we show a group icon or the group name instead of treating it like a 1:1 chat. This
teaches conditional rendering — showing different UI based on data flags.

---

## 6. Minimal Admin — Letting admins manage users

### task-6.1-permission-middleware.md
Create a middleware that checks if a user has permission to do something. It looks up
the user's roles in the database, finds what permissions those roles have, and compares
against the required permission (like `users.create`). If the user doesn't have it,
they get "403 Forbidden". This is role-based access control (RBAC) in action.

### task-6.2-seed-admin.md
Create the first admin user. Since no admin exists yet, we write a script that creates
an `admin@example.com` account with a known password and assigns it the `admin` role
(which has all permissions). After running this script, you can log in as the admin.

### task-6.3-admin-endpoints.md
Build admin API endpoints for user management. `GET /api/admin/users` lists all users
(requires `users.read` permission). `POST /api/admin/users` creates a new user and can
assign a role (requires `users.create` permission). These are protected by the
permission middleware from task 6.1.

### task-6.4-admin-ui.md
Build a simple admin web page. It shows a table of all users and a form to create a new
user. Only people with the right permissions can see it. This connects the whole admin
feature: from database roles, to API permissions, to the web UI.

---

## 7. Polish & Verification — Finishing touches

### task-7.1-env-handling.md
Move secrets and settings into `.env` files instead of hard-coding them. The server
reads `JWT_SECRET` and `PORT` from its `.env`. The frontend reads `VITE_API_URL` from
its `.env`. We also create `.env.example` templates (without real secrets) so teammates
know what variables are needed. Real `.env` files are gitignored.

### task-7.2-cors-security.md
Configure CORS on the server so the frontend (on port 5174) is allowed to call the
backend (on port 3001). Without this, the browser blocks the requests. This teaches
why CORS errors happen and how to fix them.

### task-7.3-light-tests.md
Add a few tests using Vitest. We test the register and login endpoints, and we test
that sending a message to a conversation you're not a member of is rejected. These
aren't full coverage — just enough to protect the most important paths.

### task-7.4-document-commands.md
Write down the exact commands to start the project. We update `readme.md` with a quick
start guide (run the server in one terminal, the website in another) and fill in the
"Build & run commands" section in `AGENTS.md`. This makes the project reproducible for
anyone who clones it.
