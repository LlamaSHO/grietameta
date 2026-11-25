<template>
  <!-- Contenedor común de las vistas de CoD Zombis: fondo de ruinas y grietas
       de lava (capas fijas estáticas). La pantalla de carga la pone
       components/loaders/GameLoaderHost.vue al entrar en el juego. Estilos base
       en cod-base.css, todo bajo .cdp. -->
  <div class="cdp" :class="{ still }">
    <div class="lava" aria-hidden="true"></div>
    <slot />
  </div>
</template>

<script setup>
import { loadCodFonts } from "./codFonts.js";
import "./cod-base.css";

defineProps({
  /* sin uso: la pantalla de carga es común (se deja por compatibilidad) */
  loader: { type: String, default: "pistolero" },
  /* sin animaciones (las decorativas de la portada se quedan quietas) */
  still: { type: Boolean, default: false },
});

loadCodFonts();
</script>
