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

   MUESTREO POR RANGOS
   De cada uno de los 8 grupos de rango se toma el mismo número de jugadores
   (SUMMONERS_PER_BUCKET) y se reparte a partes iguales el cupo de partidas
   nuevas (MAX_MATCHES), así ningún rango domina la muestra. Cada partida se
   asigna al rango del jugador por el que se encontró, porque el
   emparejamiento pone a gente de nivel parecido en la misma partida.
   Resultado publicado:
     - champions : estadísticas de TODOS los rangos juntos (+ builds). Es lo
                   que ya lee index.html.
     - ranks     : estadísticas por grupo de rango (winrate/pickrate/banrate),
                   por si más adelante quieres un filtro por rango en la web.
   Ojo: "todos los rangos" aquí significa los 8 grupos con el MISMO peso. No
   es el reparto real de jugadores (hay muchos más en Oro que en Master).

   ACUMULACIÓN ENTRE EJECUCIONES
   Cada noche el script SUMA las partidas nuevas a las de noches anteriores,
   así los campeones poco jugados van alcanzando muestra suficiente con los
   días. Guarda sus contadores (comprimidos) en data/raw-stats.json.gz, que el
   workflow sube al repo junto con champion-stats.json.
     - Ninguna partida se cuenta dos veces (se recuerdan los ids ya vistos).
     - Los datos se separan por parche: un parche nuevo empieza de cero, y
       mientras no reúna MIN_MATCHES_NEW_PATCH partidas se sigue publicando el
       parche anterior. Solo se conservan los dos parches más recientes.
     - Si el archivo acumulado es de una versión anterior (solo Master+) se
       descarta y se empieza de cero, para que la muestra quede equilibrada.

   MÍNIMO DE PARTIDAS: un campeón solo se publica si aparece en al menos
   MIN_GAMES_FOR_STATS partidas (y su build, si aparece en al menos
   MIN_GAMES_FOR_BUILD). Con pocas partidas un winrate no significa nada
   (4 victorias de 4 = "100%"), así que esos campeones se omiten y la web
   muestra "sin muestra suficiente" en vez de un número engañoso.

   IMPORTANTE — limitaciones honestas de este enfoque:
   - No es el 100% de las partidas del juego (eso exige una "Production Key"
     aprobada por Riot). Es una MUESTRA.
   - La API de Riot no dice en qué orden devuelve las páginas de jugadores de
     cada división; se eligen páginas al azar para repartir el muestreo, pero
     no se puede garantizar una muestra perfectamente aleatoria.
   - Con una clave personal (límite típico: 100 peticiones / 2 min) este
     script tarda bastante (el Timeline duplica las peticiones por partida).
     Está pensado para ejecutarse por un cron (GitHub Actions), no en cada
     visita a la web.
   - Nunca expongas RIOT_API_KEY en el frontend. Este script solo corre en
     GitHub Actions / tu máquina, nunca en el navegador.

   Uso:
     RIOT_API_KEY=RGAPI-xxxx node scripts/fetch-riot-stats.mjs

   Variables de entorno opcionales (para ajustar coste/duración):
     SUMMONERS_PER_BUCKET   (por defecto 50)   jugadores por grupo de rango (8 grupos)
     MATCHES_PER_SUMMONER   (por defecto 3)    partidas recientes por jugador
     MAX_MATCHES            (por defecto 1200) tope de partidas NUEVAS por ejecución,
                                               repartidas a partes iguales entre rangos
     LEAGUE_MAX_PAGE        (por defecto 20)   páginas entre las que se elige al azar
                                               al buscar jugadores de cada división
     REQUEST_DELAY_MS       (por defecto 1300) pausa entre peticiones a Riot
     MIN_GAMES_FOR_STATS    (por defecto 30)   partidas mínimas para publicar un campeón
     MIN_GAMES_FOR_BUILD    (por defecto 30)   partidas mínimas para publicar su build
     MIN_MATCHES_NEW_PATCH  (por defecto 1500) partidas que debe reunir un parche
                                               nuevo antes de sustituir al anterior
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

