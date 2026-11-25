<template>
  <section class="card" aria-labelledby="tl-h">
    <div class="card-h">
      <h2 id="tl-h" class="disp">Tier list del parche</h2>
      <span class="meta">{{ meta }}</span>
      <div class="cl-view" role="group" aria-label="Vista de la tier list">
        <button type="button" :aria-pressed="view === 'tiers'" @click="view = 'tiers'">Por niveles</button>
        <button type="button" :aria-pressed="view === 'table'" @click="view = 'table'">Tabla</button>
      </div>
    </div>
    <p v-if="note" class="note">{{ note }}</p>

    <p v-if="loading" class="loading">Cargando estadísticas…</p>
    <template v-else>
      <!-- Por niveles -->
      <div v-if="view === 'tiers'" class="cl-tiers">
        <div v-for="g in tierGroups" :key="g.t" class="cl-row">
          <div class="cl-badge"><span class="tier" :class="g.tc">{{ g.t }}</span><small>{{ g.rows.length === 1 ? "1 campeón" : `${g.rows.length} campeones` }}</small></div>
          <div class="cl-champs">
            <RouterLink v-for="e in g.rows" :key="e.id" class="cl-c" :to="champLink(e.c)">
              <img :src="e.c.icon" alt="" loading="lazy" width="52" height="52">
              <b>{{ e.c.name }}</b>
              <span class="cl-wr" :class="wrClass(e.wr)">{{ pct(e.wr) }}</span>
              <small>{{ e.c.role }} · {{ e.c.cls }}</small>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <template v-else>
        <div class="lf-mobile-sort">
          <label>Ordenar por
            <select v-model="sortKey" @change="direction = defaultDir(sortKey)">
              <option v-for="c in COLS" :key="c.key" :value="c.key">{{ c.mobile }}</option>
            </select>
          </label>
          <button type="button" @click="direction = -direction">{{ direction === 1 ? "Ascendente ↑" : "Descendente ↓" }}</button>
        </div>
        <div class="tscroll">
          <div class="tl" role="table" aria-label="Tier list de campeones">
            <div class="tr th" role="row">
              <span v-for="c in COLS" :key="c.key" role="columnheader" :aria-sort="ariaSort(c.key)" :aria-label="c.label">
                <button type="button" :title="c.label" @click="pickSort(c.key)">{{ c.head }} <span aria-hidden="true">{{ arrow(c.key) }}</span></button>
              </span>
            </div>
            <div v-for="e in sorted" :key="e.id" class="tr row" role="row">
              <span class="idx" role="cell">{{ e.idx }}</span>
              <span role="cell" class="cell-champ">
                <RouterLink class="champ" :to="champLink(e.c)">
                  <img :src="e.c.icon" alt="" loading="lazy" width="42" height="42">
                  <span class="champ-tx">
                    <span class="nm">{{ e.c.name }}</span>
                    <span class="sb">{{ e.c.role }} · {{ e.c.cls }}</span>
                  </span>
                </RouterLink>
              </span>
              <span role="cell" class="cell-tier"><span class="tier" :class="e.tc">{{ e.tier }}</span></span>
              <span role="cell" class="wr" :class="wrClass(e.wr)"><b>{{ pct(e.wr) }}</b><span class="bar"><i :style="{ width: wrWidth(e.wr) }"></i></span></span>
              <span role="cell" class="num c-pr"><small class="lf-mobile-label">PR</small>{{ pct(e.pr) }}</span>
              <span role="cell" class="num c-br"><small class="lf-mobile-label">BR</small>{{ pct(e.br) }}</span>
              <span role="cell" class="num c-g"><small class="lf-mobile-label">Partidas</small>{{ fmtInt(e.games) }}</span>
            </div>
          </div>
        </div>
      </template>
      <p v-if="!entries.length" class="empty">No hay ningún campeón que coincida con tu búsqueda en este rol.</p>
    </template>

    <div class="tfoot">
      <p>WR, PR y BR indican victorias, elecciones y bloqueos. El tier es relativo a cada rol: combina winrate, pickrate y banrate del rango elegido.</p>
      <div class="tfoot-actions">
        <button v-if="entries.length > limit" type="button" class="btn-soft" @click="expanded = !expanded">
          {{ expanded ? "Ver menos" : `Ver la tier list completa (${entries.length})` }}
        </button>
        <a class="btn-soft" href="#campeones">
          Ver los {{ total }} campeones
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { fmtInt, pct, wrClass, wrWidth } from "@/services/lol/format";

