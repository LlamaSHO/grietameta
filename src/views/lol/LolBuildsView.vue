<template>
  <!-- Builds de campeones (/lol/builds). Diseño: models/paginas/LolBuilds.dc.html.
       Usa las builds reales de champion-stats.json (la más jugada de cada
       campeón, de todos los rangos) y el winrate del rango elegido. -->
  <div class="builds lol-page">
    <LolPageHead crumb="Builds" lede="La build que más gana de cada campeón, objeto a objeto, con sus botas y su runa. Cambia el rango para ver el winrate de tu liga.">
      <template #title>Builds de <em>campeones</em></template>
      <template #scope>
        <span class="patch">Parche {{ patch.label }}</span>
        <span>EUW · Solo/dúo · {{ patch.real ? "Partidas reales" : "Datos ilustrativos" }}</span>
      </template>
    </LolPageHead>

    <div class="wrap cb">
      <div class="cb-bar">
        <div class="cb-roles" role="group" aria-label="Filtrar por rol">
          <button v-for="r in ROLE_TABS" :key="r.value" type="button" class="cb-role" :aria-pressed="role === r.value" @click="role = r.value">{{ r.label }}</button>
        </div>
        <label class="cb-f">Rango
          <select v-model="rank">
            <option value="ALL">Todos los rangos</option>
            <option v-for="r in RANK_OPTIONS" :key="r.key" :value="r.key" :disabled="!rankHasData(r.key)">{{ r.label }}</option>
          </select>
        </label>
        <label class="cb-f">Ordenar por
          <select v-model="sort">
            <option value="wr">Más victorias</option>
            <option value="pick">Más jugada</option>
            <option value="name">Nombre (A–Z)</option>
          </select>
        </label>
        <label class="cb-f">Buscar campeón
          <input v-model="query" type="search" placeholder="Yasuo, Jinx…" autocomplete="off">
        </label>
      </div>

      <p v-if="!ready" class="loading">Cargando builds…</p>
      <template v-else>
        <p class="cb-count" aria-live="polite"><b>{{ countLabel }}</b> · {{ rankLabel }} · la build es la de todos los rangos juntos</p>

        <div class="cb-grid">
          <RouterLink v-for="b in visible" :key="b.id" class="bcard" :to="{ name: 'lol-champion', params: { id: b.c.ddId } }" :style="{ '--tint': b.tint }">
            <span class="bc-top">
              <img class="portrait" :src="b.c.icon" alt="" width="56" height="56" loading="lazy" decoding="async">
              <span class="bc-id"><strong>{{ b.c.name }}</strong><small>{{ b.c.role }} · {{ b.c.cls }}</small></span>
              <span class="bc-wr"><b :class="wrClass(b.wr)">{{ pct(b.wr) }}</b><small>de victorias</small></span>
            </span>
            <span>
              <span class="bc-lbl">Objetos en orden</span>
              <ol class="bc-path">
                <li v-for="it in b.core" :key="it.name">
                  <img v-if="it.icon" :src="it.icon" alt="" width="44" height="44" loading="lazy" decoding="async">{{ it.name }}
                </li>
                <li v-if="!b.core.length" class="bc-empty">Sin núcleo con muestra suficiente.</li>
              </ol>
            </span>
            <span class="bc-row">
              <span v-if="b.boot" class="bc-pill"><img :src="b.boot.icon" alt="" width="34" height="34" loading="lazy" decoding="async"><span><small>Botas</small>{{ b.boot.name }}</span></span>
              <span v-if="b.rune" class="bc-pill"><img v-if="b.runeIcon" :src="b.runeIcon" alt="" class="keystone" width="34" height="34" loading="lazy" decoding="async"><span><small>Runa clave</small>{{ b.rune }}</span></span>
            </span>
            <span class="bc-foot"><span><b>{{ fmtInt(b.games) }}</b> partidas · {{ pct(b.pr) }} de uso</span><span class="bc-go">Ver ficha →</span></span>
          </RouterLink>
        </div>

        <div v-if="!rows.length" class="empty">
          <strong>Ningún campeón coincide</strong>
          <p>Prueba con otro nombre o cambia los filtros.</p>
          <button type="button" @click="reset">Restablecer filtros</button>
        </div>
        <div v-else-if="rows.length > shownCount" class="more">
          <button type="button" class="btn-soft" @click="shownCount += 24">Ver más ({{ rows.length - shownCount }} restantes)</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useLolData } from "@/composables/useLolData";
