# Task 9.2 — Secure profile picture uploads and storage

**Section:** 9. User Profile & Status
**Status:** ✅ Completed

## WHAT
Accept, persist, serve, replace, and remove profile pictures.

## WHY
An uploaded avatar should remain available after refresh without allowing arbitrary files or paths to be stored.

## HOW
- Accept only PNG, JPEG, and WebP image data; verify image signatures and enforce the 2 MB limit.
- Store uniquely named files under the server's uploads directory and persist only the generated public path; use the Docker data volume for durable container storage.
- Require authentication, clean up replaced or removed files, and use an initial-based avatar when no picture exists.

## BENEFIT
Profile photos persist safely and can be reused by the chat interface.
