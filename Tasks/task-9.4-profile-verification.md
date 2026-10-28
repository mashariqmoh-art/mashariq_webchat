# Task 9.4 — Verify profile, status, authorization, and upload flows

**Section:** 9. User Profile & Status
**Status:** ✅ Completed

## WHAT
Verify profile viewing and editing, status clearing, picture persistence, and invalid or unauthorized requests.

## WHY
The profile touches account data and accepts user-uploaded files, so both correct persistence and failure handling matter.

## HOW
- Build the website and exercise profile reads and updates with an authenticated user.
- Confirm unauthenticated requests are rejected and read-only or unknown fields cannot be changed.
- Test length validation, unique-name conflicts, unsupported or malformed images, and the upload-size limit.
- Confirm an uploaded picture can be served after refresh and can be removed, restoring the default avatar.

## BENEFIT
The feature is verified across its API, storage, and chat UI paths without regressing existing functionality.

## Verification completed
- `npm run build` in `website/` succeeds.
- API integration checks passed for authentication, profile reads and edits, status clearing, protected fields, validation, uniqueness, picture uploads, serving, persistence, removal, malformed files, and the 2 MB limit.
- Chat payload checks passed for new-conversation users, direct-conversation avatars, and sender avatars on messages.
- Backend JavaScript syntax, schema diagram JSON parsing, and `git diff --check` passed.
