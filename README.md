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

# CLI / Templates
npm run cli:build        # Build the frontier-fe CLI
npm run sync:templates   # Sync src/ → packages/cli/templates/
npm run sync:templates:check  # Check templates are in sync (CI)
```

## Project Structure

This project follows the **Bulletproof React** architecture pattern with feature-based modular structure.

```
src/
├── app/             # Application layer (router, providers, routes)
├── components/      # Shared components (ui/, form/, data-table/, layouts/)
├── config/          # Environment variables, constants
├── features/        # Self-contained feature modules
├── hooks/           # Shared custom hooks
├── lib/             # Core utilities (api-client, api-error)
├── testing/         # Test utilities and setup
├── types/           # Shared TypeScript types
├── utils/           # Utility functions
├── main.tsx         # Entry point
└── index.css        # Global styles
```

> **See [docs/project-structure.md](./docs/project-structure.md)** for the full directory tree, naming conventions, and import rules.

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

- `Button` - Multiple variants (primary, secondary, danger, outline variants, link variants), sizes, and loading states
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
- `Spinner` - Loading indicators with 3 variants (spinner, dots, bars) and 5 sizes
- `Progress` - Linear and circular progress indicators with animations
- `Tabs` - Accessible tab panels with controlled/uncontrolled modes
- `Accordion` - Collapsible content sections with animations

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
  useToast, Spinner, Progress, Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionPanel,
  Skeleton, Pagination
} from '@/components/ui'

function MyComponent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  return (
    <Card>
      <Input placeholder="Enter email" />
      <Button variant="primary" size="md">Submit</Button>

      {/* Link-style buttons (for actions, not navigation) */}
      <Button variant="link" onClick={onCancel}>Cancel</Button>
      <Button variant="link-primary" onClick={onDetails}>Learn more</Button>
      <Button variant="link-muted" onClick={onDismiss}>Dismiss</Button>

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

      {/* Spinner - Loading indicator */}
      <Spinner size="md" variant="spinner" label="Loading data..." />
      <Spinner size="lg" variant="dots" />
      <Spinner size="xl" variant="bars" />

      {/* Progress indicators */}
      {/* Linear progress */}
      <Progress value={60} max={100} label="Loading..." showValue />
      {/* Circular progress */}
      <Progress value={75} max={100} variant="circular" size="lg" showValue />

      {/* Tabs */}
      <Tabs defaultValue="tab1" onValueChange={(value) => console.log(value)}>
        <TabsList>
          <TabsTrigger value="tab1">Overview</TabsTrigger>
          <TabsTrigger value="tab2">Details</TabsTrigger>
          <TabsTrigger value="tab3">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <h3>Overview Content</h3>
          <p>This is the overview panel content.</p>
        </TabsContent>
        <TabsContent value="tab2">
          <h3>Details Content</h3>
          <p>This is the details panel content.</p>
        </TabsContent>
        <TabsContent value="tab3">
          <h3>Settings Content</h3>
          <p>This is the settings panel content.</p>
        </TabsContent>
      </Tabs>

      {/* Accordion */}
      <Accordion defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionPanel>
            <p>Content for section 1. This panel expands when you click the trigger.</p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionPanel>
            <p>Content for section 2. Only one panel can be open at a time.</p>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Section 3</AccordionTrigger>
          <AccordionPanel>
            <p>Content for section 3. The panels include smooth animations.</p>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
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

**Spinner Component:**
The `Spinner` component provides loading indicators with multiple variants and sizes. It supports:

- 3 variants: `spinner` (rotating SVG), `dots` (animated pulses), `bars` (animated bars)
- 5 sizes: `xs`, `sm`, `md`, `lg`, `xl`
- Optional accessibility labels
- Respects `prefers-reduced-motion` for accessibility

```typescript
import { Spinner } from '@/components/ui'

// Rotating spinner (default)
<Spinner size="md" variant="spinner" label="Loading..." />

// Animated dots
<Spinner size="lg" variant="dots" />

