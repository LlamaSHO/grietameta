<template>
  <!-- Página no encontrada (404). No tiene diseño propio: sigue el hero de la
       portada (rejilla de puntos, brillos, iconos flotantes y emblema GM). -->
  <section class="nf">
    <div class="nf-grid" aria-hidden="true"></div>
    <div class="glow g1" aria-hidden="true"></div>
    <div class="glow g2" aria-hidden="true"></div>
    <FloatingDeco />

    <div class="wrap">
      <HomeEmblem />

      <p class="code">Error 404</p>
      <h1 class="h1">
        <span class="w">Página</span>
        <span class="w">no</span>
        <span class="w gold">encontrada<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14 C 50 4, 120 4, 197 11" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" /></svg></span>
      </h1>

      <p class="lead">Esta dirección no existe o ha cambiado de sitio. Vuelve a la portada o busca el juego que te interesa.</p>

      <div class="actions">
        <RouterLink class="btn-gold" to="/">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 6 5 12 11 18" /></svg>
          Volver a la portada
        </RouterLink>
        <RouterLink class="btn-line" :to="{ path: '/contacto', query: { motivo: 'error' } }">Avisar de un enlace roto</RouterLink>
      </div>

      <div class="search-wrap">
        <GameSearch big :shortcut="false" placeholder="Busca un juego… (LoL, ARC, Zelda)" />
      </div>
    </div>
  </section>
</template>

<script setup>
import GameSearch from "@/components/GameSearch.vue";
import HomeEmblem from "@/components/home/HomeEmblem.vue";
import FloatingDeco from "@/components/home/FloatingDeco.vue";
</script>

<style scoped>
.nf {
  position: relative;
  isolation: isolate;
  overflow-x: clip;
  padding: 64px 0 120px;
  text-align: center;
}
.nf-grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1.2px);
  background-size: 30px 30px;
  -webkit-mask-image: radial-gradient(ellipse 65% 70% at 50% 35%, #000 20%, transparent 72%);
  mask-image: radial-gradient(ellipse 65% 70% at 50% 35%, #000 20%, transparent 72%);
}
.glow {
  position: absolute;
  z-index: -1;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.32;
  pointer-events: none;
  animation: drift 16s ease-in-out infinite alternate;
}
.glow.g1 {
  top: -180px;
  left: 8%;
  background: #B9832F;
}
.glow.g2 {
  top: -140px;
  right: 6%;
  background: #0F8F88;
  animation-duration: 19s;
  animation-direction: alternate-reverse;
}
@keyframes drift {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(60px, 30px, 0) scale(1.15); }
}

.code {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 22px 0 0;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.035);
  font-family: var(--font-brand);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gm-gold);
  animation: gm-rise 0.8s var(--ease-out) both;
}

.h1 {
  margin: 22px 0 0;
  font-family: var(--font-display);
  font-size: clamp(44px, 7vw, 88px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.04em;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 0.24em;
  row-gap: 0.08em;
}
.w {
  display: inline-block;
  animation: gm-rise 0.9s var(--ease-out) both;
}
.w:nth-child(1) { animation-delay: 0.08s; }
.w:nth-child(2) { animation-delay: 0.16s; }
.w:nth-child(3) { animation-delay: 0.24s; }
.gold {
  position: relative;
  color: var(--gold-hi);
}
.gold svg {
  position: absolute;
  left: -2%;
  bottom: -0.14em;
  width: 104%;
  height: 0.3em;
  overflow: visible;
  color: var(--gold);
}
.gold path {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: draw 1.1s 0.7s cubic-bezier(0.6, 0, 0.2, 1) forwards;
}
/* Sin animaciones (base.css), el subrayado se ve ya dibujado. */
@media (prefers-reduced-motion: reduce) {
  .gold path { stroke-dashoffset: 0; }
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.lead {
  max-width: 560px;
  margin: 26px auto 0;
  font-size: 18px;
  color: var(--ink-dim);
  text-wrap: pretty;
  animation: gm-rise 0.9s 0.3s var(--ease-out) both;
}

.actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
  animation: gm-rise 0.9s 0.38s var(--ease-out) both;
}
.btn-gold {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  border-radius: 13px;
  background: linear-gradient(180deg, #E0AE58, #C8913A);
  color: #17120A;
  font-weight: 600;
  font-size: 14.5px;
  text-decoration: none;
  box-shadow: 0 8px 24px -10px rgba(212, 160, 74, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-gold:hover {
  color: #17120A;
  transform: translateY(-1px);
  box-shadow: 0 12px 30px -10px rgba(212, 160, 74, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.btn-gold svg {
  transition: transform 0.3s;
}
.btn-gold:hover svg {
  transform: translateX(-4px);
}
.btn-line {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 20px;
  border-radius: 13px;
  border: 1px solid rgba(212, 160, 74, 0.5);
  color: var(--gold-hi);
  font-weight: 600;
  font-size: 14.5px;
  text-decoration: none;
  transition: background 0.25s, color 0.25s;
}
.btn-line:hover {
  background: var(--gold);
  color: #17120A;
}
.btn-gold:focus-visible,
.btn-line:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.search-wrap {
  position: relative;
  z-index: 5;
  max-width: 640px;
  margin: 40px auto 0;
  animation: gm-rise 0.9s 0.46s var(--ease-out) both;
}

@media (max-width: 860px) {
  .nf {
    padding: 56px 0 72px;
  }
  .lead {
    font-size: 16px;
  }
}
@media (max-width: 560px) {
  .glow {
    width: 340px;
    height: 340px;
    filter: blur(70px);
  }
  .actions {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-gold,
  .btn-line {
    justify-content: center;
  }
}
</style>
