# Task 6.1 — Add permission-check middleware

**Section:** 6. Minimal Admin Slice
**Status:** ⬜ Not started

## WHAT
Create `server/src/middleware/requirePermission.js`.

## WHY
Admin actions must check the RBAC tables defined in the schema.

## HOW
- Read user's roles from `table_UserRole`
- Read permissions for those roles from `table_RolePermission`
- Compare against the required permission name
- Return `403 Forbidden` if missing

## BENEFIT
Students learn how role-based access control is implemented at the code level.
