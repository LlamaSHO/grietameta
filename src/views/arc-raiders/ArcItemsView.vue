<template>
  <!-- Lista completa de objetos de ARC Raiders (/arc-raiders/objetos). Sin
       diseño propio: sigue el estilo del hub (components/arc). Filtros por
       acción, rareza y categoría, buscador, paginación y ficha de cada objeto.
       Admite ?q=texto y ?accion=guardar|reciclar|vender|usar (desde el hub). -->
  <div class="view-arc-items arc-ui">
    <ArcListHeader
      crumb="Objetos y reciclaje"
      title="Objetos"
      accent="¿Qué hago con esto?"
      lead="Busca un objeto y mira si te conviene guardarlo, reciclarlo, venderlo o usarlo, y por qué."
      img="/images/arc-raiders/items/queen_reactor.webp"
    >
      <template v-if="data.status === 'ready'">
        <span class="pill"><b>{{ fmt(items.length) }}</b>objetos</span>
        <span v-for="g in actionCounts" :key="g.action" class="pill" :class="actionClass(g.action)"><b class="ac">{{ fmt(g.count) }}</b>{{ g.action.toLowerCase() }}</span>
      </template>
    </ArcListHeader>

    <div class="wrap body">
      <div class="tools">
        <div class="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <label class="sr-only" for="arc-items-q">Buscar objeto</label>
          <input id="arc-items-q" v-model="searchInput" type="search" placeholder="Buscar objeto (Ferro, cables, reactor…)" autocomplete="off">
        </div>
        <div class="filters">
          <ArcFilterRow v-model="f.action" label="Qué hacer" :options="actionOptions" />
          <ArcFilterRow v-model="f.rarity" label="Rareza" :options="rarityOptions" />
          <ArcFilterRow v-model="f.group" label="Categoría" :options="groupOptions" />
        </div>
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

      <div ref="gridTop" class="count" aria-live="polite">
        <template v-if="data.status === 'ready'">{{ fmt(filtered.length) }} {{ filtered.length === 1 ? "objeto" : "objetos" }}</template>
      </div>

      <div v-if="data.status === 'ready' && pageItems.length" class="grid">
        <button v-for="it in pageItems" :key="it.id" type="button" class="card" :class="rarityClass(it.rarity)" @click="open(it)">
          <ArcItemArt :item="it" />
          <span class="name">{{ it.name }}</span>
          <span class="meta"><span class="rar">{{ rarityLabel(it.rarity) }}</span><span class="val">{{ fmt(it.value) }}</span></span>
          <span class="badge" :class="actionClass(it.action)">{{ it.action }}</span>
        </button>
      </div>

      <p v-if="data.status === 'loading'" class="status">Cargando…</p>
      <p v-else-if="data.status === 'error'" class="status err">
        No se pudieron cargar los objetos. Inténtalo de nuevo en unos minutos.
        <button type="button" class="btn-s" @click="data.reload()">Reintentar</button>
      </p>
      <p v-else-if="!filtered.length" class="status">Ningún objeto coincide con la búsqueda o los filtros.</p>

      <nav v-if="pages > 1" class="pager" aria-label="Paginación">
        <button type="button" class="btn-s" :disabled="page <= 1" @click="goToPage(page - 1)">‹ Anterior</button>
        <label class="psel">
          Página
          <select :value="page" aria-label="Elegir página" @change="goToPage(+$event.target.value)">
            <option v-for="n in pages" :key="n" :value="n">{{ n }}</option>
          </select>
          <span>de {{ pages }}</span>
        </label>
        <button type="button" class="btn-s" :disabled="page >= pages" @click="goToPage(page + 1)">Siguiente ›</button>
      </nav>
    </div>

    <ArcDialog :open="!!current" labelledby="arc-item-title" @close="current = null">
      <ArcItemSheet v-if="current" :item="current" title-id="arc-item-title" />
    </ArcDialog>

    <ArcCredits :note="dataNote" arc-tracker />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ArcListHeader from "@/components/arc/lists/ArcListHeader.vue";
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

const PER_PAGE = 48;
const route = useRoute();
const router = useRouter();

const data = useArcJson(loadArcItems);
// Copia con el nombre normalizado para buscar sin tildes (el JSON es compartido).
const items = computed(() => (data.data?.items || []).map((it) => ({ ...it, _n: norm(it.name) })));

// ---- Filtros (los de la URL se aplican al entrar) ----
const fromQuery = (v) => (typeof v === "string" ? v : "");
const actionFromQuery = (v) => ACTIONS.find((a) => a.toLowerCase() === fromQuery(v).toLowerCase()) || "";
const f = reactive({ search: fromQuery(route.query.q), action: actionFromQuery(route.query.accion), rarity: "", group: "" });
const searchInput = ref(f.search);
const page = ref(1);
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
    page.value = 1;
    if (route.name === "arc-items") router.replace({ name: "arc-items", query: filterQuery() });
  }
);

const filtered = computed(() => {
  const q = norm(f.search.trim());
  return items.value.filter(
    (it) =>
      (!f.action || it.action === f.action) &&
      (!f.rarity || rarityKey(it.rarity) === f.rarity) &&
      (!f.group || groupOf(it.type) === f.group) &&
      (!q || it._n.includes(q))
  );
});
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)));
const pageItems = computed(() => {
  const p = Math.min(page.value, pages.value);
  return filtered.value.slice((p - 1) * PER_PAGE, p * PER_PAGE);
});

const gridTop = ref(null);
function goToPage(n) {
  page.value = Math.max(1, Math.min(pages.value, n || 1));
  gridTop.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Chips ----
const actionCounts = computed(() => ACTIONS.map((a) => ({ action: a, count: items.value.filter((it) => it.action === a).length })));
const actionOptions = computed(() => actionCounts.value.map((g) => ({ value: g.action, label: g.action, cls: actionClass(g.action), dot: true, count: g.count })));
const rarityOptions = computed(() => {
  const present = new Set(items.value.map((it) => rarityKey(it.rarity)));
  return RARITY_ORDER.filter((r) => present.has(r)).map((r) => ({ value: r, label: rarityLabel(r) }));
});
const groupOptions = computed(() => {
  const present = new Set(items.value.map((it) => groupOf(it.type)));
  return GROUP_ORDER.filter((g) => present.has(g)).map((g) => ({ value: g, label: g }));
});

// ---- Ficha ----
const current = ref(null);
function open(it) {
  current.value = it;
}

const dataNote = computed(() => {
  const d = data.data?.meta?.sourceDate;
  return d ? `Datos del juego actualizados hasta el ${fmtDate(d)}. Los cambios posteriores pueden no estar reflejados.` : "";
});
</script>
