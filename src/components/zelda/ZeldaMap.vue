<template>
  <!-- Mapa interactivo del hub de Zelda (#mapa). Diseño: sección «MAPA» de
       models/paginas/Zelda.dc.html. El visor (arrastre y zoom) es el común
       components/maps/PanZoomMap.vue; aquí van los puntos, filtros y progreso. -->
  <section id="mapa" class="zh-sec">
    <div class="wrap">
      <div class="zh-sec-h">
        <div>
          <span class="zh-kick">Mapas</span>
          <h2 class="zh-h2">Mapa interactivo</h2>
          <p>Elige capa, filtra lo que quieres ver y toca un santuario para ver su ficha y marcarlo como completado.</p>
        </div>
        <div class="layers" role="tablist" aria-label="Capa del mapa">
          <button type="button" class="ly" :class="{ on: layer === 'surf' }" role="tab" :aria-selected="layer === 'surf' ? 'true' : 'false'" @click="setLayer('surf')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20l6-10 4 6 3-4 5 8z" /><circle cx="17" cy="6" r="2" /></svg>
            Superficie
          </button>
          <button type="button" class="ly" :class="{ on: layer === 'sky' }" role="tab" :aria-selected="layer === 'sky' ? 'true' : 'false'" @click="setLayer('sky')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 9a4.5 4.5 0 0 1 .5 9z" /></svg>
            Cielo
          </button>
          <button type="button" class="ly off" role="tab" aria-selected="false" aria-disabled="true" title="Próximamente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h18" /><path d="M12 11v9" /><path d="M8 16l4 4 4-4" /></svg>
            Subsuelo <small>Pronto</small>
          </button>
        </div>
      </div>

      <div class="mapcard">
        <MapSidebar
          v-model:query="query"
          v-model:cats="cats"
          v-model:status="status"
          :results="results"
          :counts="counts"
          :state-counts="stateCounts"
          :progress="progressRows"
          :storage="storage"
          :selection="selection"
          @pick="pickFromSearch"
          @toggle-done="selected && toggle(selected.key)"
        />

        <PanZoomMap
          ref="map"
          class="vp"
          :class="layer"
          :src="LAYER_IMG[layer]"
          :src-hd="LAYER_IMG_HD[layer]"
          :alt="`Mapa de ${LAYER_NAME[layer]} de Tears of the Kingdom`"
          :aspect="6 / 5"
          :levels="LEVELS"
          height=""
          :reset-key="layer"
          @update:level="level = $event"
        >
          <span v-for="p in view.fr" :key="`fr-${p.key}`" class="zpin-fr" :style="{ left: `${p.fx}%`, top: `${p.fy}%` }"></span>
          <MapPin
            v-for="v in view.pins"
            :id="v.p.key"
            :key="v.p.key"
            :kind="v.p.kind"
            :x="v.p.x"
            :y="v.p.y"
            :label="v.p.label"
            :sub="v.p.sub"
            :status="v.done ? CAT[v.p.cat].ok : CAT[v.p.cat].todo"
            :sky="v.p.layer === 'sky'"
            :done="v.done"
            :selected="v.p.key === sel"
            :tabindex="v.p.cat === 'sd' ? -1 : undefined"
            @pick="select"
          />

          <template #overlay>
            <span class="vtag">{{ LAYER_NAME[layer] }}</span>
            <MapLegend data-no-pan />
            <span class="coordtag">Zoom ×{{ String(LEVELS[level]).replace(".", ",") }}</span>
          </template>
        </PanZoomMap>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import PanZoomMap from "@/components/maps/PanZoomMap.vue";
import MapPin from "./MapPin.vue";
import MapLegend from "./MapLegend.vue";
import MapSidebar from "./MapSidebar.vue";
import { mapLayer } from "./mapLayer";
import { toPct } from "@/data/zelda-map";
import { useZeldaProgress } from "@/composables/useZeldaProgress";
import { CAT, CATS, LAYER_NAME, POINTS, TOTALS, byKey, fmt, layerCount, searchPoints, seedWeight, zone } from "./mapPoints";

const LEVELS = [1, 1.6, 2.4, 3.4, 4.6];
// Versión media (2000 px, ~360 KB) para ver el mapa entero; la HD (6000 px,
// ~2 MB) solo se descarga al acercar (PanZoomMap → srcHd).
const LAYER_IMG = {
  surf: "/images/zelda/mapas/superficie-md.jpg",
  sky: "/images/zelda/mapas/cielo-md.jpg",
};
const LAYER_IMG_HD = {
  surf: "/images/zelda/mapas/superficie-hd.webp",
  sky: "/images/zelda/mapas/cielo-hd.webp",
};
// Orden de pintado: semillas debajo; luego cuevas, torres y santuarios encima.
const DRAW_ORDER = ["sd", "cv", "tw", "sh"];

const { done, toggle, storage } = useZeldaProgress();

const map = ref(null);
const level = ref(0);
const layer = mapLayer; // compartida con el mega-menú «Mapas» de la barra de Zelda
const cats = ref({ sh: true, tw: true, cv: true, sd: true });
const status = ref("all"); // all · todo · done
const query = ref("");
const sel = ref(null); // clave del punto elegido
const setLayer = (l) => (layer.value = l);

// Puntos visibles en la capa actual (con los filtros) y recuentos de «Estado».
const view = computed(() => {
  const L = layer.value;
  const st = status.value;
  const pins = [];
  const fr = [];
  let all = 0;
  let nDone = 0;
  for (const c of DRAW_ORDER) {
    if (!cats.value[c]) continue;
    for (const p of POINTS[c][L]) {
      const d = !!done[p.key];
      all++;
      if (d) nDone++;
      if ((st === "done" && !d) || (st === "todo" && d)) continue;
      pins.push({ p, done: d });
      if (p.two) fr.push(p);
    }
  }
  return { pins, fr, all, done: nDone };
});

const stateCounts = computed(() => ({ all: view.value.all, todo: view.value.all - view.value.done, done: view.value.done }));
const counts = computed(() => Object.fromEntries(CATS.map((c) => [c, layerCount(c, layer.value)])));
const results = computed(() => searchPoints(query.value));

const progressRows = computed(() => {
  let sh = 0;
  let tw = 0;
  let sd = 0;
  for (const k of Object.keys(done)) {
    const p = byKey.get(k);
    if (!p) continue;
    if (p.cat === "sh") sh++;
    else if (p.cat === "tw") tw++;
    else if (p.cat === "sd") sd += seedWeight(p);
  }
  return [
    { id: "sh", label: "Santuarios completados", done: sh, total: TOTALS.sh },
    { id: "tw", label: "Torres activadas", done: tw, total: TOTALS.tw },
    { id: "sd", label: "Semillas recogidas", done: sd, total: TOTALS.sd },
  ];
});

// Ficha del punto elegido.
const selected = computed(() => (sel.value ? byKey.get(sel.value) || null : null));
const selection = computed(() => {
  const p = selected.value;
  if (!p) return null;
  const isDone = !!done[p.key];
  const extra = (p.entrances > 1 ? ` · ${p.entrances} entradas` : "") + (p.two ? " · con amigo" : "");
  return {
    key: p.key,
    title: p.name || p.label,
    meta: `${CAT[p.cat].n}${extra} · ${LAYER_NAME[p.layer]} · zona ${zone(p.gx, p.gy)}`,
    x: fmt(p.gx),
    y: fmt(p.gy),
    alt: p.alt === null ? "—" : fmt(p.alt),
    done: isDone,
    doneText: isDone ? CAT[p.cat].done : CAT[p.cat].mark,
  };
});

// Elegir un punto: cambia de capa si hace falta y centra el mapa en él.
async function select(key) {
  const p = byKey.get(key);
  if (!p) return;
  sel.value = key;
  if (layer.value !== p.layer) {
    layer.value = p.layer;
    await nextTick(); // el visor vuelve al mapa completo al cambiar de capa
  }
  map.value?.focus(p.x, p.y, Math.max(level.value, 2));
}

// Desde el buscador. En móvil el mapa queda encima del panel: se sube hasta él.
function pickFromSearch(key) {
  select(key);
  if (window.matchMedia?.("(max-width: 860px)").matches) {
    document.getElementById("mapa")?.querySelector(".vp")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Abre un punto que llega desde fuera (botones «Ver en el mapa» de las guías:
// /zelda?capa=…&punto=<clave>&x=<x>&y=<y>#mapa). Si la clave no existe,
// centra el mapa en las coordenadas del juego (x, y).
function openPoint({ key, x, y } = {}) {
  if (key && byKey.has(key)) return select(key);
  const gx = Number(x);
  const gy = Number(y);
  if (x === undefined || y === undefined || !Number.isFinite(gx) || !Number.isFinite(gy)) return;
  sel.value = null;
  const p = toPct(gx, gy);
  map.value?.focus(p.x, p.y, Math.max(level.value, 2));
}

defineExpose({ select, openPoint });
</script>

<style scoped>
.layers {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: #0A1816;
  border: 1px solid rgba(127, 235, 203, 0.12);
}
.ly {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 11px;
  border: 0;
  background: transparent;
  color: #A4B9B2;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.ly:hover {
  color: #E6EEEA;
  background: rgba(127, 235, 203, 0.05);
}
.ly.on {
  background: rgba(79, 224, 182, 0.15);
  color: #7FEBCB;
  box-shadow: inset 0 0 0 1px rgba(79, 224, 182, 0.4);
}
.ly.off {
  opacity: 0.5;
  cursor: not-allowed;
}
.ly.off:hover {
  background: transparent;
  color: #A4B9B2;
}
.ly:focus-visible {
  outline: 2px solid #4FE0B6;
  outline-offset: 2px;
}
.ly small {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(242, 195, 107, 0.12);
  color: #F2C36B;
}

/* Tarjeta: panel a la izquierda y visor a la derecha. El visor mide como
   mucho 720 px de alto y, si es más estrecho, baja para que el mapa (6:5)
   quepa entero sin deformarse. */
.mapcard {
  display: flex;
  border-radius: 22px;
  background: #081412;
  border: 1px solid rgba(127, 235, 203, 0.14);
  overflow: hidden;
  container-type: inline-size;
}
.mapcard > :deep(.side) {
  flex: 0 0 300px;
}
.mapcard {
  --map-h: 720px;
  --map-h: min(720px, calc((100cqw - 300px) / 1.2));
}
/* Si el panel es más alto que el mapa (p. ej. con la ficha abierta), el
   visor se estira y el mapa (que PanZoomMap encaja sin deformarlo) queda
   centrado sobre la cuadrícula. */
.vp {
  flex: 1 1 auto;
  min-height: var(--map-h);
  background: radial-gradient(circle at 50% 50%, #0B1F1B, #050C0B 75%);
  --pz-line: rgba(127, 235, 203, 0.2);
  --pz-btn: rgba(8, 20, 18, 0.88);
  --pz-btn-hover: rgba(79, 224, 182, 0.18);
}
.vp::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(127, 235, 203, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(127, 235, 203, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
.vp :deep(.pz-zoom button) {
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.vp :deep(.pz-img) {
  filter: saturate(0.9) brightness(0.9);
  border-radius: 6px;
}
.vp.sky :deep(.pz-img) {
  filter: saturate(0.8) brightness(1);
}

.vtag {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  background: rgba(8, 20, 18, 0.88);
  border: 1px solid rgba(127, 235, 203, 0.2);
  font-family: var(--font-zelda);
  font-size: 13px;
  font-weight: 700;
  color: #E6EEEA;
  pointer-events: none;
}
.coordtag {
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 5;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(8, 20, 18, 0.88);
  border: 1px solid rgba(127, 235, 203, 0.16);
  font-size: 12px;
  color: #C3D3CD;
  pointer-events: none;
}

@media (max-width: 860px) {
  .mapcard {
    flex-direction: column;
  }
  .mapcard > :deep(.side) {
    flex: none;
  }
  .vp {
    order: -1;
    width: 100%;
    min-height: 0;
    height: auto;
    aspect-ratio: 6 / 5;
    place-items: stretch;
  }
  .coordtag {
    display: none;
  }
}
/* Las tres capas en una fila a lo ancho. */
@media (max-width: 560px) {
  .zh-sec-h > .layers {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
  }
  .ly {
    flex: 1 1 auto;
    justify-content: center;
    gap: 6px;
    padding: 0 8px;
    font-size: 13.5px;
  }
  .ly svg {
    display: none;
  }
  .vp :deep(.pz-zoom) {
    top: 10px;
    right: 10px;
  }
  .vp :deep(.pz-zoom button) {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }
  .vtag {
    top: 10px;
    left: 10px;
    height: 30px;
    font-size: 12px;
  }
}
</style>
