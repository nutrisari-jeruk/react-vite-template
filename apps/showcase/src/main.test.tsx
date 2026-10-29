import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ initialize: vi.fn(), render: vi.fn() }));
vi.mock("@/mocks/initialize", () => ({ initializeMocks: mocks.initialize }));
vi.mock("react-dom/client", () => ({
  createRoot: () => ({ render: mocks.render }),
}));
vi.mock("@/app", () => ({ App: () => null }));
vi.mock("@/components/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: ReactNode }) => children,
}));
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  document.body.innerHTML = '<div id="root"></div>';
});
afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
it("renders only after initialization completes", async () => {
  let complete!: (ready: boolean) => void;
  mocks.initialize.mockReturnValue(
    new Promise<boolean>((resolve) => {
      complete = resolve;
    })
  );
  await import("./main");
  expect(mocks.render).not.toHaveBeenCalled();
  complete(true);
  await vi.waitFor(() => expect(mocks.render).toHaveBeenCalledOnce());
});
it("does not render while a stale controller requires reload", async () => {
  mocks.initialize.mockResolvedValue(false);
  await import("./main");
  expect(mocks.render).not.toHaveBeenCalled();
});
it("shows a startup error instead of sending requests after failed initialization", async () => {
  mocks.initialize.mockRejectedValue(new Error("worker failed"));
  vi.spyOn(console, "error").mockImplementation(() => {});
  await import("./main");
  await vi.waitFor(() =>
    expect(document.querySelector('[role="alert"]')).toHaveTextContent(
      "Unable to start"
    )
  );
  expect(mocks.render).not.toHaveBeenCalled();
});
