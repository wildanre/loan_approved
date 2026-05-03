import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite Configuration
 *
 * Security strategy: API URL is NEVER exposed to the browser.
 * - In development: `server.proxy` forwards /api/* to the real backend server-side.
 * - In production (Vercel): `vercel.json` rewrites handle the same proxy, so the
 *   actual backend URL lives only in Vercel's environment variables, never in
 *   the compiled JS bundle shipped to the browser.
 */
export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ prefixed ones) for use in config only.
  // These are NEVER bundled into the client.
  const env = loadEnv(mode, process.cwd(), "");

  const backendUrl = env.BACKEND_API_URL;

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": "/src",
      },
    },

    server: {
      port: 5173,
      /**
       * Dev Proxy: All requests to /api/* are forwarded server-side to the
       * real backend. The browser only ever sees requests to localhost:5173/api/*.
       * The actual backend domain is NEVER visible in the browser.
       */
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: true,
          // Backend already has /api prefix, so we don't rewrite the path
        },
      },
    },

    build: {
      target: "esnext",
      outDir: "dist",
      // Prevent any sensitive env vars from leaking into the bundle
      sourcemap: false,
    },
  };
});
