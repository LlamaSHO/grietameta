<template>
  <section class="card">
    <div class="card-h"><h3 class="disp">Resumen del parche</h3></div>
    <div class="patch">
      <div class="big"><b>{{ patch.label }}</b><span>parche actual</span></div>
      <template v-if="patch.real">
        <div class="kv"><span>Partidas analizadas</span><b>{{ fmtInt(patch.games) }}</b></div>
        <div class="kv"><span>Campeones con datos</span><b>{{ patch.championsWithData }}</b></div>
      </template>
      <div v-else class="kv"><span>Estadísticas</span><b>Ilustrativas</b></div>
      <div class="kv"><span>Región y cola</span><b>{{ patch.region }} · Solo/dúo</b></div>
      <div v-if="patch.generatedAt" class="kv"><span>Actualizado</span><b>{{ fmtDate(patch.generatedAt) }}</b></div>
    </div>
  </section>
</template>

<script setup>
import { fmtDate, fmtInt } from "@/services/lol/format";

defineProps({ patch: { type: Object, required: true } });
</script>

<style scoped>
.patch { padding: 0 20px 18px; display: flex; flex-direction: column; gap: 10px; }
.big { display: flex; align-items: baseline; gap: 10px; }
.big b {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  background: linear-gradient(90deg, #C8AA6E, #0AC8B9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.big span { font-size: 13px; color: var(--ink-mute); }
.kv {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13.5px;
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.kv span { color: var(--ink-mute); }
.kv b { font-weight: 600; text-align: right; }
</style>
