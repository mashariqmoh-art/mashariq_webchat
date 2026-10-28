# Task 8.1 — Add call signaling to the server

**Section:** 8. Video & Audio Calls
**Status:** ⬜ Not started

## WHAT
Create `server/src/sockets/call.js` — a `CallSockets` class that relays WebRTC signaling between two users over Socket.IO, and wire it into `server/src/index.js`.

## WHY
Two browsers can't send media to each other until they swap "business cards" first (SDP descriptions and ICE candidates). The server relays these small messages. It never touches the video/audio itself — media flows directly between the two browsers.

## HOW
- On connection, every socket joins a personal room `user_<SID>` so `call:incoming` reaches the user anywhere in the app
- `call:invite {conversationSID, callType, callId}` → check membership + callee not busy → emit `call:incoming` to the callee's room
- `call:answer {callId, accept}` → emit `call:answered` to the caller
- `call:signal {callId, data}` → relay SDP/ICE payloads to the other party
- `call:end {callId, reason}` → emit `call:ended` to both sides
- Keep an in-memory `Map` of active calls; end a call automatically if a participant disconnects

## BENEFIT
Students learn that signaling is just relaying messages — the server acts as a matchmaker, not a media server.
