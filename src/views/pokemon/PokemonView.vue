<template>
  <div class="pk pk-home">
    <PokeStatus v-if="status !== 'ready'" :status="status" :retry="retry" />
    <template v-if="v">


  

  <!-- HERO -->
  <section class="hero">
    <div class="hero-bg" aria-hidden="true"><span class="b1"></span><span class="b2"></span><span class="b3"></span><span class="b4"></span></div>
    <div class="wrap hero-in">
      <div class="htx">
        <span class="kick"><i></i>Pokémon · Guía en español</span>
        <h1 class="h1 fd">Todo Pokémon,<span>de Kanto <em>al meta</em></span></h1>
        <p class="lead">Pokédex con los 1025, tabla de tipos por generación, guías de cada región al 100 % y el meta competitivo actualizado cada reglamento.</p>
        <div class="ctas">
          <a class="btn-y" href="/pokemon/pokedex"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="3" width="7" height="7" rx="2"></rect><rect x="3" y="14" width="7" height="7" rx="2"></rect><rect x="14" y="14" width="7" height="7" rx="2"></rect></svg>Abrir la Pokédex</a>
          <a class="btn-o" href="#meta">Ver el meta de hoy</a>
        </div>
        <div class="kpis">
          <div class="kp" style="--k: #FFCB3D"><b>1025</b><span>Pokémon</span></div>
          <div class="kp" style="--k: #FF7A59"><b>18</b><span>tipos</span></div>
          <div class="kp" style="--k: #5B8CFF"><b>9</b><span>regiones</span></div>
          <div class="kp" style="--k: #7AD27A"><b>314</b><span>habilidades</span></div>
        </div>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="ring"></div>
        <div class="ring2"></div>
        <div class="wheel"><span class="wb t-normal" style="--a: 0deg" title="Normal"><i class="tglyph"></i></span>
<span class="wb t-fighting" style="--a: 20deg" title="Lucha"><i class="tglyph"></i></span>
<span class="wb t-flying" style="--a: 40deg" title="Volador"><i class="tglyph"></i></span>
<span class="wb t-poison" style="--a: 60deg" title="Veneno"><i class="tglyph"></i></span>
<span class="wb t-ground" style="--a: 80deg" title="Tierra"><i class="tglyph"></i></span>
<span class="wb t-rock" style="--a: 100deg" title="Roca"><i class="tglyph"></i></span>
<span class="wb t-bug" style="--a: 120deg" title="Bicho"><i class="tglyph"></i></span>
<span class="wb t-ghost" style="--a: 140deg" title="Fantasma"><i class="tglyph"></i></span>
<span class="wb t-steel" style="--a: 160deg" title="Acero"><i class="tglyph"></i></span>
<span class="wb t-fire" style="--a: 180deg" title="Fuego"><i class="tglyph"></i></span>
<span class="wb t-water" style="--a: 200deg" title="Agua"><i class="tglyph"></i></span>
<span class="wb t-grass" style="--a: 220deg" title="Planta"><i class="tglyph"></i></span>
<span class="wb t-electric" style="--a: 240deg" title="Eléctrico"><i class="tglyph"></i></span>
<span class="wb t-psychic" style="--a: 260deg" title="Psíquico"><i class="tglyph"></i></span>
<span class="wb t-ice" style="--a: 280deg" title="Hielo"><i class="tglyph"></i></span>
<span class="wb t-dragon" style="--a: 300deg" title="Dragón"><i class="tglyph"></i></span>
<span class="wb t-dark" style="--a: 320deg" title="Siniestro"><i class="tglyph"></i></span>
<span class="wb t-fairy" style="--a: 340deg" title="Hada"><i class="tglyph"></i></span></div>
        <div class="gstage"><figure class="glf" style="--i: 0"><img loading="lazy" decoding="async" class="g0" src="/images/pokemon/art-10035.webp" alt=""><img loading="lazy" decoding="async" class="gr" src="/images/pokemon/art-10035.webp" alt=""><img loading="lazy" decoding="async" class="gc" src="/images/pokemon/art-10035.webp" alt=""></figure><figure class="glf" style="--i: 1"><img loading="lazy" decoding="async" class="g0" src="/images/pokemon/art-903.webp" alt=""><img loading="lazy" decoding="async" class="gr" src="/images/pokemon/art-903.webp" alt=""><img loading="lazy" decoding="async" class="gc" src="/images/pokemon/art-903.webp" alt=""></figure><figure class="glf" style="--i: 2"><img loading="lazy" decoding="async" class="g0" src="/images/pokemon/art-150.webp" alt=""><img loading="lazy" decoding="async" class="gr" src="/images/pokemon/art-150.webp" alt=""><img loading="lazy" decoding="async" class="gc" src="/images/pokemon/art-150.webp" alt=""></figure><figure class="glf" style="--i: 3"><img loading="lazy" decoding="async" class="g0" src="/images/pokemon/art-10309.webp" alt=""><img loading="lazy" decoding="async" class="gr" src="/images/pokemon/art-10309.webp" alt=""><img loading="lazy" decoding="async" class="gc" src="/images/pokemon/art-10309.webp" alt=""></figure><figure class="glf" style="--i: 4"><img loading="lazy" decoding="async" class="g0" src="/images/pokemon/art-1007.webp" alt=""><img loading="lazy" decoding="async" class="gr" src="/images/pokemon/art-1007.webp" alt=""><img loading="lazy" decoding="async" class="gc" src="/images/pokemon/art-1007.webp" alt=""></figure><figure class="glf" style="--i: 5"><img loading="lazy" decoding="async" class="g0" src="/images/pokemon/art-983.webp" alt=""><img loading="lazy" decoding="async" class="gr" src="/images/pokemon/art-983.webp" alt=""><img loading="lazy" decoding="async" class="gc" src="/images/pokemon/art-983.webp" alt=""></figure><div class="gbars"><i></i><i></i><i></i><i></i><i></i></div><div class="gscan"></div></div><div class="glabel"><span class="gt" style="--i: 0"><b class="fd">Mega Charizard Y</b><small>Nº 4 del meta · 32 %</small></span><span class="gt" style="--i: 1"><b class="fd">Sneasler</b><small>Nº 1 del meta · 50 %</small></span><span class="gt" style="--i: 2"><b class="fd">Mewtwo</b><small>Legendario de Kanto</small></span><span class="gt" style="--i: 3"><b class="fd">Mega Garchomp Z</b><small>Nueva en el Reglamento M-C</small></span><span class="gt" style="--i: 4"><b class="fd">Koraidon</b><small>Legendario de Paldea</small></span><span class="gt" style="--i: 5"><b class="fd">Kingambit</b><small>Nº 2 del meta · 42 %</small></span></div>
        <div class="fc fc1"><img loading="lazy" decoding="async" src="/images/pokemon/art-1.webp" alt=""><span><small>Pokédex</small><b>Los 1025</b><em>con dónde capturarlos</em></span></div>
        <div class="fc fc2"><img loading="lazy" decoding="async" src="/images/pokemon/art-25.webp" alt=""><span><small>Gen I</small><b>Kanto al 100 %</b><em>151 por atrapar</em></span></div>
        <div class="fc fc3"><img loading="lazy" decoding="async" src="/images/pokemon/art-130.webp" alt=""><span><small>Tabla de tipos</small><b>Calculadora</b><em>15, 17 o 18 tipos</em></span></div>
      </div>
    </div>
  </section>

  <!-- META COMPETITIVO -->
  <section class="sec" id="meta">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kick"><i></i>Meta competitivo</span>
          <h2 class="h2">Lo que se juega ahora en VGC</h2>
          <p>Uso en la escalera de dobles de Pokémon Showdown con las reglas de Pokémon Champions (Reglamento M-C). Toca un Pokémon para ver su set más usado.</p>
        </div>
        <div class="seg" role="tablist" aria-label="Rango">
          <button type="button" :class="v.t1" @click="v.setP0" role="tab" :aria-selected="v.s1">Top 1–10</button>
          <button type="button" :class="v.t2" @click="v.setP1" role="tab" :aria-selected="v.s2">11–20</button>
        </div>
      </div>
      <div class="meta">
        <ol class="mlist">
          <template v-for="(m, m_i) in v.rows" :key="m_i">
            <li>
              <button type="button" :class="`mr ${m.on}`" @click="m.pick" :style="`--mc: ${m.c}`">
                <span class="rk fd">{{ m.r }}</span>
                <span class="ma" :style="`background-position: ${m.mp}`"></span>
                <span class="mn"><b>{{ m.n }}</b><span class="tys"><template v-for="(t, t_i) in m.t" :key="t_i"><span :class="`ty sm t-${t.k}`"><i></i>{{ t.n }}</span></template></span></span>
                <span class="mu"><span class="bar"><i :style="`width: ${m.w}`"></i></span><b>{{ m.u }}</b></span>
              </button>
            </li>
          </template>
        </ol>
        <article class="mset" :style="`--mc: ${v.sel.c}; --mc2: ${v.sel.c2}`">
          <div class="ms-art"><span class="disc"></span><span class="art" :style="`background-position: ${v.sel.ap}`"></span><span class="rkb fd">#{{ v.sel.r }}</span></div>
          <div class="ms-b">
            <div class="ms-h">
              <h3 class="fd">{{ v.sel.n }}</h3>
              <div class="tys"><template v-for="(t, t_i) in v.sel.t" :key="t_i"><span :class="`ty t-${t.k}`"><i></i>{{ t.n }}</span></template></div>
            </div>
            <div class="ms-u"><div class="usage" :style="`--p: ${v.sel.deg}`"><b class="fd">{{ v.sel.u }}</b><small>de los equipos</small></div>
              <div class="ms-i"><small>Objeto más usado</small><b>{{ v.sel.i }}</b><small class="mt">Movimientos</small>
                <div class="moves"><template v-for="(mv, mv_i) in v.sel.m" :key="mv_i"><span :class="`mvp t-${mv.k}`"><i class="ti"></i>{{ mv.n }}</span></template></div>
              </div>
            </div>
            <p class="why">{{ v.sel.w }}</p>
            <a class="btn-o sm" href="/pokemon/competitivo">Ver el set completo <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg></a>
          </div>
        </article>
      </div>
      <div class="minfo">
        <div class="mi"><span class="mi-ic" style="--k: #FFCB3D">M-C</span><div><b>Reglamento M-C</b><span>Del 9 de septiembre al 2 de diciembre · quedan {{ v.daysReg }} días</span><span class="bar"><i :style="`width: ${v.regPct}`"></i></span></div></div>
        <div class="mi"><span class="mi-ic trophy" style="--k: #FF7A59"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"></path><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"></path></svg></span><div><b>Mundial 2026: Takuma Yamazaki</b><span>Campeón de VGC Máster (Japón) en San Francisco, jugado en Pokémon Champions</span></div></div>
        <div class="mi"><span class="mi-ic" style="--k: #5B8CFF">1,6 M</span><div><b>Combates analizados</b><span>Estadísticas de Smogon de octubre de 2026 (escalera de Showdown, 1760+). Se actualiza cada mes.</span></div></div>
      </div>
    </div>
  </section>

  <!-- NOVEDADES -->
  <section class="sec">
    <div class="wrap">
      <div class="sec-h"><div><span class="kick"><i></i>Novedades</span><h2 class="h2">Lo último de Pokémon</h2></div></div>
      <div class="news">
        <article class="nw big">
          <div class="nw-img gen10"><div class="slot"><b>Imagen oficial de Viento y Oleaje</b>Arte promocional (1600 × 900)</div>
            <div class="starters"><span class="ty t-grass"><i></i>Browt</span><span class="ty t-fire"><i></i>Pombon</span><span class="ty t-water"><i></i>Gecqua</span></div></div>
          <div class="nw-b"><span class="tag" style="--k: #2BB3A3">Gen X · 2027</span><h3 class="fd">Pokémon Viento y Pokémon Oleaje</h3><p>La décima generación llega a Nintendo Switch 2 en 2027 con una región nueva aún sin nombre y tres iniciales: Browt, Pombon y Gecqua.</p></div>
        </article>
        <article class="nw">
          <div class="nw-img who"><img loading="lazy" decoding="async" src="/images/pokemon/art-151.webp" alt=""><span class="q fd">?</span><span class="cd fd">{{ v.daysCd }}<small>días</small></span></div>
          <div class="nw-b"><span class="tag" style="--k: #FF5AA5">Rumor</span><h3 class="fd">Cuenta atrás hasta el 30 de noviembre</h3><p>La cuenta oficial japonesa de Pokémon en X termina una cuenta atrás el 30 de noviembre. Nadie sabe aún qué se anunciará.</p></div>
        </article>
        <article class="nw">
          <div class="nw-img zz"><img loading="lazy" decoding="async" src="/images/pokemon/art-10309.webp" alt=""></div>
          <div class="nw-b"><span class="tag" style="--k: #FFCB3D">Champions</span><h3 class="fd">Llegan las Megaevoluciones Z</h3><p>El Reglamento M-C añade seis megas: Absol Z, Garchomp Z, Lucario Z, Salamence, Golisopod y Baxcalibur.</p></div>
        </article>
        <article class="nw">
          <div class="nw-img sg"><img loading="lazy" decoding="async" src="/images/pokemon/art-25.webp" alt=""><span class="flag fd">SG</span></div>
          <div class="nw-b"><span class="tag" style="--k: #5B8CFF">Mundial</span><h3 class="fd">El Mundial 2027 será en Singapur</h3><p>Del 13 al 15 de agosto de 2027 en el Singapore EXPO. El de 2026 se jugó en San Francisco.</p></div>
        </article>
      </div>
    </div>
  </section>

  <!-- REGIONES -->
  <section class="sec" id="regiones">
    <div class="wrap">
      <div class="sec-h">
        <div><span class="kick"><i></i>Regiones</span><h2 class="h2">Generación a generación</h2><p>Cada región tiene su guía de historia, su mapa interactivo y su lista al 100 %. Empezamos por Kanto y seguimos en orden.</p></div>
      </div>
      <div class="regs">
