<template>
  <!-- Progreso del mapa de Zelda: santuarios, torres y semillas. -->
  <div class="prog">
    <template v-for="r in rows" :key="r.id">
      <div class="row"><span>{{ r.label }}</span><b>{{ r.done }} / {{ r.total }}</b></div>
      <div class="pb" :class="r.id"><i :style="{ width: pct(r) }"></i></div>
    </template>
    <p v-if="storage === 'cuenta'">Tu progreso se guarda en tu cuenta.</p>
    <p v-else>Tu progreso se guarda en este navegador. <RouterLink to="/login">Inicia sesión</RouterLink> para guardarlo en tu cuenta.</p>
  </div>
</template>

<script setup>
defineProps({
  // [{ id: "sh" | "tw" | "sd", label, done, total }]
  rows: { type: Array, required: true },
  // "cuenta" o "navegador" (useZeldaProgress().storage)
  storage: { type: String, default: "navegador" },
});

const pct = (r) => `${r.total ? Math.min(100, (r.done / r.total) * 100).toFixed(1) : 0}%`;
</script>

<style scoped>
.prog {
  padding: 14px;
  border-radius: 14px;
  background: rgba(216, 194, 122, 0.06);
  border: 1px solid rgba(216, 194, 122, 0.22);
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13.5px;
}
.pb + .row {
  margin-top: 12px;
}
.row b {
  color: #F1E7C8;
}
.pb {
  height: 8px;
  margin-top: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.pb i {
  display: block;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(90deg, #D8C27A, #F1E7C8);
  transition: width 0.5s var(--ease-out);
}
.pb.tw i {
  background: linear-gradient(90deg, #8B6CF0, #C7B5FF);
}
.pb.sd i {
  background: linear-gradient(90deg, #8DCB45, #D4F59A);
}
p {
  margin: 8px 0 0;
  font-size: 12px;
  color: #93AAA3;
}
</style>
