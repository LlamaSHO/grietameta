/* Datos de ARC Raiders para el hub, la barra de ARC y las listas.
   Cada JSON se descarga una sola vez por visita (la promesa queda en caché) y
   se comparte entre vistas: ir del hub a una lista no lo vuelve a pedir. Si
   falla, se olvida para poder reintentar. Los datos son de solo lectura: quien
   los use debe copiarlos antes de modificarlos. */

import { reactive } from "vue";
import { fetchArcItems, fetchArcQuests, fetchArcEnemies, arcItemImageUrl, arcBotImageUrl, arcMapThumbUrl } from "@/services/arcRaiders";
import { ACTIONS, MAP_INFO, THREAT_ORDER, rarityLabel, rarityClass, threatLabel, threatClass, typeEs, traderInfo } from "@/components/arc/lists/arcLabels";

const cache = {};
function once(key, fn) {
  if (!cache[key]) {
    cache[key] = fn().catch((err) => {
      delete cache[key];
      throw err;
    });
  }
  return cache[key];
}
export const loadArcItems = () => once("items", fetchArcItems);
export const loadArcQuests = () => once("quests", fetchArcQuests);
export const loadArcEnemies = () => once("enemies", fetchArcEnemies);

/* Estado reactivo de un JSON: { data, status: 'loading' | 'ready' | 'error' }
   y reload() para reintentar. */
export function useArcJson(loader) {
  const s = reactive({ data: null, status: "loading" });
  function reload() {
    s.status = "loading";
    return loader()
      .then((d) => {
        s.data = d;
        s.status = "ready";
      })
      .catch(() => {
        s.status = "error";
      });
  }
  reload();
  s.reload = reload;
  return s;
}

/* ---- Resúmenes para el hub y la barra ---- */

// Mapas con sus misiones y los tipos de ARC que aparecen. Sin datos, usa la
// lista fija (nombre e imagen) para poder pintar ya la rejilla y el menú.
export function summarizeMaps(questsJson, enemiesJson) {
  const fromData = (questsJson?.maps || []).filter((m) => m && m.id && Array.isArray(m.views) && m.views.length);
  const base = fromData.length
    ? fromData.map((m) => ({ id: m.id, name: m.name, file: m.views[0].file, floors: m.views.length }))
    : MAP_INFO.map((m) => ({ id: m.id, name: m.name, file: m.file, floors: 1 }));

  const qCount = {};
  (questsJson?.quests || []).forEach((q) => (q.mapIds || []).forEach((id) => (qCount[id] = (qCount[id] || 0) + 1)));
  const eCount = {};
  (enemiesJson?.enemies || []).forEach((e) => (e.maps || []).forEach((n) => (eCount[n] = (eCount[n] || 0) + 1)));

  return base.map((m) => {
    const info = MAP_INFO.find((x) => x.id === m.id);
    const quests = questsJson ? qCount[m.id] || 0 : null;
    const enemies = enemiesJson ? eCount[m.name] || 0 : null;
    const enemiesText = enemies === null ? "" : enemies ? `${enemies} tipos de ARC` : "Sin datos de ARC";
    const parts = [];
    if (quests !== null) parts.push(`${quests} ${quests === 1 ? "misión" : "misiones"}`);
    if (enemiesText) parts.push(enemiesText);
    return {
      id: m.id,
      name: m.name,
      img: arcMapThumbUrl(m.file), // miniatura: se usa en tarjetas y menús
      sub: info?.sub || (m.floors > 1 ? `${m.floors} plantas` : ""),
      quests,
      enemiesText,
      meta: parts.join(" · "),
    };
  });
}

// Por cada acción: cuántos objetos y los 3 de más valor (con imagen).
export function summarizeActions(itemsJson) {
  const items = itemsJson?.items || [];
  return ACTIONS.map((a) => {
    const list = items.filter((it) => it.action === a);
    const top = list
      .filter((it) => it.hasImage)
      .sort((x, y) => (y.value || 0) - (x.value || 0))
      .slice(0, 3)
      .map((it) => ({
        id: it.id,
        name: it.name,
        img: arcItemImageUrl(it.id),
        value: it.value,
        rc: rarityClass(it.rarity),
        // En «Usar» se añade el tipo, como en el diseño (Legendario · ametralladora ligera).
        sub: a === "Usar" && it.type ? `${rarityLabel(it.rarity)} · ${typeEs(it.type).toLowerCase()}` : rarityLabel(it.rarity),
      }));
    return { action: a, count: list.length, top };
  });
}

// Comerciantes con su número de misiones, de más a menos.
export function summarizeTraders(questsJson) {
  const count = {};
  (questsJson?.quests || []).forEach((q) => q.trader && (count[q.trader] = (count[q.trader] || 0) + 1));
  const max = Math.max(1, ...Object.values(count));
  return Object.keys(count)
    .sort((a, b) => count[b] - count[a] || a.localeCompare(b, "es"))
    .map((name) => ({ name, quests: count[name], width: Math.round((count[name] / max) * 100) + "%", ...traderInfo(name) }));
}

// Los ARC más peligrosos: por amenaza y, a igualdad, los que salen en más mapas.
export function topEnemies(enemiesJson, n = 6) {
  const rank = (t) => THREAT_ORDER.indexOf(t);
  return (enemiesJson?.enemies || [])
    .slice()
    .sort((a, b) => rank(b.threat) - rank(a.threat) || (b.maps?.length || 0) - (a.maps?.length || 0) || a.name.localeCompare(b.name, "es"))
    .slice(0, n)
    .map((e) => ({
      id: e.id,
      name: e.name,
      type: e.type,
      img: e.hasImage ? arcBotImageUrl(e.id) : "",
      threat: threatLabel(e.threat),
      tc: threatClass(e.threat),
      maps: (e.maps || []).length === 1 ? e.maps[0] : `${(e.maps || []).length} mapas`,
      mapList: (e.maps || []).join(", "),
      weakness: e.weakness,
    }));
}
