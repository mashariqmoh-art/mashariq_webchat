# Task 8.2 — Build the call manager on the client

**Section:** 8. Video & Audio Calls
**Status:** ⬜ Not started

## WHAT
Add `website/src/shared/callManager.js` — a singleton class (same pattern as `socketClient`) that owns the camera/microphone, the `RTCPeerConnection`, and all call-related socket events.

## WHY
WebRTC code is stateful and tricky. Keeping it in one plain class — out of React components — makes it easy to follow, test, and reuse from any UI.

## HOW
- `startCall(conversation, callType)` → `getUserMedia` → create `RTCPeerConnection` → emit `call:invite`
- `acceptCall(callId)` / `rejectCall(callId)` / `endCall()`
- Listen for `call:incoming`, `call:answered`, `call:signal`, `call:ended` on the socket and feed SDP/ICE into the peer connection
- `toggleMute()` / `toggleCamera()` enable/disable local media tracks
- A small `on/off` event registry so components can update their state on call events
- STUN only for now: `iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]`

## BENEFIT
Students meet the three WebRTC ingredients — `getUserMedia` (capture), `RTCPeerConnection` (transport), and signaling (task 8.1) — in one place.

## Notes
- `getUserMedia` needs a secure context; `localhost` counts, so dev works over plain HTTP
