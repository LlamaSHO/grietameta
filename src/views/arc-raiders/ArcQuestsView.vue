<template>
  <div ref="root" class="view-arc-quests">
    <header class="nav"><div class="nav-in">
      <a class="brand" href="/"><span class="hex"></span><span>Arc<span class="m">Meta</span></span></a>
      <GameSearch />
      <nav class="links" aria-label="Secciones de ArcMeta">
        <a href="/arc-raiders">Objetos</a>
        <a href="/arc-misiones" class="on" aria-current="page">Misiones</a>
        <a href="/arc-enemigos">Enemigos</a>
        <a href="/">← Volver al inicio</a>
      </nav>
    </div></header>

    <main>
      <h1>ARC Raiders · Misiones</h1>
      <p class="sub">Marca las misiones que vas completando, sigue las que tienes en curso y mira qué objetos debes guardar.</p>

      <div id="notice" class="notice" hidden>Este navegador no permite guardar el progreso (por ejemplo, en modo privado). Puedes seguir marcando misiones, pero se perderán al cerrar la página. Usa «Copia de seguridad» para guardar un código.</div>

      <section class="progress" aria-label="Progreso">
        <div class="p-top"><strong id="p-main">—</strong><span id="p-sub"></span></div>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="p-bar"><i id="p-fill"></i></div>
        <div class="tiles" id="tiles" role="group" aria-label="Progreso por comerciante (pulsa para filtrar)"></div>
      </section>

      <div class="controls">
        <input id="q" class="search" type="search" placeholder="Buscar misión, comerciante u objeto…" aria-label="Buscar misión" autocomplete="off">
      </div>
      <div class="filter-row"><span class="filter-label">Estado</span><div class="chips" id="f-status" role="group" aria-label="Filtrar por estado"></div></div>
      <div class="filter-row"><span class="filter-label">Mapa</span><div class="chips" id="f-map" role="group" aria-label="Filtrar por mapa"></div></div>

      <details class="panel" id="maps-panel">
        <summary id="maps-sum">Mapas</summary>
        <div class="in">
          <p style="margin:0 0 8px">Pulsa un mapa para verlo ampliado, con zoom y arrastre. En cada misión también aparece el mapa donde se juega.</p>
          <div class="maps-grid" id="maps-grid"></div>
        </div>
      </details>

      <details class="panel" id="guard">
        <summary id="guard-sum">Objetos que necesitas guardar</summary>
        <div class="in">
          <label class="guard-opt"><input type="checkbox" id="guard-avail"> Solo de las misiones que ya tengo disponibles</label>
          <ul class="guard-list" id="guard-list"></ul>
        </div>
      </details>

      <details class="panel">
        <summary>Copia de seguridad (pasar el progreso a otro dispositivo)</summary>
        <div class="in">
          <p style="margin:0 0 6px">Tu progreso se guarda solo en este navegador. Para llevarlo a otro, genera un código, cópialo y pégalo allí en «Importar».</p>
          <div class="bk-row">
            <button class="btn" id="bk-export" type="button">Generar código</button>
            <button class="btn" id="bk-import" type="button">Importar código</button>
            <button class="btn danger" id="bk-reset" type="button">Borrar todo el progreso</button>
          </div>
          <textarea class="code" id="bk-code" aria-label="Código de copia de seguridad" spellcheck="false" placeholder="Aquí aparece tu código, o pega uno y pulsa «Importar código»."></textarea>
          <p class="msg" id="bk-msg" role="status"></p>
        </div>
      </details>

      <div class="count" id="count" aria-live="polite"></div>
      <div id="list" class="list"></div>
      <div id="status" class="status" hidden></div>
      <button id="more" class="more" type="button" hidden>Reintentar</button>
    </main>

    <div id="viewer" class="viewer" role="dialog" aria-modal="true" aria-labelledby="v-title">
      <div class="v-bar">
        <h2 id="v-title"></h2>
        <div class="chips" id="v-tabs"></div>
        <div class="v-tools">
          <button class="btn" id="v-out" type="button" aria-label="Alejar">−</button>
          <span id="v-zoom">Ajustado</span>
          <button class="btn" id="v-in" type="button" aria-label="Acercar">+</button>
          <button class="btn" id="v-fit" type="button">Ajustar</button>
          <button class="btn" id="v-close" type="button">Cerrar</button>
        </div>
      </div>
      <div class="vscroll" id="v-scroll"><img id="v-img" alt="" draggable="false"></div>
      <div class="v-foot">
        <span id="v-note"></span>
        <a href="https://metaforge.app/arc-raiders/map" target="_blank" rel="noopener">Mapa interactivo en MetaForge</a>
      </div>
    </div>

    <footer>
      <p id="foot-data"></p>
      <p>
        Datos e imágenes de mapas del <a href="https://github.com/RaidTheory/arcraiders-data" target="_blank" rel="noopener">Proyecto de datos ARC</a>
        (licencia MIT, <a href="/data/arc-raiders/LICENSE-arcraiders-data.txt">texto de la licencia</a>).
        El contenido del juego pertenece a Embark Studios AB y sus licenciantes. ArcMeta no está afiliado ni respaldado por Embark Studios.
      </p>
    </footer>
  </div>
</template>

<script setup>
import GameSearch from "@/components/GameSearch.vue";
import { ref } from "vue";
import { usePageScript } from "@/composables/usePageScript";
import { init } from "@/scripts/arc-quests";
import "@/assets/styles/views/arc-quests.css";

const root = ref(null);
usePageScript(root, init);
</script>