const props = defineProps({
  entries: { type: Array, required: true }, // ya filtradas y ordenadas por tier
  role: { type: String, default: "Todos" },
  total: { type: Number, default: 0 },
  meta: { type: String, default: "" },
  note: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});

const TIER_ORDER = ["S+", "S", "A", "B", "C", "D"];
const TIER_CLASS = { "S+": "t-sp", S: "t-s", A: "t-a", B: "t-b", C: "t-c", D: "t-d" };
const COLS = [
  { key: "idx", head: "Puesto", label: "Puesto en la clasificación del rol elegido", mobile: "Puesto", dir: 1 },
  { key: "name", head: "Campeón", label: "Nombre del campeón", mobile: "Campeón", dir: 1 },
  { key: "tier", head: "Tier", label: "Tier del campeón", mobile: "Tier", dir: 1 },
  { key: "wr", head: "WR", label: "Porcentaje de victorias", mobile: "WR", dir: -1 },
  { key: "pr", head: "PR", label: "Frecuencia de elección", mobile: "PR", dir: -1 },
  { key: "br", head: "BR", label: "Frecuencia de bloqueo", mobile: "BR", dir: -1 },
  { key: "games", head: "Partidas", label: "Número de partidas", mobile: "Partidas", dir: -1 },
];

const view = ref("tiers");
const expanded = ref(false);
const sortKey = ref("idx");
const direction = ref(1);

const limit = computed(() => (props.role === "Todos" ? 12 : 10));
const shown = computed(() => {
  const list = props.entries.map((e, i) => ({ ...e, idx: i + 1 }));
  return expanded.value ? list : list.slice(0, limit.value);
});
watch(() => props.role, () => (expanded.value = false));

const defaultDir = (key) => COLS.find((c) => c.key === key).dir;
function pickSort(key) {
  if (key === sortKey.value) direction.value = -direction.value;
  else {
    sortKey.value = key;
    direction.value = defaultDir(key);
  }
}
const arrow = (key) => (key === sortKey.value ? (direction.value === 1 ? "↑" : "↓") : "↕");
const ariaSort = (key) => (key === sortKey.value ? (direction.value === 1 ? "ascending" : "descending") : "none");

const sorted = computed(() => {
  const k = sortKey.value;
  const val = (e) => (k === "name" ? e.c.name : k === "tier" ? TIER_ORDER.indexOf(e.tier) : e[k]);
  return shown.value.slice().sort((a, b) => {
    const cmp = k === "name" ? val(a).localeCompare(val(b), "es") : val(a) - val(b);
    return direction.value * cmp || a.idx - b.idx;
  });
});

const tierGroups = computed(() =>
  TIER_ORDER.map((t) => ({
    t,
    tc: TIER_CLASS[t],
    rows: shown.value.filter((e) => e.tier === t).sort((a, b) => b.wr - a.wr),
  })).filter((g) => g.rows.length)
);

const champLink = (c) => ({ name: "lol-champion", params: { id: c.ddId } });
</script>

