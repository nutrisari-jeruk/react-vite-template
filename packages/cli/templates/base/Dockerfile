# Development: docker compose --profile dev up
# Production:  docker compose --profile prod up --build
ARG NODE_VERSION=22.22.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dependencies
# Vite/TypeScript are needed at build time, even for production images.
# Fresh CLI scaffolds may not have a lockfile until their first installation.
RUN if [ -f package-lock.json ]; then \
      HUSKY=0 npm ci --include=dev --legacy-peer-deps --no-audit; \
    else \
      HUSKY=0 npm install --include=dev --legacy-peer-deps --no-audit; \
    fi

FROM dependencies AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 5173
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:5173/ || exit 1
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM dependencies AS builder
COPY . .
# Vite embeds these public values into the bundle; runtime env cannot change them.
ARG VITE_APP_ENV=production
ARG VITE_API_URL=/api
ENV VITE_APP_ENV=${VITE_APP_ENV} VITE_API_URL=${VITE_API_URL}
# Both the showcase and generated projects provide this script.
RUN npm run build

FROM nginx:alpine AS production
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
# The official image already provides this user. Nginx writes only under /tmp.
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
