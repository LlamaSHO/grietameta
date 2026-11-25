<script setup>
/* Competitivo · Crea tu equipo. Diseño: models/paginas/PokemonEquipo.dc.html
   La lógica de análisis está en components/pokemon/b/equipoLogica.js. */
import { computed, ref, watch } from "vue";
import { useGameData } from "@/composables/useGameData.js";
import { pct, leer, guardar } from "@/components/pokemon/b/datos.js";
import { crearMotor, fmtN, TCL, TKL, TNM } from "@/components/pokemon/b/equipoLogica.js";
import "@/components/pokemon/b/pkb-base.css";
import "@/components/pokemon/b/pkb-equipo.css";
import CompBar from "@/components/pokemon/b/CompBar.vue";
import CargaDatos from "@/components/pokemon/b/CargaDatos.vue";
import TypeChip from "@/components/pokemon/b/TypeChip.vue";
import Ma from "@/components/pokemon/b/Ma.vue";

const datos = useGameData("/data/pokemon/competitivo/equipo.json");

const CLAVE = "gm-pk-equipo";
const guardado = leer(CLAVE, {});
const fmt = ref(["vgc", "bss", "ou", "svou"].includes(guardado.fmt) ? guardado.fmt : "vgc");
const team = ref(Array.isArray(guardado.team) ? guardado.team.filter((i) => Number.isInteger(i)) : [0, 1, 2]);
const q = ref("");
watch([fmt, team], () => guardar(CLAVE, { fmt: fmt.value, team: team.value }), { deep: true });

const M = computed(() => datos.data.fmt[fmt.value].mons);
const equipo = computed(() => team.value.filter((i) => M.value[i]));
const motor = computed(() => crearMotor(M.value, fmt.value, datos.data.eff));
const ev = computed(() => motor.value.evaluar(equipo.value));
const col = (m) => [TCL[m.t[0]], TCL[m.t[1] || m.t[0]]];

const llena = computed(() => equipo.value.length >= 6);
const huecos = computed(() => [0, 1, 2, 3, 4, 5].map((k) => ({ k, m: M.value[equipo.value[k]], i: equipo.value[k] })));
const sugerencias = computed(() => {
  const e = ev.value; const m = M.value;
  if (llena.value) {
    return e.swaps.map((c) => ({ key: c.i + "-" + c.out, m: m[c.i], fit: "por " + m[c.out].es, why: c.why.slice(0, 3), add: () => { team.value = equipo.value.map((x) => (x === c.out ? c.i : x)); } }));
  }
  return e.cands.map((c) => ({ key: c.i, m: m[c.i], fit: Math.max(1, Math.round((c.sc / e.mx) * 100)) + " % encaje", why: c.why.slice(0, 3), add: () => { team.value = equipo.value.concat([c.i]); } }));
});
const piscina = computed(() => {
  const t = q.value.trim().toLowerCase();
  return M.value.map((m, i) => {
    const dentro = equipo.value.includes(i);
    const off = !dentro && (llena.value || equipo.value.some((j) => M.value[j].id === m.id));
    return { i, m, dentro, off, oculto: !!t && !m.es.toLowerCase().includes(t) };
  });
});
const similares = computed(() => (fmt.value === "vgc" ? datos.data.teams.map((t) => ({ t, ov: t.ix.filter((i) => equipo.value.includes(i)).length })).sort((a, b) => b.ov - a.ov).slice(0, 3) : []));
const debilTxt = computed(() => (ev.value.bad.length ? ev.value.bad.length + (ev.value.bad.length === 1 ? " tipo peligroso" : " tipos peligrosos") : "Sin puntos flojos graves"));
const debilidades = computed(() => TKL.map((a) => ({ k: a, n: TNM[a], w: ev.value.A.w[a], r: ev.value.A.r[a] })));

function cambiarFormato(k) {
  const nombres = equipo.value.map((i) => M.value[i].n);
  const nuevo = datos.data.fmt[k].mons;
  fmt.value = k;
  team.value = nombres.map((n) => nuevo.findIndex((m) => m.n === n)).filter((i) => i >= 0);
}
function alternar(p) {
  if (p.dentro) team.value = equipo.value.filter((x) => x !== p.i);
  else if (!p.off) team.value = equipo.value.concat([p.i]);
}
function mejor() { team.value = motor.value.fillBest(llena.value ? [] : equipo.value); }
</script>

