<script setup>
/* Ficha lateral de un lugar del mapa de Kanto. */
import G1 from "./G1.vue";


defineProps({
  sel: { type: Object, required: true },
  verName: { type: String, required: true },
});
defineEmits(["cerrar", "alternar"]);
</script>

<template>
  <aside class="drawer" :style="{ '--pc': sel.c }" aria-label="Ficha del lugar">
    <div class="dr-h">
      <span class="pin lg big" :class="'g-' + sel.g" :style="{ '--pc': sel.c }"></span>
      <div><small>{{ sel.kind }}</small><h2 class="fd">{{ sel.n }}</h2></div>
      <button type="button" class="x" aria-label="Cerrar" @click="$emit('cerrar')">✕</button>
    </div>
    <button type="button" class="mark" :class="{ on: sel.hecho }" :aria-pressed="sel.hecho" @click="$emit('alternar')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6" /></svg>
      {{ sel.hecho ? "Visitado" : "Marcar como visitado" }}
    </button>
    <div class="dr-b">
      <template v-if="sel.gym">
        <div class="gymb" :class="'t-' + sel.gym.k">
          <span class="medal"><i class="tglyph"></i></span>
          <div><small>Gimnasio · {{ sel.gym.med }}</small><b class="fd">{{ sel.gym.l }}</b><p>{{ sel.gym.tip }}</p></div>
        </div>
        <div class="team"><span v-for="(m, j) in sel.gym.team" :key="j" class="tm"><G1 :id="m.id" /><small class="px">Nv{{ m.lv }}</small></span></div>
      </template>
      <template v-if="sel.mon.length">
        <h4 aria-level="3">Pokémon en {{ verName }} <small>{{ sel.monN }}</small></h4>
        <ul class="ml">
          <li v-for="(m, j) in sel.mon" :key="j" :class="{ hl: m.hl }">
            <G1 :id="m.id" />
            <span class="mn"><b>{{ m.n }}</b><small>{{ m.lv }}</small></span>
            <span class="mth" :class="m.mc">{{ m.mt }}</span>
            <span class="rt2">{{ m.r }}</span>
          </li>
        </ul>
      </template>
      <div v-if="sel.sinMon" class="slot sm"><b>Sin Pokémon salvajes</b>En {{ verName }} no aparece ninguno aquí.</div>
      <template v-if="sel.sp.length">
        <h4 aria-level="3">Legendarios y regalos</h4>
        <ul class="il"><li v-for="i in sel.sp" :key="i.n"><G1 :id="i.id" /><span><b>{{ i.n }}</b><small>{{ i.how }}</small></span></li></ul>
      </template>
      <template v-if="sel.hm.length">
        <h4 aria-level="3">MO</h4>
        <ul class="il"><li v-for="i in sel.hm" :key="i.n"><span class="disc mo">MO{{ i.n }}</span><span><b>{{ i.m }}</b><small>{{ i.how }}</small></span></li></ul>
      </template>
      <template v-if="sel.tm.length">
        <h4 aria-level="3">MT</h4>
        <ul class="il"><li v-for="i in sel.tm" :key="i.no"><span class="disc" :class="'t-' + i.t">{{ i.no }}</span><span><b>{{ i.m }}</b><small>{{ i.how }}</small></span></li></ul>
      </template>
      <template v-if="sel.keys.length">
        <h4 aria-level="3">Objetos clave</h4>
        <ul class="il"><li v-for="i in sel.keys" :key="i.n"><span class="pin lg g-key" style="--pc: #FF9F43"></span><span><b>{{ i.n }}</b><small>{{ i.how }}</small></span></li></ul>
      </template>
      <template v-if="sel.items.length">
        <h4 aria-level="3">Objetos en el suelo</h4>
        <div class="its"><span v-for="i in sel.items" :key="i">{{ i }}</span></div>
      </template>
    </div>
  </aside>
</template>
