<template>
  <!-- Columna lateral: email directo, consejos y atajos a motivos. -->
  <aside class="side">
    <div class="sc">
      <h3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>Email directo</h3>
      <p>Si lo prefieres, escríbenos desde tu correo:</p>
      <a class="mail" :href="`mailto:${email}`">{{ email }}</a>
    </div>
    <div class="sc">
      <h3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12" y2="17.01" /></svg>Qué nos ayuda</h3>
      <ul>
        <li>En qué página y juego estabas.</li>
        <li>Qué esperabas ver y qué viste.</li>
        <li>Si es un dato, de dónde lo has sacado.</li>
      </ul>
    </div>
    <div class="sc">
      <h3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>Atajos</h3>
      <div class="quick">
        <button type="button" class="ql" @click="$emit('pick', 'juego')">Pedir un juego nuevo<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg></button>
        <button type="button" class="ql" @click="$emit('pick', 'error')">Avisar de un error<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg></button>
        <RouterLink class="ql" to="/premium">Dudas sobre Premium<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg></RouterLink>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({ email: { type: String, required: true } });
defineEmits(["pick"]);
</script>

<style scoped>
.side {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: rise 0.8s 0.16s var(--ease-out) both;
}
.sc {
  padding: 22px;
  border-radius: 22px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.025);
}
.sc h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
}
.sc h3 svg {
  color: var(--gold);
}
.sc p {
  margin: 8px 0 0;
  color: var(--ink-dim);
  font-size: 14px;
}
.sc ul {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #C6CBD2;
  font-size: 14px;
}
.sc li {
  display: flex;
  gap: 10px;
}
.sc li::before {
  content: "";
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-top: 8px;
  transform: rotate(45deg);
  background: var(--gm-teal);
}
.mail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(212, 160, 74, 0.08);
  border: 1px solid rgba(212, 160, 74, 0.3);
  color: var(--gold);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  word-break: break-all;
}
.mail:hover {
  color: #E8B865;
}
.quick {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.ql {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 46px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  color: var(--ink);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  background: none;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s, background 0.2s;
}
.ql:hover {
  color: var(--ink);
  border-color: rgba(212, 160, 74, 0.45);
  background: rgba(212, 160, 74, 0.05);
}
.ql svg {
  color: var(--ink-mute);
}
@keyframes rise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: none; }
}
</style>
