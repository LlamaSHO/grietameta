<template>
  <div class="pk pk-abilities">
    <PokeLoader />
    <PokeStatus v-if="status !== 'ready'" :status="status" :retry="retry" />
    <template v-if="v">


  

  <section class="ahead">
    <div class="wrap">
      <span class="kick"><i></i>Referencia</span>
      <h1 class="h1 fd">Habilidades, <em>movimientos</em> y naturalezas</h1>
      <p class="lead">Qué hace cada habilidad y cada movimiento, de qué tipo es y qué efecto tiene. Las habilidades y las naturalezas llegaron en la Gen III; los movimientos existen desde Rojo y Azul.</p>
      <nav class="tabs3" role="tablist" aria-label="Sección"><template v-for="(t, t_i) in v.tabs" :key="t_i"><button type="button" role="tab" :class="t.on" :aria-selected="t.pr" @click="t.pick"><b class="fd">{{ t.n }}</b><small>{{ t.s }}</small></button></template></nav>
    </div>
  </section>

  <template v-if="v.tabAb">
  <section data-pane class="sec" id="habilidades">
    <div class="wrap">
      <div class="tl2">
        <div class="search big"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><label class="sr" for="q-ab">Buscar habilidad</label><input id="q-ab" type="search" placeholder="Busca una habilidad o lo que hace…" :value="v.q" @input="v.onQ" autocomplete="off"></div>
        <span class="tl-n">{{ v.abShown }}</span>
      </div>
      <div class="fl"><span class="fl-l">Tipo</span><div class="tchips">
        <button type="button" :class="`tc gen ${v.gOn}`" @click="v.pickGen"><i class="dot"></i>General <small>{{ v.gCnt }}</small></button>
        <template v-for="(t, t_i) in v.abTypes" :key="t_i"><button type="button" :class="`tc t-${t.k} ${t.on}`" @click="t.pick"><i class="ti"></i>{{ t.n }} <small>{{ t.c }}</small></button></template>
      </div></div>
      <div class="fl"><span class="fl-l">Efecto</span><div class="echips"><template v-for="(c, c_i) in v.abChips" :key="c_i"><button type="button" :class="`ec e-${c.k} ${c.on}`" @click="c.pick">{{ c.n }}</button></template></div></div>
      <template v-for="(g, g_i) in v.groups" :key="g_i">
        <div class="grp">
          <div class="grp-h"><span :class="g.cls"><i :class="g.ic"></i>{{ g.n }}</span><small>{{ g.c }}</small></div>
          <div class="abgrid">
            <template v-for="(a, a_i) in g.items" :key="a_i">
              <article class="ac2" :style="`--k: ${a.c}`">
                <div class="ac-h"><b class="fd">{{ a.n }}</b><span class="gtag">Gen {{ a.g }}</span></div>
                <p>{{ a.t }}</p>
                <div class="ac-f"><template v-for="(c, c_i) in a.ch" :key="c_i"><span :class="`ec e-${c.k}`">{{ c.n }}</span></template></div>
              </article>
            </template>
          </div>
        </div>
      </template>
      <template v-if="v.abEmpty"><div class="slot"><b>Ninguna habilidad coincide</b>Prueba con otro tipo o efecto.</div></template>
      <template v-if="v.more"><button type="button" class="btn-o more" @click="v.loadMore">Ver más habilidades</button></template>
      <p class="hnote">Las habilidades no tienen tipo en el juego: aquí las agrupamos por el tipo con el que tienen que ver (Mar Llamas potencia el Fuego, Levitación libra de la Tierra…). Las que no dependen de ningún tipo van en «General». Si una le va bien a un Pokémon concreto lo verás en su ficha de la Pokédex.</p>
    </div>
  </section>
  </template>

  <template v-if="v.tabMv">
  <section data-pane class="sec" id="movimientos">
    <div class="wrap">
      <div class="tl2">
        <div class="search big"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><label class="sr" for="q-mv">Buscar movimiento</label><input id="q-mv" type="search" placeholder="Busca un movimiento…" :value="v.mq" @input="v.onMq" autocomplete="off"></div>
        <div class="seg"><template v-for="(c, c_i) in v.cats" :key="c_i"><button type="button" :class="c.on" @click="c.pick">{{ c.n }}</button></template></div>
        <div class="seg"><template v-for="(c, c_i) in v.msorts" :key="c_i"><button type="button" :class="c.on" @click="c.pick">{{ c.n }}</button></template></div>
      </div>
      <div class="fl"><span class="fl-l">Tipo</span><div class="tchips"><template v-for="(t, t_i) in v.mvTypes" :key="t_i"><button type="button" :class="`tc t-${t.k} ${t.on}`" @click="t.pick"><i class="ti"></i>{{ t.n }}</button></template></div></div>
      <div class="fl"><span class="fl-l">Efecto</span><div class="echips"><template v-for="(c, c_i) in v.mvChips" :key="c_i"><button type="button" :class="`ec ${c.on}`" @click="c.pick">{{ c.n }}</button></template></div></div>
      <div class="mtab">
        <div class="mr th"><span>Movimiento</span><span>Tipo</span><span>Categoría</span><span>Potencia</span><span>Precisión</span><span>PP</span><span>Efecto</span></div>
        <template v-for="(m, m_i) in v.mvs" :key="m_i">
          <div class="mr">
            <span class="mn"><b>{{ m.n }}</b><small>{{ m.d }}</small></span>
            <span><span :class="`ty sm t-${m.k}`"><i></i>{{ m.tn }}</span></span>
            <span><span :class="`cat c${m.c}`"><i></i>{{ m.cn }}</span></span>
            <span class="num fd">{{ m.p }}</span><span class="num fd">{{ m.a }}</span><span class="num fd">{{ m.pp }}</span>
            <span class="mch"><template v-for="(c, c_i) in m.ch" :key="c_i"><span class="ec sm">{{ c }}</span></template></span>
          </div>
        </template>
      </div>
      <div class="mfoot"><span>{{ v.mvShown }}</span><template v-if="v.mvMore"><button type="button" class="btn-o" @click="v.mvLoad">Ver 50 más</button></template></div>
    </div>
  </section>
  </template>

  <template v-if="v.tabNat">
  <section data-pane class="sec" id="naturalezas">
    <div class="wrap natw">
      <div>
        <div class="sec-h"><div><span class="kick"><i></i>Naturalezas</span><h2 class="h2">La tabla de las 25</h2><p>Cada naturaleza sube una estadística un 10 % y baja otra un 10 %. Las cinco de la diagonal no cambian nada.</p></div></div>
        <div class="nm">
          <span class="corner">sube ↓ · baja →</span>
          <span class="nh" style="--c: #FF7A59">−Ataque</span><span class="nh" style="--c: #FFCB3D">−Defensa</span><span class="nh" style="--c: #5B8CFF">−At. Esp.</span><span class="nh" style="--c: #62D2E8">−Def. Esp.</span><span class="nh" style="--c: #FF5AA5">−Velocidad</span>
          <template v-for="(r, r_i) in v.rows" :key="r_i">
            <span class="nh rh" :style="`--c: ${r.c}`">+{{ r.n }}</span>
            <template v-for="(c, c_i) in r.cells" :key="c_i">
              <button type="button" :class="`nc ${c.cls}`" :style="`--c: ${c.c}`" @click="c.pick">{{ c.n }}</button>
            </template>
          </template>
        </div>
      </div>
      <aside class="ndet" :style="`--c: ${v.nd.c}`">
        <span class="kick"><i></i>Naturaleza</span>
        <h3 class="fd">{{ v.nd.n }}</h3>
        <div class="nd-s"><span class="up">▲ {{ v.nd.up }}</span><span class="dn">▼ {{ v.nd.dn }}</span></div>
        <p>{{ v.nd.use }}</p>
        <h4 aria-level="3">Le va bien a</h4>
        <div class="nd-u"><template v-for="(m, m_i) in v.nd.mons" :key="m_i"><button type="button" class="nu" @click="m.pick"><span class="spr" :style="`background-position: ${m.bp}`"></span><small>{{ m.n }}</small></button></template></div>
      </aside>
    </div>
  </section>

  <section class="sec" id="recomendador">
    <div class="wrap">
      <div class="rec" :style="`--c1: ${v.rc.c1}; --c2: ${v.rc.c2}`">
        <div class="rec-l">
          <span class="kick"><i></i>Recomendador</span>
          <h2 class="h2">¿Qué naturaleza le pongo?</h2>
          <div class="search big"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><label class="sr" for="q-rc">Buscar Pokémon</label><input id="q-rc" type="search" placeholder="Escribe un Pokémon…" :value="v.rq" @input="v.onRq" autocomplete="off"></div>
          <template v-if="v.hasRs"><div class="sug"><template v-for="(s, s_i) in v.rs" :key="s_i"><button type="button" @click="s.pick"><span class="spr" :style="`background-position: ${s.bp}`"></span>{{ s.n }}</button></template></div></template>
          <div class="rmon"><span class="spr" :style="`background-position: ${v.rc.bp}`"></span><div><b class="fd">{{ v.rc.n }}</b><span class="tys"><template v-for="(t, t_i) in v.rc.t" :key="t_i"><span :class="`ty sm t-${t.k}`"><i></i>{{ t.n }}</span></template></span></div></div>
          <div class="rst"><template v-for="(s, s_i) in v.rc.st" :key="s_i"><div :class="`rsr ${s.cls}`"><span>{{ s.n }}</span><b>{{ s.v }}</b><span class="bar"><i :style="`width: ${s.w}; --bc: ${s.c}`"></i></span></div></template></div>
        </div>
        <div class="rec-r">
          <h4 aria-level="3">Mejores</h4>
          <template v-for="(b, b_i) in v.rc.best" :key="b_i"><div class="rn good"><b class="fd">{{ b.n }}</b><span>{{ b.k }}</span><small>{{ b.why }}</small></div></template>
          <h4 aria-level="3">Evita</h4>
          <template v-for="(b, b_i) in v.rc.worst" :key="b_i"><div class="rn bad"><b class="fd">{{ b.n }}</b><span>{{ b.k }}</span><small>{{ b.why }}</small></div></template>
          <p class="note">Recomendación automática según sus estadísticas base. En combate competitivo depende también del equipo y del set.</p>
        </div>
      </div>
      <div class="rules4">
        <div class="r4" style="--k: #FF7A59"><b class="fd">1</b><p><strong>Baja la estadística de ataque que no uses.</strong> Un atacante físico casi nunca necesita Ataque Especial.</p></div>
        <div class="r4" style="--k: #FFCB3D"><b class="fd">2</b><p><strong>Si es rápido, sube Velocidad.</strong> Superar a un rival concreto suele valer más que un 10 % de daño.</p></div>
        <div class="r4" style="--k: #5B8CFF"><b class="fd">3</b><p><strong>En Espacio Raro, baja Velocidad.</strong> Audaz o Mansa hacen que ataques antes con la sala activa.</p></div>
        <div class="r4" style="--k: #7CF3B0"><b class="fd">4</b><p><strong>¿Te salió una mala?</strong> Desde Espada y Escudo las mentas cambian el efecto de la naturaleza.</p></div>
      </div>
    </div>
  </section>
  </template>

  
  

    </template>
  </div>
