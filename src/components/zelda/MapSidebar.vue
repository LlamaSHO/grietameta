<template>
  <!-- Panel lateral del mapa de Zelda: buscador, categorías, estado,
       progreso y ficha del punto elegido. Diseño: .side de Zelda.dc.html. -->
  <div class="side">
    <div class="fld">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      <label class="sr-only" for="zh-q">Buscar santuario, torre o cueva</label>
      <input id="zh-q" v-model="query" type="search" placeholder="Busca un santuario (Ukouh, Tajikats…)" autocomplete="off" @keydown.enter.prevent="results[0] && $emit('pick', results[0].key)">
    </div>
    <div v-if="results.length" class="res">
      <button v-for="r in results" :key="r.key" type="button" class="rs" @click="$emit('pick', r.key)">
        {{ r.name }} <small>{{ r.ln }}</small>
      </button>
    </div>
    <p v-else-if="query.trim()" class="nores">Nada con «{{ query.trim() }}».</p>

    <span class="gl">Mostrar en el mapa</span>
    <button
      v-for="c in CATS"
      :key="c"
      type="button"
      class="cat"
      :class="cats[c] ? 'onc' : 'offc'"
      :aria-pressed="cats[c] ? 'true' : 'false'"
      @click="cats = { ...cats, [c]: !cats[c] }"
    >
      <span class="zpin lg" :class="`p-${c}`" aria-hidden="true"></span>
      <span class="nm">{{ CAT[c].plural }}</span>
      <span class="ct">{{ counts[c] }}</span>
      <span class="tg" aria-hidden="true"></span>
    </button>
    <div class="allrow">
      <button type="button" @click="cats = { sh: true, tw: true, cv: true, sd: true }">Mostrar todo</button>
      <button type="button" @click="cats = { sh: false, tw: false, cv: false, sd: false }">Ocultar todo</button>
    </div>

    <span class="gl">Estado</span>
    <div class="stf" role="group" aria-label="Filtrar por estado">
      <button
        v-for="s in STATES"
        :key="s.id"
        type="button"
        :class="{ on: status === s.id }"
        :aria-pressed="status === s.id ? 'true' : 'false'"
        @click="status = s.id"
      >
        {{ s.label }}<small>{{ stateCounts[s.id] }}</small>
      </button>
    </div>

    <ProgressCard :rows="progress" :storage="storage" />

    <div v-if="selection" :key="selection.key" class="selc">
      <div class="t">{{ selection.title }}</div>
      <div class="mt">{{ selection.meta }}</div>
      <div class="coords">
        <span><b>{{ selection.x }}</b>x</span>
        <span><b>{{ selection.y }}</b>y</span>
        <span><b>{{ selection.alt }}</b>altitud</span>
      </div>
      <button type="button" class="btn-done" :class="{ is: selection.done }" :aria-pressed="selection.done ? 'true' : 'false'" @click="$emit('toggle-done')">
        {{ selection.doneText }}
      </button>
    </div>
    <div v-else class="hintc">
      <span class="h-desk">Pasa el ratón por un icono para ver qué es y tócalo para abrir su ficha y marcarlo como hecho. Arrastra para moverte y haz doble clic para acercar.</span>
      <span class="h-touch">Toca un icono para abrir su ficha y marcarlo como hecho. Arrastra para moverte y usa los botones + y − para acercar.</span>
    </div>
  </div>
</template>

<script setup>
import ProgressCard from "./ProgressCard.vue";
import { CAT, CATS } from "./mapPoints";
import "./zelda-pins.css";

const query = defineModel("query", { type: String, default: "" });
const cats = defineModel("cats", { type: Object, required: true });
const status = defineModel("status", { type: String, default: "all" });

defineProps({
  results: { type: Array, default: () => [] }, // [{ key, name, ln }]
  counts: { type: Object, required: true }, // { sh, tw, cv, sd } de la capa visible
  stateCounts: { type: Object, required: true }, // { all, todo, done }
  progress: { type: Array, required: true }, // filas de ProgressCard
  storage: { type: String, default: "navegador" },
  // { key, title, meta, x, y, alt, done, doneText } o null
  selection: { type: Object, default: null },
});
defineEmits(["pick", "toggle-done"]);

const STATES = [
  { id: "all", label: "Todos" },
  { id: "todo", label: "Pendientes" },
  { id: "done", label: "Completados" },
];
</script>

