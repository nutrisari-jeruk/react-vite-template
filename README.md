# React Frontend Template

A production-ready React frontend template built with modern tools and best practices.

## Tech Stack

- **React 19** with TypeScript - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and state management
- **Axios** - HTTP client
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation
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

### Error Handling
- Global Error Boundary for React error catching
- Comprehensive error logging
- User-friendly error fallback UI
- Development error details

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

## Error Handling

### Error Boundary

The application includes a global Error Boundary that catches JavaScript errors anywhere in the component tree and displays a user-friendly fallback UI.

#### Default Usage

The Error Boundary is already wrapped around the entire app in `main.tsx`:

```typescript
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to error tracking service (e.g., Sentry)
    console.error("Global error caught:", error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>
```

#### Wrapping Specific Components

You can wrap specific sections of your app:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary'

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={CustomErrorFallback}
      onError={(error, errorInfo) => {
        // Custom error handling
      }}
    >
      <RiskyComponent />
    </ErrorBoundary>
  )
}
```

#### Custom Fallback UI

```typescript
import type { Error as ErrorType } from 'react'

function CustomErrorFallback({
  error,
  resetError,
}: {
  error: ErrorType
  resetError: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )
}
```

#### Higher-Order Component

```typescript
import { withErrorBoundary } from '@/components/ErrorBoundary'

const ProtectedComponent = withErrorBoundary(MyComponent, {
  fallback: CustomErrorFallback,
})
```

#### Testing the Error Boundary

Navigate to `/error-test` to see the Error Boundary in action. Click the "Trigger Error" button to intentionally throw an error and see the fallback UI.

## Form Validation

### Using React Hook Form with Zod

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Define schema
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

// Infer TypeScript type from schema
type FormData = z.infer<typeof schema>

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    // Form data is validated and type-safe
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input {...register('username')} placeholder="Username" />
        {errors.username && <span>{errors.username.message}</span>}
      </div>

      <div>
        <input
          type="password"
          {...register('password')}
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  )
}
```

## Custom Hooks

### useLocalStorage

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage'

const [value, setValue] = useLocalStorage('key', defaultValue)
```

## Environment Variables

The project uses a type-safe environment configuration system with validation. Create a `.env` file in the root directory by copying from `.env.example`:

```bash
cp .env.example .env
```

### Available Variables

The `.env.example` file includes the following sections:

- **Application Configuration** - App name, URL, and environment
- **API Configuration** - API URL and timeout settings
- **Authentication** - Token keys and refresh interval
- **Cache Configuration** - Query caching and retry settings
- **UI Configuration** - Theme, locale, and date format
- **Pagination** - Default and maximum page sizes
- **Upload Configuration** - File size limits and allowed types
- **Maintenance Mode** - Enable/disable maintenance mode

### Environment Configuration

The project includes a type-safe environment configuration system at `src/utils/env.ts` that:

- Validates all required environment variables at startup
- Provides type-safe access via `env` object
- Validates URLs, numbers, and booleans
- Falls back to sensible defaults when appropriate
- Shows helpful error messages in development

### Usage

```typescript
import { env, isProduction, isDevelopment } from '@/utils/env'

// Access configuration
console.log(env.apiUrl)
console.log(env.appName)
console.log(env.defaultPageSize)

// Check environment
if (isProduction) {
  // Production-specific code
}

// Check maintenance mode
if (env.maintenanceMode) {
  // Show maintenance message
}
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
