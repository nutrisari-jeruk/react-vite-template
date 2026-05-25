---
name: run-tests
description: Find and run co-located tests for a given source file
---

# Run Tests

Run the co-located test file for a given source file (or run a test file directly).

## Usage

```
/run-tests src/components/ui/button/Button.tsx
/run-tests src/components/ui/button/Button.test.tsx
```

## Logic

Given a file path:

1. **If it's a test file** (`.test.tsx`, `.test.ts`, `.spec.tsx`, `.spec.ts`) — run vitest directly
2. **If it's a source file** (`.tsx`, `.ts`) — derive the co-located test path by replacing the extension with `.test.tsx`:
   - `Button.tsx` → look for `Button.test.tsx` in the same directory
   - `useAuth.ts` → look for `useAuth.test.ts` in the same directory
3. **If the test file exists** — run `npx vitest run <test-file> --reporter=dot`
4. **If no test file is found** — report that no test exists for the given file
5. **If the file is not TypeScript** — skip with message

## Best Practice

After completing an edit on a component, hook, or utility, run this skill to catch regressions immediately rather than waiting for CI.
