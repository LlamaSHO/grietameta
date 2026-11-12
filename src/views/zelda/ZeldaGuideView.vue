<template>
  <!-- Guías de Zelda: Tears of the Kingdom (/zelda/:guia).
       No hay diseño propio: sigue el lenguaje de models/paginas/Zelda.dc.html
       (hero con anillos, tarjetas .icard, chips .ly, buscador .fld, Cinzel en títulos). -->
  <div class="zg">
    <header class="zg-hero">
      <img class="zg-hero-bg" src="/images/zelda/hyrule.jpg" alt="">
      <div class="zg-rings" aria-hidden="true"><span /><span /><span /></div>

      <div class="wrap">
        <nav class="zg-crumbs" aria-label="Migas de pan">
          <RouterLink :to="{ name: 'zelda' }">Zelda: Tears of the Kingdom</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink :to="{ name: 'zelda', hash: '#info' }">Guías</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ guide.title }}</span>
        </nav>

        <div class="zg-hero-in">
          <div class="zg-htx">
            <span class="zg-kick"><GuideIcon :name="guide.icon" :size="15" /> Guía</span>
            <h1 class="zg-h1">{{ guide.title }}</h1>
            <p class="zg-lead">{{ guide.desc }}</p>
            <div class="zg-ctas">
              <RouterLink class="zg-btn-z" :to="{ name: 'zelda', hash: '#mapa' }">
                <GuideIcon name="mapa" :size="17" /> Volver al mapa
              </RouterLink>
              <RouterLink class="zg-btn-o" :to="{ name: 'zelda', hash: '#info' }">Todas las guías</RouterLink>
            </div>
          </div>

          <dl class="zg-stats">
            <div v-for="s in stats" :key="s.label" class="zg-stat">
              <dt>{{ s.label }}</dt>
              <dd>{{ s.value }}</dd>
              <small v-if="s.note">{{ s.note }}</small>
            </div>
          </dl>
        </div>
      </div>
    </header>

    <!-- Navegación entre guías -->
    <nav class="zg-tabs" aria-label="Guías de Zelda">
      <div class="wrap zg-tabs-in">
        <RouterLink
          v-for="g in GUIDES"
          :key="g.key"
          class="zg-tab"
          :class="{ on: g.key === guia }"
          :aria-current="g.key === guia ? 'page' : undefined"
          :to="{ name: 'zelda-guide', params: { guia: g.key } }"
        >
          <GuideIcon :name="g.icon" :size="17" />
          {{ g.title }}
        </RouterLink>
      </div>
    </nav>

    <div class="wrap zg-body">
      <component :is="current" :key="guia" />
    </div>

    <!-- Siguiente / anterior -->
    <nav class="wrap zg-pn" aria-label="Otras guías">
      <RouterLink class="zg-pn-a" :to="{ name: 'zelda-guide', params: { guia: prev.key } }">
        <small><GuideIcon name="atras" :size="14" /> Anterior</small>
        <b>{{ prev.title }}</b>
        <span>{{ prev.short }}</span>
      </RouterLink>
      <RouterLink class="zg-pn-a nx" :to="{ name: 'zelda-guide', params: { guia: next.key } }">
        <small>Siguiente <GuideIcon name="flecha" :size="14" /></small>
        <b>{{ next.title }}</b>
        <span>{{ next.short }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import GuideIcon from "@/components/zelda/guides/GuideIcon.vue";
import ShrinesGuide from "@/components/zelda/guides/ShrinesGuide.vue";
import SeedsGuide from "@/components/zelda/guides/SeedsGuide.vue";
import QuestsGuide from "@/components/zelda/guides/QuestsGuide.vue";
import ArmorsGuide from "@/components/zelda/guides/ArmorsGuide.vue";
import SetsGuide from "@/components/zelda/guides/SetsGuide.vue";
import { GUIDES, STATS, ARMOR_MAX, SET_TYPES, guideByKey, fmt } from "@/components/zelda/guides/guides.js";

const route = useRoute();

const COMPONENTS = {
  santuarios: ShrinesGuide,
  semillas: SeedsGuide,
  misiones: QuestsGuide,
  armaduras: ArmorsGuide,
  conjuntos: SetsGuide,
};

const guia = computed(() => (COMPONENTS[route.params.guia] ? route.params.guia : "santuarios"));
const guide = computed(() => guideByKey(guia.value));
const current = computed(() => COMPONENTS[guia.value]);

const idx = computed(() => GUIDES.findIndex((g) => g.key === guia.value));
const prev = computed(() => GUIDES[(idx.value - 1 + GUIDES.length) % GUIDES.length]);
const next = computed(() => GUIDES[(idx.value + 1) % GUIDES.length]);

// Cifras de la cabecera de cada guía.
const STAT_ROWS = {
  santuarios: [
    { label: "Santuarios", value: STATS.shrines },
    { label: "Superficie", value: STATS.surfShrines },
    { label: "Cielo", value: STATS.skyShrines },
  ],
  semillas: [
    { label: "Semillas", value: fmt(STATS.seeds), note: "de las 1.000 del juego" },
    { label: "Kologs", value: STATS.koroks },
    { label: "Con amigo", value: STATS.friendKoroks, note: "2 semillas cada uno" },
  ],
  misiones: [
    { label: "Principales", value: STATS.mainQuests },
    { label: "Aventuras", value: STATS.advQuests },
    { label: "Secundarias", value: STATS.sideQuests },
  ],
  armaduras: [
    { label: "Defensa máxima", value: ARMOR_MAX, note: "con el set mejorado" },
    { label: "Armaduras", value: STATS.armors, note: "de mayor a menor" },
  ],
  conjuntos: [
    { label: "Conjuntos", value: STATS.sets },
    { label: "Niveles", value: 3, note: "materiales por nivel" },
    { label: "Tipos", value: SET_TYPES.length },
  ],
};
const stats = computed(() => STAT_ROWS[guia.value]);

// Título y descripción de la pestaña (el router pone el genérico antes; esto lo sustituye).
const TITLES = {
  santuarios: "Santuarios de Zelda: Tears of the Kingdom: los 152 con coordenadas",
  semillas: "Semillas kolog de Zelda: Tears of the Kingdom: mapa y ubicaciones",
  misiones: "Misiones de Zelda: Tears of the Kingdom: principales y secundarias",
  armaduras: "Mejores armaduras de Zelda: Tears of the Kingdom por defensa",
  conjuntos: "Conjuntos de Zelda: Tears of the Kingdom y materiales de mejora",
};
watch(
  guia,
  (k) => {
    document.title = `${TITLES[k] || guideByKey(k).title} | GrietaMeta`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", guideByKey(k).desc);
  },
  { immediate: true },
);
</script>

<style scoped>
.zg {
  --z-ink: #e6eeea;
  --z-dim: #a9bdb6;
  --z-mute: #93aaa3;
  --z-teal: #4fe0b6;
  --z-teal-hi: #7febcb;
  --z-cream: #f1e7c8;
  --z-line: rgba(127, 235, 203, 0.12);
  color: var(--z-ink);
  background: radial-gradient(1200px 500px at 70% -10%, rgba(79, 224, 182, 0.06), transparent 70%), #050c0b;
  padding-bottom: 24px;
  font-variant-numeric: tabular-nums;
}

/* ---------- cabecera ---------- */
.zg-hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid rgba(127, 235, 203, 0.08);
}
.zg-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(600px 400px at 78% 40%, rgba(79, 224, 182, 0.13), transparent 70%),
    radial-gradient(500px 300px at 10% 0%, rgba(216, 194, 122, 0.07), transparent 70%);
}
.zg-hero-bg {
  position: absolute;
  right: -4%;
  top: -10%;
  width: 58%;
  height: 120%;
  object-fit: cover;
  z-index: -3;
  opacity: 0.26;
  filter: saturate(0.5) hue-rotate(95deg);
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 60% 50%, #000 30%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 70% at 60% 50%, #000 30%, transparent 75%);
}
.zg-rings {
  position: absolute;
  right: 8%;
  top: 50%;
  width: 360px;
  height: 360px;
  margin-top: -180px;
  z-index: -1;
  pointer-events: none;
}
.zg-rings span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(127, 235, 203, 0.16);
}
.zg-rings span:nth-child(2) {
  inset: 40px;
  border-style: dashed;
  border-color: rgba(127, 235, 203, 0.22);
  animation: gm-spin 60s linear infinite;
}
.zg-rings span:nth-child(3) {
  inset: 92px;
  border-color: rgba(216, 194, 122, 0.22);
  border-top-color: rgba(216, 194, 122, 0.6);
  animation: gm-spin 40s linear infinite reverse;
}

