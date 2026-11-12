/* League of Legends: datos fijos del sitio (roster, roles, rangos).
   El rol y la clase de cada campeón no vienen ni de Data Dragon ni de las
   estadísticas de Riot: son nuestra clasificación editorial. */

// [nombre, rol principal, clase]. El id del sitio sale del nombre
// (minúsculas, sin símbolos): "Kai'Sa" → "kaisa", "Nunu & Willump" → "nunuwillump".
const ROSTER = [
  ["Aatrox","Top","Luchador"],["Ahri","Mid","Mago"],["Akali","Mid","Asesino"],["Akshan","Mid","Tirador"],
  ["Alistar","Support","Soporte"],["Ambessa","Top","Luchador"],["Amumu","Jungla","Tanque"],["Anivia","Mid","Mago"],
  ["Annie","Mid","Mago"],["Aphelios","ADC","Tirador"],["Ashe","ADC","Tirador"],["Aurelion Sol","Mid","Mago"],
  ["Aurora","Mid","Mago"],["Azir","Mid","Mago"],["Bard","Support","Soporte"],["Bel'Veth","Jungla","Luchador"],
  ["Blitzcrank","Support","Tanque"],["Brand","Support","Mago"],["Braum","Support","Tanque"],["Briar","Jungla","Asesino"],
  ["Caitlyn","ADC","Tirador"],["Camille","Top","Luchador"],["Cassiopeia","Mid","Mago"],["Cho'Gath","Top","Tanque"],
  ["Corki","Mid","Tirador"],["Darius","Top","Luchador"],["Diana","Jungla","Mago"],["Dr. Mundo","Top","Tanque"],
  ["Draven","ADC","Tirador"],["Ekko","Jungla","Asesino"],["Elise","Jungla","Mago"],["Evelynn","Jungla","Asesino"],
  ["Ezreal","ADC","Tirador"],["Fiddlesticks","Jungla","Mago"],["Fiora","Top","Luchador"],["Fizz","Mid","Asesino"],
  ["Galio","Mid","Tanque"],["Gangplank","Top","Luchador"],["Garen","Top","Luchador"],["Gnar","Top","Luchador"],
  ["Gragas","Jungla","Luchador"],["Graves","Jungla","Tirador"],["Gwen","Top","Luchador"],["Hecarim","Jungla","Luchador"],
  ["Heimerdinger","Mid","Mago"],["Hwei","Mid","Mago"],["Illaoi","Top","Luchador"],["Irelia","Top","Luchador"],
  ["Ivern","Jungla","Soporte"],["Janna","Support","Soporte"],["Jarvan IV","Jungla","Luchador"],["Jax","Top","Luchador"],
  ["Jayce","Top","Tirador"],["Jhin","ADC","Tirador"],["Jinx","ADC","Tirador"],["K'Sante","Top","Tanque"],
  ["Kai'Sa","ADC","Tirador"],["Kalista","ADC","Tirador"],["Karma","Support","Mago"],["Karthus","Jungla","Mago"],
  ["Kassadin","Mid","Asesino"],["Katarina","Mid","Asesino"],["Kayle","Top","Luchador"],["Kayn","Jungla","Asesino"],
  ["Kennen","Top","Mago"],["Kha'Zix","Jungla","Asesino"],["Kindred","Jungla","Tirador"],["Kled","Top","Luchador"],
  ["Kog'Maw","ADC","Tirador"],["LeBlanc","Mid","Asesino"],["Lee Sin","Jungla","Luchador"],["Leona","Support","Tanque"],
  ["Lillia","Jungla","Mago"],["Lissandra","Mid","Mago"],["Lucian","ADC","Tirador"],["Lulu","Support","Soporte"],
  ["Lux","Support","Mago"],["Malphite","Top","Tanque"],["Malzahar","Mid","Mago"],["Maokai","Support","Tanque"],
  ["Master Yi","Jungla","Tirador"],["Mel","Mid","Mago"],["Milio","Support","Soporte"],["Miss Fortune","ADC","Tirador"],
  ["Mordekaiser","Top","Luchador"],["Morgana","Support","Mago"],["Naafiri","Mid","Asesino"],["Nami","Support","Soporte"],
  ["Nasus","Top","Luchador"],["Nautilus","Support","Tanque"],["Neeko","Mid","Mago"],["Nidalee","Jungla","Mago"],
  ["Nilah","ADC","Luchador"],["Nocturne","Jungla","Asesino"],["Nunu & Willump","Jungla","Tanque"],["Olaf","Jungla","Luchador"],
  ["Orianna","Mid","Mago"],["Ornn","Top","Tanque"],["Pantheon","Jungla","Luchador"],["Poppy","Jungla","Tanque"],
  ["Pyke","Support","Asesino"],["Qiyana","Mid","Asesino"],["Quinn","Top","Tirador"],["Rakan","Support","Soporte"],
  ["Rammus","Jungla","Tanque"],["Rek'Sai","Jungla","Luchador"],["Rell","Support","Tanque"],["Renata Glasc","Support","Mago"],
  ["Renekton","Top","Luchador"],["Rengar","Jungla","Asesino"],["Riven","Top","Luchador"],["Rumble","Top","Mago"],
  ["Ryze","Mid","Mago"],["Samira","ADC","Tirador"],["Sejuani","Jungla","Tanque"],["Senna","Support","Tirador"],
  ["Seraphine","Support","Mago"],["Sett","Top","Luchador"],["Shaco","Jungla","Asesino"],["Shen","Top","Tanque"],
  ["Shyvana","Jungla","Luchador"],["Singed","Top","Tanque"],["Sion","Top","Tanque"],["Sivir","ADC","Tirador"],
  ["Skarner","Jungla","Tanque"],["Smolder","ADC","Tirador"],["Sona","Support","Soporte"],["Soraka","Support","Soporte"],
  ["Swain","Support","Mago"],["Sylas","Mid","Luchador"],["Syndra","Mid","Mago"],["Tahm Kench","Support","Tanque"],
  ["Taliyah","Jungla","Mago"],["Talon","Mid","Asesino"],["Taric","Support","Tanque"],["Teemo","Top","Tirador"],
  ["Thresh","Support","Tanque"],["Tristana","ADC","Tirador"],["Trundle","Jungla","Luchador"],["Tryndamere","Top","Luchador"],
  ["Twisted Fate","Mid","Mago"],["Twitch","ADC","Tirador"],["Udyr","Jungla","Luchador"],["Urgot","Top","Luchador"],
  ["Varus","ADC","Tirador"],["Vayne","ADC","Tirador"],["Veigar","Mid","Mago"],["Vel'Koz","Support","Mago"],
  ["Vex","Mid","Mago"],["Vi","Jungla","Luchador"],["Viego","Jungla","Asesino"],["Viktor","Mid","Mago"],
  ["Vladimir","Top","Mago"],["Volibear","Jungla","Luchador"],["Warwick","Jungla","Luchador"],["Wukong","Top","Luchador"],
  ["Xayah","ADC","Tirador"],["Xerath","Mid","Mago"],["Xin Zhao","Jungla","Luchador"],["Yasuo","Mid","Luchador"],
  ["Yone","Mid","Luchador"],["Yorick","Top","Luchador"],["Yuumi","Support","Soporte"],["Zac","Jungla","Tanque"],
  ["Zed","Mid","Asesino"],["Zeri","ADC","Tirador"],["Ziggs","Mid","Mago"],["Zilean","Support","Mago"],
  ["Zoe","Mid","Mago"],["Zyra","Support","Mago"],
  // Campeones nuevos (2025-2026). El rol de Locke está estimado a partir de
  // sus etiquetas de Data Dragon (Asesino/Mago): revisarlo si no encaja.
  ["Yunara","ADC","Tirador"],["Zaahen","Top","Luchador"],["Locke","Mid","Asesino"],
];

