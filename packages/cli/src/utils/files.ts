import fs from "fs-extra";
import path from "path";
import type { RegistryItem } from "../types.js";
import { getTemplatesDir } from "./registry.js";
import { logger } from "./logger.js";

/**
 * Copy template files for a registry item into the target project.
 */
export async function copyItemFiles(
  item: RegistryItem,
  targetDir: string
): Promise<string[]> {
  const templatesDir = getTemplatesDir();
  const copiedFiles: string[] = [];

  for (const file of item.files) {
    const sourcePath = path.resolve(templatesDir, file.source.replace("templates/", ""));
    const targetPath = path.resolve(targetDir, file.target);

    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetPath));

    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath, { overwrite: false });
      copiedFiles.push(file.target);
    } else {
      logger.warn(`Template file not found: ${file.source}`);
    }
  }

  return copiedFiles;
}

/**
 * Update a barrel export file (index.ts) by appending new exports.
 */
export async function updateBarrelExport(
  item: RegistryItem,
  targetDir: string
): Promise<void> {
  if (!item.barrel) return;

  const barrelPath = path.resolve(targetDir, item.barrel.file);
  await fs.ensureDir(path.dirname(barrelPath));

  let content = "";
  if (await fs.pathExists(barrelPath)) {
    content = await fs.readFile(barrelPath, "utf-8");
  }

  const newExports: string[] = [];
  for (const exportLine of item.barrel.exports) {
    if (!content.includes(exportLine)) {
      newExports.push(exportLine);
    }
  }

  if (newExports.length > 0) {
    const suffix = content.endsWith("\n") || content === "" ? "" : "\n";
    content += suffix + newExports.join("\n") + "\n";
    await fs.writeFile(barrelPath, content, "utf-8");
  }
}

/**
 * Collect all npm dependencies from a list of registry items.
 */
export function collectNpmDeps(items: RegistryItem[]): string[] {
  const deps = new Set<string>();
  for (const item of items) {
    if (item.npmDependencies) {
      for (const dep of item.npmDependencies) {
        deps.add(dep);
      }
    }
  }
  return [...deps].sort();
}
