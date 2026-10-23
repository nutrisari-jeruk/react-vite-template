/**
 * MSW Browser Worker
 *
 * Initializes MSW for browser environment during development.
 */

import { env } from "@/config/env";
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// Create MSW worker for browser
export const worker = setupWorker(...handlers);

// Start the worker
export async function startMockWorker() {
  // Only start in development
  if (import.meta.env.DEV && env.enableMocks) {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
  }
}
