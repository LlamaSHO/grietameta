<template>
  <div class="pk pk-types">
    <PokeLoader />
    <PokeStatus v-if="status !== 'ready'" :status="status" :retry="retry" />
    <template v-if="v">


  

  <section class="thead">
    <div class="wrap">
      <div class="th-top">
        <div>
          <span class="kick"><i></i>Tabla de tipos</span>
          <h1 class="h1 fd">¿Quién le gana <span>a quién?</span></h1>
          <p class="lead">Fila = tipo del ataque, columna = tipo del Pokémon que lo recibe. Pasa el ratón para ver el cruce y toca una columna para calcular sus debilidades.</p>
        </div>
        <div class="rset" role="tablist" aria-label="Generación">
          <template v-for="(s, s_i) in v.sets" :key="s_i">
            <button type="button" role="tab" :class="`rs ${s.on}`" :style="`--rc: ${s.c}; --rc2: ${s.c2}`" :aria-selected="s.pr" @click="s.pick"><b class="fd">{{ s.n }}</b><small>{{ s.d }}</small></button>
          </template>
        </div>
      </div>
    </div>
  </section>

  <section class="tbody">
    <div class="wrap tgrid">
      <div class="mx-card">
        <div class="mx-legend"><span><i class="c2"></i>×2 súper eficaz</span><span><i class="c5"></i>×½ poco eficaz</span><span><i class="c0"></i>×0 no afecta</span><span><i class="cch"></i>Cambió en esta generación</span><b>{{ v.hoverTxt }}</b></div>
        <div class="mx-scroll">
          <div class="mx" :style="`--n: ${v.n}`" role="grid">
            <div class="corner"><span>ATQ ↓</span><span>DEF →</span></div>
            <template v-for="(c, c_i) in v.cols" :key="c_i">
              <div :class="`ch t-${c.k} ${c.hl} ${c.sel}`"><button type="button" @click="c.pick" :aria-label="`Defensa ${c.n}`"><i class="ti"></i><span>{{ c.n }}</span></button></div>
            </template>
            <template v-for="(r, r_i) in v.rows" :key="r_i">
              <div :class="`rh t-${r.k} ${r.hl}`"><button type="button" @click="r.pick" :aria-label="`Ataque ${r.n}`"><i class="ti"></i>{{ r.n }}</button></div>
              <template v-for="(x, x_i) in r.c" :key="x_i">
                <span :class="`cell ${x.cls}`" @mouseenter="x.hov">{{ x.v }}</span>
              </template>
            </template>
          </div>
        </div>
      </div>

      <aside class="calc" aria-label="Calculadora de debilidades">
        <div class="cmode seg"><template v-for="(m, m_i) in v.modes" :key="m_i"><button type="button" :class="m.on" @click="m.pick">{{ m.n }}</button></template></div>
        <template v-if="v.isDef">
          <div data-pane class="who" :style="`--c1: ${v.d1c}; --c2: ${v.d2c}`">
            <span class="spr" :style="`background-position: ${v.whoBp}`"></span>
            <div><small>Defensor</small><b class="fd">{{ v.whoName }}</b>
              <div class="tys"><template v-for="(t, t_i) in v.dts" :key="t_i"><span :class="`ty t-${t.k}`"><i></i>{{ t.n }}</span></template></div></div>
          </div>
          <div class="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <label class="sr" for="q-t">Buscar un Pokémon</label>
            <input id="q-t" type="search" placeholder="Busca un Pokémon…" :value="v.q" @input="v.onQ" autocomplete="off">
          </div>
          <template v-if="v.hasSug">
            <div class="sug"><template v-for="(s, s_i) in v.sug" :key="s_i"><button type="button" @click="s.pick"><span class="spr" :style="`background-position: ${s.bp}`"></span>{{ s.n }}</button></template></div>
          </template>
          <p class="hint">O elige hasta dos tipos:</p>
        </template>
        <template v-if="v.isAtk"><p class="hint">Elige el tipo del ataque:</p></template>
        <div class="tpick" :style="`--n: ${v.n}`">
          <template v-for="(t, t_i) in v.picks" :key="t_i">
            <button type="button" :class="`tp t-${t.k} ${t.on}`" @click="t.pick" :aria-pressed="t.pr" :title="t.n"><i class="tglyph"></i><span>{{ t.n }}</span></button>
          </template>
        </div>
        <div class="res">
          <div class="sum">{{ v.sumTxt }}</div>
          <template v-for="(g, g_i) in v.groups" :key="g_i">
            <div class="rg"><span :class="`mul ${g.cls}`">{{ g.m }}</span><span class="rl">{{ g.lbl }}</span><span class="wt"><template v-for="(t, t_i) in g.t" :key="t_i"><span :class="`ty sm t-${t.k}`"><i></i>{{ t.n }}</span></template></span></div>
          </template>
        </div>
      </aside>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-h"><div><span class="kick"><i></i>Lo que cambia</span><h2 class="h2">{{ v.setName }}: lo que tienes que saber</h2></div></div>
      <div class="quirks">
        <template v-for="(q, q_i) in v.quirks" :key="q_i">
          <article class="qk" :style="`--k: ${q.c}`">
            <div class="qk-v"><span :class="`ty t-${q.a}`"><i></i>{{ q.an }}</span><span class="arr">{{ q.op }}</span><span :class="`ty t-${q.d}`"><i></i>{{ q.dn }}</span></div>
            <h3 class="fd">{{ q.t }}</h3><p>{{ q.p }}</p>
          </article>
        </template>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="sec-h"><div><span class="kick"><i></i>Mini guía</span><h2 class="h2">Las mejores combinaciones defensivas</h2><p>Calculado con la tabla de esta generación: parejas de tipos con más resistencias e inmunidades y menos debilidades, con un Pokémon que la tiene.</p></div></div>
      <div class="combos">
        <template v-for="(c, c_i) in v.combos" :key="c_i">
          <article class="cb" :style="`--c1: ${c.c1}; --c2: ${c.c2}`">
            <span class="cb-r fd">{{ c.r }}</span>
            <span class="spr" :style="`background-position: ${c.bp}`"></span>
            <div class="tys"><span :class="`ty t-${c.a}`"><i></i>{{ c.an }}</span><span :class="`ty t-${c.b}`"><i></i>{{ c.bn }}</span></div>
            <b class="fd">{{ c.mon }}</b>
            <div class="cb-s"><span class="g">{{ c.res }} resiste</span><span class="z">{{ c.imm }} inmune</span><span class="w">{{ c.weak }} débil</span></div>
          </article>
        </template>
      </div>
      <div class="tri">
        <div class="tri-v" aria-hidden="true">
          <span class="tn t-fire"><i class="tglyph"></i></span><span class="tn t-grass"><i class="tglyph"></i></span><span class="tn t-water"><i class="tglyph"></i></span>
          <svg viewBox="0 0 200 180"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#FFCB3D"></path></marker></defs>
            <path d="M85 32 L42 118" stroke="#FFCB3D" stroke-width="3" fill="none" marker-end="url(#ah)" stroke-dasharray="6 5"></path>
            <path d="M60 146 L140 146" stroke="#FFCB3D" stroke-width="3" fill="none" marker-end="url(#ah)" stroke-dasharray="6 5"></path>
            <path d="M158 118 L115 32" stroke="#FFCB3D" stroke-width="3" fill="none" marker-end="url(#ah)" stroke-dasharray="6 5"></path></svg>
        </div>
        <div class="tri-t"><h3 class="fd">El triángulo para no olvidarlo</h3><p>Fuego quema Planta, Planta absorbe Agua y Agua apaga Fuego. Los iniciales de cada región siguen esta regla, así que tu rival siempre elige el que gana al tuyo.</p>
          <ul><li><b>Eléctrico</b> no afecta a Tierra.</li><li><b>Normal y Lucha</b> no afectan a Fantasma.</li><li><b>Dragón</b> no afecta a Hada (desde la Gen VI).</li><li><b>Tierra</b> no afecta a Volador.</li></ul></div>
      </div>
    </div>
  </section>

  
  

    </template>
  </div>
