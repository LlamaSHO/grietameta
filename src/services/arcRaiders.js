/* ARC Raiders: datos estáticos e imágenes.
   Los JSON los genera tools/build-arc-data.py a partir del Proyecto de datos ARC
   (https://github.com/RaidTheory/arcraiders-data, licencia MIT) y viven en
   public/data/arc-raiders. Las imágenes están en public/images/arc-raiders. */

const DATA_DIR = "/data/arc-raiders";
const IMG_DIR = "/images/arc-raiders";

export const ARC_DATA_LICENSE_URL = `${DATA_DIR}/LICENSE-arcraiders-data.txt`;

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

export const fetchArcItems = () => getJson(`${DATA_DIR}/items.json`);
export const fetchArcQuests = () => getJson(`${DATA_DIR}/quests.json`);
export const fetchArcEnemies = () => getJson(`${DATA_DIR}/enemies.json`);

export const arcItemImageUrl = (id) => `${IMG_DIR}/items/${encodeURIComponent(id + ".webp")}`;
export const arcBotImageUrl = (id) => `${IMG_DIR}/bots/${encodeURIComponent(id + ".webp")}`;
export const arcMapImageUrl = (file) => `${IMG_DIR}/maps/${encodeURIComponent(file + ".webp")}`;
