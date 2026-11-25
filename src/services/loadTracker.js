/* Cuenta las peticiones en curso (fetch) para saber cuándo una página ha
   terminado de cargar sus datos. Lo usa la pantalla de carga de cada juego
   (components/loaders/GameLoaderHost.vue): se quita cuando no queda ninguna
   petición pendiente. Se instala una vez desde main.js. */

import { reactive } from "vue";

export const loadTracker = reactive({ pending: 0 });

let installed = false;
export function installLoadTracker() {
  if (installed || typeof window === "undefined" || !window.fetch) return;
  installed = true;
  const original = window.fetch.bind(window);
  window.fetch = (...args) => {
    // Las conexiones de Firebase y de los anuncios pueden quedarse abiertas:
    // no cuentan como datos de la página.
    const url = String(args[0]?.url ?? args[0] ?? "");
    if (/google|firebase|gstatic|doubleclick/i.test(url)) return original(...args);
    loadTracker.pending++;
    return original(...args).finally(() => {
      loadTracker.pending = Math.max(0, loadTracker.pending - 1);
    });
  };
}
