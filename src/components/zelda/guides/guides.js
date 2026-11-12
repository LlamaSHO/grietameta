/* Datos de las guías de Zelda: Tears of the Kingdom, ya preparados para pintar.
   Todo sale de src/data/zelda.js (que NO se toca): aquí solo se transforma
   (se separan coordenadas, se calculan zonas, recuentos, etc.). */

import { ZELDA_DATA as DATA } from "@/data/zelda";

/* ---------- utilidades ---------- */

// Texto normalizado para buscar: sin tildes, minúsculas y solo letras/números.
export const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

// ¿Coinciden todas las palabras de la búsqueda con el texto?
export function matches(query, ...fields) {
  const words = String(query || "").trim().split(/\s+/).map(norm).filter(Boolean);
  if (!words.length) return true;
  const hay = norm(fields.join(" "));
  return words.every((w) => hay.includes(w));
}

export const fmt = (n) => Number(n).toLocaleString("es-ES");

// Zona aproximada a partir de x / y (misma regla que la guía anterior).
export function zoneOf(x, y) {
  const ns = Math.abs(y) >= 1200 ? (y > 0 ? "Nor" : "Sur") : "";
  const ew = Math.abs(x) >= 1200 ? (x > 0 ? "este" : "oeste") : "";
  if (ns && ew) return ns + ew;
  return ns ? (y > 0 ? "Norte" : "Sur") : ew ? (x > 0 ? "Este" : "Oeste") : "Centro";
}
// Orden fijo de las zonas (rosa de los vientos, de norte en sentido horario).
export const ZONES = ["Norte", "Noreste", "Este", "Sureste", "Sur", "Suroeste", "Oeste", "Noroeste", "Centro"];

/* Ids de los puntos: los mismos que usa el mapa del hub para el progreso
   (src/composables/useZeldaProgress.js → zeldaKey): "<cat>:<capa>:<id>".
     santuario → "sh:surf:Tajikats" · semilla → "sd:sky:3" (posición en sky1 + sky2). */
const LAYER_KEY = { superficie: "surf", cielo: "sky" };
const pointKey = (cat, layer, id) => `${cat}:${LAYER_KEY[layer]}:${id}`;

/* Enlace al mapa interactivo del hub:
   - capa:  superficie | cielo (lo lee ZeldaView)
   - punto: clave del punto (la de arriba), para abrir su ficha
   - x, y:  coordenadas del juego, por si solo se puede centrar. */
export function mapLink({ layer, id, x, y }) {
  return { path: "/zelda", query: { capa: layer, punto: id, x: String(x), y: String(y) }, hash: "#mapa" };
}

// Mapa externo con relieve (el mismo enlace que tenía la guía anterior).
export function terrainUrl({ x, y, layer }) {
  return (
    "https://gamertw.com/en/zelda/totk/map?x=" +
    (255.857 + 0.042599 * x).toFixed(2) +
    "&y=" +
    (-255.939 + 0.042543 * y).toFixed(2) +
    "&z=3&l=" +
    (layer === "cielo" ? "sky" : "surface")
  );
}

// Proyección del mapa completo (imágenes *-hd.webp de 6000×5000): x e y del juego → % de la imagen.
export const toPct = (x, y) => ({ left: (x + 6000) / 120, top: (5000 - y) / 100 });

/* ---------- santuarios ---------- */

export const SHRINES = [
  ...DATA.santuarios.surf.map((r) => [r, "superficie"]),
  ...DATA.santuarios.sky.map((r) => [r, "cielo"]),
].map(([r, layer], i) => {
  const [name, x, y, z] = r.split(" ");
  return {
    n: i + 1,
    id: pointKey("sh", layer, name),
    name,
    en: name + " Shrine",
    x: +x,
    y: +y,
    z: +z,
    layer,
    zone: zoneOf(+x, +y),
  };
});

/* ---------- semillas kolog ---------- */

const pairs = (t) => String(t || "").trim().split(/\s+/).filter(Boolean).map((a) => a.split(",").map(Number));

function seedsOf(layer, ones, twos) {
  const solo = pairs(ones).map(([x, y]) => ({ x, y, seeds: 1 }));
  const duo = pairs(twos).map(([x, y, fx, fy]) => ({ x, y, seeds: 2, friend: { x: fx, y: fy } }));
  // Primero los de 1 semilla y luego los de amigo: el índice coincide con el del mapa.
  return [...solo, ...duo].map((k, i) => ({
    ...k,
    layer,
    id: pointKey("sd", layer, i),
    zone: zoneOf(k.x, k.y),
  }));
}

