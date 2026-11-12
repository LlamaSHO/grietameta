<template>
  <!-- Avatar con iniciales; con Premium lleva el anillo dorado que gira (.ava de MiPremium.dc.html). -->
  <span class="ava" :class="{ premium }" :style="{ '--s': `${size}px` }" aria-hidden="true">
    <b>{{ initials }}</b>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  size: { type: Number, default: 52 },
  premium: { type: Boolean, default: false },
});

const initials = computed(
  () =>
    props.name
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "?"
);
</script>

<style scoped>
.ava {
  position: relative;
  width: var(--s);
  height: var(--s);
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.ava::before {
  content: "";
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}
.ava.premium::before {
  background: conic-gradient(#F3C878, #C8913A, #F3C878 50%, #8A6326, #F3C878);
  animation: gm-spin 5s linear infinite;
}
.ava b {
  position: relative;
  width: calc(var(--s) - 6px);
  height: calc(var(--s) - 6px);
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #1B2230;
  color: var(--ink);
  font: 700 calc(var(--s) * 0.29) / 1 var(--font-body);
}
</style>
