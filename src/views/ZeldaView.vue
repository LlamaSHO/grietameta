<template>
  <div ref="root" class="view-zelda">
    <nav class="nav">
      <div class="wrap">
        <a class="brand" href="/"><div class="brand-mark"></div><div class="brand-name">ZELDA<span>META</span></div></a>
        <div class="nav-links">
          <a href="#semillas">Semillas</a>
          <a href="#santuarios">Santuarios</a>
          <a href="#misiones">Misiones</a>
          <a href="#armaduras">Armaduras</a>
          <a href="#conjuntos">Conjuntos</a>
          <a href="/">← Volver al inicio</a>
        </div>
      </div>
    </nav>

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

    <footer>
      <div class="wrap">
        <div style="margin-bottom:6px;">© 2026 GrietaMeta. Todos los derechos reservados. Prohibida su reproducción total o parcial sin permiso.</div>
        <div>ZeldaMeta es un sitio de fans y no está afiliado a Nintendo. The Legend of Zelda y Tears of the Kingdom son marcas de Nintendo. Todo el contenido es texto e iconos propios, sin material oficial. · <a href="/privacidad">Privacidad</a></div>
      </div>
    </footer>
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
