import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postscs.config.js",
  },
  server: {
    proxy: {
      "/api": "http://localhost:8081", // Proxy API calls to Spring Boot
    },
  },
});
