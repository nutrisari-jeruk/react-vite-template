#!/usr/bin/env bash
set -euo pipefail

# init.sh — single verification entrypoint for agent sessions
# Fails fast: stops on the first failing step.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "==> [1/4] Lint"
npm run lint -- --max-warnings=0

echo "==> [2/4] Type check"
npm run type-check

echo "==> [3/4] Tests"
npm run test:run

echo "==> [4/4] Build"
npm run build

echo "==> All checks passed."
