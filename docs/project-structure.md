# Project Structure

## Overview

The project follows the **Bulletproof React** architecture — a feature-based structure that scales well and maintains clear boundaries between different parts of the application.

## Root Structure

```
src/
├── app/                  # Application layer
├── components/           # Shared components
├── config/               # Configuration
├── features/             # Feature modules
├── hooks/                # Shared hooks
├── libs/                 # Core utilities
├── tests/                # Test utilities
├── types/                # Shared types
├── utils/                # Utility functions
├── main.tsx              # Entry point
└── index.css             # Global styles
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
    │   ├── useAuth.ts
    │   └── useTokenRefresh.ts
    ├── api/              # Feature API calls
    ├── lib/              # Feature utilities
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

| Type | Convention | Example |
|------|------------|---------|
| UI components | PascalCase | `Button.tsx`, `LoginForm.tsx` |
| Page routes | PascalCase | `Home.tsx`, `DataTable.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts`, `useLocalStorage.ts` |
| Utilities | kebab-case | `cn.ts`, `api-client.ts` |
| Tests | Co-located, `[Name].test.tsx` | `Button.test.tsx` next to `Button.tsx` |

## Import Aliases

The project uses `@/` as an alias for `src/`:

```typescript
// ✅ Good
import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { env } from "@/config";

// ❌ Bad
import { Button } from "../../../components/ui/button";
```

## Related Documentation

- [Application Overview](./application-overview.md)
- [Components and Styling](./components-and-styling.md)
