<template>
  <div class="view-home">
    <nav class="nav">
      <div class="wrap">
        <RouterLink class="brand" to="/">
          <div class="brand-mark" />
          <div class="brand-name">GRIETA<span>META</span></div>
        </RouterLink>
        <div class="nav-links">
          <RouterLink to="/" class="is-current">Juegos</RouterLink>
          <RouterLink to="/lol">League of Legends</RouterLink>
        </div>
      </div>
    </nav>

    <header class="hub-hero">
      <div class="wrap">
        <h1>Elige tu <em>juego</em></h1>
        <p class="lead">Builds, tier lists y guías con datos reales. Escoge un juego o búscalo por nombre; si todavía no lo tenemos, pídelo.</p>
        <GameSearch big />
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

    <footer>
      <div class="wrap">
        <div>© 2026 GrietaMeta. Todos los derechos reservados. Prohibida su reproducción total o parcial sin permiso.</div>
        <div>GrietaMeta es un sitio de fans, no está afiliado a los estudios de los juegos mencionados. Las marcas pertenecen a sus propietarios. · <RouterLink to="/privacidad">Privacidad</RouterLink></div>
      </div>
    </footer>
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
