# Migration: lean template (two apps, CSS-only animation, localStorage Bearer tokens)

This release reshapes the repository and the generated scaffolds. Generated projects that were created before this release must apply the steps below manually; `frontier-fe add` never rewrites an existing project's source.

## 1. Repository gained a second application

- `src/` is now the **minimal starter** (app shell, Home, NotFound, empty barrels, shared libs/config/utils).
- The full showcase — all UI components, auth, examples, `/components` — moved to `apps/showcase/` (workspace `@frontier/showcase`).

Commands were split rather than repurposed:

| Old                          | New                                                                     |
| ---------------------------- | ----------------------------------------------------------------------- |
| `npm run dev` (showcase)     | `npm run dev:showcase`                                                  |
| `npm run build` (showcase)   | `npm run build:showcase`                                                |
| `npm run preview` (showcase) | `npm run preview:showcase`                                              |
| —                            | `npm run dev`, `npm run build`, `npm run preview` now serve the starter |

`npm run type-check`, `npm run test:coverage`, and `./init.sh` now cover both apps. Registry templates are generated from `apps/showcase/`; base templates from `src/`.

## 2. Removed form wrappers

`FormInput`, `FormTextarea`, `FormSelect`, and the `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormDescription`/`FormMessage`/`useFormField` set are gone. The controls already take labels, errors, and refs.

```diff
-<FormInput label="Email" {...register("email")} error={errors.email?.message} />
+<Input label="Email" {...register("email")} error={errors.email?.message} />
```

```diff
-<FormTextarea label="Notes" {...register("notes")} error={errors.notes?.message} />
+<Textarea label="Notes" {...register("notes")} error={errors.notes?.message} />
```

Native-select callers replace `FormSelect` with a `<select>` that keeps the same label/error association, or with `Select` + `Controller` when they need the custom primitive. Subtree form context is `FormProvider` from React Hook Form.

## 3. Animation library removed

`motion` (and `zustand`) are no longer dependencies. Dialog, Accordion, Tabs, Alert, Toast, Spinner, and the Components page animate with CSS:

- Base UI supplies `data-starting-style` / `data-ending-style`, so transitions key off those attributes.
- Accordion height uses the primitive's `--accordion-panel-height` variable.
- `prefers-reduced-motion` is handled by `motion-reduce:transition-none` / `motion-reduce:animate-none`, or by `useMediaQuery("(prefers-reduced-motion: reduce)")` where JavaScript must branch.
- Alert and Toast keep their node mounted during exit, then remove it on `transitionend` with a matching fallback timeout; `onDismiss` fires once and stays cancellable.

Delete `motion`/`zustand` from your manifest if you migrate. No store replacement is provided — use component state, URL params, or TanStack Query.

## 4. Build configuration

Vite configs now use `target: "es2022"`, Vite 8's native minifier (no `terser` dependency), and `build.rolldownOptions` instead of `build.rollupOptions`. ES2022 is a syntax target only; it does not install polyfills for missing platform APIs.

## 5. Bearer tokens live in localStorage only

`tokenStorage` no longer has a cookie adapter, `CookieOptions`, or a cookie→localStorage fallback. Tokens are stored in localStorage in every environment.

Setter signatures are token-only:

```ts
setAccessToken(token: string): void;
setRefreshToken(token: string): void;
setAuthTokens(accessToken: string, refreshToken?: string): void;
```

**Operational breaking change.** Deployments that previously ran with `VITE_APP_ENV=production` stored tokens in JavaScript-written cookies. Nothing reads those cookies now, so:

1. Remove the two legacy token cookies once at deploy time, using the configured cookie names and `path=/`, so stale credentials stop being sent.
2. Expect every user to log in again. No automatic migration reads the old cookies.

localStorage is readable by any script on the origin: these tokens are exposed to XSS and are **not** HttpOnly. Authorization headers, payloads, single-flight refresh, rotation, stale-session rejection, logout cache invalidation, and OTP state are unchanged. Existing localStorage sessions keep working when their keys already match.

## 6. Smaller generated scaffolds

CLI `BASE_NPM_DEPS` now matches the lean runtime set: `@tanstack/react-query`, `axios`, `clsx`, `react`, `react-dom`, `react-error-boundary`, `react-router-dom`, `tailwind-merge`. Base UI, React Hook Form, resolvers, `react-query-auth`, `zod`, `lucide-react`, `motion`, and `zustand` are installed by `frontier-fe add` when a registry item needs them, at pinned ranges rather than `*`.
