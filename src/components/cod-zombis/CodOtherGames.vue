<template>
  <!-- «Los otros Black Ops» (diseño: .og de CodBO1..4.dc.html) -->
  <section class="sec">
    <div class="wrap">
      <div class="sec-h"><div><span class="kicker">Sigue jugando</span><h2 class="h2">Los otros Black Ops</h2></div></div>
      <div class="og">
        <RouterLink v-for="o in others" :key="o.id" class="ogc" :class="{ noimg: !o.img }" :to="o.route">
          <img v-if="o.img" :src="o.img" alt="" loading="lazy" decoding="async" />
          <small>{{ o.year }} · {{ o.nMaps }} mapas</small>
          <b>{{ o.name }}</b>
          <span>{{ o.teaser }}</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { COD_GAMES } from "./games.js";

const props = defineProps({ current: { type: String, required: true } });
const others = computed(() => COD_GAMES.filter((g) => g.id !== props.current));
</script>
