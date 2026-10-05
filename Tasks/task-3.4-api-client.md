# Task 3.4 — Create a shared API client

**Section:** 3. Conversations Slice
**Status:** ⬜ Not started

## WHAT
Add `website/src/shared/api.js` that wraps `fetch` and attaches the JWT token.

## WHY
Centralizes how the frontend talks to the backend.

## HOW
- `api.get(url)` / `api.post(url, body)` helpers
- Read `token` from `localStorage`
- Attach `Authorization: Bearer <token>` header
- Return JSON or throw on error

## BENEFIT
Students see how to keep API logic out of components.
