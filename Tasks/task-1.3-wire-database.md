# Task 1.3 — Wire the database to the server

**Section:** 1. Foundation — Database & Project Skeleton
**Status:** ⬜ Not started

## WHAT
Create `server/src/db/db.js` that opens `chat.sqlite`, runs `schema.sql`, and exports a `db` object.

## WHY
The schema already exists; the server needs to load it so the app has tables and seed data.

## HOW
- Load `DB_Schema/schema.sql` and execute it with `db.exec(fs.readFileSync(...))`
- Run `db.pragma('foreign_keys = ON')` after opening
- Export `db` so routes and sockets can import it
- Add `*.sqlite` to `.gitignore`

## BENEFIT
Students understand the "schema as source of truth" rule: SQL is loaded automatically on startup.
