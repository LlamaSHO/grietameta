<template>
  <div class="view-arc-quests arc-ui">
    <div class="wrap cm">
      <div class="cm-head">
        <div>
          <p class="cm-kick">Encargos de Speranza</p>
          <h1>Misiones de ARC</h1>
          <p class="cm-lede">Cada comerciante te da sus misiones en orden. Marca las que termines para saber qué te queda y qué objetos tienes que guardar.</p>
        </div>
        <div v-if="model" class="cm-total">
          <div class="cm-total-n"><b>{{ doneCount }}</b><span>de {{ model.quests.length }} completadas</span></div>
          <div class="cm-bar" role="progressbar" aria-label="Misiones completadas" :aria-valuenow="doneCount" :aria-valuemax="model.quests.length">
            <i :style="{ width: (model.quests.length ? doneCount / model.quests.length * 100 : 0) + '%' }"></i>
          </div>
          <small>El progreso se guarda en este navegador.</small>
        </div>
      </div>
      <p v-if="!progress.saveOk.value" class="notice" role="status">
        Este navegador no permite guardar el progreso (por ejemplo, en modo privado). Puedes seguir marcando misiones, pero se perderán al cerrar la página. Usa «Copia de seguridad» para guardar un código.
      </p>

      <template v-if="model">
        <ArcQuestProgress v-model:trader="f.trader" :quests="model.quests" :progress="progress" />

        <div class="cm-tools">
          <label class="fld">Buscar misión, objetivo u objeto
            <input v-model="searchInput" type="search" placeholder="Cables, presa, botiquín…" autocomplete="off">
          </label>
          <button type="button" class="tog" :aria-pressed="f.status === 'pending'" @click="f.status = f.status === 'pending' ? '' : 'pending'">
            <i aria-hidden="true"></i>Ocultar completadas
          </button>
        </div>
        <details class="panel extra-filters">
          <summary>Filtros por estado y mapa</summary>
          <div class="in filters">
            <ArcFilterRow v-model="f.status" label="Estado" :options="statusOptions" :all="false" :toggle="false" />
            <ArcFilterRow v-model="f.map" label="Mapa" :options="mapOptions" />
          </div>
        </details>

        <div class="cm-layout">
          <section aria-label="Misiones por comerciante">
            <p class="count" aria-live="polite">{{ visible.length }} de {{ model.quests.length }} misiones</p>
            <section v-for="g in groups" :key="g.name" class="grp">
              <h2 class="grp-h">
                <img v-if="g.img" :src="g.img" alt="" width="28" height="28" loading="lazy" decoding="async">
                {{ g.name || 'Sin comerciante' }}<small>{{ g.done }} de {{ g.total }} hechas</small>
              </h2>
              <ol class="chain">
                <li v-for="q in g.rows" :key="q.id" class="qi" :data-id="q.id">
                  <button type="button" class="qchk" :aria-pressed="!!progress.done[q.id]" :aria-label="`Completada · ${q.name}`" @click="progress.setDone(q.id, !progress.done[q.id])">
                    <span class="qn">{{ q.traderNumber }}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
                  </button>
                  <button type="button" class="qbody" :class="{ done: progress.done[q.id] }" :aria-pressed="current?.id === q.id" @click="pick(q.id)">
                    <span class="q-text">
                      <span class="qname">{{ q.name }}</span>
                      <span v-if="q.objectives[0]" class="qobj">{{ q.objectives[0] }}</span>
                    </span>
                    <span v-if="q.previewRewards.length" class="qrw" aria-hidden="true">
                      <ArcItemArt v-for="reward in q.previewRewards" :key="reward.id" :item="{ ...reward, hasImage: true }" />
                    </span>
                  </button>
                </li>
              </ol>
            </section>
            <div v-if="!visible.length" class="cm-empty" role="status">
              <h2>No hay misiones que mostrar</h2>
              <p>{{ emptyText }}</p>
              <button type="button" class="tog" @click="resetFilters">Restablecer filtros</button>
            </div>
          </section>
          <aside v-if="current" class="cm-panel" aria-label="Detalle de la misión">
            <ArcQuestRow :quest="current" :progress="progress" :by-id="model.byId" :map-names="model.mapNames" title-id="arc-quest-side-title" @go="goTo" />
          </aside>
        </div>
        <div class="panels">
          <details class="panel">
            <summary>Mapas <small>{{ model.maps.length }}</small></summary>
            <div class="in">
              <p class="hint">Cada mapa tiene su visor con las misiones que se juegan en él, sus puntos y las zonas de los ARC.</p>
              <div class="maps">
                <RouterLink v-for="m in mapCards" :key="m.id" class="mapcard" :to="mapRoute(m.id)">
                  <b class="cond">{{ m.name }}</b>
                  <span>{{ m.count }} {{ m.count === 1 ? "misión" : "misiones" }}<template v-if="m.done"> · {{ m.done }} hechas</template></span>
                  <i aria-hidden="true">→</i>
                </RouterLink>
              </div>
            </div>
          </details>

          <details class="panel">
            <summary>Objetos que necesitas guardar <small>{{ guard.length }}</small></summary>
            <div class="in">
              <label class="opt"><input v-model="onlyAvail" type="checkbox"> Solo de las misiones que ya tengo disponibles</label>
              <ul v-if="guard.length" class="guard">
                <li v-for="g in guard" :key="g.id">
                  <span class="gname">{{ g.name }} <b>×{{ fmt(g.qty) }}</b></span>
                  <small>Para: {{ g.quests.join(", ") }}</small>
                </li>
              </ul>
              <p v-else class="hint">No tienes objetos pendientes de guardar para misiones.</p>
            </div>
          </details>

          <details class="panel">
            <summary>Copia de seguridad <small>pasar el progreso a otro dispositivo</small></summary>
            <div class="in">
              <p class="hint">Tu progreso se guarda solo en este navegador. Para llevarlo a otro, genera un código, cópialo y pégalo allí en «Importar código».</p>
              <div class="bk-row">
                <button class="btn-s" type="button" @click="doExport">Generar código</button>
                <button class="btn-s" type="button" @click="doImport">Importar código</button>
                <button class="btn-s danger" type="button" @click="doReset">Borrar todo el progreso</button>
              </div>
              <textarea ref="codeEl" v-model="code" class="code" aria-label="Código de copia de seguridad" spellcheck="false" placeholder="Aquí aparece tu código, o pega uno y pulsa «Importar código»."></textarea>
              <p class="msg" :class="{ bad: msg.bad }" role="status">{{ msg.text }}</p>
            </div>
          </details>
        </div>

      </template>

      <p v-else-if="data.status === 'error'" class="status err" role="alert">
        No se pudieron cargar las misiones. Inténtalo de nuevo en unos minutos.
        <button type="button" class="btn-s" @click="data.reload()">Reintentar</button>
      </p>
      <p v-else class="status" role="status">Cargando misiones…</p>
    </div>

    <ArcDialog :open="dialogOpen && !!current" labelledby="arc-quest-dialog-title" @close="dialogOpen = false">
      <ArcQuestRow v-if="dialogOpen && current" :quest="current" :progress="progress" :by-id="model.byId" :map-names="model.mapNames" title-id="arc-quest-dialog-title" @go="goTo" />
    </ArcDialog>
    <ArcCredits :note="dataNote" meta-forge />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ArcDialog from "@/components/arc/lists/ArcDialog.vue";
