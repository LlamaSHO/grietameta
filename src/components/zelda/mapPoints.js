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

export const TOTALS = { sh: 152, tw: 15, sd: 875 };
const SEED_INDICES = {"surf":[642,740],"sky":[33,35]};

export function seedCountForKey(key) {
  const [, layer, value] = key.split(":");
  const range = SEED_INDICES[layer];
  const index = Number(value);
  if (!range || !value || !Number.isInteger(index) || index < 0 || index >= range[1]) return 0;
  return index < range[0] ? 1 : 2;
}

export function layerCount(cat, points) {
  const list = points.filter((p) => p.cat === cat);
  if (cat === "cv") return new Set(list.map((p) => p.name)).size;
  if (cat === "sd") return list.reduce((count, p) => count + (p.two ? 2 : 1), 0);
  return list.length;
}

export const toPct = (x, y) => ({ x: (x + 6000) / 120, y: (5000 - y) / 100 });

export function searchPoints(query, points) {
  const needle = norm(query);
  if (!needle) return [];
  const results = [];
  const seen = new Set();
  for (const p of points) {
    if (!p.name || !norm(p.name).includes(needle)) continue;
    const ln = `${CAT[p.cat].n} · ${LAYER_NAME[p.layer]}`;
    const id = p.name + ln;
    if (seen.has(id)) continue;
    seen.add(id);
    results.push({ key: p.key, name: p.name, ln });
    if (results.length >= 7) break;
  }
  return results;
}
