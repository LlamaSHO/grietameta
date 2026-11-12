/* Textos, colores y utilidades de ARC Raiders compartidos por el hub y las
   listas (objetos, misiones, enemigos). Antes vivían repetidos en los
   scripts de cada lista (ya borrados). */

// ---- Formato ----
export const norm = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
export const fmt = (n) => (typeof n === "number" ? n.toLocaleString("es-ES") : "—");
export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return isNaN(d) ? iso : d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

// ---- Rareza ----
export const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];
const RARITY_ES = { common: "Común", uncommon: "Poco común", rare: "Raro", epic: "Épico", legendary: "Legendario" };
export const rarityKey = (r) => (r || "").toString().toLowerCase();
export const rarityLabel = (r) => RARITY_ES[rarityKey(r)] || r || "—";
// Clase .r-* de arc-ui.css (variables --rc, --rb, --rt).
export const rarityClass = (r) => "r-" + (RARITY_ES[rarityKey(r)] ? rarityKey(r) : "common");

// ---- Recomendación de cada objeto ----
export const ACTIONS = ["Guardar", "Reciclar", "Vender", "Usar"];
// Clase .a-* de arc-ui.css (variable --ac): mismos colores que el diseño.
const ACTION_CLASS = { Guardar: "a-g", Reciclar: "a-c", Vender: "a-y", Usar: "a-o" };
export const actionClass = (a) => ACTION_CLASS[a] || "a-y";
export const ACTION_HINT = {
  Guardar: "Te lo piden en misiones, mejoras de estaciones o proyectos.",
  Reciclar: "Sus materiales te sirven y valen más que venderlo entero.",
  Vender: "No se puede reciclar o sus materiales no te los piden.",
  Usar: "Armas, equipo y consumibles: equípalo, mejóralo o úsalo.",
};
// Las 4 reglas del bloque «¿Cómo se calcula la recomendación?».
export const ACTION_RULES = [
  { a: "Guardar", t: "Lo pide el taller, un proyecto activo o una misión (o es un objeto de misión)." },
  { a: "Usar", t: "Armas, mejoras, aumentos, escudos, munición, consumibles, planos y llaves." },
  { a: "Reciclar", t: "Al reciclarlo obtienes materiales que te piden el taller, un proyecto o una misión." },
  { a: "Vender", t: "El resto. Se vende por su valor y reciclarlo no te da nada que necesites." },
];
export const ACTION_DISCLAIMER =
  "Es una guía orientativa calculada por GrietaMeta a partir de los datos del juego, no una información oficial. Si ya completaste una mejora o una misión, puede que no necesites guardar ese objeto.";

// ---- Tipos de objeto ----
const TYPE_ES = {
  "Assault Rifle": "Rifle de asalto", SMG: "Subfusil", Pistol: "Pistola", "Battle Rifle": "Rifle de batalla", Shotgun: "Escopeta",
  LMG: "Ametralladora ligera", "Sniper Rifle": "Rifle de francotirador", "Hand Cannon": "Cañón de mano",
  "Quick Use": "Uso rápido", Augment: "Aumento", Shield: "Escudo", Ammunition: "Munición", Modification: "Modificación",
  "Refined Material": "Material refinado", "Basic Material": "Material básico", "Topside Material": "Material de la superficie", Nature: "Naturaleza",
  Recyclable: "Reciclable", Trinket: "Baratija", Special: "Especial", Misc: "Varios", Blueprint: "Plano", Key: "Llave",
};
export const typeEs = (t) => TYPE_ES[t] || t || "";

// Categorías amplias: agrupan los tipos de objeto en pocas familias.
const GROUPS = {
  Armas: ["Assault Rifle", "SMG", "Pistol", "Battle Rifle", "Shotgun", "LMG", "Sniper Rifle", "Hand Cannon"],
  "Equipo y consumibles": ["Quick Use", "Augment", "Shield", "Ammunition", "Modification"],
  Materiales: ["Refined Material", "Basic Material", "Topside Material", "Nature"],
  Botín: ["Recyclable", "Trinket", "Special", "Misc"],
  "Planos y llaves": ["Blueprint", "Key"],
};
export const GROUP_ORDER = ["Armas", "Equipo y consumibles", "Materiales", "Botín", "Planos y llaves", "Otros"];
const TYPE_TO_GROUP = {};
Object.keys(GROUPS).forEach((g) => GROUPS[g].forEach((t) => (TYPE_TO_GROUP[t] = g)));
export const groupOf = (t) => TYPE_TO_GROUP[t] || "Otros";

// ---- Amenaza de los ARC ----
export const THREAT_ORDER = ["Low", "Moderate", "High", "Critical", "Extreme"];
const THREAT_ES = { Low: "Baja", Moderate: "Moderada", High: "Alta", Critical: "Crítica", Extreme: "Extrema" };
const THREAT_CLASS = { Low: "t-baj", Moderate: "t-mod", High: "t-alt", Critical: "t-cri", Extreme: "t-ext" };
export const threatLabel = (t) => THREAT_ES[t] || t || "";
export const threatClass = (t) => THREAT_CLASS[t] || "t-baj";

// ---- Comerciantes (retratos en public/images/arc-raiders/comerciantes) ----
const TRADERS = {
  Shani: { role: "Seguridad", cls: "c-y", img: "shani" },
  Celeste: { role: "Primera Ola", cls: "c-c", img: "celeste" },
  "Tian Wen": { role: "Armería", cls: "c-r", img: "tian-wen" },
  Apollo: { role: "Granadas y artilugios", cls: "c-o", img: "apollo" },
  Lance: { role: "Clínica", cls: "c-g", img: "lance" },
};
export function traderInfo(name) {
  const t = TRADERS[name];
  return t
    ? { role: t.role, cls: t.cls, img: `/images/arc-raiders/comerciantes/${t.img}.webp` }
    : { role: "", cls: "c-y", img: "" };
}

// ---- Mapas ----
// Orden, nombre e imagen de respaldo (mientras carga quests.json) y la línea
// que los describe en el diseño. Los ids son los de quests.json → maps[].id,
// que usa la ruta /arc-raiders/mapas/:mapa.
export const MAP_INFO = [
  { id: "dam_battlegrounds", name: "Dam Battlegrounds", file: "dam_battlegrounds", sub: "Presa, pantanos y la Matriarca" },
  { id: "buried_city", name: "Buried City", file: "buried_city", sub: "Casco antiguo, farmacias y aparcamientos" },
  { id: "the_spaceport", name: "Spaceport", file: "the_spaceport", sub: "Torres de lanzamiento y túneles" },
  { id: "the_blue_gate", name: "Blue Gate", file: "the_blue_gate", sub: "Autopista derrumbada y claro desolado" },
  { id: "stella_montis", name: "Stella Montis", file: "stella_montis_upper", sub: "Dos plantas · instalaciones de investigación" },
  { id: "riven_tides", name: "Riven Tides", file: "riven_tides", sub: "Hotel, rompeolas y puerto" },
];
export const mapRoute = (id) => ({ name: "arc-map", params: { mapa: id } });

// ---- Créditos de los datos ----
export const DATA_SOURCE_URL = "https://github.com/RaidTheory/arcraiders-data";
