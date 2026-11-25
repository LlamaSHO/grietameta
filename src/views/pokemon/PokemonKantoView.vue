<script setup>
/* Kanto · Historia (Gen I). Diseño: models/paginas/PokemonKanto.dc.html */
import { computed, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useGameData } from "@/composables/useGameData.js";
import { artUrl, leer, guardar } from "@/components/pokemon/b/datos.js";
import "@/components/pokemon/b/pkb-base.css";
import "@/components/pokemon/b/pkb-kanto.css";
import KantoBar from "@/components/pokemon/b/KantoBar.vue";
import CargaDatos from "@/components/pokemon/b/CargaDatos.vue";
import G1 from "@/components/pokemon/b/G1.vue";
import TypeChip from "@/components/pokemon/b/TypeChip.vue";
import KantoPaso from "@/components/pokemon/b/KantoPaso.vue";
import KantoLiga from "@/components/pokemon/b/KantoLiga.vue";

const datos = useGameData("/data/pokemon/kanto/historia.json");

const CLAVE = "gm-pk-kanto-historia";
const guardado = leer(CLAVE, { ver: "r", open: { 0: true, 3: true, 14: true }, done: { 0: true, 1: true, 2: true } });
const ver = ref(["r", "b", "y"].includes(guardado.ver) ? guardado.ver : "r");
const abiertos = reactive(guardado.open || {});
const hechos = reactive(guardado.done || {});
const soloPendientes = ref(false);
watch([ver, abiertos, hechos], () => guardar(CLAVE, { ver: ver.value, open: abiertos, done: hechos }), { deep: true });

const CLASES = { r: "vr", b: "va", y: "vy" };
const orden = ["r", "b", "y"];
const V = computed(() => datos.data.versiones[ver.value]);
const esAmarillo = computed(() => ver.value === "y");
const iniciales = computed(() => (esAmarillo.value ? datos.data.iniciales.y : datos.data.iniciales.std));
const tituloIniciales = computed(() => (esAmarillo.value ? "En Amarillo empiezas con Pikachu" : "¿Bulbasaur, Charmander o Squirtle?"));

const pasos = computed(() => datos.data.pasos.map((p, i) => ({ p, i })).filter((x) => !(soloPendientes.value && hechos[x.i])));
const nHechos = computed(() => datos.data.pasos.filter((p, i) => hechos[i]).length);
const nMedallas = computed(() => datos.data.pasos.filter((p, i) => p.gym && hechos[i]).length);
const pct = computed(() => Math.round((nHechos.value / datos.data.pasos.length) * 100));

const alternarAbierto = (i) => { abiertos[i] = !abiertos[i]; };
const alternarHecho = (i) => { hechos[i] = !hechos[i]; };
</script>