<article class="rg on" style="--c1: #E3350D; --c2: #FFB703">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 57.143% 0.000%"></span><span class="art" style="background-position: 35.714% 0.000%"></span>
          <div class="rg-t"><span class="gn">Gen I</span><span class="pill live"><span class="dot"></span>Disponible</span></div>
          <h3 class="fd">Kanto</h3>
          <p>Rojo, Azul y Amarillo</p>
          <div class="rg-n">1996 · <b>151</b> Pokémon nuevos</div>
          <div class="rg-l"><a href="/pokemon/kanto">Historia</a><a href="/pokemon/kanto/mapa">Mapa</a><a href="/pokemon/kanto/100">100 %</a></div>
        </article>
<article class="rg" style="--c1: #D4A017; --c2: #C0C7D0">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 14.286% 71.429%"></span><span class="art" style="background-position: 21.429% 71.429%"></span>
          <div class="rg-t"><span class="gn">Gen II</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Johto</h3>
          <p>Oro, Plata y Cristal</p>
          <div class="rg-n">1999 · <b>100</b> Pokémon nuevos</div>
        </article>
<article class="rg" style="--c1: #C62828; --c2: #1E5BD8">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 64.286% 71.429%"></span><span class="art" style="background-position: 71.429% 71.429%"></span>
          <div class="rg-t"><span class="gn">Gen III</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Hoenn</h3>
          <p>Rubí, Zafiro y Esmeralda</p>
          <div class="rg-n">2002 · <b>135</b> Pokémon nuevos</div>
        </article>
<article class="rg" style="--c1: #5B7BD5; --c2: #E68AB0">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 7.143% 78.571%"></span><span class="art" style="background-position: 0.000% 78.571%"></span>
          <div class="rg-t"><span class="gn">Gen IV</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Sinnoh</h3>
          <p>Diamante, Perla y Platino</p>
          <div class="rg-n">2006 · <b>107</b> Pokémon nuevos</div>
        </article>
<article class="rg" style="--c1: #4A4F57; --c2: #E9ECEF">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 28.571% 78.571%"></span><span class="art" style="background-position: 35.714% 78.571%"></span>
          <div class="rg-t"><span class="gn">Gen V</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Teselia</h3>
          <p>Negro, Blanco, Negro 2 y Blanco 2</p>
          <div class="rg-n">2010 · <b>156</b> Pokémon nuevos</div>
        </article>
<article class="rg" style="--c1: #2F6BD8; --c2: #D93A3A">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 78.571% 78.571%"></span><span class="art" style="background-position: 71.429% 78.571%"></span>
          <div class="rg-t"><span class="gn">Gen VI</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Kalos</h3>
          <p>X e Y</p>
          <div class="rg-n">2013 · <b>72</b> Pokémon nuevos</div>
        </article>
<article class="rg" style="--c1: #F59E0B; --c2: #7C5CE0">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 0.000% 85.714%"></span><span class="art" style="background-position: 100.000% 78.571%"></span>
          <div class="rg-t"><span class="gn">Gen VII</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Alola</h3>
          <p>Sol, Luna, Ultrasol y Ultraluna</p>
          <div class="rg-n">2016 · <b>88</b> Pokémon nuevos</div>
        </article>
<article class="rg" style="--c1: #14A2E3; --c2: #E2187F">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 35.714% 85.714%"></span><span class="art" style="background-position: 28.571% 85.714%"></span>
          <div class="rg-t"><span class="gn">Gen VIII</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Galar</h3>
          <p>Espada y Escudo</p>
          <div class="rg-n">2019 · <b>96</b> Pokémon nuevos</div>
        </article>
<article class="rg" style="--c1: #E03A2F; --c2: #7A3FB8">
          <span class="halo" aria-hidden="true"></span><span class="shine" aria-hidden="true"></span><span class="art a2" style="background-position: 0.000% 92.857%"></span><span class="art" style="background-position: 100.000% 85.714%"></span>
          <div class="rg-t"><span class="gn">Gen IX</span><span class="pill">Próximamente</span></div>
          <h3 class="fd">Paldea</h3>
          <p>Escarlata y Púrpura</p>
          <div class="rg-n">2022 · <b>120</b> Pokémon nuevos</div>
        </article>