.zg-crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 26px;
  font-size: 13px;
  color: var(--z-mute);
}
.zg-crumbs a {
  color: var(--z-dim);
  text-decoration: none;
}
.zg-crumbs a:hover {
  color: var(--z-teal-hi);
}
.zg-crumbs [aria-current] {
  color: var(--z-cream);
  font-weight: 600;
}

.zg-hero-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px 40px;
  flex-wrap: wrap;
  padding: 22px 0 40px;
}
.zg-htx {
  flex: 1 1 520px;
  max-width: 660px;
  animation: gm-rise 0.7s var(--ease-out) both;
}
.zg-kick {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--z-teal-hi);
}
.zg-h1 {
  margin: 12px 0 0;
  font-family: var(--font-zelda);
  font-size: clamp(34px, 4.6vw, 56px);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: 0.01em;
  text-shadow: 0 0 30px rgba(79, 224, 182, 0.18);
}
.zg-lead {
  margin: 14px 0 0;
  color: var(--z-dim);
  font-size: 16.5px;
  max-width: 600px;
  text-wrap: pretty;
}
.zg-ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 24px;
}
.zg-btn-z,
.zg-btn-o {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 46px;
  padding: 0 18px;
  border-radius: 13px;
  font-weight: 700;
  font-size: 14.5px;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}
