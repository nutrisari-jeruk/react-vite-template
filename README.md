# React Frontend Template

A production-ready React frontend template built with modern tools and best practices.

## Tech Stack

- **React 19** with TypeScript - UI library
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **TanStack Query v5** - Data fetching and state management
- **Axios** - HTTP client
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful icon library
- **Vitest** - Testing framework
- **Husky** - Git hooks
- **Lint-staged** - Run linters on staged files
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Animation Approach

This project uses a **hybrid animation strategy** for optimal performance:

- **CSS animations** for simple, declarative animations:
  - CSS keyframes for entrance animations (defined in `index.css`)
  - Tailwind's built-in animations (e.g., `animate-spin`, `animate-pulse`)
  - Custom animation utilities using Tailwind's `animate-[...]` syntax
- **motion/react** (formerly framer-motion) for JavaScript-driven animations:
  - Complex animations requiring JavaScript logic
  - Scroll-triggered animations
  - Interactive animations with state management
  - Respects `prefers-reduced-motion` for accessibility

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

This project follows the **Bulletproof React** architecture pattern:

```
src/
├── app/                  # Application layer
│   ├── index.tsx        # Main App component
│   ├── provider.tsx     # Centralized providers (QueryClient, etc.)
│   ├── router.tsx       # Route configuration with lazy loading
│   └── routes/          # Route components (PascalCase files)
│       ├── Home.tsx
│       ├── About.tsx
│       ├── Components.tsx
│       ├── not-found.tsx
│       └── examples/    # Example pages
│           ├── auth.tsx
│           ├── data-table.tsx
│           ├── error-handling.tsx
│           └── form-validation.tsx
├── components/           # Shared components
│   ├── ui/              # UI primitives (lowercase folders, PascalCase exports)
│   │   ├── alert/       # Alert component with animations
│   │   ├── avatar/      # Avatar and AvatarGroup
│   │   ├── badge/       # Badge component with Tailwind UI styling
│   │   ├── button/      # Button with variants and sizes
│   │   ├── card/        # Card container
│   │   ├── checkbox/    # Checkbox input
│   │   ├── combobox/    # Searchable dropdown with Base UI
│   │   ├── dialog/      # Modal dialog with animations
│   │   ├── dropdown-menu/ # Dropdown menu with Base UI
│   │   ├── input/       # Text input with validation
│   │   ├── pagination/  # Pagination component
│   │   ├── select/      # Select dropdown with Base UI
│   │   ├── skeleton/    # Loading placeholders
│   │   ├── switch/      # Segmented control switch
│   │   ├── table/       # Table components (Table, TableHeader, TableBody, etc.)
│   │   ├── textarea/    # Multi-line text input
│   │   ├── toast/       # Global notification system
│   │   ├── toggle/      # Toggle button
│   │   └── tooltip/     # Tooltip component with variants and placements
│   ├── form/            # React Hook Form integration components
│   ├── data-table/      # Server-side data table with row selection
│   ├── layouts/         # Layout components (MainLayout, Navbar, Sidebar)
│   ├── __tests__/       # Component tests
│   └── *.tsx            # Shared components (ErrorBoundary, etc.)
├── config/              # Configuration
│   ├── env.ts           # Environment variables (validated)
│   ├── constants.ts     # Routes, API endpoints, query keys
│   └── index.ts         # Barrel export
├── features/            # Feature modules (self-contained)
│   └── auth/            # Authentication feature
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       ├── lib/         # Feature utilities
│       ├── types/       # Feature types
│       └── index.ts     # Public API
├── hooks/               # Shared custom hooks
│   ├── use-media-query.ts   # Media query hook (SSR-safe)
│   ├── use-breakpoint.ts    # Tailwind breakpoint hook
│   ├── __tests__/           # Hook tests
│   └── index.ts             # Barrel export
├── lib/                 # Core utilities
│   ├── api-client.ts    # Axios instance with interceptors
│   ├── api-error.ts     # Custom error classes
│   └── index.ts         # Barrel export
├── testing/             # Test utilities
│   ├── setup.ts         # Test configuration
│   ├── test-utils.tsx   # Custom render with providers
│   └── mocks/           # MSW handlers (future)
├── types/               # Shared TypeScript types
├── utils/               # Utility functions
├── main.tsx             # Entry point
└── index.css            # Global styles + Tailwind directives + custom animations
```

