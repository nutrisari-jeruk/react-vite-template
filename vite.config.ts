import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      // Bundle analyzer (enabled with BUNDLE_ANALYZE=true)
      env.BUNDLE_ANALYZE
        ? visualizer({
            open: true,
            filename: "dist/stats.html",
            gzipSize: true,
            brotliSize: true,
          })
        : undefined,
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Build configuration
    build: {
      outDir: "dist",
      sourcemap: mode === "development", // Source maps only in development
      minify: "terser", // Use terser for minification
      target: "es2015", // Support modern browsers

      // Chunk splitting strategy
      rollupOptions: {
        output: {
          // Manual chunks for better caching and smaller chunk sizes
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return;

            // Match more specific patterns first (order matters)
            if (id.includes("react-dom")) return "react-dom";
            if (
              (id.includes("/react/") || id.includes("\\react\\")) &&
              !id.includes("react-dom") &&
              !id.includes("react-hook-form") &&
              !id.includes("react-query") &&
              !id.includes("react-router")
            ) {
              return "react";
            }

            if (
              id.includes("@tanstack") ||
              id.includes("axios") ||
              id.includes("react-query-auth")
            ) {
              return "query-vendor";
            }

            if (
              id.includes("zod") ||
              id.includes("react-hook-form") ||
              id.includes("@hookform")
            ) {
              return "validation-vendor";
            }

            if (id.includes("motion") || id.includes("@base-ui")) {
              return "ui-vendor";
            }

            if (
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("lucide-react")
            ) {
              return "utils-vendor";
            }

            return "vendor";
          },

          // Chunk file naming
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },

      chunkSizeWarningLimit: 1500,

      // CSS code splitting
      cssCodeSplit: true,

      // Asset inlining limit
      assetsInlineLimit: 4096, // 4KB
    },

    // Development server configuration
    server: {
      port: 5173,
      host: true,
      strictPort: false,
      open: false,
      // Proxy configuration for API
      // Note: When using MSW for mocking, keep VITE_API_URL as relative path (/api)
      // Only use proxy when pointing to an external backend server
      proxy:
        env.VITE_API_URL && env.VITE_API_URL.startsWith("http")
          ? {
              "/api": {
                target: env.VITE_API_URL.replace("/api", ""),
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/api"),
              },
            }
          : undefined,
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
      open: false,
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "axios",
        "zod",
        "react-hook-form",
        "@hookform/resolvers",
      ],
    },

    // CSS configuration
    css: {
      devSourcemap: true,
    },
  };
});
