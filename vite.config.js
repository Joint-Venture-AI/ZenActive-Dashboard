import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"],
  },
  server: {
    host: true,
    port: 4173, // Set the port for development mode
  },
  preview: {
    port: 4173, // Set the port for preview mode
  },
});
