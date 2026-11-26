<script setup>
import { computed, reactive } from "vue";

const props = defineProps({
  sequences: { type: Array, required: true },
  memories: { type: Array, required: true },
  places: { type: Object, required: true },
  memory: { type: Object, required: true },
  done: { type: Object, required: true },
});
const emit = defineEmits(["select", "toggle", "toggle-sequence", "place", "reset"]);
const reveals = reactive({});
const spoilers = reactive({ all: false, confirmReset: false });

const blocks = [
  ["opt", "Objetivos opcionales", "Desafíos para la sincronización completa"],
  ["steps", "Paso a paso", "La ruta recomendada"],
  ["opp", "Oportunidades", "Formas alternativas de completarla"],
  ["uk", "Asesinato único", "La forma especial de acabar con el objetivo"],
  ["sp", "Qué pasa (spoiler)", "Lo que ocurre en esta memoria"],
];
const sequence = computed(() => props.sequences.find(item => item.id === props.memory.sequence));
const sequenceProgress = item => item.mems.filter(({ id }) => props.done[id]).length;
const allDone = computed(() => sequenceProgress(sequence.value) === sequence.value.mems.length);
const hasProgress = computed(() => props.memories.some(item => props.done[item.id]));
const index = computed(() => props.memories.findIndex(item => item.id === props.memory.id));
const previous = computed(() => props.memories[index.value - 1]);
const next = computed(() => props.memories[index.value + 1]);
const details = computed(() => blocks
  .map(([id, title, hint]) => ({ id, title, hint, entries: itemsFor(props.memory[id]) }))
  .filter(block => block.entries.length));
const displayId = id => id === "p1" ? "P" : id;
const memoryLabel = computed(() => sequence.value.id === "p" ? "Prólogo" : "Secuencia " + sequence.value.num);

