<template>
  <!-- Visor del mapa: PanZoomMap + capas de ARC (mapa de calor de zonas,
       retratos/puntos de misiones) y la información superpuesta. -->
  <div class="am-viewer" :style="{ '--ar': view.aspect }">
    <PanZoomMap
      ref="pz"
      class="arc-vp"
      :src="view.img"
      :aspect="view.aspect"
      :levels="LEVELS"
      :pin-scales="PIN_SCALES"
      :reset-key="resetKey"
      height="var(--am-vp-h, 760px)"
      :alt="`Mapa de ${mapName}${floorLabel ? ' (' + floorLabel.toLowerCase() + ')' : ''} con los nombres de zona`"
    >
      <template #default>
        <div v-if="heat.length" class="ov" aria-hidden="true">
          <span v-for="(h, i) in heat" :key="'h' + i" class="heat" :style="{ left: h[0] + '%', top: h[1] + '%' }"></span>
          <span v-for="(h, i) in heat" :key="'d' + i" class="hdot" :style="{ left: h[0] + '%', top: h[1] + '%' }"></span>
        </div>
        <ArcQuestPin
          v-for="p in pins"
          :key="p.key"
          :quest="p.quest"
          :x="p.x"
          :y="p.y"
          :mode="p.mode"
          :n="p.n"
          :total="p.total"
          :open="p.open"
          @pick="$emit('pick-pin', p)"
          @focusin="onPinFocus(p, $event)"
        />
      </template>

      <template #overlay="{ zoom }">
        <span class="vtag cond"><i aria-hidden="true"></i>{{ mapName }}<template v-if="floorLabel"> · {{ floorLabel.toLowerCase() }}</template></span>

        <div v-if="chip" class="mchip" :class="chip.cls" data-no-pan>
          <img v-if="chip.img" :src="chip.img" alt="">
          <i v-else aria-hidden="true"></i>
          <span>{{ chip.text }}</span>
          <button type="button" aria-label="Quitar del mapa" @click="$emit('clear')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
          </button>
        </div>

        <!-- Pantallas táctiles: la tarjeta del punto tocado sale abajo, entera. -->
        <div v-if="sheetPin" class="qsheet" :class="sheetPin.quest.traderCls" role="dialog" :aria-label="sheetPin.quest.name" data-no-pan>
          <div class="qs-h">
            <img :src="sheetPin.quest.portrait" alt="">
            <div>
              <b>{{ sheetPin.quest.name }}</b>
              <span>{{ sheetPin.quest.trader }} · Punto {{ sheetPin.n }} de {{ sheetPin.total }}</span>
            </div>
            <button type="button" aria-label="Cerrar" @click="$emit('pick-pin', sheetPin)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
            </button>
          </div>
          <ol>
            <li v-for="(o, i) in sheetPin.quest.objectives" :key="i">{{ o }}</li>
          </ol>
        </div>
        <p v-else-if="note" class="vnote" role="status">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12.5" /><line x1="12" y1="16" x2="12" y2="16.01" /></svg>
          <span>{{ note }}</span>
        </p>
        <span v-else class="vhint">{{ hint }} · <span class="num">×{{ String(zoom).replace(".", ",") }}</span></span>
      </template>
    </PanZoomMap>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import PanZoomMap from "@/components/maps/PanZoomMap.vue";
import ArcQuestPin from "./ArcQuestPin.vue";

// Niveles de zoom del diseño y tamaño de los marcadores en cada uno.
const LEVELS = [1, 1.5, 2.2, 3];
const PIN_SCALES = [1, 0.67, 0.46, 0.34];

// Sin ratón la tarjeta no cabe junto al punto: se enseña como hoja abajo.
const canHover = typeof window !== "undefined" && !!window.matchMedia?.("(hover: hover)").matches;

const props = defineProps({
  view: { type: Object, required: true }, // { img, aspect, file, label }
  mapName: { type: String, default: "" },
  floorLabel: { type: String, default: "" },
  pins: { type: Array, default: () => [] },
  heat: { type: Array, default: () => [] }, // [[x%, y%], …]
  chip: { type: Object, default: null }, // { text, img?, cls? }
  hint: { type: String, default: "" },
  note: { type: String, default: "" },
  resetKey: { type: [String, Number], default: "" },
});
defineEmits(["pick-pin", "clear"]);

const pz = ref(null);
const sheetPin = computed(() => (canHover ? null : props.pins.find((p) => p.open && p.mode === "num") || null));

// Con teclado: si el punto que recibe el foco está fuera del visor (mapa con
// zoom o arrastrado), se centra en él sin cambiar el nivel de zoom.
function onPinFocus(p, e) {
  const vpEl = e.currentTarget?.closest?.(".pz-vp");
  const btn = e.target;
  if (!vpEl || !btn?.getBoundingClientRect || !btn.matches?.(":focus-visible")) return;
  const v = vpEl.getBoundingClientRect();
  const r = btn.getBoundingClientRect();
  const m = 24;
  if (r.left >= v.left + m && r.right <= v.right - m && r.top >= v.top + m && r.bottom <= v.bottom - m) return;
  pz.value?.focus(p.x, p.y, pz.value.level ?? 0);
}

defineExpose({
  levels: LEVELS,
  focus: (x, y, level) => pz.value?.focus(x, y, level),
  reset: () => pz.value?.reset(),
});
</script>

