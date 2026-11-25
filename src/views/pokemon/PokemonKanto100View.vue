<script setup>
/* Kanto · Guía al 100 %. Diseño: models/paginas/PokemonKanto100.dc.html */
import { computed, reactive, ref, watch } from "vue";
import { useGameData } from "@/composables/useGameData.js";
import { artUrl, leer, guardar } from "@/components/pokemon/b/datos.js";
import "@/components/pokemon/b/pkb-base.css";
import "@/components/pokemon/b/pkb-kanto-100.css";
import KantoBar from "@/components/pokemon/b/KantoBar.vue";
import CargaDatos from "@/components/pokemon/b/CargaDatos.vue";
import G1 from "@/components/pokemon/b/G1.vue";

const datos = useGameData("/data/pokemon/kanto/cien.json");

const VN = { r: "Pokémon Rojo", b: "Pokémon Azul", y: "Pokémon Amarillo" };
const VERS = [["r", "Rojo", "vr"], ["b", "Azul", "va"], ["y", "Amarillo", "vy"]];
const ESTADOS = [["all", "Todo"], ["todo", "Pendiente"], ["done", "Hecho"]];
const FC = { pk: ["Pokémon", "#FF5A5F"], gy: ["Gimnasios", "#FFCB3D"], mt: ["MO y MT", "#4F86F7"], ky: ["Objetos clave", "#FF9F43"], ex: ["Para presumir", "#3DDC97"], lg: ["Únicos", "#B567CE"] };
const FILTROS_MET = ["wild", "fish", "gift", "trade", "static", "evo", "evotrade", "fossil", "nope"];
const nrm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/* ---- Estado (se guarda en el navegador) ---- */
const CLAVE = "gm-pk-kanto-100";
function inicial() {
  const c = {};
  for (let i = 1; i <= 24; i++) c[i] = true;
  [25, 29, 32, 35, 39, 41, 43, 46, 50, 52, 54, 56, 60, 63, 66, 74, 92, 95, 133].forEach((i) => { c[i] = true; });
  return {
    c, g: { 0: 1, 1: 1, 2: 1 }, mo: { 0: 1 }, mt: { 0: 1, 3: 1, 10: 1, 11: 1, 19: 1, 23: 1, 27: 1, 33: 1, 44: 1 },
    k: { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 18: 1, 19: 1 }, e: {}, l: {},
  };
}
const guardado = leer(CLAVE, null) || inicial();
const prog = reactive({
  c: guardado.c || {}, g: guardado.g || {}, mo: guardado.mo || {}, mt: guardado.mt || {}, k: guardado.k || {}, e: guardado.e || {}, l: guardado.l || {},
});
const ver = ref(["r", "b", "y"].includes(guardado.ver) ? guardado.ver : "r");
const st = ref("all");
const mf = ref("all");
const fq = ref("");
const fk = ref("all");
watch([prog, ver], () => guardar(CLAVE, { ...prog, ver: ver.value }), { deep: true });

const alternar = (clave, id) => { prog[clave][id] = !prog[clave][id]; };
const cuenta = (o) => Object.keys(o).filter((k) => o[k]).length;
const okSt = (d) => st.value === "all" || (st.value === "done" ? d : !d);

const vi = computed(() => datos.data.col[ver.value]);
const MC = computed(() => datos.data.metodos);

const dexFiltrada = computed(() => datos.data.dex.filter((d) => okSt(!!prog.c[d[0]]) && (mf.value === "all" || d[vi.value] === mf.value)));
const conteoMetodos = computed(() => { const m = {}; datos.data.dex.forEach((d) => { m[d[vi.value]] = (m[d[vi.value]] || 0) + 1; }); return m; });
const filtrosMetodo = computed(() => [["all", "Todos", "#FFF", 151]].concat(FILTROS_MET.filter((k) => conteoMetodos.value[k]).map((k) => [k, MC.value[k][0], MC.value[k][1], conteoMetodos.value[k]])));
const capturados = computed(() => datos.data.dex.filter((d) => prog.c[d[0]] && d[0] !== 151).length);

