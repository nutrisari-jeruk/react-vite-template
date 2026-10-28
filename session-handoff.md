# Session Handoff

## Latest update — form identity/context (2026-10-23)

The user does not yet have a development backend and explicitly chose the form component fixes next. These fixes are complete and uncommitted. Previous commits: e9b0249 (mock/backend switch), 6e8addd (Docker/Nginx), 76075fa (template reliability).

Input, Textarea, Checkbox, Select, Combobox and native FormSelect now generate unique stable IDs through useId, preserving explicit IDs. Repeated/translated labels no longer collide or change field identity. Select/FormSelect error descriptions refer to their own controls. Shared Form consumers require FormField and FormItem providers and throw clear errors when either is missing. Existing valid form flows remain supported. Tests and migration/component documentation cover these contracts.

Verification: 994 tests across 79 files, lint, app/Node/test type-check, build, coverage thresholds (statements 92.36%), template sync, registry validation and all eight CLI scaffold scenarios passed. Before fixing, regression tests reproduced 22 failures; the focused suite passed 165 tests afterward. A previously ambiguous showcase test now selects the intended Combobox section.

Next: review/commit these changes if requested. Backend integration checks remain deferred until a dev backend exists; frontend work can proceed independently. Local .env and .claude/settings.json are untouched. Do not publish/deploy or commit without an explicit request.

## Mock/backend switch (2026-10-23)

The development mock/backend switch is complete. Earlier fixes are committed as 76075fa (template reliability) and 6e8addd (Docker/Nginx).

Use `VITE_ENABLE_MOCKS=true` with `VITE_API_URL=/api` for showcase fixtures. The default false/unset mode uses the backend configured by VITE_API_URL. Production always disables mocks. Restart Vite after env changes. The unused VITE_ENABLE_MSW example has been replaced; it is not an alias. Local .env and .claude/settings.json remain untouched.

Startup awaits optional MSW, removes only stale mockServiceWorker.js registrations when disabled, and reloads before mounting React if the document remains controlled. Unrelated PWA workers are preserved. Generated starters share the switch but have empty handlers for project-specific fixtures. Their msw.workerDirectory package setting keeps the public worker aligned on normal dependency installation.

Verification passed: 965 tests, lint, app/Node/test type-check, coverage thresholds, production build with the flag true and no MSW runtime/fixture code, CLI build, template sync, registry validation, and eight scaffold scenarios. A real-browser test on a controlled local backend proved enabled interception, disabled passthrough with stale MSW removed, and PWA registration retention. It did not exercise the user's real backend. See progress.md and docs/testing.md for evidence.

Backend integration awaits a development backend. The Input ID/Form context findings were subsequently resolved; see the latest update above. Do not publish/deploy or commit further work without an explicit request.

## Docker/Nginx follow-up — 2026-10-23

Docker/Nginx follow-up is complete. The earlier reliability implementation is committed as `76075fa`.

Production now copies the full Nginx config to `/etc/nginx/nginx.conf`, reuses the image's nginx user, listens on internal port 8080, and writes PID/temp files to `/tmp`. Compose host port remains 80 by default, with read-only rootfs and a writable /tmp tmpfs. Builds use the common `npm run build`; lockfile-free scaffolds are supported. VITE settings are build-time values, not runtime configuration.

`npm run smoke:docker` passed actual image builds and healthy non-root/read-only startup for showcase, plain CLI scaffold and PWA scaffold, including nginx -t, deep links, static/cache/error responses and service worker no-store. `./init.sh` passed with 942 tests; CLI build, template sync and registry validation passed. The smoke gate is now wired into CI and the CLI publish workflow. See docs/docker.md and progress.md for details.

Before any release, review this diff, including the internal port change for integrations that bypass Compose. The pending manual browser/backend checklist below still applies. User-owned `.claude/settings.json` remains untouched.

2026-10-16 — template-reliability completed.

Read progress.md for verification and docs/migrations/template-reliability.md for breaking APIs. All eight audit findings are fixed; 942 tests, coverage thresholds, app/CLI builds, template sync, registry validation and eight generated scaffold scenarios passed.

User-owned `.claude/settings.json` remains modified and is excluded from the implementation commit. Do not publish or deploy without an explicit request. Existing downstream projects must migrate imports, legacy auth hooks/store and selectable DataTable props explicitly.

## Start the next session here

The user does not yet have a development backend. Keep the browser/real-backend checklist below pending until one is available; do not block independent frontend work on it. Passing automated tests does not complete backend integration verification.

- Test login with and without OTP, registration with username, forgot/reset password, and logout.
- Open `/dashboard` directly and reload it; verify redirects while OTP is pending and after session expiry.
- Confirm the real `/auth/me` response supplies the correct user identity. Exercise expired access tokens, refresh-token rotation, rejected refresh, and logout during refresh.
- Select DataTable rows, change pages and sorting, and reset filters from the parent; verify record IDs and visible input stay correct.
- Inspect the registration form and mobile layouts; check keyboard navigation.
- Generate one fresh CLI project and add the features normally used by the team. If using PWA, check installation and offline behavior in a real browser.

Record manual results and any failures in progress.md. Run focused regression tests for any fixes, then rerun the required automated gates before declaring follow-up work complete.
