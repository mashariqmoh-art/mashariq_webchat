# Task 5.2 — Add group REST endpoint

**Section:** 5. Group Chat Slice
**Status:** ⬜ Not started

## WHAT
Add `POST /api/groups` in `conversations.js`.

## WHY
Users can create group conversations.

## HOW
- Accept `{ name, memberSIDs }`
- Creator is automatically a member
- Return the new group SID

## BENEFIT
Students reuse the existing REST patterns for a new feature.
