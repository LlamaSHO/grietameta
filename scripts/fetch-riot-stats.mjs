#!/usr/bin/env node
/* =============================================================================
   GrietaMeta — fetch-riot-stats.mjs
   ============================================================================
   Descarga partidas clasificatorias recientes de jugadores de TODOS LOS RANGOS
   (Hierro, Bronce, Plata, Oro, Platino, Esmeralda, Diamante y Master+) de EUW
   usando la API oficial de Riot Games, y calcula por campeón:
     - winrate / pickrate / banrate
     - build de objetos real (inicial, botas, núcleo en orden de compra,
       situacionales), usando el Timeline de cada partida (eventos de compra
       con marca de tiempo)
     - runas reales más usadas (keystone + árbol principal + árbol secundario)
   El resultado se guarda en champion-stats.json, en la raíz del repo, que
   index.html carga para sustituir los datos simulados.

   CÓMO SE ANALIZAN "LA MAYOR CANTIDAD DE PARTIDAS POSIBLE"
   El límite no es el script sino la API de Riot (con clave de desarrollo,
   100 peticiones cada 2 minutos). Para exprimirlo:
     1. Limitador de ritmo exacto: lee la cabecera X-App-Rate-Limit de Riot y
        envía peticiones justo al límite, sin pausas fijas de más. Si algún día
        tienes una clave de producción (límites mayores), se adapta sola.
     2. Presupuesto de tiempo (RUN_BUDGET_MINUTES) en vez de un número fijo de
        partidas: analiza hasta que se acaba el tiempo del workflow.
     3. Solo pide partidas jugadas desde la ejecución anterior (ventana
        startTime/endTime), así no gasta peticiones en partidas ya contadas.
     4. Pide hasta MATCHES_PER_SUMMONER partidas de cada jugador en una sola
        petición.
     5. El Timeline (que duplica el coste de una partida) solo se pide
        mientras haga falta para las builds: cuando casi todos los campeones
        de la partida ya tienen BUILD_SAMPLE_TARGET partidas de build en este
        parche, se salta y la partida cuenta solo para winrate/pickrate/baneos.
     6. El reparto entre rangos es voraz: siempre se analiza una partida del
        rango que lleva menos analizadas, así la muestra queda equilibrada
        aunque se corte por tiempo.

   MUESTREO POR RANGOS
   Cada partida se asigna al rango del jugador por el que se encontró, porque
   el emparejamiento pone a gente de nivel parecido en la misma partida.
   Resultado publicado:
     - champions : estadísticas de TODOS los rangos juntos (+ builds). Es lo
                   que ya lee index.html.
     - ranks     : estadísticas por grupo de rango (winrate/pickrate/banrate).
   Ojo: "todos los rangos" significa los 8 grupos con el MISMO peso. No es el
   reparto real de jugadores (hay muchos más en Oro que en Master).

   ACUMULACIÓN ENTRE EJECUCIONES
   Guarda sus contadores (comprimidos) en data/raw-stats.json.gz, que el
   workflow sube al repo junto con champion-stats.json.
     - Los datos se separan por parche; un parche nuevo empieza de cero y, hasta
       reunir MIN_MATCHES_NEW_PATCH partidas, se sigue publicando el anterior
       (solo si éste tiene datos suficientes). Se conservan dos parches.
     - Para que el archivo no crezca sin límite, de cada campeón solo se
       recuerdan los MAX_ITEMS_TRACKED objetos más frecuentes.

   MÍNIMO DE PARTIDAS: un campeón solo se publica si aparece en al menos
   MIN_GAMES_FOR_STATS partidas (y su build, si aparece en al menos
   MIN_GAMES_FOR_BUILD). Con pocas partidas un winrate no significa nada.

   IMPORTANTE — límites honestos:
   - No es el 100% de las partidas del juego (eso exige una "Production Key"
     aprobada por Riot). Es una MUESTRA, aunque cada vez mayor.
   - Las claves de desarrollo caducan a las 24 horas. Si caduca a mitad de una
     ejecución, el script guarda lo analizado y publica con lo acumulado.
   - La API no dice en qué orden devuelve los jugadores de cada división; se
     eligen páginas al azar para repartir el muestreo.
   - Nunca expongas RIOT_API_KEY en el frontend.

   Uso:
     RIOT_API_KEY=RGAPI-xxxx node scripts/fetch-riot-stats.mjs

   Variables de entorno opcionales:
     RUN_BUDGET_MINUTES     (por defecto 300)    minutos máximos analizando partidas
     MAX_MATCHES            (por defecto 100000) tope de partidas por ejecución
     SUMMONERS_PER_BUCKET   (por defecto 500)    jugadores candidatos por grupo de rango
     MATCHES_PER_SUMMONER   (por defecto 10)     partidas máx. por jugador y ejecución
     BUILD_SAMPLE_TARGET    (por defecto 400)    partidas de build por campeón a partir
                                                 de las cuales se deja de pedir Timeline
     TIMELINE_MIN_NEEDED    (por defecto 3)      nº de campeones de la partida que deben
                                                 necesitar build para pedir su Timeline
     FIRST_RUN_LOOKBACK_HOURS (por defecto 24)   ventana de la primera ejecución
     MIN_DELAY_MS           (por defecto 0)      pausa mínima entre peticiones
     MIN_GAMES_FOR_STATS    (por defecto 30)     partidas mínimas para publicar un campeón
     MIN_GAMES_FOR_BUILD    (por defecto 30)     partidas mínimas para publicar su build
     MIN_MATCHES_NEW_PATCH  (por defecto 1500)   partidas que debe reunir un parche nuevo
     LEAGUE_MAX_PAGE        (por defecto 20)     páginas entre las que se elige al azar
                                                 al buscar jugadores de cada división
   ============================================================================ */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { gzipSync, gunzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "champion-stats.json");
