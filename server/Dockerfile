# Build context is the repository root (db.js loads ../DB_Schema/schema.sql).

# --- deps: compile native modules (better-sqlite3 has no prebuilt binary for this image)
FROM node:22-bookworm-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# --- runtime
FROM node:22-bookworm-slim
WORKDIR /app

COPY --from=deps /app/server/node_modules server/node_modules
COPY server/package.json server/package.json
COPY server/src server/src
COPY DB_Schema DB_Schema

# Persist the SQLite file in a volume without shadowing the app code.
RUN mkdir -p /data && ln -sfn /data/chat.sqlite /app/server/chat.sqlite

COPY server/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV PORT=3001
EXPOSE 3001

WORKDIR /app/server
ENTRYPOINT ["/app/docker-entrypoint.sh"]
