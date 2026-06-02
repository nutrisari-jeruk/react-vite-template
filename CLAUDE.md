# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and AI agents working with this repository.

## Documentation

- **CLAUDE.md** (this file) - Conventions, patterns, and rules
- **[README.md](./README.md)** - Detailed component examples, usage patterns, and implementation
- **[docs/](./docs/)** - In-depth reference:
  - [project-structure.md](./docs/project-structure.md) - Full directory tree, naming conventions, import rules
  - [components-and-styling.md](./docs/components-and-styling.md) - Component organization, variant patterns, **props reference**, Tailwind usage
  - [api-layer.md](./docs/api-layer.md) - API client architecture, interceptors, error classes
  - [error-handling.md](./docs/error-handling.md) - Error boundary patterns, API error classes, useApiError hook
  - [state-management.md](./docs/state-management.md) - TanStack Query patterns, URL state, form state
  - [testing.md](./docs/testing.md) - Test setup, patterns, custom render, best practices
  - [security.md](./docs/security.md) - Token storage, XSS/CSRF, input validation
  - [docker.md](./docs/docker.md) - Multi-stage builds, compose profiles, deploy script, nginx config
  - [project-configuration.md](./docs/project-configuration.md) - TypeScript, Vite, ESLint, Prettier, Vitest config
  - [linting-and-code-quality.md](./docs/linting-and-code-quality.md) - ESLint rules, import ordering, type-aware linting
  - [cli-development.md](./docs/cli-development.md) - CLI architecture, commands, registry format, route wiring, publishing

## Quick Start

```bash
npm install              # Install dependencies
npm run dev              # Start development server (http://localhost:5173)
npm run build            # Build for production
npm run lint             # Run ESLint
npm test                 # Run tests
```

## SOP Standard

This template follows **SOP Coding Standard 2.0 (React Vite SPA)**. Do NOT apply Next.js patterns (Server Components, Server Actions, Route Handlers).

## Architecture

**Pattern:** Bulletproof React - feature-based modular structure

**Error Handling:** App wrapped with `react-error-boundary` in `src/app/provider.tsx` with fallback UI and reload button

```
src/
├── app/                  # Application layer (router, providers, routes)
├── components/           # Shared components (ui/, layouts/)
├── config/               # Environment variables, constants
├── features/             # Self-contained feature modules
├── hooks/                # Shared custom hooks
├── libs/                 # Third-party configs (axios instance, queryClient)
├── stores/               # Zustand global state stores
├── tests/                # Test utilities and MSW setup
├── types/                # Shared TypeScript types
└── utils/                # Utility functions
```

## Quick Rules

### Imports

```typescript
// 1. React/external → 2. @/ aliases → 3. type keyword
import { useState } from "react";
import { Button } from "@/components/ui";
import { api } from "@/libs";
import type { User } from "@/types";
```

- Use barrel exports: `import { Button } from "@/components/ui"`
- Use `@/` aliases for cross-directory imports
- API calls via `api` from `@//libs` only

### Naming

| Type          | Convention                          | Example                                |
| ------------- | ----------------------------------- | -------------------------------------- |
| UI components | lowercase folder, PascalCase file   | `button/Button.tsx` → `Button`         |
| Page routes   | PascalCase, default export          | `Home.tsx`, `DataTable.tsx`            |
| Hooks         | camelCase with `use` prefix         | `useAuth.ts`, `useLocalStorage.ts`     |
| Tests         | Co-located, same name + `.test.tsx` | `Button.test.tsx` next to `Button.tsx` |

### State

| Type        | Tool                                        |
| ----------- | ------------------------------------------- |
| Server data | TanStack Query (`useQuery` / `useMutation`) |
| Global UI   | Zustand (`src/stores/`)                     |
| URL params  | `useSearchParams`                           |
| Local UI    | `useState`                                  |

**NEVER store server state in Zustand. NEVER fetch data with useEffect + useState.**

### useEffect Guidelines

**Avoid useEffect for:**

