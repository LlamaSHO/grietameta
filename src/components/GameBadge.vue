<template>
  <span v-if="status === 'building'" class="g-badge g-soon">En construcción</span>
  <span v-else-if="status === 'soon'" class="g-badge g-soon">Próximamente</span>
  <span v-else-if="status === 'progress'" class="g-badge g-soon">En progreso</span>
  <span v-else class="g-badge g-live">Disponible</span>
</template>

<script setup>
defineProps({ status: { type: String, default: "live" } });
</script>
