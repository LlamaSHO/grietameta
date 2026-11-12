<template>
  <!-- «Elige tu zona»: una tarjeta por mapa que abre su visor. -->
  <section id="mapas" class="sec">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kick"><i></i>Mapas</span>
          <h2 class="h2 cond">Elige tu zona</h2>
          <p>Cada mapa tiene su página con el mapa a pantalla completa, sus misiones y los ARC que te vas a encontrar.</p>
        </div>
        <RouterLink class="more" :to="{ name: 'arc-map' }">Todos los mapas →</RouterLink>
      </div>
      <div class="maps">
        <RouterLink v-for="m in maps" :key="m.id" class="mc" :to="mapRoute(m.id)" :aria-label="`Mapa de ${m.name}${m.meta ? ': ' + m.meta : ''}`">
          <img :src="m.img" alt="" loading="lazy" decoding="async">
          <span class="sl" aria-hidden="true"></span>
          <span v-if="m.quests !== null || m.enemiesText" class="chips">
            <span v-if="m.quests !== null" class="chip">{{ m.quests }} {{ m.quests === 1 ? "misión" : "misiones" }}</span>
            <span v-if="m.enemiesText" class="chip">{{ m.enemiesText }}</span>
          </span>
          <span class="bot">
            <span>
              <h3 class="cond">{{ m.name }}</h3>
              <p v-if="m.sub">{{ m.sub }}</p>
            </span>
            <span class="go" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
            </span>
          </span>
          <span class="bar" aria-hidden="true"></span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { mapRoute } from "@/components/arc/lists/arcLabels";

defineProps({
  // De summarizeMaps (arcData.js).
  maps: { type: Array, required: true },
});
</script>

<style scoped>
.maps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
  gap: 16px;
}
.mc {
  position: relative;
  display: block;
  height: 270px;
  border-radius: 18px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(242, 235, 221, 0.1);
  background: var(--arc-panel);
  text-decoration: none;
  color: var(--arc-ink);
  transition: border-color 0.3s, transform 0.3s var(--ease-out), box-shadow 0.3s;
}
.mc:hover {
  color: var(--arc-ink);
  transform: translateY(-4px);
  border-color: rgba(245, 192, 42, 0.6);
  box-shadow: 0 30px 60px -30px rgba(242, 138, 30, 0.6);
}
.mc:focus-visible { outline: 2px solid var(--arc-yellow); outline-offset: 3px; }
.mc img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  filter: saturate(0.8) brightness(0.75);
  transform: scale(1.15);
  transition: transform 1.2s var(--ease-out), filter 0.6s;
}
.mc:hover img { transform: scale(1.32); filter: saturate(1) brightness(0.95); }
.mc::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(11, 10, 14, 0.2), rgba(11, 10, 14, 0.15) 40%, rgba(11, 10, 14, 0.95));
}
.mc .sl {
  position: absolute;
  left: 0;
  right: 0;
  height: 60px;
  top: -30%;
  background: linear-gradient(180deg, transparent, rgba(59, 201, 232, 0.14), transparent);
  opacity: 0;
}
.mc:hover .sl { opacity: 1; animation: arc-scan 2.4s linear infinite; }
.chips { position: absolute; top: 14px; left: 14px; display: flex; gap: 6px; flex-wrap: wrap; }
.chip {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 7px;
  background: rgba(11, 10, 14, 0.75);
  border: 1px solid rgba(242, 235, 221, 0.14);
  font-size: 12px;
  font-weight: 600;
  color: var(--arc-ink-2);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.bot {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
h3 { margin: 0; font-size: 34px; font-weight: 800; line-height: 0.95; }
.bot p { margin: 6px 0 0; font-size: 13.5px; color: #C8C1B6; }
.go {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(242, 235, 221, 0.1);
  border: 1px solid rgba(242, 235, 221, 0.2);
  transition: background 0.3s, color 0.3s, transform 0.4s;
}
.mc:hover .go { background: var(--arc-yellow); color: #141007; transform: rotate(-45deg); }
.mc .bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.7s var(--ease-out);
  background: var(--arc-stripes);
}
.mc:hover .bar { transform: scaleX(1); }

@media (max-width: 640px) {
  .maps { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .mc { height: 170px; border-radius: 14px; }
  h3 { font-size: 22px; }
  .bot p,
  .go,
  .chips { display: none; }
  .bot { left: 12px; right: 12px; bottom: 12px; }
}
</style>