// Animated bars
<Spinner size="xl" variant="bars" label="Processing data..." />
```

**Progress Component:**
The `Progress` component displays progress indicators with linear and circular variants. It supports:

- Linear progress with size variants (`sm`, `md`, `lg`)
- Circular progress with size variants (`sm`, `md`, `lg`, `xl`)
- Optional labels and percentage display
- Built on @base-ui/react for accessibility
- Smooth animations with motion/react

```typescript
import { Progress } from '@/components/ui'

// Linear progress with label
<Progress value={60} max={100} label="Loading file..." showValue />

// Linear progress (minimal)
<Progress value={30} max={100} size="lg" />

// Circular progress
<Progress value={75} max={100} variant="circular" size="lg" showValue />
```

**Tabs Component:**
The `Tabs` component provides accessible tab panels using @base-ui/react primitives. It supports:

- Controlled and uncontrolled modes
- Animated content transitions with AnimatePresence
- Full keyboard navigation
- Disabled tab states
- Compound API: Tabs, TabsList, TabsTrigger, TabsContent

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'

// Uncontrolled mode
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Overview content</p>
  </TabsContent>
  <TabsContent value="details">
    <p>Details content</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Settings content</p>
  </TabsContent>
</Tabs>

// Controlled mode
function MyTabs() {
  const [value, setValue] = useState('overview')
  return (
    <Tabs value={value} onValueChange={setValue}>
      {/* ... */}
    </Tabs>
  )
}
```

**Accordion Component:**
The `Accordion` component provides collapsible content sections using @base-ui/react primitives. It supports:

- Controlled and uncontrolled modes
- Single or multiple panel expansion modes
- Animated expand/collapse with motion.div
- Chevron rotation on expand
- Compound API: Accordion, AccordionItem, AccordionTrigger, AccordionPanel

```typescript
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from '@/components/ui'

// Uncontrolled mode (default: single panel open at a time)
<Accordion defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionPanel>
      <p>Content for section 1</p>
    </AccordionPanel>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionPanel>
      <p>Content for section 2</p>
    </AccordionPanel>
  </AccordionItem>
</Accordion>

// Controlled mode
function MyAccordion() {
  const [value, setValue] = useState<string | string[] | null>(null)
  return (
    <Accordion value={value} onValueChange={setValue}>
      {/* ... */}
    </Accordion>
  )
}
```

**Button Link Variants vs Link Component:**

The `Button` component with link variants (`link`, `link-primary`, `link-muted`) is for **actions** that look like links, while the `Link` component is for **navigation**:

```typescript
import { Button, Link } from '@/components/ui'

// Navigation - use Link component (renders <a> tag)
<Link to="/about">About page</Link>

// Actions - use Button with link variant (renders <button>)
<Button variant="link" onClick={handleCancel}>Cancel</Button>
<Button variant="link-primary" onClick={handleDelete}>Delete</Button>
<Button variant="link-muted" onClick={handleDismiss}>Dismiss</Button>
```

**Why use Button link variants:**

- Proper semantic HTML (`<button>` for actions, `<a>` for navigation)
- Native `disabled` state (links don't have disabled attribute)
- Correct keyboard behavior (Enter/Space for buttons, Enter only for links)
- Better accessibility with screen readers

All components include:

- ✅ Full TypeScript support with JSDoc documentation
- ✅ ARIA attributes for accessibility
- ✅ Consistent design tokens (Tailwind CSS v4)
- ✅ Composable APIs
- ✅ Validation state support
- ✅ Built on Base UI primitives where applicable
- ✅ Respects `prefers-reduced-motion`
- ✅ Comprehensive test coverage

> **See [docs/components-and-styling.md](./docs/components-and-styling.md)** for component organization, variant patterns, and styling conventions.

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

> **See [docs/state-management.md](./docs/state-management.md)** for queries, mutations, optimistic updates, and URL/form state patterns.

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

The project uses Vitest with React Testing Library for comprehensive component testing.

**Tools:**

- Vitest - Fast test runner with native ESM support
- React Testing Library - DOM testing utilities
- @testing-library/user-event - Realistic user interaction simulation
- @testing-library/jest-dom - Custom DOM matchers

**Test Coverage Areas:**

| Priority | Area              | Examples                                 |
| -------- | ----------------- | ---------------------------------------- |
| 1        | Critical paths    | Login, checkout, form submissions        |
| 2        | Complex logic     | State machines, data transformations     |
| 3        | Error handling    | Network failures, validation, edge cases |
| 4        | Accessibility     | ARIA labels, keyboard navigation         |
| 5        | User interactions | Clicks, inputs, state changes            |

**Coverage Checklist:**

- Rendering with props, loading/empty states
- Accessibility (ARIA, keyboard nav, alt text)
- Form validation and error display
- Success/error API flows
- User interactions and state updates

**Running Tests:**

```bash
npm run test            # Run all tests
npm run test:ui         # Run Vitest UI
npm run test:coverage   # Run with coverage report
```

> **See [docs/testing.md](./docs/testing.md)** for detailed testing patterns and best practices.

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

> **See [docs/linting-and-code-quality.md](./docs/linting-and-code-quality.md)** for ESLint rules, import ordering, and type-aware linting.

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
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib";

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ["users"],
  queryFn: async () => {
    const { data } = await api.get("/users");
    return data;
  },
});

