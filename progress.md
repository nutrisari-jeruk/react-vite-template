# Progress

## Last Updated

2026-10-16

## Current Objective

**template-reliability — done.** Implemented all eight frontend-template audit fixes. Canonical generated paths match src/libs, src/tests, camelCase hooks, and PascalCase components. CLI records dependencies before optional installation, completes transitive registry dependencies, wires routes/imports, and exits nonzero on installation failure.

Authentication uses QUERY_KEYS.AUTH.USER and backend /auth/me identity. Removed legacy auth hooks/store. Added explicit authenticated/otp-required mutation results, pending-OTP guards, logout cleanup, session-version protection for in-flight work, separate single-flight refresh transport with token rotation, and private-cache cleanup on session expiry. Registration now exposes the username required by its production schema; tests no longer substitute a relaxed schema.

QueryClient is shared with mutation retry disabled. DataTable selection requires a stable getRowId; filtering follows parent state. Added registry validation, scaffold smoke runner, CI/release gates, implementation plan, and migration guide.

## Verification

- `./init.sh`: PASS — lint with zero warnings, source/Node/test type-check, 942 tests across 74 files, production build.
- `npm run test:coverage -- --run`: PASS — statements 92.22%, branches 85.71%, functions 90.13%, lines 93.12%; existing 70% thresholds preserved.
- `npm run cli:build`: PASS.
- `npm run sync:templates:check`: PASS — 89 shared registry files, 31 base files, 1 shared doc; intentional template-only sections/blocks verified separately.
- `npm run check:registry`: PASS — 53 items, dependency closures, local imports, template case checks.
- `npm run smoke:cli`: PASS with a fresh npm-installed PWA dependency superset; eight isolated scenarios: base, auth, all auth pages, all UI, three Login block variants, PWA. Each scenario type-checks, runs a real DOM test, and builds. Also verifies repeated add, persisted dependency manifests and nonzero install failure.
- Final rerun against the same installed dependency superset: PASS for all eight scenarios after the final source/CLI changes.
- `git diff --check`: PASS.

Final smoke logs: `/var/folders/6v/qtlqjzld0870jwhns0xq1x7w0000gn/T/frontier-smoke-jVShzu/commands.log`.

## Constraints and Remaining Boundaries

Local `.claude/settings.json` changes were preserved and excluded from automatic template synchronization. Backend URLs and existing payload fields were retained; an optional refreshToken field is accepted when provided. No dependency upgrades, commit, npm publication, or deployment were performed. Real backend/browser visual verification remains outside this audit-fix scope. Existing React SWC performance advice is informational.

## Next Actions

Review the diff and `docs/migrations/template-reliability.md` before releasing a version with the documented breaking changes. Existing generated projects need explicit migration; adding already-installed registry items does not upgrade their source automatically. Historical feature tracker entries were otherwise preserved.
