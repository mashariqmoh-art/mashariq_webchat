# Task 9.1 — Persist profile data and add authenticated endpoints

**Section:** 9. User Profile & Status
**Status:** ✅ Completed

## WHAT
Store a profile picture path and short status with each user, and expose authenticated endpoints for viewing and editing the signed-in user's permitted profile fields.

## WHY
Profile details must survive refreshes and must be private to the authenticated account.

## HOW
- Add `profilePicturePath` and `status` to `table_User`, including additive migration for existing databases.
- Add `GET /api/profile` and `PATCH /api/profile`; permit name, nickname, mobile number, and status changes only.
- Keep email read-only, enforce lengths and required values, and report uniqueness conflicts.

## BENEFIT
Users can safely retrieve and update their own account information without exposing password data or editing another account.
