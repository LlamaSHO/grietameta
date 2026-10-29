<template>
  <span v-if="status === 'building'" class="g-badge g-soon">En construcción</span>
  <span v-else class="g-badge g-live">Disponible</span>
</template>

<script setup>
defineProps({ status: { type: String, default: "live" } });
</script>
