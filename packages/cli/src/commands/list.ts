import pc from "picocolors";
import { logger } from "../utils/logger.js";
import { getAllItems } from "../utils/registry.js";
import { readConfig, configExists } from "../utils/config.js";
import type { ItemType } from "../types.js";

interface ListOptions {
  cwd: string;
  type?: string;
}

const TYPE_ORDER: ItemType[] = ["ui", "hook", "lib", "layout", "feature", "page"];

const TYPE_LABELS: Record<ItemType, string> = {
  ui: "UI Components",
  hook: "Hooks",
  lib: "Libraries",
  layout: "Layouts",
  feature: "Features",
  page: "Pages",
};

export async function list(options: ListOptions): Promise<void> {
  const items = await getAllItems();

  // Get installed items if config exists
  let installedSet = new Set<string>();
  if (await configExists(options.cwd)) {
    const config = await readConfig(options.cwd);
    installedSet = new Set(config.installed);
  }

  // Filter by type if specified
  const filteredItems = options.type
    ? items.filter((i) => i.type === options.type)
    : items;

  if (filteredItems.length === 0) {
    logger.info(
      options.type
        ? `No items found for type "${options.type}".`
        : "No items found in registry."
    );
    return;
  }

  // Group by type
  const grouped = new Map<string, typeof items>();
  for (const item of filteredItems) {
    const group = grouped.get(item.type) || [];
    group.push(item);
    grouped.set(item.type, group);
  }

  logger.break();
  logger.title(pc.bold("Available items"));
  logger.break();

  // Display in order
  const types = options.type
    ? [options.type]
    : TYPE_ORDER.filter((t) => grouped.has(t));

  for (const type of types) {
    const group = grouped.get(type);
    if (!group) continue;

    const label = TYPE_LABELS[type as ItemType] || type;
    console.log(pc.bold(pc.underline(label)));
    logger.break();

    for (const item of group) {
      const installed = installedSet.has(item.name);
      const status = installed ? pc.green(" ✓") : "  ";
      const name = pc.bold(item.name.padEnd(24));
      const desc = pc.dim(item.description);
      console.log(`  ${status} ${name} ${desc}`);
    }
    logger.break();
  }

  // Summary
  const total = filteredItems.length;
  const installedCount = filteredItems.filter((i) =>
    installedSet.has(i.name)
  ).length;

  if (installedSet.size > 0) {
    logger.dim(
      `${installedCount}/${total} installed ` +
        pc.green("✓") +
        pc.dim(" = installed")
    );
  } else {
    logger.dim(`${total} items available`);
  }

  logger.break();
  logger.dim(
    "Usage: " +
      pc.cyan("frontier-fe add <name>") +
      pc.dim("  |  ") +
      pc.cyan("frontier-fe add ui --all")
  );
  logger.break();
}
