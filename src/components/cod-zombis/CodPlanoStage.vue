<template>
  <!-- Plano en vista orbital (diseño: .pl-view de CodMapas.dc.html).
       Se arrastra para girar e inclinar; los botones giran, inclinan, acercan a la zona
       elegida, pasan a cenital y reinician. En móvil el plano pasa a una lista de zonas. -->
  <div ref="viewEl" class="pl-view" :style="viewStyle" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
    <div class="pl-orb">
      <div class="pl-stage" :class="stageCls">
        <svg class="pl-svg" viewBox="0 0 100 62" preserveAspectRatio="none" aria-hidden="true">
          <line v-for="(e, i) in edges" :key="'l' + i" :class="'e-' + e.k" :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" />
        </svg>
        <span v-for="(e, i) in edges" :key="'d' + i" class="pl-door" :class="'k-' + e.k" :style="{ left: e.mx + '%', top: e.my + '%' }" :title="e.label" aria-hidden="true"></span>
        <button
          v-for="z in zones" :key="z.id" type="button" class="pl-zone"
          :class="[z.spawn ? 'spawn' : '', 'tx-' + (z.tex || 'concrete'), z.out ? 'out' : '', stepOn(z.id) ? 'step-on' : '']"
          :style="{ left: z.x + '%', top: z.yp + '%', width: z.w + '%', height: z.hp + '%' }"
          :aria-pressed="z.id === zid" :aria-label="z.n + (z.icons.length ? ': ' + z.icons.map((i) => i.n).join(', ') : '')"
          @click="pick(z.id)"
        >
          <span class="pl-zn">{{ z.n }}</span>
          <span v-if="stepsOf(z.id)" class="pl-step">Paso {{ stepsOf(z.id) }}</span>
          <span class="pl-ic" aria-hidden="true">
            <b v-for="(i, k) in z.icons" :key="k" :class="i.cls" :style="{ '--pc': i.c, '--bp': i.bp }" :title="i.t">{{ i.k }}</b>
          </span>
        </button>
      </div>
    </div>
    <div class="pl-ctl" role="toolbar" aria-label="Controles de la vista">
      <div class="pl-cg" role="group" aria-label="Vista">
        <button type="button" class="pl-cv" :aria-pressed="view.tilt > 0" @click="emit('view', { tilt: V0.tilt, spin: view.spin === 0 ? V0.spin : view.spin })">3D</button>
        <button type="button" class="pl-cv" :aria-pressed="view.tilt === 0" @click="emit('view', { tilt: 0, spin: 0 })">Cenital</button>
      </div>
      <div class="pl-cg" role="group" aria-label="Girar">
        <button type="button" class="pl-cb" aria-label="Girar a la izquierda" title="Girar a la izquierda" @click="emit('view', { spin: view.spin - 30 })">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6" /><polyline points="4 4 4 9 9 9" /></svg>
        </button>
        <button type="button" class="pl-cb" aria-label="Girar a la derecha" title="Girar a la derecha" @click="emit('view', { spin: view.spin + 30 })">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6" /><polyline points="20 4 20 9 15 9" /></svg>
        </button>
      </div>
      <div class="pl-cg" role="group" aria-label="Inclinar">
        <button type="button" class="pl-cb" aria-label="Inclinar más" title="Inclinar más" @click="emit('view', { tilt: Math.min(68, view.tilt + 12) })">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l9-10 9 10" /><path d="M3 21h18" /></svg>
        </button>
        <button type="button" class="pl-cb" aria-label="Inclinar menos" title="Inclinar menos" @click="emit('view', { tilt: Math.max(0, view.tilt - 12) })">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13l9-4 9 4" /><path d="M3 18h18" /></svg>
        </button>
      </div>
      <div class="pl-cg" role="group" aria-label="Zoom">
        <button type="button" class="pl-cb" aria-label="Alejar" title="Alejar" @click="emit('view', { z: Math.max(0.7, +(view.z - 0.4).toFixed(2)) })">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="8" y1="11" x2="14" y2="11" /><line x1="21" y1="21" x2="16.2" y2="16.2" /></svg>
        </button>
        <span class="pl-zv" aria-live="polite">{{ Math.round(view.z * 100) }} %</span>
        <button type="button" class="pl-cb" aria-label="Acercar a la zona elegida" title="Acercar a la zona elegida" @click="emit('view', { z: Math.min(2.6, +(view.z + 0.4).toFixed(2)) })">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="8" y1="11" x2="14" y2="11" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="21" y1="21" x2="16.2" y2="16.2" /></svg>
        </button>
      </div>
      <button type="button" class="pl-reset" @click="emit('view', { ...V0 })">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 3 3 8 8 8" /><circle cx="12" cy="12" r="2" /></svg>
        Reset
      </button>
    </div>
    <p class="pl-help" aria-hidden="true">Arrastra para girar · «+» acerca a la zona elegida</p>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Y } from "./planoModel.js";

