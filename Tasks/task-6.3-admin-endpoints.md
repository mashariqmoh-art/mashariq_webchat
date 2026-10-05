# Task 6.3 — Build minimal admin users endpoint

**Section:** 6. Minimal Admin Slice
**Status:** ⬜ Not started

## WHAT
Add `server/src/routes/admin.js` with `GET /api/admin/users` and `POST /api/admin/users`.

## WHY
The admin can list and create users to test chat.

## HOW
- Protect with `requirePermission('users.read')` and `users.create`
- `GET` returns a list of users
- `POST` creates a user and optionally assigns a role

## BENEFIT
Students connect RBAC to real admin endpoints.
