import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import pc from "picocolors";
import prompts from "prompts";
import type { FrontierConfig } from "../types.js";
import { DEFAULT_CONFIG } from "../types.js";
import { logger } from "../utils/logger.js";
import { writeConfig, configExists } from "../utils/config.js";
import { getTemplatesDir } from "../utils/registry.js";

interface InitOptions {
  cwd: string;
  projectName?: string;
  yes?: boolean;
  pm?: "npm" | "yarn" | "pnpm";
}

const BASE_FILES = [
  // Config files
  { source: "base/tsconfig.json", target: "tsconfig.json" },
  { source: "base/tsconfig.app.json", target: "tsconfig.app.json" },
  { source: "base/tsconfig.node.json", target: "tsconfig.node.json" },
  { source: "base/vite.config.ts", target: "vite.config.ts" },
  { source: "base/vitest.config.ts", target: "vitest.config.ts" },
  { source: "base/eslint.config.js", target: "eslint.config.js" },
  { source: "base/postcss.config.js", target: "postcss.config.js" },
  { source: "base/.prettierrc", target: ".prettierrc" },
  { source: "base/.gitattributes", target: ".gitattributes" },
  { source: "base/.editorconfig", target: ".editorconfig" },
  { source: "base/.env.example", target: ".env.example" },
  // Claude Code automation
  { source: "base/.mcp.json", target: ".mcp.json" },
  { source: "base/.claude/settings.json", target: ".claude/settings.json" },
  {
    source: "base/.claude/agents/code-reviewer.md",
    target: ".claude/agents/code-reviewer.md",
  },
  {
    source: "base/.claude/skills/new-component/SKILL.md",
    target: ".claude/skills/new-component/SKILL.md",
  },
  {
    source: "base/.claude/skills/new-page/SKILL.md",
    target: ".claude/skills/new-page/SKILL.md",
  },
  {
    source: "base/.claude/skills/run-tests/SKILL.md",
    target: ".claude/skills/run-tests/SKILL.md",
  },
  {
    source: "base/.claude/skills/security-review/SKILL.md",
    target: ".claude/skills/security-review/SKILL.md",
  },
  { source: "base/index.html", target: "index.html" },
  // Core source files
  { source: "base/src/main.tsx", target: "src/main.tsx" },
  { source: "base/src/index.css", target: "src/index.css" },
  { source: "base/src/app/index.tsx", target: "src/app/index.tsx" },
  { source: "base/src/app/provider.tsx", target: "src/app/provider.tsx" },
  { source: "base/src/app/router.tsx", target: "src/app/router.tsx" },
  // Utilities
  { source: "base/src/utils/cn.ts", target: "src/utils/cn.ts" },
  { source: "base/src/utils/metadata.ts", target: "src/utils/metadata.ts" },
  { source: "base/src/utils/index.ts", target: "src/utils/index.ts" },
  // Config
  { source: "base/src/config/env.ts", target: "src/config/env.ts" },
  { source: "base/src/config/constants.ts", target: "src/config/constants.ts" },
  {
    source: "base/src/config/routes-metadata.ts",
    target: "src/config/routes-metadata.ts",
  },
  { source: "base/src/config/index.ts", target: "src/config/index.ts" },
  // Lib
  { source: "base/src/lib/api-client.ts", target: "src/lib/api-client.ts" },
  { source: "base/src/lib/api-error.ts", target: "src/lib/api-error.ts" },
  { source: "base/src/lib/index.ts", target: "src/lib/index.ts" },
  // Types
  { source: "base/src/types/index.ts", target: "src/types/index.ts" },
  // Testing
  { source: "base/src/testing/setup.ts", target: "src/testing/setup.ts" },
  {
    source: "base/src/testing/test-utils.tsx",
    target: "src/testing/test-utils.tsx",
  },
  { source: "base/src/testing/index.ts", target: "src/testing/index.ts" },
  // Route pages
  {
    source: "base/src/app/routes/not-found.tsx",
    target: "src/app/routes/not-found.tsx",
  },
  // Layouts (minimal navbar with markers)
  {
    source: "base/src/components/layouts/navbar.tsx",
    target: "src/components/layouts/navbar.tsx",
  },
  // Empty barrel files for extensibility
  { source: "base/src/hooks/index.ts", target: "src/hooks/index.ts" },
  {
    source: "base/src/components/ui/index.ts",
    target: "src/components/ui/index.ts",
  },
  {
    source: "base/src/components/layouts/index.ts",
    target: "src/components/layouts/index.ts",
  },
  {
    source: "base/src/components/index.ts",
    target: "src/components/index.ts",
  },
];

const BASE_NPM_DEPS = [
  "@tanstack/react-query",
  "axios",
  "clsx",
  "react",
  "react-dom",
  "react-router-dom",
  "tailwind-merge",
];

const BASE_DEV_DEPS = [
  "@eslint/js",
  "@tailwindcss/postcss",
  "@testing-library/jest-dom",
  "@testing-library/react",
  "@testing-library/user-event",
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "@vitejs/plugin-react-swc",
  "autoprefixer",
  "eslint",
  "eslint-config-prettier",
  "eslint-import-resolver-typescript",
  "eslint-plugin-import",
  "eslint-plugin-jsx-a11y",
  "eslint-plugin-prettier",
  "eslint-plugin-react",
  "eslint-plugin-react-hooks",
  "eslint-plugin-react-refresh",
  "globals",
  "husky",
  "jsdom",
  "lint-staged",
  "postcss",
  "prettier",
  "prettier-plugin-tailwindcss",
  "tailwindcss",
  "terser",
  "typescript",
  "typescript-eslint",
  "vite",
  "vitest",
];

