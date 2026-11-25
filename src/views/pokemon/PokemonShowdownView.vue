<script setup>
/* Competitivo · Pokémon Showdown. Diseño: models/paginas/PokemonShowdown.dc.html */
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useGameData } from "@/composables/useGameData.js";
import { pct } from "@/components/pokemon/b/datos.js";
import "@/components/pokemon/b/pkb-base.css";
import "@/components/pokemon/b/pkb-showdown.css";
import CompBar from "@/components/pokemon/b/CompBar.vue";
import CargaDatos from "@/components/pokemon/b/CargaDatos.vue";
import TypeChip from "@/components/pokemon/b/TypeChip.vue";
import Ma from "@/components/pokemon/b/Ma.vue";

const datos = useGameData("/data/pokemon/competitivo/showdown.json");

const TCL = { normal: "#A8A77A", fighting: "#D3425F", flying: "#8FA8DD", poison: "#B567CE", ground: "#D97845", rock: "#C5B78C", bug: "#91C12F", ghost: "#5269AD", steel: "#5A8EA2", fire: "#FF9D55", water: "#4D90D5", grass: "#63BC5A", electric: "#F4D23C", psychic: "#FA7179", ice: "#73CEC0", dragon: "#0B6DC3", dark: "#5A5465", fairy: "#EC8FE6" };
const STL = ["PS", "Atq", "Def", "AtE", "DfE", "Vel"];

const fmt = ref("ou");
const sel = ref(0);

const fm = computed(() => datos.data.fmt[fmt.value]);
const colores = (m) => [TCL[m.t[0]], TCL[m.t[1] || m.t[0]]];
const tarjetas = computed(() => {
  const top = fm.value.mons[0].u;
  return fm.value.mons.slice(0, 24).map((m, i) => ({ i, r: i + 1, m, c: colores(m), w: ((m.u / top) * 100).toFixed(1) + "%" }));
});
const actual = computed(() => {
  const m = fm.value.mons[sel.value] || fm.value.mons[0];
  const pts = m.sp[1].split("/").map(Number); const mx = Math.max(...pts);
  return { m, r: sel.value + 1, c: colores(m), pts: pts.map((v, j) => ({ l: STL[j], v, hi: v === mx && v > 0 })) };
});
const batallas = computed(() => { const b = fm.value.battles; return b >= 1e6 ? (b / 1e6).toFixed(2).replace(".", ",") + " M" : Math.round(b / 1000) + " mil"; });
const parejas = computed(() => fm.value.cores.map((c) => { const a = fm.value.mons[c[0]]; const b = fm.value.mons[c[1]]; return { a: a.pid, b: b.pid, n: a.es + " + " + b.es, s: "Nº " + (c[0] + 1) + " y Nº " + (c[1] + 1) + " en uso", p: pct(c[2]) }; }));

function cambiar(k) { fmt.value = k; sel.value = 0; }

const COMPARA = [
  ["Quién lo hace", "The Pokémon Company: es el juego oficial", "Fans, con código abierto: no es oficial"],
  ["Dónde se juega", "Nintendo Switch y móvil", "En el navegador, gratis"],
  ["Tu equipo", "Consigues y entrenas cada Pokémon", "Lo escribes en el constructor al instante"],
  ["Formatos", "Dobles (VGC) e individuales", "Los de Champions + tiers de Smogon y generaciones antiguas"],
  ["Competición", "Clasificatoria por temporadas y Mundial", "Escalera Elo y torneos de Smogon"],
];
const TIERS = [
  ["#FF5A5F", "OU", "OverUsed", "Los más usados. Es la tier principal."],
  ["#F59E0B", "UU", "UnderUsed", "Los que no llegan a OU. Los de OU están prohibidos aquí."],
  ["#7C3AED", "Ubers", "Ubers", "Los demasiado fuertes para OU: legendarios y algunos más."],
  ["#0EA5E9", "VGC / BSS", "Formatos oficiales", "Las reglas de Champions, sin tiers."],
];
</script>

