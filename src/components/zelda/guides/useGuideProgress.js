/* Progreso del jugador (santuarios / semillas hechos) en las guías.
   Lo guarda el mapa interactivo con src/composables/useZeldaProgress.js.
   Ese archivo lo hace otro módulo: si no existe, import.meta.glob devuelve {}
   (sin error de compilación) y las guías funcionan igual, sin marcar nada. */

const found = import.meta.glob("/src/composables/useZeldaProgress.js", { eager: true });
const mod = Object.values(found)[0] || null;

const unwrap = (v) => (v && typeof v === "object" && "value" in v && !(v instanceof Map) ? v.value : v);

// Comprueba «hecho» con lo que exponga el composable (función o colección de ids).
function readDone(api, id) {
  if (!api) return false;
  if (typeof api.isDone === "function") return !!api.isDone(id);
  const done = unwrap(api.done) ?? unwrap(api.completed) ?? unwrap(api.hechos);
  if (!done) return false;
  if (done instanceof Set || done instanceof Map) return done.has(id);
  if (Array.isArray(done)) return done.includes(id);
  if (typeof done === "object") return !!done[id];
  return false;
}

// Llamar dentro de setup().
export function useGuideProgress() {
  const fn = mod && (mod.useZeldaProgress || mod.default);
  let api = null;
  if (typeof fn === "function") {
    try {
      api = fn();
    } catch {
      api = null;
    }
  }
  return { available: !!api, isDone: (id) => readDone(api, id) };
}
