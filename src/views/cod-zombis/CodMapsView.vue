<template>
  <!-- Planos de los mapas de CoD Zombis (ruta /cod-zombis/planos/:mapa?).
       Diseño: models/paginas/CodMapas.dc.html -->
  <CodPage>
    <section class="wrap pl-hero">
      <span class="kicker">Planos de los mapas</span>
      <h1>Planos de Zombis</h1>
      <p>Cada mapa visto desde arriba, con sus zonas, puertas, ventajas, armas de pared, corriente, Pack-a-Punch, cajas misteriosas, Easter eggs y piezas para construir. Toca una zona para ver qué hay en ella. Los dibuja GrietaMeta: muestran cómo se conectan las zonas, no las distancias reales.</p>
    </section>

    <section v-if="state.status !== 'ready'" class="wrap pl-wait"><CodDataState :state="state" /></section>

    <section v-else id="plano" class="wrap" :style="{ '--mc': map.c }" aria-label="Plano del mapa">
      <div class="pl-pick">
        <div class="pl-games" role="group" aria-label="Juego">
          <button v-for="g in data.games" :key="g[0]" type="button" class="pl-game" :aria-pressed="g[0] === game" @click="goMap(data.order[g[0]][0])">{{ g[1] }}</button>
        </div>
        <div class="pl-maps" role="group" aria-label="Mapa">
          <button v-for="id in data.order[game]" :key="id" type="button" class="pl-map" :style="{ '--mc': data.maps[id].c }" :aria-pressed="id === mid" @click="goMap(id)"><i></i>{{ data.maps[id].n }}</button>
          <button v-for="p in pending" :key="p[0]" type="button" class="pl-map off" style="--mc: #4a453e" aria-pressed="false" aria-disabled="true"><i></i>{{ p[1] }}<small>plano en preparación</small></button>
        </div>
      </div>

      <div class="pl-grid">
        <div class="pl-card">
          <div class="pl-top">
            <div>
              <h2>{{ map.n }}<span v-if="map.aprox" class="pl-aprox">Distribución aproximada</span></h2>
              <small>{{ map.desc }}</small>
            </div>
            <div class="pl-layers" role="group" aria-label="Capas del plano">
              <button v-for="l in LAYERS" :key="l[0]" type="button" class="pl-layer" :style="{ '--lc': l[2] }" :aria-pressed="lay[l[0]]" @click="lay[l[0]] = !lay[l[0]]"><i></i>{{ l[1] }}</button>
            </div>
          </div>
          <CodPlanoStage :zones="zones" :edges="edges" :stage-cls="stageCls" :zid="zid" :steps="steps" :rstep="rstep" :view="view" @pick="pickZone" @view="patchView" />
          <div class="pl-legend">
            <span><b class="ic-spawn">I</b>Inicio</span><span><b class="ic-power">C</b>Corriente</span><span><b class="ic-pap">P</b>Pack-a-Punch</span><span><b class="ic-tp">T</b>Teletransporte</span><span><b class="ic-wall">A</b>Arma de pared</span><span><b class="ic-box">?</b>Caja misteriosa</span><span><b class="ic-ee">E</b>Easter egg</span><span><b class="ic-part">+</b>Pieza o construible</span><span><b class="ic-perk" style="--pc: #E2364B">J</b>Ventaja (inicial)</span><span><i class="ln"></i>Puerta</span><span><i class="ln tp"></i>Teletransporte</span><span><i class="ln bus"></i>Ruta del autobús</span>
          </div>
        </div>

        <div class="pl-side">
          <div class="pl-panel">
            <span class="kk">Zona</span>
            <h3>{{ zoneNode.n }}</h3>
            <p>{{ zoneNode.d }}</p>
            <ul v-if="zoneItems.length" class="pl-list">
              <li v-for="(it, i) in zoneItems" :key="i"><b :class="it.cls" :style="{ '--pc': it.c, '--bp': it.bp }">{{ it.k }}</b>{{ it.n }}<em>{{ it.cost }}</em></li>
            </ul>
            <p class="pl-conn">Conecta con: <span>{{ conn || "—" }}</span></p>
          </div>
          <div class="pl-panel">
            <h4>Cómo abrir el mapa</h4>
            <p class="pl-hint">Pulsa un paso para verlo en el plano.</p>
            <ol class="pl-route">
              <li v-for="(r, i) in steps" :key="i" :class="{ on: i === rstep }">
                <button type="button" :aria-pressed="i === rstep" @click="pickStep(i)"><b>{{ r.n }}</b><span>{{ r.t }}</span></button>
              </li>
            </ol>
            <div class="pl-pap"><span class="pl-papimg" aria-hidden="true"></span><p><b>Pack-a-Punch</b>{{ map.pap }}</p></div>
          </div>
          <div v-if="gItems.length" class="pl-panel">
            <h4>En todo el mapa</h4>
            <ul class="pl-list">
              <li v-for="(it, i) in gItems" :key="i"><b :class="it.cls" :style="{ '--pc': it.c, '--bp': it.bp }">{{ it.k }}</b>{{ it.n }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </CodPage>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import CodPage from "@/components/cod-zombis/CodPage.vue";
import CodDataState from "@/components/cod-zombis/CodDataState.vue";
import CodPlanoStage from "@/components/cod-zombis/CodPlanoStage.vue";
import { buildEdges, buildZones, connections, globalItems, itemsOf, LAYERS, routeSteps } from "@/components/cod-zombis/planoModel.js";
import { useGameData } from "@/composables/useGameData.js";
import "@/components/cod-zombis/cod-planos.css";

const route = useRoute();
const router = useRouter();
const state = useGameData("/data/cod-zombis/planos.json");
const data = computed(() => state.data);

// El mapa elegido va en la ruta (/cod-zombis/planos/:mapa?). Sin mapa, el primero de Black Ops.
const mid = computed(() => {
  const id = route.params.mapa;
  return data.value?.maps[id] ? id : data.value?.order.bo1[0];
});
const map = computed(() => data.value.maps[mid.value]);
const game = computed(() => map.value.game);
// Mapas de otros juegos que aún no tienen plano
const pending = computed(() => (data.value.pending[game.value] || []).filter(([id]) => !data.value.order[game.value].includes(id)));

function goMap(id) {
  // #plano: al cambiar de mapa el scroll se queda en el plano en vez de subir arriba del todo
  router.push({ name: "cod-maps", params: { mapa: id }, hash: "#plano" });
}

// Estado de la vista (local): zona, paso de la ruta, capas y cámara.
const zone = ref(null);
const rstep = ref(-1);
const lay = reactive({ perks: true, walls: true, obj: true, box: true, ee: true, parts: true, doors: true });
const view = reactive({ tilt: 52, spin: -22, z: 1 });
const patchView = (p) => Object.assign(view, p);
watch(mid, () => {
  zone.value = null;
  rstep.value = -1;
});

const zid = computed(() => {
  const m = map.value;
  return m.nodes.some((n) => n.id === zone.value) ? zone.value : (m.nodes.find((n) => (n.tags || []).includes("spawn")) || m.nodes[0]).id;
});
const steps = computed(() => routeSteps(map.value));
const zones = computed(() => buildZones(map.value, data.value.perki));
const edges = computed(() => buildEdges(map.value));
const stageCls = computed(() => LAYERS.filter(([k]) => lay[k] === false).map(([k]) => "no-" + k).join(" ") + (map.value.sky ? " open" : ""));

const zoneNode = computed(() => map.value.nodes.find((n) => n.id === zid.value));
const zoneItems = computed(() => itemsOf(map.value, zid.value, data.value.perki));
const conn = computed(() => connections(map.value, zid.value));
const gItems = computed(() => globalItems(map.value, data.value.perki));

function pickZone(id) {
  zone.value = id;
}
function pickStep(i) {
  rstep.value = i;
  if (steps.value[i].nd) zone.value = steps.value[i].nd;
}
</script>

<style>
.cdp .pl-wait {
  padding-top: 40px;
  padding-bottom: 120px;
}
</style>
