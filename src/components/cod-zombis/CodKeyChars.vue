<template>
  <!-- Personajes clave, con su final tapado (diseño: #clave) -->
  <section class="sec" id="clave">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kicker">Quién es quién</span>
          <h2 class="h2">Personajes clave</h2>
          <p>Los nombres que se repiten de un mapa a otro. Lo que les pasa al final, solo si lo pides.</p>
        </div>
      </div>
      <CodDataState v-if="state.status !== 'ready'" :state="state" />
      <div v-else class="keys">
        <article v-for="(k, i) in state.data.key" :key="k.n" class="ky">
          <span class="pt" :style="{ backgroundPosition: portraitBp(k.i) }" role="img" :aria-label="'Retrato de ' + k.n"></span>
          <div class="ky-b">
            <small>{{ k.r }}</small>
            <h3 class="sc">{{ k.n }}</h3>
            <p>{{ k.b }}</p>
            <p v-if="spoilers.shown('k' + i)" class="ky-sp">{{ k.sp }}</p>
            <button type="button" class="spoil" @click="spoilers.toggle('k' + i)">{{ spoilers.shown("k" + i) ? "Ocultar" : "Spoiler" }}</button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import CodDataState from "./CodDataState.vue";
import { portraitBp } from "./sprites.js";

defineProps({
  state: { type: Object, required: true },
  spoilers: { type: Object, required: true },
});
</script>
