# Task 4.2 — Build the message REST endpoints

**Section:** 4. Real-Time Messaging Slice
**Status:** ⬜ Not started

## WHAT
Add `server/src/routes/messages.js`.

## WHY
When a user opens a conversation, the frontend fetches existing messages.

## HOW
- `GET /api/conversations/:sid/messages` → return messages the user is allowed to see (member check)
- `POST /api/conversations/:sid/messages` → save a message (HTTP fallback)

## BENEFIT
Students learn to check membership before returning private data.
