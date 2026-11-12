<template>
  <!-- Interruptor (.tg de MiPremium.dc.html). v-model booleano. -->
  <button
    type="button"
    class="tg"
    :class="{ on: modelValue }"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    :disabled="disabled"
    @click="emit('update:modelValue', !modelValue)"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped>
.tg {
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 30px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s, opacity 0.2s;
}
.tg::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--ink-dim);
  transition: transform 0.3s var(--ease-out), background 0.25s;
}
.tg.on {
  background: rgba(212, 160, 74, 0.35);
  border-color: rgba(232, 184, 101, 0.7);
}
.tg.on::after {
  transform: translateX(22px);
  background: var(--gm-gold);
}
.tg:disabled {
  opacity: 0.55;
  cursor: progress;
}
.tg:focus-visible {
  outline: 2px solid var(--gm-gold);
  outline-offset: 3px;
}
</style>