export async function init(options: InitOptions): Promise<void> {
  // If project name given, create and use a subdirectory
  let cwd = options.cwd;
  if (options.projectName) {
    cwd = path.resolve(cwd, options.projectName);
    await fs.ensureDir(cwd);
  }

  // Check if already initialized
  if (await configExists(cwd)) {
    logger.warn("frontier-fe.json already exists in this directory.");
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "Overwrite existing configuration?",
      initial: false,
    });
    if (!overwrite) {
      logger.info("Cancelled.");
      return;
    }
  }

  logger.break();
  logger.title(
    pc.bold("🚀 frontier-fe") + pc.dim(" — React + Vite Project Scaffold")
  );
  logger.break();

  // Interactive prompts
  let projectName = options.projectName || path.basename(cwd);
  if (!options.yes && !options.projectName) {
    const response = await prompts([
      {
        type: "text",
        name: "name",
        message: "Project name:",
        initial: projectName,
      },
    ]);
    projectName = response.name || projectName;
  }

  // Determine package manager
  const pm = options.pm || detectPackageManager(cwd);

  // Create config
  const config: FrontierConfig = {
    ...DEFAULT_CONFIG,
    name: projectName,
    installed: ["cn", "api-client", "env"],
  };

  // Copy base template files
  logger.info("Scaffolding project...");
  const templatesDir = getTemplatesDir();
  let copiedCount = 0;

  for (const file of BASE_FILES) {
    const sourcePath = path.resolve(templatesDir, file.source);
    const targetPath = path.resolve(cwd, file.target);

    await fs.ensureDir(path.dirname(targetPath));

    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath, { overwrite: false });
      copiedCount++;
    }
  }
  logger.success(`Copied ${copiedCount} base files.`);

  // Generate package.json if it doesn't exist
  const pkgPath = path.resolve(cwd, "package.json");
  if (!(await fs.pathExists(pkgPath))) {
    const pkg = {
      name: projectName,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc -b && vite build",
        lint: "eslint .",
        "lint:fix": "eslint . --fix",
        format: 'prettier --write "src/**/*.{ts,tsx,css}"',
        "format:check": 'prettier --check "src/**/*.{ts,tsx,css}"',
        test: "vitest",
        "test:coverage": "vitest --coverage",
        preview: "vite preview",
        prepare: "husky",
      },
      dependencies: {},
      devDependencies: {},
    };
    await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
    logger.success("Created package.json");
  }

  // Write frontier-fe.json
  await writeConfig(cwd, config);
  logger.success("Created frontier-fe.json");

  // Install dependencies
  if (!options.yes) {
    const { install } = await prompts({
      type: "confirm",
      name: "install",
      message: "Install dependencies now?",
      initial: true,
    });

    if (install) {
      await installDeps(cwd, pm);
    } else {
      logger.break();
      logger.info("Skip dependency installation. Run manually:");
      logger.dim(`  ${pm} install ${BASE_NPM_DEPS.join(" ")}`);
      logger.dim(`  ${pm} install -D ${BASE_DEV_DEPS.join(" ")}`);
    }
  } else {
    await installDeps(cwd, pm);
  }

  // Done
  logger.break();
  logger.success(pc.bold("Project initialized!"));
  logger.break();
  logger.title("Next steps:");
  logger.item(`cd ${projectName}`);
  logger.item(
    "frontier-fe add button input card  " + pc.dim("# add UI components")
  );
  logger.item(
    "frontier-fe add auth               " + pc.dim("# add auth feature")
  );
  logger.item(
    "frontier-fe list                    " + pc.dim("# see all available items")
  );
  logger.break();
}

async function installDeps(
  cwd: string,
  pm: "npm" | "yarn" | "pnpm"
): Promise<void> {
  logger.info("Installing dependencies...");
  try {
    const installCmd =
      pm === "yarn" ? "yarn add" : pm === "pnpm" ? "pnpm add" : "npm install";
    const installDevCmd =
      pm === "yarn"
        ? "yarn add -D"
        : pm === "pnpm"
          ? "pnpm add -D"
          : "npm install -D";

    execSync(`${installCmd} ${BASE_NPM_DEPS.join(" ")}`, {
      cwd,
      stdio: "pipe",
    });
    execSync(`${installDevCmd} ${BASE_DEV_DEPS.join(" ")}`, {
      cwd,
      stdio: "pipe",
    });
    logger.success("Dependencies installed.");
  } catch {
    logger.warn("Failed to install dependencies automatically.");
    logger.dim(`Run \`${pm} install\` manually.`);
  }
}

function detectPackageManager(cwd: string): "npm" | "yarn" | "pnpm" {
  try {
    if (fs.pathExistsSync(`${cwd}/pnpm-lock.yaml`)) return "pnpm";
    if (fs.pathExistsSync(`${cwd}/yarn.lock`)) return "yarn";
  } catch {
    // ignore
  }
  return "npm";
}
