---
name: new-page
description: Scaffolds a new page route with component, router wiring, constants, metadata, and navigation
disable-model-invocation: true
---

# New Page

Scaffold a new page route following SOP Coding Standard 2.0 conventions. Creates the component file and wires it into the router, constants, route metadata, and navbar.

## Usage

```
/new-page Profile --path /profile --layout main --nav "Profile"
```

## Required Parameters

Ask the user for:

| Param         | Example                           | Notes                                                      |
| ------------- | --------------------------------- | ---------------------------------------------------------- |
| **Name**      | `Profile`                         | PascalCase page name                                       |
| **Path**      | `/profile` or `/settings/profile` | URL path, use kebab-case segments                          |
| **Layout**    | `main`                            | One of: `none`, `landing`, `main`, `auth`, `authenticated` |
| **Nav label** | `"Profile"`                       | Display text in navbar, or `none` to skip                  |

## Layout Reference

| Layout          | Wrapper                                      | Use case                            |
| --------------- | -------------------------------------------- | ----------------------------------- |
| `none`          | No layout, just MetadataUpdater + LazyPage   | Login, OTP, standalone pages        |
| `landing`       | LandingLayout as parent, page as index child | Home, About, public marketing pages |
| `main`          | MainLayout as parent, page as index child    | Components, general app pages       |
| `auth`          | AuthLayout as parent, page as index child    | Register, auth-related pages        |
| `authenticated` | ProtectedRoute + AuthenticatedLayout         | Dashboard, pages requiring login    |

## Step 1: Create Page Component

Write `src/app/routes/[Name].tsx`:

```tsx
export default function [Name]() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-balance">[Name]</h1>
      <p className="mt-4 text-pretty text-gray-600">[Name] page content goes here.</p>
    </div>
  );
}
```

Use **named default export**: `export default function [Name]()`.

## Step 2: Add Lazy Import

Insert at the end of the existing lazy imports block in `src/app/router.tsx` (before the `PageLoader` function, alphabetically among existing imports):

```tsx
const [Name] = lazy(() => import("@/app/routes/[Name]"));
```

Alphabetical order by variable name: `About`, `AuthExample`, `Components`, ... Insert in the correct position.

## Step 3: Add Route Definition

Insert in the `createBrowserRouter` routes array in `src/app/router.tsx`. Pattern depends on layout:

### Layout: `none`

```tsx
{
  path: "[path]",
  element: (
    <>
      <MetadataUpdater />
      <LazyPage>
        <[Name] />
      </LazyPage>
    </>
  ),
},
```

### Layout: `landing` or `main`

```tsx
{
  path: "[path]",
  element: (
    <>
      <MetadataUpdater />
      <[Layout]Layout />
    </>
  ),
  children: [
    {
      index: true,
      element: (
        <LazyPage>
          <[Name] />
        </LazyPage>
      ),
    },
  ],
},
```

Replace `[Layout]` with the actual layout name (e.g., `Main`, `Landing`).

### Layout: `authenticated`

```tsx
{
  path: "[path]",
  element: (
    <>
      <MetadataUpdater />
      <ProtectedRoute>
        <AuthLoader
          renderLoading={() => (
            <div className="flex min-h-dvh items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            </div>
          )}
          renderError={() => {
            window.location.href = "/login";
            return null;
          }}
        >
          <AuthenticatedLayout />
        </AuthLoader>
      </ProtectedRoute>
    </>
  ),
  children: [
    {
      index: true,
      element: (
        <LazyPage>
          <[Name] />
        </LazyPage>
      ),
    },
  ],
},
```

### Layout: `auth`

```tsx
{
  path: "[path]",
  element: (
    <>
      <MetadataUpdater />
      <AuthLayout />
    </>
  ),
  children: [
    {
      index: true,
      element: (
        <LazyPage>
          <[Name] />
        </LazyPage>
      ),
    },
  ],
},
```

Insert the route definition before the catch-all `*` route (last in the array).

## Step 4: Add Route Constant

Append to the `ROUTES` object in `src/config/constants.ts`:

```tsx
[KEY]: "[path]",
```

Derive the key from the page name in SCREAMING_SNAKE_CASE:

- `Profile` → `PROFILE`
- `Settings` → `SETTINGS`
- `UserProfile` → `USER_PROFILE`

Insert alphabetically among existing keys. Add a trailing comma if not the last entry.

## Step 5: Add Route Metadata

Append to `ROUTE_METADATA` in `src/config/routes-metadata.ts`:

```tsx
"[path]": {
  title: "[Human-readable title]",
  description: "[One-sentence description of the page].",
},
```

Insert alphabetically by path. Ask the user for the title and description, or derive sensible defaults from the page name.

## Step 6: Add to Navbar

If the user provided a `--nav` label, add to the `menuItems` array in `src/components/layouts/Navbar.tsx`:

```tsx
{ path: "[path]", label: "[Nav label]" },
```

Insert alphabetically by path among the flat items. Use user's label as display text.

**Do NOT add duplicate entries.** Check if the path or label already exists before inserting.

## Provider Tag

Convert the PascalCase name for the route key:

```
Profile      → PROFILE
UserProfile  → USER_PROFILE
Settings     → SETTINGS
```

Convert the PascalCase name to kebab-case for the URL path (if user doesn't specify):

```
Profile      → /profile
UserProfile  → /user-profile
DataTable    → /data-table
```
