import fs from "fs-extra";
import path from "path";
import type { FrontierConfig } from "../types.js";
import { DEFAULT_CONFIG } from "../types.js";

const CONFIG_FILE = "frontier-fe.json";

export function getConfigPath(cwd: string): string {
  return path.resolve(cwd, CONFIG_FILE);
}

export async function configExists(cwd: string): Promise<boolean> {
  return fs.pathExists(getConfigPath(cwd));
}

export async function readConfig(cwd: string): Promise<FrontierConfig> {
  const configPath = getConfigPath(cwd);
  if (await fs.pathExists(configPath)) {
    const raw = await fs.readJSON(configPath);
    return { ...DEFAULT_CONFIG, ...raw };
  }
  return { ...DEFAULT_CONFIG };
}

export async function writeConfig(
  cwd: string,
  config: FrontierConfig
): Promise<void> {
  const configPath = getConfigPath(cwd);
  await fs.writeJSON(configPath, config, { spaces: 2 });
}

export async function markInstalled(
  cwd: string,
  names: string[]
): Promise<void> {
  const config = await readConfig(cwd);
  const installed = new Set(config.installed);
  for (const name of names) {
    installed.add(name);
  }
  config.installed = [...installed].sort();
  await writeConfig(cwd, config);
}

export async function isInstalled(
  cwd: string,
  name: string
): Promise<boolean> {
  const config = await readConfig(cwd);
  return config.installed.includes(name);
}
