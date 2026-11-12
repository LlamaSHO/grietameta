/* Barra de navegación de cada juego, debajo del nav central.
   La clave es el slug de public/data/games.json, y cada ruta indica el suyo
   en meta.game (src/router/index.js). `zone` es el data-zone que App.vue pone
   en .app-shell (acento y estilo de la barra). Para un juego nuevo: crea su
   componente aquí al lado (enlaces con la clase .slink, desplegables con
   .dd + .mega; estilos en assets/styles/nav.css) y añádelo. */

import LolNav from "./LolNav.vue";
import ArcRaidersNav from "./ArcRaidersNav.vue";
import ZeldaNav from "./ZeldaNav.vue";

export const GAME_NAVS = {
  lol: { name: "League of Legends", home: "/lol", zone: "lol", logo: "/images/games/logo-lol.png", component: LolNav },
  "arc-raiders": { name: "ARC Raiders", home: "/arc-raiders", zone: "arc", logo: "/images/games/logo-arc.png", component: ArcRaidersNav },
  "zelda-totk": { name: "Tears of the Kingdom", home: "/zelda", zone: "zelda", logo: "/images/games/logo-zelda.png", component: ZeldaNav },
};
