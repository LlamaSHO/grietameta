<template>
  <!-- Estadísticas del campeón en cada rango. Pulsar una fila cambia el rango. -->
  <section class="card" aria-labelledby="pr-h">
    <div class="card-h"><h2 id="pr-h" class="disp">{{ name }} por rango</h2><span class="meta">El rango elegido aparece resaltado</span></div>
    <div class="tscroll">
      <div class="rtab" role="table" :aria-label="`Estadísticas de ${name} por rango`">
        <div class="rr th" role="row">
          <span role="columnheader">Rango</span>
          <span role="columnheader">Winrate</span>
          <span role="columnheader">Pickrate</span>
          <span role="columnheader">Banrate</span>
          <span role="columnheader">Partidas</span>
          <span role="columnheader">Tier</span>
          <span role="columnheader">Puesto {{ role }}</span>
        </div>
        <div
          v-for="r in rows"
          :key="r.key"
          class="rr"
          :class="{ on: r.key === modelValue, nodata: !r.e }"
          role="row"
          tabindex="0"
          @click="emit('update:modelValue', r.key)"
          @keydown.enter="emit('update:modelValue', r.key)"
        >
          <span role="cell" class="rn">
            <img v-if="r.img" :src="r.img" alt="">
            <span v-else class="pi pi-all" aria-hidden="true"></span>
            {{ r.label }}
          </span>
          <template v-if="r.e">
            <span role="cell" class="wr" :class="wrClass(r.e.wr)"><b>{{ pct(r.e.wr) }}</b><span class="bar"><i :style="{ width: wrWidth(r.e.wr) }"></i></span></span>
            <span role="cell" class="num">{{ pct(r.e.pr) }}</span>
            <span role="cell" class="num">{{ pct(r.e.br) }}</span>
            <span role="cell" class="num">{{ fmtInt(r.e.games) }}</span>
            <span role="cell"><span class="tier" :class="r.e.tc">{{ r.e.tier }}</span></span>
            <span role="cell" class="num">#{{ r.e.pos }} de {{ r.e.of }}</span>
          </template>
          <span v-else role="cell" class="nd">Sin partidas suficientes en este rango</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { fmtInt, pct, wrClass, wrWidth } from "@/services/lol/format";

defineProps({
  name: { type: String, required: true },
  role: { type: String, required: true },
  rows: { type: Array, required: true }, // [{ key, label, img, e }]
  modelValue: { type: String, default: "ALL" },
});
const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped>
.tscroll { overflow-x: auto; }
.rtab { min-width: 700px; }
.rr {
  display: grid;
  grid-template-columns: minmax(150px, 1.4fr) minmax(150px, 1.6fr) repeat(3, minmax(70px, 1fr)) 64px 90px;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  height: 58px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.045);
  cursor: pointer;
  outline: none;
  transition: background 0.2s;
}
.rr:not(.th):hover,
.rr:not(.th):focus-visible { background: rgba(255, 255, 255, 0.03); }
.rr.th {
  height: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.015);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-mute);
  cursor: default;
}
.rr.on,
.rr.on:hover { background: rgba(226, 181, 102, 0.08); box-shadow: inset 3px 0 0 var(--gold-hi); }
.rn { display: flex; align-items: center; gap: 10px; font-weight: 600; }
.rn img { width: 30px; height: 30px; object-fit: contain; }
.rn .pi { width: 26px; height: 26px; margin: 0 2px; color: var(--ink-mute); }
.nd { grid-column: 2 / -1; font-size: 13px; color: var(--ink-faint); }
.rr.nodata .rn { color: var(--ink-mute); }
@media (max-width: 640px) {
  .rtab { min-width: 0; }
  /* En móvil: rango, winrate, tier y puesto. */
  .rr { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) 46px 72px; padding: 0 14px; height: 54px; }
  .rr > :nth-child(3),
  .rr > :nth-child(4),
  .rr > :nth-child(5) { display: none; }
  .wr .bar { display: none; }
  .wr b { min-width: 0; font-size: 13px; }
  .rn { gap: 8px; font-size: 13.5px; }
  .rn img { width: 26px; height: 26px; }
  .num { font-size: 13px; }
}
</style>
