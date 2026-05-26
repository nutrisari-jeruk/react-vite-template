import fs from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(ROOT, "packages/cli/registry/registry.json");
const TEMPLATES_DIR = path.join(ROOT, "packages/cli/templates");

const CHECK_MODE = process.argv.includes("--check");

function isTestFile(filePath) {
  return /\.(test|spec|integration\.test)\.(ts|tsx|js|jsx)$/.test(filePath);
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function ensureDirSync(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function syncFile(srcPath, templatePath) {
  if (!(await pathExists(srcPath))) {
    return { status: "missing_source" };
  }

  ensureDirSync(path.dirname(templatePath));

  if (CHECK_MODE) {
    if (!(await pathExists(templatePath))) {
      console.error(
        `MISS  Template missing: ${path.relative(ROOT, templatePath)}`
      );
      return { status: "missing_template" };
    }
    const srcContent = await fs.readFile(srcPath, "utf-8");
    const tplContent = await fs.readFile(templatePath, "utf-8");
    if (srcContent !== tplContent) {
      console.error(
        `DIFF  ${path.relative(ROOT, srcPath)} ≠ ${path.relative(ROOT, templatePath)}`
      );
      return { status: "differ" };
    }
    return { status: "ok" };
  }

  await fs.copyFile(srcPath, templatePath);
  console.log(
    `COPY  ${path.relative(ROOT, srcPath)} → ${path.relative(ROOT, templatePath)}`
  );
  return { status: "copied" };
}

async function syncRegistryItems() {
  const registryJson = await fs.readFile(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(registryJson);
  let errors = 0;
  let synced = 0;

  for (const item of registry.items) {
    for (const file of item.files) {
      if (isTestFile(file.target)) continue;

      const srcPath = path.join(ROOT, file.target);
      const templatePath = path.join(ROOT, "packages/cli", file.source);

      const result = await syncFile(srcPath, templatePath);
      if (result.status === "differ" || result.status === "missing_template") {
        errors++;
      } else if (result.status === "copied" || result.status === "ok") {
        synced++;
      }
    }
  }

  return { errors, synced };
}

async function syncBaseFiles() {
  let errors = 0;
  let synced = 0;

  // Parse BASE_FILES from init.ts source
  const initPath = path.join(ROOT, "packages/cli/src/commands/init.ts");
  const initSource = await fs.readFile(initPath, "utf-8");

  const match = initSource.match(/const BASE_FILES = \[([\s\S]*?)\];/);
  if (!match) {
    console.warn("WARN  Could not parse BASE_FILES from init.ts");
    return { errors, synced };
  }

  const entries = [
    ...match[1].matchAll(/\{\s*source:\s*"([^"]+)",\s*target:\s*"([^"]+)"/g),
  ];

  for (const [, source, target] of entries) {
    // Skip src/ files in base template — they're intentionally minimal,
    // not copies of the showcase src/
    if (target.startsWith("src/")) continue;

    const srcPath = path.join(ROOT, target);
    const templatePath = path.join(TEMPLATES_DIR, source);

    const result = await syncFile(srcPath, templatePath);
    if (result.status === "differ" || result.status === "missing_template") {
      errors++;
    } else if (result.status === "copied" || result.status === "ok") {
      synced++;
    }
  }

  return { errors, synced };
}

async function main() {
  console.log(
    CHECK_MODE
      ? "Checking template sync..."
      : "Syncing templates from src/ → packages/cli/templates/...\n"
  );

  const registryResult = await syncRegistryItems();
  const baseResult = await syncBaseFiles();

  const totalErrors = registryResult.errors + baseResult.errors;
  const totalSynced = registryResult.synced + baseResult.synced;

  console.log(
    `\nRegistry: ${registryResult.synced} files, ${registryResult.errors} errors`
  );
  console.log(
    `Base:     ${baseResult.synced} files, ${baseResult.errors} errors`
  );

  if (CHECK_MODE) {
    if (totalErrors > 0) {
      console.error(
        `\n${totalErrors} file(s) out of sync. Run "npm run sync:templates" to fix.`
      );
      process.exit(1);
    }
    console.log("\nAll templates in sync with src/");
  } else {
    console.log(`\nSync complete: ${totalSynced} files`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
