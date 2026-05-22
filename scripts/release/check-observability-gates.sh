#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "==> Validating observability and incident routing artifacts"

required_files=(
  "docs/devops/observability-gate-checks.md"
  "docs/devops/incident-routing-matrix.md"
  "docs/devops/incident-response-runbook.md"
  "docs/program/oncall-operations-plan.md"
  "docs/program/rollback-validation-report.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required observability artifact: $file"
    exit 1
  fi
done

if ! rg -q "Sev-1" "docs/devops/incident-routing-matrix.md"; then
  echo "Incident routing matrix must define Sev-1 routing."
  exit 1
fi

if ! rg -q "error budget" "docs/devops/observability-gate-checks.md"; then
  echo "Observability gate checks must include error budget criteria."
  exit 1
fi

if ! rg -q "npm run release:verify" "docs/devops/observability-gate-checks.md"; then
  echo "Observability gate checks must reference release verification."
  exit 1
fi

if rg -q "TBD" "docs/program/rollback-validation-report.md"; then
  echo "Rollback validation report still contains TBD placeholders."
  exit 1
fi

echo "==> Observability and incident routing gates passed"
