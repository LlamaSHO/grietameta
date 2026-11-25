<script setup>
import { computed } from 'vue';
import { dossierTile, iconTile } from './bestiarySprites';

const props = defineProps({
  creature: { type: Object, required: true },
  maps: { type: Array, required: true },
  sheets: { type: Object, required: true },
});
const habitats = { T: 'tierra', A: 'aire', W: 'agua' };
const appearances = computed(() => [...new Set(props.creature.m.map(index => props.maps[index]).filter(Boolean))]);
const wiki = computed(() => 'https://ark.wiki.gg/wiki/' + encodeURIComponent(props.creature.p.replaceAll(' ', '_')));
</script>

<template>
  <aside tabindex="-1" aria-label="Ficha de criatura" aria-live="polite">
    <div class="dimg">
      <span v-if="creature.di2" class="dos" role="img" :aria-label="'Dosier de ' + creature.n" :style="dossierTile(creature.di2, sheets)"></span>
      <span v-else-if="creature.ii >= 0" class="ico big" :style="iconTile(creature.ii, sheets)" aria-hidden="true"></span>
      <span v-else class="fallback" aria-hidden="true">{{ creature.n.slice(0, 2) }}</span>
    </div>
    <em>{{ creature.v ? 'Variante de ' + creature.b : 'Especie' }}</em>
    <h2>{{ creature.n }}</h2>
    <p v-if="creature.us" class="uso">{{ creature.us }}</p>
    <div class="tags">
      <span v-for="[label, enabled] in [['Domable', creature.tm], ['Montura', creature.rd], ['Se cría', creature.br]]" :key="label" :class="enabled ? 'ok' : 'no'" :aria-label="label + (enabled ? ': sí' : ': no')">{{ label }}</span>
    </div>
    <dl class="dl">
      <dt>Grupo</dt><dd>{{ creature.gr }}</dd>
      <dt>Dieta</dt><dd>{{ creature.di || '—' }}</dd>
      <dt>Carácter</dt><dd>{{ creature.ca || '—' }}</dd>
      <dt>Hábitat</dt><dd>{{ [...creature.h].map(code => habitats[code]).filter(Boolean).join(', ') || '—' }}</dd>
      <dt>Silla</dt><dd>{{ creature.sl ? 'Nivel ' + creature.sl : '—' }}</dd>
      <template v-if="creature.me"><dt>Doma</dt><dd>{{ creature.me }}</dd></template>
      <template v-if="creature.fv"><dt>Comida</dt><dd>{{ creature.fv }}</dd></template>
      <dt>Juego</dt><dd>{{ creature.g === 'EA' ? 'Evolved y Ascended' : creature.g === 'A' ? 'Ascended' : 'Evolved' }}</dd>
    </dl>
    <h3>Dónde aparece</h3>
    <div class="mps2"><span v-for="map in appearances" :key="map">{{ map }}</span><span v-if="!appearances.length">Sin datos de mapa</span></div>
    <a class="wk" :href="wiki" target="_blank" rel="noopener">Ficha completa en la wiki ↗</a>
    <p class="src">Datos y dosieres: ARK Official Community Wiki.</p>
  </aside>
</template>

<style scoped src="./creatureDossier.css"></style>