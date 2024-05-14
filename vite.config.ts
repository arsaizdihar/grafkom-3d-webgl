import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import plainText from "vite-plugin-plain-text";

export default defineConfig({
  plugins: [react(), plainText(["**/*.glsl"], { namedExport: false })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
