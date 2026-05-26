# CLI Development

## Overview

The `frontier-fe` CLI is a shadcn-style project scaffolder published to npm. It lets developers bootstrap SOP-compliant React projects and install components, features, hooks, and pages on demand — without cloning this repo.

This repository has a dual role:

- **Showcase app** — the `src/` directory is a fully functional dev app with a dev server, tests, and all 43 components
- **CLI source** — the `packages/cli/` directory is the npm-published tool that scaffolds new projects

## Commands

### `init` — Scaffold a New Project

Creates a minimal SOP-compliant project with the full folder structure, config files, and empty barrels.

```bash
# Interactive (prompts for project name)
npx frontier-fe init

# With project name
npx frontier-fe init my-app

# Skip prompts, specify package manager
npx frontier-fe init my-app --yes --pm pnpm
```

**What it does:**

1. Creates the project directory with the full `src/` structure
2. Copies base config files (vite.config.ts, tsconfig, eslint, tailwind, etc.)
3. Scaffolds empty barrel exports and placeholder files with route wiring markers
4. Runs `npm install` (or the detected/selected package manager)
5. Writes `frontier-fe.json` to track installed items

**Flags:**

| Flag                     | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| `[project-name]`         | Target directory name (positional, optional)             |
| `--pm <npm\|yarn\|pnpm>` | Package manager override (auto-detected from lock files) |
| `--yes`                  | Skip all prompts, use defaults                           |

### `add` — Install Components

Adds items from the registry into an existing project. Automatically resolves dependencies, updates barrel exports, and wires routes.

```bash
# Add individual items
npx frontier-fe add button dialog data-table

# Add all items of a specific type
npx frontier-fe add --all --type ui

# Skip confirmation, overwrite existing files
npx frontier-fe add login-form --yes --overwrite
```

**What it does:**

1. Validates items exist in the registry
2. Resolves and displays all dependencies (direct items + their dependencies)
3. Copies template files to the correct target paths
4. Updates barrel exports (`index.ts`) with new exports
5. Wires routes for page-type items (via marker comments in router)
6. Installs required npm dependencies
7. Updates `frontier-fe.json` with newly installed items

**Flags:**

| Flag                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `--all`             | Install all items (requires `--type`)                            |
| `-t, --type <type>` | Filter by type: `ui`, `feature`, `hook`, `page`, `layout`, `lib` |
| `--yes`             | Skip confirmation prompt                                         |
| `--overwrite`       | Overwrite existing files without prompting                       |

### `list` — Show Available Items

```bash
npx frontier-fe list
```

Displays all 43 registry items with type, description, and installed status.

## Architecture

### Package Structure

```
packages/cli/
├── src/
│   ├── index.ts          # CLI entry point (Commander.js)
│   ├── types.ts          # Shared TypeScript types
│   ├── commands/
│   │   ├── init.ts       # Scaffold project
│   │   ├── add.ts        # Install components
│   │   └── list.ts       # List registry
│   └── utils/
│       ├── registry.ts   # Registry read/resolve/fetch
│       ├── files.ts      # File copy, barrel updates
│       ├── route-wiring.ts # Marker-based route insertion
│       ├── config.ts     # frontier-fe.json read/write
│       └── logger.ts     # Consistent output formatting
├── registry/
│   ├── registry.json     # All 43 scaffoldable items
│   └── schema.json       # JSON Schema for registry
├── templates/            # Distribution copies (synced from src/)
├── dist/                 # Built output (tsup)
└── package.json
```

### Dependency Resolution

When a user runs `frontier-fe add data-table`, the CLI:

1. Looks up `data-table` in the registry
2. Reads its `registryDependencies` array (e.g., `["button", "input", "table"]`)
3. Recursively resolves those dependencies and their dependencies
4. Displays the full install plan with dependencies labeled, then prompts for confirmation

### Route Wiring

Page-type registry items include a `route` field. The CLI inserts routes using **marker comments** in the base template files:

```
// --- FRONTIER-FE: LAZY IMPORTS ---     → lazy import insertion point
// --- FRONTIER-FE: ROUTES ---           → route definition insertion point
// --- FRONTIER-FE: ROUTE CONSTANTS ---  → ROUTES constant insertion point
// --- FRONTIER-FE: NAV ITEMS ---         → Navbar link insertion point
```

This is more reliable than regex-based insertion since markers are unambiguous and survive file changes.

### Barrel Export Updates

