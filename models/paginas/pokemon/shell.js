/* Nav de la web, barra de Pokémon, pie y barra de móvil para los diseños.
   Cada página pone <body data-page="…"> y este script pinta el resto. */

(() => {
  const page = document.body.dataset.page;
  const I = {
    ball: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    chev: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
    home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z"/></svg>',
    grid: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
    map: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></svg>',
  };
  window.ICON = I;

  const links = [
    ["inicio", "index.html", "Inicio"],
    ["kanto", "kanto.html", "Kanto"],
    ["pokedex", "pokedex.html", "Pokédex"],
    ["mapa", "mapa-kanto.html", "Mapa"],
    ["guia", "guia-kanto.html", "Guía 100 %"],
    ["tipos", "tipos.html", "Tipos"],
    ["habilidades", "habilidades.html", "Habilidades y naturalezas"],
    ["competitivo", "competitivo.html", "Competitivo"],
  ];

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<header class="nav">
      <a class="brand" href="index.html"><img src="gm-favicon.svg" alt=""><span>GrietaMeta</span></a>
      <nav class="games" aria-label="Juegos">
        <a href="#">League of Legends</a><a href="#">ARC Raiders</a><a href="#">Zelda</a><a class="on" href="index.html">Pokémon</a><a href="#">Más juegos</a>
      </nav>
      <div class="search">${I.search}<span>Busca un juego o Pokémon</span><kbd>/</kbd></div>
      <a class="acct" href="#" aria-label="Mi cuenta">${I.user}</a>
    </header>
    <nav class="sub" aria-label="Pokémon">
      <a class="logo" href="index.html">${I.ball}Pokémon</a>
      ${links.map(([id, href, t]) => `<a class="slink${id === page ? " on" : ""}" href="${href}"${id === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
      <button class="gen-pick" type="button" aria-label="Generación: I, Kanto"><b>GEN I</b>Kanto ${I.chev}</button>
    </nav>`
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer class="foot"><div class="wrap">
      <span>GrietaMeta · guías hechas por fans. Pokémon y sus nombres son marcas de Nintendo, Creatures y GAME FREAK.</span>
      <span><a href="#">Contacto</a> · <a href="#">Privacidad</a></span>
    </div></footer>
    <nav class="tabbar" aria-label="Navegación móvil">
      <a href="index.html" class="${page === "inicio" ? "on" : ""}">${I.home}Inicio</a>
      <a href="#">${I.grid}Juegos</a>
      <a href="pokedex.html" class="${page === "pokedex" ? "on" : ""}">${I.ball}Pokédex</a>
      <a href="mapa-kanto.html" class="${page === "mapa" ? "on" : ""}">${I.map}Mapa</a>
      <a href="#">${I.user}Cuenta</a>
    </nav>`
  );

  // Ayudas para las páginas.
  window.typeChip = (code) => {
    const t = PK.TYPES[code];
    return `<span class="type" style="--t:${t.c}">${t.n}</span>`;
  };
  window.dexNo = (id) => "#" + String(id).padStart(3, "0");
  window.spriteSlot = () => `<div class="sprite" aria-hidden="true">${I.ball}</div>`;
})();
