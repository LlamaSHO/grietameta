/* Barra de navegación de cada juego, debajo del nav central.
   La clave es el slug de public/data/games.json, y cada ruta indica el suyo
   en meta.game (src/router/index.js). Para un juego nuevo: crea su
   componente aquí al lado (enlaces con la clase .sub-link) y añádelo. */

import LolNav from "./LolNav.vue";
import ArcRaidersNav from "./ArcRaidersNav.vue";
import ZeldaNav from "./ZeldaNav.vue";

export const GAME_NAVS = {
  lol: { name: "League of Legends", home: "/lol", component: LolNav },
  "arc-raiders": { name: "ARC Raiders", home: "/arc-raiders", component: ArcRaidersNav },
  "zelda-totk": { name: "Zelda: TotK", home: "/zelda", component: ZeldaNav },
};
