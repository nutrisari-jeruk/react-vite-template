# frontier-fe CLI Redesign — shadcn-like Component Installer

**Date:** 2026-05-25
**Status:** Approved
**Scope:** Redesign `frontier-fe` CLI to publish to npm, fetch templates remotely from GitHub, and ship a minimal base project.

---

## Problem

The current template ships with all 20 UI components, 5 hooks, auth feature, 6 layouts, and 8 pages pre-installed in `src/`. This bloats every new project. Developers should start with a minimal SOP-compliant setup and add components on demand.

## Solution

Follow the shadcn model: publish the CLI to npm, store templates in this repo's GitHub, and let developers add individual components with `npx frontier-fe add <item>`.

---

## 1. Architecture

**Three moving parts:**

1. **CLI package** (`frontier-fe` on npm) — lightweight, only ships CLI logic (~15 files). No bundled templates.
2. **Template registry** (this repo's GitHub) — component source files fetched at runtime via raw GitHub URLs.
3. **Config file** (`frontier-fe.json` in user's project) — tracks installed items and registry URL.

**User flow:**

```
npx frontier-fe init my-app        # Minimal project with SOP stack, zero UI components
cd my-app
npx frontier-fe add button dialog  # Fetches from GitHub, writes to src/components/ui/
npx frontier-fe add auth           # Fetches auth feature + resolves dependencies
npx frontier-fe list               # Shows available vs installed items
```

---

## 2. Base Template (`init` output)

`npx frontier-fe init my-app` creates a project with the full SOP stack but no UI components, features, or pages.

**Included:**

```
my-app/
├── src/
│   ├── app/
│   │   ├── index.tsx          # App entry with providers
│   │   ├── provider.tsx       # QueryClient, Router providers
│   │   └── router.tsx         # React Router (empty routes)
│   ├── components/
│   │   ├── layouts/           # Empty
│   │   └── ui/                # Empty
│   ├── config/
│   │   ├── constants.ts       # ROUTES, STORAGE_KEYS, API_ENDPOINTS, QUERY_KEYS
│   │   └── env.ts             # Type-safe env validation
│   ├── hooks/                 # Empty
│   ├── lib/
│   │   ├── api-client.ts      # Axios instance with interceptors
│   │   ├── api-error.ts       # Custom error classes
│   │   └── query-client.ts    # TanStack Query config
│   ├── stores/                # Empty
│   ├── tests/
│   │   └── setup.ts           # Vitest + Testing Library
│   ├── types/
│   │   └── api.ts             # Shared API response types
│   ├── utils/
│   │   ├── cn.ts              # clsx + tailwind-merge
│   │   └── metadata.ts        # Route metadata utility
│   ├── main.tsx
│   └── index.css              # Tailwind directives
├── public/
├── .env.example
├── .gitattributes
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── frontier-fe.json
```

**NPM dependencies installed by `init`:**

- React 19, React DOM, React Router DOM
- TanStack Query + DevTools
- Axios 1.14.0 (pinned exact — security)
- Zustand, Zod, React Hook Form, @hookform/resolvers
- Tailwind CSS 4, @tailwindcss/postcss, autoprefixer, postcss
- Motion, Lucide React
- clsx, tailwind-merge, react-error-boundary
- Dev: TypeScript, Vite, @vitejs/plugin-react-swc, Vitest, Testing Library, ESLint, Prettier, Husky, lint-staged, MSW, jsdom

**NOT included** (added via `add`):

- All 20 UI components
- All 5 hooks
- Auth feature
- All 6 layouts
- All 8 pages

---

## 3. Remote Template Fetching

Templates are fetched from this repo's GitHub at runtime, not bundled in the npm package.

**Registry URL format:**

```
https://raw.githubusercontent.com/{owner}/{repo}/{tag}/packages/cli
```

**`add` flow step by step:**

1. Fetch `registry.json` from `{registry}/registry/registry.json`
2. Resolve item + recursive dependencies
3. Fetch each template file from `{registry}/templates/{source path}`
4. Write to target paths in user's project
5. Update barrel exports (append to `index.ts` files)
6. Install npm dependencies via detected package manager
7. For pages: wire routes into router.tsx, constants.ts, navbar, metadata
8. Update `frontier-fe.json` installed list

**Versioning via git tags:**

- Tags: `frontier-fe@0.2.0`, `frontier-fe@0.3.0`, etc.
- `npx frontier-fe@latest` resolves to the latest tag
- `npx frontier-fe@0.2.0` fetches from that specific tag
- Fallback to `main` branch if tag not found

**Offline handling:**

- Cache in `node_modules/.frontier-fe/cache/`
- Warn on network failure, offer cached version

**Why raw GitHub:** Zero infrastructure, tied to git tags, same approach as shadcn.

---

## 4. CLI Commands

### `npx frontier-fe init [project-name]`

**Interactive flow:**

1. Prompt for project name (if not provided)
2. Prompt for package manager (npm / yarn / pnpm)
3. Create project directory
4. Fetch base template files from GitHub
5. Install npm dependencies
6. Write `frontier-fe.json`
7. Initialize git repo
8. Print next steps

**Flags:** `--yes` (skip prompts), `--pm <npm|yarn|pnpm>`

### `npx frontier-fe add [items...]`

**Examples:**

```
npx frontier-fe add button
npx frontier-fe add button input dialog
npx frontier-fe add auth
npx frontier-fe add button --overwrite
npx frontier-fe add --all --type ui
```

**Flags:** `--yes`, `--overwrite`, `--all`, `--type <ui|hook|feature|layout|page|lib>`

**Flow:**

1. Load `frontier-fe.json` — verify frontier-fe project
2. Fetch registry (or use cache)
3. Resolve items + dependencies
4. Show install plan (files, npm deps)
5. Confirm (skip with `--yes`)
6. Fetch + write files
7. Update barrel exports
8. Install npm deps
9. Wire routes (for pages)
10. Update `frontier-fe.json`
11. Print summary

### `npx frontier-fe list`

Shows items grouped by type with installed status:

```
UI Components (2/20 installed):
  ✓ button         Button with 11 variants and 3 sizes
  ✓ input          Text input with 3 variants and 3 sizes
  ✗ dialog         Modal dialog with 5 sizes and animations
  ...

Hooks (0/5 installed):
  ✗ use-breakpoint  Detect current Tailwind CSS breakpoint
  ...

Features (0/1 installed):
  ✗ auth           Complete authentication feature
  ...
```

**Flags:** `--type <type>` to filter

### `npx frontier-fe diff [item]` (v2 — optional)

Compares installed version against latest in registry. Shows git-style diff.

---

## 5. Repo's Dual Role

This repo is both the template source and a showcase app.

**Template source (`packages/cli/templates/`)** — canonical files the CLI fetches. Source of truth.

**Showcase app (`src/`)** — demonstrates the full template. Equivalent to running `init` + `add --all`.

**Staying in sync:**

- A sync script (`npm run sync:showcase`) copies all templates into `src/` at correct target paths
- CI runs this script to verify `src/` matches templates
- Development workflow: edit template → run sync → verify in showcase

**What moves to templates:**

- All 20 UI components → `packages/cli/templates/ui/`
- All 5 hooks → `packages/cli/templates/hooks/`
- Auth feature → `packages/cli/templates/features/`
- All 6 layouts → `packages/cli/templates/layouts/`
- All 8 pages → `packages/cli/templates/pages/`
- `src/` reduces to just the base template (config, lib, utils, app shell)

---

## 6. npm Publishing & Development

**Package changes:**

- Remove bundled templates from npm package
- Ship only CLI logic (commands, utils, registry schema)
- Build with `tsup` to single `dist/index.js` with shebang

**Versioning:**

- Single version for CLI + registry
- Git tag per release: `frontier-fe@0.2.0`
- Release steps: bump version → commit → tag → push tag → `npm publish`

**Local development:**

- Override registry URL for local testing:
  ```json
  { "registry": "./packages/cli" }
  ```
- Or env var: `FRONTIER_FE_REGISTRY=./packages/cli`

**CI checks:**

- `npm run sync:showcase` — verify `src/` matches templates
- `npm run build` — verify CLI builds
- `npm run test` — CLI + showcase tests
- Dry-run `init` + `add --all` for end-to-end validation

---

## Registry Inventory

| Type    | Count | Items                                                                                                                                                                                   |
| ------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI      | 20    | button, input, textarea, select, combobox, checkbox, switch, toggle, alert, badge, card, avatar, skeleton, table, pagination, tooltip, dialog, dropdown-menu, link, image-with-fallback |
| Hook    | 5     | use-breakpoint, use-media-query, use-local-storage, use-countdown, use-api-error                                                                                                        |
| Feature | 1     | auth                                                                                                                                                                                    |
| Layout  | 6     | main-layout, landing-layout, auth-layout, authenticated-layout, navbar, footer                                                                                                          |
| Page    | 8     | home, about, login, register, dashboard, forget-password, reset-password, otp                                                                                                           |
| Lib     | 3     | cn, api-client, env                                                                                                                                                                     |

Total: 43 items in the registry.

---

## Constraints

- Axios pinned to `1.14.0` exact — never upgrade without Tech Lead approval
- All components use Tailwind CSS only — no CSS-in-JS fallback
- `any` type prohibited — ESLint errors on `@typescript-eslint/no-explicit-any`
- All API responses validated with Zod at runtime
- Components follow existing SOP naming conventions (PascalCase files, camelCase hooks, kebab-case utils)
