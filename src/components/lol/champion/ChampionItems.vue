<template>
  <section class="card" aria-labelledby="it-h">
    <div class="card-h"><h2 id="it-h" class="disp">Objetos</h2><span class="meta">Orden de compra</span></div>
    <template v-if="build">
      <div class="path">
        <div v-if="build.starter.length" class="prow">
          <h4>Inicio</h4>
          <BuildItems :items="build.starter" join="or" size="lg" />
        </div>
        <div v-if="build.boots.length" class="prow">
          <h4>Botas</h4>
          <BuildItems :items="build.boots" size="lg" />
        </div>
        <div v-if="build.core.length" class="prow">
          <h4>Núcleo</h4>
          <BuildItems :items="build.core" join="seq" numbered size="lg" />
        </div>
        <div v-if="build.situational.length" class="prow">
          <h4>Situacional</h4>
          <BuildItems :items="build.situational" size="lg" />
        </div>
      </div>
      <p class="bnote">Basado en {{ fmtInt(build.sampleGames) }} partidas analizadas de todos los rangos.</p>
    </template>
    <p v-else class="loading">{{ emptyText }}</p>
  </section>
</template>

<script setup>
import BuildItems from "../BuildItems.vue";
import { fmtInt } from "@/services/lol/format";

defineProps({
  build: { type: Object, default: null },
  emptyText: { type: String, default: "Aún no hay partidas suficientes de este campeón para mostrar su build." },
});
</script>

<style scoped>
.path { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 14px; }
.prow { display: grid; grid-template-columns: 96px 1fr; align-items: center; gap: 12px; }
.prow h4 { margin: 0; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-mute); }
.bnote { margin: 0; padding: 0 20px 18px; font-size: 12.5px; color: var(--ink-mute); }
@media (max-width: 860px) {
  .prow { grid-template-columns: 1fr; gap: 8px; }
}
</style>
