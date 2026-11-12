<template>
  <!-- Hub de ARC Raiders (diseño: models/paginas/Arc.dc.html). Las piezas
       están en components/arc/hub; los datos, en public/data/arc-raiders. -->
  <div class="arc-ui arc-hub">
    <ArcHero :kpis="kpis" :boss="foes[0] || null" />

    <ArcMapGrid :maps="maps" />

    <ArcItemsSummary v-if="items.status === 'ready'" :groups="actions" :total="itemCount" />
    <section v-else id="objetos" class="sec">
      <div class="wrap">
        <span class="kick"><i></i>Objetos y reciclaje</span>
        <h2 class="h2 cond">¿Qué hago con esto?</h2>
        <LoadState :state="items" what="los objetos" />
      </div>
    </section>

    <ArcTraders v-if="quests.status === 'ready'" :traders="traders" :total="questCount" :on-map="questsOnMap" />
    <section v-else id="misiones" class="sec">
      <div class="wrap">
        <span class="kick"><i></i>Misiones</span>
        <h2 class="h2 cond">Misiones por comerciante</h2>
        <LoadState :state="quests" what="las misiones" />
      </div>
    </section>

    <ArcFoes v-if="enemies.status === 'ready'" :foes="foes" :total="enemyCount" />
    <section v-else id="arc" class="sec">
      <div class="wrap">
        <span class="kick"><i></i>Enemigos</span>
        <h2 class="h2 cond">Los ARC más peligrosos</h2>
        <LoadState :state="enemies" what="los enemigos" />
      </div>
    </section>

    <ArcCredits :note="dataNote" arc-tracker meta-forge />
  </div>
</template>

<script setup>
import { computed, h, nextTick, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import ArcHero from "@/components/arc/hub/ArcHero.vue";
import ArcMapGrid from "@/components/arc/hub/ArcMapGrid.vue";
import ArcItemsSummary from "@/components/arc/hub/ArcItemsSummary.vue";
import ArcTraders from "@/components/arc/hub/ArcTraders.vue";
import ArcFoes from "@/components/arc/hub/ArcFoes.vue";
import ArcCredits from "@/components/arc/hub/ArcCredits.vue";
import { loadArcEnemies, loadArcItems, loadArcQuests, summarizeActions, summarizeMaps, summarizeTraders, topEnemies, useArcJson } from "@/components/arc/hub/arcData";
import { fmt, fmtDate } from "@/components/arc/lists/arcLabels";
import "@/components/arc/hub/arc-ui.css";

const items = useArcJson(loadArcItems);
const quests = useArcJson(loadArcQuests);
const enemies = useArcJson(loadArcEnemies);

const maps = computed(() => summarizeMaps(quests.data, enemies.data));
const actions = computed(() => summarizeActions(items.data));
const traders = computed(() => summarizeTraders(quests.data));
const foes = computed(() => topEnemies(enemies.data, 6));

const itemCount = computed(() => items.data?.items?.length || 0);
const questCount = computed(() => quests.data?.quests?.length || 0);
const questsOnMap = computed(() => (quests.data?.quests || []).filter((q) => (q.mapIds || []).length).length);
const enemyCount = computed(() => enemies.data?.enemies?.length || 0);

const kpis = computed(() => [
  { value: quests.data ? maps.value.length : "—", label: "mapas" },
  { value: items.data ? fmt(itemCount.value) : "—", label: "objetos" },
  { value: quests.data ? questCount.value : "—", label: "misiones" },
  { value: enemies.data ? enemyCount.value : "—", label: "tipos de ARC" },
]);

const dataNote = computed(() => {
  const d = items.data?.meta?.sourceDate || quests.data?.meta?.sourceDate || enemies.data?.meta?.sourceDate;
  return d ? `Datos del juego actualizados hasta el ${fmtDate(d)}. Los cambios posteriores pueden no estar reflejados.` : "";
});

// Mensaje de carga o de error (con reintento) de una sección.
const LoadState = (props) =>
  props.state.status === "error"
    ? h("p", { class: "status err" }, [
        `No se pudieron cargar ${props.what}. `,
        h("button", { type: "button", class: "btn-s", onClick: () => props.state.reload() }, "Reintentar"),
      ])
    : h("p", { class: "status" }, `Cargando ${props.what}…`);
LoadState.props = ["state", "what"];

// Al entrar con un ancla (#objetos, #misiones…) la sección puede no existir
// todavía o cambiar de alto al cargar: se baja a ella cuando ya está pintada.
const route = useRoute();
function scrollToHash() {
  if (!route.hash) return;
  // getElementById y no querySelector: un ancla rara (#a/b) no es un selector válido.
  let id = route.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* se usa tal cual */
  }
  nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" }));
}
onMounted(scrollToHash);
watch(
  () => [items.status, quests.status, enemies.status].join(),
  (v) => {
    if (!v.includes("loading")) scrollToHash();
  }
);
</script>
