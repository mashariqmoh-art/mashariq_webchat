# Task 2.2 — Build the register and login endpoints

**Section:** 2. Authentication Slice
**Status:** ⬜ Not started

## WHAT
Add `server/src/routes/auth.js` with `POST /api/auth/register` and `POST /api/auth/login`.

## WHY
Users need accounts and a way to prove who they are.

## HOW
- Register: validate email/password, call `createUser`, return success
- Login: find user by email, compare password with `bcryptjs.compareSync`, issue a JWT with `jsonwebtoken.sign({ userSID, nickName })`, return `{ token, user }`
- Mount `auth.js` in `index.js` at `/api/auth`

## BENEFIT
Students see the full registration/login flow: hashing, validation, token creation.
