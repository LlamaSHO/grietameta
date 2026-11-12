<template>
  <!-- Guía de misiones: principales en línea temporal con su guía y
       aventuras / secundarias agrupadas por región con enlace a la guía paso a paso. -->
  <div class="qs">
    <GuideToolbar :count="rows.length" :count-label="rows.length === 1 ? 'misión' : 'misiones'" :can-reset="filtered" @reset="reset">
      <template #search>
        <GuideSearch v-model="q" placeholder="Misión o región (p. ej. «Zora»)" label="Buscar misiones" />
      </template>
      <GuideSeg v-model="kind" :options="kindOpts" label="Tipo de misión" />
      <label class="qs-reg">
        <span class="sr-only">Región</span>
        <select v-model="region">
          <option value="">Todas las regiones</option>
          <option v-for="r in regionOpts" :key="r.name" :value="r.name">{{ r.name }} ({{ r.count }})</option>
        </select>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </label>
    </GuideToolbar>

    <GuideNote v-if="!rows.length" empty>
      No hay misiones con esa búsqueda. Prueba con otro nombre o región.
    </GuideNote>

    <!-- Principales -->
    <section v-if="main.length" class="qs-sec" aria-labelledby="qs-main">
      <header class="qs-sh">
        <h2 id="qs-main">Misiones principales</h2>
        <p>Con un resumen de cada una y su guía completa (en inglés). El orden es el del diario del juego.</p>
      </header>
      <ol class="qs-tl">
        <li v-for="m in main" :key="m.id" class="qs-step">
          <span class="qs-num" aria-hidden="true">{{ m.num }}</span>
          <article class="qs-card">
            <div class="qs-top">
              <h3>{{ m.name }}</h3>
              <span class="qs-tag">{{ m.tag }}</span>
            </div>
            <p class="qs-reg-t"><GuideIcon name="pin" :size="13" /> {{ m.region }}</p>
            <p class="qs-body">{{ m.body }}</p>
            <a v-if="m.url" class="qs-link" :href="m.url" target="_blank" rel="noopener noreferrer">
              Guía completa (en inglés) <GuideIcon name="externo" :size="14" />
            </a>
          </article>
        </li>
      </ol>
    </section>

    <!-- Aventuras y secundarias, por región -->
    <section v-for="s in sideSections" :key="s.kind" class="qs-sec" :aria-labelledby="'qs-' + s.kind">
      <header class="qs-sh">
        <h2 :id="'qs-' + s.kind">{{ s.title }} <small>{{ s.count }}</small></h2>
        <p>Cada una enlaza a su guía paso a paso en Gamer Guides (en inglés).</p>
      </header>
      <div v-for="g in s.groups" :key="g.region" class="qs-group">
        <h3 class="qs-gh">{{ g.region }} <small>{{ g.items.length }}</small></h3>
        <ul class="qs-grid">
          <li v-for="m in g.items" :key="m.id">
            <a class="qs-item" :href="m.url" target="_blank" rel="noopener noreferrer">
              <span class="qs-in">
                <b>{{ m.name }}</b>
              </span>
              <span class="qs-go">Ver guía <GuideIcon name="externo" :size="13" /></span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <GuideNote>
      Las {{ STATS.mainQuests }} principales llevan guía propia. De las secundarias, el juego tiene 60 aventuras y 139
      misiones: aquí están las que tienen guía publicada ({{ STATS.advQuests }} y {{ STATS.sideQuests }}). Los nombres
      van en inglés para que coincidan con el diario del juego si lo tienes en ese idioma.
    </GuideNote>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import GuideToolbar from "./GuideToolbar.vue";
import GuideSearch from "./GuideSearch.vue";
import GuideSeg from "./GuideSeg.vue";
import GuideNote from "./GuideNote.vue";
import GuideIcon from "./GuideIcon.vue";
import { QUESTS, STATS, matches } from "./guides.js";

const q = ref("");
const kind = ref("todas");
const region = ref("");

const inKind = (m) => kind.value === "todas" || m.kind === kind.value;
const inRegion = (m) => !region.value || m.region === region.value;
const inQuery = (m) => matches(q.value, m.name, m.region, m.tag);

const rows = computed(() => QUESTS.filter((m) => inKind(m) && inRegion(m) && inQuery(m)));
const main = computed(() => rows.value.filter((m) => m.kind === "p"));

const SIDE = [
  { kind: "a", title: "Aventuras secundarias" },
  { kind: "s", title: "Misiones secundarias" },
];
const sideSections = computed(() =>
  SIDE.map((s) => {
    const items = rows.value.filter((m) => m.kind === s.kind);
    const byRegion = new Map();
    items.forEach((m) => {
      if (!byRegion.has(m.region)) byRegion.set(m.region, []);
      byRegion.get(m.region).push(m);
    });
    const groups = [...byRegion].map(([r, list]) => ({ region: r, items: list })).sort((a, b) => b.items.length - a.items.length || a.region.localeCompare(b.region, "es"));
    return { ...s, count: items.length, groups };
  }).filter((s) => s.count),
);

