<template>
  <div
    ref="vp"
    class="pz-vp"
    :class="{ dragging }"
    :style="{ height }"
    tabindex="0"
    role="application"
    :aria-busy="imageStatus === 'loading'"
    :aria-label="`${alt || 'Mapa'}. Flechas para moverte, + y − o Ctrl y rueda para cambiar el zoom, 0 para ver el mapa completo.`"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
    @lostpointercapture="onUp"
    @dblclick="onDbl"
    @wheel="onWheel"
    @keydown="onKey"
  >
    <div v-show="imageStatus === 'ready'" class="pz-zoom">
      <button type="button" aria-label="Acercar" :disabled="zi >= levels.length - 1" @click="zoomIn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
      <button type="button" aria-label="Alejar" :disabled="zi <= 0" @click="zoomOut">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
      <button type="button" aria-label="Ver el mapa completo" @click="reset">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5" /><path d="M20 9V4h-5" /><path d="M4 15v5h5" /><path d="M20 15v5h-5" /></svg>
      </button>
    </div>

    <div
      ref="layer"
      class="pz-in"
      :class="[`zl${zi}`, { drag: dragging }]"
      :style="{ aspectRatio: aspect, '--pz-ar': aspect, transform, '--pz-s': pinScale }"
    >
      <img
        v-if="src"
        :key="src + ':' + imageAttempt"
        class="pz-img"
        :src="src"
        :alt="alt"
        draggable="false"
        fetchpriority="high"
        decoding="async"
        @load="imageStatus = 'ready'"
        @error="imageStatus = 'error'"
      >
      <slot v-if="imageStatus === 'ready'" :level="zi" :zoom="zoom" />
    </div>

    <slot v-if="imageStatus === 'ready'" name="overlay" :level="zi" :zoom="zoom" />
    <div v-else class="pz-status" data-no-pan>
      <p role="status">{{ imageStatus === 'loading' ? 'Cargando imagen del mapa…' : 'No se pudo cargar la imagen del mapa.' }}</p>
      <button v-if="src && imageStatus === 'error'" type="button" @click="retryImage">Reintentar</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  // Ancho / alto de la imagen del mapa (6/5 en Zelda, 1 en los mapas de ARC).
  aspect: { type: Number, default: 1 },
  // Niveles de zoom; el primero es el mapa completo.
  levels: { type: Array, default: () => [1, 1.6, 2.4, 3.4, 4.6] },
  // Alto del visor (CSS).
  height: { type: String, default: "720px" },
  // Tamaño de los marcadores en cada nivel (si no se da, 1 / zoom^0.75).
  pinScales: { type: Array, default: null },
  // Al cambiar esta clave (p. ej. la capa o el mapa) se vuelve al mapa completo.
  resetKey: { type: [String, Number], default: "" },
});

const emit = defineEmits(["update:level"]);

const vp = ref(null);
const layer = ref(null);
const imageStatus = ref(props.src ? "loading" : "error");
const imageAttempt = ref(0);
watch(() => props.src, (src) => { imageStatus.value = src ? "loading" : "error"; });

function retryImage() {
  imageStatus.value = "loading";
  imageAttempt.value++;
}
const zi = ref(0);
const px = ref(0); // arrastre en px
const py = ref(0);
const focusPt = ref(null); // { x, y } en % de la imagen, para centrar
const dragging = ref(false);
let drag = null;
let moved = false;
let raf = 0;

const zoom = computed(() => props.levels[zi.value] ?? 1);
const pinScale = computed(() => props.pinScales?.[zi.value] ?? (1 / Math.pow(zoom.value, 0.75)).toFixed(3));

// Centrar en un punto: se desplaza el lienzo para que (x, y) quede en el centro.
const transform = computed(() => transformAt(px.value, py.value));
function transformAt(x, y) {
  const f = focusPt.value;
  const tx = f && zi.value > 0 ? `${(-zoom.value * (f.x - 50)).toFixed(2)}%` : "0%";
  const ty = f && zi.value > 0 ? `${(-zoom.value * (f.y - 50)).toFixed(2)}%` : "0%";
  return `translate(${tx}, ${ty}) translate(${x}px, ${y}px) scale(${zoom.value})`;
}

watch(() => props.resetKey, () => reset());

function zoomIn() {
  zi.value = Math.min(props.levels.length - 1, zi.value + 1);
}
function zoomOut() {
  zi.value = Math.max(0, zi.value - 1);
  if (zi.value === 0) {
    px.value = 0;
    py.value = 0;
  }
}
function reset() {
  finishDrag();
  zi.value = 0;
  px.value = 0;
  py.value = 0;
  focusPt.value = null;
}
// Centra el mapa en (x, y) — en % de la imagen — con el nivel indicado.
function focus(x, y, level = Math.max(zi.value, 2)) {
  finishDrag();
  focusPt.value = { x, y };
  px.value = 0;
  py.value = 0;
  zi.value = Math.min(props.levels.length - 1, Math.max(0, level));
}

// No se arrastra al pulsar marcadores, botones ni nada interactivo.
const onTarget = (e) => e.target?.closest?.(".pz-pin, .pz-zoom, button, a, input, [data-no-pan]");

// El arrastre no puede sacar el mapa de la vista: como mucho medio lienzo
// (ya ampliado) hacia cada lado.
function clampPan(x, y, r = vp.value?.getBoundingClientRect()) {
  if (!r) return [x, y];
  const mx = (r.width * zoom.value) / 2;
  const my = (r.height * zoom.value) / 2;
  return [Math.max(-mx, Math.min(mx, x)), Math.max(-my, Math.min(my, y))];
}

