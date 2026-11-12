<template>
  <!-- Guía de conjuntos: materiales de mejora por nivel en la Gran Hada.
       Se puede buscar por material (p. ej. «Amber») y ver un solo nivel. -->
  <div class="st">
    <GuideToolbar :count="rows.length" :count-label="rows.length === 1 ? 'conjunto' : 'conjuntos'" :can-reset="filtered" @reset="reset">
      <template #search>
        <GuideSearch v-model="q" placeholder="Conjunto, bonus o material (p. ej. «Amber»)" label="Buscar conjuntos" />
      </template>
      <GuideSeg v-model="type" :options="typeOpts" label="Tipo de conjunto" />
      <GuideSeg v-model="level" :options="LEVEL_OPTS" label="Materiales por nivel" title="Nivel" />
      <GuideSeg v-model="upg" :options="upgOpts" label="Mejora" variant="chips" />
    </GuideToolbar>

    <GuideNote v-if="!rows.length" empty>No hay resultados para esa búsqueda. Prueba con otra palabra.</GuideNote>

    <ul v-else class="st-grid">
      <li v-for="s in rows" :key="s.id" class="st-card" :style="{ '--h': HUE[s.type] || 42 }">
        <div class="st-top">
          <span class="st-badge" aria-hidden="true">{{ s.mono }}</span>
          <div class="st-nm">
            <h3>{{ s.name }}</h3>
            <span class="st-bonus">{{ s.bonus }}</span>
          </div>
          <span class="st-type">{{ s.type }}</span>
        </div>

        <ol v-if="s.levels.length" class="st-lv">
          <template v-for="(mats, i) in s.levels" :key="i">
            <li v-if="level === 0 || level === i + 1">
              <span class="st-ln">Nivel {{ i + 1 }}</span>
              <span class="st-mats">
                <span v-for="m in mats" :key="m.name" class="st-m" :class="{ hit: isHit(m.name) }">
                  <b v-if="m.qty != null">{{ m.qty }}×</b> {{ m.name }}
                </span>
              </span>
            </li>
          </template>
        </ol>
        <p v-else class="st-none">No se puede mejorar</p>

        <details v-if="s.levels.length && level === 0" class="st-tot">
          <summary>Total por pieza (niveles 1 a {{ s.levels.length }})</summary>
          <span class="st-mats">
            <span v-for="m in s.total" :key="m.name" class="st-m" :class="{ hit: isHit(m.name) }">
              <b>{{ m.qty }}×</b> {{ m.name }}
            </span>
          </span>
        </details>
      </li>
    </ul>

    <GuideNote>
      Materiales de cada mejora en la Gran Hada. El coste es por pieza y por nivel: para mejorar un set de tres piezas
      necesitas el triple. Los nombres de los materiales van en inglés, como en el juego en ese idioma. Se recogen los
      tres primeros niveles de mejora; algunas piezas, como el Aspecto del Héroe Antiguo, tienen un nivel más. Guía no
      oficial: datos de la versión 1.2.1 contrastados con varias guías. Las defensas de cada set están en la guía de
      <RouterLink :to="{ name: 'zelda-guide', params: { guia: 'armaduras' } }">armaduras</RouterLink>.
    </GuideNote>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import GuideToolbar from "./GuideToolbar.vue";
import GuideSearch from "./GuideSearch.vue";
import GuideSeg from "./GuideSeg.vue";
import GuideNote from "./GuideNote.vue";
import { SETS, SET_TYPES, matches, norm } from "./guides.js";

