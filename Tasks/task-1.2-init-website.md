# Task 1.2 — Initialize the website project

**Section:** 1. Foundation — Database & Project Skeleton
**Status:** ✅ Completed

## WHAT
Create `website/package.json` with React + Vite and a starter `index.html`.

## WHY
The frontend needs its own build/dev pipeline separate from the backend.

## HOW
- Run `npm create vite@latest website/ -- --template react` (or manually init Vite)
- Add scripts: `dev` (vite), `build`, `preview`
- Clean up the default `App.jsx` and `main.jsx` so they render a simple `<h1>Mashariq WebChat</h1>`

## BENEFIT
Students learn how Vite is configured and how the React dev server works.

## Notes
- Done manually (not via `npm create vite`) for more control
- Bootstrap installed as styling library (per team decision)
- socket.io-client installed for later steps
- Dev server configured on port 5174
