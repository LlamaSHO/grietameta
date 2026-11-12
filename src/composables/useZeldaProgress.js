/* Progreso de Zelda: Tears of the Kingdom (lo que el usuario marca como hecho
   en el mapa del hub: santuarios, torres, cuevas y semillas kolog).

   Dónde se guarda:
   - Siempre en localStorage ("gm:zelda:progreso"), también sin sesión.
   - Con sesión, además en Firestore: users/{uid}.zeldaProgress
     (services/firebase/zeldaProgress.js). Al entrar se juntan las dos copias
     (unión) y desde ahí cada cambio se sube con un pequeño retraso. Si
     Firestore lo rechaza (p. ej. las reglas aún no admiten el campo), se avisa
     en la consola una vez y se sigue guardando en el navegador.

   API (la puede usar cualquier componente, p. ej. las guías):

     import { useZeldaProgress, zeldaKey } from "@/composables/useZeldaProgress";
     const { done, count, isDone, toggle, setDone, isShrineDone, storage } = useZeldaProgress();

     zeldaKey(cat, capa, id) → clave "<cat>:<capa>:<id>"
        cat:  "sh" santuario · "tw" torre · "cv" cueva · "sd" semilla kolog
        capa: "surf" superficie · "sky" cielo
        id:   el nombre en santuarios y torres (p. ej. "Tajikats", "Lookout Landing")
              y la posición en la lista en cuevas y semillas (src/data/zelda-map.js
              y src/data/zelda.js → semillas.surf1+surf2 / sky1+sky2, en ese orden).
     done            → objeto reactivo de solo lectura { [clave]: true }
     count           → computed con el nº de claves marcadas
     isDone(clave)   → boolean (reactivo si se usa en plantilla o computed)
     toggle(clave)   → cambia el estado y lo guarda
     setDone(clave, valor)
     isShrineDone(nombre) → santuario hecho en cualquiera de las dos capas
     countOf(cat)    → nº de marcados de una categoría ("sh", "tw", "cv", "sd")
     storage         → computed: "cuenta" (se sincroniza con Firestore) o "navegador" */

import { computed, effectScope, reactive, readonly, watch } from "vue";
import { useAuth } from "@/composables/useAuth";

const LS_KEY = "gm:zelda:progreso";
const SAVE_DELAY = 900;

export const zeldaKey = (cat, layer, id) => `${cat}:${layer}:${id}`;

const done = reactive({});
const sync = reactive({ uid: null, remoteOk: true });

let started = false;
let saveTimer = 0;
let warned = false;

function readLocal() {
  try {
    const list = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    return Array.isArray(list) ? list.filter((k) => typeof k === "string") : [];
  } catch {
    return [];
  }
}
function writeLocal() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(Object.keys(done)));
  } catch {
    /* almacenamiento lleno o bloqueado: se sigue en memoria */
  }
}
function replaceAll(keys) {
  for (const k of Object.keys(done)) if (!keys.includes(k)) delete done[k];
  for (const k of keys) done[k] = true;
}

function scheduleRemote() {
  if (!sync.uid) return;
  clearTimeout(saveTimer);
  const uid = sync.uid;
  saveTimer = setTimeout(async () => {
    try {
      const { saveZeldaProgress } = await import("@/services/firebase/zeldaProgress.js");
      await saveZeldaProgress(uid, Object.keys(done));
      sync.remoteOk = true;
    } catch (err) {
      sync.remoteOk = false;
      if (!warned) {
        warned = true;
        console.warn("No se pudo guardar el progreso de Zelda en la cuenta (se queda en este navegador):", err);
      }
    }
  }, SAVE_DELAY);
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  replaceAll(readLocal());

  // Otra pestaña cambió el progreso.
  window.addEventListener("storage", (e) => {
    if (e.key === LS_KEY) replaceAll(readLocal());
  });

  // Con sesión: al tener el perfil, se junta lo de la cuenta con lo local.
  // El watch va en un ámbito propio (no en el del componente que llama
  // primero): si no, se pararía al salir del mapa y ya no seguiría la sesión.
  effectScope(true).run(() => {
    const { state } = useAuth();
    watch(
      () => [state.user?.uid || null, state.profile],
      ([uid, profile]) => {
        if (!uid) {
          sync.uid = null;
          return;
        }
        if (sync.uid === uid || !profile) return; // ya sincronizado o perfil aún sin leer
        sync.uid = uid;
        const remote = Array.isArray(profile.zeldaProgress?.done) ? profile.zeldaProgress.done.filter((k) => typeof k === "string") : [];
        const before = Object.keys(done).length;
        for (const k of remote) done[k] = true;
        writeLocal();
        // Se sube si en el navegador había algo que la cuenta no tenía.
        if (before && Object.keys(done).length !== remote.length) scheduleRemote();
      },
      { immediate: true }
    );
  });
}

function setDone(key, value) {
  if (!key) return;
  if (value) done[key] = true;
  else delete done[key];
  writeLocal();
  scheduleRemote();
}

export function useZeldaProgress() {
  start();
  const count = computed(() => Object.keys(done).length);
  return {
    done: readonly(done),
    count,
    isDone: (key) => !!done[key],
    toggle: (key) => setDone(key, !done[key]),
    setDone,
    isShrineDone: (name) => !!(done[zeldaKey("sh", "surf", name)] || done[zeldaKey("sh", "sky", name)]),
    countOf: (cat) => Object.keys(done).filter((k) => k.startsWith(cat + ":")).length,
    storage: computed(() => (sync.uid ? "cuenta" : "navegador")),
    remoteOk: computed(() => sync.remoteOk),
  };
}
