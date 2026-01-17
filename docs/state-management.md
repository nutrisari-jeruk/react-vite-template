# State Management

## Overview

This application uses a combination of state management approaches based on the type of state:

| State Type | Solution |
|------------|----------|
| Server State | TanStack Query |
| URL State | React Router |
| Form State | React Hook Form |
| UI State | React useState/useReducer |
| Global UI State | React Context (if needed) |

## Server State with TanStack Query

### Setup

```typescript
// src/app/provider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: env.queryCacheTime,
      gcTime: env.queryCacheTime * 2,
      retry: (failureCount, error) => {
        if (failureCount >= env.queryRetryTimes) return false;
        return isRetryableError(error);
      },
    },
  },
});

export function AppProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Query Keys

Define query keys in constants for consistency:

```typescript
// src/config/constants.ts
export const QUERY_KEYS = {
  USERS: ["users"],
  USER: (id: string) => ["users", id],
  POSTS: ["posts"],
  POST: (id: string) => ["posts", id],
} as const;
```

### Queries

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib";
import { QUERY_KEYS } from "@/config";

// List query
function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: () => api.get("/users").then((res) => res.data),
  });
}

// Detail query
function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.USER(id),
    queryFn: () => api.get(`/users/${id}`).then((res) => res.data),
    enabled: !!id, // Only fetch when id exists
  });
}
```

### Mutations

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib";
import { QUERY_KEYS } from "@/config";

function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => api.post("/users", data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      api.put(`/users/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}
```

### Optimistic Updates

```typescript
function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/users/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.USER(id) });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(QUERY_KEYS.USER(id));

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.USER(id), (old) => ({
        ...old,
        ...data,
      }));

      return { previousUser };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      queryClient.setQueryData(QUERY_KEYS.USER(id), context?.previousUser);
    },
    onSettled: (_, __, { id }) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(id) });
    },
  });
}
```

## URL State with React Router

### Reading URL State

```typescript
import { useParams, useSearchParams } from "react-router-dom";

function UserPage() {
  // Path params: /users/:id
  const { id } = useParams();

  // Query params: /users?page=1&sort=name
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "name";

  return <div>...</div>;
}
```

### Updating URL State

```typescript
function UserList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(page));
      return prev;
    });
  };

  const handleSort = (sort: string) => {
    setSearchParams((prev) => {
      prev.set("sort", sort);
      return prev;
    });
  };
}
```

## Form State with React Hook Form

### Basic Setup

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submit
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

### With API Errors

```typescript
import { useApiError } from "@/hooks";

function LoginForm() {
  const { handleApiError, getFieldError } = useApiError();
  const { register, handleSubmit, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/login", data);
    } catch (err) {
      handleApiError(err);

      // Set field-level errors from API
      const fieldErrors = getFieldErrors(err);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as keyof FormData, { message });
        });
      }
    }
  };
}
```

## Local UI State

### useState for Simple State

```typescript
function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Modal content</div>}
    </>
  );
}
```

### useReducer for Complex State

```typescript
type State = {
  items: Item[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Item[] }
  | { type: "FETCH_ERROR"; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, items: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
```

## Custom Hooks

### useLocalStorage

Persist state to localStorage:

```typescript
import { useLocalStorage } from "@/hooks";

function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
```

## Best Practices

### Do's

- ✅ Use TanStack Query for server state
- ✅ Use URL for shareable/bookmarkable state
- ✅ Use React Hook Form for forms
- ✅ Colocate state with components that use it
- ✅ Use query keys from constants

### Don'ts

- ❌ Don't use global state for server data
- ❌ Don't store derived state
- ❌ Don't duplicate state
- ❌ Don't use Context for frequently changing data

## Related Documentation

- [API Layer](./api-layer.md)
- [Error Handling](./error-handling.md)
