<template>
  <div class="view-home">

    <header class="hub-hero">
      <div class="wrap">
        <h1>Elige tu <em>juego</em></h1>
        <p class="lead">Builds, tier lists y guías con datos reales. Escoge un juego o búscalo por nombre; si todavía no lo tenemos, pídelo.</p>
        <GameSearch big :shortcut="false" />
      </div>
    </header>

    <main class="wrap">
      <div class="games-grid">
        <RouterLink v-for="g in games" :key="g.slug" class="game-card" :to="g.url">
          <GameIcon :game="g" />
          <span class="g-body">
            <h3>{{ g.name }}</h3>
            <p>{{ g.tagline }}</p>
          </span>
          <GameBadge :status="g.status" />
        </RouterLink>
      </div>
      <p class="games-note">¿Echas de menos algún juego? Escríbelo en el buscador de arriba y te diremos cómo pedirlo.</p>
    </main>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import GameSearch from "@/components/GameSearch.vue";
import GameIcon from "@/components/GameIcon.vue";
import GameBadge from "@/components/GameBadge.vue";
import { fetchGames } from "@/services/games";
import "@/assets/styles/views/home.css";

const games = ref([]);

onMounted(async () => {
  games.value = await fetchGames();
});
</script>