// Mutate data
const mutation = useMutation({
  mutationFn: async (userData) => {
    const { data } = await api.post("/users", userData);
    return data;
  },
  onSuccess: () => {
    // Invalidate cache
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

### Using Axios Directly

```typescript
import { api } from "@/lib";

// GET request
const response = await api.get("/users");

// POST request
const response = await api.post("/users", { name: "John" });

// PUT request
const response = await api.put("/users/1", { name: "Jane" });

// DELETE request
const response = await api.delete("/users/1");
```

> **See [docs/api-layer.md](./docs/api-layer.md)** for the full API client architecture, interceptors, and error classes.

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
} from "@/lib";
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

| Error Type          | Status Code   | Retryable | Action                         |
| ------------------- | ------------- | --------- | ------------------------------ |
| Network Error       | -             | ✓ Yes     | Retry with backoff             |
| Timeout Error       | 408           | ✓ Yes     | Retry with backoff             |
| Validation Error    | 400, 422      | ✗ No      | Show field errors              |
| Unauthorized        | 401           | ✗ No      | Clear token, redirect to login |
| Forbidden           | 403           | ✗ No      | Show access denied message     |
| Not Found           | 404           | ✗ No      | Show 404 message               |
| Conflict            | 409           | ✗ No      | Show conflict message          |
| Rate Limit          | 429           | ✓ Yes     | Retry after delay              |
| Server Error        | 500, 502, 504 | ✓ Yes     | Retry with backoff             |
| Service Unavailable | 503           | ✓ Yes     | Retry with backoff             |

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
} from "@/features/auth";

// Get token
const token = getAccessToken();

// Set token with options
setAccessToken(token, {
  expires: 7, // days
  secure: true,
  httpOnly: true,
  sameSite: "strict",
});

// Check authentication
if (isAuthenticated()) {
  // User is logged in
}

// Parse JWT payload
const payload = parseJWT(token);
console.log(payload.sub, payload.exp);

// Check expiration
if (isTokenExpired(token)) {
  // Token is expired
}
```

### Token Refresh

Use the `useTokenRefresh` hook to manage token refresh:

```typescript
import { useTokenRefresh } from "@/features/auth";

function App() {
  const { shouldRefresh, refresh } = useTokenRefresh();

  useEffect(() => {
    if (shouldRefresh) {
      refresh();
    }
  }, [shouldRefresh, refresh]);
}
```

> **See [docs/security.md](./docs/security.md)** for token storage, XSS/CSRF prevention, input validation, and dependency security.

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
} from "@/lib";

// Get user-friendly error message
const message = getErrorMessage(error);

// Extract field errors for forms
const errors = getFieldErrors(error);

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

### Example: Try Form Validation

Navigate to `/form-validation` to see a comprehensive form validation example with:

- Username validation (length, regex pattern)
- Email validation
- Age validation (number, integer, min/max)
- Password strength validation (uppercase, lowercase, number, special character)
- Password confirmation matching
- Country selection dropdown
- Optional bio field with validation
- Required terms checkbox
- Real-time validation on blur
- User-friendly error messages

> **See [docs/error-handling.md](./docs/error-handling.md)** for error boundary patterns, API error classes, and the useApiError hook.

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
import { withErrorBoundary } from "@/components";

const ProtectedComponent = withErrorBoundary(MyComponent, {
  fallback: CustomErrorFallback,
});
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
import { useLocalStorage } from "@/hooks";

const [value, setValue] = useLocalStorage("key", defaultValue);
```

### useMediaQuery

```typescript
import { useMediaQuery } from "@/hooks";

const isMobile = useMediaQuery("(max-width: 768px)");
const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
```

### useBreakpoint

```typescript
import { useBreakpoint } from "@/hooks";

const {
  isAboveSm,
  isAboveMd,
  isAboveLg,
  isAboveXl,
  isAbove2xl,
  currentBreakpoint,
} = useBreakpoint();
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
import { env, isProduction, isDevelopment } from "@/config";

// Access configuration
console.log(env.apiUrl);
console.log(env.appName);
console.log(env.defaultPageSize);

// Check environment
if (isProduction) {
  // Production-specific code
}

// Check maintenance mode
if (env.maintenanceMode) {
  // Show maintenance message
}
```

> **See [docs/project-configuration.md](./docs/project-configuration.md)** for TypeScript, Vite, ESLint, Prettier, Vitest, and Tailwind configuration details.

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

## frontier-fe CLI

This repo doubles as the source for the `frontier-fe` CLI — a shadcn-style project scaffolder published to npm. It lets you bootstrap a new SOP-compliant project and add components on demand.

```bash
npx frontier-fe init my-app          # Create a new project
npx frontier-fe add button dialog    # Add components
npx frontier-fe add --all --type ui  # Add all items of a type
npx frontier-fe list                 # List available items
```

### Blocks & Sections

Blocks are pre-built page compositions (full layouts) and sections are smaller reusable parts — inspired by shadcn blocks. They compose existing UI components rather than creating new ones.

```bash
# Add a login page block (full page layout variant)
npx frontier-fe add block:login-split      # Split screen with illustration
npx frontier-fe add block:login-centered   # Centered card on gradient
npx frontier-fe add block:login-minimal    # Minimal with branding sidebar

# Add individual sections to compose your own layouts
npx frontier-fe add auth-branding          # Logo + title + subtitle
npx frontier-fe add auth-illustration      # Side illustration with fallback
```

**Available login block variants:**

| Block            | Layout                                          |
| ---------------- | ----------------------------------------------- |
| `login-split`    | Illustration left, form right (blue background) |
| `login-centered` | Centered card on gradient background            |
| `login-minimal`  | Branding sidebar left, form right               |

**Available auth sections:**

| Section             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `auth-branding`     | Title + subtitle display                   |
| `auth-illustration` | Side illustration with `ImageWithFallback` |

Blocks use only existing components (`LoginForm`, `AuthBranding`, `ImageWithFallback`) — no inline UI. You can also install sections independently and compose your own page layouts.

> **See [docs/cli-development.md](./docs/cli-development.md)** for the full CLI reference: commands, registry format, route wiring, sync workflow, and npm publishing.

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
2. Create component file `[Name].tsx` (PascalCase)
3. Export component as PascalCase: `export function ComponentName() {}`
4. Create barrel export `index.ts`
5. Export from `src/components/ui/index.ts`
6. Add co-located test `[Name].test.tsx`

**Example:**

```typescript
// src/components/ui/my-component/MyComponent.tsx
export interface MyComponentProps {
  variant?: 'primary' | 'secondary'
}

export function MyComponent({ variant = 'primary' }: MyComponentProps) {
  return <div className={variant}>Content</div>
}

// src/components/ui/my-component/index.ts
export { MyComponent } from './MyComponent'

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

> **For detailed conventions:** See [CLAUDE.md](./CLAUDE.md) for AI assistants or [docs/project-structure.md](./docs/project-structure.md) for naming conventions and import rules.

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
