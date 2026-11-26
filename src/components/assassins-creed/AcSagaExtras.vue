<template>
  <!-- UNITY DESTACADA -->
  <section class="ac-section">
    <div class="ac-wrap">
      <RouterLink class="feat" to="/assassins-creed/unity">
        <img class="ft-bg" loading="lazy" decoding="async" src="/images/assassins-creed/hero-ac.webp" alt="">
        <div class="ft-t">
          
          <h2>Unity, París al completo</h2>
          <p>Nuestra primera guía de la saga: el París de 1789 dibujado barrio a barrio y la historia de Arno memoria a memoria, con tu progreso guardado.</p>
          <ul>
            <li><b>22</b> barrios en un mapa ilustrado</li>
            <li><b>34</b> memorias paso a paso</li>
            <li><b>11</b> tipos de actividades explicadas</li>
            <li>Spoilers ocultos por defecto</li>
          </ul>
          <span class="ac-button primary">Abrir la guía <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg></span>
        </div>
        <div class="ft-m"><img class="ft-map" loading="lazy" decoding="async" src="/images/assassins-creed/paris-1790-mini.webp" alt="Plano de París de 1790 de la guía"><svg class="mini" viewBox="0 0 2928 2016" preserveAspectRatio="none" aria-hidden="true"><polyline class="mrt" points="2077,860 1418,1077 1575,1105 1263,497 1222,800 1389,817 1395,962 590,925 1643,452"></polyline><circle class="md" cx="2077" cy="860" r="16"></circle><circle class="md" cx="1418" cy="1077" r="16"></circle><circle class="md" cx="1575" cy="1105" r="16"></circle><circle class="md" cx="1263" cy="497" r="16"></circle><circle class="md" cx="1222" cy="800" r="16"></circle><circle class="md" cx="1389" cy="817" r="16"></circle><circle class="md" cx="1395" cy="962" r="16"></circle><circle class="md" cx="590" cy="925" r="16"></circle><circle class="md" cx="1643" cy="452" r="16"></circle></svg><span class="ft-c">París, 1790 · mapa de la guía</span></div>
      </RouterLink>
    </div>
  </section>

  <!-- EMPEZAR -->
  <section class="ac-section" id="empezar">
    <div class="ac-wrap">
      <div class="ac-heading"><div><h2>¿Por dónde empiezo?</h2><p>Cada juego se entiende por separado, pero según lo que busques hay mejores puertas de entrada.</p></div></div>
      <div class="starts">
        <article class="st">
          <h3>Quiero la historia desde el principio</h3>
          <p>Empieza por el primer Assassin&#x27;s Creed y sigue con la trilogía de Ezio (II, Brotherhood y Revelations). La Ezio Collection reúne los tres.</p>
          <div class="st-g"><span>Assassin&#x27;s Creed</span><span>Assassin&#x27;s Creed II</span><span>Brotherhood</span><span>Revelations</span></div>
        </article>
        <article class="st">
          <h3>Quiero parkour y una ciudad viva</h3>
          <p>Unity: el París de la Revolución a escala real, con el mejor parkour de la saga y cooperativo para cuatro. Tienes la guía completa aquí.</p>
          <div class="st-g"><span>Unity</span></div>
        </article>
        <article class="st">
          <h3>Prefiero un RPG de mundo abierto</h3>
          <p>Origins, Odyssey y Valhalla: mapas enormes, niveles, equipo y decenas de horas por juego.</p>
          <div class="st-g"><span>Origins</span><span>Odyssey</span><span>Valhalla</span></div>
        </article>
        <article class="st">
          <h3>Quiero lo más nuevo</h3>
          <p>Shadows (2025), con Naoe y Yasuke en Japón, y Black Flag Resynced (2026), el remake de las aventuras piratas de Edward Kenway.</p>
          <div class="st-g"><span>Shadows</span><span>Black Flag Resynced</span></div>
        </article>
      </div>
    </div>
  </section>

  <!-- NOVEDADES -->
  <section class="ac-section" id="novedades">
    <div class="ac-wrap">
      <div class="ac-heading"><div><h2>Qué se mueve en la saga</h2></div></div>
      <div class="news">
        <article class="nw"><time>9 jul 2026</time><h3>Black Flag Resynced ya está a la venta</h3><p>Ubisoft rehízo Black Flag desde cero: combate revisado, misiones nuevas y la historia de Edward Kenway con gráficos actuales.</p></article>
        <article class="nw"><time>5 mar 2026</time><h3>Unity, a 60 FPS en PS5 y Xbox Series</h3><p>La actualización 1.06 desbloquea los 60 FPS en consolas actuales. Buen momento para volver a París (o empezar con nuestra guía).</p></article>
        <article class="nw"><time>2026</time><h3>Hexe sigue sin fecha</h3><p>El siguiente gran Assassin&#x27;s Creed aún no tiene fecha oficial. Las filtraciones hablan de 2027.</p></article>
      </div>
    </div>
  </section>
</template>

<style scoped src="./ac-page.css"></style>
<style scoped>
.feat { position: relative; isolation: isolate; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: clamp(20px,4vw,50px); padding: clamp(20px,4vw,45px); overflow: hidden; color: var(--ac-text); border: 1px solid #784257; border-radius: 10px; text-decoration: none; background: #13131b; }
.feat:is(:hover,:focus-visible){border-color:#db7085;color:var(--ac-text)}
.ft-bg { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 28%; }
.feat::before { content: ""; position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg,#080d17 14%,#121625da 75%,#151726be); }
.ft-t p { color: #cfdae4; margin: 12px 0 0; max-width: 50ch; }
.ft-t ul { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px 14px; padding: 0; margin: 20px 0; list-style: none; font-size: .9rem; }
.ft-t li { padding-left: 12px; border-left: 1px solid #eb677d; }
.ft-t li b { color: #fff; font: 700 1.3rem/1 var(--ac-display); }
.ft-m { position: relative; overflow: hidden; border: 1px solid #7f7868; border-radius: 7px; }
.ft-map { display: block; width: 100%; aspect-ratio: 2928 / 2016; }
.mini { position: absolute; inset: 0; width: 100%; height: 100%; }
.mrt { fill: none; stroke: #d42b49; stroke-width: 9; stroke-dasharray: 22 16; }
.md { fill: #bd1433; stroke: #fff0e7; stroke-width: 5; }
.ft-c { position: absolute; left: 10px; bottom: 9px; padding: 5px 8px; background: #1a1a1a; color: #f1e0bb; font-size: .78rem; }
.starts, .news { display: grid; gap: 12px; }
.starts { grid-template-columns: repeat(4,minmax(0,1fr)); }
.news { grid-template-columns: repeat(3,minmax(0,1fr)); }
.st, .nw { display: flex; flex-direction: column; gap: 10px; padding: 20px; border: 1px solid var(--ac-line); border-radius: 6px; background: #0e1720; }
.st h3, .nw h3 { margin: 0; font: 700 1.55rem/1.08 var(--ac-display); }
.st p, .nw p { margin: 0; color: #bbcbd6; font-size: .9rem; }
.st-g { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 6px; }
.st-g span { padding: 4px 8px; border: 1px solid #324552; border-radius: 3px; font-size: .76rem; }
.nw { border-left-color: #de5b70; }
.nw time { color: #f392a2; font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; }
@media (max-width: 1050px) { .starts { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (max-width: 760px) { .feat,.news { grid-template-columns: minmax(0,1fr); } }
@media (max-width: 560px) { .starts { grid-template-columns: minmax(0,1fr); } .ft-t ul { grid-template-columns: minmax(0,1fr); } }
</style>
