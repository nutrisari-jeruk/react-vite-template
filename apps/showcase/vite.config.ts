import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    root: import.meta.dirname,
    plugins: [
      react(),
      env.BUNDLE_ANALYZE
        ? visualizer({
            filename: "stats.html",
            open: true,
            gzipSize: true,
            brotliSize: true,
          })
        : undefined,
    ],

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },

    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      target: "es2022",

      rolldownOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
    },

    server: {
      port: 5173,
      host: true,
    },

    preview: {
      port: 4173,
      host: true,
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "axios",
        "clsx",
        "tailwind-merge",
      ],
    },

    css: {
      devSourcemap: true,
    },
  };
});
