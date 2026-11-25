<script setup>
import { useGameData } from '@/composables/useGameData';
import ArkCataloguePage from '@/components/ark/ArkCataloguePage.vue';
import ArkCatalogue from '@/components/ark/ArkCatalogue.vue';

const request = useGameData('/data/ark/recursos.json');
const categories = ['básico', 'elaborado', 'comida'];
</script>

<template>
  <ArkCataloguePage :request="request" image="pradera" title="Recursos para" title-accent="sobrevivir"
    summary="Qué recolectar, quién lo consigue mejor y dónde buscarlo en los mapas de Evolved."
    notice-title="Consejo de campo"
    notice="El recolector adecuado ahorra tiempo y peso. Compara herramienta, criatura y bioma antes de salir.">
    <ArkCatalogue kind="recursos" :entries="request.data.recursos" :categories="categories">
      <template #row="{ entry }">
        <span class="level resource">{{ entry.tipo.toUpperCase() }}</span>
        <span class="row-main"><b>{{ entry.nombre }}</b><small>{{ entry.mejor }}</small></span>
        <span class="badge">{{ entry.tipo }}</span>
      </template>
      <template #detail="{ entry }">
        <h2>{{ entry.nombre }}</h2>
        <span class="category">{{ entry.tipo }}</span>
        <p class="panel-intro">{{ entry.uso }}</p>
        <section class="detail-block"><h3>Dónde se consigue</h3><p>{{ entry.obtencion }}</p></section>
        <section class="detail-block"><h3>Mejor herramienta o criatura</h3><p>{{ entry.mejor }}</p></section>
        <section class="detail-block"><h3>Para qué sirve</h3><p>{{ entry.uso }}</p></section>
        <section class="detail-block"><h3>Mapas</h3><p>{{ entry.mapas }}</p></section>
        <a :href="entry.fuente" target="_blank" rel="noopener noreferrer">Consultar en la wiki ↗</a>
      </template>
    </ArkCatalogue>
  </ArkCataloguePage>
</template>