<template>
  <div class="pkb pg-show">
    <CompBar :active="2" />
    <section class="shead">
      <div class="sh-bg" aria-hidden="true"></div>
      <div class="wrap sh-in">
        <div>
          <span class="kick"><i></i>Competitivo · Simulador no oficial</span>
          <h1 class="h1 fd">El meta de <span>Showdown</span></h1>
          <p class="lead">Pokémon Showdown es un simulador gratuito hecho por fans que se juega en el navegador. Tiene los formatos de Champions y, además, las tiers de Smogon (OU, UU, Ubers…), que no existen en el juego oficial.</p>
          <div class="verd"><b class="fd">¿Es lo mismo que Champions?</b><p><span class="ok">En dobles, sí:</span> mismas reglas y casi el mismo meta. <span class="no">En individuales, no del todo:</span> Champions juega 3 de 6 y Showdown suma las tiers de Smogon, con su propia lista de prohibidos.</p></div>
        </div>
        <div class="cmp">
          <div class="cmp-h"><span></span><span class="c1"><b class="fd">Champions</b><small>Oficial</small></span><span class="c2"><b class="fd">Showdown</b><small>Simulador</small></span></div>
          <div v-for="r in COMPARA" :key="r[0]" class="cmp-r"><small>{{ r[0] }}</small><span>{{ r[1] }}</span><span>{{ r[2] }}</span></div>
        </div>
      </div>
    </section>

    <CargaDatos :estado="datos">
      <template v-if="datos.data">
        <section id="tiers" class="sec">
          <div class="wrap">
            <div class="sec-h">
              <div><span class="kick"><i></i>Uso en la escalera</span><h2 class="h2">Lo que más se juega</h2><p>{{ datos.data.fd[fmt] }}</p></div>
              <div class="seg" role="radiogroup" aria-label="Formato">
                <button v-for="k in datos.data.orden" :key="k" type="button" role="radio" :class="{ on: fmt === k }" :aria-checked="fmt === k" @click="cambiar(k)">{{ datos.data.fn[k][0] }}</button>
              </div>
            </div>
            <div class="tg-w">
              <div>
                <div class="tg-i"><span><b class="fd">{{ batallas }}</b> combates</span><span>Jugadores con <b class="fd">{{ fm.cutoff }}</b> o más</span><span>{{ datos.data.fn[fmt][1] }}</span></div>
                <div class="tgrid">
                  <button v-for="c in tarjetas" :key="fmt + c.i" type="button" class="tc" :class="{ on: sel === c.i }" :style="{ '--c1': c.c[0], '--c2': c.c[1] }" :aria-pressed="sel === c.i" @click="sel = c.i">
                    <span class="tc-r fd">{{ c.r }}</span>
                    <Ma :ids="datos.data.ids" :pid="c.m.pid" />
                    <b class="fd">{{ c.m.es }}</b>
                    <span class="tys"><TypeChip v-for="t in c.m.t" :key="t" :k="t" /></span>
                    <span class="tc-u"><span class="bar"><i :style="{ width: c.w }"></i></span><b class="fd">{{ pct(c.m.u) }}</b></span>
                  </button>
                </div>
              </div>
              <aside class="panel" :style="{ '--c1': actual.c[0], '--c2': actual.c[1] }">
                <div class="pn-h">
                  <Ma :ids="datos.data.ids" :pid="actual.m.pid" />
                  <div><small>Nº {{ actual.r }} · {{ pct(actual.m.u) }} de los equipos</small><b class="fd">{{ actual.m.es }}</b><span class="tys"><TypeChip v-for="t in actual.m.t" :key="t" :k="t" /></span></div>
                </div>
                <div class="setc">
                  <div class="setb"><small>Objeto</small><div v-for="o in actual.m.it" :key="o[0]" class="pr"><span>{{ o[0] }}</span><span class="bar"><i :style="{ width: Math.min(100, o[1]) + '%' }"></i></span><b>{{ pct(o[1]) }}</b></div></div>
                  <div class="setb"><small>Habilidad</small><div v-for="o in actual.m.ab" :key="o[0]" class="pr"><span>{{ o[0] }}</span><span class="bar"><i :style="{ width: Math.min(100, o[1]) + '%' }"></i></span><b>{{ pct(o[1]) }}</b></div></div>
                  <div class="setb wide"><small>Movimientos más usados</small><div class="mvl"><span v-for="v in actual.m.mv" :key="v[0]" class="mv" :class="'t-' + v[1]"><i class="ti"></i>{{ v[0] }}<b>{{ Math.round(v[2]) }}%</b></span></div></div>
                  <div class="setb"><div class="nat"><span>{{ actual.m.sp[0] }}</span><small>Naturaleza y reparto</small></div><div class="spd"><span v-for="s in actual.pts" :key="s.l" :class="{ hi: s.hi }"><b>{{ s.v }}</b>{{ s.l }}</span></div></div>
                  <div class="setb"><small>Suele ir con</small><div class="mates"><span v-for="t in actual.m.tm.slice(0, 6)" :key="t[0]" class="mate"><Ma :ids="datos.data.ids" :pid="t[1]" />{{ t[0] }}<b>{{ Math.round(t[2]) }}%</b></span></div></div>
                </div>
                <RouterLink class="pn-go" to="/pokemon/competitivo/equipo">Montar un equipo con {{ actual.m.es }}<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></RouterLink>
              </aside>
            </div>
            <div class="src"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg><span>Fuente: estadísticas mensuales de Smogon (octubre de 2026) de la escalera de Pokémon Showdown. El porcentaje es la parte de los equipos que lleva a ese Pokémon. En Champions el reparto va en puntos de stats; en Escarlata/Púrpura, en EV.</span></div>
          </div>
        </section>

        <section class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Núcleos</span><h2 class="h2">Parejas que se repiten en {{ datos.data.fn[fmt][0] }}</h2><p>Porcentaje de equipos que llevan a los dos. Un buen punto de partida para montar tu equipo.</p></div></div>
            <div class="cgrid">
              <div v-for="c in parejas" :key="c.n" class="core">
                <span class="duo"><Ma :ids="datos.data.ids" :pid="c.a" /><Ma :ids="datos.data.ids" :pid="c.b" /></span>
                <span><b>{{ c.n }}</b><small>{{ c.s }}</small></span>
                <span class="pc">{{ c.p }}<small>equipos</small></span>
              </div>
            </div>
          </div>
        </section>
      </template>
    </CargaDatos>

    <section class="sec">
      <div class="wrap hw">
        <div class="how">
          <span class="kick"><i></i>Primeros pasos</span>
          <h2 class="h2">Cómo jugar en Showdown</h2>
          <ol class="steps">
            <li><span class="sn fd">1</span><div><b>Entra y elige un nombre</b><p>Abre play.pokemonshowdown.com en el navegador. No hace falta descargar nada ni pagar.</p></div></li>
            <li><span class="sn fd">2</span><div><b>Monta el equipo</b><p>En el constructor de equipos (Teambuilder) eliges Pokémon, objeto, habilidad, movimientos y reparto. También puedes pegar un equipo en texto.</p></div></li>
            <li><span class="sn fd">3</span><div><b>Elige formato y busca rival</b><p>Selecciona el formato (por ejemplo, el de VGC del Reglamento M-C) y pulsa Battle!. Ganar te sube en la escalera.</p></div></li>
          </ol>
        </div>
        <div class="tiers">
          <span class="kick"><i></i>Glosario</span>
          <h3 class="fd">¿Qué son las tiers?</h3>
          <p>Smogon reparte los Pokémon por niveles según lo que se usan. Cada mes se revisan.</p>
          <div v-for="t in TIERS" :key="t[1]" class="tier" :style="{ '--c': t[0] }"><span class="fd">{{ t[1] }}</span><div><b>{{ t[2] }}</b><small>{{ t[3] }}</small></div></div>
        </div>
      </div>
    </section>
  </div>
</template>
