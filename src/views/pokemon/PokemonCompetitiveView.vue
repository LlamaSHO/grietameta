<script setup>
/* Competitivo · Pokémon Champions (Reglamento M-C). Diseño: models/paginas/PokemonCompetitivo.dc.html */
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useGameData } from "@/composables/useGameData.js";
import { artUrl, pct } from "@/components/pokemon/b/datos.js";
import "@/components/pokemon/b/pkb-base.css";
import "@/components/pokemon/b/pkb-competitivo.css";
import CompBar from "@/components/pokemon/b/CompBar.vue";
import CargaDatos from "@/components/pokemon/b/CargaDatos.vue";
import TypeChip from "@/components/pokemon/b/TypeChip.vue";
import Ma from "@/components/pokemon/b/Ma.vue";

const datos = useGameData("/data/pokemon/competitivo/champions.json");

const TCL = { normal: "#A8A77A", fighting: "#D3425F", flying: "#8FA8DD", poison: "#B567CE", ground: "#D97845", rock: "#C5B78C", bug: "#91C12F", ghost: "#5269AD", steel: "#5A8EA2", fire: "#FF9D55", water: "#4D90D5", grass: "#63BC5A", electric: "#F4D23C", psychic: "#FA7179", ice: "#73CEC0", dragon: "#0B6DC3", dark: "#5A5465", fairy: "#EC8FE6" };
const STL = ["PS", "Atq", "Def", "AtE", "DfE", "Vel"];
const FN = { vgc: "Dobles (VGC)", bss: "Individuales" };

const hasM = (m, ns) => m.mv.some((x) => ns.includes(x[0]) && x[2] >= 15);
const hasA = (m, ns) => m.ab.some((x) => ns.includes(x[0]) && x[1] >= 30);
const FIL = {
  vgc: [["all", "Todos", () => true], ["mega", "Megas", (m) => m.es.startsWith("Mega ")], ["tr", "Espacio Raro", (m) => hasM(m, ["Espacio Raro"])], ["tw", "Viento Afín", (m) => hasM(m, ["Viento Afín"])], ["fo", "Sorpresa", (m) => hasM(m, ["Sorpresa"])], ["in", "Intimidación", (m) => hasA(m, ["Intimidación"])], ["wx", "Clima", (m) => hasA(m, ["Sequía", "Llovizna", "Chorro Arena", "Nevada"])]],
  bss: [["all", "Todos", () => true], ["mega", "Megas", (m) => m.es.startsWith("Mega ")], ["hz", "Trampas", (m) => hasM(m, ["Trampa Rocas", "Púas", "Púas Tóxicas", "Red Viscosa"])], ["pv", "Pivotes", (m) => hasM(m, ["Ida y Vuelta", "Voltiocambio", "Viraje", "Teletransporte"])], ["pr", "Prioridad", (m) => hasM(m, ["Golpe Bajo", "Velocidad Extrema", "Acua Jet", "Puño Bala", "Sombra Vil", "Ataque Rápido"])], ["sd", "Danza Espada", (m) => hasM(m, ["Danza Espada", "Danza Dragón", "Maquinación", "Paz Mental"])]],
};

const fmt = ref("vgc");
const filtro = ref("all");
const abierto = ref(0);

const regA = Date.UTC(2026, 8, 9, 2); const regB = Date.UTC(2026, 11, 2, 2); const seaA = Date.UTC(2026, 10, 4, 2);
const ahora = Date.now();
const regPct = Math.min(100, Math.max(0, ((ahora - regA) / (regB - regA)) * 100)).toFixed(1) + "%";
const seaPct = Math.min(100, Math.max(0, ((ahora - seaA) / (regB - seaA)) * 100)).toFixed(1) + "%";
const diasTemporada = Math.max(0, Math.ceil((regB - ahora) / 86400000));

