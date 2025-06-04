import { defineConfig, type UserConfigExport } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
const config: UserConfigExport = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000", // 👈 point this to your Express backend
    },
    host: true, // needed for remote access
    port: 5173, // or whatever port you're using
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/styles/variables" as *;
        @use "@/styles/mixins" as mixins;
      `,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true, // enables global test APIs like describe(), it(), expect()
    environment: "jsdom", // simulates browser-like environment
    setupFiles: "./src/setupTests.ts", // optional, for extending expect()
    exclude: [...configDefaults.exclude, "**/e2e/**"], // optional: exclude test folders
    coverage: {
      provider: "v8", // important: use v8 instead of c8
      reporter: ["text", "json", "lcov", "html"],
      exclude: ["**/test-utils/**", "**/*.d.ts", "vite.config.ts"],
    },
  },
});

export default config;
