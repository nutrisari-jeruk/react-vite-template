---
name: release
description: >
  Automate the full release workflow for the frontier-fe CLI package. Use this skill whenever the user
  wants to cut a release, bump the version, generate a changelog, create release notes, or publish the
  CLI. Triggers on phrases like "cut a release", "bump version", "new release", "release notes",
  "changelog", "publish", "tag this", "what changed since last release", or "prepare release".
  Also triggers when the user mentions semantic versioning, semver bump, or wants to see what commits
  would go into the next release.
---

# Release Workflow

Automates version bumping, changelog generation, and release preparation for the `frontier-fe` CLI package.

## Project Layout

- **CLI package**: `packages/cli/package.json` — this is the file whose `version` field gets bumped
- **Changelog**: `CHANGELOG.md` at the project root — entries are prepended above the first `---` separator
- **Git tags**: Format `frontier-fe@<version>` (e.g., `frontier-fe@0.3.0`) — these trigger the npm publish workflow
- **Conventional commits**: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `build`, `ci` — with optional `(cli)`, `(skills)`, etc. scope

## Workflow

### Step 1: Gather changes

Run `git log` to collect commits since the last release tag.

```bash
# Find the last tag
LAST_TAG=$(git tag --list 'frontier-fe@*' --sort=-v:refname | head -1)

# Get commits since then (or all commits if no tag exists)
if [ -n "$LAST_TAG" ]; then
  git log "${LAST_TAG}..HEAD" --pretty=format:"%h %s"
else
  git log --pretty=format:"%h %s"
fi
```

Also read the current version from `packages/cli/package.json` so you know the baseline.

### Step 2: Determine semver bump

Analyze the collected commits using conventional commit conventions:

| Commit type                                                      | Bump level                        |
| ---------------------------------------------------------------- | --------------------------------- |
| `feat:` or `feat(*)`                                             | **minor** (middle number)         |
| `fix:` or `fix(*)`                                               | **patch** (last number)           |
| `BREAKING CHANGE:` in body, or `feat!:` / `fix!:`                | **major** (first number)          |
| `chore`, `docs`, `test`, `ci`, `refactor`, `build`, `perf` alone | **patch** (if no feat/fix exists) |

Rules:

- If there's at least one `feat`, the minimum bump is **minor** — unless a breaking change forces **major**.
- If there are only `fix`, `chore`, `docs`, `test`, etc. (no `feat`), bump is **patch**.
- Breaking changes (indicated by `!` after type or `BREAKING CHANGE:` in body) always force a **major** bump regardless of other commits.
- Calculate the new version by incrementing the appropriate semver segment of the current version.

### Step 3: Generate changelog entry

Group commits by category, matching the existing CHANGELOG.md style:

```markdown
## [<VERSION>] - <DATE>

### ✨ Added

- **<scope>**: <description> (<commit-hash>)

### 🐛 Fixed

- **<scope>**: <description> (<commit-hash>)

### 🔧 Changed

- <description> (<commit-hash>)

### 📦 Other

- <description> (<commit-hash>)
```

Mapping:

- `feat` commits → **Added** section (with ✨)
- `fix` commits → **Fixed** section (with 🐛)
- `chore`, `refactor`, `perf`, `ci`, `build` → **Changed** section (with 🔧)
- `docs`, `test` → **Other** section (with 📦)

For commits with a scope (e.g., `feat(cli): add blocks system`), format as:
`- **cli**: add blocks system (abc1234)`

For commits without a scope, format as:
`- add blocks system (abc1234)`

Skip any commits that are pure version bumps, "release" commits, or merge commits — they're housekeeping, not user-facing changes.

### Step 4: Generate GitHub release body

Create a separate markdown string suitable for a GitHub Release. Same categorization as the changelog but without the version header (GitHub adds that), and with full commit hash links:

```markdown
### ✨ Added

- **cli**: add blocks system (`abc1234`)

### 🐛 Fixed

- **cli**: create project subdirectory when project name is provided (`def5678`)

### 🔧 Changed

- rename package from react-vite-app to frontier-frontend-template (`ghi9012`)
```

### Step 5: Present and confirm

Before making any changes, present a summary to the user:

```
## Release Summary

**Version bump**: 0.2.1 → 0.3.0 (minor)
**Reason**: 2 feature commits since frontier-fe@0.2.1

**Files that will change:**
- packages/cli/package.json (version field)
- CHANGELOG.md (prepend entry)

**Git tag**: frontier-fe@0.3.0

**Changelog entry:**
<the full changelog entry>

**GitHub release body:**
<the release body>

Proceed? (y/n)
```

Wait for the user to confirm before proceeding. If they want adjustments (different version, modified changelog text, etc.), make those changes and re-present.

### Step 6: Execute

After confirmation:

1. **Update `packages/cli/package.json`** — change the `version` field to the new version
2. **Update `CHANGELOG.md`** — prepend the new entry above the first `---` separator (after the intro paragraph). Also update the comparison links at the bottom:
   - Add a new line: `[<VERSION>]: https://github.com/rsudsda/frontier-fe-template/compare/<LAST_TAG>...frontier-fe@<VERSION>`
   - Update the previous version's link to point to the new tag
3. **Print the GitHub release body** so the user can copy it
4. **Create a git tag** at the current HEAD: `git tag frontier-fe@<version>`
5. Tell the user what they need to do next:
   ```
   Done! Next steps:
   1. Review the changes: git diff
   2. Commit: git add packages/cli/package.json CHANGELOG.md && git commit -m "release: <version>"
   3. Push: git push && git push --tags
   ```
   Do NOT auto-commit or auto-push. The user should review and push on their own timeline.

## Dry Run Mode

If the user says "dry run", "preview", "what would the next release look like", or similar, run Steps 1-5 (gather, determine bump, generate entries) and present the summary but explicitly skip Step 6. Make it clear this is a preview and no files were modified.

## Edge Cases

- **No changes since last tag**: Tell the user there are no new commits and ask if they still want to release (sometimes you need to re-release, e.g., to fix a publish issue).
- **First release (no tags exist)**: Treat as a patch bump from `0.0.0` (or whatever is in package.json) and include all commits.
- **Already on a tag**: If HEAD is already tagged, warn the user.
- **Uncommitted changes**: Before executing, check `git status --porcelain`. If there are uncommitted changes, warn the user and suggest committing or stashing first — don't proceed with a dirty working tree.
