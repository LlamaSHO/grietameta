<template>
  <div class="pk pk-mechanics">
    <PokeLoader />
    <PokeStatus v-if="status !== 'ready'" :status="status" :retry="retry" />
    <template v-if="v">


  

  <section class="wrap mc-hero">
    <span class="kick"><i></i>Mecánicas de combate</span>
    <h1>Más allá de <span>evolucionar</span></h1>
    <p>Las transformaciones que cada generación añadió al combate: megaevoluciones con su megapiedra, movimientos Z, Dinamax y Gigamax, y teracristalización. Qué hacen, quién puede usarlas y en qué juegos.</p>
    <nav class="mc-jump" aria-label="Ir a una mecánica"><a href="#mega"><span class="mci mc-mega" aria-hidden="true">M</span>Megaevolución</a><a href="#z"><span class="mci mc-z" aria-hidden="true">Z</span>Movimientos Z</a><a href="#dinamax"><span class="mci mc-dx" aria-hidden="true">G</span>Dinamax y Gigamax</a><a href="#tera"><span class="mci mc-tera" aria-hidden="true">T</span>Teracristalización</a></nav>
  </section>

  <section class="wrap mc-sec" id="mega">
    <h2><span class="mci mc-mega" aria-hidden="true">M</span>Megaevolución</h2>
    <p class="mc-lead">Un Pokémon que lleva su megapiedra puede megaevolucionar una vez por combate: cambia de aspecto, sube sus estadísticas (100 puntos más en total) y a menudo cambia de tipo y de habilidad. Llegó en X e Y, siguió en Rubí Omega, Zafiro Alfa, Sol y Luna, y vuelve en Leyendas Pokémon: Z-A con megas nuevas.</p>
    <p class="mc-key"><span class="itm" :style="`background-position: ${v.key_mega}`" aria-hidden="true"></span><span>Necesitas la <b>Megapulsera</b> (o el Mega-Aro) y la megapiedra de cada Pokémon</span></p>
    <div class="mc-facts"><span><b>{{ v.megaCount }}</b> megaevoluciones</span><span><b>1</b> por combate</span><span><b>+100</b> estadísticas base</span><span>Rayquaza no usa piedra: necesita <b>Ascenso del Dragón</b></span></div>
    <div class="mc-filter" role="group" aria-label="Filtrar megaevoluciones"><template v-for="(f, f_i) in v.mfil" :key="f_i"><button type="button" :aria-pressed="f.pr" @click="f.pick">{{ f.n }}</button></template></div>
    <div class="mg-grid"><template v-for="(m, m_i) in v.megas" :key="m_i"><article class="mg" :style="`--c1: ${m.c1}; --c2: ${m.c2}`"><template v-if="m.isNew"><span class="new">Nueva</span></template><span class="mgs" :style="`background-position: ${m.bp}`" role="img" :aria-label="m.n"></span><b>{{ m.n }}</b><span class="tys"><template v-for="(t, t_i) in m.t" :key="t_i"><span :class="`ty sm t-${t.k}`"><i></i>{{ t.n }}</span></template></span><span class="stone"><span class="itm" :style="`background-position: ${m.sbp}`" aria-hidden="true"></span>{{ m.stone }}</span><small>{{ m.ab }} · total {{ m.tot }}</small></article></template></div>
  </section>

  <section class="wrap mc-sec" id="z">
    <h2><span class="mci mc-z" aria-hidden="true">Z</span>Movimientos Z</h2>
    <p class="mc-lead">Solo en Sol, Luna, Ultrasol y Ultraluna. Con un cristal Z y la pulsera Z, un movimiento del tipo del cristal se convierte una vez por combate en su movimiento Z, mucho más fuerte. Hay uno por tipo y otros exclusivos de ciertos Pokémon. Los nombres van en inglés: así aparecen en Showdown y en la mayoría de guías.</p>
    <p class="mc-key"><span class="itm" :style="`background-position: ${v.key_z}`" aria-hidden="true"></span><span>Necesitas la <b>Pulsera Z</b> y el cristal Z equipado</span></p>
    <div class="z-grid"><template v-for="(z, z_i) in v.zmoves" :key="z_i"><div :class="`zc t-${z.k}`"><span class="itm" :style="`background-position: ${z.bp}`" role="img" :aria-label="z.c"></span><span><b>{{ z.m }}</b><small>{{ z.c }} · tipo {{ z.n }}</small></span></div></template></div>
    <div class="zx-grid"><template v-for="(z, z_i) in v.zx" :key="z_i"><div class="zxc"><span class="itms"><span class="spr" :style="`background-position: ${z.bp}`" aria-hidden="true"></span><span class="itm" :style="`background-position: ${z.cbp}`" aria-hidden="true"></span></span><span><b>{{ z.m }}</b><small>{{ z.c }} · exclusivo de {{ z.n }}</small></span></div></template></div>
  </section>

  <section class="wrap mc-sec" id="dinamax">
    <h2><span class="mci mc-dx" aria-hidden="true">G</span>Dinamax y Gigamax</h2>
    <p class="mc-lead">En Espada y Escudo, cualquier Pokémon puede dinamizarse durante tres turnos: se hace gigante, dobla sus PS y sus ataques pasan a ser movimientos Max, que además cambian el clima o el terreno. Algunos tienen una forma Gigamax con otro aspecto y un movimiento G-Max propio.</p>
    <p class="mc-key"><span class="itm" :style="`background-position: ${v.key_dmax}`" aria-hidden="true"></span><span>Necesitas la <b>Maximuñequera</b>; la forma Gigamax se da con la <b>Maxiseta</b></span></p>
    <div class="mc-facts"><span><b>3</b> turnos</span><span><b>×2</b> PS</span><span><b>{{ v.gmaxCount }}</b> especies con forma Gigamax</span></div>
    <div class="gx-grid"><template v-for="(g, g_i) in v.gmax" :key="g_i"><div class="gx"><span class="gxa" :style="`background-position: ${g.bp}`" role="img" :aria-label="g.n"></span><b>{{ g.n }}</b></div></template></div>
  </section>

  <section class="wrap mc-sec" id="tera">
    <h2><span class="mci mc-tera" aria-hidden="true">T</span>Teracristalización</h2>
    <p class="mc-lead">En Escarlata y Púrpura, una vez por combate tu Pokémon puede teracristalizarse: cambia a su teratipo, que puede ser cualquiera de los 18 tipos o el Astral. Si el teratipo coincide con uno de sus tipos, sus ataques de ese tipo pegan aún más fuerte; si no, gana la ventaja de ese tipo nuevo.</p>
    <p class="mc-key"><span class="itm" :style="`background-position: ${v.key_tera}`" aria-hidden="true"></span><span>Necesitas el <b>Orbe Teracristal</b>; con 50 <b>teralitos</b> cambias el teratipo</span></p>
    <div class="tera-grid"><template v-for="(t, t_i) in v.tera" :key="t_i"><div :class="`tra t-${t.k} ${t.cls}`"><span class="itm" :style="`background-position: ${t.bp}`" aria-hidden="true"></span><b>{{ t.n }}</b><template v-if="t.hasSh"><span class="itm sh" :style="`background-position: ${t.sbp}`" role="img" :aria-label="t.sh" :title="t.sh"></span></template></div></template></div>
    <p class="mc-note">Datos de megaevoluciones (tipos, estadísticas y habilidades) de la Pokédex de GrietaMeta. Imágenes y nombres oficiales en español de megapiedras, cristales Z, teralitos y objetos clave: PokeAPI. Iconos de teratipo: Pokémon Showdown.</p>
  </section>

  
  

    </template>
  </div>
