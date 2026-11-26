/* Datos de los juegos (Pokédex, criaturas de ARK, objetos de ARC…).

   Ya no van en public/data: la fuente está en la carpeta datos/ del repo
   (no se publica con la web) y se sube a Firestore con
   `npm run datos:subir` (tools/subir-datos.mjs). En Firestore cada conjunto
   es un documento de la colección `datos` y hay un índice (`datos/_indice`)
   con la versión de cada uno.

   En el navegador:
   - Se lee el índice una vez por visita.
   - Si el navegador ya guarda esa versión del conjunto (Cache Storage), se usa
     sin pedir nada más; si no, se lee su documento y se guarda.
   Así cada visitante solo descarga un conjunto cuando cambia.

   En desarrollo (`npm run dev`) se leen directamente de datos/ (plugin de
   vite.config.js), sin tocar Firestore. Para probar Firestore en local:
   VITE_DATOS=firestore en .env.

   Uso: loadDataset("/data/ark/engramas.json") o loadDataset("ark/engramas"). */

import { loadTracker } from "@/services/loadTracker";

const MODE = import.meta.env.VITE_DATOS || (import.meta.env.DEV ? "local" : "firestore");
const CACHE_NAME = "gm-datos-v1";

export const datasetId = (path) => path.replace(/^\/?data\//, "").replace(/\.json$/, "");
const docId = (id) => id.replace(/\//g, "~");

const memory = new Map();

export function loadDataset(path) {
  const id = datasetId(path);
  if (!memory.has(id)) {
    // La pantalla de carga del juego espera a que terminen (loadTracker).
    loadTracker.pending++;
    const p = (MODE === "local" ? loadLocal(id) : loadFirestore(id))
      .catch((e) => {
        memory.delete(id); // que «Reintentar» vuelva a pedirlo
        throw e;
      })
      .finally(() => {
        loadTracker.pending = Math.max(0, loadTracker.pending - 1);
      });
    memory.set(id, p);
  }
  return memory.get(id);
}

async function loadLocal(id) {
  const r = await fetch(`/@datos/${id}.json`);
  if (!r.ok) throw new Error(`${r.status} datos/${id}.json`);
  return r.json();
}

// ---- Firestore (se carga solo cuando una página pide datos) ----
let fs = null;
async function firestore() {
  if (!fs) {
    fs = (async () => {
      const [{ getFirestore, doc, getDoc }, { firebaseApp }] = await Promise.all([
        import("firebase/firestore"),
        import("@/services/firebase/app"),
      ]);
      return { db: getFirestore(firebaseApp), doc, getDoc };
    })();
  }
  return fs;
}

let indexPromise = null;
function readIndex() {
  if (!indexPromise) {
    indexPromise = (async () => {
      const { db, doc, getDoc } = await firestore();
      const snap = await getDoc(doc(db, "datos", "_indice"));
      return snap.exists() ? snap.data().versiones || {} : {};
    })().catch((e) => {
      indexPromise = null;
      throw e;
    });
  }
  return indexPromise;
}

async function openCache() {
  try {
    return typeof caches !== "undefined" ? await caches.open(CACHE_NAME) : null;
  } catch {
    return null;
  }
}

async function loadFirestore(id) {
  const versions = await readIndex();
  const v = versions[id];
  if (!v) throw new Error(`No existe el conjunto de datos «${id}»`);
  const key = `/datos/${id}?v=${v}`;
  const cache = await openCache();
  const hit = cache && (await cache.match(key));
  if (hit) return hit.json();

  const { db, doc, getDoc } = await firestore();
  const snap = await getDoc(doc(db, "datos", docId(id)));
  if (!snap.exists()) throw new Error(`Falta el documento de «${id}»`);
  const d = snap.data();
  let text = d.json;
  if (d.partes) {
    const parts = await Promise.all(Array.from({ length: d.partes }, (_, i) => getDoc(doc(db, "datos", `${docId(id)}~p${i}`))));
    text = parts.map((p) => p.data().json).join("");
  }
  if (cache) {
    // Se guarda esta versión y se borran las anteriores del mismo conjunto.
    const old = await cache.keys();
    await Promise.all(old.filter((r) => new URL(r.url).pathname === `/datos/${id}`).map((r) => cache.delete(r)));
    await cache.put(key, new Response(text, { headers: { "Content-Type": "application/json" } }));
  }
  return JSON.parse(text);
}