const HUE = { Normal: 42, Elemento: 200, Habilidad: 170, Enemigos: 340 };
const LEVEL_OPTS = [
  { value: 0, label: "Todos" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
];

const q = ref("");
const type = ref("todos");
const level = ref(0);
const upg = ref("todos");

const inType = (s) => type.value === "todos" || s.type === type.value;
const inUpg = (s) => upg.value === "todos" || (upg.value === "si") === s.levels.length > 0;
const inQuery = (s) => matches(q.value, s.name, s.type, s.bonus, s.raw.join(" "));

const rows = computed(() => SETS.filter((s) => inType(s) && inUpg(s) && inQuery(s)));

const typeOpts = computed(() => {
  const f = SETS.filter((s) => inUpg(s) && inQuery(s));
  return [{ value: "todos", label: "Todos", count: f.length }, ...SET_TYPES.map((t) => ({ value: t, label: t, count: f.filter((s) => s.type === t).length }))];
});
const upgOpts = computed(() => {
  const f = SETS.filter((s) => inType(s) && inQuery(s));
  const yes = f.filter((s) => s.levels.length).length;
  return [
    { value: "todos", label: "Todos", count: f.length },
    { value: "si", label: "Se mejoran", count: yes },
    { value: "no", label: "Sin mejora", count: f.length - yes },
  ];
});

// Resalta los materiales que coinciden con la búsqueda.
const qWords = computed(() => q.value.trim().split(/\s+/).map(norm).filter((w) => w.length > 2));
const isHit = (name) => qWords.value.length > 0 && qWords.value.some((w) => norm(name).includes(w));

const filtered = computed(() => !!q.value.trim() || type.value !== "todos" || level.value !== 0 || upg.value !== "todos");
function reset() {
  q.value = "";
  type.value = "todos";
  level.value = 0;
  upg.value = "todos";
}
</script>

<style scoped>
.st-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
  gap: 12px;
  align-items: start;
}
.st-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  background: linear-gradient(180deg, #0b1c19, #081412);
  border: 1px solid rgba(127, 235, 203, 0.12);
  transition: border-color 0.25s;
}
.st-card:hover {
  border-color: hsla(var(--h), 70%, 65%, 0.45);
}
.st-top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.st-badge {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  flex-shrink: 0;
  background: hsla(var(--h), 70%, 60%, 0.12);
  border: 1px solid hsla(var(--h), 70%, 65%, 0.4);
  color: hsl(var(--h), 75%, 75%);
  font-family: var(--font-zelda);
  font-size: 15px;
  font-weight: 700;
}
.st-nm {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
  flex: 1;
}
.st-nm h3 {
  margin: 0;
  font-family: var(--font-zelda);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}
.st-bonus {
  padding: 2px 9px;
  border-radius: 999px;
  background: rgba(241, 231, 200, 0.1);
  color: #f1e7c8;
  font-size: 12px;
  font-weight: 600;
}
.st-type {
  align-self: flex-start;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: hsl(var(--h), 60%, 70%);
}
.st-lv {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.st-lv li {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 10px;
  border-radius: 12px;
  background: rgba(5, 12, 11, 0.55);
}
.st-ln {
  padding-top: 3px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7febcb;
  white-space: nowrap;
}
.st-mats {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.st-m {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 8px;
  border: 1px solid rgba(127, 235, 203, 0.1);
  background: rgba(127, 235, 203, 0.04);
  font-size: 12.5px;
  color: #c3d3cd;
  line-height: 1.4;
}
.st-m b {
  color: #f1e7c8;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.st-m.hit {
  border-color: rgba(79, 224, 182, 0.6);
  background: rgba(79, 224, 182, 0.16);
  color: #e6eeea;
}
.st-none {
  margin: 0;
  padding: 10px;
  border-radius: 12px;
  border: 1px dashed rgba(127, 235, 203, 0.16);
  font-size: 13px;
  color: #93aaa3;
  text-align: center;
}
.st-tot {
  border-top: 1px solid rgba(127, 235, 203, 0.08);
  padding-top: 10px;
}
.st-tot summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #d8c27a;
  cursor: pointer;
  list-style: none;
}
.st-tot summary::-webkit-details-marker {
  display: none;
}
.st-tot summary::before {
  content: "+";
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid rgba(216, 194, 122, 0.4);
  font-size: 13px;
  line-height: 1;
}
.st-tot[open] summary::before {
  content: "−";
}
.st-tot summary:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 6px;
}
.st-tot .st-mats {
  margin-top: 10px;
}

@media (max-width: 560px) {
  .st-card {
    padding: 14px;
  }
  .st-lv li {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
