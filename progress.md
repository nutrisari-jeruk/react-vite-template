# Progress

## Last Updated

2026-10-23

## Current Objective

**form-field-identity — done.** Shared controls use unique, stable automatic IDs while preserving explicit caller IDs. Shared Form consumers fail clearly when FormField or FormItem context is missing. Real-backend testing is deferred because the user does not yet have a development backend; independent frontend work can continue.

## Mock/backend switch (previous work)

**mock-backend-switch — done.** `VITE_ENABLE_MOCKS` is an explicit, development-only opt-in, defaulting to false. Production ignores it. Cleanup removes the application MSW registration, reloads before React mounts if the old controller remains, and preserves unrelated/PWA workers. Startup failures stop rendering instead of silently changing request behavior. CLI starters share the bootstrap and include empty project-specific handlers; generated manifests let MSW refresh the worker on dependency installation.

## Template reliability (previous work)

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


## Docker/Nginx Follow-up — 2026-10-23

**docker-runtime — done.** Previous application/scaffold reliability changes were committed as `76075fa`. This section records verification for the Docker follow-up.

- Reproduced the original `worker_processes directive is not allowed here` failure using the official Nginx image.
- Install the full configuration at `/etc/nginx/nginx.conf`; reuse the image's nginx user. Runtime port is 8080; Compose still exposes host port 80 by default.
- PID and request temporary files use `/tmp`, mounted as writable tmpfs; logs go to stdout/stderr. The runtime works with a read-only root and all Linux capabilities dropped.
- Both showcase and scaffolds build through `npm run build`. Locked projects use npm ci; fresh scaffolds without a lock use npm install. Retained the original legacy-peer-deps policy after reproducing a resolver failure on an unlocked scaffold without that option.
- Compose explicitly builds with VITE_APP_ENV=production and accepts VITE_API_URL as a public build argument. Removed the nonexistent Tailwind config watch path. Updated Docker documentation and synchronized shared templates.
- Added `npm run smoke:docker` to CI and the publish gate. It creates no published host ports and removes its temporary containers and tagged images.

Verification: `./init.sh` PASS (lint, real type-check, 942 tests, app build); CLI build PASS; template sync check PASS; registry validation PASS (53 items); git diff check PASS. Docker smoke PASS for showcase, fresh plain and fresh PWA projects: image build, Compose syntax, nginx -t, non-root/read-only runtime, Docker health status, /health, /dashboard SPA fallback, JavaScript assets, noncached HTML, immutable asset headers, missing-asset 404 and dotfile denial. PWA additionally passed /sw.js no-store and manifest checks.

Final Docker smoke log: `/var/folders/6v/qtlqjzld0870jwhns0xq1x7w0000gn/T/frontier-docker-1GNC6p/docker.log`.

Remaining manual browser/backend checks in session-handoff.md are still pending. Local `.claude/settings.json` was preserved. No production stack was started or publication made for this follow-up.


## Mock/Backend Switch — 2026-10-23

Replaced the unused `VITE_ENABLE_MSW` example with `VITE_ENABLE_MOCKS=false`. Read it through typed `env.enableMocks`, guarded by Vite DEV. The browser SDK is dynamically imported only when enabled. The local .env and .claude/settings.json were not edited.

Regression tests cover false/unset/invalid flags, development opt-in, production override, asynchronous startup, startup/cleanup failure, stale registrations in active/waiting/installing states, reload-before-render, and retention of unrelated/PWA registrations. Generated scaffolds contain the same bootstrap, an empty handlers file, and a copied worker; package.json configures `msw.workerDirectory` so normal installation aligns the public worker to the installed SDK. Installations that disable lifecycle scripts need `npx msw init public` explicitly.

Verification:

- `./init.sh`: PASS — lint, source/Node/test type-check, 965 tests across 77 files, production build.
- `npm run test:coverage -- --run`: PASS — statements 92.25%, branches 85.89%, functions 90.02%, lines 93.18%.
- `VITE_ENABLE_MOCKS=true npm run build`: PASS; all 17 emitted application JS files checked without MSW runtime protocol markers or showcase API fixture markers.
- Browser probe on http://127.0.0.1:5181: enabled mode returned the MSW 401 Unauthorized response; after same-origin restart in disabled mode, the backend probe returned 200 with source=backend-probe, controller=null and no mock registration. A test PWA /sw.js registration survived reload and backend requests still passed through. The PWA fixture was then unregistered and the temporary server stopped. This used a controlled backend probe, not the user's real backend.
- CLI build, template sync, 53-item registry validation and all eight CLI scaffold scenarios: PASS. The fresh dependency fixture also proved its public worker matched the installed MSW SDK exactly.
- Final smoke log: `/var/folders/6v/qtlqjzld0870jwhns0xq1x7w0000gn/T/frontier-smoke-rrCqh0/commands.log`; browser artifacts: `/tmp/frontier-mock-browser-x9b0fzdp/playwright`.

Backend integration is pending until a development backend is available. Restart Vite after changing environment values when that work begins. The form component findings were subsequently resolved in the follow-up below.


## Form Identity and Context Follow-up — 2026-10-23

**form-field-identity — done, uncommitted.** Input, Textarea, Checkbox, Select, Combobox and native FormSelect use React useId for default control IDs. FormInput/FormTextarea inherit the fixes. Caller IDs are preserved, repeated labels cannot collide, and changing label text does not change field identity. Select and FormSelect expose their matching error descriptions; native FormSelect labels work without a caller ID.

FormFieldContext and FormItemContext now default to null. useFormField and its consumers throw clear errors for missing providers instead of producing undefined identifiers. Valid React Hook Form compositions, submission/validation callbacks and explicit IDs are preserved. Updated the Form API example and documented opaque automatic IDs and provider requirements.

Regression evidence: before the fix, 22 cases failed; afterward the focused field/form/wrapper suite passed 165 tests. A showcase test had queried repeated labels globally and could previously select the wrong component; it now scopes role queries to the Combobox section and checks the actual associated errors/helpers.

Final verification:

- `./init.sh`: PASS — lint with zero warnings, app/Node/test type-check, 994 tests across 79 files, production build.
- `npm run test:coverage -- --run`: PASS — statements 92.36%, branches 86.06%, functions 90.02%, lines 93.29%.
- Template sync check and 53-item registry validation: PASS; five shared UI templates updated.
- Eight CLI scaffold scenarios: PASS using the previously installed dependency fixture. Log: `/var/folders/6v/qtlqjzld0870jwhns0xq1x7w0000gn/T/frontier-smoke-zpfnpc/commands.log`.
- `git diff --check`: PASS.

The user has no dev backend yet. Keep real-backend auth/session checks pending; do not require backend access for unrelated frontend improvements. No local .env or .claude/settings.json edits, dependency changes, publication, deployment or commit were made in this follow-up.
