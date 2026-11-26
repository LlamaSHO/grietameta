import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// En desarrollo, los datos de los juegos se leen de la carpeta datos/ (en
// producción salen de Firestore: src/services/datos.js). Se sirven en
// /@datos/<juego>/<archivo>.json. Si un archivo aún no se ha movido, se busca
// en public/data.
function datosLocales() {
  const roots = ["datos", "public/data"].map((d) => fileURLToPath(new URL(`./${d}/`, import.meta.url)));
  return {
    name: "datos-locales",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/@datos/", (req, res, next) => {
        const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
        if (rel.includes("..") || !rel.endsWith(".json")) return next();
        for (const root of roots) {
          const file = path.join(root, rel);
          if (fs.existsSync(file)) {
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            fs.createReadStream(file).pipe(res);
            return;
          }
        }
        res.statusCode = 404;
        res.end("No existe datos/" + rel);
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), datosLocales()],
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
