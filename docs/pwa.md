# PWA Support

This template supports an **optional** Progressive Web App setup via the `--pwa` flag on the `frontier-fe init` command. PWA makes the app **installable** and **offline-capable** (service worker + web manifest). It is opt-in because not every project (e.g. auth-gated internal tools) wants cached assets or an install prompt.

## Usage

```bash
npx frontier-fe init my-app --pwa
```

Non-PWA projects are completely unaffected — `--pwa` only changes what gets emitted at scaffold time. This repo's own build is never PWA unless you scaffold a new project with the flag.

## What `--pwa` adds

| Where                 | Change                                                               |
| --------------------- | -------------------------------------------------------------------- |
| `vite.config.ts`      | A `VitePWA({...})` plugin block (imported from `vite-plugin-pwa`)    |
| `package.json`        | `vite-plugin-pwa` devDependency                                      |
| `public/pwa/icon.svg` | A source app icon referenced by the manifest                         |
| `docker/nginx.conf`   | A `location = /sw.js` block that **never caches** the service worker |

The plugin is configured with:

- `registerType: "autoUpdate"` + `injectRegister: "auto"` — the service worker registers itself and fetches updates automatically. No edit to `main.tsx` or `index.html` is required; the manifest `<link>` and theme color are injected at build time.
- `manifest` — `name`/`short_name` default to the project name; `theme_color: "#2563eb"` (matches the `<meta name="theme-color">` already in `index.html`); a single SVG icon with `purpose: "any maskable"`.
- `workbox.globPatterns` — precaches the app shell (`js`, `css`, `html`, `svg`, `png`, `ico`, `woff2`).
- `devOptions.enabled: false` — the service worker does **not** run during `npm run dev` (avoids stale-cache confusion while developing). Test PWA behavior against a production build.

## Vite 8 note

`vite-plugin-pwa@1.3.0+` officially declares Vite 8 in its `peerDependencies`, so `npm install` is clean — no `--legacy-peer-deps` or `.npmrc` override is required.

## Testing

```bash
npm run build
npm run preview      # serves the production build (default port 4173)
```

Then open the preview URL and check:

- DevTools → **Application** → **Service Workers** shows an activated worker.
- DevTools → **Application** → **Manifest** resolves with the icon and theme color.
- Run **Lighthouse** → PWA audit for the full installability checklist.

## Why the service worker must not be cached

The base `nginx.conf` caches static assets (including `.js`) for 1 year with `immutable`. If `sw.js` were cached the same way, the browser would never fetch the updated service worker and **updates would silently stop reaching users**. The `location = /sw.js` block (an exact match, which beats the regex asset rule in nginx) forces `no-cache, no-store, must-revalidate` for the service worker only — all other hashed assets still benefit from long-term caching.

## Customizing

Edit the `VitePWA({ ... })` block in `vite.config.ts` to change the manifest, add runtime caching, or enable push notifications.

### Generating a full PNG icon set

The scaffold ships a single SVG icon, which modern Chromium accepts for installability. For maximum cross-browser fidelity (e.g. iOS home-screen icons), generate a complete PNG set from the SVG with `@vite-pwa/assets-generator` (not installed by default):

```bash
npm install -D @vite-pwa/assets-generator
# create a pwa-assets.config.ts pointing at your source SVG, then:
pwa-assets-generator
```

Add the generated PNGs to the `manifest.icons` array.

## Push notifications (recipe)

Push notifications are **not** bundled into `--pwa` because they require a backend (a VAPID signing key, a subscription database, and a send endpoint) that this frontend template cannot ship. This recipe covers the client half and the backend contract so you can wire push to your own server. It layers on top of the `--pwa` scaffold.

> Web Push requires HTTPS in production (and works on `localhost` in dev). A `push` event only reaches an **active** service worker, so the app must be opened/installed at least once.

### 1. Generate VAPID keys

VAPID keys authenticate your server to the browser push service. Generate a pair on your backend:

```bash
npx web-push generate-vapid-keys
```

Keep the **private key server-side only**. The **public key** is safe (and intended) to expose to the browser.

### 2. Expose the public key to the client

Add it as a `VITE_` env var (browser-exposed by design — it is a public key) and register it in your env config (e.g. `src/config/env.ts`):

```bash
# .env
VITE_VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY
```

```ts
// src/config/env.ts (add alongside the other env fields)
vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "",
```

### 3. Switch to a custom service worker

The `--pwa` scaffold uses `generateSW` (a plugin-generated worker). To handle `push` events you need a custom worker via the `injectManifest` strategy. Update the `VitePWA({...})` block in `vite.config.ts`:

```ts
VitePWA({
  strategies: "injectManifest",
  srcDir: "src",
  filename: "sw.ts",
  injectRegister: "auto",
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
  },
  manifest: { /* ...unchanged... */ },
}),
```

Then author `src/sw.ts` (precache the shell, handle `push` and notification clicks, keep the auto-update behavior):

```ts
/// <reference lib="webworker" />
import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
self.skipWaiting();
clientsClaim();

self.addEventListener("push", (event) => {
  const payload = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Notification", {
      body: payload.body,
      icon: "/pwa/icon.svg",
      badge: "/pwa/icon.svg",
      data: { url: payload.url ?? "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return (client as WindowClient).focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
```

> If your editor reports DOM/WebWorker type conflicts in `sw.ts`, give the worker a dedicated `tsconfig` (the `vite-plugin-pwa` docs cover this). `workbox-precaching` / `workbox-core` come transitively via `vite-plugin-pwa`; add them as devDependencies explicitly if a type is missing.

### 4. Subscribe the user

Request permission on a **user action** (e.g. an "Enable notifications" button) — never on page load:

```ts
import { api } from "@/lib";
import { env } from "@/config";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export async function subscribeToPush(): Promise<void> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(env.vapidPublicKey),
  });

  // Send the subscription to your backend so it can push later.
  await api.post("/notifications/subscribe", subscription.toJSON());
}
```

### 5. Backend contract (required)

Until this exists, the client subscribes successfully but nothing is ever delivered. Your server must provide:

- **`POST /notifications/subscribe`** — store the subscription JSON for the authenticated user:
  ```json
  {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "expirationTime": null,
    "keys": { "p256dh": "...", "auth": "..." }
  }
  ```
- **A send path** — load subscriptions and dispatch with [`web-push`](https://www.npmjs.com/package/web-push):

  ```js
  import webpush from "web-push";

  webpush.setVAPIDDetails(
    "mailto:you@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  await webpush.sendNotification(
    storedSubscription,
    JSON.stringify({ title: "Hello", body: "From the server", url: "/" })
  );
  ```

### Testing

- Set `VITE_VAPID_PUBLIC_KEY`, start `npm run dev`, and call `subscribeToPush()` from a button.
- To test without a backend: Chrome DevTools → **Application** → **Service Workers** → click **Push** to synthesize a `push` event.
- For an end-to-end check, POST a payload to the stored `endpoint` (or call your send path).

## Out of scope

Background sync is intentionally **not** wired in. Add it later in `src/sw.ts` via the `sync` event. (Push notifications are covered in the recipe above.)