import ArcItemArt from "@/components/arc/lists/ArcItemArt.vue";
import ArcFilterRow from "@/components/arc/lists/ArcFilterRow.vue";
import ArcQuestProgress from "@/components/arc/lists/ArcQuestProgress.vue";
import ArcQuestRow from "@/components/arc/lists/ArcQuestRow.vue";
import ArcCredits from "@/components/arc/hub/ArcCredits.vue";
import { loadArcQuests, useArcJson } from "@/components/arc/hub/arcData";
import { useQuestProgress } from "@/components/arc/lists/useQuestProgress";
import { fmt, fmtDate, mapRoute, norm, traderInfo } from "@/components/arc/lists/arcLabels";
import "@/components/arc/hub/arc-ui.css";
import "@/assets/styles/views/arc-quests.css";

const route = useRoute();
const data = useArcJson(loadArcQuests);
const progress = useQuestProgress();

// Copia normalizada de las misiones (el JSON es compartido con otras vistas).
const model = computed(() => {
  const json = data.data;
  if (!json) return null;
  const maps = (Array.isArray(json.maps) ? json.maps : []).filter((m) => m && m.id && Array.isArray(m.views) && m.views.length);
  const mapNames = {};
  maps.forEach((m) => (mapNames[m.id] = m.name));
  const byId = Object.create(null);
  const traderSizes = new Map();
  const quests = [...(json.quests || [])].sort((a, b) => a.order - b.order).map((q0) => {
    const traderNumber = (traderSizes.get(q0.trader) || 0) + 1;
    traderSizes.set(q0.trader, traderNumber);
    const q = {
      ...q0,
      traderNumber,
      previewRewards: (q0.rewards || []).filter((reward) => reward.isItem).slice(0, 2),
      mapIds: (q0.mapIds || []).filter((id) => mapNames[id]),
      prev: q0.prev || [],
      next: q0.next || [],
      objectives: q0.objectives || [],
      maps: q0.maps || [],
      required: q0.required || [],
      rewards: q0.rewards || [],
      granted: q0.granted || [],
      other: q0.other || [],
    };
    q._n = norm([q.name, q.trader, q.objectives.join(" "), q.required.map((r) => r.name).join(" "), q.rewards.map((r) => r.name).join(" ")].join(" "));
    byId[q.id] = q;
    return q;
  });
  // Se descartan enlaces a misiones que no existan.
  quests.forEach((q) => {
    q.prev = q.prev.filter((p) => byId[p]);
    q.next = q.next.filter((p) => byId[p]);
  });
  return { quests, byId, maps, mapNames, meta: json.meta || null };
});
watch(model, (m) => m && progress.init(m.byId), { immediate: true });

