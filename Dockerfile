# ============================================
# Multi-stage Dockerfile for development and production
# ============================================
# Development:  docker compose --profile dev up
# Production:   docker compose --profile prod up --build

# Build arguments for flexibility
ARG NODE_VERSION=22.22.0
ARG NODE_ENV=production

# ============================================
# Stage 1: Base - Shared by all stages
# ============================================
FROM node:${NODE_VERSION}-alpine AS base

# Install bash for better script execution
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ============================================
# Stage 2: Dependencies - Cached layer
# ============================================
FROM base AS dependencies

# Install dependencies with legacy peer deps
# --prefer-offline: use local cache when available
# --no-audit: skip audit (faster builds)
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit

# ============================================
# Stage 3: Development - Hot reload enabled
# ============================================
FROM dependencies AS development

# Copy source code for hot reload
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Health check for dev server
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Start Vite dev server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host"]

# ============================================
# Stage 4: Builder - Production build
# ============================================
FROM base AS builder

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code and config
COPY . .

# Build the application
ARG NODE_ENV
RUN NODE_ENV=${NODE_ENV} npm run build:production

# ============================================
# Stage 5: Production - nginx static server
# ============================================
FROM nginx:alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /usr/share/nginx/html -s /sbin/nologin -G nginx -g nginx nginx

# Set ownership
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /var/run && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
