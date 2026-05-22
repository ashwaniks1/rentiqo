#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "==> Running release readiness verification"

required_files=(
  "docs/program/release-gates.md"
  "docs/program/launch-day-checklist.md"
  "docs/program/go-no-go-decision-log.md"
  "docs/program/rollback-validation-report.md"
  "docs/devops/observability-gate-checks.md"
  "docs/devops/incident-routing-matrix.md"
  "docs/qa/release-quality-gates.md"
  "docs/compliance/privacy-and-data-governance.md"
  "docs/release/release-evidence-manifest.md"
)

echo "==> Checking required release documentation"
for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file"
    exit 1
  fi
done

echo "==> Running typecheck"
npm run typecheck

echo "==> Running test suites"
npm test

echo "==> Running observability and incident routing checks"
bash scripts/release/check-observability-gates.sh

echo "==> Release readiness verification passed"