.zg-btn-z {
  background: linear-gradient(180deg, #5de8c1, #2fbf97);
  color: #04211a;
  box-shadow: 0 14px 34px -14px rgba(79, 224, 182, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.zg-btn-z:hover {
  color: #04211a;
  transform: translateY(-2px);
}
.zg-btn-o {
  border: 1px solid rgba(216, 194, 122, 0.45);
  color: #e9dcaf;
  font-weight: 600;
}
.zg-btn-o:hover {
  color: #e9dcaf;
  background: rgba(216, 194, 122, 0.08);
}
.zg-btn-z:focus-visible,
.zg-btn-o:focus-visible {
  outline: 2px solid var(--z-cream);
  outline-offset: 2px;
}

.zg-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 12px;
  flex: 0 1 430px;
  margin: 0;
  animation: gm-rise 0.7s 0.12s var(--ease-out) both;
}
.zg-stat {
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(12, 30, 27, 0.85), rgba(7, 18, 16, 0.85));
  border: 1px solid rgba(127, 235, 203, 0.14);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.zg-stat dt {
  font-size: 13px;
  color: var(--z-dim);
}
.zg-stat dd {
  margin: 6px 0 0;
  font-family: var(--font-zelda);
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  color: var(--z-cream);
}
.zg-stat small {
  display: block;
  margin-top: 6px;
  font-size: 11.5px;
  color: #7f978f;
}

/* ---------- pestañas de guías ---------- */
.zg-tabs {
  border-bottom: 1px solid rgba(127, 235, 203, 0.08);
  background: rgba(8, 22, 20, 0.6);
}
.zg-tabs-in {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.zg-tabs-in::-webkit-scrollbar {
  display: none;
}
.zg-tab {
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 54px;
  padding: 0 14px;
  color: #a4b9b2;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s;
}
.zg-tab:hover,
.zg-tab.on {
  color: var(--z-ink);
}
.zg-tab.on {
  color: var(--z-teal-hi);
}
.zg-tab.on::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--z-teal);
  box-shadow: 0 0 12px rgba(79, 224, 182, 0.8);
}
.zg-tab:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: -4px;
  border-radius: 10px;
}

.zg-body {
  padding-top: 28px;
}

/* ---------- anterior / siguiente ---------- */
.zg-pn {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 48px;
}
.zg-pn-a {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px;
  border-radius: 18px;
  background: linear-gradient(180deg, #0b1c19, #081412);
  border: 1px solid var(--z-line);
  color: var(--z-ink);
  text-decoration: none;
  transition: border-color 0.25s, transform 0.25s var(--ease-out);
}
.zg-pn-a:hover {
  color: var(--z-ink);
  border-color: rgba(79, 224, 182, 0.45);
  transform: translateY(-2px);
}
.zg-pn-a.nx {
  text-align: right;
  align-items: flex-end;
}
.zg-pn-a small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--z-teal-hi);
}
.zg-pn-a b {
  font-family: var(--font-zelda);
  font-size: 19px;
}
.zg-pn-a span {
  font-size: 13px;
  color: var(--z-mute);
}

@media (max-width: 860px) {
  .zg-rings {
    display: none;
  }
  .zg-hero-bg {
    width: 100%;
    right: -30%;
    opacity: 0.18;
  }
  .zg-hero-in {
    padding-bottom: 30px;
  }
  .zg-stats {
    flex-basis: 100%;
  }
}
@media (max-width: 640px) {
  .zg-crumbs {
    padding-top: 18px;
  }
  .zg-lead {
    font-size: 15px;
  }
  .zg-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
  .zg-stat {
    padding: 12px;
    border-radius: 14px;
  }
  .zg-stat dd {
    font-size: 24px;
  }
  .zg-stat small {
    display: none;
  }
  .zg-tab {
    height: 48px;
    padding: 0 11px;
    font-size: 13.5px;
  }
  .zg-body {
    padding-top: 20px;
  }
}
@media (max-width: 560px) {
  .zg-ctas > * {
    flex: 1 1 auto;
    justify-content: center;
  }
  .zg-pn {
    grid-template-columns: 1fr;
  }
  .zg-pn-a.nx {
    text-align: left;
    align-items: flex-start;
  }
}
</style>
