# Docker Deployment

The same Dockerfile supports the showcase and generated plain/PWA projects. Production runs the existing `nginx` image user on **container port 8080**, with a read-only root filesystem and writable `/tmp`. Compose continues publishing **host port 80** by default.

## Commands

```bash
# Development with source mounts and Vite on port 5173
docker compose --profile dev up --build

# Production; use a separate project name if another stack is already running
docker compose --profile prod up --build

# Publish on host port 8081 instead of 80
PROD_PORT=8081 docker compose --profile prod up --build

# Validate the rendered Compose configuration
docker compose --profile prod config --quiet
```

The deployment helper remains available: `./deploy.sh -a build`, `./deploy.sh --build`, `./deploy.sh -a down`, `./deploy.sh -a restart`, and `./deploy.sh -a ps`.

## Build and environment

The stages are `base → dependencies → builder → production`; `development` also inherits the cached dependency stage.

- Dependencies include build tooling. With a package-lock.json, the image runs `npm ci`; a fresh scaffold without a lockfile uses `npm install`. Commit the generated lockfile for reproducible subsequent builds. Both commands retain the template’s existing `--legacy-peer-deps` resolution policy. Husky is disabled during image installation because Git metadata is excluded from the build context.
- The builder runs `npm run build`, which exists in both the showcase and CLI-generated manifests. Vite's default build mode is production.
- `VITE_APP_ENV` and `VITE_API_URL` are public **build arguments**, embedded into the browser bundle. Compose forces `VITE_APP_ENV=production` and forwards `VITE_API_URL` from the shell or Compose .env, defaulting to `/api`. Runtime container environment variables cannot reconfigure an existing bundle.
- Set `VITE_API_URL=https://your-api.example/api` before building to call an external backend. A relative `/api` requires your deployment gateway to route API traffic to the backend; this static frontend container does not provide an API proxy.
- `.env` and local environment files are excluded from the image context. Other public Vite settings can be supplied in an environment-specific file such as `.env.production`. Never put secrets into VITE-prefixed values.

## Runtime and Nginx

`docker/nginx.conf` is a **complete main configuration**, copied to `/etc/nginx/nginx.conf`. It is not an HTTP server fragment for conf.d. The official image's existing nginx user is reused; there is no duplicate user/group creation.

Nginx places its PID and temporary files under `/tmp`. Compose mounts `/tmp` as a 64 MB tmpfs with mode 1777; the rest of the root filesystem is read-only. Access/error logs go to stdout/stderr. The container health check requests `http://127.0.0.1:8080/health`.

- `/health` returns HTTP 200 and `healthy`.
- SPA paths fall back to index.html; HTML is not stored in caches.
- Static assets retain their cache policy. Missing asset files return 404 instead of the SPA document.
- Generated PWA configurations retain the exact `/sw.js` location with no-store/no-cache headers, overriding the JavaScript cache rule.
- The image serves HTTP. Configure TLS and any HSTS policy at the external gateway.

Existing integrations that map a port directly to **container port 80** must change their target to **8080**. The `PROD_PORT` host-port setting is unchanged.

## Regression checks

```bash
npm run cli:build
npm run sync:templates:check
npm run smoke:docker

# Repeat only one scenario during diagnosis
npm run smoke:docker -- --scenario=pwa
```

The smoke test builds the showcase plus fresh CLI-generated plain and PWA projects. It validates Compose and Nginx, waits for container health, checks the non-root identity, SPA deep links, real JavaScript assets, HTML/asset caching, missing-file errors and PWA output. Test containers have a read-only root, writable tmpfs, no Linux capabilities, and no published host ports. Containers and tagged test images are removed afterward; build caches and temporary logs remain for diagnosis.

CI and the CLI publish workflow run this test before release.
