import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import type { Registry, RegistryItem } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRegistryPath(): string {
  // In development: packages/cli/registry/registry.json
  // In dist: packages/cli/dist/ -> ../registry/registry.json
  const candidates = [
    path.resolve(__dirname, "../../registry/registry.json"),
    path.resolve(__dirname, "../registry/registry.json"),
  ];
  for (const candidate of candidates) {
    if (fs.pathExistsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

let _registry: Registry | null = null;

export async function loadRegistry(): Promise<Registry> {
  if (_registry) return _registry;
  const registryPath = getRegistryPath();
  _registry = (await fs.readJSON(registryPath)) as Registry;
  return _registry;
}

export async function getItem(name: string): Promise<RegistryItem | undefined> {
  const registry = await loadRegistry();
  return registry.items.find((item) => item.name === name);
}

export async function getItemsByType(
  type: string
): Promise<RegistryItem[]> {
  const registry = await loadRegistry();
  return registry.items.filter((item) => item.type === type);
}

export async function getAllItems(): Promise<RegistryItem[]> {
  const registry = await loadRegistry();
  return registry.items;
}

/**
 * Resolve all registry dependencies recursively.
 * Returns items in dependency order (dependencies first).
 */
export async function resolveDependencies(
  names: string[]
): Promise<RegistryItem[]> {
  const registry = await loadRegistry();
  const resolved: RegistryItem[] = [];
  const seen = new Set<string>();

  async function resolve(name: string): Promise<void> {
    if (seen.has(name)) return;
    seen.add(name);

    const item = registry.items.find((i) => i.name === name);
    if (!item) {
      throw new Error(`Registry item "${name}" not found`);
    }

    // Resolve dependencies first
    if (item.registryDependencies) {
      for (const dep of item.registryDependencies) {
        await resolve(dep);
      }
    }

    resolved.push(item);
  }

  for (const name of names) {
    await resolve(name);
  }

  return resolved;
}

export function getTemplatesDir(): string {
  const candidates = [
    path.resolve(__dirname, "../../templates"),
    path.resolve(__dirname, "../templates"),
  ];
  for (const candidate of candidates) {
    if (fs.pathExistsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}
