<script setup>
/* Kanto · Mapa interactivo. Diseño: models/paginas/PokemonKantoMapa.dc.html
   El arrastre mueve la capa directamente (style.transform) y guarda la posición al soltar;
   el zoom tiene 5 pasos y el puntero queda capturado mientras se arrastra. */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useGameData } from "@/composables/useGameData.js";
import { leer, guardar } from "@/components/pokemon/b/datos.js";
import "@/components/pokemon/b/pkb-base.css";
import "@/components/pokemon/b/pkb-kanto-mapa.css";
import KantoBar from "@/components/pokemon/b/KantoBar.vue";
import CargaDatos from "@/components/pokemon/b/CargaDatos.vue";
import G1 from "@/components/pokemon/b/G1.vue";
import TypeChip from "@/components/pokemon/b/TypeChip.vue";
import KantoMapaFicha from "@/components/pokemon/b/KantoMapaFicha.vue";

const datos = useGameData("/data/pokemon/kanto/mapa.json");

/* ---- Constantes del diseño ---- */
const ZS = [1, 1.5, 2.2, 3, 4];
const TIPOS = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
const TIPOS_N = ["Normal", "Lucha", "Volador", "Veneno", "Tierra", "Roca", "Bicho", "Fantasma", "Acero", "Fuego", "Agua", "Planta", "Eléctrico", "Psíquico", "Hielo", "Dragón", "Siniestro", "Hada"];
const METH = {
  walk: ["Hierba", "m-walk"], "old-rod": ["Caña Vieja", "m-fish"], "good-rod": ["Caña Buena", "m-fish"], "super-rod": ["Supercaña", "m-fish"],
  surf: ["Surf", "m-surf"], gift: ["Regalo", "m-gift"], "npc-trade": ["Intercambio", "m-trade"], static: ["Fijo", "m-static"],
};
const KIND = { town: "Ciudad", route: "Ruta", sea: "Ruta marítima", dun: "Zona" };
const VERN = { r: "Rojo", b: "Azul", y: "Amarillo" };
const WILD = ["walk", "surf", "old-rod", "good-rod", "super-rod"];
const CATS = [
  ["town", "Ciudades", "house", "#F5B301"], ["route", "Rutas", "route", "#EBD9A2"], ["dun", "Zonas y cuevas", "cave", "#B08350"],
  ["gym", "Gimnasios", "medal", "#FFCB3D"], ["sp", "Legendarios y regalos", "star", "#FF5AA5"], ["mo", "MO", "disc", "#9B5CF6"],
  ["mt", "MT", "disc", "#4F86F7"], ["key", "Objetos clave", "key", "#FF9F43"],
];
const ESTADOS = [["all", "Todo"], ["todo", "Pendiente"], ["done", "Visitado"]];

/* ---- Estado ---- */
const CLAVE = "gm-pk-kanto-mapa";
const guardado = leer(CLAVE, {});
const ver = ref(["r", "b", "y"].includes(guardado.ver) ? guardado.ver : "r");
const cats = reactive(Object.assign({ town: true, route: true, dun: true, gym: true, sp: true, mo: false, mt: false, key: false }, guardado.cats || {}));
const hechos = reactive(guardado.done || { pallet: true, viridian: true, r1: true });
const st = ref("all");
const selKey = ref("viridian-forest");
const zi = ref(0);
const px = ref(0);
const py = ref(0);
const q = ref("");
const arrastrando = ref(false);
watch([ver, cats, hechos], () => guardar(CLAVE, { ver: ver.value, cats, done: hechos }), { deep: true });

/* ---- Datos derivados (se calculan al cargar) ---- */
const indice = computed(() => {
  const D = datos.data.lugares;
  const by = {};
  D.places.forEach((p) => { by[p.k] = p; });
  const group = (arr) => { const o = {}; arr.forEach((x) => { (o[x.p] = o[x.p] || []).push(x); }); return o; };
  return { D, by, MT: group(D.mt.filter((x) => x.p)), MO: group(D.mo), KEY: group(D.keys), SP: group(D.sp) };
});
const NM = computed(() => datos.data.nombres);
const spVisible = (s) => s.k !== "y" || ver.value === "y";

