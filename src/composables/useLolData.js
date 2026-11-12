/* Datos de League of Legends compartidos por el hub (/lol), la ficha de
   campeón (/lol/campeon/:id) y la barra de LoL del nav.

   Se cargan una sola vez por visita: champion-stats.json (estadísticas reales)
   y la versión de Data Dragon. El estado vive fuera de los componentes, así
   que los filtros (línea, rango, búsqueda) se conservan al ir del hub a una
   ficha y volver. */

import { computed, reactive, shallowRef } from "vue";
import { loadChampionStats, normalizeBuild, illustrativeStats } from "@/services/riotStats";
import {
  getDdragonVersion,
  knownDdragonVersion,
  fetchChampionIndex,
  championIconUrl,
  championSplashUrl,
  itemIconUrl,
  FALLBACK_DDRAGON_VERSION,
} from "@/services/lol/ddragon";
import { BASE_CHAMPIONS, RANKS, RANK_KEYS, siteIdFromDdragonId, guessRoleFromTags, rankInfo } from "@/services/lol/roster";
import { tierScore, rankWithinLanes, byTier } from "@/services/lol/tiers";

const state = reactive({
  status: "idle", // idle · loading · ready
  version: knownDdragonVersion(), // Data Dragon para campeones, habilidades y splash
  real: false, // true si champion-stats.json trae datos reales
});
const stats = shallowRef(null); // champion-stats.json tal cual
const champions = shallowRef(BASE_CHAMPIONS.map(decorate)); // lista base del sitio

// Filtros del hub (persisten mientras dure la visita).
const filters = reactive({ role: "Todos", rank: "ALL", q: "" });

function decorate(c) {
  return { ...c, icon: championIconUrl(state.version, c.ddId), splash: championSplashUrl(c.ddId) };
}

let loading = null;
function load() {
  if (loading) return loading;
  state.status = "loading";
  loading = (async () => {
    const data = await loadChampionStats();
    const version = await getDdragonVersion(data?.ddragonVersion || FALLBACK_DDRAGON_VERSION);
    state.version = version;
    stats.value = data;
    state.real = !!(data && data.champions && Object.keys(data.champions).length);

    // Campeones con estadísticas que aún no están en el roster (salen nuevos
    // cada pocos meses): nombre y etiquetas de Data Dragon.
    const known = new Set(BASE_CHAMPIONS.map((c) => c.id));
    const extraIds = state.real ? Object.keys(data.champions).filter((id) => !known.has(id)) : [];
    let extra = [];
    if (extraIds.length) {
      try {
        const index = await fetchChampionIndex(version);
        extra = Object.values(index)
          .filter((d) => extraIds.includes(siteIdFromDdragonId(d.id)))
          .map((d) => ({ id: siteIdFromDdragonId(d.id), ddId: d.id, name: d.name, ...guessRoleFromTags(d.tags) }));
      } catch {
        /* sin índice: esos campeones no se listan */
      }
    }
    champions.value = [...BASE_CHAMPIONS, ...extra].map(decorate);
    state.status = "ready";
  })();
  return loading;
}

// --- Estadísticas por rango ----------------------------------------------------

// Estadísticas crudas de un campeón en un rango ({ winrate, pickrate, banrate, games }) o null.
function rawStats(c, rank) {
  const data = stats.value;
  if (!state.real) return state.status === "ready" ? illustrativeStats(c.name, rank) : null;
  if (rank === "ALL") return data.champions[c.id] || null;
  return data.ranks?.[rank]?.champions?.[c.id] || null;
}

// Una lista calculada (y memorizada) por rango: entradas con tier y puesto en su línea.
const perRank = {};
function rankEntries(rank) {
  if (!perRank[rank]) {
    perRank[rank] = computed(() => {
      const list = [];
      for (const c of champions.value) {
        const s = rawStats(c, rank);
        if (!s) continue;
        list.push({
          c,
          id: c.id,
          role: c.role,
          wr: s.winrate,
          pr: s.pickrate,
          br: s.banrate,
          games: s.games || 0,
          score: tierScore(s.winrate, s.pickrate, s.banrate),
        });
      }
      return rankWithinLanes(list).sort(byTier);
    });
  }
  return perRank[rank].value;
}

function entryFor(id, rank) {
  return rankEntries(rank).find((e) => e.id === id) || null;
}

// Partidas analizadas en un rango ("ALL" = todas).
function rankMatches(rank) {
  const data = stats.value;
  if (!data) return 0;
  if (rank === "ALL") return data.totalGamesSample || 0;
  return data.ranks?.[rank]?.matches ?? data.matchesByRank?.[rank] ?? 0;
}

// Rangos con datos publicados (los demás salen desactivados en el desplegable).
function rankHasData(rank) {
  if (rank === "ALL" || !state.real) return true;
  return Object.keys(stats.value?.ranks?.[rank]?.champions || {}).length > 0;
}

// --- Campeones y builds --------------------------------------------------------

// Acepta el id de Data Dragon (Yasuo, MonkeyKing) o el del sitio (wukong), sin
// distinguir mayúsculas.
function findChampion(param) {
  if (!param) return null;
  const key = String(param).toLowerCase();
  return (
    champions.value.find((c) => c.ddId.toLowerCase() === key) ||
    champions.value.find((c) => c.id === siteIdFromDdragonId(key) || c.id === key.replace(/[^a-z0-9]/g, "")) ||
    null
  );
}

function buildFor(id) {
  if (!state.real) return null;
  const b = normalizeBuild(stats.value.champions[id]?.build);
  if (!b) return null;
  // Los objetos salen de la versión de Data Dragon que usó el script.
  const v = stats.value.ddragonVersion || state.version;
  const withIcon = (i) => ({ ...i, icon: i.id ? itemIconUrl(v, i.id) : null });
  return {
    ...b,
    starter: b.starter.map(withIcon),
    boots: b.boots.map(withIcon),
    core: b.core.map(withIcon),
    situational: b.situational.map(withIcon),
  };
}

// Campeón del parche: el de mejor puntuación con todos los rangos que tenga build.
const spotlight = computed(() => {
  const list = rankEntries("ALL").slice().sort((a, b) => b.score - a.score);
  const top = list.find((e) => buildFor(e.id)) || list[0];
  return top ? { ...top, build: buildFor(top.id) } : null;
});

// Datos del parche para las cabeceras.
const patch = computed(() => {
  const data = stats.value;
  const v = data?.ddragonVersion || state.version;
  return {
    label: data?.patch || v.split(".").slice(0, 2).join("."),
    real: state.real,
    region: "EUW",
    games: data?.totalGamesSample || 0,
    championsWithData: state.real ? Object.keys(data.champions).length : 0,
    generatedAt: data?.generatedAt || null,
    previousPatch: data?.usingPreviousPatch && data?.latestPatch ? data.latestPatch : null,
  };
});

export function useLolData() {
  load();
  return {
    state,
    filters,
    champions,
    stats,
    patch,
    spotlight,
    ranks: RANKS,
    rankKeys: RANK_KEYS,
    rankInfo,
    rankEntries,
    entryFor,
    rankMatches,
    rankHasData,
    findChampion,
    buildFor,
  };
}
