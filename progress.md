# Progress

## Last Updated

2026-08-12

## Current Objective

**pwa** — Optional PWA via `frontier-fe init --pwa`. Implemented: `--pwa` flag wired in `packages/cli/src/index.ts`; `applyPwaConfig` in `init.ts` injects `vite-plugin-pwa` into the scaffolded `vite.config.ts` and a no-cache rule for `sw.js` into `docker/nginx.conf`; source app icon at `packages/cli/templates/base/pwa/public/pwa/icon.svg`; `vite-plugin-pwa` devDep added on `--pwa`. Docs at `docs/pwa.md`. **Verification passed — feature complete.**

## Active Feature

**pwa** — **done.** All Definition-of-Done criteria met (see `feature_list.json`).

## Last Verified

- Date: 2026-08-12
- Branch: main
- Result: **PASS** — all checks green
  - `cli:build`: pass
  - `sync:templates:check`: pass (0 errors — PWA icon asset is exempt from sync)
  - PWA smoke test: `init pwa-smoke --pwa --yes` → `npm run build` → emits `dist/sw.js`, `dist/manifest.webmanifest`, `dist/registerSW.js`; `<link rel="manifest">` auto-injected; `vite-plugin-pwa@1.3.0` installs clean on Vite 8
  - Non-PWA regression: plain scaffold has zero PWA artifacts
  - `./init.sh`: pass (lint, type-check, 998 tests, build)

## Blockers

None.

## Next Actions

1. Commit the PWA changes (e.g. `feat(cli): add optional PWA via init --pwa`)
2. Pick the next feature from `feature_list.json`

## Recommended Next Step

Commit and push. Note: the pre-existing `__dirname` warning in the base `vite.config.ts` is unrelated to PWA and out of scope.
