<template>
  <!-- ARC Raiders · visor de mapas (/arc-raiders/mapas/:mapa?).
       Diseño: models/paginas/ArcMapa.dc.html. Estado compartible en la URL:
       ?mision=<id> · ?enemigo=<id> · ?planta=<inferior|superior>. -->
  <div class="arcmap view-arc-map">
    <div class="wrap am-wrap">
      <ArcMapTabs v-if="maps.length" :maps="tabMaps" :current-id="map?.id || ''" @pick="unknownId = ''" />

      <p v-if="unknownId" class="am-alert" role="alert">
        <span>No conocemos el mapa «{{ unknownId }}». Te enseñamos {{ map?.name || "el primero" }}.</span>
        <button type="button" aria-label="Cerrar aviso" @click="unknownId = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
      </p>
      <p v-if="queryNotice" class="am-alert" role="alert">
        <span>{{ queryNotice }}</span>
        <button type="button" aria-label="Cerrar aviso" @click="queryNotice = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
      </p>

      <div v-if="loading" class="am-status" role="status">
        <span class="spin" aria-hidden="true"></span>Cargando mapas…
      </div>
      <div v-else-if="error" class="am-status err" role="alert">
        <p>{{ error }}</p>
        <button type="button" class="retry" @click="load">Reintentar</button>
      </div>

      <template v-else-if="map && view">
        <ArcMapHeader
          :map="map"
          :view-index="viewIndex"
          :quest-count="mapQuests.length"
          :enemy-count="mapEnemies.length"
          @update:view-index="setViewIndex"
        />

        <p v-for="w in data.warnings" :key="w" class="am-alert">{{ w }}</p>

        <div class="board">
          <ArcMapViewer
            ref="viewer"
            :view="view"
            :map-name="map.name"
            :floor-label="map.views.length > 1 ? view.label : ''"
            :pins="pins"
            :heat="heat"
            :chip="chip"
            :hint="hint"
            :note="note"
            :reset-key="`${map.id}|${view.file}`"
            @pick-pin="onPin"
            @clear="clearSelection"
          />

          <ArcMapSidePanel v-model:tab="tab" :quest-count="mapQuests.length" :enemy-count="mapEnemies.length">
            <template #quests>
              <ArcQuestList
                v-model:trader="trader"
                :rows="questRows"
                :filters="traderFilters"
                :selected-id="selectedQuest?.id || ''"
                :map-name="map.name"
                :map-id="map.id"
                @select="selectQuest"
              />
            </template>
            <template #enemies>
              <ArcEnemyList :rows="enemyRows" :selected-id="selectedFoe?.id || ''" :map-name="map.name" @select="selectFoe" />
            </template>
          </ArcMapSidePanel>
        </div>

        <ArcMapCredits :generated="generatedText" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ArcMapTabs from "@/components/arc/map/ArcMapTabs.vue";
import ArcMapHeader from "@/components/arc/map/ArcMapHeader.vue";
import ArcMapViewer from "@/components/arc/map/ArcMapViewer.vue";
import ArcMapSidePanel from "@/components/arc/map/ArcMapSidePanel.vue";
import ArcQuestList from "@/components/arc/map/ArcQuestList.vue";
import ArcEnemyList from "@/components/arc/map/ArcEnemyList.vue";
import ArcMapCredits from "@/components/arc/map/ArcMapCredits.vue";
import { enemiesForMap, framePoints, loadArcMapData, questsForMap } from "@/services/arcMaps";
import "@/components/arc/map/arc-map.css";

const route = useRoute();
const router = useRouter();

/* ---------- Datos ---------- */

const data = ref(null);
const loading = ref(true);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    data.value = await loadArcMapData();
  } catch (err) {
    console.error("[arc-map]", err);
    error.value = "No se pudieron cargar los mapas de ARC Raiders. Comprueba tu conexión y vuelve a intentarlo.";
  } finally {
    loading.value = false;
  }
}
onMounted(load);

const maps = computed(() => data.value?.maps || []);
const generatedText = computed(() => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.value?.generated || "");
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
});

/* ---------- Mapa y planta (URL) ---------- */

const paramId = computed(() => String(route.params.mapa || ""));
const map = computed(() => maps.value.find((m) => m.id === paramId.value) || maps.value[0] || null);
const unknownId = ref("");

// Sin :mapa se abre el primero; con un id desconocido se avisa y se vuelve al primero.
watch(
  [paramId, maps],
  () => {
    if (!maps.value.length) return;
    const first = maps.value[0].id;
    if (!paramId.value) {
      router.replace({ name: "arc-map", params: { mapa: first }, query: route.query });
    } else if (!maps.value.some((m) => m.id === paramId.value)) {
      unknownId.value = paramId.value;
      router.replace({ name: "arc-map", params: { mapa: first } });
    }
  },
  { immediate: true },
);

