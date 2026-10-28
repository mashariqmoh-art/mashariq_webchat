# Task 7.5 — Build the "New Group" creation UI

**Section:** 7. Polish & Verification
**Status:** ⬜ Not started

## WHAT
Extend the "new conversation" dialog in `website/src/chat/ChatLayout.jsx` so users can create a group: pick multiple members, type a group name, and call `POST /api/groups`.

## WHY
The backend (`POST /api/groups`, task 5.2) and the group display (task 5.3) are done, but nothing in the UI calls the endpoint — there is currently no way to create a group without curl or a seed script.

## HOW
- Add a "New group" entry point next to the existing new-chat button (or a Direct/Group toggle at the top of the existing dialog — pick whichever is simpler)
- Reuse the existing user list from `GET /api/conversations/users`, but render rows with checkboxes so several members can be selected
- Add a required group-name text input
- On submit: `api.post('/api/groups', { name, memberSIDs })` → refresh `GET /api/conversations` → select the new group (same flow as `startConversation`)
- Show a clear error if no name or no members are chosen (the server already validates this)
- Add the new strings to the English + Arabic `copy` objects; all class components, Bootstrap styling per team decisions

## BENEFIT
Students see how one dialog pattern extends from "pick one user" to "pick many + extra field" — and the group feature becomes usable end to end.

## Notes
- Members who are added to a group only see it after their next conversation-list load/refresh. A socket push to notify new members can come later (personal rooms are added in task 8.1).
