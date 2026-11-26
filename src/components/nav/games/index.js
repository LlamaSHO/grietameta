/* Barra de navegación de cada juego, debajo del nav central.
   La clave es el slug de src/data/games.json, y cada ruta indica el suyo
   en meta.game (src/router/index.js). `subH` (opcional) es el alto de la barra en px (50 por defecto). `zone` es el data-zone que App.vue pone
   en .app-shell (acento y estilo de la barra). Para un juego nuevo: crea su
   componente aquí al lado (enlaces con la clase .slink, desplegables con
   .dd + .mega; estilos en assets/styles/nav.css) y añádelo. */

import { defineAsyncComponent } from "vue";

// Cada barra (y su CSS) se descarga solo al entrar en su juego.
const LolNav = defineAsyncComponent(() => import("./LolNav.vue"));
const ArcRaidersNav = defineAsyncComponent(() => import("./ArcRaidersNav.vue"));
const ZeldaNav = defineAsyncComponent(() => import("./ZeldaNav.vue"));
const PokemonNav = defineAsyncComponent(() => import("./PokemonNav.vue"));
const AssassinsCreedNav = defineAsyncComponent(() => import("./AssassinsCreedNav.vue"));
const CodZombiesNav = defineAsyncComponent(() => import("./CodZombiesNav.vue"));
const ArkNav = defineAsyncComponent(() => import("./ArkNav.vue"));

export const GAME_NAVS = {
  lol: { name: "League of Legends", home: "/lol", zone: "lol", logo: "/images/games/logo-lol.png", component: LolNav },
  "arc-raiders": { name: "ARC Raiders", home: "/arc-raiders", zone: "arc", logo: "/images/games/logo-arc.png", component: ArcRaidersNav },
  "zelda-totk": { name: "Tears of the Kingdom", home: "/zelda", zone: "zelda", logo: "/images/games/logo-zelda.png", component: ZeldaNav },
  pokemon: { name: "Pokémon", home: "/pokemon", zone: "pokemon", subH: 52, logo: "/images/games/logo-pokemon.webp", component: PokemonNav },
  "assassins-creed": { name: "Assassin's Creed", home: "/assassins-creed", zone: "ac", logo: "/images/games/logo-ac.webp", component: AssassinsCreedNav },
  "cod-zombis": { name: "CoD Zombis", home: "/cod-zombis", zone: "cod", logo: "/images/games/logo-cod.webp", component: CodZombiesNav },
  ark: { name: "ARK", home: "/ark", zone: "ark", logo: "/images/games/logo-ark.webp", component: ArkNav },
};
