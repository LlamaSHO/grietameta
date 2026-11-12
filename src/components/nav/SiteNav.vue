<template>
  <!-- Nav central del sitio. La barra principal es igual en todas las
       páginas (logo · buscador · cuenta); debajo, cada juego pone la suya
       (ver components/nav/games). Estilos en assets/styles/nav.css. -->
  <header class="site-nav" :class="{ 'menus-closed': menusClosed }" @mouseenter="menusClosed = false" @mouseleave="menusClosed = false">
    <div class="wrap bar-in">
      <RouterLink class="brand" to="/" aria-label="GrietaMeta, inicio">
        <GmMark :size="26" />
        <span class="brand-name">GRIETA<span>META</span></span>
      </RouterLink>

      <div class="search-slot">
        <GameSearch />
      </div>

      <NavAccount />
    </div>

    <nav v-if="gameNav" class="sub" :aria-label="`Secciones de ${gameNav.name}`">
      <div class="wrap sub-in">
        <RouterLink class="gchip" :to="gameNav.home">
          <img :src="gameNav.logo" alt="">
          <span>{{ gameNav.name }}</span>
        </RouterLink>
        <component :is="gameNav.component" />
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import GmMark from "@/components/brand/GmMark.vue";
import GameSearch from "@/components/GameSearch.vue";
import NavAccount from "@/components/nav/NavAccount.vue";
import { GAME_NAVS } from "@/components/nav/games";

// slug del juego de la página actual (meta.game de la ruta), o null.
const props = defineProps({ gameSlug: { type: String, default: null } });

const gameNav = computed(() => (props.gameSlug ? GAME_NAVS[props.gameSlug] : null));

// Tras pulsar un enlace de un mega-menú, este se cierra aunque el ratón siga
// encima; vuelve a abrirse cuando el ratón sale del nav y vuelve a entrar.
const route = useRoute();
const menusClosed = ref(false);
watch(
  () => route.fullPath,
  () => {
    menusClosed.value = true;
    if (document.activeElement?.closest?.(".site-nav .mega")) document.activeElement.blur();
  }
);

// La barra del juego cambia el alto del nav; las anclas lo tienen en cuenta.
// En el diseño la de LoL mide 48 px y las de ARC y Zelda 50.
watchEffect(() => {
  const h = !gameNav.value ? 0 : gameNav.value.zone === "lol" ? 48 : 50;
  document.documentElement.style.setProperty("--subnav-h", `${h}px`);
});
</script>
