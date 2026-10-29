<template>
  <RouterLink
    v-for="l in links"
    :key="l.to"
    class="sub-link"
    active-class=""
    exact-active-class="is-active"
    :to="l.to"
  >
    {{ l.label }}
  </RouterLink>
</template>

<script setup>
const links = [
  { to: "/arc-raiders", label: "Objetos" },
  { to: "/arc-misiones", label: "Misiones" },
  { to: "/arc-enemigos", label: "Enemigos" },
];
</script>
