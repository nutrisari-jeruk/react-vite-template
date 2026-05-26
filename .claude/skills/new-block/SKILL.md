---
name: new-block
description: 'Scaffolds complete page blocks (Login, Register, Dashboard, DataTable, Form, etc.) with router wiring, route constants, metadata, and navbar integration. Also registers the block in the CLI registry so users can install it via `frontier-fe add block:<name>`. Use when the user says "create a block", "add a block", "/new-block", or wants a pre-built page composition using existing components.'
disable-model-invocation: true
---

# New Block

Scaffold complete, production-ready page blocks. Like shadcn/ui blocks, these are opinionated compositions — real components, real styling, real wiring — ready to customize.

## Usage

```
/new-block login --path /login
/new-block dashboard --path /dashboard
/new-block data-table --path /users
```

## Available Blocks

| Block             | Description                                       | Depends on                             |
| ----------------- | ------------------------------------------------- | -------------------------------------- |
| `login`           | SSO login page with illustration + LoginForm      | `auth` feature                         |
| `register`        | Registration page with card layout + RegisterForm | `auth` feature                         |
| `dashboard`       | Protected dashboard with auth status display      | `auth` feature, `authenticated-layout` |
| `forgot-password` | Password reset request form                       | `auth` feature                         |
| `reset-password`  | New password form after reset link                | `auth` feature                         |
| `otp`             | OTP code verification page                        | `auth` feature                         |
| `data-table`      | Full server-side data table with TanStack Query   | `data-table` component                 |
| `form`            | Generic form page with Zod + React Hook Form      | `form` component                       |
| `error`           | Custom 404/error page                             | none                                   |
| `landing`         | Hero + features + CTA landing sections            | `button` component                     |

## Required Parameters

| Param     | Example                  | Notes                                   |
| --------- | ------------------------ | --------------------------------------- |
| **Block** | `login`                  | Block type from the list above          |
| **Path**  | `/login` or `/app/users` | URL path (defaults to block convention) |

Default paths if not specified:

- `login` → `/login`
- `register` → `/register`
- `dashboard` → `/dashboard`
- `forgot-password` → `/forget-password`
- `reset-password` → `/reset-password`
- `otp` → `/otp`
- `data-table` → asks user for resource name
- `form` → asks user for form name
- `error` → `*` (catch-all)
- `landing` → `/`

## Block Templates

### login

A full SSO-style login page with illustration and login form. Uses `LoginForm` from the auth feature.

```tsx
import { LoginForm } from "@/features/auth/components";
import { ImageWithFallback } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-blue-600 p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
        <div className="flex flex-col lg:flex-row">
          <div className="relative hidden lg:block lg:w-1/2">
            <ImageWithFallback
              src="/login.svg"
              alt="Login illustration"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-12 lg:py-16">
            <div className="mb-8 text-center">
              <h1 className="text-xl font-bold text-balance text-gray-900 sm:text-2xl">
                Single Sign-On (SSO)
              </h1>
              <p className="mt-1 text-lg font-semibold text-pretty text-gray-900 sm:text-xl">
                App Name
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Route layout:** `none` (standalone page, no layout wrapper)

**Router:**

```tsx
{
  path: "/login",
  element: (
    <>
      <MetadataUpdater />
      <LazyPage>
        <LoginPage />
      </LazyPage>
    </>
  ),
},
```

### register

Registration page with card layout using `RegisterForm` from the auth feature. Wraps with `AuthLayout`.

```tsx
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui";
import { RegisterForm } from "@/features/auth/components";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Get started with your free account today
        </p>
      </div>
      <RegisterForm onSuccess={() => navigate("/dashboard")} />
    </Card>
  );
}
```

**Route layout:** `auth` (AuthLayout wrapper)

### dashboard

Protected dashboard page showing auth status. Uses `useAuth` hook and `AuthenticatedLayout`.

```tsx
import { useAuth } from "@/features/auth";

