# Task 4.1 — Add message DB helpers

**Section:** 4. Real-Time Messaging Slice
**Status:** ⬜ Not started

## WHAT
Create `server/src/db/messages.js` to insert and fetch messages.

## WHY
Messages must be saved before they are broadcast.

## HOW
- `createMessage({ conversationSID, senderSID, content })` → insert into `table_Message`
- `getMessagesForConversation(conversationSID)` → select by conversation, ordered by `createdAt` ASC

## BENEFIT
Students learn the data path for a chat message.
