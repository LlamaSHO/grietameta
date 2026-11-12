/* Progreso de misiones de ARC Raiders: completadas, seguidas (estrella) y
   objetivos marcados. Se guarda en este navegador (localStorage) con la
   misma clave y formato que la versión anterior, así nadie pierde lo que ya
   tenía marcado. También genera e importa el código de copia de seguridad. */

import { onScopeDispose, reactive, ref } from "vue";

const KEY = "arcmeta.misiones.v1";

function readSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// `byId` es un objeto { id: misión } con las misiones ya normalizadas.
export function useQuestProgress() {
  const done = reactive({});
  const pin = reactive({});
  const obj = reactive({});
  const saveOk = ref(true);
  let byId = {};

  const clear = (o) => Object.keys(o).forEach((k) => delete o[k]);

  function snapshot() {
    return { v: 1, done: Object.keys(done), pin: Object.keys(pin), obj: JSON.parse(JSON.stringify(obj)) };
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(snapshot()));
      saveOk.value = true;
    } catch {
      saveOk.value = false;
    }
  }

  // Solo se aceptan identificadores que existen y objetivos dentro de rango.
  function apply(s) {
    clear(done);
    clear(pin);
    clear(obj);
    if (!s || typeof s !== "object") return;
    (Array.isArray(s.done) ? s.done : []).forEach((id) => byId[id] && (done[id] = 1));
    (Array.isArray(s.pin) ? s.pin : []).forEach((id) => byId[id] && (pin[id] = 1));
    if (s.obj && typeof s.obj === "object") {
      Object.keys(s.obj).forEach((id) => {
        const q = byId[id];
        const a = s.obj[id];
        if (!q || !Array.isArray(a)) return;
        const ok = a.filter((i, k) => Number.isInteger(i) && i >= 0 && i < q.objectives.length && a.indexOf(i) === k);
        if (ok.length) obj[id] = ok;
      });
    }
  }

  // Si el progreso cambia en otra pestaña, se recarga aquí: así una pestaña
  // vieja no pisa lo marcado en la otra al guardar.
  function onStorage(e) {
    if ((e.key === KEY || e.key === null) && Object.keys(byId).length) apply(readSaved());
  }
  window.addEventListener("storage", onStorage);
  onScopeDispose(() => window.removeEventListener("storage", onStorage));

  // Se llama al tener las misiones: carga lo guardado en el navegador.
  function init(questsById) {
    byId = questsById;
    apply(readSaved());
    // Comprueba si se puede guardar (modo privado, almacenamiento bloqueado…).
    try {
      const probe = KEY + ".prueba";
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
    } catch {
      saveOk.value = false;
    }
  }

  function statusOf(q) {
    if (done[q.id]) return "done";
    return q.prev.every((p) => done[p]) ? "avail" : "locked";
  }

  function setDone(id, v) {
    if (v) done[id] = 1;
    else delete done[id];
    save();
  }
  function markWithPrevious(id) {
    const seen = {};
    (function walk(x) {
      if (seen[x] || !byId[x]) return;
      seen[x] = 1;
      done[x] = 1;
      byId[x].prev.forEach(walk);
    })(id);
    save();
  }
  function hasPendingPrevious(id) {
    const seen = {};
    let pending = false;
    (function walk(x) {
      byId[x].prev.forEach((p) => {
        if (seen[p]) return;
        seen[p] = 1;
        if (!done[p]) pending = true;
        walk(p);
      });
    })(id);
    return pending;
  }
  function togglePin(id) {
    if (pin[id]) delete pin[id];
    else pin[id] = 1;
    save();
  }
  function toggleObj(id, i) {
    const a = (obj[id] || []).slice();
    const k = a.indexOf(i);
    if (k === -1) a.push(i);
    else a.splice(k, 1);
    if (a.length) obj[id] = a;
    else delete obj[id];
    save();
  }

  // ---- Copia de seguridad ----
  const exportCode = () => JSON.stringify(snapshot());
  // Devuelve un mensaje de error, o null si el código es válido (sin aplicarlo).
  function checkCode(raw) {
    if (!raw) return "Pega primero un código en el cuadro.";
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return "El código no es válido.";
    }
    if (!data || typeof data !== "object" || !Array.isArray(data.done)) return "El código no es válido.";
    return null;
  }
  function importCode(raw) {
    apply(JSON.parse(raw));
    save();
    return Object.keys(done).length;
  }
  function reset() {
    clear(done);
    clear(pin);
    clear(obj);
    save();
  }

  return { done, pin, obj, saveOk, init, statusOf, setDone, markWithPrevious, hasPendingPrevious, togglePin, toggleObj, exportCode, checkCode, importCode, reset };
}
