#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Start MongoDB
echo "==> Starting MongoDB..."
docker compose up -d mongo
until docker exec tumaini-mongo mongosh --quiet --eval "db.runCommand('ping').ok" 2>/dev/null | grep -q 1; do
  sleep 1
done
echo "    MongoDB is ready."

# Ensure uploads directory exists
mkdir -p api/uploads

# Start API with local DB override (env vars override dotenv's .env)
echo "==> Starting API..."
cd "$ROOT/api"
DB_URL="mongodb://localhost:27017/Tumaini" \
UPLOAD_DIR="./uploads/" \
MODE="DEV" \
npm start &
API_PID=$!

# Start frontend pointing to local API
echo "==> Starting frontend..."
cd "$ROOT"
VITE_API_URL="http://localhost:3000" npm run dev &
FE_PID=$!

# Start admin pointing to local API + local files
echo "==> Starting admin..."
cd "$ROOT/admin"
VITE_API_URL="http://localhost:3000" \
VITE_FILES_URL="http://localhost:3000/uploads/" \
npm run dev -- --port 5174 &
ADMIN_PID=$!

echo ""
echo "==> Dev environment is running:"
echo "    API:      http://localhost:3000"
echo "    Frontend: http://localhost:5173"
echo "    Admin:    http://localhost:5174"
echo "    MongoDB:  mongodb://localhost:27017/Tumaini"
echo ""
echo "Press Ctrl+C to stop all services."

cleanup() {
  echo ""
  echo "==> Shutting down..."
  kill $API_PID $FE_PID $ADMIN_PID 2>/dev/null || true
  wait $API_PID $FE_PID $ADMIN_PID 2>/dev/null || true
  echo "    Done. (MongoDB keeps running — stop with: docker compose down)"
}
trap cleanup INT TERM

wait
