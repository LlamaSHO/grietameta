<template>
  <RouterLink
    v-for="l in links"
    :key="l.hash"
    class="sub-link"
    :class="{ 'is-active': route.path === '/lol' && route.hash === l.hash }"
    :to="{ path: '/lol', hash: l.hash }"
  >
    {{ l.label }}
  </RouterLink>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const links = [
  { hash: "#tierlist", label: "Tier list" },
  { hash: "#campeones", label: "Campeones" },
  { hash: "#premium", label: "Premium" },
];
</script>
