#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

PORT="${E2E_BACKEND_PORT:-18080}"
API_BASE_URL="${E2E_API_BASE_URL:-http://127.0.0.1:${PORT}}"
BACKEND_LOG="${E2E_BACKEND_LOG:-/tmp/rentiqo-staging-backend.log}"
BACKEND_PID=""

cleanup() {
  if [[ -n "$BACKEND_PID" ]]; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

echo "==> Starting backend for staging/mobile e2e (${API_BASE_URL})"
PORT="$PORT" \
DATA_STORE_MODE="${DATA_STORE_MODE:-memory}" \
DATABASE_URL="${DATABASE_URL:-}" \
DATABASE_SSL="${DATABASE_SSL:-false}" \
npx tsx apps/backend/src/index.ts >"$BACKEND_LOG" 2>&1 &
BACKEND_PID="$!"

echo "==> Waiting for backend readiness"
for attempt in $(seq 1 60); do
  if curl -fsS "${API_BASE_URL}/v1/health" >/dev/null 2>&1; then
    echo "==> Backend ready"
    break
  fi

  if [[ "$attempt" -eq 60 ]]; then
    echo "Backend did not become healthy in time. Log: ${BACKEND_LOG}"
    exit 1
  fi

  sleep 1
done

echo "==> Running mobile staging smoke journey"
E2E_API_BASE_URL="$API_BASE_URL" EXPO_PUBLIC_API_BASE_URL="$API_BASE_URL" npm run test:staging-e2e -w @rentiqo/mobile
echo "==> Staging/mobile e2e smoke passed"