// Ids de Data Dragon que no salen de quitar símbolos al nombre.
const DDRAGON_ID_OVERRIDES = {
  wukong: "MonkeyKing",
  nunuwillump: "Nunu",
  renataglasc: "Renata",
  belveth: "Belveth",
  chogath: "Chogath",
  kaisa: "Kaisa",
  khazix: "Khazix",
  leblanc: "Leblanc",
  velkoz: "Velkoz",
};

export const siteIdFromName = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

// Id del sitio (el de champion-stats.json) a partir del id de Data Dragon.
// Es el mismo criterio que usa tools/fetch-riot-stats.mjs.
const SITE_ID_FROM_DDRAGON = { monkeyking: "wukong", nunu: "nunuwillump", renata: "renataglasc" };
export const siteIdFromDdragonId = (ddId) => {
  const key = String(ddId).toLowerCase();
  return SITE_ID_FROM_DDRAGON[key] || key;
};

const ddragonIdFromName = (name) => {
  const id = siteIdFromName(name);
  return DDRAGON_ID_OVERRIDES[id] || name.replace(/[.'&]/g, "").replace(/\s+/g, "");
};

// Lista base: { id, ddId, name, role, cls }
export const BASE_CHAMPIONS = ROSTER.map(([name, role, cls]) => ({
  id: siteIdFromName(name),
  ddId: ddragonIdFromName(name),
  name,
  role,
  cls,
}));

export const ROLES = ["Top", "Jungla", "Mid", "ADC", "Support"];

// Icono oficial de cada posición (public/images/lol/posiciones) y clase CSS.
export const ROLE_ICON = {
  Todos: "all",
  Top: "top",
  Jungla: "jungle",
  Mid: "mid",
  ADC: "bot",
  Support: "sup",
};

// Para campeones que todavía no estén en ROSTER: rol y clase a partir de las
// etiquetas de Data Dragon (Fighter, Tank, Mage…).
const TAG_TO_CLASS = { Fighter: "Luchador", Tank: "Tanque", Mage: "Mago", Assassin: "Asesino", Marksman: "Tirador", Support: "Soporte" };
const CLASS_TO_ROLE = { Luchador: "Top", Tanque: "Top", Mago: "Mid", Asesino: "Mid", Tirador: "ADC", Soporte: "Support" };
export function guessRoleFromTags(tags = []) {
  const cls = TAG_TO_CLASS[tags[0]] || "Luchador";
  return { cls, role: CLASS_TO_ROLE[cls] };
}

// Rangos: clave de champion-stats.json, nombre, color y emblema oficial.
export const RANKS = [
  { key: "ALL", label: "Todos", color: "#C8963E", img: null },
  { key: "IRON", label: "Hierro", color: "#8E9196", img: "/images/lol/rangos/iron.png" },
  { key: "BRONZE", label: "Bronce", color: "#B4764A", img: "/images/lol/rangos/bronze.png" },
  { key: "SILVER", label: "Plata", color: "#B9C3CE", img: "/images/lol/rangos/silver.png" },
  { key: "GOLD", label: "Oro", color: "#E4B544", img: "/images/lol/rangos/gold.png" },
  { key: "PLATINUM", label: "Platino", color: "#3FB8A9", img: "/images/lol/rangos/platinum.png" },
  { key: "EMERALD", label: "Esmeralda", color: "#2FBC74", img: "/images/lol/rangos/emerald.png" },
  { key: "DIAMOND", label: "Diamante", color: "#6FA6F4", img: "/images/lol/rangos/diamond.png" },
  { key: "MASTER_PLUS", label: "Master+", color: "#B664DB", img: "/images/lol/rangos/master.png" },
];
export const RANK_KEYS = RANKS.map((r) => r.key);
export const rankInfo = (key) => RANKS.find((r) => r.key === key) || RANKS[0];
// Orden del desplegable: de más alto a más bajo.
export const RANK_PICKER_ORDER = ["MASTER_PLUS", "DIAMOND", "EMERALD", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON"];
