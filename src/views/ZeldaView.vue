<template>
  <div ref="root" class="view-zelda">

    <header class="hero">
      <div class="wrap">
        <div class="patch-tag">Guía en español · versión 1.2.1 del juego</div>
        <h1>No te dejes nada en <em>Hyrule</em>.</h1>
        <p class="lead">Mapa de semillas kolog y de los 152 santuarios, misiones principales y secundarias, y las armaduras con más defensa de Tears of the Kingdom.</p>
      </div>
    </header>

    <main class="section">
      <div class="wrap">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" id="q" placeholder="Busca en la guía (ej. un santuario, Zora, defensa)" aria-label="Buscar">
        </div>
        <div class="chips" id="chips"></div>
        <div id="sections"></div>
        <p class="note">Guía no oficial. Los materiales se muestran con su nombre en inglés y recogen los tres primeros niveles de mejora; algunas piezas, como el Aspecto del Héroe Antiguo, tienen un nivel más. Datos de la versión 1.2.1 contrastados con varias guías. En las armaduras, las guías no siempre coinciden en una pieza concreta; usa estas cifras como referencia. Los nombres en inglés van entre paréntesis para que los encuentres en el juego aunque lo tengas en otro idioma.</p>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePageScript } from "@/composables/usePageScript";
import { init } from "@/scripts/zelda";
import "@/assets/styles/views/zelda.css";

const root = ref(null);
usePageScript(root, init);
</script>
