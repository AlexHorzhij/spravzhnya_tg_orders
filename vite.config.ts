import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/spravzhnya_tg_orders/",
  server: {
    allowedHosts: ["alexhorzhij.github.io"],
  },
});
