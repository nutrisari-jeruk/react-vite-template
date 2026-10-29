import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});
describe("mock mode configuration", () => {
  it.each([undefined, "", "false", "1", "TRUE"])(
    "defaults to backend for flag %s",
    async (flag) => {
      vi.resetModules();
      vi.stubEnv("DEV", true);
      vi.stubEnv("VITE_ENABLE_MOCKS", flag);
      const { env } = await import("./env");
      expect(env.enableMocks).toBe(false);
    }
  );
  it("enables mocks only with an explicit development opt-in", async () => {
    vi.resetModules();
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_ENABLE_MOCKS", "true");
    const { env } = await import("./env");
    expect(env.enableMocks).toBe(true);
  });
  it("ignores the opt-in in production", async () => {
    vi.resetModules();
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_ENABLE_MOCKS", "true");
    const { env } = await import("./env");
    expect(env.enableMocks).toBe(false);
  });
  it("does not enable mocks through the unused legacy flag", async () => {
    vi.resetModules();
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_ENABLE_MOCKS", undefined);
    vi.stubEnv("VITE_ENABLE_MSW", "true");
    const { env } = await import("./env");
    expect(env.enableMocks).toBe(false);
  });
});