import { RANKS, rankInfo } from "@/services/lol/roster";
import { runeIconUrl } from "@/services/lol/ddragon";
import { fmtInt, pct, wrClass, normalizeSearch } from "@/services/lol/format";
import LolPageHead from "@/components/lol/LolPageHead.vue";
import "@/components/lol/lol.css";

const { state, patch, rankEntries, rankHasData, buildFor } = useLolData();
const ready = computed(() => state.status === "ready");

const ROLE_TABS = [
  { value: "Todos", label: "Todos" },
  { value: "Top", label: "Superior" },
  { value: "Jungla", label: "Jungla" },
  { value: "Mid", label: "Central" },
  { value: "ADC", label: "Inferior" },
  { value: "Support", label: "Apoyo" },
];
const RANK_OPTIONS = RANKS.filter((r) => r.key !== "ALL");
const TINT = { Top: "#97B4EF", Jungla: "#65CFB3", Mid: "#CAA6EE", ADC: "#79B9ED", Support: "#D5B26C" };

const role = ref("Todos");
const rank = ref("ALL");
const sort = ref("wr");
const query = ref("");
const shownCount = ref(24);
watch([role, rank, sort, query], () => (shownCount.value = 24));

const rankLabel = computed(() => (rank.value === "ALL" ? "Todos los rangos" : rankInfo(rank.value).label));

// Una ficha por campeón con build real; el winrate, pickrate y partidas son los del rango elegido.
const cards = computed(() => {
  if (!ready.value) return [];
  const out = [];
  for (const e of rankEntries(rank.value)) {
    const b = buildFor(e.id);
    if (!b) continue;
    const boot = b.boots[0] || null;
    out.push({
      id: e.id,
      c: e.c,
      wr: e.wr,
      pr: e.pr,
      games: e.games,
      core: b.core,
      boot,
      rune: b.runes?.keystone || null,
      runeIcon: b.runes?.icon ? runeIconUrl(b.runes.icon) : null,
      tint: TINT[e.c.role] || "#CCB07A",
    });
  }
  return out;
});

const rows = computed(() => {
  const q = normalizeSearch(query.value.trim());
  const list = cards.value.filter((b) => (role.value === "Todos" || b.c.role === role.value) && (!q || normalizeSearch(b.c.name).includes(q)));
  return list.slice().sort((a, b) => {
    if (sort.value === "name") return a.c.name.localeCompare(b.c.name, "es");
    const m = sort.value === "pick" ? "pr" : "wr";
    return b[m] - a[m] || a.c.name.localeCompare(b.c.name, "es");
  });
});
const visible = computed(() => rows.value.slice(0, shownCount.value));
const countLabel = computed(() => `${rows.value.length} ${rows.value.length === 1 ? "campeón" : "campeones"}`);

function reset() {
  role.value = "Todos";
  rank.value = "ALL";
  sort.value = "wr";
  query.value = "";
}
</script>

