<script setup>
import { g1p } from "./datos.js";
defineProps({ id: { type: Number, required: true }, title: { type: String, default: "" } });
</script>

<template>
  <span class="g1s" :title="title || undefined" :style="{ backgroundPosition: g1p(id) }"></span>
</template>
