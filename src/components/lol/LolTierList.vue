<template>
  <section class="card" aria-labelledby="tl-h">
    <div class="card-h">
      <h2 id="tl-h" class="disp">Tier list del parche</h2>
      <span class="meta">{{ meta }}</span>
    </div>
    <p v-if="note" class="note">{{ note }}</p>

    <p v-if="loading" class="loading">Cargando estadísticas…</p>
    <template v-else>
      <div class="tscroll">
        <div class="tl" role="table" aria-label="Tier list de campeones">
          <div class="tr th" role="row">
            <span role="columnheader">#</span>
            <span role="columnheader">Campeón</span>
            <span role="columnheader">Línea</span>
            <span role="columnheader" class="sorted">Tier ↓</span>
            <span role="columnheader">Winrate</span>
            <span role="columnheader">Pickrate</span>
            <span role="columnheader">Banrate</span>
            <span role="columnheader">Partidas</span>
          </div>
          <div v-for="(e, i) in shown" :key="e.id" class="tr row" role="row">
            <span class="idx" role="cell">{{ i + 1 }}</span>
            <span role="cell" class="cell-champ">
              <RouterLink class="champ" :to="champLink(e.c)">
                <img :src="e.c.icon" alt="" loading="lazy" width="42" height="42">
                <span class="champ-tx">
                  <span class="nm">{{ e.c.name }}</span>
                  <span class="sb">{{ e.c.role }} · {{ e.c.cls }}</span>
                </span>
              </RouterLink>
            </span>
            <span role="cell" class="lane" :title="e.c.role"><span class="pi" :class="`pi-${ROLE_ICON[e.c.role]}`" aria-hidden="true"></span><span class="sr-only">{{ e.c.role }}</span></span>
            <span role="cell"><span class="tier" :class="e.tc">{{ e.tier }}</span></span>
            <span role="cell" class="wr" :class="wrClass(e.wr)"><b>{{ pct(e.wr) }}</b><span class="bar"><i :style="{ width: wrWidth(e.wr) }"></i></span></span>
            <span role="cell" class="num">{{ pct(e.pr) }}</span>
            <span role="cell" class="num">{{ pct(e.br) }}</span>
            <span role="cell" class="num">{{ fmtInt(e.games) }}</span>
          </div>
        </div>
      </div>
      <p v-if="!entries.length" class="empty">No hay ningún campeón que coincida con tu búsqueda en este rol.</p>
    </template>

    <div class="tfoot">
      <p>Tier relativo a cada rol: combina winrate, pickrate y banrate del rango elegido.</p>
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
import { ROLE_ICON } from "@/services/lol/roster";
import { fmtInt, pct, wrClass, wrWidth } from "@/services/lol/format";

const props = defineProps({
  entries: { type: Array, required: true }, // ya filtradas y ordenadas por tier
  role: { type: String, default: "Todos" },
  total: { type: Number, default: 0 },
  meta: { type: String, default: "" },
  note: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});

const expanded = ref(false);
const limit = computed(() => (props.role === "Todos" ? 12 : 10));
const shown = computed(() => (expanded.value ? props.entries : props.entries.slice(0, limit.value)));
watch(() => props.role, () => (expanded.value = false));

const champLink = (c) => ({ name: "lol-champion", params: { id: c.ddId } });
</script>

<style scoped>
.tscroll { overflow-x: auto; }
.tl { min-width: 780px; }
.tr {
  display: grid;
  grid-template-columns: 44px minmax(190px, 2fr) 54px 70px minmax(150px, 1.6fr) minmax(76px, 1fr) minmax(76px, 1fr) minmax(80px, 1fr);
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
.th .sorted { color: var(--accent); }
.row {
  height: 62px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.045);
  transition: background 0.2s;
  animation: lol-rise 0.5s var(--ease-out) both;
}
.row:hover { background: rgba(255, 255, 255, 0.03); }
.row:nth-child(2) { animation-delay: 0.03s; }
.row:nth-child(3) { animation-delay: 0.06s; }
.row:nth-child(4) { animation-delay: 0.09s; }
.row:nth-child(5) { animation-delay: 0.12s; }
.row:nth-child(6) { animation-delay: 0.15s; }
.row:nth-child(7) { animation-delay: 0.18s; }
.row:nth-child(8) { animation-delay: 0.21s; }
.row:nth-child(9) { animation-delay: 0.24s; }
.row:nth-child(10) { animation-delay: 0.27s; }
.row:nth-child(11) { animation-delay: 0.3s; }
.row:nth-child(12) { animation-delay: 0.33s; }
.idx { font-size: 13px; font-weight: 600; color: var(--ink-faint); }
.cell-champ { min-width: 0; }
.champ { display: flex; align-items: center; gap: 12px; min-width: 0; text-decoration: none; color: var(--ink); }
.lol-page .champ:hover { color: var(--accent); }
.champ img {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s;
  flex-shrink: 0;
}
.row:hover .champ img { transform: scale(1.08) rotate(-2deg); }
.champ-tx { min-width: 0; }
.champ .nm { display: block; font-weight: 600; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.champ .sb { display: block; font-size: 12px; color: var(--ink-mute); }
.lane { color: var(--ink-mute); }
.lane .pi { width: 20px; height: 20px; }
.empty { margin: 0; padding: 28px 20px; color: #A0A8B4; font-size: 14px; }
.tfoot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 20px;
}
.tfoot p { margin: 0; font-size: 12.5px; color: var(--ink-mute); }
.tfoot-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* Tablet: sin la columna Línea (ya sale bajo el nombre) ni la barra del
   winrate, para que la tabla quepa sin desplazarse en horizontal. */
@media (max-width: 860px) {
  .tl { min-width: 0; }
  .tr { grid-template-columns: 34px minmax(150px, 2fr) 58px repeat(4, minmax(60px, 1fr)); padding: 0 16px; }
  .tr > :nth-child(3) { display: none; }
  .wr .bar { display: none; }
}
@media (max-width: 640px) {
  .tl { min-width: 0; }
  .tr { grid-template-columns: 26px minmax(0, 1fr) 46px 62px; gap: 8px; padding: 0 14px; }
  .tr > :nth-child(3),
  .tr > :nth-child(n + 6) { display: none; }
  .wr .bar { display: none; }
  .wr b { min-width: 0; font-size: 13px; }
  .champ img { width: 36px; height: 36px; }
  .row { height: 56px; }
  .tfoot { padding: 14px; }
  .tfoot-actions,
  .tfoot-actions .btn-soft { width: 100%; justify-content: center; }
}
</style>
