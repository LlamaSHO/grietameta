<template>
  <!-- Hub de League of Legends (/lol). Diseño: models/paginas/Lol.dc.html.
       Anclas que usa la barra de LoL: #tierlist, #destacado, #campeones, #premium. -->
  <div ref="root" class="lol-page lol-hub">
    <LolHeader :patch="patch" :ready="ready" />

    <!-- Ancla de #tierlist: va fuera de la barra de filtros porque esta es
         sticky (si el ancla fuera la barra, al pulsar «Tier list» desde abajo
         la página no se movería). -->
    <span id="tierlist" class="tl-anchor" aria-hidden="true"></span>

    <!-- Filtros (fijos al bajar en escritorio) -->
    <div ref="filtersEl" class="filters">
      <div class="wrap">
        <div class="fbar">
          <RoleFilter v-model="filters.role" />
          <span class="fsep" aria-hidden="true"></span>
          <RankDropdown v-model="filters.rank" :has-data="rankHasData" />
          <RegionDropdown />
          <span class="tag" title="Parche analizado">{{ patch.label }}</span>
          <div class="fsearch">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <label class="sr-only" for="q-champ">Buscar campeón</label>
            <input id="q-champ" v-model="filters.q" type="search" placeholder="Busca un campeón (Ahri, Vayne, K'Sante…)" autocomplete="off">
          </div>
        </div>
      </div>
    </div>

    <div class="wrap layout hub-layout">
      <div class="main">
        <LolTierList
          :entries="tierRows"
          :role="filters.role"
          :total="champions.length"
          :meta="metaLine"
          :note="rankNote"
          :loading="!ready"
        />
        <PatchSpotlight :spot="ready ? spotlight : null" />
        <ChampionGrid :items="gridItems" :role-label="roleLabel" :loading="!ready" />
      </div>

      <aside class="aside" aria-label="Resumen y destacados">
        <PatchSummary :patch="patch" />
        <template v-if="ready">
          <BestByRole :entries="entries" :rank-label="rankLabel" />
          <MostBanned :entries="entries" :rank-label="rankLabel" />
        </template>
        <GamesByRank v-if="patch.real" v-model="filters.rank" :matches="rankMatches" />
        <PremiumMini />
        <AdSlot ad-slot="7741286383" />
      </aside>
    </div>

    <div class="wrap hub-ad">
      <AdSlot ad-slot="9688862686" variant="banner" />
    </div>

    <LolPremium />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useLolData } from "@/composables/useLolData";
import { fmtInt, normalizeSearch } from "@/services/lol/format";
import LolHeader from "@/components/lol/LolHeader.vue";
import RoleFilter from "@/components/lol/RoleFilter.vue";
import RankDropdown from "@/components/lol/RankDropdown.vue";
import RegionDropdown from "@/components/lol/RegionDropdown.vue";
import LolTierList from "@/components/lol/LolTierList.vue";
import PatchSpotlight from "@/components/lol/PatchSpotlight.vue";
import ChampionGrid from "@/components/lol/ChampionGrid.vue";
import PatchSummary from "@/components/lol/PatchSummary.vue";
import BestByRole from "@/components/lol/BestByRole.vue";
import MostBanned from "@/components/lol/MostBanned.vue";
import GamesByRank from "@/components/lol/GamesByRank.vue";
import PremiumMini from "@/components/lol/PremiumMini.vue";
import AdSlot from "@/components/lol/AdSlot.vue";
import LolPremium from "@/components/lol/LolPremium.vue";
import "@/components/lol/lol.css";

const route = useRoute();
const { state, filters, champions, patch, spotlight, rankInfo, rankEntries, rankMatches, rankHasData } = useLolData();

const ready = computed(() => state.status === "ready");

// Entradas del rango elegido (todas las líneas), ordenadas por tier.
const entries = computed(() => (ready.value ? rankEntries(filters.rank) : []));

const query = computed(() => normalizeSearch(filters.q.trim()));
const matchesQuery = (c) => !query.value || normalizeSearch(c.name).includes(query.value);
const inRole = (c) => filters.role === "Todos" || c.role === filters.role;

const tierRows = computed(() => entries.value.filter((e) => inRole(e.c) && matchesQuery(e.c)));

// Rejilla: primero los que tienen datos en el rango (por tier), luego el resto.
const gridItems = computed(() => {
  const withData = tierRows.value.map((e) => ({ c: e.c, tier: e.tier, tc: e.tc }));
  const seen = new Set(withData.map((g) => g.c.id));
  const rest = champions.value
    .filter((c) => !seen.has(c.id) && inRole(c) && matchesQuery(c))
    .sort((a, b) => a.name.localeCompare(b.name, "es"))
    .map((c) => ({ c, tier: null, tc: null }));
  return [...withData, ...rest];
});

