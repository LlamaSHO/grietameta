<template>
  <div v-if="source.status !== 'ready'" class="guide-loading" role="status">
    <template v-if="source.status === 'loading'">Cargando {{ guide.title.toLowerCase() }}…</template>
    <template v-else>No se pudo cargar esta guía. <button class="more" type="button" @click="source.reload()">Reintentar</button></template>
  </div>

  <div v-else class="gbody">
    <section class="gmain" :aria-label="guide.title">
      <div v-if="guide.search" class="tools">
        <GuideSearch v-model="query" :placeholder="guide.search" />
        <GuideSeg v-if="isShrines" v-model="layer" label="Capa" :options="layers" />
        <GuideSeg v-if="isQuests" v-model="kind" label="Tipo de misión" :options="kinds" />
        <GuideSeg v-if="isSets" v-model="type" label="Tipo de conjunto" :options="types" />
        <GuideSeg v-if="isTable || isQuests" v-model="status" label="Estado" :options="states" />
      </div>

      <div v-if="isTable" class="zones" role="group" aria-label="Zona">
        <button v-for="name in ['', ...ZONES]" :key="name" type="button" class="zc" :class="{ on: zone === name }"
          :aria-pressed="zone === name" @click="zone = name">{{ name || 'Todas las zonas' }}</button>
      </div>

      <template v-if="isSeeds">
        <p class="count">Elige una zona: <b>{{ zone }}</b> · {{ zoneSummary(seedsByZone[zone]) }}</p>
        <div class="zgrid">
          <button v-for="name in ZONES" :key="name" type="button" class="zt" :class="{ on: zone === name }" :aria-pressed="zone === name" @click="zone = name">
            <b>{{ name }}</b><span>{{ zoneSummary(seedsByZone[name]) }}</span>
            <progress class="bar" :aria-label="'Semillas en ' + name" :value="seedsByZone[name].done" :max="seedsByZone[name].total || 1"></progress>
          </button>
        </div>
      </template>
      <p v-else-if="!isArmors" class="count" aria-live="polite"><b>{{ fmt(filtered.length) }}</b> de {{ fmt(rows.length) }} {{ guide.unit }}</p>

      <div v-if="!filtered.length" class="empty" role="status">
        <b>No hay nada con esos filtros</b><span>Prueba con otra zona, otra capa o borra la búsqueda.</span>
        <button class="more" type="button" @click="reset">Quitar filtros</button>
      </div>

      <div v-else-if="isTable" class="tbl" role="table" :aria-label="guide.title">
        <div class="tr th" role="row">
          <span role="columnheader" aria-label="Progreso"></span><span role="columnheader">Nombre</span>
          <span role="columnheader" class="zn">Zona</span><span role="columnheader" class="co">Coordenadas</span>
          <span role="columnheader" class="lay-head">Capa</span>
        </div>
        <div v-for="row in visible" :key="row.id" class="tr row" role="row"
          :class="{ sel: selected?.id === row.id, done: isDone(row.id) }">
          <div role="cell"><button type="button" class="ck" :class="{ on: isDone(row.id) }" :aria-label="progressLabel(row)" :aria-pressed="isDone(row.id)" @click="toggle(row.id)"><GuideIcon name="check" :size="16" /></button></div>
          <div role="cell"><button type="button" class="nm" :aria-pressed="selected?.id === row.id" @click="pick(row, $event)">
            <b>{{ row.name }}</b><small>{{ row.shrine ? 'Bajo el santuario ' + row.shrine : row.en }}</small>
          </button></div>
          <span role="cell" class="zn">{{ row.zone }}</span>
          <span role="cell" class="co">{{ coordinates(row) }}</span>
          <span role="cell" class="lay" :class="layerClass[row.layer]">{{ row.layer === 'profundidades' ? 'Profund.' : LAYER_NAMES[row.layer] }}</span>
        </div>
      </div>

      <div v-else-if="isSeeds" class="kgrid">
        <button v-for="row in visible" :key="row.id" type="button" class="kk"
          :class="{ sel: selected?.id === row.id, done: isDone(row.id), two: row.seeds === 2 }"
          :aria-pressed="selected?.id === row.id" @click="pick(row, $event)">
          <i>{{ row.seeds }}</i><span><b>{{ row.seeds === 2 ? "Kolog con amigo" : "Kolog" }} <span v-if="isDone(row.id)" aria-label="Recogido">✓</span></b><small>{{ coordinates(row) }} · {{ LAYER_NAMES[row.layer] }}</small></span>
        </button>
      </div>

      <div v-else-if="isQuests" class="qlist">
        <article v-for="row in visible" :key="row.id" class="qi" :class="{ sel: selected?.id === row.id, done: isDone(row.id) }">
          <button type="button" class="ck" :class="{ on: isDone(row.id) }" :aria-label="progressLabel(row)" :aria-pressed="isDone(row.id)" @click="toggle(row.id)"><GuideIcon name="check" :size="16" /></button>
          <div>
            <button type="button" class="nm" :aria-pressed="selected?.id === row.id" @click="pick(row, $event)"><b>{{ row.name }}</b><small>{{ row.tag }} · {{ row.region }}</small></button>
            <p v-if="selectedId === row.id">{{ row.body }}</p>
          </div>
          <span class="qk" :class="row.kind">{{ questLabels[row.kind] }}</span>
        </article>
      </div>

      <ol v-else-if="isArmors" class="arm">
        <li v-for="(row, index) in filtered" :key="row.id" class="ai">
          <span class="rk" aria-hidden="true">{{ index + 1 }}</span>
          <div><h3>{{ row.es }}<small>{{ row.en }}</small></h3><p>{{ row.text }} · {{ row.note }}</p>
            <a v-if="row.url" :href="row.url" target="_blank" rel="noopener noreferrer">Dónde encontrarla <GuideIcon name="externo" :size="13" /></a>
          </div>
          <div class="dbar"><progress class="bar" :aria-label="'Defensa de ' + row.es" :value="row.def" :max="maxDefense"></progress><b>{{ row.def }}</b></div>
        </li>
      </ol>

      <div v-else class="sets">
        <button v-for="row in visible" :key="row.id" type="button" class="st" :class="{ sel: selected?.id === row.id }"
          :aria-pressed="selected?.id === row.id" @click="pick(row, $event)">
          <span class="ty">{{ row.type }}</span><b>{{ row.name }}</b><span>{{ row.bonus }}</span>
        </button>
      </div>

      <button v-if="filtered.length > visible.length && !isArmors" type="button" class="more" @click="limit += batch">
        Ver {{ Math.min(batch, filtered.length - visible.length) }} más
      </button>
    </section>

    <aside ref="detail" class="gside" aria-label="Detalle">
      <button v-if="returnTo" class="more back-to-guide" type="button" @click="backToRow">Volver a la lista</button>
      <GuideDetail v-if="selected && !isArmors" :row="selected" :guide="guide.key" :done="isDone(selected.id)" @toggle="toggle(selected.id)" />
      <p class="card note">{{ guide.note }}</p>
    </aside>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useGameData } from "@/composables/useGameData";