- **Derived state** — Calculate during render: `const fullName = firstName + ' ' + lastName`
- **Expensive calculations** — Use `useMemo`: `const visible = useMemo(() => filter(todos), [todos])`
- **User events** — Handle in event handlers, not Effects
- **Chaining state updates** — Calculate all next state in the event handler
- **Notifying parent components** — Update both states during the event

**Use useEffect for:**

- Synchronizing with external systems (browser APIs, network, non-React widgets)
- Subscribing to external stores (prefer `useSyncExternalStore` for browser APIs)
- Analytics/page tracking (fires when component is displayed)

**See:** [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### Styling

```typescript
import { cn } from "@/utils";
<div className={cn("base-class", isActive && "active-class", className)} />
```

Use `h-dvh` (not `h-screen`), `text-balance` for headings, `tabular-nums` for data.

### TypeScript

- Prefer interfaces for component props
- Use `type` keyword for type-only imports: `import type { User }`
- **`any` is prohibited** — ESLint errors on `@typescript-eslint/no-explicit-any`
- `.remember/tmp` is ignored by ESLint for temp files

### Environment Variables

Access via `env` from `@/config`, not `import.meta.env` directly. All `VITE_*` vars are browser-exposed — never put secrets in them.

### API

Always use `api` from `@/libs`. **axios is pinned to exactly `1.14.0`** (no `^` or `~`) — do not upgrade without Tech Lead approval.

## Common Tasks

### Adding a UI Component

1. Create `src/components/ui/[name]/[Name].tsx` (PascalCase)
2. Create barrel `index.ts`
3. Export from `src/components/ui/index.ts`
4. Add co-located `[Name].test.tsx`

### Adding a Page

1. Create `src/app/routes/[PageName].tsx` (PascalCase, default export)
2. Add lazy import in `src/app/router.tsx`
3. Add to `ROUTES` in `src/config/constants.ts`
4. Update navigation

### Adding a Feature

1. Create `src/features/[name]/` with `components/`, `hooks/`, `api/`, `types/`
2. Create `index.ts` with public API exports
3. Features must NOT import from other features

### Adding a Hook

1. Create `src/hooks/use[Name].ts` (camelCase)
2. Export from `src/hooks/index.ts`

### Adding a Zustand Store

1. Create `src/stores/[name]Store.ts`
2. Export from `src/stores/index.ts`
3. Use only for: theme, auth session, UI preferences

## Do's and Don'ts

### Do

- Use barrel exports and path aliases (`@/`)
- Use **PascalCase** for components, **camelCase** for hooks
- Co-locate tests, keep features self-contained
- Use `cn()` for conditional classNames
- Use `type` keyword for type-only imports
- Use TanStack Query for ALL data fetching
- **Check [Component Props Reference](./docs/components-and-styling.md#component-props-reference) before using component variants/sizes**

### Don't

- Use `any` type, `useEffect` + `useState` for data fetching
- Store server data in Zustand
- Import from internal feature paths or create circular dependencies
- Use template literals for className merging
- Use relative imports for cross-directory imports
- Guess component props — always verify first
- Upgrade axios without Tech Lead approval (pinned to 1.14.0)

## Docker Deployment

Multi-stage setup with `dev`/`prod` profiles. See [docs/docker.md](./docs/docker.md) for full reference.

```bash
docker compose --profile dev up        # Development
docker compose --profile prod up --build  # Production
./deploy.sh                            # Deploy script (production only)
```

## CLI Development

The `frontier-fe` CLI lives in `packages/cli/` (published to npm). See [docs/cli-development.md](./docs/cli-development.md) for full reference.

```bash
npm run sync:templates          # Copy src/ → packages/cli/templates/
npm run sync:templates:check    # CI mode — exits non-zero if out of sync
npm run cli:build               # Build CLI (tsup → packages/cli/dist/)
```

**After editing template source files:** Run `npm run sync:templates` before committing.

**Before changing conventions,** update both this file and the corresponding [docs/](./docs/) files to keep documentation in sync.
