<script setup>
import { computed, nextTick, ref } from 'vue';

const props = defineProps({
  entries: { type: Array, required: true },
  categories: { type: Array, required: true },
  kind: { type: String, required: true },
});
const query = ref('');
const category = ref('');
const level = ref('');
const selectedId = ref(null);
const detail = ref(null);
const levels = [['1', 'Nivel 1–10'], ['11', 'Nivel 11–30'], ['31', 'Nivel 31–60'], ['61', 'Nivel 61–100+']];
const normalize = (value) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const index = computed(() => props.entries.map(entry => ({
  entry,
  search: normalize([
    entry.nombre, entry.nombreIngles, entry.categoria, entry.desbloquea, entry.valoracion,
    entry.tipo, entry.uso, entry.obtencion, entry.mejor, entry.mapas,
    ...(entry.coste?.map(({ nombre }) => nombre) ?? []),
  ].filter(Boolean).join(' ')),
})));
const results = computed(() => {
  const term = normalize(query.value.trim());
  const min = Number(level.value);
  const max = { 1: 10, 11: 30, 31: 60, 61: Infinity }[min];
  return index.value.filter(({ entry, search }) => search.includes(term)
    && (!category.value || (entry.categoria ?? entry.tipo) === category.value)
    && (!min || (entry.nivel >= min && entry.nivel <= max))).map(({ entry }) => entry);
});
const selected = computed(() => results.value.find(({ id }) => id === selectedId.value) ?? results.value[0]);

function reset() {
  query.value = '';
  category.value = '';
  level.value = '';
  selectedId.value = null;
}

async function select(entry) {
  selectedId.value = entry.id;
  if (!window.matchMedia('(max-width: 900px)').matches) return;
  await nextTick();
  detail.value?.scrollIntoView({ block: 'start' });
  detail.value?.focus({ preventScroll: true });
}
</script>

<template>
  <div class="layout">
    <section :aria-label="'Catálogo de ' + kind">
      <div class="toolbar">
        <div class="toolbar-top">
          <label class="sr" for="ark-catalogue-search">Buscar {{ kind }}</label>
          <input id="ark-catalogue-search" v-model="query" class="query" type="search" placeholder="Busca por nombre, uso o ingrediente…">
          <template v-if="kind === 'engramas'">
            <label class="sr" for="ark-catalogue-level">Filtrar por nivel</label>
            <select id="ark-catalogue-level" v-model="level" class="select">
              <option value="">Todos los niveles</option>
              <option v-for="[value, label] in levels" :key="value" :value="value">{{ label }}</option>
            </select>
          </template>
        </div>
        <div class="filters" role="group" aria-label="Filtrar por categoría">
          <button type="button" class="filter" :aria-pressed="!category" @click="category = ''">Todas</button>
          <button v-for="item in categories" :key="item" type="button" class="filter" :aria-pressed="category === item" @click="category = item">{{ item }}</button>
        </div>
      </div>
      <div class="count">
        <span aria-live="polite"><b>{{ results.length }}</b> {{ kind }}</span>
        <button class="more" type="button" @click="reset">Limpiar filtros</button>
      </div>
      <div v-if="results.length" class="rows">
        <button v-for="entry in results" :key="entry.id" type="button" class="row" :aria-pressed="selected?.id === entry.id" @click="select(entry)">
          <slot name="row" :entry="entry" />
        </button>
      </div>
      <div v-else class="empty" role="status"><b>No hay resultados</b><p>Prueba otra palabra{{ kind === 'engramas' ? ', nivel o categoría.' : ' o categoría.' }}</p></div>
    </section>
    <aside v-if="selected" ref="detail" class="panel" tabindex="-1" aria-label="Ficha del catálogo" aria-live="polite">
      <slot name="detail" :entry="selected" />
    </aside>
  </div>
</template>