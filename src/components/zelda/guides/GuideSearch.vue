<template>
  <!-- Buscador de las guías (estilo .fld del diseño de Zelda). -->
  <div class="gs">
    <GuideIcon name="buscar" :size="16" class="gs-ic" />
    <label class="sr-only" :for="id">{{ label }}</label>
    <input
      :id="id"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      @input="$emit('update:modelValue', $event.target.value)"
      @keydown.esc="$emit('update:modelValue', '')"
    >
    <button v-if="modelValue" type="button" class="gs-x" aria-label="Borrar búsqueda" @click="$emit('update:modelValue', '')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
    </button>
  </div>
</template>

<script setup>
import GuideIcon from "./GuideIcon.vue";

defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Buscar…" },
  label: { type: String, default: "Buscar en la guía" },
  id: { type: String, default: "zg-q" },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.gs {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
}
.gs-ic {
  position: absolute;
  left: 14px;
  color: #8fa8a1;
  pointer-events: none;
}
.gs input {
  width: 100%;
  height: 46px;
  border-radius: 13px;
  border: 1px solid rgba(127, 235, 203, 0.16);
  background: rgba(127, 235, 203, 0.04);
  color: #e6eeea;
  font: inherit;
  font-size: 15px;
  padding: 0 42px 0 40px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.gs input::-webkit-search-cancel-button {
  display: none;
}
.gs input::placeholder {
  color: #7f978f;
}
.gs input:focus {
  border-color: rgba(79, 224, 182, 0.6);
  box-shadow: 0 0 0 4px rgba(79, 224, 182, 0.14);
}
.gs-x {
  position: absolute;
  right: 8px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 9px;
  background: rgba(127, 235, 203, 0.08);
  color: #a4b9b2;
  cursor: pointer;
}
.gs-x:hover {
  color: #e6eeea;
  background: rgba(127, 235, 203, 0.16);
}
</style>
