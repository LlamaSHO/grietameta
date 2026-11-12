<template>
  <!-- Selector Mensual / Anual (.bill de Premium.dc.html). v-model: "monthly" | "yearly". -->
  <div class="bill" role="group" aria-label="Forma de pago">
    <span class="bthumb" :class="{ y: modelValue === 'yearly' }" aria-hidden="true" />
    <button
      type="button"
      class="bopt"
      :class="{ on: modelValue === 'monthly' }"
      :aria-pressed="modelValue === 'monthly'"
      @click="emit('update:modelValue', 'monthly')"
    >
      Mensual
    </button>
    <button
      type="button"
      class="bopt"
      :class="{ on: modelValue === 'yearly' }"
      :aria-pressed="modelValue === 'yearly'"
      @click="emit('update:modelValue', 'yearly')"
    >
      Anual <span class="save">-33%</span>
    </button>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: "yearly" } });
const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped>
.bill {
  position: relative;
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  padding: 5px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.035);
}
.bthumb {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  width: calc(50% - 5px);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(232, 184, 101, 0.22), rgba(200, 145, 58, 0.14));
  border: 1px solid rgba(232, 184, 101, 0.45);
  transition: transform 0.45s var(--ease-out);
}
.bthumb.y {
  transform: translateX(100%);
}
.bopt {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 150px;
  height: 46px;
  padding: 0 18px;
  border: none;
  background: none;
  border-radius: 12px;
  color: var(--ink-dim);
  font: 600 15px/1 var(--font-body);
  cursor: pointer;
  transition: color 0.25s;
}
.bopt:hover {
  color: var(--ink);
}
.bopt.on {
  color: var(--gm-gold);
}
.save {
  padding: 3px 7px;
  border-radius: 6px;
  background: var(--gm-teal);
  color: #062019;
  font: 700 11.5px/1 var(--font-brand);
  letter-spacing: 0.02em;
}
@media (max-width: 520px) {
  .bopt {
    min-width: 0;
  }
}
</style>
