# Mashariq WebChat — Task Index

Each step from the build plan is a separate task file in this folder.
Status legend: ✅ Completed · 🟡 Partial · ⬜ Not started

## 1. Foundation — Database & Project Skeleton
| Task | File | Status |
|---|---|---|
| 1.1 Initialize the server project | [task-1.1-init-server.md](task-1.1-init-server.md) | ✅ |
| 1.2 Initialize the website project | [task-1.2-init-website.md](task-1.2-init-website.md) | ✅ |
| 1.3 Wire the database to the server | [task-1.3-wire-database.md](task-1.3-wire-database.md) | ✅ |
| 1.4 Verify with a health endpoint | [task-1.4-verify-health.md](task-1.4-verify-health.md) | ✅ |

## 2. Authentication Slice
| Task | File | Status |
|---|---|---|
| 2.1 Create the user table helpers | [task-2.1-user-helpers.md](task-2.1-user-helpers.md) | ✅ |
| 2.2 Build the register and login endpoints | [task-2.2-auth-endpoints.md](task-2.2-auth-endpoints.md) | ✅ |
| 2.3 Add the auth middleware | [task-2.3-auth-middleware.md](task-2.3-auth-middleware.md) | ✅ |
| 2.4 Test the auth flow | [task-2.4-test-auth.md](task-2.4-test-auth.md) | ✅ |

## 3. Conversations Slice
| Task | File | Status |
|---|---|---|
| 3.1 Add conversation DB helpers | [task-3.1-conversation-helpers.md](task-3.1-conversation-helpers.md) | ⬜ |
| 3.2 Build conversation REST endpoints | [task-3.2-conversation-endpoints.md](task-3.2-conversation-endpoints.md) | ⬜ |
| 3.3 Create the chat layout in React | [task-3.3-chat-layout.md](task-3.3-chat-layout.md) | ⬜ |
| 3.4 Create a shared API client | [task-3.4-api-client.md](task-3.4-api-client.md) | ⬜ |

## 4. Real-Time Messaging Slice
| Task | File | Status |
|---|---|---|
| 4.1 Add message DB helpers | [task-4.1-message-helpers.md](task-4.1-message-helpers.md) | ⬜ |
| 4.2 Build the message REST endpoints | [task-4.2-message-endpoints.md](task-4.2-message-endpoints.md) | ⬜ |
| 4.3 Add Socket.IO to the server | [task-4.3-socketio-server.md](task-4.3-socketio-server.md) | ⬜ |
| 4.4 Add the Socket.IO client | [task-4.4-socketio-client.md](task-4.4-socketio-client.md) | ⬜ |
| 4.5 Build the message composer and list | [task-4.5-composer-list.md](task-4.5-composer-list.md) | ⬜ |
| 4.6 Test the chat loop | [task-4.6-test-chat-loop.md](task-4.6-test-chat-loop.md) | ⬜ |

## 5. Group Chat Slice
| Task | File | Status |
|---|---|---|
| 5.1 Extend conversation helpers for groups | [task-5.1-group-helpers.md](task-5.1-group-helpers.md) | ⬜ |
| 5.2 Add group REST endpoint | [task-5.2-group-endpoint.md](task-5.2-group-endpoint.md) | ⬜ |
| 5.3 Update the UI to distinguish 1:1 vs group | [task-5.3-group-ui.md](task-5.3-group-ui.md) | ⬜ |

## 6. Minimal Admin Slice
| Task | File | Status |
|---|---|---|
| 6.1 Add permission-check middleware | [task-6.1-permission-middleware.md](task-6.1-permission-middleware.md) | ⬜ |
| 6.2 Seed the first admin user | [task-6.2-seed-admin.md](task-6.2-seed-admin.md) | ⬜ |
| 6.3 Build minimal admin users endpoint | [task-6.3-admin-endpoints.md](task-6.3-admin-endpoints.md) | ⬜ |
| 6.4 Build a minimal admin UI | [task-6.4-admin-ui.md](task-6.4-admin-ui.md) | ⬜ |

## 7. Polish & Verification
| Task | File | Status |
|---|---|---|
| 7.1 Add `.env` handling | [task-7.1-env-handling.md](task-7.1-env-handling.md) | 🟡 |
| 7.2 Add CORS and security basics | [task-7.2-cors-security.md](task-7.2-cors-security.md) | 🟡 |
| 7.3 Add light tests | [task-7.3-light-tests.md](task-7.3-light-tests.md) | ⬜ |
| 7.4 Document build & run commands | [task-7.4-document-commands.md](task-7.4-document-commands.md) | ⬜ |

## Decisions
- **Test runner:** Vitest
- **State management:** Plain React (useState/useContext)
- **Styling:** Bootstrap
- **Frontend port:** 5174 (user changed from default 5173)