const STATE_PATH = path.join(__dirname, "..", "data", "raw-stats.json.gz");

const RIOT_API_KEY = process.env.RIOT_API_KEY;
if (!RIOT_API_KEY) {
  console.error("Falta RIOT_API_KEY. Ejemplo: RIOT_API_KEY=RGAPI-xxxx node scripts/fetch-riot-stats.mjs");
  process.exit(1);
}

// EUW: host de plataforma (summoner/league) vs host regional (match/account).
const PLATFORM_HOST = "https://euw1.api.riotgames.com";
const REGION_HOST = "https://europe.api.riotgames.com";

// Grupos de rango. MASTER_PLUS = Master + Grandmaster + Challenger.
const TIERS = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND"];
const DIVISIONS = ["I", "II", "III", "IV"];
const RANK_BUCKETS = [...TIERS, "MASTER_PLUS"];

const num = (name, fallback) => {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && process.env[name] !== "" && process.env[name] !== undefined ? v : fallback;
};

const RUN_BUDGET_MINUTES = num("RUN_BUDGET_MINUTES", 300);
const MAX_MATCHES = num("MAX_MATCHES", 100000);
const SUMMONERS_PER_BUCKET = num("SUMMONERS_PER_BUCKET", 500);
const MATCHES_PER_SUMMONER = Math.min(100, num("MATCHES_PER_SUMMONER", 10));
const BUILD_SAMPLE_TARGET = num("BUILD_SAMPLE_TARGET", 400);
const TIMELINE_MIN_NEEDED = num("TIMELINE_MIN_NEEDED", 3);
const FIRST_RUN_LOOKBACK_HOURS = num("FIRST_RUN_LOOKBACK_HOURS", 24);
const MIN_DELAY_MS = num("MIN_DELAY_MS", 0);
const MIN_GAMES_FOR_STATS = num("MIN_GAMES_FOR_STATS", 30);
const MIN_GAMES_FOR_BUILD = num("MIN_GAMES_FOR_BUILD", 30);
const MIN_MATCHES_NEW_PATCH = num("MIN_MATCHES_NEW_PATCH", 1500);
const LEAGUE_MAX_PAGE = num("LEAGUE_MAX_PAGE", 20);
const RANKED_SOLO_QUEUE = 420;

const STATE_VERSION = 2;
const KEEP_PATCHES = 2;            // parches que se conservan en el archivo acumulado
const MAX_KNOWN_MATCH_IDS = 15000; // ids de partidas ya contadas que se recuerdan
const MAX_ITEMS_TRACKED = 120;     // objetos distintos que se recuerdan por campeón
const SAVE_EVERY_MATCHES = 100;    // guarda el progreso cada tantas partidas

// Versión de Data Dragon. Se sustituye por la última publicada al arrancar
// (ver resolveDdragonVersion); este valor es solo un respaldo.
let DDRAGON_VERSION = "16.19.1";
const DDRAGON_LOCALE = "es_ES"; // nombres de objetos/runas en español, como el resto del sitio

// El campeón que devuelve la API de Riot ("championName") coincide con el id
// de Data Dragon (p. ej. "Belveth", "Chogath", "MonkeyKing"...), que a su vez
// es casi siempre igual al slug que usa el sitio (minúsculas, sin símbolos) —
// salvo estas 3 excepciones.
const RIOT_NAME_TO_SITE_ID_OVERRIDES = {
  monkeyking: "wukong",       // Wukong
  nunu: "nunuwillump",        // Nunu & Willump
  renata: "renataglasc",      // Renata Glasc
};

