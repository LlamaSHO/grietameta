<template>
  <!-- Guía de semillas kolog: mini-mapa por capa, ficha del kolog elegido,
       recuento por zona y lista paginada. -->
  <div class="sd">
    <GuideToolbar :count="rows.length" :count-label="`${rows.length === 1 ? 'kolog' : 'kologs'} · ${seedsShown} semillas`" :can-reset="filtered" @reset="reset">
      <template #search>
        <GuideSearch v-model="q" placeholder="Zona o coordenada (p. ej. «noreste»)" label="Buscar semillas kolog" />
      </template>
      <GuideSeg v-model="layer" :options="layerOpts" label="Capa del mapa" />
      <GuideSeg v-model="tipo" :options="tipoOpts" label="Tipo de kolog" />
      <GuideSeg v-if="progress.available" v-model="estado" :options="estadoOpts" label="Estado" />
    </GuideToolbar>

    <div class="sd-lay">
      <div class="sd-mapcard">
        <PanZoomMap
          ref="map"
          class="sd-vp"
          :src="layer === 'cielo' ? '/images/zelda/mapas/cielo-md.jpg' : '/images/zelda/mapas/superficie-md.jpg'"
          :src-hd="layer === 'cielo' ? '/images/zelda/mapas/cielo-hd.webp' : '/images/zelda/mapas/superficie-hd.webp'"
          :alt="`Mapa de ${layer === 'cielo' ? 'el cielo' : 'la superficie'} de Hyrule con las semillas kolog`"
          :aspect="6 / 5"
          height="auto"
          :pin-scales="narrow ? [0.34, 0.3, 0.28, 0.26, 0.24] : [0.6, 0.5, 0.42, 0.36, 0.3]"
          :reset-key="layer"
        >
          <svg class="sd-lines" viewBox="0 0 12000 10000" preserveAspectRatio="none" aria-hidden="true">
            <line
              v-for="k in friendRows"
              :key="'l' + k.id"
              :x1="k.x + 6000"
              :y1="5000 - k.y"
              :x2="k.friend.x + 6000"
              :y2="5000 - k.friend.y"
              vector-effect="non-scaling-stroke"
            />
          </svg>
          <span
            v-for="k in friendRows"
            :key="'f' + k.id"
            class="pz-pin sd-fr"
            :style="pct(k.friend.x, k.friend.y)"
            aria-hidden="true"
          />
          <button
            v-for="k in rows"
            :key="k.id"
            type="button"
            tabindex="-1"
            class="pz-pin sd-pin"
            :class="{ duo: k.seeds === 2, sel: k.id === selId, done: progress.isDone(k.id) }"
            :style="pct(k.x, k.y)"
            :title="`${k.seeds === 2 ? 'Kolog con amigo (2 semillas)' : 'Semilla kolog'} · x ${k.x} · y ${k.y}`"
            @click="select(k, false)"
          />

          <template #overlay>
            <span class="sd-tag">{{ layer === "cielo" ? "Cielo" : "Superficie" }}</span>
            <div class="sd-leg">
              <span><i class="lg one" /> Semilla kolog (1)</span>
              <span><i class="lg two" /> Kolog con amigo (2)</span>
              <span><i class="lg fr" /> Destino del amigo</span>
            </div>
          </template>
        </PanZoomMap>
      </div>

      <aside class="sd-side">
        <div v-if="sel" class="sd-sel" aria-live="polite">
          <span class="sd-kick">{{ sel.seeds === 2 ? "Kolog con amigo · 2 semillas" : "Semilla kolog · 1 semilla" }}</span>
          <h2 class="sd-t">Kolog n.º {{ sel.n }}</h2>
          <p class="sd-m">{{ LAYER_LABEL[sel.layer] }} · zona {{ sel.zone.toLowerCase() }}<template v-if="progress.isDone(sel.id)"> · <b class="sd-ok">Completado</b></template></p>
          <div class="sd-coords">
            <span><b>{{ sel.x }}</b>x</span>
            <span><b>{{ sel.y }}</b>y</span>
          </div>
          <p v-if="sel.friend" class="sd-fr-txt">
            Llévalo hasta su amigo en <b>x {{ sel.friend.x }} · y {{ sel.friend.y }}</b>
            (unos {{ dist(sel) }} m en línea recta).
          </p>
          <div class="sd-acts">
            <RouterLink class="sd-btn" :to="mapLink(sel)"><GuideIcon name="pin" :size="15" /> Ver en el mapa</RouterLink>
            <a class="sd-btn ghost" :href="terrainUrl(sel)" target="_blank" rel="noopener noreferrer" title="Mapa con terreno (externo)">
              <GuideIcon name="externo" :size="15" /> Terreno
            </a>
          </div>
        </div>
        <div v-else class="sd-hint">
          Toca una semilla en el mapa o en la lista para ver sus coordenadas. Arrastra para moverte y usa los botones o el
          doble clic para acercar.
        </div>

        <div class="sd-box">
          <h2 class="sd-bt">Semillas por zona</h2>
          <ul class="sd-bars">
            <li v-for="z in zoneStats" :key="z.zone">
              <button type="button" :class="{ on: zone === z.zone, off: !z.count }" :aria-pressed="zone === z.zone" @click="zone = zone === z.zone ? 'todas' : z.zone">
                <span class="nm">{{ z.zone }}</span>
                <span class="bar"><i :style="{ width: (z.count / zoneMax) * 100 + '%' }" /></span>
                <b>{{ z.count }}</b>
              </button>
            </li>
          </ul>
          <button v-if="zone !== 'todas'" type="button" class="sd-all" @click="zone = 'todas'">Ver todas las zonas</button>
        </div>
      </aside>
    </div>

    <!-- Lista -->
    <section class="sd-list" aria-labelledby="sd-list-h">
      <h2 id="sd-list-h" class="sd-lh">Lista de kologs <small>{{ rows.length }}</small></h2>
      <GuideNote v-if="!rows.length" empty>
        No hay kologs con esos filtros. Prueba con otra zona o coordenada.
      </GuideNote>
      <ul v-else class="sd-grid">
        <li v-for="k in visible" :key="k.id">
          <button type="button" class="sd-row" :class="{ on: k.id === selId, done: progress.isDone(k.id) }" @click="select(k, true)">
            <i class="sd-ri" :class="{ duo: k.seeds === 2 }" aria-hidden="true" />
            <span class="sd-rn">
              <b>Kolog n.º {{ k.n }}</b>
              <small>{{ k.zone }}<template v-if="k.seeds === 2"> · con amigo</template></small>
            </span>
            <span class="sd-rc">x {{ k.x }}<br>y {{ k.y }}</span>
          </button>
        </li>
      </ul>
      <button v-if="visible.length < rows.length" type="button" class="sd-more" @click="limit += PAGE">
        Mostrar más ({{ rows.length - visible.length }} restantes)
      </button>
    </section>

    <GuideNote>
      Se muestran {{ fmt(STATS.seeds) }} de las 1.000 semillas del juego ({{ STATS.koroks }} kologs). Faltan por cargar
      unas {{ 1000 - STATS.seeds }} (sobre todo del cielo y del final de la superficie). Los kologs con amigo dan 2
      semillas: lleva al kolog hasta el círculo vacío. Coordenadas del mapa del juego (x: oeste a este, y: sur a norte);
      la zona es aproximada.
    </GuideNote>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onBeforeUnmount } from "vue";
