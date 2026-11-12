<template>
  <!-- Pantalla "Ya has iniciado sesión": avatar con anillo tricolor y accesos. -->
  <div class="done">
    <div class="ava" aria-hidden="true"><b>{{ initials }}</b></div>
    <h1 class="title">Ya has iniciado sesión</h1>
    <p>Estás conectado como <strong>{{ name }}</strong><template v-if="email"> ({{ email }})</template>.</p>
    <div class="row">
      <RouterLink class="btn-gold" :to="continueTo">Continuar</RouterLink>
      <RouterLink class="btn-ghost" :to="premium ? '/cuenta/premium' : '/cuenta'">{{ premium ? "Mi Premium" : "Mi cuenta" }}</RouterLink>
      <button type="button" class="btn-ghost" :disabled="busy" @click="$emit('logout')">
        {{ busy ? "Cerrando…" : "Cerrar sesión" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  premium: { type: Boolean, default: false },
  continueTo: { type: String, default: "/" },
  busy: { type: Boolean, default: false },
});
defineEmits(["logout"]);

// Dos letras para el avatar: iniciales del nombre o el principio del email.
const initials = computed(() => {
  const words = (props.name || props.email || "TU").replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  const s = words.length > 1 ? words[0][0] + words[words.length - 1][0] : (words[0] || "TU").slice(0, 2);
  return s.toUpperCase();
});
</script>

<style scoped>
.done {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  animation: fade 0.4s ease both;
}
.ava {
  position: relative;
  width: 84px;
  height: 84px;
  margin-bottom: 14px;
  display: grid;
  place-items: center;
  animation: pop 0.6s var(--ease-out) both;
}
.ava::before {
  content: "";
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: conic-gradient(var(--gm-gold), var(--gm-orange), var(--gm-teal), var(--gm-gold));
  animation: gm-spin 5s linear infinite;
}
.ava b {
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #1B2230;
  font: 700 24px/1 var(--font-brand);
  color: var(--ink);
}
.title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.done p {
  margin: 6px 0 0;
  color: var(--ink-dim);
  font-size: 15px;
  overflow-wrap: anywhere;
}
.done p strong {
  color: var(--ink);
}
.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
}
.btn-gold,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 13px;
  font: 600 15px/1 var(--font-body);
  text-decoration: none;
  cursor: pointer;
}
.btn-gold {
  gap: 10px;
  padding: 0 24px;
  background: linear-gradient(180deg, #E8B865, #C8913A);
  color: #17120A;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.btn-gold:hover {
  color: #17120A;
  filter: brightness(1.06);
}
.btn-ghost {
  padding: 0 22px;
  border: 1px solid var(--line-strong);
  background: none;
  color: var(--ink);
}
.btn-ghost:hover:not(:disabled) {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.05);
}
.btn-ghost:disabled {
  opacity: 0.6;
  cursor: default;
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
