<template>
  <!-- Guía de armaduras: ranking por defensa al máximo nivel, con barra de defensa
       y desglose por pieza. Filtros: set completo / pieza y orden. -->
  <div class="ar">
    <GuideToolbar :count="rows.length" :count-label="rows.length === 1 ? 'armadura' : 'armaduras'" :can-reset="filtered" @reset="reset">
      <template #search>
        <GuideSearch v-model="q" placeholder="Armadura, en español o en inglés" label="Buscar armaduras" />
      </template>
      <GuideSeg v-model="scope" :options="scopeOpts" label="Set completo o pieza" />
      <GuideSeg v-model="order" :options="ORDER_OPTS" label="Ordenar" title="Orden" />
    </GuideToolbar>

    <GuideNote v-if="!rows.length" empty>No hay resultados para esa búsqueda. Prueba con otra palabra.</GuideNote>

    <ol v-else class="ar-list">
      <li v-for="a in rows" :key="a.id" class="ar-row">
        <span class="ar-rank" :class="{ top: a.rank === 1 }">
          <small>Puesto</small>
          {{ a.rank }}
        </span>

        <div class="ar-main">
          <div class="ar-head">
            <span class="ar-badge" aria-hidden="true">{{ a.mono }}</span>
            <div class="ar-nm">
              <h3>{{ a.es }}</h3>
              <small v-if="a.en">{{ a.en }}</small>
            </div>
            <span class="ar-scope" :class="a.scope">{{ a.scope === "set" ? "Set completo" : "Pieza única" }}</span>
          </div>
          <p class="ar-txt">{{ a.text }}</p>
          <p v-if="!/^(Set completo|Pieza única)$/i.test(a.note)" class="ar-note">{{ a.note }}</p>
          <a v-if="a.url" class="ar-link" :href="a.url" target="_blank" rel="noopener noreferrer">
            Abrir mapa <GuideIcon name="externo" :size="13" />
          </a>
        </div>

        <div class="ar-def" :aria-label="`Defensa ${a.def}`">
          <div class="ar-dn"><b>{{ a.def }}</b><small>defensa</small></div>
          <div class="ar-bar" aria-hidden="true">
            <template v-if="a.perPiece && a.pieces > 1">
              <i v-for="p in a.pieces" :key="p" :style="{ width: `calc(${(a.perPiece / ARMOR_MAX) * 100}% - 2px)` }" />
            </template>
            <i v-else :style="{ width: (a.def / ARMOR_MAX) * 100 + '%' }" />
          </div>
          <small class="ar-per">
            <template v-if="a.perPiece && a.pieces > 1">{{ a.pieces }} piezas × {{ a.perPiece }}</template>
            <template v-else-if="a.scope === 'pieza'">Una pieza</template>
            <template v-else>Las 3 piezas juntas</template>
          </small>
        </div>
      </li>
    </ol>

    <aside v-for="t in ARMOR_TIPS" :key="t.title" class="ar-tip">
      <span class="ar-tip-ic"><GuideIcon name="armadura" :size="20" /></span>
      <div>
        <span class="ar-tip-k">{{ t.label }} · {{ t.note }}</span>
        <h3>{{ t.title }}</h3>
        <p>{{ t.text }}</p>
      </div>
    </aside>

    <GuideNote>
      Defensa al máximo nivel de mejora. Cuando la cifra es del set completo se suma la de las tres piezas; las piezas
      únicas se comparan solas. Las guías no siempre coinciden en alguna pieza concreta: usa estas cifras como
      referencia (versión 1.2.1). Los nombres en inglés van debajo para que las encuentres aunque juegues en otro idioma.
      Los materiales de cada mejora están en la guía de
      <RouterLink :to="{ name: 'zelda-guide', params: { guia: 'conjuntos' } }">conjuntos</RouterLink>.
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
import { ARMORS, ARMOR_TIPS, ARMOR_MAX, matches } from "./guides.js";

const ORDER_OPTS = [
  { value: "desc", label: "Más defensa" },
  { value: "asc", label: "Menos defensa" },
  { value: "name", label: "Nombre" },
];

const q = ref("");
const scope = ref("todas");
const order = ref("desc");

