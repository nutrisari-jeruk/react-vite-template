# Project Structure

## Overview

The project follows a feature-based structure that scales well and maintains clear boundaries between different parts of the application.

## Root Structure

```
src/
├── app/                  # Application layer
├── components/           # Shared components
├── config/               # Configuration
├── features/             # Feature modules
├── hooks/                # Shared hooks
├── lib/                  # Core utilities
├── pages/                # Route pages
├── testing/              # Test utilities
├── types/                # Shared types
├── utils/                # Utility functions
├── assets/               # Static assets
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
└── router.tsx        # Route configuration
```

**Purpose**: Bootstrap the application, configure providers, define routes.

### `src/components/`

Shared components used across the application.

```
components/
├── ui/                   # UI primitives
│   ├── button/
│   │   ├── button.tsx
│   │   └── index.ts
│   ├── input/
│   ├── card/
│   └── index.ts          # Re-exports all UI components
├── layouts/              # Layout components
│   ├── main-layout.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── index.ts
├── __tests__/            # Component tests
├── error-boundary.tsx    # Shared components
├── combobox.tsx
└── index.ts              # Main barrel export
```

**Rules**:
- UI components have no business logic
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
    │   └── auth-guard.tsx
    ├── hooks/            # Feature-specific hooks
    │   └── use-auth.ts
    ├── lib/              # Feature utilities
    │   └── token-storage.ts
    ├── types/            # Feature types
    │   └── index.ts
    └── index.ts          # Public API
```

**Rules**:
- Features are self-contained
- Only export public API through `index.ts`
- Features can import from shared modules (`@/components`, `@/lib`)
- Features should NOT import from other features

### `src/hooks/`

Shared custom React hooks.

```
hooks/
├── use-api-error.ts
├── use-local-storage.ts
└── index.ts
```

**Naming**: `use-[name].ts` (kebab-case with `use-` prefix)

### `src/lib/`

Core utilities and third-party integrations.

```
lib/
├── api-client.ts     # Axios instance with interceptors
├── api-error.ts      # Custom error classes
└── index.ts          # Barrel export
```

**Purpose**: Low-level utilities that don't fit in features or hooks.

### `src/pages/`

Route page components.

```
pages/
├── __tests__/
├── home.tsx
├── about.tsx
├── components.tsx
├── auth-example.tsx
├── error-examples.tsx
├── form-validation-example.tsx
└── not-found.tsx
```

**Rules**:
- Kebab-case filenames
- Default exports (for lazy loading)
- Minimal logic - compose from features and components

### `src/testing/`

Test utilities and configuration.

```
testing/
├── setup.ts          # Test setup (jest-dom)
├── test-utils.tsx    # Custom render with providers
├── mocks/
│   ├── handlers.ts   # MSW handlers
│   └── server.ts     # MSW server
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
├── cn.ts             # className utility
└── index.ts          # Barrel export
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `button.tsx`, `auth-guard.tsx` |
| Hooks | use-[name].ts | `use-auth.ts` |
| Utilities | kebab-case | `cn.ts`, `api-client.ts` |
| Tests | [name].test.tsx | `button.test.tsx` |
| Types | kebab-case or index.ts | `index.ts` |

## Import Aliases

The project uses `@/` as an alias for `src/`:

```typescript
// ✅ Good
import { Button } from "@/components";
import { useAuth } from "@/features/auth";
import { env } from "@/config";

// ❌ Bad
import { Button } from "../../../components/ui/button";
```

## Related Documentation

- [Application Overview](./application-overview.md)
- [Components and Styling](./components-and-styling.md)
