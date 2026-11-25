<template>
  <div class="view-arc-enemies arc-ui">
    <div class="wrap ce">
      <div class="ce-head">
        <div>
          <p class="ce-kick">Bestiario de la superficie</p>
          <h1>Enemigos de ARC</h1>
          <p class="ce-lede">Qué blindaje tiene cada ARC, qué arma lo atraviesa y dónde darle. Elige uno para ver su ficha completa.</p>
        </div>
        <div class="ce-legend">
          <span><b>Blindaje</b> · la barra va de ligero a extremo</span>
          <span><b>Penetración mínima</b> · la que necesita tu arma</span>
        </div>
      </div>
      <template v-if="data.status === 'ready'">
        <div class="ladder" role="group" aria-label="Filtrar por nivel de amenaza">
          <button v-for="t in ladder" :key="t.value" class="rung" :class="t.cls" type="button" :aria-pressed="f.threat === t.value" @click="f.threat = t.value">
            <span class="rung-n">{{ t.count }}</span><span class="rung-l">{{ t.label }}</span>
          </button>
        </div>
        <div class="ce-tools">
          <label class="fld grow">Buscar ARC<input v-model="search" type="search" placeholder="Bastion, Leaper, Wasp…" autocomplete="off"></label>
          <label class="fld">Tipo
            <select v-model="f.type">
              <option value="">Todos los tipos</option>
              <option v-for="type in types" :key="type">{{ type }}</option>
            </select>
          </label>
          <label class="fld">Mapa
            <select v-model="f.map">
              <option value="">Todos los mapas</option>
              <option v-for="map in maps" :key="map">{{ map }}</option>
            </select>
          </label>
          <button type="button" class="ce-reset" @click="reset">Limpiar filtros</button>
        </div>
        <p class="ce-count" aria-live="polite">
          <span><b>{{ list.length }}</b> de {{ enemies.length }} ARC</span>
          <RouterLink :to="{ name: 'arc-map' }">Ver dónde aparecen en el mapa</RouterLink>
        </p>
        <div class="ce-layout">
          <div class="ce-grid">
            <button v-for="e in list" :key="e.id" type="button" class="bc" :class="rungClass[e.threat]" :aria-pressed="current?.id === e.id" @click="open(e)">
              <span class="bc-art">
                <img v-if="e.hasImage && !failed[e.id]" :src="arcBotImageUrl(e.id)" alt="" loading="lazy" decoding="async" @error="failed[e.id] = true">
                <span class="thr" :class="threatClass(e.threat)">{{ e.threatEs || threatLabel(e.threat) }}</span>
                <span class="bc-name">{{ e.name }}</span>
              </span>
              <span class="bc-body">
                <span class="bc-type">{{ e.type }}</span>
                <span class="armor">
                  <ArcArmorMeter :level="e.armorLevel" />
                  <span class="armor-t">{{ e.armorLabel }}<span>Pen. mínima: {{ e.weapons[0]?.penEs || '—' }}</span></span>
                </span>
              </span>
            </button>
            <div v-if="!list.length" class="ce-empty" role="status">
              <h2>Ningún ARC con estos filtros</h2>
              <p>Prueba con otra amenaza, tipo o mapa.</p>
              <button type="button" class="ce-reset" @click="reset">Limpiar filtros</button>
            </div>
          </div>
          <aside v-if="current" class="ce-panel" aria-label="Ficha del ARC seleccionado">
            <ArcEnemySheet :enemy="current" title-id="arc-enemy-side-title" />
          </aside>
        </div>
      </template>
      <p v-else-if="data.status === 'error'" class="status err" role="alert">
        No se pudieron cargar los enemigos.
        <button type="button" class="btn-s" @click="data.reload()">Reintentar</button>
      </p>
      <p v-else class="status" role="status">Cargando enemigos…</p>

      <details class="panel how">
        <summary>¿Cómo se calculan las armas y balas recomendadas?</summary>
        <div class="in">
          <p>El blindaje y la penetración recomendada son orientativos. Estimamos el blindaje a partir de la amenaza y del punto débil, y lo comparamos con la penetración de armadura ARC de cada arma.</p>
          <p>Priorizamos la munición más barata que funciona contra cada ARC. Los datos de penetración de Dolabra y Canto son insuficientes para recomendarlas.</p>
        </div>
      </details>
    </div>

    <ArcDialog :open="dialogOpen && !!current" labelledby="arc-enemy-dialog-title" wide @close="close">
      <ArcEnemySheet v-if="dialogOpen && current" :enemy="current" title-id="arc-enemy-dialog-title" />
    </ArcDialog>
    <ArcCredits :note="dataNote" arc-tracker />
  </div>
