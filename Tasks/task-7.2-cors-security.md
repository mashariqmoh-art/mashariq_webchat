# Task 7.2 — Add CORS and security basics

**Section:** 7. Polish & Verification
**Status:** 🟡 Partially done

## WHAT
Configure `cors` on the server to allow `http://localhost:5174`.

## WHY
The frontend dev server runs on a different port.

## HOW
- `app.use(cors({ origin: 'http://localhost:5174', credentials: true }))`

## BENEFIT
Students understand why CORS errors happen and how to fix them.

## Notes
- CORS already configured in `server/src/index.js` during Task 1.1
- Origin set to `http://localhost:5174` (user changed from default 5173)
