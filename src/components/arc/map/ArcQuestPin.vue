<template>
  <!-- Marcador de misión en el mapa. Dos modos:
       - «ovw»: retrato del comerciante donde se hace la misión (vista general).
       - «num»: punto numerado de la misión elegida.
       Al pasar el ratón (o con foco) sale la tarjeta; «open» la deja fija (toque). -->
  <div
    ref="root"
    class="qp pz-pin"
    :class="[quest.traderCls, mode, place, { pin: open }]"
    :style="{ left: x + '%', top: y + '%' }"
    @pointerenter="measure"
    @focusin="measure"
  >
    <button type="button" class="qpb" :aria-label="aria" :aria-expanded="mode === 'num' ? open : undefined" @click="$emit('pick')">
      <img v-if="mode === 'ovw'" :src="quest.portrait" alt="" draggable="false">
      <span v-else class="cond">{{ n }}</span>
    </button>
    <span v-if="mode === 'num'" class="qpulse" aria-hidden="true"></span>
    <div class="qc" role="tooltip">
      <div class="qc-h">
        <img :src="quest.portrait" alt="">
        <div>
          <b>{{ quest.name }}</b>
          <span>{{ quest.trader }} · {{ sub }}</span>
        </div>
      </div>
      <ol>
        <li v-for="(o, i) in objectives" :key="i">{{ o }}</li>
      </ol>
      <div class="qn">{{ hint }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  quest: { type: Object, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  mode: { type: String, default: "ovw" }, // "ovw" | "num"
  n: { type: Number, default: 0 }, // número del punto (modo num)
  total: { type: Number, default: 0 }, // puntos de la misión en esta vista
  open: { type: Boolean, default: false },
});
defineEmits(["pick"]);

const sub = computed(() =>
  props.mode === "num"
    ? `Punto ${props.n} de ${props.total}`
    : `${props.total} ${props.total === 1 ? "punto" : "puntos"}`,
);
const objectives = computed(() => (props.mode === "num" ? props.quest.objectives : props.quest.objectives.slice(0, 3)));
const hint = computed(() => {
  if (props.mode === "ovw") return "Pulsa para ver la mini guía en el mapa.";
  return props.total > 1 ? "Los números marcan los puntos de esta misión." : "Aquí se hace esta misión.";
});
const aria = computed(() =>
  props.mode === "num"
    ? `Punto ${props.n} de ${props.total} de ${props.quest.name}`
    : `Misión ${props.quest.name} de ${props.quest.trader}`,
);
// La tarjeta se abre hacia dentro del visor cuando el punto está cerca de un
// borde. Se mide en pantalla al pasar o tocar (con zoom, el % no basta).
const root = ref(null);
const measured = ref(null);
function measure() {
  const el = root.value;
  const vp = el?.closest(".pz-vp");
  if (!vp) return;
  const v = vp.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const c = [];
  if (cx - v.left < 150) c.push("al");
  else if (v.right - cx < 150) c.push("ar");
  const above = r.top - v.top;
  if (above < 240 && v.bottom - r.bottom > above) c.push("below");
  measured.value = c;
}
watch(
  () => props.open,
  (o) => o && measure(),
  { immediate: true },
);
const place = computed(() => {
  if (measured.value) return measured.value;
  const c = [];
  if (props.x < 18) c.push("al");
  else if (props.x > 82) c.push("ar");
  if (props.y < 30) c.push("below");
  return c;
});
</script>

<style scoped>
.qp {
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%) scale(var(--pz-s, 1));
  pointer-events: auto;
}
.qp:hover,
.qp:focus-within,
.qp.pin {
  z-index: 6;
}
.qpb {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid var(--tc);
  background: #141219;
  color: var(--am-ink);
  font-size: 17px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6), 0 0 0 4px rgba(20, 18, 25, 0.5);
  transition: transform 0.2s;
}
.qpb:hover {
  transform: scale(1.14);
}
.qpb:focus-visible {
  outline: 2px solid var(--am-yellow);
  outline-offset: 3px;
}
.qpb img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  pointer-events: none;
}
.qp.ovw .qpb {
  width: 32px;
  height: 32px;
  padding: 1px;
}
.qpulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid var(--tc);
  opacity: 0;
  animation: qpulse 2.4s ease-out infinite;
  pointer-events: none;
}
@keyframes qpulse {
  0% { transform: scale(0.7); opacity: 0.9; }
  100% { transform: scale(1.7); opacity: 0; }
}

/* Tarjeta */
.qc {
  display: none;
  position: absolute;
  left: 50%;
  bottom: calc(100% + 12px);
  width: 280px;
  /* translate (no transform): la animación am-pop usa transform. */
  translate: -50% 0;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(18, 16, 22, 0.97);
  border: 1px solid rgba(242, 235, 221, 0.16);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8);
  text-align: left;
  cursor: default;
  font-family: var(--font-body);
}
.qc::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -7px;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  transform: rotate(45deg);
  background: rgba(18, 16, 22, 0.97);
  border-right: 1px solid rgba(242, 235, 221, 0.16);
  border-bottom: 1px solid rgba(242, 235, 221, 0.16);
}
.qp:hover .qc,
.qp:focus-within .qc,
.qp.pin .qc {
  display: block;
  animation: am-pop 0.2s ease-out both;
}
/* Cerca de los bordes */
.qp.al .qc { left: -10px; translate: none; }
.qp.al .qc::after { left: 26px; }
.qp.ar .qc { left: auto; right: -10px; translate: none; }
.qp.ar .qc::after { left: auto; right: 20px; }
.qp.below .qc { bottom: auto; top: calc(100% + 12px); }
.qp.below .qc::after {
  bottom: auto;
  top: -7px;
  transform: rotate(225deg);
}

.qc-h {
  display: flex;
  align-items: center;
  gap: 10px;
}
.qc-h img {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  object-fit: cover;
  border: 2px solid var(--tc);
  flex-shrink: 0;
}
.qc-h b {
  display: block;
  font-size: 14.5px;
  line-height: 1.2;
}
.qc-h span {
  font-size: 11.5px;
  color: var(--am-mute);
}
.qc ol {
  margin: 10px 0 0;
  padding-left: 18px;
  font-size: 12.5px;
  line-height: 1.4;
  color: #d8d1c5;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.qn {
  margin-top: 8px;
  font-size: 11.5px;
  color: var(--am-yellow);
  font-weight: 600;
}

@media (max-width: 560px) {
  .qc {
    width: 240px;
  }
}
/* Pantallas táctiles: la tarjeta la enseña el visor como hoja (ArcMapViewer). */
@media (hover: none) {
  .qp .qc {
    display: none !important;
  }
}
</style>
