# Frontend template reliability implementation plan

Goal: resolve all eight audit findings for the showcase application and generated projects. Breaking changes are accepted; preserve backend URLs and payloads, existing visuals, dependency versions, and user-owned local settings.

1. Make type-check inspect app, Node configuration, and tests; repair matcher/mock typing; align generated test setup under src/tests. Verify the real type-check and a scaffold DOM smoke test.
2. Align registry targets/imports/casing with src/libs, camelCase hooks, and PascalCase components. Persist dependencies before optional installation. Complete transitive auth/page/layout dependencies and route imports. Validate base and auth builds and idempotent add.
3. Move token storage to libs, use separate single-flight refresh transport, save both rotated tokens, stop after one retry, preserve subsequent error types, and reject late refresh after logout. Add adapter-level regression tests.
4. Consolidate session user state in react-query-auth/TanStack Query with QUERY_KEYS.AUTH.USER. Return an explicit authenticated/otp-required result, load backend identity through /me, block pending OTP routes, and clear local state/cache on logout failure. Remove obsolete auth hooks/store and migrate callers/tests.
5. Centralize QueryClient with mutation retry disabled. Require stable DataTable IDs with selection and make filters controlled. Test timeout behavior, pagination/reordering, parent filter reset, and the selection type contract.
6. Add registry validation and real built-CLI smoke checks for base, auth, auth pages, all UI, three Login blocks, and PWA. Gate CI and publish on source/template validation. Document migration and record final evidence in progress.md and session-handoff.md.

Acceptance: lint, type-check, test/coverage thresholds, app build, CLI build, template sync, registry validation, and all scaffold scenarios pass. No npm publication, deployment, or commit is included.

During implementation, align the registration form with its existing required username schema and remove the test-only relaxed schema; verify registration against the production schema.
