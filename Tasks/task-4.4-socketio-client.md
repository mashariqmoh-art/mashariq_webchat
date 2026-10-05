# Task 4.4 — Add the Socket.IO client

**Section:** 4. Real-Time Messaging Slice
**Status:** ⬜ Not started

## WHAT
Create `website/src/shared/socket.js` that connects with the JWT in `auth`.

## WHY
The React UI needs a realtime connection.

## HOW
- Initialize `io('http://localhost:3001', { auth: { token } })`
- Expose `emit`/`on` helpers and connection state
- Add `useSocket` hook in `website/src/chat/useSocket.js` for components

## BENEFIT
Students see how to bridge Socket.IO into React components.
