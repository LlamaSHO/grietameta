<template>
  <RouterLink
    v-for="l in links"
    :key="l.hash"
    class="sub-link"
    :class="{ 'is-active': route.hash === l.hash }"
    :to="{ path: '/zelda', hash: l.hash }"
  >
    {{ l.label }}
  </RouterLink>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const links = [
  { hash: "#semillas", label: "Semillas" },
  { hash: "#santuarios", label: "Santuarios" },
  { hash: "#misiones", label: "Misiones" },
  { hash: "#armaduras", label: "Armaduras" },
  { hash: "#conjuntos", label: "Conjuntos" },
];
</script>