<article class="rg gx" style="--c1: #2BB3A3; --c2: #3567D6">
          <div class="slot gx-slot"><b>Región de la Gen X</b>Arte oficial de Viento y Oleaje</div>
          <div class="rg-t"><span class="gn">Gen X</span><span class="pill">Anunciado</span></div>
          <h3 class="fd">Por desvelar</h3>
          <p>Pokémon Viento y Pokémon Oleaje</p>
          <div class="rg-n">2027 · <b>3</b> iniciales confirmados</div>
        </article>
      </div>
    </div>
  </section>

  <!-- HERRAMIENTAS -->
  <section class="sec">
    <div class="wrap">
      <div class="sec-h"><div><span class="kick"><i></i>Herramientas</span><h2 class="h2">Para cualquier juego de Pokémon</h2><p>Con selector de generación: elige el juego al que juegas y verás los tipos, estadísticas y reglas de esa época.</p></div></div>
      <div class="tools">
        <a class="tl t-dex" href="/pokemon/pokedex">
          <div class="tl-v mosaic"><span class="spr" style="background-position: 0.000% 0.000%"></span><span class="spr" style="background-position: 9.677% 0.000%"></span><span class="spr" style="background-position: 19.355% 0.000%"></span><span class="spr" style="background-position: 77.419% 0.000%"></span><span class="spr" style="background-position: 12.903% 12.500%"></span><span class="spr" style="background-position: 67.742% 12.500%"></span><span class="spr" style="background-position: 74.194% 12.500%"></span><span class="spr" style="background-position: 83.871% 12.500%"></span><span class="spr" style="background-position: 93.548% 12.500%"></span><span class="spr" style="background-position: 77.419% 21.875%"></span><span class="spr" style="background-position: 87.097% 21.875%"></span><span class="spr" style="background-position: 96.774% 21.875%"></span><span class="spr" style="background-position: 3.226% 25.000%"></span><span class="spr" style="background-position: 80.645% 25.000%"></span><span class="spr" style="background-position: 100.000% 34.375%"></span><span class="spr" style="background-position: 90.323% 40.625%"></span><span class="spr" style="background-position: 100.000% 40.625%"></span><span class="spr" style="background-position: 83.871% 53.125%"></span><span class="spr" style="background-position: 54.839% 62.500%"></span><span class="spr" style="background-position: 87.097% 65.625%"></span><span class="spr" style="background-position: 29.032% 75.000%"></span><span class="spr" style="background-position: 70.968% 84.375%"></span><span class="spr" style="background-position: 29.032% 87.500%"></span><span class="spr" style="background-position: 22.581% 96.875%"></span></div>
          <div class="tl-b"><b class="fd">Pokédex</b><span>Los 1025 con ficha completa, filtros por tipo y dónde capturarlos en cada juego.</span></div>
        </a>
        <a class="tl t-typ" href="/pokemon/tipos">
          <div class="tl-v"><div class="mini"><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class="x0"></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class="x0"></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class="x5"></i><i class="x0"></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x0"></i><i class="x2"></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class=""></i><i class="x2"></i><i class="x2"></i><i class=""></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class="x5"></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class="x0"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class="x5"></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class="x2"></i><i class="x2"></i><i class="x5"></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class="x2"></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x0"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class="x0"></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x0"></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class="x2"></i><i class=""></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x5"></i><i class="x5"></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class=""></i><i class="x2"></i><i class="x2"></i><i class=""></i></div></div>
          <div class="tl-b"><b class="fd">Tabla de tipos</b><span>15, 17 o 18 tipos según la generación, con calculadora de debilidades.</span></div>
        </a>
        <a class="tl t-nat" href="/pokemon/habilidades">
          <div class="tl-v"><div class="nat"><i style="--c: #FF7A59" class="nd"></i><i style="--c: #FF7A59" class=""></i><i style="--c: #FF7A59" class=""></i><i style="--c: #FF7A59" class=""></i><i style="--c: #FF7A59" class=""></i><i style="--c: #FFCB3D" class=""></i><i style="--c: #FFCB3D" class="nd"></i><i style="--c: #FFCB3D" class=""></i><i style="--c: #FFCB3D" class=""></i><i style="--c: #FFCB3D" class=""></i><i style="--c: #5B8CFF" class=""></i><i style="--c: #5B8CFF" class=""></i><i style="--c: #5B8CFF" class="nd"></i><i style="--c: #5B8CFF" class=""></i><i style="--c: #5B8CFF" class=""></i><i style="--c: #7AD27A" class=""></i><i style="--c: #7AD27A" class=""></i><i style="--c: #7AD27A" class=""></i><i style="--c: #7AD27A" class="nd"></i><i style="--c: #7AD27A" class=""></i><i style="--c: #FF5AA5" class=""></i><i style="--c: #FF5AA5" class=""></i><i style="--c: #FF5AA5" class=""></i><i style="--c: #FF5AA5" class=""></i><i style="--c: #FF5AA5" class="nd"></i></div><div class="abch"><span>Intimidación</span><span>Levitación</span><span>Ausente</span></div></div>
          <div class="tl-b"><b class="fd">Habilidades y movimientos</b><span>Qué hace cada habilidad y movimiento, por tipo, y la mejor naturaleza para cada Pokémon.</span></div>
        </a>
        <a class="tl t-cmp" href="/pokemon/competitivo">
          <div class="tl-v bars">
            <template v-for="(m, m_i) in v.top5" :key="m_i"><span class="tb5"><span class="ma" :style="`background-position: ${m.mp}`"></span><span class="bar"><i :style="`width: ${m.w}; --bc: ${m.c}`"></i></span></span></template>
          </div>
          <div class="tl-b"><b class="fd">Competitivo</b><span>Uso, sets, arquetipos y megaevoluciones del reglamento vigente.</span></div>
        </a>
      </div>
    </div>
  </section>

  <!-- KANTO -->
  <section class="sec">
    <div class="wrap">
      <div class="kband">
        <div class="kb-tx">
          <span class="kick"><i></i>Empieza por el principio</span>
          <h2 class="h2">Kanto, como en 1996</h2>
          <p>Rojo, Azul y Amarillo con la historia paso a paso, un mapa con cada Pokémon por ruta y una lista al 100 % que puedes ir marcando.</p>
          <div class="ctas"><a class="btn-y" href="/pokemon/kanto">Guía de la historia</a><a class="btn-o" href="/pokemon/kanto/mapa">Mapa de Kanto</a><a class="btn-o" href="/pokemon/kanto/100">Kanto al 100 %</a></div>
        </div>
        <div class="gb" aria-hidden="true">
          <div class="gb-scr"><div class="parade"><span class="g1s" style="background-position: 0.000% 0.000%"></span><span class="g1s" style="background-position: 6.667% 0.000%"></span><span class="g1s" style="background-position: 13.333% 0.000%"></span><span class="g1s" style="background-position: 20.000% 0.000%"></span><span class="g1s" style="background-position: 26.667% 0.000%"></span><span class="g1s" style="background-position: 33.333% 0.000%"></span><span class="g1s" style="background-position: 40.000% 0.000%"></span><span class="g1s" style="background-position: 46.667% 0.000%"></span><span class="g1s" style="background-position: 53.333% 0.000%"></span><span class="g1s" style="background-position: 60.000% 0.000%"></span><span class="g1s" style="background-position: 66.667% 0.000%"></span><span class="g1s" style="background-position: 73.333% 0.000%"></span><span class="g1s" style="background-position: 80.000% 0.000%"></span><span class="g1s" style="background-position: 86.667% 0.000%"></span><span class="g1s" style="background-position: 93.333% 0.000%"></span><span class="g1s" style="background-position: 100.000% 0.000%"></span><span class="g1s" style="background-position: 0.000% 11.111%"></span><span class="g1s" style="background-position: 6.667% 11.111%"></span><span class="g1s" style="background-position: 13.333% 11.111%"></span><span class="g1s" style="background-position: 20.000% 11.111%"></span><span class="g1s" style="background-position: 26.667% 11.111%"></span><span class="g1s" style="background-position: 33.333% 11.111%"></span><span class="g1s" style="background-position: 40.000% 11.111%"></span><span class="g1s" style="background-position: 46.667% 11.111%"></span><span class="g1s" style="background-position: 53.333% 11.111%"></span><span class="g1s" style="background-position: 60.000% 11.111%"></span><span class="g1s" style="background-position: 66.667% 11.111%"></span><span class="g1s" style="background-position: 73.333% 11.111%"></span><span class="g1s" style="background-position: 80.000% 11.111%"></span><span class="g1s" style="background-position: 86.667% 11.111%"></span><span class="g1s" style="background-position: 93.333% 11.111%"></span><span class="g1s" style="background-position: 100.000% 11.111%"></span><span class="g1s" style="background-position: 0.000% 22.222%"></span><span class="g1s" style="background-position: 6.667% 22.222%"></span><span class="g1s" style="background-position: 13.333% 22.222%"></span><span class="g1s" style="background-position: 20.000% 22.222%"></span><span class="g1s" style="background-position: 26.667% 22.222%"></span><span class="g1s" style="background-position: 33.333% 22.222%"></span><span class="g1s" style="background-position: 40.000% 22.222%"></span><span class="g1s" style="background-position: 46.667% 22.222%"></span><span class="g1s" style="background-position: 53.333% 22.222%"></span><span class="g1s" style="background-position: 60.000% 22.222%"></span><span class="g1s" style="background-position: 66.667% 22.222%"></span><span class="g1s" style="background-position: 73.333% 22.222%"></span><span class="g1s" style="background-position: 80.000% 22.222%"></span><span class="g1s" style="background-position: 86.667% 22.222%"></span><span class="g1s" style="background-position: 93.333% 22.222%"></span><span class="g1s" style="background-position: 100.000% 22.222%"></span><span class="g1s" style="background-position: 0.000% 33.333%"></span><span class="g1s" style="background-position: 6.667% 33.333%"></span><span class="g1s" style="background-position: 13.333% 33.333%"></span><span class="g1s" style="background-position: 20.000% 33.333%"></span><span class="g1s" style="background-position: 26.667% 33.333%"></span><span class="g1s" style="background-position: 33.333% 33.333%"></span><span class="g1s" style="background-position: 40.000% 33.333%"></span><span class="g1s" style="background-position: 46.667% 33.333%"></span><span class="g1s" style="background-position: 53.333% 33.333%"></span><span class="g1s" style="background-position: 60.000% 33.333%"></span><span class="g1s" style="background-position: 66.667% 33.333%"></span><span class="g1s" style="background-position: 73.333% 33.333%"></span><span class="g1s" style="background-position: 80.000% 33.333%"></span><span class="g1s" style="background-position: 86.667% 33.333%"></span><span class="g1s" style="background-position: 93.333% 33.333%"></span><span class="g1s" style="background-position: 100.000% 33.333%"></span><span class="g1s" style="background-position: 0.000% 44.444%"></span><span class="g1s" style="background-position: 6.667% 44.444%"></span><span class="g1s" style="background-position: 13.333% 44.444%"></span><span class="g1s" style="background-position: 20.000% 44.444%"></span><span class="g1s" style="background-position: 26.667% 44.444%"></span><span class="g1s" style="background-position: 33.333% 44.444%"></span><span class="g1s" style="background-position: 40.000% 44.444%"></span><span class="g1s" style="background-position: 46.667% 44.444%"></span><span class="g1s" style="background-position: 53.333% 44.444%"></span><span class="g1s" style="background-position: 60.000% 44.444%"></span><span class="g1s" style="background-position: 66.667% 44.444%"></span><span class="g1s" style="background-position: 73.333% 44.444%"></span><span class="g1s" style="background-position: 80.000% 44.444%"></span><span class="g1s" style="background-position: 86.667% 44.444%"></span><span class="g1s" style="background-position: 93.333% 44.444%"></span><span class="g1s" style="background-position: 100.000% 44.444%"></span><span class="g1s" style="background-position: 0.000% 55.556%"></span><span class="g1s" style="background-position: 6.667% 55.556%"></span><span class="g1s" style="background-position: 13.333% 55.556%"></span><span class="g1s" style="background-position: 20.000% 55.556%"></span><span class="g1s" style="background-position: 26.667% 55.556%"></span><span class="g1s" style="background-position: 33.333% 55.556%"></span><span class="g1s" style="background-position: 40.000% 55.556%"></span><span class="g1s" style="background-position: 46.667% 55.556%"></span><span class="g1s" style="background-position: 53.333% 55.556%"></span><span class="g1s" style="background-position: 60.000% 55.556%"></span><span class="g1s" style="background-position: 66.667% 55.556%"></span><span class="g1s" style="background-position: 73.333% 55.556%"></span><span class="g1s" style="background-position: 80.000% 55.556%"></span><span class="g1s" style="background-position: 86.667% 55.556%"></span><span class="g1s" style="background-position: 93.333% 55.556%"></span><span class="g1s" style="background-position: 100.000% 55.556%"></span><span class="g1s" style="background-position: 0.000% 66.667%"></span><span class="g1s" style="background-position: 6.667% 66.667%"></span><span class="g1s" style="background-position: 13.333% 66.667%"></span><span class="g1s" style="background-position: 20.000% 66.667%"></span><span class="g1s" style="background-position: 26.667% 66.667%"></span><span class="g1s" style="background-position: 33.333% 66.667%"></span><span class="g1s" style="background-position: 40.000% 66.667%"></span><span class="g1s" style="background-position: 46.667% 66.667%"></span><span class="g1s" style="background-position: 53.333% 66.667%"></span><span class="g1s" style="background-position: 60.000% 66.667%"></span><span class="g1s" style="background-position: 66.667% 66.667%"></span><span class="g1s" style="background-position: 73.333% 66.667%"></span><span class="g1s" style="background-position: 80.000% 66.667%"></span><span class="g1s" style="background-position: 86.667% 66.667%"></span><span class="g1s" style="background-position: 93.333% 66.667%"></span><span class="g1s" style="background-position: 100.000% 66.667%"></span><span class="g1s" style="background-position: 0.000% 77.778%"></span><span class="g1s" style="background-position: 6.667% 77.778%"></span><span class="g1s" style="background-position: 13.333% 77.778%"></span><span class="g1s" style="background-position: 20.000% 77.778%"></span><span class="g1s" style="background-position: 26.667% 77.778%"></span><span class="g1s" style="background-position: 33.333% 77.778%"></span><span class="g1s" style="background-position: 40.000% 77.778%"></span><span class="g1s" style="background-position: 46.667% 77.778%"></span><span class="g1s" style="background-position: 53.333% 77.778%"></span><span class="g1s" style="background-position: 60.000% 77.778%"></span><span class="g1s" style="background-position: 66.667% 77.778%"></span><span class="g1s" style="background-position: 73.333% 77.778%"></span><span class="g1s" style="background-position: 80.000% 77.778%"></span><span class="g1s" style="background-position: 86.667% 77.778%"></span><span class="g1s" style="background-position: 93.333% 77.778%"></span><span class="g1s" style="background-position: 100.000% 77.778%"></span><span class="g1s" style="background-position: 0.000% 88.889%"></span><span class="g1s" style="background-position: 6.667% 88.889%"></span><span class="g1s" style="background-position: 13.333% 88.889%"></span><span class="g1s" style="background-position: 20.000% 88.889%"></span><span class="g1s" style="background-position: 26.667% 88.889%"></span><span class="g1s" style="background-position: 33.333% 88.889%"></span><span class="g1s" style="background-position: 40.000% 88.889%"></span><span class="g1s" style="background-position: 46.667% 88.889%"></span><span class="g1s" style="background-position: 53.333% 88.889%"></span><span class="g1s" style="background-position: 60.000% 88.889%"></span><span class="g1s" style="background-position: 66.667% 88.889%"></span><span class="g1s" style="background-position: 73.333% 88.889%"></span><span class="g1s" style="background-position: 80.000% 88.889%"></span><span class="g1s" style="background-position: 86.667% 88.889%"></span><span class="g1s" style="background-position: 93.333% 88.889%"></span><span class="g1s" style="background-position: 100.000% 88.889%"></span><span class="g1s" style="background-position: 0.000% 100.000%"></span><span class="g1s" style="background-position: 6.667% 100.000%"></span><span class="g1s" style="background-position: 13.333% 100.000%"></span><span class="g1s" style="background-position: 20.000% 100.000%"></span><span class="g1s" style="background-position: 26.667% 100.000%"></span><span class="g1s" style="background-position: 33.333% 100.000%"></span><span class="g1s" style="background-position: 40.000% 100.000%"></span><span class="g1s" style="background-position: 0.000% 0.000%"></span><span class="g1s" style="background-position: 6.667% 0.000%"></span><span class="g1s" style="background-position: 13.333% 0.000%"></span><span class="g1s" style="background-position: 20.000% 0.000%"></span><span class="g1s" style="background-position: 26.667% 0.000%"></span><span class="g1s" style="background-position: 33.333% 0.000%"></span><span class="g1s" style="background-position: 40.000% 0.000%"></span><span class="g1s" style="background-position: 46.667% 0.000%"></span><span class="g1s" style="background-position: 53.333% 0.000%"></span><span class="g1s" style="background-position: 60.000% 0.000%"></span><span class="g1s" style="background-position: 66.667% 0.000%"></span><span class="g1s" style="background-position: 73.333% 0.000%"></span><span class="g1s" style="background-position: 80.000% 0.000%"></span><span class="g1s" style="background-position: 86.667% 0.000%"></span><span class="g1s" style="background-position: 93.333% 0.000%"></span><span class="g1s" style="background-position: 100.000% 0.000%"></span><span class="g1s" style="background-position: 0.000% 11.111%"></span><span class="g1s" style="background-position: 6.667% 11.111%"></span><span class="g1s" style="background-position: 13.333% 11.111%"></span><span class="g1s" style="background-position: 20.000% 11.111%"></span><span class="g1s" style="background-position: 26.667% 11.111%"></span><span class="g1s" style="background-position: 33.333% 11.111%"></span><span class="g1s" style="background-position: 40.000% 11.111%"></span><span class="g1s" style="background-position: 46.667% 11.111%"></span><span class="g1s" style="background-position: 53.333% 11.111%"></span><span class="g1s" style="background-position: 60.000% 11.111%"></span><span class="g1s" style="background-position: 66.667% 11.111%"></span><span class="g1s" style="background-position: 73.333% 11.111%"></span><span class="g1s" style="background-position: 80.000% 11.111%"></span><span class="g1s" style="background-position: 86.667% 11.111%"></span><span class="g1s" style="background-position: 93.333% 11.111%"></span><span class="g1s" style="background-position: 100.000% 11.111%"></span><span class="g1s" style="background-position: 0.000% 22.222%"></span><span class="g1s" style="background-position: 6.667% 22.222%"></span><span class="g1s" style="background-position: 13.333% 22.222%"></span><span class="g1s" style="background-position: 20.000% 22.222%"></span><span class="g1s" style="background-position: 26.667% 22.222%"></span><span class="g1s" style="background-position: 33.333% 22.222%"></span><span class="g1s" style="background-position: 40.000% 22.222%"></span><span class="g1s" style="background-position: 46.667% 22.222%"></span><span class="g1s" style="background-position: 53.333% 22.222%"></span><span class="g1s" style="background-position: 60.000% 22.222%"></span><span class="g1s" style="background-position: 66.667% 22.222%"></span><span class="g1s" style="background-position: 73.333% 22.222%"></span><span class="g1s" style="background-position: 80.000% 22.222%"></span><span class="g1s" style="background-position: 86.667% 22.222%"></span><span class="g1s" style="background-position: 93.333% 22.222%"></span><span class="g1s" style="background-position: 100.000% 22.222%"></span><span class="g1s" style="background-position: 0.000% 33.333%"></span><span class="g1s" style="background-position: 6.667% 33.333%"></span><span class="g1s" style="background-position: 13.333% 33.333%"></span><span class="g1s" style="background-position: 20.000% 33.333%"></span><span class="g1s" style="background-position: 26.667% 33.333%"></span><span class="g1s" style="background-position: 33.333% 33.333%"></span><span class="g1s" style="background-position: 40.000% 33.333%"></span><span class="g1s" style="background-position: 46.667% 33.333%"></span><span class="g1s" style="background-position: 53.333% 33.333%"></span><span class="g1s" style="background-position: 60.000% 33.333%"></span><span class="g1s" style="background-position: 66.667% 33.333%"></span><span class="g1s" style="background-position: 73.333% 33.333%"></span><span class="g1s" style="background-position: 80.000% 33.333%"></span><span class="g1s" style="background-position: 86.667% 33.333%"></span><span class="g1s" style="background-position: 93.333% 33.333%"></span><span class="g1s" style="background-position: 100.000% 33.333%"></span><span class="g1s" style="background-position: 0.000% 44.444%"></span><span class="g1s" style="background-position: 6.667% 44.444%"></span><span class="g1s" style="background-position: 13.333% 44.444%"></span><span class="g1s" style="background-position: 20.000% 44.444%"></span><span class="g1s" style="background-position: 26.667% 44.444%"></span><span class="g1s" style="background-position: 33.333% 44.444%"></span><span class="g1s" style="background-position: 40.000% 44.444%"></span><span class="g1s" style="background-position: 46.667% 44.444%"></span><span class="g1s" style="background-position: 53.333% 44.444%"></span><span class="g1s" style="background-position: 60.000% 44.444%"></span><span class="g1s" style="background-position: 66.667% 44.444%"></span><span class="g1s" style="background-position: 73.333% 44.444%"></span><span class="g1s" style="background-position: 80.000% 44.444%"></span><span class="g1s" style="background-position: 86.667% 44.444%"></span><span class="g1s" style="background-position: 93.333% 44.444%"></span><span class="g1s" style="background-position: 100.000% 44.444%"></span><span class="g1s" style="background-position: 0.000% 55.556%"></span><span class="g1s" style="background-position: 6.667% 55.556%"></span><span class="g1s" style="background-position: 13.333% 55.556%"></span><span class="g1s" style="background-position: 20.000% 55.556%"></span><span class="g1s" style="background-position: 26.667% 55.556%"></span><span class="g1s" style="background-position: 33.333% 55.556%"></span><span class="g1s" style="background-position: 40.000% 55.556%"></span><span class="g1s" style="background-position: 46.667% 55.556%"></span><span class="g1s" style="background-position: 53.333% 55.556%"></span><span class="g1s" style="background-position: 60.000% 55.556%"></span><span class="g1s" style="background-position: 66.667% 55.556%"></span><span class="g1s" style="background-position: 73.333% 55.556%"></span><span class="g1s" style="background-position: 80.000% 55.556%"></span><span class="g1s" style="background-position: 86.667% 55.556%"></span><span class="g1s" style="background-position: 93.333% 55.556%"></span><span class="g1s" style="background-position: 100.000% 55.556%"></span><span class="g1s" style="background-position: 0.000% 66.667%"></span><span class="g1s" style="background-position: 6.667% 66.667%"></span><span class="g1s" style="background-position: 13.333% 66.667%"></span><span class="g1s" style="background-position: 20.000% 66.667%"></span><span class="g1s" style="background-position: 26.667% 66.667%"></span><span class="g1s" style="background-position: 33.333% 66.667%"></span><span class="g1s" style="background-position: 40.000% 66.667%"></span><span class="g1s" style="background-position: 46.667% 66.667%"></span><span class="g1s" style="background-position: 53.333% 66.667%"></span><span class="g1s" style="background-position: 60.000% 66.667%"></span><span class="g1s" style="background-position: 66.667% 66.667%"></span><span class="g1s" style="background-position: 73.333% 66.667%"></span><span class="g1s" style="background-position: 80.000% 66.667%"></span><span class="g1s" style="background-position: 86.667% 66.667%"></span><span class="g1s" style="background-position: 93.333% 66.667%"></span><span class="g1s" style="background-position: 100.000% 66.667%"></span><span class="g1s" style="background-position: 0.000% 77.778%"></span><span class="g1s" style="background-position: 6.667% 77.778%"></span><span class="g1s" style="background-position: 13.333% 77.778%"></span><span class="g1s" style="background-position: 20.000% 77.778%"></span><span class="g1s" style="background-position: 26.667% 77.778%"></span><span class="g1s" style="background-position: 33.333% 77.778%"></span><span class="g1s" style="background-position: 40.000% 77.778%"></span><span class="g1s" style="background-position: 46.667% 77.778%"></span><span class="g1s" style="background-position: 53.333% 77.778%"></span><span class="g1s" style="background-position: 60.000% 77.778%"></span><span class="g1s" style="background-position: 66.667% 77.778%"></span><span class="g1s" style="background-position: 73.333% 77.778%"></span><span class="g1s" style="background-position: 80.000% 77.778%"></span><span class="g1s" style="background-position: 86.667% 77.778%"></span><span class="g1s" style="background-position: 93.333% 77.778%"></span><span class="g1s" style="background-position: 100.000% 77.778%"></span><span class="g1s" style="background-position: 0.000% 88.889%"></span><span class="g1s" style="background-position: 6.667% 88.889%"></span><span class="g1s" style="background-position: 13.333% 88.889%"></span><span class="g1s" style="background-position: 20.000% 88.889%"></span><span class="g1s" style="background-position: 26.667% 88.889%"></span><span class="g1s" style="background-position: 33.333% 88.889%"></span><span class="g1s" style="background-position: 40.000% 88.889%"></span><span class="g1s" style="background-position: 46.667% 88.889%"></span><span class="g1s" style="background-position: 53.333% 88.889%"></span><span class="g1s" style="background-position: 60.000% 88.889%"></span><span class="g1s" style="background-position: 66.667% 88.889%"></span><span class="g1s" style="background-position: 73.333% 88.889%"></span><span class="g1s" style="background-position: 80.000% 88.889%"></span><span class="g1s" style="background-position: 86.667% 88.889%"></span><span class="g1s" style="background-position: 93.333% 88.889%"></span><span class="g1s" style="background-position: 100.000% 88.889%"></span><span class="g1s" style="background-position: 0.000% 100.000%"></span><span class="g1s" style="background-position: 6.667% 100.000%"></span><span class="g1s" style="background-position: 13.333% 100.000%"></span><span class="g1s" style="background-position: 20.000% 100.000%"></span><span class="g1s" style="background-position: 26.667% 100.000%"></span><span class="g1s" style="background-position: 33.333% 100.000%"></span><span class="g1s" style="background-position: 40.000% 100.000%"></span></div><div class="gb-box fd">¡151 POKéMON TE ESPERAN EN KANTO!</div></div>
          <div class="gb-led"><i></i><span>BATERÍA</span></div>
        </div>
      </div>
    </div>
  </section>

  
  

    </template>
  </div>
