<template>
  <!-- Guía de santuarios: tabla ordenable + filtros por capa, zona (rosa de los vientos) y estado. -->
  <div class="sh">
    <GuideToolbar :count="rows.length" :count-label="rows.length === 1 ? 'santuario' : 'santuarios'" :can-reset="filtered" @reset="reset">
      <template #search>
        <GuideSearch v-model="q" placeholder="Santuario o zona (p. ej. «noroeste»)" label="Buscar santuarios" />
      </template>
      <GuideSeg v-model="layer" :options="layerOpts" label="Capa del mapa" />
      <GuideSeg v-if="progress.available" v-model="estado" :options="estadoOpts" label="Estado" />
    </GuideToolbar>

    <div class="sh-lay">
      <aside class="sh-side">
        <div class="sh-box">
          <h2 class="sh-bt">Zona</h2>
          <p class="sh-bd">Toca una zona para filtrar. Es aproximada y se calcula con x e y.</p>
          <div class="sh-rose" role="group" aria-label="Filtrar por zona">
            <button
              v-for="z in ROSE"
              :key="z"
              type="button"
              class="sh-z"
              :class="{ on: zone === z, c: z === 'Centro', off: !zoneCount[z] }"
              :aria-pressed="zone === z"
              @click="zone = zone === z ? 'todas' : z"
            >
              <span>{{ ROSE_LABEL[z] }}</span>
              <b>{{ zoneCount[z] || 0 }}</b>
            </button>
          </div>
          <button type="button" class="sh-all" :class="{ on: zone === 'todas' }" @click="zone = 'todas'">
            Todas las zonas
          </button>
        </div>

        <div class="sh-box sh-leg">
          <span><i class="dot surf" /> Superficie</span>
          <span><i class="dot sky" /> Cielo (x e y no incluyen la altura)</span>
          <span v-if="progress.available"><i class="dot done" /> Completado</span>
        </div>
      </aside>

      <div class="sh-main">
        <GuideNote v-if="!rows.length" empty>
          No hay resultados para esa búsqueda. Prueba con otra palabra o quita algún filtro.
        </GuideNote>

        <table v-else class="sh-t">
          <caption class="sr-only">Santuarios de Tears of the Kingdom con sus coordenadas</caption>
          <thead>
            <tr>
              <th v-for="c in COLS" :key="c.key" scope="col" :class="c.cls" :aria-sort="sortKey === c.key ? (sortDir > 0 ? 'ascending' : 'descending') : undefined">
                <button v-if="c.sort" type="button" class="sh-sort" :class="{ on: sortKey === c.key }" @click="sortBy(c.key)">
                  {{ c.label }}
                  <span class="sh-arrow" aria-hidden="true">{{ sortKey === c.key ? (sortDir > 0 ? "▲" : "▼") : "↕" }}</span>
                </button>
                <span v-else :class="{ 'sr-only': c.hidden }">{{ c.label }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.id" :class="{ done: progress.isDone(r.id) }">
              <td class="c-n">{{ r.n }}</td>
              <th scope="row" class="c-name">
                <div class="sh-cell">
                  <span class="sh-ic" :class="r.layer === 'cielo' ? 'sky' : 'surf'" aria-hidden="true" />
                  <span class="sh-nm">
                    <b>{{ r.name }}</b>
                    <small>{{ r.en }}<span class="sh-lt"> · {{ LAYER_LABEL[r.layer] }} · {{ r.zone }}</span></small>
                  </span>
                  <span v-if="progress.isDone(r.id)" class="sh-done"><GuideIcon name="check" :size="13" /> Hecho</span>
                </div>
              </th>
              <td class="c-layer"><span class="sh-chip" :class="r.layer === 'cielo' ? 'sky' : 'surf'">{{ LAYER_LABEL[r.layer] }}</span></td>
              <td class="c-zone">{{ r.zone }}</td>
              <td class="c-num" data-l="x">{{ r.x }}</td>
              <td class="c-num" data-l="y">{{ r.y }}</td>
              <td class="c-num" data-l="Altitud">{{ r.z }}</td>
              <td class="c-act">
                <RouterLink class="sh-btn" :to="mapLink(r)" :aria-label="`Ver ${r.name} en el mapa`">
                  <GuideIcon name="pin" :size="15" /> <span class="sh-mt">Ver en el mapa</span>
                </RouterLink>
                <a class="sh-btn ghost" :href="terrainUrl(r)" target="_blank" rel="noopener noreferrer" :aria-label="`${r.name} en un mapa externo con terreno`" title="Mapa con terreno (externo)">
                  <GuideIcon name="externo" :size="15" /> <span class="sh-ext">Terreno</span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <GuideNote>
      Coordenadas del mapa del juego (x: oeste a este, y: sur a norte). Según la guía pueden variar unos pocos puntos,
      sobre todo la altitud. La zona es una referencia aproximada calculada a partir de x e y. En el cielo, la altura de
      cada isla es su altitud. «Ver en el mapa» abre nuestro mapa interactivo en ese punto; «Terreno» abre un mapa
      externo con relieve centrado en él.
    </GuideNote>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import GuideToolbar from "./GuideToolbar.vue";
import GuideSearch from "./GuideSearch.vue";
import GuideSeg from "./GuideSeg.vue";
import GuideNote from "./GuideNote.vue";
import GuideIcon from "./GuideIcon.vue";
import { SHRINES, ZONES, matches, mapLink, terrainUrl } from "./guides.js";
import { useGuideProgress } from "./useGuideProgress.js";

const progress = useGuideProgress();

const LAYER_LABEL = { superficie: "Superficie", cielo: "Cielo" };
// Rosa de los vientos (3 × 3), de arriba a la izquierda a abajo a la derecha.
const ROSE = ["Noroeste", "Norte", "Noreste", "Oeste", "Centro", "Este", "Suroeste", "Sur", "Sureste"];
const ROSE_LABEL = { Noroeste: "NO", Norte: "N", Noreste: "NE", Oeste: "O", Centro: "Centro", Este: "E", Suroeste: "SO", Sur: "S", Sureste: "SE" };

const COLS = [
  { key: "n", label: "#", sort: true, cls: "c-n" },
  { key: "name", label: "Santuario", sort: true, cls: "c-name" },
  { key: "layer", label: "Capa", sort: true, cls: "c-layer" },
  { key: "zone", label: "Zona", sort: true, cls: "c-zone" },
  { key: "x", label: "x", sort: true, cls: "c-num" },
  { key: "y", label: "y", sort: true, cls: "c-num" },
  { key: "z", label: "Altitud", sort: true, cls: "c-num" },
  { key: "act", label: "Acciones", sort: false, cls: "c-act", hidden: true },
];

const q = ref("");
const layer = ref("todas");
const zone = ref("todas");
const estado = ref("todos");
const sortKey = ref("n");
const sortDir = ref(1);

const inLayer = (r) => layer.value === "todas" || r.layer === layer.value;
const inEstado = (r) => estado.value === "todos" || (estado.value === "hechos") === progress.isDone(r.id);
const inQuery = (r) => matches(q.value, r.name, r.en, LAYER_LABEL[r.layer], r.zone);

// Filtrado sin la zona (para contar cuántos hay en cada una).
const base = computed(() => SHRINES.filter((r) => inLayer(r) && inEstado(r) && inQuery(r)));
const zoneCount = computed(() => Object.fromEntries(ZONES.map((z) => [z, base.value.filter((r) => r.zone === z).length])));

const rows = computed(() => {
  const list = base.value.filter((r) => zone.value === "todas" || r.zone === zone.value);
  const k = sortKey.value;
  const d = sortDir.value;
  return [...list].sort((a, b) => {
    const va = k === "zone" ? ZONES.indexOf(a.zone) : a[k];
    const vb = k === "zone" ? ZONES.indexOf(b.zone) : b[k];
    if (typeof va === "string") return va.localeCompare(vb, "es") * d || a.n - b.n;
    return (va - vb) * d || a.n - b.n;
  });
});

const layerOpts = computed(() => {
  const f = SHRINES.filter((r) => inEstado(r) && inQuery(r));
  return [
    { value: "todas", label: "Todas", count: f.length },
    { value: "superficie", label: "Superficie", count: f.filter((r) => r.layer === "superficie").length, dot: "#4FE0B6" },
    { value: "cielo", label: "Cielo", count: f.filter((r) => r.layer === "cielo").length, dot: "#E9CF7E" },
  ];
});
const estadoOpts = computed(() => {
  const f = SHRINES.filter((r) => inLayer(r) && inQuery(r));
  const hechos = f.filter((r) => progress.isDone(r.id)).length;
  return [
    { value: "todos", label: "Todos", count: f.length },
    { value: "pendientes", label: "Pendientes", count: f.length - hechos },
    { value: "hechos", label: "Hechos", count: hechos },
  ];
});

const filtered = computed(() => !!q.value.trim() || layer.value !== "todas" || zone.value !== "todas" || estado.value !== "todos");
function reset() {
  q.value = "";
  layer.value = "todas";
  zone.value = "todas";
  estado.value = "todos";
}
function sortBy(k) {
  if (sortKey.value === k) sortDir.value = -sortDir.value;
  else {
    sortKey.value = k;
    sortDir.value = k === "z" ? -1 : 1; // la altitud, de más alto a más bajo
  }
}
</script>

<style scoped>
.sh-lay {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}
.sh-side {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sh-box {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #0a1a17, #081412);
  border: 1px solid rgba(127, 235, 203, 0.12);
}
.sh-bt {
  margin: 0;
  font-family: var(--font-zelda);
  font-size: 17px;
  font-weight: 700;
}
.sh-bd {
  margin: 4px 0 12px;
  font-size: 12.5px;
  color: #93aaa3;
}
.sh-rose {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}
.sh-rose::before {
  content: "";
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  border: 1px dashed rgba(127, 235, 203, 0.18);
  pointer-events: none;
}
.sh-z {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 1px solid rgba(127, 235, 203, 0.12);
  background: rgba(127, 235, 203, 0.03);
  color: #a4b9b2;
  font: inherit;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.sh-z span {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.sh-z.c span {
  letter-spacing: 0;
  font-size: 11.5px;
}
.sh-z b {
  font-family: var(--font-zelda);
  font-size: 18px;
  color: #f1e7c8;
}
.sh-z:hover {
  background: rgba(127, 235, 203, 0.08);
  color: #e6eeea;
}
.sh-z.on {
  background: rgba(79, 224, 182, 0.16);
  border-color: rgba(79, 224, 182, 0.55);
  color: #7febcb;
  box-shadow: 0 0 22px -8px rgba(79, 224, 182, 0.8);
}
.sh-z.off {
  opacity: 0.4;
}
.sh-z:focus-visible,
.sh-all:focus-visible,
.sh-sort:focus-visible,
.sh-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.sh-all {
  width: 100%;
  height: 36px;
  margin-top: 10px;
  border-radius: 10px;
  border: 1px solid rgba(127, 235, 203, 0.14);
  background: transparent;
  color: #a4b9b2;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.sh-all:hover {
  color: #e6eeea;
  background: rgba(127, 235, 203, 0.06);
}
.sh-all.on {
  color: #7febcb;
  border-color: rgba(79, 224, 182, 0.4);
}
.sh-leg {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12.5px;
  color: #c3d3cd;
}
.sh-leg span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot.surf {
  background: #4fe0b6;
}
.dot.sky {
  background: #e9cf7e;
}
.dot.done {
  background: #f1e7c8;
}

/* ---------- tabla ---------- */
.sh-main {
  min-width: 0;
}
.sh-t {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(127, 235, 203, 0.12);
  background: #081412;
  font-size: 14px;
}
.sh-t thead th {
  padding: 0 12px;
  height: 44px;
  background: #0b1c19;
  border-bottom: 1px solid rgba(127, 235, 203, 0.14);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7f978f;
  text-align: left;
  white-space: nowrap;
}
.sh-sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
}
.sh-sort:hover,
.sh-sort.on {
  color: #7febcb;
}
.sh-arrow {
  font-size: 9px;
  opacity: 0.8;
}
.sh-t tbody tr {
  transition: background 0.15s;
}
.sh-t tbody tr:nth-child(even) {
  background: rgba(127, 235, 203, 0.018);
}
.sh-t tbody tr:hover {
  background: rgba(127, 235, 203, 0.06);
}
.sh-t td,
.sh-t tbody th {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(127, 235, 203, 0.06);
  vertical-align: middle;
  text-align: left;
  font-weight: 400;
}
.sh-t tbody tr:last-child > * {
  border-bottom: 0;
}
.c-n {
  width: 52px;
  color: #7f978f;
  font-size: 12.5px;
}
.c-name {
  min-width: 190px;
}
.sh-cell {
  display: flex;
  align-items: center;
  gap: 11px;
}
.sh-ic {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #04130f;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.sh-ic::after {
  content: "";
  width: 62%;
  height: 62%;
  background: #04211a;
  -webkit-mask: url(/images/zelda/iconos/santuario.svg) center/contain no-repeat;
  mask: url(/images/zelda/iconos/santuario.svg) center/contain no-repeat;
}
.sh-ic.surf {
  background: #4fe0b6;
}
.sh-ic.sky {
  background: #e9cf7e;
}
tr.done .sh-ic {
  background: #f1e7c8;
}
tr.done .sh-ic::after {
  -webkit-mask-image: url(/images/zelda/iconos/hecho.svg);
  mask-image: url(/images/zelda/iconos/hecho.svg);
}
.sh-nm {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.sh-nm b {
  font-family: var(--font-zelda);
  font-size: 15.5px;
  font-weight: 700;
  color: #e6eeea;
}
.sh-nm small {
  font-size: 11.5px;
  color: #7f978f;
  white-space: nowrap;
}
.sh-lt {
  display: none;
}
.sh-done {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(241, 231, 200, 0.12);
  color: #f1e7c8;
  font-size: 11px;
  font-weight: 700;
}
.sh-chip {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}
.sh-chip.surf {
  background: rgba(79, 224, 182, 0.1);
  color: #7febcb;
}
.sh-chip.sky {
  background: rgba(233, 207, 126, 0.12);
  color: #e9cf7e;
}
.c-zone {
  color: #c3d3cd;
  white-space: nowrap;
}
.c-num {
  width: 74px;
  text-align: right !important;
  font-variant-numeric: tabular-nums;
  color: #e6eeea;
}
.sh-t thead .c-num {
  text-align: right;
}
.c-act {
  width: 1%;
  white-space: nowrap;
  text-align: right !important;
}
.sh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border-radius: 9px;
  background: rgba(79, 224, 182, 0.12);
  border: 1px solid rgba(79, 224, 182, 0.3);
  color: #7febcb;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.sh-btn + .sh-btn {
  margin-left: 6px;
}
.sh-btn:hover {
  color: #a8f5de;
  background: rgba(79, 224, 182, 0.22);
}
.sh-btn.ghost {
  background: transparent;
  border-color: rgba(127, 235, 203, 0.14);
  color: #a4b9b2;
}
.sh-btn.ghost:hover {
  color: #e6eeea;
  background: rgba(127, 235, 203, 0.06);
}

/* La tabla completa necesita unos 860 px: por debajo de 1200 px de ventana
   la capa y la zona pasan bajo el nombre (y esa línea puede partirse), y por
   debajo de 1100 px el panel de zonas sube encima de la tabla. Así no hay
   scroll horizontal a ningún ancho. */
@media (max-width: 1200px) {
  .c-zone,
  .sh-t .c-layer {
    display: none;
  }
  .sh-lt {
    display: inline;
  }
  .sh-nm small {
    white-space: normal;
  }
}
@media (max-width: 1100px) {
  .sh-ext {
    display: none;
  }
  .sh-lay {
    grid-template-columns: 1fr;
  }
  .sh-side {
    display: grid;
    grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
    align-items: start;
  }
}
/* Entre 641 y 860 px los botones de la fila quedan solo con su icono
   (llevan aria-label); en tarjetas (≤ 640 px) vuelve el texto. */
@media (max-width: 860px) {
  .sh-mt {
    display: none;
  }
  .sh-btn {
    width: 34px;
    padding: 0;
    justify-content: center;
  }
}
@media (max-width: 640px) {
  .sh-side {
    grid-template-columns: 1fr;
  }
  .sh-rose {
    grid-template-columns: repeat(9, minmax(0, 1fr));
    gap: 4px;
  }
  .sh-rose::before {
    display: none;
  }
  .sh-z {
    aspect-ratio: auto;
    padding: 7px 0;
    border-radius: 9px;
  }
  .sh-z.c span {
    font-size: 0;
  }
  .sh-z.c span::before {
    content: "C";
    font-size: 12px;
  }
  .sh-z b {
    font-size: 14px;
  }
  .sh-leg {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px 14px;
  }

  /* La tabla pasa a tarjetas: nombre arriba, coordenadas en 3 casillas y botones. */
  .sh-t,
  .sh-t tbody {
    display: block;
    border: 0;
    background: transparent;
    border-radius: 0;
    overflow: visible;
  }
  .sh-t thead {
    display: none;
  }
  .sh-t tbody tr {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 16px;
    border: 1px solid rgba(127, 235, 203, 0.12);
    background: linear-gradient(180deg, #0b1c19, #081412) !important;
  }
  .sh-t td,
  .sh-t tbody th {
    padding: 0;
    border: 0;
  }
  .sh-t .c-n {
    display: none;
  }
  .sh-t tbody .c-name {
    grid-column: 1 / -1;
    margin-bottom: 4px;
  }
  .sh-t .c-num {
    width: auto;
    padding: 7px 4px;
    border-radius: 9px;
    background: rgba(5, 12, 11, 0.6);
    text-align: center !important;
    font-size: 15px;
    font-weight: 600;
  }
  .sh-t .c-num::before {
    content: attr(data-l);
    display: block;
    font-size: 10.5px;
    font-weight: 500;
    color: #93aaa3;
  }
  .sh-t .c-act {
    grid-column: 1 / -1;
    display: flex;
    gap: 6px;
    width: auto;
    margin-top: 4px;
  }
  .sh-btn {
    flex: 1;
    justify-content: center;
    width: auto;
    height: 38px;
    padding: 0 10px;
  }
  .sh-btn + .sh-btn {
    margin-left: 0;
  }
  .sh-btn.ghost {
    flex: 0 0 auto;
  }
  .sh-ext,
  .sh-mt {
    display: inline;
  }
}
</style>
