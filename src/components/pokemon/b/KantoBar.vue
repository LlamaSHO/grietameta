<script setup>
import { RouterLink } from "vue-router";
import G1 from "./G1.vue";
defineProps({ active: { type: Number, default: 1 } });
const tabs = [
  { n: 1, t: "Historia", to: "/pokemon/kanto" },
  { n: 2, t: "Mapa interactivo", to: "/pokemon/kanto/mapa" },
  { n: 3, t: "Guía al 100 %", to: "/pokemon/kanto/100" },
  { n: 4, t: "Pokédex de Kanto", to: "/pokemon/pokedex" },
];
</script>

<template>
  <div class="kbar">
    <div class="wrap kbar-in">
      <span class="kb-r">
        <G1 :id="6" />
        <span><small>Gen I · 1996</small><b class="fd">Kanto</b></span>
      </span>
      <nav class="kb-t" aria-label="Secciones de Kanto">
        <RouterLink v-for="t in tabs" :key="t.n" class="kt" :class="{ on: t.n === active }" :to="t.to">
          <span class="kn">{{ t.n }}</span>{{ t.t }}
        </RouterLink>
      </nav>
      <span class="kb-v">Rojo · Azul · Amarillo</span>
    </div>
  </div>
</template>
