<template>
  <!-- Portada de CoD Zombis. Diseño: models/paginas/CodZombies.dc.html -->
  <CodPage>
    <CodHero />
    <CodGameCards />
    <CodFinder :state="saga" />
    <CodSaga :state="saga" :spoilers="spoilers" />
    <CodKeyChars :state="saga" :spoilers="spoilers" />
    <CodCrews :state="saga" />
    <CodGlossary />
  </CodPage>
</template>

<script setup>
import CodPage from "@/components/cod-zombis/CodPage.vue";
import CodHero from "@/components/cod-zombis/CodHero.vue";
import CodGameCards from "@/components/cod-zombis/CodGameCards.vue";
import CodFinder from "@/components/cod-zombis/CodFinder.vue";
import CodSaga from "@/components/cod-zombis/CodSaga.vue";
import CodKeyChars from "@/components/cod-zombis/CodKeyChars.vue";
import CodCrews from "@/components/cod-zombis/CodCrews.vue";
import CodGlossary from "@/components/cod-zombis/CodGlossary.vue";
import { useGameData } from "@/composables/useGameData.js";
import { useSpoilers } from "@/components/cod-zombis/spoilers.js";

// Mapas, saga, personajes y tripulaciones: un solo JSON que se pide al entrar.
const saga = useGameData("/data/cod-zombis/saga.json");
const spoilers = useSpoilers();
</script>
