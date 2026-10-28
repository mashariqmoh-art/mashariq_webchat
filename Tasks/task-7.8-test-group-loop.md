# Task 7.8 — Test the group loop

**Section:** 7. Polish & Verification
**Status:** ⬜ Not started

## WHAT
Verify the whole group feature end to end in the browser, the same way task 4.6 verified 1:1 chat.

## WHY
Catches wiring mistakes across creation, membership, and realtime delivery before moving on to calls.

## HOW
- Log in as user A, create a group with users B and C from the new UI — name + member picker (task 7.5)
- Log in as B in a second browser/tab, refresh, and confirm the group appears with the group badge and name
- Send a message from A and confirm it arrives in B's tab in real time (socket rooms already broadcast to all members)
- As the group admin, add another member and remove one via the Group info panel (tasks 7.6/7.7)
- Have a member leave the group and confirm they can no longer open it or send to it (member check on `GET /api/conversations/:sid/messages`)
- Confirm 1:1 conversations still work exactly as before

## BENEFIT
Students get a repeatable manual checklist that proves group chat behaves like a real WhatsApp group.

## Notes
- Known v1 limitation: new members see the group only after refreshing/reloading their conversation list.
