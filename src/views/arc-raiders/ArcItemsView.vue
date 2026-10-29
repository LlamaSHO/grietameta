<template>
  <div ref="root" class="view-arc-items">
    <header class="nav"><div class="nav-in">
      <a class="brand" href="/"><span class="hex"></span><span>Arc<span class="m">Meta</span></span></a>
      <GameSearch />
      <nav class="links" aria-label="Secciones de ArcMeta">
        <a href="/arc-raiders" class="on" aria-current="page">Objetos</a>
        <a href="/arc-misiones">Misiones</a>
        <a href="/arc-enemigos">Enemigos</a>
        <a href="/">← Volver al inicio</a>
      </nav>
    </div></header>

    <main>
      <h1>ARC Raiders · Objetos</h1>
      <p class="sub">Busca un objeto y mira si te conviene venderlo, reciclarlo, guardarlo o usarlo.</p>

      <div class="controls">
        <input id="q" class="search" type="search" placeholder="Buscar objeto (ej. Acelerador)…" aria-label="Buscar objeto" autocomplete="off">
      </div>
      <div class="filter-row"><span class="filter-label">Qué hacer</span><div class="chips" id="actions" role="group" aria-label="Filtrar por recomendación"></div></div>
      <div class="filter-row"><span class="filter-label">Rareza</span><div class="chips" id="rarities" role="group" aria-label="Filtrar por rareza"></div></div>
      <div class="filter-row"><span class="filter-label">Categoría</span><div class="chips" id="types" role="group" aria-label="Filtrar por categoría"></div></div>

      <details class="how">
        <summary>¿Cómo se calcula la recomendación?</summary>
        <ul>
          <li><strong>Guardar:</strong> lo pide el taller, un proyecto activo o una misión (o es un objeto de misión).</li>
          <li><strong>Usar:</strong> armas, mejoras, aumentos, escudos, munición, consumibles, planos y llaves.</li>
          <li><strong>Reciclar:</strong> al reciclarlo obtienes materiales que te piden el taller, un proyecto o una misión.</li>
          <li><strong>Vender:</strong> el resto. Se vende por su valor y reciclarlo no te da nada que necesites.</li>
        </ul>
        <p>Es una guía orientativa calculada por ArcMeta a partir de los datos del juego, no una información oficial. Si ya completaste una mejora o una misión, puede que no necesites guardar ese objeto.</p>
      </details>

      <div class="count" id="count" aria-live="polite"></div>
      <div id="grid" class="grid"></div>
      <div id="status" class="status" hidden></div>

      <nav id="pager" class="pager" aria-label="Paginación" hidden>
        <button id="prev" class="pbtn" type="button">‹ Anterior</button>
        <label class="psel">Página
          <select id="pageSel" aria-label="Elegir página"></select>
          <span id="pageTotal"></span>
        </label>
        <button id="next" class="pbtn" type="button">Siguiente ›</button>
      </nav>

      <button id="more" class="more" type="button" hidden>Reintentar</button>
    </main>

    <div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="m-name">
      <div class="sheet">
        <button class="close" id="m-close" aria-label="Cerrar">×</button>
        <h2 id="m-name"></h2>
        <div class="meta" id="m-meta"></div>
        <div class="art" id="m-art"></div>
        <div class="rec" id="m-rec"></div>
        <p id="m-desc"></p>
        <table class="stats" id="m-stats"></table>
        <div id="m-sections"></div>
      </div>
    </div>

    <footer>
      <p id="foot-data"></p>
      <p>
        Datos del <a href="https://github.com/RaidTheory/arcraiders-data" target="_blank" rel="noopener">Proyecto de datos ARC</a>
        (licencia MIT, <a href="/data/arc-raiders/LICENSE-arcraiders-data.txt">texto de la licencia</a>) y de la comunidad de
        <a href="https://arctracker.io" target="_blank" rel="noopener">ARC Tracker</a>.
        El contenido del juego pertenece a Embark Studios AB y sus licenciantes. ArcMeta no está afiliado ni respaldado por Embark Studios.
      </p>
    </footer>
  </div>
</template>

<script setup>
import GameSearch from "@/components/GameSearch.vue";
import { ref } from "vue";
import { usePageScript } from "@/composables/usePageScript";
import { init } from "@/scripts/arc-items";
import "@/assets/styles/views/arc-items.css";

const root = ref(null);
usePageScript(root, init);
</script>
