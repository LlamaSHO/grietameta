import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // `vite preview` detrás de un túnel temporal (localhost.run) para ver la
  // web desde el móvil: solo se aceptan esos dominios además de localhost.
  preview: {
    allowedHosts: [".lhr.life", ".localhost.run"],
  },
});
