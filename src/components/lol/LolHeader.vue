<template>
  <!-- Cabecera del hub: título, estado del parche y muestra analizada. -->
  <section class="lhead">
    <img class="lhead-bg" :src="splash" alt="">
    <div class="wrap lhead-in">
      <div class="crumbs">
        <RouterLink to="/">Juegos</RouterLink><span aria-hidden="true">/</span><span>League of Legends</span>
      </div>
      <div class="title-row">
        <img src="/images/games/logo-lol.png" alt="">
        <div>
          <h1 class="h1 disp">Tier list de <em>League of Legends</em></h1>
          <p class="lead">Winrate, pickrate y banrate reales de cada campeón, ordenados por rol y rango. Toca un campeón para ver su build.</p>
        </div>
      </div>
      <div class="pills">
        <span class="pill patch"><span class="dot"></span>Parche <strong>{{ patch.label }}</strong></span>
        <span class="pill">Clasificatoria solo/dúo · <strong>{{ patch.region }}</strong></span>
        <template v-if="patch.real">
          <span class="pill"><strong>{{ fmtInt(patch.games) }}</strong> partidas analizadas</span>
          <span v-if="patch.generatedAt" class="pill">Actualizado el <strong>{{ fmtDate(patch.generatedAt) }}</strong></span>
          <span v-if="patch.previousPatch" class="pill">El parche <strong>{{ patch.previousPatch }}</strong> está reuniendo partidas</span>
        </template>
        <span v-else-if="ready" class="pill warn">Datos ilustrativos · las estadísticas reales no se han podido cargar</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { fmtDate, fmtInt } from "@/services/lol/format";
import { championSplashUrl } from "@/services/lol/ddragon";

defineProps({
  patch: { type: Object, required: true },
  ready: { type: Boolean, default: false },
});
const splash = championSplashUrl("Ahri");
</script>

<style scoped>
.lhead {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.lhead-bg {
  position: absolute;
  right: 0;
  top: 0;
  width: 68%;
  height: 100%;
  object-fit: cover;
  object-position: 60% 25%;
  z-index: -2;
  opacity: 0.55;
  animation: lol-kb 18s ease-in-out infinite alternate;
}
.lhead::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, #07090D 32%, rgba(7, 9, 13, 0.75) 55%, rgba(7, 9, 13, 0.35) 100%), linear-gradient(0deg, #07090D 0%, transparent 45%);
}
.lhead-in {
  padding-top: 34px;
  padding-bottom: 34px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: lol-rise 0.8s var(--ease-out) both;
}
.crumbs { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-mute); }
.crumbs a { color: #A0A8B4; text-decoration: none; }
.crumbs a:hover { color: var(--ink); }
.title-row { display: flex; align-items: center; gap: 18px; }
.title-row img { width: 64px; height: 64px; object-fit: contain; filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.6)); flex-shrink: 0; }
.h1 { margin: 0; font-size: clamp(30px, 3.6vw, 44px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
.h1 em { font-style: normal; color: var(--gold-hi); }
.lead { margin: 6px 0 0; color: var(--ink-dim); font-size: 15px; max-width: 620px; }
.pills { display: flex; flex-wrap: wrap; gap: 8px; }
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(13, 16, 23, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.09);
  font-size: 13px;
  color: #C6CBD2;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.pill strong { color: var(--ink); font-weight: 600; }
.pill .dot { width: 7px; height: 7px; border-radius: 50%; background: #19D3C5; color: #19D3C5; animation: lol-ping 2.2s infinite; }
.pill.patch { border-color: rgba(10, 200, 185, 0.45); color: #7FE9DE; }
.pill.warn { border-color: rgba(240, 138, 122, 0.4); color: #F0B0A6; }
@media (max-width: 860px) {
  .lhead-bg { width: 100%; opacity: 0.3; }
}
@media (max-width: 560px) {
  .lhead-in { padding-top: 24px; padding-bottom: 24px; gap: 14px; }
  .title-row { gap: 12px; align-items: flex-start; }
  .title-row img { width: 48px; height: 48px; }
  .lead { font-size: 14px; }
}
</style>