const zoom = computed(() => ZS[zi.value]);
const zoomTxt = computed(() => String(zoom.value).replace(".", ","));
const lugarSel = computed(() => (selKey.value && datos.data ? indice.value.by[selKey.value] : null));

/* ---- Buscador de Pokémon ---- */
const findId = computed(() => {
  const t = q.value.trim().toLowerCase();
  if (!datos.data || t.length < 3) return 0;
  return Number(Object.keys(NM.value).find((k) => NM.value[k].toLowerCase().startsWith(t)) || 0);
});
const ordIdx = (k) => { const i = datos.data.orden.indexOf(k); return i < 0 ? 99 : i; };
const lvT = (m) => (m[2] === m[3] ? "Nv. " + m[2] : "Nv. " + m[2] + "–" + m[3]);
const desc = (f) => (METH[f.m[1]] || [f.m[1]])[0] + " · " + Math.min(100, f.m[4]) + " % · " + lvT(f.m);

const busqueda = computed(() => {
  const id = findId.value;
  const v = ver.value;
  const { D, by, SP } = indice.value;
  const hitPlaces = {}; const hitRate = {}; const found = [];
  if (id) {
    D.places.forEach((p) => {
      (p.mon[v] || []).filter((m) => m[0] === id).forEach((m) => {
        hitPlaces[p.k] = 1;
        if (WILD.includes(m[1])) hitRate[p.k] = Math.max(hitRate[p.k] || 0, Math.min(100, m[4]));
        found.push({ p, m });
      });
    });
    D.sp.forEach((s) => { if (s.id === id && spVisible(s)) hitPlaces[s.p] = 1; });
  }
  const wild = found.filter((f) => WILD.includes(f.m[1]));
  const bestF = wild.slice().sort((a, b) => (b.m[4] - a.m[4]) || (ordIdx(a.p.k) - ordIdx(b.p.k)))[0];
  const earlyF = wild.slice().sort((a, b) => (ordIdx(a.p.k) - ordIdx(b.p.k)) || (b.m[4] - a.m[4]))[0];
  let view = null;
  if (id) {
    const NMv = NM.value; const EVF = datos.data.evolucionaDe;
    const go = (k) => () => elegir(k);
    const sps = D.sp.filter((s) => s.id === id && spVisible(s));
    const other = found.filter((f) => !WILD.includes(f.m[1]));
    let sum;
    if (bestF) {
      const zn = new Set(wild.map((f) => f.p.k)).size;
      sum = "Sale en " + zn + (zn === 1 ? " zona" : " zonas") + " en " + VERN[v] + ". Donde más aparece es " + bestF.p.n + " (" + Math.min(100, bestF.m[4]) + " % de los encuentros, " + (METH[bestF.m[1]] || [""])[0].toLowerCase() + ").";
      if (earlyF && earlyF.p.k !== bestF.p.k) sum += " Si lo quieres pronto en la aventura, " + earlyF.p.n + " es el primer sitio donde sale.";
    } else if (sps.length) {
      sum = "No sale en estado salvaje en " + VERN[v] + ". " + sps.map((s) => (s.k === "leg" ? "Encuentro fijo, " + s.how.charAt(0).toLowerCase() + s.how.slice(1) : s.how).replace(/\.$/, "")).join(" · ") + ".";
    } else if (other.length) {
      sum = "En " + VERN[v] + " solo se consigue así: " + other.map((f) => (METH[f.m[1]] || [f.m[1]])[0].toLowerCase() + " en " + f.p.n).join(", ") + ".";
    } else if (EVF[id]) {
      sum = "No aparece en " + VERN[v] + ": evoluciona de " + NMv[EVF[id]] + ". Busca a " + NMv[EVF[id]] + " y evoluciónalo (nivel, piedra o intercambio, según la especie).";
    } else {
      const ov = ["r", "b", "y"].filter((o) => o !== v && D.places.some((p) => (p.mon[o] || []).some((m) => m[0] === id)));
      sum = "No sale en " + VERN[v] + "." + (ov.length ? " Es exclusivo de " + ov.map((o) => VERN[o]).join(" y ") + ": consíguelo por intercambio con alguien que tenga esa versión." : " Tendrás que conseguirlo por intercambio con otra versión.");
    }
    if (bestF && EVF[id]) sum += " También puedes evolucionar a " + NMv[EVF[id]] + ".";
    if (bestF && sps.length) sum += " También: " + sps.map((s) => s.how).join(" · ") + ".";
    const rows = wild.slice().sort((a, b) => (b.m[4] - a.m[4]) || (ordIdx(a.p.k) - ordIdx(b.p.k))).slice(0, 10).map((f, i) => {
      const mt = METH[f.m[1]] || [f.m[1], "m-gift"];
      return { i: i + 1, n: f.p.n, lv: lvT(f.m), mt: mt[0], mc: mt[1], r: Math.min(100, f.m[4]) + " %", w: Math.min(100, f.m[4]) + "%", pick: go(f.p.k) };
    });
    const spB = !bestF && sps.length ? sps[0] : null;
    view = {
      n: NMv[id], id, tipos: (datos.data.tipos[id] || []).map((i) => TIPOS[i - 1]), sum, rows,
      bestTag: spB ? "Dónde está" : "Mejor sitio",
      best: bestF ? { n: bestF.p.n, d: desc(bestF), pick: go(bestF.p.k) } : spB ? { n: by[spB.p] ? by[spB.p].n : spB.n, d: spB.how, pick: go(spB.p) } : null,
      early: earlyF && bestF && earlyF.p.k !== bestF.p.k ? { n: earlyF.p.n, d: desc(earlyF), pick: go(earlyF.p.k) } : null,
    };
  }
  return { hitPlaces, hitRate, best: bestF ? bestF.p.k : "", view };
});

