/* ARC Raiders · visor de mapas: carga y prepara los datos de /arc-raiders/mapas.

   Fuentes (public/data/arc-raiders):
   - quests.json            → mapas (maps[] con sus vistas/plantas) y misiones (RaidTheory/arcraiders-data, MIT).
   - enemies.json           → ARC con amenaza, tipo, punto débil y mapas (RaidTheory/arcraiders-data, MIT).
   - calibracion-mapas.json → qué vistas de mapa están calibradas con MetaForge.
   - misiones-puntos.json   → puntos de cada misión por vista de mapa, en % de la imagen (MetaForge).
   - zonas-enemigos.json    → puntos de aparición de cada ARC por vista de mapa, en % (MetaForge).

   Las claves de puntos y zonas son el «file» de la vista (p. ej. stella_montis_upper),
   no el id del mapa. Todo se pide una sola vez y se guarda en caché; si falla un
   archivo de puntos o zonas el visor sigue funcionando sin esa capa. */

import { fetchArcEnemies, fetchArcQuests, arcBotImageUrl, arcMapImageUrl, arcMapThumbUrl } from "@/services/arcRaiders";

const DATA_DIR = "/data/arc-raiders";

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

// Caché por archivo: la promesa se guarda y, si falla, se borra para poder reintentar.
const cache = new Map();
function cached(key, loader) {
  if (!cache.has(key)) {
    const p = loader().catch((err) => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, p);
  }
  return cache.get(key);
}

export const fetchArcMapCalibration = () => cached("calibracion", () => getJson(`${DATA_DIR}/calibracion-mapas.json`));
export const fetchArcQuestPoints = () => cached("puntos", () => getJson(`${DATA_DIR}/misiones-puntos.json`));
export const fetchArcEnemyZones = () => cached("zonas", () => getJson(`${DATA_DIR}/zonas-enemigos.json`));
const fetchQuests = () => cached("quests", fetchArcQuests);
const fetchEnemies = () => cached("enemies", fetchArcEnemies);

/* ---------- Constantes de presentación ---------- */

// Descripción corta de cada mapa (diseño ArcMapa).
const MAP_DESC = {
  dam_battlegrounds: "Presa, pantanos y la Matriarca",
  buried_city: "Casco antiguo y aparcamientos",
  the_spaceport: "Torres de lanzamiento y túneles",
  the_blue_gate: "Autopista derrumbada y claro desolado",
  stella_montis: "Dos plantas",
  riven_tides: "Hotel, rompeolas y puerto",
};

// Comerciantes: color (clase c-*) y retrato.
const TRADERS = {
  Shani: { cls: "c-y", file: "shani" },
  Celeste: { cls: "c-c", file: "celeste" },
  "Tian Wen": { cls: "c-r", file: "tian-wen" },
  Apollo: { cls: "c-o", file: "apollo" },
  Lance: { cls: "c-g", file: "lance" },
};
export const traderClass = (name) => TRADERS[name]?.cls || "c-y";
export const traderPortraitUrl = (name) =>
  `/images/arc-raiders/comerciantes/${TRADERS[name]?.file || "shani"}.webp`;

// Amenaza: orden y clase de color.
const THREATS = {
  Extreme: { order: 0, cls: "t-ext", es: "Extrema" },
  Critical: { order: 1, cls: "t-cri", es: "Crítica" },
  High: { order: 2, cls: "t-alt", es: "Alta" },
  Moderate: { order: 3, cls: "t-mod", es: "Moderada" },
  Low: { order: 4, cls: "t-baj", es: "Baja" },
};

/* ---------- Utilidades de puntos ---------- */

// Encuadre de un grupo de puntos: centro de su caja y el nivel de zoom (índice
// de `levels`) más alto en el que caben todos con un margen.
export function framePoints(points, levels, margin = 84) {
  if (!points?.length) return null;
  let x0 = 100, x1 = 0, y0 = 100, y1 = 0;
  for (const [x, y] of points) {
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const w = Math.max(x1 - x0, 1);
  const h = Math.max(y1 - y0, 1);
  let level = 0;
  levels.forEach((z, i) => {
    if (w * z <= margin && h * z <= margin) level = i;
  });
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, level };
}

// Quita puntos repetidos (la fuente trae algunos duplicados a 0,1 % de distancia).
function dedupe(points) {
  const out = [];
  for (const p of points || []) {
    if (!Array.isArray(p) || p.length < 2) continue;
    if (!out.some((q) => Math.abs(q[0] - p[0]) < 0.25 && Math.abs(q[1] - p[1]) < 0.25)) out.push([p[0], p[1]]);
  }
  return out;
}

/* ---------- Carga y normalización ---------- */

