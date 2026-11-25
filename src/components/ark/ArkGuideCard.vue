<script setup>
defineProps({ guide: { type: Object, required: true } });
const requirements = [['Materiales', 'materiales'], ['Criaturas', 'criaturas'], ['Engramas', 'engramas']];
</script>

<template>
  <details class="guide">
    <summary>
      <span class="g-num">{{ guide.number }}</span>
      <span class="g-title"><b>{{ guide.titulo }}</b><small>{{ guide.resumen }}</small></span>
      <span class="g-facts"><span>{{ guide.dificultad }}</span><span>Niv. {{ guide.nivel }}+</span><span>{{ guide.tiempo }}</span></span>
      <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </summary>
    <div class="guide-body">
      <p>{{ guide.resumen }}</p>
      <div class="guide-grid">
        <ol class="steps"><li v-for="step in guide.pasos" :key="step">{{ step }}</li></ol>
        <aside class="need" aria-label="Requisitos de la guía">
          <h3>Ficha rápida</h3>
          <template v-for="[title, key] in requirements" :key="key">
            <h4>{{ title }}</h4>
            <ul><li v-for="item in guide[key]" :key="item">{{ item }}</li></ul>
          </template>
          <p><b>{{ guide.utilidad }}:</b> {{ guide.utilidadNota }}</p>
        </aside>
      </div>
    </div>
  </details>
</template>

<style scoped>
.guide { margin-bottom: 12px; border: 1px solid #b8ad8e; border-radius: 4px; color: var(--ark-ink); background: var(--ark-paper); box-shadow: 0 10px 22px #0005; }
.guide[open] { box-shadow: 0 10px 22px #0006, inset 0 0 0 2px #62b43ca6; }
summary { display: grid; grid-template-columns: 42px minmax(0, 1fr) minmax(145px, auto) 20px; gap: 12px; align-items: center; padding: 14px 16px; min-height: 76px; list-style: none; cursor: pointer; }
summary::-webkit-details-marker { display: none; }
.g-num { display: grid; place-items: center; height: 38px; width: 38px; border: 1px solid #b8ad8e; color: #1d5c8c; font: 700 19px/1 var(--ark-hand); }
.g-title b { display: block; color: var(--ark-ink); font: 700 21px/1.2 var(--ark-hand); }
.g-title small { display: block; margin-top: 5px; color: var(--ark-muted); font-size: 13px; line-height: 1.45; }
.g-facts { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 5px; }
.g-facts span { padding: 3px 6px; border: 1px solid #b8ad8e; border-radius: 3px; color: var(--ark-muted); font-size: 11px; }
.chev { width: 20px; height: 20px; color: #32661e; }
.guide[open] .chev { transform: rotate(180deg); }
.guide-body { padding: 0 16px 18px 72px; border-top: 1px solid #b8ad8e; color: var(--ark-muted); }
.guide-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(165px, 210px); gap: 18px; }
.steps { margin: 0; padding-left: 23px; }
.steps li { padding: 0 0 10px 5px; }
.steps li::marker { color: #1d5c8c; font-weight: 700; }
.need { padding: 12px; background: #ddd0b0; border: 1px solid #b8ad8e; border-radius: 3px; font-size: 13px; }
.need h3 { margin: 0 0 8px; color: var(--ark-ink); font: 700 21px/1.2 var(--ark-hand); }
.need h4 { margin: 8px 0 4px; color: var(--ark-ink); font-size: 12px; }
.need ul { margin: 0; padding-left: 17px; }
.need p { margin-bottom: 0; }
.need b { color: #32661e; }
@media (max-width: 680px) {
  summary { grid-template-columns: 32px minmax(0, 1fr) 18px; gap: 7px; padding: 12px 10px; }
  .g-num { width: 31px; height: 32px; }
  .g-title b { font-size: 19px; }
  .g-facts { grid-column: 2; grid-row: 2; justify-content: flex-start; }
  .chev { grid-column: 3; grid-row: 1; width: 17px; height: 17px; }
  .guide-body { padding: 0 14px 14px; }
  .guide-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>