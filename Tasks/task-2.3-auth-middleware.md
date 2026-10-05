# Task 2.3 — Add the auth middleware

**Section:** 2. Authentication Slice
**Status:** ⬜ Not started

## WHAT
Create `server/src/middleware/auth.js` that verifies the `Authorization: Bearer <token>` header and attaches `req.user`.

## WHY
Protected routes need to know who is calling them.

## HOW
- Extract the token from the header
- Verify with `jwt.verify(token, JWT_SECRET)`
- On success, attach `req.user` and call `next()`
- On failure, return `401 Unauthorized`

## BENEFIT
Students understand middleware and how JWTs protect routes.
