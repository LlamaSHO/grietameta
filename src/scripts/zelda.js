/* Lógica de la vista (migrada tal cual desde el antiguo zelda.html).
   Se ejecuta al montar la vista; los listeners globales usan `signal` para
   limpiarse al salir de ella. */

import { ZELDA_DATA as DATA } from "@/data/zelda";

const IMG_SURFACE = "/images/zelda/mapa-superficie.jpg";
const IMG_SKY = "/images/zelda/mapa-cielo.jpg";

export function init({ root, signal }) {
  const KEYS = ["semillas","santuarios","misiones","armaduras","conjuntos"];
  /* Mapa de fondo: pon aquí la ruta de TU imagen del mapa completo de Hyrule (por ejemplo "/img/hyrule.jpg").
     MAP_BOUNDS son las coordenadas del juego que cubre la imagen. Si los puntos salen desplazados, ajusta estos cuatro números. */
  const MAP_IMG = IMG_SURFACE;
  const MAP_BOUNDS = { x0: -5868, x1: 5593, y0: -4766, y1: 5353 };
  const MAP_H = 8830; /* alto del mapa en el mismo sistema (10000 de ancho) para respetar las proporciones de la imagen */
  const IMG = {}; /* Imágenes propias: IMG["Zora"] = "/img/zora.jpg" (en Armaduras usa el nombre entre paréntesis, ej. IMG["Royal Guard"]) */
  const state = { cat: "santuarios", q: "", layer: "superficie", seedLayer: "superficie", qf: "todas" };

  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");

  let K = "semillas";
  function renderChips(){
    const root = document.getElementById("chips");
    root.innerHTML = KEYS.map(k => `<a class="chip" href="#${k}">${DATA[k].title}</a>`).join("");
  }

  function renderCat(k){
    K = k;
    const cat = DATA[k];
    const q = norm(state.q.trim());
    document.getElementById("secTitle-" + K).textContent = cat.title;
    document.getElementById("secDesc-" + K).textContent = cat.desc;
    if(cat.kind === "quests"){
      const GGU = "https://www.gamerguides.com/the-legend-of-zelda-tears-of-the-kingdom/guide/";
      const RA = {"lookout-landing":"Lookout Landing","lucky-clover-gazette":"Gaceta del Trébol","central-hyrule":"Hyrule Central","hyrule-ridge":"Cresta de Hyrule","hebra-region":"Hebra","eldin":"Eldin","lanaryu-wetlands":"Humedales de Lanayru","necluda":"Necluda","akkala":"Akkala","faron":"Faron","gerudo":"Gerudo","great-hyrule-forest":"Gran Bosque de Hyrule","the-depths":"Las Profundidades","great-sky-island":"Gran Isla del Cielo"};
      const RS = {"kingdom-of-hyrule":"Reino de Hyrule","central-hyrule-region":"Hyrule Central","hebra-region":"Hebra","east-necluda":"Necluda Este","akkala":"Akkala","lanayru":"Lanayru","west-necluda":"Necluda Oeste","gerudo-region":"Gerudo","lanayru-wetlands":"Humedales de Lanayru","eldin":"Eldin","faron":"Faron","hyrule-ridge":"Cresta de Hyrule"};
      const items = [].concat(
        cat.main.map(m => ({k:"p", n:m.n, tag:m.t, reg:m.r, body:m.g, url:m.u})),
        cat.adv.map(a => ({k:"a", n:a[1], tag:"Aventura secundaria", reg:RA[a[0]] || a[0], body:"Guía paso a paso en Gamer Guides (en inglés).", url:GGU + "side-adventures/" + a[0] + "/" + a[2]})),
        cat.sq.map(a => ({k:"s", n:a[1], tag:"Misión secundaria", reg:RS[a[0]] || a[0], body:"Guía paso a paso en Gamer Guides (en inglés).", url:GGU + "side-quests/" + a[0] + "/" + a[2]}))
      );
      const q = norm(state.q.trim());
      const cnt = {p:cat.main.length, a:cat.adv.length, s:cat.sq.length};
      const FL = [["todas","Todas (" + items.length + ")"],["p","Principales (" + cnt.p + ")"],["a","Aventuras (" + cnt.a + ")"],["s","Secundarias (" + cnt.s + ")"]];
      const chips = `<div class="chips" role="tablist" aria-label="Tipo de misión">` + FL.map(([k,t]) => `<button class="chip qf-chip ${state.qf === k ? "active" : ""}" role="tab" aria-selected="${state.qf === k}" data-qf="${k}">${t}</button>`).join("") + `</div>`;
      const rows = items.filter(i => (state.qf === "todas" || i.k === state.qf) && (!q || norm([i.n, i.reg, i.tag].join(" ")).includes(q)));
      document.getElementById("secCount-" + K).textContent = rows.length + (rows.length === 1 ? " misión" : " misiones");
      const r2 = document.getElementById("root-" + K);
      r2.innerHTML = chips + (rows.length ? `<div class="grid">` + rows.map(i =>
        `<div class="card"><h3>${esc(i.n)}</h3><span class="tag">${esc(i.tag)}</span><p>${esc(i.body)}</p>` +
        (i.url ? `<a class="more" href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${i.k === "p" ? "Guía completa (en inglés)" : "Ver guía"}</a>` : "") +
        `<div class="alt">${esc(i.reg)}</div></div>`).join("") + `</div>` : `<div class="empty-state">No hay misiones con esa búsqueda. Prueba con otro nombre o región.</div>`) +
        `<p class="note">Las 23 principales llevan guía propia. De las secundarias, el juego tiene 60 aventuras y 139 misiones: aquí están las que tienen guía publicada (${cnt.a} y ${cnt.s}). Los nombres van en inglés para que coincidan con el diario del juego si lo tienes en ese idioma.</p>`;
      r2.querySelectorAll(".qf-chip").forEach(b => b.addEventListener("click", () => { state.qf = b.dataset.qf; renderCat("misiones"); }));
      return;
    }
    if(cat.kind === "seeds"){
      const sky = state.seedLayer === "cielo";
      const cfg = sky
        ? { img: IMG_SKY, b: { x0: -5148, x1: 5690, y0: -4194, y1: 4265 }, h: 7912 }
        : { img: MAP_IMG, b: MAP_BOUNDS, h: MAP_H };
      const px = x => ((x - cfg.b.x0) / (cfg.b.x1 - cfg.b.x0) * 10000).toFixed(1);
      const py = y => ((cfg.b.y1 - y) / (cfg.b.y1 - cfg.b.y0) * cfg.h).toFixed(1);
      const parse = t => t.trim().split(/\s+/).map(a => a.split(",").map(Number));
      const one = parse(sky ? cat.sky1 : cat.surf1), two = parse(sky ? cat.sky2 : cat.surf2);
      const shown = parse(cat.surf1).length + parse(cat.sky1).length + 2 * (parse(cat.surf2).length + parse(cat.sky2).length);
      const c1 = sky ? "#C8963E" : "#14C3B8";
      let d = "";
      two.forEach(p => { d += `<line x1="${px(p[0])}" y1="${py(p[1])}" x2="${px(p[2])}" y2="${py(p[3])}" stroke="#E9E6DC" stroke-width="14" stroke-dasharray="40 30" opacity=".65"/>`; });
      one.forEach(p => { d += `<circle cx="${px(p[0])}" cy="${py(p[1])}" r="38" fill="${c1}" stroke="#0A0D12" stroke-width="12" opacity=".9"><title>Semilla kolog · x ${p[0]} · y ${p[1]}</title></circle>`; });
      two.forEach(p => {
        d += `<circle cx="${px(p[2])}" cy="${py(p[3])}" r="34" fill="none" stroke="#E9E6DC" stroke-width="14"><title>Amigo del kolog · x ${p[2]} · y ${p[3]}</title></circle>`;
        d += `<circle cx="${px(p[0])}" cy="${py(p[1])}" r="62" fill="#E9E6DC" stroke="#0A0D12" stroke-width="14"><title>Kolog de 2 semillas (llévalo con su amigo) · x ${p[0]} · y ${p[1]}</title></circle>`;
      });
      const chips = `<div class="chips" role="tablist" aria-label="Capa del mapa de semillas">` + [["superficie","Superficie"],["cielo","Cielo"]].map(([k,t]) => `<button class="chip seed-chip ${state.seedLayer === k ? "active" : ""}" role="tab" aria-selected="${state.seedLayer === k}" data-slayer="${k}">${t}</button>`).join("") + `</div>`;
      document.getElementById("secCount-" + K).textContent = (one.length + two.length) + " ubicaciones en esta capa";
      const r1 = document.getElementById("root-" + K);
      r1.innerHTML = chips + `<div class="mapbox"><svg viewBox="0 0 10000 ${cfg.h}" role="img" aria-label="Mapa de semillas kolog"><image href="${cfg.img}" x="0" y="0" width="10000" height="${cfg.h}" preserveAspectRatio="none"/>${d}</svg></div><div class="legend"><span><i style="background:${c1}"></i>Semilla kolog (1)</span><span><i style="background:#E9E6DC"></i>Kolog con amigo (2 semillas): lleva al kolog hasta el círculo vacío</span></div><p class="note">Se muestran ${shown} de las 1.000 semillas del juego. Faltan por cargar unas 125 (sobre todo del cielo y del final de la superficie). Coordenadas del mapa del juego; pasa el cursor sobre un punto para verlas.</p>`;
      r1.querySelectorAll(".seed-chip").forEach(b => b.addEventListener("click", () => { state.seedLayer = b.dataset.slayer; renderCat("semillas"); }));
      return;
    }
    if(cat.kind === "shrines"){
      const zone = (x,y) => {
        const ns = Math.abs(y) >= 1200 ? (y > 0 ? "Nor" : "Sur") : "";
        const ew = Math.abs(x) >= 1200 ? (x > 0 ? "este" : "oeste") : "";
        if(ns && ew) return ns + ew;
        return ns ? (y > 0 ? "Norte" : "Sur") : ew ? (x > 0 ? "Este" : "Oeste") : "Centro";
      };
      const mapUrl = r => "https://gamertw.com/en/zelda/totk/map?x=" + (255.857 + 0.042599 * r.x).toFixed(2) + "&y=" + (-255.939 + 0.042543 * r.y).toFixed(2) + "&z=3&l=" + (r.k === "Cielo" ? "sky" : "surface");
      const all = [...cat.surf.map(r => [r,"Superficie"]), ...cat.sky.map(r => [r,"Cielo"])].map(([r,k],i) => {
        const p = r.split(" "), x = +p[1], y = +p[2], z = +p[3];
        return {n:i+1, name:p[0]+" Shrine", x, y, z, k, zn: zone(x,y)};
      });
      const inLayer = r => state.layer === "ambos" || (state.layer === "cielo") === (r.k === "Cielo");
      const rows = all.filter(r => inLayer(r) && (!q || norm([r.name, r.k, r.zn].join(" ")).includes(q)));
      document.getElementById("secCount-" + K).textContent = rows.length + (rows.length === 1 ? " santuario" : " santuarios");
      const r0 = document.getElementById("root-" + K);
      if(!rows.length){ r0.innerHTML = `<div class="empty-state">No hay resultados para esa búsqueda. Prueba con otra palabra.</div>`; return; }
      const cfg = state.layer === "cielo"
        ? { img: IMG_SKY, b: { x0: -5148, x1: 5690, y0: -4194, y1: 4265 }, h: 7912 }
        : { img: MAP_IMG, b: MAP_BOUNDS, h: MAP_H };
      const dots = all.filter(inLayer).map(r => {
        const on = rows.includes(r), sky = r.k === "Cielo";
        return `<circle data-n="${esc(r.name.replace(" Shrine",""))}" cx="${(r.x - cfg.b.x0) / (cfg.b.x1 - cfg.b.x0) * 10000}" cy="${(cfg.b.y1 - r.y) / (cfg.b.y1 - cfg.b.y0) * cfg.h}" r="${on ? 60 : 30}" fill="${sky ? "#C8963E" : "#14C3B8"}" opacity="${on ? 0.95 : 0.15}" stroke="#0A0D12" stroke-width="14"><title>${esc(r.name)} · x ${r.x} · y ${r.y} · altitud ${r.z}</title></circle>`;
      }).join("");
      let grid = "";
      const gxp = v => (v - cfg.b.x0) / (cfg.b.x1 - cfg.b.x0) * 10000, gyp = v => (cfg.b.y1 - v) / (cfg.b.y1 - cfg.b.y0) * cfg.h;
      for(let gx = -4000; gx <= 4000; gx += 2000) grid += `<line x1="${gxp(gx)}" y1="0" x2="${gxp(gx)}" y2="${cfg.h}" stroke="#262D3A" stroke-width="${gx === 0 ? 14 : 6}"/>`;
      for(let gy = -4000; gy <= 4000; gy += 2000) grid += `<line x1="0" y1="${gyp(gy)}" x2="10000" y2="${gyp(gy)}" stroke="#262D3A" stroke-width="${gy === 0 ? 14 : 6}"/>`;
      const lab = (t,x,y) => `<text x="${x}" y="${y}" fill="#5D6673" font-size="240" font-family="IBM Plex Sans,sans-serif" text-anchor="middle">${t}</text>`;
      const LAYERS = [["superficie","Superficie (120)"],["cielo","Cielo (32)"],["ambos","Ambas capas"]];
      const layerChips = `<div class="chips" role="tablist" aria-label="Capa del mapa">` + LAYERS.map(([k,t]) => `<button class="chip layer-chip ${state.layer === k ? "active" : ""}" role="tab" aria-selected="${state.layer === k}" data-layer="${k}">${t}</button>`).join("") + `</div>`;
      const mapHtml = layerChips + `<div class="mapbox"><svg viewBox="0 0 10000 ${cfg.h}" role="img" aria-label="Mapa de los santuarios">${grid}${cfg.img ? `<image href="${esc(cfg.img)}" x="0" y="0" width="10000" height="${cfg.h}" preserveAspectRatio="none" onerror="this.remove()"/>` : ""}${cfg.img ? "" : lab("N",5000,300) + lab("S",5000,cfg.h - 100) + lab("O",250,cfg.h / 2) + lab("E",9750,cfg.h / 2)}${dots}</svg></div><div class="legend">${state.layer !== "cielo" ? `<span><i style="background:#14C3B8"></i>Superficie</span>` : ""}${state.layer !== "superficie" ? `<span><i style="background:#C8963E"></i>Cielo (x e y no incluyen la altura)</span>` : ""}<span>Toca un punto para ver su ficha</span>${state.layer === "cielo" ? "<span>Mapa del cielo: la altura de cada isla está en su ficha</span>" : ""}</div>`;
      r0.innerHTML = mapHtml + `<div class="grid sets">` + rows.map(r =>
        `<div class="card"><h3>${esc(r.name)}</h3><span class="tag">${r.k} · ${r.zn}</span><p>x ${r.x} · y ${r.y} · altitud ${r.z}</p><a class="more" href="${mapUrl(r)}" target="_blank" rel="noopener noreferrer">Ver en mapa con terreno</a></div>`
      ).join("") + `</div><p class="note">Coordenadas del mapa del juego (x: oeste a este, y: sur a norte). Según la guía pueden variar unos pocos puntos, sobre todo la altitud. La zona es una referencia aproximada calculada a partir de x e y. Si no hay imagen de fondo, el mapa es un esquema de coordenadas sin relieve. El enlace «Ver en mapa con terreno» abre un mapa externo centrado en ese punto.</p>`;
      r0.querySelectorAll(".layer-chip").forEach(b => b.addEventListener("click", () => { state.layer = b.dataset.layer; renderAll(); }));
      r0.querySelectorAll("circle[data-n]").forEach(c => c.addEventListener("click", () => { state.q = c.dataset.n; document.getElementById("q").value = c.dataset.n; renderAll(); }));
      return;
    }
    if(cat.kind === "sets"){
      const sets = cat.sets.filter(x => !q || norm([x.n,x.t,x.b].join(" ")).includes(q));
      document.getElementById("secCount-" + K).textContent = sets.length + (sets.length === 1 ? " conjunto" : " conjuntos");
      const root0 = document.getElementById("root-" + K);
      if(!sets.length){ root0.innerHTML = `<div class="empty-state">No hay resultados para esa búsqueda. Prueba con otra palabra.</div>`; return; }
      const HUE = {Normal:42, Elemento:200, Habilidad:170, Enemigos:340};
      root0.innerHTML = `<div class="grid sets">` + sets.map(x => {
        const mono = x.n.replace(/[^A-Za-z' ]/g,"").split(" ").filter(Boolean).slice(0,2).map(w => w[0]).join("").toUpperCase();
        const img = IMG[x.n] ? `<img src="${esc(IMG[x.n])}" alt="" loading="lazy" onerror="this.remove()">` : "";
        const mats = x.m.length
          ? x.m.map((m,i) => `<li><b>Nivel ${i+1}</b>${esc(m)}</li>`).join("")
          : `<li class="none">No se puede mejorar</li>`;
        return `<div class="card"><div class="set-top"><div class="badge" style="--h:${HUE[x.t]||42}">${mono}${img}</div><div><h3>${esc(x.n)}</h3><span class="tag" style="margin:4px 0 0">${esc(x.b)}</span></div></div><ul class="mats">${mats}</ul><div class="alt">${esc(x.t)}</div></div>`;
      }).join("") + `</div>`;
      return;
    }
    const items = cat.items.filter(i => !q || norm(i.slice(0,4).join(" ")).includes(q));
    document.getElementById("secCount-" + K).textContent = items.length + (items.length === 1 ? " resultado" : " resultados");
    const root = document.getElementById("root-" + K);
    if(!items.length){ root.innerHTML = `<div class="empty-state">No hay resultados para esa búsqueda. Prueba con otra palabra.</div>`; return; }
    const badge = t => {
      const key = (t.match(/\(([^)]+)\)/) || [0, t])[1];
      const mono = key.replace(/[^A-Za-z' ]/g,"").split(" ").filter(Boolean).slice(0,2).map(w => w[0]).join("").toUpperCase();
      const src = IMG[key] || IMG[t];
      return `<div class="badge" style="--h:42">${mono}${src ? `<img src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()">` : ""}</div>`;
    };
    root.innerHTML = `<div class="grid">` + items.map(i =>
      `<div class="card">` +
      (K === "armaduras" && /^Defensa/.test(i[1])
        ? `<div class="set-top">${badge(i[0])}<div><h3>${esc(i[0])}</h3><span class="tag" style="margin:4px 0 0">${esc(i[1])}</span></div></div><p style="margin-top:12px">${esc(i[2])}</p>`
        : `<h3>${esc(i[0])}</h3><span class="tag">${esc(i[1])}</span><p>${esc(i[2])}</p>`) +
      (i[4] ? `<a class="more" href="${esc(i[4])}" target="_blank" rel="noopener noreferrer">Abrir mapa</a>` : "") +
      `<div class="alt">${esc(i[3])}</div></div>`
    ).join("") + `</div>`;
  }

  function buildSections(){
    document.getElementById("sections").innerHTML = KEYS.map(k =>
      `<section class="guide-sec" id="${k}"><div class="section-head"><div><h2 id="secTitle-${k}"></h2><p id="secDesc-${k}"></p></div><div class="section-sub" id="secCount-${k}"></div></div><div id="root-${k}"></div></section>`
    ).join("");
  }
  function renderAll(){
    KEYS.forEach(k => {
      renderCat(k);
      const sec = document.getElementById(k);
      sec.hidden = k !== "semillas" && !!state.q.trim() && /empty-state/.test(document.getElementById("root-" + k).innerHTML);
    });
  }
  document.getElementById("q").addEventListener("input", e => { state.q = e.target.value; renderAll(); });
  buildSections();
  renderChips();
  renderAll();
}
