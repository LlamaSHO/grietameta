<template>
  <!-- Enemigos ARC (/arc-raiders/enemigos). Sin diseño propio: sigue el
       estilo del hub (components/arc). Buscador, filtros por amenaza y mapa,
       tarjetas y ficha de cada ARC. Admite ?ver=<id> para abrir su ficha. -->
  <div class="view-arc-enemies arc-ui">
    <ArcListHeader
      crumb="Enemigos"
      title="Enemigos ARC"
      accent="Dónde disparar"
      lead="Todos los ARC del juego: dónde aparecen, su punto débil, qué sueltan y con qué armas y balas conviene enfrentarlos."
      img="/images/arc-raiders/bots/arc_bastion.webp"
    >
      <template v-if="data.status === 'ready'">
        <span class="pill"><b>{{ enemies.length }}</b>tipos de ARC</span>
        <span v-for="t in threatCounts" :key="t.value" class="pill"><span class="thr" :class="t.cls">{{ t.label }}</span><b>{{ t.count }}</b></span>
      </template>
    </ArcListHeader>

    <div class="wrap body">
      <div class="tools">
        <div class="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <label class="sr-only" for="arc-enemies-q">Buscar enemigo</label>
          <input id="arc-enemies-q" v-model="search" type="search" placeholder="Buscar enemigo o botín…" autocomplete="off">
        </div>
        <div class="filters">
          <ArcFilterRow v-model="f.threat" label="Amenaza" :options="threatOptions" />
          <ArcFilterRow v-model="f.map" label="Mapa" :options="mapOptions" />
        </div>
      </div>

      <details class="panel how">
        <summary>¿Cómo se calculan las armas y balas recomendadas?</summary>
        <div class="in">
          <p>Los datos disponibles no incluyen la vida ni el blindaje exacto de cada ARC, así que la recomendación es <b>orientativa</b>.</p>
          <p>Estimamos el blindaje del enemigo por su nivel de amenaza y su punto débil, y comparamos con la «Penetración de armadura ARC» de cada arma. Contra enemigos sin blindaje se muestran las armas con munición más barata; contra los blindados, las que tienen la penetración justa necesaria, priorizando la munición más barata y fácil de conseguir.</p>
          <p>Dolabra y Canto no se recomiendan porque no hay datos fiables de su penetración.</p>
        </div>
      </details>

      <div class="count" aria-live="polite">
        <template v-if="data.status === 'ready'">{{ list.length }} de {{ enemies.length }} enemigos</template>
      </div>

      <div v-if="list.length" class="grid">
        <button v-for="e in list" :key="e.id" type="button" class="card" :aria-label="`${e.name}, amenaza ${e.threatEs || threatLabel(e.threat)}`" @click="open(e)">
          <span class="pic">
            <img v-if="e.hasImage && !failed[e.id]" :src="arcBotImageUrl(e.id)" alt="" loading="lazy" decoding="async" @error="failed[e.id] = true">
            <span v-else class="ph" aria-hidden="true">{{ e.name.charAt(0) }}</span>
            <span class="thr" :class="threatClass(e.threat)">{{ e.threatEs || threatLabel(e.threat) }}</span>
          </span>
          <span class="bd">
            <span class="nm cond">{{ e.name }}</span>
            <span class="ty">{{ e.type }}</span>
            <span v-if="e.weakness" class="wk"><b>Punto débil:</b> {{ e.weakness }}</span>
            <span class="mini">{{ e.drops.length }} botines · {{ e.maps.length }} {{ e.maps.length === 1 ? "mapa" : "mapas" }}</span>
          </span>
        </button>
      </div>

      <p v-if="data.status === 'loading'" class="status">Cargando enemigos…</p>
      <p v-else-if="data.status === 'error'" class="status err">
        No se pudieron cargar los enemigos. Inténtalo de nuevo en unos segundos.
        <button type="button" class="btn-s" @click="data.reload()">Reintentar</button>
      </p>
      <p v-else-if="!list.length" class="status">Ningún enemigo coincide con los filtros.</p>
    </div>

    <ArcDialog :open="!!current" labelledby="arc-enemy-title" wide @close="close">
      <ArcEnemySheet v-if="current" :enemy="current" title-id="arc-enemy-title" />
    </ArcDialog>

    <ArcCredits :note="dataNote" arc-tracker />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ArcListHeader from "@/components/arc/lists/ArcListHeader.vue";
import ArcFilterRow from "@/components/arc/lists/ArcFilterRow.vue";
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
const enemies = computed(() =>
  (data.data?.enemies || []).map((e) => ({ ...e, maps: e.maps || [], drops: e.drops || [], weapons: e.weapons || [], ammo: e.ammo || [] }))
);
const failed = reactive({});

// ---- Filtros ----
const search = ref("");
const f = reactive({ threat: "", map: "" });
const list = computed(() => {
  const q = norm(search.value.trim());
  return enemies.value.filter((e) => {
    if (f.threat && e.threat !== f.threat) return false;
    if (f.map && !e.maps.includes(f.map)) return false;
    if (q) {
      const hay = norm(`${e.name} ${e.type} ${e.drops.map((d) => d.name).join(" ")}`);
      if (!hay.includes(q)) return false;
    }
    return true;
  });
});
const threatCounts = computed(() =>
  THREAT_ORDER.slice()
    .reverse()
    .map((t) => ({ value: t, label: threatLabel(t), cls: threatClass(t), count: enemies.value.filter((e) => e.threat === t).length }))
    .filter((t) => t.count)
);
const threatOptions = computed(() =>
  THREAT_ORDER.map((t) => ({ value: t, label: threatLabel(t), count: enemies.value.filter((e) => e.threat === t).length })).filter((o) => o.count)
);
const mapOptions = computed(() => {
  const n = {};
  enemies.value.forEach((e) => e.maps.forEach((m) => (n[m] = (n[m] || 0) + 1)));
  return Object.keys(n)
    .sort()
    .map((m) => ({ value: m, label: m, count: n[m] }));
});

// ---- Ficha (también desde ?ver=<id>, p. ej. desde el hub) ----
const current = ref(null);
function open(e) {
  current.value = e;
}
// Al cerrar se quita ?ver de la URL. Con router.replace (no history) para que
// el router sepa la ruta real y un enlace a la misma ficha la vuelva a abrir;
// el scroll se conserva porque solo cambia la query.
function close() {
  current.value = null;
  if (route.query.ver) router.replace({ name: "arc-enemies", query: { ...route.query, ver: undefined } });
}
watch(
  [enemies, () => route.query.ver],
  ([list, id]) => {
    if (!id || !list.length) return;
    const e = list.find((x) => x.id === id);
    if (e) current.value = e;
  },
  { immediate: true }
);

const dataNote = computed(() => {
  const d = data.data?.meta?.sourceDate;
  return d ? `Datos del juego actualizados hasta el ${fmtDate(d)}. Las armas y balas recomendadas son orientativas.` : "";
});
</script>
