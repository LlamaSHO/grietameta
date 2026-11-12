<template>
  <!-- Logo del juego. Si la imagen no existe o falla, se ven las siglas. -->
  <span class="g-ico" aria-hidden="true">
    <img v-if="game.icon && !failed" :src="game.icon" alt="" loading="lazy" @error="failed = true">
    <template v-else>{{ game.short || String(game.name).slice(0, 3) }}</template>
  </span>
</template>

<script setup>
import { ref } from "vue";

defineProps({ game: { type: Object, required: true } });
const failed = ref(false);
</script>
