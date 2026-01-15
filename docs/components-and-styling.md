# Components and Styling

## Component Organization

### UI Components (`src/components/ui/`)

Reusable UI primitives with no business logic.

```
components/ui/
├── button/
│   ├── button.tsx
│   └── index.ts
├── input/
├── select/
├── checkbox/
├── switch/
├── toggle/
├── textarea/
├── alert/
├── badge/
├── card/
├── avatar/
└── index.ts          # Re-exports all
```

### Component Structure

Each UI component follows this pattern:

```typescript
// src/components/ui/button/button.tsx
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

### Barrel Export

```typescript
// src/components/ui/button/index.ts
export { Button } from "./button";
export type { ButtonProps } from "./button";
```

## Styling with Tailwind CSS

### The `cn` Utility

Use the `cn` utility for conditional class names:

```typescript
import { cn } from "@/utils/cn";

// Combines clsx and tailwind-merge
<div className={cn(
  "base-class",
  isActive && "active-class",
  isDisabled && "opacity-50",
  className
)} />
```

### Variant Patterns

Define variants as const objects for type safety:

```typescript
const variants = {
  primary: "bg-blue-500 text-white",
  secondary: "bg-gray-200 text-gray-800",
  danger: "bg-red-500 text-white",
} as const;

type Variant = keyof typeof variants;
```

### Responsive Design

Use Tailwind's responsive prefixes:

```typescript
<div className="
  w-full          // Mobile first
  sm:w-1/2        // Small screens
  md:w-1/3        // Medium screens
  lg:w-1/4        // Large screens
"/>
```

### Dark Mode

The project is dark mode ready using Tailwind's dark variant:

```typescript
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
```

## Layout Components

### MainLayout

```typescript
// src/components/layouts/main-layout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### Using Layouts in Router

```typescript
// src/app/router.tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
    ],
  },
]);
```

## Form Components

### Form Integration Components

Components that integrate with React Hook Form:

```typescript
// src/components/form-input.tsx
import { forwardRef } from "react";
import { Input } from "./ui/input";

interface FormInputProps extends InputProps {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <Input ref={ref} error={error} {...props} />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);
```

### Usage with React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components";

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Email"
        {...register("email")}
        error={errors.email?.message}
      />
    </form>
  );
}
```

## Best Practices

### Do's

- ✅ Use the `cn` utility for conditional classes
- ✅ Define variants as const objects
- ✅ Keep UI components free of business logic
- ✅ Forward refs for form components
- ✅ Export types alongside components

### Don'ts

- ❌ Don't use inline styles
- ❌ Don't put API calls in UI components
- ❌ Don't create overly complex components
- ❌ Don't skip accessibility attributes

## Available Components

| Component | Location | Description |
|-----------|----------|-------------|
| Button | `ui/button` | Action buttons with variants |
| Input | `ui/input` | Text input with validation |
| Select | `ui/select` | Custom dropdown select |
| Checkbox | `ui/checkbox` | Checkbox with label |
| Switch | `ui/switch` | Toggle switch |
| Toggle | `ui/toggle` | Toggle with dual labels |
| Textarea | `ui/textarea` | Multi-line input |
| Alert | `ui/alert` | Notification alerts |
| Badge | `ui/badge` | Status badges |
| Card | `ui/card` | Content cards |
| Avatar | `ui/avatar` | User avatars |
| AvatarGroup | `ui/avatar` | Grouped avatars |

## Related Documentation

- [Project Structure](./project-structure.md)
- [Testing](./testing.md)
