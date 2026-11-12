<template>
  <!-- Icono de un punto del mapa de Zelda con su tarjeta al pasar el ratón.
       Props sencillas (texto y booleanos) para que, al marcar o seleccionar
       un punto, solo se vuelva a pintar ese icono. -->
  <button
    type="button"
    class="zpin m"
    :class="[kind, { sky, done, sel: selected }]"
    :style="{ left: `${x}%`, top: `${y}%` }"
    :aria-label="label + (done ? ', hecho' : '')"
    @click="$emit('pick', id)"
  >
    <span class="zpin-tip">
      <b>{{ label }}</b>
      <small>{{ sub }}</small>
      <em :class="{ ok: done }">{{ status }}</em>
    </span>
  </button>
</template>

<script setup>
import "./zelda-pins.css";

defineProps({
  // Clave del punto (se devuelve en el evento pick).
  id: { type: String, required: true },
  // Clase del icono: p-sh, p-tw, p-cv, p-sd o p-sd2 (kolog con amigo).
  kind: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  label: { type: String, required: true },
  sub: { type: String, default: "" },
  status: { type: String, default: "" },
  sky: { type: Boolean, default: false },
  done: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
});
defineEmits(["pick"]);
</script>
