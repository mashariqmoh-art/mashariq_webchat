# Task 5.1 — Extend conversation helpers for groups

**Section:** 5. Group Chat Slice
**Status:** ⬜ Not started

## WHAT
Update `server/src/db/conversations.js` to support `isGroup=1`, group names, and multiple members.

## WHY
Group chats are a natural extension of 1:1 conversations.

## HOW
- `createGroup({ creatorSID, name, memberSIDs })` → insert conversation with isGroup=1, add all members
- `addMemberToConversation({ conversationSID, userSID })` for future admin use

## BENEFIT
Students see how the same tables support both 1:1 and groups with one flag.
