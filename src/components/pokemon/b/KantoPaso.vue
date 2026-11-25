<script setup>
/* Un paso de la historia de Kanto: se abre, se marca como hecho y muestra gimnasio o Liga. */
import { computed } from "vue";
import G1 from "./G1.vue";
import TypeChip from "./TypeChip.vue";

const props = defineProps({
  paso: { type: Object, required: true },
  num: { type: Number, required: true },
  abierto: { type: Boolean, default: false },
  hecho: { type: Boolean, default: false },
});
defineEmits(["abrir", "hecho"]);

const mini = computed(() => (props.paso.gym ? props.paso.gym.team : props.paso.mon).slice(0, 4).map((m) => m[0]));
</script>

<template>
  <li class="stp" :class="{ done: hecho, isopen: abierto, gymst: !!paso.gym }">
    <div class="stp-rail">
      <button type="button" class="stp-n fd" :aria-pressed="hecho" :aria-label="'Marcar paso ' + num + ' como hecho'" @click="$emit('hecho')">
        <span class="num">{{ num }}</span>
        <span class="ok"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6" /></svg></span>
      </button>
    </div>
    <div class="stp-card">
      <button type="button" class="stp-h" :aria-expanded="abierto" @click="$emit('abrir')">
        <span><small>{{ paso.pl }}</small><b class="fd">{{ paso.t }}</b></span>
        <span class="stp-mini"><G1 v-for="(id, j) in mini" :key="j" :id="id" /></span>
        <span class="chev"><svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg></span>
      </button>
      <div v-if="abierto" class="stp-b">
        <div class="stp-l">
          <ul class="obj"><li v-for="o in paso.obj" :key="o">{{ o }}</li></ul>
          <template v-if="paso.mon.length">
            <h4 aria-level="3">Captura aquí</h4>
            <div class="mons"><span v-for="m in paso.mon" :key="m[0]" class="mon"><G1 :id="m[0]" />{{ m[1] }}</span></div>
          </template>
          <p v-if="paso.tip" class="tip"><b>Consejo</b>{{ paso.tip }}</p>
        </div>
        <div v-if="paso.gym" class="gym" :class="'t-' + paso.gym.k">
          <div class="gym-h">
            <span class="medal"><i class="tglyph"></i></span>
            <div><small>Líder de gimnasio</small><b class="fd">{{ paso.gym.l }}</b><TypeChip :k="paso.gym.k" /></div>
          </div>
          <div class="team">
            <span v-for="(m, j) in paso.gym.team" :key="j" class="tm"><G1 :id="m[0]" /><b>{{ m[1] }}</b><small class="px">Nv{{ m[2] }}</small></span>
          </div>
          <div class="rew"><span><small>Premio</small><b>{{ paso.gym.med }}</b></span><span><small>MT</small><b>{{ paso.gym.tmn }}</b></span></div>
        </div>
        <slot />
      </div>
    </div>
  </li>
</template>
