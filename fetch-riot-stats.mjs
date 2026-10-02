#!/usr/bin/env node
/* =============================================================================
   GrietaMeta — fetch-riot-stats.mjs
   ============================================================================
   Descarga partidas clasificatorias recientes de jugadores de Elo alto (EUW)
   usando la API oficial de Riot Games, y calcula por campeón:
     - winrate / pickrate / banrate
     - build de objetos real (inicial, botas, núcleo en orden de compra,
       situacionales), con el ID de cada objeto (para mostrar su icono)
     - runas reales más usadas (keystone + árbol principal + árbol secundario),
       con el icono real de la keystone

   ACUMULACIÓN ENTRE EJECUCIONES
   ------------------------------------------------------------------------
   Cada ejecución no empieza de cero: carga el estado interno guardado por la
   ejecución anterior (riot-stats-state.json) y le SUMA las partidas nuevas
   que encuentra, así la muestra por campeón crece noche a noche dentro del
   mismo parche. En cuanto detecta que el parche ha cambiado (mirando el
   "gameVersion" real de las partidas), reinicia el acumulado — mezclar datos
   de metas distintos daría estadísticas falsas.

   Esto genera DOS archivos:
     - champion-stats.json      → el público, lo lee index.html
     - riot-stats-state.json    → el interno, lo necesita la PRÓXIMA ejecución
       para poder seguir sumando. Debe commitearse igual que el público.

   IMPORTANTE — limitaciones honestas de este enfoque:
   - No es el 100% de las partidas del juego (eso exige una "Production Key"
     aprobada por Riot). Es una MUESTRA de partidas Diamante+ de EUW.
   - Nunca expongas RIOT_API_KEY en el frontend. Este script solo corre en
     GitHub Actions / tu máquina, nunca en el navegador.

   Uso:
     RIOT_API_KEY=RGAPI-xxxx node scripts/fetch-riot-stats.mjs

   Variables de entorno opcionales (para ajustar coste/duración):
     SUMMONER_SAMPLE_SIZE   (por defecto 120)  nº de jugadores de los que partimos
     MATCHES_PER_SUMMONER   (por defecto 3)    partidas recientes por jugador
     MAX_MATCHES            (por defecto 350)  tope de partidas NUEVAS a analizar esta vez
     REQUEST_DELAY_MS       (por defecto 1300) pausa entre peticiones a Riot
   ============================================================================ */

import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "champion-stats.json");
const STATE_PATH = path.join(__dirname, "..", "riot-stats-state.json");

const RIOT_API_KEY = process.env.RIOT_API_KEY;
if (!RIOT_API_KEY) {
  console.error("Falta RIOT_API_KEY. Ejemplo: RIOT_API_KEY=RGAPI-xxxx node scripts/fetch-riot-stats.mjs");
  process.exit(1);
}

// EUW: host de plataforma (summoner/league) vs host regional (match/account).
const PLATFORM_HOST = "https://euw1.api.riotgames.com";
const REGION_HOST = "https://europe.api.riotgames.com";

const SUMMONER_SAMPLE_SIZE = Number(process.env.SUMMONER_SAMPLE_SIZE || 120);
const MATCHES_PER_SUMMONER = Number(process.env.MATCHES_PER_SUMMONER || 3);
const MAX_MATCHES = Number(process.env.MAX_MATCHES || 350);
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 1300);
const RANKED_SOLO_QUEUE = 420;

// Mismo parche que usa index.html para las imágenes de campeones/objetos —
// mantenlos sincronizados.
const DDRAGON_VERSION = "16.19.1";
const DDRAGON_LOCALE = "es_ES"; // nombres de objetos/runas en español, como el resto del sitio

// El campo "championName" que devuelve la API de Riot coincide con el id de
// Data Dragon (p. ej. "Belveth", "Chogath", "MonkeyKing"...), que a su vez es
// casi siempre igual al slug que usa el sitio (minúsculas, sin símbolos) —
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

async function getHighEloPuuids() {
  console.log("Descargando ligas Challenger / Grandmaster / Master de EUW…");
  const [challenger, grandmaster, master] = await Promise.all([
    riotFetch(`${PLATFORM_HOST}/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5`),
    riotFetch(`${PLATFORM_HOST}/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5`),
    riotFetch(`${PLATFORM_HOST}/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5`),
  ]);

  const entries = [
    ...(challenger?.entries || []),
    ...(grandmaster?.entries || []),
    ...(master?.entries || []),
  ];

  const sample = shuffle(entries).slice(0, SUMMONER_SAMPLE_SIZE);
  console.log(`${entries.length} jugadores de Elo alto encontrados, usando una muestra de ${sample.length}.`);

  const puuids = [];
  for (const entry of sample) {
    if (entry.puuid) {
      puuids.push(entry.puuid);
      continue;
    }
    // Compatibilidad con respuestas antiguas que no incluyen puuid directamente.
    if (entry.summonerId) {
      const summoner = await riotFetch(`${PLATFORM_HOST}/lol/summoner/v4/summoners/${entry.summonerId}`);
      if (summoner?.puuid) puuids.push(summoner.puuid);
    }
  }
  return puuids;
}