const gimnasios = computed(() => datos.data.gimnasios.map((g, i) => ({ ...g, i })).filter((g) => okSt(!!prog.g[g.i])));
const mos = computed(() => datos.data.mo.map((m, i) => ({ ...m, i })).filter((m) => okSt(!!prog.mo[m.i])));
const mts = computed(() => datos.data.mt.map((m, i) => ({ ...m, i, no: "MT" + String(m.n).padStart(2, "0") })).filter((m) => okSt(!!prog.mt[m.i])));
const claves = computed(() => datos.data.claves.map((k, i) => ({ ...k, i })).filter((k) => okSt(!!prog.k[k.i])));
const extras = computed(() => datos.data.extras.map((e, i) => ({ n: e[0], p: e[1], i })).filter((e) => okSt(!!prog.e[e.i])));
const unicos = computed(() => datos.data.unicos.map((l, i) => ({ id: l[0], n: l[1], p: l[2], i, ev: l[0] === 151 })).filter((l) => okSt(!!prog.l[l.i])));

/* ---- Buscador global ---- */
const TODO = computed(() => {
  const D = datos.data; const v = vi.value;
  return [].concat(
    D.dex.map((d) => ({ cat: "pk", key: "c", id: d[0], n: d[1], sub: "#" + String(d[0]).padStart(3, "0") + " · " + MC.value[d[v]][0] })),
    D.gimnasios.map((g, i) => ({ cat: "gy", key: "g", id: i, n: g.l + " · " + g.med, sub: g.c })),
    D.mo.map((m, i) => ({ cat: "mt", key: "mo", id: i, n: m.n + " · " + m.m, sub: m.p })),
    D.mt.map((m, i) => ({ cat: "mt", key: "mt", id: i, n: "MT" + String(m.n).padStart(2, "0") + " · " + m.m, sub: m.p })),
    D.claves.map((k, i) => ({ cat: "ky", key: "k", id: i, n: k.n, sub: k.p })),
    D.extras.map((e, i) => ({ cat: "ex", key: "e", id: i, n: e[0], sub: e[1] })),
    D.unicos.map((l, i) => ({ cat: "lg", key: "l", id: i, n: l[1], sub: l[2] })),
  );
});
const nq = computed(() => nrm(fq.value.trim()));
const aciertos = computed(() => TODO.value.filter((r) => (fk.value === "all" || r.cat === fk.value) && (!nq.value || nrm(r.n + " " + r.sub).includes(nq.value))));
const resultados = computed(() => (nq.value || fk.value !== "all" ? aciertos.value : []).slice(0, 24).map((r) => {
  const on = !!(prog[r.key] || {})[r.id];
  return { ...r, k: FC[r.cat][0], c: FC[r.cat][1], on };
}));
const masTxt = computed(() => (aciertos.value.length > 24 && (nq.value || fk.value !== "all") ? "Y " + (aciertos.value.length - 24) + " más: afina la búsqueda." : ""));
const catsBusq = computed(() => [["all", "Todo", "#FFFFFF", TODO.value.length]].concat(Object.keys(FC).map((k) => [k, FC[k][0], FC[k][1], TODO.value.filter((r) => r.cat === k).length])));

/* ---- Totales ---- */
const partes = computed(() => [
  ["Pokédex", capturados.value, 150, "#FF5A5F", "#dex"], ["Medallas", cuenta(prog.g), 8, "#FFCB3D", "#medallas"],
  ["MO", cuenta(prog.mo), 5, "#9B5CF6", "#mt"], ["MT", cuenta(prog.mt), 50, "#4F86F7", "#mt"],
  ["Objetos clave", cuenta(prog.k), 20, "#FF9F43", "#claves"],
  ["Legendarios", Object.keys(prog.l).filter((k) => prog.l[k] && k !== "6").length, 6, "#EC8FE6", "#legendarios"],
  ["Extras", cuenta(prog.e), 6, "#3DDC97", "#claves"],
]);
const pct = computed(() => {
  const tot = partes.value.reduce((a, p) => a + p[1], 0); const max = partes.value.reduce((a, p) => a + p[2], 0);
  return Math.round((tot / max) * 100);
});

function reiniciar() {
  ["c", "g", "mo", "mt", "k", "e", "l"].forEach((k) => { Object.keys(prog[k]).forEach((i) => delete prog[k][i]); });
}
function marcarVisibles() { dexFiltrada.value.forEach((d) => { prog.c[d[0]] = true; }); }
function irA(e, href) {
  const el = document.querySelector(href);
  if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
}
</script>

