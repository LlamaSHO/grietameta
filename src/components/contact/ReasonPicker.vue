<template>
  <!-- Motivos del mensaje como tarjetas (grupo de radio accesible con flechas). -->
  <div>
    <p :id="labelId" class="legend">¿Sobre qué nos escribes?</p>
    <div ref="group" class="reasons" role="radiogroup" :aria-labelledby="labelId" @keydown="onKey">
      <button
        v-for="r in reasons"
        :key="r.id"
        type="button"
        class="rs"
        :class="{ on: r.id === modelValue }"
        role="radio"
        :aria-checked="r.id === modelValue ? 'true' : 'false'"
        :tabindex="r.id === modelValue ? 0 : -1"
        @click="$emit('update:modelValue', r.id)"
      >
        <span class="ri" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="r.icon" /></svg>
        </span>
        <b>{{ r.label }}</b>
        <small>{{ r.hint }}</small>
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";

const props = defineProps({
  reasons: { type: Array, required: true }, // [{ id, label, hint, icon }]
  modelValue: { type: String, required: true },
  labelId: { type: String, default: "lg-motivo" },
});
const emit = defineEmits(["update:modelValue"]);
const group = ref(null);

// Flechas para moverse entre motivos, como un grupo de radio nativo.
function onKey(e) {
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (!step) return;
  e.preventDefault();
  const i = props.reasons.findIndex((r) => r.id === props.modelValue);
  const next = props.reasons[(i + step + props.reasons.length) % props.reasons.length];
  emit("update:modelValue", next.id);
  nextTick(() => group.value?.querySelector('[aria-checked="true"]')?.focus());
}
</script>

<style scoped>
.legend {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #C6CBD2;
}
.reasons {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 0 0 8px;
}
.rs {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-height: 118px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.025);
  color: var(--ink);
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition: border-color 0.25s, background 0.25s, transform 0.25s;
}
.rs:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.22);
}
.rs:focus-visible {
  outline: 2px solid var(--gold-hi);
  outline-offset: 2px;
}
.rs .ri {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.06);
  color: #C6CBD2;
  transition: background 0.25s, color 0.25s;
}
.rs b {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}
.rs small {
  font-size: 12px;
  color: var(--ink-mute);
  line-height: 1.35;
}
.rs.on {
  border-color: rgba(232, 184, 101, 0.7);
  background: rgba(212, 160, 74, 0.08);
}
.rs.on .ri {
  background: linear-gradient(180deg, #E8B865, #C8913A);
  color: #17120A;
}
.rs.on::after {
  content: "";
  position: absolute;
  top: 12px;
  right: 12px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--gm-gold);
  box-shadow: 0 0 0 4px rgba(243, 200, 120, 0.18);
}

@media (max-width: 1100px) {
  .reasons {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 860px) {
  .reasons {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .rs {
    min-height: 0;
  }
  .rs:last-child {
    grid-column: 1 / -1;
  }
}
</style>
