<script setup>
import { ref } from 'vue';
import { useGameData } from '@/composables/useGameData';
import ArkDataState from '@/components/ark/ArkDataState.vue';
import ArkFeaturedCreatures from '@/components/ark/ArkFeaturedCreatures.vue';
import { maps } from '@/components/ark/homeData';

const catalogue = useGameData('/data/ark/criaturas.json');
const selectedMap = ref(maps[0]);
const sections = [
  { title: 'Criaturas', to: '/ark/criaturas', image: 'raptores', note: '933 en el bestiario', text: 'Doma, comida, montura y en qué mapa vive cada una' },
  { title: 'Mapas', to: '/ark#mapas', image: 'secuoyas', note: '12 mapas', text: 'Biomas, cuevas, recursos y criaturas exclusivas' },
  { title: 'Engramas', to: '/ark/engramas', image: 'superviviente', note: 'Por nivel', text: 'Qué aprender primero y qué cuesta fabricarlo' },
  { title: 'Recursos', to: '/ark/recursos', image: 'pradera', note: 'Dónde farmear', text: 'Metal, cristal, perla, aceite… y con qué criatura' },
  { title: 'Guías', to: '/ark/guias', image: 'jinetes', note: 'Bases y granjas', text: 'Cría, granjas automáticas y sistemas útiles' },
];
const story = [
  ['The Island', 'Despiertas en la playa. Los tres obeliscos y los primeros jefes.', '#62b43c'],
  ['Scorched Earth', 'El desierto, las wyverns y el Manticore.', '#e2b13c'],
  ['Aberration', 'Un ARK roto bajo tierra y Rockwell.', '#3e92e0'],
  ['Extinction', 'La Tierra corrompida y los titanes.', '#e0493a'],
  ['Genesis: Part 1', 'La simulación de HLN-A y sus misiones.', '#3e92e0'],
  ['Genesis: Part 2', 'La nave colonia y el final de la historia.', '#e0493a'],
];
</script>

<template>
  <div class="ark dosier">
    <section class="hero-b">
      <i class="fern" aria-hidden="true"></i><i class="fern r" aria-hidden="true"></i>
      <div class="wrap">
        <div>
          <span class="kk">Notas de un superviviente</span>
          <h1>El diario<br>del ARK</h1>
          <p>Cada criatura con su dosier: qué come, cómo se doma y para qué sirve. Apuntes de campo para no morir la primera noche.</p>
          <span class="note">933 criaturas · 12 mapas · 1 objetivo: sobrevivir</span>
        </div>
        <div class="book"><img src="/images/ark/dosieres/rex.webp" alt="Dosier del Rex"></div>
      </div>
    </section>

    <section class="wrap blk" aria-labelledby="ark-sections">
      <header class="bh"><span class="kk">Explora</span><h2 id="ark-sections">Todo ARK en un sitio</h2></header>
      <div class="sxs">
        <RouterLink v-for="section in sections" :key="section.title" :to="section.to" class="sx">
          <img :src="'/images/ark/fondos/' + section.image + '.webp'" alt="" loading="lazy" decoding="async">
          <span class="sx-n">{{ section.note }}</span><b>{{ section.title }}</b><small>{{ section.text }}</small>
        </RouterLink>
      </div>
    </section>

    <div class="leaf-div" aria-hidden="true">❦</div>
    <section class="wrap blk" aria-labelledby="ark-featured">
      <header class="bh">
        <span class="kk">Criaturas destacadas</span><h2 id="ark-featured">Elige tu próxima doma</h2>
        <p>Algunas de las más útiles, con su dosier. En la página de criaturas están todas, con sus variantes y filtros por mapa.</p>
      </header>
      <ArkDataState :request="catalogue">
        <ArkFeaturedCreatures :creatures="catalogue.data.criaturas" />
      </ArkDataState>
    </section>

    <div class="leaf-div" aria-hidden="true">❦</div>
    <section id="mapas" class="wrap blk" aria-labelledby="ark-maps">
      <header class="bh"><span class="kk">Los mapas</span><h2 id="ark-maps">Doce ARK para sobrevivir</h2></header>
      <div class="mps">
        <button v-for="map in maps" :key="map.name" type="button" class="mp" :aria-pressed="selectedMap === map" @click="selectedMap = map">
          <i :style="{ backgroundPosition: map.position }" aria-hidden="true"></i><b>{{ map.name }}</b>
        </button>
      </div>
      <p class="mpd" aria-live="polite"><b>{{ selectedMap.name }}</b> · {{ selectedMap.description }}</p>
    </section>

    <div class="leaf-div" aria-hidden="true">❦</div>
    <section class="wrap blk" aria-labelledby="ark-story">
      <header class="bh"><span class="kk">Por dónde empezar</span><h2 id="ark-story">El orden de la historia</h2></header>
      <ol class="hist">
        <li v-for="[name, description, color] in story" :key="name" :style="{ '--ob': color }"><b>{{ name }}</b><small>{{ description }}</small></li>
      </ol>
      <p class="hist-nota">The Center, Ragnarok, Valguero, Crystal Isles, Lost Island y Fjordur son mapas gratuitos: juégalos cuando quieras.</p>
    </section>
  </div>
</template>

<style scoped src="../../components/ark/home.css"></style>
<style scoped>
.fern { left: -10px; bottom: -40px; }
.fern.r { left: auto; right: -10px; }
</style>