/* ---- Marcadores ---- */
const estadoOk = (k) => st.value === "all" || (st.value === "done" ? !!hechos[k] : !hechos[k]);

const pins = computed(() => {
  if (!datos.data) return [];
  const v = ver.value; const id = findId.value;
  const { D, MT, MO, KEY, SP } = indice.value;
  const { hitPlaces, hitRate, best } = busqueda.value;
  const out = [];
  const add = (key, o) => out.push({ rt: "", ...o, key, cls: o.cls + (id && !/\b(hit|dim)\b/.test(o.cls) ? " dim" : "") });
  D.places.forEach((p) => {
    const isRoute = p.kind === "route" || p.kind === "sea";
    const cat = isRoute ? "route" : p.kind;
    const pick = () => elegir(p.k);
    const done = !!hechos[p.k];
    const hit = hitPlaces[p.k] ? " hit" + (p.k === best ? " best" : "") : (id ? " dim" : "");
    if (cats[cat] && estadoOk(p.k)) {
      add(p.k, {
        x: p.x + "%", y: p.y + "%", c: p.c || "#EBD9A2", t: isRoute ? p.n.replace("Ruta ", "") : "", rt: hitRate[p.k] ? hitRate[p.k] + " %" : "", lbl: p.n,
        sub: KIND[p.kind] + " · " + (p.mon[v] || []).length + " Pokémon salvajes" + (done ? " · visitado" : ""),
        cls: (isRoute ? "rt" + (p.kind === "sea" ? " sea" : "") : p.kind === "town" ? "town g-house" : "g-" + p.g) + (selKey.value === p.k ? " sel" : "") + (done ? " done" : "") + hit, pick,
      });
    }
    if (p.gym && cats.gym && estadoOk(p.k)) {
      add(p.k + "-gym", { x: (p.x + 2.4) + "%", y: (p.y - 3.2) + "%", c: "#FFCB3D", t: "", lbl: "Gimnasio de " + p.gym.l, sub: TIPOS_N[TIPOS.indexOf(p.gym.t)] + " · " + p.gym.med, cls: "gym g-medal" + (selKey.value === p.k ? " sel" : ""), pick });
    }
    if (SP[p.k] && cats.sp) {
      const list = SP[p.k].filter(spVisible);
      if (list.length) add(p.k + "-sp", { x: (p.x - 2.4) + "%", y: (p.y + 2.8) + "%", c: "#FF5AA5", t: "", lbl: list.map((s) => s.n).join(", "), sub: list[0].how, cls: "g-star" + (hitPlaces[p.k] && list.some((s) => s.id === id) ? " hit" : ""), pick });
    }
    if (MO[p.k] && cats.mo) add(p.k + "-mo", { x: p.x + "%", y: (p.y - 4.2) + "%", c: "#9B5CF6", t: "MO", lbl: MO[p.k].map((m) => "MO0" + m.n + " " + m.m).join(", "), sub: MO[p.k][0].how, cls: "cnt hmp", pick });
    if (MT[p.k] && cats.mt) add(p.k + "-mt", { x: (p.x - 2.6) + "%", y: (p.y - 2.8) + "%", c: "#4F86F7", t: String(MT[p.k].length), lbl: MT[p.k].length + " MT", sub: MT[p.k].map((m) => "MT" + String(m.n).padStart(2, "0") + " " + m.m).join(" · "), cls: "cnt tmp", pick });
    if (KEY[p.k] && cats.key) add(p.k + "-key", { x: (p.x + 2.6) + "%", y: (p.y + 2.8) + "%", c: "#FF9F43", t: "", lbl: KEY[p.k].map((k) => k.n).join(", "), sub: "Objeto clave", cls: "g-key", pick });
  });
  return out;
});