async function getMatchIds(puuids) {
  console.log(`Buscando partidas recientes de ${puuids.length} jugadores…`);
  const matchIdSet = new Set();
  for (const puuid of puuids) {
    if (matchIdSet.size >= MAX_MATCHES) break;
    const ids = await riotFetch(
      `${REGION_HOST}/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${RANKED_SOLO_QUEUE}&type=ranked&count=${MATCHES_PER_SUMMONER}`
    );
    (ids || []).forEach((id) => matchIdSet.add(id));
  }
  return [...matchIdSet].slice(0, MAX_MATCHES);
}

function getTimeline(matchId) {
  return riotFetch(`${REGION_HOST}/lol/match/v5/matches/${matchId}/timeline`);
}

/* ------------------------------------------------------------------------ *
   Estado acumulado entre ejecuciones.
 * ------------------------------------------------------------------------ */
async function loadPreviousState() {
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null; // primera ejecución, o archivo corrupto/ausente
  }
}

function emptyState(patch) {
  return { patch, seenMatchIds: [], totalGamesSample: 0, champions: {}, buildStats: {} };
}

/* ------------------------------------------------------------------------ *
   Datos estáticos de Data Dragon (objetos y runas) — no cuentan para el
   límite de peticiones de Riot, son un CDN público aparte.
 * ------------------------------------------------------------------------ */
async function loadItemAndRuneData() {
  console.log("Descargando catálogo de objetos y runas (Data Dragon)…");
  const [itemRes, runesRes] = await Promise.all([
    fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/${DDRAGON_LOCALE}/item.json`),
    fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/${DDRAGON_LOCALE}/runesReforged.json`),
  ]);
  const itemJson = await itemRes.json();
  const runesJson = await runesRes.json();

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
  const runeIcons = {}; // perk id -> URL completa del icono
  const treeNames = {}; // árbol id -> nombre
  for (const tree of runesJson) {
    treeNames[tree.id] = tree.name;
    for (const slot of tree.slots || []) {
      for (const rune of slot.runes || []) {
        runeNames[rune.id] = rune.name;
        if (rune.icon) runeIcons[rune.id] = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
      }
    }
  }

  return { items, runeNames, runeIcons, treeNames };
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
// y runas más usadas. Cada objeto lleva id + nombre, para poder pintar su
// icono real en la web.
function finalizeBuild(buildStats, siteId, staticData) {
  const stats = buildStats[siteId];
  if (!stats || stats.games < 5) return null; // muestra demasiado pequeña para fiarnos

  const toItem = (id) => (staticData.items[id] ? { id, name: staticData.items[id].name } : null);

  const starter = topEntries(stats.starterCounts, 2).map(toItem).filter(Boolean);
  const [bootsId] = topEntries(stats.bootsCounts, 1);
  const boots = bootsId ? toItem(bootsId) : null;

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
    core: coreIds.map(toItem).filter(Boolean),
    situational: situationalIds.map(toItem).filter(Boolean),
    runes,
  };
}

// Procesa las partidas NUEVAS (ya filtradas, sin las que veníamos arrastrando
// de ejecuciones anteriores) y SUMA sus datos sobre los acumuladores que se
// le pasan (stats/buildStats), que pueden venir ya con datos de antes.
async function aggregateStats(newMatchIds, staticData, stats, buildStats) {
  console.log(`Analizando ${newMatchIds.length} partidas nuevas (con su timeline de compras)…`);

  const bump = (siteId, field, amount = 1) => {
    if (!stats[siteId]) stats[siteId] = { games: 0, wins: 0, bans: 0 };
    stats[siteId][field] += amount;
  };

  let analyzed = 0;
  let skipped = 0;
  let timelineFailed = 0;
  const processedIds = [];

  for (const matchId of newMatchIds) {
    const match = await riotFetch(`${REGION_HOST}/lol/match/v5/matches/${matchId}`);
    if (!match?.info) { skipped++; continue; }

    for (const participant of match.info.participants || []) {
      const siteId = riotChampionNameToSiteId(participant.championName);
      bump(siteId, "games");
      if (participant.win) bump(siteId, "wins");
    }

    for (const team of match.info.teams || []) {
      for (const ban of team.bans || []) {
        if (!ban || ban.championId === -1 || !ban.pickTurn) continue;
        // El id numérico de baneo hay que mapearlo con los participantes de
        // la propia partida (Riot no da el nombre del campeón baneado
        // directamente en teams[].bans, solo el championId).
        const banned = match.info.participants.find((p) => p.championId === ban.championId);
        const siteId = banned ? riotChampionNameToSiteId(banned.championName) : null;
        if (siteId) bump(siteId, "bans");
      }
    }

    // Timeline para objetos/runas (petición extra por partida).
    const timeline = await getTimeline(matchId);
    if (timeline?.info?.frames) {
      const purchasesByParticipant = extractPurchases(timeline);
      for (const participant of match.info.participants || []) {
        const siteId = riotChampionNameToSiteId(participant.championName);
        const purchases = purchasesByParticipant[participant.participantId] || [];
        recordBuild(buildStats, siteId, purchases, participant.perks, staticData);
      }
    } else {
      timelineFailed++;
    }

    analyzed++;
    processedIds.push(matchId);
    if (analyzed % 20 === 0) console.log(`  ${analyzed}/${newMatchIds.length} partidas nuevas procesadas…`);
  }

  console.log(`Partidas nuevas analizadas: ${analyzed}, saltadas: ${skipped}, sin timeline: ${timelineFailed}`);
  return { analyzed, processedIds };
}