const doneCount = computed(() => (model.value?.quests || []).filter((q) => progress.done[q.id]).length);

// ---- Filtros ----
const fromQuery = (v) => (typeof v === "string" ? v : "");
const f = reactive({ status: "", trader: fromQuery(route.query.comerciante), map: "", q: "" });
// ?mapa=<id> filtra por ese mapa (los filtros usan el nombre).
watch(
  model,
  (m) => {
    const id = fromQuery(route.query.mapa);
    if (m && id && m.mapNames[id]) f.map = m.mapNames[id];
  },
  { immediate: true }
);
watch(
  () => route.query,
  (q) => {
    if (route.name !== "arc-quests") return;
    f.trader = fromQuery(q.comerciante);
    f.map = model.value && model.value.mapNames[fromQuery(q.mapa)] ? model.value.mapNames[fromQuery(q.mapa)] : "";
  }
);
const searchInput = ref("");
let timer = null;
onBeforeUnmount(() => clearTimeout(timer));
watch(searchInput, (v) => {
  clearTimeout(timer);
  timer = setTimeout(() => (f.q = v), 150);
});

const visible = computed(() => {
  if (!model.value) return [];
  const qn = norm(f.q);
  return model.value.quests.filter((q) => {
    const st = progress.statusOf(q);
    if (f.status === "pin" && !progress.pin[q.id]) return false;
    if (f.status === "avail" && st !== "avail") return false;
    if (f.status === "pending" && st === "done") return false;
    if (f.status === "done" && st !== "done") return false;
    if (f.trader && q.trader !== f.trader) return false;
    if (f.map && !q.maps.includes(f.map)) return false;
    if (qn && !q._n.includes(qn)) return false;
    return true;
  });
});

const statusOptions = computed(() => {
  const c = { "": 0, pin: 0, avail: 0, pending: 0, done: 0 };
  (model.value?.quests || []).forEach((q) => {
    const st = progress.statusOf(q);
    c[""]++;
    if (progress.pin[q.id]) c.pin++;
    if (st === "avail") c.avail++;
    if (st !== "done") c.pending++;
    else c.done++;
  });
  return [
    ["", "Todas"],
    ["pin", "Siguiendo"],
    ["avail", "Disponibles"],
    ["pending", "Pendientes"],
    ["done", "Completadas"],
  ].map(([value, label]) => ({ value, label, count: c[value] }));
});
const mapOptions = computed(() => {
  const n = {};
  (model.value?.quests || []).forEach((q) => q.maps.forEach((m) => (n[m] = (n[m] || 0) + 1)));
  return Object.keys(n)
    .sort()
    .map((m) => ({ value: m, label: m, count: n[m] }));
});