export const KOROKS = [
  ...seedsOf("superficie", DATA.semillas.surf1, DATA.semillas.surf2),
  ...seedsOf("cielo", DATA.semillas.sky1, DATA.semillas.sky2),
].map((k, i) => ({ ...k, n: i + 1 }));

const seedCount = (list) => list.reduce((s, k) => s + k.seeds, 0);

/* ---------- misiones ---------- */

const GGU = "https://www.gamerguides.com/the-legend-of-zelda-tears-of-the-kingdom/guide/";
const REG_ADV = { "lookout-landing": "Lookout Landing", "lucky-clover-gazette": "Gaceta del Trébol", "central-hyrule": "Hyrule Central", "hyrule-ridge": "Cresta de Hyrule", "hebra-region": "Hebra", eldin: "Eldin", "lanaryu-wetlands": "Humedales de Lanayru", necluda: "Necluda", akkala: "Akkala", faron: "Faron", gerudo: "Gerudo", "great-hyrule-forest": "Gran Bosque de Hyrule", "the-depths": "Las Profundidades", "great-sky-island": "Gran Isla del Cielo" };
const REG_SQ = { "kingdom-of-hyrule": "Reino de Hyrule", "central-hyrule-region": "Hyrule Central", "hebra-region": "Hebra", "east-necluda": "Necluda Este", akkala: "Akkala", lanayru: "Lanayru", "west-necluda": "Necluda Oeste", "gerudo-region": "Gerudo", "lanayru-wetlands": "Humedales de Lanayru", eldin: "Eldin", faron: "Faron", "hyrule-ridge": "Cresta de Hyrule" };

export const QUEST_KINDS = {
  p: "Misión principal",
  a: "Aventura secundaria",
  s: "Misión secundaria",
};

export const QUESTS = [
  ...DATA.misiones.main.map((m, i) => ({ kind: "p", num: i + 1, name: m.n, tag: m.t, region: m.r, body: m.g, url: m.u || "" })),
  ...DATA.misiones.adv.map((a) => ({ kind: "a", name: a[1], tag: QUEST_KINDS.a, region: REG_ADV[a[0]] || a[0], body: "Guía paso a paso en Gamer Guides (en inglés).", url: GGU + "side-adventures/" + a[0] + "/" + a[2] })),
  ...DATA.misiones.sq.map((a) => ({ kind: "s", name: a[1], tag: QUEST_KINDS.s, region: REG_SQ[a[0]] || a[0], body: "Guía paso a paso en Gamer Guides (en inglés).", url: GGU + "side-quests/" + a[0] + "/" + a[2] })),
].map((q, i) => ({ ...q, id: i }));

/* ---------- armaduras ---------- */

// "Set de soldado (Soldier's Armor)" → { es: "Set de soldado", en: "Soldier's Armor" }
function splitName(t) {
  const m = String(t).match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? { es: m[1], en: m[2] } : { es: t, en: "" };
}

const ARMOR_ROWS = DATA.armaduras.items.map((i) => ({ title: i[0], label: i[1], text: i[2], note: i[3], url: i[4] || "" }));

export const ARMORS = ARMOR_ROWS.filter((r) => /^Defensa/.test(r.label)).map((r, i) => {
  const { es, en } = splitName(r.title);
  const def = Number((r.label.match(/\d+/) || [0])[0]);
  const piece = /pieza/i.test(r.note) && !/set/i.test(r.note);
  const per = r.note.match(/(\d+)\s*×\s*(\d+)/); // "Set completo (3 × 28)"
  return { id: i, es, en, def, text: r.text, note: r.note, url: r.url, scope: piece ? "pieza" : "set", pieces: per ? +per[1] : piece ? 1 : 3, perPiece: per ? +per[2] : piece ? def : null };
});
// Filas que no son una armadura (p. ej. «Cómo funcionan las mejoras»): se pintan como consejo.
export const ARMOR_TIPS = ARMOR_ROWS.filter((r) => !/^Defensa/.test(r.label));
export const ARMOR_MAX = Math.max(...ARMORS.map((a) => a.def));

/* ---------- conjuntos ---------- */

// "5× Bokoblin Horn, 3× Bokoblin Fang" → [{ qty: 5, name: "Bokoblin Horn" }, …]
export function parseMats(line) {
  return String(line)
    .split(/,\s*/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/^(\d+)\s*×\s*(.+)$/);
      return m ? { qty: +m[1], name: m[2] } : { qty: null, name: p };
    });
}