import { fmt } from "../mapPoints";
import GuideDetail from "./GuideDetail.vue";
import GuideIcon from "./GuideIcon.vue";
import GuideSearch from "./GuideSearch.vue";
import GuideSeg from "./GuideSeg.vue";
import { useGuideProgress } from "./useGuideProgress";
import { LAYER_NAMES, ZONES, matches } from "./guideFilters";

const { guide } = defineProps({ guide: { type: Object, required: true } });
const source = useGameData("/data/zelda/" + guide.key + ".json");
const { isDone, toggle } = useGuideProgress();
const rows = computed(() => source.data || []);
const isShrines = guide.key === "santuarios";
const isTable = isShrines || guide.key === "raices";
const isSeeds = guide.key === "semillas";
const isQuests = guide.key === "misiones";
const isArmors = guide.key === "armaduras";
const isSets = guide.key === "conjuntos";
const batch = 40;

const option = (value, label) => ({ value, label });
const all = option("", "Todos");
const layers = [all, option("superficie", "Superficie"), option("cielo", "Cielo")];
const kinds = [all, option("p", "Principales"), option("a", "Aventuras"), option("s", "Secundarias")];
const types = [all, ...["Normal", "Elemento", "Habilidad", "Enemigos"].map((value) => option(value, value))];
const states = [all, option("todo", "Pendientes"), option("done", "Hechos")];
const layerClass = { superficie: "s", cielo: "k", profundidades: "d" };
const questLabels = { p: "Principal", a: "Aventura", s: "Secundaria" };

const query = ref("");
const layer = ref("");
const zone = ref(isSeeds ? "Centro" : "");
const kind = ref("");
const type = ref("");
const status = ref("");
const selectedId = ref(null);
const detail = ref(null);
const returnTo = ref(null);
const limit = ref(batch);

const coordinates = (row) => fmt(row.x) + ", " + fmt(row.y) + (row.z == null ? "" : " · " + fmt(row.z));
const progressLabel = (row) => (isDone(row.id) ? "Desmarcar " : "Marcar como hecho ") + row.name;
const filtered = computed(() => rows.value.filter((row) => (
  (!layer.value || row.layer === layer.value) &&
  (!zone.value || row.zone === zone.value) &&
  (!kind.value || row.kind === kind.value) &&
  (!type.value || row.type === type.value) &&
  (!status.value || isDone(row.id) === (status.value === "done")) &&
  matches(query.value, row.name, row.en, row.shrine, row.zone, row.region, row.tag, row.bonus, row.raw?.join(" "))
)));
const visible = computed(() => filtered.value.slice(0, limit.value));
const selected = computed(() => filtered.value.find((row) => row.id === selectedId.value) || filtered.value[0]);
const maxDefense = computed(() => Math.max(1, ...rows.value.map((row) => row.def)));
const seedsByZone = computed(() => {
  const summaries = Object.fromEntries(ZONES.map((name) => [name, { count: 0, total: 0, done: 0 }]));
  for (const row of rows.value) {
    const entry = summaries[row.zone];
    entry.count++;
    entry.total += row.seeds;
    if (isDone(row.id)) entry.done += row.seeds;
  }
  return summaries;
});
const zoneSummary = ({ count, total }) => fmt(count) + " kologs · " + fmt(total) + " semillas";

watch([query, zone, layer, kind, type, status], () => {
  limit.value = batch;
  selectedId.value = null;
  returnTo.value = null;
});
function reset() {
  query.value = layer.value = kind.value = type.value = status.value = "";
  zone.value = isSeeds ? "Centro" : "";
}
async function pick(row, event) {
  selectedId.value = row.id;
  if (window.matchMedia("(max-width: 940px)").matches) {
    returnTo.value = event.currentTarget;
    await nextTick();
    detail.value?.querySelector("h2")?.focus();
    detail.value?.scrollIntoView({ block: "start" });
  }
}
function backToRow() {
  returnTo.value?.focus();
  returnTo.value?.scrollIntoView({ block: "center" });
  returnTo.value = null;
}
</script>