// «Planta inferior» → "inferior"
const viewSlug = (v) =>
  (v?.label || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^planta\s+/, "")
    .trim()
    .replace(/\s+/g, "-");

const viewIndex = computed(() => {
  const p = route.query.planta;
  if (!p || !map.value) return 0;
  const i = map.value.views.findIndex((v) => viewSlug(v) === p);
  return i > 0 ? i : 0;
});
const view = computed(() => map.value?.views[viewIndex.value] || null);

function updateQuery(patch) {
  const query = { ...route.query, ...patch };
  for (const k of Object.keys(query)) if (query[k] === undefined || query[k] === null || query[k] === "") delete query[k];
  router.replace({ query });
}
function setViewIndex(i) {
  pinOpen.value = null;
  updateQuery({ planta: i > 0 ? viewSlug(map.value.views[i]) : undefined });
}

/* ---------- Misiones y enemigos del mapa ---------- */

const mapQuests = computed(() => (data.value && map.value ? questsForMap(data.value.quests, map.value) : []));
const mapEnemies = computed(() => (data.value && map.value ? enemiesForMap(data.value.enemies, map.value) : []));

const tabMaps = computed(() =>
  maps.value.map((m) => ({ ...m, questCount: data.value ? questsForMap(data.value.quests, m).length : 0 })),
);

const ptsOf = (q) => (view.value && q?.points[view.value.file]) || [];
const zonesOf = (e) => (view.value && e?.zones[view.value.file]) || [];
// Otra planta del mismo mapa donde sí hay puntos (para avisar «están en la planta superior»).
const otherViewWith = (obj) =>
  map.value?.views.find((v) => v.file !== view.value?.file && obj?.[v.file]?.length) || null;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const selectedQuest = computed(() => mapQuests.value.find((q) => q.id === route.query.mision) || null);
const selectedFoe = computed(() =>
  selectedQuest.value ? null : mapEnemies.value.find((e) => e.id === route.query.enemigo) || null,
);

/* ---------- Panel ---------- */

// La pestaña Enemigos se abre sola si la URL trae un ARC válido (watch de selectedFoe).
const tab = ref("q");
const trader = ref("Todos");
const pinOpen = ref(null);

const traderFilters = computed(() => {
  const counts = {};
  const cls = {};
  for (const q of mapQuests.value) {
    counts[q.trader] = (counts[q.trader] || 0) + 1;
    cls[q.trader] = q.traderCls;
  }
  return [{ name: "Todos", count: mapQuests.value.length, cls: "" }].concat(
    Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
      .map((t) => ({ name: t, count: counts[t], cls: cls[t] })),
  );
});
const filteredQuests = computed(() =>
  mapQuests.value.filter((q) => trader.value === "Todos" || q.trader === trader.value),
);

const questRows = computed(() =>
  filteredQuests.value.map((q) => {
    const count = ptsOf(q).length;
    let status;
    if (count) status = count === 1 ? "1 punto en el mapa" : `${count} puntos en el mapa`;
    else {
      const other = otherViewWith(q.points);
      if (other) status = `Puntos en la ${other.label.toLowerCase()}`;
      else if (!view.value.calibrated) status = "Mapa aún sin puntos";
      else status = "Sin puntos en el mapa";
    }
    return { quest: q, count, status };
  }),
);

const enemyRows = computed(() =>
  mapEnemies.value.map((e) => {
    const count = zonesOf(e).length;
    let status;
    if (count) status = `${selectedFoe.value?.id === e.id ? "Zonas en el mapa" : "Ver zonas"} · ${plural(count, "punto", "puntos")}`;
    else {
      const other = otherViewWith(e.zones);
      if (other) status = `Zonas en la ${other.label.toLowerCase()}`;
      else if (!view.value.calibrated) status = "Mapa aún sin zonas";
      else status = "Sin ubicaciones conocidas";
    }
    return { enemy: e, count, status };
  }),
);

function selectQuest(id) {
  pinOpen.value = null;
  tab.value = "q";
  if (selectedQuest.value?.id === id) updateQuery({ mision: undefined });
  else updateQuery({ mision: id, enemigo: undefined });
}
function selectFoe(id) {
  pinOpen.value = null;
  if (selectedFoe.value?.id === id) updateQuery({ enemigo: undefined });
  else updateQuery({ enemigo: id, mision: undefined });
}
function clearSelection() {
  pinOpen.value = null;
  updateQuery({ mision: undefined, enemigo: undefined });
}

/* ---------- Capas del mapa ---------- */

