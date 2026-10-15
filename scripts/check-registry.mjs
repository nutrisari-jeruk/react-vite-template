import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(root, "packages/cli");
const registry = JSON.parse(
  fs.readFileSync(path.join(cli, "registry/registry.json"), "utf8")
);
const items = new Map(registry.items.map((item) => [item.name, item]));
const init = fs.readFileSync(path.join(cli, "src/commands/init.ts"), "utf8");
const entries = [
  ...init
    .match(/const BASE_FILES = \[([\s\S]*?)\];/)[1]
    .matchAll(/\{\s*source:\s*"([^"]+)",\s*target:\s*"([^"]+)"/g),
];
const base = new Map(
  entries.map(([, source, target]) => [
    target,
    fs.readFileSync(path.join(cli, "templates", source), "utf8"),
  ])
);
const errors = new Set();
function resolveItem(name, visiting = new Set(), done = new Set()) {
  if (visiting.has(name))
    throw new Error(
      `Registry dependency cycle: ${[...visiting, name].join(" -> ")}`
    );
  if (done.has(name)) return done;
  const item = items.get(name);
  if (!item) throw new Error(`Missing registry dependency: ${name}`);
  const next = new Set([...visiting, name]);
  for (const dep of item.registryDependencies ?? [])
    resolveItem(dep, next, done);
  done.add(name);
  return done;
}
function resolves(files, from, specifier) {
  const target = specifier.startsWith("@/")
    ? `src/${specifier.slice(2)}`
    : path.posix.normalize(
        path.posix.join(path.posix.dirname(from), specifier)
      );
  return [
    target,
    `${target}.ts`,
    `${target}.tsx`,
    `${target}/index.ts`,
    `${target}/index.tsx`,
  ].some((candidate) => files.has(candidate));
}
for (const item of registry.items) {
  try {
    const files = new Map(base);
    for (const name of resolveItem(item.name)) {
      const dep = items.get(name);
      for (const file of dep.files) {
        const source = path.join(cli, file.source);
        if (!fs.existsSync(source))
          throw new Error(`Missing template: ${file.source}`);
        // Verify case as well as existence on case-insensitive development filesystems.
        if (
          !fs.readdirSync(path.dirname(source)).includes(path.basename(source))
        )
          throw new Error(`Template case mismatch: ${file.source}`);
        files.set(file.target, fs.readFileSync(source, "utf8"));
      }
      if (dep.barrel)
        files.set(
          dep.barrel.file,
          (files.get(dep.barrel.file) ?? "") +
            "\n" +
            dep.barrel.exports.join("\n")
        );
    }
    for (const [target, content] of files) {
      if (!/\.[jt]sx?$/.test(target)) continue;
      const ast = ts.createSourceFile(
        target,
        content,
        ts.ScriptTarget.Latest,
        true
      );
      for (const node of ast.statements) {
        if (
          !(ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) ||
          !node.moduleSpecifier ||
          !ts.isStringLiteral(node.moduleSpecifier)
        )
          continue;
        const specifier = node.moduleSpecifier.text;
        if (
          (specifier.startsWith("@/") || specifier.startsWith(".")) &&
          !resolves(files, target, specifier)
        )
          errors.add(
            `${item.name}: ${target} imports unavailable ${specifier}`
          );
      }
    }
  } catch (error) {
    errors.add(error.message);
  }
}
if (errors.size) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else
  console.log(
    `Registry validated: ${items.size} items, including transitive local imports and template casing.`
  );
