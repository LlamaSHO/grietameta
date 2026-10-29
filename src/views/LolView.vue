<template>
  <div ref="root" class="view-lol">
    <nav class="nav">
      <div class="wrap">
        <a class="brand" href="/" style="text-decoration:none;flex-shrink:0;">
          <div class="brand-mark"></div>
          <div class="brand-name">GRIETA<span>META</span></div>
        </a>
        <GameSearch />
        <div class="nav-links">
          <a href="/">Juegos</a>
          <a href="#tierlist">Tier list</a>
          <a href="#campeones">Campeones</a>
          <a href="#premium">Premium</a>
        </div>
        <button class="nav-cta" @click="scrollToPremium">Hazte Premium</button>
      </div>
    </nav>

    <header class="hero">
      <div class="wrap">
        <div class="patch-tag" id="patchTag">Datos ilustrativos</div>
        <h1>Sube de división con la <em>build</em> correcta antes que nadie.</h1>
        <p class="lead">Winrate, pickrate y builds de los 165+ campeones de la grieta, ordenados por rol y por parche. Sin ruido, sin foros interminables.</p>
      </div>
    </header>

    <main>
      <section class="section" id="tierlist">
        <div class="wrap">
          <div class="section-head">
            <div>
              <h2>Tier list del parche</h2>
              <p>Clasificación por impacto real en su rol: combinación de winrate, pickrate y facilidad de ejecución.</p>
            </div>
            <div class="section-sub" id="tierMeta"></div>
          </div>
          <div id="tierListRoot"></div>
        </div>
      </section>

      <div class="wrap">
        <!-- AdSense: sustituye data-ad-slot por el ID de tu bloque de anuncio -->
        <div class="ad-slot banner" id="adSlotTop">
          <ins class="adsbygoogle"
               style="display:block; width:100%;"
               data-ad-client="ca-pub-6908736829395141"
               data-ad-slot="7741286383"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>

      <section class="section" id="campeones">
        <div class="wrap">
          <div class="section-head">
            <div>
              <h2>Todos los campeones</h2>
              <p>Filtra por rol o busca por nombre. Toca una carta para ver su build completa, runas y matchups.</p>
            </div>
            <div class="section-sub" id="gridCount"></div>
          </div>
          <div class="search-row" style="margin-bottom:14px;">
            <div class="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="search-input" placeholder="Busca un campeón (ej. Ahri, Vayne, K'Sante)">
            </div>
          </div>
          <div class="rank-chips" id="rankChips" hidden></div>
          <div class="rank-note" id="rankNote" hidden></div>
          <div class="role-chips" style="margin-bottom:22px;"></div>
          <div class="champ-grid" id="champGrid"></div>
        </div>
      </section>

      <div class="wrap">
        <!-- AdSense: sustituye data-ad-slot por el ID de tu bloque de anuncio -->
        <div class="ad-slot banner" id="adSlotMid">
          <ins class="adsbygoogle"
               style="display:block; width:100%;"
               data-ad-client="ca-pub-6908736829395141"
               data-ad-slot="9688862686"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      </div>

      <section class="section premium-section" id="premium">
        <div class="wrap" style="padding:40px 0 56px;">
          <div class="section-head" style="border:none; padding-bottom:0;">
            <div>
              <h2>Navega sin anuncios</h2>
              <p>Toda la tier list, winrates y builds completas son gratis para todo el mundo. Premium quita la publicidad y añade alertas de cambios de parche antes de que salgan las notas oficiales.</p>
            </div>
          </div>
          <div class="plans" id="plansRoot"></div>
          <div id="unlockBlock" style="margin-top:32px; max-width:480px;"></div>
        </div>
      </section>
    </main>

    <footer>
      <div class="wrap">
        <div class="foot-top">
          <div style="max-width:360px;">
            <div class="brand-name" style="margin-bottom:10px;">GRIETA<span>META</span></div>
            <p>GrietaMeta no está afiliado a Riot Games. League of Legends y Riot Games son marcas registradas o marcas comerciales de Riot Games, Inc. GrietaMeta se avala en los "Legal Jibber Jabber" de Riot Games con contenido creado bajo la política de terceros.</p>
          </div>
          <div class="foot-cols">
            <div class="foot-col">
              <h5>Producto</h5>
              <a href="#tierlist">Tier list</a>
              <a href="#campeones">Campeones</a>
              <a href="#premium">Premium</a>
            </div>
            <div class="foot-col">
              <h5>Legal</h5>
              <a href="/privacidad">Privacidad</a>
              <a href="#">Términos</a>
              <a href="/publicidad">Publicidad</a>
            </div>
          </div>
        </div>
        <div>© 2026 GrietaMeta. Todos los derechos reservados. Prohibida su reproducción total o parcial sin permiso.</div>
      </div>
    </footer>

    <div class="modal-overlay" id="modalOverlay">
      <div class="modal" id="modalRoot"></div>
    </div>
  </div>
</template>

<script setup>
import GameSearch from "@/components/GameSearch.vue";
import { ref } from "vue";
import { usePageScript } from "@/composables/usePageScript";
import { init } from "@/scripts/lol";
import "@/assets/styles/views/lol.css";

const root = ref(null);
usePageScript(root, init);

function scrollToPremium() {
  document.getElementById("premium")?.scrollIntoView({ behavior: "smooth" });
}
</script>
