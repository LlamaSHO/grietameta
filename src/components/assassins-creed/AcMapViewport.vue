<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const viewport = ref(null);
const layer = ref(null);
const shownZoom = ref(1);
const maxZoom = ref(1);
const props = defineProps({ width: { type: Number, required: true }, height: { type: Number, required: true } });

let width = 0;
let height = 0;
let current = { x: 0, y: 0, zoom: 1 };
let saved = current;
let gesture = null;
let frame = 0;
let wheelTimer;
let observer;
let suppressClick = false;
const pointers = new Map();

function bounded(x, y, zoom) {
  return {
    zoom,
    x: Math.min(0, Math.max(width * (1 - zoom), x)),
    y: Math.min(0, Math.max(height * (1 - zoom), y)),
  };
}

function draw() {
  frame = 0;
  const { x, y, zoom } = current;
  layer.value.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
  layer.value.style.setProperty("--marker-scale", String(Math.max(.48, 1 / zoom)));
}

function move(next) {
  current = next;
  if (!frame) frame = requestAnimationFrame(draw);
}

function commit() {
  clearTimeout(wheelTimer);
  if (frame) {
    cancelAnimationFrame(frame);
    draw();
  }
  saved = current;
  shownZoom.value = saved.zoom;
}

function reset() {
  move({ x: 0, y: 0, zoom: 1 });
  commit();
}

function size() {
  const previousWidth = width;
  const previousHeight = height;
  width = viewport.value.clientWidth;
  height = viewport.value.clientHeight;
  if (!width || !height) return;
  maxZoom.value = Math.max(1, Math.min(3, props.width / width, props.height / height));
  const zoom = Math.min(current.zoom, maxZoom.value);
  const centerX = previousWidth ? (.5 - current.x / previousWidth) / current.zoom : .5;
  const centerY = previousHeight ? (.5 - current.y / previousHeight) / current.zoom : .5;
  move(bounded(width * (.5 - centerX * zoom), height * (.5 - centerY * zoom), zoom));
  commit();
}

onMounted(() => {
  size();
  observer = new ResizeObserver(size);
  observer.observe(viewport.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  clearTimeout(wheelTimer);
  cancelAnimationFrame(frame);
});

function point(event, rect) {
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function anchorZoom(target, x, y, base = current, baseX = x, baseY = y) {
  const zoom = Math.min(maxZoom.value, Math.max(1, target));
  const ratio = zoom / base.zoom;
  move(bounded(x - (baseX - base.x) * ratio, y - (baseY - base.y) * ratio, zoom));
}

function buttonZoom(factor) {
  anchorZoom(current.zoom * factor, width / 2, height / 2);
  commit();
}

function wheel(event) {
  if (gesture) return;
  if ((current.zoom <= 1 && event.deltaY > 0) || (current.zoom >= maxZoom.value && event.deltaY < 0)) return;
  event.preventDefault();
  const { x, y } = point(event, viewport.value.getBoundingClientRect());
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
  const delta = Math.max(-200, Math.min(200, event.deltaY * unit));
  anchorZoom(current.zoom * Math.exp(-delta * .0025), x, y);
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(commit, 130);
}

function doubleClick(event) {
  if (event.target.closest("button")) return;
  const { x, y } = point(event, viewport.value.getBoundingClientRect());
  anchorZoom(current.zoom * 1.45, x, y);
  commit();
}

function midpoint(a, b = a) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, distance: b === a ? 0 : Math.hypot(a.x - b.x, a.y - b.y) };
}

function down(event) {
  if (event.button !== 0 || pointers.size >= 2) return;
  if (!pointers.size) {
    suppressClick = false;
    commit();
  }
  const rect = gesture?.rect ?? viewport.value.getBoundingClientRect();
  pointers.set(event.pointerId, point(event, rect));
  gesture = { rect, base: saved, start: midpoint(...pointers.values()), dragged: pointers.size > 1 || suppressClick };
  if (gesture.dragged) {
    for (const id of pointers.keys()) viewport.value.setPointerCapture(id);
    suppressClick = true;
  }
}

function drag(event) {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, point(event, gesture.rect));
  const center = midpoint(...pointers.values());
  const { start, base } = gesture;
  if (pointers.size === 1 && !gesture.dragged) {
    if (Math.hypot(center.x - start.x, center.y - start.y) < 5) return;
    viewport.value.setPointerCapture(event.pointerId);
    gesture.dragged = suppressClick = true;
    viewport.value.classList.add("dragging");
  }
  const factor = start.distance > 0 ? center.distance / start.distance : 1;
  anchorZoom(base.zoom * factor, center.x, center.y, base, start.x, start.y);
}

