<template>
  <div class="pk pk-dex">
    <PokeLoader />
    <PokeStatus v-if="status !== 'ready'" :status="status" :retry="retry" />
    <template v-if="v">


  

  <section class="dhead">
    <div class="wrap">
      <div class="dh-top">
        <div>
          <span class="kick"><i></i>Pokédex Nacional</span>
          <h1 class="h1 fd">Pokédex <span>{{ v.countTxt }}</span></h1>
          <p class="lead">Elige la generación del juego al que juegas: los tipos, las estadísticas y las reglas cambian a las de esa época.</p>
        </div>
        <div class="rules">
          <template v-for="(r, r_i) in v.rules" :key="r_i"><span :class="`rule ${r.cls}`"><i></i>{{ r.t }}</span></template>
        </div>
      </div>
      <div class="gens" role="group" aria-label="Generación">
<button type="button" :class="v.gb.g1" style="--rc: #E3350D; --rc2: #FFB703" @click="v.setGen.g1">Gen I<small>Kanto</small></button>
<button type="button" :class="v.gb.g2" style="--rc: #B8860B; --rc2: #6C7A89" @click="v.setGen.g2">Gen II<small>Johto</small></button>
<button type="button" :class="v.gb.g3" style="--rc: #B71C1C; --rc2: #1E5BD8" @click="v.setGen.g3">Gen III<small>Hoenn</small></button>
<button type="button" :class="v.gb.g4" style="--rc: #4C6CC9; --rc2: #D86FA0" @click="v.setGen.g4">Gen IV<small>Sinnoh</small></button>
<button type="button" :class="v.gb.g5" style="--rc: #3A3F47; --rc2: #9AA3AD" @click="v.setGen.g5">Gen V<small>Teselia</small></button>
<button type="button" :class="v.gb.g6" style="--rc: #2357B8; --rc2: #C52F3A" @click="v.setGen.g6">Gen VI<small>Kalos</small></button>
<button type="button" :class="v.gb.g7" style="--rc: #E68A00; --rc2: #6A4BD1" @click="v.setGen.g7">Gen VII<small>Alola</small></button>
<button type="button" :class="v.gb.g8" style="--rc: #0C8CCB; --rc2: #C8106E" @click="v.setGen.g8">Gen VIII<small>Galar</small></button>
<button type="button" :class="v.gb.g9" style="--rc: #C9302C; --rc2: #6A35A6" @click="v.setGen.g9">Gen IX<small>Paldea</small></button>
      </div>
    </div>
  </section>

  <section class="dbody">
    <div class="wrap">
      <div class="tools">
        <div class="search big">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <label class="sr" for="q-dex">Buscar Pokémon</label>
          <input id="q-dex" type="search" placeholder="Nombre o número…" :value="v.q" @input="v.onQ" autocomplete="off">
        </div>
        <div class="seg" role="group" aria-label="Ordenar">
          <template v-for="(s, s_i) in v.sorts" :key="s_i"><button type="button" :class="s.on" @click="s.pick">{{ s.n }}</button></template>
        </div>
        <button type="button" :class="`tgl ${v.onlyCls}`" @click="v.togOnly" :aria-pressed="v.onlyPr"><span class="sw"></span>Solo los de esta generación</button>
      </div>
      <div class="tchips" role="group" aria-label="Filtrar por tipo (máximo 2)">
        <template v-for="(t, t_i) in v.tchips" :key="t_i">
          <button type="button" :class="`tc t-${t.k} ${t.on}`" @click="t.pick" :aria-pressed="t.pr"><i class="ti"></i>{{ t.n }}</button>
        </template>
        <template v-if="v.hasT"><button type="button" class="tclear" @click="v.clearT">Quitar filtros</button></template>
      </div>

      <div class="dgrid">
        <div class="dlist">
          <div class="dl-h"><b>{{ v.shownTxt }}</b><span>{{ v.spriteTxt }}</span></div>
          <div class="cards">
            <template v-for="(c, c_i) in v.cards" :key="c_i">
              <button type="button" :class="`pc ${c.on}`" :style="`--tc: ${c.c}; --tc2: ${c.c2}`" @click="c.pick">
                <span class="pc-n">#{{ c.num }}</span>
                <span :class="c.sc" :style="`background-position: ${c.bp}`"></span>
                <b>{{ c.n }}</b>
                <span class="pc-t"><template v-for="(t, t_i) in c.t" :key="t_i"><span :class="`ty sm t-${t.k}`"><i></i>{{ t.n }}</span></template></span>
              </button>
            </template>
          </div>
          <template v-if="v.empty"><div class="slot emp"><b>Ningún Pokémon coincide</b>Prueba con otro tipo o quita la búsqueda.</div></template>
          <template v-if="v.more"><button type="button" class="btn-o more" @click="v.loadMore">Cargar {{ v.moreN }} más</button></template>
        </div>

        <aside class="prof" id="ficha" :style="`--tc: ${v.p.c}; --tc2: ${v.p.c2}; --tx: ${v.p.tx}`" aria-label="Ficha del Pokémon">
          <div class="pf-scr">
            <div class="leds" aria-hidden="true"><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i></div>
            <span class="pf-num fd">#{{ v.p.num }}</span>
            <span class="pf-gen">Gen {{ v.p.gen }}</span>
            <span :class="v.p.artCls" :style="`background-position: ${v.p.ap}`"></span>
            <template v-if="v.p.hasMega"><span class="pf-mega">{{ v.p.megaN }}</span></template>
          </div>
          <template v-if="v.p.hasMega"><div class="fsw" role="group" aria-label="Forma del Pokémon"><template v-for="(f, f_i) in v.forms" :key="f_i"><button type="button" :class="`fsw-b ${f.cls}`" :aria-pressed="f.pressed" @click="f.pick">{{ f.n }}</button></template></div></template><template v-if="v.p.isMegaForm"><p class="pf-stone"><span class="itm" :style="`background-position: ${v.p.stoneBp}`" aria-hidden="true"></span>Lleva la <b>{{ v.p.stoneN }}</b></p></template>
          <div class="pf-b">
            <div class="pf-h">
              <div><h2 class="fd">{{ v.p.n }}</h2><span class="genus">{{ v.p.genus }}</span></div>
              <div class="tys"><template v-for="(t, t_i) in v.p.t" :key="t_i"><span :class="`ty t-${t.k}`"><i></i>{{ t.n }}</span></template></div>
            </div>
            <div class="stats cmp">
              <template v-for="(s, s_i) in v.p.st" :key="s_i">
                <div class="st"><span>{{ s.n }}</span><b>{{ s.v }}</b><span class="bar"><i :style="`width: ${s.w}; --bc: ${s.c}`"></i></span></div>
              </template>
              <div class="st tot"><span>Total</span><b>{{ v.p.tot }}</b><span class="note">{{ v.p.stNote }}</span></div>
            </div>
            <div class="qk">
              <div class="qk-r"><small>Débil a</small><span class="qk-t"><template v-for="(w, w_i) in v.p.weak" :key="w_i"><span :class="`ty sm t-${w.k}`"><i></i>{{ w.n }}<em>{{ w.m }}</em></span></template></span></div>
              <template v-if="v.p.hasAb"><div class="qk-r"><small>Habilidad</small><span class="qk-ab"><b>{{ v.p.recAb }}</b><em>recomendada</em></span></div></template>
            </div>
            <button type="button" class="pf-more" @click="v.openM"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>Ver ficha completa<small>Debilidades, dónde capturarlo, movimientos{{ v.p.megaTxt }}</small></button>
          </div>
        </aside>
      </div>

      <template v-if="v.modal">
        <div class="mdl" :style="`--tc: ${v.p.c}; --tc2: ${v.p.c2}; --tx: ${v.p.tx}`" role="dialog" aria-modal="true" :aria-label="`Ficha completa de ${v.p.n}`">
          <button type="button" class="mdl-bg" @click="v.closeM" aria-label="Cerrar"></button>
          <div class="mdl-d">
            <div class="md-l">
              <div :class="`md-scr ${v.p.scrCls}`"><span :class="v.p.artCls" :style="`background-position: ${v.p.ap}`"></span><span class="pf-num fd">#{{ v.p.num }}</span></div>
              <template v-if="v.p.hasMega"><div class="fsw" role="group" aria-label="Forma del Pokémon"><template v-for="(f, f_i) in v.forms" :key="f_i"><button type="button" :class="`fsw-b ${f.cls}`" :aria-pressed="f.pressed" @click="f.pick">{{ f.n }}</button></template></div></template><template v-if="v.p.isMegaForm"><p class="pf-stone"><span class="itm" :style="`background-position: ${v.p.stoneBp}`" aria-hidden="true"></span>Lleva la <b>{{ v.p.stoneN }}</b></p></template>
              <h2 class="fd">{{ v.p.n }}</h2><span class="genus">{{ v.p.genus }} · Gen {{ v.p.gen }}</span>
              <div class="tys"><template v-for="(t, t_i) in v.p.t" :key="t_i"><span :class="`ty t-${t.k}`"><i></i>{{ t.n }}</span></template></div>
              <div class="facts"><span><small>Altura</small><b>{{ v.p.h }}</b></span><span><small>Peso</small><b>{{ v.p.w }}</b></span><span><small>Categoría</small><b>{{ v.p.cat }}</b></span></div>
              <template v-if="v.p.hasFl"><p class="flav">{{ v.p.fl }}</p></template>
              <div class="blk"><h4 aria-level="3">Evoluciones</h4>
                <div class="evo"><template v-for="(e, e_i) in v.p.evo" :key="e_i"><button type="button" :class="`ev ${e.on}`" @click="e.pick"><span class="ev-m">{{ e.m }}</span><span class="spr" :style="`background-position: ${e.bp}`"></span><b>{{ e.n }}</b></button></template></div>
              </div>
              <template v-if="v.p.hasMega">
                <div class="blk"><h4 aria-level="3">Megaevoluciones <small>{{ v.p.megaN }}</small></h4>
                  <div class="megs"><template v-for="(m, m_i) in v.p.megas" :key="m_i">
                    <article class="mg4" :style="`--c1: ${m.c1}; --c2: ${m.c2}`">
                      <div class="mg4-t"><span class="mgs" :style="`background-position: ${m.bp}`" role="img" :aria-label="m.n"></span>
                        <div><b class="fd">{{ m.n }}</b><span class="tys"><template v-for="(t, t_i) in m.t" :key="t_i"><span :class="`ty sm t-${t.k}`"><i></i>{{ t.n }}</span></template></span><span class="mab">{{ m.ab }}</span><span class="mst-st"><span class="itm" :style="`background-position: ${m.sbp}`" aria-hidden="true"></span>{{ m.stone }}</span></div></div>
                      <div class="mst"><template v-for="(x, x_i) in m.st" :key="x_i"><span><small>{{ x.n }}</small><b :class="x.d">{{ x.v }}</b></span></template><span class="tot"><small>Total</small><b>{{ m.tot }}</b></span></div>
                    </article>
                  </template></div>
                </div>
              </template>
              <template v-if="v.p.hasMech">
                <div class="blk"><h4 aria-level="3">Mecánicas de combate <small>{{ v.p.mechN }}</small></h4>
                  <div class="mech"><template v-for="(x, x_i) in v.p.mech" :key="x_i"><div class="mech-r"><template v-if="x.gx"><span class="gxa" :style="`background-position: ${x.gxp}`" role="img" :aria-label="x.gxl"></span></template><div><span class="mech-k">{{ x.k }}</span><b>{{ x.t }}</b><small>{{ x.d }}</small></div><span class="mech-its"><template v-for="(i, i_i) in x.its" :key="i_i"><span class="itm lg" :style="`background-position: ${i.bp}`" role="img" :aria-label="i.n" :title="i.n"></span></template></span></div></template></div>
                </div>
              </template>
              <template v-if="v.p.megaLate"><p class="muted mnote">Tiene megaevolución, pero llegaron en la Gen VI (X e Y). Cambia de generación para verla.</p></template>
            </div>
            <div class="md-r">
              <div class="md-top">
                <div class="ptabs m"><template v-for="(t, t_i) in v.mtabs" :key="t_i"><button type="button" :class="t.on" @click="t.pick">{{ t.n }}</button></template></div>
                <button type="button" class="md-x" @click="v.closeM" aria-label="Cerrar ficha"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>
              </div>

              <template v-if="v.mF">
                <div data-pane>
                <div class="stats">
                  <template v-for="(s, s_i) in v.p.st" :key="s_i"><div class="st"><span>{{ s.n }}</span><b>{{ s.v }}</b><span class="bar"><i :style="`width: ${s.w}; --bc: ${s.c}`"></i></span></div></template>
                  <div class="st tot"><span>Total</span><b>{{ v.p.tot }}</b><span class="note">{{ v.p.stNote }}</span></div>
                </div>
                <div class="blk"><h4 aria-level="3">Debilidades y resistencias <small>{{ v.chartTxt }}</small></h4>
                  <div class="wk"><template v-for="(g, g_i) in v.p.wk" :key="g_i"><div class="wg"><span :class="`mul ${g.cls}`">{{ g.m }}</span><span class="wt"><template v-for="(t, t_i) in g.t" :key="t_i"><span :class="`ty sm t-${t.k}`"><i></i>{{ t.n }}</span></template></span></div></template></div>
                </div>
                <div class="blk"><h4 aria-level="3">Habilidades</h4>
                  <template v-if="v.p.hasAb"><div class="abd"><template v-for="(a, a_i) in v.p.ab" :key="a_i"><div :class="`abx ${a.cls}`"><div><b>{{ a.n }}</b><small>{{ a.k }}</small><span class="rtag">{{ a.rec }}</span></div><p>{{ a.d }}</p></div></template></div>
                    <p class="why3">{{ v.p.abWhy }}</p></template>
                  <template v-if="v.p.noAb"><p class="muted">No existían en la Gen {{ v.genR }}: llegaron en Rubí y Zafiro (Gen III).</p></template>
                </div>
                <div class="blk"><h4 aria-level="3">Naturaleza recomendada</h4>
                  <template v-if="v.p.hasNat"><div class="abl row"><template v-for="(a, a_i) in v.p.nat" :key="a_i"><span class="ab good">{{ a.n }}<small>{{ a.k }}</small></span></template></div></template>
                  <template v-if="v.p.noNat"><p class="muted">Sin naturalezas en la Gen {{ v.genR }}.</p></template>
                </div>
              </div></template>

              <template v-if="v.mD">
                <div data-pane>
                <template v-if="v.p.kanto">
                  <div class="vers"><template v-for="(v, v_i) in v.vers" :key="v_i"><button type="button" :class="`vb ${v.cls} ${v.on}`" @click="v.pick">{{ v.n }}</button></template></div>
                  <ul class="locs"><template v-for="(l, l_i) in v.p.locs" :key="l_i"><li><span :class="`mth ${l.mc}`">{{ l.mt }}</span><span class="ln"><b>{{ l.n }}</b><small>{{ l.lv }}</small></span><span class="rate"><span class="bar"><i :style="`width: ${l.w}`"></i></span>{{ l.r }}</span></li></template></ul>
                  <template v-if="v.p.noLoc"><div class="slot"><b>{{ v.p.noLocT }}</b>{{ v.p.noLocS }}</div></template>
                  <a class="btn-o sm" href="/pokemon/kanto/mapa">Verlo en el mapa de Kanto <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg></a>
                </template>
                <template v-if="v.p.notKanto"><div class="slot tall"><b>Ubicaciones de la Gen {{ v.p.gen }}</b>Ruta, método y nivel en cada juego. Llegan con la guía de su región.</div></template>
              </div></template>

              <template v-if="v.mM">
                <div data-pane>
                <h4 aria-level="3" class="mh">Recomendados <small>{{ v.p.mvSrc }}</small></h4>
                <div class="rmv"><template v-for="(m, m_i) in v.p.rmv" :key="m_i"><span :class="`rmc t-${m.k}`"><i class="ti"></i><b>{{ m.n }}</b><small>{{ m.tn }}</small></span></template></div>
                <template v-if="v.p.kanto">
                  <h4 aria-level="3" class="mh">Por nivel <small>Rojo y Azul</small></h4>
                  <ul class="mvl"><template v-for="(m, m_i) in v.p.lv" :key="m_i"><li><span class="lvb">{{ m.l }}</span><span :class="`ty sm t-${m.k}`"><i></i>{{ m.tn }}</span><b>{{ m.n }}</b><span class="pw">{{ m.p }}</span></li></template></ul>
                  <h4 aria-level="3" class="mh">Con MT y MO</h4>
                  <div class="tmg"><template v-for="(m, m_i) in v.p.tm" :key="m_i"><span :class="`tmc t-${m.k}`"><small>{{ m.no }}</small>{{ m.n }}</span></template></div>
                </template>
              </div></template>

            </div>
          </div>
        </div>
      </template>
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
import { createDexEngine } from "@/components/pokemon/a/dexEngine";


