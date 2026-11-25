<script setup>
/* Estado de carga / error de un useGameData() para las vistas del bloque B. */
defineProps({ estado: { type: Object, required: true } });
</script>

<template>
  <div v-if="estado.status === 'loading'" class="pkb-carga" role="status">Cargando datos…</div>
  <div v-else-if="estado.status === 'error'" class="pkb-carga pkb-error" role="alert">
    No se han podido cargar los datos.
    <button type="button" class="btn-o" @click="estado.reload()">Reintentar</button>
  </div>
  <slot v-else />
</template>

<style>
.pkb .pkb-carga { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; min-height: 40vh; color: #A3ACBA; font-weight: 600; }
.pkb .pkb-error { color: #FF8A8A; }
</style>
