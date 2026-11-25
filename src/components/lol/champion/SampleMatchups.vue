<template>
  <!-- Pestaña Matchups: mejores compañeros y lista completa de duelos.
       Diseño: LolCampeon.dc.html. Datos de ejemplo (services/lol/sample.js). -->
  <div class="lol-sample sample-stack">
    <section class="card">
      <div class="card-h"><h2 class="disp">Mejores compañeros</h2><span class="meta">Winrate de {{ raw.campeon }} con ese aliado · <span class="demo">Datos de ejemplo</span></span></div>
      <div class="syn">
        <div v-for="a in syn" :key="a.n" class="syn-c"><span class="sp cs" :style="{ backgroundPosition: a.pos }" aria-hidden="true"></span><span class="rl">{{ a.role }}</span><b>{{ a.n }}</b><span class="w">{{ a.wr }} <small>{{ a.d }}</small></span><small>{{ a.g }} partidas juntos</small></div>
      </div>
    </section>

    <section class="card">
      <div class="card-h"><h2 class="disp">Todos los matchups en mid</h2><span class="meta">{{ list.length }} {{ list.length === 1 ? "rival" : "rivales" }} · <span class="demo">Datos de ejemplo</span></span></div>
      <div v-if="detail" class="mud" role="region" aria-live="polite" aria-label="Detalle del duelo">
        <span class="vs"><span class="sp cs" :style="{ backgroundPosition: selected.pos }" aria-hidden="true"></span><span>{{ raw.campeon }} <em>contra</em> {{ selected.n }}</span></span>
        <div class="mud-k">
          <div><small>Winrate de {{ raw.campeon }}</small><b :class="detail.up ? 'up' : 'dn'">{{ detail.wr }}</b></div>
          <div><small>Oro al minuto 15</small><b :class="detail.goldUp ? 'up' : 'dn'">{{ detail.gold }}</b></div>
          <div><small>CS al minuto 15</small><b :class="detail.csUp ? 'up' : 'dn'">{{ detail.cs }}</b></div>
          <div><small>Experiencia al 15</small><b :class="detail.xpUp ? 'up' : 'dn'">{{ detail.xp }}</b></div>
        </div>
        <button type="button" class="x" aria-label="Cerrar el detalle del duelo" @click="sel = null">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <p>{{ detail.tip }} <span class="demo">{{ detail.games }}</span></p>
      </div>
      <div class="mu-bar">
        <label class="msrch">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span class="sr-only">Buscar rival</span>
          <input v-model="q" type="search" placeholder="Busca un rival" autocomplete="off">
        </label>
        <div class="seg2">
          <button v-for="o in SORTS" :key="o[0]" type="button" :class="{ on: sort === o[0] }" @click="sort = o[0]">{{ o[1] }}</button>
        </div>
        <button type="button" class="chip2" :class="{ on: big }" :aria-pressed="big" @click="big = !big">Solo con 1.000+ partidas</button>
      </div>
      <div class="ml">
        <div class="ml-r th"><span>Rival</span><span>Winrate de {{ raw.campeon }}</span><span>Diferencia</span><span>Partidas</span></div>
        <button v-for="m in list" :key="m.n" type="button" class="ml-r" :class="[m.cls, { sel: sel === m.n }]" :aria-pressed="sel === m.n" :aria-label="`Ver el duelo contra ${m.n}: ${m.wrText} de winrate, ${m.gText} partidas`" @click="sel = sel === m.n ? null : m.n">
          <span class="ml-n"><span class="sp cs" :style="{ backgroundPosition: m.pos }" aria-hidden="true"></span><b>{{ m.n }}</b></span>
          <span class="ml-w" aria-hidden="true"><span class="cbar"><i :style="{ left: m.left, width: m.width }"></i><em></em></span><b>{{ m.wrText }}</b></span>
          <span class="ml-d" aria-hidden="true">{{ m.dText }}</span>
          <span class="ml-g" aria-hidden="true">{{ m.gText }}<span class="ml-gl">partidas</span></span>
        </button>
        <p v-if="!list.length" class="nodata">Ningún rival coincide con tu búsqueda.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { matchupDetail, matchups, synergies } from "@/services/lol/sample";
import "./sample.css";

const props = defineProps({
  raw: { type: Object, required: true },
  rank: { type: String, default: "ALL" },
});

const SORTS = [["wd", "Mejores primero"], ["wa", "Peores primero"], ["g", "Más jugados"]];
const q = ref("");
const sort = ref("wd");
const big = ref(true);
const sel = ref(null);

const syn = computed(() => synergies(props.raw, props.rank));
const list = computed(() => matchups(props.raw, props.rank, { q: q.value, sort: sort.value, big: big.value }).list);
const selected = computed(() => list.value.find((m) => m.n === sel.value) || null);
const detail = computed(() => (selected.value ? matchupDetail(selected.value) : null));
</script>

<style scoped>
.sample-stack { display: flex; flex-direction: column; gap: 20px; }
</style>
