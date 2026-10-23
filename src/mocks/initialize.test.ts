import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initializeMocks } from "./initialize";

const mocks = vi.hoisted(() => ({
  env: { enableMocks: false },
  start: vi.fn(),
  reload: vi.fn(),
}));
vi.mock("@/config/env", () => ({ env: mocks.env }));
vi.mock("./browser", () => ({ startMockWorker: mocks.start }));
const locationDescriptor = Object.getOwnPropertyDescriptor(window, "location")!;
function registration(
  url: string,
  state: "active" | "waiting" | "installing" = "active"
) {
  return {
    active: null as { scriptURL: string } | null,
    waiting: null as { scriptURL: string } | null,
    installing: null as { scriptURL: string } | null,
    [state]: { scriptURL: url },
    unregister: vi.fn().mockResolvedValue(true),
  };
}
function serviceWorkers(
  registrations: ReturnType<typeof registration>[],
  controller: { scriptURL: string } | null = null
) {
  const container = {
    getRegistrations: vi.fn().mockResolvedValue(registrations),
    controller,
  };
  vi.stubGlobal("navigator", { serviceWorker: container });
  return container;
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.env.enableMocks = false;
  mocks.start.mockResolvedValue(undefined);
  vi.stubEnv("DEV", true);
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { origin: "http://localhost", reload: mocks.reload },
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  Object.defineProperty(window, "location", locationDescriptor);
});
describe("mock startup and worker cleanup", () => {
  it("waits for the opted-in worker before allowing rendering", async () => {
    mocks.env.enableMocks = true;
    let ready!: () => void;
    mocks.start.mockReturnValue(
      new Promise<void>((resolve) => {
        ready = resolve;
      })
    );
    const pending = initializeMocks();
    await vi.waitFor(() => expect(mocks.start).toHaveBeenCalledOnce());
    ready();
    await expect(pending).resolves.toBe(true);
  });
  it("propagates worker startup failure instead of silently switching to backend", async () => {
    mocks.env.enableMocks = true;
    mocks.start.mockRejectedValue(new Error("worker missing"));
    await expect(initializeMocks()).rejects.toThrow("worker missing");
  });
  it("never starts MSW in production, even with an enabled configuration", async () => {
    vi.stubEnv("DEV", false);
    mocks.env.enableMocks = true;
    serviceWorkers([]);
    await expect(initializeMocks()).resolves.toBe(true);
    expect(mocks.start).not.toHaveBeenCalled();
  });
  it("works without the service-worker API", async () => {
    vi.stubGlobal("navigator", {});
    await expect(initializeMocks()).resolves.toBe(true);
    expect(mocks.start).not.toHaveBeenCalled();
  });
  it("preserves unrelated workers and PWA registrations", async () => {
    const pwa = registration("http://localhost/sw.js"),
      foreign = registration("https://other.example/mockServiceWorker.js");
    serviceWorkers([pwa, foreign], { scriptURL: "http://localhost/sw.js" });
    await expect(initializeMocks()).resolves.toBe(true);
    expect(pwa.unregister).not.toHaveBeenCalled();
    expect(foreign.unregister).not.toHaveBeenCalled();
    expect(mocks.reload).not.toHaveBeenCalled();
  });
  it.each(["active", "waiting", "installing"] as const)(
    "removes a stale %s MSW registration only",
    async (state) => {
      const msw = registration(
          "http://localhost/mockServiceWorker.js?version=old",
          state
        ),
        pwa = registration("http://localhost/sw.js");
      serviceWorkers([msw, pwa]);
      await expect(initializeMocks()).resolves.toBe(true);
      expect(msw.unregister).toHaveBeenCalledOnce();
      expect(pwa.unregister).not.toHaveBeenCalled();
      expect(mocks.start).not.toHaveBeenCalled();
    }
  );
  it("preserves an active PWA when a different worker is waiting", async () => {
    const pwa = registration("http://localhost/sw.js");
    pwa.waiting = { scriptURL: "http://localhost/mockServiceWorker.js" };
    serviceWorkers([pwa]);
    await initializeMocks();
    expect(pwa.unregister).not.toHaveBeenCalled();
  });
  it("waits for unregister then reloads before permitting application requests", async () => {
    const msw = registration("http://localhost/mockServiceWorker.js");
    let unregistered!: (value: boolean) => void;
    msw.unregister.mockReturnValue(
      new Promise<boolean>((resolve) => {
        unregistered = resolve;
      })
    );
    serviceWorkers([msw], {
      scriptURL: "http://localhost/mockServiceWorker.js",
    });
    const pending = initializeMocks();
    await vi.waitFor(() => expect(msw.unregister).toHaveBeenCalledOnce());
    expect(mocks.reload).not.toHaveBeenCalled();
    unregistered(true);
    await expect(pending).resolves.toBe(false);
    expect(mocks.reload).toHaveBeenCalledOnce();
  });
  it("releases stale control even when another tab already unregistered the worker", async () => {
    serviceWorkers([], { scriptURL: "http://localhost/mockServiceWorker.js" });
    await expect(initializeMocks()).resolves.toBe(false);
    expect(mocks.reload).toHaveBeenCalledOnce();
  });
  it("propagates cleanup failure so the app can stop before rendering", async () => {
    const msw = registration("http://localhost/mockServiceWorker.js");
    msw.unregister.mockRejectedValue(new Error("denied"));
    serviceWorkers([msw]);
    await expect(initializeMocks()).rejects.toThrow("denied");
    expect(mocks.reload).not.toHaveBeenCalled();
  });
});
