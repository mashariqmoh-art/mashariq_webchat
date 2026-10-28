# Task 8.3 — Build the call UI

**Section:** 8. Video & Audio Calls
**Status:** ⬜ Not started

## WHAT
Add `chat/VideoCall.jsx` (full-screen call overlay), `chat/IncomingCall.jsx` (ringing modal), and call buttons in `MessageView` for 1:1 conversations.

## WHY
Users need a way to start a call, answer one, and see each other.

## HOW
- `MessageView` header: audio and video call buttons, shown only when `isGroup === 0`; they call `onStartCall(callType)` up to `ChatLayout`
- `VideoCall`: remote video full-screen, local video small in a corner (picture-in-picture), mute / camera-off / hang-up buttons; shows "calling…" / "connecting…" states
- `IncomingCall`: caller's nickName + call type, with Accept and Decline buttons
- `ChatLayout` subscribes to `callManager` events and renders the right overlay based on call state (`idle` → `ringing` → `in-call` → `ended`)
- All class components (project convention)

## BENEFIT
Students learn how a singleton service can drive UI state through simple event subscriptions — no state-management library needed.
