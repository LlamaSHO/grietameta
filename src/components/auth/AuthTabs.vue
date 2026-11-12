<template>
  <!-- Pestañas Iniciar sesión / Crear cuenta con la "pastilla" que se desliza.
       Patrón de pestañas accesible: solo la activa entra en el orden de
       tabulación y las flechas (e Inicio/Fin) cambian de pestaña. -->
  <div ref="list" class="tabs" role="tablist" aria-label="Acceso" @keydown="onKey">
    <span class="tthumb" :class="{ r: modelValue === 'register' }" aria-hidden="true" />
    <button
      v-for="t in TABS"
      :id="`tab-${t.id}`"
      :key="t.id"
      type="button"
      role="tab"
      class="tab"
      :class="{ on: modelValue === t.id }"
      :aria-selected="modelValue === t.id ? 'true' : 'false'"
      :aria-controls="controls || undefined"
      :tabindex="modelValue === t.id ? 0 : -1"
      @click="$emit('update:modelValue', t.id)"
    >
      {{ t.label }}
    </button>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";

const props = defineProps({
  modelValue: { type: String, required: true },
  // id del panel que controlan las pestañas (el formulario).
  controls: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);
const list = ref(null);

const TABS = [
  { id: "login", label: "Iniciar sesión" },
  { id: "register", label: "Crear cuenta" },
];

function onKey(e) {
  const i = TABS.findIndex((t) => t.id === props.modelValue);
  const next = {
    ArrowRight: (i + 1) % TABS.length,
    ArrowLeft: (i - 1 + TABS.length) % TABS.length,
    Home: 0,
    End: TABS.length - 1,
  }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  emit("update:modelValue", TABS[next].id);
  nextTick(() => list.value?.querySelector('[aria-selected="true"]')?.focus());
}
</script>

<style scoped>
.tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 5px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 30px;
}
.tthumb {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  width: calc(50% - 5px);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.45s var(--ease-out);
}
.tthumb.r {
  transform: translateX(100%);
}
.tab {
  position: relative;
  z-index: 1;
  height: 44px;
  border: none;
  background: none;
  color: var(--ink-dim);
  font: 600 14.5px/1 var(--font-body);
  cursor: pointer;
  transition: color 0.25s;
}
.tab:hover,
.tab.on {
  color: var(--ink);
}
.tab:focus-visible {
  outline: 2px solid var(--gold-hi);
  outline-offset: -2px;
  border-radius: 11px;
}
</style>