const contadores = computed(() => {
  const { D } = indice.value;
  const cnt = { town: 0, route: 0, dun: 0, gym: 0, sp: D.sp.filter(spVisible).length, mo: D.mo.length, mt: D.mt.filter((m) => m.p).length, key: D.keys.length };
  D.places.forEach((p) => { cnt[p.kind === "sea" ? "route" : p.kind]++; if (p.gym) cnt.gym++; });
  return cnt;
});

/* ---- Ficha del lugar seleccionado ---- */
const ficha = computed(() => {
  const sp = lugarSel.value;
  if (!sp) return null;
  const { MT, MO, KEY, SP } = indice.value;
  const id = findId.value;
  const mons = (sp.mon[ver.value] || []).slice().sort((a, b) => b[4] - a[4]);
  return {
    n: sp.n, kind: KIND[sp.kind], c: sp.c || "#EBD9A2", g: sp.kind === "route" || sp.kind === "sea" ? "route" : sp.g,
    mon: mons.map((m) => {
      const mt = METH[m[1]] || [m[1], "m-gift"];
      return { n: NM.value[m[0]], id: m[0], lv: m[1] === "npc-trade" ? "Intercambio" : lvT(m), mt: mt[0], mc: mt[1], r: Math.min(100, m[4]) + "%", hl: m[0] === id };
    }),
    monN: mons.length + " especies",
    sinMon: mons.length === 0 && (sp.kind === "route" || sp.kind === "sea" || sp.kind === "dun"),
    gym: sp.gym ? { l: sp.gym.l, k: sp.gym.t, med: sp.gym.med, tip: sp.gym.tip, team: sp.gym.team.map((t) => ({ lv: t[0], id: t[1] })) } : null,
    sp: (SP[sp.k] || []).filter(spVisible).map((s) => ({ n: s.n, how: s.how, id: s.id })),
    hm: MO[sp.k] || [],
    tm: (MT[sp.k] || []).map((m) => ({ no: "MT" + String(m.n).padStart(2, "0"), m: m.m, how: m.how, t: m.t })),
    keys: KEY[sp.k] || [], items: sp.items || [],
    hecho: !!hechos[sp.k],
  };
});

/* ---- Zonas (lista inferior) ---- */
const zonas = computed(() => {
  const { by } = indice.value;
  return datos.data.orden.map((k) => by[k]).filter(Boolean).map((p) => {
    const ms = p.mon[ver.value] || []; const isR = p.kind === "route" || p.kind === "sea";
    return {
      k: p.k, n: p.n, c: p.c || "#EBD9A2", pc: isR ? "rt" + (p.kind === "sea" ? " sea" : "") : "g-" + (p.kind === "town" ? "house" : p.g),
      t: isR ? p.n.replace("Ruta ", "") : "", sub: (p.kind === "sea" ? "Mar" : KIND[p.kind]) + " · " + ms.length + " Pokémon",
      mon: ms.slice().sort((a, b) => b[4] - a[4]).slice(0, 4).map((m) => m[0]),
    };
  });
});

