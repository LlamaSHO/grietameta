<template>
  <!-- Contraseña con botón de mostrar/ocultar y, al crear cuenta, medidor
       de seguridad (4 barras). El enlace "¿La has olvidado?" va en el slot. -->
  <div class="field">
    <span class="fhead">
      <label :for="id">Contraseña</label>
      <slot name="aside" />
    </span>
    <span class="inp" :class="{ bad }">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
      <input
        :id="id"
        v-model="model"
        :type="shown ? 'text' : 'password'"
        :autocomplete="isNew ? 'new-password' : 'current-password'"
        :placeholder="isNew ? 'Mínimo 6 caracteres' : 'Tu contraseña'"
        :aria-invalid="bad ? 'true' : undefined"
        :aria-describedby="meter ? `${id}-meter` : undefined"
        required
      >
      <!-- Botón de alternar: etiqueta fija y aria-pressed (si la etiqueta
           cambiase, el lector diría "Ocultar contraseña, pulsado"). -->
      <button type="button" class="eye" aria-label="Mostrar contraseña" :title="shown ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="shown ? 'true' : 'false'" @click="shown = !shown">
        <svg v-if="!shown" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
      </button>
    </span>
    <span v-if="meter" :id="`${id}-meter`" class="meter" :class="`s${score}`" aria-live="polite">
      <span class="bars" aria-hidden="true"><i /><i /><i /><i /></span>
      {{ LABELS[score] }}
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const model = defineModel({ type: String, default: "" });
const props = defineProps({
  id: { type: String, default: "f-pass" },
  isNew: { type: Boolean, default: false }, // crear cuenta (autocompletado y pista)
  meter: { type: Boolean, default: false },
  bad: { type: Boolean, default: false },
});

const shown = ref(false);

const LABELS = ["Mínimo 6 caracteres", "Muy corta", "Aceptable", "Buena", "Fuerte"];

// 0 vacía · 1 menos de 6 · 2 válida · +1 si tiene 10 o más · +1 si mezcla números y símbolos.
const score = computed(() => {
  if (!props.meter) return 0;
  const v = model.value || "";
  let s = 0;
  if (v.length) s = v.length < 6 ? 1 : 2;
  if (v.length >= 10) s++;
  if (v.length >= 6 && /\d/.test(v) && /[^A-Za-z0-9]/.test(v)) s++;
  return Math.min(4, s);
});
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #D6D3CB;
  animation: fade 0.35s ease both;
}
.fhead {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.inp {
  position: relative;
  display: flex;
  align-items: center;
}
.inp > svg {
  position: absolute;
  left: 15px;
  color: #8A93A0;
  pointer-events: none;
  transition: color 0.2s;
}
.inp input {
  width: 100%;
  height: 50px;
  padding: 0 48px 0 44px;
  border-radius: 13px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(255, 255, 255, 0.035);
  color: var(--ink);
  font: 400 15px/1 var(--font-body);
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
  appearance: none;
}
.inp input::placeholder {
  color: var(--ink-faint);
}
.inp input:hover {
  border-color: rgba(255, 255, 255, 0.2);
}
.inp input:focus {
  border-color: rgba(212, 160, 74, 0.65);
  background: rgba(10, 13, 19, 0.9);
  box-shadow: 0 0 0 4px rgba(212, 160, 74, 0.14);
}
.inp:focus-within > svg {
  color: var(--gold-hi);
}
.inp.bad input {
  border-color: rgba(255, 106, 61, 0.6);
}
.eye {
  position: absolute;
  right: 6px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 10px;
  background: none;
  color: var(--ink-dim);
  cursor: pointer;
}
.eye:hover {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.06);
}
.eye:focus-visible {
  outline: 2px solid var(--gold-hi);
}

.meter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink-mute);
}
.bars {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
}
.bars i {
  height: 5px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.3s;
}
.meter.s1 .bars i:nth-child(-n + 1) { background: var(--gm-orange); }
.meter.s2 .bars i:nth-child(-n + 2) { background: #F28A1E; }
.meter.s3 .bars i:nth-child(-n + 3) { background: var(--gold-hi); }
.meter.s4 .bars i { background: var(--gm-teal); }

@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
</style>
