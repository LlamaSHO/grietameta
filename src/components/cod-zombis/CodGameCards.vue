<template>
  <!-- «Los cuatro Black Ops»: una tarjeta por juego con sus mapas (diseño: #juegos) -->
  <section class="sec" id="juegos">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kicker">Elige juego</span>
          <h2 class="h2">Los cuatro Black Ops</h2>
          <p>Una página por juego con todos sus mapas. Pulsa un mapa para ir directo a su ficha.</p>
        </div>
      </div>
      <div class="gks">
        <article v-for="g in COD_GAMES" :key="g.id" class="gk" :class="g.id" :style="{ '--gc': g.color }">
          <RouterLink class="gk-top" :to="g.route">
            <img v-if="g.img" class="gk-img" :src="g.img" alt="" loading="lazy" decoding="async" />
            <span v-else class="gk-ph stencil" aria-hidden="true">{{ g.ph }}</span>
            <span class="gk-y sc">{{ g.year }}</span>
            <span class="gk-tt"><small>{{ g.nMaps }} mapas · {{ g.nEggs }} Easter eggs</small><b class="stencil">{{ g.name }}</b></span>
          </RouterLink>
          <p>{{ g.blurb }}</p>
          <div class="mchips">
            <RouterLink v-for="c in g.chips" :key="c[0]" class="mchip" :to="g.route + '#' + c[0]" :style="{ '--mc': c[2] }">{{ c[1] }}</RouterLink>
          </div>
          <RouterLink class="gk-go" :to="g.route">
            Abrir {{ g.name }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { COD_GAMES } from "./games.js";
</script>
