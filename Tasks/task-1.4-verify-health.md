# Task 1.4 — Verify with a health endpoint

**Section:** 1. Foundation — Database & Project Skeleton
**Status:** ✅ Completed

## WHAT
Add `GET /api/health` that returns `{ ok: true }`.

## WHY
Confirms the server, Express, and database can start without errors.

## HOW
- Add a `/api/health` route in `server/src/index.js`
- Run `npm run dev` in `server/`
- Test with `curl http://localhost:3001/api/health`

## BENEFIT
A quick sanity check before moving to real features.

## Notes
- The `/api/health` route already exists from Task 1.1, but this task should verify it works *with the database wired in* (Task 1.3).
