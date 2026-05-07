#!/usr/bin/env bash
# Run from repo root: bash deploy/scripts/redeploy.sh [web|admin|api|all]
set -euo pipefail
TARGET="${1:-all}"
HOST="hoster"
REMOTE="/home/ruben/stacks/tumaini"

echo ">> rsync source to $HOST"
rsync -az --delete \
  --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='backups' \
  --exclude='.idea' --exclude='.vscode' --exclude='.DS_Store' \
  --exclude='admin/dist' --exclude='api/dist' \
  --exclude='tests/screenshots/captures' --exclude='tests/screenshots/results' \
  --exclude='tests/screenshots/report' --exclude='tumaini_code_archive.*' \
  --exclude='bun.lockb' --exclude='deploy/files-data' \
  ./ "$HOST:$REMOTE/"

echo ">> rebuild + up: $TARGET"
if [ "$TARGET" = "all" ]; then
  ssh "$HOST" "cd $REMOTE && docker compose -f deploy/compose.yml up -d --build"
else
  ssh "$HOST" "cd $REMOTE && docker compose -f deploy/compose.yml up -d --build $TARGET"
fi

echo ">> status"
ssh "$HOST" "docker compose -f $REMOTE/deploy/compose.yml ps"