const fm = computed(() => datos.data.fmt[fmt.value]);
const filtros = computed(() => FIL[fmt.value]);
const filas = computed(() => {
  const D = datos.data; const f = fm.value;
  const fn = (filtros.value.find((x) => x[0] === filtro.value) || filtros.value[0])[2];
  const top = f.mons[0].u;
  return f.mons.slice(0, 20).map((m, i) => {
    const pts = m.sp[1].split("/").map(Number); const mx = Math.max(...pts);
    return {
      i, r: i + 1, m, c: TCL[m.t[0]], c2: TCL[m.t[1] || m.t[0]], w: ((m.u / top) * 100).toFixed(1) + "%",
      why: fmt.value === "vgc" ? D.why[m.es] || "" : "", stop: D.stop[m.es] || "", dim: !fn(m),
      pts: pts.map((v, j) => ({ l: STL[j], v, hi: v === mx && v > 0 })),
    };
  });
});
const batallas = computed(() => { const b = fm.value.battles; return b >= 1e6 ? (b / 1e6).toFixed(2).replace(".", ",") + " M" : Math.round(b / 1000) + " mil"; });
const lead = computed(() => (fmt.value === "vgc" ? "Combates dobles, el formato del Mundial." : "Combates individuales: eliges 3 de tus 6."));
const fuente = computed(() => "Fuente: estadísticas de Smogon de la escalera de Pokémon Showdown con las mismas reglas que Champions (Reglamento M-C, " + (fmt.value === "vgc" ? "dobles" : "individuales") + "), octubre de 2026, jugadores con " + fm.value.cutoff + " o más de puntuación · " + fm.value.battles.toLocaleString("es-ES") + " combates. Es la muestra pública más grande del formato oficial.");
const equipos = computed(() => datos.data.teams.map((t) => ({ ...t, mg: ((n) => (n === 1 ? "1 mega" : n + " megas"))(t.mons.filter((m) => m[0].startsWith("Mega ")).length) })));
const parejas = computed(() => fm.value.cores.map((c) => { const a = fm.value.mons[c[0]]; const b = fm.value.mons[c[1]]; return { a: a.pid, b: b.pid, n: a.es + " + " + b.es, s: "Nº " + (c[0] + 1) + " y Nº " + (c[1] + 1) + " en uso", p: pct(c[2]) }; }));

function cambiarFormato(k) { fmt.value = k; filtro.value = "all"; abierto.value = 0; }
</script>