> **Note:** UI components use lowercase folder/file names (e.g., `button/button.tsx`) but export PascalCase component names (`export function Button() {}`). This is a common pattern that avoids case-sensitivity issues while maintaining React conventions.

> **For AI Assistants:** See [AGENTS.md](./AGENTS.md) for detailed conventions and guidelines.

## Key Features

### UI Components

The project includes a comprehensive set of **custom-built UI components** with TypeScript support, accessibility features, and consistent styling:

**Form Components:**
- `Input` - Text input with icons, validation states, and error handling
- `Textarea` - Multi-line text input with auto-resize support
- `Select` - Dropdown select with custom styling (Base UI powered)
- `Combobox` - Searchable dropdown with type-ahead filtering
- `Checkbox` - Accessible checkbox input
- `Switch` - Segmented control switch for choosing between two options (e.g., Light/Dark mode)
- `Toggle` - Toggle switch for boolean values
- `Form` - React Hook Form integration components (Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription)

**Display Components:**
- `Button` - Multiple variants (primary, secondary, ghost, danger), sizes, and loading states
- `Card` - Container component with header, body, and footer slots
- `Badge` - Status badges and labels with Tailwind UI styling
- `Avatar` - User avatars with fallback and group support
- `Table` - Table components (Table, TableHeader, TableBody, TableRow, TableCell, etc.)
- `DataTable` - Full-featured data table with server-side capabilities, row selection, and stable keys
- `Skeleton` - Loading placeholders with pulse and wave animations

**Feedback Components:**
- `Alert` - Dismissible alerts with floating positions and animations
- `Tooltip` - Contextual tooltips with dark and light variants, multiple placements
- `Toast` - Global notification system with multiple variants and positions

**Overlay Components:**
- `Dialog` - Accessible modal dialogs with animations and multiple sizes
- `DropdownMenu` - Accessible dropdown menus with items, checkbox items, and radio groups

**Navigation Components:**
- `Pagination` - Standalone pagination with intelligent page generation

**Usage:**
```typescript
import { 
  Button, Input, Card, Alert, Switch, Toggle, Tooltip,
  Dialog, DialogTrigger, DialogContent, DialogFooter,
  useToast, Skeleton, Pagination
} from '@/components/ui'

function MyComponent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  
  return (
    <Card>
      <Input placeholder="Enter email" />
      <Button variant="primary" size="md">Submit</Button>
      
      {/* Dialog/Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger><Button>Open Dialog</Button></DialogTrigger>
        <DialogContent title="Confirmation" size="md">
          <p>Are you sure you want to proceed?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="primary">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Toast Notification */}
      <Button onClick={() => toast({
        title: 'Success!',
        message: 'Your action was completed',
        variant: 'success'
      })}>
        Show Toast
      </Button>
      
      {/* Loading Skeleton */}
      <Skeleton className="h-20 w-full" variant="rectangular" />
      
      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={(page) => console.log(page)}
      />
      
      {/* Segmented control switch */}
      <Switch
        label="Theme"
        leftLabel="Light"
        rightLabel="Dark"
        leftIcon={<SunIcon />}
        rightIcon={<MoonIcon />}
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />

      {/* Toggle switch */}
      <Toggle label="Enable notifications" />

      {/* Tooltip */}
      <Tooltip content="This is a helpful tooltip" variant="dark" placement="top">
        <Button variant="secondary">Hover me</Button>
      </Tooltip>

      <Alert variant="info" dismissible>
        Information message
      </Alert>
    </Card>
  )
}
```

**Switch Component (Segmented Control):**
The `Switch` component is a segmented control for choosing between two options. It supports:
- Labels with or without icons
- Icons only
- Controlled and uncontrolled modes
- Disabled state
- Accessible with Base UI primitives

