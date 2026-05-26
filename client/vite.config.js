import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
    }),
    tailwindcss(),
  ],
  server: {
    middlewareMode: false,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      host: "localhost",
      port: 5173,
      protocol: "ws",
    },
  },
});
