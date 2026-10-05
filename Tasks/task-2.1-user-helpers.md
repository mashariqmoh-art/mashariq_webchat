# Task 2.1 — Create the user table helpers

**Section:** 2. Authentication Slice
**Status:** ⬜ Not started

## WHAT
Add `server/src/db/users.js` with functions to create a user, find by email, and find by SID.

## WHY
Auth needs to read and write user records securely.

## HOW
- `createUser({ name, email, nickName, mobileNo, password })` → hash password with `bcryptjs.hashSync(password, 10)`, insert into `table_User`
- `findUserByEmail(email)` → select by email
- `findUserBySID(sid)` → select by SID

## BENEFIT
Students learn to never store plain-text passwords and to centralize DB queries in one module.
