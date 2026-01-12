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
- Comprehensive error handling
- Automatic token refresh on 401
- Request ID tracing
- Exponential backoff retry

### Error Handling
- Custom API error classes
- Type-safe error handling
- Automatic retry logic
- Form field-level error display
- User-friendly error messages
- Request/response error classification

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

### Authentication
- Secure token storage with cookies/localStorage
- Environment-based storage strategy
- JWT token parsing and validation
- Automatic token expiration tracking
- Token refresh hooks
- Type-safe auth management

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

## API Error Handling

The application includes a comprehensive API error handling system with custom error classes, automatic retry logic, and user-friendly error messages.

### Error Classes

The system includes typed error classes for different scenarios:

```typescript
import {
  ApiError,
  NetworkError,
  TimeoutError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError,
  ServiceUnavailableError,
} from '@/lib/api-error'
```

### Using useApiError Hook

```typescript
import { useApiError } from '@/hooks/useApiError'

function MyComponent() {
  const { error, fieldErrors, isError, clearError, handleApiError, getFieldError } = useApiError()

  const handleSubmit = async (data: FormData) => {
    try {
      await api.post('/endpoint', data)
    } catch (err) {
      handleApiError(err)
      // Error is automatically handled and displayed
    }
  }

  return (
    <form>
      {isError && (
        <div className="error">{error?.message}</div>
      )}

      <input />
      {getFieldError('email') && (
        <div className="error">{getFieldError('email')}</div>
      )}

      <button>Submit</button>
    </form>
  )
}
```

### Error Types & Handling

The API client automatically handles different error types:

| Error Type | Status Code | Retryable | Action |
|------------|-------------|-----------|---------|
| Network Error | - | ✓ Yes | Retry with backoff |
| Timeout Error | 408 | ✓ Yes | Retry with backoff |
| Validation Error | 400, 422 | ✗ No | Show field errors |
| Unauthorized | 401 | ✗ No | Clear token, redirect to login |
| Forbidden | 403 | ✗ No | Show access denied message |
| Not Found | 404 | ✗ No | Show 404 message |
| Conflict | 409 | ✗ No | Show conflict message |
| Rate Limit | 429 | ✓ Yes | Retry after delay |
| Server Error | 500, 502, 504 | ✓ Yes | Retry with backoff |
| Service Unavailable | 503 | ✓ Yes | Retry with backoff |

### Automatic Retry Logic

Queries and mutations automatically retry on retryable errors:

- **Exponential backoff**: 1s, 2s, 4s, 8s, 16s (max 30s)
- **Jitter**: Random delay to avoid thundering herd
- **Configurable retries**: Set via `VITE_QUERY_RETRY_TIMES`
- **Smart retry**: Only retryable errors are retried

### Token Management

On 401 errors:

1. Clear expired tokens from secure storage
2. Redirect to login page
3. User-friendly session expired message

### Using Authentication

```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { isAuthenticated, accessToken, logout, tokenExpiresIn } = useAuth()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div>
      <p>Welcome! Your token expires in {tokenExpiresIn}ms</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Secure Token Storage

The authentication system uses secure token storage:

- **Development**: localStorage (for easier debugging)
- **Production**: Cookies (with secure, httpOnly flags)
- **Automatic fallback**: localStorage if cookies fail
- **JWT Support**: Parse and validate JWT payloads
- **Expiration Tracking**: Check token expiration automatically

```typescript
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  isAuthenticated,
  parseJWT,
  isTokenExpired,
} from '@/lib/auth'

// Get token
const token = getAccessToken()

// Set token with options
setAccessToken(token, {
  expires: 7, // days
  secure: true,
  httpOnly: true,
  sameSite: 'strict',
})

// Check authentication
if (isAuthenticated()) {
  // User is logged in
}

// Parse JWT payload
const payload = parseJWT(token)
console.log(payload.sub, payload.exp)

// Check expiration
if (isTokenExpired(token)) {
  // Token is expired
}
```

### Token Refresh

Use the `useTokenRefresh` hook to manage token refresh:

```typescript
import { useTokenRefresh } from '@/hooks/useAuth'

