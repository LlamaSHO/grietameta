/* Lógica de la vista (migrada tal cual desde el antiguo index.html).
   Se ejecuta al montar la vista; los listeners globales usan `signal` para
   limpiarse al salir de ella. */

import { fetchChampionStats } from "@/services/riotStats";
import { createCheckoutSession, checkPremium } from "@/services/premium";

export function init({ root, signal }) {
  // Elemento raíz de la vista: sustituye a <body> para la clase is-premium.
  const viewRoot = root;

  /* =========================================================================
     GrietaMeta — dataset de campeones
     Nota: winrate/pickrate/banrate y tiers se generan de forma determinista
     (semilla = nombre del campeón) para simular un panorama de parche
     coherente y estable entre recargas. En producción esto debe sustituirse
     por una integración con una API de estadísticas en vivo (parche actual).
     ========================================================================= */

  // [nombre, rol principal, clase]
  const ROSTER = [
  ["Aatrox","Top","Luchador"],["Ahri","Mid","Mago"],["Akali","Mid","Asesino"],["Akshan","Mid","Tirador"],
  ["Alistar","Support","Soporte"],["Ambessa","Top","Luchador"],["Amumu","Jungla","Tanque"],["Anivia","Mid","Mago"],
  ["Annie","Mid","Mago"],["Aphelios","ADC","Tirador"],["Ashe","ADC","Tirador"],["Aurelion Sol","Mid","Mago"],
  ["Aurora","Mid","Mago"],["Azir","Mid","Mago"],["Bard","Support","Soporte"],["Bel'Veth","Jungla","Luchador"],
  ["Blitzcrank","Support","Tanque"],["Brand","Support","Mago"],["Braum","Support","Tanque"],["Briar","Jungla","Asesino"],
  ["Caitlyn","ADC","Tirador"],["Camille","Top","Luchador"],["Cassiopeia","Mid","Mago"],["Cho'Gath","Top","Tanque"],
  ["Corki","Mid","Tirador"],["Darius","Top","Luchador"],["Diana","Jungla","Mago"],["Dr. Mundo","Top","Tanque"],
  ["Draven","ADC","Tirador"],["Ekko","Jungla","Asesino"],["Elise","Jungla","Mago"],["Evelynn","Jungla","Asesino"],
  ["Ezreal","ADC","Tirador"],["Fiddlesticks","Jungla","Mago"],["Fiora","Top","Luchador"],["Fizz","Mid","Asesino"],
  ["Galio","Mid","Tanque"],["Gangplank","Top","Luchador"],["Garen","Top","Luchador"],["Gnar","Top","Luchador"],
  ["Gragas","Jungla","Luchador"],["Graves","Jungla","Tirador"],["Gwen","Top","Luchador"],["Hecarim","Jungla","Luchador"],
  ["Heimerdinger","Mid","Mago"],["Hwei","Mid","Mago"],["Illaoi","Top","Luchador"],["Irelia","Top","Luchador"],
  ["Ivern","Jungla","Soporte"],["Janna","Support","Soporte"],["Jarvan IV","Jungla","Luchador"],["Jax","Top","Luchador"],
  ["Jayce","Top","Tirador"],["Jhin","ADC","Tirador"],["Jinx","ADC","Tirador"],["K'Sante","Top","Tanque"],
  ["Kai'Sa","ADC","Tirador"],["Kalista","ADC","Tirador"],["Karma","Support","Mago"],["Karthus","Jungla","Mago"],
  ["Kassadin","Mid","Asesino"],["Katarina","Mid","Asesino"],["Kayle","Top","Luchador"],["Kayn","Jungla","Asesino"],
  ["Kennen","Top","Mago"],["Khazix","Jungla","Asesino"],["Kindred","Jungla","Tirador"],["Kled","Top","Luchador"],
  ["Kog'Maw","ADC","Tirador"],["LeBlanc","Mid","Asesino"],["Lee Sin","Jungla","Luchador"],["Leona","Support","Tanque"],
  ["Lillia","Jungla","Mago"],["Lissandra","Mid","Mago"],["Lucian","ADC","Tirador"],["Lulu","Support","Soporte"],
  ["Lux","Support","Mago"],["Malphite","Top","Tanque"],["Malzahar","Mid","Mago"],["Maokai","Support","Tanque"],
  ["Master Yi","Jungla","Tirador"],["Mel","Mid","Mago"],["Milio","Support","Soporte"],["Miss Fortune","ADC","Tirador"],
  ["Mordekaiser","Top","Luchador"],["Morgana","Support","Mago"],["Naafiri","Mid","Asesino"],["Nami","Support","Soporte"],
  ["Nasus","Top","Luchador"],["Nautilus","Support","Tanque"],["Neeko","Mid","Mago"],["Nidalee","Jungla","Mago"],
  ["Nilah","ADC","Luchador"],["Nocturne","Jungla","Asesino"],["Nunu & Willump","Jungla","Tanque"],["Olaf","Jungla","Luchador"],
  ["Orianna","Mid","Mago"],["Ornn","Top","Tanque"],["Pantheon","Jungla","Luchador"],["Poppy","Jungla","Tanque"],
  ["Pyke","Support","Asesino"],["Qiyana","Mid","Asesino"],["Quinn","Top","Tirador"],["Rakan","Support","Soporte"],
  ["Rammus","Jungla","Tanque"],["Rek'Sai","Jungla","Luchador"],["Rell","Support","Tanque"],["Renata Glasc","Support","Mago"],
  ["Renekton","Top","Luchador"],["Rengar","Jungla","Asesino"],["Riven","Top","Luchador"],["Rumble","Top","Mago"],
  ["Ryze","Mid","Mago"],["Samira","ADC","Tirador"],["Sejuani","Jungla","Tanque"],["Senna","Support","Tirador"],
  ["Seraphine","Support","Mago"],["Sett","Top","Luchador"],["Shaco","Jungla","Asesino"],["Shen","Top","Tanque"],
  ["Shyvana","Jungla","Luchador"],["Singed","Top","Tanque"],["Sion","Top","Tanque"],["Sivir","ADC","Tirador"],
  ["Skarner","Jungla","Tanque"],["Smolder","ADC","Tirador"],["Sona","Support","Soporte"],["Soraka","Support","Soporte"],
  ["Swain","Support","Mago"],["Sylas","Mid","Luchador"],["Syndra","Mid","Mago"],["Tahm Kench","Support","Tanque"],
  ["Taliyah","Jungla","Mago"],["Talon","Mid","Asesino"],["Taric","Support","Tanque"],["Teemo","Top","Tirador"],
  ["Thresh","Support","Tanque"],["Tristana","ADC","Tirador"],["Trundle","Jungla","Luchador"],["Tryndamere","Top","Luchador"],
  ["Twisted Fate","Mid","Mago"],["Twitch","ADC","Tirador"],["Udyr","Jungla","Luchador"],["Urgot","Top","Luchador"],
  ["Varus","ADC","Tirador"],["Vayne","ADC","Tirador"],["Veigar","Mid","Mago"],["Vel'Koz","Support","Mago"],
  ["Vex","Mid","Mago"],["Vi","Jungla","Luchador"],["Viego","Jungla","Asesino"],["Viktor","Mid","Mago"],
  ["Vladimir","Top","Mago"],["Volibear","Jungla","Luchador"],["Warwick","Jungla","Luchador"],["Wukong","Top","Luchador"],
  ["Xayah","ADC","Tirador"],["Xerath","Mid","Mago"],["Xin Zhao","Jungla","Luchador"],["Yasuo","Mid","Luchador"],
  ["Yone","Mid","Luchador"],["Yorick","Top","Luchador"],["Yuumi","Support","Soporte"],["Zac","Jungla","Tanque"],
  ["Zed","Mid","Asesino"],["Zeri","ADC","Tirador"],["Ziggs","Mid","Mago"],["Zilean","Support","Mago"],
  ["Zoe","Mid","Mago"],["Zyra","Support","Mago"],
  ];

  const ROLES = ["Top","Jungla","Mid","ADC","Support"];

  const ROLE_ICONS = {
    Top:    "M12 2 L22 7 V17 L12 22 L2 17 V7 Z",
    Jungla: "M12 2 C6 2 3 7 3 12 C3 18 8 22 12 22 C16 22 21 18 21 12 C21 7 18 2 12 2 Z",
    Mid:    "M2 12 L12 2 L22 12 L12 22 Z",
    ADC:    "M2 20 L12 4 L22 20 Z",
    Support:"M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z",
  };

  const CLASS_COLOR = {
    Luchador:  ["#C0574F","#8A3D38"],
    Tanque:    ["#6FC0E0","#3E7E96"],
    Mago:      ["#8E6FD6","#5B4796"],
    Asesino:   ["#B85FC9","#7A3E86"],
    Tirador:   ["#E7B84B","#9C7A2E"],
    Soporte:   ["#4FA97A","#337055"],
  };

  // Pools de objetos por clase (nombres genéricos de estilo Hextech, no marcas de Riot)
  const ITEM_POOLS = {
    Luchador: {
      starter: ["Espadón de duelo","Poción de salud ×2"],
      core: ["Filo del titán fracturado","Cota de placas eterna","Yelmo del vigor infinito"],
      boots: ["Botas de rango de placas"],
      situational: ["Guantelete espectral","Máscara de la muerte","Ancla de bruma"],
    },
    Tanque: {
      starter: ["Escudo del centinela","Poción de salud ×2"],
      core: ["Corazón de acero forjado","Bastión de sol negro","Yunque de escarcha"],
      boots: ["Botas de resistencia mercuria"],
      situational: ["Égida del alba","Cinturón del gigante","Manto de espinas"],
    },
    Mago: {
      starter: ["Reloj de arena arcano","Poción de maná ×2"],
      core: ["Cetro del vacío hueco","Reloj de arena del zenit","Sombrero de sombrero de bruja"],
      boots: ["Botas de flujo arcano"],
      situational: ["Vela de morgana","Bastón de hielo eterno","Cáliz de la redención"],
    },
    Asesino: {
      starter: ["Daga larga","Poción de salud ×3"],
      core: ["Filo de la noche eterna","Espada del duelista umbrío","Verdugo colapsable"],
      boots: ["Botas de sigilo fantasma"],
      situational: ["Guadaña de sangre","Máscara de la muerte","Espejo de Ravenor"],
    },
    Tirador: {
      starter: ["Espadón de la ejecución","Poción de salud ×2"],
      core: ["Filo infinito","Rabia del berserker","Foco predatorio"],
      boots: ["Botas de acero rápido"],
      situational: ["Bailarina fantasma","Guadaña mortal","Corte de la lluvia"],
    },
    Soporte: {
      starter: ["Reliquia del escudo","Ficha de la agencia"],
      core: ["Corazón de oro imbuido","Báculo lunar creciente","Redención celeste"],
      boots: ["Botas de flujo de maná"],
      situational: ["Velo de faerie","Cetro del capitán","Ala de ángel"],
    },
  };

  const RUNE_POOLS = {
    Luchador: {keystone:"Segar", tree:"Dominación"},
    Tanque: {keystone:"Aftershock", tree:"Resolve"},
    Mago: {keystone:"Aria arcana", tree:"Dominación"},
    Asesino: {keystone:"Cazador eléctrico", tree:"Dominación"},
    Tirador: {keystone:"Pisada letal", tree:"Precisión"},
    Soporte: {keystone:"Guardián", tree:"Resolve"},
  };

  // --- generación determinista (seed = nombre) -------------------------------
  function seedFromString(str){
    let h = 2166136261;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      return ((h >>> 0) / 4294967295);
    };
  }

  function pick(rng, arr, n){
    const copy = [...arr];
    const out = [];
    for(let i=0;i<n && copy.length;i++){
      const idx = Math.floor(rng()*copy.length);
      out.push(copy.splice(idx,1)[0]);
    }
    return out;
  }

  function tierFromScore(score){
    if(score >= 0.82) return "S";
    if(score >= 0.62) return "A";
    if(score >= 0.38) return "B";
    return "C";
  }

  const CHAMPIONS = ROSTER.map(([name, role, cls]) => {
    const rng = seedFromString(name);
    const winrate = +(46.5 + rng()*8.5).toFixed(1);          // 46.5% - 55%
    const pickrate = +(2 + rng()*16).toFixed(1);              // 2% - 18%
    const banrate = +(0.5 + rng()*22).toFixed(1);             // 0.5% - 22.5%
    const difficulty = ["Baja","Media","Alta"][Math.floor(rng()*3)];
    const score = (winrate-46.5)/8.5*0.55 + (pickrate/18)*0.25 + (banrate/22.5)*0.2;
    const tier = tierFromScore(score);
    const pool = ITEM_POOLS[cls];
    const build = {
      starter: pool.starter,
      core: pick(rng, pool.core, 3).length ? pool.core : pool.core,
      boots: pool.boots,
      situational: pick(rng, pool.situational, 2),
    };
    const runes = RUNE_POOLS[cls];
    const secondaryRoles = ROLES.filter(r => r !== role && rng() > 0.88);
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]/g,""),
      name, role, cls, winrate, pickrate, banrate, difficulty, tier, build, runes, secondaryRoles,
    };
  });

  /* =========================================================================
     GrietaMeta — imágenes de campeones (Data Dragon, CDN oficial de Riot Games)
     Riot permite el uso de estos assets estáticos para proyectos de fans, ver
     "Legal Jibber Jabber": https://www.riotgames.com/en/legal
     ========================================================================= */

  // Versión de Data Dragon para las imágenes. Este valor es solo un respaldo:
  // al cargar champion-stats.json se sustituye por la versión que usó el script
  // la última vez, así no hay que actualizarla a mano en cada parche.
  let DDRAGON_VERSION = "16.19.1";

  // Data Dragon usa un "id" de campeón que no siempre coincide con un slug
  // simple del nombre (p. ej. Wukong -> MonkeyKing). Estas son las excepciones
  // dentro de nuestro roster; el resto se calcula automáticamente.
  const DDRAGON_ID_OVERRIDES = {
    belveth: "Belveth",
    chogath: "Chogath",
    kaisa: "Kaisa",
    leblanc: "Leblanc",
    nunuwillump: "Nunu",
    renataglasc: "Renata",
    velkoz: "Velkoz",
    wukong: "MonkeyKing",
  };

  function ddragonId(c){
    return DDRAGON_ID_OVERRIDES[c.id] || c.name.replace(/[.']/g, "").replace(/\s+/g, "");
  }

  function champIconUrl(c){
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${ddragonId(c)}.png`;
  }

  // <img> con la imagen oficial del campeón. Si la URL fallara (parche
  // desincronizado, CDN caído, etc.) el propio <img> se autoelimina con
  // onerror, dejando a la vista el monograma de color que ya sirve de fondo.
  function champThumbImg(c){
    return `<img class="champ-thumb" src="${champIconUrl(c)}" alt="${c.name}" loading="lazy" onerror="this.remove()">`;
  }

  /* =========================================================================
     GrietaMeta — render & interacción
     ========================================================================= */

  const state = {
    role: "Todos",
    query: "",
    isPremium: false, // true = Premium activo = la web se muestra sin anuncios
    realStats: false, // true cuando champion-stats.json se cargó con datos reales
    rank: "ALL",      // filtro de rango activo ("ALL" = todos los rangos juntos)
    rankStats: null,  // estadísticas por rango (data.ranks de champion-stats.json)
  };

  // ---------------------------------------------------------------- helpers --
  function monogram(name){
    const clean = name.replace(/[^A-Za-zÀ-ÿ' ]/g,"");
    const parts = clean.split(" ").filter(Boolean);
    if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return clean.slice(0,2).toUpperCase();
  }

  function artStyle(cls){
    const [c1,c2] = CLASS_COLOR[cls];
    return `background:linear-gradient(150deg, ${c1}, ${c2});`;
  }

  function roleIconSVG(role, color){
    const d = ROLE_ICONS[role] || ROLE_ICONS.Mid;
    return `<svg width="13" height="13" viewBox="0 0 24 24" style="opacity:.85"><path d="${d}" fill="none" stroke="${color||'currentColor'}" stroke-width="2"/></svg>`;
  }

  function wrClass(wr){ return wr >= 50 ? "win" : "loss"; }

  // Normaliza texto para buscar sin depender de acentos, apóstrofes, mayúsculas
  // ni espacios: "ksante" o "K'Sante" o "k’sante" encuentran lo mismo.
  function normalizeSearch(s){
    return s
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // ------------------------------------------------------------ rank chips --
  // Insignias de rango dibujadas aquí mismo (SVG propio, no los emblemas oficiales
  // de Riot): no dependen de ningún enlace externo y nunca se rompen.
  const RANK_ORDER = ["ALL","IRON","BRONZE","SILVER","GOLD","PLATINUM","EMERALD","DIAMOND","MASTER_PLUS"];
  const RANK_INFO = {
    ALL:         { label:"Todos",     color:"#C8963E" },
    IRON:        { label:"Hierro",    color:"#8E9196" },
    BRONZE:      { label:"Bronce",    color:"#B4764A" },
    SILVER:      { label:"Plata",     color:"#B9C3CE" },
    GOLD:        { label:"Oro",       color:"#E4B544" },
    PLATINUM:    { label:"Platino",   color:"#3FB8A9" },
    EMERALD:     { label:"Esmeralda", color:"#2FBC74" },
    DIAMOND:     { label:"Diamante",  color:"#6FA6F4" },
    MASTER_PLUS: { label:"Master+",   color:"#B664DB" },
  };

  function rankBadgeSvg(key){
    const c = RANK_INFO[key].color;
    const symbols = {
      ALL:         `<circle cx="12" cy="12" r="3.2" fill="${c}"/>`,
      IRON:        `<path d="M7 12h10" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`,
      BRONZE:      `<path d="M7.5 10.5 12 14.5l4.5-4" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      SILVER:      `<path d="M7.5 8.5 12 12.5l4.5-4M7.5 13 12 17l4.5-4" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      GOLD:        `<path d="M7.5 7 12 11l4.5-4M7.5 11 12 15l4.5-4M7.5 15 12 19l4.5-4" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      PLATINUM:    `<path d="M12 6.5 17 12l-5 5.5L7 12Z" stroke="${c}" stroke-width="1.8" fill="none" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.5" fill="${c}"/>`,
      EMERALD:     `<path d="M12 6.5 16.5 9v6L12 17.5 7.5 15V9Z" fill="${c}"/>`,
      DIAMOND:     `<path d="M12 6 17.5 12 12 18 6.5 12Z" fill="${c}"/><path d="M6.5 12h11M12 6l-2.2 6 2.2 6 2.2-6Z" stroke="#0A0D12" stroke-opacity=".55" stroke-width=".9" fill="none" stroke-linejoin="round"/>`,
      MASTER_PLUS: `<path d="M12 5.5 13.7 10.3 18.5 12l-4.8 1.7L12 18.5l-1.7-4.8L5.5 12l4.8-1.7Z" fill="${c}"/>`,
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.8 21 7v10l-9 5.2L3 17V7Z" fill="${c}" fill-opacity=".16" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/>${symbols[key]}</svg>`;
  }

  function renderRankChips(){
    const root = document.getElementById("rankChips");
    if(!root) return;
    if(!state.rankStats){ root.hidden = true; return; }
    root.hidden = false;
    root.innerHTML = RANK_ORDER.map(key=>{
      const entry = key === "ALL" ? null : state.rankStats[key];
      const published = entry ? Object.keys(entry.champions || {}).length : 0;
      const disabled = key !== "ALL" && !published;
      const title = key === "ALL"
        ? "Todos los rangos juntos"
        : published
          ? `${entry.matches.toLocaleString("es-ES")} partidas analizadas`
          : "Aún sin partidas suficientes en este rango";
      return `<button class="chip rank-chip ${state.rank===key?"active":""}" data-rank="${key}" title="${title}" ${disabled?"disabled":""}>${rankBadgeSvg(key)}<span>${RANK_INFO[key].label}</span></button>`;
    }).join("");
    root.querySelectorAll(".rank-chip").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        state.rank = btn.dataset.rank;
        renderRankChips();
        applyRankView();
        renderTierList();
        renderGrid();
      });
    });
  }

  // Carga en cada campeón las estadísticas del rango elegido (las builds son
  // siempre de todos los rangos juntos).
  function applyRankView(){
    CHAMPIONS.forEach(c=>{
      const src = state.rank === "ALL"
        ? c._all
        : (state.rankStats && state.rankStats[state.rank] && state.rankStats[state.rank].champions[c.id]) || null;
      if(!src){ c.noData = true; return; }
      c.noData = false;
      c.winrate = src.winrate;
      c.pickrate = src.pickrate;
      c.banrate = src.banrate;
      c.tier = tierFromScore((c.winrate-46.5)/8.5*0.55 + (c.pickrate/18)*0.25 + (c.banrate/22.5)*0.2);
    });
    const note = document.getElementById("rankNote");
    if(note){
      const entry = state.rankStats && state.rankStats[state.rank];
      if(state.rank === "ALL" || !entry){
        note.hidden = true;
        note.textContent = "";
      } else {
        note.hidden = false;
        note.textContent = `${RANK_INFO[state.rank].label}: ${entry.matches.toLocaleString("es-ES")} partidas analizadas en este rango. Las builds son de todos los rangos juntos.`;
      }
    }
  }

  // ------------------------------------------------------------- role chips --
  function renderChips(){
    const all = ["Todos", ...ROLES];
    document.querySelectorAll(".role-chips").forEach(root=>{
      root.innerHTML = all.map(r =>
        `<button class="chip ${state.role===r?'active':''}" data-role="${r}">${r}</button>`
      ).join("");
      root.querySelectorAll(".chip").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          state.role = btn.dataset.role;
          renderChips();
          renderTierList();
          renderGrid();
        });
      });
    });
  }

  // -------------------------------------------------------------- tier list --
  function renderTierList(){
    const root = document.getElementById("tierListRoot");
    const pool = CHAMPIONS.filter(c => !c.noData && (state.role==="Todos" || c.role===state.role));
    const order = ["S","A","B","C"];
    document.getElementById("tierMeta").textContent = `${pool.length} campeones · ${state.role}`;
    root.innerHTML = order.map(t=>{
      const champs = pool.filter(c=>c.tier===t).sort((a,b)=>b.winrate-a.winrate).slice(0,14);
      const [c1] = CLASS_COLOR.Tirador;
      return `
      <div class="tier-row" data-tier="${t}">
        <div class="tier-label">${t}</div>
        <div class="tier-champs">
          ${champs.map(c=>`
            <div class="tier-pill" data-id="${c.id}">
              <div class="mono" style="${artStyle(c.cls)}">${monogram(c.name)}${champThumbImg(c)}</div>
              <div>
                <div class="name">${c.name}</div>
                <div class="wr">${c.winrate}% WR</div>
              </div>
            </div>
          `).join("") || `<div style="color:var(--ink-faint); font-size:13px; padding:4px;">Sin campeones en este tramo para este rol.</div>`}
        </div>
      </div>`;
    }).join("");
    root.querySelectorAll(".tier-pill").forEach(el=>{
      el.addEventListener("click", ()=> openModal(el.dataset.id));
    });
  }

  // ------------------------------------------------------------------- grid --
  function renderGrid(){
    const root = document.getElementById("champGrid");
    const q = normalizeSearch(state.query.trim());
    const list = CHAMPIONS
      .filter(c => state.role==="Todos" || c.role===state.role)
      .filter(c => !q || normalizeSearch(c.name).includes(q))
      .sort((a,b)=> (Number(!!a.noData) - Number(!!b.noData)) || (b.winrate - a.winrate));

    document.getElementById("gridCount").textContent = `${list.length} resultados`;

    if(!list.length){
      root.innerHTML = "";
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.style.gridColumn = "1/-1";
      empty.textContent = "No encontramos campeones con ese nombre. Prueba con otra búsqueda.";
      root.appendChild(empty);
      return;
    }

    root.innerHTML = list.map(c=>`
      <div class="champ-card" data-id="${c.id}">
        <div class="art" style="${artStyle(c.cls)}">
          <span class="badge-tier">${c.noData ? "–" : c.tier}</span>
          ${monogram(c.name)}
          ${champThumbImg(c)}
        </div>
        <div class="info">
          <div class="name">${c.name}</div>
          <div class="role">${c.role} · ${c.cls}</div>
          ${c.noData ? `
          <div class="wr-row"><span class="pr-value">Sin muestra suficiente</span></div>
          ` : `
          <div class="wr-row">
            <span class="wr-value ${wrClass(c.winrate)}">${c.winrate}%</span>
            <span class="pr-value">${c.pickrate}% pick</span>
          </div>
          <div class="wr-bar"><div class="wr-bar-fill" style="width:${c.winrate}%;"></div></div>
          `}
        </div>
      </div>
    `).join("");

    root.querySelectorAll(".champ-card").forEach(el=>{
      el.addEventListener("click", ()=> openModal(el.dataset.id));
    });
  }

  // ------------------------------------------------------------------ modal --
  function esc(s){
    return String(s).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  function runeIconUrl(icon){
    return /^https?:/.test(icon) ? icon : `https://ddragon.leagueoflegends.com/cdn/img/${icon}`;
  }

  function itemIconUrl(id){
    return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${id}.png`;
  }

  // Los objetos llegan como { id, name }. Si el archivo es antiguo y solo trae
  // el nombre (texto), se enseña sin icono. Si el icono falla, se quita y queda
  // el cuadrado dorado de siempre.
  function buildItemRow(items){
    return `<div class="item-row">${items.map(i=>{
      const it = typeof i === "string" ? { name: i } : i;
      const img = it.id
        ? `<img src="${itemIconUrl(it.id)}" alt="" loading="lazy" onerror="this.remove()">`
        : "";
      return `<div class="item-chip"><div class="item-icon">${img}</div>${esc(it.name)}</div>`;
    }).join("")}</div>`;
  }

  function openModal(id){
    const c = CHAMPIONS.find(x=>x.id===id);
    if(!c) return;
    const overlay = document.getElementById("modalOverlay");
    const root = document.getElementById("modalRoot");

    const buildSection = (title, items) => (items && items.length)
      ? `<div class="build-block"><h4>${title}</h4>${buildItemRow(items)}</div>`
      : "";

    // Solo se muestra una build cuando viene de partidas reales analizadas.
    // Nunca se enseñan objetos de ejemplo como si fueran una build de verdad.
    const hasRealBuild = Boolean(c.buildSampleGames);

    const fullBuildBlock = `
      ${buildSection("Objeto inicial", c.build.starter)}
      ${buildSection("Botas", c.build.boots)}
      ${buildSection("Objetos clave (orden de compra)", c.build.core)}
      ${buildSection("Objetos situacionales según el rival", c.build.situational)}
      ${c.runes ? `
      <div class="build-block">
        <h4>Runas recomendadas</h4>
        <div class="item-row">
          <div class="item-chip"><div class="item-icon">${c.runes.icon ? `<img src="${esc(runeIconUrl(c.runes.icon))}" alt="" loading="lazy" onerror="this.remove()">` : ""}</div>${esc(c.runes.keystone)} · ${esc(c.runes.tree)}</div>
        </div>
      </div>` : ""}
      <div class="build-note">Basado en ${c.buildSampleGames} partidas analizadas${state.rank !== "ALL" ? " (de todos los rangos juntos)" : ""}.</div>
    `;

    const basicBuildBlock = `
      <div class="build-note">${state.realStats
        ? "Aún no hay suficientes partidas analizadas de este campeón para mostrar su build."
        : "Las builds se mostrarán cuando haya datos reales de partidas."}</div>
    `;

    root.innerHTML = `
      <div class="modal-top">
        <button class="modal-close" id="modalCloseBtn">×</button>
        <div class="modal-art" style="${artStyle(c.cls)}">${monogram(c.name)}${champThumbImg(c)}</div>
        <div class="modal-title">
          <h3>${c.name}</h3>
          <div class="sub">${c.role} · ${c.cls} · dificultad ${c.difficulty.toLowerCase()}</div>
        </div>
      </div>
      <div class="modal-stats">
        <div class="mstat"><div class="label">Winrate</div><div class="value ${c.noData ? "" : wrClass(c.winrate)}">${c.noData ? "—" : c.winrate + "%"}</div></div>
        <div class="mstat"><div class="label">Pickrate</div><div class="value">${c.noData ? "—" : c.pickrate + "%"}</div></div>
        <div class="mstat"><div class="label">Banrate</div><div class="value">${c.noData ? "—" : c.banrate + "%"}</div></div>
        <div class="mstat"><div class="label">Tier</div><div class="value">${c.noData ? "—" : c.tier}</div></div>
      </div>
      <div class="modal-body">
        ${hasRealBuild ? fullBuildBlock : basicBuildBlock}
      </div>
    `;

    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    overlay.dataset.currentId = c.id;
    overlay.classList.add("open");

  }

  function closeModal(){
    document.getElementById("modalOverlay").classList.remove("open");
  }

  document.getElementById("modalOverlay").addEventListener("click", (e)=>{
    if(e.target.id === "modalOverlay") closeModal();
  });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeModal();
  }, { signal });

  // ---------------------------------------------------------------- premium --
  function renderPlans(){
    const root = document.getElementById("plansRoot");
    const plans = [
      {
        name:"Gratis", price:"0€", period:"siempre",
        feats:["Tier list completa","Winrate, pickrate y banrate reales","Build completa: inicial, botas, núcleo y runas","Con publicidad"],
        cta:"Tu plan actual", featured:false, plan:null,
      },
      {
        name:"Premium", price:"4,99€", period:"/mes",
        feats:["Todo lo del plan Gratis","Sin publicidad","Alertas de cambios de parche","Acceso anticipado a nuevas herramientas"],
        cta:"Empezar prueba de 7 días", featured:true, plan:"monthly",
      },
    ];
    root.innerHTML = plans.map(p=>`
      <div class="plan-card ${p.featured?'featured':''}">
        <div class="plan-name">${p.name}</div>
        <div class="plan-price">${p.price}<span> ${p.period}</span></div>
        <ul class="plan-feats">${p.feats.map(f=>`<li>${f}</li>`).join("")}</ul>
        <button class="${p.featured?'btn-gold':'btn-outline'}" style="${p.featured?'width:100%;':''}" ${p.plan?`data-plan="${p.plan}"`:'disabled'}>${p.cta}</button>
      </div>
    `).join("");

    root.querySelectorAll("button[data-plan]").forEach(btn=>{
      btn.addEventListener("click", ()=> startCheckout(btn.dataset.plan, btn));
    });
  }

  // ------------------------------------------------------------ Stripe checkout --
  async function startCheckout(plan, btn){
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Redirigiendo a pago seguro…";
    try{
      window.location.href = await createCheckoutSession(plan);
    }catch(err){
      alert(err.message || "Hubo un problema al conectar con el pago. Inténtalo de nuevo.");
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }

  // ------------------------------------------------------------------- init --
  document.querySelectorAll(".search-input").forEach(input=>{
    input.addEventListener("input",(e)=>{
      state.query = e.target.value;
      document.querySelectorAll(".search-input").forEach(other=>{
        if(other !== e.target) other.value = state.query;
      });
      renderGrid();
    });
  });

  renderChips();
  renderTierList();
  renderGrid();
  renderPlans();

  // ------------------------------------------------------ estadísticas reales --
  // champion-stats.json lo genera tools/fetch-riot-stats.mjs (vía GitHub
  // Actions) a partir de partidas reales de la API de Riot. Si el archivo no
  // existe todavía o falla la carga, la web se queda tal cual con los datos
  // ilustrativos de siempre — nunca se rompe por esto.
  async function loadRealStats(){
    // null si no hay conexión, falta el archivo, etc. — nos quedamos con la simulación.
    const data = await fetchChampionStats();
    if(!data) return;

    const real = data && data.champions;
    if(!real || !Object.keys(real).length){
      // El archivo existe pero ningún campeón llega aún al mínimo de partidas.
      const tag = document.getElementById("patchTag");
      if(tag && data.totalGamesSample){
        tag.textContent = `Datos ilustrativos · reuniendo partidas reales (${data.totalGamesSample.toLocaleString("es-ES")} analizadas)`;
      }
      return;
    }

    state.realStats = true;
    if(data.ddragonVersion) DDRAGON_VERSION = data.ddragonVersion;
    state.rankStats = (data.ranks && Object.keys(data.ranks).length) ? data.ranks : null;

    let matched = 0;
    CHAMPIONS.forEach(c=>{
      const r = real[c.id];
      c._all = r ? { winrate: r.winrate, pickrate: r.pickrate, banrate: r.banrate } : null;
      if(!r){
        // Sin partidas suficientes: no se muestran números ni builds inventados.
        c.noData = true;
        c.build = { starter: [], boots: [], core: [], situational: [] };
        c.runes = null;
        c.buildSampleGames = 0;
        return;
      }
      matched++;
      c.noData = false;
      c.winrate = r.winrate;
      c.pickrate = r.pickrate;
      c.banrate = r.banrate;
      c.realStats = true;
      const score = (c.winrate-46.5)/8.5*0.55 + (c.pickrate/18)*0.25 + (c.banrate/22.5)*0.2;
      c.tier = tierFromScore(score);

      // La build real solo llega cuando hay suficiente muestra de partidas
      // (lo decide scripts/fetch-riot-stats.mjs). Aquí solo se usa lo que
      // viene de partidas reales: nunca se rellena con datos de ejemplo.
      const b = r.build;
      c.build = {
        starter: b?.starter || [],
        // Las botas básicas (id 1001, 300 de oro) no son "las botas del campeón":
        // si vienen en datos antiguos se ocultan hasta que haya datos de las mejoradas.
        boots: (b?.boots && Number(b.boots.id) !== 1001) ? [b.boots] : [],
        core: b?.core || [],
        situational: b?.situational || [],
      };
      c.runes = (b?.runes?.keystone && b?.runes?.primaryTree)
        ? {
            keystone: b.runes.keystone,
            icon: b.runes.keystoneIcon || null,
            tree: b.runes.secondaryTree ? `${b.runes.primaryTree} + ${b.runes.secondaryTree}` : b.runes.primaryTree,
          }
        : null;
      c.buildSampleGames = b ? b.sampleGames : 0;
    });

    const patchTag = document.getElementById("patchTag");
    if(patchTag){
      const date = new Date(data.generatedAt).toLocaleDateString("es-ES", { day:"2-digit", month:"short" });
      const patch = data.patch ? `Parche ${data.patch} · ` : "";
      const games = data.totalGamesSample ? `${data.totalGamesSample.toLocaleString("es-ES")} partidas · ` : "";
      const pending = data.usingPreviousPatch && data.latestPatch
        ? ` · el parche ${data.latestPatch} está reuniendo partidas`
        : "";
      patchTag.textContent = `${patch}${data.region} · ${games}datos reales de ${matched} campeones (actualizado el ${date})${pending}`;
    }

    renderRankChips();
    applyRankView();
    renderTierList();
    renderGrid();
    preloadBuildIcons();
  }

  // Precarga los iconos de objetos y runas para que el modal los muestre al instante.
  function preloadBuildIcons(){
    const urls = new Set();
    CHAMPIONS.forEach(c=>{
      [...c.build.starter, ...c.build.boots, ...c.build.core, ...c.build.situational].forEach(i=>{
        if(i && typeof i === "object" && i.id) urls.add(itemIconUrl(i.id));
      });
      if(c.runes && c.runes.icon) urls.add(runeIconUrl(c.runes.icon));
    });
    urls.forEach(u => { new Image().src = u; });
  }

  loadRealStats();

  // ------------------------------------------------------------ Premium unlock --
  const PREMIUM_EMAIL_KEY = "grietameta_premium_email";

  async function checkPremiumEmail(email, { silent } = {}){
    const statusEl = document.getElementById("unlockStatus");
    try{
      const data = await checkPremium(email);
      if(data.premium){
        state.isPremium = true;
        localStorage.setItem(PREMIUM_EMAIL_KEY, email);
        renderUnlockBlock();
        return true;
      } else {
        if(!silent && statusEl){
          statusEl.textContent = "Ese email no tiene una suscripción Premium activa.";
          statusEl.className = "unlock-status err";
        }
        return false;
      }
    }catch(err){
      if(!silent && statusEl){
        statusEl.textContent = "No se pudo comprobar ahora mismo. Inténtalo de nuevo.";
        statusEl.className = "unlock-status err";
      }
      return false;
    }
  }

  function renderUnlockBlock(){
    const root = document.getElementById("unlockBlock");
    if(!root) return;

    // Premium activo = se ocultan todos los bloques de anuncio de la página.
    viewRoot.classList.toggle("is-premium", state.isPremium);

    if(state.isPremium){
      const email = localStorage.getItem(PREMIUM_EMAIL_KEY) || "";
      root.innerHTML = `
        <div class="unlock-box">
          <span class="premium-badge-chip">✓ Premium activo${email ? " · " + email : ""}</span>
          <p style="margin-top:12px;">Navegas sin publicidad en todo el sitio. ¡Gracias por apoyar GrietaMeta!</p>
          <button class="btn-outline" id="forgetPremiumBtn" style="width:auto; padding:8px 16px;">Cerrar sesión en este navegador</button>
        </div>
      `;
      document.getElementById("forgetPremiumBtn").addEventListener("click", ()=>{
        localStorage.removeItem(PREMIUM_EMAIL_KEY);
        state.isPremium = false;
        renderUnlockBlock();
        pushAdsenseAds(); // los anuncios vuelven a verse y se cargan
      });
      return;
    }

    root.innerHTML = `
      <div class="unlock-box">
        <p>¿Ya pagaste Premium? Introduce el email que usaste al suscribirte para desbloquearlo en este navegador.</p>
        <div class="unlock-row">
          <input type="email" id="unlockEmailInput" placeholder="tu@email.com">
          <button id="unlockBtn">Desbloquear</button>
        </div>
        <div class="unlock-status" id="unlockStatus"></div>
      </div>
    `;
    document.getElementById("unlockBtn").addEventListener("click", async ()=>{
      const input = document.getElementById("unlockEmailInput");
      const email = input.value.trim();
      if(!email){ return; }
      const btn = document.getElementById("unlockBtn");
      btn.disabled = true;
      btn.textContent = "Comprobando…";
      const ok = await checkPremiumEmail(email);
      btn.disabled = false;
      btn.textContent = "Desbloquear";
      if(ok){
        // Puede haber un modal de campeón abierto: lo recargamos si aplica.
        const overlay = document.getElementById("modalOverlay");
        if(overlay.classList.contains("open")){
          const openId = overlay.dataset.currentId;
          if(openId) openModal(openId);
        }
      }
    });
  }

  renderUnlockBlock();

  // ------------------------------------------------------------ AdSense init --
  // Los bloques <ins class="adsbygoogle"> que ya existen al cargar la página
  // (adSlotTop y adSlotMid) se activan una sola vez. Los usuarios Premium
  // nunca cargan anuncios.
  function pushAdsenseAds(){
    if(state.isPremium) return;
    try{
      document.querySelectorAll("ins.adsbygoogle:not([data-ad-status])").forEach(()=>{
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    }catch(e){
      // AdSense todavía no cargó, o el bloqueador de anuncios del navegador lo impidió.
      console.warn("AdSense no se pudo inicializar:", e);
    }
  }

  // Si el navegador ya tenía un email guardado de una visita anterior,
  // comprobamos primero si sigue siendo premium y SOLO después cargamos
  // anuncios, para no pedírselos a quien ya los ha quitado.
  const savedEmail = localStorage.getItem(PREMIUM_EMAIL_KEY);
  if(savedEmail){
    viewRoot.classList.add("is-premium"); // evita que los huecos de anuncio parpadeen mientras se comprueba
    checkPremiumEmail(savedEmail, { silent: true }).finally(()=>{
      viewRoot.classList.toggle("is-premium", state.isPremium);
      pushAdsenseAds();
    });
  } else {
    pushAdsenseAds();
  }
}
