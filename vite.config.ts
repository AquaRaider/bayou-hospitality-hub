// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";

const ANALYZE = process.env.VIS_ANALYZE === "1";

export default defineConfig({
  plugins: [
    react(),
    // dev rewrite so /blog works without .html
    {
      name: "rewrite-blog-route",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === "/blog") req.url = "/blog.html";
          next();
        });
      },
    },
    compression({ algorithm: "brotliCompress", ext: ".br", deleteOriginFile: false }),
    compression({ algorithm: "gzip", ext: ".gz", deleteOriginFile: false }),
    ...(ANALYZE ? [visualizer({ filename: "stats.html", template: "treemap", gzipSize: true, brotliSize: true })] : []),
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    cors: false,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
  resolve: { alias: { "@": "/src" } },
  build: {
    target: "es2018",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        blog: resolve(__dirname, "blog.html"), // 👈 include blog
      },
      output: {
        manualChunks: { vendor: ["react", "react-dom"] },
      },
    },
  },
});
