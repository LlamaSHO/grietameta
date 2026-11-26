<script setup>
import { computed, reactive, ref, watch } from "vue";
import AcMapViewport from "./AcMapViewport.vue";

const props = defineProps({
  data: { type: Object, required: true },
  done: { type: Object, required: true },
  memories: { type: Array, required: true },
  places: { type: Object, required: true },
  target: { type: Object, default: null },
});
const emit = defineEmits(["memory"]);
const viewport = ref(null);
const sequenceId = ref("");
const selection = ref(null);
const visible = reactive({ districts: true, landmarks: true, memories: true, activities: false, route: false });
const layers = [
  ["districts", "Barrios"], ["landmarks", "Lugares históricos"], ["memories", "Memorias"],
  ["activities", "Misiones secundarias"], ["route", "Ruta de la historia"],
];
const counts = { cofres: "Cofres", cerrados: "Cerrados", escarapelas: "Escarapelas", artefactos: "Artefactos" };
const sequence = computed(() => props.data.seqs.find(item => item.id === sequenceId.value));
const activePlaces = computed(() => new Set(sequence.value?.mems.map(item => item.pl).filter(Boolean)));
const district = computed(() => props.data.dist.find(item => item.id === selection.value?.district));
const place = computed(() => props.places[selection.value?.place]);
const districtPlaces = computed(() => props.data.lms.filter(item => item.d === district.value?.id));
const selectedMemories = computed(() => {
  const ids = new Set((place.value ? [place.value] : districtPlaces.value).flatMap(item => item.mems));
  return props.memories.filter(item => ids.has(item.id));
});
const districtCounts = computed(() => {
  const result = {};
  for (const item of props.data.lms) result[item.d] = (result[item.d] || 0) + item.mems.length;
  return result;
});
const activityGroups = computed(() => groupActivities(district.value?.sm ?? []));
const activityPins = computed(() => visible.activities && !sequence.value
  ? props.data.dist.filter(item => item.shape && item.sm.length).map(item => ({
    ...item, totals: groupActivities(item.sm),
  }))
  : []);
const pins = computed(() => props.data.lms.filter(item => {
  if (item.ins) return false;
  if (sequence.value) return visible.memories && activePlaces.value.has(item.id);
  return item.mems.length ? visible.memories : visible.landmarks;
}));
const routePoints = computed(() => {
  const ids = sequence.value ? (visible.memories ? [...activePlaces.value] : []) : (visible.route ? props.data.route : []);
  return ids.map(id => props.places[id]).filter(item => item && !item.ins).map(item => `${item.x},${item.y}`).join(" ");
});
const versailles = computed(() => (sequence.value?.mems ?? props.memories).filter(item => item.pl === "versailles"));
const label = id => id === "p1" ? "P" : id;

function groupActivities(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const type = entry[0];
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push(entry);
  }
  return [...groups];
}

function anchor(x, y) {
  return { left: `${x / props.data.mw * 100}%`, top: `${y / props.data.mh * 100}%` };
}

function districtPick(id) {
  selection.value = { district: id };
}

function placePick(id, center = false) {
  const item = props.places[id];
  if (!item) return;
  selection.value = { district: item.d, place: id };
  if (center && !item.ins) viewport.value?.focusPoint(item.x / props.data.mw, item.y / props.data.mh);
}

function chooseSequence(id) {
  sequenceId.value = id;
  selection.value = null;
  if (id) visible.memories = true;
  viewport.value?.reset();
}

watch(() => props.target, target => {
  if (!target) return;
  chooseSequence(target.sequence);
  placePick(target.place, true);
}, { flush: "post" });
</script>

