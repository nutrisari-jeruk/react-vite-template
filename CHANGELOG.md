# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-01-24

### 🎉 Major Release - Comprehensive UI System Overhaul

This release includes a complete overhaul of the UI component library with numerous new components, improved APIs, better type safety, and enhanced documentation.

### ✨ Added

#### New Essential Components
- **Dialog Component** (`src/components/ui/dialog/`)
  - Modal dialog with animations
  - Multiple sizes (sm, md, lg, xl, full)
  - Built on Base UI for accessibility
  - Reduced motion support

- **Toast Notification System** (`src/components/ui/toast/`)
  - Global notification system with context
  - Four variants (info, success, warning, error)
  - Auto-dismiss with configurable duration
  - Multiple position options
  - `useToast` hook for easy usage

- **Dropdown Menu Component** (`src/components/ui/dropdown-menu/`)
  - Accessible dropdown menu built on Base UI
  - Checkbox and radio items
  - Separators, labels, and groups
  - Destructive item variant

#### New Utility Components
- **Skeleton Component** (`src/components/ui/skeleton/`)
  - Loading placeholders with shimmer animation
  - Multiple variants (default, text, circular, rectangular)
  - Pre-built patterns: `SkeletonText`, `SkeletonCard`

- **Pagination Component** (`src/components/ui/pagination/`)
  - Standalone pagination with page numbers
  - Intelligent ellipsis for many pages
  - First/last page navigation
  - Fully keyboard accessible

#### New Hooks
- **`useMediaQuery`** (`src/hooks/use-media-query.ts`)
  - Track media query matches
  - SSR-safe implementation
  
- **`useBreakpoint`** (`src/hooks/use-breakpoint.ts`)
  - Track current Tailwind breakpoint
  - Convenience flags (isMobile, isTablet, isDesktop)

#### Form System
- **React Hook Form Integration** (`src/components/form/`)
  - `Form`, `FormField`, `FormItem` components
  - `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`
  - `useFormField` hook
  - Full Zod validation support
  - Automatic error handling

### 🔧 Changed

#### Component API Improvements
- **Input Component**: Removed redundant `variant="error"` - `error` prop automatically applies error styling
- **All Form Components**: Standardized prop names and error handling patterns
- **DataTable Component**:
  - Now uses `getRowId` function for proper unique keys
  - Added `enableRowSelection` prop
  - Added `selectedRows` and `onRowSelectionChange` props
  - Fixed colspan calculations for selection column

#### Type Safety Improvements
- **Combobox Component**: Removed type assertions, added proper type guards
- All components now have explicit return types
- Better null/undefined handling throughout

### 📚 Documentation

- Added comprehensive JSDoc comments to all core components
- Added usage examples to component documentation
- Added prop-level documentation with @property tags
- Created `UI-IMPROVEMENTS-SUMMARY.md` with detailed component guide
- Updated barrel exports with organized categories

### 🧪 Testing

#### New Test Files
- `Dialog.test.tsx` - Dialog component tests
- `Toast.test.tsx` - Toast notification tests
- `DropdownMenu.test.tsx` - Dropdown menu tests
- `Skeleton.test.tsx` - Skeleton component tests
- `Pagination.test.tsx` - Pagination component tests
- `Form.test.tsx` - Form system tests
- `use-media-query.test.ts` - Media query hook tests
- `use-breakpoint.test.ts` - Breakpoint hook tests

#### Integration Tests
- `Button.integration.test.tsx` - Async operations, form submission, keyboard navigation
- `Form.integration.test.tsx` - Complete form workflows with validation

### 🎨 Styling

- Added shimmer animation keyframes for Skeleton component
- All new components use Tailwind CSS v4
- Consistent spacing and sizing across all components
- Proper focus states and keyboard navigation styles

### 📦 Exports

Updated barrel exports in:
- `src/components/ui/index.ts` - Organized by category (Form Controls, Feedback, Data Display, Overlays, Navigation)
- `src/components/index.ts` - Added all new components
- `src/hooks/index.ts` - Added new hooks

### ♿ Accessibility

- All new components include proper ARIA attributes
- Keyboard navigation support across all interactive components
- Screen reader support with descriptive labels
- Focus management in modals and dropdowns
- Reduced motion support in all animated components

### 🛡️ Type Safety

- Removed all unnecessary type assertions
- Added proper type guards
- Explicit return types on all functions
- Comprehensive TypeScript interfaces with documentation

---

## [1.0.0] - 2025-XX-XX

### Initial Release

- Basic component library with Button, Input, Select, etc.
- Tailwind CSS v4 integration
- Base UI components
- React Hook Form support
- Vitest testing setup
- ESLint and Prettier configuration

---

## Migration Guide

### From 1.x to 2.0

#### 1. Add Toast Provider (if using toasts)
```tsx
// In app root
import { ToastProvider } from '@/components';

<ToastProvider>
  <App />
</ToastProvider>
```

#### 2. Update DataTable Usage
```tsx
// Add getRowId for proper keys
<DataTable
  data={data}
  columns={columns}
  getRowId={(row) => row.id}  // ← Add this
/>

// Optional: Enable row selection
<DataTable
  data={data}
  columns={columns}
  getRowId={(row) => row.id}
  enableRowSelection
  selectedRows={selectedRows}
  onRowSelectionChange={setSelectedRows}
/>
```

#### 3. Use New Form Components (Optional)
```tsx
// Instead of FormInput
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components';

// Full React Hook Form integration
<Form form={form} onSubmit={handleSubmit}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

#### 4. Update Input Variant Usage
```tsx
// Before
<Input variant="error" />

// After (error prop automatically applies error styling)
<Input error="This field is required" />
```

---

[2.0.0]: https://github.com/yourusername/react-vite-template/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/yourusername/react-vite-template/releases/tag/v1.0.0
