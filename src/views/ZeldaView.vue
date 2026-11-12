<template>
  <!-- Hub de Zelda: Tears of the Kingdom (/zelda). Diseño: models/paginas/Zelda.dc.html.
       Inicio (#inicio) · Mapa interactivo (#mapa) · Información (#info, ZeldaInfo).
       El nav, la barra de Zelda (components/nav/games/ZeldaNav.vue), el footer
       y la barra móvil los pinta App.vue. -->
  <div class="zh">
    <ZeldaHero />
    <ZeldaMap ref="mapSection" />
    <ZeldaInfo />
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ZeldaHero from "@/components/zelda/ZeldaHero.vue";
import ZeldaMap from "@/components/zelda/ZeldaMap.vue";
import ZeldaInfo from "@/components/zelda/ZeldaInfo.vue";
import { LAYER_FROM_QUERY, mapLayer } from "@/components/zelda/mapLayer";
import "@/components/zelda/zelda-hub.css";

const route = useRoute();
const router = useRouter();
const mapSection = ref(null);

// Direcciones antiguas: /zelda#semillas, #santuarios… → /zelda/<guía>.
const OLD_GUIDES = ["santuarios", "semillas", "misiones", "armaduras", "conjuntos"];
watch(
  () => route.hash,
  (hash) => {
    const guide = String(hash || "").replace(/^#/, "");
    if (OLD_GUIDES.includes(guide)) router.replace({ name: "zelda-guide", params: { guia: guide } });
  },
  { immediate: true }
);

// Capa del mapa desde la barra de Zelda: /zelda?capa=cielo#mapa.
watch(
  () => route.query.capa,
  (capa) => {
    const layer = LAYER_FROM_QUERY[String(capa || "").toLowerCase()];
    if (layer) mapLayer.value = layer;
  },
  { immediate: true }
);

// Punto pedido desde las guías («Ver en el mapa»):
// /zelda?capa=superficie&punto=sh:surf:Oromuwak&x=-3079&y=1617#mapa
// Se abre su ficha; si la clave no existe, se centra en x, y. Se espera un
// tick para que el visor haya aplicado antes el cambio de capa.
async function openFromQuery() {
  const { punto, x, y } = route.query;
  if (!punto && (x === undefined || y === undefined)) return;
  await nextTick();
  mapSection.value?.openPoint({ key: punto ? String(punto) : "", x, y });
}
onMounted(openFromQuery);
watch(() => [route.query.punto, route.query.x, route.query.y], openFromQuery);
</script>