When `add` copies a component, it updates the parent barrel (`index.ts`) to include the new export. For example, adding `button` appends:

```typescript
export { Button } from "./button";
```

to `src/components/ui/index.ts`. The CLI reads existing barrel content and appends only missing exports.

## Template Development

### Source of Truth

`src/` is the **development home** — edit components here, use the dev server, and write tests. `packages/cli/templates/` is the **distribution copy** that ships with the npm package.

### Sync Direction: `src/` → templates

```
src/components/ui/button/Button.tsx   ← edit here
        │  npm run sync:templates
        ▼
packages/cli/templates/ui/button/Button.tsx  ← ships to npm
```

### Sync Script

```bash
npm run sync:templates        # Copy src/ → templates
npm run sync:templates:check  # CI mode — exits non-zero if out of sync
```

The sync script (`scripts/sync-templates.mjs`) does two things:

1. **Registry items** — walks `registry.json`, copies each item's `target` file (from `src/`) to its `source` path (in `packages/cli/templates/`)
2. **Base files** — parses the `BASE_FILES` constant from `init.ts`, copies repo-level config files (vite.config.ts, eslint config, tsconfig, etc.) to the templates directory

**What sync covers:**

- All 43 registry items (UI components, hooks, features, layouts, pages, lib)
- Repo root config files (vite.config.ts, eslint.config.js, tsconfig, etc.)

**What sync skips:**

- Test files (`.test.tsx`, `.test.ts`, `.spec.ts`) — excluded from template copies
- Base template `src/` files — intentionally minimal, not synced from the showcase app

**Template-only files** are maintained directly in `packages/cli/templates/` (not in `src/`):

- `lib/api-client.ts`, `lib/api-error.ts` — scaffolded by `init` into a new project
- Any file that appears as a registry `source` but lacks a corresponding `src/` file

## Registry

### Format

`packages/cli/registry/registry.json` defines all 43 installable items. Each entry:

```json
{
  "name": "button",
  "type": "ui",
  "description": "Button component with variants, sizes, and loading state",
  "files": [
    {
      "source": "templates/ui/button/Button.tsx",
      "target": "src/components/ui/button/Button.tsx"
    },
    {
      "source": "templates/ui/button/button-index.ts",
      "target": "src/components/ui/button/index.ts"
    }
  ],
  "npmDependencies": [],
  "registryDependencies": ["cn"]
}
```

| Field                  | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `name`                 | Unique identifier (e.g., `button`, `data-table`)               |
| `type`                 | Category: `ui`, `feature`, `hook`, `page`, `layout`, `lib`     |
| `description`          | Short description shown in `list` command                      |
| `files[].source`       | Path within `packages/cli/templates/`                          |
| `files[].target`       | Destination path in the user's project                         |
| `npmDependencies`      | npm packages to install when this item is added                |
| `registryDependencies` | Other registry items this depends on (installed automatically) |
| `route`                | (page-type only) Route path and layout configuration           |
| `exports`              | Barrel export statements to append                             |

### Adding a New Item

1. Create the component/hook/feature in `src/` following SOP conventions
2. Add an entry to `registry.json` with the correct `source`/`target` paths
3. Run `npm run sync:templates` to copy it to `packages/cli/templates/`
4. Verify with `npm run sync:templates:check`

### Naming in Templates

Template files follow the same SOP conventions as `src/`:

- Component files: PascalCase (`Button.tsx`)
- Hook files: camelCase (`useBreakpoint.ts`)
- Utility files: kebab-case (`api-client.ts`)

Barrel index files for multi-file components use a name-based suffix (e.g., `button-index.ts`) to avoid collisions in the flat `templates/` directory.

## npm Publishing

The CLI is published to npm from `packages/cli/`:

```bash
cd packages/cli
npm version 0.2.0                # Bump version
git tag frontier-fe@0.2.0
git push --tags
npm publish
```

**Pre-publish checklist:**

- [ ] `npm run sync:templates:check` passes
- [ ] `npm run cli:build` succeeds
- [ ] `npm test` in root passes
- [ ] Dry-run: `node dist/index.js init /tmp/test-app --yes && cd /tmp/test-app && node <cli-path>/dist/index.js add button --yes`

## Related Documentation

- [Project Structure](./project-structure.md)
- [Components and Styling](./components-and-styling.md)
- [CLAUDE.md](../CLAUDE.md) — CLI Development section for AI agent guidance