const emptyText = computed(() =>
  f.status === "pin" && !f.q && !f.trader && !f.map
    ? "Aún no sigues ninguna misión. Pulsa la estrella de una misión para seguirla."
    : "Ninguna misión coincide con la búsqueda o los filtros."
);

// ---- Mapas (enlaces al visor) ----
const mapCards = computed(() =>
  model.value.maps.map((m) => {
    const qs = model.value.quests.filter((q) => q.mapIds.includes(m.id));
    return { id: m.id, name: m.name, count: qs.length, done: qs.filter((q) => progress.done[q.id]).length };
  })
);

// ---- Objetos a guardar ----
const onlyAvail = ref(false);
const guard = computed(() => {
  const agg = Object.create(null);
  (model.value?.quests || []).forEach((q) => {
    if (progress.done[q.id]) return;
    if (onlyAvail.value && progress.statusOf(q) !== "avail") return;
    q.required.forEach((r) => {
      const a = agg[r.id] || (agg[r.id] = { id: r.id, name: r.name, qty: 0, quests: [] });
      a.qty += r.qty;
      a.quests.push(q.name);
    });
  });
  return Object.values(agg).sort((a, b) => a.name.localeCompare(b.name, "es"));
});

const groups = computed(() => {
  const traders = new Map();
  for (const q of model.value?.quests || []) {
    const g = traders.get(q.trader) || { name: q.trader, ...traderInfo(q.trader), done: 0, total: 0, rows: [] };
    g.total++;
    if (progress.done[q.id]) g.done++;
    traders.set(q.trader, g);
  }
  for (const q of visible.value) traders.get(q.trader).rows.push(q);
  return [...traders.values()].filter((g) => g.rows.length);
});

const selected = ref("");
const dialogOpen = ref(false);
const current = computed(() => visible.value.find((q) => q.id === selected.value) || groups.value[0]?.rows[0] || null);
watch(current, (q) => { if (!q) dialogOpen.value = false; });

function resetFilters() {
  clearTimeout(timer);
  searchInput.value = f.q = f.status = f.trader = f.map = "";
}
function pick(id) {
  selected.value = id;
  dialogOpen.value = matchMedia("(max-width: 860px)").matches;
}
function scrollToQuest(id) {
  nextTick(() => document.querySelector(`.view-arc-quests .qi[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: "center" }));
}
function goTo(id) {
  if (!visible.value.some((q) => q.id === id)) resetFilters();
  pick(id);
  if (!dialogOpen.value) scrollToQuest(id);
}
watch(
  [model, () => route.query.mision],
  ([m, id]) => {
    if (route.name === "arc-quests" && typeof id === "string" && m?.byId[id]) goTo(id);
  },
  { immediate: true, flush: "post" }
);
// ---- Copia de seguridad ----
const code = ref("");
const codeEl = ref(null);
const msg = reactive({ text: "", bad: false });
const say = (text, bad = false) => Object.assign(msg, { text, bad });
function doExport() {
  code.value = progress.exportCode();
  nextTick(() => codeEl.value?.select());
  say("Código generado. Cópialo (Ctrl+C) y guárdalo o pégalo en otro dispositivo.");
}
function doImport() {
  const raw = code.value.trim();
  const err = progress.checkCode(raw);
  if (err) return say(err, true);
  if (!window.confirm("Esto sustituirá el progreso actual de este navegador. ¿Continuar?")) return;
  const n = progress.importCode(raw);
  say(`Progreso importado: ${n} ${n === 1 ? "misión completada" : "misiones completadas"}.`);
}
function doReset() {
  if (!window.confirm("¿Borrar todo tu progreso de misiones en este navegador? No se puede deshacer.")) return;
  progress.reset();
  say("Progreso borrado.");
}

const dataNote = computed(() => {
  const d = model.value?.meta?.sourceDate;
  return d ? `Datos de ${model.value.quests.length} misiones actualizados hasta el ${fmtDate(d)}. Las misiones añadidas después pueden no aparecer.` : "";
});
</script>
