# Task 8.4 — Save call logs as chat messages

**Section:** 8. Video & Audio Calls
**Status:** ⬜ Not started

## WHAT
When a call ends, the server saves a `call_signal` message (`messageType_SID = 3`) in the conversation; `MessageList` renders it as a call entry instead of a chat bubble.

## WHY
Like WhatsApp, users see "Missed call" or "Video call · 4:12" right in the chat history. No new tables needed — the messageType lookup table already reserves type 3 for this.

## HOW
- On `call:end` (or reject/cancel/timeout), the server inserts a row into `table_Message` with `messageType_SID = 3` and JSON content like `{callType, status, durationSec}`
- The message is broadcast to the conversation room like a normal message so it appears instantly on both sides
- In `MessageList`, rows with `messageType_SID === 3` render as a centered call-log line with an icon (e.g. "Missed video call", "Audio call · 2:03")

## BENEFIT
Students see how one messages table can hold both user text and system entries — the `messageType` lookup does the work.
