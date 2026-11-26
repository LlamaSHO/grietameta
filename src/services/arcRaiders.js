/* ARC Raiders: datos estáticos e imágenes.
   Los JSON los genera tools/build-arc-data.py a partir del Proyecto de datos ARC
   (https://github.com/RaidTheory/arcraiders-data, licencia MIT) y viven en
   datos/arc-raiders (se suben a Firestore). Las imágenes están en public/images/arc-raiders. */

import { loadDataset } from "@/services/datos";

const DATA_DIR = "/data/arc-raiders";
const IMG_DIR = "/images/arc-raiders";

export const ARC_DATA_LICENSE_URL = "/licencias/arcraiders-data.txt";

// Los datos salen de Firestore (en desarrollo, de la carpeta datos/): services/datos.js.
const getJson = (url) => loadDataset(url);

export const fetchArcItems = () => getJson(`${DATA_DIR}/items.json`);
export const fetchArcQuests = () => getJson(`${DATA_DIR}/quests.json`);
export const fetchArcEnemies = () => getJson(`${DATA_DIR}/enemies.json`);

export const arcItemImageUrl = (id) => `${IMG_DIR}/items/${encodeURIComponent(id + ".webp")}`;
export const arcBotImageUrl = (id) => `${IMG_DIR}/bots/${encodeURIComponent(id + ".webp")}`;
export const arcMapImageUrl = (file) => `${IMG_DIR}/maps/${encodeURIComponent(file + ".webp")}`;
// Miniatura de 480 px (~40 KB) para tarjetas, pestañas y menús; el mapa entero pesa 0,3–1,4 MB.
export const arcMapThumbUrl = (file) => `${IMG_DIR}/maps/thumbs/${encodeURIComponent(file + ".jpg")}`;
