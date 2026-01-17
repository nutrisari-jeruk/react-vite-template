# Linting and Code Quality

This document outlines the ESLint configuration and coding standards for the project.

## Overview

We use ESLint with a comprehensive rule set to ensure code consistency, catch bugs early, and maintain high code quality across the team. The configuration is designed to be helpful without being overly restrictive.

## Installed ESLint Plugins

- **@eslint/js** - JavaScript recommended rules
- **typescript-eslint** - TypeScript-specific linting
- **eslint-plugin-react** - React best practices
- **eslint-plugin-react-hooks** - React Hooks rules
- **eslint-plugin-react-refresh** - Vite HMR optimization
- **eslint-plugin-jsx-a11y** - Accessibility rules
- **eslint-plugin-import** - Import/export organization
- **eslint-plugin-prettier** - Prettier integration

## Key Rules and Standards

### React Best Practices

- **`react/jsx-key`**: Ensures all mapped elements have unique keys (error)
- **`react/no-array-index-key`**: Warns against using array indices as keys
- **`react/jsx-no-target-blank`**: Prevents security issues with `target="_blank"`
- **`react/self-closing-comp`**: Enforces self-closing tags for empty components
- **`react/no-unescaped-entities`**: Catches unescaped HTML entities

### TypeScript Standards

- **`@typescript-eslint/no-unused-vars`**: Eliminates unused variables (allows `_` prefix)
- **`@typescript-eslint/no-explicit-any`**: Warns against `any` types (encourages proper typing)
- **`@typescript-eslint/consistent-type-imports`**: Enforces consistent type imports (auto-fixable)
- **`@typescript-eslint/prefer-nullish-coalescing`**: Prefers `??` over `||` for null checks
- **`@typescript-eslint/prefer-optional-chain`**: Prefers optional chaining `?.` where possible

### Import Organization

Imports are automatically sorted and grouped:

1. Built-in Node.js modules
2. External packages (React always first)
3. Internal modules (alias imports with `@/`)
4. Parent/sibling/relative imports
5. Type imports

**Example**:
```tsx
import { useState } from "react"; // External - React first
import { Button } from "@/components/ui/button"; // Internal
import { useAuth } from "@/features/auth/hooks/useAuth"; // Internal
import { MyComponent } from "./MyComponent"; // Relative
import type { User } from "@/types"; // Type import
```

### Accessibility (jsx-a11y)

- **`jsx-a11y/anchor-is-valid`**: Ensures `<a>` tags have valid href or button role
- **`jsx-a11y/click-events-have-key-events`**: Interactive elements need keyboard handlers
- **`jsx-a11y/no-static-element-interactions`**: Warns against click handlers on non-interactive elements

These are set to "warn" to raise awareness without blocking development.

### Code Quality

- **`no-console`**: Warns against console.log (allows `console.warn` and `console.error`)
- **`no-debugger`**: Prevents debugger statements in production code
- **`no-var`**: Enforces `const`/`let` (no legacy `var`)
- **`prefer-const`**: Suggests `const` when variables aren't reassigned
- **`no-alert`**: Discourages native alerts (use UI components instead)
- **`import/no-duplicates`**: Prevents duplicate imports from the same module

## Usage

### Check for Issues

```bash
npm run lint
```

### Auto-fix Issues

```bash
npm run lint:fix
```

### Pre-commit Hooks

Our `lint-staged` configuration automatically runs Prettier and ESLint on staged files:

```bash
# Runs on git commit automatically via Husky
prettier --write
eslint --fix
```

## Configuration Details

### Type-Aware Linting

TypeScript rules are configured to:
- Allow unused variables prefixed with `_` (common pattern for intentionally unused params)
- Allow type annotations in import statements
- Not require explicit return types (balance between strictness and developer experience)
- Prefer type-only imports where possible

### Import Resolution

The `eslint-plugin-import` is configured with TypeScript resolver to properly handle:
- Path aliases (`@/`)
- Type-only imports
- Module resolution in monorepo-style projects

## Best Practices

### 1. Use Type Imports

```tsx
// ✅ Preferred
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

// ❌ Avoid
import { Button, type ButtonProps } from "@/components/ui/button";
```

### 2. Handle Unused Variables

```tsx
// ✅ Prefix with underscore if intentionally unused
const { data, _isLoading } = useQuery();

// ❌ Leave unused variables
const { data, isLoading } = useQuery();
```

### 3. Use Nullish Coalescing

```tsx
// ✅ Preferred
const value = input ?? "default";

// ❌ Avoid (treats empty string as falsy)
const value = input || "default";
```

### 4. Prefer Optional Chaining

```tsx
// ✅ Preferred
const email = user?.contact?.email;

// ❌ Avoid
const email = user && user.contact && user.contact.email;
```

## Troubleshooting

### Import Errors

If you see import-related errors:
1. Ensure the file exists at the specified path
2. Check `tsconfig.json` for path aliases
3. Try running `npm run lint:fix` to auto-resolve

### Type Errors

For type-related warnings:
1. Verify types are properly imported
2. Check if type-only imports are used correctly
3. Consider if `any` is truly necessary or if a proper type can be defined

### Accessibility Warnings

Accessibility warnings are intentionally set to "warn" level. They're meant to:
- Raise awareness during development
- Educate team members about a11y best practices
- Not block feature development

If a warning is a false positive, you can use `// eslint-disable-next-line` with a comment explaining why.

## Extending the Rules

If the team decides to add or modify rules:

1. Update `eslint.config.js`
2. Test with `npm run lint`
3. Document the change in this file
4. Communicate the change to the team

## Resources

- [ESLint Documentation](https://eslint.org/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [JSX Accessibility](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
