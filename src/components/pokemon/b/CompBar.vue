<script setup>
import { RouterLink } from "vue-router";
defineProps({ active: { type: Number, default: 1 } });
</script>

<template>
  <div class="cbar">
    <div class="wrap cbar-in">
      <span class="cb-r">
        <span class="cb-ic" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5" /><path d="M13 19l6-6M16 16l4 4M19 21l2-2" /><path d="M9.5 6.5L13 3h3v3l-3.5 3.5" /><path d="M5 14l4 4M7 17l-3 3M3 19l2 2" /></svg>
        </span>
        <span><small>Pokémon</small><b class="fd">Competitivo</b></span>
      </span>
      <nav class="cb-t" aria-label="Secciones de Competitivo">
        <RouterLink class="ct" :class="{ on: active === 1 }" to="/pokemon/competitivo"><span class="cn c1">VGC</span>Pokémon Champions<em>Oficial</em></RouterLink>
        <RouterLink class="ct" :class="{ on: active === 2 }" to="/pokemon/competitivo/showdown"><span class="cn c2">PS</span>Pokémon Showdown<em class="nof">Simulador</em></RouterLink>
        <RouterLink class="ct" :class="{ on: active === 3 }" to="/pokemon/competitivo/equipo"><span class="cn c3">+6</span>Crea tu equipo</RouterLink>
      </nav>
      <span class="cb-v"><span class="dot"></span>Reglamento M-C · Temporada M-8</span>
    </div>
  </div>
</template>
