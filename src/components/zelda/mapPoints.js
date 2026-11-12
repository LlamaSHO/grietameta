/* Puntos del mapa interactivo del hub de Zelda, ya normalizados.
   Santuarios y semillas: src/data/zelda.js · torres y cuevas: src/data/zelda-map.js.
   Lógica del diseño: <script type="text/x-dc"> de models/paginas/Zelda.dc.html.

   Cada punto: { key, cat, layer, i, name, label, kind, sub, x, y, gx, gy, alt, two, fx, fy }
     key   → clave del progreso (useZeldaProgress: "<cat>:<capa>:<id>")
     x, y  → % de la imagen · gx, gy, alt → coordenadas del juego
     two   → kolog que hay que llevar con su amigo (fx, fy: % del destino) */

import { ZELDA_DATA } from "@/data/zelda";
import { CAVES, TOWERS, toPct } from "@/data/zelda-map";
import { zeldaKey } from "@/composables/useZeldaProgress";

export const LAYERS = ["surf", "sky"];
export const CATS = ["sh", "tw", "cv", "sd"];
export const LAYER_NAME = { surf: "Superficie", sky: "Cielo" };

export const CAT = {
  sh: { n: "Santuario", plural: "Santuarios", done: "Completado ✓", mark: "Marcar como completado", ok: "Completado", todo: "Pendiente" },
  tw: { n: "Torre de vigilancia", plural: "Torres de vigilancia", done: "Activada ✓", mark: "Marcar como activada", ok: "Activada", todo: "Pendiente" },
  cv: { n: "Cueva o túnel", plural: "Cuevas y túneles", done: "Explorada ✓", mark: "Marcar como explorada", ok: "Explorada", todo: "Pendiente" },
  sd: { n: "Semilla kolog", plural: "Semillas kolog", done: "Recogida ✓", mark: "Marcar como recogida", ok: "Recogida", todo: "Pendiente" },
};

// Zona aproximada a partir de las coordenadas del juego.
export function zone(x, y) {
  const ns = y > 1200 ? "N" : y < -1200 ? "S" : "";
  const ew = x > 1200 ? "E" : x < -1200 ? "O" : "";
  const Z = { NE: "noreste", NO: "noroeste", SE: "sureste", SO: "suroeste", N: "norte", S: "sur", E: "este", O: "oeste" };
  return Z[ns + ew] || "centro";
}

// 1234 → "1.234" · -1009 → "-1.009"
export const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace("-.", "-");

export const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

function point(cat, layer, i, id, name, label, gx, gy, alt, extra = {}) {
  const p = toPct(gx, gy);
  return { key: zeldaKey(cat, layer, id), cat, layer, i, name, label, x: p.x, y: p.y, gx, gy, alt, two: false, ...extra };
}

const S = ZELDA_DATA.santuarios;
const SD = ZELDA_DATA.semillas;
const nums = (str, size) => {
  const out = [];
  for (const t of String(str || "").trim().split(/\s+/)) {
    const v = t.split(",").map(Number);
    if (v.length === size && v.every(Number.isFinite)) out.push(v);
  }
  return out;
};

function shrines(layer) {
  return (layer === "sky" ? S.sky : S.surf).map((row, i) => {
    const [name, x, y, alt] = row.split(" ");
    return point("sh", layer, i, name, name, `${name} Shrine`, +x, +y, +alt);
  });
}
function towers(layer) {
  return TOWERS[layer].map(([name, x, y, alt], i) => point("tw", layer, i, name, name, `${name} Skyview Tower`, x, y, alt));
}
function caves(layer) {
  const list = CAVES[layer];
  return list.map(([name, x, y, alt], i) => {
    const entrances = list.filter((c) => c[0] === name).length;
    return point("cv", layer, i, i, name, name, x, y, alt, { entrances });
  });
}
function seeds(layer) {
  const one = nums(layer === "sky" ? SD.sky1 : SD.surf1, 2);
  const two = nums(layer === "sky" ? SD.sky2 : SD.surf2, 4);
  return one
    .map(([x, y], i) => point("sd", layer, i, i, "", "Semilla kolog", x, y, null))
    .concat(
      two.map(([x, y, fx, fy], j) => {
        const i = one.length + j;
        const f = toPct(fx, fy);
        return point("sd", layer, i, i, "", "Kolog con amigo", x, y, null, { two: true, fx: f.x, fy: f.y });
      })
    );
}

const BUILD = { sh: shrines, tw: towers, cv: caves, sd: seeds };
export const POINTS = {};
for (const c of CATS) {
  POINTS[c] = {};
  for (const l of LAYERS) POINTS[c][l] = BUILD[c](l);
}

// Texto fijo de cada punto: clase del icono (kind) y línea de la tarjeta (sub).
export const byKey = new Map();
for (const c of CATS)
  for (const l of LAYERS)
    for (const p of POINTS[c][l]) {
      p.kind = c === "sd" ? (p.two ? "p-sd2" : "p-sd") : `p-${c}`;
      const what = c === "sd" ? (p.two ? "Lleva al kolog hasta su amigo" : "Recógela al resolver el puzle") : CAT[c].n;
      p.sub = `${what} · zona ${zone(p.gx, p.gy)}`;
      byKey.set(p.key, p);
    }

// Totales del juego (los kologs con amigo dan 2 semillas).
const seedWeight = (p) => (p.two ? 2 : 1);
export const TOTALS = {
  sh: POINTS.sh.surf.length + POINTS.sh.sky.length,
  tw: POINTS.tw.surf.length + POINTS.tw.sky.length,
  cv: POINTS.cv.surf.length + POINTS.cv.sky.length,
  sd: [...POINTS.sd.surf, ...POINTS.sd.sky].reduce((n, p) => n + seedWeight(p), 0),
  kologs: POINTS.sd.surf.length + POINTS.sd.sky.length,
};
export { seedWeight };

// Recuento por capa como en la lista de categorías (cuevas con varias
// entradas cuentan una vez; semillas por semillas, no por kologs).
export function layerCount(cat, layer) {
  const list = POINTS[cat][layer];
  if (cat === "cv") return new Set(list.map((p) => p.name)).size;
  if (cat === "sd") return list.reduce((n, p) => n + seedWeight(p), 0);
  return list.length;
}

// Búsqueda por nombre en santuarios, torres y cuevas de las dos capas.
const SEARCHABLE = [];
for (const c of ["sh", "tw", "cv"]) for (const l of LAYERS) for (const p of POINTS[c][l]) SEARCHABLE.push({ p, n: norm(p.name), ln: `${CAT[c].n} · ${LAYER_NAME[l]}` });

export function searchPoints(q, max = 7) {
  const nq = norm(q);
  if (!nq) return [];
  const seen = new Set();
  const out = [];
  for (const r of SEARCHABLE) {
    if (!r.n.includes(nq)) continue;
    const id = r.p.name + r.ln;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ key: r.p.key, name: r.p.name, ln: r.ln });
    if (out.length >= max) break;
  }
  return out;
}
