<template>
  <div class="view-arc-items arc-ui">
    <section class="items-head">
      <div class="wrap">
        <nav class="items-crumb" aria-label="Migas de pan">
          <RouterLink :to="{ name: 'arc' }">ARC Raiders</RouterLink>
          <span aria-hidden="true">/</span><span aria-current="page">Objetos y reciclaje</span>
        </nav>
        <div class="items-intro">
          <div>
            <h1 class="cond">Objetos <span>¿qué hago con esto?</span></h1>
            <p>Los {{ data.status === 'ready' ? fmt(items.length) : '' }} objetos del juego con una recomendación para cada uno: guardarlo, reciclarlo, venderlo o usarlo, y el porqué. Toca una acción para ver solo esos.</p>
          </div>
          <div v-if="data.status === 'ready'" class="actions" role="group" aria-label="Filtrar por recomendación">
            <button v-for="g in actionCounts" :key="g.action" type="button" :class="actionClass(g.action)" :aria-pressed="f.action === g.action" @click="f.action = f.action === g.action ? '' : g.action">
              <b>{{ g.action }}</b><strong>{{ fmt(g.count) }}</strong><span>{{ actionHints[g.action] }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="wrap items-body">
      <div class="results">
        <div class="tools">
          <div class="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
            <label class="sr-only" for="arc-items-q">Buscar objeto</label>
            <input id="arc-items-q" v-model="searchInput" type="search" placeholder="Busca un objeto o material (Ferro, cables, reactor…)" autocomplete="off">
          </div>
          <label>
            <span class="sr-only">Ordenar objetos</span>
            <select v-model="sort">
              <option value="value">Más valiosos primero</option>
              <option value="rarity">Por rareza</option>
              <option value="name">Por nombre (A–Z)</option>
            </select>
          </label>
        </div>
        <div v-if="data.status === 'ready'" class="filters">
          <ArcFilterRow v-model="f.rarity" label="Rareza" all-label="Todas" :options="rarityOptions" />
          <ArcFilterRow v-model="f.group" label="Categoría" all-label="Todas" :options="groupOptions" />
        </div>
        <div v-if="data.status === 'ready'" class="count" aria-live="polite">
          <span><b>{{ fmt(filtered.length) }}</b> de {{ fmt(items.length) }} objetos</span>
          <button v-if="hasFilters" class="clear" type="button" @click="reset">Quitar filtros</button>
        </div>

        <div v-if="visibleItems.length" class="grid">
          <button v-for="it in visibleItems" :key="it.id" type="button" class="card" :class="rarityClass(it.rarity)" :aria-pressed="current?.id === it.id" @click="open(it)">
            <span class="card-art">
              <ArcItemArt :item="it" />
              <span class="badge" :class="actionClass(it.action)">{{ it.action }}</span>
            </span>
            <span class="name">{{ it.name }}</span>
            <span class="meta"><span class="rar">{{ rarityLabel(it.rarity) }}</span><span>{{ fmt(it.value) }}</span></span>
          </button>
        </div>
        <button v-if="visibleItems.length < filtered.length" type="button" class="more-items" @click="limit += PAGE_SIZE">Ver {{ Math.min(PAGE_SIZE, filtered.length - limit) }} más</button>

        <p v-if="data.status === 'loading'" class="status" role="status">Cargando objetos…</p>
        <p v-else-if="data.status === 'error'" class="status err" role="alert">
          No se pudieron cargar los objetos.
          <button type="button" class="btn-s" @click="data.reload()">Reintentar</button>
        </p>
        <div v-else-if="!filtered.length" class="empty" role="status">
          <b>Ningún objeto con esos filtros</b>
          <span>Prueba otra rareza o categoría, o busca por otro nombre.</span>
          <button class="more-items" type="button" @click="reset">Quitar filtros</button>
        </div>

        <details class="panel how">
          <summary>¿Cómo se calcula la recomendación?</summary>
          <div class="in">
            <ul class="rules">
              <li v-for="r in ACTION_RULES" :key="r.a" :class="actionClass(r.a)"><b class="cond">{{ r.a }}</b>{{ r.t }}</li>
            </ul>
            <p class="fine">{{ ACTION_DISCLAIMER }}</p>
          </div>
        </details>
      </div>

      <aside v-if="current" class="item-detail" aria-label="Ficha del objeto">
        <ArcItemSheet :item="current" title-id="arc-item-side-title" />
      </aside>
    </div>

    <ArcDialog :open="dialogOpen && !!current" labelledby="arc-item-dialog-title" @close="dialogOpen = false">
      <ArcItemSheet v-if="dialogOpen && current" :item="current" title-id="arc-item-dialog-title" />
    </ArcDialog>
    <ArcCredits :note="dataNote" arc-tracker />
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ArcFilterRow from "@/components/arc/lists/ArcFilterRow.vue";
import ArcItemArt from "@/components/arc/lists/ArcItemArt.vue";
import ArcItemSheet from "@/components/arc/lists/ArcItemSheet.vue";
import ArcDialog from "@/components/arc/lists/ArcDialog.vue";
import ArcCredits from "@/components/arc/hub/ArcCredits.vue";
import { loadArcItems, useArcJson } from "@/components/arc/hub/arcData";
import {
  ACTIONS, ACTION_DISCLAIMER, ACTION_RULES, GROUP_ORDER, RARITY_ORDER,
  actionClass, fmt, fmtDate, groupOf, norm, rarityClass, rarityKey, rarityLabel,
} from "@/components/arc/lists/arcLabels";
import "@/components/arc/hub/arc-ui.css";
import "@/assets/styles/views/arc-items.css";

const PAGE_SIZE = 36;
const route = useRoute();
const router = useRouter();

const data = useArcJson(loadArcItems);
// Copia con el nombre normalizado para buscar sin tildes (el JSON es compartido).
const items = computed(() => (data.data?.items || []).map((it) => ({
  ...it,
  searchText: norm([it.name, ...(it.recyclesInto || []).map((material) => material.name)].join(" ")),
})));

// ---- Filtros (los de la URL se aplican al entrar) ----
const fromQuery = (v) => (typeof v === "string" ? v : "");
const actionFromQuery = (v) => ACTIONS.find((a) => a.toLowerCase() === fromQuery(v).toLowerCase()) || "";
const f = reactive({ search: fromQuery(route.query.q), action: actionFromQuery(route.query.accion), rarity: "", group: "" });
const searchInput = ref(f.search);
const sort = ref("value");
const limit = ref(PAGE_SIZE);
const selected = ref("");
const dialogOpen = ref(false);
// Si se vuelve a entrar en la lista con otra URL (p. ej. desde la barra de
// ARC), se aplican sus filtros.
watch(
  () => route.query,
  (q) => {
    if (route.name !== "arc-items") return;
    // Si la URL es la que acaban de escribir los propios filtros, no se toca nada.
    const own = filterQuery();
    if ((own.q || "") === fromQuery(q.q) && (own.accion || "") === fromQuery(q.accion).toLowerCase()) return;
    searchInput.value = f.search = fromQuery(q.q);
    f.action = actionFromQuery(q.accion);
    f.rarity = f.group = "";
  }
);

let timer = null;
onBeforeUnmount(() => clearTimeout(timer));
watch(searchInput, (v) => {
  clearTimeout(timer);
  timer = setTimeout(() => (f.search = v), 150);
});
// Al cambiar un filtro se vuelve a la primera página; la búsqueda y la acción
// se reflejan en la URL para poder compartirla. Se usa router.replace (sin
// nueva entrada en el historial); el router conserva el scroll cuando solo
// cambia la query (ver scrollBehavior en router/index.js).
function filterQuery() {
  const query = {};
  if (f.search.trim()) query.q = f.search.trim();
  if (f.action) query.accion = f.action.toLowerCase();
  return query;
}
watch(
  () => [f.search, f.action, f.rarity, f.group],
  () => {
    limit.value = PAGE_SIZE;
    selected.value = "";
    dialogOpen.value = false;
    if (route.name === "arc-items") router.replace({ name: "arc-items", query: filterQuery() });
  }
);

const filtered = computed(() => {
  const q = norm(f.search.trim());
  const byValue = (a, b) => b.value - a.value;
  const order = {
    value: byValue,
    rarity: (a, b) => RARITY_ORDER.indexOf(rarityKey(b.rarity)) - RARITY_ORDER.indexOf(rarityKey(a.rarity)) || byValue(a, b),
    name: (a, b) => a.name.localeCompare(b.name, "es"),
  };
  return items.value.filter((it) =>
    (!f.action || it.action === f.action) &&
    (!f.rarity || rarityKey(it.rarity) === f.rarity) &&
    (!f.group || groupOf(it.type) === f.group) &&
    (!q || it.searchText.includes(q))
  ).sort(order[sort.value]);
});
const visibleItems = computed(() => filtered.value.slice(0, limit.value));
// Orden y fichas conservan el filtro activo.
watch(sort, () => {
  limit.value = PAGE_SIZE;
  selected.value = "";
});

const hasFilters = computed(() => !!(searchInput.value || f.action || f.rarity || f.group));
function reset() {
  searchInput.value = f.search = f.action = f.rarity = f.group = "";
}
const actionHints = {
  Guardar: "Te lo piden en misiones, el taller o proyectos",
  Reciclar: "Da materiales para el taller, proyectos o misiones",
  Vender: "Véndelo por su valor",
  Usar: "Armas, equipo y consumibles",
};

const actionCounts = computed(() => ACTIONS.map((a) => ({ action: a, count: items.value.filter((it) => it.action === a).length })));
const rarityOptions = computed(() => {
  const present = new Set(items.value.map((it) => rarityKey(it.rarity)));
  return RARITY_ORDER.filter((r) => present.has(r)).map((r) => ({ value: r, label: rarityLabel(r), cls: rarityClass(r), dot: true }));
});
const groupOptions = computed(() => {
  const present = new Set(items.value.map((it) => groupOf(it.type)));
  return GROUP_ORDER.filter((g) => present.has(g)).map((g) => ({ value: g, label: g }));
});

// ---- Ficha ----
const current = computed(() => filtered.value.find((it) => it.id === selected.value) || filtered.value[0] || null);
function open(it) {
  selected.value = it.id;
  dialogOpen.value = matchMedia("(max-width: 860px)").matches;
}

const dataNote = computed(() => {
  const d = data.data?.meta?.sourceDate;
  return d ? `Datos del juego actualizados hasta el ${fmtDate(d)}. Los cambios posteriores pueden no estar reflejados.` : "";
});
</script>
