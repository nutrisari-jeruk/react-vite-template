# Template reliability migration

This update changes source imports, authentication hooks, and DataTable selection props. Apply these changes to existing projects explicitly; `frontier-fe add` does not migrate application code or replace already-installed items.

## Source paths and generated projects

- Replace `@/lib/api-client`, `@/lib/api-error`, and `@/lib` imports with `@/libs/apiClient`, `@/libs/apiError`, and `@/libs`.
- Import token helpers from `@/libs/tokenStorage`; the feature-owned token storage file was removed.
- Hook filenames are camelCase, layout/page filenames PascalCase, and test helpers live under `src/tests`. Check case-sensitive imports before deploying to Linux.
- `frontier-fe init --skip-install` and `add --skip-install` record dependencies without invoking the package manager. Run `npm install` afterward. Install failure exits nonzero; correct the cause and retry installation before continuing.
- `add auth` installs the feature and its component dependencies. To install its screens, run `frontier-fe add login register otp forget-password reset-password dashboard`.
- `block:login-split`, `block:login-centered`, and `block:login-minimal` install distinct Login compositions and wire `/login`. They replace the Login file when installed; review existing customizations first. Repeating an installed item does not duplicate routes/exports.

## Authentication

Remove `useAuthStore`, `useAuth`, and `useTokenRefresh`. User state belongs to the TanStack Query entry `QUERY_KEYS.AUTH.USER`, accessed through `useUser`. Do not duplicate it in Zustand or component state.

```tsx
const { data: user, isLoading } = useUser();
const login = useLogin();
const result = await login.mutateAsync({ username, password });
if (result.status === "otp-required") {
  navigate(ROUTES.OTP, { state: { expiresIn: result.expiresIn } });
} else {
  navigate(ROUTES.DASHBOARD);
}
```

`useRegister` returns the same `AuthResult` union. `/auth/me` supplies the real user ID. Pending OTP sessions return no authenticated user; `AuthGuard` redirects them to `/otp`. Replace nested token guards and AuthLoader redirects with one AuthGuard (AuthenticatedLayout already includes it).

Call `useLogout().mutate(undefined)` for a logout action. Local tokens, verification state, and private query data are cleared even when the server request fails. Server logout failure still rejects the mutation so an application can show feedback.

The API client shares request-driven refresh, persists both rotated tokens, and retries each original request once. Login, register, logout, and refresh endpoints never initiate refresh. Remove `VITE_AUTH_TOKEN_REFRESH_INTERVAL`; interval refresh is no longer exposed. A backend must provide a refresh token for refresh to be available; login payloads and endpoint URLs are otherwise unchanged.

Token storage uses localStorage in development/staging and JavaScript-managed cookies in production. This does not create HttpOnly cookies or verify JWT signatures.

## Query and table behavior

Use `queryClient` from `@/libs/queryClient` in the application provider. Mutation retry defaults to false. Add `retry` per mutation only when the backend operation tolerates repetition.

When DataTable enables selection, provide a stable ID:

```tsx
<DataTable
  data={rows}
  columns={columns}
  enableRowSelection
  getRowId={(row) => row.id}
  selectedRows={selectedRows}
  onRowSelectionChange={setSelectedRows}
/>
```

Filtering is controlled: pass both `filterValue` and `onFilterChange`. Updating `filterValue` resets the visible input. A parent that previously relied on internal filter state must now own the value.

## Verification

Run `./init.sh`, `npm run test:coverage -- --run`, `npm run sync:templates:check`, `npm run check:registry`, `npm run cli:build`, and `npm run smoke:cli`. Smoke checks install a shared dependency fixture in a temporary directory and then validate eight isolated generated projects. Logs remain there for diagnosis. For repeat checks, pass `npm run smoke:cli -- --dependencies=/absolute/path/to/fixture/node_modules` with a previously installed superset including vite-plugin-pwa.

Local `.claude/settings.json` is excluded from automatic template synchronization. Review changes to the packaged settings explicitly.
