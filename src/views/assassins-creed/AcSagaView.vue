<script setup>
import { computed, ref } from "vue";
import { useGameData } from "@/composables/useGameData";
import AcDna from "@/components/assassins-creed/AcDna.vue";
import AcMemoryCard from "@/components/assassins-creed/AcMemoryCard.vue";
import AcSagaExtras from "@/components/assassins-creed/AcSagaExtras.vue";

const dataset = useGameData("/data/assassins-creed/saga.json");
const chronological = ref(false);
const selectedEra = ref("all");
const eras = computed(() => [["all", "Todas", "#8fe3ff"], ...(dataset.data?.eras ?? []).filter(([id]) => id !== "fut")]);
const eraById = computed(() => Object.fromEntries((dataset.data?.eras ?? []).map(era => [era[0], era])));
const games = computed(() => (dataset.data?.games ?? [])
  .filter(game => selectedEra.value === "all" || game.era === selectedEra.value)
  .sort((a, b) => chronological.value ? a.hy - b.hy || a.y - b.y : a.y - b.y));

</script>

<template>
  <div class="ac-page">
    <section id="inicio" class="ac-hero">
      <AcDna />
      <div class="ac-wrap saga-hero">
        <div>
          <div class="hud"><i></i> Animus · memoria genética · sincronización <b>100 %</b></div>
          <p class="ac-period">La saga · 2007–2026</p>
          <h1>Assassin's Creed</h1>
          <p class="lead">Catorce juegos principales, de la Grecia de Kassandra al Japón de Naoe y Yasuke. Aquí tienes la saga en orden, por dónde empezar y nuestra primera guía completa: <b>Unity</b>.</p>
          <div class="ac-actions">
            <RouterLink class="ac-button primary" to="/assassins-creed/unity">Guía de Unity <span aria-hidden="true">→</span></RouterLink>
            <RouterLink class="ac-button" to="#saga">Ver la saga</RouterLink>
          </div>
          <dl class="stats">
            <div><dt>14</dt><dd>juegos principales</dd></div>
            <div><dt>431 a. C.</dt><dd>la historia más antigua (Odyssey)</dd></div>
            <div><dt>1868</dt><dd>la más moderna (Syndicate)</dd></div>
          </dl>
        </div>
        <figure class="saga-art">
          <div class="art-frame">
            <img src="/images/assassins-creed/ac-saga.webp"
              srcset="/images/assassins-creed/ac-saga-small.webp 720w, /images/assassins-creed/ac-saga.webp 960w"
              sizes="(max-width: 860px) calc(100vw - 36px), (max-width: 1344px) 49vw, 650px"
              alt="Los protagonistas de la saga Assassin's Creed" width="960" height="540" fetchpriority="high">
          </div>
          <figcaption>Arte oficial de Ubisoft con los asesinos de la saga</figcaption>
        </figure>
      </div>
    </section>

    <section id="saga" class="ac-section ac-wrap">
      <div class="ac-heading catalog-heading">
        <div>
          <h2>Todos los juegos</h2>
          <p>{{ chronological ? "Ordenados por la época en la que transcurre cada historia, de la Antigüedad al siglo XIX." : "Ordenados por fecha de lanzamiento, de 2007 a hoy." }}</p>
        </div>
        <div v-if="dataset.status === 'ready'" class="sort" role="group" aria-label="Orden">
          <button type="button" :aria-pressed="!chronological" @click="chronological = false">Por lanzamiento</button>
          <button type="button" :aria-pressed="chronological" @click="chronological = true">Por época de la historia</button>
        </div>
      </div>
      <div v-if="dataset.status === 'error'" role="alert">
        <p>No se pudo cargar el catálogo.</p>
        <button class="ac-button" type="button" @click="dataset.reload()">Reintentar</button>
      </div>
      <template v-else-if="dataset.status === 'ready'">
        <div class="filters" role="group" aria-label="Época">
          <button v-for="[id, name, color] in eras" :key="id" type="button" :style="{ '--era-color': color }"
            :aria-pressed="selectedEra === id" @click="selectedEra = id"><i></i>{{ name }}</button>
          <span role="status">{{ games.length }} juegos</span>
        </div>
        <div class="memories">
          <AcMemoryCard v-for="(game, index) in games" :key="game.id" :game="game" :index="index"
            :era="eraById[game.era]" :chronological="chronological" />
        </div>
      </template>
    </section>

    <AcSagaExtras />
  </div>
</template>

<style scoped src="@/components/assassins-creed/ac-page.css"></style>
<style scoped>
.saga-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: clamp(25px,5vw,72px); align-items: center; padding-block: clamp(40px,6vw,84px); }
.saga-art { margin: 0; min-width: 0; }
.art-frame { position: relative; overflow: hidden; border: 1px solid #48758a; border-radius: 5px; aspect-ratio: 16 / 9; }
.art-frame::after { content: ""; position: absolute; inset: 4px; border: 1px solid #8fe3ff45; pointer-events: none; }
.art-frame img { display: block; width: 100%; height: 100%; object-fit: cover; }
figcaption { text-align: right; margin-top: 9px; color: var(--ac-dim); font-size: .76rem; }
.stats { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; margin: 30px 0 0; padding-top: 16px; border-top: 1px solid var(--ac-line); }
.stats dt { color: #dbeef5; font: 700 clamp(1.5rem,3vw,2.25rem)/1 var(--ac-display); }
.stats dd { margin: 5px 0 0; color: var(--ac-dim); font-size: .8rem; }
.catalog-heading { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 15px 28px; }
.sort { display: inline-flex; padding: 3px; border: 1px solid var(--ac-line); border-radius: 4px; background: #101b25; }
.sort button, .filters button { min-height: 44px; color: var(--ac-text); background: transparent; font: 650 .83rem/1.14 "IBM Plex Sans", sans-serif; cursor: pointer; }
.sort button { border: 1px solid transparent; border-radius: 3px; padding-inline: 10px; }
.sort button[aria-pressed=true] { background: #203b4c; border-color: #57889d; }
.filters { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 16px; }
.filters button { display: flex; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid var(--ac-line); border-radius: 3px; }
.filters button i { width: 7px; height: 7px; border-radius: 50%; background: var(--era-color); }
.filters button[aria-pressed=true], .filters button:hover { border-color: var(--era-color); background: #172531; }
.filters span { margin-inline-start: auto; color: var(--ac-dim); font-size: .82rem; }
.memories { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
@media (max-width: 1100px) { .memories { grid-template-columns: repeat(3,minmax(0,1fr)); } }
@media (max-width: 860px) { .saga-hero { grid-template-columns: minmax(0,1fr); } .memories { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (max-width: 560px) { .memories { grid-template-columns: minmax(0,1fr); } }
</style>
