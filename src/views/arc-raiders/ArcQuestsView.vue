<template>
  <!-- Seguimiento de misiones de ARC Raiders (/arc-raiders/misiones). Sin
       diseño propio: sigue el estilo del hub (components/arc). Progreso por
       comerciante, filtros, objetos a guardar, copia de seguridad y la lista
       de misiones. Los mapas se ven en el visor (/arc-raiders/mapas/:mapa).
       Admite ?comerciante=Shani y ?mapa=<id> para entrar ya filtrado, y
       ?mision=<id> para abrir y resaltar una misión (desde el visor de mapas). -->
  <div class="view-arc-quests arc-ui">
    <ArcListHeader
      crumb="Misiones"
      title="Misiones"
      accent="Sigue tu progreso"
      lead="Marca las misiones que vas completando, sigue las que tienes en curso y mira qué objetos debes guardar."
      img="/images/arc-raiders/comerciantes/shani.webp"
    >
      <template v-if="model">
        <span class="pill"><b>{{ model.quests.length }}</b>misiones</span>
        <span class="pill"><b>{{ onMapCount }}</b>en un mapa concreto</span>
        <span class="pill"><b>{{ traderCount }}</b>comerciantes</span>
      </template>
    </ArcListHeader>

    <div class="wrap body">
      <p v-if="!progress.saveOk.value" class="notice" role="status">
        Este navegador no permite guardar el progreso (por ejemplo, en modo privado). Puedes seguir marcando misiones, pero se perderán al cerrar la página. Usa «Copia de seguridad» para guardar un código.
      </p>

      <template v-if="model">
        <ArcQuestProgress v-model:trader="f.trader" :quests="model.quests" :progress="progress" />

        <div class="tools">
          <div class="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <label class="sr-only" for="arc-quests-q">Buscar misión</label>
            <input id="arc-quests-q" v-model="searchInput" type="search" placeholder="Buscar misión, comerciante u objeto…" autocomplete="off">
          </div>
          <div class="filters">
            <ArcFilterRow v-model="f.status" label="Estado" :options="statusOptions" :all="false" :toggle="false" />
            <ArcFilterRow v-model="f.map" label="Mapa" :options="mapOptions" />
            <p v-if="f.trader" class="tfilter">
              Comerciante: <b>{{ f.trader }}</b>
              <button type="button" class="linkbtn" @click="f.trader = ''">Quitar</button>
            </p>
          </div>
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

        <div class="count" aria-live="polite">
          {{ visible.length === model.quests.length ? `${visible.length} misiones` : `${visible.length} de ${model.quests.length} misiones` }}
        </div>
        <div class="list">
          <ArcQuestRow
            v-for="q in visible"
            :key="q.id"
            :class="{ hl: highlightId === q.id }"
            :quest="q"
            :open="!!openIds[q.id]"
            :progress="progress"
            :by-id="model.byId"
            :map-names="model.mapNames"
            @toggle="toggleOpen(q.id)"
            @go="goTo"
          />
        </div>
        <p v-if="!visible.length" class="status">{{ emptyText }}</p>
      </template>

      <p v-else-if="data.status === 'error'" class="status err">
        No se pudieron cargar las misiones. Inténtalo de nuevo en unos minutos.
        <button type="button" class="btn-s" @click="data.reload()">Reintentar</button>
      </p>
      <p v-else class="status">Cargando misiones…</p>
    </div>

    <ArcCredits :note="dataNote" meta-forge />
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ArcListHeader from "@/components/arc/lists/ArcListHeader.vue";
import ArcFilterRow from "@/components/arc/lists/ArcFilterRow.vue";
import ArcQuestProgress from "@/components/arc/lists/ArcQuestProgress.vue";
import ArcQuestRow from "@/components/arc/lists/ArcQuestRow.vue";
import ArcCredits from "@/components/arc/hub/ArcCredits.vue";
import { loadArcQuests, useArcJson } from "@/components/arc/hub/arcData";
import { useQuestProgress } from "@/components/arc/lists/useQuestProgress";
import { fmt, fmtDate, mapRoute, norm } from "@/components/arc/lists/arcLabels";
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
  const quests = (Array.isArray(json.quests) ? json.quests : []).map((q0) => {
    const q = {
      ...q0,
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

const onMapCount = computed(() => model.value.quests.filter((q) => q.mapIds.length).length);
const traderCount = computed(() => new Set(model.value.quests.map((q) => q.trader)).size);

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

// ---- Desplegar y saltar a una misión ----
const openIds = reactive({});
const highlightId = ref("");
function toggleOpen(id) {
  if (openIds[id]) delete openIds[id];
  else openIds[id] = 1;
}
function scrollToQuest(id, behavior = "smooth") {
  nextTick(() => document.querySelector(`.view-arc-quests .q[data-id="${CSS.escape(id)}"]`)?.scrollIntoView({ behavior, block: "center" }));
}
function goTo(id) {
  Object.assign(f, { status: "", trader: "", map: "", q: "" });
  searchInput.value = "";
  clearTimeout(timer);
  openIds[id] = 1;
  highlightId.value = id;
  scrollToQuest(id);
}
// ?mision=<id> (p. ej. desde el visor de mapas): abre y resalta esa misión.
// Se respetan los demás filtros de la URL salvo que la oculten.
watch(
  [model, () => route.query.mision],
  ([m, id]) => {
    if (!m || typeof id !== "string" || !m.byId[id]) return;
    openIds[id] = 1;
    highlightId.value = id;
    nextTick(() => {
      if (!visible.value.some((q) => q.id === id)) Object.assign(f, { status: "", trader: "", map: "", q: "" });
      scrollToQuest(id, "instant");
    });
  },
  { immediate: true }
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
