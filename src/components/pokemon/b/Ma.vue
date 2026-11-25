<script setup>
import { metaPos } from "./datos.js";
defineProps({ ids: { type: Array, required: true }, pid: { type: Number, required: true }, big: { type: Boolean, default: false } });
</script>

<template>
  <span class="ma" :class="{ big }" :style="{ backgroundPosition: metaPos(ids, pid) }"></span>
</template>
