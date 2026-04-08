# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and AI agents working with this repository.

## Documentation

- **CLAUDE.md** (this file) - Conventions, patterns, and rules
- **[README.md](./README.md)** - Detailed component examples, usage patterns, and implementation

## SOP Standard

This template follows **SOP Coding Standard 2.0 (React Vite SPA)**. Do NOT apply Next.js patterns (Server Components, Server Actions, Route Handlers).

## Architecture

**Pattern:** Bulletproof React - feature-based modular structure

```
src/
├── app/                  # Application layer (router, providers, routes)
├── components/           # Shared components
│   ├── ui/              # UI primitives (lowercase folders, PascalCase files)
│   └── layouts/         # Layout components
├── config/              # Environment variables, constants
├── features/            # Self-contained feature modules
├── hooks/               # Shared custom hooks
├── libs/                # Third-party configs (axios instance, queryClient)
├── stores/              # Zustand global state stores
├── tests/               # Test utilities and MSW setup
├── types/               # Shared TypeScript types
└── utils/               # Utility functions
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| UI components | lowercase folder, PascalCase file | `button/Button.tsx` → `Button` |
| Page routes | PascalCase | `Home.tsx`, `DataTable.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts`, `useLocalStorage.ts` |
| Utilities | kebab-case | `cn.ts`, `metadata.ts` |
| Tests | Co-located, same name + `.test.tsx` | `Button.test.tsx` next to `Button.tsx` |

## Import Patterns

```typescript
// Import order: 1. React/external, 2. Internal aliases (@/), 3. Types with `type` keyword
import { useState } from "react";
import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { api } from "@/libs";
import type { User } from "@/types";

// Use barrel exports
import { Button, Input, Card } from "@/components/ui";

// NOT from internal paths
// import { Button } from "@/components/ui/button/Button";
```

## Component Conventions

### UI Components (`src/components/ui/`)

**Structure:**
```
src/components/ui/button/
├── Button.tsx       # export function Button() {}
├── Button.test.tsx  # co-located test
└── index.ts         # export { Button }
```

**When adding UI components:**
1. Create `src/components/ui/[name]/[Name].tsx` (PascalCase file)
2. Export as PascalCase: `export function ComponentName() {}`
3. Create `index.ts` barrel export
4. Export from `src/components/ui/index.ts`
5. Add `[Name].test.tsx` co-located with the component

### Page Routes (`src/app/routes/`)

**When adding routes:**
1. Create page in `src/app/routes/[PageName].tsx` (PascalCase)
2. Use default export: `export default function PageName() {}`
3. Add lazy import in `src/app/router.tsx`
4. Add route constant in `src/config/constants.ts` (ROUTES object)
5. Update navigation in `src/components/layouts/Navbar.tsx`

### Feature Modules (`src/features/`)

**Structure:**
```
src/features/[feature-name]/
├── components/          # Feature-specific components (PascalCase files)
├── hooks/              # Feature-specific hooks (camelCase files)
├── api/                # Feature API calls
├── lib/                # Feature utilities
├── types/              # Feature types
└── index.ts            # Public API (barrel export)
```

**Rules:**
- Features should NOT import from other features directly
- Only export public API through `index.ts`
- Import from `@/components`, `@/libs`, `@/hooks` is allowed

## State Management

| State type | Where |
|---|---|
| Server state (API data) | TanStack Query — `useQuery` / `useMutation` |
| Global UI state (auth session, theme) | Zustand — `src/stores/` |
| URL state (pagination, filters) | `useSearchParams` |
| Local UI state (modal open, form input) | `useState` |

**NEVER store server state in Zustand. NEVER fetch data with useEffect + useState.**

```typescript
// Zustand store example
import { useAuthStore } from "@/stores";
const { user, setAuth, clearAuth } = useAuthStore();
```

## Component Props Reference

**IMPORTANT:** Always check this section before using component props. Using unknown variants, sizes, or other props will cause errors.

### Button (`src/components/ui/button/Button.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `primary`, `secondary`, `danger`, `outline-primary`, `outline-secondary`, `outline-danger`, `white`, `outline-white`, `link`, `link-primary`, `link-muted` |
| `size` | `sm`, `md`, `lg` |

### Badge (`src/components/ui/badge/Badge.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `default`, `primary`, `success`, `warning`, `danger`, `info` |
| `size` | `sm`, `md`, `lg` |
| `pill` | boolean |
| `dot` | boolean |

### Alert (`src/components/ui/alert/Alert.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `info`, `success`, `warning`, `danger` |

### Input (`src/components/ui/input/Input.tsx`)

| Prop | Values |
|------|--------|
| `size` | `sm`, `md`, `lg` |
| `variant` | `default`, `filled`, `outlined` |

### Select (`src/components/ui/select/Select.tsx`)

| Prop | Values |
|------|--------|
| `size` | `sm`, `md`, `lg` |
| `variant` | `default`, `filled`, `outlined` |

### Dialog (`src/components/ui/dialog/Dialog.tsx`)

