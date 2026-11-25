<script setup>
defineProps({ request: { type: Object, required: true } });
</script>

<template>
  <slot v-if="request.status === 'ready'" />
  <p v-else-if="request.status === 'loading'" class="ark-data-state" role="status">Cargando apuntes del ARK…</p>
  <div v-else class="ark-data-state" role="alert">
    <p>No se pudieron cargar los apuntes del ARK.</p>
    <button type="button" @click="request.reload()">Volver a intentar</button>
  </div>
</template>

<style scoped>
.ark-data-state { margin-block: 20px; padding: 16px; border-radius: 4px; background: #eae0c8; color: #2b2a1e; }
.ark-data-state p { margin: 0 0 8px; }
button { padding: 6px 12px; font: inherit; color: inherit; background: #ddd0b0; border: 1px solid #786747; border-radius: 3px; cursor: pointer; }
</style>
