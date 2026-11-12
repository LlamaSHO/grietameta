/* League of Legends: estadísticas reales y recursos de Riot.
   champion-stats.json lo genera tools/fetch-riot-stats.mjs (GitHub Action
   "Actualizar estadísticas de Riot") a partir de la API de Riot y se sirve
   desde public/data. Forma del archivo:
     { patch, region, generatedAt, ddragonVersion, totalGamesSample,
       matchesByRank: { IRON: n, … },
       champions: { [idSitio]: { games, winrate, pickrate, banrate, build } },
       ranks: { [RANGO]: { matches, champions: { [idSitio]: { games, winrate, pickrate, banrate } } } } }
   Los iconos vienen de Data Dragon (ver services/lol/ddragon.js). */

const STATS_URL = "/data/champion-stats.json";

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

// Igual que fetchChampionStats, pero una sola petición por visita.
let statsPromise = null;
export function loadChampionStats() {
  if (!statsPromise) statsPromise = fetchChampionStats();
  return statsPromise;
}

// Build real de un campeón (o null si aún no hay muestra suficiente).
// Solo se usa lo que viene de partidas reales: nunca objetos de ejemplo.
export function normalizeBuild(raw) {
  if (!raw || !raw.sampleGames) return null;
  const item = (i) => (typeof i === "string" ? { id: null, name: i } : { id: i.id ?? null, name: i.name });
  const r = raw.runes;
  return {
    sampleGames: raw.sampleGames,
    starter: (raw.starter || []).map(item),
    // Las botas básicas (id 1001) no son "las botas del campeón": se ocultan.
    boots: raw.boots && Number(raw.boots.id) !== 1001 ? [item(raw.boots)] : [],
    core: (raw.core || []).map(item),
    situational: (raw.situational || []).map(item),
    runes:
      r?.keystone && r?.primaryTree
        ? { keystone: r.keystone, icon: r.keystoneIcon || null, primaryTree: r.primaryTree, secondaryTree: r.secondaryTree || null }
        : null,
  };
}

// --- Datos ilustrativos -------------------------------------------------------
// Si champion-stats.json no se puede cargar, la web enseña cifras deterministas
// (semilla = nombre del campeón y rango) para que la tier list no quede vacía.
// Se avisa en la cabecera de que son ilustrativas.
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967295;
  };
}
export function illustrativeStats(name, rank = "ALL") {
  const rng = seeded(rank === "ALL" ? name : `${name}:${rank}`);
  return {
    winrate: +(46.5 + rng() * 8.5).toFixed(1), // 46,5 % – 55 %
    pickrate: +(2 + rng() * 16).toFixed(1), // 2 % – 18 %
    banrate: +(0.5 + rng() * 22).toFixed(1), // 0,5 % – 22,5 %
    games: Math.round((rank === "ALL" ? 400 : 40) + rng() * (rank === "ALL" ? 3600 : 400)),
  };
}