// La captura del puntero puede fallar (puntero ya liberado): no es grave.
function capture(id, on) {
  try {
    if (on) vp.value?.setPointerCapture?.(id);
    else vp.value?.releasePointerCapture?.(id);
  } catch {
    /* sin captura */
  }
}

// Punteros activos (para pellizcar con dos dedos).
const pointers = new Map();
let pinch = null;
const dist = () => {
  const [a, b] = [...pointers.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
};

function onDown(e) {
  if ((e.button !== undefined && e.button !== 0) || onTarget(e)) return;
  if (pointers.size >= 2) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  capture(e.pointerId, true);
  if (pointers.size === 2) {
    // Segundo dedo: se deja de arrastrar y se empieza a pellizcar.
    finishDrag();
    dragging.value = true;
    pinch = { base: dist() };
    return;
  }
  const bounds = vp.value.getBoundingClientRect();
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, px: px.value, py: py.value, bounds };
  moved = false;
  dragging.value = true;
}
function onMove(e) {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size === 2) {
    // Pellizco por niveles: al separar o juntar los dedos un 25 % se cambia de nivel.
    const ratio = dist() / pinch.base;
    if (ratio > 1.25) {
      zoomIn();
      pinch.base = dist();
    } else if (ratio < 0.8) {
      zoomOut();
      pinch.base = dist();
    }
    moved = true;
    return;
  }
  if (drag?.id !== e.pointerId) return;
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
  // Vue conserva el desplazamiento al soltar. El arrastre cambia solo la capa.
  drag.target = clampPan(drag.px + dx, drag.py + dy, drag.bounds);
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    if (drag && layer.value) layer.value.style.transform = transformAt(...drag.target);
  });
}
function finishDrag() {
  cancelAnimationFrame(raf);
  raf = 0;
  if (drag?.target) [px.value, py.value] = drag.target;
  if (layer.value) layer.value.style.transform = transform.value;
  drag = null;
  dragging.value = false;
}
function onUp(e) {
  if (!pointers.delete(e.pointerId)) return;
  capture(e.pointerId, false);
  if (pointers.size < 2) pinch = null;
  if (!drag || drag.id === e.pointerId) finishDrag();
}

let lastWheel = -Infinity;
function onWheel(e) {
  if (!e.ctrlKey || onTarget(e)) return;
  e.preventDefault();
  if (e.timeStamp - lastWheel < 160 || !e.deltaY) return;
  lastWheel = e.timeStamp;
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
}
function onDbl(e) {
  if (onTarget(e) || moved) return;
  zoomIn();
}

// Teclado (con el foco en el visor): flechas para moverse, + y − para el zoom, 0 para verlo entero.
function onKey(e) {
  if (imageStatus.value !== "ready" || e.target !== vp.value || e.altKey || e.ctrlKey || e.metaKey) return;
  const step = 80;
  const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
  if (moves[e.key]) {
    e.preventDefault();
    [px.value, py.value] = clampPan(px.value + moves[e.key][0], py.value + moves[e.key][1]);
  } else if (e.key === "+" || e.key === "=") {
    e.preventDefault();
    zoomIn();
  } else if (e.key === "-" || e.key === "_") {
    e.preventDefault();
    zoomOut();
  } else if (e.key === "0") {
    e.preventDefault();
    reset();
  }
}

onBeforeUnmount(() => cancelAnimationFrame(raf));

defineExpose({ zoomIn, zoomOut, reset, focus, level: zi });
</script>

<style scoped>
.pz-vp {
  position: relative;
  min-width: 0;
  /* "clip" y no "hidden": así el foco de un marcador fuera de la vista no
     puede desplazar el visor por dentro y descuadrar el mapa. */
  overflow: clip;
  display: grid;
  place-items: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  /* El visor es el contenedor de referencia: el mapa se ajusta dentro sin
     deformarse (como object-fit: contain). */
  container-type: size;
}
.pz-status {
  position: absolute;
  z-index: 6;
  inset: 0;
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 10px;
  padding: 16px;
  background: #100e14;
  color: var(--ink);
  text-align: center;
  cursor: default;
  touch-action: pan-y;
}
.pz-status p { margin: 0; }
.pz-status button {
  padding: 8px 14px;
  border: 1px solid var(--accent-hi);
  border-radius: 8px;
  background: #141219;
  color: var(--ink);
  cursor: pointer;
}
.pz-vp.dragging {
  cursor: grabbing;
}
/* El lienzo conserva la proporción de la imagen aunque el visor sea más
   estrecho o más bajo que ella; si no, los puntos en % no coincidirían. */
.pz-in {
  position: relative;
  width: min(100cqw, calc(100cqh * var(--pz-ar, 1)));
  height: auto;
  transition: transform 0.7s var(--ease-out);
}
.pz-in.drag {
  transition: none;
}
.pz-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
/* Marcadores: centrados en su punto y contra-escalados con el zoom. */
.pz-in :slotted(.pz-pin) {
  position: absolute;
  transform: translate(-50%, -50%) scale(var(--pz-s, 1));
  transition: transform 0.7s var(--ease-out);
}
.pz-in.drag :slotted(.pz-pin) {
  transition: none;
}

.pz-zoom {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pz-zoom button {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  border: 1px solid var(--pz-line, rgba(255, 255, 255, 0.16));
  background: var(--pz-btn, rgba(10, 14, 20, 0.88));
  color: var(--ink);
  cursor: pointer;
  transition: background 0.2s;
}
.pz-zoom button:hover:not(:disabled) {
  background: var(--pz-btn-hover, rgba(255, 255, 255, 0.12));
}
.pz-zoom button:disabled {
  opacity: 0.4;
  cursor: default;
}
.pz-zoom button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
/* Foco del visor (teclado): borde por dentro, sin mover nada. */
.pz-vp:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
</style>
