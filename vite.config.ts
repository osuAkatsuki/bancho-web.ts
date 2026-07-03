import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // bancho.py routes by Host header (api.{DOMAIN}), so the dev proxy
  // rewrites the Host header to reach the api on a local instance.
  const banchoDomain = env.BANCHO_DOMAIN ?? "cmyui.xyz";
  const banchoApiTarget = env.BANCHO_API_TARGET ?? "http://127.0.0.1:10000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: banchoApiTarget,
          changeOrigin: false,
          headers: { host: `api.${banchoDomain}` },
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
  };
});
