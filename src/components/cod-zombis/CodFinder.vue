<template>
  <!-- Buscador de mapas: «¿En qué mapa estás?» (diseño: #buscar) -->
  <section class="sec" id="buscar">
    <div class="wrap">
      <div class="finder">
        <div class="fd-h">
          <div><span class="kicker">Buscador</span><h2 class="h2">¿En qué mapa estás?</h2></div>
          <label class="fd-in">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.6" y2="16.6" /></svg>
            <input v-model="q" type="search" placeholder="Nombre del mapa, juego o lugar (Alcatraz, Luna, Titanic…)" autocomplete="off" aria-label="Buscar mapa" />
          </label>
        </div>
        <CodDataState v-if="state.status !== 'ready'" :state="state" />
        <template v-else>
          <div class="fd-f">
            <button v-for="f in FILTERS" :key="f[0]" type="button" class="fchip" :class="{ on: gf === f[0] }" @click="gf = f[0]">{{ f[1] }}</button>
            <span class="fd-n">{{ list.length }} {{ list.length === 1 ? "mapa" : "mapas" }}</span>
          </div>
          <div class="fd-g" data-pane>
            <RouterLink v-for="m in list" :key="m.href" class="fm" :to="m.href" :style="{ '--mc': m.c }">
              <span class="fm-i stencil">{{ m.ini }}</span>
              <span class="fm-t"><b>{{ m.n }}</b><small>{{ m.gt }} · {{ m.dlc }}</small></span>
              <span v-if="m.ee" class="fm-ee">EE</span>
            </RouterLink>
          </div>
          <div v-if="!list.length" class="fd-none">
            No hay ningún mapa con ese nombre en los Black Ops 1 a 4.
            <button type="button" @click="clear">Ver todos</button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import CodDataState from "./CodDataState.vue";
import { norm } from "./sprites.js";

const props = defineProps({ state: { type: Object, required: true } });

const FILTERS = [["all", "Todos"], ["BO1", "Black Ops"], ["BO2", "Black Ops II"], ["BO3", "Black Ops III"], ["BO4", "Black Ops 4"]];
const q = ref("");
const gf = ref("all");

// El texto normalizado de cada mapa se calcula una vez al llegar los datos.
const maps = computed(() => (props.state.data?.maps || []).map((m) => ({ ...m, kn: norm(m.k) })));
const list = computed(() => {
  const qn = norm(q.value.trim());
  return maps.value.filter((m) => (gf.value === "all" || m.g === gf.value) && (!qn || m.kn.includes(qn)));
});
function clear() {
  q.value = "";
  gf.value = "all";
}
</script>
