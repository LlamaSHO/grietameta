<template>
  <!-- Portada (/). Diseño: models/paginas/Main.dc.html.
       El nav, el footer y la barra inferior de móvil los pinta App.vue. -->
  <div class="home">
    <HomeHero />
    <GamePanels />
    <RequestGameCta />
  </div>
</template>

<script setup>
import HomeHero from "@/components/home/HomeHero.vue";
import GamePanels from "@/components/home/GamePanels.vue";
import RequestGameCta from "@/components/home/RequestGameCta.vue";
</script>

<style scoped>
.home {
  position: relative;
  overflow-x: clip;
  padding-bottom: 8px;
}
</style>
