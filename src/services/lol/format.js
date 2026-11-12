/* Formato de cifras en español para las vistas de LoL. */

// 4060 → "4.060" (toLocaleString("es-ES") no agrupa los números de 4 cifras).
export const fmtInt = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// 52.5 → "52,5%"
export const pct = (v) => (v == null || Number.isNaN(v) ? "—" : `${Number(v).toFixed(1).replace(".", ",")}%`);

// Color del winrate: verde si es bueno, rojo si es flojo.
export const wrClass = (wr) => (wr >= 51.5 ? "hi" : wr < 49 ? "lo" : "");

// Ancho de la barra de winrate (44 % → vacío, 58 % → llena).
export const wrWidth = (wr) => `${Math.max(6, Math.min(100, ((wr - 44) / 14) * 100)).toFixed(0)}%`;

// "2026-10-29T…" → "29 oct 2026"
export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
    .replace(/\./g, "")
    .replace(/ de /g, " ");
}

// Busca sin depender de acentos, apóstrofes, mayúsculas ni espacios:
// "ksante", "K'Sante" y "k’sante" encuentran lo mismo.
export const normalizeSearch = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
