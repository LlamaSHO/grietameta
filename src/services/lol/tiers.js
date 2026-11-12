/* Tiers de la tier list.
   Con los datos reales, la fórmula antigua (cortes fijos sobre la puntuación)
   daba casi todo C. Ahora la puntuación se ordena DENTRO DE CADA LÍNEA y el
   tier sale del percentil: el tier es relativo a los rivales de su rol. */

export const TIER_ORDER = { "S+": 0, S: 1, A: 2, B: 3, C: 4, D: 5 };
export const TIER_CLASS = { "S+": "t-sp", S: "t-s", A: "t-a", B: "t-b", C: "t-c", D: "t-d" };

// Puntuación: winrate pesa más; pickrate y banrate reflejan cuánto se teme o
// se confía en el campeón. Mismos rangos de referencia que la fórmula original.
export const tierScore = (wr, pr, br) => ((wr - 46.5) / 8.5) * 0.55 + (pr / 18) * 0.25 + (br / 22.5) * 0.2;

// Cortes por percentil (puesto / total de la línea). El primero de cada
// línea siempre es S+.
const CUTS = [
  ["S+", 0.06],
  ["S", 0.2],
  ["A", 0.4],
  ["B", 0.65],
  ["C", 0.88],
];
export function tierFromPosition(pos, of) {
  if (pos === 1) return "S+";
  const q = pos / Math.max(1, of);
  for (const [tier, cut] of CUTS) if (q <= cut) return tier;
  return "D";
}

// Recibe entradas { role, score } y les añade pos, of, tier y tc (clase CSS)
// según su puesto dentro de su línea. Modifica y devuelve el mismo array.
export function rankWithinLanes(entries) {
  const byRole = new Map();
  for (const e of entries) {
    if (!byRole.has(e.role)) byRole.set(e.role, []);
    byRole.get(e.role).push(e);
  }
  for (const lane of byRole.values()) {
    lane.sort((a, b) => b.score - a.score);
    lane.forEach((e, i) => {
      e.pos = i + 1;
      e.of = lane.length;
      e.tier = tierFromPosition(e.pos, e.of);
      e.tc = TIER_CLASS[e.tier];
    });
  }
  return entries;
}

// Orden de la tier list: primero el tier, luego la puntuación.
export const byTier = (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || b.score - a.score;
