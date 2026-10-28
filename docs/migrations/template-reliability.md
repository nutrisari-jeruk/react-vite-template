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


## Explicit mock mode (2026-10-23)

Development no longer starts MSW automatically. Set `VITE_ENABLE_MOCKS=true` and `VITE_API_URL=/api` to use showcase fixtures, then restart Vite. For backend integration leave the flag false or unset and configure `VITE_API_URL` for your backend. The previously unused `VITE_ENABLE_MSW` variable is ignored. Production builds always disable mocking.

Only the application mock service worker is removed on switching to backend mode. A controlled document reloads before React mounts, while unrelated PWA workers remain registered. Fresh CLI projects include the bootstrap and an empty `src/mocks/handlers.ts`; add your project's own handlers when opting in.

## Form identity and context follow-up (2026-10-23)

Automatic form-control IDs are now unique React-generated values, rather than slugs of labels. Repeated labels and label changes no longer collide or change the control identity. If existing selectors depend on an ID such as `email`, pass `id="email"` explicitly, or query by accessible role/label in tests. Avoid assigning the same explicit ID to multiple controls.

`FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, and `useFormField` require both `FormField` and `FormItem` context. Correct invalid composition by adding the missing provider; these consumers now fail clearly rather than emitting undefined identifiers. Standalone Input/Textarea/Checkbox/Select/Combobox components remain usable without these Form providers.
