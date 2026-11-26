/* Datos derivados de un plano (datos/cod-zombis/planos.json): iconos y
   ventajas de cada zona, puertas entre zonas y capas. Funciones puras. */
import { perkBp } from "./sprites.js";

export const EDGE_LABEL = {
  puerta: "Puerta", abierto: "Paso abierto", tp: "Teletransporte", bus: "Ruta del autobús",
  escalera: "Escalera", ascensor: "Ascensor", tiro: "Tirolina", tanque: "Ruta del tanque",
};

export const LAYERS = [
  ["perks", "Ventajas", "#E2364B"], ["walls", "Armas de pared", "#ECE4D6"], ["obj", "Objetivos", "#F2B33D"],
  ["box", "Cajas", "#4FA3FF"], ["ee", "Easter eggs", "#B98CFF"], ["parts", "Piezas", "#7FE0A3"], ["doors", "Puertas", "#FF7A1A"],
];

// Alto del plano en unidades (el ancho es 100): las coordenadas y pasan a %.
const Y = (v) => +((v / 62) * 100).toFixed(3);

const initials = (s) => s.replace(/[^A-Za-zÁÉÍÓÚÑ0-9 ]/g, "").split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function perkItem(p, perki) {
  const pi = perki[p.n];
  return { cls: "ic-perk" + (pi == null ? "" : " img"), k: pi == null ? initials(p.n) : "", n: p.n, t: p.n, c: p.c, cost: "", bp: pi == null ? "" : perkBp(pi) };
}
function markItem(x) {
  if (x.t === "box") return { cls: "ic-box img", k: "", n: x.n + ": " + x.d, t: x.n, c: "", cost: "", bp: perkBp(14) };
  return { cls: "ic-" + x.t, k: { ee: "E", part: "+" }[x.t], n: x.n + ": " + x.d, t: x.n, c: "", cost: "", bp: "" };
}

/* Iconos de una zona: inicio, corriente, Pack-a-Punch, ventajas, armas de pared, cajas… */
export function itemsOf(m, nid, perki) {
  const n = m.nodes.find((x) => x.id === nid);
  const tags = n.tags || [];
  const out = [];
  if (tags.includes("spawn")) out.push({ cls: "ic-spawn", k: "I", n: "Inicio de la partida", t: "Inicio", c: "", cost: "" });
  if (tags.includes("power")) out.push({ cls: "ic-power", k: "C", n: "Interruptor de la corriente", t: "Corriente", c: "", cost: "" });
  if (tags.includes("pap")) out.push({ cls: "ic-pap img", k: "", n: "Pack-a-Punch", t: "Pack-a-Punch", c: "", cost: "5.000", bp: perkBp(13) });
  if (tags.includes("tp")) out.push({ cls: "ic-tp", k: "T", n: "Teletransportador", t: "Teletransporte", c: "", cost: "" });
  if (tags.includes("pc")) out.push({ cls: "ic-tp", k: "T", n: "Ordenador que enlaza el teletransportador", t: "Enlace del teletransporte", c: "", cost: "" });
  if (tags.includes("defcon")) out.push({ cls: "ic-power", k: "D", n: "Palancas DEFCON", t: "DEFCON", c: "", cost: "" });
  if (tags.includes("sky")) out.push({ cls: "ic-pap", k: "?", n: "Ventajas y Pack-a-Punch que caen del cielo", t: "Caen del cielo", c: "", cost: "" });
  m.perks.filter((p) => p.node === nid).forEach((p) => out.push(perkItem(p, perki)));
  m.walls.filter((w) => w.node === nid).forEach((w) => out.push({ cls: "ic-wall", k: "A", n: w.n, t: "Arma de pared: " + w.n, c: "", cost: w.cost }));
  (m.marks || []).filter((x) => x.node === nid).forEach((x) => out.push(markItem(x)));
  return out;
}

/* Objetos del mapa entero (sin zona) */
export function globalItems(m, perki) {
  return [...m.perks.filter((p) => !p.node).map((p) => perkItem(p, perki)), ...(m.marks || []).filter((x) => !x.node).map(markItem)];
}

/* Conexiones entre zonas, con el centro y el punto medio de cada una */
export function buildEdges(m) {
  const node = (id) => m.nodes.find((n) => n.id === id);
  return m.edges.map(([a, b, k]) => {
    const A = node(a), B = node(b);
    const x1 = A.x + A.w / 2, y1 = A.y + A.h / 2, x2 = B.x + B.w / 2, y2 = B.y + B.h / 2;
    return { k, x1, y1, x2, y2, mx: +((x1 + x2) / 2).toFixed(2), my: Y((y1 + y2) / 2), label: EDGE_LABEL[k] + ": " + A.n + " ↔ " + B.n };
  });
}

/* Zonas con su caja en % (el plano es 100 x 62) y sus iconos */
export function buildZones(m, perki) {
  return m.nodes.map((n) => ({
    ...n, yp: Y(n.y), hp: Y(n.h),
    spawn: (n.tags || []).includes("spawn"),
    icons: itemsOf(m, n.id, perki),
  }));
}

export function connections(m, zid) {
  const node = (id) => m.nodes.find((n) => n.id === id);
  return m.edges.filter((e) => e[0] === zid || e[1] === zid).map((e) => node(e[0] === zid ? e[1] : e[0]).n + " (" + EDGE_LABEL[e[2]].toLowerCase() + ")").join(" · ");
}

/* Pasos para abrir el mapa: cada uno puede señalar una zona */
export function routeSteps(m) {
  return (m.route || []).map((r, i) => ({ t: Array.isArray(r) ? r[0] : r, nd: Array.isArray(r) ? r[1] : "", n: String(i + 1) }));
}

export { Y };
