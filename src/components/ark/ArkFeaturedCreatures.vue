<script setup>
import { computed, nextTick, ref } from 'vue';
import { featured } from './homeData';

const props = defineProps({ creatures: { type: Array, required: true } });
const currentFilter = ref('all');
const selectedKey = ref(null);
const dossier = ref(null);
const filters = [
  ['all', 'Todas', () => true],
  ['car', 'Carnívoras', (creature) => creature.diet === 'Carnívoro'],
  ['her', 'Herbívoras', (creature) => creature.diet === 'Herbívoro'],
  ['ride', 'Se montan', (creature) => creature.ride],
];
const stats = [['Vida', 1200], ['Energía', 750], ['Peso', 780], ['Ataque', 60]];
const cards = computed(() => {
  const byKey = new Map(props.creatures.map((creature) => [creature.k, creature]));
  const matches = filters.find(([key]) => key === currentFilter.value)[2];
  return featured.flatMap(([key, image, species, values, description]) => {
    const creature = byKey.get(key);
    if (!creature || !matches(creature)) return [];
    return [{ ...creature, image: '/images/ark/dosieres/' + image, species, values, description }];
  });
});
const selected = computed(() => cards.value.find(({ k }) => k === selectedKey.value) ?? cards.value[0]);

async function selectCreature(key) {
  selectedKey.value = key;
  if (!window.matchMedia('(max-width: 1100px)').matches) return;
  await nextTick();
  dossier.value?.scrollIntoView({ block: 'start' });
  dossier.value?.focus({ preventScroll: true });
}
</script>

<template>
  <div class="flt" role="group" aria-label="Filtrar criaturas">
    <button v-for="[key, label] in filters" :key="key" type="button" class="fb" :aria-pressed="currentFilter === key" @click="currentFilter = key; selectedKey = null">
      {{ label }}
    </button>
    <span class="cnt">{{ cards.length }} criaturas</span>
  </div>
  <div v-if="selected" class="cri">
    <div class="cgrid">
      <button v-for="creature in cards" :key="creature.k" type="button" class="cc" :aria-pressed="selected.k === creature.k" @click="selectCreature(creature.k)">
        <img :src="creature.image" alt="" loading="lazy" decoding="async">
        <b>{{ creature.n }}</b><small>{{ creature.diet }} · {{ creature.ride ? 'Montura' : 'Sin silla' }}</small>
      </button>
    </div>
    <aside ref="dossier" class="det" tabindex="-1" aria-label="Dosier de criatura destacada" aria-live="polite">
      <img :src="selected.image" :alt="'Dosier de ' + selected.n" loading="lazy" decoding="async">
      <em v-if="selected.species">{{ selected.species }}</em><h3>{{ selected.n }}</h3><p class="uso">{{ selected.description }}</p>
      <dl class="dl">
        <dt>Dieta</dt><dd>{{ selected.diet }}</dd>
        <dt>Carácter</dt><dd>{{ selected.temp }}</dd>
        <dt>Doma</dt><dd>{{ selected.met }}</dd>
        <dt>Comida</dt><dd>{{ selected.fav.join(', ') }}</dd>
        <dt>Montura</dt><dd>{{ selected.ride ? 'Sí, con silla' : 'No se monta' }}</dd>
        <dt>Mapas</dt><dd>{{ selected.maps.length }} · {{ selected.maps.join(' · ') }}</dd>
      </dl>
      <div class="sts">
        <div v-for="([name, maximum], index) in stats" :key="name" class="sr2">
          <span>{{ name }}</span><i aria-hidden="true"><b :style="{ width: Math.min(100, Math.max(4, selected.values[index] / maximum * 100)) + '%' }"></b></i><span>{{ Math.round(selected.values[index]) }}</span>
        </div>
      </div>
    </aside>
  </div>
</template>
