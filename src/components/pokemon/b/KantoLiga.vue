<script setup>
/* Liga Pokémon de Kanto: Alto Mando y Campeón, con combates marcables. */
import { computed, reactive, ref, watch } from "vue";
import G1 from "./G1.vue";
import TypeChip from "./TypeChip.vue";
import { leer, guardar } from "./datos.js";

const props = defineProps({
  liga: { type: Object, required: true },
  amarillo: { type: Boolean, default: false },
});

const CLAVE = "gm-pk-kanto-liga";
const vencidos = reactive(leer(CLAVE, {}));
const rv = ref(0);
watch(vencidos, (v) => guardar(CLAVE, v), { deep: true });
watch(() => props.amarillo, () => { rv.value = 0; });

const campeon = computed(() => props.liga.champ[props.amarillo ? "y" : "rb"]);

const rondas = computed(() => {
  const r = props.liga.rounds.map((x, j) => ({
    id: j, n: x.n, role: x.role + " · " + (j + 1), k: x.t[0], t: x.t,
    team: x.team, how: x.how, use: x.use, champ: false,
  }));
  const ch = campeon.value;
  r.push({
    id: 4, n: props.amarillo ? "Tu rival" : "Azul, tu rival", role: "Campeón de la Liga", k: "normal", t: ["normal"],
    team: ch.vars[rv.value][1], how: ch.how, champ: true,
    use: props.amarillo ? ["fire", "ice", "electric"] : ["electric", "ice", "water"],
  });
  return r;
});

function alternar(id) {
  vencidos[id] = !vencidos[id];
}
</script>

<template>
  <div class="liga">
    <div class="lg-prep">
      <b class="fd">Antes de entrar</b>
      <ul><li v-for="x in liga.prep" :key="x">{{ x }}</li></ul>
    </div>
    <ol class="ladder">
      <li v-for="r in rondas" :key="r.id" class="rnd" :class="['t-' + r.k, { champ: r.champ, won: vencidos[r.id] }]">
        <div class="rnd-h">
          <span class="medal2"><i class="tglyph"></i></span>
          <div class="rnd-t">
            <small>{{ r.role }}</small>
            <b class="fd">{{ r.n }}</b>
            <span class="tys"><TypeChip v-for="t in r.t" :key="t" :k="t" /></span>
          </div>
          <button type="button" class="chk" :aria-pressed="!!vencidos[r.id]" :aria-label="'Marcar a ' + r.n + ' como vencido'" @click="alternar(r.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6" /></svg>
          </button>
        </div>
        <div v-if="r.champ" class="vars">
          <span>{{ campeon.q }}</span>
          <button v-for="(v, j) in campeon.vars" :key="v[0]" type="button" :class="{ on: j === rv }" @click="rv = j">{{ v[0] }}</button>
        </div>
        <div class="lteam">
          <span v-for="(m, j) in r.team" :key="j" class="tm"><G1 :id="m[0]" /><b>{{ m[1] }}</b><small class="px">Nv{{ m[2] }}</small></span>
        </div>
        <p class="how">{{ r.how }}</p>
        <div class="use"><span>Lleva</span><TypeChip v-for="t in r.use" :key="t" :k="t" /></div>
      </li>
    </ol>
  </div>
</template>