export default function DashboardPage() {
  const { isAuthenticated, accessToken, tokenExpiresIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your protected dashboard.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Authentication Status
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Authenticated:</dt>
            <dd className="font-medium text-gray-900 dark:text-white">
              {isAuthenticated ? "Yes" : "No"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Access Token:</dt>
            <dd className="max-w-xs truncate font-mono text-xs text-gray-900 dark:text-white">
              {accessToken || "None"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Expires In:</dt>
            <dd className="font-medium text-gray-900 dark:text-white">
              {tokenExpiresIn !== null
                ? `${Math.floor(tokenExpiresIn / 1000)}s`
                : "N/A"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-gray-500 dark:text-gray-400">
          Dashboard content placeholder. Add your widgets, charts, or data
          tables here.
        </p>
      </div>
    </div>
  );
}
```

**Route layout:** `authenticated` (ProtectedRoute + AuthenticatedLayout)

### data-table

Full data table page with server-side pagination, sorting, and filtering. Composes `DataTable` with TanStack Query.

Ask the user for:

- Resource name (e.g., "Users") — used for types, query keys, API endpoint
- Columns definition (or generate reasonable defaults)

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import type { Column, PaginationState, SortingState } from "@/components/data-table";
import { api } from "@/libs";
import { Button } from "@/components/ui";

interface [Resource] {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

const columns: Column<[Resource]>[] = [
  { id: "id", header: "ID", accessorKey: "id", sortable: true },
  { id: "name", header: "Name", accessorKey: "name", sortable: true },
  { id: "email", header: "Email", accessorKey: "email", sortable: true },
  { id: "role", header: "Role", accessorKey: "role", sortable: true },
  { id: "status", header: "Status", accessorKey: "status", sortable: true },
];

export default function [Resource]Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>({});
  const [filter, setFilter] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["[resource]", pagination, sorting, filter],
    queryFn: () =>
      api
        .get("/[resource]", {
          params: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            sortBy: sorting.columnId,
            sortOrder: sorting.direction,
            search: filter || undefined,
          },
        })
        .then((res) => res.data),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          [Resource]
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your [resource] records.
        </p>
      </div>

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
        error={error ? "Failed to load [resource]" : null}
        emptyMessage="No [resource] found"
      />
    </div>
  );
}
```

**Route layout:** `authenticated` (ProtectedRoute + AuthenticatedLayout)

### form

A generic form page with Zod schema, React Hook Form, and the Form integration components.

Ask the user for:

- Form name (e.g., "ContactForm") — used for component name, schema name
- Fields (name + type + validation)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/form";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Textarea } from "@/components/ui";

const [formName]Schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type [FormName]Values = z.infer<typeof [formName]Schema>;

export default function [FormName]Page() {
  const form = useForm<[FormName]Values>({
    resolver: zodResolver([formName]Schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: [FormName]Values) => {
    console.log(data);
    // TODO: Call API
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          [Form Title]
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Fill out the form below.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <Form form={form} onSubmit={onSubmit}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="you@example.com" />
                  </FormControl>
                  <FormDescription>
                    We'll never share your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Your message..." rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Submit
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
```

**Route layout:** `main` (MainLayout wrapper)

### error

A custom 404 page with illustration and navigation back home.

```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-6xl font-bold text-gray-300 dark:text-gray-700">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Page Not Found
      </h2>
      <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" size="lg" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
}
```

**Route layout:** `none`, catch-all path `*`

### landing

A marketing landing page with hero, features grid, and CTA sections.

```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui";

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl dark:text-white">
          Build faster with our platform
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-gray-600 dark:text-gray-400">
          A production-ready template with everything you need to ship your next
          React application.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button variant="primary" size="lg" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
          <Button variant="outline-primary" size="lg" asChild>
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8 dark:bg-gray-800/50">
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
          Everything you need
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Components",
              desc: "40+ accessible UI components with TypeScript support.",
            },
            {
              title: "API Layer",
              desc: "Centralized HTTP client with interceptors and error handling.",
            },
            {
              title: "State Management",
              desc: "TanStack Query for server state, Zustand for UI state.",
            },
            {
              title: "Form Validation",
              desc: "Zod schemas with React Hook Form integration.",
            },
            {
              title: "Testing",
              desc: "Co-located tests with Vitest and React Testing Library.",
            },
            {
              title: "CLI Tools",
              desc: "Scaffold projects and add components with frontier-fe CLI.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Ready to get started?
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Join thousands of developers building with our platform.
        </p>
        <div className="mt-8">
          <Button variant="primary" size="lg" asChild>
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
```

**Route layout:** `landing` (LandingLayout wrapper, index route at `/`)

## Wiring Steps (after creating the page file)

For each block, also wire the route into the app by following the `new-page` skill steps 2–6:

1. Add lazy import in `src/app/router.tsx`
2. Add route definition with the layout wrapper from the template notes
3. Add route constant in `src/config/constants.ts`
4. Add route metadata in `src/config/routes-metadata.ts`
5. Add to navbar in `src/components/layouts/Navbar.tsx` (if applicable)

> **See [new-page skill](./new-page/SKILL.md)** for the full wiring instructions.

## After Scaffolding

1. Replace `[Resource]` and `[resource]` placeholders with actual names
2. Update column definitions to match your data model
3. Replace `/api/[resource]` with your actual API endpoint
4. Customize the UI to match your brand
5. Run `/run-tests [PageName].tsx` to verify

## Register in CLI Registry

To make the block installable via `frontier-fe add block:<name>`, add an entry to `packages/cli/registry/registry.json`:

```json
{
  "name": "<block-name>",
  "type": "block",
  "description": "<short description of the block>",
  "files": [
    {
      "source": "templates/blocks/<category>/<block-name>.tsx",
      "target": "src/app/routes/<PageName>.tsx"
    }
  ],
  "npmDependencies": [],
  "registryDependencies": [
    "<list of required features, sections, and components>"
  ]
}
```

Then copy the page file to the templates directory:

```bash
cp src/app/routes/<PageName>.tsx packages/cli/templates/blocks/<category>/<block-name>.tsx
```

Also update `packages/cli/src/types.ts` to ensure `block` is in the `ItemType` union if not already there.
