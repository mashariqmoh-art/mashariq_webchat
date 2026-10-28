# Task 8.5 — Test the call loop

**Section:** 8. Video & Audio Calls
**Status:** ⬜ Not started

## WHAT
Test a real call between two users in two browser windows.

## WHY
Proves the whole chain works: invite → ring → answer → signaling → live media → hang-up → call log in history.

## HOW
- Open two browsers (or a normal + private window) on `localhost`, log in as two different users who share a 1:1 conversation
- Start a video call on one side → ringing modal appears on the other → accept → both videos play
- Test mute, camera toggle, and hang-up from each side
- Test decline and cancel paths → the correct "Missed call" / "Call ended" entries appear in the chat history
- Repeat for an audio-only call

## BENEFIT
End-to-end confidence that signaling, media, and persistence all work together.

## Notes
- On a second device over LAN, `getUserMedia` is blocked on plain HTTP — test on `localhost` or set up HTTPS first
