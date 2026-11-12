<template>
  <!-- Fila de objetos con icono de Data Dragon.
       join: "or" (alternativas: A o B), "seq" (orden de compra: A → B → C) o "none". -->
  <div class="items">
    <template v-for="(it, i) in items" :key="`${it.id || it.name}-${i}`">
      <span v-if="i > 0 && join === 'or'" class="or">o</span>
      <svg v-else-if="i > 0 && join === 'seq'" class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg>
      <span class="item" :class="size" :tabindex="focusable ? 0 : undefined">
        <i v-if="numbered">{{ i + 1 }}</i>
        <img v-if="it.icon && !broken[it.icon]" :src="it.icon" :alt="it.name" loading="lazy" @error="broken[it.icon] = true">
        <span v-else class="noimg" aria-hidden="true">{{ it.name.slice(0, 2) }}</span>
        <span class="tip" role="tooltip">{{ it.name }}</span>
      </span>
    </template>
  </div>
</template>

<script setup>
import { reactive } from "vue";

defineProps({
  items: { type: Array, required: true }, // [{ id, name, icon }]
  join: { type: String, default: "none" },
  numbered: { type: Boolean, default: false },
  size: { type: String, default: "md" }, // md (44 px) · lg (48 px)
  // false dentro de un enlace (no se puede anidar elementos enfocables).
  focusable: { type: Boolean, default: true },
});
// Si un icono no carga se enseña un cuadrado con las iniciales. Se apunta por
// URL (no por posición): el componente se reutiliza al pasar de un campeón a otro.
const broken = reactive({});
</script>

<style scoped>
.items { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.item {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  transition: transform 0.25s;
  outline: none;
}
.item.lg { width: 48px; height: 48px; border-radius: 11px; }
.item:hover,
.item:focus-visible { transform: translateY(-3px); }
.item img,
.item .noimg {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  border: 1px solid rgba(226, 181, 102, 0.4);
  display: block;
}
.item .noimg {
  display: grid;
  place-items: center;
  background: #151A23;
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
}
.item i {
  position: absolute;
  top: -6px;
  left: -6px;
  z-index: 1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--gold-hi);
  color: #17120A;
  font-style: normal;
  font-size: 10.5px;
  font-weight: 800;
}
.tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 5px 9px;
  border-radius: 7px;
  background: #151A23;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
  color: var(--ink);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 5;
}
.item:hover .tip,
.item:focus-visible .tip,
.item:focus .tip { opacity: 1; }
.arrow { color: var(--ink-faint); flex-shrink: 0; }
.or { font-size: 12px; color: var(--ink-faint); }
</style>
