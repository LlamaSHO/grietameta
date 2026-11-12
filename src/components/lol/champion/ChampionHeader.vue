<template>
  <!-- Cabecera de la ficha: splash, retrato con tier, habilidades y pestañas. -->
  <section class="chead">
    <img class="chead-bg" :src="champ.splash" alt="">
    <div class="ch-in">
      <div class="portrait">
        <img :src="champ.icon" :alt="champ.name" width="120" height="120">
        <span v-if="entry" class="tier" :class="entry.tc">{{ entry.tier }}</span>
      </div>
      <div class="ch-main">
        <div class="crumbs">
          <RouterLink to="/lol">League of Legends</RouterLink><span aria-hidden="true">/</span>
          <RouterLink :to="{ path: '/lol', hash: '#campeones' }">Campeones</RouterLink><span aria-hidden="true">/</span>
          <span>{{ champ.name }}</span>
        </div>
        <h1 class="h1 disp">{{ champ.name }} <span>Build, runas y estadísticas · {{ patchLabel }}</span></h1>
        <div class="ch-sub">
          <span v-if="title">{{ title }}</span>
          <span class="chip"><span class="pi" :class="`pi-${ROLE_ICON[champ.role]}`" aria-hidden="true"></span>{{ champ.role }}</span>
          <span class="chip">{{ champ.cls }}</span>
        </div>
        <div v-if="abilities.length" class="abil" aria-label="Habilidades">
          <span v-for="a in abilities" :key="a.key" class="ab" tabindex="0">
            <img :src="a.icon" :alt="`${a.key === 'P' ? 'Pasiva' : a.key}: ${a.name}`" width="46" height="46">
            <b>{{ a.key }}</b>
            <span class="tip" role="tooltip">{{ a.key === "P" ? "Pasiva" : a.key }} · {{ a.name }}</span>
          </span>
        </div>
        <div v-else class="abil abil-ph" aria-hidden="true"><span v-for="k in 5" :key="k" class="ab"></span></div>
      </div>
    </div>
    <div class="tabs" role="tablist" aria-label="Secciones del campeón">
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        class="tab"
        :class="{ on: tab === t.key }"
        role="tab"
        :aria-selected="tab === t.key ? 'true' : 'false'"
        @click="emit('update:tab', t.key)"
      >
        {{ t.label }} <span v-if="t.soon" class="soon">Pronto</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { ROLE_ICON } from "@/services/lol/roster";
import { passiveIconUrl, spellIconUrl } from "@/services/lol/ddragon";

const props = defineProps({
  champ: { type: Object, required: true },
  entry: { type: Object, default: null }, // estadísticas del rango elegido
  detail: { type: Object, default: null }, // ficha de Data Dragon (es_ES)
  version: { type: String, required: true },
  patchLabel: { type: String, default: "" },
  tab: { type: String, default: "build" },
});
const emit = defineEmits(["update:tab"]);

const tabs = [
  { key: "build", label: "Build" },
  { key: "rank", label: "Por rango" },
  { key: "mu", label: "Matchups", soon: true },
];

// "la Espada sin Honor" → "La Espada sin Honor"
const title = computed(() => {
  const t = props.detail?.title || "";
  return t ? t[0].toUpperCase() + t.slice(1) : "";
});

const abilities = computed(() => {
  const d = props.detail;
  if (!d) return [];
  const list = [];
  if (d.passive?.image?.full) list.push({ key: "P", name: d.passive.name, icon: passiveIconUrl(props.version, d.passive.image.full) });
  ["Q", "W", "E", "R"].forEach((k, i) => {
    const s = d.spells?.[i];
    if (s?.image?.full) list.push({ key: k, name: s.name, icon: spellIconUrl(props.version, s.image.full) });
  });
  return list;
});
</script>

