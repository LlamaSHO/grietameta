<template>
  <!-- Campo de texto con icono a la izquierda (usuario o email). -->
  <label class="field" :for="id">
    {{ label }}
    <span class="inp" :class="{ bad }">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <template v-if="icon === 'user'"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></template>
        <template v-else><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></template>
      </svg>
      <input
        :id="id"
        v-model.trim="model"
        :type="type"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :aria-invalid="bad ? 'true' : undefined"
        required
      >
    </span>
  </label>
</template>

<script setup>
const model = defineModel({ type: String, default: "" });
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: "mail" }, // "mail" | "user"
  type: { type: String, default: "text" },
  autocomplete: { type: String, default: undefined },
  placeholder: { type: String, default: "" },
  maxlength: { type: [Number, String], default: undefined },
  bad: { type: Boolean, default: false },
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
  padding: 0 16px 0 44px;
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
@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
</style>
