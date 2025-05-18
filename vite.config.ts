import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000", // 👈 point this to your Express backend
    },
    allowedHosts: [
      "9218-2c0f-2a80-921-8910-e0cc-9f41-8a57-9ebc.ngrok-free.app", // ✅ Add your ngrok hostname here
    ],
    host: true, // needed for remote access
    port: 5173, // or whatever port you're using
  },
});
