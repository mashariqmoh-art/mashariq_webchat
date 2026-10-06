# Task 2.2 — Test the auth flow

**Section:** 2. Authentication Slice
**Status:** ✅ Completed

## WHAT
Write a small test or use `curl` to register a user, log in, and call a protected route.

## WHY
Catches mistakes before building more features.

## HOW
- Add a `GET /api/me` protected route that returns `req.user`
- Use curl or a small `server/tests/auth.test.js` (if test tooling is added)

## BENEFIT
Students learn to verify auth end-to-end before relying on it.
