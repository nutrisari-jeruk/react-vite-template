---
name: new-component
description: Scaffolds a UI component with SOP 2.0 boilerplate (folder, file, barrel, test stub, and index export)
disable-model-invocation: true
---

# New Component

Scaffold a new UI component following SOP Coding Standard 2.0 conventions.

## Usage

```
/new-component DropdownMenu
```

## What it Creates

Given a PascalCase `[Name]`, derive the lowercase folder name by converting PascalCase to kebab-case:

| PascalCase     | Folder          |
| -------------- | --------------- |
| `Button`       | `button`        |
| `DropdownMenu` | `dropdown-menu` |
| `DataTable`    | `data-table`    |

This creates:

```
src/components/ui/[folder]/
├── [Name].tsx
├── [Name].test.tsx
└── index.ts
```

And appends the export to `src/components/ui/index.ts`.

## Provider Tag

To derive the kebab-case folder from PascalCase: insert a hyphen before each uppercase letter that follows a lowercase letter or digit, then lowercase everything.

```
DropdownMenu → Dropdown-Menu → dropdown-menu
DataTable    → Data-Table    → data-table
Button       → Button        → button
APIKey       → A-P-I-Key     → a-p-i-key (edge case, keep simple)
```

## Component File Template

Write `src/components/ui/[folder]/[Name].tsx`:

```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface [Name]Props extends HTMLAttributes<HTMLDivElement> {
  /** Add props here */
}

export function [Name]({ className, children, ...props }: [Name]Props) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export default [Name];
```

Replace `<div>` with the appropriate element if different (e.g., `<button>`, `<span>`).

## Barrel Template

Write `src/components/ui/[folder]/index.ts`:

```tsx
export { [Name], [Name] as default } from "./[Name]";
```

## Test Stub Template

Write `src/components/ui/[folder]/[Name].test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { [Name] } from "./[Name]";

describe("[Name]", () => {
  it("renders children", () => {
    render(<[Name]>Hello</[Name]>);

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies className", () => {
    const { container } = render(<[Name] className="test-class" />);

    expect(container.firstChild).toHaveClass("test-class");
  });
});
```

## Barrel Export Update

Append to `src/components/ui/index.ts` under the appropriate section comment, or at the end if no section fits:

```tsx
export { [Name] } from "./[folder]";
```

Do NOT add duplicate exports. Check if `[Name]` is already exported before appending.
