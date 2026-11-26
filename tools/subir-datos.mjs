// Sube los datos de los juegos (carpeta datos/) a Firestore.
//
// Cada archivo datos/<juego>/<nombre>.json pasa a ser el documento
// `datos/<juego>~<nombre>` con el JSON como texto (campo `json`). Si pasa de
// ~900 KB se parte en varios documentos (`…~p0`, `…~p1`…). El documento
// `datos/_indice` guarda la versión (hash) de cada conjunto: la web lo lee una
// vez por visita y solo descarga lo que ha cambiado (src/services/datos.js).
//
// Solo se suben los archivos que han cambiado desde la última vez.
//
// Uso:
//   npm run datos:subir                   # todo lo que haya cambiado
//   npm run datos:subir -- lol/esports    # solo esos conjuntos
//   npm run datos:subir -- --probar       # dice qué subiría, sin subir
//
// Credenciales (una de las dos):
//   - GOOGLE_APPLICATION_CREDENTIALS=ruta/al/archivo-de-cuenta-de-servicio.json
//   - FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",…}' (el JSON entero,
//     por ejemplo como secreto de GitHub Actions)
// La cuenta de servicio se crea en la consola de Firebase: Configuración del
// proyecto → Cuentas de servicio → Generar nueva clave privada. Ese archivo NO
// se sube al repositorio.

import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "datos");
const MAX_CHARS = 900_000; // por debajo del límite de 1 MiB por documento

const args = process.argv.slice(2);
const dryRun = args.includes("--probar");
const only = args.filter((a) => !a.startsWith("--"));

const credential = process.env.FIREBASE_SERVICE_ACCOUNT
  ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  : applicationDefault();
initializeApp({ credential, projectId: process.env.VITE_FIREBASE_PROJECT_ID });
const db = getFirestore();

async function listJson(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await listJson(p)));
    else if (e.name.endsWith(".json")) out.push(p);
  }
  return out;
}

const files = await listJson(ROOT);
const indexRef = db.collection("datos").doc("_indice");
const index = (await indexRef.get()).data()?.versiones || {};
const versions = { ...index };
let uploaded = 0;

for (const file of files) {
  const id = path.relative(ROOT, file).replace(/\\/g, "/").replace(/\.json$/, "");
  if (only.length && !only.includes(id)) continue;
  // Se normaliza (y se valida) el JSON: sin espacios de sobra.
  const text = JSON.stringify(JSON.parse(await readFile(file, "utf8")));
  const hash = createHash("sha1").update(text).digest("hex").slice(0, 12);
  if (index[id] === hash) continue;

  const docId = id.replace(/\//g, "~");
  const parts = [];
  for (let i = 0; i < text.length; i += MAX_CHARS) parts.push(text.slice(i, i + MAX_CHARS));
  console.log(`${dryRun ? "[prueba] " : ""}${id}  ${(text.length / 1024).toFixed(0)} KB${parts.length > 1 ? ` en ${parts.length} partes` : ""}`);
  if (!dryRun) {
    const batch = db.batch();
    const base = { v: hash, bytes: text.length, actualizado: FieldValue.serverTimestamp() };
    if (parts.length === 1) {
      batch.set(db.collection("datos").doc(docId), { ...base, json: text });
    } else {
      batch.set(db.collection("datos").doc(docId), { ...base, partes: parts.length });
      parts.forEach((json, i) => batch.set(db.collection("datos").doc(`${docId}~p${i}`), { json }));
    }
    await batch.commit();
  }
  versions[id] = hash;
  uploaded++;
}

if (!dryRun && uploaded) await indexRef.set({ versiones: versions, actualizado: FieldValue.serverTimestamp() });
console.log(uploaded ? `${dryRun ? "Se subirían" : "Subidos"} ${uploaded} conjuntos.` : "No hay cambios: todo está al día.");
