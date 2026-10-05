# Task 3.1 — Add conversation DB helpers

**Section:** 3. Conversations Slice
**Status:** ⬜ Not started

## WHAT
Create `server/src/db/conversations.js` with functions to create a 1:1 conversation, add members, list a user's conversations, and find one by SID.

## WHY
Messages belong inside conversations; users need to know which conversations they are in.

## HOW
- `createConversation({ creatorSID, otherUserSID })` → insert into `table_Conversation` (isGroup=0), then add two members to `table_ConversationMember`
- `getConversationsForUser(userSID)` → join `table_ConversationMember` + `table_Conversation`
- `getConversationBySID(sid)` → select one conversation with its members

## BENEFIT
Students learn how 1:1 relationships are modeled (conversation + exactly two members).
