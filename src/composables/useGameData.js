/* Carga de datos de un juego bajo demanda (regla «cargar solo lo que se usa»).
   Cada vista pide sus JSON de public/data/<juego>/ al entrar; se guardan en
   memoria mientras dure la visita, así que volver a la página no repite la
   descarga. Uso:
     const dex = useGameData("/data/pokemon/pokedex.json");
     dex.status  // "loading" · "ready" · "error"
     dex.data    // el JSON ya cargado
     dex.reload()
*/
import { reactive } from "vue";

const cache = new Map();

export function useGameData(url) {
  if (cache.has(url)) return cache.get(url);
  const state = reactive({ status: "loading", data: null, error: null, reload: () => load() });
  async function load() {
    state.status = "loading";
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status + " " + url);
      state.data = await r.json();
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