<template>
  <div class="ac-heading map-heading">
    <div>
      <h2>París, 1790</h2>
      <p>El plano real de la ciudad en 1790, con los 22 barrios del juego, sus lugares, dónde pasa cada memoria y las misiones secundarias de cada barrio.</p>
    </div>
    <p class="note">Rueda del ratón: zoom · arrastra para moverte · doble clic para acercar.<br>Plano de Mondhare et Jean (1790) coloreado por GrietaMeta. Los límites de los barrios son aproximados.</p>
  </div>

  <div class="sequences" role="group" aria-label="Ver una secuencia en el mapa">
    <span>Ver secuencia</span>
    <button type="button" :aria-pressed="!sequenceId" @click="chooseSequence('')">Todo</button>
    <button v-for="item in data.seqs" :key="item.id" type="button" :aria-pressed="sequenceId === item.id"
      :aria-label="item.id === 'p' ? 'Prólogo' : 'Secuencia ' + item.num"
      :class="{ complete: item.mems.every(memory => done[memory.id]) }" @click="chooseSequence(item.id)">{{ item.num }}</button>
  </div>

  <div class="map-grid">
    <aside class="sidebar" aria-label="Capas y barrios">
      <div class="layers" role="group" aria-label="Capas del mapa">
        <button v-for="[id, name] in layers" :key="id" type="button" :aria-pressed="visible[id]" @click="visible[id] = !visible[id]"><i></i>{{ name }}</button>
      </div>
      <details class="district-list" :open="true">
        <summary>Barrios de París y Versalles</summary>
        <div v-for="[group, title] in data.groups" :key="group" class="district-group">
          <h3>{{ title }}</h3>
          <button v-for="item in data.dist.filter(row => row.g === group)" :key="item.id" type="button"
            :aria-pressed="district?.id === item.id" @click="districtPick(item.id)">
            {{ item.n }}<span v-if="districtCounts[item.id]">{{ districtCounts[item.id] }}</span>
          </button>
        </div>
      </details>
    </aside>

    <div class="map-main">
      <AcMapViewport ref="viewport" :width="2400" :height="1652">
        <svg class="map-overlay" :viewBox="`0 0 ${data.mw} ${data.mh}`" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="ac-unity-route-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M1 1 L9 5 L1 9Z" fill="#b71836"/>
            </marker>
          </defs>
          <g>
            <path v-for="item in data.dist.filter(row => row.shape)" :key="item.id" class="district-shape"
              :class="{ selected: item.id === district?.id }" :d="item.shape" @click="districtPick(item.id)">
              <title>{{ item.n }}</title>
            </path>
          </g>
          <polyline v-if="routePoints" class="route-halo" :points="routePoints" />
          <polyline v-if="routePoints" class="route" :points="routePoints" marker-mid="url(#ac-unity-route-arrow)" marker-end="url(#ac-unity-route-arrow)" />
          <g v-if="visible.districts" class="district-labels">
            <text v-for="item in data.dist.filter(row => row.shape)" :key="item.id" :x="item.lx" :y="item.ly"
              :class="{ island: item.g === 'isla' }" text-anchor="middle">{{ item.n }}</text>
          </g>
        </svg>
        <button v-for="item in activityPins" :key="'activity-' + item.id" type="button" class="activity-pin"
          :style="anchor(item.lx, item.ly + 78)" :aria-label="`${item.n}: ${item.sm.length} misiones secundarias`" @click="districtPick(item.id)">
          <span v-for="[type, rows] in item.totals" :key="type" :style="{ '--activity': data.smt[type][1] }" :title="data.smt[type][0]">{{ rows.length }}</span>
        </button>
        <button v-for="item in pins" :key="item.id" type="button" class="map-pin"
          :class="{ memory: item.mems.length, complete: item.mems.length && item.mems.every(id => done[id]) }"
          :style="anchor(item.x, item.y)" :aria-label="item.n" :aria-pressed="place?.id === item.id" @click="placePick(item.id)">
          <span class="pin-dot" aria-hidden="true"></span>
          <span v-if="item.mems.length" class="pin-badge" aria-hidden="true">{{ sequence ? label(item.mems.find(id => sequence.mems.some(memory => memory.id === id))) : item.mems.length }}</span>
          <span class="pin-label" aria-hidden="true">{{ item.n }}</span>
        </button>

        <template #inset>
          <button class="versailles" type="button" :aria-pressed="district?.id === 'versalles'" @click="districtPick('versalles')">
            <svg viewBox="0 0 60 30" width="52" height="26" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 24h52M8 24V11h12v13M40 24V11h12v13M20 24V7h20v17M18 7h24l-12-5zM26 24v-7h8v7" /></svg>
            <span><b>Versalles</b><small>≈ 20 km al suroeste</small></span>
            <span v-if="versailles.length" class="memory-id">{{ versailles.length }}</span>
          </button>
        </template>
      </AcMapViewport>

      <div class="legend" aria-label="Leyenda del mapa">
        <span><i></i>Lugar histórico</span><span><i></i>Memoria</span><span><i></i>Misiones del barrio</span><span><i></i>Ruta</span>
      </div>

      <div v-if="sequence || district" class="map-details" :class="{ paired: sequence && district }">
        <aside v-if="sequence" class="map-panel" aria-label="Secuencia en el mapa">
          <div class="panel-heading">
            <div><small>{{ sequence.id === "p" ? "Prólogo" : "Secuencia " + sequence.num }}</small><h3>{{ sequence.t }}</h3></div>
            <button type="button" class="close" aria-label="Borrar filtro de secuencia" @click="chooseSequence('')">×</button>
          </div>
          <ul>
            <li v-for="item in sequence.mems" :key="item.id">
              <button v-if="item.pl" class="row" type="button" @click="placePick(item.pl, true)">
                <span class="memory-id">{{ label(item.id) }}</span><span><b>{{ item.t }}</b><small>{{ places[item.pl]?.n }}</small></span>
              </button>
              <p v-else class="row"><span class="memory-id">{{ label(item.id) }}</span><span><b>{{ item.t }}</b><small>{{ item.rift ? "Fallo del Helix · fuera del mapa" : "Lugar sin marcar en el mapa" }}</small></span></p>
            </li>
          </ul>
        </aside>

        <aside v-if="district" class="map-panel" aria-label="Ficha del mapa">
          <div class="panel-heading">
            <div><small>{{ place ? "Lugar · " + district.n : data.groups.find(group => group[0] === district.g)?.[1] }}</small><h3>{{ place?.n ?? district.n }}</h3></div>
            <button type="button" class="close" aria-label="Cerrar ficha del mapa" @click="selection = null">×</button>
          </div>
          <p v-if="place?.aprox" class="approx">Posición aproximada</p>
          <p>{{ place?.desc ?? district.desc }}</p>
          <template v-if="selectedMemories.length">
            <h4>Memorias aquí</h4>
            <ul>
              <li v-for="item in selectedMemories" :key="item.id">
                <RouterLink class="row" to="#historia" @click="emit('memory', item.id)">
                  <span class="memory-id" :class="{ completed: done[item.id] }">{{ label(item.id) }}</span><b>{{ item.t }}</b><span aria-hidden="true">→</span>
                </RouterLink>
              </li>
            </ul>
          </template>
          <template v-if="!place">
            <template v-if="districtPlaces.length">
              <h4>Lugares</h4>
              <div class="places">
                <button v-for="item in districtPlaces" :key="item.id" type="button" @click="placePick(item.id, true)">{{ item.n }}</button>
              </div>
            </template>
            <template v-if="district.c.length">
              <h4>Coleccionables</h4>
              <dl class="collectibles"><div v-for="[type, total] in district.c" :key="type"><dt>{{ counts[type] || type }}</dt><dd>{{ total }}</dd></div></dl>
            </template>
            <p v-if="district.note">{{ district.note }}</p>
            <section v-for="[type, rows] in activityGroups" :key="type" class="local-activities">
              <h4 :style="{ '--activity': data.smt[type][1] }">{{ data.smt[type][0] }}</h4>
              <ul><li v-for="row in rows" :key="row[1]"><b>{{ row[1] }}</b><small>{{ row[2] }}</small><p>{{ row[3] }}</p></li></ul>
            </section>
          </template>
          <button v-else type="button" class="ac-button district-back" @click="districtPick(district.id)">Ver el barrio: {{ district.n }}</button>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped src="./ac-page.css"></style>
