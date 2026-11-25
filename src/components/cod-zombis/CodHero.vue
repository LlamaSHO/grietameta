<template>
  <!-- Cabecera de la portada (diseño: .zh de CodZombies.dc.html) -->
  <section class="zh" id="inicio">
    <div class="zh-bg" aria-hidden="true">
      <img src="/images/cod-zombis/cod-hero.webp" alt="" fetchpriority="high" decoding="async" />
      <span class="grain"></span><span class="fog"></span>
    </div>
    <div class="wrap zh-in">
      <span class="kicker">Call of Duty · Black Ops 1 a 4</span>
      <h1 class="stencil">Zombis</h1>
      <p class="lead">De un cine abandonado en 1963 al final del Aether: <b>26 mapas</b> con su Pack-a-Punch, ventajas, armas de pared y Easter eggs paso a paso, con los spoilers tapados hasta que tú quieras.</p>
      <div class="cta">
        <RouterLink class="btn-r" to="/cod-zombis/black-ops">
          Empieza por Black Ops
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
        </RouterLink>
        <a class="btn-o" href="#historia">La historia del Aether</a>
      </div>
      <dl class="stats">
        <div><dt class="sc">4</dt><dd>juegos de Treyarch</dd></div>
        <div><dt class="sc">26</dt><dd>mapas con ficha</dd></div>
        <div><dt class="sc">22</dt><dd>Easter eggs principales</dd></div>
        <div><dt class="sc">2010–2018</dt><dd>de Kino a Tag der Toten</dd></div>
      </dl>
    </div>
    <CodRunners />
    <span class="hz" aria-hidden="true"></span>
  </section>
</template>

<script setup>
import CodRunners from "./CodRunners.vue";
</script>
