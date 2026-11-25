<template>
  <div class="card">
    <div v-if="mapPoint" class="mini" :class="{ deep: row.shrine, area: row.area }">
      <img :src="mapImage" alt="" loading="lazy" decoding="async">
      <span class="tag">{{ mapLabel }}</span>
      <span v-if="row.friend" class="pin2" :style="pinPosition(row.friend)" role="img" aria-label="Posición del amigo"></span>
      <span class="pin" :style="pinPosition(mapPoint)" role="img" :aria-label="row.area ? 'Zona aproximada de la misión' : 'Posición en el mapa'"></span>
    </div>

    <h2 class="side-h serif" tabindex="-1">{{ row.name || row.seeds === 2 && 'Kolog con amigo' || 'Semilla kolog' }}</h2>
    <div v-if="subtitle" class="side-en">{{ subtitle }}</div>

    <template v-if="isPoint">
      <dl class="facts">
        <div><dt>X</dt><dd>{{ fmt(row.x) }}</dd></div>
        <div><dt>Y</dt><dd>{{ fmt(row.y) }}</dd></div>
        <div v-if="row.z != null"><dt>Altitud</dt><dd>{{ fmt(row.z) }}</dd></div>
        <div v-else-if="row.seeds"><dt>Semillas</dt><dd>{{ row.seeds }}</dd></div>
        <div v-else><dt>Zona</dt><dd>{{ row.zone }}</dd></div>
      </dl>
      <p v-if="row.shrine" class="side-p">Está justo debajo del santuario {{ row.shrine }}, en la zona {{ row.zone.toLowerCase() }} de Hyrule.</p>
      <p v-else-if="row.friend" class="side-p">Lleva al kolog hasta su amigo ({{ fmt(row.friend.x) }}, {{ fmt(row.friend.y) }}) para conseguir dos semillas.</p>
      <p v-else-if="row.seeds" class="side-p">Resuelve el puzle del kolog para recoger su semilla.</p>
      <p v-else class="side-p">Zona {{ row.zone.toLowerCase() }}. {{ row.layer === 'cielo' ? 'Está en las islas del cielo. Puedes subir desde una torre o con un aparato Zonai.' : 'Está en la superficie.' }}</p>
    </template>

    <p v-if="guide === 'misiones'" class="side-p">{{ row.body }}</p>

    <template v-if="guide === 'conjuntos'">
      <dl v-if="row.levels.length" class="lv">
        <div v-for="(level, index) in row.raw" :key="index"><dt>Nivel {{ index + 1 }}</dt><dd>{{ level }}</dd></div>
      </dl>
      <p v-else class="side-p">Este conjunto no tiene materiales de mejora registrados.</p>
      <template v-if="row.total.length">
        <p class="side-p">Total para mejorar una pieza al máximo:</p>
        <div class="mats"><span v-for="item in row.total" :key="item.name"><b>{{ item.qty }}×</b> {{ item.name }}</span></div>
      </template>
    </template>

    <div v-if="guide !== 'conjuntos'" class="acts">
      <button type="button" class="btn-z" :aria-pressed="done" @click="$emit('toggle')">
        <GuideIcon name="check" :size="16" /> {{ done ? action.done : action.mark }}
      </button>
      <RouterLink v-if="mapPoint" class="btn-o" :to="mapLink(mapPoint)">
        <GuideIcon name="mapa" :size="16" /> {{ row.shrine ? 'Ver santuario en superficie' : row.area ? 'Ver zona en el mapa' : 'Ver en el mapa' }}
      </RouterLink>
      <a v-if="isPoint && !row.shrine" class="btn-o" :href="terrainLink" target="_blank" rel="noopener noreferrer">
        <GuideIcon name="externo" :size="16" /> Mapa con relieve
      </a>
      <a v-if="row.url" class="btn-o" :href="row.url" target="_blank" rel="noopener noreferrer">
        <GuideIcon name="externo" :size="16" /> Guía paso a paso
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import GuideIcon from "./GuideIcon.vue";
import { fmt, toPct } from "../mapPoints";
import { LAYER_NAMES, mapLink } from "./guideFilters";

const props = defineProps({
  row: { type: Object, required: true },
  guide: { type: String, required: true },
  done: Boolean,
});
defineEmits(["toggle"]);
const isPoint = computed(() => props.row.x !== undefined);
const mapPoint = computed(() => props.row.area || (isPoint.value ? props.row : null));
const mapLabel = computed(() => {
  if (props.row.shrine) return "Profundidades · esquema";
  if (props.row.area) return "Zona aproximada · " + props.row.region;
  return LAYER_NAMES[props.row.layer];
});
const actions = {
  raices: { done: "Activada", mark: "Marcar como activada" },
  semillas: { done: "Recogida", mark: "Marcar como recogida" },
  misiones: { done: "Hecha", mark: "Marcar como hecha" },
};
const action = computed(() => actions[props.guide] || { done: "Hecho", mark: "Marcar como hecho" });
const mapImage = computed(() => "/images/zelda/mapas/" + (
  props.row.shrine ? "profundidades-esquema.jpg" : mapPoint.value?.layer === "cielo" ? "cielo-md.jpg" : "superficie-md.jpg"
));
const subtitle = computed(() => props.row.en || props.row.bonus || props.row.region || (props.row.seeds
  ? "Zona " + props.row.zone.toLowerCase() + " · " + LAYER_NAMES[props.row.layer].toLowerCase() : ""));
function pinPosition({ x, y }) {
  const point = toPct(x, y);
  return { left: point.x + "%", top: point.y + "%" };
}
const terrainLink = computed(() => {
  const { x, y, layer } = props.row;
  const params = new URLSearchParams({
    x: (255.857 + 0.042599 * x).toFixed(2),
    y: (-255.939 + 0.042543 * y).toFixed(2),
    z: "3",
    l: layer === "cielo" ? "sky" : "surface",
  });
  return "https://gamertw.com/en/zelda/totk/map?" + params;
});
</script>
