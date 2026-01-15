# AI Agent Guidelines

This document provides conventions and guidelines for AI assistants working on this codebase. Following these patterns ensures consistency and maintainability.

## Architecture Overview

This project follows the **Bulletproof React** architecture pattern - a feature-based modular structure optimized for scalability.

```
src/
├── app/                  # Application layer (providers, router, entry)
├── components/           # Shared components
│   ├── ui/              # UI primitives (Button, Input, etc.)
│   ├── layouts/         # Layout components (MainLayout, Navbar)
│   └── *.tsx            # Shared components (ErrorBoundary, etc.)
├── config/              # Configuration (env, constants)
├── features/            # Feature modules (self-contained)
├── hooks/               # Shared custom hooks
├── lib/                 # Core utilities (api client, errors)
├── pages/               # Route page components
├── testing/             # Test utilities and mocks
├── types/               # Shared TypeScript types
└── utils/               # Utility functions
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `button.tsx`, `avatar-group.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-auth.ts`, `use-local-storage.ts` |
| Types | kebab-case | `index.ts` in types folder |
| Tests | Same as source with `.test.tsx` | `button.test.tsx` |
| Utilities | kebab-case | `cn.ts`, `env.ts` |

## Component Guidelines

### UI Components (`src/components/ui/`)

For reusable UI primitives that have no business logic:

```
src/components/ui/
├── button/
│   ├── button.tsx       # Component implementation
│   └── index.ts         # Barrel export
├── input/
│   ├── input.tsx
│   └── index.ts
└── index.ts             # Re-exports all UI components
```

**When to add here:**
- Generic, reusable UI elements
- No business logic or data fetching
- Styled with Tailwind CSS
- Accessible (ARIA attributes)

**Component structure:**

```typescript
// src/components/ui/button/button.tsx
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "base-styles",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
```

### Layout Components (`src/components/layouts/`)

For page structure components:

- `main-layout.tsx` - Main app layout with Navbar/Footer
- `navbar.tsx` - Navigation component
- `footer.tsx` - Footer component

### Shared Components (`src/components/`)

For components used across features but not generic UI:

- `error-boundary.tsx` - Error handling wrapper
- `code-block.tsx` - Code display component
- `combobox.tsx` - Searchable dropdown

## Feature Modules (`src/features/`)

Self-contained feature modules with their own components, hooks, and types:

```
src/features/auth/
├── components/          # Feature-specific components
│   └── auth-guard.tsx
├── hooks/              # Feature-specific hooks
│   └── use-auth.ts
├── lib/                # Feature utilities
│   └── token-storage.ts
├── types/              # Feature types
│   └── index.ts
└── index.ts            # Public API (barrel export)
```

**Rules:**
1. Features should be self-contained
2. Only export public API through `index.ts`
3. Internal implementation details stay private
4. Features can import from `@/components`, `@/lib`, `@/hooks`
5. Features should NOT import from other features directly

**Creating a new feature:**

```bash
src/features/[feature-name]/
├── components/
├── hooks/
├── lib/
├── types/
│   └── index.ts
└── index.ts
```

## Import Patterns

### Use Path Aliases

Always use the `@/` alias for imports:

```typescript
// ✅ Good
import { Button } from "@/components";
import { useAuth } from "@/features/auth";
import { env } from "@/config";

// ❌ Bad
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../features/auth/hooks/use-auth";
```

### Use Barrel Exports

Import from barrel files, not internal paths:

```typescript
// ✅ Good
import { Button, Input, Card } from "@/components";
import { useAuth, AuthGuard } from "@/features/auth";

// ❌ Bad
import { Button } from "@/components/ui/button/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
```

### Import Order

1. React/external libraries
2. Internal aliases (`@/`)
3. Relative imports (if necessary)
4. Types (with `type` keyword)

```typescript
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button, Card } from "@/components";
import { useAuth } from "@/features/auth";
import { api } from "@/lib";

import type { User } from "@/types";
```

## Page Components (`src/pages/`)

Route page components with lowercase filenames for lazy loading:

```typescript
// src/pages/home.tsx
function HomePage() {
  return <div>...</div>;
}

