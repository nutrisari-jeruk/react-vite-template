export type ItemType = "ui" | "feature" | "hook" | "page" | "layout" | "lib";

export interface RegistryFile {
  source: string;
  target: string;
}

export interface BarrelExport {
  file: string;
  exports: string[];
}

export interface RegistryItem {
  name: string;
  type: ItemType;
  description: string;
  files: RegistryFile[];
  npmDependencies?: string[];
  registryDependencies?: string[];
  barrel?: BarrelExport;
}

export interface Registry {
  $schema?: string;
  version: string;
  items: RegistryItem[];
}

export interface FrontierConfig {
  $schema?: string;
  name: string;
  aliases: {
    ui: string;
    components: string;
    hooks: string;
    lib: string;
    utils: string;
    features: string;
  };
  installed: string[];
}

export const DEFAULT_CONFIG: FrontierConfig = {
  name: "my-app",
  aliases: {
    ui: "@/components/ui",
    components: "@/components",
    hooks: "@/hooks",
    lib: "@/lib",
    utils: "@/utils",
    features: "@/features",
  },
  installed: [],
};
