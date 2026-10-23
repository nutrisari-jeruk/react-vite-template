# Session Handoff

## Latest update — 2026-10-23

Docker/Nginx follow-up is complete. The earlier reliability implementation is committed as `76075fa`.

Production now copies the full Nginx config to `/etc/nginx/nginx.conf`, reuses the image's nginx user, listens on internal port 8080, and writes PID/temp files to `/tmp`. Compose host port remains 80 by default, with read-only rootfs and a writable /tmp tmpfs. Builds use the common `npm run build`; lockfile-free scaffolds are supported. VITE settings are build-time values, not runtime configuration.

`npm run smoke:docker` passed actual image builds and healthy non-root/read-only startup for showcase, plain CLI scaffold and PWA scaffold, including nginx -t, deep links, static/cache/error responses and service worker no-store. `./init.sh` passed with 942 tests; CLI build, template sync and registry validation passed. The smoke gate is now wired into CI and the CLI publish workflow. See docs/docker.md and progress.md for details.

Before any release, review this diff, including the internal port change for integrations that bypass Compose. The pending manual browser/backend checklist below still applies. User-owned `.claude/settings.json` remains untouched.

2026-10-16 — template-reliability completed.

Read progress.md for verification and docs/migrations/template-reliability.md for breaking APIs. All eight audit findings are fixed; 942 tests, coverage thresholds, app/CLI builds, template sync, registry validation and eight generated scaffold scenarios passed.

User-owned `.claude/settings.json` remains modified and is excluded from the implementation commit. Do not publish or deploy without an explicit request. Existing downstream projects must migrate imports, legacy auth hooks/store and selectable DataTable props explicitly.

## Start the next session here

Remind the user to perform manual browser and real-backend testing before further feature work. These checks are still pending; passing automated tests does not complete them.

- Test login with and without OTP, registration with username, forgot/reset password, and logout.
- Open `/dashboard` directly and reload it; verify redirects while OTP is pending and after session expiry.
- Confirm the real `/auth/me` response supplies the correct user identity. Exercise expired access tokens, refresh-token rotation, rejected refresh, and logout during refresh.
- Select DataTable rows, change pages and sorting, and reset filters from the parent; verify record IDs and visible input stay correct.
- Inspect the registration form and mobile layouts; check keyboard navigation.
- Generate one fresh CLI project and add the features normally used by the team. If using PWA, check installation and offline behavior in a real browser.

Record manual results and any failures in progress.md. Run focused regression tests for any fixes, then rerun the required automated gates before declaring follow-up work complete.
