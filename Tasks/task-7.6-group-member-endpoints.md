# Task 7.6 — Add group member endpoints

**Section:** 7. Polish & Verification
**Status:** ⬜ Not started

## WHAT
Add REST endpoints in `server/src/routes/conversations.js` to add and remove members in a group conversation.

## WHY
Groups change over time. The DB layer already has `addMember`/`addMemberToConversation` and `isMember`, but no HTTP route exposes them — and there is no way to remove a member or leave a group.

## HOW
- `POST /api/conversations/:sid/members { userSID }` → requester must be a member with `isGroupAdmin=1` (member list is already returned by `getConversationBySID`); reject if target is already a member; only for `isGroup=1`
- `DELETE /api/conversations/:sid/members/:userSID` → group admin may remove anyone; a member may remove themselves ("leave group")
- Add a `removeMember(conversationSID, userSID)` helper to the conversation repositories (both `conversations_mysql` and `conversations_oracle` patterns, whichever is active via `db_builder`) and expose it through `db/conversations.js`
- Guard every path with the same membership/`isGroup` checks used by `getOne`

## BENEFIT
Students learn admin-vs-self permission rules on the same resource and how a soft "leave" is just self-removal.

## Notes
- Decide what happens when the last member leaves or the only admin leaves — for v1 it is fine to keep the empty group and record the choice here.
