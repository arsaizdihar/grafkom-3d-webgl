import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import plainText from "vite-plugin-plain-text";

export default defineConfig({
  plugins: [react(), plainText(["**/*.glsl"], { namedExport: false })],
});
