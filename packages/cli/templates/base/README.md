# React App

> Scaffolded with frontier-fe

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS v4
- **Router:** React Router v7
- **State Management:** Zustand 5, TanStack Query v5
- **Forms:** React Hook Form 7 + Zod 4
- **HTTP Client:** Axios 1.14.0
- **Testing:** Vitest 4, Testing Library, MSW 2
- **Icons:** Lucide React
- **Code Quality:** ESLint 9, Prettier 3, Husky, lint-staged

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Start development server                      |
| `npm run build`         | Build for production (`tsc -b && vite build`) |
| `npm run preview`       | Preview production build locally              |
| `npm run lint`          | Run ESLint                                    |
| `npm run lint:fix`      | Fix ESLint errors automatically               |
| `npm run format`        | Format code with Prettier                     |
| `npm run format:check`  | Check code formatting                         |
| `npm test`              | Run tests with Vitest                         |
| `npm run test:coverage` | Run tests with coverage report                |

## Project Structure

```
src/
├── app/              # Router, providers, routes
│   ├── index.tsx     # App entry
│   ├── provider.tsx # React Query + error boundary
│   ├── router.tsx    # Route definitions
│   └── routes/       # Page components
├── components/       # Shared components
│   ├── ui/          # UI components (add via CLI)
│   └── layouts/     # Layout components (navbar, etc.)
├── config/          # Environment variables, constants
├── features/        # Feature modules (add via CLI)
├── hooks/           # Shared custom hooks
├── lib/             # Third-party configs (axios, queryClient)
├── testing/         # Test utilities, MSW setup
├── types/           # Shared TypeScript types
└── utils/           # Utility functions
```

## Key Patterns

### API Integration

Use the `api` client from `@/lib` for all HTTP requests. It's pre-configured with interceptors for error handling and token refresh.

```typescript
import { api } from "@/lib";
import { useQuery, useMutation } from "@tanstack/react-query";

// Fetch data
const { data } = useQuery({
  queryKey: ["users"],
  queryFn: () => api.get("/users").then((res) => res.data),
});

// Mutate data
const mutation = useMutation({
  mutationFn: (user) => api.post("/users", user),
});
```

### Environment Variables

Access env vars via `env` from `@/config`, not `import.meta.env` directly.

```typescript
import { env } from "@/config";

const apiUrl = env.VITE_API_URL;
```

### Adding Components

Use the frontier-fe CLI to add pre-built components:

```bash
frontier-fe add button input card dialog select
```

Or use the `/new-component` Claude Code skill for custom components.

### Adding Pages

Use the `/new-page` Claude Code skill, or the CLI:

```bash
frontier-fe add page dashboard
```

### Adding Features

Features are self-contained modules with their own components, hooks, API calls, and types.

```bash
frontier-fe add auth  # Adds authentication feature
```

## Docker

### Development

```bash
docker compose --profile dev up
```

### Production

```bash
docker compose --profile prod up --build
./deploy.sh
```

## Environment Variables

See `.env.example` for all available variables. Key variables:

- `VITE_API_URL` — Backend API endpoint
- `VITE_APP_NAME` — Application name

## CLI Commands

```bash
frontier-fe add <item>    # Add component, hook, feature, or page
frontier-fe list          # List all available items
```

## License

MIT
