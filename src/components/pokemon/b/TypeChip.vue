<script setup>
import { TIPOS } from "./datos.js";
defineProps({ k: { type: String, required: true }, sm: { type: Boolean, default: true } });
</script>

<template>
  <span class="ty" :class="['t-' + k, { sm }]"><i></i>{{ TIPOS[k] }}</span>
</template>