import PanZoomMap from "@/components/maps/PanZoomMap.vue";
import GuideToolbar from "./GuideToolbar.vue";
import GuideSearch from "./GuideSearch.vue";
import GuideSeg from "./GuideSeg.vue";
import GuideNote from "./GuideNote.vue";
import GuideIcon from "./GuideIcon.vue";
import { KOROKS, STATS, ZONES, matches, mapLink, terrainUrl, toPct, fmt } from "./guides.js";
import { useGuideProgress } from "./useGuideProgress.js";

const progress = useGuideProgress();
const LAYER_LABEL = { superficie: "Superficie", cielo: "Cielo" };
const PAGE = 60;

const q = ref("");
const layer = ref("superficie");
const tipo = ref("todos");
const zone = ref("todas");
const estado = ref("todos");
const selId = ref(null);
const limit = ref(PAGE);
const map = ref(null);

// En pantallas estrechas los pines se dibujan más pequeños (hay 740 en la superficie).
const mq = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(max-width: 640px)") : null;
const narrow = ref(!!mq?.matches);
const onMq = (e) => (narrow.value = e.matches);
mq?.addEventListener?.("change", onMq);
onBeforeUnmount(() => mq?.removeEventListener?.("change", onMq));

const inTipo = (k) => tipo.value === "todos" || (tipo.value === "amigo") === (k.seeds === 2);
const inEstado = (k) => estado.value === "todos" || (estado.value === "hechos") === progress.isDone(k.id);
const inQuery = (k) => matches(q.value, `kolog ${k.n}`, k.zone, LAYER_LABEL[k.layer], k.x, k.y, k.seeds === 2 ? "amigo con amigo" : "");

