<template>
  <!-- Aviso dentro del formulario: error (naranja) u ok (turquesa). -->
  <div class="alert" :class="type" :role="type === 'err' ? 'alert' : 'status'">
    <svg v-if="type === 'err'" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><line x1="12" y1="7.5" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.6" /></svg>
    <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>
    <span><slot /></span>
  </div>
</template>

<script setup>
defineProps({ type: { type: String, default: "err" } }); // "err" | "ok"
</script>

<style scoped>
.alert {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13.5px;
  animation: fade 0.3s ease both;
}
.alert svg {
  flex-shrink: 0;
  margin-top: 1px;
}
.alert.err {
  background: rgba(255, 106, 61, 0.09);
  border: 1px solid rgba(255, 106, 61, 0.35);
  color: #FFB59C;
}
.alert.ok {
  background: rgba(79, 224, 182, 0.08);
  border: 1px solid rgba(79, 224, 182, 0.35);
  color: #9FF0D6;
}
@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
</style>
