<template>
  <!-- Sprite frontal de la hoja sprites-front.png (id = número de Pokédex). -->
  <span class="spr" :style="{ backgroundPosition: sp(id) }" :role="label ? 'img' : undefined" :aria-label="label || undefined" :aria-hidden="label ? undefined : 'true'"></span>
</template>

<script setup>
import { sp } from "./pokeData";
defineProps({ id: { type: Number, required: true }, label: { type: String, default: "" } });
</script>
