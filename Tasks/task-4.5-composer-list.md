# Task 4.5 — Build the message composer and message list

**Section:** 4. Real-Time Messaging Slice
**Status:** ⬜ Not started

## WHAT
Add `website/src/chat/MessageComposer.jsx` and `website/src/chat/MessageList.jsx`.

## WHY
Users need to read and send messages.

## HOW
- `MessageList` fetches history via `GET /api/conversations/:sid/messages` and appends realtime messages
- `MessageComposer` emits `message` event on Enter/click, also shows a local optimistic message

## BENEFIT
Students build the core chat loop: fetch history, join room, send, receive, display.

## Notes
- Styling: Bootstrap (per team decision)
