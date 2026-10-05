# Task 6.2 — Seed the first admin user

**Section:** 6. Minimal Admin Slice
**Status:** ⬜ Not started

## WHAT
Add a script `server/scripts/seedAdmin.js` or a SQL seed to create `admin@example.com` with the `admin` role.

## WHY
You cannot log in as an admin until one exists.

## HOW
- Insert a user with a known hashed password
- Assign `table_UserRole` with `role_SID=1` (admin)
- Print instructions to the console

## BENEFIT
Students see how seed data and roles combine to create an admin account.