/**
 * Carga todo lo que necesita el visor. Devuelve:
 * { maps, quests, enemies, warnings, generated }
 * - maps[]:    { id, name, desc, views: [{ file, label, img, aspect, calibrated }] }
 * - quests[]:  { id, name, trader, traderCls, portrait, objectives, rewardText, mapIds, points: { [viewFile]: [[x,y]…] } }
 * - enemies[]: { id, name, type, threat, threatCls, threatOrder, img, weakness, mapNames, zones: { [viewFile]: [[x,y]…] } }
 * - warnings[]: textos para avisar si falló una capa opcional.
 * Lanza un error solo si no se pueden leer las misiones (sin ellas no hay mapas).
 */
export function loadArcMapData() {
  return cached("bundle", async () => {
    const [questsRes, enemiesRes, calRes, ptsRes, zonesRes] = await Promise.allSettled([
      fetchQuests(),
      fetchEnemies(),
      fetchArcMapCalibration(),
      fetchArcQuestPoints(),
      fetchArcEnemyZones(),
    ]);
    if (questsRes.status !== "fulfilled") throw questsRes.reason || new Error("No se pudieron cargar los mapas");

    const warnings = [];
    const questsJson = questsRes.value || {};
    const enemiesJson = enemiesRes.status === "fulfilled" ? enemiesRes.value : null;
    const calibration = calRes.status === "fulfilled" ? calRes.value?.mapas || {} : null;
    const points = ptsRes.status === "fulfilled" ? ptsRes.value?.puntos || {} : {};
    const zones = zonesRes.status === "fulfilled" ? zonesRes.value?.zonas || {} : {};
    if (!enemiesJson) warnings.push("No se pudo cargar la lista de enemigos.");
    if (ptsRes.status !== "fulfilled") warnings.push("No se pudieron cargar los puntos de las misiones.");
    if (zonesRes.status !== "fulfilled") warnings.push("No se pudieron cargar las zonas de los enemigos.");

    const maps = (questsJson.maps || []).map((m) => ({
      id: m.id,
      name: m.name,
      desc: MAP_DESC[m.id] || "",
      views: (m.views || []).map((v) => ({
        file: v.file,
        label: v.label || "",
        img: arcMapImageUrl(v.file),
        thumb: arcMapThumbUrl(v.file),
        aspect: v.width && v.height ? v.width / v.height : 1,
        // Sin el archivo de calibración se da por bueno lo que traigan los puntos.
        calibrated: calibration ? !!calibration[v.file] : true,
      })),
    }));

    const quests = (questsJson.quests || []).map((q) => {
      const pts = {};
      for (const [file, list] of Object.entries(points[q.id] || {})) {
        const clean = dedupe(list);
        if (clean.length) pts[file] = clean;
      }
      return {
        id: q.id,
        name: q.name,
        trader: q.trader,
        traderCls: traderClass(q.trader),
        portrait: traderPortraitUrl(q.trader),
        objectives: q.objectives || [],
        rewardText: (q.rewards || []).map((r) => (r.qty > 1 ? `${r.name} ×${r.qty}` : r.name)).join(", "),
        mapIds: q.mapIds || [],
        order: q.order ?? 0,
        points: pts,
      };
    });

    const enemies = ((enemiesJson && enemiesJson.enemies) || [])
      .map((e) => {
        const t = THREATS[e.threat] || THREATS.Moderate;
        const z = {};
        for (const [file, list] of Object.entries(zones[e.name] || {})) {
          if (list?.length) z[file] = list.filter((p) => Array.isArray(p) && p.length >= 2);
        }
        return {
          id: e.id,
          name: e.name,
          type: e.type || "",
          threat: e.threatEs || t.es,
          threatCls: t.cls,
          threatOrder: t.order,
          img: e.hasImage === false ? "" : arcBotImageUrl(e.id),
          weakness: e.weakness || "",
          mapNames: e.maps || [],
          zones: z,
        };
      })
      .sort((a, b) => a.threatOrder - b.threatOrder || a.name.localeCompare(b.name));

    return { maps, quests, enemies, warnings, generated: questsJson.meta?.generated || "" };
  });
}

/* ---------- Consultas por mapa ---------- */

// Misiones que se hacen en un mapa: las que lo nombran o tienen puntos en alguna de sus vistas.
export function questsForMap(quests, map) {
  if (!map) return [];
  const files = map.views.map((v) => v.file);
  return quests
    .filter((q) => q.mapIds.includes(map.id) || files.some((f) => q.points[f]))
    .sort((a, b) => a.order - b.order);
}

// ARC de un mapa: los que lo nombran o tienen zonas en alguna de sus vistas.
export function enemiesForMap(enemies, map) {
  if (!map) return [];
  const files = map.views.map((v) => v.file);
  return enemies.filter((e) => e.mapNames.includes(map.name) || files.some((f) => e.zones[f]?.length));
}
