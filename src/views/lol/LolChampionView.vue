<template>
  <!-- Ficha de campeón (/lol/campeon/:id). Diseño: models/paginas/LolCampeon.dc.html.
       :id es el id de Data Dragon (Yasuo, MonkeyKing…); también vale el del sitio (wukong). -->
  <div class="lol-page lol-champ">
    <div class="wrap">
      <p v-if="!ready" class="loading champ-loading">Cargando campeón…</p>

      <!-- Campeón no encontrado -->
      <section v-else-if="!champ" class="card notfound">
        <span class="ico" aria-hidden="true">?</span>
        <h1 class="disp">Campeón no encontrado</h1>
        <p>No tenemos ningún campeón con el nombre «{{ route.params.id }}». Puede que esté mal escrito o que sea nuevo y aún no tengamos sus datos.</p>
        <RouterLink class="btn-gold" :to="{ path: '/lol', hash: '#campeones' }">Ver todos los campeones</RouterLink>
      </section>

      <template v-else>
        <ChampionHeader v-model:tab="tab" :champ="champ" :entry="entry" :detail="detail" :version="state.version" :patch-label="patch.label" />

        <!-- Filtros -->
        <div class="fbar">
          <span class="rolebox"><span class="pi" :class="`pi-${ROLE_ICON[champ.role]}`" aria-hidden="true"></span>{{ champ.role }} <small>· su línea principal</small></span>
          <RankDropdown v-model="filters.rank" :has-data="rankHasData" />
          <span class="tag">EUW</span>
          <span class="tag">{{ patch.label }}</span>
        </div>

        <!-- Estadísticas del rango elegido -->
        <div class="stats">
          <template v-if="entry">
            <div class="st"><div class="v" :class="wrClass(entry.wr)">{{ pct(entry.wr) }}</div><div class="k">Winrate</div></div>
            <div class="st"><div class="v">{{ fmtInt(entry.games) }}</div><div class="k">Partidas</div></div>
            <div class="st"><div class="v">{{ pct(entry.pr) }}</div><div class="k">Pickrate</div></div>
            <div class="st"><div class="v">{{ pct(entry.br) }}</div><div class="k">Banrate</div></div>
            <div class="st"><div class="v">#{{ entry.pos }} <small>de {{ entry.of }}</small></div><div class="k">Puesto en {{ champ.role }}</div></div>
          </template>
          <div v-else class="st st-empty">
            <div class="k">{{ rankLabel }}: aún no hay partidas suficientes de {{ champ.name }} en este rango.</div>
          </div>
        </div>
        <p v-if="!patch.real" class="illus">Estadísticas ilustrativas: los datos reales no se han podido cargar.</p>

        <div class="layout champ-layout">
          <div class="main">
            <div v-if="tab === 'build'" class="bgrid">
              <ChampionRunes :runes="build?.runes || null" :trees="runeTrees" />
              <ChampionItems :build="build" />
            </div>

            <ChampionByRank v-else-if="tab === 'rank'" v-model="filters.rank" :name="champ.name" :role="champ.role" :rows="byRank" />

            <section v-else class="card">
              <div class="empty">
                <span class="ico" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5" /><path d="M13 19l6-6" /><path d="M9.5 17.5L21 6V3h-3L6.5 14.5" /><path d="M11 19l-6-6" /></svg></span>
                <h3 class="disp">Matchups de {{ champ.name }}, muy pronto</h3>
                <p>Estamos preparando sus enfrentamientos en línea: contra quién gana y contra quién sufre, con el winrate de cada duelo.</p>
              </div>
            </section>
          </div>

          <aside class="aside" aria-label="Más campeones">
            <section class="card">
              <div class="card-h"><h3 class="disp">Otros campeones de {{ champ.role }}</h3><span class="meta">{{ rankLabel }}</span></div>
              <div class="w-list">
                <RouterLink v-for="o in others" :key="o.id" class="wl" :to="{ name: 'lol-champion', params: { id: o.c.ddId } }">
                  <img :src="o.c.icon" alt="" loading="lazy" width="38" height="38">
                  <span class="tx"><b>{{ o.c.name }}</b><span>{{ o.c.cls }}</span></span>
                  <span class="tier" :class="o.tc">{{ o.tier }}</span>
                  <span class="rv" :class="wrClass(o.wr)">{{ pct(o.wr) }}</span>
                </RouterLink>
                <p v-if="!others.length" class="none">Sin datos de otros campeones en este rango.</p>
              </div>
            </section>
            <PremiumMini />
            <AdSlot ad-slot="7741286383" />
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLolData } from "@/composables/useLolData";
import { fetchChampionDetail, fetchRuneTrees } from "@/services/lol/ddragon";
import { RANKS, ROLE_ICON } from "@/services/lol/roster";
import { fmtInt, pct, wrClass } from "@/services/lol/format";
import ChampionHeader from "@/components/lol/champion/ChampionHeader.vue";
import ChampionRunes from "@/components/lol/champion/ChampionRunes.vue";
import ChampionItems from "@/components/lol/champion/ChampionItems.vue";
import ChampionByRank from "@/components/lol/champion/ChampionByRank.vue";
import RankDropdown from "@/components/lol/RankDropdown.vue";
import PremiumMini from "@/components/lol/PremiumMini.vue";
import AdSlot from "@/components/lol/AdSlot.vue";
import "@/components/lol/lol.css";

