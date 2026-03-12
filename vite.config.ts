import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    __E2E__: JSON.stringify(process.env.VITE_E2E === "true"),
  },
});
