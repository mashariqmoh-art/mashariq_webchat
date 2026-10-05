# Task 7.1 — Add `.env` handling

**Section:** 7. Polish & Verification
**Status:** 🟡 Partially done

## WHAT
Create `.env` files for `JWT_SECRET` and ports, and a `.env.example` template.

## WHY
Secrets and config should not be hard-coded.

## HOW
- `server/.env` with `JWT_SECRET` and `PORT`
- `website/.env` with `VITE_API_URL`
- Add `.env` to `.gitignore`

## BENEFIT
Students learn to keep secrets out of source control.

## Notes
- `server/.env` and `website/.env` already created during Tasks 1.1/1.2
- Still TODO: create `.env.example` template files for both projects