</template>

<script setup>
import { computed, reactive, toRaw } from "vue";
import { useGameData } from "@/composables/useGameData";
import PokeLoader from "@/components/pokemon/comun/PokeLoader.vue";
import PokeStatus from "@/components/pokemon/comun/PokeStatus.vue";
import { createTypesEngine } from "@/components/pokemon/a/typesEngine";


const d0 = useGameData("/data/pokemon/tipos.json");
const sources = [d0];
const status = computed(() => (sources.some((s) => s.status === "error") ? "error" : sources.every((s) => s.status === "ready") ? "ready" : "loading"));
const retry = () => sources.forEach((s) => s.status === "error" && s.reload());

const st = reactive({ set: 2, mode: 'def', dt: [10, 3], at: 10, who: 6, hr: 0, hc: 0, q: '' });
let engine = null;
const v = computed(() => {
  if (status.value !== "ready") return null;
  engine ||= createTypesEngine({ ...toRaw(d0.data) }, st);
  return engine.renderVals();
});

</script>

<style scoped>
@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bob{0%,100%{transform:translateY(0) rotate(var(--r0,0deg))}50%{transform:translateY(-12px) rotate(var(--r1,0deg))}}
@keyframes pulse{0%{box-shadow:0 0 0 0 var(--pc,rgba(255,203,61,.6))}70%{box-shadow:0 0 0 10px transparent}100%{box-shadow:0 0 0 0 transparent}}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes slide{from{background-position:0 0}to{background-position:-1792px 0}}
@keyframes gmFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}




