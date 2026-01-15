# Application Overview

## Introduction

This is a React frontend application built with modern tools and the Bulletproof React architecture pattern. It provides a scalable, maintainable structure for building production-ready applications.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 with TypeScript |
| Build Tool | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| Data Fetching | TanStack Query |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Testing | Vitest + Testing Library |
| Code Quality | ESLint + Prettier |
| Git Hooks | Husky + lint-staged |

## Architecture

The application follows the **Bulletproof React** architecture, which emphasizes:

1. **Feature-based organization** - Code is organized by feature/domain rather than type
2. **Clear boundaries** - Features are self-contained with explicit public APIs
3. **Scalability** - Structure scales well as the application grows
4. **Maintainability** - Easy to find, modify, and delete code

## Directory Structure

```
src/
├── app/              # Application shell (providers, router)
├── components/       # Shared components (ui/, layouts/)
├── config/           # Configuration (env, constants)
├── features/         # Feature modules
├── hooks/            # Shared hooks
├── lib/              # Core utilities (api, errors)
├── pages/            # Route pages
├── testing/          # Test utilities
├── types/            # Shared types
└── utils/            # Utility functions
```

## Entry Points

### `main.tsx`
Application entry point that renders the root component with error boundary.

### `src/app/index.tsx`
Main App component that composes providers and router.

### `src/app/provider.tsx`
Centralized provider setup (QueryClientProvider, etc.).

### `src/app/router.tsx`
Route configuration with lazy-loaded pages.

## Key Patterns

### Lazy Loading
All page components are lazy-loaded for better initial bundle size:

```typescript
const Home = lazy(() => import("@/pages/home"));
```

### Barrel Exports
Each module exposes a public API through `index.ts`:

```typescript
// Import from barrel
import { Button, Card } from "@/components";
import { useAuth } from "@/features/auth";
```

### Provider Composition
Providers are composed in `src/app/provider.tsx`:

```typescript
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Related Documentation

- [Project Structure](./project-structure.md)
- [Components and Styling](./components-and-styling.md)
- [State Management](./state-management.md)
- [API Layer](./api-layer.md)