export default HomePage; // Default export for lazy loading
```

**Naming:** `kebab-case.tsx` (e.g., `form-validation-example.tsx`)

**Lazy loading in router:**

```typescript
const Home = lazy(() => import("@/pages/home"));
```

## Hooks (`src/hooks/`)

Shared hooks used across the application:

```typescript
// src/hooks/use-local-storage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Implementation
}
```

**Naming:** `use-[name].ts`

## Configuration (`src/config/`)

### Environment Variables (`env.ts`)

Access via the `env` object:

```typescript
import { env, isDevelopment, isProduction } from "@/config";

console.log(env.apiUrl);
console.log(env.appName);
```

### Constants (`constants.ts`)

Application-wide constants:

```typescript
import { ROUTES, API_ENDPOINTS, QUERY_KEYS } from "@/config";

// Routes
<Link to={ROUTES.HOME}>Home</Link>

// API endpoints
api.get(API_ENDPOINTS.AUTH.LOGIN);

// Query keys
useQuery({ queryKey: QUERY_KEYS.USERS });
```

## Testing (`src/testing/`)

### Test Utilities

Use custom render with providers:

```typescript
import { render, screen } from "@/testing";

test("renders component", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

### Co-located Tests

Tests are co-located with their source:

```
src/components/__tests__/button.test.tsx
src/pages/__tests__/home.test.tsx
```

## API & Data Fetching

### API Client (`src/lib/api-client.ts`)

```typescript
import { api } from "@/lib";

const response = await api.get("/users");
const response = await api.post("/users", data);
```

### Error Handling

Use custom error classes:

```typescript
import { ValidationError, UnauthorizedError } from "@/lib";
import { useApiError } from "@/hooks";

const { handleApiError, error, fieldErrors } = useApiError();
```

### TanStack Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib";
import { QUERY_KEYS } from "@/config";

const { data } = useQuery({
  queryKey: QUERY_KEYS.USERS,
  queryFn: () => api.get("/users").then(res => res.data),
});
```

## Styling

### Tailwind CSS

Use utility classes with the `cn` helper for conditional classes:

```typescript
import { cn } from "@/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)} />
```

### Component Variants

Use object maps for variant styles:

```typescript
const variants = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-200 text-gray-800",
} as const;

<button className={cn(baseStyles, variants[variant])} />
```

## TypeScript

### Prefer Interfaces for Props

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}
```

### Export Types Separately

```typescript
export type { ButtonProps } from "./button";
```

### Use `type` Imports

```typescript
import type { User } from "@/types";
```

## Do's and Don'ts

### Do

- ✅ Use barrel exports for clean imports
- ✅ Follow kebab-case file naming
- ✅ Keep features self-contained
- ✅ Use path aliases (`@/`)
- ✅ Add new UI primitives to `components/ui/`
- ✅ Export default for page components (lazy loading)
- ✅ Use `cn()` for conditional classNames

### Don't

- ❌ Import from internal feature paths
- ❌ Create circular dependencies between features
- ❌ Put business logic in UI components
- ❌ Use relative imports for cross-directory imports
- ❌ Skip barrel exports when adding components
- ❌ Mix PascalCase and kebab-case filenames

## Common Tasks

### Adding a New UI Component

1. Create folder: `src/components/ui/[name]/`
2. Create component: `[name].tsx`
3. Create barrel: `index.ts`
4. Export from `src/components/ui/index.ts`
5. Add tests: `src/components/__tests__/[name].test.tsx`

### Adding a New Feature

1. Create folder: `src/features/[name]/`
2. Add subfolders: `components/`, `hooks/`, `lib/`, `types/`
3. Create public API: `index.ts`
4. Only export what's needed publicly

### Adding a New Page

1. Create page: `src/pages/[name].tsx` (kebab-case)
2. Use default export
3. Add route in `src/app/router.tsx` with lazy loading
4. Add to `ROUTES` constant if needed

### Adding a New Hook

1. Create hook: `src/hooks/use-[name].ts`
2. Export from `src/hooks/index.ts`
3. Add tests if complex logic
