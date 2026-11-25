export const ZONES = ["Norte", "Noreste", "Este", "Sureste", "Sur", "Suroeste", "Oeste", "Noroeste", "Centro"];

export const LAYER_NAMES = { superficie: "Superficie", cielo: "Cielo", profundidades: "Profundidades" };

const normalize = (value) => String(value ?? "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function matches(query, ...fields) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const text = normalize(fields.join(" "));
  return words.every((word) => text.includes(word));
}

export function mapLink({ layer, id, x, y, shrine }) {
  const capa = shrine ? "superficie" : layer;
  const punto = shrine ? "sh:surf:" + shrine : id;
  return { path: "/zelda", query: { capa, ...(punto && { punto }), x: String(x), y: String(y) }, hash: "#mapa" };
}
