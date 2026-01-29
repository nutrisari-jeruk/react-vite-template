# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and AI agents working with this repository.

## Documentation

- **CLAUDE.md** (this file) - Conventions, patterns, and rules
- **[README.md](./README.md)** - Detailed component examples, usage patterns, and implementation

## Architecture

**Pattern:** Bulletproof React - feature-based modular structure

```
src/
├── app/                  # Application layer (router, providers, routes)
├── components/           # Shared components
│   ├── ui/              # UI primitives (lowercase folders, PascalCase exports)
│   ├── layouts/         # Layout components
│   └── __tests__/       # Component tests
├── config/              # Environment variables, constants
├── features/            # Self-contained feature modules
├── hooks/               # Shared custom hooks
├── lib/                 # Core utilities (api client, errors)
├── testing/             # Test utilities
├── types/               # Shared TypeScript types
└── utils/               # Utility functions
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| UI components | kebab-case folder, PascalCase export | `button/button.tsx` → `Button` |
| Page routes | PascalCase | `Home.tsx`, `DataTableExample.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-auth.ts`, `use-local-storage.ts` |
| Utilities | kebab-case | `cn.ts`, `api-client.ts` |
| Tests | Same as source with `.test.tsx` | `button.test.tsx` |

## Import Patterns

```typescript
// Import order: 1. React/external, 2. Internal aliases (@/), 3. Types with `type` keyword
import { useState } from "react";
import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { api } from "@/lib";
import type { User } from "@/types";

// Use barrel exports
import { Button, Input, Card } from "@/components/ui";

// NOT from internal paths
// import { Button } from "@/components/ui/button/button";
```

## Component Conventions

### UI Components (`src/components/ui/`)

**Structure:**
```
src/components/ui/button/
├── button.tsx       # export function Button() {}
└── index.ts         # export { Button }
```

**When adding UI components:**
1. Create `src/components/ui/[name]/[name].tsx` (lowercase file)
2. Export as PascalCase: `export function ComponentName() {}`
3. Create `index.ts` barrel export
4. Export from `src/components/ui/index.ts`
5. Add tests in `src/components/__tests__/`

### Page Routes (`src/app/routes/`)

**When adding routes:**
1. Create page in `src/app/routes/[PageName].tsx` (PascalCase)
2. Use default export: `export default function PageName() {}`
3. Add lazy import in `src/app/router.tsx`
4. Add route constant in `src/config/constants.ts` (ROUTES object)
5. Update navigation in `src/components/layouts/navbar.tsx`

### Feature Modules (`src/features/`)

**Structure:**
```
src/features/[feature-name]/
├── components/          # Feature-specific components
├── hooks/              # Feature-specific hooks
├── lib/                # Feature utilities
├── types/              # Feature types
└── index.ts            # Public API (barrel export)
```

**Rules:**
- Features should NOT import from other features directly
- Only export public API through `index.ts`
- Import from `@/components`, `@/lib`, `@/hooks` is allowed

## Component Props Reference

**IMPORTANT:** Always check this section before using component props. Using unknown variants, sizes, or other props will cause errors.

### Button (`src/components/ui/button/button.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `primary`, `secondary`, `danger`, `outline-primary`, `outline-secondary`, `outline-danger`, `white`, `outline-white`, `link`, `link-primary`, `link-muted` |
| `size` | `sm`, `md`, `lg` |

### Badge (`src/components/ui/badge/badge.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `default`, `primary`, `success`, `warning`, `danger`, `info` |
| `size` | `sm`, `md`, `lg` |
| `pill` | boolean |
| `dot` | boolean |

### Alert (`src/components/ui/alert/alert.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `info`, `success`, `warning`, `danger` |

### Input (`src/components/ui/input/input.tsx`)

| Prop | Values |
|------|--------|
| `size` | `sm`, `md`, `lg` |
| `variant` | `default`, `filled`, `outlined` |

### Select (`src/components/ui/select/select.tsx`)

| Prop | Values |
|------|--------|
| `size` | `sm`, `md`, `lg` |
| `variant` | `default`, `filled`, `outlined` |

### Dialog (`src/components/ui/dialog/dialog.tsx`)

| Prop | Values |
|------|--------|
| `size` | `sm`, `md`, `lg`, `xl`, `full` |

### Toast (`src/components/ui/toast/toast.tsx`)

| Prop | Values |
|------|--------|
| `variant` | `info`, `success`, `warning`, `error` |
| `position` | `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` |

### Tooltip (`src/components/ui/tooltip/tooltip.tsx`)

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

## API Integration

```typescript
import { api } from "@/lib";

const response = await api.get("/users");
```

Always use the centralized `api` client from `@/lib`. It includes:
- Automatic auth token injection
- Auto token refresh on 401
- Request ID tracing via `X-Request-ID`
- Type-safe error classes
- Exponential backoff retry

## Environment Variables

Access via the `env` object, not `import.meta.env` directly:

```typescript
import { env, isDevelopment, isProduction } from "@/config";

console.log(env.apiUrl);
```

Define new vars in `.env.example` and `src/config/env.ts`.

## Testing

```typescript
import { render, screen } from "@/testing";

test("renders component", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

## Common Tasks

### Adding a UI Component
1. Create `src/components/ui/[name]/[name].tsx`
2. Create barrel `index.ts`
3. Export from `src/components/ui/index.ts`
4. Add tests in `src/components/__tests__/`

### Adding a Feature
1. Create `src/features/[name]/`
2. Add subfolders: `components/`, `hooks/`, `lib/`, `types/`
3. Create `index.ts` with public API exports

### Adding a Page
1. Create `src/app/routes/[PageName].tsx` (PascalCase, default export)
2. Add lazy import in `src/app/router.tsx`
3. Add to `ROUTES` in `src/config/constants.ts`
4. Update navigation

### Adding a Hook
1. Create `src/hooks/use-[name].ts`
2. Export from `src/hooks/index.ts`

## Do's and Don'ts

### Do
- Use barrel exports for clean imports
- Follow kebab-case file naming (except page routes: PascalCase)
- Keep features self-contained
- Use path aliases (`@/`)
- Export default for page components (lazy loading)
- Use `cn()` for conditional classNames
- Use `type` keyword for type-only imports
- **Check Component Props Reference section before using component variants/sizes**
- **Read the component source file if unsure about available props**

### Don't
- Import from internal feature paths
- Create circular dependencies between features
- Put business logic in UI components
- Use relative imports for cross-directory imports
- Skip barrel exports when adding components
- Use template literals for className merging
- **Use component variants, sizes, or props not listed in Component Props Reference**
- **Guess component props - always verify first**

## Important Notes

- **Line endings:** Enforced LF (not CRLF) via `.gitattributes`
- **UI components:** Lowercase folder names, PascalCase exports
- **Page components:** PascalCase filenames, default exports
- **Environment:** All vars must be in `.env.example` and `src/config/env.ts`
- **New routes:** Must update router.tsx, constants.ts, and navigation