function riotChampionNameToSiteId(riotChampionName) {
  const key = riotChampionName.toLowerCase();
  return RIOT_NAME_TO_SITE_ID_OVERRIDES[key] || key;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ------------------------------------------------------------------------ *
   Limitador de ritmo.
   Riot manda en cada respuesta la cabecera X-App-Rate-Limit ("20:1,100:120" =
   20 peticiones por segundo y 100 cada 120 s). Se guardan las marcas de
   tiempo de las últimas peticiones y, antes de cada una, se espera lo justo
   para no pasar de ningún límite (con un 5% de margen).
 * ------------------------------------------------------------------------ */
let rateLimits = [[20, 1], [100, 120]]; // [máximo, segundos]; valor inicial de una clave de desarrollo
const requestStamps = [];
let requestCount = 0;

function updateRateLimits(headerValue) {
  if (!headerValue) return;
  const parsed = headerValue
    .split(",")
    .map((part) => part.split(":").map(Number))
    .filter(([max, secs]) => Number.isFinite(max) && Number.isFinite(secs) && max > 0 && secs > 0);
  if (parsed.length) rateLimits = parsed;
}

async function throttle() {
  for (;;) {
    const now = Date.now();
    const longestWindow = Math.max(...rateLimits.map(([, secs]) => secs)) * 1000;
    while (requestStamps.length && now - requestStamps[0] > longestWindow) requestStamps.shift();

    let wait = 0;
    for (const [max, secs] of rateLimits) {
      const allowed = Math.max(1, Math.floor(max * 0.95));
      const windowMs = secs * 1000;
      const recent = requestStamps.filter((t) => now - t < windowMs);
      if (recent.length >= allowed) {
        wait = Math.max(wait, windowMs - (now - recent[recent.length - allowed]));
      }
    }
    if (wait <= 0) break;
    await sleep(wait + 5);
  }
  requestStamps.push(Date.now());
  if (MIN_DELAY_MS > 0) await sleep(MIN_DELAY_MS);
}

// Petición a Riot con limitador y reintento automático si aun así llegamos al
// límite (429), respetando la cabecera Retry-After.
async function riotFetch(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    await throttle();
    requestCount++;
    const res = await fetch(url, {
      headers: { "X-Riot-Token": RIOT_API_KEY },
    });
    updateRateLimits(res.headers.get("x-app-rate-limit"));

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") || 5);
      console.warn(`  [429] límite de tasa alcanzado, esperando ${retryAfter}s…`);
      await sleep((retryAfter + 1) * 1000);
      continue;
    }

    if (res.status === 404) return null; // partida/jugador no encontrado: lo saltamos

    if (!res.ok) {
      throw new Error(`Riot API ${res.status} en ${url}: ${await res.text()}`);
    }

    return res.json();
  }
  throw new Error(`Demasiados reintentos (429) en ${url}`);
}

/* ------------------------------------------------------------------------ *
   Estado acumulado (data/raw-stats.json.gz)
   {
     version: 2,
     lastWindowEnd: 1790000000,          // fin (epoch s) de la ventana de la ejecución anterior
     patches: {
       "16.19": {
         matches: 1234,                                   // total, todos los rangos
         buckets: { GOLD: { matches, stats: {siteId: {games,wins,bans}} }, … },
         builds:  { siteId: {…acumuladores de objetos/runas…} }   // todos los rangos juntos
       }
     },
     processedMatchIds: ["EUW1_123…", …]
   }
 * ------------------------------------------------------------------------ */
function emptyState() {
  return { version: STATE_VERSION, lastWindowEnd: null, patches: {}, processedMatchIds: [] };
}

async function loadState() {
  try {
    const buf = await readFile(STATE_PATH);
    const state = JSON.parse(gunzipSync(buf).toString("utf8"));
    const wellFormed =
      state && state.version === STATE_VERSION && state.patches &&
      Object.values(state.patches).every(
        (pd) => pd && typeof pd.matches === "number" && pd.buckets && pd.builds
      );
    if (wellFormed) {
      state.processedMatchIds = state.processedMatchIds || [];
      state.lastWindowEnd = state.lastWindowEnd || null;
      return state;
    }
    console.warn("⚠ El archivo acumulado es de una versión anterior o tiene otro formato: se descarta y se empieza de cero.");
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn(`⚠ No se pudo leer el archivo acumulado (${err.message}): se empieza de cero.`);
    }
  }
  return emptyState();
}

// Limita el tamaño del archivo: de cada campeón se recuerdan solo los
// MAX_ITEMS_TRACKED objetos más frecuentes (el resto casi nunca importa).
function pruneBuildCounters(state) {
  for (const patchData of Object.values(state.patches)) {
    for (const b of Object.values(patchData.builds || {})) {
      const keys = Object.keys(b.itemCounts);
      if (keys.length <= MAX_ITEMS_TRACKED) continue;
      keys
        .sort((x, y) => b.itemCounts[y] - b.itemCounts[x])
        .slice(MAX_ITEMS_TRACKED)
        .forEach((id) => {
          delete b.itemCounts[id];
          delete b.itemOrderSum[id];
        });
    }
  }
}

async function saveState(state, knownIds) {
  pruneOldPatches(state);
  pruneBuildCounters(state);
  state.processedMatchIds = [...knownIds].slice(-MAX_KNOWN_MATCH_IDS);
  await mkdir(path.dirname(STATE_PATH), { recursive: true });
  await writeFile(STATE_PATH, gzipSync(JSON.stringify(state)));
}

// "16.19" -> número comparable
function patchRank(patch) {
  const [major, minor] = patch.split(".").map(Number);
  return major * 1000 + minor;
}

function patchesNewestFirst(state) {
  return Object.keys(state.patches).sort((a, b) => patchRank(b) - patchRank(a));
}

