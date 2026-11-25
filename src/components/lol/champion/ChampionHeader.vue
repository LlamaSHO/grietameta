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
          <span v-if="difficulty" class="chip">Dificultad <b class="dif">{{ difficulty }}/10</b></span>
        </div>
        <div v-if="abilities.length" class="abil" aria-label="Habilidades">
          <span v-for="a in abilities" :key="a.key" class="ab" tabindex="0" :aria-label="`${a.key === 'P' ? 'Pasiva' : a.key}: ${a.name}`">
            <img :src="a.icon" alt="" width="46" height="46">
            <b>{{ a.key }}</b>
            <span class="tip" role="tooltip"><strong class="tip-n">{{ a.name }}</strong><small>{{ a.meta }}</small><span v-if="a.desc" class="tip-d">{{ a.desc }}</span></span>
          </span>
        </div>
        <div v-else class="abil abil-ph" aria-hidden="true"><span v-for="k in 5" :key="k" class="ab"></span></div>
      </div>
      <div v-if="quick" class="qf">
        <div v-if="quick.best" class="qf-i good"><small>Mejor duelo</small><span class="sp-cs" :style="{ backgroundPosition: quick.best.pos }"></span><b>{{ quick.best.n }}</b><em>{{ quick.best.wr }} de victorias</em></div>
        <div v-if="quick.worst" class="qf-i bad"><small>Peor duelo</small><span class="sp-cs" :style="{ backgroundPosition: quick.worst.pos }"></span><b>{{ quick.worst.n }}</b><em>{{ quick.worst.wr }} de victorias</em></div>
        <div v-if="quick.power" class="qf-i"><small>Pico de poder</small><span class="qf-it"><img v-for="it in quick.power.items" :key="it.name" :src="it.icon" :alt="it.name" :title="it.name" width="30" height="30"></span><b>{{ quick.power.items.length }} objetos</b></div>
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
        {{ t.label }} <span v-if="t.count" class="cnt">{{ t.count }}</span><span v-else-if="t.soon" class="soon">Pronto</span>
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
  quick: { type: Object, default: null }, // { best, worst, power }
  sample: { type: Boolean, default: false }, // hay datos de ejemplo de matchups y estadísticas
  muCount: { type: Number, default: 0 },
});
const emit = defineEmits(["update:tab"]);

const tabs = computed(() => [
  { key: "build", label: "Build" },
  { key: "mu", label: "Matchups", count: props.sample ? props.muCount : 0, soon: !props.sample },
  { key: "rank", label: "Por rango" },
  { key: "stats", label: "Estadísticas", soon: !props.sample },
]);

const difficulty = computed(() => props.detail?.info?.difficulty || 0);
const plain = (s) => String(s || "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// "la Espada sin Honor" → "La Espada sin Honor"
const title = computed(() => {
  const t = props.detail?.title || "";
  return t ? t[0].toUpperCase() + t.slice(1) : "";
});

const abilities = computed(() => {
  const d = props.detail;
  if (!d) return [];
  const list = [];
  if (d.passive?.image?.full) list.push({ key: "P", name: d.passive.name, meta: "Pasiva", desc: plain(d.passive.description), icon: passiveIconUrl(props.version, d.passive.image.full) });
  ["Q", "W", "E", "R"].forEach((k, i) => {
    const s = d.spells?.[i];
    if (s?.image?.full) list.push({ key: k, name: s.name, meta: `Habilidad ${k} · Enfriamiento: ${s.cooldownBurn} s`, desc: plain(s.description), icon: spellIconUrl(props.version, s.image.full) });
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
/* El S+ ya tiene fondo dorado opaco: sin la capa oscura, que lo taparía. */
.portrait .tier.t-sp::before { display: none; }
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
.tip-n { display: block; font: 700 14px/1.25 var(--font-display); color: #F3C878; }
.tip small { display: block; font-size: 11.5px; color: #8F98A5; }
.tip-d { display: block; margin-top: 6px; color: #C6CBD2; font-size: 12px; line-height: 1.45; }
.sp-cs { display: block; width: 46px; height: 46px; border-radius: 12px; background: url(/images/lol/campeones.webp) no-repeat; background-size: 1400% 1300%; }
.qf { display: grid; grid-template-columns: repeat(3, 112px); gap: 8px; margin-left: auto; }
.qf-i { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 8px; border-radius: 14px; background: rgba(7, 9, 13, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); text-align: center; }
.qf-i small { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #8F98A5; }
.qf-i b { font-size: 13.5px; }
.qf-i em { font-style: normal; font-size: 11.5px; color: #A6AEB9; }
.qf-i.good { border-color: rgba(98, 217, 156, 0.4); }
.qf-i.good em { color: #62D99C; }
.qf-i.bad { border-color: rgba(240, 138, 122, 0.4); }
.qf-i.bad em { color: #F08A7A; }
.qf-it { display: flex; gap: 4px; height: 46px; align-items: center; }
.qf-it img { border-radius: 8px; border: 1px solid rgba(226, 181, 102, 0.42); }
.dif { color: #F08A7A; }
.cnt { padding: 1px 7px; border-radius: 999px; background: rgba(255, 255, 255, 0.08); font-size: 11px; color: #C6CBD2; }
@media (max-width: 860px) { .qf { grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%; margin-left: 0; } }
.tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translate(-50%, 4px);
  white-space: normal;
  width: 280px;
  max-width: 72vw;
  padding: 10px 12px;
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
