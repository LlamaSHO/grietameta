<template>
  <span class="ty" :class="['t-' + type, { sm }]"><i></i>{{ TN[type] }}</span>
</template>

<script setup>
import { TN } from "./pokeData";
defineProps({ type: { type: String, required: true }, sm: Boolean });
</script>
