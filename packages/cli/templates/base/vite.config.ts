import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      minify: "terser",
      target: "es2015",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },

    server: {
      port: 5173,
      host: true,
      strictPort: false,
      open: false,
      proxy:
        env.VITE_API_URL && env.VITE_API_URL.startsWith("http")
          ? {
              "/api": {
                target: env.VITE_API_URL.replace("/api", ""),
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api/, "/api"),
              },
            }
          : undefined,
    },

    preview: {
      port: 4173,
      host: true,
      open: false,
    },

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

    css: {
      devSourcemap: true,
    },
  };
});
