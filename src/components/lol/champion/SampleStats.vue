<template>
  <!-- Pestaña Estadísticas: evolución, duración, fase de líneas y medias.
       Diseño: LolCampeon.dc.html. Datos de ejemplo (services/lol/sample.js). -->
  <div class="lol-sample sample-stack">
    <section class="card">
      <div class="card-h"><h2 class="disp">Evolución en los últimos 30 días</h2><span class="meta">Mid · {{ rankLabel }} · <span class="demo">Datos de ejemplo</span></span></div>
      <div class="chg">
        <div v-for="c in s.charts" :key="c.k" class="chs">
          <div class="chs-h"><small>{{ c.k }}</small><span><b>{{ c.v }}</b><em :class="c.dc">{{ c.d }}</em></span></div>
          <div class="rng"><span>Máx. {{ c.max }}</span><span>Mín. {{ c.min }}</span></div>
          <svg viewBox="0 0 300 86" preserveAspectRatio="none" aria-hidden="true">
            <line class="gl" x1="0" y1="21" x2="300" y2="21" /><line class="gl" x1="0" y1="43" x2="300" y2="43" /><line class="gl" x1="0" y1="65" x2="300" y2="65" />
            <line :x1="c.px" y1="0" :x2="c.px" y2="86" stroke="rgba(255,255,255,.18)" stroke-dasharray="3 3" />
            <path class="ar" :d="c.area" :fill="c.col" />
            <path class="ln" :d="c.line" :stroke="c.col" />
          </svg>
          <div class="ax"><span class="a0">Hace 30 días</span><span class="a1" :style="{ left: c.pxp }">{{ patchLabel }}</span><span class="a2">Hoy</span></div>
          <p class="sr-only">{{ c.sr }}</p>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-h"><h2 class="disp">Winrate según la duración</h2><span class="meta">{{ s.durTitle }}</span></div>
      <div class="dur-wrap">
        <div class="dur">
          <div v-for="d in s.dur" :key="d.l" class="dur-c"><b :class="d.c">{{ d.w }}</b><i :class="d.c" :style="{ height: d.h }"></i></div>
        </div>
        <div class="dur-ref" :style="{ bottom: s.durRef }"><span>50 %</span></div>
      </div>
      <div class="dur-x"><span v-for="d in s.dur" :key="d.l">{{ d.l }}<small>{{ d.g }} partidas</small></span></div>
    </section>

    <section class="card">
      <div class="card-h"><h2 class="disp">Fase de líneas</h2><span class="meta">Frente al rival directo en mid · <span class="demo">Datos de ejemplo</span></span></div>
      <p class="l15-sub">Diferencia al minuto 15</p>
      <div class="l15">
        <div v-for="x in s.lane" :key="x.k" class="sg-i"><small>{{ x.k }}</small><b :class="x.c">{{ x.v }}</b></div>
      </div>
      <p class="l15-sub">Primeros minutos</p>
      <div class="l15 one"><div class="sg-i"><small>Alcanza el nivel 2 antes que su rival</small><b>{{ s.lvl2 }}</b></div></div>
    </section>

    <section class="card">
      <div class="card-h"><h2 class="disp">Estadísticas medias por partida</h2><span class="meta">Comparadas con la media de mid · <span class="demo">Datos de ejemplo</span></span></div>
      <div class="sg">
        <div v-for="x in s.avg" :key="x.k" class="sg-i"><small>{{ x.k }}</small><b>{{ x.v }}</b><em :class="x.c">{{ x.d }}</em></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { statsTab } from "@/services/lol/sample";
import "./sample.css";

const props = defineProps({
  raw: { type: Object, required: true },
  rank: { type: String, default: "ALL" },
  rankLabel: { type: String, default: "Todos" },
  patchLabel: { type: String, default: "" },
});
const s = computed(() => statsTab(props.raw, props.rank));
</script>

<style scoped>
.sample-stack { display: flex; flex-direction: column; gap: 20px; }
</style>
