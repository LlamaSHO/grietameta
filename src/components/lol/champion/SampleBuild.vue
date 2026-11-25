<template>
  <!-- Pestaña Build, parte de ejemplo: matchups (resumen), builds por variante,
       orden de habilidades, qué comprar después, consejos y winrate por objeto.
       Diseño: LolCampeon.dc.html. Datos de ejemplo: ver services/lol/sample.js. -->
  <div class="lol-sample sample-stack">
    <section class="card mu">
      <div class="card-h"><h2 class="disp">Matchups de {{ raw.campeon }}</h2><span class="meta">Duelos con 1.000 partidas o más · <span class="demo">Datos de ejemplo</span></span></div>
      <div class="mu-w">
        <div class="mu-g good">
          <h4 aria-level="3">Fuerte contra</h4>
          <div class="mu-cards">
            <div v-for="m in summary.strong" :key="m.n" class="mc2 g"><span class="sp cs" :style="{ backgroundPosition: m.pos }"></span><b class="nm">{{ m.n }}</b><span class="dl disp">{{ m.dText }}</span><span class="wr2">{{ m.wrText }}</span><small>{{ m.gText }} partidas</small></div>
          </div>
        </div>
        <button type="button" class="mu-all" @click="emit('matchups')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          <b>Lista completa</b><small>{{ summary.total }} rivales</small>
        </button>
        <div class="mu-g bad">
          <h4 aria-level="3">Débil contra</h4>
          <div class="mu-cards">
            <div v-for="m in summary.weak" :key="m.n" class="mc2 b"><span class="sp cs" :style="{ backgroundPosition: m.pos }"></span><b class="nm">{{ m.n }}</b><span class="dl disp">{{ m.dText }}</span><span class="wr2">{{ m.wrText }}</span><small>{{ m.gText }} partidas</small></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Builds: una pestaña por variante -->
    <section class="card bcard">
      <div class="card-h"><h2 class="disp">Builds de {{ raw.campeon }}</h2><span class="meta">Mid · {{ rankLabel }} · <span class="demo">Datos de ejemplo</span></span></div>
      <div class="bchips" role="tablist" aria-label="Variantes de build" @keydown="bvKeys">
        <button v-for="c in variants.list" :key="c.key" :id="`bv-tab-${c.key}`" type="button" role="tab" class="bchip" :class="{ on: c.key === bv.key }" :aria-selected="c.key === bv.key" aria-controls="bpanel" :tabindex="c.key === bv.key ? 0 : -1" @click="pick = c.key">
          <span class="sp ms ks" :style="{ backgroundPosition: c.ks }" aria-hidden="true"></span>
          <span class="bt-t"><b>{{ c.n }}</b><small>{{ c.tag }}</small></span>
          <span class="bt-w">{{ c.w }}<small>{{ c.g }} partidas</small></span>
        </button>
      </div>
      <p v-if="variants.onlyMain" class="nodata">En {{ rankLabel }} ninguna build de {{ raw.campeon }} llega a 1.000 partidas: te mostramos la principal. Prueba con «Todos» o con un rango más alto.</p>
      <div id="bpanel" role="tabpanel" :aria-labelledby="`bv-tab-${bv.key}`" tabindex="0">
        <div class="bsum"><b class="nm">{{ bv.n }}</b><span class="sub">{{ bv.sub }}</span><span class="st">Winrate <b>{{ bv.w }}</b> · {{ bv.g }} partidas · {{ bv.share }} de las builds</span></div>
        <div class="bc">
          <div class="bc-runes">
            <div class="tree">
              <div class="tr-h"><span class="sp ms" style="background-position: 88.889% 16.667%"></span><b>Precisión</b></div>
              <div v-for="(row, ri) in bv.pRows" :key="ri" class="tr-r" :class="{ kst: row.keystone }">
                <LolIcon v-for="r in row.r" :key="r.n" class="rn" :class="[r.on ? 'on' : '', row.keystone ? 'big' : '']" :pos="r.p" side="l" :label="r.label" :tip="{ name: r.n, meta: r.meta, desc: r.d }" />
              </div>
            </div>
            <div class="tree t2">
              <div class="tr-h"><span class="sp ms" style="background-position: 88.889% 33.333%"></span><b>Valor</b></div>
              <div v-for="(row, ri) in bv.sRows" :key="ri" class="tr-r">
                <LolIcon v-for="r in row.r" :key="r.n" class="rn" :class="r.on ? 'on' : ''" :pos="r.p" side="r" :label="r.label" :tip="{ name: r.n, meta: r.meta, desc: r.d }" />
              </div>
              <div class="shards">
                <div v-for="(row, ri) in bv.shRows" :key="ri" class="tr-r sh">
                  <LolIcon v-for="r in row.r" :key="r.n" class="rn sm" :class="r.on ? 'on' : ''" :pos="r.p" side="r" :label="r.label" :tip="{ name: r.n, meta: r.meta, desc: r.d }" />
                </div>
              </div>
            </div>
          </div>
          <div class="bc-mid">
            <div class="blk">
              <h4 aria-level="3">Hechizos · winrate y uso</h4>
              <div class="spl">
                <div v-for="s in bv.spells" :key="s.al" class="spl-r" :class="{ top: s.top }">
                  <LolIcon class="sq" :pos="s.a.p" :label="s.a.n" :tip="{ name: s.a.n, meta: s.a.m, desc: s.a.d }" />
                  <LolIcon class="sq" :pos="s.b.p" :label="s.b.n" :tip="{ name: s.b.n, meta: s.b.m, desc: s.b.d }" />
                  <span class="spl-n" :aria-label="s.al">{{ s.n }}</span><span class="spl-w">{{ s.w }}</span><span class="spl-u">{{ s.u }}</span>
                </div>
              </div>
            </div>
            <div class="blk">
              <h4 aria-level="3">Orden de mejora</h4>
              <div class="row so">
                <template v-for="(k, i) in raw.skillOrder" :key="k">
                  <svg v-if="i" class="arw" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg>
                  <LolIcon class="sq sk" :pos="abil(k).pos" :label="`${k}: ${abil(k).name}`" :tip="{ name: abil(k).name, meta: abil(k).meta, desc: abil(k).desc }"><b>{{ k }}</b></LolIcon>
                </template>
              </div>
              <p class="mini">Sube Q primero, luego E. W al final.</p>
            </div>
            <div class="blk">
              <h4 aria-level="3">Inicio</h4>
              <div class="row">
                <template v-for="(n, i) in ['Arco de Doran', 'Espada de Doran']" :key="n">
                  <span v-if="i" class="or">o</span>
                  <LolIcon class="it md" :pos="item(n).pos" :label="n" :tip="itemTip(n)" />
                </template>
                <LolIcon class="it md" :pos="item('Poción de vida').pos" label="Poción de vida" :tip="itemTip('Poción de vida')" />
              </div>
            </div>
            <div class="blk">
              <h4 aria-level="3">Botas</h4>
              <div class="row"><LolIcon v-for="it in bv.boots" :key="it.id" class="it md" :img="it.icon" :label="it.n" :tip="{ name: it.n, meta: it.m }" /></div>
            </div>
          </div>
          <div class="bc-items">
            <div class="blk">
              <h4 aria-level="3">Núcleo · orden real de compra</h4>
              <div class="row core">
                <span v-for="it in bv.core" :key="it.id" class="ci">
                  <LolIcon class="it lg" :img="it.icon" :label="it.n" :tip="{ name: it.n, meta: it.m }"><i>{{ it.k }}</i></LolIcon>
                  <svg v-if="it.more" class="arw" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18" /></svg>
                </span>
              </div>
            </div>
            <div class="blk">
              <h4 aria-level="3">Situacional</h4>
              <div class="row"><LolIcon v-for="it in bv.situ" :key="it.id" class="it md" :img="it.icon" :label="it.n" :tip="{ name: it.n, meta: it.m }" /></div>
            </div>
            <p class="mini">{{ bv.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Orden de habilidades -->
    <section class="card">
      <div class="card-h"><h2 class="disp">Orden de habilidades</h2><span class="meta">Nivel 1 a 18 · <span class="demo">Datos de ejemplo</span></span></div>
      <div class="sgrid">
        <div class="sg-head"><span></span><span v-for="n in 18" :key="n">{{ n }}</span></div>
        <div v-for="r in raw.skillRows" :key="r.key" class="sg-row" :class="`k${r.key}`">
          <span class="sg-k"><span class="sp ms" :style="{ backgroundPosition: r.pos }"></span>{{ r.name }}</span>
          <span v-for="(on, i) in r.levels" :key="i" :class="{ on }">{{ on ? r.key : "" }}</span>
        </div>
      </div>
    </section>

    <div class="stack2">
      <section class="card">
        <div class="card-h"><h2 class="disp">Qué comprar después</h2><span class="meta">Winrate por posición del objeto</span></div>
        <div class="slots">
          <div v-for="s in raw.slots" :key="s.label" class="slt">
            <h4 aria-level="3">{{ s.label }}</h4>
            <div v-for="o in s.options" :key="o.item" class="opt">
              <LolIcon class="it md" :pos="item(o.item).pos" :label="o.item" :tip="itemTip(o.item)" />
              <span class="ow"><b :class="{ hi: o.hi }">{{ o.wr }}</b><small>{{ o.games }}</small></span>
            </div>
          </div>
        </div>
      </section>
      <section class="card reco">
        <div class="card-h"><h2 class="disp">Cómo jugarlo</h2><span class="meta">Recomendaciones</span></div>
        <ol class="tips">
          <li v-for="(t, i) in raw.tips" :key="t.title"><span class="tn disp">{{ i + 1 }}</span><div><b>{{ t.title }}</b><p v-html="t.text"></p></div></li>
        </ol>
      </section>
    </div>

    <section class="card">
      <div class="card-h"><h2 class="disp">Winrate con cada objeto</h2><span class="meta">Partidas en las que lo completó</span></div>
      <div class="iw">
        <div class="iw-r th"><span></span><span>Objeto</span><span>Winrate</span><span>Partidas</span><span></span></div>
        <div v-for="r in raw.iw" :key="r.item" class="iw-r">
          <LolIcon class="it md" :pos="item(r.item).pos" :label="r.item" :tip="itemTip(r.item)" />
          <span class="iw-n"><b>{{ r.item }}</b><small>{{ r.sub }}</small></span>
          <span class="iw-w"><span class="wbar"><i :style="{ width: r.bar + '%' }"></i></span><b :class="{ hi: r.hi }">{{ r.wr }}</b></span>
          <span class="iw-g">{{ r.games }}</span>
          <span v-if="r.tag" class="tg2" :class="r.tag">{{ r.tagText }}</span><span v-else></span>
        </div>
      </div>
      <p class="hint" v-html="raw.iwHint"></p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { buildVariants, matchupSummary } from "@/services/lol/sample";
import LolIcon from "./LolIcon.vue";
import "./sample.css";

const props = defineProps({
  raw: { type: Object, required: true },
  rank: { type: String, default: "ALL" },
  rankLabel: { type: String, default: "Todos" },
});
const emit = defineEmits(["matchups"]);

const summary = computed(() => matchupSummary(props.raw, props.rank));
const variants = computed(() => buildVariants(props.raw, props.rank));
const pick = ref(null);
const bv = computed(() => variants.value.list.find((b) => b.key === pick.value) || variants.value.list[0]);

const abil = (k) => props.raw.abil.find((a) => a.key === k);
const item = (n) => props.raw.items[n];
const itemTip = (n) => {
  const i = props.raw.items[n];
  return { name: i.name, meta: i.gold, stats: i.stats, desc: i.desc };
};

function bvKeys(e) {
  const list = variants.value.list;
  const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  if (!dir && e.key !== "Home" && e.key !== "End") return;
  e.preventDefault();
  const i = list.indexOf(bv.value);
  const n = e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : (i + dir + list.length) % list.length;
  pick.value = list[n].key;
  requestAnimationFrame(() => document.getElementById(`bv-tab-${list[n].key}`)?.focus());
}
</script>

<style scoped>
.sample-stack { display: flex; flex-direction: column; gap: 20px; }
</style>