</template>

<script setup>
import { computed, reactive, toRaw } from "vue";
import { useGameData } from "@/composables/useGameData";
import PokeLoader from "@/components/pokemon/comun/PokeLoader.vue";
import PokeStatus from "@/components/pokemon/comun/PokeStatus.vue";
import { createMechanicsEngine } from "@/components/pokemon/a/mechanicsEngine";


const d0 = useGameData("/data/pokemon/mega.json");
const d1 = useGameData("/data/pokemon/mecanicas.json");
const sources = [d0, d1];
const status = computed(() => (sources.some((s) => s.status === "error") ? "error" : sources.every((s) => s.status === "ready") ? "ready" : "loading"));
const retry = () => sources.forEach((s) => s.status === "error" && s.reload());

const st = reactive({ mf: 'all' });
let engine = null;
const v = computed(() => {
  if (status.value !== "ready") return null;
  engine ||= createMechanicsEngine({ ...toRaw(d0.data), ...toRaw(d1.data) }, st);
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

.mgs{display:block;background-image:url(/images/pokemon/artwork-megas.webp);background-size:1000% 1000%;background-repeat:no-repeat}
.mc-hero{padding:56px 0 18px}
.mc-hero h1{margin:12px 0 0;font:700 clamp(44px,5.6vw,72px)/.95 'Fredoka',sans-serif}
.mc-hero h1 span{background:linear-gradient(90deg,#FFCB3D,#FF5AA5,#5B8CFF,#73CEC0);-webkit-background-clip:text;background-clip:text;color:transparent}
.mc-hero p{max-width:680px;margin:14px 0 0;font-size:16px;line-height:1.6;color:#C2C9D6}
.mc-jump{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.mc-jump a{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 16px 0 6px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#F1F3F8;font-weight:600;text-decoration:none}
.mc-jump a:hover{border-color:rgba(255,255,255,.4)}
.mc-jump .mci{width:36px;height:36px;border-radius:50%}
.mc-sec{padding:60px 0 0;scroll-margin-top:120px}
.mc-sec h2{display:flex;align-items:center;gap:14px;margin:0;font:700 clamp(30px,3.4vw,42px)/1.05 'Fredoka',sans-serif}
.mc-sec h2 .mci{width:46px;height:46px;border-radius:14px;font-size:20px}
.mc-lead{max-width:760px;margin:12px 0 20px;font-size:15.5px;line-height:1.65;color:#B9C1CE}
.itm{display:inline-block;flex:none;width:40px;height:40px;background-image:url(/images/pokemon/objetos-mecanicas.webp);background-size:1600% 1100%;background-repeat:no-repeat}
.mc-key{display:inline-flex;align-items:center;gap:8px;margin:0 0 16px;padding:6px 14px 6px 6px;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);font-size:13px;color:#DDE3EE}
.mc-key .itm{border-radius:50%;background-color:rgba(255,255,255,.06)}
.mc-key b{color:#FFF}
.mg .stone .itm{width:30px;height:30px}
.zc .itm{width:48px;height:48px}
.zxc .itms{display:flex;align-items:center;flex-shrink:0}
.zxc .itms .itm{width:36px;height:36px;margin-left:-10px}
.gxa{position:relative;display:block;width:112px;height:112px;background-image:url(/images/pokemon/gigamax.webp);background-size:600% 600%;background-repeat:no-repeat;filter:drop-shadow(0 10px 14px rgba(0,0,0,.55));transition:transform .35s}
.gx:hover .gxa{transform:scale(1.12)}
.gx b{text-align:center}
.tra .itm{width:44px;height:44px}
.tra .itm.sh{width:34px;height:34px;margin-left:auto;opacity:.95}
.tra::after,.gx::before{animation-play-state:paused}
.tra:hover::after,.gx:hover::before{animation-play-state:running}
.mc-facts{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 20px}
.mc-facts span{padding:8px 12px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);font-size:13px;color:#DDE3EE}
.mc-facts b{color:#FFF}
.mc-filter{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.mc-filter button{min-height:38px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#DDE3EE;font:600 13px 'IBM Plex Sans',sans-serif;cursor:pointer}
.mc-filter button[aria-pressed="true"]{border-color:transparent;background:linear-gradient(90deg,#FFCB3D,#FF5AA5,#5B8CFF);color:#0B0E1A}
.mg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.mg{position:relative;display:flex;flex-direction:column;gap:6px;padding:12px;border-radius:18px;border:1px solid rgba(255,255,255,.08);background:linear-gradient(160deg,color-mix(in srgb,var(--c1) 22%,#121626),#0F1220 70%);overflow:hidden;transition:transform .25s,border-color .25s}
.mg:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c1) 60%,transparent)}
.mg .mgs{width:120px;height:120px;margin:0 auto;filter:drop-shadow(0 10px 14px rgba(0,0,0,.5));transition:transform .35s}
.mg:hover .mgs{transform:scale(1.08) rotate(-3deg)}
.mg b{font:700 17px/1.1 'Fredoka',sans-serif}
.mg .tys{display:flex;gap:4px;flex-wrap:wrap}
.mg .stone{display:flex;align-items:center;gap:7px;font-size:12.5px;color:#DDE3EE}
.mg .stone i{width:16px;height:16px;flex-shrink:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF,var(--c1) 45%,var(--c2) 80%);box-shadow:0 0 10px var(--c1)}
.mg small{font-size:12px;color:#A3ACBA}
.mg .new{position:absolute;top:10px;right:10px;padding:3px 8px;border-radius:999px;background:#FFCB3D;color:#0B0E1A;font:700 10.5px 'IBM Plex Sans',sans-serif;letter-spacing:.04em;text-transform:uppercase}
.z-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px}
.zc{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;background:linear-gradient(90deg,color-mix(in srgb,var(--tc) 26%,#121626),#0F1220);border:1px solid color-mix(in srgb,var(--tc) 35%,transparent)}
.zc .zx{display:grid;place-items:center;width:40px;height:40px;flex-shrink:0;border-radius:10px;transform:rotate(45deg);background:linear-gradient(135deg,#FFE36B,#F2A93B);box-shadow:0 0 14px rgba(255,227,107,.35)}
.zc .zx span{transform:rotate(-45deg);font:800 15px 'Fredoka',sans-serif;color:#2A1A04}
.zc b{display:block;font-size:14.5px}
.zc small{display:block;font-size:12px;color:#C2C9D6}
.zx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;margin-top:16px}
.zxc{display:flex;align-items:center;gap:10px;padding:8px 12px 8px 6px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
.zxc .spr{width:56px;height:56px;flex-shrink:0;image-rendering:pixelated}
.zxc b{display:block;font-size:14px}
.zxc small{font-size:12px;color:#A3ACBA}
.gx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.gx{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;border-radius:16px;background:radial-gradient(circle at 50% 35%,rgba(255,77,109,.28),transparent 65%),#11131F;border:1px solid rgba(255,77,109,.25);overflow:hidden}
.gx::before{content:"";position:absolute;left:50%;top:38%;width:80px;height:80px;margin:-40px 0 0 -40px;border-radius:50%;border:2px solid rgba(255,77,109,.5);box-shadow:0 0 22px rgba(255,77,109,.5);animation:gxPulse 2.6s ease-in-out 6}
.gx .spr{position:relative;width:76px;height:76px;image-rendering:pixelated;transition:transform .35s}
.gx:hover .spr{transform:scale(1.25)}
.gx b{position:relative;font-size:13px}
@keyframes gxPulse{0%,100%{transform:scale(.85);opacity:.5}50%{transform:scale(1.1);opacity:1}}
.tera-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.tra{position:relative;display:flex;align-items:center;gap:10px;padding:12px;border-radius:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--tc) 32%,#121626),#0F1220);border:1px solid color-mix(in srgb,var(--tc) 40%,transparent);overflow:hidden}
.tra::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.18) 50%,transparent 65%);transform:translateX(-100%);animation:teraShine 4s ease-in-out 6}
.tra .gem{width:26px;height:30px;flex-shrink:0;clip-path:polygon(50% 0,100% 30%,82% 100%,18% 100%,0 30%);background:linear-gradient(160deg,#FFF,var(--tc) 60%)}
.tra b{font-size:14px}
.tra.stellar{--tc:#7C5CFF;background:linear-gradient(135deg,rgba(255,203,61,.25),rgba(255,90,165,.25),rgba(91,140,255,.25)),#0F1220}
.tra.stellar .gem{background:conic-gradient(#FFCB3D,#FF5AA5,#5B8CFF,#73CEC0,#FFCB3D)}
@keyframes teraShine{0%,60%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
.mc-note{margin:14px 0 0;font-size:12.5px;color:#8E97A6}
@media (prefers-reduced-motion:reduce){.gx::before,.tra::after{animation:none}.mg,.mg .mgs,.gx .spr{transition:none}}
</style>
