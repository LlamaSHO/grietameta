<script setup>
import { useGameData } from '@/composables/useGameData';
import ArkCataloguePage from '@/components/ark/ArkCataloguePage.vue';
import ArkCatalogue from '@/components/ark/ArkCatalogue.vue';

const request = useGameData('/data/ark/engramas.json');
const categories = ['Herramientas', 'Supervivencia', 'Armas', 'Armadura', 'Paja', 'Madera', 'Piedra', 'Metal', 'Fabricación', 'Monturas', 'Tek', 'Consumibles', 'Comida'];
const rank = { Imprescindible: 'rank-essential', Prescindible: 'rank-optional' };

function cost(entry) {
  return entry.coste?.length
    ? entry.coste.map(({ nombre, cantidad }) => nombre + ' ×' + cantidad).join(', ')
    : entry.notaCoste;
}
</script>

<template>
  <ArkCataloguePage :request="request" image="superviviente" title="Engramas por" title-accent="nivel"
    summary="Invierte tus puntos en lo que cambia la partida: herramientas, monturas, fabricación y Tek."
    notice-title="Tek se gana en combate"
    notice="Los engramas Tek se desbloquean al derrotar jefes; consulta dificultad, mapa y requisito de cada uno.">
    <ArkCatalogue kind="engramas" :entries="request.data.engramas" :categories="categories">
      <template #row="{ entry }">
        <span class="level">N {{ entry.nivel }}</span>
        <span class="row-main">
          <b>{{ entry.nombre }}</b>
          <small>{{ entry.nombreIngles && entry.nombreIngles !== entry.nombre ? entry.nombreIngles + ' · ' : '' }}{{ entry.categoria }} · {{ entry.puntos }} puntos</small>
        </span>
        <span class="badge" :class="rank[entry.valoracion] ?? 'rank-useful'">{{ entry.valoracion }}</span>
      </template>
      <template #detail="{ entry }">
        <h2>{{ entry.nombre }}</h2>
        <p v-if="entry.nombreIngles" class="english">{{ entry.nombreIngles }}</p>
        <span class="category">{{ entry.categoria }}</span>
        <p class="panel-intro">{{ entry.desbloquea }}</p>
        <div class="facts">
          <div><small>NIVEL</small><b>{{ entry.nivel }}</b></div>
          <div><small>PUNTOS</small><b>{{ entry.puntos }}</b></div>
          <div><small>VALORACIÓN GM</small><b :class="rank[entry.valoracion] ?? 'rank-useful'">{{ entry.valoracion }}</b></div>
        </div>
        <section class="detail-block"><h3>Qué desbloquea</h3><p>{{ entry.desbloquea }}</p></section>
        <section class="detail-block"><h3>Requisitos</h3><p>{{ entry.prerrequisitos.join(', ') || 'Sin prerrequisito adicional indicado.' }}</p></section>
        <section class="detail-block"><h3>Coste de fabricación</h3><p>{{ cost(entry) }}</p></section>
        <p class="detail-note">{{ entry.nota }}</p>
        <a :href="entry.fuente" target="_blank" rel="noopener noreferrer">Consultar en la wiki ↗</a>
      </template>
    </ArkCatalogue>
    <section class="route">
      <h2>Ruta recomendada</h2>
      <p class="route-intro">Una progresión práctica para una partida estándar. Ajusta la inversión a tu rol y al mapa.</p>
      <div class="route-steps">
        <article v-for="step in request.data.ruta" :key="step.tramo" class="step">
          <h3>{{ step.tramo }}</h3><p>{{ step.objetivo }}</p>
          <ul><li v-for="item in step.items" :key="item">{{ item }}</li></ul>
        </article>
      </div>
    </section>
  </ArkCataloguePage>
</template>
