# Task 7.7 — Build the group members UI

**Section:** 7. Polish & Verification
**Status:** ⬜ Not started

## WHAT
Add a "Group info" panel/dialog opened from the group chat header in `website/src/chat/` that lists members and — for group admins — offers add/remove controls plus a "Leave group" action.

## WHY
Users need to see who is in a group, and admins need a way to manage membership using the endpoints from task 7.6.

## HOW
- Clicking the group header (or a small info icon) in `MessageView` opens a panel/dialog listing members from `GET /api/conversations/:sid` (members are already included in the response, each with `isGroupAdmin`)
- Show an "Admin" label next to admins
- If the current user is an admin: "Add member" opens the user picker filtered to non-members → `POST /api/conversations/:sid/members`; each member row gets a remove button → `DELETE /api/conversations/:sid/members/:userSID`
- Every member sees a "Leave group" button → `DELETE` on their own SID
- After each change, refetch the conversation so the member list stays accurate; after leaving, drop back to the conversation list
- English + Arabic strings, class components, Bootstrap per team decisions

## BENEFIT
Students practice role-dependent UI (same screen, different controls for admin vs member) — a pattern reused later in the admin site.

## Notes
- Depends on tasks 7.6 (endpoints) and 5.3 (group display already done).
