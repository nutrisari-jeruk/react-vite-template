# Project Structure

## Overview

The repository holds two runnable applications plus the CLI that scaffolds new projects.

- **`src/`** — the minimal starter. This is what `npm run dev`, `npm run build`, and `npm run test:run` serve. It contains the app shell, one Home page, NotFound, empty barrels, and shared libs/config/utils.
- **`apps/showcase/`** — the full showcase (workspace `@frontier/showcase`): every UI component, auth flows, examples, and the `/components` page. This is the canonical development source for registry items. Use `npm run dev:showcase`, `npm run build:showcase`, `npm run test:showcase`.
- **`packages/cli/`** — `frontier-fe`, published to npm. Templates are generated from `apps/showcase/` (registry items) and `src/` (base files) by `scripts/sync-templates.mjs`.

Neither app imports the other. `@` resolves to that app's own `src/` directory, so each has an independent tsconfig/Vite/Vitest project.

## Root Structure

```
src/                      # Minimal starter (root app)
├── app/                  # Application layer
├── components/           # Shared components (empty barrels + layouts)
├── config/               # Configuration
├── hooks/                # Shared hooks (empty barrel)
├── libs/                 # Core utilities
├── mocks/                # MSW bootstrap
├── tests/                # Test utilities
├── types/                # Shared types
├── utils/                # Utility functions
├── main.tsx              # Entry point
└── index.css             # Global styles

apps/showcase/            # Full showcase workspace
├── src/                  # Same layout, complete feature set
├── index.html            # Showcase HTML entry
├── public/               # Showcase-only assets
├── vite.config.ts        # Showcase Vite config
├── vitest.config.ts      # Showcase test config
└── tsconfig.*.json       # Showcase TS projects
```

## Directory Details

### `src/app/`

Application shell containing providers, router, and the main App component.

```
app/
├── index.tsx         # Main App component
├── provider.tsx      # Centralized providers
├── router.tsx        # Route configuration with lazy loading
└── routes/           # Route components (PascalCase files)
    ├── Home.tsx
    ├── About.tsx
    ├── Components.tsx
    ├── not-found.tsx
    └── examples/     # Example pages
```

**Purpose**: Bootstrap the application, configure providers, define routes.

### `src/components/`

Shared components used across the application.

```
components/
├── ui/                   # UI primitives
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── input/
│   ├── dialog/
│   ├── toast/
│   └── index.ts          # Re-exports all UI components
├── form/                 # React Hook Form integration
├── data-table/           # Server-side data table
├── layouts/              # Layout components
│   ├── MainLayout.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── index.ts
├── ErrorBoundary.tsx     # Shared components
└── index.ts              # Main barrel export
```

**Rules**:

- UI component folders use lowercase (`button/`), component files use PascalCase (`Button.tsx`)
- Tests are co-located (`Button.test.tsx` next to `Button.tsx`)
- Each UI component has its own folder with barrel export
- Layouts handle page structure

### `src/config/`

Application configuration and constants.

```
config/
├── env.ts            # Environment variables (validated)
├── constants.ts      # Routes, API endpoints, query keys
└── index.ts          # Barrel export
```

**Usage**:

```typescript
import { env, ROUTES, API_ENDPOINTS, QUERY_KEYS } from "@/config";
```

### `src/features/`

Self-contained feature modules.

```
features/
└── auth/
    ├── components/       # Feature-specific components
    │   ├── LoginForm.tsx
    │   ├── OtpForm.tsx
    │   └── ResetPasswordForm.tsx
    ├── hooks/            # Feature-specific hooks
    │   └── (feature hooks)
    ├── api/              # Feature API calls
    ├── libs/              # Feature utilities
    ├── types/            # Feature types
    │   └── index.ts
    └── index.ts          # Public API
```

**Rules**:

- Features are self-contained
- Only export public API through `index.ts`
- Features can import from shared modules (`@/components`, `@/libs`)
- Features should NOT import from other features

### `src/hooks/`

Shared custom React hooks.

```
hooks/
├── useLocalStorage.ts
├── useMediaQuery.ts
├── useBreakpoint.ts
└── index.ts
```

### `src/libs/`

Core utilities and third-party integrations.

```
libs/
├── api-client.ts     # Axios instance with interceptors
├── api-error.ts      # Custom error classes
└── index.ts          # Barrel export
```

**Purpose**: Low-level utilities that don't fit in features or hooks.

### `src/tests/`

Test utilities and configuration.

```
tests/
├── setup.ts          # Test setup (jest-dom)
├── test-utils.tsx    # Custom render with providers
└── index.ts          # Barrel export
```

### `src/types/`

Shared TypeScript type definitions.

```
types/
└── index.ts          # API response types, etc.
```

### `src/utils/`

Pure utility functions.

```
utils/
├── cn.ts             # className utility (clsx + tailwind-merge)
└── index.ts          # Barrel export
```

## File Naming Conventions

| Type          | Convention                    | Example                                |
| ------------- | ----------------------------- | -------------------------------------- |
| UI components | PascalCase                    | `Button.tsx`, `LoginForm.tsx`          |
| Page routes   | PascalCase                    | `Home.tsx`, `DataTable.tsx`            |
| Hooks         | camelCase with `use` prefix   | `useCountdown.ts`, `useLocalStorage.ts`     |
| Utilities     | kebab-case                    | `cn.ts`, `api-client.ts`               |
| Tests         | Co-located, `[Name].test.tsx` | `Button.test.tsx` next to `Button.tsx` |

## Import Aliases

The project uses `@/` as an alias for `src/`:

```typescript
// ✅ Good
import { Button } from "@/components/ui";
import { useUser } from "@/features/auth";
import { env } from "@/config";

// ❌ Bad
import { Button } from "../../../components/ui/button";
```

## Related Documentation

- [Application Overview](./application-overview.md)
- [Components and Styling](./components-and-styling.md)
