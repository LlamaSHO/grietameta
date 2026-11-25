<template>
  <!-- Barra de Pokémon (diseño: .sub de Pokemon*.dc.html): Inicio · Regiones ·
       Pokédex · Tabla de tipos · Habilidades y movimientos · Competitivo ·
       Mecánicas. El chip con el logo lo pone SiteNav; los estilos están en
       assets/styles/games/pokemon.css. Los mega-menús se ocultan en móvil
       (nav.css), donde se navega con los enlaces. -->
  <RouterLink class="slink sl-home" :class="{ on: path === '/pokemon' }" to="/pokemon">Inicio</RouterLink>

  <div class="dd">
    <RouterLink class="slink sl-reg" :class="{ on: path.startsWith('/pokemon/kanto') }" to="/pokemon/kanto" aria-haspopup="true">
      Regiones <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="menu mega">
      <div class="rm">
        <template v-for="r in REGIONS" :key="r.name">
          <RouterLink v-if="r.to" class="ro" :to="r.to" :style="{ '--c1': r.c1, '--c2': r.c2 }">
            <span class="art" :style="{ backgroundPosition: r.pos }"></span><small>{{ r.gen }}</small><b>{{ r.name }}</b><span>{{ r.sub }}</span>
          </RouterLink>
          <span v-else class="ro off" :style="{ '--c1': r.c1, '--c2': r.c2 }">
            <span v-if="r.pos" class="art" :style="{ backgroundPosition: r.pos }"></span><small>{{ r.gen }}</small><b>{{ r.name }}</b><span>{{ r.sub }}</span>
          </span>
        </template>
        <div class="rm-f"><span>Una sección por generación, de la más antigua a la más nueva</span><RouterLink to="/pokemon#regiones">Todas las regiones →</RouterLink></div>
      </div>
    </div>
  </div>

  <RouterLink class="slink sl-dex" :class="{ on: path === '/pokemon/pokedex' }" to="/pokemon/pokedex">Pokédex</RouterLink>
  <RouterLink class="slink sl-tipos" :class="{ on: path === '/pokemon/tipos' }" to="/pokemon/tipos">Tabla de tipos</RouterLink>
  <RouterLink class="slink sl-hab" :class="{ on: path === '/pokemon/habilidades' }" to="/pokemon/habilidades">Habilidades y movimientos</RouterLink>

  <div class="dd">
    <RouterLink class="slink sl-comp" :class="{ on: path.startsWith('/pokemon/competitivo') }" to="/pokemon/competitivo" aria-haspopup="true">
      Competitivo <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="menu mega">
      <div class="gl cm">
        <RouterLink class="gi" to="/pokemon/competitivo"><span class="cmi c1">VGC</span><span><b>Pokémon Champions <em>Oficial</em></b><span>Reglamento M-C: uso, sets, equipos de torneo</span></span></RouterLink>
        <RouterLink class="gi" to="/pokemon/competitivo/showdown"><span class="cmi c2">PS</span><span><b>Pokémon Showdown <em class="nof">Simulador</em></b><span>Tiers de Smogon, sets y núcleos</span></span></RouterLink>
        <RouterLink class="gi" to="/pokemon/competitivo/equipo"><span class="cmi c3">+6</span><span><b>Crea tu equipo</b><span>Elige formato y te sugerimos compañeros</span></span></RouterLink>
      </div>
    </div>
  </div>

  <div class="dd">
    <RouterLink class="slink sl-mec" :class="{ on: path === '/pokemon/mecanicas' }" to="/pokemon/mecanicas" aria-haspopup="true">
      Mecánicas <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="menu mega">
      <div class="gl">
        <RouterLink class="gi" to="/pokemon/mecanicas#mega"><span class="mci mc-mega" aria-hidden="true">M</span><span><b>Megaevolución</b><span>Las megapiedras y qué Pokémon pueden megaevolucionar</span></span></RouterLink>
        <RouterLink class="gi" to="/pokemon/mecanicas#z"><span class="mci mc-z" aria-hidden="true">Z</span><span><b>Movimientos Z</b><span>Los cristales Z de cada tipo y los exclusivos</span></span></RouterLink>
        <RouterLink class="gi" to="/pokemon/mecanicas#dinamax"><span class="mci mc-dx" aria-hidden="true">G</span><span><b>Dinamax y Gigamax</b><span>Los movimientos Max y las formas Gigamax</span></span></RouterLink>
        <RouterLink class="gi" to="/pokemon/mecanicas#tera"><span class="mci mc-tera" aria-hidden="true">T</span><span><b>Teracristalización</b><span>Los teratipos y cómo cambian un combate</span></span></RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import "@/assets/styles/games/pokemon.css";

const route = useRoute();
const path = computed(() => route.path.replace(/\/$/, "") || "/");

// Una sección por generación; solo Kanto tiene página por ahora.
const REGIONS = [
  { gen: "Gen I", name: "Kanto", sub: "Rojo, Azul y Amarillo", c1: "#E3350D", c2: "#FFB703", pos: "35.714% 0.000%", to: "/pokemon/kanto" },
  { gen: "Gen II", name: "Johto", sub: "Oro, Plata y Cristal", c1: "#B8860B", c2: "#6C7A89", pos: "21.429% 71.429%" },
  { gen: "Gen III", name: "Hoenn", sub: "Rubí, Zafiro y Esmeralda", c1: "#B71C1C", c2: "#1E5BD8", pos: "78.571% 71.429%" },
  { gen: "Gen IV", name: "Sinnoh", sub: "Diamante, Perla y Platino", c1: "#4C6CC9", c2: "#D86FA0", pos: "0.000% 78.571%" },
  { gen: "Gen V", name: "Teselia", sub: "Negro y Blanco (1 y 2)", c1: "#3A3F47", c2: "#9AA3AD", pos: "28.571% 78.571%" },
  { gen: "Gen VI", name: "Kalos", sub: "X e Y", c1: "#2357B8", c2: "#C52F3A", pos: "71.429% 78.571%" },
  { gen: "Gen VII", name: "Alola", sub: "Sol, Luna, Ultrasol y Ultraluna", c1: "#E68A00", c2: "#6A4BD1", pos: "100.000% 78.571%" },
  { gen: "Gen VIII", name: "Galar", sub: "Espada y Escudo", c1: "#0C8CCB", c2: "#C8106E", pos: "28.571% 85.714%" },
  { gen: "Gen IX", name: "Paldea", sub: "Escarlata y Púrpura", c1: "#C9302C", c2: "#6A35A6", pos: "100.000% 85.714%" },
  { gen: "Gen X", name: "¿?", sub: "Viento y Oleaje · 2027", c1: "#2BB3A3", c2: "#3567D6", pos: null },
];
</script>