async function main() {
  const startedAt = Date.now();

  const staticData = await loadItemAndRuneData();

  const puuids = await getHighEloPuuids();
  if (!puuids.length) throw new Error("No se obtuvo ningún jugador de Elo alto. Revisa la clave/región.");

  const candidateMatchIds = await getMatchIds(puuids);
  if (!candidateMatchIds.length) throw new Error("No se obtuvo ninguna partida. Revisa la clave/región.");

  // Miramos el parche real de una partida para decidir si continuamos el
  // acumulado anterior o si tenemos que empezar de cero (patch nuevo).
  const sampleMatch = await riotFetch(`${REGION_HOST}/lol/match/v5/matches/${candidateMatchIds[0]}`);
  const currentPatch = sampleMatch?.info?.gameVersion
    ? sampleMatch.info.gameVersion.split(".").slice(0, 2).join(".")
    : null;

  const previousState = await loadPreviousState();
  let state;
  if (!previousState || !currentPatch || previousState.patch !== currentPatch) {
    console.log(
      previousState
        ? `Parche nuevo detectado (${previousState.patch} → ${currentPatch}): reiniciando el acumulado.`
        : `Sin estado previo: empezando de cero en el parche ${currentPatch}.`
    );
    state = emptyState(currentPatch);
  } else {
    console.log(`Continuando el acumulado del parche ${currentPatch} (${previousState.seenMatchIds.length} partidas ya contadas).`);
    state = previousState;
  }

  const seen = new Set(state.seenMatchIds);
  const newMatchIds = candidateMatchIds.filter((id) => !seen.has(id));
  console.log(`${candidateMatchIds.length} partidas candidatas, ${newMatchIds.length} son nuevas de verdad.`);

  const { analyzed, processedIds } = await aggregateStats(newMatchIds, staticData, state.champions, state.buildStats);

  state.seenMatchIds = [...seen, ...processedIds];
  state.totalGamesSample += analyzed;
  state.patch = currentPatch;

  // winrate/pickrate/banrate en % sobre el total ACUMULADO de partidas de
  // este parche. totalSlots = partidas * 10 campeones en juego.
  const totalSlots = state.totalGamesSample * 10;
  const champions = {};
  let withBuild = 0;
  for (const [siteId, s] of Object.entries(state.champions)) {
    if (s.games === 0) continue;
    const build = finalizeBuild(state.buildStats, siteId, staticData);
    if (build) withBuild++;
    champions[siteId] = {
      games: s.games,
      winrate: +((s.wins / s.games) * 100).toFixed(1),
      pickrate: totalSlots > 0 ? +((s.games / totalSlots) * 100).toFixed(2) : 0,
      banrate: state.totalGamesSample > 0 ? +((s.bans / state.totalGamesSample) * 100).toFixed(2) : 0,
      build,
    };
  }

  const output = {
    generatedAt: new Date().toISOString(),
    region: "EUW",
    queue: "RANKED_SOLO_5x5",
    patch: currentPatch,
    totalGamesSample: state.totalGamesSample,
    totalRequestsUsed: requestCount,
    champions,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");
  await writeFile(STATE_PATH, JSON.stringify(state) + "\n", "utf8");

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(0);
  console.log(`\n✔ Guardado en ${OUTPUT_PATH} y ${STATE_PATH}`);
  console.log(
    `  ${Object.keys(champions).length} campeones con datos (${withBuild} con build real), ` +
    `${state.totalGamesSample} partidas acumuladas del parche ${currentPatch} (+${analyzed} hoy), ` +
    `${requestCount} peticiones, ${seconds}s.`
  );
}

main().catch((err) => {
  console.error("\n✘ Error ejecutando el script:", err.message);
  process.exit(1);
});