const inLayer = computed(() => KOROKS.filter((k) => k.layer === layer.value));
const base = computed(() => inLayer.value.filter((k) => inTipo(k) && inEstado(k) && inQuery(k)));
const rows = computed(() => base.value.filter((k) => zone.value === "todas" || k.zone === zone.value));
const friendRows = computed(() => rows.value.filter((k) => k.friend));
const visible = computed(() => rows.value.slice(0, limit.value));
const seedsShown = computed(() => rows.value.reduce((s, k) => s + k.seeds, 0));

const zoneStats = computed(() =>
  ZONES.map((z) => ({ zone: z, count: base.value.filter((k) => k.zone === z).reduce((s, k) => s + k.seeds, 0) })),
);
const zoneMax = computed(() => Math.max(1, ...zoneStats.value.map((z) => z.count)));

const sel = computed(() => KOROKS.find((k) => k.id === selId.value) || null);

const layerOpts = computed(() =>
  ["superficie", "cielo"].map((l) => ({
    value: l,
    label: LAYER_LABEL[l],
    count: KOROKS.filter((k) => k.layer === l).reduce((s, k) => s + k.seeds, 0),
    dot: l === "cielo" ? "#E9CF7E" : "#B5E86E",
  })),
);
const tipoOpts = computed(() => {
  const f = inLayer.value.filter((k) => inEstado(k) && inQuery(k));
  const duo = f.filter((k) => k.seeds === 2).length;
  return [
    { value: "todos", label: "Todos", count: f.length },
    { value: "solo", label: "1 semilla", count: f.length - duo },
    { value: "amigo", label: "Con amigo", count: duo },
  ];
});
const estadoOpts = computed(() => {
  const f = inLayer.value.filter((k) => inTipo(k) && inQuery(k));
  const hechos = f.filter((k) => progress.isDone(k.id)).length;
  return [
    { value: "todos", label: "Todos", count: f.length },
    { value: "pendientes", label: "Pendientes", count: f.length - hechos },
    { value: "hechos", label: "Hechos", count: hechos },
  ];
});

const filtered = computed(() => !!q.value.trim() || tipo.value !== "todos" || zone.value !== "todas" || estado.value !== "todos");
function reset() {
  q.value = "";
  tipo.value = "todos";
  zone.value = "todas";
  estado.value = "todos";
}

// Al cambiar filtros se vuelve a la primera página de la lista.
watch([q, layer, tipo, zone, estado], () => {
  limit.value = PAGE;
});
// Al cambiar de capa se quita la selección (es de la otra capa).
watch(layer, () => {
  selId.value = null;
});

const pct = (x, y) => {
  const p = toPct(x, y);
  return { left: p.left + "%", top: p.top + "%" };
};
const dist = (k) => Math.round(Math.hypot(k.friend.x - k.x, k.friend.y - k.y));

async function select(k, fromList) {
  selId.value = k.id;
  const p = toPct(k.x, k.y);
  map.value?.focus(p.left, p.top, 3);
  if (fromList) {
    await nextTick();
    map.value?.$el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  }
}
</script>