**Toggle Component:**
The `Toggle` component is a traditional toggle switch for boolean values.

**Tooltip Component:**
The `Tooltip` component provides contextual information on hover or focus. It supports:
- Two variants: `dark` (dark background with white text) and `light` (white background with dark text)
- Four placements: `top`, `bottom`, `left`, `right`
- Customizable offset and styling
- Disabled state
- Accessible with Base UI primitives

**Usage:**
```typescript
import { Tooltip } from '@/components/ui'

// Basic usage
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>

// With variant and placement
<Tooltip
  content="Helpful information"
  variant="light"
  placement="bottom"
  sideOffset={12}
>
  <span className="text-blue-600 underline">Learn more</span>
</Tooltip>

// Disabled tooltip
<Tooltip content="This won't show" disabled>
  <Button disabled>Disabled</Button>
</Tooltip>
```

All components include:
- ✅ Full TypeScript support with JSDoc documentation
- ✅ ARIA attributes for accessibility
- ✅ Consistent design tokens (Tailwind CSS v4)
- ✅ Composable APIs
- ✅ Validation state support
- ✅ Built on Base UI primitives where applicable
- ✅ Respects `prefers-reduced-motion`
- ✅ Comprehensive test coverage

### DataTable Component

The `DataTable` component provides a full-featured data table with server-side pagination, sorting, filtering, and row selection capabilities.

**Features:**
- Server-side pagination with customizable page sizes (10, 25, 50, 100)
- Server-side sorting with visual indicators
- Real-time filtering/search
- Row selection (single or multi-select)
- Stable row keys with `getRowId` prop
- Loading, error, and empty states
- TanStack Query integration
- Tailwind UI styling
- Fully responsive design
- Custom cell rendering (Badges, Avatars, etc.)

**Usage:**
```typescript
import { DataTable, type Column } from '@/components/data-table'
import { Badge } from '@/components/ui/badge/badge'

interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'User' | 'Editor'
  status: 'Active' | 'Inactive'
}

const columns: Column<User>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    sortable: true,
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
    sortable: true,
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    sortable: true,
    cell: (row) => (
      <Badge variant={row.role === 'Admin' ? 'danger' : 'primary'} pill>
        {row.role}
      </Badge>
    ),
  },
]

function MyTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState({})
  const [filter, setFilter] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', pagination, sorting, filter],
    queryFn: () => fetchUsers({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      columnId: sorting.columnId,
      direction: sorting.direction,
      filter,
    }),
  })

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pagination
      paginationState={pagination}
      pageCount={data?.pageCount || 0}
      onPaginationChange={setPagination}
      pageSizeOptions={[10, 25, 50, 100]}
      sorting
      sortingState={sorting}
      onSortingChange={setSorting}
      filtering
      filterValue={filter}
      onFilterChange={setFilter}
      isLoading={isLoading}
      error={error ? 'Failed to load data' : null}
      emptyMessage="No users found"
    />
  )
}
```

**Props:**
- `data` - Array of data to display
- `columns` - Column definitions (id, header, accessorKey, cell, sortable)
- `pagination` - Enable pagination (default: true)
- `paginationState` - Current pagination state (pageIndex, pageSize)
- `pageCount` - Total number of pages
- `onPaginationChange` - Pagination change handler
- `pageSizeOptions` - Available page sizes (default: [10, 25, 50, 100])
- `sorting` - Enable sorting (default: true)
- `sortingState` - Current sorting state (columnId, direction)
- `onSortingChange` - Sorting change handler
- `filtering` - Enable filtering (default: true)
- `filterValue` - Current filter value
- `onFilterChange` - Filter change handler
- `getRowId` - Function to extract stable row ID (recommended for row selection)
- `enableRowSelection` - Enable row selection checkboxes
- `selectedRows` - Set of selected row IDs
- `onRowSelectionChange` - Row selection change handler
- `isLoading` - Loading state
- `error` - Error message
- `emptyMessage` - Message when no data