export const SET_TYPES = ["Normal", "Elemento", "Habilidad", "Enemigos"];

export const SETS = DATA.conjuntos.sets.map((s, i) => {
  const levels = s.m.map(parseMats);
  // Total por pieza sumando todos los niveles.
  const total = new Map();
  levels.flat().forEach((m) => {
    if (m.qty == null) return;
    total.set(m.name, (total.get(m.name) || 0) + m.qty);
  });
  return {
    id: i,
    name: s.n,
    type: s.t,
    bonus: s.b,
    raw: s.m,
    levels,
    total: [...total].map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty),
    mono: s.n.replace(/[^A-Za-z' ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
  };
});

/* ---------- resumen de cada guía (tarjetas del hub y navegación) ---------- */

const surfShrines = SHRINES.filter((s) => s.layer === "superficie").length;
const skyShrines = SHRINES.length - surfShrines;
const surfKoroks = KOROKS.filter((k) => k.layer === "superficie");
const skyKoroks = KOROKS.filter((k) => k.layer === "cielo");
const qCount = (k) => QUESTS.filter((q) => q.kind === k).length;

export const STATS = {
  shrines: SHRINES.length,
  surfShrines,
  skyShrines,
  seeds: seedCount(KOROKS),
  surfSeeds: seedCount(surfKoroks),
  skySeeds: seedCount(skyKoroks),
  koroks: KOROKS.length,
  friendKoroks: KOROKS.filter((k) => k.seeds === 2).length,
  mainQuests: qCount("p"),
  advQuests: qCount("a"),
  sideQuests: qCount("s"),
  armors: ARMORS.length,
  sets: SETS.length,
};

export const GUIDES = [
  {
    key: "santuarios",
    title: "Santuarios",
    icon: "santuario",
    count: `${STATS.shrines} · ${STATS.surfShrines} superficie, ${STATS.skyShrines} cielo`,
    short: `Los ${STATS.shrines}, con coordenadas y altitud`,
    summary: "Con sus coordenadas (x, y, altitud). Busca por nombre o por zona, como «noroeste».",
    desc: DATA.santuarios.desc.replace(/ El mapa muestra.*$/, " Busca por nombre o filtra por capa y por zona, como «noroeste»."),
    go: "Ver santuarios",
  },
  {
    key: "semillas",
    title: "Semillas kolog",
    icon: "semilla",
    count: `${fmt(STATS.seeds)} semillas · ${STATS.koroks} kologs`,
    short: `${STATS.seeds} semillas en superficie y cielo`,
    summary: `Ubicaciones en la superficie y en el cielo, incluidos los ${STATS.friendKoroks} kologs que te piden llevarlos con su amigo.`,
    desc: `Las ${fmt(STATS.seeds)} semillas que tenemos ubicadas (${STATS.koroks} kologs): ${STATS.surfSeeds} en la superficie y ${STATS.skySeeds} en el cielo. Los kologs con amigo dan 2 semillas: llévalos hasta el círculo de su compañero.`,
    go: "Ver semillas",
  },
  {
    key: "misiones",
    title: "Misiones",
    icon: "mision",
    count: `${STATS.mainQuests} principales · ${STATS.advQuests} aventuras · ${STATS.sideQuests} secundarias`,
    short: `${STATS.mainQuests} principales, ${STATS.advQuests} aventuras y ${STATS.sideQuests} secundarias`,
    summary: "Las principales con su guía y el resto con enlace a la guía paso a paso.",
    desc: DATA.misiones.desc,
    go: "Ver misiones",
  },
  {
    key: "armaduras",
    title: "Armaduras",
    icon: "armadura",
    count: `Top ${STATS.armors} por defensa`,
    short: "Las de más defensa, de mayor a menor",
    summary: "Defensa al máximo nivel, de mayor a menor, indicando si es del set completo o de una pieza.",
    desc: DATA.armaduras.desc,
    go: "Ver armaduras",
  },
  {
    key: "conjuntos",
    title: "Conjuntos",
    icon: "conjunto",
    count: `${STATS.sets} conjuntos`,
    short: `${STATS.sets} sets y sus materiales de mejora`,
    summary: "Los materiales de cada mejora en la Gran Hada. El coste es por pieza y por nivel.",
    desc: DATA.conjuntos.desc,
    go: "Ver conjuntos",
  },
];

export const guideByKey = (k) => GUIDES.find((g) => g.key === k) || GUIDES[0];