<template>
  <div class="pkb pg-comp">
    <CompBar :active="1" />
    <section class="chead">
      <div class="ch-bg" aria-hidden="true"></div>
      <div class="wrap ch-in">
        <div class="ch-tx">
          <span class="kick"><i></i>Competitivo · Juego oficial</span>
          <h1 class="h1 fd">El meta de <span>Champions</span></h1>
          <p class="lead">Pokémon Champions es el juego oficial de combates: el de la escalera clasificatoria y el Mundial. Aquí tienes qué se juega en el Reglamento M-C, en dobles (VGC) y en individuales, con sets, equipos de torneo y cómo pararlos.</p>
          <div class="rules"><span>Dobles o individuales</span><span>Nivel 50</span><span>Equipo de 6, juegas con 4 (dobles) o 3 (individuales)</span><span>Cláusula de especie</span><span>Cláusula de objeto</span><span class="hl">Megaevolución</span></div>
        </div>
        <div class="board">
          <div class="bd-h"><span class="live"><span class="dot"></span>En vigor</span><b class="fd">Reglamento M-C</b><small>9 sep – 2 dic 2026</small></div>
          <div class="tline">
            <div class="tl-s past"><b>M-A</b><small>8 abr – 17 jun</small></div>
            <div class="tl-s past"><b>M-B</b><small>17 jun – 9 sep · Mundial</small></div>
            <div class="tl-s now"><b>M-C</b><small>9 sep – 2 dic</small><span class="tl-p"><i :style="{ width: regPct }"></i></span></div>
            <div class="tl-s next"><b>¿M-D?</b><small>Por anunciar</small></div>
          </div>
          <div class="season">
            <div class="ss-h"><span><small>Clasificatoria</small><b class="fd">Temporada M-8</b></span><span class="ss-d">4 nov – 2 dic</span></div>
            <div class="ss-bar"><i :style="{ width: seaPct }"></i></div>
            <div class="ss-f"><span>Temporadas M-6 y M-7 cerradas</span><b>{{ diasTemporada }} días para el cierre</b></div>
          </div>
          <div v-if="datos.data" class="bd-f"><div><b class="fd">{{ batallas }}</b><small>combates en la muestra</small></div><div><b class="fd">+29</b><small>Pokémon nuevos</small></div><div><b class="fd">+6</b><small>Megaevoluciones nuevas</small></div></div>
        </div>
      </div>
    </section>

    <CargaDatos :estado="datos">
      <template v-if="datos.data">
        <section id="uso" class="sec">
          <div class="wrap">
            <div class="sec-h">
              <div><span class="kick"><i></i>Uso</span><h2 class="h2">Los 20 más usados</h2><p>{{ lead }} Toca una fila para ver el set completo.</p></div>
              <div class="seg" role="radiogroup" aria-label="Modalidad">
                <button v-for="k in ['vgc', 'bss']" :key="k" type="button" role="radio" :class="{ on: fmt === k }" :aria-checked="fmt === k" @click="cambiarFormato(k)">{{ FN[k] }}<small>{{ k === "vgc" ? "2 contra 2" : "1 contra 1" }}</small></button>
              </div>
            </div>
            <div class="fil"><button v-for="f in filtros" :key="f[0]" type="button" class="chip" :class="{ on: filtro === f[0] }" @click="filtro = f[0]">{{ f[1] }}</button></div>
            <div class="ut">
              <div class="ut-h"><span>#</span><span>Pokémon</span><span>Uso</span><span>Objeto</span><span>Movimientos</span></div>
              <div v-for="f in filas" :key="fmt + f.i" class="ur" :class="{ open: abierto === f.i, dim: f.dim }" :style="{ '--mc': f.c, '--mc2': f.c2 }">
                <button type="button" class="ur-b" :aria-expanded="abierto === f.i" @click="abierto = abierto === f.i ? -1 : f.i">
                  <span class="rk fd">{{ f.r }}</span>
                  <span class="who"><Ma :ids="datos.data.ids" :pid="f.m.pid" /><span><b class="fd">{{ f.m.es }}</b><span class="tys"><TypeChip v-for="t in f.m.t" :key="t" :k="t" /></span></span></span>
                  <span class="use"><span class="bar"><i :style="{ width: f.w }"></i></span><b class="fd">{{ pct(f.m.u) }}</b></span>
                  <span class="item">{{ f.m.it[0][0] }}<small>{{ pct(f.m.it[0][1]) }}</small></span>
                  <span class="mvs"><span v-for="v in f.m.mv.slice(0, 4)" :key="v[0]" class="mv" :class="'t-' + v[1]"><i class="ti"></i>{{ v[0] }}</span></span>
                </button>
                <div v-if="abierto === f.i" class="ur-d">
                  <div class="ud-l">
                    <Ma :ids="datos.data.ids" :pid="f.m.pid" big />
                    <div v-if="f.why" class="why"><small>Por qué funciona</small><p>{{ f.why }}</p></div>
                    <div v-if="f.stop" class="hint2"><b>Cómo pararlo:</b> {{ f.stop }}</div>
                  </div>
                  <div class="setc">
                    <div class="setb"><small>Objeto</small><div v-for="o in f.m.it" :key="o[0]" class="pr"><span>{{ o[0] }}</span><span class="bar"><i :style="{ width: Math.min(100, o[1]) + '%' }"></i></span><b>{{ pct(o[1]) }}</b></div></div>
                    <div class="setb"><small>Habilidad</small><div v-for="o in f.m.ab" :key="o[0]" class="pr"><span>{{ o[0] }}</span><span class="bar"><i :style="{ width: Math.min(100, o[1]) + '%' }"></i></span><b>{{ pct(o[1]) }}</b></div></div>
                    <div class="setb wide"><small>Movimientos más usados</small><div class="mvl"><span v-for="v in f.m.mv" :key="v[0]" class="mv" :class="'t-' + v[1]"><i class="ti"></i>{{ v[0] }}<b>{{ Math.round(v[2]) }}%</b></span></div></div>
                    <div class="setb"><div class="nat"><span>{{ f.m.sp[0] }}</span><small>Naturaleza y reparto</small></div><div class="spd"><span v-for="s in f.pts" :key="s.l" :class="{ hi: s.hi }"><b>{{ s.v }}</b>{{ s.l }}</span></div></div>
                    <div class="setb"><small>Suele ir con</small><div class="mates"><span v-for="t in f.m.tm.slice(0, 6)" :key="t[0]" class="mate"><Ma :ids="datos.data.ids" :pid="t[1]" />{{ t[0] }}<b>{{ Math.round(t[2]) }}%</b></span></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="src"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg><span>{{ fuente }}</span></div>
          </div>
        </section>

        <section class="sec">
          <div class="wrap">
            <div class="sec-h">
              <div><span class="kick"><i></i>Equipos</span><h2 class="h2">Equipos que ganan torneos</h2><p>Equipos invictos o casi invictos en torneos de la comunidad con reglas de Champions (Reglamento M-C), recogidos por Pikalytics. A la derecha, las parejas que más se repiten en la escalera.</p></div>
              <RouterLink class="btn-y" to="/pokemon/competitivo/equipo">Crea tu equipo<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></RouterLink>
            </div>
            <div class="tw">
              <div class="teams">
                <article v-for="t in equipos" :key="t.p + t.ev" class="tm">
                  <div class="tm-h"><div><b class="fd">{{ t.p }}</b><small>{{ t.ev }}</small></div><span class="rec fd">{{ t.rec }}</span></div>
                  <div class="tm-s"><span v-for="m in t.mons" :key="m[0]" class="tmo"><Ma :ids="datos.data.ids" :pid="m[1]" /><small>{{ m[0] }}</small></span></div>
                  <div class="tm-f"><span class="tag">{{ t.tag }}</span><span class="megas2">{{ t.mg }}</span></div>
                </article>
              </div>
              <aside class="cores">
                <div class="cores-h"><small>Escalera · {{ FN[fmt] }}</small><b class="fd">Parejas más repetidas</b><p>Porcentaje de equipos que llevan a los dos.</p></div>
                <div v-for="c in parejas" :key="c.n" class="core">
                  <span class="duo"><Ma :ids="datos.data.ids" :pid="c.a" /><Ma :ids="datos.data.ids" :pid="c.b" /></span>
                  <span><b>{{ c.n }}</b><small>{{ c.s }}</small></span>
                  <span class="pc">{{ c.p }}<small>equipos</small></span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Mini guías</span><h2 class="h2">Los arquetipos de dobles</h2><p>Las estrategias que más se repiten en VGC, a partir de los datos de uso y de guías de la comunidad (Victory Road, Pikalytics y Bulbapedia).</p></div></div>
            <div class="arch">
              <article v-for="a in datos.data.arch" :key="a.n" class="ar" :style="{ '--c1': a.c, '--c2': a.c2 }">
                <div class="ar-v"><img v-for="id in a.art" :key="id" class="art" :src="artUrl(id)" alt="" width="120" height="120" loading="lazy" decoding="async" /></div>
                <div class="ar-b"><h3 class="fd">{{ a.n }}</h3><p>{{ a.how }}</p><div class="stop"><b>Cómo pararlo</b>{{ a.stop }}</div></div>
              </article>
            </div>
          </div>
        </section>

        <section class="sec">
          <div class="wrap mw">
            <div>
              <div class="sec-h"><div><span class="kick"><i></i>Nuevo en M-C</span><h2 class="h2">Seis megaevoluciones más</h2><p>Incluidas las tres primeras Megaevoluciones Z.</p></div></div>
              <div class="megas">
                <article v-for="g in datos.data.megas" :key="g.n" class="mg" :style="{ '--c1': g.c1, '--c2': g.c2 }">
                  <img class="art" :src="artUrl(g.id)" alt="" width="170" height="170" loading="lazy" decoding="async" /><b class="fd">{{ g.n }}</b>
                  <div class="tys"><TypeChip v-for="t in g.t" :key="t" :k="t" /></div>
                </article>
              </div>
            </div>
            <aside class="worlds">
              <span class="kick"><i></i>Mundial 2026</span>
              <div class="trophy" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" /></svg></div>
              <h3 class="fd">Takuma Yamazaki</h3>
              <p class="sub">Campeón de VGC Máster · Japón</p>
              <div class="wr"><span><small>Finalista</small><b>Hiroshi Onishi (Japón)</b></span><span><small>Sede</small><b>San Francisco · 28–30 ago</b></span><span><small>Formato</small><b>Reglamento M-B</b></span></div>
              <div class="final">
                <div><Ma :ids="datos.data.ids" :pid="10281" /><b>Mega Dragonite</b><small>Yamazaki</small></div>
                <span class="vs fd">VS</span>
                <div><img class="art" :src="artUrl(6)" alt="" width="96" height="96" loading="lazy" decoding="async" /><b>Charizard</b><small>Onishi</small></div>
              </div>
              <p class="tnote">Mega Dragonite decidió la final. Los dos equipos compartían 4 de sus 6 Pokémon.</p>
              <div class="next27"><b class="fd">Mundial 2027</b><span>Singapur · 13–15 de agosto</span></div>
            </aside>
          </div>
        </section>
      </template>
    </CargaDatos>
  </div>
</template>