<style scoped>
.builds { color: var(--ink); font-variant-numeric: tabular-nums; }
.cb { padding-block: 28px 72px; }
.cb-bar { display: grid; grid-template-columns: auto minmax(150px, 200px) minmax(150px, 200px) minmax(180px, 1fr); gap: 10px; align-items: end; margin-bottom: 18px; }
.cb-roles { display: flex; gap: 4px; padding: 4px; border: 1px solid #292A29; border-radius: 12px; background: #0E1217; }
.cb-role { min-height: 40px; padding: 0 14px; border: 0; border-radius: 9px; background: transparent; color: #AEB6C0; font-family: inherit; font-size: 14px; font-weight: 600; line-height: 1; cursor: pointer; transition: background 0.2s, color 0.2s; }
.cb-role:hover { color: #F3F1EC; }
.cb-role[aria-pressed="true"] { background: #2A2418; color: #F1D8A0; box-shadow: inset 0 0 0 1px #6B5530; }
.cb-f { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 600; color: #AEB6C0; }
.cb-f select, .cb-f input { height: 48px; padding: 0 12px; border: 1px solid #2E3238; border-radius: 10px; background: #12171D; color: #F3F1EC; font-family: inherit; font-size: 14px; font-weight: 500; color-scheme: dark; min-width: 0; width: 100%; }
.cb-count { margin: 0 0 12px; font-size: 13px; color: #AEB6C0; }
.cb-count b { color: #F3F1EC; }
.cb-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.bcard {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border: 1px solid #262B31;
  border-radius: 16px;
  background: linear-gradient(160deg, color-mix(in srgb, var(--tint) 9%, #12171D), #0F1318 60%);
  color: #F3F1EC;
  text-decoration: none;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}
.bcard::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--tint); opacity: 0.8; }
.lol-page .bcard:hover { border-color: color-mix(in srgb, var(--tint) 55%, #262B31); transform: translateY(-2px); color: #F3F1EC; }
.bc-top { display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; gap: 14px; align-items: center; }
.portrait { width: 56px; height: 56px; border-radius: 14px; box-shadow: inset 0 0 0 1px #ffffff25; }
.bc-id strong { display: block; font-family: var(--font-display); font-size: 22px; letter-spacing: -0.02em; line-height: 1.1; }
.bc-id small { display: block; margin-top: 3px; font-size: 13px; color: #AEB6C0; }
.bc-wr { text-align: right; }
.bc-wr b { display: block; font-family: var(--font-display); font-size: 28px; line-height: 1; letter-spacing: -0.03em; color: #C6CBD2; }
.bc-wr b.hi { color: #6FD39A; }
.bc-wr b.lo { color: #F08A7A; }
.bc-wr small { font-size: 12px; color: #AEB6C0; }
.bc-lbl { display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #8F98A5; }
.bc-path { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; counter-reset: it; }
.bc-path li { counter-increment: it; position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 10px; border-radius: 12px; background: #0B0F13; border: 1px solid #20252B; font-size: 12.5px; line-height: 1.3; color: #D8DCE3; }
.bc-path li::after { content: counter(it); position: absolute; top: 8px; right: 10px; font-size: 12px; font-weight: 700; color: #8F98A5; }
.bc-path img { width: 44px; height: 44px; border-radius: 9px; box-shadow: 0 0 0 1px #ffffff1f; }
.bc-path .bc-empty { grid-column: 1 / -1; counter-increment: none; }
.bc-path .bc-empty::after { content: none; }
.bc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bc-pill { display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 8px 10px; border-radius: 12px; background: #0B0F13; border: 1px solid #20252B; font-size: 13px; line-height: 1.25; }
.bc-pill img { width: 34px; height: 34px; border-radius: 8px; }
.bc-pill img.keystone { border-radius: 50%; background: #0A0C10; }
.bc-pill small { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #8F98A5; }
.bc-foot { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding-top: 12px; margin-top: auto; border-top: 1px solid #20252B; font-size: 12.5px; color: #AEB6C0; }
.bc-foot b { color: #F3F1EC; font-weight: 600; }
.bc-go { color: #F1D8A0; font-weight: 600; white-space: nowrap; }
.empty { text-align: center; padding: 24px; }
.empty p { color: #A3ACBA; margin: 4px 0 12px; }
.empty button { height: 42px; padding: 0 16px; color: #f2efeb; background: #191e26; border: 1px solid #383e49; border-radius: 8px; font: 500 14px var(--font-body); cursor: pointer; }
.more { display: flex; justify-content: center; margin-top: 18px; }
.loading { padding: 28px 0; color: var(--ink-mute); }

@media (max-width: 1100px) {
  .cb-bar { grid-template-columns: 1fr 1fr; }
  .cb-roles { grid-column: 1 / -1; overflow-x: auto; }
}
@media (max-width: 860px) { .cb-grid { grid-template-columns: 1fr; } }
@media (max-width: 560px) {
  .cb-bar { grid-template-columns: 1fr; }
  .cb-role { padding: 0 11px; flex: 1; }
  .bc-top { grid-template-columns: 48px minmax(0, 1fr) auto; }
  .portrait { width: 48px; height: 48px; }
  .bc-path li { padding: 8px; }
  .bc-path img { width: 38px; height: 38px; }
  .bc-row { grid-template-columns: 1fr; }
  .bc-wr b { font-size: 24px; }
  .cb { padding-block: 20px 48px; }
}
@media (prefers-reduced-motion: reduce) { .bcard, .bcard:hover { transition: none; transform: none; } }
</style>
