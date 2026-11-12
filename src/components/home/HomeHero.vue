<template>
  <!-- Hero de la portada (.hero de models/paginas/Main.dc.html): rejilla de
       puntos, brillos, iconos flotantes, destacados, emblema GM, título,
       buscador grande y atajos. -->
  <section class="hero">
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="glow g1" aria-hidden="true"></div>
    <div class="glow g2" aria-hidden="true"></div>

    <FloatingDeco />
    <FeaturedFloaters />

    <div class="wrap">
      <HomeEmblem />

      <h1 class="h1">
        <span class="w">Elige</span>
        <span class="w">tu</span>
        <span class="w gold">juego<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14 C 50 4, 120 4, 197 11" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" /></svg></span>
      </h1>

      <p class="lead">Builds, tier lists y guías con datos reales. Escoge un juego o búscalo por nombre; si todavía no lo tenemos, pídelo.</p>

      <div class="search-wrap">
        <GameSearch big :shortcut="false" placeholder="Busca un juego… (LoL, ARC, Zelda)" />
      </div>

      <div class="quick">
        <span class="quick-label">Atajos</span>
        <RouterLink v-for="q in QUICK" :key="q.to" class="qchip" :to="q.to">
          <img :src="q.icon" alt="" width="22" height="22">{{ q.label }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import GameSearch from "@/components/GameSearch.vue";
import HomeEmblem from "./HomeEmblem.vue";
import FloatingDeco from "./FloatingDeco.vue";
import FeaturedFloaters from "./FeaturedFloaters.vue";

// Atajos bajo el buscador.
const QUICK = [
  { label: "Tier list de LoL", to: "/lol#tierlist", icon: "/images/games/logo-lol.png" },
  { label: "Enemigos de ARC", to: "/arc-raiders/enemigos", icon: "/images/games/logo-arc.png" },
  { label: "Semillas kolog", to: "/zelda/semillas", icon: "/images/games/logo-zelda.png" },
];
</script>

<style scoped>
.hero {
  position: relative;
  padding: 64px 0 88px;
  text-align: center;
  isolation: isolate;
  /* Por encima de la sección siguiente: el desplegable del buscador puede
     salirse del hero y no debe quedar tapado por los paneles. */
  z-index: 2;
}
.hero-grid {
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
  opacity: 0.38;
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

/* Título: las palabras suben una tras otra y el subrayado dorado se dibuja */
.h1 {
  margin: 26px 0 0;
  font-family: var(--font-display);
  font-size: clamp(52px, 8vw, 104px);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  column-gap: 0.24em;
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
  max-width: 600px;
  margin: 24px auto 0;
  font-size: 18px;
  color: var(--ink-dim);
  text-wrap: pretty;
  animation: gm-rise 0.9s 0.3s var(--ease-out) both;
}

/* El buscador grande sale de GameSearch (prop big, estilos en games-nav.css).
   z-index para que su desplegable quede por encima de los atajos. */
.search-wrap {
  position: relative;
  z-index: 5;
  max-width: 640px;
  margin: 38px auto 0;
  animation: gm-rise 0.9s 0.38s var(--ease-out) both;
}

.quick {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  animation: gm-rise 0.9s 0.46s var(--ease-out) both;
}
.quick-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.qchip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px 0 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.03);
  color: #D6D3CB;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.qchip img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.qchip:hover {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(212, 160, 74, 0.45);
  transform: translateY(-2px);
}
.qchip:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

@media (max-width: 860px) {
  .hero {
    padding: 64px 0 56px;
  }
  .lead {
    font-size: 16px;
  }
}
/* Móvil estrecho: el título en dos líneas y los atajos en fila con scroll
   no caben bien; se dejan en varias filas centradas y algo más compactas. */
@media (max-width: 560px) {
  .hero {
    padding: 48px 0 48px;
  }
  .glow {
    width: 340px;
    height: 340px;
    filter: blur(70px);
  }
  .search-wrap {
    margin-top: 30px;
  }
  .quick-label {
    flex-basis: 100%;
  }
  .qchip {
    font-size: 13px;
  }
}
</style>
