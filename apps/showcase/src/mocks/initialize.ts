import { env } from "@/config/env";

function isMockWorker(worker: ServiceWorker | null): boolean {
  if (!worker) return false;
  const url = new URL(worker.scriptURL, window.location.origin);
  return (
    url.origin === window.location.origin &&
    url.pathname === "/mockServiceWorker.js"
  );
}

/** Return false when a reload is required: callers must not mount the app yet. */
export async function initializeMocks(): Promise<boolean> {
  if (import.meta.env.DEV && env.enableMocks) {
    const { startMockWorker } = await import("./browser");
    await startMockWorker();
    return true;
  }

  if (typeof navigator === "undefined" || !navigator.serviceWorker) return true;
  const serviceWorker = navigator.serviceWorker;
  const registrations = await serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map(async (registration) => {
      // An existing PWA registration is not ours to remove, even during an update.
      const worker =
        registration.active ?? registration.waiting ?? registration.installing;
      if (isMockWorker(worker)) await registration.unregister();
    })
  );

  // Unregister does not release control of the current document. Reload before
  // mounting React so no application requests can reach a stale interceptor.
  if (isMockWorker(serviceWorker.controller)) {
    window.location.reload();
    return false;
  }
  return true;
}
