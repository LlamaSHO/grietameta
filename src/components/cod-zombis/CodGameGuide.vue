<template>
  <!-- Página de un juego de la saga (Black Ops 1 a 4). Los cuatro comparten esta
       estructura: lo que cambia está en datos/cod-zombis/<slug>.json.
       Diseño: models/paginas/CodBO1..4.dc.html -->
  <CodPage>
    <div v-if="state.status !== 'ready'" class="wrap cz-wait">
      <CodDataState :state="state" />
    </div>
    <template v-else>
      <CodGameHero :g="g" />

      <section id="mapas" class="sec">
        <div class="wrap">
          <div class="sec-h">
            <div>
              <span class="kicker">Elige mapa</span>
              <h2 class="h2">Los mapas de {{ g.title }}</h2>
              <p>Cada ficha reúne la Pack-a-Punch, las ventajas, las armas y el Easter egg paso a paso. Los pasos y los finales se quedan ocultos hasta que los pidas.</p>
            </div>
          </div>
          <div class="rail" :class="g.maps.length === 8 ? 'c4' : 'c6'" role="tablist" aria-label="Mapas">
            <button v-for="(x, i) in g.maps" :key="x.id" type="button" role="tab" class="rc" :class="{ on: i === mi }" :aria-selected="i === mi" :style="{ '--mc': x.c }" @click="go(i, false)">
              <span class="rc-img"><img v-if="x.img" :src="x.img" alt="" loading="lazy" decoding="async" /><i v-else class="stencil">{{ x.ini }}</i></span>
              <span class="rc-t"><span class="rc-n sc">{{ String(i + 1).padStart(2, "0") }}</span><b>{{ x.n }}</b><small>{{ x.dlc }}</small></span>
            </button>
          </div>
        </div>
      </section>

      <CodMapSheet :maps="g.maps" :index="mi" @go="go" />
      <CodGameStory :g="g" />
      <CodOtherGames :current="slug" />
    </template>
  </CodPage>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CodPage from "./CodPage.vue";
import CodDataState from "./CodDataState.vue";
import CodGameHero from "./CodGameHero.vue";
import CodMapSheet from "./CodMapSheet.vue";
import CodGameStory from "./CodGameStory.vue";
import CodOtherGames from "./CodOtherGames.vue";
import { useGameData } from "@/composables/useGameData.js";
import "./cod-game.css";

const props = defineProps({
  /* bo1 · bo2 · bo3 · bo4 */
  slug: { type: String, required: true },
});

const route = useRoute();
const state = useGameData(`/data/cod-zombis/${props.slug}.json`);
const g = computed(() => state.data);

// Mapa abierto. La ruta puede traer el mapa en el ancla (/cod-zombis/black-ops#kino).
const mi = ref(0);
function fromHash() {
  const id = route.hash.slice(1);
  const k = g.value?.maps.findIndex((x) => x.id === id) ?? -1;
  if (k >= 0) mi.value = k;
  return k >= 0;
}
const prefersReduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function go(i, scroll) {
  mi.value = (i + g.value.maps.length) % g.value.maps.length;
  if (scroll) nextTick(() => document.getElementById("mapa")?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" }));
}

// Los datos llegan después de la ruta: al estar listos se abre el mapa del ancla y se baja a él.
watch(
  () => [state.status, route.hash],
  () => {
    if (state.status !== "ready") return;
    if (fromHash()) nextTick(() => document.getElementById(route.hash.slice(1))?.scrollIntoView({ behavior: "auto", block: "start" }));
  },
  { immediate: true },
);
</script>

<style>
.cdp .cz-wait {
  padding-top: 120px;
  padding-bottom: 160px;
}
</style>
