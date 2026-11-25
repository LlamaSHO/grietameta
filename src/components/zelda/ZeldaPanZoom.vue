<template>
  <div
    ref="vp"
    class="pz-vp"
    :style="{ height }"
    tabindex="0"
    role="application"
    :aria-label="`${alt || 'Mapa'}. Flechas para moverte, + y − para acercar o alejar, 0 para verlo completo.`"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
    @lostpointercapture="onUp"
    @dblclick="onDbl"
    @wheel="onWheel"
    @keydown="onKey"
  >
    <div v-if="controls" class="pz-zoom">
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
      ref="canvas"
      class="pz-in"
      :class="`zl${zi}`"
      :style="{ aspectRatio: aspect, '--pz-ar': aspect }"
    >
      <img v-if="src" class="pz-img" :src="currentSrc" :alt="alt" draggable="false" loading="lazy" decoding="async">
      <slot :level="zi" :zoom="zoom" />
    </div>

    <slot name="overlay" :level="zi" :zoom="zoom" />
  </div>
</template>


<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  srcHd: { type: String, default: "" },
  alt: { type: String, required: true },
  aspect: { type: Number, default: 6 / 5 },
  levels: { type: Array, default: () => [1, 1.6, 2.25, 3] },
  height: { type: String, default: "" },
  controls: { type: Boolean, default: true },
  resetKey: { type: [String, Number], default: "" },
});
const emit = defineEmits(["update:level"]);

const vp = ref(null);
const canvas = ref(null);
const zi = ref(0);
const hd = ref(false);
const zoom = computed(() => props.levels[zi.value]);
const currentSrc = computed(() => hd.value && props.srcHd ? props.srcHd : props.src);
let x = 0;
let y = 0;
let scale = 1;
let pendingFrame = 0;
let drag = null;
let pinch = null;
let moved = false;
let wheelDistance = 0;
let lastWheel = 0;
const pointers = new Map();

function paint() {
  pendingFrame = 0;
  if (!canvas.value) return;
  canvas.value.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')';
  canvas.value.style.setProperty("--pz-s", 1 / scale ** 0.85);
}

function schedulePaint() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(paint);
}

function setPan(nextX, nextY) {
  const maxX = (canvas.value?.offsetWidth || 0) * scale / 2;
  const maxY = (canvas.value?.offsetHeight || 0) * scale / 2;
  x = Math.max(-maxX, Math.min(maxX, nextX));
  y = Math.max(-maxY, Math.min(maxY, nextY));
}

function setLevel(level) {
  zi.value = Math.max(0, Math.min(level, props.levels.length - 1));
  scale = zoom.value;
  if (zi.value >= 2) hd.value = true;
  emit("update:level", zi.value);
}

function zoomTo(level) {
  const before = scale;
  setLevel(level);
  if (zi.value === 0) setPan(0, 0);
  else setPan(x * scale / before, y * scale / before);
  schedulePaint();
}

function zoomIn() {
  zoomTo(zi.value + 1);
}
function zoomOut() {
  zoomTo(zi.value - 1);
}
function reset() {
  setLevel(0);
  setPan(0, 0);
  schedulePaint();
}
function focus(left, top, level = Math.max(zi.value, 2)) {
  setLevel(level);
  setPan((50 - left) / 100 * canvas.value.offsetWidth * scale, (50 - top) / 100 * canvas.value.offsetHeight * scale);
  schedulePaint();
}

const interactiveTarget = (event) => event.target.closest("button, a, input, [data-no-pan]");
function distance() {
  const [first, second] = pointers.values();
  return Math.hypot(first.x - second.x, first.y - second.y);
}
function onDown(event) {
  if (event.button !== 0 || interactiveTarget(event) || pointers.size === 2) return;
  const point = { x: event.clientX, y: event.clientY };
  pointers.set(event.pointerId, point);
  vp.value.setPointerCapture(event.pointerId);
  vp.value.classList.add("dragging");
  if (pointers.size === 2) {
    drag = null;
    pinch = { distance: distance(), scale, x, y };
  } else {
    moved = false;
    drag = { ...point, mapX: x, mapY: y };
  }
}
function onMove(event) {
  if (!pointers.has(event.pointerId)) return;
  const point = pointers.get(event.pointerId);
  point.x = event.clientX;
  point.y = event.clientY;
  if (pinch) {
    scale = Math.max(1, Math.min(props.levels.at(-1), pinch.scale * distance() / Math.max(pinch.distance, 1)));
    setPan(pinch.x * scale / pinch.scale, pinch.y * scale / pinch.scale);
    moved = true;
  } else if (drag) {
    const dx = point.x - drag.x;
    const dy = point.y - drag.y;
    if (Math.abs(dx) + Math.abs(dy) < 4 && !moved) return;
    moved = true;
    setPan(drag.mapX + dx, drag.mapY + dy);
  }
  schedulePaint();
}
function onUp(event) {
  if (!pointers.delete(event.pointerId)) return;
  if (pinch) {
    const level = props.levels.reduce((best, value, index) =>
      Math.abs(value - scale) < Math.abs(props.levels[best] - scale) ? index : best, 0);
    zoomTo(level);
    pinch = null;
    const [remaining] = pointers.values();
    drag = remaining && { ...remaining, mapX: x, mapY: y };
  } else {
    drag = null;
  }
  if (!pointers.size) vp.value.classList.remove("dragging");
}
function onDbl(event) {
  if (!interactiveTarget(event) && !moved) zoomIn();
}
function onWheel(event) {
  // La rueda normal sigue desplazando la página. Control y rueda acercan el mapa.
  if (!event.ctrlKey || interactiveTarget(event)) return;
  event.preventDefault();
  if (event.timeStamp - lastWheel > 160) wheelDistance = 0;
  lastWheel = event.timeStamp;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? vp.value.clientHeight : 1;
  wheelDistance += event.deltaY * unit;
  if (Math.abs(wheelDistance) < 48) return;
  zoomTo(zi.value - Math.sign(wheelDistance));
  wheelDistance = 0;
}
function onKey(event) {
  if (event.target !== vp.value || event.altKey || event.ctrlKey || event.metaKey) return;
  const moves = { ArrowLeft: [80, 0], ArrowRight: [-80, 0], ArrowUp: [0, 80], ArrowDown: [0, -80] };
  if (Object.hasOwn(moves, event.key)) {
    event.preventDefault();
    const [dx, dy] = moves[event.key];
    setPan(x + dx, y + dy);
    schedulePaint();
  } else if (["+", "=", "-", "_", "0"].includes(event.key)) {
    event.preventDefault();
    if (event.key === "0") reset();
    else if (event.key === "+" || event.key === "=") zoomIn();
    else zoomOut();
  }
}

watch(() => props.resetKey, () => {
  hd.value = false;
  reset();
});
onBeforeUnmount(() => cancelAnimationFrame(pendingFrame));
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
.pz-vp.dragging {
  cursor: grabbing;
}
/* El lienzo conserva la proporción de la imagen aunque el visor sea más
   estrecho o más bajo que ella; si no, los puntos en % no coincidirían. */
.pz-in {
  position: relative;
  width: min(100cqw, calc(100cqh * var(--pz-ar, 1)));
  height: auto;
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