const props = defineProps({
  zones: { type: Array, required: true },
  edges: { type: Array, required: true },
  stageCls: { type: String, default: "" },
  zid: { type: String, required: true },
  steps: { type: Array, default: () => [] },
  rstep: { type: Number, default: -1 },
  /* { tilt, spin, z } */
  view: { type: Object, required: true },
});
const emit = defineEmits(["pick", "view"]);

// Vista inicial y límites (inclinación 0–68°, zoom 70–260 %)
const V0 = { tilt: 52, spin: -22, z: 1 };

const viewEl = ref(null);
const focus = computed(() => props.zones.find((n) => n.id === props.zid) || props.zones[0]);
// Con zoom, el plano se desplaza para dejar la zona elegida en el centro.
const viewStyle = computed(() => {
  const f = focus.value;
  const zoomed = props.view.z > 1 && f;
  return {
    "--tilt": props.view.tilt,
    "--spin": props.view.spin,
    "--z": props.view.z,
    "--fx": zoomed ? (50 - (f.x + f.w / 2)).toFixed(2) + "%" : "0%",
    "--fy": zoomed ? (50 - Y(f.y + f.h / 2)).toFixed(2) + "%" : "0%",
  };
});

const stepsOf = (id) => props.steps.filter((r) => r.nd === id).map((r) => r.n).join(" · ");
const stepOn = (id) => props.rstep >= 0 && props.steps[props.rstep]?.nd === id;

/* Arrastre: mientras dura solo se escriben --spin y --tilt en el contenedor (sin pasar
   por Vue); el estado se guarda al soltar. */
let od = null;
let skipClick = 0;
function down(e) {
  if (e.button !== 0 || e.target.closest(".pl-ctl")) return;
  od = { x: e.clientX, y: e.clientY, tilt: props.view.tilt, spin: props.view.spin, id: e.pointerId, moved: false };
}
function move(e) {
  const d = od;
  if (!d) return;
  const dx = e.clientX - d.x, dy = e.clientY - d.y, el = viewEl.value;
  if (!d.moved) {
    if (Math.abs(dx) + Math.abs(dy) < 6) return;
    d.moved = true;
    el.classList.add("drag");
    try { el.setPointerCapture(d.id); } catch { /* sin captura, el arrastre sigue dentro del plano */ }
  }
  d.nspin = Math.round(d.spin + dx * 0.35);
  d.ntilt = Math.round(Math.max(0, Math.min(68, d.tilt - dy * 0.25)));
  el.style.setProperty("--spin", d.nspin);
  el.style.setProperty("--tilt", d.ntilt);
}
function up() {
  const d = od;
  od = null;
  if (!d || !d.moved) return;
  viewEl.value.classList.remove("drag");
  skipClick = Date.now(); // el clic que cierra el arrastre no elige zona
  emit("view", { spin: d.nspin, tilt: d.ntilt });
}
function pick(id) {
  if (Date.now() - skipClick < 250) return;
  emit("pick", id);
}
</script>
