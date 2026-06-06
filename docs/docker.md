# Docker Deployment

## Overview

Multi-stage Docker setup with profiles for development and production environments.

## Commands

```bash
# Development (hot reload, source mounted)
docker compose --profile dev up

# Production (nginx, optimized build)
docker compose --profile prod up --build

# Deploy script (production only)
./deploy.sh                    # Start production
./deploy.sh -a build           # Build images
./deploy.sh -a down            # Stop services
./deploy.sh -a logs            # View logs
./deploy.sh -a restart -f      # Force restart
./deploy.sh -a ps              # Container status
```

## Architecture

### Multi-stage Dockerfile

```
base → dependencies → development → builder → production
```

- **base** — Shared Alpine image, copies `package.json`
- **dependencies** — Runs `npm ci` (cached layer)
- **development** — Copies source, exposes 5173, runs Vite dev server
- **builder** — Runs `npm run build:production` to produce `dist/`
- **production** — nginx:alpine serving static files from builder

### Docker Compose Profiles

Single `docker-compose.yml` with two profiles:

| Profile | Service    | Purpose                           |
| ------- | ---------- | --------------------------------- |
| `dev`   | `app-dev`  | Hot reload, source mounted        |
| `prod`  | `app-prod` | nginx, optimized, resource limits |

### Deploy Script Options

| Option          | Description                                    |
| --------------- | ---------------------------------------------- |
| `-a, --action`  | `build`, `up`, `down`, `restart`, `logs`, `ps` |
| `-p, --port`    | Override production port                       |
| `-n, --name`    | Override project name                          |
| `-b, --build`   | Rebuild images before starting                 |
| `-f, --force`   | Force recreation of containers                 |
| `-v, --verbose` | Enable verbose output                          |

## Key Files

| File                 | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `Dockerfile`         | Multi-stage build for dev and prod                    |
| `docker-compose.yml` | Single file with `dev`/`prod` profiles                |
| `docker/nginx.conf`  | Production nginx config (HTTP/2, security headers)    |
| `deploy.sh`          | Production deployment script                          |
| `.dockerignore`      | Excludes node_modules, dist, .git, etc.               |
| `.env.example`       | Docker vars (`PROJECT_NAME`, `DEV_PORT`, `PROD_PORT`) |

## Environment Variables

```bash
# Docker Compose
PROJECT_NAME=frontier-fe
DEV_PORT=5173
PROD_PORT=80
PROD_MEMORY_LIMIT=512M
PROD_CPU_LIMIT=1.0
PROD_MEMORY_RESERVATION=128M
PROD_CPU_RESERVATION=0.25
```

## Production Features

- Non-root nginx user
- Read-only root filesystem
- Resource limits (memory, CPU)
- Security headers (CSP, HSTS, X-Frame-Options)
- Rate limiting (API: 30r/s, auth: 5r/s)
- tmpfs for nginx cache and runtime
- Health checks on both dev and prod containers

## Related Documentation

- [Project Configuration](./project-configuration.md)
- [Security](./security.md)
