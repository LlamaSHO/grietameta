<script setup>
import { computed } from 'vue';
import { useGameData } from '@/composables/useGameData';
import ArkDataState from '@/components/ark/ArkDataState.vue';
import ArkBestiary from '@/components/ark/ArkBestiary.vue';

const request = useGameData('/data/ark/criaturas-wiki.json');
const total = computed(() => request.data?.criaturas.length ?? 0);
const species = computed(() => request.data?.criaturas.filter(({ v }) => !v).length ?? 0);
</script>

<template>
  <div class="ark dosier">
    <section class="hero-b cr-h">
      <i class="fern r" aria-hidden="true"></i>
      <div class="wrap">
        <div>
          <span class="kk">Bestiario del superviviente</span>
          <h1>Todas las criaturas</h1>
          <p>Cada especie y cada variante de la wiki: Aberrantes, X, R, Tek, Alfa, jefes, criaturas de evento… Busca, filtra y abre su dosier.</p>
        </div>
        <div v-if="request.status === 'ready'" class="cr-tot">
          <span><b>{{ total }}</b><small>fichas</small></span>
          <span><b>{{ species }}</b><small>especies</small></span>
          <span><b>{{ total - species }}</b><small>variantes</small></span>
        </div>
      </div>
    </section>
    <section class="wrap blk" aria-label="Filtros y criaturas">
      <ArkDataState :request="request"><ArkBestiary :catalogue="request.data" /></ArkDataState>
    </section>
  </div>
</template>

<style scoped src="../../components/ark/bestiary.css"></style>