function pruneOldPatches(state) {
  for (const patch of patchesNewestFirst(state).slice(KEEP_PATCHES)) {
    delete state.patches[patch];
  }
}

// Parche que se publica: el más reciente. Solo se sigue publicando el anterior
// mientras el nuevo reúne partidas (menos de MIN_MATCHES_NEW_PATCH) Y el
// anterior tiene a su vez datos suficientes.
function choosePublishedPatch(state) {
  const [latest, previous] = patchesNewestFirst(state);
  if (!latest) return null;
  const latestMatches = state.patches[latest].matches;
  const previousIsUsable =
    previous && state.patches[previous].matches >= MIN_MATCHES_NEW_PATCH;
  if (latestMatches >= MIN_MATCHES_NEW_PATCH || !previousIsUsable) {
    return { patch: latest, latest, usingPreviousPatch: false };
  }
  return { patch: previous, latest, usingPreviousPatch: true };
}

// Suma las estadísticas de todos los grupos de rango.
function combineBucketStats(buckets) {
  const total = {};
  for (const bucket of Object.values(buckets)) {
    for (const [siteId, s] of Object.entries(bucket.stats || {})) {
      const t = total[siteId] || (total[siteId] = { games: 0, wins: 0, bans: 0 });
      t.games += s.games;
      t.wins += s.wins;
      t.bans += s.bans;
    }
  }
  return total;
}

/* ------------------------------------------------------------------------ *
   Descubrimiento de jugadores
 * ------------------------------------------------------------------------ */

// Convierte entradas de liga en puuids (con respaldo para respuestas antiguas).
async function entriesToPuuids(entries) {
  const puuids = [];
  for (const entry of entries) {
    if (entry.puuid) {
      puuids.push(entry.puuid);
      continue;
    }
    if (entry.summonerId) {
      const summoner = await riotFetch(`${PLATFORM_HOST}/lol/summoner/v4/summoners/${entry.summonerId}`);
      if (summoner?.puuid) puuids.push(summoner.puuid);
    }
  }
  return puuids;
}

// Devuelve { GOLD: [puuid, …], … } con hasta SUMMONERS_PER_BUCKET candidatos por grupo.
async function getSampledPlayers() {
  const playersByBucket = {};

  console.log("Descargando ligas Challenger / Grandmaster / Master de EUW…");
  const [challenger, grandmaster, master] = await Promise.all([
    riotFetch(`${PLATFORM_HOST}/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5`),
    riotFetch(`${PLATFORM_HOST}/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5`),
    riotFetch(`${PLATFORM_HOST}/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5`),
  ]);
  const apex = [
    ...(challenger?.entries || []),
    ...(grandmaster?.entries || []),
    ...(master?.entries || []),
  ];
  playersByBucket.MASTER_PLUS = await entriesToPuuids(shuffle(apex).slice(0, SUMMONERS_PER_BUCKET));

  for (const tier of TIERS) {
    console.log(`Buscando jugadores de ${tier}…`);
    const entries = [];
    for (const division of DIVISIONS) {
      // Página al azar para no coger siempre los mismos jugadores; si esa
      // página no existe (división pequeña), se usa la primera.
      const page = 1 + Math.floor(Math.random() * LEAGUE_MAX_PAGE);
      const base = `${PLATFORM_HOST}/lol/league/v4/entries/RANKED_SOLO_5x5/${tier}/${division}`;
      let list = await riotFetch(`${base}?page=${page}`);
      if (!Array.isArray(list) || list.length === 0) list = await riotFetch(`${base}?page=1`);
      entries.push(...(Array.isArray(list) ? list.filter((e) => !e.inactive) : []));
    }
    playersByBucket[tier] = await entriesToPuuids(shuffle(entries).slice(0, SUMMONERS_PER_BUCKET));
  }

  const resumen = RANK_BUCKETS.map((b) => `${b}:${(playersByBucket[b] || []).length}`).join("  ");
  console.log(`Jugadores candidatos → ${resumen}`);
  return playersByBucket;
}

// Ids de las partidas clasificatorias de un jugador dentro de la ventana
// [startTime, endTime) (epoch en segundos), en una sola petición.
function getPlayerMatchIds(puuid, startTime, endTime) {
  return riotFetch(
    `${REGION_HOST}/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${RANKED_SOLO_QUEUE}&type=ranked&startTime=${startTime}&endTime=${endTime}&count=${MATCHES_PER_SUMMONER}`
  );
}

function getTimeline(matchId) {
  return riotFetch(`${REGION_HOST}/lol/match/v5/matches/${matchId}/timeline`);
}

/* ------------------------------------------------------------------------ *
   Datos estáticos de Data Dragon (objetos, runas y campeones) — no cuentan
   para el límite de peticiones de Riot, son un CDN público aparte.
 * ------------------------------------------------------------------------ */
async function resolveDdragonVersion() {
  try {
    const res = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    if (res.ok) {
      const versions = await res.json();
      if (Array.isArray(versions) && versions[0]) DDRAGON_VERSION = versions[0];
    }
  } catch {
    // nos quedamos con la versión de respaldo
  }
  console.log(`Versión de Data Dragon: ${DDRAGON_VERSION}`);
}