function itemsFor(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function revealed(id) {
  return reveals[props.memory.id + ":" + id] ?? (id === "sp" && spoilers.all);
}

function toggleBlock(id) {
  reveals[props.memory.id + ":" + id] = !revealed(id);
}

function toggleSpoilers() {
  spoilers.all = !spoilers.all;
  for (const key of Object.keys(reveals)) {
    if (key.endsWith(":sp")) delete reveals[key];
  }
}

function reset() {
  spoilers.confirmReset = false;
  emit("reset");
}
</script>

<template>
  <div class="ac-heading story-heading">
    <div>
      <h2>La revolución de Arno</h2>
      <p>Cada secuencia se abre como una serie de diapositivas. De cada memoria ves el objetivo; los objetivos opcionales, el paso a paso, las oportunidades y el asesinato único quedan ocultos hasta que los pidas.</p>
    </div>
    <div class="story-controls">
      <button type="button" class="ac-button" :aria-pressed="spoilers.all" @click="toggleSpoilers">{{ spoilers.all ? "Ocultar spoilers" : "Mostrar spoilers" }}</button>
      <button v-if="hasProgress" type="button" class="ac-button" @click="spoilers.confirmReset = !spoilers.confirmReset">Reiniciar progreso</button>
    </div>
  </div>
  <div v-if="spoilers.confirmReset" class="reset-progress" role="group" aria-label="Confirmar reinicio">
    <span>¿Borrar el progreso de todas las memorias?</span>
    <button class="ac-button primary" type="button" @click="reset">Borrar progreso</button>
    <button class="ac-button" type="button" @click="spoilers.confirmReset = false">Cancelar</button>
  </div>

  <div class="timeline" role="group" aria-label="Secuencias de la historia">
    <button v-for="item in sequences" :key="item.id" type="button" :aria-pressed="item.id === sequence.id" @click="emit('select', item.mems[0].id)">
      <b>{{ item.num }}</b><span>{{ item.t }}</span>
      <span class="progress-track" aria-hidden="true"><i :style="{ transform: `scaleX(${sequenceProgress(item) / item.mems.length})` }"></i></span>
    </button>
  </div>

  <div class="deck">
    <aside class="deck-side">
      <span class="sequence-number" aria-hidden="true">{{ sequence.num }}</span>
      <small>{{ memoryLabel }} · {{ sequence.yr }}</small>
      <h3>{{ sequence.t }}</h3>
      <p>{{ sequenceProgress(sequence) }} / {{ sequence.mems.length }} memorias completadas</p>
      <div class="progress-track" aria-hidden="true"><i :style="{ transform: `scaleX(${sequenceProgress(sequence) / sequence.mems.length})` }"></i></div>
      <ol>
        <li v-for="item in sequence.mems" :key="item.id">
          <button class="memory-select" type="button" :aria-pressed="item.id === memory.id" @click="emit('select', item.id)">
            <span>{{ displayId(item.id) }}</span>{{ item.t }}<b v-if="done[item.id]" class="tick" aria-label="Completada">✓</b>
          </button>
        </li>
      </ol>
      <button class="ac-button sequence-all" type="button" :aria-pressed="allDone" @click="emit('toggle-sequence', sequence)">
        {{ allDone ? "Desmarcar secuencia" : "Completar secuencia" }}
      </button>
    </aside>

    <div class="slide-content">
      <article :key="memory.id" class="slide">
        <div class="meta"><b>Memoria {{ displayId(memory.id) }}</b><span>{{ memory.en }}</span><span class="nth">{{ memory.position + 1 }} / {{ sequence.mems.length }}</span></div>
        <h3>{{ memory.t }}</h3>
        <div class="slide-tags">
          <RouterLink v-if="memory.pl" to="#mapa" @click="emit('place', memory)">{{ places[memory.pl]?.n }} · ver en el mapa</RouterLink>
          <span v-if="memory.rift">Fallo del Helix</span>
        </div>
        <p class="objective">{{ memory.obj }}</p>
        <div class="details">
          <div v-for="block in details" :key="block.id" :class="{ revealed: revealed(block.id) }">
            <button type="button" :aria-expanded="revealed(block.id)" :aria-controls="'ac-memory-' + block.id" @click="toggleBlock(block.id)">
              <span><b>{{ block.title }}</b><small>{{ block.hint }}</small></span>
              <span class="visibility-label">{{ revealed(block.id) ? "Ocultar" : "Revelar" }}</span>
            </button>
            <div :id="'ac-memory-' + block.id" v-if="revealed(block.id)" class="revealed-content">
              <component :is="block.id === 'steps' ? 'ol' : 'ul'">
                <li v-for="entry in block.entries" :key="entry">{{ entry }}</li>
              </component>
            </div>
          </div>
          <p v-if="!details.length">Memoria de historia: no tiene objetivos opcionales ni pasos que revelar.</p>
        </div>
        <div class="slide-footer">
          <span v-if="memory.unlock"><b>Desbloquea</b> {{ memory.unlock }}</span>
          <button class="ac-button primary" type="button" :aria-pressed="!!done[memory.id]" @click="emit('toggle', memory.id)">
            {{ done[memory.id] ? "Completada" : "Marcar como completada" }}
          </button>
        </div>
      </article>
      <nav class="deck-nav" aria-label="Cambiar memoria">
        <button type="button" :disabled="!previous" @click="emit('select', previous.id)"><small>Anterior</small>{{ previous?.t ?? "Inicio de la historia" }}</button>
        <button type="button" :disabled="!next" @click="emit('select', next.id)"><small>Siguiente</small>{{ next?.t ?? "Fin de la historia" }}</button>
      </nav>
    </div>
  </div>
  <p class="sources">Títulos traducidos por GrietaMeta (junto a cada uno, el nombre original en inglés). Detalles de cada memoria contrastados con la guía de Gamer Guides.</p>
</template>

<style scoped src="./ac-page.css"></style>
<style scoped>
.story-heading { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 12px; }
.story-controls,.reset-progress { display: flex; flex-wrap: wrap; gap: 7px; }
.story-controls button[aria-pressed=true] { border-color: #f295a5; color: #ffb5c2; }
.reset-progress { align-items: center; margin-bottom: 10px; }
.timeline { display: flex; gap: 6px; padding: 4px 4px 10px; margin: 0 -4px 10px; overflow-x: auto; scrollbar-color: #355266 #0c131b; }
.timeline button { flex: 1 0 86px; display: grid; grid-template-rows: auto 1fr auto; gap: 4px; align-items: start; text-align: left; padding: 8px; border: 1px solid var(--ac-line); border-radius: 5px; color: #d8e5ed; background: #121c27; font: inherit; cursor: pointer; }
.timeline button[aria-pressed=true] { background: #371a2b; border-color: #d55b71; }
.timeline button b { color: #f5b7c4; font: 700 1.5rem/1 var(--ac-display); }
.timeline button span { font-size: .75rem; line-height: 1.2; }
.progress-track { display: block; height: 4px; background: #334251; border-radius: 4px; overflow: hidden; }
.progress-track i { display: block; height: 100%; background: #88d9a8; transform-origin: left; }
.deck { display: grid; grid-template-columns: minmax(195px,290px) minmax(0,1fr); border: 1px solid var(--ac-line); border-radius: 8px; background: #101821; }
.deck-side { position: relative; isolation: isolate; display: flex; flex-direction: column; gap: 9px; min-width: 0; padding: clamp(15px,3vw,25px); overflow: hidden; border-right: 1px solid #402936; background: #241723; }
.deck-side .sequence-number { position: absolute; z-index: -1; right: 5px; top: 0; color: #9b5b682e; font: 700 10rem/.85 var(--ac-display); }
.deck-side small { color: #f6a9b7; text-transform: uppercase; font-weight: 700; letter-spacing: .09em; }
.deck-side h3 { margin: 0; font: 700 1.8rem/.98 var(--ac-display); }
.deck-side p { margin: 3px 0 0; color: #d8c2cc; font-size: .8rem; }
.deck-side ol { display: grid; gap: 5px; padding: 0; margin: 4px 0; list-style: none; }
.memory-select { display: flex; align-items: center; gap: 7px; width: 100%; min-height: 44px; padding: 6px; border: 1px solid #523748; border-radius: 4px; background: #302232; color: #f3e5eb; font: inherit; font-size: .83rem; text-align: left; cursor: pointer; }
.memory-select[aria-pressed=true] { background: #542a3f; border-color: #c87a91; }
.memory-select span { padding: 3px 5px; border-radius: 3px; background: #662b43; font-size: .76rem; white-space: nowrap; }
.tick { color: #b2edc9; margin-left: auto; }
.sequence-all { align-self: start; }
.slide-content { display: grid; min-width: 0; grid-template-rows: 1fr auto; }
.slide { min-width: 0; padding: clamp(15px,3.2vw,34px); }
.meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; color: #bac9d4; font-size: .82rem; }
.meta b { color: #f4a6b8; text-transform: uppercase; letter-spacing: .09em; }
.meta .nth { margin-left: auto; white-space: nowrap; }
.slide h3 { margin: 8px 0 0; font: 700 clamp(1.9rem,4vw,3.25rem)/1.03 var(--ac-display); }
.slide-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 5px; font-size: .84rem; }
.slide-tags a, .slide-tags span { padding: 4px 7px; border-radius: 4px; color: #aadcf4; background: #1c3244; }
.objective { color: #d2dce4; font-size: 1rem; }
.details { display: grid; gap: 7px; }
.details > div { border: 1px solid #364454; border-radius: 5px; overflow: hidden; background: #161f29; }
.details > .revealed { border-color: #657f90; }
.details button { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-height: 55px; padding: 8px 10px; border: 0; background: transparent; color: #e6f1f7; text-align: left; font: inherit; cursor: pointer; }
.details button:focus-visible { outline-offset: -3px; }
.details button:hover { background: #233240; }
.details small { display: block; color: #b1c1cb; }
.visibility-label { color: #b0d6e9; font-size: .79rem; }
.revealed-content { padding: 9px 13px; border-top: 1px solid #344859; color: #d8e6ef; }
.revealed-content :is(ol,ul) { margin: 0; padding-left: 18px; }
.revealed-content li + li { margin-top: 5px; }
.slide-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: end; gap: 9px; margin-top: 18px; }
.slide-footer > span { margin-right: auto; color: #b2d8ed; font-size: .83rem; }
.slide-footer button[aria-pressed=true] { background: #256144; border-color: #6ba17f; }
.deck-nav { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); border-top: 1px solid #344250; }
.deck-nav button { min-width: 0; min-height: 56px; padding: 7px clamp(9px,2vw,22px); color: #e7f0f6; background: #121d28; border: 0; font: inherit; font-size: .84rem; text-align: left; cursor: pointer; }
.deck-nav button + button { border-left: 1px solid #344250; text-align: right; }
.deck-nav button:hover:not(:disabled) { background: #253547; }
.deck-nav button:disabled { color: #a0a9b2; cursor: default; }
.deck-nav small { display: block; color: #b8cad7; }
.sources { margin: 10px 0 0; color: #adbbc6; font-size: .78rem; }
@media (max-width: 720px) { .deck { grid-template-columns: minmax(0,1fr); } .deck-side { border-right: 0; border-bottom: 1px solid #402936; } }
</style>