<style scoped>
/* Selector de vista (por niveles / tabla) */
.cl-view { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid #2A2F36; border-radius: 11px; background: #0E1217; }
.cl-view button { min-height: 36px; padding: 0 14px; border: 0; border-radius: 8px; background: transparent; color: #AEB6C0; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.cl-view button[aria-pressed="true"] { background: #2A2418; color: #F1D8A0; box-shadow: inset 0 0 0 1px #6B5530; }

/* Por niveles */
.cl-tiers { display: grid; gap: 8px; padding: 6px 18px 18px; }
.cl-row { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 12px; align-items: stretch; padding: 10px; border-radius: 14px; background: #0C1014; border: 1px solid #1E232A; }
.cl-badge { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border-radius: 10px; background: #12171D; }
.cl-badge .tier { min-width: 44px; height: 34px; font-size: 17px; }
.cl-badge small { font-size: 11px; color: var(--ink-mute); }
.cl-champs { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 8px; }
.cl-c { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 6px 9px; border-radius: 12px; background: #12171D; border: 1px solid transparent; color: #F3F1EC; text-decoration: none; text-align: center; transition: border-color 0.2s, transform 0.2s; }
.lol-page .cl-c:hover { border-color: #BA9755; transform: translateY(-2px); color: #F3F1EC; }
.cl-c img { width: 52px; height: 52px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); }
.cl-c b { font-size: 13.5px; line-height: 1.15; }
.cl-c small { font-size: 11.5px; color: var(--ink-mute); line-height: 1.2; }
.cl-wr { font-size: 13px; font-weight: 700; color: #C6CBD2; }
.cl-wr.hi { color: #6FD39A; }
.cl-wr.lo { color: #FF8A7A; }

/* Tabla */
.tscroll { overflow-x: auto; }
.tl { min-width: 780px; }
.tr {
  display: grid;
  grid-template-columns: minmax(46px, 0.55fr) minmax(190px, 2fr) 70px minmax(150px, 1.6fr) minmax(76px, 1fr) minmax(76px, 1fr) minmax(80px, 1fr);
  align-items: center;
  gap: 8px;
  padding: 0 20px;
}
.th {
  height: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.015);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.th button { display: inline-flex; align-items: center; gap: 3px; color: inherit; background: none; border: 0; padding: 8px 0; font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer; white-space: nowrap; }
.th button:hover { color: var(--ink); }
.th [aria-sort]:not([aria-sort="none"]) { color: var(--accent); }
.row { height: 62px; border-bottom: 1px solid rgba(255, 255, 255, 0.045); transition: background 0.2s; }
.row:hover { background: rgba(255, 255, 255, 0.03); }
.idx { font-size: 13px; font-weight: 600; color: var(--ink-faint); }
.cell-champ { min-width: 0; }
.champ { display: flex; align-items: center; gap: 12px; min-width: 0; text-decoration: none; color: var(--ink); }
.lol-page .champ:hover { color: var(--accent); }
.champ img { width: 42px; height: 42px; border-radius: 11px; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.1); transition: transform 0.3s; flex-shrink: 0; }
.row:hover .champ img { transform: scale(1.08) rotate(-2deg); }
.champ-tx { min-width: 0; }
.champ .nm { display: block; font-weight: 600; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.champ .sb { display: block; font-size: 12px; color: var(--ink-mute); }
.lf-mobile-sort, .lf-mobile-label { display: none; }
.empty { margin: 0; padding: 28px 20px; color: #A0A8B4; font-size: 14px; }
.tfoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 20px; }
.tfoot p { margin: 0; font-size: 12.5px; color: var(--ink-mute); max-width: 560px; }
.tfoot-actions { display: flex; gap: 8px; flex-wrap: wrap; }

@media (max-width: 860px) {
  .tl { min-width: 0; }
  .tr { grid-template-columns: 40px minmax(150px, 2fr) 58px repeat(4, minmax(60px, 1fr)); padding: 0 16px; }
  .wr .bar { display: none; }
}
/* Móvil: cada fila pasa a ser una tarjeta (campeón, tier, WR, PR, BR, partidas). */
@media (max-width: 680px) {
  .cl-tiers { padding: 4px 12px 14px; }
  .cl-row { grid-template-columns: 1fr; gap: 8px; }
  .cl-badge { flex-direction: row; justify-content: flex-start; padding: 6px 10px; }
  .cl-champs { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); }
  .lf-mobile-sort { display: flex; align-items: center; gap: 6px; margin: 8px 14px 10px; }
  .lf-mobile-sort label { display: inline-flex; align-items: center; gap: 6px; color: #ABB2BD; font-size: 13px; }
  .lf-mobile-sort select, .lf-mobile-sort button { height: 38px; background: #151920; color: var(--ink); border: 1px solid #333841; border-radius: 9px; font: 600 13px var(--font-body); padding: 0 8px; cursor: pointer; color-scheme: dark; }
  .th { position: absolute; clip-path: inset(50%); width: 1px; height: 1px; overflow: hidden; }
  .th button { visibility: hidden; }
  .tl { min-width: 0; }
  .row {
    height: auto;
    padding: 12px 14px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-areas: "champ champ champ tier" "wr wr wr idx" "pr br games games";
    gap: 5px 8px;
    border-top: 1px solid #262B33;
  }
  .row > .idx { grid-area: idx; justify-self: end; }
  .row > .idx::before { content: "#"; }
  .row > .cell-champ { grid-area: champ; }
  .row > .cell-tier { grid-area: tier; justify-self: end; }
  .row > .wr { grid-area: wr; display: flex; align-items: baseline; gap: 6px; }
  .row > .wr::before { content: "WR"; color: #A6AEB9; font: 500 11px var(--font-body); }
  .row > .num { display: block; font-size: 13px; }
  .row > .c-pr { grid-area: pr; }
  .row > .c-br { grid-area: br; }
  .row > .c-g { grid-area: games; }
  .lf-mobile-label { display: block; font: 500 11px var(--font-body); color: #A6AEB9; }
  .champ img { width: 36px; height: 36px; }
  .tfoot { padding: 14px; }
  .tfoot-actions, .tfoot-actions .btn-soft { width: 100%; justify-content: center; }
}
</style>
