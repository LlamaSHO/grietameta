/* Carga de datos de un juego bajo demanda (regla «cargar solo lo que se usa»).
   Cada vista pide sus conjuntos al entrar (services/datos.js: Firestore con
   caché del navegador; en desarrollo, la carpeta datos/). La ruta sigue la
   forma "/data/<juego>/<archivo>.json"; se guardan en
   memoria mientras dure la visita, así que volver a la página no repite la
   descarga. Uso:
     const dex = useGameData("/data/pokemon/pokedex.json");
     dex.status  // "loading" · "ready" · "error"
     dex.data    // el JSON ya cargado
     dex.reload()
*/
import { reactive } from "vue";
import { loadDataset } from "@/services/datos";

const cache = new Map();

export function useGameData(url) {
  if (cache.has(url)) return cache.get(url);
  const state = reactive({ status: "loading", data: null, error: null, reload: () => load() });
  async function load() {
    state.status = "loading";
    try {
      state.data = await loadDataset(url);
      state.status = "ready";
    } catch (e) {
      state.error = e;
      state.status = "error";
    }
  }
  load();
  cache.set(url, state);
  return state;
}
