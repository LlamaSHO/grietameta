/* Capa visible del mapa del hub de Zelda, compartida entre el mapa
   (ZeldaMap.vue) y la barra de Zelda (mega-menú «Mapas» de ZeldaNav.vue).
   Va aparte de mapPoints.js para que la barra, que se carga en todas las
   páginas, no arrastre los datos del mapa. */

import { ref } from "vue";

// "surf" (superficie) o "sky" (cielo).
export const mapLayer = ref("surf");

// ?capa= de la URL (/zelda?capa=cielo#mapa) → capa del mapa.
export const LAYER_FROM_QUERY = { superficie: "surf", cielo: "sky" };
