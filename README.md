# React Frontend Template

A production-ready React frontend template built with modern tools and best practices.

## Tech Stack

- **React 19** with TypeScript - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and state management
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **Husky** - Git hooks
- **Lint-staged** - Run linters on staged files
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server

# Building
npm run build           # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run Vitest tests
npm run test:ui          # Run Vitest UI
npm run test:coverage    # Run tests with coverage
```

## Project Structure

```
src/
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable UI components
│   └── __tests__/   # Component tests
├── layouts/          # Page layouts (Navbar, Footer, etc.)
├── pages/            # Route pages
│   └── __tests__/   # Page tests
├── hooks/            # Custom React hooks
├── lib/              # Third-party integrations (api, query providers)
├── services/         # API services
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── test/             # Test setup and utilities
├── App.tsx           # Root component with Router
├── main.tsx          # Entry point
└── index.css         # Global styles + Tailwind directives
```

## Key Features

### React Router
- Client-side routing with clean URLs
- Nested routes support
- Active link highlighting in navigation

### TanStack Query
- Automatic caching and background updates
- Optimistic updates
- DevTools for debugging
- Configured with sensible defaults

### Axios
- Centralized HTTP client
- Request/response interceptors
- Automatic auth token handling
- Error handling

### Tailwind CSS
- Utility-first CSS
- Responsive design
- Custom theme support
- Dark mode ready

### Testing
- Vitest for fast tests
- React Testing Library
- User event simulation
- Coverage reporting

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky git hooks
- Lint-staged for automated checks

## API Integration

### Using TanStack Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const { data } = await api.get('/users')
    return data
  },
})

// Mutate data
const mutation = useMutation({
  mutationFn: async (userData) => {
    const { data } = await api.post('/users', userData)
    return data
  },
  onSuccess: () => {
    // Invalidate cache
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})
```

### Using Axios Directly

```typescript
import api from '@/lib/api'

// GET request
const response = await api.get('/users')

// POST request
const response = await api.post('/users', { name: 'John' })

// PUT request
const response = await api.put('/users/1', { name: 'Jane' })

// DELETE request
const response = await api.delete('/users/1')
```

## Custom Hooks

### useLocalStorage

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage'

const [value, setValue] = useLocalStorage('key', defaultValue)
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Git Hooks

Pre-commit hooks are configured to run lint-staged:

- ESLint with auto-fix on TypeScript files
- Prettier formatting on all files

## Development

### Adding a New Route

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/layouts/Navbar.tsx`

### Creating a Component

1. Create component in `src/components/`
2. Create tests in `src/components/__tests__/`
3. Export and use in pages or other components

### API Service

1. Create service in `src/services/`
2. Use TanStack Query hooks for data fetching
3. Type your API responses in `src/types/`

## Production Build

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## License

MIT
