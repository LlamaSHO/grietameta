<script setup>
import { computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGameData } from '@/composables/useGameData';
import ArkDataState from '@/components/ark/ArkDataState.vue';
import ArkGuideCard from '@/components/ark/ArkGuideCard.vue';

const route = useRoute();
const request = useGameData('/data/ark/guias.json');
const guides = computed(() => request.data?.guias.map((guide, index) => ({
  ...guide, number: String(index + 1).padStart(2, '0'),
})) ?? []);
const categories = computed(() => request.data?.categorias.map(category => ({
  ...category, guides: guides.value.filter(guide => guide.categoria === category.id),
})) ?? []);

watch(() => request.status, async (status) => {
  if (status !== 'ready' || !route.hash) return;
  await nextTick();
  document.getElementById(route.hash.slice(1))?.scrollIntoView();
});
</script>

<template>
  <div class="ark-guides">
    <section class="hero">
      <div class="guide-wrap">
        <nav class="crumb" aria-label="Migas de pan">
          <RouterLink to="/ark">ARK</RouterLink><span aria-hidden="true">/</span><span aria-current="page">Guías</span>
        </nav>
        <h1>Sobrevive. <span>Construye.</span> Domina.</h1>
        <p>Guías prácticas para montar tu primera base, domesticar con cabeza y crear sistemas que te ahorren viajes. Pasos claros para ARK: Survival Evolved en The Island.</p>
        <div class="hero-meta">
          <b v-if="guides.length">{{ guides.length }} guías paso a paso</b><b>Mapa: The Island</b><b>Supervivencia · PvE · PvP</b>
        </div>
      </div>
    </section>

    <ArkDataState :request="request">
      <section class="index" aria-labelledby="ark-guide-index">
        <div class="guide-wrap">
          <div class="index-head">
            <h2 id="ark-guide-index">Encuentra tu siguiente objetivo</h2><p>Elige una categoría y abre la guía que necesitas.</p>
          </div>
          <nav class="cat-list" aria-label="Índice de guías">
            <a v-for="category in categories" :key="category.id" class="cat" :href="'#' + category.id">
              <b>{{ category.nombre }}</b><small>{{ category.nota }}</small>
            </a>
          </nav>
        </div>
      </section>

      <div class="guide-wrap content">
        <div>
          <section v-for="category in categories" :id="category.id" :key="category.id" class="guide-section" :aria-labelledby="'ark-heading-' + category.id">
            <header class="section-head">
              <div><h2 :id="'ark-heading-' + category.id">{{ category.nombre }}</h2><p>{{ category.nota }}</p></div>
              <span>{{ category.guides.length }} guías</span>
            </header>
            <ArkGuideCard v-for="guide in category.guides" :key="guide.id" :guide="guide" />
          </section>
        </div>

        <aside class="side" aria-label="Consejos y atajos">
          <section class="side-card">
            <h2>Antes de empezar</h2>
            <ul class="side-list">
              <li>Comprueba el mapa, la versión y los ajustes de tu servidor: cambian las distancias, tiempos y reglas.</li>
              <li>Guarda una cama, comida, agua y herramientas antes de una expedición.</li>
              <li>Para domar, confirma comida preferida y método de esa especie en su ficha.</li>
            </ul>
            <RouterLink class="side-link" to="/ark/criaturas">Consultar criaturas <span aria-hidden="true">→</span></RouterLink>
          </section>
          <section class="side-card">
            <h2>¿Qué merece la pena?</h2>
            <dl class="useful">
              <dt>Prioriza ya</dt><dd>Cama, cajas, mortero, forja, parcelas pequeñas y una montura recolectora.</dd>
              <dt>Invierte al estabilizarte</dt><dd>Granja de metal, cultivos y agua cuando tengas una ruta de recursos fiable.</dd>
              <dt>Aplaza si no lo usas</dt><dd>Megabase, torretas y generador sin producción constante de combustible y munición.</dd>
            </dl>
            <a class="side-link" href="#merece">Ver guías de utilidad <span aria-hidden="true">→</span></a>
          </section>
          <section class="side-card">
            <h2>Fuente y alcance</h2>
            <p>Consejos orientativos para ARK: Survival Evolved, con The Island como mapa inicial. Algunas cifras y recetas cambian según actualización, modo o servidor.</p>
            <p>Wiki: <a :href="request.data.fuente" target="_blank" rel="noopener noreferrer">ark.wiki.gg</a></p>
          </section>
        </aside>
      </div>
    </ArkDataState>
  </div>
</template>

<style scoped src="../../components/ark/guides.css"></style>