const SUMMONERS_PER_BUCKET = Number(process.env.SUMMONERS_PER_BUCKET || 50);
const MATCHES_PER_SUMMONER = Number(process.env.MATCHES_PER_SUMMONER || 3);
const MAX_MATCHES = Number(process.env.MAX_MATCHES || 1200);
const LEAGUE_MAX_PAGE = Number(process.env.LEAGUE_MAX_PAGE || 20);
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 1300);
const MIN_GAMES_FOR_STATS = Number(process.env.MIN_GAMES_FOR_STATS || 30);
const MIN_GAMES_FOR_BUILD = Number(process.env.MIN_GAMES_FOR_BUILD || 30);
const MIN_MATCHES_NEW_PATCH = Number(process.env.MIN_MATCHES_NEW_PATCH || 1500);
const RANKED_SOLO_QUEUE = 420;

const STATE_VERSION = 2;
const KEEP_PATCHES = 2;           // parches que se conservan en el archivo acumulado
const MAX_KNOWN_MATCH_IDS = 8000; // ids de partidas ya contadas que se recuerdan
const SAVE_EVERY_MATCHES = 100;   // guarda el progreso cada tantas partidas

// Versión de Data Dragon. Se sustituye por la última publicada al arrancar
// (ver resolveDdragonVersion); este valor es solo un respaldo.
let DDRAGON_VERSION = "16.19.1";
const DDRAGON_LOCALE = "es_ES"; // nombres de objetos/runas en español, como el resto del sitio

// El campeón que devuelve la API de Riot ("championName") coincide con el id
// de Data Dragon (p. ej. "Belveth", "Chogath", "MonkeyKing"...), que a su vez
// es casi siempre igual al slug que usa el sitio (minúsculas, sin símbolos) —
// salvo estas 3 excepciones, donde el nombre público del campeón en el sitio
// difiere del nombre interno de Riot.
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

let requestCount = 0;

// Petición a Riot con reintento automático si llegamos al límite de tasa
// (código 429), respetando la cabecera Retry-After que manda Riot.
async function riotFetch(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    requestCount++;
    const res = await fetch(url, {
      headers: { "X-Riot-Token": RIOT_API_KEY },
    });

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

    await sleep(REQUEST_DELAY_MS);
    return res.json();
  }
  throw new Error(`Demasiados reintentos (429) en ${url}`);
}