const route = useRoute();
const router = useRouter();
const { state, filters, patch, stats, rankInfo, rankEntries, entryFor, rankHasData, findChampion, buildFor } = useLolData();

const ready = computed(() => state.status === "ready");
const champ = computed(() => (ready.value ? findChampion(route.params.id) : null));
const tab = ref("build");

// Si se entra con el id del sitio (/lol/campeon/wukong, el que usa la portada)
// o con otras mayúsculas, se pasa al id de Data Dragon (MonkeyKing).
watch(
  [champ, () => route.params.id],
  ([c]) => {
    if (c && route.params.id !== c.ddId) router.replace({ name: "lol-champion", params: { id: c.ddId }, hash: route.hash });
  },
  { immediate: true }
);
// Al cambiar de campeón se vuelve a la pestaña Build.
watch(() => route.params.id, () => (tab.value = "build"));

const entry = computed(() => (champ.value ? entryFor(champ.value.id, filters.rank) : null));
const build = computed(() => (champ.value ? buildFor(champ.value.id) : null));
const rankLabel = computed(() => (filters.rank === "ALL" ? "Todos los rangos" : rankInfo(filters.rank).label));

const byRank = computed(() =>
  champ.value
    ? RANKS.map((r) => ({
        key: r.key,
        label: r.key === "ALL" ? "Todos los rangos" : r.label,
        img: r.img,
        e: entryFor(champ.value.id, r.key),
      }))
    : []
);

// Los 6 mejores de su línea en el rango elegido (sin él).
const others = computed(() => {
  const c = champ.value;
  if (!c) return [];
  return rankEntries(filters.rank)
    .filter((e) => e.role === c.role && e.id !== c.id)
    .slice(0, 6);
});

// Textos de Data Dragon en español: título y habilidades.
const detail = ref(null);
const runeTrees = ref([]);
watch(
  () => [champ.value?.ddId, state.version],
  async ([ddId, v]) => {
    detail.value = null;
    if (!ddId) return;
    const d = await fetchChampionDetail(v, ddId);
    if (champ.value?.ddId === ddId) detail.value = d;
  },
  { immediate: true }
);
watch(
  () => [ready.value, stats.value?.ddragonVersion || state.version],
  async ([ok, v]) => {
    if (ok) runeTrees.value = await fetchRuneTrees(v);
  },
  { immediate: true }
);