<style scoped>
.am-viewer {
  position: relative;
  flex: 999 1 620px;
  min-width: 0;
}
.arc-vp {
  background: radial-gradient(circle at 50% 50%, #17151d, #0b0a0e 75%);
  /* Botones de zoom con los colores de ARC */
  --pz-line: rgba(242, 235, 221, 0.18);
  --pz-btn: rgba(16, 14, 20, 0.88);
  --pz-btn-hover: rgba(245, 192, 42, 0.18);
  /* Tamaño del visor como contenedor: el mapa se ajusta «contain» dentro. */
  container-type: size;
}
/* «clip» y no «hidden»: con hidden el navegador desplaza el visor por dentro al
   dar foco con Tab a un punto fuera de la vista, y ese desplazamiento se queda
   (descuadra el mapa incluso tras «Ver el mapa completo»). */
.am-viewer .arc-vp {
  overflow: clip;
}
.arc-vp::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(242, 235, 221, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(242, 235, 221, 0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  pointer-events: none;
}
/* El lienzo mantiene la proporción de la imagen aunque el visor sea más
   estrecho que ella (si no, los puntos en % no coinciden con la imagen). */
.arc-vp :deep(.pz-in) {
  height: auto;
  max-width: none;
  width: min(100cqw, calc(100cqh * var(--ar, 1)));
}

/* Capa de zonas (mapa de calor) */
.ov {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.heat {
  position: absolute;
  width: 6%;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 92, 48, 0.62) 0%, rgba(255, 92, 48, 0.26) 38%, rgba(255, 92, 48, 0) 70%);
  mix-blend-mode: screen;
  animation: heatp 3.2s ease-in-out infinite;
}
.heat:nth-child(3n) {
  animation-delay: -1s;
}
.heat:nth-child(3n + 1) {
  animation-delay: -2s;
}
@keyframes heatp {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
.hdot {
  position: absolute;
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 50%;
  background: #ffd2b8;
  box-shadow: 0 0 6px 2px rgba(255, 92, 48, 0.9);
  transform: scale(var(--pz-s, 1));
}

/* Superpuestos (no se mueven con el mapa) */
.vtag {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  max-width: calc(100% - 84px);
  padding: 0 12px;
  border-radius: 10px;
  background: rgba(16, 14, 20, 0.88);
  border: 1px solid rgba(242, 235, 221, 0.16);
  font-size: 16px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}
.vtag i {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2fb45a;
  animation: am-blink 1.6s infinite;
}
.vhint,
.vnote {
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 5;
  margin: 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(16, 14, 20, 0.88);
  border: 1px solid rgba(242, 235, 221, 0.14);
  font-size: 12px;
  color: var(--am-dim);
  pointer-events: none;
}
.vnote {
  right: 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 560px;
  border-color: rgba(245, 192, 42, 0.4);
  color: var(--am-ink-2);
  font-size: 13px;
  line-height: 1.45;
}
.vnote svg {
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--am-yellow);
}
.mchip {
  position: absolute;
  left: 14px;
  top: 58px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100% - 90px);
  padding: 5px 5px 5px 12px;
  border-radius: 12px;
  background: rgba(16, 14, 20, 0.92);
  border: 1px solid rgba(242, 235, 221, 0.18);
  font-size: 13px;
  color: var(--am-ink);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  cursor: default;
}
.mchip img {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--tc, transparent);
}
.mchip > i {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--am-heat);
  box-shadow: 0 0 8px var(--am-heat);
}
.mchip span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mchip button {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 8px;
  background: rgba(242, 235, 221, 0.08);
  color: var(--am-ink);
  cursor: pointer;
}
.mchip button:hover {
  background: rgba(242, 235, 221, 0.18);
}
.mchip button:focus-visible {
  outline: 2px solid var(--am-yellow);
}

.qsheet {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 7;
  max-height: 62%;
  overflow-y: auto;
  padding: 12px 12px 12px 14px;
  border-radius: 14px;
  background: rgba(18, 16, 22, 0.97);
  border: 1px solid rgba(242, 235, 221, 0.18);
  border-top: 3px solid var(--tc);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8);
  animation: am-pop 0.2s ease-out both;
  cursor: default;
  touch-action: pan-y;
}
.qs-h {
  display: flex;
  align-items: center;
  gap: 10px;
}
.qs-h img {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  object-fit: cover;
  border: 2px solid var(--tc);
  flex-shrink: 0;
}
.qs-h div {
  flex: 1;
  min-width: 0;
}
.qs-h b {
  display: block;
  font-size: 14.5px;
  line-height: 1.2;
}
.qs-h span {
  font-size: 11.5px;
  color: var(--am-mute);
}
.qs-h button {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: rgba(242, 235, 221, 0.08);
  color: var(--am-ink);
  cursor: pointer;
}
.qsheet ol {
  margin: 10px 0 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.45;
  color: #d8d1c5;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (max-width: 560px) {
  .vtag {
    height: 30px;
    font-size: 14px;
    top: 10px;
    left: 10px;
  }
  .mchip {
    top: 48px;
    left: 10px;
    right: 62px;
    max-width: none;
    font-size: 12px;
  }
  .vhint {
    display: none;
  }
  .vnote {
    left: 10px;
    right: 10px;
    bottom: 10px;
    font-size: 12px;
  }
}
</style>
