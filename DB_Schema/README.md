# DB_Schema

## Files

| File | Role |
|---|---|
| `schema.sql` | **Single source of truth.** The actual SQLite schema. Edit this. |
| `WebChat_schema_drawdb.json` | Derived artifact. For visualizing the ER diagram in [drawDB](https://drawdb.vercel.app). Do NOT edit by hand as the primary way to change the schema. |

## Workflow

1. Make schema changes in `schema.sql`.
2. Regenerate the drawDB JSON (or update it) to keep the diagram in sync.
3. The JSON exists only so the IDE / drawDB app can render the diagram. It does not drive the database.

## Why this order

SQL is what actually runs against SQLite and what the Node.js server loads. If the JSON and SQL ever disagree, **the SQL wins**.