<style scoped>
.side {
  flex: 1 1 300px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  border-right: 1px solid rgba(127, 235, 203, 0.1);
  background: linear-gradient(180deg, #0A1A17, #081412);
}

/* Buscador */
.fld {
  position: relative;
  display: flex;
  align-items: center;
}
.fld svg {
  position: absolute;
  left: 12px;
  color: #8FA8A1;
  pointer-events: none;
}
.fld input {
  width: 100%;
  height: 42px;
  border-radius: 11px;
  border: 1px solid rgba(127, 235, 203, 0.16);
  background: rgba(127, 235, 203, 0.04);
  color: #E6EEEA;
  font: inherit;
  font-size: 14px;
  padding: 0 12px 0 36px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}
.fld input::placeholder {
  color: #7F978F;
}
.fld input:focus {
  border-color: rgba(79, 224, 182, 0.55);
}
.res {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: -8px;
}
.rs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 9px;
  border: 0;
  background: transparent;
  color: #E6EEEA;
  font: inherit;
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;
}
.rs:hover,
.rs:focus-visible {
  background: rgba(127, 235, 203, 0.07);
  outline: none;
}
.rs:focus-visible {
  outline: 2px solid #4FE0B6;
  outline-offset: -2px;
}
.rs small {
  font-size: 11px;
  color: #93AAA3;
  text-align: right;
}
.nores {
  margin: -8px 0 0;
  padding: 0 10px;
  font-size: 13px;
  color: #93AAA3;
}

/* Categorías */
.gl {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #7F978F;
  margin-bottom: -8px;
}
.cat {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(127, 235, 203, 0.1);
  background: rgba(127, 235, 203, 0.03);
  color: #E6EEEA;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, opacity 0.2s;
}
.cat:hover {
  background: rgba(127, 235, 203, 0.07);
}
.cat.offc {
  opacity: 0.5;
}
.cat .nm {
  flex: 1;
}
.cat .ct {
  font-size: 13px;
  color: #A9BDB6;
}
.tg {
  position: relative;
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
  transition: background 0.2s;
}
.tg::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #E6EEEA;
  transition: transform 0.2s;
}
.cat.onc .tg {
  background: #2FBF97;
}
.cat.onc .tg::after {
  transform: translateX(14px);
}
.allrow {
  display: flex;
  gap: 8px;
  margin-top: -6px;
}
.allrow button {
  flex: 1;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(127, 235, 203, 0.14);
  background: transparent;
  color: #A4B9B2;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.allrow button:hover {
  color: #E6EEEA;
  background: rgba(127, 235, 203, 0.06);
}

/* Estado */
.stf {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(5, 12, 11, 0.6);
  border: 1px solid rgba(127, 235, 203, 0.12);
}
.stf button {
  min-height: 36px;
  padding: 4px 2px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #A4B9B2;
  font: 600 12.5px/1 var(--font-body);
  cursor: pointer;
}
.stf button:hover {
  color: #E6EEEA;
}
.stf button.on {
  background: rgba(79, 224, 182, 0.16);
  color: #E6EEEA;
  box-shadow: inset 0 0 0 1px rgba(79, 224, 182, 0.35);
}
.stf button small {
  display: block;
  margin-top: 2px;
  font-size: 10.5px;
  font-weight: 500;
  color: #7F978F;
}

/* Ficha del punto elegido */
.selc {
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(79, 224, 182, 0.12), rgba(79, 224, 182, 0.03));
  border: 1px solid rgba(79, 224, 182, 0.35);
  animation: zh-pop 0.25s ease-out;
}
.selc .t {
  font-family: var(--font-zelda);
  font-size: 19px;
  font-weight: 700;
  overflow-wrap: anywhere;
}
.selc .mt {
  margin-top: 2px;
  font-size: 12.5px;
  color: #A9BDB6;
}
.coords {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  margin-top: 12px;
}
.coords span {
  padding: 8px;
  border-radius: 9px;
  background: rgba(5, 12, 11, 0.6);
  text-align: center;
  font-size: 11px;
  color: #93AAA3;
}
.coords b {
  display: block;
  font-size: 15px;
  color: #E6EEEA;
}
.btn-done {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 42px;
  margin-top: 12px;
  border-radius: 11px;
  border: 1px solid rgba(216, 194, 122, 0.5);
  background: transparent;
  color: #F1E7C8;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-done:hover {
  background: rgba(216, 194, 122, 0.1);
}
.btn-done.is {
  background: linear-gradient(180deg, #E9DCAF, #C9B571);
  color: #1E1906;
  border-color: transparent;
}
.hintc {
  padding: 16px;
  border-radius: 16px;
  border: 1px dashed rgba(127, 235, 203, 0.2);
  font-size: 13.5px;
  color: #A9BDB6;
}

.fld input:focus-visible,
.cat:focus-visible,
.allrow button:focus-visible,
.stf button:focus-visible,
.btn-done:focus-visible {
  outline: 2px solid #4FE0B6;
  outline-offset: 2px;
}

.h-touch {
  display: none;
}

/* En móvil el mapa va encima del panel: la ficha del punto sube al
   principio para verla nada más tocar un icono. */
@media (max-width: 860px) {
  .side {
    max-width: none;
    border-right: 0;
    border-top: 1px solid rgba(127, 235, 203, 0.1);
  }
  .selc {
    order: -1;
  }
}
@media (hover: none) {
  .h-desk {
    display: none;
  }
  .h-touch {
    display: inline;
  }
}
</style>