<style scoped>
.map-heading { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 10px 24px; }
.map-heading .note { color: #adbdc9; font-size: .82rem; max-width: 390px; }
.sequences, .layers button, .district-group button, .district-list, .map-panel, .legend { border: 1px solid var(--ac-line); background: #101823; }
.sequences { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-bottom: 12px; padding: 7px; border-radius: 6px; }
.sequences > span { padding-inline: 5px; color: #b7c7d2; font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
.sequences button, .layers button, .district-group button, .places button { color: inherit; min-height: 44px; border: 1px solid #354658; border-radius: 4px; padding: 0 10px; background: #111b26; font: inherit; font-size: .85rem; cursor: pointer; }
.sequences button { min-width: 44px; }
.sequences button.complete { border-color: #609a7e; }
.sequences button[aria-pressed=true] { background: #a8213b; color: white; border-color: #ee788e; }
.map-grid { display: grid; grid-template-columns: minmax(185px, 235px) minmax(0,1fr); align-items: start; gap: 12px; }
.sidebar,.map-main { min-width: 0; }
.layers { display: grid; gap: 5px; margin-bottom: 9px; }
.layers button, .district-group button { display: flex; align-items: center; gap: 8px; text-align: left; }
.layers i { width: 23px; height: 13px; flex-shrink: 0; border-radius: 12px; background: #3c4858; position: relative; }
.layers i::after { content: ""; position: absolute; top: 2px; left: 2px; width: 9px; height: 9px; border-radius: 50%; background: #c6cfdb; }
.layers button[aria-pressed=true] { border-color: #4e8297; background: #132936; }
.layers button[aria-pressed=true] i { background: #48778a; }
.layers button[aria-pressed=true] i::after { transform: translateX(10px); background: #e4f7fb; }
.district-list { padding: 5px; border-radius: 6px; max-height: 406px; overflow: auto; }
.district-list summary { padding: 8px 6px; cursor: pointer; font-size: .85rem; font-weight: 700; }
.district-group h3 { margin: 8px 6px 3px; color: #b9c7d0; font-size: .76rem; text-transform: uppercase; letter-spacing: .07em; }
.district-group button { width: 100%; min-height: 36px; justify-content: space-between; border-color: transparent; background: transparent; }
.district-group button:hover, .district-group button[aria-pressed=true], .places button:hover { background: #23394a; border-color: #3d5d70; }
.district-group span { color: #e1aaba; }
.map-overlay { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.district-shape { cursor: pointer; pointer-events: auto; stroke: #eee0aa; stroke-width: 5; fill: #60452313; }
.district-shape:hover,.district-shape.selected { stroke: #fff1c1; stroke-width: 8; fill: #f2cf594c; }
.district-labels text { font: 700 41px Georgia, serif; fill: #f9eed7; paint-order: stroke; stroke: #422819; stroke-width: 8; stroke-linejoin: round; }
.district-labels .island { font-size: 31px; }
.route-halo,.route { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.route-halo { stroke: #fff0ce; stroke-width: 23; opacity: .8; }
.route { stroke: #b71836; stroke-width: 13; stroke-dasharray: 26 20; }
.map-pin,.activity-pin { position: absolute; display: grid; place-items: center; padding: 0; transform: translate(-50%,-50%) scale(var(--marker-scale,1)); border: 0; background: transparent; cursor: pointer; }
.map-pin { width: 23px; height: 23px; }
.pin-dot { width: 11px; height: 11px; border: 2px solid #ffffe8; border-radius: 50%; background: #243c64; box-shadow: 0 1px 2px #111; }
.memory .pin-dot { width: 13px; height: 13px; background: #bd1534; }
.complete .pin-dot { background: #257c54; }
.map-pin[aria-pressed=true] .pin-dot { outline: 2px solid #8fe3ff; border-color: #201910; }
.pin-badge { position: absolute; left: 16px; bottom: 13px; padding: 0 3px; border: 1px solid #ffe0cf; border-radius: 3px; background: #8e1731; color: white; font: 700 .65rem/1.3 sans-serif; white-space: nowrap; }
.pin-label { display: none; position: absolute; top: 105%; left: 50%; width: max-content; max-width: 130px; transform: translateX(-50%); padding: 4px 6px; border-radius: 4px; background: #15202b; color: white; font-size: .72rem; }
.map-pin:is(:hover,:focus-visible) { z-index: 2; }
.map-pin:is(:hover,:focus-visible) .pin-label { display: block; }
.activity-pin { display: flex; gap: 2px; z-index: 1; }
.activity-pin span { padding: 2px 4px; border: 1px solid #342316; border-radius: 4px; background: var(--activity); color: #15131a; font-weight: 700; }
.versailles { display: flex; align-items: center; gap: 7px; position: absolute; inset: auto auto 8px 8px; max-width: calc(100% - 16px); padding: 7px; cursor: pointer; border: 1px solid #a59165; border-radius: 5px; background: #25211a; color: #f3e3bf; text-align: left; }
.versailles span { display: grid; }
.versailles[aria-pressed=true] { border-color: #8fe3ff; }
.legend { display: flex; flex-wrap: wrap; gap: 5px 16px; margin-top: 6px; padding: 8px; border-radius: 5px; font-size: .75rem; color: #cad6df; }
.legend span { display: flex; align-items: center; gap: 5px; }
.legend i { width: 8px; height: 8px; border-radius: 50%; background: #83a6e0; }
.legend span:nth-of-type(2) i { background: #f16a7e; }
.legend span:nth-of-type(3) i { background: #e4bd78; }
.legend span:nth-of-type(4) i { width: 12px; height: 2px; border-radius: 0; background: #f16a7e; }
.map-details { display: grid; gap: 8px; margin-top: 8px; }
.map-details.paired { grid-template-columns: repeat(2,minmax(0,1fr)); align-items: start; }
.map-panel { padding: 15px; border-radius: 6px; }
.map-panel p { margin: 8px 0 0; color: #becdd8; font-size: .9rem; }
.panel-heading { display: flex; justify-content: space-between; align-items: start; gap: 8px; }
.panel-heading small { color: #f29bab; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.panel-heading h3 { margin: 4px 0 0; font: 700 1.55rem/1.06 var(--ac-display); }
.close { width: 44px; height: 44px; flex-shrink: 0; border: 1px solid #435262; border-radius: 4px; background: #14212c; color: #e8eff7; font-size: 1.2rem; cursor: pointer; }
.approx { color: #f1cb83 !important; font-weight: 600; }
.map-panel h4 { margin: 14px 0 6px; }
.map-panel ul { display: grid; gap: 5px; margin: 9px 0 0; padding: 0; list-style: none; }
.map-panel .row { display: flex; align-items: center; gap: 7px; width: 100%; min-height: 44px; padding: 5px 8px; border: 1px solid #324454; border-radius: 4px; color: #e6f1f7; background: #172431; text-align: left; font: inherit; font-size: .84rem; text-decoration: none; }
button.row { cursor: pointer; }
.map-panel :is(button,a).row:hover { background: #263c4e; }
.row small { display: block; color: #bccbd6; }
.memory-id { flex: 0 0 auto; padding: 3px 5px; border-radius: 3px; background: #752337; color: #ffe7e8; font-size: .75rem; font-weight: 700; }
.memory-id.completed { background: #236243; }
.places { display: flex; flex-wrap: wrap; gap: 5px; }
.collectibles { display: flex; flex-wrap: wrap; gap: 8px 14px; margin: 0; font-size: .85rem; }
.collectibles div { display: grid; gap: 3px; }
.collectibles dd { margin: 0; font-weight: 700; }
.local-activities h4 { color: var(--activity); }
.local-activities li { display: grid; gap: 2px; padding: 7px 0; border-top: 1px solid #2b3b49; }
.local-activities small { color: #f0c98a; }
.local-activities li p { margin: 0; }
.district-back { margin-top: 12px; }
@media (max-width: 850px) {
  .map-grid { grid-template-columns: minmax(0,1fr); }
  .layers { grid-template-columns: repeat(auto-fit,minmax(130px,1fr)); }
  .district-list { max-height: 140px; }
}
@media (max-width: 560px) {
  .map-details.paired { grid-template-columns: minmax(0,1fr); }
  .map-pin { width: 17px; height: 17px; }
  .pin-dot, .memory .pin-dot { width: 9px; height: 9px; }
  .pin-badge { display: none; }
  .versailles svg { display: none; }
  .versailles small { font-size: .65rem; }
  .activity-pin span { font-size: .65rem; padding: 1px 2px; }
}
</style>
