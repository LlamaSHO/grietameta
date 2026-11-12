/* Data Dragon: el CDN público de Riot con imágenes y textos del juego.
   La versión se lee de versions.json (con caché de unas horas en el
   navegador) para no tener que tocar el código en cada parche. */

const CDN = "https://ddragon.leagueoflegends.com";
const LOCALE = "es_ES";
export const FALLBACK_DDRAGON_VERSION = "16.21.1";

const VERSION_KEY = "gm_ddragon_version";
const VERSION_TTL = 6 * 60 * 60 * 1000; // 6 horas

function readCachedVersion() {
  try {
    const raw = JSON.parse(localStorage.getItem(VERSION_KEY) || "null");
    if (raw && raw.v) return raw;
  } catch {
    /* localStorage bloqueado: se ignora */
  }
  return null;
}

// Versión conocida ahora mismo (sin red): la de la caché o la de respaldo.
export function knownDdragonVersion() {
  return readCachedVersion()?.v || FALLBACK_DDRAGON_VERSION;
}

let versionPromise = null;

// Última versión publicada. Nunca falla: si no hay red devuelve la de caché
// o `fallback`.
export function getDdragonVersion(fallback = FALLBACK_DDRAGON_VERSION) {
  if (versionPromise) return versionPromise;
  const cached = readCachedVersion();
  if (cached && Date.now() - cached.t < VERSION_TTL) {
    versionPromise = Promise.resolve(cached.v);
    return versionPromise;
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  versionPromise = fetch(`${CDN}/api/versions.json`, { signal: ctrl.signal })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
    .then((list) => {
      const v = Array.isArray(list) && list[0];
      if (!v) throw new Error("versions.json vacío");
      try {
        localStorage.setItem(VERSION_KEY, JSON.stringify({ v, t: Date.now() }));
      } catch {
        /* sin caché */
      }
      return v;
    })
    .catch(() => cached?.v || fallback)
    .finally(() => clearTimeout(timer));
  return versionPromise;
}

// ---- URLs de imágenes -------------------------------------------------------
export const championIconUrl = (v, ddId) => `${CDN}/cdn/${v}/img/champion/${ddId}.png`;
export const championSplashUrl = (ddId, skin = 0) => `${CDN}/cdn/img/champion/splash/${ddId}_${skin}.jpg`;
export const itemIconUrl = (v, id) => `${CDN}/cdn/${v}/img/item/${id}.png`;
export const passiveIconUrl = (v, file) => `${CDN}/cdn/${v}/img/passive/${file}`;
export const spellIconUrl = (v, file) => `${CDN}/cdn/${v}/img/spell/${file}`;
export const runeIconUrl = (icon) => (/^https?:/.test(icon) ? icon : `${CDN}/cdn/img/${icon}`);

// ---- JSON con textos en español (memorizados por versión) -------------------
const memo = new Map();
function getJson(url) {
  if (!memo.has(url)) {
    const p = fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status} ${url}`))))
      .catch((err) => {
        memo.delete(url); // se puede reintentar más tarde
        throw err;
      });
    memo.set(url, p);
  }
  return memo.get(url);
}

// Índice de campeones: { [ddId]: { id, name, title, tags } }
export async function fetchChampionIndex(v) {
  const json = await getJson(`${CDN}/cdn/${v}/data/${LOCALE}/champion.json`);
  return json.data || {};
}

// Ficha de un campeón (habilidades, título…) o null si no existe.
export async function fetchChampionDetail(v, ddId) {
  try {
    const json = await getJson(`${CDN}/cdn/${v}/data/${LOCALE}/champion/${ddId}.json`);
    return json.data?.[ddId] || null;
  } catch {
    return null;
  }
}

// Ramas de runas: [{ id, key, name, icon, slots: [{ runes: [{ name, icon }] }] }]
export async function fetchRuneTrees(v) {
  try {
    return await getJson(`${CDN}/cdn/${v}/data/${LOCALE}/runesReforged.json`);
  } catch {
    return [];
  }
}
