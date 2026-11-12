<template>
  <!-- Cabecera del hub: «Sube a la superficie», jefe destacado y cifras reales. -->
  <section class="hero">
    <div class="wrap hero-in">
      <div class="htx">
        <span class="kick"><i></i>ARC Raiders · Guía en español</span>
        <h1 class="h1 cond">Sube a la superficie<span>y vuelve con botín</span></h1>
        <p class="lead">Mapas, objetos, misiones y enemigos con datos reales: qué reciclar, qué guardar y en qué mapa está cada misión.</p>
        <div class="ctas">
          <RouterLink class="btn-y" :to="{ name: 'arc-map' }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
            Ver los mapas
          </RouterLink>
          <a class="btn-c" href="#objetos" @click.prevent="goTo('objetos')">¿Qué hago con este objeto?</a>
        </div>
      </div>
      <div class="shot">
        <span class="rays" aria-hidden="true"></span>
        <RouterLink class="frame" :to="boss ? { name: 'arc-enemies', query: { ver: boss.id } } : { name: 'arc-enemies' }" :aria-label="`${boss?.name || 'The Queen'}: ver su ficha`">
          <img :src="boss?.img || '/images/arc-raiders/bots/arc_the_queen.webp'" :alt="`${boss?.name || 'The Queen'}, jefe ARC`" width="640" height="400">
          <span class="scan" aria-hidden="true"></span>
          <span class="hud" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span class="tagx">
            <b class="cond">{{ boss?.name || "The Queen" }}</b>
            <span><span v-if="boss" class="thr" :class="boss.tc">{{ boss.threat }}</span>{{ boss ? `${boss.type} · ${boss.mapList}` : "Jefe" }}</span>
          </span>
        </RouterLink>
      </div>
    </div>
    <div class="stripes" aria-hidden="true"></div>
    <div class="wrap kpis">
      <div v-for="k in kpis" :key="k.label" class="kpi">
        <b>{{ k.value }}</b><span>{{ k.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  // [{ value, label }]
  kpis: { type: Array, required: true },
  // Jefe que se muestra en la imagen (de topEnemies).
  boss: { type: Object, default: null },
});

// Ancla dentro de la misma página sin pasar por el router (el nav es fijo:
// scroll-padding-top de base.css deja su hueco).
function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(history.state, "", "#" + id);
}
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid rgba(242, 235, 221, 0.06);
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background: radial-gradient(700px 420px at 78% 40%, rgba(242, 138, 30, 0.13), transparent 70%), radial-gradient(500px 300px at 0% 0%, rgba(59, 201, 232, 0.07), transparent 70%);
}
.hero-in {
  display: flex;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
  padding-top: 56px;
  padding-bottom: 48px;
}
.htx {
  flex: 1 1 480px;
  max-width: 600px;
  animation: arc-rise 0.8s var(--ease-out) both;
}
.h1 {
  margin: 14px 0 0;
  font-size: clamp(46px, 6vw, 82px);
  font-weight: 800;
  line-height: 0.92;
}
.h1 span { display: block; color: var(--arc-yellow); }
.lead { margin: 20px 0 0; color: var(--arc-dim); font-size: 17px; max-width: 540px; text-wrap: pretty; }
.ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }

.shot {
  position: relative;
  flex: 1 1 520px;
  max-width: 640px;
  aspect-ratio: 16 / 10;
  animation: arc-rise 0.8s 0.15s var(--ease-out) both;
}
.shot .rays {
  position: absolute;
  right: -60px;
  top: -40px;
  width: 280px;
  height: 120%;
  transform: skewX(-24deg);
  background: var(--arc-stripes);
  opacity: 0.85;
  z-index: -1;
}
.shot .frame {
  position: absolute;
  inset: 0;
  display: block;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(242, 235, 221, 0.14);
  box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.9);
  color: var(--arc-ink);
  text-decoration: none;
}
.shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05) contrast(1.05);
  transition: transform 1.2s var(--ease-out);
}
.shot .frame:hover img { transform: scale(1.04); }
.shot .scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(180deg, transparent, rgba(242, 138, 30, 0.16), transparent);
  animation: arc-scan 4s linear infinite;
}
.shot .hud { position: absolute; inset: 14px; pointer-events: none; }
.shot .hud i { position: absolute; width: 22px; height: 22px; border: 0 solid var(--arc-yellow); }
.shot .hud i:nth-child(1) { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; }
.shot .hud i:nth-child(2) { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; }
.shot .hud i:nth-child(3) { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; }
.shot .hud i:nth-child(4) { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; }
.shot .tagx {
  position: absolute;
  left: 24px;
  bottom: 22px;
  max-width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(11, 10, 14, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(242, 235, 221, 0.12);
}
.shot .tagx b { font-size: 24px; font-weight: 800; line-height: 1; }
.shot .tagx > span { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; font-size: 12.5px; color: #C8C1B6; }

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  border-top: 1px solid rgba(242, 235, 221, 0.06);
}
.kpi {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 20px 28px;
  border-right: 1px solid rgba(242, 235, 221, 0.06);
}
.kpi:last-child { border-right: 0; }
.kpi b { font-family: var(--font-brand); font-size: 38px; font-weight: 700; line-height: 1; color: var(--arc-ink); }
.kpi span { font-size: 14px; color: var(--arc-mute); }

@media (max-width: 860px) {
  .hero-in { gap: 32px; padding-top: 36px; padding-bottom: 36px; }
  .shot .rays { width: 180px; right: -40px; }
}
@media (max-width: 640px) {
  .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kpi { padding: 14px 16px; }
  .kpi:nth-child(2n) { border-right: 0; }
  .kpi:nth-child(-n + 2) { border-bottom: 1px solid rgba(242, 235, 221, 0.06); }
  .kpi b { font-size: 30px; }
}
@media (max-width: 560px) {
  .htx { flex-basis: 100%; }
  .shot { flex-basis: 100%; }
  .lead { font-size: 15.5px; }
  .ctas a { flex: 1 1 100%; }
  .shot .tagx { left: 14px; bottom: 14px; max-width: calc(100% - 28px); padding: 10px 12px; }
  .shot .tagx b { font-size: 20px; }
}
</style>
