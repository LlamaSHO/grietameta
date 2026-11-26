<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import "@/assets/styles/games/ac.css";

const route = useRoute();
const open = ref(false);
const group = ref(null);
const trigger = ref(null);
const unity = "/assassins-creed/unity";
const sections = [
  ["mapa", "Mapa de París", "22 barrios, lugares y memorias"],
  ["historia", "Historia paso a paso", "Prólogo y 12 secuencias"],
  ["actividades", "Actividades y coleccionables", "Enigmas, cofres, cooperativo…"],
  ["personajes", "Personajes y datos", "Quién es quién, sin spoilers"],
];

watch(() => route.fullPath, () => { open.value = false; });
onMounted(() => document.addEventListener("pointerdown", closeOutside));
onBeforeUnmount(() => document.removeEventListener("pointerdown", closeOutside));

function closeOutside(event) {
  if (!group.value?.contains(event.target)) open.value = false;
}

function escape() {
  if (open.value) {
    open.value = false;
    trigger.value?.focus();
  }
}
</script>

<template>
  <RouterLink class="slink ac-saga-nav" exact-active-class="on" to="/assassins-creed">La saga</RouterLink>
  <div ref="group" class="ac-nav-unity" @keydown.escape.stop="escape">
    <RouterLink class="slink" :class="{ on: route.path === unity }" :to="unity">Guía de Unity</RouterLink>
    <button ref="trigger" class="ac-nav-toggle" type="button" aria-label="Secciones de Unity" :aria-expanded="open" aria-controls="ac-nav-sections" @click="open = !open">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>
    </button>
    <div v-show="open" id="ac-nav-sections" class="ac-nav-menu">
      <RouterLink v-for="[id, title, description] in sections" :key="id" :to="{ path: unity, hash: '#' + id }" @click="open = false">
        <b>{{ title }}</b><small>{{ description }}</small>
      </RouterLink>
      <RouterLink class="ac-nav-mobile" to="/assassins-creed#empezar" @click="open = false">Por dónde empezar</RouterLink>
      <RouterLink class="ac-nav-mobile" to="/assassins-creed#novedades" @click="open = false">Novedades</RouterLink>
    </div>
  </div>
  <RouterLink class="slink ac-nav-desktop" to="/assassins-creed#empezar">Por dónde empezar</RouterLink>
  <RouterLink class="slink ac-nav-desktop" to="/assassins-creed#novedades">Novedades</RouterLink>
</template>