const pins = computed(() => {
  const q = selectedQuest.value;
  if (q) {
    const pts = ptsOf(q);
    return pts.map((p, i) => ({
      key: `${q.id}-${i}`,
      quest: q,
      x: p[0],
      y: p[1],
      mode: "num",
      n: i + 1,
      total: pts.length,
      open: pinOpen.value === i,
    }));
  }
  if (selectedFoe.value) return [];
  // Vista general: el retrato del comerciante en el primer punto de cada misión.
  return filteredQuests.value
    .filter((x) => ptsOf(x).length)
    .map((x) => {
      const pts = ptsOf(x);
      return { key: x.id, quest: x, x: pts[0][0], y: pts[0][1], mode: "ovw", n: 0, total: pts.length, open: false };
    });
});

const heat = computed(() => (selectedFoe.value ? zonesOf(selectedFoe.value) : []));

const chip = computed(() => {
  const q = selectedQuest.value;
  if (q) {
    const n = ptsOf(q).length;
    const other = n ? null : otherViewWith(q.points);
    const where = n
      ? plural(n, "punto", "puntos")
      : other
        ? `puntos en la ${other.label.toLowerCase()}`
        : "sin puntos en este mapa";
    return { text: `${q.name} · ${where}`, img: q.portrait, cls: q.traderCls };
  }
  const e = selectedFoe.value;
  if (e) {
    const n = heat.value.length;
    const other = n ? null : otherViewWith(e.zones);
    const text = n
      ? `Zonas de aparición · ${e.name} · ${plural(n, "punto", "puntos")}`
      : `${e.name} · ${other ? `zonas en la ${other.label.toLowerCase()}` : "sin zonas conocidas aquí"}`;
    return { text, img: "", cls: "" };
  }
  return null;
});

const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;
const hint = computed(() => {
  if (selectedFoe.value) return "Las zonas brillan más donde aparecen más ARC";
  if (selectedQuest.value) return canHover ? "Pasa el ratón por un número para ver qué hacer" : "Toca un número para ver qué hacer";
  return canHover ? "Pasa por un retrato para ver la misión · arrastra para moverte" : "Toca un retrato para ver la misión · arrastra para moverte";
});

// Avisos para mapas, plantas o enemigos sin datos de posición.
const note = computed(() => {
  const m = map.value;
  const v = view.value;
  if (!m || !v) return "";
  if (!v.calibrated) {
    const other = m.views.find((x) => x.calibrated && x.file !== v.file);
    if (other) return `Los puntos de las misiones y las zonas de los ARC solo están en la ${other.label.toLowerCase()}. Aquí puedes ver el plano y la lista del panel.`;
    const lists = mapEnemies.value.length ? "Las misiones y los ARC del mapa" : "Las misiones del mapa";
    return `Todavía no tenemos posiciones en ${m.name}: su imagen no tiene referencias para calibrar los puntos. ${lists} están en el panel.`;
  }
  const e = selectedFoe.value;
  if (e && !heat.value.length) {
    const other = otherViewWith(e.zones);
    if (other) return `Las zonas de ${e.name} están en la ${other.label.toLowerCase()}.`;
    return `La fuente no tiene zonas de aparición de ${e.name} en ${m.name}. Mira su punto débil en el panel.`;
  }
  const q = selectedQuest.value;
  if (q && !ptsOf(q).length) {
    const other = otherViewWith(q.points);
    if (other) return `Los puntos de «${q.name}» están en la ${other.label.toLowerCase()}.`;
    return `«${q.name}» no tiene puntos marcados en ${m.name}: sigue los objetivos del panel.`;
  }
  return "";
});

function onPin(p) {
  if (p.mode === "num") pinOpen.value = pinOpen.value === p.n - 1 ? null : p.n - 1;
  else selectQuest(p.quest.id);
}

/* ---------- Encuadre: al elegir una misión el mapa se centra en sus puntos ---------- */

const viewer = ref(null);
const selectionKey = computed(() =>
  data.value && map.value && view.value
    ? `${map.value.id}|${view.value.file}|${selectedQuest.value?.id || ""}|${selectedFoe.value?.id || ""}`
    : "",
);
watch(
  selectionKey,
  async (key, old) => {
    if (!key) return;
    await nextTick();
    const v = viewer.value;
    if (!v) return;
    const q = selectedQuest.value;
    const pts = q ? ptsOf(q) : [];
    if (pts.length) {
      const f = framePoints(pts, v.levels);
      // Un solo punto: sin pasar de ×2,2 para no perder el contexto.
      v.focus(f.x, f.y, Math.max(1, Math.min(f.level, 2)));
    } else if (old) {
      v.reset();
    }
  },
  { flush: "post", immediate: true },
);

// Al cambiar de mapa se vuelve al filtro «Todos».
watch(
  () => map.value?.id,
  () => {
    trader.value = "Todos";
    pinOpen.value = null;
  },
);
// Con un enemigo en la URL se abre su pestaña.
watch(
  () => selectedFoe.value?.id,
  (id) => {
    if (id) tab.value = "e";
  },
  { immediate: true },
);

