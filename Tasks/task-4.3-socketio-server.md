# Task 4.3 — Add Socket.IO to the server

**Section:** 4. Real-Time Messaging Slice
**Status:** ⬜ Not started

## WHAT
Integrate Socket.IO in `server/src/index.js` and create `server/src/sockets/chat.js`.

## WHY
Messages need to arrive instantly without polling.

## HOW
- Attach Socket.IO to the Express server
- Verify the JWT in the Socket.IO `auth` handshake
- Handle `join` event: `socket.join('conv_<conversationSID>')` after membership check
- Handle `message` event: save to DB, emit `message` to the room
- Handle `typing` event: broadcast `typing` to the room except sender

## BENEFIT
Students learn rooms, handshake auth, and realtime broadcasting.
