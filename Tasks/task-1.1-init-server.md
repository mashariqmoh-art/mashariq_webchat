# Task 1.1 — Initialize the server project

**Section:** 1. Foundation — Database & Project Skeleton
**Status:** ✅ Completed

## WHAT
Create `server/package.json`, install core packages, and create an `index.js` entry point.

## WHY
The backend needs a package manifest and dependencies before any code can run.

## HOW
- Run `npm init` in `server/`
- Install: `express`, `better-sqlite3`, `bcryptjs`, `jsonwebtoken`, `socket.io`, `cors`, `dotenv`
- Install dev: `nodemon`
- Add scripts: `dev` (nodemon src/index.js) and `start` (node src/index.js)
- Create `server/src/index.js` that listens on port 3001

## BENEFIT
Students see how a Node.js project is bootstrapped and which library solves which problem (Express for HTTP, better-sqlite3 for the DB, Socket.IO for realtime, etc.)

## Notes
- CORS origin set to `http://localhost:5174` (matches Vite dev server port)
- `.env` and `.gitignore` created alongside this step
