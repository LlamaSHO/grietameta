<template>
  <!-- Hexágono con el logo del juego. Si la imagen no existe, se ven las siglas. -->
  <span class="g-ico" aria-hidden="true">
    {{ game.short || String(game.name).slice(0, 3) }}
    <img v-if="game.icon && !failed" :src="game.icon" alt="" loading="lazy" @error="failed = true">
  </span>
</template>

<script setup>
import { ref } from "vue";

defineProps({ game: { type: Object, required: true } });
const failed = ref(false);
</script>
