/* League of Legends: estadísticas reales y recursos de Riot.
   champion-stats.json lo genera tools/fetch-riot-stats.mjs (GitHub Action
   "Actualizar estadísticas de Riot") a partir de la API de Riot y se sirve
   desde public/data. Los iconos vienen de Data Dragon, el CDN público de Riot. */

const STATS_URL = "/data/champion-stats.json";
const DDRAGON = "https://ddragon.leagueoflegends.com/cdn";

// Devuelve null si el archivo no existe o no se puede leer: la vista sigue
// funcionando con los datos ilustrativos.
export async function fetchChampionStats() {
  try {
    const res = await fetch(STATS_URL, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const ddragonChampionIconUrl = (version, id) => `${DDRAGON}/${version}/img/champion/${id}.png`;
export const ddragonItemIconUrl = (version, id) => `${DDRAGON}/${version}/img/item/${id}.png`;
export const ddragonRuneIconUrl = (icon) => (/^https?:/.test(icon) ? icon : `${DDRAGON}/img/${icon}`);