// Ids de la URL que no existen en este mapa (enlace viejo o de otro mapa):
// se quitan de la URL y se avisa, en vez de dejarlos colgando sin efecto.
const queryNotice = ref("");
watch(
  [data, () => route.fullPath],
  () => {
    const m = map.value;
    if (!data.value || !m || route.name !== "arc-map" || m.id !== paramId.value) return;
    const { mision, enemigo, planta } = route.query;
    const patch = {};
    const msgs = [];
    if (mision && !selectedQuest.value) {
      patch.mision = undefined;
      msgs.push(`la misión «${mision}»`);
    }
    if (enemigo && (selectedQuest.value || !mapEnemies.value.some((e) => e.id === enemigo))) {
      patch.enemigo = undefined;
      if (!selectedQuest.value) msgs.push(`el ARC «${enemigo}»`);
    }
    if (planta && !m.views.some((v, i) => i > 0 && viewSlug(v) === planta)) patch.planta = undefined;
    if (!Object.keys(patch).length) return;
    if (msgs.length) queryNotice.value = `No encontramos ${msgs.join(" ni ")} en ${m.name}.`;
    updateQuery(patch);
  },
  { immediate: true },
);
watch(
  () => map.value?.id,
  (id, old) => {
    if (old) queryNotice.value = "";
  },
);

// Esc: cierra la tarjeta fija y, si no hay ninguna, quita la selección.
// No actúa si se está escribiendo (p. ej. en el buscador del nav) ni si otro ya lo usó.
function onKey(e) {
  if (e.key !== "Escape" || e.defaultPrevented) return;
  const t = e.target;
  if (t?.closest?.("input, textarea, select, [contenteditable=''], [contenteditable='true'], [role='dialog'][aria-modal='true']")) return;
  if (pinOpen.value !== null) pinOpen.value = null;
  else if (selectedQuest.value || selectedFoe.value) clearSelection();
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

/* ---------- Título y descripción ---------- */

watch(
  [() => map.value?.name, () => route.fullPath],
  () => {
    const m = map.value;
    if (!m || route.name !== "arc-map") return;
    document.title = `${m.name} · Mapa de ARC Raiders | GrietaMeta`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `Mapa de ${m.name} en ARC Raiders: dónde se hace cada misión, con mini guías por puntos, y las zonas de aparición de cada ARC.`,
      );
  },
  { flush: "post", immediate: true },
);
</script>

<style scoped>
.view-arc-map {
  padding-bottom: 40px;
}
.am-wrap {
  max-width: 1400px;
}

.board {
  --am-vp-h: 760px;
  display: flex;
  flex-wrap: wrap;
  border-radius: 20px;
  overflow: hidden;
  background: var(--am-board);
  border: 1px solid var(--am-line);
  animation: am-rise 0.5s 0.05s var(--ease-out) both;
}

.am-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 14px 0 0;
  padding: 10px 12px 10px 14px;
  border-radius: 12px;
  background: rgba(245, 192, 42, 0.08);
  border: 1px solid rgba(245, 192, 42, 0.35);
  color: var(--am-ink-2);
  font-size: 14px;
}
.am-alert button {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 8px;
  background: rgba(242, 235, 221, 0.08);
  color: var(--am-ink);
  cursor: pointer;
}
.am-alert button:hover {
  background: rgba(242, 235, 221, 0.18);
}

.am-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 420px;
  margin-top: 26px;
  border-radius: 20px;
  background: var(--am-board);
  border: 1px solid var(--am-line);
  color: var(--am-mute);
  font-size: 15px;
  text-align: center;
  padding: 24px;
}
.am-status p {
  margin: 0;
  max-width: 460px;
}
.am-status.err {
  color: var(--am-ink-2);
}
.spin {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid rgba(242, 235, 221, 0.12);
  border-top-color: var(--am-yellow);
  animation: gm-spin 0.9s linear infinite;
}
.retry {
  height: 40px;
  padding: 0 18px;
  border-radius: 11px;
  border: 0;
  background: var(--am-yellow);
  color: #141007;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

/* Panel debajo del mapa cuando no caben los dos (mismo corte que ArcMapSidePanel). */
@media (max-width: 1040px) {
  .board {
    --am-vp-h: 640px;
  }
}
@media (max-width: 860px) {
  .board {
    --am-vp-h: 520px;
    border-radius: 16px;
  }
}
@media (max-width: 640px) {
  .board {
    /* Visor casi cuadrado, del ancho de la pantalla. */
    --am-vp-h: min(calc(100vw - 34px), 560px);
  }
}
@media (max-width: 560px) {
  .board {
    margin: 0 -16px;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    --am-vp-h: min(100vw, 520px);
  }
}
</style>