<template>
  <div class="pkb pg-k100">
    <KantoBar :active="3" />
    <CargaDatos :estado="datos">
      <template v-if="datos.data">
        <section class="hhead">
          <div class="wrap hh-in">
            <div class="big" aria-hidden="true">
              <div class="bring" :style="{ '--p': pct * 3.6 + 'deg' }"></div>
              <div class="bin"><b class="fd">{{ pct }}%</b><small>Kanto completado</small><G1 :id="65" /></div>
            </div>
            <div class="hh-tx">
              <span class="kick"><i></i>Guía al 100 % · Gen I</span>
              <h1 class="h1 fd">Kanto al 100 %</h1>
              <p class="lead">Todo lo que hay que conseguir en {{ VN[ver] }}. Toca cualquier casilla para marcarla: tu progreso se guarda en este navegador.</p>
              <div class="hh-row">
                <div class="vseg" role="radiogroup" aria-label="Versión">
                  <button v-for="v in VERS" :key="v[0]" type="button" role="radio" :class="[v[2], { on: ver === v[0] }]" :aria-checked="ver === v[0]" @click="ver = v[0]">{{ v[1] }}</button>
                </div>
                <div class="stf">
                  <button v-for="s in ESTADOS" :key="s[0]" type="button" :class="{ on: st === s[0] }" @click="st = s[0]">{{ s[1] }}</button>
                </div>
                <button type="button" class="reset" @click="reiniciar">Empezar de cero</button>
              </div>
              <div class="cbars">
                <a v-for="b in partes" :key="b[0]" class="cb" :href="b[4]" :style="{ '--k': b[3] }" @click="irA($event, b[4])">
                  <span class="cb-n">{{ b[0] }}</span><span class="bar"><i :style="{ width: ((b[1] / b[2]) * 100).toFixed(1) + '%' }"></i></span><b class="fd">{{ b[1] + "/" + b[2] }}</b>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="buscar" class="sec fx">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Buscador</span><h2 class="h2">Busca y marca</h2><p>Escribe un Pokémon, un líder, una MT o un objeto y márcalo desde aquí. Filtra por tipo de cosa si solo quieres ver una.</p></div></div>
            <div class="fx-bar">
              <label class="fx-q">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <span class="sr-only">Buscar en Kanto al 100 %</span>
                <input v-model="fq" type="search" placeholder="Pikachu, Brock, Surf, MT26, Bici…" autocomplete="off" />
              </label>
              <div class="fx-cats" role="group" aria-label="Qué buscar">
                <button v-for="c in catsBusq" :key="c[0]" type="button" class="fx-cat" :style="{ '--fc': c[2] }" :aria-pressed="fk === c[0]" @click="fk = c[0]">{{ c[1] }} <b>{{ c[3] }}</b></button>
              </div>
            </div>
            <template v-if="resultados.length">
              <ul class="fx-res">
                <li v-for="r in resultados" :key="r.key + r.id">
                  <button type="button" class="fx-it" :class="{ on: r.on }" :style="{ '--fc': r.c }" :aria-pressed="r.on" @click="alternar(r.key, r.id)">
                    <span class="fx-ck" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7" /></svg></span>
                    <span class="fx-tx"><b>{{ r.n }}</b><small>{{ r.sub }}</small></span>
                    <span class="fx-k">{{ r.k }}</span>
                  </button>
                </li>
              </ul>
              <p class="fx-more">{{ masTxt }}</p>
            </template>
            <p v-else-if="nq" class="fx-none">No hay nada con «{{ fq }}». Prueba con otro nombre.</p>
          </div>
        </section>

        <section id="dex" class="sec">
          <div class="wrap">
            <div class="sec-h">
              <div><span class="kick"><i></i>Pokédex</span><h2 class="h2">Los 151 <span class="cnt fd">{{ capturados }} / 150</span></h2><p>El borde indica cómo se consigue en {{ VN[ver] }}. Los que no salen en tu versión necesitan un intercambio.</p></div>
              <button type="button" class="btn-o sm" @click="marcarVisibles">Marcar los visibles</button>
            </div>
            <div class="mfil">
              <button v-for="f in filtrosMetodo" :key="f[0]" type="button" class="mf" :class="{ on: mf === f[0] }" :style="{ '--k': f[2] }" @click="mf = f[0]"><i></i>{{ f[1] }}<b>{{ f[3] }}</b></button>
            </div>
            <div class="dex151">
              <button v-for="d in dexFiltrada" :key="d[0]" type="button" class="dx" :class="{ on: !!prog.c[d[0]], no: d[vi] === 'nope' }" :style="{ '--k': MC[d[vi]][1] }" :aria-pressed="!!prog.c[d[0]]" :title="d[1] + ' · ' + MC[d[vi]][0]" @click="alternar('c', d[0])">
                <G1 :id="d[0]" /><small class="px">{{ String(d[0]).padStart(3, "0") }}</small>
                <span class="ck"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6" /></svg></span>
              </button>
            </div>
          </div>
        </section>

        <section id="medallas" class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Medallas</span><h2 class="h2">Los 8 gimnasios <span class="cnt fd">{{ cuenta(prog.g) }} / 8</span></h2></div></div>
            <div class="badges">
              <button v-for="g in gimnasios" :key="g.i" type="button" class="bdg" :class="['t-' + g.t, { on: !!prog.g[g.i] }]" :aria-pressed="!!prog.g[g.i]" @click="alternar('g', g.i)">
                <span class="bm"><i class="tglyph"></i></span><b class="fd">{{ g.med }}</b><small>{{ g.l }} · {{ g.c }}</small>
              </button>
            </div>
          </div>
        </section>

        <section id="mt" class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>MO y MT</span><h2 class="h2">5 MO y 50 MT <span class="cnt fd">{{ cuenta(prog.mo) + cuenta(prog.mt) }} / 55</span></h2><p>Las MT de la Gen I se gastan al usarlas: piensa bien a quién se las enseñas.</p></div></div>
            <div class="mos">
              <button v-for="m in mos" :key="m.i" type="button" class="mo" :class="['t-' + m.t, { on: !!prog.mo[m.i] }]" :aria-pressed="!!prog.mo[m.i]" @click="alternar('mo', m.i)">
                <span class="dsc fd">MO0{{ m.n }}</span><span><b>{{ m.m }}</b><small>{{ m.p }} · {{ m.how }}</small></span>
                <span class="ck"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6" /></svg></span>
              </button>
            </div>
            <div class="mts">
              <button v-for="m in mts" :key="m.i" type="button" class="mtb" :class="['t-' + m.t, { on: !!prog.mt[m.i] }]" :aria-pressed="!!prog.mt[m.i]" :title="m.how" @click="alternar('mt', m.i)">
                <span class="dsc fd">{{ m.no }}</span><b>{{ m.m }}</b><small>{{ m.p }}</small>
              </button>
            </div>
          </div>
        </section>

        <section id="claves" class="sec">
          <div class="wrap two">
            <div>
              <div class="sec-h"><div><span class="kick"><i></i>Objetos clave</span><h2 class="h2">Objetos clave <span class="cnt fd">{{ cuenta(prog.k) }} / 20</span></h2></div></div>
              <div class="keys">
                <button v-for="k in claves" :key="k.i" type="button" class="key" :class="{ on: !!prog.k[k.i] }" :aria-pressed="!!prog.k[k.i]" @click="alternar('k', k.i)"><span class="kb"></span><span><b>{{ k.n }}</b><small>{{ k.p }}</small></span></button>
              </div>
            </div>
            <div>
              <div class="sec-h"><div><span class="kick"><i></i>Extras</span><h2 class="h2">Para presumir <span class="cnt fd">{{ cuenta(prog.e) }} / 6</span></h2></div></div>
              <div class="exts">
                <button v-for="e in extras" :key="e.i" type="button" class="ext" :class="{ on: !!prog.e[e.i] }" :aria-pressed="!!prog.e[e.i]" @click="alternar('e', e.i)">
                  <span class="eb"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 12 10 18 20 6" /></svg></span>
                  <span><b class="fd">{{ e.n }}</b><small>{{ e.p }}</small></span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="legendarios" class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Legendarios</span><h2 class="h2">Pokémon únicos <span class="cnt fd">{{ partes[5][1] }} / 6</span></h2><p>Solo hay uno de cada en la partida. Guarda antes de enfrentarte a ellos.</p></div></div>
            <div class="legs">
              <button v-for="l in unicos" :key="l.i" type="button" class="lg" :class="{ on: !!prog.l[l.i], ev: l.ev }" :aria-pressed="!!prog.l[l.i]" @click="alternar('l', l.i)">
                <img class="art" :src="artUrl(l.id)" alt="" width="130" height="130" loading="lazy" decoding="async" />
                <b class="fd">{{ l.n }}</b><small>{{ l.p }}</small>
                <span class="lgs">{{ l.ev ? "Solo evento" : prog.l[l.i] ? "Capturado" : "Pendiente" }}</span>
              </button>
            </div>
          </div>
        </section>
      </template>
    </CargaDatos>
  </div>
</template>
