#!/usr/bin/env node
/* =============================================================================
   GrietaMeta — fetch-riot-stats.mjs
   ============================================================================
   Descarga partidas clasificatorias recientes de jugadores de Elo alto (EUW)
   usando la API oficial de Riot Games, y calcula winrate / pickrate / banrate
   reales por campeón. El resultado se guarda en champion-stats.json, en la
   raíz del repo, que index.html carga para sustituir los datos simulados.

   IMPORTANTE — limitaciones honestas de este enfoque:
   - No es el 100% de las partidas del juego (eso exige una "Production Key"
     aprobada por Riot). Es una MUESTRA de partidas Diamante+ de EUW.
   - Con una clave personal (límite típico: 100 peticiones / 2 min) este
     script tarda varios minutos. Está pensado para ejecutarse por un cron
     (GitHub Actions), no en cada visita a la web.
   - Nunca expongas RIOT_API_KEY en el frontend. Este script solo corre en
     GitHub Actions / tu máquina, nunca en el navegador.

   Uso:
     RIOT_API_KEY=RGAPI-xxxx node scripts/fetch-riot-stats.mjs

   Variables de entorno opcionales (para ajustar coste/duración):
     SUMMONER_SAMPLE_SIZE   (por defecto 120)  nº de jugadores de los que partimos
     MATCHES_PER_SUMMONER   (por defecto 3)    partidas recientes por jugador
     MAX_MATCHES            (por defecto 350)  tope de partidas únicas a analizar
     REQUEST_DELAY_MS       (por defecto 1300) pausa entre peticiones a Riot
   ============================================================================ */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "champion-stats.json");

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

async function aggregateStats(matchIds) {
  console.log(`Analizando ${matchIds.length} partidas únicas…`);
  const stats = {}; // siteId -> { games, wins, bans }
  const bump = (siteId, field, amount = 1) => {
    if (!stats[siteId]) stats[siteId] = { games: 0, wins: 0, bans: 0 };
    stats[siteId][field] += amount;
  };

  let analyzed = 0;
  let skipped = 0;

  for (const matchId of matchIds) {
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

    analyzed++;
    if (analyzed % 20 === 0) console.log(`  ${analyzed}/${matchIds.length} partidas procesadas…`);
  }

  console.log(`Partidas analizadas: ${analyzed}, saltadas (no encontradas): ${skipped}`);
  return { stats, totalGamesSample: analyzed };
}

async function main() {
  const startedAt = Date.now();
  const puuids = await getHighEloPuuids();
  if (!puuids.length) throw new Error("No se obtuvo ningún jugador de Elo alto. Revisa la clave/región.");

  const matchIds = await getMatchIds(puuids);
  if (!matchIds.length) throw new Error("No se obtuvo ninguna partida. Revisa la clave/región.");

  const { stats, totalGamesSample } = await aggregateStats(matchIds);

  // winrate/pickrate/banrate en % sobre el total de partidas de la muestra.
  // totalSlots = partidas * 10 campeones en juego, para el pickrate.
  const totalSlots = totalGamesSample * 10;
  const champions = {};
  for (const [siteId, s] of Object.entries(stats)) {
    if (s.games === 0) continue;
    champions[siteId] = {
      games: s.games,
      winrate: +((s.wins / s.games) * 100).toFixed(1),
      pickrate: +((s.games / totalSlots) * 100).toFixed(2),
      banrate: +((s.bans / totalGamesSample) * 100).toFixed(2),
    };
  }

  const output = {
    generatedAt: new Date().toISOString(),
    region: "EUW",
    queue: "RANKED_SOLO_5x5",
    totalGamesSample,
    totalRequestsUsed: requestCount,
    champions,
  };

  await writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(0);
  console.log(`\n✔ Guardado en ${OUTPUT_PATH}`);
  console.log(`  ${Object.keys(champions).length} campeones con datos, ${totalGamesSample} partidas, ${requestCount} peticiones, ${seconds}s.`);
}

main().catch((err) => {
  console.error("\n✘ Error ejecutando el script:", err.message);
  process.exit(1);
});
