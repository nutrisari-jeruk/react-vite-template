# Documentation

This folder contains detailed documentation for the React Vite application architecture and patterns.

## Quick Links

| Document | Description |
|----------|-------------|
| [Application Overview](./application-overview.md) | Tech stack, architecture, and getting started |
| [Project Structure](./project-structure.md) | Directory structure and organization |
| [Components and Styling](./components-and-styling.md) | UI components and Tailwind patterns |
| [API Layer](./api-layer.md) | HTTP client, error handling, TanStack Query |
| [State Management](./state-management.md) | Server state, URL state, form state |
| [Error Handling](./error-handling.md) | Error boundaries, API errors, validation |
| [Testing](./testing.md) | Vitest, Testing Library, patterns |
| [Security](./security.md) | Authentication, XSS, CSRF, best practices |
| [Project Configuration](./project-configuration.md) | Environment, TypeScript, Vite, tooling |

## For AI Assistants

See [AGENTS.md](../AGENTS.md) in the root directory for quick conventions and guidelines.

## Architecture at a Glance

```
src/
├── app/          → Application shell (providers, router)
├── components/   → Shared components (ui/, layouts/)
├── config/       → Configuration (env, constants)
├── features/     → Feature modules (self-contained)
├── hooks/        → Shared custom hooks
├── lib/          → Core utilities (api, errors)
├── pages/        → Route page components
├── testing/      → Test utilities
├── types/        → Shared TypeScript types
└── utils/        → Utility functions
```

## Key Principles

1. **Feature-based organization** - Code organized by domain, not type
2. **Barrel exports** - Public APIs through `index.ts`
3. **Type safety** - Full TypeScript with Zod validation
4. **Lazy loading** - Route-based code splitting
5. **Co-located tests** - Tests next to source files