// Título de la pestaña y descripción con el nombre del campeón. Va en
// "post" y depende de la ruta para ejecutarse después del afterEach del
// router, que pone el título genérico de meta.title en cada navegación.
watch([ready, champ, () => route.fullPath], () => {
  if (!ready.value) return;
  const c = champ.value;
  document.title = c
    ? `${c.name}: build, runas y winrate (${patch.value.label}) — League of Legends | GrietaMeta`
    : "Campeón no encontrado — League of Legends | GrietaMeta";
  if (c) {
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `Build de ${c.name} en el parche ${patch.value.label}: runas, objetos, winrate, pickrate y banrate por rango con partidas reales de EUW.`
      );
  }
}, { immediate: true, flush: "post" });
</script>

<style scoped>
.champ-loading { padding: 80px 0; text-align: center; }

/* No encontrado */
.notfound {
  margin: 48px auto 64px;
  max-width: 560px;
  padding: 40px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}
.notfound .ico {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(226, 181, 102, 0.1);
  border: 1px solid rgba(226, 181, 102, 0.35);
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 800;
}
.notfound h1 { margin: 6px 0 0; font-size: 28px; }
.notfound p { margin: 0 0 8px; color: var(--ink-dim); }

/* Filtros */
.fbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding: 8px;
  border-radius: 16px;
  background: #0D1017;
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.rolebox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 11px;
  background: rgba(226, 181, 102, 0.14);
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(226, 181, 102, 0.35);
}
.rolebox small { color: #C6CBD2; font-weight: 500; font-size: 13px; }
.tag {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 13px;
  font-weight: 600;
  color: #A0A8B4;
}

/* Cifras */
.stats {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
  margin-top: 16px;
  border-radius: 18px;
  background: #0D1017;
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;
}
.stats::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: linear-gradient(90deg, #C8AA6E, #0AC8B9);
}
.st { padding: 20px 16px 22px; text-align: center; border-right: 1px solid rgba(255, 255, 255, 0.05); }
.st:last-child { border-right: 0; }
.st .v { font-family: var(--font-display); font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.05; }
.st .v small { font-size: 18px; color: var(--ink-dim); font-weight: 600; }
.st .v.hi { color: #62D99C; }
.st .v.lo { color: #F08A7A; }
.st .k { margin-top: 4px; font-size: 12px; color: var(--ink-mute); }
.st-empty .k { font-size: 14px; color: var(--ink-dim); margin: 0; }
.illus { margin: 10px 0 0; font-size: 13px; color: #F0B0A6; }

.champ-layout { padding: 20px 0 48px; }
.bgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: 20px; }

/* Matchups (sin datos aún) */
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 48px 24px; }
.empty .ico {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(10, 200, 185, 0.1);
  border: 1px solid rgba(10, 200, 185, 0.3);
  color: #7FE9DE;
}
.empty h3 { margin: 6px 0 0; font-size: 20px; }
.empty p { margin: 0; max-width: 440px; color: var(--ink-dim); font-size: 14.5px; }
.none { margin: 0; padding: 8px; font-size: 13px; color: var(--ink-mute); }

@media (max-width: 860px) {
  /* Tablet: las cinco cifras en una fila (antes quedaba 4 + 1). */
  .stats { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .st { padding: 18px 8px 20px; }
  .st .v { font-size: 26px; }
  .st .v small { font-size: 15px; }
}
@media (max-width: 560px) {
  /* Cifras en dos columnas; el puesto ocupa toda la fila. */
  .stats { grid-template-columns: 1fr 1fr; }
  .st { padding: 16px 10px 18px; border-right: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
  .st:nth-child(odd) { border-right: 1px solid rgba(255, 255, 255, 0.05); }
  .st:last-child { grid-column: 1 / -1; border-right: 0; border-bottom: 0; }
  .st .v { font-size: 26px; }
  .rolebox small { display: none; }
  .champ-layout { padding-top: 16px; }
}
</style>