| Prop | Values |
|------|--------|
| `size` | `sm`, `md`, `lg`, `xl`, `full` |

### Tooltip (`src/components/ui/tooltip/Tooltip.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `dark`, `light` |
| `placement` | `top`, `bottom`, `left`, `right` |

**For detailed usage examples, see [README.md](./README.md#ui-components).**

## Styling

```typescript
import { cn } from "@/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

**Never use template literals for className merging.**

**Special Tailwind utilities:**
- `h-dvh` instead of `h-screen` (mobile viewport)
- `text-balance` for headings, `text-pretty` for body
- `tabular-nums` for data display

## TypeScript

- Prefer interfaces for component props
- Use `type` keyword for type-only imports: `import type { User }`
- Export types separately: `export type { ButtonProps }`
- **`any` type is prohibited** — ESLint is configured to error on `@typescript-eslint/no-explicit-any`

## API Integration

```typescript
import { api } from "@/libs";

const response = await api.get("/users");
```

Always use the centralized `api` client from `@/libs`. It includes:
- Automatic auth token injection
- Auto token refresh on 401
- Request ID tracing via `X-Request-ID`
- Type-safe error classes
- Exponential backoff retry

**CRITICAL: axios is pinned to exactly `1.14.0`** (no `^` or `~`). This is a security measure after the March 2026 supply chain attack. Do not upgrade without Tech Lead approval.

## Environment Variables

Access via the `env` object, not `import.meta.env` directly:

```typescript
import { env, isDevelopment, isProduction } from "@/config";

console.log(env.apiUrl);
```

Define new vars in `.env.example` and `src/config/env.ts`.

**ALL `VITE_*` variables are exposed to the browser.** Never put secrets, API keys, or sensitive data in them.

## Testing

```typescript
import { render, screen } from "@/tests";

test("renders component", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

- Tests are **co-located** with source files (`Button.test.tsx` next to `Button.tsx`)
- Test setup is in `src/tests/setup.ts`
- Minimum coverage: **70%** (enforced in CI)
- Focus on behavior, not implementation details

## Common Tasks

### Adding a UI Component
1. Create `src/components/ui/[name]/[Name].tsx` (PascalCase)
2. Create barrel `index.ts`
3. Export from `src/components/ui/index.ts`
4. Add co-located `[Name].test.tsx`

### Adding a Zustand Store
1. Create `src/stores/[name]Store.ts`
2. Export from `src/stores/index.ts`
3. Use only for: theme, auth session, UI preferences

### Adding a Feature
1. Create `src/features/[name]/`
2. Add subfolders: `components/`, `hooks/`, `api/`, `lib/`, `types/`
3. Create `index.ts` with public API exports

### Adding a Page
1. Create `src/app/routes/[PageName].tsx` (PascalCase, default export)
2. Add lazy import in `src/app/router.tsx`
3. Add to `ROUTES` in `src/config/constants.ts`
4. Update navigation

### Adding a Hook
1. Create `src/hooks/use[Name].ts` (camelCase)
2. Export from `src/hooks/index.ts`

## Do's and Don'ts

### Do
- Use barrel exports for clean imports
- Use **PascalCase** for component files (`Button.tsx`, `LoginForm.tsx`)
- Use **camelCase** for hook files (`useAuth.ts`, `useLocalStorage.ts`)
- Co-locate tests with source files (`Button.test.tsx` next to `Button.tsx`)
- Keep features self-contained
- Use path aliases (`@/`)
- Export default for page components (lazy loading)
- Use `cn()` for conditional classNames
- Use `type` keyword for type-only imports
- Use TanStack Query for ALL data fetching
- Use Zustand for global state (auth, theme)
- **Check Component Props Reference section before using component variants/sizes**
- **Read the component source file if unsure about available props**

### Don't
- Use kebab-case for component or hook files
- Use `__tests__/` subdirectories — put tests next to source files
- Use `any` type — ESLint will error
- Fetch data with `useEffect` + `useState` — use TanStack Query
- Store server/API data in Zustand
- Import from internal feature paths
- Create circular dependencies between features
- Put business logic in UI components
- Use relative imports for cross-directory imports
- Skip barrel exports when adding components
- Use template literals for className merging
- **Use component variants, sizes, or props not listed in Component Props Reference**
- **Guess component props - always verify first**
- **Upgrade axios without Tech Lead approval** (pinned to 1.14.0 for security)

## Important Notes

- **Line endings:** Enforced LF (not CRLF) via `.gitattributes`
- **UI components:** Lowercase folder names, PascalCase file names and exports
- **Page components:** PascalCase filenames, default exports
- **Hooks:** camelCase filenames (`useAuth.ts`)
- **Tests:** Co-located with source, not in `__tests__/` subdirectories
- **Environment:** All vars must be in `.env.example` and `src/config/env.ts`
- **New routes:** Must update router.tsx, constants.ts, and navigation
- **axios security:** Pinned to `1.14.0` — do not add `^` or `~`
