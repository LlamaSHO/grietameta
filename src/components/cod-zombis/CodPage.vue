<template>
  <!-- Contenedor común de las vistas de CoD Zombis: fondo de ruinas, grietas de
       lava (capas fijas estáticas) y pantalla de carga. Estilos base en
       cod-base.css, todo bajo .cdp. -->
  <div class="cdp" :class="{ still }">
    <div class="lava" aria-hidden="true"></div>
    <CodLoader v-if="loading" :variant="loader" @done="loading = false" />
    <slot />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import CodLoader from "./CodLoader.vue";
import { loadCodFonts } from "./codFonts.js";
import "./cod-base.css";

defineProps({
  /* «pistolero» (por defecto) o «iniciales» */
  loader: { type: String, default: "pistolero" },
  /* sin animaciones (las decorativas de la portada se quedan quietas) */
  still: { type: Boolean, default: false },
});

loadCodFonts();

const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
// La pantalla de carga sale una vez por visita a la web, no en cada cambio de página.
const loading = ref(!reduced && !loaderShown);
let timer;
onMounted(() => {
  if (!loading.value) return;
  loaderShown = true;
  timer = setTimeout(() => (loading.value = false), 3300); // por si el navegador no avisa del fin
});
onBeforeUnmount(() => clearTimeout(timer));
</script>

<script>
let loaderShown = false;
</script>
