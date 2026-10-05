# Task 3.2 — Build conversation REST endpoints

**Section:** 3. Conversations Slice
**Status:** ⬜ Not started

## WHAT
Add `server/src/routes/conversations.js` with protected endpoints.

## WHY
The frontend needs to list and create conversations.

## HOW
- `GET /api/conversations` → list current user's conversations
- `POST /api/conversations` with `{ otherUserSID }` → create a 1:1 conversation
- `GET /api/conversations/:sid` → get details + members of one conversation

## BENEFIT
Students build a REST API and understand route parameters and ownership checks.