<template>
  <div class="pkb pg-kanto">
    <KantoBar :active="1" />
    <CargaDatos :estado="datos">
      <template v-if="datos.data">
        <section class="khero" :style="{ '--vc': V.vc, '--vc2': V.vc2 }">
          <div class="kh-bg" aria-hidden="true"></div>
          <div class="wrap kh-in">
            <div class="kh-tx">
              <span class="kick"><i></i>Guía de la historia · Gen I</span>
              <h1 class="h1 fd">Kanto<span>Pokémon {{ V.n }}</span></h1>
              <p class="lead">De Pueblo Paleta a la Meseta Añil en 16 pasos: qué hacer en cada ciudad, a quién capturar y cómo ganar cada gimnasio. Marca lo que vayas completando.</p>
              <div class="vsel" role="radiogroup" aria-label="Versión">
                <button v-for="k in orden" :key="k" type="button" role="radio" class="cart" :class="[CLASES[k], { on: ver === k }]" :aria-checked="ver === k" @click="ver = k">
                  <span class="cart-l"><G1 :id="datos.data.versiones[k].bp" /></span>
                  <b class="fd">{{ datos.data.versiones[k].n }}</b>
                  <small>{{ datos.data.versiones[k].y }}</small>
                </button>
              </div>
            </div>
            <div class="kh-art" aria-hidden="true">
              <span class="sun"></span>
              <img class="art" :src="artUrl(V.art)" alt="" width="475" height="475" />
              <div class="dlg px"><span>{{ V.dlg }}</span><i>▼</i></div>
            </div>
          </div>
          <div class="wrap">
            <div class="kfacts">
              <div><b class="fd">151</b><span>Pokémon</span></div>
              <div><b class="fd">8</b><span>gimnasios</span></div>
              <div><b class="fd">50</b><span>MT</span></div>
              <div><b class="fd">5</b><span>MO</span></div>
              <div><b class="fd">4 + 1</b><span>Alto Mando y Campeón</span></div>
            </div>
          </div>
        </section>

        <section class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Antes de empezar</span><h2 class="h2">Así funcionaba la Gen I</h2><p>Si vienes de los juegos modernos, esto es lo que cambia en Rojo, Azul y Amarillo.</p></div></div>
            <div class="g1g">
              <article class="g1c" style="--k: #FF6B6B"><div class="gv no"><span class="x">✕</span></div><h3 class="fd">Sin habilidades</h3><p>Ningún Pokémon tiene habilidad. Llegaron en Rubí y Zafiro.</p></article>
              <article class="g1c" style="--k: #FF6B6B"><div class="gv no"><span class="x">✕</span></div><h3 class="fd">Sin naturalezas ni crianza</h3><p>Las estadísticas solo dependen de los DV (0–15) y la experiencia de combate.</p></article>
              <article class="g1c" style="--k: #FF6B6B"><div class="gv no"><span class="x">✕</span></div><h3 class="fd">Sin objetos equipados</h3><p>Nada de Restos ni bayas: los objetos solo se usan desde la mochila.</p></article>
              <article class="g1c" style="--k: #B98CFF"><div class="gv sp"><span><b class="px">ESP</b><i style="width: 85%"></i></span><span class="dim"><b class="px">ATE</b><i></i></span><span class="dim"><b class="px">DFE</b><i></i></span></div><h3 class="fd">Una sola estadística Especial</h3><p>Ataca y defiende a la vez. Por eso Mewtwo (154) y Alakazam (135) eran tan fuertes.</p></article>
              <article class="g1c" style="--k: #FFCB3D"><div class="gv ty3"><TypeChip k="dark" /><TypeChip k="steel" /><TypeChip k="fairy" /></div><h3 class="fd">15 tipos</h3><p>No existen Siniestro, Acero ni Hada. Magnemite es solo Eléctrico y Clefairy, Normal.</p></article>
              <article class="g1c" style="--k: #7CF3B0"><div class="gv cr"><G1 :id="65" /><span class="px">¡GOLPE CRÍTICO!</span></div><h3 class="fd">Los críticos dependen de la Velocidad</h3><p>Cuanto más rápido, más golpes críticos. Persian y Jolteon los encadenan.</p></article>
            </div>
          </div>
        </section>

        <section class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Iniciales</span><h2 class="h2">{{ tituloIniciales }}</h2></div></div>
            <div class="starters">
              <article v-for="s in iniciales" :key="s.id" class="stc" :class="'t-' + s.k">
                <img class="art" :src="artUrl(s.id)" alt="" width="220" height="220" loading="lazy" decoding="async" />
                <div class="stc-b"><span class="lvl" :class="s.lc">{{ s.lvl }}</span><h3 class="fd">{{ s.n }}</h3><p>{{ s.p }}</p></div>
              </article>
            </div>
          </div>
        </section>

        <section id="historia" class="sec">
          <div class="wrap">
            <div class="sec-h">
              <div><span class="kick"><i></i>Paso a paso</span><h2 class="h2">La historia de Kanto</h2></div>
              <div class="prog">
                <div class="ring" :style="{ '--p': pct * 3.6 + 'deg' }"><b class="fd">{{ pct }}%</b></div>
                <div><b>{{ nHechos }} de 16 pasos</b><span>{{ nMedallas }} de 8 medallas</span></div>
                <div class="seg">
                  <button type="button" :class="{ on: !soloPendientes }" @click="soloPendientes = false">Todos</button>
                  <button type="button" :class="{ on: soloPendientes }" @click="soloPendientes = true">Pendientes</button>
                </div>
              </div>
            </div>
            <ol class="tl">
              <KantoPaso v-for="x in pasos" :key="x.i" :paso="x.p" :num="x.i + 1" :abierto="!!abiertos[x.i]" :hecho="!!hechos[x.i]" @abrir="alternarAbierto(x.i)" @hecho="alternarHecho(x.i)">
                <KantoLiga v-if="x.i === 14" :liga="datos.data.liga" :amarillo="esAmarillo" />
              </KantoPaso>
            </ol>
          </div>
        </section>

        <section class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Exclusivos</span><h2 class="h2">Lo que solo sale en tu versión</h2><p>Para completar la Pokédex tendrás que intercambiar con otra versión.</p></div></div>
            <div class="exc">
              <div class="ex vr"><h3 class="fd">Solo en Rojo</h3><div class="exg"><G1 v-for="m in datos.data.exclusivos.rojo" :key="m[0]" :id="m[0]" :title="m[1]" /></div></div>
              <div class="ex va"><h3 class="fd">Solo en Azul</h3><div class="exg"><G1 v-for="m in datos.data.exclusivos.azul" :key="m[0]" :id="m[0]" :title="m[1]" /></div></div>
              <div class="ex vy"><h3 class="fd">No salen en Amarillo</h3><div class="exg"><G1 v-for="m in datos.data.exclusivos.amarillo" :key="m[0]" :id="m[0]" :title="m[1]" /></div></div>
            </div>
            <div class="next">
              <RouterLink class="nx" to="/pokemon/kanto/mapa">
                <span class="nx-v map"></span>
                <span><small>Siguiente</small><b class="fd">Mapa interactivo de Kanto</b><span>Pokémon de cada ruta, MT, MO y objetos clave con zoom.</span></span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
              </RouterLink>
              <RouterLink class="nx" to="/pokemon/kanto/100">
                <span class="nx-v hund fd">100%</span>
                <span><small>Siguiente</small><b class="fd">Kanto al 100 %</b><span>Los 151, las 50 MT, medallas y legendarios con tu progreso.</span></span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
              </RouterLink>
            </div>
          </div>
        </section>
      </template>
    </CargaDatos>
  </div>
</template>
