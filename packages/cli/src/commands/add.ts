import { execSync } from "child_process";
import { existsSync } from "fs";
import pc from "picocolors";
import prompts from "prompts";
import type { RegistryItem } from "../types.js";
import { logger } from "../utils/logger.js";
import { readConfig, markInstalled, configExists } from "../utils/config.js";
import {
  getItem,
  resolveDependencies,
  getItemsByType,
} from "../utils/registry.js";
import {
  copyItemFiles,
  updateBarrelExport,
  collectNpmDeps,
} from "../utils/files.js";
import { wireRoute } from "../utils/route-wiring.js";

interface AddOptions {
  cwd: string;
  all?: boolean;
  type?: string;
  yes?: boolean;
  overwrite?: boolean;
}

export async function add(names: string[], options: AddOptions): Promise<void> {
  const cwd = options.cwd;

  // Check if frontier-fe.json exists
  if (!(await configExists(cwd))) {
    logger.error(
      "No frontier-fe.json found. Run " +
        pc.cyan("frontier-fe init") +
        " first."
    );
    process.exit(1);
  }

  // If --all flag, expand to all items (optionally filtered by --type)
  if (options.all) {
    const type = options.type || names[0];
    if (!type) {
      logger.error(
        "The --all flag requires a type. Use " +
          pc.cyan("--type <type>") +
          " or provide the type as an argument."
      );
      process.exit(1);
    }
    const items = await getItemsByType(type);
    if (items.length === 0) {
      logger.error(`No items found for type "${type}".`);
      process.exit(1);
    }
    names = items.map((i) => i.name);
    logger.info(`Adding all ${type} items (${names.length} items)`);
  }

  if (names.length === 0) {
    logger.error(
      "No items specified. Use " +
        pc.cyan("frontier-fe add <items...>") +
        " or " +
        pc.cyan("frontier-fe add --all --type <type>") +
        "."
    );
    process.exit(1);
  }

  // Normalize names: strip block: prefix and resolve block items
  const normalizedNames = names.map((n) => n.replace(/^block:/, ""));

  // Validate all requested items exist
  const requestedItems: RegistryItem[] = [];
  for (const name of normalizedNames) {
    const item = await getItem(name);
    if (!item) {
      logger.error(`Item "${name}" not found in registry.`);
      logger.dim(
        "Run " + pc.cyan("frontier-fe list") + " to see available items."
      );
      process.exit(1);
    }
    requestedItems.push(item);
  }

  // Resolve all dependencies
  const allItems = await resolveDependencies(normalizedNames);

  // Check what's already installed
  const config = await readConfig(cwd);
  const alreadyInstalled = new Set(config.installed);
  const newItems = allItems.filter((item) => !alreadyInstalled.has(item.name));

  // For blocks, check if target route file already exists and warn
  const blockItems = requestedItems.filter((i) => i.type === "block");
  if (blockItems.length > 0 && !options.overwrite && !options.yes) {
    for (const block of blockItems) {
      for (const file of block.files) {
        const targetPath = `${cwd}/${file.target}`;
        if (existsSync(targetPath)) {
          logger.warn(
            `Block ${pc.bold(block.name)} will overwrite ${pc.dim(file.target)}`
          );
          const { confirmOverwrite } = await prompts({
            type: "confirm",
            name: "confirmOverwrite",
            message: `Overwrite ${file.target}?`,
            initial: false,
          });
          if (!confirmOverwrite) {
            logger.info(`Skipped block "${block.name}".`);
            // Remove from requested and allItems
            const idx = requestedItems.indexOf(block);
            if (idx > -1) requestedItems.splice(idx, 1);
            const allIdx = allItems.findIndex((i) => i.name === block.name);
            if (allIdx > -1) allItems.splice(allIdx, 1);
            const newIdx = newItems.findIndex((i) => i.name === block.name);
            if (newIdx > -1) newItems.splice(newIdx, 1);
          }
        }
      }
    }
  }

  if (newItems.length === 0) {
    logger.info("All requested items are already installed.");
    return;
  }

  // Show what will be installed
  const directNames = new Set(names);
  const depItems = newItems.filter((i) => !directNames.has(i.name));

  logger.break();
  logger.title("The following items will be added:");
  logger.break();

  for (const item of newItems) {
    const isDep = depItems.includes(item);
    const label = isDep ? pc.dim(" (dependency)") : "";
    const typeColor = getTypeColor(item.type);
    console.log(
      `  ${typeColor(item.type.padEnd(8))} ${pc.bold(item.name)}${label}`
    );
  }

  // Show npm dependencies to install
  const npmDeps = collectNpmDeps(newItems);
  if (npmDeps.length > 0) {
    logger.break();
    logger.title("npm packages to install:");
    for (const dep of npmDeps) {
      logger.item(dep);
    }
  }

  // Confirm unless --yes
  if (!options.yes) {
    logger.break();
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: "Proceed with installation?",
      initial: true,
    });

    if (!proceed) {
      logger.info("Cancelled.");
      return;
    }
  }

  logger.break();

  // Copy files for each item
  const installedNames: string[] = [];
  const pagesWithRoutes: typeof newItems = [];

  for (const item of newItems) {
    const files = await copyItemFiles(item, cwd);
    if (files.length > 0) {
      await updateBarrelExport(item, cwd);
      installedNames.push(item.name);
      logger.success(`Added ${pc.bold(item.name)} (${files.length} files)`);

      // Track pages and blocks that need route wiring
      if (item.type === "page" && item.route) {
        pagesWithRoutes.push(item);
      }
    }
  }

  // Wire routes for page items
  if (pagesWithRoutes.length > 0) {
    logger.break();
    logger.info("Wiring routes...");
    for (const item of pagesWithRoutes) {
      if (item.route) {
        await wireRoute(cwd, item.route);
      }
    }
  }

  // Install npm dependencies
  if (npmDeps.length > 0) {
    logger.break();
    logger.info("Installing npm dependencies...");
    try {
      const pm = detectPackageManager(cwd);
      const installCmd =
        pm === "yarn"
          ? `yarn add ${npmDeps.join(" ")}`
          : pm === "pnpm"
            ? `pnpm add ${npmDeps.join(" ")}`
            : `npm install ${npmDeps.join(" ")}`;

      execSync(installCmd, { cwd, stdio: "pipe" });
      logger.success("Dependencies installed.");
    } catch {
      logger.warn(
        "Failed to install dependencies automatically. Install manually:"
      );
      logger.dim(`  npm install ${npmDeps.join(" ")}`);
    }
  }

  // Update frontier-fe.json
  await markInstalled(cwd, installedNames);

  logger.break();
  logger.success(
    `Done! Added ${pc.bold(String(installedNames.length))} item(s).`
  );
}

function detectPackageManager(cwd: string): "npm" | "yarn" | "pnpm" {
  if (existsSync(`${cwd}/pnpm-lock.yaml`)) return "pnpm";
  if (existsSync(`${cwd}/yarn.lock`)) return "yarn";
  return "npm";
}

function getTypeColor(type: string): (s: string) => string {
  switch (type) {
    case "ui":
      return pc.blue;
    case "feature":
      return pc.magenta;
    case "hook":
      return pc.yellow;
    case "page":
      return pc.green;
    case "layout":
      return pc.cyan;
    case "lib":
      return pc.gray;
    case "block":
      return pc.red;
    case "section":
      return pc.blue;
    default:
      return pc.white;
  }
}