// Puesto por defensa (empates comparten puesto) y monograma con las iniciales en inglés.
const RANKED = ARMORS.map((a) => ({
  ...a,
  rank: ARMORS.filter((b) => b.def > a.def).length + 1,
  mono: (a.en || a.es).replace(/[^A-Za-z' ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
}));

const inQuery = (a) => matches(q.value, a.es, a.en, a.text, a.note);
const rows = computed(() => {
  const list = RANKED.filter((a) => (scope.value === "todas" || a.scope === scope.value) && inQuery(a));
  if (order.value === "name") return [...list].sort((a, b) => a.es.localeCompare(b.es, "es"));
  if (order.value === "asc") return [...list].sort((a, b) => a.def - b.def || a.id - b.id);
  return [...list].sort((a, b) => b.def - a.def || a.id - b.id);
});

const scopeOpts = computed(() => {
  const f = RANKED.filter(inQuery);
  return [
    { value: "todas", label: "Todas", count: f.length },
    { value: "set", label: "Set completo", count: f.filter((a) => a.scope === "set").length },
    { value: "pieza", label: "Pieza", count: f.filter((a) => a.scope === "pieza").length },
  ];
});

const filtered = computed(() => !!q.value.trim() || scope.value !== "todas" || order.value !== "desc");
function reset() {
  q.value = "";
  scope.value = "todas";
  order.value = "desc";
}
</script>

<style scoped>
.ar-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ar-row {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 260px;
  gap: 18px;
  align-items: center;
  padding: 16px 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, #0b1c19, #081412);
  border: 1px solid rgba(127, 235, 203, 0.12);
  transition: border-color 0.25s, transform 0.25s var(--ease-out);
}
.ar-row:hover {
  border-color: rgba(79, 224, 182, 0.4);
}
.ar-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  border: 1px solid rgba(127, 235, 203, 0.16);
  background: rgba(5, 12, 11, 0.6);
  font-family: var(--font-zelda);
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: #e6eeea;
}
.ar-rank small {
  font-family: var(--font-body);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7f978f;
  margin-bottom: 4px;
}
.ar-rank.top {
  border-color: rgba(216, 194, 122, 0.55);
  background: linear-gradient(180deg, rgba(216, 194, 122, 0.16), rgba(216, 194, 122, 0.04));
  color: #f1e7c8;
  box-shadow: 0 0 24px -10px rgba(216, 194, 122, 0.8);
}
.ar-main {
  min-width: 0;
}
.ar-head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.ar-badge {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(79, 224, 182, 0.1);
  border: 1px solid rgba(79, 224, 182, 0.3);
  color: #7febcb;
  font-family: var(--font-zelda);
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}
.ar-nm {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.ar-nm h3 {
  margin: 0;
  font-family: var(--font-zelda);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}
.ar-nm small {
  font-size: 12.5px;
  color: #93aaa3;
}
.ar-scope {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.ar-scope.set {
  background: rgba(79, 224, 182, 0.1);
  color: #7febcb;
}
.ar-scope.pieza {
  background: rgba(241, 231, 200, 0.1);
  color: #f1e7c8;
}
.ar-txt {
  margin: 10px 0 0;
  font-size: 14px;
  color: #c3d3cd;
  text-wrap: pretty;
}
.ar-note {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: #93aaa3;
}
.ar-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #7febcb;
}

.ar-def {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ar-dn {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.ar-dn b {
  font-family: var(--font-zelda);
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  color: #f1e7c8;
}
.ar-dn small {
  font-size: 12px;
  color: #93aaa3;
}
.ar-bar {
  display: flex;
  gap: 3px;
  height: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}
.ar-bar i {
  display: block;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #2fbf97, #7febcb);
  box-shadow: 0 0 12px -2px rgba(79, 224, 182, 0.6);
}
.ar-row:has(.ar-rank.top) .ar-bar i {
  background: linear-gradient(90deg, #d8c27a, #f1e7c8);
  box-shadow: 0 0 12px -2px rgba(216, 194, 122, 0.6);
}
.ar-per {
  font-size: 12px;
  color: #93aaa3;
}

.ar-tip {
  display: flex;
  gap: 14px;
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(79, 224, 182, 0.1), rgba(79, 224, 182, 0.02));
  border: 1px solid rgba(79, 224, 182, 0.3);
}
.ar-tip-ic {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(79, 224, 182, 0.14);
  color: #7febcb;
  flex-shrink: 0;
}
.ar-tip-k {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7febcb;
}
.ar-tip h3 {
  margin: 2px 0 0;
  font-family: var(--font-zelda);
  font-size: 17px;
}
.ar-tip p {
  margin: 6px 0 0;
  font-size: 14px;
  color: #c3d3cd;
  text-wrap: pretty;
}

@media (max-width: 860px) {
  .ar-row {
    grid-template-columns: 56px minmax(0, 1fr);
    gap: 12px 14px;
  }
  .ar-rank {
    width: 56px;
    height: 56px;
    font-size: 21px;
  }
  .ar-def {
    grid-column: 2;
  }
}
@media (max-width: 560px) {
  .ar-row {
    grid-template-columns: 1fr;
    padding: 14px;
  }
  .ar-rank {
    position: absolute;
    width: auto;
    height: auto;
    padding: 4px 9px;
    flex-direction: row;
    gap: 5px;
    font-size: 15px;
    border-radius: 999px;
  }
  .ar-rank small {
    margin: 0;
  }
  .ar-row {
    position: relative;
    padding-top: 46px;
  }
  .ar-rank {
    top: 12px;
    left: 14px;
  }
  .ar-def {
    grid-column: 1;
  }
  .ar-badge {
    display: none;
  }
}
</style>