/* ---- Capa del mapa: transform ---- */
/* El dibujo del mapa va dentro de la página (no como <img>) para poder resaltar rutas con CSS. */
let svgCache = "";
const svgMapa = ref(svgCache);
onMounted(async () => {
  if (svgCache) return;
  try {
    const r = await fetch("/images/pokemon/kanto/mapa.svg");
    if (r.ok) { svgCache = await r.text(); svgMapa.value = svgCache; }
  } catch (e) { /* sin dibujo: los marcadores siguen funcionando */ }
});
const mapin = ref(null);
const vp = ref(null);
function construirTransform(x, y) {
  const s = lugarSel.value; const z = zoom.value;
  const tx = s && zi.value > 0 ? (-z * (s.x - 50)).toFixed(2) + "%" : "0%";
  const ty = s && zi.value > 0 ? (-z * (s.y - 50)).toFixed(2) + "%" : "0%";
  return "translate(" + tx + ", " + ty + ") translate(" + x + "px, " + y + "px) scale(" + z + ")";
}
const transformMapa = computed(() => construirTransform(px.value, py.value));

function elegir(k) {
  selKey.value = k;
  zi.value = Math.max(zi.value, 2);
  px.value = 0; py.value = 0;
}
function elegirZona(k) {
  elegir(k);
  const el = vp.value;
  if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
}
function alAcercar() { zi.value = Math.min(4, zi.value + 1); }
function alAlejar() { zi.value = Math.max(0, zi.value - 1); px.value = 0; py.value = 0; }
function verTodo() { zi.value = 0; px.value = 0; py.value = 0; }
function alBuscar(e) {
  q.value = e.target.value;
  selKey.value = null; zi.value = 0; px.value = 0; py.value = 0;
}
function alternarHecho() {
  const k = selKey.value;
  if (k) hechos[k] = !hechos[k];
}
function alternarCat(c) { cats[c] = !cats[c]; }

/* ---- Arrastre ---- */
let drag = null;
let siguiente = null;
let raf = 0;
const esControl = (e) => e.target && e.target.closest && e.target.closest(".pin, .zoom, .legend, .drawer");

function alPulsar(e) {
  if ((e.button !== undefined && e.button !== 0) || esControl(e)) return;
  drag = { x: e.clientX, y: e.clientY, px: px.value, py: py.value, id: e.pointerId, w: 0, h: 0 };
  const r = e.currentTarget.getBoundingClientRect();
  drag.w = r.width; drag.h = r.height;
  siguiente = { px: px.value, py: py.value };
  try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* el navegador no lo permite */ }
  arrastrando.value = true;
}
function alMover(e) {
  if (!drag) return;
  const lim = (n, max) => Math.max(-max, Math.min(max, n));
  siguiente = {
    px: lim(drag.px + (e.clientX - drag.x), drag.w * zoom.value / 2),
    py: lim(drag.py + (e.clientY - drag.y), drag.h * zoom.value / 2),
  };
  if (!raf) {
    raf = requestAnimationFrame(() => {
      raf = 0;
      /* Se mueve la capa directamente: nada de re-renderizar en cada movimiento. */
      if (mapin.value && siguiente) mapin.value.style.transform = construirTransform(siguiente.px, siguiente.py);
    });
  }
}
function alSoltar(e) {
  if (!drag) return;
  if (raf) { cancelAnimationFrame(raf); raf = 0; }
  try { e.currentTarget.releasePointerCapture(drag.id); } catch (err) { /* ya liberado */ }
  const fin = siguiente || { px: px.value, py: py.value };
  drag = null;
  px.value = fin.px; py.value = fin.py;
  arrastrando.value = false;
  if (mapin.value) mapin.value.style.transform = construirTransform(fin.px, fin.py);
}
function alDobleClic(e) { if (!esControl(e)) alAcercar(); }