<style scoped>
@keyframes glow {
  0%, 100% { box-shadow: 0 0 0 1px rgba(242, 169, 59, 0.6), 0 0 24px -4px rgba(242, 169, 59, 0.6); }
  50% { box-shadow: 0 0 0 1px rgba(242, 169, 59, 0.9), 0 0 36px -2px rgba(242, 169, 59, 0.85); }
}
@keyframes kb {
  from { transform: scale(1.06); }
  to { transform: scale(1.14) translateX(-2%); }
}
.chead {
  position: relative;
  margin-top: 24px;
  border-radius: 20px;
  overflow: hidden;
  isolation: isolate;
  background: #0D1017;
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: lol-rise 0.7s var(--ease-out) both;
}
.chead-bg {
  position: absolute;
  right: 0;
  top: 0;
  width: 66%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 18%;
  z-index: -2;
  opacity: 0.5;
  animation: kb 20s ease-in-out infinite alternate;
}
.chead::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, #0D1017 30%, rgba(13, 16, 23, 0.78) 55%, rgba(13, 16, 23, 0.3));
}
.ch-in { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; padding: 26px 28px; }
.portrait { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
.portrait img { width: 100%; height: 100%; border-radius: 22px; object-fit: cover; animation: glow 3s ease-in-out infinite; }
.portrait .tier { position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); isolation: isolate; }
/* Fondo opaco bajo la insignia para que se lea encima del retrato. */
.portrait .tier::before { content: ""; position: absolute; inset: -1px; z-index: -1; border-radius: inherit; background: #0D1017; }
.ch-main { display: flex; flex-direction: column; gap: 10px; min-width: 0; flex: 1; }
.crumbs { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 13px; color: var(--ink-mute); }
.lol-page .crumbs a { color: #A0A8B4; text-decoration: none; }
.lol-page .crumbs a:hover { color: var(--ink); }
.h1 {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}
.h1 span { font-family: var(--font-body); font-size: 18px; font-weight: 500; letter-spacing: 0; color: var(--ink-dim); }
.ch-sub { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 14px; color: #C6CBD2; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(7, 9, 13, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12.5px;
}
.chip .pi { width: 16px; height: 16px; }
.abil { display: flex; gap: 8px; flex-wrap: wrap; }
.ab { position: relative; width: 46px; height: 46px; border-radius: 11px; outline: none; }
.abil-ph .ab { background: rgba(255, 255, 255, 0.05); }
.ab img { width: 100%; height: 100%; border-radius: 11px; border: 1px solid rgba(226, 181, 102, 0.45); display: block; transition: transform 0.2s; }
.ab:hover img,
.ab:focus-visible img { transform: translateY(-3px); }
.ab b {
  position: absolute;
  right: -5px;
  bottom: -5px;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #0D1017;
  border: 1px solid rgba(226, 181, 102, 0.55);
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
}
.tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translate(-50%, 4px);
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 8px;
  background: #151A23;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12.5px;
  color: var(--ink);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, transform 0.15s;
  z-index: 5;
}
.ab:hover .tip,
.ab:focus .tip { opacity: 1; transform: translate(-50%, 0); }
/* La primera (pasiva) se alinea a la izquierda para no salirse de la tarjeta. */
.ab:first-child .tip { left: 0; transform: translate(0, 4px); }
.ab:first-child:hover .tip,
.ab:first-child:focus .tip { transform: none; }
.tabs {
  display: flex;
  gap: 4px;
  padding: 0 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(7, 9, 13, 0.4);
  overflow-x: auto;
  scrollbar-width: none;
}
.tab {
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 50px;
  padding: 0 14px;
  border: 0;
  background: transparent;
  color: #A0A8B4;
  font: inherit;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}
.tab:hover,
.tab.on { color: var(--ink); }
.tab.on::after {
  content: "";
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #C8AA6E, #0AC8B9);
}
.soon {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 5px;
  background: rgba(10, 200, 185, 0.14);
  color: #7FE9DE;
}
@media (max-width: 860px) {
  .chead-bg { width: 100%; opacity: 0.25; }
}
@media (max-width: 640px) {
  .chead { margin-top: 16px; }
  .ch-in { flex-direction: column; align-items: flex-start; gap: 18px; padding: 22px 18px; }
  .ch-main { width: 100%; }
  .portrait { width: 92px; height: 92px; }
  .h1 span { font-size: 15px; }
  .tabs { padding: 0 8px; }
}
</style>
