# API Layer

## Overview

The API layer provides a centralized HTTP client with interceptors, error handling, and type-safe error classes.

## Architecture

```
src/lib/
├── api-client.ts     # Axios instance with interceptors
├── api-error.ts      # Custom error classes
└── index.ts          # Barrel export
```

## API Client

### Configuration

```typescript
// src/lib/api-client.ts
import axios from "axios";
import { env } from "@/config/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
});
```

### Request Interceptor

Automatically adds authentication and request tracking:

```typescript
api.interceptors.request.use((config) => {
  // Add auth token
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add request ID for tracing
  config.headers["X-Request-ID"] = generateRequestId();

  return config;
});
```

### Response Interceptor

Transforms errors into typed error classes:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400:
      case 422:
        return Promise.reject(new ValidationError(message, errors));
      case 401:
        clearAuthTokens();
        window.location.href = "/login";
        return Promise.reject(new UnauthorizedError(message));
      case 403:
        return Promise.reject(new ForbiddenError(message));
      case 404:
        return Promise.reject(new NotFoundError(message));
      // ... more cases
    }
  }
);
```

## Usage

### Basic Requests

```typescript
import { api } from "@/lib";

// GET
const { data } = await api.get("/users");

// POST
const { data } = await api.post("/users", { name: "John" });

// PUT
const { data } = await api.put("/users/1", { name: "Jane" });

// DELETE
await api.delete("/users/1");
```

### With TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib";
import { QUERY_KEYS } from "@/config";

// Query
const { data, isLoading, error } = useQuery({
  queryKey: QUERY_KEYS.USERS,
  queryFn: () => api.get("/users").then((res) => res.data),
});

// Mutation
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (data) => api.post("/users", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
  },
});
```

## Error Classes

### Available Error Types

```typescript
import {
  ApiError,           // Base error class
  NetworkError,       // Network/connection errors
  TimeoutError,       // Request timeout
  ValidationError,    // 400, 422 - Invalid data
  UnauthorizedError,  // 401 - Not authenticated
  ForbiddenError,     // 403 - Not authorized
  NotFoundError,      // 404 - Resource not found
  ConflictError,      // 409 - Resource conflict
  RateLimitError,     // 429 - Too many requests
  ServerError,        // 500, 502, 504 - Server errors
  ServiceUnavailableError, // 503 - Service unavailable
} from "@/lib";
```

### Error Handling

```typescript
import { getErrorMessage, getFieldErrors, isRetryableError } from "@/lib";

try {
  await api.post("/users", data);
} catch (error) {
  // Get user-friendly message
  const message = getErrorMessage(error);

  // Get field-level errors (for forms)
  const fieldErrors = getFieldErrors(error);

  // Check if should retry
  if (isRetryableError(error)) {
    // Retry logic
  }
}
```

### useApiError Hook

```typescript
import { useApiError } from "@/hooks";

function MyComponent() {
  const {
    error,
    fieldErrors,
    isError,
    clearError,
    handleApiError,
    getFieldError,
  } = useApiError();

  const handleSubmit = async (data) => {
    try {
      await api.post("/endpoint", data);
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <form>
      {isError && <Alert variant="error">{error?.message}</Alert>}

      <Input error={getFieldError("email")} />
    </form>
  );
}
```

## Error Handling Matrix

| Error Type | Status | Retryable | Action |
|------------|--------|-----------|--------|
| NetworkError | - | ✓ | Retry with backoff |
| TimeoutError | 408 | ✓ | Retry with backoff |
| ValidationError | 400, 422 | ✗ | Show field errors |
| UnauthorizedError | 401 | ✗ | Clear token, redirect |
| ForbiddenError | 403 | ✗ | Show access denied |
| NotFoundError | 404 | ✗ | Show not found |
| ConflictError | 409 | ✗ | Show conflict message |
| RateLimitError | 429 | ✓ | Retry after delay |
| ServerError | 5xx | ✓ | Retry with backoff |

## Retry Logic

TanStack Query is configured with smart retry:

```typescript
// src/app/provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount >= env.queryRetryTimes) return false;
        return isRetryableError(error);
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
        const jitter = Math.random() * 1000;
        return delay + jitter;
      },
    },
  },
});
```

## Request Tracing

Each request includes a unique `X-Request-ID` header:

```typescript
function generateRequestId(): string {
  return crypto.randomUUID();
}
```

Use this ID for debugging and correlating logs.

## Best Practices

### Do's

- ✅ Use the centralized `api` client
- ✅ Handle errors with `useApiError` hook
- ✅ Use query keys from constants
- ✅ Invalidate queries after mutations
- ✅ Show user-friendly error messages

### Don'ts

- ❌ Don't create new Axios instances
- ❌ Don't catch errors without handling
- ❌ Don't hardcode API URLs
- ❌ Don't skip error boundaries

## Related Documentation

- [State Management](./state-management.md)
- [Error Handling](./error-handling.md)
