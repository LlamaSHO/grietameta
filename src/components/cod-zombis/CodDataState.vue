<template>
  <p v-if="state.status === 'error'" class="cz-state err" role="alert">
    No hemos podido cargar estos datos.
    <button type="button" @click="state.reload()">Reintentar</button>
  </p>
  <p v-else class="cz-state" role="status">Cargando…</p>
</template>

<script setup>
/* Estado de carga o de error de un JSON de public/data/cod-zombis/ (useGameData). */
defineProps({ state: { type: Object, required: true } });
</script>

<style>
.cdp .cz-state {
  margin: 8px 0 0;
  padding: 22px;
  border-radius: 16px;
  border: 1px dashed rgba(236, 228, 214, 0.2);
  background: rgba(18, 17, 16, 0.8);
  color: #a19b92;
  font-size: 14.5px;
}
.cdp .cz-state.err {
  border-color: rgba(226, 54, 75, 0.5);
  color: #ffb4bd;
}
.cdp .cz-state button {
  margin-left: 10px;
  border: 0;
  background: none;
  color: #ffb066;
  font: 600 14px/1 "IBM Plex Sans", sans-serif;
  cursor: pointer;
  text-decoration: underline;
}
</style>
