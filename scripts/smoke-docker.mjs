import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "frontier-docker-"));
const log = path.join(workspace, "docker.log");
const cli = path.join(root, "packages/cli/dist/index.js");
const suffix = `${Date.now()}-${process.pid}`;
console.log(`Docker smoke workspace: ${workspace}`);
function run(command, args, cwd = root) {
  fs.appendFileSync(log, `$ ${command} ${args.join(" ")}\n`);
  const streaming = command === "docker" && args[0] === "build";
  const descriptor = streaming ? fs.openSync(log, "a") : undefined;
  let result;
  try {
    result = spawnSync(command, args, {
      cwd,
      encoding: "utf8",
      timeout: 900000,
      maxBuffer: 25 * 1024 * 1024,
      ...(streaming ? { stdio: ["ignore", descriptor, descriptor] } : {}),
    });
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
  }
  if (!streaming)
    fs.appendFileSync(log, `${result.stdout ?? ""}${result.stderr ?? ""}\n`);
  assert.equal(
    result.status,
    0,
    `Command failed: ${command} ${args.join(" ")}\n${result.stderr ?? result.error ?? ""}\nLog: ${log}`
  );
  return result.stdout?.trim() ?? "";
}
const docker = (...args) => run("docker", args);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const requested = process.argv
  .find((arg) => arg.startsWith("--scenario="))
  ?.slice("--scenario=".length);
assert.ok(
  !requested || ["showcase", "plain", "pwa"].includes(requested),
  "Unknown Docker scenario"
);
for (const scenario of requested ? [requested] : ["showcase", "plain", "pwa"]) {
  let cwd = root;
  if (scenario !== "showcase") {
    run(process.execPath, [
      cli,
      "init",
      scenario,
      "--cwd",
      workspace,
      "--yes",
      "--skip-install",
      ...(scenario === "pwa" ? ["--pwa"] : []),
    ]);
    cwd = path.join(workspace, scenario);
    assert.ok(
      !fs.existsSync(path.join(cwd, "package-lock.json")),
      "Exercise the fresh-scaffold install fallback"
    );
  }
  const image = `frontier-docker-smoke-${suffix}:${scenario}`;
  let container;
  console.log(`Building ${scenario}...`);
  try {
    run("docker", ["compose", "--profile", "prod", "config", "--quiet"], cwd);
    run("docker", [
      "build",
      "--progress=plain",
      "--target",
      "production",
      "--tag",
      image,
      cwd,
    ]);
    console.log(`Checking ${scenario} runtime...`);
    container = docker(
      "run",
      "--detach",
      "--read-only",
      "--tmpfs",
      "/tmp:rw,noexec,nosuid,size=64m,mode=1777",
      "--cap-drop",
      "ALL",
      "--security-opt",
      "no-new-privileges:true",
      "--health-interval=1s",
      "--health-start-period=0s",
      image
    );
    let healthy = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      const state = JSON.parse(docker("inspect", container))[0].State;
      assert.equal(
        state.Running,
        true,
        `Container exited: ${docker("logs", container)}`
      );
      if (state.Health.Status === "healthy") {
        healthy = true;
        break;
      }
      await delay(250);
    }
    assert.ok(
      healthy,
      `Container never became healthy: ${docker("logs", container)}`
    );
    docker("exec", container, "nginx", "-t");
    assert.notEqual(docker("exec", container, "id", "-u"), "0");
    const fetch = (url) =>
      docker("exec", container, "wget", "-qO-", `http://127.0.0.1:8080${url}`);
    const headers = (url) =>
      docker(
        "exec",
        container,
        "sh",
        "-c",
        `wget -S -O /dev/null http://127.0.0.1:8080${url} 2>&1 || true`
      );
    assert.equal(fetch("/health"), "healthy");
    const html = fetch("/index.html");
    assert.ok(html.includes('<div id="root">'));
    assert.equal(
      fetch("/dashboard"),
      html,
      "SPA deep link differs from index.html"
    );
    assert.match(headers("/index.html"), /Cache-Control:.*no-store/i);
    const asset = html.match(/(?:src|href)="(\/assets\/[^" ]+\.js)"/)[1];
    assert.ok(fetch(asset).length > 0);
    assert.match(headers(asset), /Cache-Control:.*immutable/i);
    assert.match(headers("/assets/nonexistent.js"), /404 Not Found/i);
    assert.match(headers("/.env"), /403 Forbidden/i);
    if (scenario === "pwa") {
      assert.ok(fetch("/sw.js").length > 0);
      assert.match(headers("/sw.js"), /Cache-Control:.*no-store/i);
      assert.ok(JSON.parse(fetch("/manifest.webmanifest")).name);
    }
    console.log(
      `PASS ${scenario}: unprivileged, read-only, healthy, SPA/assets/cache${scenario === "pwa" ? ", PWA" : ""}`
    );
  } finally {
    if (container) docker("rm", "--force", container);
    // Remove only images created by this run; shared build caches remain reusable.
    const result = spawnSync("docker", ["image", "rm", image], {
      encoding: "utf8",
    });
    fs.appendFileSync(log, `${result.stdout ?? ""}${result.stderr ?? ""}`);
  }
}
console.log(
  `PASS: showcase and generated plain/PWA Docker deployments. Log: ${log}`
);