/* ---- Rueda: un paso de zoom por cada gesto, sin bloquear el scroll de la página en los extremos ---- */
let acc = 0;
let ultimo = 0;
function alRueda(e) {
  const dir = e.deltaY < 0 ? 1 : -1;
  const z1 = Math.max(0, Math.min(4, zi.value + dir));
  if (z1 === zi.value) return; // en los extremos la página sigue su scroll
  e.preventDefault();
  acc += e.deltaY;
  const ahora = Date.now();
  if (Math.abs(acc) < 60 || ahora - ultimo < 140) return;
  acc = 0; ultimo = ahora;
  zi.value = z1;
  if (z1 === 0) { px.value = 0; py.value = 0; }
}

onMounted(() => { if (vp.value) vp.value.addEventListener("wheel", alRueda, { passive: false }); });
onBeforeUnmount(() => {
  if (vp.value) vp.value.removeEventListener("wheel", alRueda);
  if (raf) cancelAnimationFrame(raf);
});

const claseMapa = computed(() => {
  const b = busqueda.value;
  const c = ["zl" + zi.value];
  if (arrastrando.value) c.push("drag");
  if (findId.value) { c.push("finding"); Object.keys(b.hitPlaces).forEach((k) => c.push("f-" + k)); }
  return c;
});
</script>

