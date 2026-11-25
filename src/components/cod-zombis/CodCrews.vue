<template>
  <!-- Tripulaciones: con quién juegas en cada mapa (diseño: #personajes) -->
  <section class="sec" id="personajes">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kicker">Personajes jugables</span>
          <h2 class="h2">Las tripulaciones</h2>
          <p>Con quién juegas en cada mapa y de dónde viene cada uno, sin spoilers.</p>
        </div>
      </div>
      <CodDataState v-if="state.status !== 'ready'" :state="state" />
      <template v-else>
        <div class="cw-tabs" role="tablist" aria-label="Tripulaciones">
          <button v-for="(c, i) in crews" :key="c.n" type="button" role="tab" class="cw-t" :class="{ on: i === cw }" :style="{ '--cc': c.c }" :aria-selected="i === cw" @click="cw = i">{{ c.n }}</button>
        </div>
        <article class="crew" :style="{ '--cc': crew.c }">
          <header><h3 class="sc">{{ crew.n }}</h3><span>{{ crew.sub }}</span></header>
          <p class="crew-i">{{ crew.intro }}</p>
          <ul>
            <li v-for="m in crew.m" :key="m.n">
              <span class="pt" :style="{ backgroundPosition: portraitBp(m.i) }" role="img" :aria-label="'Retrato de ' + m.n"></span>
              <div><small>{{ m.r }}</small><b>{{ m.n }}</b><p>{{ m.b }}</p></div>
            </li>
          </ul>
        </article>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import CodDataState from "./CodDataState.vue";
import { portraitBp } from "./sprites.js";

const props = defineProps({ state: { type: Object, required: true } });

const cw = ref(0);
const crews = computed(() => props.state.data?.crews || []);
const crew = computed(() => crews.value[cw.value] || { m: [] });
</script>
