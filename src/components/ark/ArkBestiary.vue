<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import ArkCreatureDossier from './ArkCreatureDossier.vue';
import { iconTile } from './bestiarySprites';

const props = defineProps({ catalogue: { type: Object, required: true } });
const perPage = 60;
const defaults = { query: '', game: '', kind: '', group: '', map: '', diet: '', tame: false, ride: false };
const filters = reactive({ ...defaults });
const limit = ref(perPage);
const activeId = ref(null);
const dossier = ref(null);
const games = [['', 'Todos'], ['E', 'Evolved'], ['A', 'Ascended']];
const kinds = [['', 'Todas'], ['species', 'Especies'], ['variant', 'Variantes']];

function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

const entries = computed(() => props.catalogue.criaturas.map((creature, id) => ({
  ...creature, id, search: normalize(creature.n + ' ' + creature.b),
})));
const options = computed(() => [
  { key: 'group', label: 'Grupo', empty: 'Todos', values: [...new Set(entries.value.map(({ gr }) => gr).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')).map(value => [value, value]) },
  { key: 'map', label: 'Mapa', empty: 'Todos', values: props.catalogue.mapas.map((map, index) => [index, map]) },
  { key: 'diet', label: 'Dieta', empty: 'Todas', values: [...new Set(entries.value.map(({ di }) => di).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')).map(value => [value, value]) },
]);
const results = computed(() => {
  const query = normalize(filters.query.trim());
  return entries.value.filter(creature => creature.search.includes(query)
    && (!filters.game || creature.g.includes(filters.game))
    && (!filters.kind || creature.v === (filters.kind === 'variant'))
    && (!filters.group || creature.gr === filters.group)
    && (filters.map === '' || creature.m.includes(filters.map))
    && (!filters.diet || creature.di === filters.diet)
    && (!filters.tame || creature.tm)
    && (!filters.ride || creature.rd));
});
const selected = computed(() => results.value.find(({ id }) => id === activeId.value)
  ?? results.value.find(({ n, v }) => n === 'Rex' && !v)
  ?? results.value[0]);

watch(filters, () => { limit.value = perPage; });

async function select(creature) {
  activeId.value = creature.id;
  if (!window.matchMedia('(max-width: 1100px)').matches) return;
  await nextTick();
  const target = dossier.value?.$el;
  target?.scrollIntoView({ block: 'start' });
  target?.focus({ preventScroll: true });
}
</script>

<template>
  <div class="fx">
    <div class="fx-r">
      <label for="crq">Buscar</label>
      <input id="crq" v-model="filters.query" type="search" placeholder="Rex, Aberrant, Quetzal…">
      <span class="lb">Juego</span>
      <span class="seg" role="group" aria-label="Juego">
        <button v-for="[value, label] in games" :key="value" type="button" :aria-pressed="filters.game === value" @click="filters.game = value">{{ label }}</button>
      </span>
      <span class="seg" role="group" aria-label="Tipo de ficha">
        <button v-for="[value, label] in kinds" :key="value" type="button" :aria-pressed="filters.kind === value" @click="filters.kind = value">{{ label }}</button>
      </span>
    </div>
    <div class="fx-r">
      <template v-for="{ key, label, empty, values } in options" :key="key">
        <label :for="'cr-' + key">{{ label }}</label>
        <select :id="'cr-' + key" v-model="filters[key]">
          <option value="">{{ empty }}</option>
          <option v-for="[value, name] in values" :key="value" :value="value">{{ name }}</option>
        </select>
      </template>
      <button type="button" class="tg" :aria-pressed="filters.tame" @click="filters.tame = !filters.tame">Domables</button>
      <button type="button" class="tg" :aria-pressed="filters.ride" @click="filters.ride = !filters.ride">Se montan</button>
      <button type="button" class="clr" @click="Object.assign(filters, defaults)">Limpiar</button>
    </div>
  </div>
  <p class="cr-cnt" aria-live="polite">
    {{ results.length === entries.length ? entries.length + ' criaturas en el bestiario' : results.length + ' de ' + entries.length + ' criaturas' }}
  </p>
  <p v-if="!results.length" class="cempty">No hay ninguna criatura con esos filtros.</p>
  <div v-else class="cr2">
    <div>
      <div class="cg">
        <button v-for="creature in results.slice(0, limit)" :key="creature.id" type="button" class="ck"
          :aria-pressed="creature.id === selected.id" @click="select(creature)">
          <span v-if="creature.ii >= 0" class="ico" :style="iconTile(creature.ii, catalogue.laminas)" aria-hidden="true"></span>
          <span v-else class="noi" aria-hidden="true">{{ creature.n.slice(0, 2) }}</span>
          <b>{{ creature.n }}</b>
          <small>{{ creature.gr }}{{ creature.di ? ' · ' + creature.di : '' }}</small>
          <span v-if="creature.v" class="vt">Variante</span>
          <span v-if="creature.g === 'A'" class="vt asa">Ascended</span>
        </button>
      </div>
      <button v-if="results.length > limit" type="button" class="more2" @click="limit += perPage">Ver {{ Math.min(perPage, results.length - limit) }} más</button>
    </div>
    <ArkCreatureDossier ref="dossier" class="dt" :creature="selected" :maps="catalogue.mapas" :sheets="catalogue.laminas" />
  </div>
</template>

<style scoped src="./bestiary.css"></style>