function up(event) {
  if (!pointers.delete(event.pointerId)) return;
  commit();
  if (pointers.size) {
    gesture = { rect: gesture.rect, base: saved, start: midpoint(...pointers.values()), dragged: true };
    return;
  }
  gesture = null;
  viewport.value.classList.remove("dragging");
}

function leave(event) {
  if (!viewport.value.hasPointerCapture(event.pointerId)) up(event);
}

function stopDragClick(event) {
  if (suppressClick && event.detail !== 0) {
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }
}

function onKey(event) {
  const steps = { ArrowLeft: [50, 0], ArrowRight: [-50, 0], ArrowUp: [0, 50], ArrowDown: [0, -50] };
  const step = steps[event.key];
  if (!step || current.zoom === 1) return;
  event.preventDefault();
  move(bounded(current.x + step[0], current.y + step[1], current.zoom));
  commit();
}

function focusPoint(x, y) {
  const zoom = Math.min(maxZoom.value, Math.max(current.zoom, 1.55));
  move(bounded(width * (.5 - x * zoom), height * (.5 - y * zoom), zoom));
  commit();
}

defineExpose({ focusPoint, reset });
</script>

<template>
  <div class="map-stage">
    <div ref="viewport" class="viewport" :class="{ 'is-zoomed': shownZoom > 1 }" role="region" aria-label="Plano interactivo de París. Usa las flechas para desplazarte al acercar."
      tabindex="0" @wheel="wheel" @pointerdown="down" @pointermove="drag" @pointerup="up" @pointercancel="up"
      @lostpointercapture="up" @pointerleave="leave" @click.capture="stopDragClick" @dblclick="doubleClick" @keydown.self="onKey">
      <div ref="layer" class="map-layer">
        <img src="/images/assassins-creed/paris-1790.webp" alt="Plano histórico de París de 1790" :width="props.width" :height="props.height"
          loading="lazy" decoding="async" draggable="false">
        <slot />
      </div>
    </div>
    <div class="zoom" role="group" aria-label="Zoom del mapa">
      <button type="button" :disabled="shownZoom >= maxZoom - .001" aria-label="Acercar" @click="buttonZoom(1.42)">+</button>
      <button type="button" :disabled="shownZoom <= 1" aria-label="Alejar" @click="buttonZoom(1 / 1.42)">−</button>
      <button type="button" aria-label="Ver todo el mapa" @click="reset">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5"/></svg>
      </button>
      <output aria-label="Nivel de zoom">×{{ shownZoom.toLocaleString("es-ES", { maximumFractionDigits: 1 }) }}</output>
    </div>
    <slot name="inset" />
  </div>
</template>

<style scoped>
.map-stage { min-width: 0; position: relative; border: 1px solid #776a51; border-radius: 8px; background: #b49063; }
.viewport { position: relative; aspect-ratio: 2928 / 2016; overflow: clip; contain: layout paint; cursor: grab; touch-action: pan-y; user-select: none; border-radius: 7px; }
.viewport.is-zoomed { touch-action: none; }
.viewport.dragging, .viewport.dragging :deep(*) { cursor: grabbing; }
.map-layer { position: relative; width: 100%; height: 100%; transform-origin: 0 0; }
.map-layer img { display: block; width: 100%; height: 100%; pointer-events: none; }
.zoom { position: absolute; z-index: 2; display: grid; right: 8px; top: 8px; overflow: hidden; border: 1px solid #4c4a43; border-radius: 5px; background: #131820; color: #f5ecdd; }
.zoom button { border: 0; border-bottom: 1px solid #3a4049; background: transparent; color: inherit; min-width: 44px; min-height: 44px; display: grid; place-items: center; font: inherit; font-weight: 700; font-size: 1.1rem; cursor: pointer; }
.zoom button:hover:not(:disabled) { background: #294052; }
.zoom button:focus-visible { outline-offset: -3px; }
.zoom button:disabled { color: #7d8690; cursor: default; }
.zoom output { text-align: center; padding: 5px 4px; font-size: .75rem; font-variant-numeric: tabular-nums; }
@media (max-width: 560px) { .zoom { display: flex; right: 5px; top: 5px; } .zoom button { border-bottom: none; border-right: 1px solid #3a4049; } .zoom output { display: grid; min-width: 34px; place-items: center; } }
</style>
