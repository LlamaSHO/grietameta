<template>
  <!-- Nav central del sitio. La barra principal es igual en todas las
       páginas (logo · buscador · cuenta); debajo, cada juego pone la suya
       (ver components/nav/games). -->
  <header class="site-nav">
    <div class="bar">
      <div class="wrap bar-in">
        <RouterLink class="brand" to="/" aria-label="GrietaMeta, inicio">
          <span class="brand-mark" aria-hidden="true" />
          <span class="brand-name">GRIETA<span>META</span></span>
        </RouterLink>

        <div class="search-slot">
          <GameSearch />
        </div>

        <NavAccount />
      </div>
    </div>

    <nav v-if="gameNav" class="subbar" :aria-label="`Secciones de ${gameNav.name}`">
      <div class="wrap subbar-in">
        <RouterLink class="game-chip" :to="gameNav.home">
          <GameIcon v-if="game" :game="game" />
          <span>{{ gameNav.name }}</span>
        </RouterLink>
        <component :is="gameNav.component" />
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import GameSearch from "@/components/GameSearch.vue";
import GameIcon from "@/components/GameIcon.vue";
import NavAccount from "@/components/nav/NavAccount.vue";
import { GAME_NAVS } from "@/components/nav/games";
import { fetchGames } from "@/services/games";

// slug del juego de la página actual (meta.game de la ruta), o null.
const props = defineProps({ gameSlug: { type: String, default: null } });

const gameNav = computed(() => (props.gameSlug ? GAME_NAVS[props.gameSlug] : null));

// Datos del juego (icono) desde games.json.
const games = ref([]);
fetchGames().then((g) => (games.value = g));
const game = computed(() => games.value.find((g) => g.slug === props.gameSlug) || null);

// La barra del juego cambia el alto del nav; las anclas lo tienen en cuenta.
watchEffect(() => {
  document.documentElement.style.setProperty("--subnav-h", gameNav.value ? "46px" : "0px");
});
</script>

<style scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 13, 18, 0.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--panel-line);
}

.wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 28px;
}

/* ---- barra principal ---- */
.bar-in {
  display: grid;
  grid-template-columns: 1fr minmax(0, 560px) 1fr;
  align-items: center;
  gap: 24px;
  height: var(--nav-h);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink);
  justify-self: start;
}
.brand-mark {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, var(--gold), var(--teal));
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  flex-shrink: 0;
}
.brand-name {
  font-family: "Cinzel", serif;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.brand-name span {
  color: var(--gold);
}

.search-slot {
  min-width: 0;
}
.search-slot :deep(.game-search) {
  max-width: none;
  margin: 0;
}

/* ---- barra del juego ---- */
.subbar {
  border-top: 1px solid rgba(38, 45, 58, 0.6);
  background: rgba(16, 20, 28, 0.6);
}
.subbar-in {
  display: flex;
  align-items: center;
  gap: 26px;
  height: var(--subnav-h);
  overflow-x: auto;
  scrollbar-width: none;
}
.subbar-in::-webkit-scrollbar {
  display: none;
}

.game-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding-right: 22px;
  border-right: 1px solid var(--panel-line);
  color: var(--ink);
  text-decoration: none;
  font-family: "Cinzel", serif;
  font-size: 14px;
  font-weight: 600;
}
.game-chip :deep(.g-ico) {
  flex: 0 0 26px;
  width: 26px;
  height: 26px;
  font-size: 8px;
}

/* Enlaces de cada juego (los componentes de games/ usan .sub-link). */
.subbar :deep(.sub-link) {
  position: relative;
  flex-shrink: 0;
  color: var(--ink-dim);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 0;
  transition: color 0.15s ease;
}
.subbar :deep(.sub-link:hover) {
  color: var(--ink);
}
.subbar :deep(.sub-link.is-active)::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--gold);
}
.subbar :deep(.sub-link.is-active) {
  color: var(--ink);
}

@media (max-width: 860px) {
  .bar-in {
    grid-template-columns: auto 1fr;
    grid-template-rows: var(--nav-h) auto;
    height: auto;
    row-gap: 0;
    padding-bottom: 12px;
  }
  .search-slot {
    grid-column: 1 / -1;
    grid-row: 2;
  }
  .wrap {
    padding: 0 16px;
  }
}
@media (max-width: 480px) {
  .brand-name {
    display: none;
  }
}
</style>