/* ------------------------------------------------------------------------ *
   Estado acumulado (data/raw-stats.json.gz)
   {
     version: 2,
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
  return { version: STATE_VERSION, patches: {}, processedMatchIds: [] };
}

async function loadState() {
  try {
    const buf = await readFile(STATE_PATH);
    const state = JSON.parse(gunzipSync(buf).toString("utf8"));
    if (state && state.version === STATE_VERSION && state.patches) {
      state.processedMatchIds = state.processedMatchIds || [];
      return state;
    }
    console.warn("⚠ El archivo acumulado es de una versión anterior (solo Master+): se descarta y se empieza de cero para que la muestra quede equilibrada entre rangos.");
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.warn(`⚠ No se pudo leer el archivo acumulado (${err.message}): se empieza de cero.`);
    }
  }
  return emptyState();
}

async function saveState(state, knownIds) {
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

// Parche que se publica: el más reciente si ya reunió suficientes partidas;
// si no, el anterior (para que la web no se quede casi vacía tras un parche).
function choosePublishedPatch(state) {
  const [latest, previous] = patchesNewestFirst(state);
  if (!latest) return null;
  if (!previous || state.patches[latest].matches >= MIN_MATCHES_NEW_PATCH) {
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
   Descubrimiento de jugadores y partidas
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

// Devuelve { GOLD: [puuid, …], … } con SUMMONERS_PER_BUCKET jugadores por grupo.
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
  console.log(`Jugadores muestreados → ${resumen}`);
  return playersByBucket;
}

// Devuelve solo partidas NUEVAS (que no estén ya en el acumulado), con el
// cupo repartido a partes iguales entre rangos y mezcladas para que, si algo
// se interrumpe, lo ya analizado siga estando equilibrado.
async function getNewMatches(playersByBucket, knownIds) {
  const perBucketCap = Math.ceil(MAX_MATCHES / RANK_BUCKETS.length);
  console.log(`Buscando partidas recientes (hasta ${perBucketCap} nuevas por rango)…`);

  const seen = new Set();
  const byBucket = {};
  for (const bucket of RANK_BUCKETS) {
    byBucket[bucket] = [];
    for (const puuid of playersByBucket[bucket] || []) {
      if (byBucket[bucket].length >= perBucketCap) break;
      const ids = await riotFetch(
        `${REGION_HOST}/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${RANKED_SOLO_QUEUE}&type=ranked&count=${MATCHES_PER_SUMMONER}`
      );
      for (const id of ids || []) {
        if (byBucket[bucket].length >= perBucketCap) break;
        if (knownIds.has(id) || seen.has(id)) continue;
        seen.add(id);
        byBucket[bucket].push(id);
      }
    }
  }

  const interleaved = [];
  for (let i = 0; ; i++) {
    let added = false;
    for (const bucket of RANK_BUCKETS) {
      if (byBucket[bucket][i]) {
        interleaved.push({ matchId: byBucket[bucket][i], bucket });
        added = true;
      }
    }
    if (!added) break;
  }
  const resumen = RANK_BUCKETS.map((b) => `${b}:${byBucket[b].length}`).join("  ");
  console.log(`Partidas nuevas por rango → ${resumen}`);
  return interleaved;
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
  // componentes intermedios (p. ej. "Espada larga") y solo contamos lo que
  // el jugador llevaba puesto de verdad.
  const items = {};
  for (const [id, data] of Object.entries(itemJson.data || {})) {
    const tags = data.tags || [];
    const isConsumableOrTrinket = tags.includes("Consumable") || tags.includes("Trinket");
    const hasFurtherBuild = Array.isArray(data.into) && data.into.length > 0;
    items[id] = {
      name: data.name,
      isBoots: tags.includes("Boots"),
      isBuildEnd: !hasFurtherBuild && !isConsumableOrTrinket && (data.gold?.total || 0) > 0,
      excluded: isConsumableOrTrinket,
    };
  }

  const runeNames = {}; // perk id -> nombre
  const treeNames = {}; // árbol id -> nombre
  for (const tree of runesJson) {
    treeNames[tree.id] = tree.name;
    for (const slot of tree.slots || []) {
      for (const rune of slot.runes || []) {
        runeNames[rune.id] = rune.name;
      }
    }
  }

  // Id numérico del campeón (el que usa Riot en los baneos) -> id de Data
  // Dragon ("Belveth", "MonkeyKing"...). Un campeón baneado no juega la
  // partida, así que su nombre NO aparece entre los participantes: hace falta
  // este mapa para saber a quién corresponde cada baneo.
  const championKeyToRiotName = {};
  for (const champ of Object.values(championJson.data || {})) {
    championKeyToRiotName[String(champ.key)] = champ.id;
  }

  return { items, runeNames, treeNames, championKeyToRiotName };
}

/* ------------------------------------------------------------------------ *
   Extrae, por participante de una partida, su lista de compras (objeto +
   marca de tiempo) a partir del Timeline, descontando los ITEM_UNDO
   (deshacer compra por error de click).
 * ------------------------------------------------------------------------ */