**Example:**
Navigate to `/examples/data-table` to see a fully functional example with:
- 150 mock users
- Server-side pagination
- Sortable columns
- Real-time search
- Custom badge components
- Loading and error states

**Note:** TanStack Table is NOT required for server-side functionality. This custom implementation provides all the essential features while maintaining simplicity and bundle size efficiency.

### React Router
- Client-side routing with clean URLs
- Lazy loading for all route components
- Nested routes support
- Active link highlighting in navigation
- Dropdown menu for example pages

**Available Routes:**
- `/` - Home page
- `/about` - About page
- `/components` - UI components showcase with sticky table of contents, scroll tracking, and alphabetical organization
- `/examples/auth` - Authentication examples
- `/examples/error-handling` - Error handling examples
- `/examples/form-validation` - Form validation examples
- `/examples/data-table` - Server-side data table example
- `*` - Custom 404 page

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
- Uses `h-dvh` instead of `h-screen` for proper viewport handling
- Typography utilities: `text-balance` for headings, `text-pretty` for body
- Tabular nums for data display
- Safe area inset support for iOS devices

### Testing
- Vitest for fast tests
- React Testing Library
- User event simulation
- Coverage reporting

### Accessibility
- ARIA attributes throughout all UI components
- Keyboard navigation support for interactive elements
- Screen reader-friendly labels and roles
- Focus management in modals and dropdowns
- Proper heading hierarchy
- Loading states with `aria-busy`
- Error states with `aria-invalid`
- Icon-only buttons include `aria-label`

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
import { api } from '@/lib'

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
import { api } from '@/lib'

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
} from '@/lib'
```

### Using useApiError Hook

```typescript
import { useApiError } from '@/hooks'

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
import { useAuth } from '@/features/auth'

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
  clearAuthTokens,
  parseJWT,
  isTokenExpired,
} from '@/features/auth'

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
import { useTokenRefresh } from '@/features/auth'

function App() {
  const { shouldRefresh, refresh } = useTokenRefresh()

  useEffect(() => {
    if (shouldRefresh) {
      refresh()
    }
  }, [shouldRefresh, refresh])
}
```

### Dialog Component

The `Dialog` component provides accessible modal dialogs with animations:

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from '@/components/ui'

function MyDialog() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent 
        title="Confirm Action" 
        description="This action cannot be undone"
        size="md"
      >
        <p>Are you sure you want to proceed?</p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

**Features:**
- Built on Base UI for accessibility
- Multiple sizes (sm, md, lg, xl, full)
- Animated entry/exit with Framer Motion
- Respects `prefers-reduced-motion`
- Optional close button and footer

### Toast Notification System

The `Toast` component provides a global notification system:

```typescript
import { ToastProvider, useToast } from '@/components/ui'

// Wrap your app with ToastProvider
function App() {
  return (
    <ToastProvider>
      <MyComponent />
    </ToastProvider>
  )
}

// Use in components
function MyComponent() {
  const { toast } = useToast()
  
  const handleSuccess = () => {
    toast({
      title: 'Success!',
      message: 'Your changes have been saved',
      variant: 'success',
      duration: 3000
    })
  }
  
  return <Button onClick={handleSuccess}>Save</Button>
}
```

**Features:**
- Four variants (info, success, warning, error)
- Auto-dismiss with configurable duration
- Multiple positions (top/bottom, left/center/right)
- Stack management with max toast limit
- Dismissible notifications

### Form Integration Components

React Hook Form integration components for seamless form handling:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/form'
import { Input } from '@/components/ui'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ characters')
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  })
  
  return (
    <Form form={form} onSubmit={(data) => console.log(data)}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormDescription>We'll never share your email</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </Form>
  )
}
```

**Features:**
- Proper label-input association
- Automatic error display
- Field-level descriptions
- useFormField hook for context access

### Responsive Hooks

Custom hooks for responsive design:

```typescript
import { useMediaQuery, useBreakpoint } from '@/hooks'

function MyComponent() {
  // Media query hook
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Tailwind breakpoint hook
  const { isAboveMd, isAboveLg, currentBreakpoint } = useBreakpoint()
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
      {currentBreakpoint} {/* 'sm', 'md', 'lg', 'xl', '2xl' */}
    </div>
  )
}
```

**Features:**
- SSR-safe implementations
- Proper cleanup on unmount
- Tailwind breakpoint detection
- Custom media query support

### Example: Try It Out

Navigate to `/examples/auth` to see authentication in action:
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
} from '@/lib'

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

Navigate to `/examples/error-handling` to see the error handling in action with:
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
import { ErrorBoundary } from '@/components'

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
import { withErrorBoundary } from '@/components'

const ProtectedComponent = withErrorBoundary(MyComponent, {
  fallback: CustomErrorFallback,
})
```

#### Testing the Error Boundary

The Error Boundary is already integrated into the application. To test it, you can:

1. Navigate to any page and intentionally throw an error in a component
2. Add a test button that triggers an error:
```typescript
<button onClick={() => { throw new Error('Test error') }}>
  Trigger Error
</button>
```
3. The Error Boundary will catch it and display the fallback UI

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
import { useLocalStorage } from '@/hooks'

const [value, setValue] = useLocalStorage('key', defaultValue)
```

### useMediaQuery

```typescript
import { useMediaQuery } from '@/hooks'

const isMobile = useMediaQuery('(max-width: 768px)')
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
```

### useBreakpoint

```typescript
import { useBreakpoint } from '@/hooks'

const { 
  isAboveSm, isAboveMd, isAboveLg, isAboveXl, isAbove2xl,
  currentBreakpoint 
} = useBreakpoint()
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

The project includes a type-safe environment configuration system at `src/config/env.ts` that:

- Validates all required environment variables at startup
- Provides type-safe access via `env` object
- Validates URLs, numbers, and booleans
- Falls back to sensible defaults when appropriate
- Shows helpful error messages in development

### Usage

```typescript
import { env, isProduction, isDevelopment } from '@/config'

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

1. Create page component in `src/app/routes/` (PascalCase, e.g., `MyPage.tsx`)
2. Use default export for lazy loading compatibility
3. Add route in `src/app/router.tsx` with lazy loading
4. Add route constant in `src/config/constants.ts`
5. Update navigation in `src/components/layouts/navbar.tsx` or `sidebar.tsx`

**Example:**
```typescript
// src/app/routes/MyPage.tsx
export default function MyPage() {
  return <div>My Page</div>
}

// src/app/router.tsx
const MyPage = lazy(() => import("@/app/routes/MyPage"))

// Add to routes array
{
  path: "my-page",
  element: <LazyPage><MyPage /></LazyPage>,
}
```

### Creating a UI Component

1. Create folder `src/components/ui/[name]/` (lowercase)
2. Create component file `[name].tsx` (lowercase)
3. Export component as PascalCase: `export function ComponentName() {}`
4. Create barrel export `index.ts`
5. Export from `src/components/ui/index.ts`
6. Create tests in `src/components/__tests__/`

**Example:**
```typescript
// src/components/ui/my-component/my-component.tsx
export interface MyComponentProps {
  variant?: 'primary' | 'secondary'
}

export function MyComponent({ variant = 'primary' }: MyComponentProps) {
  return <div className={variant}>Content</div>
}

// src/components/ui/my-component/index.ts
export { MyComponent } from './my-component'

// src/components/ui/index.ts
export { MyComponent } from "./my-component"
```

### Creating a Feature Module

1. Create folder `src/features/[name]/`
2. Add subfolders: `components/`, `hooks/`, `lib/`, `types/`
3. Create public API in `index.ts`
4. Only export what's needed publicly

### API Integration

1. Use the API client from `@/lib`
2. Use TanStack Query hooks for data fetching
3. Define query keys in `src/config/constants.ts`
4. Type your API responses in `src/types/`

> **For detailed conventions:** See [AGENTS.md](./AGENTS.md)

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
