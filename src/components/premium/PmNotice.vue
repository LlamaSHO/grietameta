<template>
  <!-- Aviso corto (error, ok o info) con el estilo de los diseños de Premium. -->
  <p class="pm-notice" :class="type" :role="type === 'error' ? 'alert' : 'status'">
    <svg v-if="type === 'ok'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>
    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12.5" /><line x1="12" y1="16" x2="12" y2="16" /></svg>
    <span><slot /></span>
  </p>
</template>

<script setup>
defineProps({ type: { type: String, default: "error" } }); // "error" | "ok" | "info"
</script>
