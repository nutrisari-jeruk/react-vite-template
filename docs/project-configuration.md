# Project Configuration

## Overview

This document covers the configuration files and environment setup.

## Environment Variables

### Configuration File

Environment variables are defined in `.env` files:

```bash
# .env.example - Template
VITE_APP_NAME=React App
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

### Environment Files

| File | Purpose |
|------|---------|
| `.env` | Local development |
| `.env.example` | Template (committed) |
| `.env.staging` | Staging builds |
| `.env.production` | Production builds |

### Type-Safe Configuration

```typescript
// src/config/env.ts
export interface EnvConfig {
  appName: string;
  appUrl: string;
  appEnv: "development" | "staging" | "production";
  apiUrl: string;
  apiTimeout: number;
  // ... more
}

export const env: EnvConfig = {
  appName: import.meta.env.VITE_APP_NAME || "React App",
  appUrl: validateUrl(import.meta.env.VITE_APP_URL),
  appEnv: import.meta.env.VITE_APP_ENV || "development",
  apiUrl: validateUrl(import.meta.env.VITE_API_URL),
  apiTimeout: toNumber(import.meta.env.VITE_API_TIMEOUT, 30000),
};

// Helper exports
export const isDevelopment = env.appEnv === "development";
export const isProduction = env.appEnv === "production";
export const isStaging = env.appEnv === "staging";
```

### Usage

```typescript
import { env, isDevelopment } from "@/config";

// Access config
console.log(env.apiUrl);
console.log(env.appName);

// Check environment
if (isDevelopment) {
  console.log("Development mode");
}
```

## TypeScript Configuration

### Base Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Path Aliases

The `@/` alias maps to `src/`:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

## Vite Configuration

### Base Setup

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query", "axios"],
        },
      },
    },
  },
});
```

### Environment-Specific Builds

```bash
# Development
npm run dev

# Production build
npm run build

# Staging build
npm run build -- --mode staging
```

## ESLint Configuration

```javascript
// eslint.config.js
export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
```

## Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/testing/setup.ts",
  },
});
```

## Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
    },
  },
  plugins: [],
};
```

## Git Hooks

### Husky Setup

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### Pre-commit Hook

```bash
# .husky/pre-commit
npx lint-staged
```

### Lint-Staged

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss}": ["prettier --write"]
}
```

## Scripts

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Docker Configuration

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## Related Documentation

- [Application Overview](./application-overview.md)
- [Project Structure](./project-structure.md)