function extractPurchases(timeline) {
  const byParticipant = {};
  for (const frame of timeline?.info?.frames || []) {
    for (const ev of frame.events || []) {
      if (ev.type === "ITEM_PURCHASED") {
        const list = byParticipant[ev.participantId] || (byParticipant[ev.participantId] = []);
        list.push({ itemId: String(ev.itemId), timestamp: ev.timestamp });
      } else if (ev.type === "ITEM_UNDO" && ev.beforeId && !ev.afterId) {
        // Se deshizo la compra del objeto "beforeId": quitamos la última
        // compra registrada de ese mismo objeto para este participante.
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
      b.bootsCounts[p.itemId] = (b.bootsCounts[p.itemId] || 0) + 1;
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

// Convierte los contadores acumulados de un campeón en el build final a
// publicar: inicial, botas, núcleo (en orden real de compra), situacionales
// y runas más usadas. Devuelve null si no hay muestra suficiente.
function finalizeBuild(buildStats, siteId, staticData) {
  const stats = buildStats[siteId];
  if (!stats || stats.games < MIN_GAMES_FOR_BUILD) return null;

  const itemName = (id) => staticData.items[id]?.name || null;

  const starter = topEntries(stats.starterCounts, 2).map(itemName).filter(Boolean);
  const [bootsId] = topEntries(stats.bootsCounts, 1);
  const boots = bootsId ? itemName(bootsId) : null;

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
      primaryTree: staticData.treeNames[primaryTreeId] || null,
      secondaryTree: staticData.treeNames[secondaryTreeId] || null,
    };
  }

  return {
    sampleGames: stats.games,
    starter,
    boots,
    core: coreIds.map(itemName).filter(Boolean),
    situational: situationalIds.map(itemName).filter(Boolean),
    runes,
  };
}

/* ------------------------------------------------------------------------ *
   Analiza las partidas nuevas y las SUMA al estado acumulado.
   Cada partida se descarga entera (detalle + timeline) antes de tocar los
   contadores, así una caída a mitad de partida nunca deja datos a medias.
 * ------------------------------------------------------------------------ */
async function accumulateMatches(matches, state, knownIds, staticData) {
  console.log(`Analizando ${matches.length} partidas nuevas (con su timeline de compras)…`);

  let analyzed = 0;
  let skipped = 0;
  let timelineFailed = 0;
  let interrupted = null;

  for (const { matchId, bucket } of matches) {
    try {
      const match = await riotFetch(`${REGION_HOST}/lol/match/v5/matches/${matchId}`);
      const patch = String(match?.info?.gameVersion || "").split(".").slice(0, 2).join(".");
      if (!match?.info || !patch) { skipped++; continue; }

      const timeline = await getTimeline(matchId);

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
      } else {
        timelineFailed++;
      }

      knownIds.add(matchId);
      analyzed++;

      if (analyzed % 20 === 0) console.log(`  ${analyzed}/${matches.length} partidas procesadas…`);
      if (analyzed % SAVE_EVERY_MATCHES === 0) {
        pruneOldPatches(state);
        await saveState(state, knownIds); // guarda el progreso por si algo falla más adelante
      }
    } catch (err) {
      // Clave caducada, fallo de red, etc.: paramos, pero lo ya acumulado se conserva.
      interrupted = err.message;
      break;
    }
  }

  console.log(`Partidas nuevas analizadas: ${analyzed}, saltadas: ${skipped}, sin timeline: ${timelineFailed}`);
  if (interrupted) {
    console.log(`::warning::Ejecución interrumpida tras ${analyzed} partidas: ${interrupted}`);
  }
  return { analyzed, interrupted };
}

function championEntry(s, matches) {
  return {
    games: s.games,
    winrate: +((s.wins / s.games) * 100).toFixed(1),
    pickrate: +((s.games / matches) * 100).toFixed(2),
    banrate: +((s.bans / matches) * 100).toFixed(2),
  };
}

async function main() {
  const startedAt = Date.now();

  const staticData = await loadStaticData();

  const state = await loadState();
  const knownIds = new Set(state.processedMatchIds);
  const totalBefore = Object.values(state.patches).reduce((sum, p) => sum + p.matches, 0);
  console.log(`Acumulado previo: ${totalBefore} partidas en ${Object.keys(state.patches).length} parche(s), ${knownIds.size} ids recordados.`);

  const playersByBucket = await getSampledPlayers();
  if (!RANK_BUCKETS.some((b) => (playersByBucket[b] || []).length)) {
    throw new Error("No se obtuvo ningún jugador. Revisa la clave/región.");
  }

  const matches = await getNewMatches(playersByBucket, knownIds);
  console.log(`${matches.length} partidas nuevas por analizar.`);

  const { analyzed, interrupted } = await accumulateMatches(matches, state, knownIds, staticData);

  pruneOldPatches(state);
  await saveState(state, knownIds);

  const published = choosePublishedPatch(state);
  if (!published) {
    // Nada acumulado todavía (p. ej. la clave falló en la primera ejecución).
    throw new Error(interrupted || "No hay partidas acumuladas todavía. Revisa la clave/región.");
  }

  const patchData = state.patches[published.patch];

  // Solo se publican campeones con muestra suficiente. Pickrate = % de
  // partidas de la muestra en las que aparece el campeón (la definición
  // habitual en webs de estadísticas); baneo = % de partidas en las que lo
  // banean.
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
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(0);
  console.log(`\n✔ Guardado en ${OUTPUT_PATH}`);
  console.log(`  Parche publicado ${published.patch}${published.usingPreviousPatch ? ` (el ${published.latest} aún reúne partidas)` : ""} · ${patchData.matches} partidas acumuladas (+${analyzed} esta noche) · ${requestCount} peticiones · ${seconds}s.`);
  console.log(`  Partidas por rango: ${Object.entries(output.matchesByRank).map(([b, n]) => `${b}:${n}`).join("  ")}`);
  console.log(`  ${Object.keys(champions).length} campeones publicados (${withBuild} con build real); ${belowThreshold} omitidos por tener menos de ${MIN_GAMES_FOR_STATS} partidas.`);
}

main().catch((err) => {
  console.error("\n✘ Error ejecutando el script:", err.message);
  process.exit(1);
});
