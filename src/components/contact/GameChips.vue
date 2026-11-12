<template>
  <!-- "¿De qué juego se trata?": chips con logo. Volver a pulsar el elegido lo
       quita, así que son botones de alternar (aria-pressed) y no radios: un
       grupo de radio no se puede dejar sin elegir. -->
  <div class="field">
    <span :id="labelId">¿De qué juego se trata? <small>(opcional)</small></span>
    <div class="chips" role="group" :aria-labelledby="labelId">
      <button
        v-for="g in games"
        :key="g.id"
        type="button"
        class="chip"
        :class="{ on: g.id === modelValue, gen: !g.img }"
        :aria-pressed="g.id === modelValue ? 'true' : 'false'"
        @click="$emit('update:modelValue', g.id === modelValue ? '' : g.id)"
      >
        <img v-if="g.img" :src="g.img" alt="">
        {{ g.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  games: { type: Array, required: true }, // [{ id, label, img }]
  modelValue: { type: String, default: "" },
  labelId: { type: String, default: "lg-donde" },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #D6D3CB;
  animation: fade 0.35s ease both;
}
.field small {
  font-weight: 400;
  color: var(--ink-mute);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px 0 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: none;
  color: #C6CBD2;
  font: 500 13.5px/1 var(--font-body);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}
.chip img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.chip.gen {
  padding-left: 14px;
}
.chip:hover {
  border-color: rgba(255, 255, 255, 0.26);
  color: var(--ink);
}
.chip:focus-visible {
  outline: 2px solid var(--gold-hi);
  outline-offset: 2px;
}
.chip.on {
  border-color: rgba(232, 184, 101, 0.65);
  background: rgba(212, 160, 74, 0.1);
  color: var(--gm-gold);
}
@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
</style>
