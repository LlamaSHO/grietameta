<template>
  <!-- Cabecera del hub de Zelda (#inicio). Diseño: .hero de Zelda.dc.html. -->
  <section id="inicio" class="hero">
    <img class="hero-bg" src="/images/zelda/hyrule.jpg" alt="" fetchpriority="low">
    <div class="rings" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div class="wrap hero-in">
      <div class="htx">
        <span class="zh-kick">Guía en español · versión 1.2.1</span>
        <h1 class="h1">No te dejes nada en <em>Hyrule</em>.</h1>
        <p class="lead">Mapa de semillas kolog y de los {{ stats.shrines }} santuarios, misiones principales y secundarias, y las armaduras con más defensa de Tears of the Kingdom.</p>
        <div class="ctas">
          <RouterLink class="btn-z" :to="{ path: '/zelda', hash: '#mapa' }" @click="sameHash('#mapa')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
            Abrir el mapa interactivo
          </RouterLink>
          <RouterLink class="btn-o" :to="{ path: '/zelda', hash: '#info' }" @click="sameHash('#info')">Ver las guías</RouterLink>
        </div>
      </div>
      <div class="hstats">
        <div class="hs">
          <svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V10a7 7 0 0 1 14 0v11" /><path d="M9 21v-6a3 3 0 0 1 6 0v6" /><path d="M3 21h18" /></svg>
          <b>{{ stats.shrines }}</b><span>Santuarios</span><small>{{ stats.shrinesSurf }} superficie · {{ stats.shrinesSky }} cielo</small>
        </div>
        <div class="hs">
          <svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
          <b>{{ stats.seeds }}</b><span>Semillas kolog</span><small>de {{ stats.kologs }} kologs en el mapa</small>
        </div>
        <div class="hs">
          <svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h11a2 2 0 0 1 2 2v2h-4" /><path d="M17 7v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2h11" /><path d="M8 3a2 2 0 0 0-2 2v12" /></svg>
          <b>{{ stats.quests }}</b><span>Misiones</span><small>{{ stats.questsMain }} principales · {{ stats.quests - stats.questsMain }} extra</small>
        </div>
        <div class="hs">
          <svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l9 5-9 5-9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 16.5l9 5 9-5" /></svg>
          <b>{{ stats.sets }}</b><span>Conjuntos</span><small>con materiales por nivel</small>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ZELDA_DATA } from "@/data/zelda";
import { POINTS, TOTALS } from "./mapPoints";

const route = useRoute();
const M = ZELDA_DATA.misiones;

const stats = {
  shrines: TOTALS.sh,
  shrinesSurf: POINTS.sh.surf.length,
  shrinesSky: POINTS.sh.sky.length,
  seeds: TOTALS.sd,
  kologs: TOTALS.kologs,
  questsMain: M.main.length,
  quests: M.main.length + (M.adv?.length || 0) + (M.sq?.length || 0),
  sets: ZELDA_DATA.conjuntos.sets.length,
};

// Si ya estamos en ese ancla, el router no navega: se baja a mano.
function sameHash(hash) {
  if (route.path === "/zelda" && route.hash === hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
}
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid rgba(127, 235, 203, 0.08);
}
.hero-bg {
  position: absolute;
  right: -4%;
  top: -10%;
  width: 62%;
  height: 120%;
  object-fit: cover;
  z-index: -3;
  opacity: 0.32;
  filter: saturate(0.5) hue-rotate(95deg);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 60% 50%, #000 30%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 70% at 60% 50%, #000 30%, transparent 75%);
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background: radial-gradient(600px 400px at 75% 40%, rgba(79, 224, 182, 0.14), transparent 70%), radial-gradient(500px 300px at 10% 0%, rgba(216, 194, 122, 0.07), transparent 70%);
}
.rings {
  position: absolute;
  right: 12%;
  top: 50%;
  width: 440px;
  height: 440px;
  margin-top: -220px;
  z-index: -1;
  pointer-events: none;
}
.rings span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(127, 235, 203, 0.18);
}
.rings span:nth-child(2) {
  inset: 44px;
  border-style: dashed;
  border-color: rgba(127, 235, 203, 0.24);
  animation: zh-spin 60s linear infinite;
}
.rings span:nth-child(3) {
  inset: 96px;
  border-color: rgba(216, 194, 122, 0.22);
  border-top-color: rgba(216, 194, 122, 0.6);
  animation: zh-spinr 40s linear infinite;
}
.rings span:nth-child(4) {
  inset: 150px;
  border: 2px dotted rgba(127, 235, 203, 0.35);
  animation: zh-spin 24s linear infinite;
}
.hero-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
  padding-top: 56px;
  padding-bottom: 52px;
}
.htx {
  flex: 1 1 520px;
  max-width: 640px;
  animation: zh-rise 0.8s var(--ease-out) both;
}
.h1 {
  margin: 16px 0 0;
  font-family: var(--font-zelda);
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: 0.01em;
  text-wrap: balance;
}
.h1 em {
  font-style: normal;
  color: #4FE0B6;
  text-shadow: 0 0 30px rgba(79, 224, 182, 0.45);
}
.lead {
  margin: 18px 0 0;
  color: #A9BDB6;
  font-size: 17px;
  max-width: 560px;
  text-wrap: pretty;
}
.ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
}
.btn-z,
.btn-o {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  border-radius: 13px;
  font-size: 14.5px;
  text-decoration: none;
}
.btn-z {
  background: linear-gradient(180deg, #5DE8C1, #2FBF97);
  color: #04211A;
  font-weight: 700;
  box-shadow: 0 14px 34px -14px rgba(79, 224, 182, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.2s;
}
.btn-z:hover {
  color: #04211A;
  transform: translateY(-2px);
}
.btn-o {
  border: 1px solid rgba(216, 194, 122, 0.45);
  color: #E9DCAF;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-o:hover {
  color: #E9DCAF;
  background: rgba(216, 194, 122, 0.08);
}
.btn-z:focus-visible,
.btn-o:focus-visible {
  outline: 2px solid #F1E7C8;
  outline-offset: 3px;
}
.hstats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  flex: 0 1 420px;
  animation: zh-rise 0.8s 0.15s var(--ease-out) both;
}
.hs {
  position: relative;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(12, 30, 27, 0.85), rgba(7, 18, 16, 0.85));
  border: 1px solid rgba(127, 235, 203, 0.14);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
}
.hs:nth-child(2),
.hs:nth-child(3) {
  animation: zh-drift 7s ease-in-out infinite;
}
.hs:nth-child(3) {
  animation-delay: -3.5s;
}
.hs .ic {
  color: #7FEBCB;
}
.hs b {
  display: block;
  margin-top: 10px;
  font-family: var(--font-zelda);
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  color: #F1E7C8;
}
.hs span {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #A9BDB6;
}
.hs small {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: #7F978F;
}

@media (max-width: 860px) {
  .rings {
    display: none;
  }
  .hero-in {
    gap: 28px;
    padding-top: 40px;
    padding-bottom: 36px;
  }
  .hero-bg {
    width: 100%;
    right: 0;
  }
}
@media (max-width: 560px) {
  .htx {
    flex-basis: 100%;
  }
  .lead {
    font-size: 16px;
  }
  .ctas a {
    flex: 1 1 auto;
    justify-content: center;
  }
  .hs {
    padding: 14px;
  }
  .hs b {
    font-size: 28px;
  }
}
</style>
