import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";

const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(root, "packages/cli/dist/index.js");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "frontier-smoke-"));
const log = path.join(temp, "commands.log");
console.log(`CLI smoke workspace: ${temp}`);
function run(command, args, cwd = temp, expected = 0, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
    maxBuffer: 20 * 1024 * 1024,
    timeout: 180000,
  });
  fs.appendFileSync(
    log,
    `\n$ ${command} ${args.join(" ")} (${cwd})\n${result.stdout ?? ""}${result.stderr ?? ""}`
  );
  if (result.status !== expected)
    throw new Error(
      `Expected exit ${expected}, received ${result.status}: ${command} ${args.join(" ")}\n${(result.stdout ?? "") + (result.stderr ?? "")}\nFull log: ${log}`
    );
  return result;
}
function command(args) {
  return run(process.execPath, [cli, ...args]);
}
const supplied = process.argv
  .find((arg) => arg.startsWith("--dependencies="))
  ?.slice("--dependencies=".length);
let dependencies;
if (supplied) {
  dependencies = path.resolve(supplied);
  assert.ok(
    fs.existsSync(path.join(dependencies, "vite-plugin-pwa")),
    "Shared dependencies must include vite-plugin-pwa"
  );
} else {
  // A fresh PWA scaffold supplies the superset of dependencies for every fixture.
  // Install once; each fixture has its own sources, manifest, output and tests.
  command(["init", "dependencies", "--cwd", temp, "--pwa", "--yes"]);
  dependencies = path.join(temp, "dependencies/node_modules");
}
const cases = [
  { name: "base", items: [] },
  { name: "auth", items: ["auth"] },
  {
    name: "auth-pages",
    items: [
      "login",
      "register",
      "otp",
      "forget-password",
      "reset-password",
      "dashboard",
    ],
  },
  { name: "ui", items: ["--all", "--type", "ui"] },
  ...["login-split", "login-centered", "login-minimal"].map((name) => ({
    name,
    items: [`block:${name}`],
  })),
  { name: "pwa", items: [], pwa: true },
];
for (const scenario of cases) {
  console.log(`Checking ${scenario.name}...`);
  command([
    "init",
    scenario.name,
    "--cwd",
    temp,
    "--yes",
    "--skip-install",
    ...(scenario.pwa ? ["--pwa"] : []),
  ]);
  const cwd = path.join(temp, scenario.name);
  const manifest = JSON.parse(
    fs.readFileSync(path.join(cwd, "package.json"), "utf8")
  );
  assert.equal(manifest.dependencies.axios, "1.19.0");
  assert.ok(manifest.devDependencies.vitest);
  fs.symlinkSync(dependencies, path.join(cwd, "node_modules"), "dir");
  if (scenario.items.length) {
    const args = [
      "add",
      ...scenario.items,
      "--cwd",
      cwd,
      "--yes",
      "--skip-install",
    ];
    command(args);
    const first = fs.readFileSync(path.join(cwd, "src/app/router.tsx"), "utf8");
    command(args);
    assert.equal(
      fs.readFileSync(path.join(cwd, "src/app/router.tsx"), "utf8"),
      first,
      "Repeated add changed routes"
    );
  }
  fs.writeFileSync(
    path.join(cwd, "src/scaffold.test.tsx"),
    `import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
it("runs scaffold setup and DOM matchers", () => {render(<button>Scaffold ready</button>); expect(screen.getByRole("button")).toBeInTheDocument();});\n`
  );
  run("npm", ["run", "type-check"], cwd);
  run("npm", ["run", "test:run"], cwd);
  run("npm", ["run", "build"], cwd);
  if (scenario.name === "auth")
    assert.ok(
      !fs.existsSync(path.join(cwd, "src/app/routes/Login.tsx")),
      "Auth feature unexpectedly installed pages"
    );
  if (scenario.name.startsWith("login-"))
    assert.ok(
      fs
        .readFileSync(path.join(cwd, "src/app/router.tsx"), "utf8")
        .includes('path: "/login"')
    );
  const worker = fs.existsSync(path.join(cwd, "dist/sw.js"));
  assert.equal(worker, !!scenario.pwa);
  if (scenario.pwa) {
    assert.ok(fs.existsSync(path.join(cwd, "dist/manifest.webmanifest")));
    assert.ok(
      fs
        .readFileSync(path.join(cwd, "docker/nginx.conf"), "utf8")
        .includes("location = /sw.js")
    );
  }
}
// Exercise the real CLI failure path without contacting a package registry.
const bin = path.join(temp, "failing-bin");
fs.mkdirSync(bin);
fs.writeFileSync(path.join(bin, "npm"), "#!/bin/sh\nexit 23\n", {
  mode: 0o755,
});
run(
  process.execPath,
  [cli, "init", "failed-install", "--cwd", temp, "--yes", "--pm", "npm"],
  temp,
  1,
  { PATH: `${bin}${path.delimiter}${process.env.PATH}` }
);
const failure = JSON.parse(
  fs.readFileSync(path.join(temp, "failed-install/package.json"), "utf8")
);
assert.equal(failure.dependencies.axios, "1.19.0");
console.log(
  `PASS: ${cases.length} scaffold scenarios, idempotent add, manifest persistence and install failure. Logs: ${log}`
);