<style scoped>
.sd-lay {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;
}
.sd-mapcard {
  border-radius: 22px;
  border: 1px solid rgba(127, 235, 203, 0.14);
  overflow: hidden;
  background: #081412;
}
.sd-vp {
  width: 100%;
  aspect-ratio: 6 / 5;
  background: radial-gradient(circle at 50% 50%, #0b1f1b, #050c0b 75%);
  --pz-line: rgba(127, 235, 203, 0.2);
  --pz-btn: rgba(8, 20, 18, 0.88);
  --pz-btn-hover: rgba(79, 224, 182, 0.18);
}
.sd-vp :deep(.pz-in) {
  width: 100%;
  height: auto;
}
.sd-vp :deep(.pz-img) {
  filter: saturate(0.9) brightness(0.85);
  border-radius: 6px;
}
.sd-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.sd-lines line {
  stroke: #f1e7c8;
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
  opacity: 0.75;
}
.sd-pin {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border-radius: 50%;
  border: 1.5px solid #04130f;
  background: #b5e86e;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  z-index: 1;
}
.sd-pin::after {
  content: "";
  width: 62%;
  height: 62%;
  background: #04211a;
  -webkit-mask: url(/images/zelda/iconos/semilla.svg) center/contain no-repeat;
  mask: url(/images/zelda/iconos/semilla.svg) center/contain no-repeat;
}
.sd-pin.duo {
  width: 18px;
  height: 18px;
  background: #f1e7c8;
  z-index: 2;
}
.sd-pin.done {
  background: #f1e7c8;
  opacity: 0.7;
}
.sd-pin.done::after {
  -webkit-mask-image: url(/images/zelda/iconos/hecho.svg);
  mask-image: url(/images/zelda/iconos/hecho.svg);
}
.sd-pin:hover {
  filter: brightness(1.15);
  z-index: 6;
}
.sd-pin.sel {
  z-index: 7;
  border-color: #f1e7c8;
  animation: sd-pulse 1.6s infinite;
}
@keyframes sd-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 224, 182, 0.7);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(79, 224, 182, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 224, 182, 0);
  }
}
.sd-fr {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px dashed #f1e7c8;
  background: rgba(5, 12, 11, 0.5);
  pointer-events: none;
}
.sd-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  background: rgba(8, 20, 18, 0.88);
  border: 1px solid rgba(127, 235, 203, 0.2);
  font-family: var(--font-zelda);
  font-size: 13px;
  font-weight: 700;
  pointer-events: none;
}
.sd-leg {
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 5;
  display: flex;
  gap: 8px 14px;
  flex-wrap: wrap;
  padding: 9px 12px;
  border-radius: 11px;
  background: rgba(8, 20, 18, 0.88);
  border: 1px solid rgba(127, 235, 203, 0.16);
  font-size: 12px;
  color: #c3d3cd;
  pointer-events: none;
}
.sd-leg span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.lg {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #04130f;
}
.lg.one {
  background: #b5e86e;
}
.lg.two {
  background: #f1e7c8;
}
.lg.fr {
  border: 2px dashed #f1e7c8;
  background: transparent;
}

