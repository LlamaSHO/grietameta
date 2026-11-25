<template>
  <!-- Qué pasa en el juego y sus tripulaciones (diseño: #historia de CodBO1..4.dc.html) -->
  <section id="historia" class="sec">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kicker">La historia</span>
          <h2 class="h2">Qué pasa en {{ g.title }}</h2>
          <p>El resumen se lee sin miedo; los giros importantes están tapados hasta que los pidas.</p>
        </div>
        <RouterLink class="btn-o" :to="{ path: '/cod-zombis', hash: '#historia' }">
          Toda la historia del Aether
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
        </RouterLink>
      </div>
      <div class="chs">
        <article v-for="(c, i) in g.chapters" :key="c.t" class="ch">
          <h3 class="sc">{{ c.t }}</h3>
          <p>{{ c.b }}</p>
          <p v-if="spoilers.shown('ch' + i)" class="chsp">{{ c.sp }}</p>
          <button type="button" class="spoil" @click="spoilers.toggle('ch' + i)">{{ spoilers.shown("ch" + i) ? "Ocultar" : "Mostrar el giro (spoiler)" }}</button>
        </article>
      </div>
      <div id="personajes" class="crews">
        <article v-for="c in g.crews" :key="c.n" class="crew" :style="{ '--cc': c.c }">
          <header><h3 class="sc">{{ c.n }}</h3><span>{{ c.w }}</span></header>
          <ul><li v-for="p in c.p" :key="p.n"><b>{{ p.n }}</b><small>{{ p.r }}</small><p>{{ p.d }}</p></li></ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useSpoilers } from "./spoilers.js";

defineProps({ g: { type: Object, required: true } });
const spoilers = useSpoilers();
</script>