const current = computed(() => rankInfo(filters.rank));
const roleLabel = computed(() => (filters.role === "Todos" ? "Todos los roles" : filters.role));
const rankLabel = computed(() => (filters.rank === "ALL" ? "Todos los rangos" : current.value.label));
const metaLine = computed(() => `${roleLabel.value} · ${filters.rank === "ALL" ? "todos los rangos" : current.value.label}`);
const rankNote = computed(() => {
  if (filters.rank === "ALL" || !patch.value.real) return "";
  return `${current.value.label}: ${fmtInt(rankMatches(filters.rank))} partidas analizadas en este rango. Las builds son de todos los rangos juntos.`;
});

// Alto de la barra de filtros cuando va fija (sticky). Las anclas #destacado,
// #campeones y #premium (.lol-anchor en lol.css) se adelantan ese alto para
// que el bloque no quede tapado por la barra.
const root = ref(null);
const filtersEl = ref(null);
let ro = null;
function updateStickyHeight() {
  const f = filtersEl.value;
  if (!f || !root.value) return;
  const h = getComputedStyle(f).position === "sticky" ? f.offsetHeight : 0;
  root.value.style.setProperty("--lol-sticky-h", `${h}px`);
}
onMounted(() => {
  updateStickyHeight();
  if (typeof ResizeObserver !== "undefined" && filtersEl.value) {
    ro = new ResizeObserver(updateStickyHeight);
    ro.observe(filtersEl.value);
  }
});

// Elemento del ancla de la URL. Se busca por id: un hash raro (#1abc, #a%20b)
// no hace fallar a querySelector.
function hashTarget() {
  if (!route.hash) return null;
  try {
    return document.getElementById(decodeURIComponent(route.hash.slice(1)));
  } catch {
    return null;
  }
}

// Al entrar con un ancla (#campeones…) los datos aún no están: cuando llegan,
// la página crece y se vuelve a bajar al ancla. Justo después aún cambian
// algunas alturas (fuentes, huecos de anuncio vacíos), así que se recoloca un
// par de veces más, salvo que el usuario ya haya movido la página.
const USER_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];
let settleTimers = [];
function stopSettle() {
  settleTimers.forEach(clearTimeout);
  settleTimers = [];
  USER_EVENTS.forEach((ev) => window.removeEventListener(ev, stopSettle));
}
watch(ready, async (v) => {
  if (!v || !route.hash) return;
  await nextTick();
  updateStickyHeight();
  const go = () => hashTarget()?.scrollIntoView({ behavior: "instant" });
  go();
  stopSettle();
  settleTimers = [500, 1500].map((ms, i, all) =>
    setTimeout(() => {
      go();
      if (i === all.length - 1) stopSettle();
    }, ms)
  );
  USER_EVENTS.forEach((ev) => window.addEventListener(ev, stopSettle, { passive: true }));
});

onBeforeUnmount(() => {
  ro?.disconnect();
  stopSettle();
});
</script>

<style scoped>
.filters {
  position: sticky;
  top: calc(var(--nav-h) + var(--subnav-h));
  z-index: 40;
  padding: 14px 0;
  background: linear-gradient(180deg, var(--bg) 70%, rgba(7, 9, 13, 0));
}
.fbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px;
  border-radius: 16px;
  background: #0D1017;
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.fsep { width: 1px; height: 28px; background: rgba(255, 255, 255, 0.08); }
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 12px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 13px;
  color: #A0A8B4;
}
.fsearch {
  margin-left: auto;
  position: relative;
  display: flex;
  align-items: center;
  min-width: 180px;
  flex: 1 1 220px;
  max-width: 300px;
}
.fsearch svg { position: absolute; left: 12px; color: #8A93A0; pointer-events: none; }
.fsearch input {
  width: 100%;
  height: 40px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink);
  font: inherit;
  font-size: 14px;
  padding: 0 12px 0 36px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}
.fsearch input::placeholder { color: var(--ink-faint); }
.fsearch input:focus { border-color: rgba(226, 181, 102, 0.55); }
.tl-anchor { display: block; height: 0; }
.hub-layout { padding-bottom: 32px; }
.hub-ad { padding-bottom: 40px; }
/* Sin anuncio (Premium o AdSense sin nada que servir) no queda el hueco. */
.hub-ad:empty,
.hub-ad:has(ins[data-ad-status="unfilled"]) { display: none; }

@media (max-width: 860px) {
  .filters { position: static; }
  .fsep { display: none; }
  .fsearch { margin-left: 0; flex: 1 1 100%; min-width: 0; max-width: none; }
}
@media (max-width: 560px) {
  .fbar { gap: 8px; }
  .filters { padding: 12px 0; }
}
</style>
