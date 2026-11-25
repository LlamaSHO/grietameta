<template>
  <!-- Estado de carga / error de los datos de una página de Pokémon. -->
  <section class="pk-status" :class="status" role="status" aria-live="polite">
    <template v-if="status === 'error'">
      <b>No se han podido cargar los datos.</b>
      <span>Comprueba la conexión e inténtalo de nuevo.</span>
      <button type="button" class="btn-y" @click="retry">Reintentar</button>
    </template>
    <template v-else>
      <i class="pk-status-dot" aria-hidden="true"></i>
      <span>Cargando datos…</span>
    </template>
  </section>
</template>

<script setup>
defineProps({ status: { type: String, default: "loading" }, retry: { type: Function, default: () => {} } });
</script>

<style scoped>
.pk-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 50vh;
  padding: 40px 16px;
  text-align: center;
  color: #a3acba;
  font-size: 15px;
}
.pk-status b {
  color: #eef1f6;
  font: 600 20px/1.2 "Fredoka", sans-serif;
}
.pk-status-dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-top-color: #ffcb3d;
  animation: pk-status-spin 0.9s linear 6;
}
@keyframes pk-status-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
