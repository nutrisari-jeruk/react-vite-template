# Error Handling

## Overview

The application has a comprehensive error handling strategy:

1. **Error Boundary** - Catches React rendering errors
2. **API Errors** - Typed error classes for HTTP errors
3. **Form Errors** - Field-level validation errors
4. **Global Error Handler** - Centralized error logging

## Error Boundary

### Setup

The Error Boundary wraps the entire application in `main.tsx`:

```typescript
// src/main.tsx
import { ErrorBoundary } from "@/components";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error("Global error:", error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);
```

### Component Usage

Wrap risky components with their own boundary:

```typescript
import { ErrorBoundary } from "@/components";

function Dashboard() {
  return (
    <div>
      <ErrorBoundary fallback={<ChartError />}>
        <Chart data={data} />
      </ErrorBoundary>

      <ErrorBoundary fallback={<TableError />}>
        <DataTable data={data} />
      </ErrorBoundary>
    </div>
  );
}
```

### Custom Fallback

```typescript
function CustomFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <h2 className="text-red-800 font-bold">Something went wrong</h2>
      <p className="text-red-600">{error.message}</p>
      <button onClick={resetError} className="mt-2 btn-primary">
        Try Again
      </button>
    </div>
  );
}

<ErrorBoundary fallback={CustomFallback}>
  <RiskyComponent />
</ErrorBoundary>
```

### HOC Pattern

```typescript
import { withErrorBoundary } from "@/components";

const SafeChart = withErrorBoundary(Chart, {
  fallback: ChartErrorFallback,
  onError: (error) => logError(error),
});
```

## API Error Classes

### Error Hierarchy

```
ApiError (base)
├── NetworkError       # Connection failed
├── TimeoutError       # Request timeout
├── ValidationError    # 400, 422 - Invalid data
├── UnauthorizedError  # 401 - Not authenticated
├── ForbiddenError     # 403 - Not authorized
├── NotFoundError      # 404 - Not found
├── ConflictError      # 409 - Conflict
├── RateLimitError     # 429 - Rate limited
├── ServerError        # 500, 502, 504
└── ServiceUnavailableError # 503
```

### Using Error Classes

```typescript
import {
  ValidationError,
  UnauthorizedError,
  isRetryableError,
} from "@/lib";

try {
  await api.post("/users", data);
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
    const fieldErrors = error.errors;
    // { email: ["Email is required"], password: ["Too short"] }
  }

  if (error instanceof UnauthorizedError) {
    // Redirect to login
    navigate("/login");
  }

  if (isRetryableError(error)) {
    // Can retry this request
  }
}
```

### ValidationError Structure

```typescript
class ValidationError extends ApiError {
  errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, "VALIDATION_ERROR", 422);
    this.errors = errors;
  }
}

// Usage
const error = new ValidationError("Invalid data", {
  email: ["Email is required", "Invalid format"],
  password: ["Must be at least 8 characters"],
});
```

## useApiError Hook

### Basic Usage

```typescript
import { useApiError } from "@/hooks";

function MyForm() {
  const {
    error,         // Current error
    fieldErrors,   // Field-level errors
    isError,       // Boolean flag
    clearError,    // Clear error state
    handleApiError, // Handle error
    getFieldError, // Get specific field error
    isRetryable,   // Check if retryable
  } = useApiError();

  const handleSubmit = async (data) => {
    clearError();
    try {
      await api.post("/submit", data);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isError && (
        <Alert variant="error">{error?.message}</Alert>
      )}

      <Input
        name="email"
        error={getFieldError("email")}
      />

      <Input
        name="password"
        error={getFieldError("password")}
      />
    </form>
  );
}
```

### With React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { useApiError } from "@/hooks";
import { getFieldErrors } from "@/lib";

function RegistrationForm() {
  const { register, handleSubmit, setError, formState } = useForm();
  const { handleApiError, error } = useApiError();

  const onSubmit = async (data) => {
    try {
      await api.post("/register", data);
    } catch (err) {
      handleApiError(err);

      // Set React Hook Form errors from API
      const apiErrors = getFieldErrors(err);
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field, { type: "server", message });
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert variant="error">{error.message}</Alert>}

      <input {...register("email")} />
      {formState.errors.email && (
        <span>{formState.errors.email.message}</span>
      )}
    </form>
  );
}
```

## Error Utilities

### getErrorMessage

Get user-friendly error message:

```typescript
import { getErrorMessage } from "@/lib";

try {
  await api.post("/action");
} catch (error) {
  const message = getErrorMessage(error);
  // "Network error. Please check your connection."
  // "Invalid email address."
  // "Something went wrong. Please try again."
}
```

### getFieldErrors

Extract field errors from API response:

```typescript
import { getFieldErrors } from "@/lib";

try {
  await api.post("/users", data);
} catch (error) {
  const errors = getFieldErrors(error);
  // { email: "Email is required", password: "Too short" }
}
```

### isRetryableError

Check if error can be retried:

```typescript
import { isRetryableError } from "@/lib";

// Retryable: NetworkError, TimeoutError, RateLimitError, ServerError
// Not retryable: ValidationError, UnauthorizedError, ForbiddenError, NotFoundError

if (isRetryableError(error)) {
  // Show retry button
}
```

## Alert Component

Display errors with the Alert component:

```typescript
import { Alert } from "@/components";

function ErrorDisplay({ error }) {
  if (!error) return null;

  return (
    <Alert
      variant="error"
      title="Error"
      dismissible
      onDismiss={() => clearError()}
    >
      {error.message}
    </Alert>
  );
}
```

## Best Practices

### Do's

- ✅ Use Error Boundaries for component errors
- ✅ Use typed error classes for API errors
- ✅ Show user-friendly error messages
- ✅ Log errors for debugging
- ✅ Clear errors when appropriate

### Don'ts

- ❌ Don't swallow errors silently
- ❌ Don't show technical error messages to users
- ❌ Don't retry non-retryable errors
- ❌ Don't forget to handle loading states

## Related Documentation

- [API Layer](./api-layer.md)
- [Components and Styling](./components-and-styling.md)
