#!/usr/bin/env bash
set -euo pipefail

# Copy live MongoDB Atlas database to local Docker MongoDB
# Prerequisites: brew install mongodb/brew/mongodb-database-tools
# Usage: ./scripts/copy-live-db.sh

LIVE_URI="REDACTED_ATLAS_URI"
LOCAL_URI="mongodb://localhost:27017/Tumaini"
DUMP_DIR="/tmp/tumaini-dump"

echo "==> Ensuring local MongoDB is running..."
docker compose up -d mongo

echo "==> Waiting for MongoDB to be ready..."
until docker exec tumaini-mongo mongosh --quiet --eval "db.runCommand('ping').ok" 2>/dev/null | grep -q 1; do
  sleep 1
done
echo "    MongoDB is ready."

echo "==> Dumping live database from Atlas..."
mongodump --uri="$LIVE_URI" --out="$DUMP_DIR"

echo "==> Restoring to local MongoDB..."
mongorestore --uri="$LOCAL_URI" --drop "$DUMP_DIR/Tumaini"

echo "==> Cleaning up dump files..."
rm -rf "$DUMP_DIR"

echo ""
echo "Done! Local dev database is ready."
echo "Connection string: mongodb://localhost:27017/Tumaini"