const d0 = useGameData("/data/pokemon/pokedex.json");
const d1 = useGameData("/data/pokemon/pokedex-gen1.json");
const d2 = useGameData("/data/pokemon/mega.json");
const d3 = useGameData("/data/pokemon/pokedex-recomendados.json");
const sources = [d0, d1, d2, d3];
const status = computed(() => (sources.some((s) => s.status === "error") ? "error" : sources.every((s) => s.status === "ready") ? "ready" : "loading"));
const retry = () => sources.forEach((s) => s.status === "error" && s.reload());

const st = reactive({ g: 9, q: '', ft: [], sort: 'num', only: false, sel: 6, tab: 'f', ver: 'r', lim: 48, modal: false, mtab: 'f', form: null });
let engine = null;
const v = computed(() => {
  if (status.value !== "ready") return null;
  engine ||= createDexEngine({ ...toRaw(d0.data), ...toRaw(d1.data), ...toRaw(d2.data), ...toRaw(d3.data) }, st);
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




.mgs{display:block;background-image:url(/images/pokemon/artwork-megas.webp);background-size:1000% 1000%;background-repeat:no-repeat}
.pf-mega{position:absolute;left:16px;bottom:16px;z-index:2;padding:4px 10px;border-radius:999px;background:linear-gradient(90deg,#C2367A,#6D28D9);color:#FFF;font:700 11px/1.2 'Fredoka',sans-serif;letter-spacing:.04em}
.stats.cmp{margin-top:14px;gap:5px}
.stats.cmp .st{grid-template-columns:84px 36px minmax(0,1fr);font-size:12.5px}
.stats.cmp .st .bar{height:8px}
.qk{display:flex;flex-direction:column;gap:8px;margin-top:14px;padding:12px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}
.qk-r{display:grid;grid-template-columns:76px minmax(0,1fr);gap:8px;align-items:start}
.qk-r > small{padding-top:4px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8E97A5}
.qk-t{display:flex;flex-wrap:wrap;gap:4px}
.qk-t .ty em{margin-left:3px;font-style:normal;font-weight:700;opacity:.8}
.qk-ab{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.qk-ab b{font:600 15px/1.2 'Fredoka',sans-serif}
.qk-ab em{padding:2px 8px;border-radius:999px;background:rgba(124,243,176,.14);color:#7CF3B0;font-style:normal;font-size:11px;font-weight:700}
.pf-more{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;margin-top:14px;padding:14px;border-radius:18px;border:1.5px solid color-mix(in srgb,var(--tc) 60%,transparent);background:linear-gradient(135deg,color-mix(in srgb,var(--tc) 26%,#0E121B),#0E121B);color:#EEF1F6;font:700 16px/1.2 'Fredoka',sans-serif;cursor:pointer;transition:transform .2s,box-shadow .2s}
.pf-more svg{color:var(--tc)}
.pf-more small{font:500 12px/1.3 'IBM Plex Sans',sans-serif;color:#A3ACBA}
.pf-more:hover{transform:translateY(-2px);box-shadow:0 16px 30px -14px color-mix(in srgb,var(--tc) 80%,transparent)}
.mdl{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:24px}
.mdl-bg{position:absolute;inset:0;border:0;background:rgba(4,6,10,0.9);cursor:pointer}
.mdl-d{position:relative;display:grid;grid-template-columns:360px minmax(0,1fr);width:min(1120px,100%);max-height:calc(100vh - 48px);overflow:auto;border-radius:28px;background:#0E121B;border:1.5px solid color-mix(in srgb,var(--tc) 45%,transparent);box-shadow:0 60px 120px -40px rgba(0,0,0,.95);animation:pop2 .25s cubic-bezier(.2,.8,.2,1) both}
@keyframes pop2{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
.md-l{padding:20px;background:radial-gradient(90% 50% at 50% 0%,color-mix(in srgb,var(--tc) 40%,transparent),transparent 70%);border-right:1px solid rgba(255,255,255,.06)}
.md-scr{position:relative;display:grid;place-items:center;height:250px}
.md-scr .art{width:240px;height:240px;filter:drop-shadow(0 18px 24px rgba(0,0,0,.55))}
.md-scr .spr.big{width:200px;height:200px;image-rendering:pixelated}
.md-scr .g1s.big{width:168px;height:168px}
.md-scr .pf-num{top:0;right:0}
.md-l h2{margin:6px 0 0;font-size:34px;line-height:1}
.md-l .genus{display:block;margin:4px 0 8px;font-size:13px;color:#A3ACBA}
.md-r{padding:16px 22px 22px;min-width:0}
.md-top{position:sticky;top:-16px;z-index:3;display:flex;align-items:center;gap:10px;margin:-16px -22px 14px;padding:16px 22px 12px;background:#0E121B;border-bottom:1px solid rgba(255,255,255,.06)}
.ptabs.m{flex:1;grid-template-columns:repeat(3,minmax(0,1fr));margin:0}
.md-x{display:grid;place-items:center;width:40px;height:40px;flex-shrink:0;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#EEF1F6;cursor:pointer}
.md-x:hover{background:rgba(255,255,255,.08)}
.abd{display:flex;flex-direction:column;gap:6px}
.abx{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)}
.abx > div{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.abx b{font:600 15px/1.2 'Fredoka',sans-serif}
.abx small{font-size:11px;font-weight:600;color:#8E97A5;text-transform:uppercase;letter-spacing:.06em}
.abx .rtag:empty{display:none}
.abx .rtag{padding:2px 8px;border-radius:999px;background:rgba(124,243,176,.14);color:#7CF3B0;font-size:11px;font-weight:700}
.abx.rec{border-color:rgba(124,243,176,.35);background:rgba(124,243,176,.06)}
.abx.hid{border-style:dashed}
.abx p{margin:4px 0 0;font-size:13px;color:#C9D0DA}
.why3{margin:6px 0 0;font-size:12.5px;color:#8E97A5}
.abl.row{flex-direction:row;flex-wrap:wrap}
.rmv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-bottom:16px}
.rmc{min-width:0}
.rmc b{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mdl-d{overflow-x:hidden}
.rmc{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,var(--tc) 14%,#0E121B);border:1px solid color-mix(in srgb,var(--tc) 40%,transparent)}
.rmc .ti{width:22px;height:22px;background:var(--tc)}
.rmc .ti::after{background:var(--tx);inset:4.5px}
.rmc b{flex:1;font:600 14.5px/1.2 'Fredoka',sans-serif}
.rmc small{font-size:11px;color:#A3ACBA}
.megs{display:flex;flex-direction:column;gap:8px}
.mg4{padding:10px;border-radius:16px;background:radial-gradient(80% 100% at 0% 0%,color-mix(in srgb,var(--c1) 34%,#0E121B),#0E121B 75%);border:1px solid color-mix(in srgb,var(--c1) 40%,transparent);transition:transform .25s,border-color .25s}
.mg4:hover{transform:translateY(-2px);border-color:var(--c1)}
.mg4-t{display:grid;grid-template-columns:92px minmax(0,1fr);gap:10px;align-items:center}
.mg4 .mgs{width:92px;height:92px;filter:drop-shadow(0 10px 12px rgba(0,0,0,.5));transition:transform .4s}
.mg4:hover .mgs{transform:scale(1.06) rotate(-3deg)}
.mg4 b.fd{display:block;font-size:17px;line-height:1.1;margin-bottom:4px}
.mg4 .mab{display:block;margin-top:4px;font-size:12px;color:#C9D0DA}
.mg4 .mst{grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;margin-top:8px}
.mg4 .mst span{padding:4px 1px;border-radius:8px}
.mg4 .mst small{font-size:11px}
.mg4 .mst b{font-size:13px}
.mg4 .mst b.up::after,.mg4 .mst b.dn::after{font-size:7px;margin-left:1px}
.mnote{margin-top:12px}
.mg3{display:grid;grid-template-columns:150px minmax(0,1fr);gap:16px;align-items:center;padding:12px 16px 12px 12px;border-radius:20px;background:radial-gradient(70% 90% at 10% 50%,color-mix(in srgb,var(--c1) 35%,#0E121B),#0E121B 70%);border:1px solid color-mix(in srgb,var(--c1) 40%,transparent)}
.mg3 .mgs{width:150px;height:150px;filter:drop-shadow(0 12px 16px rgba(0,0,0,.5))}
.mg3-b b.fd{display:block;font-size:22px;margin-bottom:4px}
.mab{display:block;margin-top:6px;font-size:13px;color:#C9D0DA}
.mab b{color:#EEF1F6}
.mst{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin-top:10px}
.mst span{display:flex;flex-direction:column;align-items:center;padding:6px 2px;border-radius:10px;background:rgba(255,255,255,.05)}
.mst small{font-size:11px;color:#8E97A5}
.mst b{font:600 15px/1.1 'Fredoka',sans-serif}
.mst b.up{color:#7CF3B0}.mst b.up::after{content:"▲";margin-left:2px;font-size:11px}
.mst b.dn{color:#FF9A9A}.mst b.dn::after{content:"▼";margin-left:2px;font-size:11px}
.mst .tot{background:rgba(255,203,61,.12)}.mst .tot b{color:#FFCB3D}
@media (max-width:860px){.mdl{padding:0;align-items:end}.mdl-d{grid-template-columns:minmax(0,1fr);max-height:92vh;border-radius:24px 24px 0 0}.md-l{border-right:0}.ptabs.m{grid-template-columns:repeat(2,minmax(0,1fr))}.mg3{grid-template-columns:96px minmax(0,1fr)}.mg3 .mgs{width:96px;height:96px}.mst{grid-template-columns:repeat(4,minmax(0,1fr))}}

.dhead{position:relative;padding:44px 0 26px;overflow:hidden;isolation:isolate;border-bottom:1px solid rgba(255,255,255,.06)}
.dhead::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(600px 300px at 10% 0%,var(--g1,rgba(227,53,13,.25)),transparent 70%),radial-gradient(700px 320px at 90% 10%,rgba(91,108,255,.22),transparent 70%)}
.dh-top{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:22px}
.h1{margin:12px 0 0;font-size:clamp(40px,5vw,64px);font-weight:700;line-height:.95}
.h1>span{font-size:.5em;color:#FFCB3D;vertical-align:middle;margin-left:8px}
.lead{margin:12px 0 0;max-width:560px;color:#A3ACBA;font-size:15.5px}
.rules{display:flex;flex-wrap:wrap;gap:6px;max-width:470px;justify-content:flex-end}
.rule{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 12px;border-radius:999px;font-size:12.5px;font-weight:600;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#C9D0DA}
.rule i{width:8px;height:8px;border-radius:50%;background:#7CF3B0}
.rule.no{color:#8E97A5}
.rule.no i{background:#FF6B6B}
.rule.hl{border-color:rgba(255,203,61,.5);color:#FFE08A;background:rgba(255,203,61,.08)}
.rule.hl i{background:#FFCB3D}
.gens button{flex:1 1 0}

.dbody{padding-top:22px}
.tools{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.search.big{flex:1 1 280px}
.search.big input{height:48px;border-radius:999px;font-size:15px}
.tgl{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 14px 0 8px;border-radius:999px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#C9D0DA;font-size:13px;font-weight:600;cursor:pointer}
.tgl .sw{position:relative;width:36px;height:22px;border-radius:999px;background:rgba(255,255,255,.14);transition:background .2s}
.tgl .sw::after{content:"";position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#FFF;transition:transform .2s}
.tgl.on .sw{background:#FFCB3D}
.tgl.on .sw::after{transform:translateX(14px)}
.tchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.tc{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px 0 5px;border-radius:999px;border:1.5px solid color-mix(in srgb,var(--tc) 55%,transparent);background:color-mix(in srgb,var(--tc) 10%,transparent);color:#E2E6EC;font:600 13px/1 'Fredoka',sans-serif;cursor:pointer;transition:background .2s,transform .2s}
.tc .ti{width:22px;height:22px;background:var(--tc)}
.tc .ti::after{background:var(--tx);inset:4.5px}
.tc:hover{transform:translateY(-1px);background:color-mix(in srgb,var(--tc) 22%,transparent)}
.tc.on{background:var(--tc);color:var(--tx);border-color:var(--tc);box-shadow:0 8px 20px -10px var(--tc)}
.tc.on .ti{background:rgba(255,255,255,.9)}
.tc.on .ti::after{background:var(--tc)}
.tclear{height:34px;padding:0 12px;border:0;background:transparent;color:#FFCB3D;font-size:13px;font-weight:600;cursor:pointer;text-decoration:underline}

.dgrid{display:grid;grid-template-columns:minmax(0,1fr) 430px;gap:20px;margin-top:20px;align-items:start}
.dl-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;font-size:13px;color:#8E97A5}
.dl-h b{font:600 15px/1 'Fredoka',sans-serif;color:#EEF1F6}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:10px}
.pc{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 8px 12px;border-radius:20px;border:1.5px solid rgba(255,255,255,.06);background:radial-gradient(90% 70% at 50% 30%,color-mix(in srgb,var(--tc) 30%,transparent),transparent 72%),linear-gradient(180deg,#121722,#0D1119);color:#EEF1F6;cursor:pointer;transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .25s}
.pc:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--tc) 60%,transparent);box-shadow:0 18px 30px -18px var(--tc)}
.pc.on{border-color:var(--tc);box-shadow:0 0 0 3px color-mix(in srgb,var(--tc) 35%,transparent),0 18px 30px -18px var(--tc)}
.pc-n{align-self:flex-start;font:600 11.5px/1 'IBM Plex Sans',sans-serif;color:#7C8696}
.pc .spr{width:84px;height:84px;margin-top:-6px;transition:transform .3s}
.pc .g1s{width:56px;height:56px;margin-top:8px;margin:0 0 6px;filter:drop-shadow(0 2px 0 rgba(0,0,0,.4))}
.pc:hover .spr,.pc:hover .g1s{transform:translateY(-4px) scale(1.06)}
.pc b{font:600 15px/1.15 'Fredoka',sans-serif;text-align:center}
.pc-t{display:flex;gap:4px;flex-wrap:wrap;justify-content:center}
.pc .ty.sm{height:18px;font-size:11px;padding:0 6px 0 2px;gap:3px}
.pc-t{flex-wrap:nowrap}
.pc .ty.sm i{width:13px;height:13px}
.more{display:flex;margin:18px auto 0}
.emp{margin-top:10px;padding:40px}
.prof{position:sticky;top:132px;border-radius:28px;overflow:hidden;background:#0E121B;border:1.5px solid color-mix(in srgb,var(--tc) 45%,transparent);box-shadow:0 40px 80px -40px color-mix(in srgb,var(--tc) 70%,transparent)}
.pf-scr{position:relative;height:280px;display:grid;place-items:center;background:radial-gradient(70% 70% at 50% 55%,color-mix(in srgb,var(--tc) 70%,#0E121B) 0%,color-mix(in srgb,var(--tc2) 35%,#0E121B) 55%,#0E121B 100%);overflow:hidden}
.pf-scr::before{content:"";position:absolute;width:330px;height:330px;border-radius:50%;border:2px dashed rgba(255,255,255,.18);animation:spin 50s linear 6}
.pf-scr::after{content:"";position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(180deg,transparent,#0E121B)}
.pf-scr .art{position:relative;z-index:1;width:250px;height:250px;filter:drop-shadow(0 18px 24px rgba(0,0,0,.55));animation:fade .35s ease-out both}
.pf-scr .spr.big{position:relative;z-index:1;width:220px;height:220px;image-rendering:pixelated;filter:drop-shadow(0 18px 24px rgba(0,0,0,.55))}
.pf-scr .g1s.big{position:relative;z-index:1;width:168px;height:168px;filter:drop-shadow(0 6px 0 rgba(0,0,0,.35))}
.leds{position:absolute;left:16px;top:14px;z-index:2;display:flex;align-items:center;gap:6px}
.leds i{width:10px;height:10px;border-radius:50%;box-shadow:inset 0 -2px 0 rgba(0,0,0,.2)}
.leds .l0{width:26px;height:26px;background:radial-gradient(circle at 35% 35%,#BFE3FF,#3B8BFF 55%,#1A4FB5);border:3px solid #FFF;margin-right:4px}
.leds .l1{background:#FF5A5F}.leds .l2{background:#FFCB3D}.leds .l3{background:#4ADE80}
.pf-num{position:absolute;right:18px;top:12px;z-index:2;font-size:30px;font-weight:700;color:rgba(255,255,255,.9);text-shadow:0 2px 10px rgba(0,0,0,.4)}
.pf-gen{position:absolute;right:18px;top:50px;z-index:2;padding:3px 9px;border-radius:999px;background:rgba(0,0,0,.35);font-size:11px;font-weight:700;letter-spacing:.06em;color:#FFF}
.pf-b{padding:4px 22px 22px}
.pf-h{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;flex-wrap:wrap}
.pf-h h2{margin:0;font-size:32px;font-weight:700;line-height:1}
.genus{font-size:13px;color:#A3ACBA}
.tys{display:flex;gap:6px;flex-wrap:wrap}
.ptabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin:16px 0 14px;padding:4px;border-radius:14px;background:rgba(255,255,255,.04)}
.ptabs button{height:36px;border:0;border-radius:10px;background:transparent;color:#A7B0BE;font:600 13px/1 'IBM Plex Sans',sans-serif;cursor:pointer}
.ptabs button.on{background:var(--tc);color:var(--tx)}
.stats{display:flex;flex-direction:column;gap:7px}
.st{display:grid;grid-template-columns:92px 40px minmax(0,1fr);align-items:center;gap:10px;font-size:13px;color:#A3ACBA}
.st b{font:600 15px/1 'Fredoka',sans-serif;color:#EEF1F6;text-align:right}
.st .bar{height:10px}
.st.tot{margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
.st .note{font-size:11.5px;color:#FFE08A}
.blk{margin-top:18px}
.blk h4,.mh{margin:0 0 8px;font:600 12px/1 'IBM Plex Sans',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8E97A5}
.blk h4 small,.mh small{letter-spacing:0;text-transform:none;font-weight:500;color:#7F8695;margin-left:6px}
.wk{display:flex;flex-direction:column;gap:6px}
.wg{display:flex;align-items:flex-start;gap:10px}
.mul{flex-shrink:0;display:grid;place-items:center;width:44px;height:24px;border-radius:8px;font:700 12.5px/1 'Fredoka',sans-serif}
.mul.x4{background:#FF4D4D;color:#FFF}.mul.x2{background:#FF8A5B;color:#1F0A00}.mul.x05{background:#3DDC97;color:#06210F}.mul.x025{background:#22B07D;color:#FFF}.mul.x0{background:#0A0D14;color:#C9D0DA;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
.wt{display:flex;flex-wrap:wrap;gap:4px}
.blk.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.abl{display:flex;flex-direction:column;gap:5px}
.ab{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);font-size:13px;font-weight:600}
.ab small{font-size:11px;font-weight:600;color:#8E97A5;text-transform:uppercase;letter-spacing:.06em}
.ab.hid{border-style:dashed}
.ab.good{border-color:rgba(124,243,176,.3);background:rgba(124,243,176,.06)}
.muted{margin:0;font-size:12.5px;color:#8E97A5}
.evo{display:flex;align-items:stretch;gap:4px;flex-wrap:wrap}
.ev{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;flex:1 1 0;min-width:84px;padding:6px 4px 8px;border-radius:14px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:#EEF1F6;cursor:pointer}
.ev.on{border-color:var(--tc);background:color-mix(in srgb,var(--tc) 14%,transparent)}
.ev .spr{width:60px;height:60px}
.ev b{font:600 12.5px/1.1 'Fredoka',sans-serif}
.ev-m{font-size:11px;font-weight:600;color:#FFE08A;min-height:12px}
.facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:16px}
.facts span{padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.04)}
.facts small{display:block;font-size:11px;color:#8E97A5;text-transform:uppercase;letter-spacing:.08em}
.facts b{font:600 14px/1.3 'Fredoka',sans-serif}
.flav{margin:14px 0 0;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.04);border-left:3px solid var(--tc);font-size:13.5px;color:#C9D0DA;font-style:italic}
.vers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:12px}
.vb{height:40px;border-radius:12px;border:1.5px solid var(--vc);background:transparent;color:var(--vc);font:700 14px/1 'Fredoka',sans-serif;cursor:pointer}
.vb.on{background:var(--vc);color:#FFF;text-shadow:0 1px 2px rgba(0,0,0,.35)}
.vb.vr{--vc:#E3350D}.vb.va{--vc:#3B6FE0}.vb.vy{--vc:#E6B800}
.vb.vy.on{color:#2A2000;text-shadow:none}
.locs{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:6px}
.locs li{display:grid;grid-template-columns:78px minmax(0,1fr) 92px;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.035)}
.mth{display:grid;place-items:center;height:24px;border-radius:7px;font-size:11px;font-weight:700}
.m-walk{background:#2E7D4F;color:#D8FFE6}.m-fish{background:#2563EB;color:#DCE8FF}.m-surf{background:#0EA5E9;color:#E0F6FF}.m-gift{background:#DB2777;color:#FFE4F1}.m-trade{background:#7C3AED;color:#EEE4FF}.m-static{background:#D97706;color:#FFF3DC}
.ln b{display:block;font-size:13.5px}
.ln small{font-size:12px;color:#8E97A5}
.rate{display:flex;align-items:center;gap:6px;font:600 12.5px/1 'Fredoka',sans-serif}
.rate .bar{flex:1;height:6px}
.rate .bar i{background:var(--tc)}
.slot.tall{padding:36px 18px;margin-top:4px}
.btn-o.sm{height:42px;font-size:14px;padding:0 16px}
.mvl{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-direction:column;gap:4px}
.mvl li{display:grid;grid-template-columns:44px 96px minmax(0,1fr) 34px;align-items:center;gap:8px;padding:5px 8px;border-radius:10px;background:rgba(255,255,255,.03);font-size:13px}
.lvb{font:600 12px/1 'Fredoka',sans-serif;color:#FFE08A}
.pw{text-align:right;color:#8E97A5;font-size:12px}
.tmg{display:flex;flex-wrap:wrap;gap:5px}
.tmc{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 9px 0 4px;border-radius:8px;background:color-mix(in srgb,var(--tc) 18%,transparent);border:1px solid color-mix(in srgb,var(--tc) 45%,transparent);font-size:12px;font-weight:600}
.tmc small{display:grid;place-items:center;height:18px;padding:0 5px;border-radius:5px;background:var(--tc);color:var(--tx);font:700 11px/1 'Fredoka',sans-serif}

@media (max-width:1100px){.dgrid{grid-template-columns:minmax(0,1fr) 380px}}
@media (max-width:860px){
  .dgrid{grid-template-columns:minmax(0,1fr)}
  .prof{position:relative;top:0;order:-1}
  .rules{justify-content:flex-start}
  .gens{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -16px;padding:0 16px 4px}
  .gens::-webkit-scrollbar{display:none}
  .gens button{flex:0 0 auto}
  .tchips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:14px -16px 0;padding:0 16px 4px}
  .tchips::-webkit-scrollbar{display:none}
  .tc{flex-shrink:0}
}
@media (max-width:640px){
  .cards{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .pc .spr{width:68px;height:68px}
  .pc b{font-size:13.5px}
  .tools .seg{order:3;width:100%;overflow-x:auto}
  .tgl{order:2}
}
@media (max-width:560px){
  .pf-scr{height:230px}
  .pf-scr .art{width:200px;height:200px}
  .pf-b{padding:4px 16px 18px}
  .blk.two{grid-template-columns:minmax(0,1fr)}
  .st{grid-template-columns:78px 36px minmax(0,1fr)}
  .locs li{grid-template-columns:70px minmax(0,1fr);}
  .locs .rate{grid-column:2}
  .mvl li{grid-template-columns:40px 86px minmax(0,1fr)}
  .mvl .pw{display:none}
}

.pf-scr .mgs.big{position:relative;z-index:1;width:250px;height:250px;filter:drop-shadow(0 18px 24px rgba(0,0,0,.55));animation:megaIn .7s cubic-bezier(.2,.9,.2,1)}
.md-scr .mgs.big{width:240px;height:240px;filter:drop-shadow(0 18px 24px rgba(0,0,0,.55));animation:megaIn .7s cubic-bezier(.2,.9,.2,1)}
.md-scr.is-mega::before{content:"";position:absolute;left:50%;top:50%;width:230px;height:230px;margin:-115px 0 0 -115px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,90,165,.5),rgba(91,140,255,.28) 55%,rgba(255,203,61,.12) 75%,transparent);opacity:.75;animation:megaPulse 2.6s ease-in-out 6 alternate}
@keyframes megaIn{0%{transform:scale(.6);filter:brightness(4) drop-shadow(0 0 30px #fff)}60%{transform:scale(1.06)}100%{transform:scale(1)}}
@keyframes megaSpin{to{transform:rotate(360deg)}}
@keyframes megaPulse{from{opacity:.55}to{opacity:.9}}
.itm{display:inline-block;flex:none;width:32px;height:32px;background-image:url(/images/pokemon/objetos-mecanicas.webp);background-size:1600% 1100%;background-repeat:no-repeat}
.itm.lg{width:46px;height:46px}
.gxa{display:block;flex:none;width:84px;height:84px;background-image:url(/images/pokemon/gigamax.webp);background-size:600% 600%;background-repeat:no-repeat;filter:drop-shadow(0 8px 10px rgba(0,0,0,.5))}
.mst-st{display:flex;align-items:center;gap:6px;margin-top:4px;font-size:12.5px;color:#FFE7A3}
.mst-st .itm{width:30px;height:30px}
.pf-stone{display:flex;align-items:center;justify-content:center;gap:8px;margin:-2px 0 10px;font-size:13px;color:#DDE3EE}
.pf-stone b{color:#FFE7A3}
.mech{display:grid;gap:8px}
.mech-r{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.mech-r>div{min-width:0;flex:1 1 160px}
.mech-k{display:block;font:700 11px/1.2 'Fredoka',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#FFCB3D}
.mech-r b{display:block;font:600 14px/1.3 'IBM Plex Sans',sans-serif;color:#F1F3F8}
.mech-r small{display:block;margin-top:2px;color:#A9B1C2;font-size:12.5px;line-height:1.4}
.mech-its{display:flex;flex-wrap:wrap;gap:4px;width:100%}
.mech-its .itm{border-radius:10px;background-color:rgba(255,255,255,.05)}
.fsw{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:4px 0 10px}
.fsw-b{min-height:38px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#DDE3EE;font:600 13px 'IBM Plex Sans',sans-serif;cursor:pointer}
.fsw-b.on{border-color:transparent;background:linear-gradient(90deg,#FFCB3D,#FF5AA5,#5B8CFF);color:#0B0E1A}
@media (prefers-reduced-motion:reduce){.md-scr .mgs.big,.md-scr.is-mega::before{animation:none}}
</style>
