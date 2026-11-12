<template>
  <!-- Fila de filtros: etiqueta + chips. Con `all` añade «Todos» delante y,
       con `toggle`, pulsar el chip activo lo desmarca. -->
  <div class="frow">
    <span :id="labelId" class="flabel">{{ label }}</span>
    <div class="fchips" role="group" :aria-labelledby="labelId">
      <button v-if="all" type="button" class="fchip" :aria-pressed="String(modelValue === '')" @click="emit('update:modelValue', '')">
        {{ allLabel }}<small v-if="allCount !== null">{{ allCount }}</small>
      </button>
      <button
        v-for="o in options"
        :key="o.value"
        type="button"
        class="fchip"
        :class="o.cls"
        :aria-pressed="String(modelValue === o.value)"
        @click="pick(o.value)"
      >
        <span v-if="o.dot" class="dot" aria-hidden="true"></span>{{ o.label }}<small v-if="o.count !== undefined">{{ o.count }}</small>
      </button>
    </div>
  </div>
</template>

<script>
// Contador del módulo: un id distinto por fila (para aria-labelledby).
let seq = 0;
</script>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  // [{ value, label, count?, cls?, dot? }]
  options: { type: Array, required: true },
  modelValue: { type: String, default: "" },
  all: { type: Boolean, default: true },
  allLabel: { type: String, default: "Todos" },
  allCount: { type: Number, default: null },
  toggle: { type: Boolean, default: true },
});
const emit = defineEmits(["update:modelValue"]);
const labelId = `arc-frow-${++seq}`;

function pick(v) {
  emit("update:modelValue", props.toggle && props.modelValue === v ? "" : v);
}
</script>

<style scoped>
.frow { display: flex; align-items: flex-start; gap: 8px 14px; }
.flabel {
  flex-shrink: 0;
  min-width: 96px;
  padding-top: 8px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--arc-faint);
}
@media (max-width: 640px) {
  .frow { flex-direction: column; gap: 8px; }
  .flabel { padding-top: 0; }
}
</style>