const kindOpts = computed(() => {
  const f = QUESTS.filter((m) => inRegion(m) && inQuery(m));
  const n = (k) => f.filter((m) => m.kind === k).length;
  return [
    { value: "todas", label: "Todas", count: f.length },
    { value: "p", label: "Principales", count: n("p") },
    { value: "a", label: "Aventuras", count: n("a") },
    { value: "s", label: "Secundarias", count: n("s") },
  ];
});
const regionOpts = computed(() => {
  const f = QUESTS.filter((m) => inKind(m) && inQuery(m));
  const c = new Map();
  f.forEach((m) => c.set(m.region, (c.get(m.region) || 0) + 1));
  if (region.value && !c.has(region.value)) c.set(region.value, 0);
  return [...c].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name, "es"));
});

const filtered = computed(() => !!q.value.trim() || kind.value !== "todas" || !!region.value);
function reset() {
  q.value = "";
  kind.value = "todas";
  region.value = "";
}
</script>

<style scoped>
.qs-reg {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 0;
}
.qs-reg select {
  height: 46px;
  max-width: 100%;
  padding: 0 38px 0 14px;
  border-radius: 13px;
  border: 1px solid rgba(127, 235, 203, 0.16);
  background: #0a1816;
  color: #e6eeea;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  outline: none;
}
.qs-reg select:focus-visible {
  border-color: rgba(79, 224, 182, 0.6);
  box-shadow: 0 0 0 4px rgba(79, 224, 182, 0.14);
}
.qs-reg svg {
  position: absolute;
  right: 14px;
  color: #8fa8a1;
  pointer-events: none;
}

.qs-sec + .qs-sec {
  margin-top: 40px;
}
.qs-sh {
  margin-bottom: 16px;
}
.qs-sh h2 {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0;
  font-family: var(--font-zelda);
  font-size: clamp(22px, 2.4vw, 28px);
  font-weight: 700;
}
.qs-sh h2 small {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: #93aaa3;
}
.qs-sh p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #a9bdb6;
}

/* línea temporal */
.qs-tl {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.qs-tl::before {
  content: "";
  position: absolute;
  left: 21px;
  top: 22px;
  bottom: 22px;
  width: 2px;
  background: linear-gradient(180deg, rgba(79, 224, 182, 0.5), rgba(216, 194, 122, 0.35));
  border-radius: 2px;
}
.qs-step {
  position: relative;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.qs-num {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-top: 14px;
  border-radius: 50%;
  background: #081412;
  border: 2px solid rgba(79, 224, 182, 0.6);
  box-shadow: 0 0 18px -6px rgba(79, 224, 182, 0.8);
  font-family: var(--font-zelda);
  font-size: 16px;
  font-weight: 700;
  color: #f1e7c8;
}
.qs-card {
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #0b1c19, #081412);
  border: 1px solid rgba(127, 235, 203, 0.12);
  transition: border-color 0.25s;
}
.qs-step:hover .qs-card {
  border-color: rgba(79, 224, 182, 0.4);
}
.qs-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px 14px;
  flex-wrap: wrap;
}
.qs-card h3 {
  margin: 0;
  font-family: var(--font-zelda);
  font-size: 18px;
  font-weight: 700;
}
.qs-tag {
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(241, 231, 200, 0.1);
  color: #f1e7c8;
  font-size: 12px;
  font-weight: 600;
}
.qs-reg-t {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 4px 0 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #7febcb;
}
.qs-body {
  margin: 8px 0 0;
  font-size: 14px;
  color: #c3d3cd;
  text-wrap: pretty;
  max-width: 820px;
}
.qs-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: #7febcb;
  text-decoration: none;
}
.qs-link:hover {
  color: #a8f5de;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* por región */
.qs-group + .qs-group {
  margin-top: 18px;
}
.qs-gh {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #d8c27a;
}
.qs-gh::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(216, 194, 122, 0.2);
}
.qs-gh small {
  order: 2;
  font-size: 11px;
  color: #93aaa3;
  letter-spacing: 0;
}
.qs-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 8px;
}
.qs-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(127, 235, 203, 0.1);
  background: rgba(127, 235, 203, 0.03);
  color: #e6eeea;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}
.qs-item:hover {
  color: #e6eeea;
  background: rgba(127, 235, 203, 0.07);
  border-color: rgba(79, 224, 182, 0.35);
}
.qs-item:focus-visible,
.qs-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.qs-in {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.qs-in b {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
}
.qs-in small {
  margin-top: 2px;
  font-size: 12px;
  color: #93aaa3;
}
.qs-go {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  font-weight: 600;
  color: #7febcb;
}

@media (max-width: 640px) {
  .qs-reg,
  .qs-reg select {
    width: 100%;
  }
  .qs-tl::before {
    left: 15px;
  }
  .qs-step {
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 10px;
  }
  .qs-num {
    width: 32px;
    height: 32px;
    margin-top: 12px;
    font-size: 13px;
  }
  .qs-card {
    padding: 14px;
  }
  .qs-card h3 {
    font-size: 16.5px;
  }
}
@media (max-width: 560px) {
  .qs-go {
    font-size: 0;
    gap: 0;
  }
  .qs-go svg {
    width: 16px;
    height: 16px;
  }
}
</style>