async function fetchDdragonJson(file) {
  const url = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/${DDRAGON_LOCALE}/${file}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Data Dragon ${res.status} al descargar ${url}`);
  return res.json();
}

async function loadStaticData() {
  await resolveDdragonVersion();
  console.log("Descargando catálogo de objetos, runas y campeones (Data Dragon)…");
  const [itemJson, runesJson, championJson] = await Promise.all([
    fetchDdragonJson("item.json"),
    fetchDdragonJson("runesReforged.json"),
    fetchDdragonJson("champion.json"),
  ]);

  // items[id] -> { name, isBoots, isBuildEnd, excluded }
  // "isBuildEnd": objeto terminado (no se puede mejorar más) — así ignoramos
  // componentes intermedios y solo contamos lo que el jugador llevaba puesto.
  const items = {};
  for (const [id, data] of Object.entries(itemJson.data || {})) {
    const tags = data.tags || [];
    const isConsumableOrTrinket = tags.includes("Consumable") || tags.includes("Trinket");
    const hasFurtherBuild = Array.isArray(data.into) && data.into.length > 0;
    items[id] = {
      name: data.name,
      isBoots: tags.includes("Boots"),
      // Botas básicas (las de 300 de oro, que luego se mejoran): nunca se
      // publican como "las botas de un campeón", aunque Data Dragon cambie su
      // estructura de mejoras. Las mejoradas cuestan bastante más.
      isBasicBoots: tags.includes("Boots") && (data.gold?.total || 0) <= 500,
      isBuildEnd: !hasFurtherBuild && !isConsumableOrTrinket && (data.gold?.total || 0) > 0,
      excluded: isConsumableOrTrinket,
    };
  }

  const runeNames = {}; // perk id -> nombre
  const runeIcons = {}; // perk id -> ruta del icono en Data Dragon
  const treeNames = {}; // árbol id -> nombre
  for (const tree of runesJson) {
    treeNames[tree.id] = tree.name;
    for (const slot of tree.slots || []) {
      for (const rune of slot.runes || []) {
        runeNames[rune.id] = rune.name;
        runeIcons[rune.id] = rune.icon || null;
      }
    }
  }

  // Id numérico del campeón (el que usa Riot en los baneos) -> id de Data
  // Dragon. Un campeón baneado no juega la partida, así que hace falta este
  // mapa para saber a quién corresponde cada baneo.
  const championKeyToRiotName = {};
  for (const champ of Object.values(championJson.data || {})) {
    championKeyToRiotName[String(champ.key)] = champ.id;
  }

  return { items, runeNames, runeIcons, treeNames, championKeyToRiotName };
}

/* ------------------------------------------------------------------------ *
   Compras por participante a partir del Timeline (descontando ITEM_UNDO).
 * ------------------------------------------------------------------------ */
function extractPurchases(timeline) {
  const byParticipant = {};
  for (const frame of timeline?.info?.frames || []) {
    for (const ev of frame.events || []) {
      if (ev.type === "ITEM_PURCHASED") {
        const list = byParticipant[ev.participantId] || (byParticipant[ev.participantId] = []);
        list.push({ itemId: String(ev.itemId), timestamp: ev.timestamp });
      } else if (ev.type === "ITEM_UNDO" && ev.beforeId && !ev.afterId) {
        const list = byParticipant[ev.participantId];
        if (list) {
          for (let i = list.length - 1; i >= 0; i--) {
            if (list[i].itemId === String(ev.beforeId)) {
              list.splice(i, 1);
              break;
            }
          }
        }
      }
    }
  }
  return byParticipant;
}

function topEntries(counts, n) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id]) => id);
}

// Acumula, para un campeón concreto, las compras y runas de una partida.
function recordBuild(buildStats, siteId, purchases, perks, staticData) {
  if (!buildStats[siteId]) {
    buildStats[siteId] = {
      games: 0,
      starterCounts: {},
      bootsCounts: {},
      itemCounts: {},
      itemOrderSum: {},
      runeComboCounts: {},
    };
  }
  const b = buildStats[siteId];
  b.games++;

  const relevant = purchases
    .filter((p) => staticData.items[p.itemId] && !staticData.items[p.itemId].excluded)
    .sort((x, y) => x.timestamp - y.timestamp);

  let coreIndex = 0;
  for (const p of relevant) {
    const info = staticData.items[p.itemId];
    if (!info.isBuildEnd) continue; // solo objetos terminados, no componentes a medias

    if (info.isBoots) {
      if (!info.isBasicBoots) b.bootsCounts[p.itemId] = (b.bootsCounts[p.itemId] || 0) + 1;
      continue;
    }

    if (p.timestamp <= 120000) {
      // Comprado en los primeros 2 minutos: objeto inicial.
      b.starterCounts[p.itemId] = (b.starterCounts[p.itemId] || 0) + 1;
    } else {
      b.itemCounts[p.itemId] = (b.itemCounts[p.itemId] || 0) + 1;
      b.itemOrderSum[p.itemId] = (b.itemOrderSum[p.itemId] || 0) + coreIndex;
      coreIndex++;
    }
  }

  const primary = perks?.styles?.find((s) => s.description === "primaryStyle");
  const secondary = perks?.styles?.find((s) => s.description === "subStyle");
  const keystoneId = primary?.selections?.[0]?.perk;
  if (keystoneId && primary && secondary) {
    const comboKey = `${keystoneId}|${primary.style}|${secondary.style}`;
    b.runeComboCounts[comboKey] = (b.runeComboCounts[comboKey] || 0) + 1;
  }
}

// Convierte los contadores acumulados de un campeón en el build final.
// Devuelve null si no hay muestra suficiente.
function finalizeBuild(buildStats, siteId, staticData) {
  const stats = buildStats[siteId];
  if (!stats || stats.games < MIN_GAMES_FOR_BUILD) return null;

  // Cada objeto se publica como { id, name }: el id permite a la web pintar
  // su icono (Data Dragon: /img/item/<id>.png).
  const itemRef = (id) =>
    staticData.items[id] ? { id: Number(id), name: staticData.items[id].name } : null;

  const starter = topEntries(stats.starterCounts, 2).map(itemRef).filter(Boolean);
  // Se ignoran también las botas básicas que pudieran venir de datos antiguos.
  const upgradedBoots = Object.fromEntries(
    Object.entries(stats.bootsCounts).filter(([id]) => staticData.items[id] && !staticData.items[id].isBasicBoots)
  );
  const [bootsId] = topEntries(upgradedBoots, 1);
  const boots = bootsId ? itemRef(bootsId) : null;

  const frequentItems = Object.entries(stats.itemCounts).filter(
    ([, count]) => count / stats.games >= 0.1 // al menos ~10% de las partidas
  );

  const coreIds = frequentItems
    .sort((x, y) => y[1] - x[1])
    .slice(0, 3)
    .sort((x, y) => stats.itemOrderSum[x[0]] / x[1] - stats.itemOrderSum[y[0]] / y[1])
    .map(([id]) => id);

  const situationalIds = frequentItems
    .filter(([id]) => !coreIds.includes(id))
    .sort((x, y) => y[1] - x[1])
    .slice(0, 2)
    .map(([id]) => id);

  const [topRuneCombo] = Object.entries(stats.runeComboCounts).sort((x, y) => y[1] - x[1]);
  let runes = null;
  if (topRuneCombo) {
    const [keystoneId, primaryTreeId, secondaryTreeId] = topRuneCombo[0].split("|");
    runes = {
      keystone: staticData.runeNames[keystoneId] || null,
      keystoneIcon: staticData.runeIcons[keystoneId] || null,
      primaryTree: staticData.treeNames[primaryTreeId] || null,
      secondaryTree: staticData.treeNames[secondaryTreeId] || null,
    };
  }

  return {
    sampleGames: stats.games,
    starter,
    boots,
    core: coreIds.map(itemRef).filter(Boolean),
    situational: situationalIds.map(itemRef).filter(Boolean),
    runes,
  };
}

/* ------------------------------------------------------------------------ *
   Analiza UNA partida y la SUMA al estado acumulado. Descarga todo lo
   necesario antes de tocar contadores, así una caída a mitad de partida nunca
   deja datos a medias. Devuelve "analyzed" o "skipped" (y si usó timeline).
 * ------------------------------------------------------------------------ */
async function analyzeMatch(matchId, bucket, state, staticData, counters) {
  const match = await riotFetch(`${REGION_HOST}/lol/match/v5/matches/${matchId}`);
  const patch = String(match?.info?.gameVersion || "").split(".").slice(0, 2).join(".");
  if (!match?.info || !patch) return "skipped";

  // ¿Hace falta el Timeline (la mitad del coste)? Solo si al menos
  // TIMELINE_MIN_NEEDED campeones de la partida aún no tienen BUILD_SAMPLE_TARGET
  // partidas de build en este parche.
  const existingBuilds = state.patches[patch]?.builds || {};
  const needBuild = (match.info.participants || []).filter(
    (p) => (existingBuilds[riotChampionNameToSiteId(p.championName)]?.games || 0) < BUILD_SAMPLE_TARGET
  ).length;
  const wantTimeline = needBuild >= TIMELINE_MIN_NEEDED;
  const timeline = wantTimeline ? await getTimeline(matchId) : null;

  // --- a partir de aquí no hay más peticiones: se actualizan contadores ---
  const patchData =
    state.patches[patch] || (state.patches[patch] = { matches: 0, buckets: {}, builds: {} });
  const bucketData =
    patchData.buckets[bucket] || (patchData.buckets[bucket] = { matches: 0, stats: {} });
  const bump = (siteId, field) => {
    const s = bucketData.stats[siteId] || (bucketData.stats[siteId] = { games: 0, wins: 0, bans: 0 });
    s[field]++;
  };

  patchData.matches++;
  bucketData.matches++;

  for (const participant of match.info.participants || []) {
    const siteId = riotChampionNameToSiteId(participant.championName);
    bump(siteId, "games");
    if (participant.win) bump(siteId, "wins");
  }

  for (const team of match.info.teams || []) {
    for (const ban of team.bans || []) {
      if (!ban || ban.championId === -1) continue; // -1 = sin baneo
      const riotName = staticData.championKeyToRiotName[String(ban.championId)];
      if (riotName) bump(riotChampionNameToSiteId(riotName), "bans");
    }
  }

  if (timeline?.info?.frames) {
    const purchasesByParticipant = extractPurchases(timeline);
    for (const participant of match.info.participants || []) {
      const siteId = riotChampionNameToSiteId(participant.championName);
      const purchases = purchasesByParticipant[participant.participantId] || [];
      recordBuild(patchData.builds, siteId, purchases, participant.perks, staticData);
    }
    counters.withTimeline++;
  } else if (wantTimeline) {
    counters.timelineFailed++;
  } else {
    counters.timelineSkipped++;
  }

  return "analyzed";
}

function championEntry(s, matches) {
  return {
    games: s.games,
    winrate: +((s.wins / s.games) * 100).toFixed(1),
    pickrate: +((s.games / matches) * 100).toFixed(2),
    banrate: +((s.bans / matches) * 100).toFixed(2),
  };
}

/* ------------------------------------------------------------------------ *
   Bucle principal de recogida: reparto voraz entre rangos y presupuesto de
   tiempo. En cada paso se toma una partida del rango que lleva MENOS
   analizadas; si no le quedan ids pendientes, se piden los de su siguiente
   jugador (una petición).
 * ------------------------------------------------------------------------ */
async function collect(state, knownIds, staticData, playersByBucket, window, deadline) {
  const pending = {};
  const cursor = {};
  const analyzedBy = {};
  for (const b of RANK_BUCKETS) { pending[b] = []; cursor[b] = 0; analyzedBy[b] = 0; }
  const exhausted = new Set();
  const seen = new Set();
  const counters = { withTimeline: 0, timelineSkipped: 0, timelineFailed: 0 };

  let analyzed = 0;
  let skipped = 0;
  let interrupted = null;
  let stoppedBy = "sin más partidas";

  try {
    for (;;) {
      if (analyzed >= MAX_MATCHES) { stoppedBy = "tope de partidas"; break; }
      if (Date.now() >= deadline) { stoppedBy = "presupuesto de tiempo"; break; }

      const candidates = RANK_BUCKETS.filter((b) => !exhausted.has(b));
      if (!candidates.length) break;
      const bucket = candidates.sort((a, b) => analyzedBy[a] - analyzedBy[b])[0];

      // Rellenar ids de este rango si no le quedan.
      while (!pending[bucket].length && cursor[bucket] < (playersByBucket[bucket] || []).length) {
        if (Date.now() >= deadline) break;
        const puuid = playersByBucket[bucket][cursor[bucket]++];
        const ids = await getPlayerMatchIds(puuid, window.start, window.end);
        for (const id of ids || []) {
          if (knownIds.has(id) || seen.has(id)) continue;
          seen.add(id);
          pending[bucket].push(id);
        }
      }
      if (!pending[bucket].length) {
        if (Date.now() >= deadline) continue; // se saldrá arriba
        exhausted.add(bucket);
        continue;
      }

      const matchId = pending[bucket].shift();
      const result = await analyzeMatch(matchId, bucket, state, staticData, counters);
      if (result === "analyzed") {
        knownIds.add(matchId);
        analyzed++;
        analyzedBy[bucket]++;
        if (analyzed % 50 === 0) {
          const mins = ((Date.now() - window.startedAt) / 60000).toFixed(0);
          console.log(`  ${analyzed} partidas analizadas (${mins} min, ${requestCount} peticiones)…`);
        }
        if (analyzed % SAVE_EVERY_MATCHES === 0) await saveState(state, knownIds); // guarda el progreso
      } else {
        skipped++;
      }
    }
  } catch (err) {
    // Clave caducada, fallo de red, etc.: paramos, pero lo ya acumulado se conserva.
    interrupted = err.message;
    stoppedBy = "error";
  }

  const resumen = RANK_BUCKETS.map((b) => `${b}:${analyzedBy[b]}`).join("  ");
  console.log(`Partidas nuevas analizadas: ${analyzed} (saltadas: ${skipped}) · parada por: ${stoppedBy}`);
  console.log(`  Por rango → ${resumen}`);
  console.log(`  Timelines: ${counters.withTimeline} pedidos, ${counters.timelineSkipped} ahorrados, ${counters.timelineFailed} fallidos`);
  if (interrupted) {
    console.log(`::warning::Ejecución interrumpida tras ${analyzed} partidas: ${interrupted}`);
  }
  return { analyzed, interrupted };
}

async function main() {
  const startedAt = Date.now();
  const deadline = startedAt + RUN_BUDGET_MINUTES * 60000;

  const staticData = await loadStaticData();

  const state = await loadState();
  const knownIds = new Set(state.processedMatchIds);
  const totalBefore = Object.values(state.patches).reduce((sum, p) => sum + p.matches, 0);
  console.log(`Acumulado previo: ${totalBefore} partidas en ${Object.keys(state.patches).length} parche(s), ${knownIds.size} ids recordados.`);

  // Ventana de partidas de esta ejecución: desde donde acabó la anterior hasta
  // ahora. Las ventanas de ejecuciones sucesivas no se solapan, así no se
  // gastan peticiones en partidas que ya se contaron.
  const nowSec = Math.floor(startedAt / 1000);
  const windowStart = state.lastWindowEnd || nowSec - Math.round(FIRST_RUN_LOOKBACK_HOURS * 3600);
  const window = { start: windowStart, end: nowSec, startedAt };
  console.log(`Ventana de partidas: últimas ${((nowSec - windowStart) / 3600).toFixed(1)} h · presupuesto ${RUN_BUDGET_MINUTES} min.`);

  // Si Riot no responde (clave caducada, caída...), no se aborta: se publica
  // igualmente con lo ya acumulado y se avisa con un aviso amarillo.
  let analyzed = 0;
  let interrupted = null;
  try {
    const playersByBucket = await getSampledPlayers();
    if (!RANK_BUCKETS.some((b) => (playersByBucket[b] || []).length)) {
      throw new Error("No se obtuvo ningún jugador. Revisa la clave/región.");
    }
    ({ analyzed, interrupted } = await collect(state, knownIds, staticData, playersByBucket, window, deadline));
  } catch (err) {
    interrupted = err.message;
    console.log(`::warning::No se pudieron descargar partidas nuevas (${err.message}). Se publica con lo ya acumulado.`);
  }

  // Si la ejecución no se interrumpió, la siguiente empieza donde acaba esta.
  if (!interrupted) state.lastWindowEnd = window.end;
  await saveState(state, knownIds);

  const published = choosePublishedPatch(state);
  if (!published) {
    throw new Error(interrupted || "No hay partidas acumuladas todavía. Revisa la clave/región.");
  }

  const patchData = state.patches[published.patch];

  // Solo se publican campeones con muestra suficiente. Pickrate = % de
  // partidas de la muestra en las que aparece el campeón; baneo = % de
  // partidas en las que lo banean.
  const combined = combineBucketStats(patchData.buckets);
  const champions = {};
  let withBuild = 0;
  let belowThreshold = 0;
  for (const [siteId, s] of Object.entries(combined)) {
    if (s.games < MIN_GAMES_FOR_STATS) { belowThreshold++; continue; }
    const build = finalizeBuild(patchData.builds, siteId, staticData);
    if (build) withBuild++;
    champions[siteId] = { ...championEntry(s, patchData.matches), build };
  }

  // Estadísticas por grupo de rango (sin builds, para que el archivo pese poco).
  const ranks = {};
  for (const bucket of RANK_BUCKETS) {
    const bd = patchData.buckets[bucket];
    if (!bd || !bd.matches) continue;
    const champs = {};
    for (const [siteId, s] of Object.entries(bd.stats)) {
      if (s.games < MIN_GAMES_FOR_STATS) continue;
      champs[siteId] = championEntry(s, bd.matches);
    }
    ranks[bucket] = { matches: bd.matches, champions: champs };
  }

  const output = {
    generatedAt: new Date().toISOString(),
    region: "EUW · todos los rangos", // index.html lo muestra en la etiqueta de arriba
    queue: "RANKED_SOLO_5x5",
    rankScope: "all",
    patch: published.patch,
    latestPatch: published.latest,
    usingPreviousPatch: published.usingPreviousPatch,
    ddragonVersion: DDRAGON_VERSION,
    totalGamesSample: patchData.matches,
    matchesByRank: Object.fromEntries(Object.entries(ranks).map(([b, r]) => [b, r.matches])),
    newMatchesThisRun: analyzed,
    minGamesForStats: MIN_GAMES_FOR_STATS,
    minGamesForBuild: MIN_GAMES_FOR_BUILD,
    totalRequestsUsed: requestCount,
    champions,
    ranks,
  };

  // JSON compacto (sin sangrías): el navegador lo descarga en cada visita.
  await writeFile(OUTPUT_PATH, JSON.stringify(output) + "\n", "utf8");
  const minutes = ((Date.now() - startedAt) / 60000).toFixed(0);
  console.log(`\n✔ Guardado en ${OUTPUT_PATH}`);
  console.log(`  Parche publicado ${published.patch}${published.usingPreviousPatch ? ` (el ${published.latest} aún reúne partidas)` : ""} · ${patchData.matches} partidas acumuladas (+${analyzed} en esta ejecución) · ${requestCount} peticiones · ${minutes} min.`);
  console.log(`  Partidas por rango: ${Object.entries(output.matchesByRank).map(([b, n]) => `${b}:${n}`).join("  ")}`);
  console.log(`  ${Object.keys(champions).length} campeones publicados (${withBuild} con build real); ${belowThreshold} omitidos por tener menos de ${MIN_GAMES_FOR_STATS} partidas.`);
}

main().catch((err) => {
  console.error("\n✘ Error ejecutando el script:", err.message);
  process.exit(1);
});