function App() {
  const { shouldRefresh, refresh } = useTokenRefresh()

  useEffect(() => {
    if (shouldRefresh) {
      refresh()
    }
  }, [shouldRefresh, refresh])
}
```

### Example: Try It Out

Navigate to `/auth-example` to see authentication in action:
- Login form with secure token storage
- Authenticated state display
- Token expiration tracking
- Automatic logout functionality

### Request Tracing

Each request includes a unique `X-Request-ID` header for debugging and tracing.

### Error Utilities

```typescript
import {
  getErrorMessage,
  getFieldErrors,
  isRetryableError,
  isAxiosError,
} from '@/lib/api-error'

// Get user-friendly error message
const message = getErrorMessage(error)

// Extract field errors for forms
const errors = getFieldErrors(error)

// Check if error is retryable
if (isRetryableError(error)) {
  // Retry logic
}

// Check if error is Axios error
if (isAxiosError(error)) {
  // Access axios-specific properties
}
```

### Example: Try the Error Handling

Navigate to `/api-error-example` to see the error handling in action with:
- Form validation with field errors
- Different error type simulations
- Automatic retry behavior
- User-friendly error messages

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

### Environment-Specific Builds

Create environment-specific `.env` files:

```bash
# Development (default)
cp .env.example .env

# Staging
cp .env.example .env.staging
# Update VITE_APP_ENV=staging and URLs

# Production
cp .env.example .env.production
# Update VITE_APP_ENV=production and production URLs
```

Build for specific environments:

```bash
# Development (default)
npm run build

# Staging
npm run build:staging

# Production
npm run build:production
```

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

## Git Configuration

### Line Endings

This project enforces **LF (Line Feed)** line endings across all text files to ensure consistency across different operating systems.

#### Automatic Setup

The repository includes a `.gitattributes` file that automatically handles line endings for all contributors. No manual configuration is required.

#### Manual Configuration (Recommended)

For a better development experience, configure your global Git settings:

```bash
git config --global core.autocrlf input
git config --global core.eol lf
```

**What this does:**
- `core.autocrlf input` - Converts CRLF to LF when committing, keeps LF when checking out
- `core.eol lf` - Uses LF as the default line ending for text files

#### Editor Configuration

**VS Code / Cursor**: Add to your `settings.json`:

```json
{
  "files.eol": "\n"
}
```

**Other editors**: Configure your editor to use LF (`\n`) as the default line ending.

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

## Build Optimization

### Production Build

The Vite configuration includes several optimizations for production:

```bash
# Standard production build
npm run build

# Build with bundle analysis
npm run build:analyze

# Staging build
npm run build:staging

# Explicit production build
npm run build:production
```

### Bundle Analysis

To analyze your bundle size and identify large dependencies:

```bash
npm run build:analyze
```

This will:
- Build the application
- Generate an interactive visualization in `dist/stats.html`
- Show gzip and brotli sizes
- Help identify optimization opportunities

### Chunk Splitting

The application uses automatic chunk splitting for better caching:

- **react-vendor**: React and React Router
- **query-vendor**: TanStack Query, Axios, and state management
- **validation-vendor**: Zod, React Hook Form, resolvers
- **ui-vendor**: UI utilities (clsx, tailwind-merge)
- **vendor**: Other third-party libraries
- **application**: Your application code

### Build Configuration

Key optimizations in `vite.config.ts`:

- **Code Splitting**: Separate vendor and application chunks
- **Tree Shaking**: Remove unused code
- **Minification**: Using Terser for smaller bundle sizes
- **Source Maps**: Only in development mode
- **Asset Optimization**: Automatic asset inlining (<4KB)
- **Target ES2015**: Modern browser support
- **CSS Code Splitting**: Separate CSS chunks
- **Dependency Optimization**: Pre-bundle common dependencies

### Development Server

The dev server includes:
- Hot Module Replacement (HMR)
- API proxy support (via `VITE_API_URL`)
- Fast refresh with SWC compiler
- Source maps for debugging

## Production Build

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## License

MIT
