#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("frontier-fe")
  .description(
    "CLI for scaffolding React + Vite projects with production-ready components, features, and patterns"
  )
  .version("0.1.0");

program
  .command("init")
  .description("Initialize a new frontier-fe project")
  .argument("[project-name]", "Project name / target directory")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .option("--pm <packageManager>", "Package manager (npm, yarn, pnpm)")
  .action(async (projectName, opts) => {
    await init({
      cwd: path.resolve(opts.cwd),
      projectName,
      yes: opts.yes,
      pm: opts.pm,
    });
  });

program
  .command("add")
  .description("Add components, features, hooks, or pages to your project")
  .argument("[items...]", "Items to add (e.g. button input auth)")
  .option("-y, --yes", "Skip confirmation prompt")
  .option("-a, --all", "Add all items of the given type")
  .option(
    "-t, --type <type>",
    "Filter by type (ui, hook, feature, layout, page, lib)"
  )
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (items, opts) => {
    await add(items, {
      cwd: path.resolve(opts.cwd),
      all: opts.all,
      type: opts.type,
      yes: opts.yes,
      overwrite: opts.overwrite,
    });
  });

program
  .command("list")
  .description("List all available items in the registry")
  .option(
    "-t, --type <type>",
    "Filter by type (ui, hook, lib, layout, feature, page)"
  )
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (opts) => {
    await list({
      cwd: path.resolve(opts.cwd),
      type: opts.type,
    });
  });

program.parse();