/* ---------- panel lateral ---------- */
.sd-side {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sd-sel {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(79, 224, 182, 0.12), rgba(79, 224, 182, 0.03));
  border: 1px solid rgba(79, 224, 182, 0.35);
  animation: sd-pop 0.25s ease-out;
}
@keyframes sd-pop {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.sd-kick {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7febcb;
}
.sd-t {
  margin: 4px 0 0;
  font-family: var(--font-zelda);
  font-size: 20px;
  font-weight: 700;
}
.sd-m {
  margin: 2px 0 0;
  font-size: 12.5px;
  color: #a9bdb6;
}
.sd-ok {
  color: #f1e7c8;
}
.sd-coords {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 12px;
}
.sd-coords span {
  padding: 8px;
  border-radius: 9px;
  background: rgba(5, 12, 11, 0.6);
  text-align: center;
  font-size: 11px;
  color: #93aaa3;
}
.sd-coords b {
  display: block;
  font-size: 16px;
  color: #e6eeea;
}
.sd-fr-txt {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed rgba(241, 231, 200, 0.35);
  font-size: 13px;
  color: #c3d3cd;
}
.sd-fr-txt b {
  color: #f1e7c8;
  white-space: nowrap;
}
.sd-acts {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.sd-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(180deg, #5de8c1, #2fbf97);
  color: #04211a;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
}
.sd-btn:hover {
  color: #04211a;
  filter: brightness(1.06);
}
.sd-btn.ghost {
  flex: 0 0 auto;
  padding: 0 12px;
  background: transparent;
  border: 1px solid rgba(127, 235, 203, 0.2);
  color: #a4b9b2;
  font-weight: 600;
}
.sd-btn.ghost:hover {
  color: #e6eeea;
  background: rgba(127, 235, 203, 0.06);
}
.sd-hint {
  padding: 16px;
  border-radius: 16px;
  border: 1px dashed rgba(127, 235, 203, 0.2);
  font-size: 13.5px;
  color: #a9bdb6;
}
.sd-box {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #0a1a17, #081412);
  border: 1px solid rgba(127, 235, 203, 0.12);
}
.sd-bt {
  margin: 0 0 10px;
  font-family: var(--font-zelda);
  font-size: 16px;
  font-weight: 700;
}
.sd-bars {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sd-bars button {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr) 34px;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 6px 8px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #c3d3cd;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.sd-bars button:hover {
  background: rgba(127, 235, 203, 0.06);
}
.sd-bars button.on {
  background: rgba(79, 224, 182, 0.14);
  color: #7febcb;
}
.sd-bars button.off {
  opacity: 0.45;
}
.sd-bars .bar {
  height: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}
.sd-bars .bar i {
  display: block;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #8dcb45, #d4f59a);
  transition: width 0.5s var(--ease-out);
}
.sd-bars b {
  text-align: right;
  color: #f1e7c8;
  font-variant-numeric: tabular-nums;
}
.sd-all {
  width: 100%;
  height: 34px;
  margin-top: 8px;
  border-radius: 9px;
  border: 1px solid rgba(127, 235, 203, 0.14);
  background: transparent;
  color: #a4b9b2;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.sd-all:hover {
  color: #e6eeea;
}

/* ---------- lista ---------- */
.sd-list {
  margin-top: 30px;
}
.sd-lh {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 14px;
  font-family: var(--font-zelda);
  font-size: 22px;
  font-weight: 700;
}
.sd-lh small {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: #93aaa3;
}
.sd-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
  gap: 8px;
}
.sd-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 13px;
  border: 1px solid rgba(127, 235, 203, 0.1);
  background: rgba(127, 235, 203, 0.03);
  color: #e6eeea;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.sd-row:hover {
  background: rgba(127, 235, 203, 0.07);
}
.sd-row.on {
  border-color: rgba(79, 224, 182, 0.5);
  background: rgba(79, 224, 182, 0.1);
}
.sd-row:focus-visible,
.sd-bars button:focus-visible,
.sd-more:focus-visible,
.sd-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.sd-ri {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #04130f;
  background: #b5e86e;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.sd-ri::after {
  content: "";
  width: 62%;
  height: 62%;
  background: #04211a;
  -webkit-mask: url(/images/zelda/iconos/semilla.svg) center/contain no-repeat;
  mask: url(/images/zelda/iconos/semilla.svg) center/contain no-repeat;
}
.sd-ri.duo {
  background: #f1e7c8;
}
.sd-row.done .sd-ri::after {
  -webkit-mask-image: url(/images/zelda/iconos/hecho.svg);
  mask-image: url(/images/zelda/iconos/hecho.svg);
}
.sd-rn {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.sd-rn b {
  font-size: 13.5px;
  font-weight: 600;
}
.sd-rn small {
  font-size: 12px;
  color: #93aaa3;
}
.sd-rc {
  font-size: 11.5px;
  line-height: 1.35;
  color: #a9bdb6;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.sd-more {
  display: block;
  margin: 16px auto 0;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  border: 1px solid rgba(216, 194, 122, 0.45);
  background: transparent;
  color: #e9dcaf;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.sd-more:hover {
  background: rgba(216, 194, 122, 0.08);
}

@media (max-width: 1080px) {
  .sd-lay {
    grid-template-columns: minmax(0, 1fr) 280px;
  }
}
@media (max-width: 860px) {
  .sd-lay {
    grid-template-columns: 1fr;
  }
  .sd-side {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
  .sd-leg {
    display: none;
  }
}
@media (max-width: 640px) {
  .sd-side {
    grid-template-columns: 1fr;
  }
  .sd-mapcard {
    border-radius: 16px;
  }
}
</style>