</template>
<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ArcArmorMeter from "@/components/arc/lists/ArcArmorMeter.vue";
import ArcDialog from "@/components/arc/lists/ArcDialog.vue";
import ArcEnemySheet from "@/components/arc/lists/ArcEnemySheet.vue";
import ArcCredits from "@/components/arc/hub/ArcCredits.vue";
import { loadArcEnemies, useArcJson } from "@/components/arc/hub/arcData";
import { arcBotImageUrl } from "@/services/arcRaiders";
import { THREAT_ORDER, fmtDate, norm, threatClass, threatLabel } from "@/components/arc/lists/arcLabels";
import "@/components/arc/hub/arc-ui.css";
import "@/assets/styles/views/arc-enemies.css";

const route = useRoute();
const router = useRouter();
const data = useArcJson(loadArcEnemies);
const armorLevels = { "Sin blindaje o ligero": 1, "Sin blindaje": 1, "Blindaje ligero": 1, "Blindaje medio": 2, "Blindaje pesado": 3, "Blindaje extremo": 4 };
const armorLabels = ["Sin estimar", "Ligero o ninguno", "Medio", "Pesado", "Extremo"];
const enemies = computed(() => (data.data?.enemies || []).map((e) => {
  const armorLevel = armorLevels[e.armor] ?? 0;
  return { ...e, armorLevel, armorLabel: armorLabels[armorLevel], maps: e.maps || [], drops: e.drops || [], weapons: e.weapons || [] };
}));
const failed = reactive({});

const threatOrder = [...THREAT_ORDER].reverse();
const rungClass = { Extreme: "r-ext", Critical: "r-cri", High: "r-alt", Moderate: "r-mod", Low: "r-baj" };
const search = ref("");
const f = reactive({ threat: "", type: "", map: "" });
const types = computed(() => [...new Set(enemies.value.map((e) => e.type))].sort());
const maps = computed(() => [...new Set(enemies.value.flatMap((e) => e.maps))].sort());

const matching = computed(() => {
  const q = norm(search.value.trim());
  return enemies.value.filter((e) =>
    (!f.type || e.type === f.type) &&
    (!f.map || e.maps.includes(f.map)) &&
    (!q || norm([e.name, e.type, ...e.drops.map((d) => d.name)].join(" ")).includes(q))
  );
});
const ladder = computed(() => [
  { value: "", label: "Todas", cls: "r-all", count: matching.value.length },
  ...threatOrder.map((value) => ({
    value, label: threatLabel(value), cls: rungClass[value], count: matching.value.filter((e) => e.threat === value).length,
  })),
]);
const list = computed(() => matching.value.filter((e) => !f.threat || e.threat === f.threat)
  .sort((a, b) => threatOrder.indexOf(a.threat) - threatOrder.indexOf(b.threat) || a.name.localeCompare(b.name, "es")));

const selected = ref("");
const dialogOpen = ref(false);
const linked = computed(() => enemies.value.find((e) => e.id === route.query.ver));
const current = computed(() => list.value.find((e) => e.id === selected.value) || list.value[0] || null);
function open(e) {
  selected.value = e.id;
  dialogOpen.value = matchMedia("(max-width: 900px)").matches;
  if (route.query.ver && route.query.ver !== e.id) {
    router.replace({ query: { ...route.query, ver: e.id } });
  }
}
function close() {
  dialogOpen.value = false;
  if (route.query.ver) router.replace({ query: { ...route.query, ver: undefined } });
}
function reset() {
  search.value = f.threat = f.type = f.map = "";
  selected.value = "";
}
watch(linked, (e) => {
  if (!e || route.name !== "arc-enemies") return;
  if (!list.value.some(({ id }) => id === e.id)) reset();
  open(e);
}, { immediate: true });
const dataNote = computed(() => {
  const d = data.data?.meta?.sourceDate;
  return d ? `Datos del juego actualizados hasta el ${fmtDate(d)}. Las armas y balas recomendadas son orientativas.` : "";
});
</script>
