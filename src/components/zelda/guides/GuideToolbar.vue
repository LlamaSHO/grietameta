<template>
  <!-- Barra de herramientas común de las guías: buscador, recuento y filtros. -->
  <div class="gt" role="search">
    <div class="gt-top">
      <div class="gt-q"><slot name="search" /></div>
      <p class="gt-count" aria-live="polite">
        <b>{{ count }}</b> {{ countLabel }}
        <button v-if="canReset" type="button" class="gt-reset" @click="$emit('reset')">Quitar filtros</button>
      </p>
    </div>
    <div v-if="$slots.default" class="gt-filters"><slot /></div>
  </div>
</template>

<script setup>
defineProps({
  count: { type: [Number, String], default: 0 },
  countLabel: { type: String, default: "resultados" },
  canReset: { type: Boolean, default: false },
});
defineEmits(["reset"]);
</script>

<style scoped>
.gt {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  margin-bottom: 22px;
  border-radius: 20px;
  background: linear-gradient(180deg, #0b1d1a, #091714);
  border: 1px solid rgba(127, 235, 203, 0.14);
  box-shadow: 0 20px 40px -30px rgba(0, 0, 0, 0.9);
}
.gt-top {
  display: flex;
  align-items: center;
  gap: 12px 18px;
  flex-wrap: wrap;
}
.gt-q {
  flex: 1 1 320px;
  min-width: 0;
}
.gt-count {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px 10px;
  flex-wrap: wrap;
  font-size: 13.5px;
  color: #a9bdb6;
}
.gt-count b {
  font-family: var(--font-zelda);
  font-size: 18px;
  color: #f1e7c8;
}
.gt-reset {
  height: 30px;
  padding: 0 11px;
  border-radius: 9px;
  border: 1px solid rgba(216, 194, 122, 0.4);
  background: transparent;
  color: #e9dcaf;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.gt-reset:hover {
  background: rgba(216, 194, 122, 0.1);
}
.gt-filters {
  display: flex;
  align-items: center;
  gap: 10px 14px;
  flex-wrap: wrap;
  min-width: 0;
}
@media (max-width: 560px) {
  .gt {
    padding: 12px;
    border-radius: 16px;
  }
  .gt-filters > :deep(*) {
    max-width: 100%;
  }
}
</style>