<template>
  <div class="pkb pg-team">
    <CompBar :active="3" />
    <section class="thead">
      <div class="th-bg" aria-hidden="true"></div>
      <div class="wrap th-in">
        <div>
          <span class="kick"><i></i>Competitivo · Asistente</span>
          <h1 class="h1 fd">Crea tu <span>equipo</span></h1>
          <p class="lead">Elige el formato, añade los Pokémon que te gustan y te decimos qué le falta. Las sugerencias salen de los datos de uso: con quién suele ir cada Pokémon en los equipos de la escalera, qué tipos te hacen daño y qué funciones te faltan.</p>
        </div>
        <div v-if="datos.data" class="fpick">
          <small>Formato</small>
          <div class="fgrid" role="radiogroup" aria-label="Formato">
            <button v-for="k in datos.data.orden" :key="k" type="button" role="radio" class="fo" :class="{ on: fmt === k }" :aria-checked="fmt === k" @click="cambiarFormato(k)"><b class="fd">{{ datos.data.fn[k][0] }}</b><span>{{ datos.data.fn[k][1] }}</span></button>
          </div>
        </div>
      </div>
    </section>

    <CargaDatos :estado="datos">
      <section v-if="datos.data" class="sec tbs">
        <div class="wrap tb-w">
          <div class="tb-l">
            <div class="tb-h">
              <div>
                <h2 class="h3 fd">Tu equipo <span>{{ equipo.length }}/6</span></h2>
                <p>{{ llena ? "Equipo completo. Mira el análisis de la derecha." : "Te quedan " + (6 - equipo.length) + " huecos. Las sugerencias se actualizan con cada Pokémon que añades." }}</p>
              </div>
              <div class="acts">
                <button type="button" class="btn-y" @click="mejor"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z" /></svg>{{ equipo.length && !llena ? "Completar el equipo" : "Generar el mejor equipo" }}</button>
                <button type="button" class="btn-o" @click="team = []">Vaciar</button>
              </div>
            </div>
            <div class="slots">
              <div v-for="s in huecos" :key="s.k" class="sl" :class="{ empty: !s.m }" :style="s.m ? { '--c1': col(s.m)[0], '--c2': col(s.m)[1] } : { '--c1': '#3A3F47', '--c2': '#3A3F47' }">
                <template v-if="s.m">
                  <button type="button" class="sl-x" :aria-label="'Quitar a ' + s.m.es" @click="team = equipo.filter((x) => x !== s.i)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
                  <Ma :ids="datos.data.ids" :pid="s.m.pid" />
                  <b class="fd">{{ s.m.es }}</b>
                  <span class="tys"><TypeChip v-for="t in s.m.t" :key="t" :k="t" /></span>
                  <span class="sl-i"><span>{{ s.m.it[0][0] }}</span><span>{{ s.m.ab[0][0] }}</span></span>
                </template>
                <span v-else class="sl-e"><span class="pl"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></span><b>Hueco {{ s.k + 1 }}</b><small>Elige abajo o añade una sugerencia</small></span>
              </div>
            </div>

            <div class="sug">
              <div class="sug-h">
                <div><span class="kick"><i></i>Sugerencias</span><h3 class="fd">{{ llena ? "Cambios que mejorarían el equipo" : "Los que mejor encajan ahora" }}</h3></div>
                <small>{{ llena ? "Cada uno sustituye a un miembro" : "Ordenados por encaje con tu equipo" }}</small>
              </div>
              <div class="sgrid">
                <article v-for="g in sugerencias" :key="g.key" class="sg" :style="{ '--c1': TCL[g.m.t[0]] }">
                  <Ma :ids="datos.data.ids" :pid="g.m.pid" />
                  <div class="sg-b">
                    <div class="sg-t"><b class="fd">{{ g.m.es }}</b><span class="fit fd">{{ g.fit }}</span></div>
                    <span class="tys"><TypeChip v-for="t in g.m.t" :key="t" :k="t" /></span>
                    <ul class="why2"><li v-for="w in g.why" :key="w.n" :class="w.k">{{ w.n }}</li></ul>
                  </div>
                  <button type="button" class="sg-add" :aria-label="'Añadir a ' + g.m.es" @click="g.add()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button>
                </article>
              </div>
              <p v-if="llena && !sugerencias.length" class="sug-full">No vemos ningún cambio claro: con estos datos, tu equipo ya encaja muy bien.</p>
            </div>

            <div class="pick">
              <div class="pk-h">
                <h3 class="fd">Los 40 más usados en {{ datos.data.fn[fmt][0] }}</h3>
                <label class="pk-s"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg><span class="sr-only">Buscar Pokémon</span><input id="q-team" v-model="q" type="search" placeholder="Busca un Pokémon" autocomplete="off" /></label>
              </div>
              <div class="pgrid">
                <button v-for="p in piscina" :key="fmt + p.i" type="button" class="po" :class="{ in: p.dentro, off: p.off, hide: p.oculto }" :aria-pressed="p.dentro" @click="alternar(p)"><Ma :ids="datos.data.ids" :pid="p.m.pid" /><b>{{ p.m.es }}</b><small>{{ pct(p.m.u) }}</small></button>
              </div>
            </div>
          </div>

          <aside class="tb-r">
            <div class="an">
              <div class="an-h"><small>Análisis</small><b class="fd">{{ ev.grade }}</b><p>{{ ev.gradeTxt }}</p></div>
              <div class="gauges">
                <div><span>Sinergia</span><span class="bar"><i :style="{ width: Math.min(100, ev.syn * 2.2).toFixed(0) + '%' }"></i></span><b class="fd">{{ fmtN(ev.syn) }} %</b></div>
                <div><span>Peso en el meta</span><span class="bar"><i :style="{ width: Math.min(100, ev.met * 2.5).toFixed(0) + '%' }"></i></span><b class="fd">{{ fmtN(ev.met) }} %</b></div>
                <div><span>Defensa</span><span class="bar"><i :style="{ width: ev.def + '%' }"></i></span><b class="fd">{{ fmtN(ev.def) }}</b></div>
              </div>
            </div>
            <div class="an">
              <div class="an-t"><b class="fd">Funciones</b><small>{{ ev.rolesOn }} de {{ ev.nroles }}</small></div>
              <ul class="roles"><li v-for="r in ev.A.roles" :key="r.n" :class="{ on: r.who.length }"><span class="ck"></span><span><b>{{ r.n }}</b><small>{{ r.who.length ? r.who.join(", ") : "Falta · " + r.d }}</small></span></li></ul>
            </div>
            <div class="an">
              <div class="an-t"><b class="fd">Debilidades del equipo</b><small>{{ debilTxt }}</small></div>
              <div class="wgrid">
                <span v-for="w in debilidades" :key="w.k" class="wt" :class="['t-' + w.k, { bad: ev.bad.includes(w.k), zero: !w.w, zr: !w.r }]" :title="w.w + ' débiles, ' + w.r + ' resisten'"><i class="ti"></i><span class="wn">{{ w.n }}</span><span class="wb"><b class="bw">{{ w.w }}</b><b class="br">{{ w.r }}</b></span></span>
              </div>
              <p class="wleg"><b class="bw">2</b> débiles <b class="br">1</b> resisten o inmunes · no cuenta objetos ni Teracristal</p>
            </div>
            <div v-if="similares.length" class="an">
              <div class="an-t"><b class="fd">Equipos de torneo parecidos</b><small>Pikalytics</small></div>
              <div v-for="s in similares" :key="s.t.p + s.t.ev" class="sim">
                <div class="sim-h"><span><b>{{ s.t.p }}</b><small>{{ s.t.rec }} · {{ s.t.tag }}</small></span><span class="ov fd">{{ s.ov }} de 6 iguales</span></div>
                <div class="sim-m"><Ma v-for="(m, k) in s.t.mons" :key="m[0]" :ids="datos.data.ids" :pid="m[1]" :title="m[0]" :class="{ in: equipo.includes(s.t.ix[k]) }" /></div>
                <button type="button" class="sim-u" @click="team = s.t.ix.filter((i) => i >= 0)">Usar este equipo</button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </CargaDatos>
  </div>
</template>
