#!/bin/sh
set -e

cd /app/server

# Idempotent: skips when the admin user already exists.
node src/scripts/seed_admin.js

exec node src/index.js
