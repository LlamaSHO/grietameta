<template>
  <!-- Sección «Información» del hub de Zelda (#info): una tarjeta por guía.
       Diseño: .sec#info / .igrid / .icard de models/paginas/Zelda.dc.html.
       Cada tarjeta lleva a su guía completa en /zelda/<guía>. -->
  <section id="info" class="zi-sec">
    <div class="wrap">
      <div class="zi-head">
        <span class="zi-kick">Información</span>
        <h2 class="zi-h2">Guías de Tears of the Kingdom</h2>
        <p>
          Todo lo que hay en la guía, separado por temas. Los nombres en inglés van entre paréntesis para que los
          encuentres aunque juegues en otro idioma.
        </p>
      </div>

      <div class="zi-grid">
        <RouterLink
          v-for="c in cards"
          :key="c.key"
          class="zi-card"
          :to="{ name: 'zelda-guide', params: { guia: c.key } }"
        >
          <span class="zi-ic"><GuideIcon :name="c.icon" :size="22" /></span>
          <div>
            <h3>{{ c.title }}</h3>
            <span class="zi-n">{{ c.count }}</span>
          </div>
          <p>{{ c.summary }}</p>
          <div class="zi-prev">
            <div v-for="row in c.preview" :key="row[0]">
              {{ row[0] }} <span>{{ row[1] }}</span>
            </div>
          </div>
          <span class="zi-go">{{ c.go }} <span aria-hidden="true">→</span></span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import GuideIcon from "@/components/zelda/guides/GuideIcon.vue";
import { GUIDES, SHRINES, STATS, QUESTS, ARMORS, SETS, fmt } from "@/components/zelda/guides/guides.js";

// Ejemplos de cada guía (los mismos que el diseño, sacados de los datos reales).
const shrine = (name, where) => {
  const s = SHRINES.find((r) => r.name === name);
  return s ? [s.name, where || (s.layer === "cielo" ? "Cielo" : "Superficie")] : null;
};

const PREVIEW = {
  santuarios: [shrine("Ukouh", "Gran Isla del Cielo"), shrine("In-isa", "Gran Isla del Cielo"), shrine("Tajikats")].filter(Boolean),
  semillas: [
    ["Superficie", `${fmt(STATS.surfSeeds)} semillas`],
    ["Cielo", `${fmt(STATS.skySeeds)} semillas`],
  ],
  misiones: QUESTS.filter((q) => q.kind === "p").slice(0, 3).map((q) => [q.name, q.tag]),
  armaduras: ARMORS.slice(0, 3).map((a) => [a.es, String(a.def)]),
  conjuntos: SETS.slice(0, 2).map((s) => [s.name, s.bonus]),
};

const cards = GUIDES.map((g) => ({ ...g, preview: PREVIEW[g.key] || [] }));
</script>

<style scoped>
.zi-sec {
  padding: 52px 0 0;
  scroll-margin-top: calc(var(--nav-h) + var(--subnav-h) + 16px);
}
.zi-head {
  margin-bottom: 20px;
}
.zi-kick {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7febcb;
}
.zi-kick::before {
  content: "";
  width: 22px;
  height: 1px;
  background: #7febcb;
}
.zi-h2 {
  margin: 8px 0 0;
  font-family: var(--font-zelda);
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--ink);
}
.zi-head p {
  margin: 6px 0 0;
  max-width: 620px;
  color: #a9bdb6;
  text-wrap: pretty;
}

.zi-grid {
  display: grid;
  /* 220 px (el diseño usa 240 con un contenedor de 1320): así caben las 5 en una fila. */
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 14px;
}
.zi-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(180deg, #0b1c19, #081412);
  border: 1px solid rgba(127, 235, 203, 0.12);
  text-decoration: none;
  color: #e6eeea;
  overflow: hidden;
  transition: transform 0.3s var(--ease-out), border-color 0.3s, box-shadow 0.3s;
}
.zi-card::after {
  content: "";
  position: absolute;
  right: -60px;
  top: -60px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 1px dashed rgba(127, 235, 203, 0.14);
  transition: transform 0.8s;
  pointer-events: none;
}
.zi-card:hover {
  color: #e6eeea;
  transform: translateY(-4px);
  border-color: rgba(79, 224, 182, 0.45);
  box-shadow: 0 30px 60px -30px rgba(79, 224, 182, 0.5);
}
.zi-card:hover::after {
  transform: rotate(90deg) scale(1.1);
}
.zi-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.zi-ic {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(79, 224, 182, 0.1);
  border: 1px solid rgba(79, 224, 182, 0.3);
  color: #7febcb;
}
.zi-card h3 {
  margin: 0;
  font-family: var(--font-zelda);
  font-size: 19px;
  font-weight: 700;
}
.zi-n {
  font-size: 13px;
  color: #f1e7c8;
  font-weight: 600;
}
.zi-card p {
  margin: 0;
  font-size: 13.5px;
  color: #a9bdb6;
  text-wrap: pretty;
}
.zi-prev {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border-radius: 12px;
  background: rgba(5, 12, 11, 0.55);
  font-size: 12.5px;
  color: #c3d3cd;
}
.zi-prev div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.zi-prev span {
  color: #93aaa3;
  text-align: right;
  white-space: nowrap;
}
.zi-go {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #7febcb;
  transition: gap 0.2s;
}
.zi-card:hover .zi-go {
  gap: 12px;
}
</style>
