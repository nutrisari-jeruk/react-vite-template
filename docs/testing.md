# Testing

## Overview

The application uses Vitest with React Testing Library for testing.

| Tool | Purpose |
|------|---------|
| Vitest | Test runner |
| React Testing Library | Component testing |
| @testing-library/user-event | User interaction simulation |
| @testing-library/jest-dom | DOM matchers |

## Setup

### Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/testing/setup.ts",
  },
});
```

### Test Setup

```typescript
// src/testing/setup.ts
import "@testing-library/jest-dom";
```

## Test Utilities

### Custom Render

Use the custom render that includes providers:

```typescript
// src/testing/test-utils.tsx
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AllTheProviders({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
```

### Usage

```typescript
// Import from testing utilities instead of @testing-library/react
import { render, screen } from "@/testing";

test("renders component", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

## Test Structure

### File Location

Tests are co-located with source files:

```
src/
├── components/
│   ├── __tests__/
│   │   ├── button.test.tsx
│   │   └── input.test.tsx
│   └── ui/
│       └── button/
│           └── button.tsx
├── pages/
│   ├── __tests__/
│   │   ├── home.test.tsx
│   │   └── about.test.tsx
│   └── home.tsx
```

### Naming Convention

- Test files: `[component].test.tsx`
- Test descriptions: Describe behavior, not implementation

## Writing Tests

### Component Tests

```typescript
import { render, screen } from "@/testing";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant styles", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-500");
  });

  it("disables when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Form Tests

```typescript
import { render, screen, waitFor } from "@/testing";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./contact-form";

describe("ContactForm", () => {
  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("submits valid data", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        message: "Hello world",
      });
    });
  });
});
```

### Hook Tests

```typescript
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial value", () => {
    const { result } = renderHook(() =>
      useLocalStorage("key", "initial")
    );
    expect(result.current[0]).toBe("initial");
  });

  it("persists value to localStorage", () => {
    const { result } = renderHook(() =>
      useLocalStorage("key", "initial")
    );

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(localStorage.getItem("key")).toBe('"updated"');
  });
});
```

### Async Tests

```typescript
import { render, screen, waitFor } from "@/testing";
import { UserList } from "./user-list";
import { api } from "@/lib";

vi.mock("@/lib", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("UserList", () => {
  it("displays loading state", () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<UserList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays users when loaded", async () => {
    api.get.mockResolvedValue({
      data: [{ id: 1, name: "John" }],
    });

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });

  it("displays error when request fails", async () => {
    api.get.mockRejectedValue(new Error("Network error"));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

## Test Coverage

### What to Test

| Priority | Area | Examples |
|----------|------|----------|
| 1 | **Critical paths** | Login, checkout, form submissions |
| 2 | **Complex logic** | State machines, data transformations, calculations |
| 3 | **Error handling** | Network failures, validation, edge cases |
| 4 | **Accessibility** | ARIA labels, keyboard nav, focus management |
| 5 | **User interactions** | Clicks, inputs, gestures, state changes |

### Coverage Checklist

When testing components/pages, verify:

- [ ] **Rendering** - Component renders with props, handles loading/empty states
- [ ] **Accessibility** - Proper ARIA, keyboard navigation works, alt text present
- [ ] **Validation** - Form errors display correctly, required fields enforced
- [ ] **Success flow** - Happy path completes, navigation works, data persists
- [ ] **Error flow** - API failures show user-friendly messages, retry logic works
- [ ] **Interactions** - Buttons/inputs respond correctly, state updates properly

### What NOT to Test

| ❌ Avoid | Reason |
|----------|--------|
| Implementation details (private methods) | Breaks on refactoring |
| Third-party libraries | They have their own tests |
| Static content | Low value, high maintenance |
| Trivial functions | `const double = (n) => n * 2` |
| CSS styles | Use visual regression instead |

## Testing Patterns

### Query by Role

Prefer querying by role (most accessible):

```typescript
// ✅ Good
screen.getByRole("button", { name: /submit/i });
screen.getByRole("textbox", { name: /email/i });
screen.getByRole("heading", { level: 1 });

// ❌ Avoid
screen.getByTestId("submit-button");
screen.getByClassName("btn-primary");
```

### Query Priority

1. `getByRole` - Accessible queries
2. `getByLabelText` - Form fields
3. `getByPlaceholderText` - Inputs
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

### User Events

Use `userEvent` for realistic interactions:

```typescript
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

// ✅ Good - realistic typing
await user.type(input, "hello");

// ❌ Avoid - direct value change
fireEvent.change(input, { target: { value: "hello" } });
```

### Async Assertions

Use `waitFor` for async operations:

```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText("Success")).toBeInTheDocument();
});

// Or findBy queries
const successMessage = await screen.findByText("Success");
expect(successMessage).toBeInTheDocument();
```

## Running Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test -- --watch

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific file
npm run test -- button.test.tsx
```

## Best Practices

### Do's

- ✅ Test behavior, not implementation
- ✅ Use accessible queries
- ✅ Test user interactions
- ✅ Test error states
- ✅ Use custom render with providers

### Don'ts

- ❌ Don't test implementation details
- ❌ Don't test third-party libraries
- ❌ Don't use snapshot tests excessively
- ❌ Don't forget to test edge cases

## Related Documentation

- [Components and Styling](./components-and-styling.md)
- [Error Handling](./error-handling.md)
