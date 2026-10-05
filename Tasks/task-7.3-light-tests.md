# Task 7.3 — Add light tests

**Section:** 7. Polish & Verification
**Status:** ⬜ Not started

## WHAT
Add a minimal test for auth and for sending a message.

## WHY
Students learn the testing pattern without full coverage overhead.

## HOW
- Install `vitest` in `server/`
- Test `POST /api/auth/register` and `POST /api/auth/login`
- Test `POST /api/conversations/:sid/messages` (member check)

## BENEFIT
Students see tests as a safety net for critical paths.

## Notes
- Test runner: Vitest (per team decision)