</template>

<script setup>
import { computed, reactive, toRaw } from "vue";
import { useGameData } from "@/composables/useGameData";
import PokeLoader from "@/components/pokemon/comun/PokeLoader.vue";
import PokeStatus from "@/components/pokemon/comun/PokeStatus.vue";
import { createAbilitiesEngine } from "@/components/pokemon/a/abilitiesEngine";


const d0 = useGameData("/data/pokemon/habilidades.json");
const sources = [d0];
const status = computed(() => (sources.some((s) => s.status === "error") ? "error" : sources.every((s) => s.status === "ready") ? "ready" : "loading"));
const retry = () => sources.forEach((s) => s.status === "error" && s.reload());

const st = reactive({ tab: 'ab', q: '', at: null, ac: null, lim: 36, mq: '', mt: null, mc: -1, ms: 'n', mch: null, mlim: 50, nat: [2, 4], rec: 445, rq: '' });
let engine = null;
const v = computed(() => {
  if (status.value !== "ready") return null;
  engine ||= createAbilitiesEngine({ ...toRaw(d0.data) }, st);
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




.tabs3{display:flex;gap:8px;margin-top:22px;flex-wrap:wrap}
.tabs3 button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-width:200px;padding:12px 18px;border-radius:18px;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#EEF1F6;text-align:left;cursor:pointer;font:inherit;transition:border-color .2s,background .2s}
.tabs3 button b{font-size:20px}
.tabs3 button small{font-size:12.5px;color:#8E97A5}
.tabs3 button:hover{border-color:rgba(255,255,255,.3)}
.tabs3 button.on{border-color:#FFCB3D;background:linear-gradient(135deg,rgba(255,203,61,.16),rgba(255,255,255,.03))}
.tabs3 button.on small{color:#FFE08A}
.tl2{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.tl2 .search{flex:1;min-width:280px;max-width:520px}
.tl-n{font-size:14px;color:#8E97A5}
.fl{display:grid;grid-template-columns:70px minmax(0,1fr);gap:10px;align-items:start;margin-bottom:10px}
.fl-l{padding-top:7px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7F8695}
.tchips{display:flex;flex-wrap:wrap;gap:5px}
.tc{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 10px 0 4px;border-radius:999px;border:1px solid color-mix(in srgb,var(--tc,#8E97A5) 40%,transparent);background:color-mix(in srgb,var(--tc,#8E97A5) 10%,transparent);color:#D7DCE3;font:600 12px/1 'IBM Plex Sans',sans-serif;cursor:pointer}
.tc small{font-size:11px;color:#8E97A5}
.tc .ti{width:20px;height:20px;background:var(--tc)}
.tc .ti::after{background:var(--tx);inset:4px}
.tc.on{background:var(--tc,#8E97A5);color:var(--tx,#121212);border-color:transparent}
.tc.on small{color:inherit;opacity:.75}
.tc.gen{padding-left:10px}
.tc .dot,.ty.gen .dot{width:10px;height:10px;border-radius:50%;background:#8E97A5}
.tc.gen.on{background:#C9D0DA;color:#121212}
.echips{display:flex;flex-wrap:wrap;gap:5px}
.ec{display:inline-flex;align-items:center;height:28px;padding:0 10px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#C9D0DA;font:600 12px/1 'IBM Plex Sans',sans-serif;cursor:pointer;white-space:nowrap}
.ec.sm{height:22px;padding:0 7px;font-size:11px;cursor:default}
.ec.on{background:#FFCB3D;border-color:#FFCB3D;color:#1A1405}
.ec.e-dmg{color:#FFB0A0}.ec.e-up{color:#9BF0C0}.ec.e-down{color:#FFC48A}.ec.e-imm{color:#8DE8E0}.ec.e-heal{color:#FFB3DA}.ec.e-wx{color:#A6D8FF}.ec.e-field{color:#C8F08F}.ec.e-st{color:#D6B8FF}.ec.e-spd{color:#FFE48A}.ec.e-crit{color:#FFD27A}.ec.e-def{color:#A9C4FF}
.ec.on.e-dmg,.ec.on.e-up,.ec.on.e-down,.ec.on.e-imm,.ec.on.e-heal,.ec.on.e-wx,.ec.on.e-field,.ec.on.e-st,.ec.on.e-spd,.ec.on.e-crit,.ec.on.e-def,.ec.on.e-form,.ec.on.e-other{color:#1A1405}
.grp{margin-top:22px}
.grp-h{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.grp-h .ty{height:30px;padding:0 14px 0 5px;font-size:14px}
.grp-h .ty i{width:22px;height:22px}
.grp-h .ty.gen{background:#3A3F47;color:#EEF1F6;padding-left:12px;gap:8px}
.grp-h small{font-size:13px;color:#8E97A5}
.abgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.ac2{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border-radius:18px;background:#0D1119;border:1px solid rgba(255,255,255,.07);border-left:3px solid var(--k)}
.ac2 .ac-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
.ac2 .ac-h b{font-size:18px}
.gtag{font-size:11px;font-weight:600;color:#7F8695;white-space:nowrap}
.ac2 p{margin:0;font-size:14px;color:#C9D0DA;flex:1}
.ac2 .ac-f{display:flex;flex-wrap:wrap;gap:4px}
.ac2 .ac-f .ec{height:22px;padding:0 8px;font-size:11px;cursor:default}
.hnote{margin:18px 0 0;padding:12px 16px;border-radius:14px;border:1px dashed rgba(255,255,255,.12);font-size:13px;color:#8E97A5;max-width:900px}
.mtab{border-radius:20px;background:#0D1119;border:1px solid rgba(255,255,255,.07);overflow:hidden;margin-top:6px}
.mr{display:grid;grid-template-columns:minmax(0,2.4fr) 110px 110px 74px 80px 50px minmax(0,1.4fr);gap:12px;align-items:center;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.05)}
.mr:last-child{border-bottom:0}
.mr.th{padding:10px 16px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7F8695;background:rgba(255,255,255,.02)}
.mn b{display:block;font-size:14.5px}
.mn small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;color:#8E97A5;line-height:1.35}
.mr .num{font-size:15px;color:#EEF1F6}
.mch{display:flex;flex-wrap:wrap;gap:4px}
.cat{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px 0 5px;border-radius:999px;font-size:11.5px;font-weight:700}
.cat i{width:14px;height:14px;border-radius:50%}
.cat.c0{background:rgba(255,122,89,.16);color:#FFB0A0}.cat.c0 i{background:radial-gradient(circle,#FFE0D6 20%,#FF7A59 22% 60%,transparent 62%),conic-gradient(#FF7A59 0 12.5%,transparent 0 25%,#FF7A59 0 37.5%,transparent 0 50%,#FF7A59 0 62.5%,transparent 0 75%,#FF7A59 0 87.5%,transparent 0)}
.cat.c1{background:rgba(91,140,255,.16);color:#AFC6FF}.cat.c1 i{background:radial-gradient(circle,#5B8CFF 25%,transparent 27% 45%,#5B8CFF 47% 62%,transparent 64%)}
.cat.c2{background:rgba(201,208,218,.1);color:#C9D0DA}.cat.c2 i{background:linear-gradient(90deg,#C9D0DA 50%,#5D6676 50%)}
.mfoot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;font-size:13px;color:#8E97A5}
@media (max-width:1100px){.abgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.mr{grid-template-columns:minmax(0,2fr) 100px 100px 60px 70px}.mr > :nth-child(6),.mr > :nth-child(7){display:none}}
@media (max-width:860px){.abgrid{grid-template-columns:minmax(0,1fr)}.fl{grid-template-columns:minmax(0,1fr)}.mr{grid-template-columns:minmax(0,1fr) 90px 60px}.mr > :nth-child(3),.mr > :nth-child(5){display:none}.tabs3 button{min-width:0;flex:1}}

.ahead{position:relative;padding:48px 0 4px;overflow:hidden;isolation:isolate}
.ahead::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(520px 300px at 10% 10%,rgba(124,243,176,.16),transparent 70%),radial-gradient(520px 300px at 55% 0%,rgba(255,203,61,.14),transparent 70%),radial-gradient(520px 300px at 95% 20%,rgba(255,107,107,.16),transparent 70%)}
.h1{margin:12px 0 0;font-size:clamp(40px,5.6vw,74px);font-weight:700;line-height:.95}
.h1 em{font-style:normal;color:#FFCB3D}
.lead{margin:14px 0 0;color:#A3ACBA;max-width:640px;font-size:16px}
.jump{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}
.pk .jump a{display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#EEF1F6;text-decoration:none;font-size:14px;font-weight:600}
.pk .jump a:hover{border-color:#FFCB3D}
.verd{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.vcol{padding:16px;border-radius:24px;border:1px solid color-mix(in srgb,var(--k) 35%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--k) 16%,#0D1119),#0D1119 60%)}
.vcol.g{--k:#3DDC97}.vcol.b{--k:#FF6B6B}.vcol.s{--k:#FFCB3D}
.vh{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.vb{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--k);color:#0B0E15;font-size:20px;font-weight:700}
.vh b{font-size:22px;flex:1}
.vh small{font-size:12px;color:#A3ACBA}
.vc{display:flex;align-items:center;gap:10px;width:100%;padding:8px;margin-top:6px;border-radius:16px;border:1px solid rgba(255,255,255,.06);background:rgba(8,10,16,.55);color:#EEF1F6;text-align:left;cursor:pointer;transition:border-color .2s}
.vc:hover{border-color:var(--k)}
.vc .spr{width:64px;height:64px;flex-shrink:0;border-radius:12px;background-color:color-mix(in srgb,var(--k) 12%,transparent)}
.vc b{display:block;font-size:17px}
.vc small{display:block;font-size:12.5px;color:#A3ACBA;line-height:1.35}
.ab-tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:28px}
.search.big{flex:1 1 280px}
.search.big input{height:46px;border-radius:999px}
.gsel button{padding:0 10px}
.abl-h{margin:16px 0 10px;font-size:13px;color:#8E97A5}
.abgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.ac{display:flex;flex-direction:column;padding:14px 16px;border-radius:18px;background:#0D1119;border:1px solid rgba(255,255,255,.07);border-left:4px solid var(--k,#5A6272)}
.ac.g{--k:#3DDC97}.ac.b{--k:#FF6B6B}.ac.s{--k:#FFCB3D}
.ac.hit{box-shadow:0 0 0 2px var(--k)}
.ac-h{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ac-h b{font-size:17px}
.vtag{padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;background:color-mix(in srgb,var(--k,#5A6272) 20%,transparent);color:var(--k,#A3ACBA);white-space:nowrap}
.ac p{margin:6px 0 10px;font-size:13.5px;color:#B2BAC6;flex:1}
.ac-f{display:flex;justify-content:space-between;align-items:center;gap:8px}
.users{display:flex}
.users .spr{width:38px;height:38px;margin-right:-6px}
.ac-f small{font-size:11.5px;color:#7F8695;white-space:nowrap}
.more{display:flex;margin:16px auto 0}
.natw{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:24px;align-items:end}
.nm{display:grid;grid-template-columns:120px repeat(5,minmax(0,1fr));gap:6px}
.corner{display:flex;align-items:flex-end;font-size:11px;color:#7F8695;padding:0 0 6px}
.nh{display:flex;align-items:flex-end;justify-content:center;padding:8px 4px;border-radius:12px 12px 4px 4px;background:color-mix(in srgb,var(--c) 18%,transparent);color:var(--c);font:600 13px/1.1 'Fredoka',sans-serif;text-align:center}
.nh.rh{justify-content:flex-start;align-items:center;border-radius:12px 4px 4px 12px;padding:0 12px}
.nc{height:58px;border-radius:12px;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);background:color-mix(in srgb,var(--c) 22%,#0D1119);color:#FFF;font:600 15px/1 'Fredoka',sans-serif;cursor:pointer;transition:transform .15s,background .2s}
.nc:hover{transform:scale(1.05);background:color-mix(in srgb,var(--c) 40%,#0D1119)}
.nc.neu{background:rgba(255,255,255,.04);border-style:dashed;border-color:rgba(255,255,255,.2);color:#8E97A5}
.nc.on{background:var(--c);color:#0B0E15;box-shadow:0 10px 24px -10px var(--c)}
.nc.pop::after{content:"★";margin-left:4px;font-size:11px;color:#FFE08A}
.nc.on.pop::after{color:#0B0E15}
.ndet{padding:20px;border-radius:24px;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 22%,#0D1119),#0D1119 70%);border:1px solid color-mix(in srgb,var(--c) 45%,transparent)}
.ndet h3{margin:8px 0 0;font-size:36px;line-height:1}
.nd-s{display:flex;gap:8px;margin-top:12px}
.nd-s span{padding:6px 10px;border-radius:10px;font-size:13px;font-weight:700}
.nd-s .up{background:rgba(61,220,151,.15);color:#7CF3B0}.nd-s .dn{background:rgba(255,107,107,.15);color:#FF9A9A}
.ndet p{margin:12px 0 0;color:#C9D0DA;font-size:14px}
.ndet h4,.rec-r h4{margin:16px 0 8px;font:600 11.5px/1 'IBM Plex Sans',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8E97A5}
.nd-u{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.nu{display:flex;flex-direction:column;align-items:center;padding:4px 2px 6px;border-radius:12px;border:1px solid rgba(255,255,255,.06);background:rgba(8,10,16,.5);color:#EEF1F6;cursor:pointer}
.nu .spr{width:56px;height:56px}
.nu small{font-size:11.5px;font-weight:600}
.rec{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:28px;padding:28px;border-radius:30px;background:radial-gradient(70% 90% at 0% 0%,color-mix(in srgb,var(--c1) 35%,transparent),transparent 70%),radial-gradient(60% 80% at 100% 100%,color-mix(in srgb,var(--c2) 25%,transparent),transparent 70%),#0D1119;border:1px solid rgba(255,255,255,.08)}
.rec .search{margin-top:16px}
.sug{display:flex;flex-direction:column;gap:2px;margin-top:6px;padding:6px;border-radius:16px;background:#141925;border:1px solid rgba(255,255,255,.08)}
.sug button{display:flex;align-items:center;gap:10px;height:40px;padding:0 8px;border:0;border-radius:10px;background:transparent;color:#EEF1F6;font-size:14px;font-weight:600;cursor:pointer;text-align:left}
.sug button:hover{background:rgba(255,255,255,.06)}
.sug .spr{width:36px;height:36px}
.rmon{display:flex;align-items:center;gap:14px;margin-top:16px}
.rmon .spr{width:110px;height:110px;flex-shrink:0;border-radius:24px;background-color:rgba(255,255,255,.05)}
.rmon b{display:block;font-size:30px;line-height:1.05;margin-bottom:6px}
.tys{display:flex;gap:5px;flex-wrap:wrap}
.rst{display:flex;flex-direction:column;gap:6px;margin-top:16px}
.rsr{display:grid;grid-template-columns:86px 36px minmax(0,1fr);gap:10px;align-items:center;font-size:13px;color:#A3ACBA}
.rsr b{font:600 14px/1 'Fredoka',sans-serif;color:#EEF1F6;text-align:right}
.rsr.up span:first-child{color:#7CF3B0;font-weight:700}
.rsr.dn span:first-child{color:#FF9A9A;font-weight:700}
.rn{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;align-items:baseline;padding:12px 14px;margin-bottom:6px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(8,10,16,.55)}
.rn b{font-size:22px}
.rn span{font-size:13px;font-weight:700}
.rn small{grid-column:1 / -1;font-size:12.5px;color:#A3ACBA}
.rn.good{border-color:rgba(61,220,151,.35)}.rn.good span{color:#7CF3B0}
.rn.bad{border-color:rgba(255,107,107,.3)}.rn.bad span{color:#FF9A9A}
.note{margin:12px 0 0;font-size:12px;color:#7F8695}
.rules4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}
.r4{display:flex;gap:12px;padding:16px;border-radius:20px;background:#0D1119;border:1px solid rgba(255,255,255,.07)}
.r4 b{display:grid;place-items:center;flex-shrink:0;width:36px;height:36px;border-radius:50%;background:var(--k);color:#0B0E15;font-size:18px}
.r4 p{margin:0;font-size:13.5px;color:#A3ACBA}
.r4 strong{color:#EEF1F6}
@media (max-width:1100px){.abgrid{grid-template-columns:repeat(2,minmax(0,1fr))}.rules4{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:860px){
  .verd{grid-template-columns:minmax(0,1fr)}
  .natw,.rec{grid-template-columns:minmax(0,1fr)}
  .rec{padding:20px}
  .gsel{width:100%;overflow-x:auto;scrollbar-width:none}
}
@media (max-width:640px){
  .abgrid,.rules4{grid-template-columns:minmax(0,1fr)}
  .nm{grid-template-columns:64px repeat(5,minmax(0,1fr));gap:4px}
  .nh{font-size:11px;padding:6px 2px}
  .nh.rh{padding:0 6px;font-size:11px}
  .nc{height:48px;font-size:11.5px;border-radius:9px}
  .corner{font-size:11px}
  .rmon .spr{width:84px;height:84px}
}
</style>