</template>

<script setup>
import { computed, reactive, toRaw } from "vue";
import { useGameData } from "@/composables/useGameData";
import PokeStatus from "@/components/pokemon/comun/PokeStatus.vue";
import { createHomeEngine } from "@/components/pokemon/a/homeEngine";


const d0 = useGameData("/data/pokemon/home-meta.json");
const sources = [d0];
const status = computed(() => (sources.some((s) => s.status === "error") ? "error" : sources.every((s) => s.status === "ready") ? "ready" : "loading"));
const retry = () => sources.forEach((s) => s.status === "error" && s.reload());

const st = reactive({ sel: 0, page: 0 });
let engine = null;
const v = computed(() => {
  if (status.value !== "ready") return null;
  engine ||= createHomeEngine({ ...toRaw(d0.data) }, st);
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


.hero{position:relative;isolation:isolate;overflow:hidden;border-bottom:1px solid rgba(255,255,255,.06)}
.hero-bg{position:absolute;inset:0;z-index:-1;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px);background-size:28px 28px}
.hero-bg span{position:absolute;width:460px;height:460px;border-radius:50%;filter:blur(100px);opacity:.36}
.hero-bg .b1{left:-120px;top:-160px;background:#FF5A5F}
.hero-bg .b2{left:30%;top:-220px;background:#FFCB3D;opacity:.22}
.hero-bg .b3{right:-80px;top:40px;background:#5B6CFF}
.hero-bg .b4{right:24%;bottom:-260px;background:#2FD39A;opacity:.24}
.hero-in{display:flex;align-items:center;gap:40px;flex-wrap:wrap;padding-top:52px;padding-bottom:60px}
.htx{flex:1 1 520px;max-width:660px;animation:rise .8s cubic-bezier(.2,.8,.2,1) both}
.h1{margin:16px 0 0;font-size:clamp(44px,5.4vw,76px);font-weight:700;line-height:.95;letter-spacing:-.02em}
.h1>span{display:block}
.h1 em{font-style:normal;background:linear-gradient(90deg,#FFCB3D,#FF7A59 45%,#FF5AA5 70%,#7C8CFF);-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{margin:20px 0 0;color:#B2BAC6;font-size:17.5px;max-width:540px;text-wrap:pretty}
.ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
.kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:34px;max-width:520px}
.kp{padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-top:3px solid var(--k)}
.kp b{display:block;font:700 26px/1 'Fredoka',sans-serif;color:var(--k)}
.kp span{font-size:12.5px;color:#A3ACBA}
.stage{position:relative;flex:1 1 440px;max-width:540px;aspect-ratio:1;container-type:inline-size;animation:rise .9s .1s cubic-bezier(.2,.8,.2,1) both}
.ring{position:absolute;inset:9%;border-radius:50%;background:conic-gradient(from 0deg,#A8A77A,#D3425F,#8FA8DD,#B567CE,#D97845,#C5B78C,#91C12F,#5269AD,#5A8EA2,#FF9D55,#4D90D5,#63BC5A,#F4D23C,#FA7179,#73CEC0,#0B6DC3,#5A5465,#EC8FE6,#A8A77A);-webkit-mask:radial-gradient(circle,transparent 63%,#000 63.5%,#000 70%,transparent 70.5%);mask:radial-gradient(circle,transparent 63%,#000 63.5%,#000 70%,transparent 70.5%);animation:spin 40s linear 6;opacity:.9}
.ring2{position:absolute;inset:20%;border-radius:50%;background:radial-gradient(circle,rgba(255,157,85,.35),rgba(255,90,95,.12) 50%,transparent 70%);border:1px dashed rgba(255,255,255,.15)}
.wheel{position:absolute;inset:0;animation:spin 90s linear 6}
.wb{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;display:grid;place-items:center;background:var(--tc);color:var(--tx);box-shadow:0 6px 16px -4px rgba(0,0,0,.6),inset 0 -3px 0 rgba(0,0,0,.18);transform:rotate(var(--a)) translateY(-36.5cqw) rotate(calc(-1 * var(--a)))}
.wb .tglyph{width:20px;height:20px;background:currentColor}
.gstage{position:absolute;left:13%;top:10%;width:74%;height:74%;animation:bob 7s ease-in-out 6}
.glf{position:absolute;inset:0;margin:0;filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))}
.glf img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;will-change:transform,clip-path;animation:gcyc 21s linear infinite;animation-delay:calc(var(--i) * 3.5s)}
.glf .gr{mix-blend-mode:screen;filter:brightness(1.1) sepia(1) saturate(9) hue-rotate(-48deg);animation-name:gghost}
.glf .gc{mix-blend-mode:screen;filter:brightness(1.1) sepia(1) saturate(9) hue-rotate(150deg);animation-name:gghost2}
@keyframes gcyc{
  0%{opacity:0;clip-path:inset(0 0 100% 0);transform:none;filter:none}
  .8%{opacity:1;clip-path:inset(12% 0 58% 0);transform:translateX(-14px) skewX(-8deg);filter:hue-rotate(70deg) saturate(2.5) brightness(1.4)}
  1.6%{opacity:1;clip-path:inset(48% 0 20% 0);transform:translateX(16px) skewX(6deg);filter:hue-rotate(-50deg) saturate(2)}
  2.4%{opacity:1;clip-path:inset(0 0 42% 0);transform:translateX(-6px);filter:hue-rotate(30deg) saturate(1.6) brightness(1.2)}
  3.2%,13.6%{opacity:1;clip-path:inset(0);transform:none;filter:none}
  14.4%{opacity:1;clip-path:inset(30% 0 35% 0);transform:translateX(12px) skewX(-6deg);filter:hue-rotate(110deg) saturate(3) brightness(1.5)}
  15.2%{opacity:1;clip-path:inset(70% 0 5% 0);transform:translateX(-18px) skewX(4deg);filter:hue-rotate(-80deg) saturate(2.4)}
  16%{opacity:1;clip-path:inset(5% 0 80% 0);transform:translateX(8px);filter:brightness(2)}
  16.67%,100%{opacity:0;clip-path:inset(0 0 100% 0);transform:none;filter:none}
}
@keyframes gghost{
  0%,3.2%,13.6%,16.67%,100%{opacity:0;transform:none;clip-path:inset(0)}
  .8%{opacity:.9;transform:translate(9px,-2px);clip-path:inset(18% 0 44% 0)}
  1.6%{opacity:.9;transform:translate(-11px,2px);clip-path:inset(56% 0 8% 0)}
  2.4%{opacity:.6;transform:translate(5px,0);clip-path:inset(0 0 62% 0)}
  14.4%{opacity:.9;transform:translate(-10px,1px);clip-path:inset(10% 0 52% 0)}
  15.2%{opacity:.9;transform:translate(13px,-2px);clip-path:inset(62% 0 12% 0)}
  16%{opacity:.7;transform:translate(-6px,0);clip-path:inset(28% 0 34% 0)}
}
@keyframes gghost2{
  0%,3.2%,13.6%,16.67%,100%{opacity:0;transform:none;clip-path:inset(0)}
  .8%{opacity:.9;transform:translate(-9px,2px);clip-path:inset(30% 0 30% 0)}
  1.6%{opacity:.9;transform:translate(12px,-1px);clip-path:inset(8% 0 64% 0)}
  2.4%{opacity:.6;transform:translate(-4px,0);clip-path:inset(46% 0 18% 0)}
  14.4%{opacity:.9;transform:translate(10px,-1px);clip-path:inset(40% 0 22% 0)}
  15.2%{opacity:.9;transform:translate(-14px,2px);clip-path:inset(4% 0 70% 0)}
  16%{opacity:.7;transform:translate(7px,0);clip-path:inset(60% 0 10% 0)}
}
.gbars{position:absolute;inset:-4% -8%;pointer-events:none}
.gbars i{position:absolute;left:0;right:0;height:var(--h,10px);top:var(--t,40%);background:linear-gradient(90deg,transparent,rgba(255,90,165,.85) 12%,rgba(91,140,255,.9) 50%,rgba(124,243,176,.85) 88%,transparent);mix-blend-mode:screen;opacity:0;animation:gbar 3.5s steps(1,end) infinite;animation-delay:var(--d,0s)}
.gbars i:nth-child(1){--t:22%;--h:6px}
.gbars i:nth-child(2){--t:41%;--h:14px;--d:-.06s}
.gbars i:nth-child(3){--t:57%;--h:4px;--d:-.12s}
.gbars i:nth-child(4){--t:68%;--h:10px;--d:-.03s}
.gbars i:nth-child(5){--t:83%;--h:5px;--d:-.09s}
@keyframes gbar{
  0%{opacity:.9;transform:translateX(-8%)}
  5%{opacity:0}
  9%{opacity:.8;transform:translateX(6%)}
  14%,82%{opacity:0;transform:none}
  86%{opacity:.7;transform:translateX(10%)}
  91%{opacity:0}
  95%{opacity:.9;transform:translateX(-5%)}
}
.gscan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.07) 0 2px,transparent 2px 5px);-webkit-mask:radial-gradient(circle,#000 30%,transparent 70%);mask:radial-gradient(circle,#000 30%,transparent 70%);opacity:0;animation:gscan 3.5s linear infinite}
@keyframes gscan{0%,14%{opacity:1}18%,80%{opacity:0}84%,100%{opacity:1}}
.glabel{position:absolute;left:50%;bottom:-2%;transform:translateX(-50%);width:260px;height:52px;z-index:3}
.gt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:16px;background:rgba(10,13,20,0.95);border:1px solid rgba(255,255,255,.14);opacity:0;animation:glab 21s steps(1,end) infinite;animation-delay:calc(var(--i) * 3.5s)}
.gt b{font-size:17px;line-height:1.1}
.gt small{font-size:11.5px;color:#FFE08A}
@keyframes glab{0%{opacity:0}2.4%{opacity:1}16%{opacity:0}100%{opacity:0}}
.pk.still .glf:first-child .g0,.pk.still .gt:first-child{opacity:1}
@media (prefers-reduced-motion:reduce){.glf:first-child .g0,.gt:first-child{opacity:1}}
.fc{position:absolute;display:flex;align-items:center;gap:10px;padding:8px 14px 8px 8px;border-radius:18px;background:rgba(14,18,27,0.95);border:1px solid rgba(255,255,255,.12);box-shadow:0 24px 44px -22px rgba(0,0,0,.95);animation:bob 8s ease-in-out 6}
.fc img{width:52px;height:52px;object-fit:contain;border-radius:12px;background:radial-gradient(circle,rgba(255,255,255,.14),transparent 70%)}
.fc small{display:block;font:700 11px/1.2 'IBM Plex Sans',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#FFCB3D}
.fc b{display:block;font:600 16px/1.15 'Fredoka',sans-serif}
.fc em{font-style:normal;font-size:12px;color:#A3ACBA}
.fc1{left:-4%;top:58%;--r0:-2deg;--r1:1deg}
.fc2{right:-2%;top:8%;animation-delay:-3s}
.fc3{right:-6%;bottom:6%;animation-delay:-5s}
.fc3 small{color:#7CF3B0}
.meta{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:18px}
.mlist{list-style:none;margin:0;padding:10px;border-radius:24px;background:#0D1119;border:1px solid rgba(255,255,255,.07);display:flex;flex-direction:column;gap:4px}
.mr{width:100%;display:grid;grid-template-columns:34px 52px minmax(0,1fr) 170px;align-items:center;gap:10px;padding:6px 12px 6px 6px;border-radius:16px;border:1px solid transparent;background:transparent;color:#EEF1F6;text-align:left;cursor:pointer;transition:background .2s,border-color .2s}
.mr:hover{background:rgba(255,255,255,.04)}
.mr.on{background:linear-gradient(90deg,color-mix(in srgb,var(--mc) 26%,transparent),rgba(255,255,255,.02));border-color:color-mix(in srgb,var(--mc) 55%,transparent)}
.rk{font-size:22px;font-weight:700;text-align:center;color:#7F8695}
.mr.on .rk{color:var(--mc)}
.ma{display:block;background-image:url(/images/pokemon/artwork-meta.webp);background-size:1200% 1100%;background-repeat:no-repeat}
.mr .ma{width:52px;height:52px;flex-shrink:0;filter:drop-shadow(0 4px 6px rgba(0,0,0,.4))}
.mn b{display:block;font:600 16px/1.2 'Fredoka',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tys{display:flex;gap:5px;flex-wrap:wrap;margin-top:4px}
.mu{display:flex;align-items:center;gap:10px}
.mu .bar{flex:1}
.mu .bar i{background:linear-gradient(90deg,color-mix(in srgb,var(--mc) 60%,#fff 0%),var(--mc))}
.mu b{width:46px;text-align:right;font:600 14px/1 'Fredoka',sans-serif}
.mset{position:relative;display:flex;flex-direction:column;border-radius:28px;overflow:hidden;background:radial-gradient(120% 90% at 100% 0%,color-mix(in srgb,var(--mc) 40%,#0D1119) 0%,#0D1119 60%);border:1px solid color-mix(in srgb,var(--mc) 40%,transparent)}
.ms-art{position:relative;height:300px;display:grid;place-items:center}
.ms-art .disc{position:absolute;width:250px;height:250px;border-radius:50%;background:conic-gradient(from 90deg,var(--mc),var(--mc2),var(--mc));opacity:.35;filter:blur(2px)}
.ms-art .disc::after{content:"";position:absolute;inset:22px;border-radius:50%;background:#0D1119;opacity:.75}
.ms-art .art{position:relative;width:280px;height:280px;filter:drop-shadow(0 20px 30px rgba(0,0,0,.55));animation:fade .4s ease-out both}
.rkb{position:absolute;left:22px;top:18px;font-size:54px;font-weight:700;color:var(--mc);opacity:.9;text-shadow:0 6px 24px rgba(0,0,0,.6)}
.ms-b{padding:0 26px 26px}
.ms-h{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.ms-h h3{margin:0;font-size:32px;font-weight:700;letter-spacing:-.01em}
.ms-u{display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;margin-top:18px;align-items:start}
.usage{position:relative;width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--mc) var(--p),rgba(255,255,255,.08) 0);display:flex;flex-direction:column;align-items:center;justify-content:center}
.usage::before{content:"";position:absolute;inset:11px;border-radius:50%;background:#0F131C}
.usage b,.usage small{position:relative}
.usage b{font-size:26px}
.usage small{font-size:11px;color:#A3ACBA}
.ms-i small{display:block;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#7C8696}
.ms-i b{display:block;font:600 18px/1.25 'Fredoka',sans-serif;margin-top:4px}
.ms-i .mt{margin-top:14px}
.moves{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}
.mvp{display:flex;align-items:center;gap:7px;height:34px;padding:0 10px 0 6px;border-radius:11px;background:color-mix(in srgb,var(--tc) 22%,#0F131C);border:1px solid color-mix(in srgb,var(--tc) 50%,transparent);font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mvp .ti{width:20px;height:20px;background:var(--tc)}
.mvp .ti::after{background:var(--tx);inset:4px}
.why{margin:18px 0 18px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.04);border-left:3px solid var(--mc);color:#C9D0DA;font-size:14.5px}
.btn-o.sm{height:42px;font-size:14.5px}
.minfo{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
.mi{display:flex;gap:14px;align-items:flex-start;padding:16px;border-radius:20px;background:#0D1119;border:1px solid rgba(255,255,255,.07)}
.mi-ic{flex-shrink:0;display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:color-mix(in srgb,var(--k) 18%,transparent);color:var(--k);font:700 15px/1 'Fredoka',sans-serif;border:1px solid color-mix(in srgb,var(--k) 40%,transparent)}
.mi > div > span{display:block;font-size:13px;color:#A3ACBA;margin-top:2px}
.mi b{display:block;font:600 16px/1.25 'Fredoka',sans-serif}
.mi .bar{margin-top:10px;height:6px}
.mi .bar i{background:linear-gradient(90deg,#FFCB3D,#FF7A59)}
.news{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:14px}
.nw{display:flex;flex-direction:column;border-radius:24px;overflow:hidden;background:#0D1119;border:1px solid rgba(255,255,255,.07);transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .3s}
.nw:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.18)}
.nw-img{position:relative;height:190px;overflow:hidden;display:grid;place-items:center}
.nw-img img{width:78%;height:92%;object-fit:contain;filter:drop-shadow(0 16px 24px rgba(0,0,0,.5));transition:transform .6s}
.nw:hover .nw-img img{transform:scale(1.06) rotate(-2deg)}
.gen10{background:linear-gradient(135deg,#2BB3A3,#3567D6);padding:14px}
.gen10 .slot{width:100%;height:100%;border-color:rgba(255,255,255,.5);color:rgba(255,255,255,.85);background:repeating-linear-gradient(135deg,rgba(255,255,255,.08) 0 12px,transparent 12px 24px)}
.gen10 .slot b{color:#FFF}
.starters{position:absolute;left:14px;bottom:14px;display:flex;gap:6px}
.who{background:radial-gradient(circle at 50% 60%,#FF5AA5,#7C3AED 70%)}
.who img{filter:brightness(0) drop-shadow(0 0 18px rgba(255,255,255,.55))}
.who .q{position:absolute;left:18px;top:10px;font-size:64px;font-weight:700;color:#FFE08A;text-shadow:0 4px 0 rgba(0,0,0,.25)}
.who .cd{position:absolute;right:14px;bottom:12px;display:flex;align-items:baseline;gap:4px;padding:6px 12px;border-radius:14px;background:rgba(10,8,20,.65);font-size:30px;font-weight:700;color:#FFF}
.who .cd small{font-size:13px;color:#FFD0EA}
.zz{background:radial-gradient(circle at 50% 70%,#38D39F,#0E6B5E 70%)}
.sg{background:radial-gradient(circle at 40% 60%,#FFE45C,#FF8A3D 70%)}
.sg .flag{position:absolute;right:14px;top:12px;padding:4px 10px;border-radius:10px;background:#E12A2A;color:#FFF;font-size:16px;font-weight:700}
.nw-b{padding:16px 18px 20px}
.tag{display:inline-block;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,var(--k) 18%,transparent);color:var(--k);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.nw-b h3{margin:10px 0 0;font-size:20px;font-weight:600;line-height:1.15}
.nw-b p{margin:8px 0 0;font-size:13.5px;color:#A3ACBA}
.nw.big .nw-img{height:190px}
.regs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
.rg{position:relative;display:flex;flex-direction:column;min-height:300px;padding:16px;border-radius:24px;overflow:hidden;isolation:isolate;background:linear-gradient(155deg,var(--c1),var(--c2));transition:transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s}
.rg::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(9,11,17,0) 0%,rgba(9,11,17,.15) 40%,rgba(9,11,17,.88) 78%,rgba(9,11,17,.96) 100%)}
.rg:hover{transform:translateY(-6px);box-shadow:0 34px 60px -28px var(--c1),0 0 0 1px rgba(255,255,255,.18)}
.rg .halo{position:absolute;left:50%;top:104px;z-index:-2;width:190px;height:190px;margin:-95px 0 0 -95px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.55),color-mix(in srgb,var(--c1) 40%,transparent) 45%,transparent 70%);opacity:.35;transform:scale(.8);transition:opacity .5s,transform .7s cubic-bezier(.2,.8,.2,1)}
.rg .shine{position:absolute;inset:0;z-index:1;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.22) 50%,transparent 65%);transform:translateX(-120%);pointer-events:none}
.rg:hover .shine{transform:translateX(120%);transition:transform .9s ease}
.rg:hover .halo{opacity:1;transform:scale(1.12)}
.rg .art{position:absolute;left:50%;top:30px;width:150px;height:150px;z-index:-1;transform:translateX(-50%);filter:drop-shadow(0 14px 18px rgba(0,0,0,.5));transition:transform .6s cubic-bezier(.2,.8,.2,1),filter .6s}
.rg .art.a2{top:22px;width:104px;height:104px;z-index:-2;opacity:.42;filter:saturate(.6) blur(.4px);transform:translateX(-118%)}
.rg:hover .art{transform:translateX(-50%) translateY(-10px) scale(1.1);filter:drop-shadow(0 22px 22px rgba(0,0,0,.55))}
.rg:hover .art.a2{opacity:.7;transform:translateX(-140%) translateY(-4px) rotate(-6deg) scale(1.05);filter:saturate(.9)}
@media (prefers-reduced-motion:reduce){.rg .shine{display:none}.rg:hover .art{transform:translateX(-50%)}}
.rg-t{display:flex;justify-content:space-between;align-items:center;gap:6px}
.gn{white-space:nowrap;display:inline-grid;place-items:center;height:24px;padding:0 9px;border-radius:8px;background:rgba(9,11,17,.45);font:700 11px/1 'IBM Plex Sans',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.85);text-shadow:0 1px 2px rgba(0,0,0,.4)}
.rg .pill{white-space:nowrap;height:22px;font-size:11px;background:rgba(9,11,17,.55);border-color:rgba(255,255,255,.18);color:#FFF}
.rg h3{margin:auto 0 0;font-size:30px;font-weight:700;line-height:1}
.rg p{margin:6px 0 0;font-size:12.5px;color:rgba(255,255,255,.82)}
.rg-n{margin-top:10px;font-size:12px;color:rgba(255,255,255,.75)}
.rg-n b{font:700 18px/1 'Fredoka',sans-serif;color:#FFF}
.rg-l{display:flex;gap:6px;margin-top:12px}
.pk .rg-l a{flex:1;display:grid;place-items:center;height:32px;border-radius:10px;background:rgba(255,255,255,.92);color:#1A1405;font:600 12.5px/1 'Fredoka',sans-serif;text-decoration:none}
.pk .rg-l a:hover{background:#FFCB3D}
.rg.on{outline:2px solid #FFCB3D;outline-offset:3px}
.rg.gx .gx-slot{position:relative;height:84px;margin-top:12px;border-color:rgba(255,255,255,.45);color:rgba(255,255,255,.85);background:repeating-linear-gradient(135deg,rgba(255,255,255,.08) 0 12px,transparent 12px 24px)}
.rg.gx .gx-slot b{color:#FFF}
.tools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.pk a.tl,.tl{display:flex;flex-direction:column;border-radius:24px;overflow:hidden;background:#0D1119;border:1px solid rgba(255,255,255,.07);text-decoration:none;color:#EEF1F6;transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .3s}
.tl:hover{transform:translateY(-4px);border-color:rgba(255,203,61,.45)}
.tl-v{height:180px;display:grid;place-items:center;padding:16px;position:relative;overflow:hidden}
.t-dex .tl-v{background:linear-gradient(135deg,#FF5A5F,#C2185B)}
.t-typ .tl-v{background:linear-gradient(135deg,#1E2A44,#0E1424)}
.t-nat .tl-v{background:linear-gradient(135deg,#5B6CFF,#8E44AD);gap:10px}
.t-cmp .tl-v{background:linear-gradient(135deg,#FFB547,#FF6A3D)}
.mosaic{grid-template-columns:repeat(8,1fr);display:grid;gap:0;place-items:center}
.mosaic .spr{width:44px;height:44px;transition:transform .3s}
.tl:hover .mosaic .spr:nth-child(3n){transform:translateY(-4px)}
.mini{display:grid;grid-template-columns:repeat(18,7px);gap:1.5px}
.mini i{width:7px;height:7px;border-radius:1.5px;background:rgba(255,255,255,.08)}
.mini i.x2{background:#4ADE80}
.mini i.x5{background:#F87171}
.mini i.x0{background:#0A0D14;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
.nat{display:grid;grid-template-columns:repeat(5,22px);gap:4px}
.nat i{width:22px;height:22px;border-radius:6px;background:var(--c);opacity:.9}
.nat i.nd{background:rgba(255,255,255,.25)}
.abch{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.abch span{padding:3px 8px;border-radius:999px;font-size:11px;font-weight:700;background:rgba(255,255,255,.9);color:#2A1B4A}
.abch span:nth-child(2){background:#7CF3B0;color:#0B2A1A}
.abch span:nth-child(3){background:#FF8A8A;color:#3A0B0B}
.bars{display:flex;flex-direction:column;gap:4px;width:100%;place-items:stretch}
.tb5{display:flex;align-items:center;gap:8px}
.tb5 .ma{width:30px;height:30px}
.tb5 .bar{flex:1;height:10px;background:rgba(0,0,0,.2)}
.tl-b{padding:16px 18px 20px}
.tl-b b{display:block;font-size:21px;font-weight:600}
.tl-b span{display:block;margin-top:6px;font-size:13.5px;color:#A3ACBA}
.kband{display:grid;grid-template-columns:minmax(0,1fr) 440px;gap:36px;align-items:center;padding:36px;border-radius:32px;background:radial-gradient(90% 120% at 0% 0%,rgba(227,53,13,.35),transparent 60%),radial-gradient(80% 120% at 100% 100%,rgba(255,183,3,.25),transparent 60%),#0D1119;border:1px solid rgba(255,255,255,.08)}
.kb-tx p{margin:12px 0 0;color:#B2BAC6;max-width:520px}
.gb{padding:22px 22px 16px;border-radius:22px 22px 60px 22px;background:linear-gradient(180deg,#CFCBC2,#B6B1A6);box-shadow:inset 0 -6px 0 rgba(0,0,0,.12),0 30px 60px -30px rgba(0,0,0,.9)}
.gb-scr{position:relative;height:200px;border-radius:10px;border:10px solid #5F6371;background:#9BBC0F;overflow:hidden}
.parade{display:flex;gap:6px;padding:16px 0 0;width:max-content;animation:slide 60s linear 6}
.parade .g1s{width:56px;height:56px;flex-shrink:0;filter:sepia(1) hue-rotate(40deg) saturate(2.4) brightness(.55) contrast(1.4)}
.gb-box{position:absolute;left:8px;right:8px;bottom:8px;padding:10px 12px;border-radius:6px;background:#E0F0C0;border:3px solid #306230;color:#0F380F;font-size:15px;font-weight:700;letter-spacing:.04em}
.gb-led{display:flex;align-items:center;gap:8px;margin-top:10px;font:700 11px/1 'IBM Plex Sans',sans-serif;letter-spacing:.14em;color:#4B4F5C}
.gb-led i{width:9px;height:9px;border-radius:50%;background:#E3350D;box-shadow:0 0 8px #FF5A3D}

@media (max-width:1100px){
  .news{grid-template-columns:repeat(2,minmax(0,1fr))}
  .regs{grid-template-columns:repeat(3,minmax(0,1fr))}
  .tools{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:860px){
  .hero-in{padding-top:32px;padding-bottom:40px;gap:20px}
  .stage{flex-basis:100%;max-width:440px;margin:0 auto}
  .meta{grid-template-columns:minmax(0,1fr)}
  .mset{order:-1}
  .minfo{grid-template-columns:minmax(0,1fr)}
  .kband{grid-template-columns:minmax(0,1fr);padding:24px}
  .gb{max-width:440px}
}
@media (max-width:640px){
  .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mr{grid-template-columns:28px 44px minmax(0,1fr) 92px;gap:8px;padding-right:8px}
  .mr .ma{width:44px;height:44px}
  .mu b{width:40px;font-size:13px}
  .mu .bar{display:none}
  .ms-art{height:230px}
  .ms-art .art{width:220px;height:220px}
  .ms-art .disc{width:200px;height:200px}
  .ms-u{grid-template-columns:minmax(0,1fr)}
  .news{grid-template-columns:minmax(0,1fr)}
  .regs{grid-template-columns:repeat(2,minmax(0,1fr))}
  .tools{grid-template-columns:minmax(0,1fr)}
  .fc1{left:0}.fc2{right:0}.fc3{right:0}
}
@media (max-width:560px){
  .h1{font-size:44px}
  .lead{font-size:16px}
  .ms-b{padding:0 18px 20px}
  .ms-h h3{font-size:26px}
  .moves{grid-template-columns:minmax(0,1fr)}
  .rg{min-height:220px}
  .rg h3{font-size:24px}
  .rg .art{width:130px;height:130px}
  .rg .art.a2{display:none}
  .fc{padding:6px 10px 6px 6px}
  .fc img{width:40px;height:40px}
  .fc b{font-size:14px}
  .fc3,.fc1{display:none}
  .wb{width:30px;height:30px;margin:-15px 0 0 -15px}
  .wb .tglyph{width:15px;height:15px}
  .gb-scr{height:170px}
}
</style>
