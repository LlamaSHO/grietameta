<template>
  <!-- Filtro de opciones (estilo .layers / .ly del diseño de Zelda).
       variant="seg": control segmentado · variant="chips": chips sueltos que bajan de línea. -->
  <div class="sg" :class="variant" role="group" :aria-label="label">
    <span v-if="title" class="sg-t">{{ title }}</span>
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="sg-b"
      :class="{ on: o.value === modelValue, off: o.count === 0 && o.value !== modelValue }"
      :aria-pressed="o.value === modelValue"
      @click="$emit('update:modelValue', o.value)"
    >
      <i v-if="o.dot" class="sg-dot" :style="{ background: o.dot }" />
      {{ o.label }}
      <small v-if="o.count != null">{{ o.count }}</small>
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: "" },
  // [{ value, label, count?, dot? }]
  options: { type: Array, required: true },
  label: { type: String, default: "" },
  title: { type: String, default: "" },
  variant: { type: String, default: "seg" },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.sg {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}
.sg.seg {
  padding: 4px;
  border-radius: 14px;
  background: #0a1816;
  border: 1px solid rgba(127, 235, 203, 0.12);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}
.sg.seg::-webkit-scrollbar {
  display: none;
}
.sg.chips {
  flex-wrap: wrap;
  gap: 6px;
}
.sg-t {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #7f978f;
  margin-right: 6px;
}
.sg-b {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  height: 38px;
  padding: 0 13px;
  border-radius: 11px;
  border: 0;
  background: transparent;
  color: #a4b9b2;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, opacity 0.2s;
}
.sg.chips .sg-b {
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(127, 235, 203, 0.14);
  font-size: 13px;
}
.sg-b:hover {
  color: #e6eeea;
  background: rgba(127, 235, 203, 0.06);
}
.sg-b.on {
  background: rgba(79, 224, 182, 0.15);
  color: #7febcb;
  box-shadow: inset 0 0 0 1px rgba(79, 224, 182, 0.4);
}
.sg.chips .sg-b.on {
  border-color: rgba(79, 224, 182, 0.5);
  box-shadow: none;
}
.sg-b.off {
  opacity: 0.45;
}
.sg-b:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.sg-b small {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  color: #93aaa3;
  font-variant-numeric: tabular-nums;
}
.sg-b.on small {
  background: rgba(79, 224, 182, 0.18);
  color: #a8f5de;
}
.sg-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
@media (max-width: 560px) {
  /* En móvil el control ocupa todo el ancho y los botones se reparten el sitio. */
  .sg.seg {
    width: 100%;
  }
  .sg.seg .sg-b {
    flex: 1 0 auto;
    justify-content: center;
    gap: 5px;
    padding: 0 8px;
    font-size: 13px;
  }
  .sg-dot {
    display: none;
  }
  .sg-t {
    display: none;
  }
}
</style>