.thead{position:relative;padding:44px 0 24px;overflow:hidden;isolation:isolate}
.thead::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(500px 260px at 5% 0%,rgba(74,222,128,.18),transparent 70%),radial-gradient(500px 260px at 60% 0%,rgba(248,113,113,.16),transparent 70%),radial-gradient(500px 300px at 100% 20%,rgba(91,108,255,.2),transparent 70%)}
.th-top{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap}
.h1{margin:12px 0 0;font-size:clamp(40px,5vw,64px);font-weight:700;line-height:.95}
.h1>span{background:linear-gradient(90deg,#4ADE80,#FFCB3D,#F87171);-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{margin:12px 0 0;max-width:560px;color:#A3ACBA;font-size:15.5px}
.rset{display:flex;gap:8px}
.rs{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:150px;padding:12px 16px;border-radius:18px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#C9D0DA;cursor:pointer;text-align:left;transition:transform .2s}
.rs b{font-size:18px}
.rs small{font-size:12px;color:#8E97A5}
.rs:hover{transform:translateY(-2px)}
.rs.on{background:linear-gradient(135deg,var(--rc),var(--rc2));border-color:transparent;color:#FFF}
.rs.on small{color:rgba(255,255,255,.85)}
.tbody{padding-top:10px}
.tgrid{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:20px;align-items:start}
.mx-card{padding:16px;border-radius:26px;background:#0D1119;border:1px solid rgba(255,255,255,.07)}
.mx-legend{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin:0 4px 12px;font-size:12.5px;color:#A3ACBA}
.mx-legend span{display:inline-flex;align-items:center;gap:6px}
.mx-legend i{width:14px;height:14px;border-radius:4px}
.mx-legend .c2{background:#22C55E}.mx-legend .c5{background:#EF4444}.mx-legend .c0{background:#05070B;box-shadow:inset 0 0 0 1px rgba(255,255,255,.3)}
.mx-legend .cch{background:transparent;box-shadow:inset 0 0 0 2px #FFCB3D}
.mx-legend b{margin-left:auto;font:600 13px/1 'Fredoka',sans-serif;color:#FFE08A}
.mx-scroll{overflow-x:auto}
.mx{display:grid;grid-template-columns:100px repeat(var(--n),33px);gap:3px;width:max-content;margin:0 auto}
.corner{align-self:end;padding-bottom:4px;text-align:left;font:700 11px/1.4 'IBM Plex Sans',sans-serif;letter-spacing:.08em;color:#7F8695}
.corner span{display:block}
.ch{height:98px;display:flex;align-items:flex-end}
.ch button{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;width:33px;height:96px;padding:6px 0;border:0;border-radius:10px;background:color-mix(in srgb,var(--tc) 20%,transparent);color:#EEF1F6;cursor:pointer;transition:background .2s}
.ch button span{writing-mode:vertical-rl;transform:rotate(180deg);font:600 12px/1 'Fredoka',sans-serif}
.ch .ti{width:22px;height:22px;background:var(--tc)}
.ch .ti::after{background:var(--tx);inset:4.5px}
.ch.hl button,.ch button:hover{background:color-mix(in srgb,var(--tc) 45%,transparent)}
.ch.sel button{background:var(--tc);color:var(--tx)}
.ch.sel .ti{background:rgba(255,255,255,.9)}
.ch.sel .ti::after{background:var(--tc)}
.rh button{display:flex;align-items:center;gap:7px;width:100px;height:33px;padding:0 8px 0 4px;border:0;border-radius:10px;background:color-mix(in srgb,var(--tc) 20%,transparent);color:#EEF1F6;font:600 12.5px/1 'Fredoka',sans-serif;cursor:pointer;text-align:left}
.rh .ti{width:24px;height:24px;background:var(--tc)}
.rh .ti::after{background:var(--tx);inset:5px}
.rh.hl button,.rh button:hover{background:color-mix(in srgb,var(--tc) 45%,transparent)}
.mx .cell{display:block;width:33px;height:33px;border-radius:8px;background:rgba(255,255,255,.035);text-align:center;font:700 13.5px/33px 'Fredoka',sans-serif;color:#FFF;cursor:default;transition:background .15s,transform .15s}
.mx .cell.x2{background:#22C55E;color:#04210F}
.mx .cell.x5{background:#EF4444;color:#2A0505}
.mx .cell.x0{background:#05070B;color:#9AA3AF;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22)}
.mx .cell.hl{filter:brightness(1.25)}
.mx .cell.hl.x1{background:rgba(255,255,255,.1)}
.mx .cell.hv{transform:scale(1.18);box-shadow:0 0 0 2px #FFF;position:relative;z-index:2}
.mx .cell.chg{box-shadow:inset 0 0 0 2.5px #FFCB3D}
.calc{position:sticky;top:132px;padding:18px;border-radius:26px;background:#0D1119;border:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:14px}
.cmode{display:grid;grid-template-columns:1fr 1fr}
.who{display:flex;align-items:center;gap:12px;padding:12px;border-radius:20px;background:linear-gradient(135deg,color-mix(in srgb,var(--c1) 45%,#0D1119),color-mix(in srgb,var(--c2) 35%,#0D1119))}
.who .spr{width:72px;height:72px;flex-shrink:0;border-radius:16px;background-color:rgba(0,0,0,.2)}
.who small{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.75)}
.who b{display:block;font-size:22px;line-height:1.1;margin:2px 0 6px}
.tys{display:flex;gap:5px;flex-wrap:wrap}
.calc .search input{height:44px;border-radius:999px}
.sug{display:flex;flex-direction:column;gap:2px;margin-top:-8px;padding:6px;border-radius:16px;background:#141925;border:1px solid rgba(255,255,255,.08)}
.sug button{display:flex;align-items:center;gap:10px;height:40px;padding:0 8px;border:0;border-radius:10px;background:transparent;color:#EEF1F6;font-size:14px;font-weight:600;cursor:pointer;text-align:left}
.sug button:hover{background:rgba(255,255,255,.06)}
.sug .spr{width:36px;height:36px}
.hint{margin:0 0 -6px;font-size:12.5px;color:#8E97A5}
.tpick{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}
.tp{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 2px 6px;border-radius:14px;border:1.5px solid transparent;background:color-mix(in srgb,var(--tc) 14%,transparent);color:#D7DCE3;cursor:pointer;transition:transform .2s,background .2s}
.tp .tglyph{width:22px;height:22px;background:var(--tc)}
.tp span{font-size:11px;font-weight:600;white-space:nowrap}
.tp:hover{transform:translateY(-2px);background:color-mix(in srgb,var(--tc) 28%,transparent)}
.tp.on{background:var(--tc);color:var(--tx);border-color:rgba(255,255,255,.7)}
.tp.on .tglyph{background:var(--tx)}
.res{display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid rgba(255,255,255,.07)}
.sum{font:600 14px/1.35 'Fredoka',sans-serif;color:#FFE08A}
.rg{display:grid;grid-template-columns:46px minmax(0,1fr);gap:4px 10px;align-items:start}
.rl{font-size:12px;color:#8E97A5;align-self:center}
.rg .wt{grid-column:2;display:flex;flex-wrap:wrap;gap:4px}
.mul{display:grid;place-items:center;width:46px;height:24px;border-radius:8px;font:700 12.5px/1 'Fredoka',sans-serif;grid-row:span 2}
.mul.x4{background:#FF4D4D;color:#FFF}.mul.x2{background:#FF8A5B;color:#1F0A00}.mul.x1{background:rgba(255,255,255,.1);color:#C9D0DA}.mul.x05{background:#3DDC97;color:#06210F}.mul.x025{background:#22B07D;color:#FFF}.mul.x0{background:#0A0D14;color:#C9D0DA;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
.quirks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.qk{padding:18px;border-radius:22px;background:linear-gradient(180deg,color-mix(in srgb,var(--k) 14%,#0D1119),#0D1119 70%);border:1px solid color-mix(in srgb,var(--k) 35%,transparent)}
.qk-v{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.arr{display:grid;place-items:center;min-width:44px;height:26px;padding:0 8px;border-radius:8px;background:var(--k);color:#0B0E15;font:700 13px/1 'Fredoka',sans-serif}
.qk h3{margin:14px 0 0;font-size:19px;font-weight:600;line-height:1.2}
.qk p{margin:6px 0 0;font-size:13.5px;color:#A3ACBA}
.combos{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}
.cb{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 10px 14px;border-radius:22px;overflow:hidden;background:linear-gradient(160deg,color-mix(in srgb,var(--c1) 40%,#0D1119),color-mix(in srgb,var(--c2) 40%,#0D1119));border:1px solid rgba(255,255,255,.08);text-align:center}
.cb-r{position:absolute;left:12px;top:8px;font-size:22px;font-weight:700;color:rgba(255,255,255,.5)}
.cb .spr{width:88px;height:88px}
.cb .tys{justify-content:center}
.cb b{font-size:16px}
.cb-s{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;font-size:11px;font-weight:700}
.cb-s span{padding:3px 7px;border-radius:999px}
.cb-s .g{background:rgba(61,220,151,.18);color:#7CF3B0}.cb-s .z{background:rgba(0,0,0,.35);color:#E2E6EC}.cb-s .w{background:rgba(255,77,77,.18);color:#FF9A9A}
.tri{display:grid;grid-template-columns:260px minmax(0,1fr);gap:28px;align-items:center;margin-top:18px;padding:24px;border-radius:26px;background:#0D1119;border:1px solid rgba(255,255,255,.07)}
.tri-v{position:relative;width:220px;height:198px;margin:0 auto}
.tri-v svg{position:absolute;inset:0;width:100%;height:100%}
.tn{position:absolute;display:grid;place-items:center;width:62px;height:62px;border-radius:50%;background:var(--tc);color:var(--tx);box-shadow:0 10px 24px -8px var(--tc)}
.tn .tglyph{width:30px;height:30px}
.tn.t-fire{left:79px;top:0}.tn.t-grass{left:0;top:136px}.tn.t-water{right:0;top:136px}
.tri-t h3{margin:0;font-size:24px;font-weight:600}
.tri-t p{margin:8px 0 0;color:#A3ACBA}
.tri-t ul{margin:12px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;font-size:13.5px;color:#C9D0DA}
.tri-t li::before{content:"";display:inline-block;width:7px;height:7px;margin-right:8px;border-radius:50%;background:#FFCB3D;vertical-align:middle}
@media (max-width:1180px){.tgrid{grid-template-columns:minmax(0,1fr)}.calc{position:relative;top:0}.combos{grid-template-columns:repeat(3,minmax(0,1fr))}.quirks{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:860px){
  .rset{width:100%;overflow-x:auto;scrollbar-width:none}
  .rs{min-width:132px;flex:1 0 auto}
  .calc{order:-1}
  .mx-card{padding:10px;border-radius:20px}
  .tri{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:640px){
  .mx{grid-template-columns:72px repeat(var(--n),26px);gap:2px}
  .mx .cell{width:26px;height:26px;font-size:11px;line-height:26px;border-radius:6px}
  .ch{height:76px}
  .ch button{width:26px;height:74px}
  .ch button span{font-size:11px}
  .ch .ti{width:18px;height:18px}
  .rh button{width:72px;height:26px;font-size:11px;gap:4px}
  .rh .ti{width:18px;height:18px}
  .rh .ti::after{inset:3.5px}
  .tpick{grid-template-columns:repeat(6,minmax(0,1fr))}
  .tp span{display:none}
  .combos{grid-template-columns:repeat(2,minmax(0,1fr))}
  .quirks{grid-template-columns:minmax(0,1fr)}
  .tri-t ul{grid-template-columns:minmax(0,1fr)}
  .mx-legend b{margin-left:0;width:100%}
}
</style>
