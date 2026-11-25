<template>
  <!-- La saga del Aether, capítulo a capítulo, con los giros tapados (diseño: #historia) -->
  <section class="sec" id="historia">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kicker">La historia</span>
          <h2 class="h2">La saga del Aether, mapa a mapa</h2>
          <p>Los 26 mapas de la historia del Aether en orden, de Nacht der Untoten a Tag der Toten, con el nombre original de cada uno. Se leen sin miedo: los giros están tapados hasta que los pidas.</p>
        </div>
        <button type="button" class="btn-o" :class="{ on: spoilers.all }" @click="spoilers.toggleAll()">{{ spoilers.all ? "Ocultar todos los spoilers" : "Mostrar todos los spoilers" }}</button>
      </div>
      <CodDataState v-if="state.status !== 'ready'" :state="state" />
      <template v-else>
        <div class="ch-tabs" role="tablist" aria-label="Capítulos de la saga">
          <button v-for="(c, i) in chapters" :key="c.id" type="button" role="tab" class="ch-t" :class="{ on: i === ci }" :aria-selected="i === ci" @click="ci = i">
            <small>{{ c.y }}</small><b class="sc">{{ c.g }}</b><i class="ct-s">{{ c.t }}</i><em>{{ c.maps.length }} mapas</em>
          </button>
        </div>
        <div class="ch-pane" role="tabpanel" :aria-label="ch.g + ' · ' + ch.t">
          <p class="ch-intro">{{ ch.intro }}</p>
          <ol class="sg">
            <li v-for="(m, j) in ch.maps" :key="ch.id + j" class="sg-i">
              <span class="sg-img" :style="{ backgroundPosition: mapBp(m.i) }" role="img" :aria-label="'Pantalla de ' + m.n"><b class="sc">{{ String(start + j + 1).padStart(2, "0") }}</b></span>
              <div class="sg-c">
                <span class="sg-w">{{ m.w }}</span>
                <h3 class="sc">{{ m.n }}</h3>
                <p>{{ m.b }}</p>
                <p v-if="spoilers.shown(ch.id + j)" class="tl-sp">{{ m.sp }}</p>
                <div class="sg-a">
                  <button type="button" class="spoil" @click="spoilers.toggle(ch.id + j)">{{ spoilers.shown(ch.id + j) ? "Ocultar el giro" : "Mostrar el giro" }}</button>
                  <RouterLink v-if="m.h" class="sg-l" :to="m.h">Ficha del mapa →</RouterLink>
                </div>
              </div>
            </li>
          </ol>
          <div v-if="ch.id === 'bo4'" class="chaos">
            <h3 class="sc">La otra historia: Caos</h3>
            <p>Black Ops 4 abre en paralelo una historia nueva, sin relación con el Aether. Estos son sus cuatro mapas, en orden.</p>
            <div class="chaos-g">
              <article v-for="m in state.data.chaos" :key="m.n" class="cx">
                <span class="sg-img" :style="{ backgroundPosition: mapBp(m.i) }" role="img" :aria-label="'Pantalla de ' + m.n"></span>
                <div>
                  <span class="sg-w">{{ m.w }}</span>
                  <h4 class="sc">{{ m.n }}</h4>
                  <p>{{ m.b }}</p>
                  <RouterLink v-if="m.h" class="sg-l" :to="m.h">Ficha del mapa →</RouterLink>
                </div>
              </article>
            </div>
          </div>
          <div class="ch-nav">
            <button v-if="ci > 0" type="button" class="btn-o" @click="ci--">← {{ chapters[ci - 1].g }}</button>
            <button v-if="ci < chapters.length - 1" type="button" class="btn-o nx" @click="ci++">{{ chapters[ci + 1].g }} →</button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import CodDataState from "./CodDataState.vue";
import { mapBp } from "./sprites.js";

const props = defineProps({
  state: { type: Object, required: true },
  spoilers: { type: Object, required: true },
});

const ci = ref(0);
const chapters = computed(() => props.state.data?.saga || []);
const ch = computed(() => chapters.value[ci.value] || { maps: [] });
// Número de mapa dentro de toda la saga (el capítulo empieza donde acaba el anterior).
const start = computed(() => chapters.value.slice(0, ci.value).reduce((a, c) => a + c.maps.length, 0));
</script>