<template>
  <div class="pkb pg-mapa">
    <KantoBar :active="2" />
    <CargaDatos :estado="datos">
      <template v-if="datos.data">
        <section class="mhead">
          <div class="wrap mh-in">
            <div><span class="kick"><i></i>Mapa interactivo · Gen I</span><h1 class="h1 fd">El mapa de Kanto</h1></div>
            <div class="mh-ctl">
              <div class="vseg" role="radiogroup" aria-label="Versión">
                <button v-for="(c, k) in { r: 'vr', b: 'va', y: 'vy' }" :key="k" type="button" role="radio" :class="[c, { on: ver === k }]" :aria-checked="ver === k" @click="ver = k">{{ VERN[k] }}</button>
              </div>
              <div class="search msr">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <label class="sr-only" for="q-m">Buscar Pokémon en el mapa</label>
                <input id="q-m" type="search" placeholder="¿Dónde está…? Escribe un Pokémon" :value="q" autocomplete="off" @input="alBuscar" />
              </div>
            </div>
          </div>
          <div class="wrap">
            <div class="cats">
              <button v-for="c in CATS" :key="c[0]" type="button" class="cat" :class="{ on: cats[c[0]] }" :style="{ '--pc': c[3] }" :aria-pressed="cats[c[0]]" @click="alternarCat(c[0])">
                <span class="pin lg" :class="'g-' + c[2]" :style="{ '--pc': c[3] }"></span>{{ c[1] }}<b>{{ contadores[c[0]] }}</b>
              </button>
              <div class="stf" role="group" aria-label="Estado">
                <button v-for="s in ESTADOS" :key="s[0]" type="button" :class="{ on: st === s[0] }" @click="st = s[0]">{{ s[1] }}</button>
              </div>
            </div>
            <div v-if="busqueda.view" class="finder">
              <div class="fd-h">
                <G1 :id="busqueda.view.id" />
                <div>
                  <small>¿Dónde lo encuentro?</small><b class="fd">{{ busqueda.view.n }}</b>
                  <span class="tys"><TypeChip v-for="t in busqueda.view.tipos" :key="t" :k="t" /></span>
                </div>
                <button type="button" class="fd-x" aria-label="Quitar búsqueda" @click="q = ''">✕</button>
              </div>
              <p class="fd-sum">{{ busqueda.view.sum }}</p>
              <template v-if="busqueda.view.best">
                <div class="fd-best">
                  <button type="button" class="fbest" @click="busqueda.view.best.pick()"><span class="tag">{{ busqueda.view.bestTag }}</span><b class="fd">{{ busqueda.view.best.n }}</b><small>{{ busqueda.view.best.d }}</small></button>
                  <button v-if="busqueda.view.early" type="button" class="fbest early" @click="busqueda.view.early.pick()"><span class="tag">Lo antes posible</span><b class="fd">{{ busqueda.view.early.n }}</b><small>{{ busqueda.view.early.d }}</small></button>
                </div>
                <ol class="fd-list">
                  <li v-for="r in busqueda.view.rows" :key="r.i">
                    <button type="button" @click="r.pick()">
                      <span class="fr-n">{{ r.i }}</span>
                      <span class="fr-p"><b>{{ r.n }}</b><small>{{ r.lv }}</small></span>
                      <span class="mth" :class="r.mc">{{ r.mt }}</span>
                      <span class="fr-r"><span class="fbar"><i :style="{ width: r.w }"></i></span>{{ r.r }}</span>
                    </button>
                  </li>
                </ol>
              </template>
            </div>
          </div>
        </section>

        <section class="mbody">
          <div class="wrap">
            <div
              ref="vp"
              class="vp"
              :class="{ open: !!ficha, zoomed: zi > 0 }"
              @pointerdown="alPulsar"
              @pointermove="alMover"
              @pointerup="alSoltar"
              @pointercancel="alSoltar"
              @dblclick="alDobleClic"
            >
              <div class="mapclip">
                <div class="zoom">
                  <button type="button" aria-label="Acercar" @click="alAcercar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
                  <button type="button" aria-label="Alejar" @click="alAlejar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
                  <button type="button" aria-label="Ver todo" @click="verTodo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5" /><path d="M20 9V4h-5" /><path d="M4 15v5h5" /><path d="M20 15v5h-5" /></svg></button>
                  <span class="zt fd">×{{ zoomTxt }}</span>
                </div>
                <div ref="mapin" class="mapin" :class="claseMapa" :style="{ transform: transformMapa }">
                  <div class="kmap-box" aria-hidden="true" v-html="svgMapa"></div>
                  <button
                    v-for="s in pins"
                    :key="s.key"
                    type="button"
                    class="m pin"
                    :class="s.cls"
                    :style="{ left: s.x, top: s.y, '--pc': s.c }"
                    :aria-label="s.lbl"
                    @click="s.pick()"
                  >
                    <span class="pt">{{ s.t }}</span><span class="rtag">{{ s.rt }}</span>
                    <span class="tip"><b>{{ s.lbl }}</b><small>{{ s.sub }}</small></span>
                  </button>
                </div>
                <div class="legend" aria-hidden="true">
                  <span><i class="pin lg g-house" style="--pc: #F5B301"></i>Ciudad</span>
                  <span><i class="pin lg rt">7</i>Ruta</span>
                  <span><i class="pin lg g-cave" style="--pc: #B08350"></i>Zona</span>
                  <span><i class="pin lg g-medal" style="--pc: #FFCB3D"></i>Gimnasio</span>
                  <span><i class="pin lg g-star" style="--pc: #FF5AA5"></i>Legendario o regalo</span>
                  <span><i class="pin lg g-key" style="--pc: #FF9F43"></i>Objeto clave</span>
                  <span><i class="pin lg done"></i>Visitado</span>
                </div>
              </div>
              <KantoMapaFicha v-if="ficha" :sel="ficha" :ver-name="VERN[ver]" @cerrar="selKey = null" @alternar="alternarHecho" />
            </div>
            <p class="credit">Mapa ilustrado por GrietaMeta (no es el mapa del juego). Encuentros de PokeAPI y objetos de la desensambladura pret/pokered.</p>
          </div>
        </section>

        <section class="sec">
          <div class="wrap">
            <div class="sec-h"><div><span class="kick"><i></i>Por zonas</span><h2 class="h2">Todas las zonas de Kanto</h2><p>Toca una zona para verla en el mapa. Los números indican cuántos Pokémon salvajes hay en tu versión.</p></div></div>
            <div class="zones">
              <button v-for="z in zonas" :key="z.k" type="button" class="zn" :class="{ sel: selKey === z.k, done: !!hechos[z.k] }" :style="{ '--pc': z.c }" @click="elegirZona(z.k)">
                <span class="pin lg" :class="z.pc" :style="{ '--pc': z.c }">{{ z.t }}</span>
                <span class="zt2"><b>{{ z.n }}</b><small>{{ z.sub }}</small></span>
                <span class="zs"><G1 v-for="id in z.mon" :key="id" :id="id" /></span>
              </button>
            </div>
          </div>
        </section>
      </template>
    </CargaDatos>
  </div>
</template>
