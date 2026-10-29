<template>
  <div ref="root" class="view-arc-enemies">
    <header class="nav"><div class="nav-in">
      <a class="brand" href="/"><span class="hex"></span><span>Arc<span class="m">Meta</span></span></a>
      <GameSearch />
      <nav class="links" aria-label="Secciones de ArcMeta">
        <a href="/arc-raiders">Objetos</a>
        <a href="/arc-misiones">Misiones</a>
        <a href="/arc-enemigos" class="on" aria-current="page">Enemigos</a>
        <a href="/">← Volver al inicio</a>
      </nav>
    </div></header>

    <main>
      <h1>ARC Raiders · Enemigos</h1>
      <p class="sub">Todos los ARC del juego: dónde aparecen, su punto débil, qué sueltan y con qué armas y balas conviene enfrentarlos.</p>

      <div class="controls">
        <input id="search" class="search" type="search" placeholder="Buscar enemigo…" aria-label="Buscar enemigo" autocomplete="off">
      </div>
      <div class="filter-row"><span class="filter-label">Amenaza</span><div id="threats" class="chips" role="group" aria-label="Filtrar por amenaza"></div></div>
      <div class="filter-row"><span class="filter-label">Mapa</span><div id="maps" class="chips" role="group" aria-label="Filtrar por mapa"></div></div>

      <details class="panel">
        <summary>¿Cómo se calculan las armas y balas recomendadas?</summary>
        <div class="in">
          <p>Los datos disponibles no incluyen la vida ni el blindaje exacto de cada ARC, así que la recomendación es <b>orientativa</b>.</p>
          <p>Estimamos el blindaje del enemigo por su nivel de amenaza y su punto débil, y comparamos con la «Penetración de armadura ARC» de cada arma. Contra enemigos sin blindaje se muestran las armas con munición más barata; contra los blindados, las que tienen la penetración justa necesaria, priorizando la munición más barata y fácil de conseguir.</p>
          <p>Dolabra y Canto no se recomiendan porque no hay datos fiables de su penetración.</p>
        </div>
      </details>

      <div id="count" class="count" aria-live="polite"></div>
      <div id="status" class="status">Cargando enemigos…</div>
      <div id="grid" class="grid"></div>
    </main>

    <div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
      <div class="sheet" id="sheet"></div>
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
import { init } from "@/scripts/arc-enemies";
import "@/assets/styles/views/arc-enemies.css";

const root = ref(null);
usePageScript(root, init);
</script>
