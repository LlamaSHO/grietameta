<template>
  <!-- Estado "¡Mensaje enviado!". -->
  <div class="sent" role="status">
    <div class="okc">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>
    </div>
    <h2>¡Mensaje enviado!</h2>
    <p>Lo hemos recibido con el asunto «{{ subject }}». Te contestaremos a tu email en cuanto podamos.</p>
    <p v-if="copyTo" class="copy">Te hemos enviado una copia a <strong>{{ copyTo }}</strong>.</p>
    <div class="row">
      <button type="button" class="btn" @click="$emit('again')">Enviar otro mensaje</button>
      <RouterLink class="btn" to="/">Volver a la portada</RouterLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subject: { type: String, required: true },
  copyTo: { type: String, default: "" },
});
defineEmits(["again"]);
</script>

<style scoped>
.sent {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 10px;
  animation: fade 0.4s ease both;
}
.okc {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(79, 224, 182, 0.12);
  border: 1px solid rgba(79, 224, 182, 0.45);
  color: #7FEBCB;
  animation: pop 0.6s var(--ease-out) both;
}
h2 {
  margin: 20px 0 0;
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
p {
  margin: 8px 0 0;
  max-width: 460px;
  color: var(--ink-dim);
  font-size: 15.5px;
  overflow-wrap: anywhere;
}
p.copy {
  font-size: 14px;
}
p strong {
  color: var(--ink);
}
.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 20px;
  border-radius: 13px;
  border: 1px solid var(--line-strong);
  background: none;
  color: var(--ink);
  font: 600 14.5px/1 var(--font-body);
  text-decoration: none;
  cursor: pointer;
}
.btn:hover {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.05);
}
@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@keyframes pop {
  0% { transform: scale(0.6); opacity: 0; }
  60% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
</style>
