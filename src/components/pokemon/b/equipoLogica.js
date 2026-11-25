/* Lógica del asistente «Crea tu equipo» (diseño: models/paginas/PokemonEquipo.dc.html).
   Funciones puras: reciben la lista de Pokémon `M` del formato elegido y devuelven
   análisis, sugerencias y métricas. Sin estado propio. */
import { pct } from "./datos.js";

export const TKL = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
export const TNM = { normal: "Normal", fighting: "Lucha", flying: "Volador", poison: "Veneno", ground: "Tierra", rock: "Roca", bug: "Bicho", ghost: "Fantasma", steel: "Acero", fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico", psychic: "Psíquico", ice: "Hielo", dragon: "Dragón", dark: "Siniestro", fairy: "Hada" };
export const TCL = { normal: "#A8A77A", fighting: "#D3425F", flying: "#8FA8DD", poison: "#B567CE", ground: "#D97845", rock: "#C5B78C", bug: "#91C12F", ghost: "#5269AD", steel: "#5A8EA2", fire: "#FF9D55", water: "#4D90D5", grass: "#63BC5A", electric: "#F4D23C", psychic: "#FA7179", ice: "#73CEC0", dragon: "#0B6DC3", dark: "#5A5465", fairy: "#EC8FE6" };

const hasM = (m, ns) => m.mv.some((x) => ns.includes(x[0]) && x[2] >= 20);
const hasA = (m, ns) => m.ab.some((x) => ns.includes(x[0]) && x[1] >= 30);
const SPREAD = ["Terremoto", "Avalancha", "Onda Ígnea", "Surf", "Vozarrón", "Viento Hielo", "Brillo Mágico", "Chispazo", "Onda Tóxica", "Viento Cortante", "Fuerza Equina", "Ventisca", "Hiperrayo"];
export const ROLES = {
  dbl: [
    ["Sorpresa", "gana un turno al empezar", (m) => hasM(m, ["Sorpresa"])],
    ["Intimidación", "baja el Ataque de los dos rivales", (m) => hasA(m, ["Intimidación"])],
    ["Control de velocidad", "Viento Afín, Espacio Raro, Viento Hielo…", (m) => hasM(m, ["Viento Afín", "Espacio Raro", "Viento Hielo", "Onda Trueno", "Electrotela"])],
    ["Redirección", "Señuelo o Polvo Ira", (m) => hasM(m, ["Señuelo", "Polvo Ira"])],
    ["Clima o campo", "sol, lluvia, arena, nieve o campos", (m) => hasA(m, ["Sequía", "Llovizna", "Chorro Arena", "Nevada", "Herbogénesis", "Psicogénesis", "Electrogénesis", "Nebulogénesis"])],
    ["Ataque a los dos rivales", "Terremoto, Onda Ígnea, Vozarrón…", (m) => hasM(m, SPREAD)],
  ],
  sgl: [
    ["Trampas", "Trampa Rocas o Púas", (m) => hasM(m, ["Trampa Rocas", "Púas", "Púas Tóxicas", "Red Viscosa"])],
    ["Quitar trampas", "Despejar, Giro Rápido o Espejo Mágico", (m) => hasM(m, ["Despejar", "Giro Rápido", "Giro Mortal", "Limpieza General"]) || hasA(m, ["Espejo Mágico"])],
    ["Pivote", "Ida y Vuelta, Voltiocambio, Viraje…", (m) => hasM(m, ["Ida y Vuelta", "Voltiocambio", "Viraje", "Teletransporte", "Última Palabra"])],
    ["Prioridad", "Golpe Bajo, Velocidad Extrema…", (m) => hasM(m, ["Golpe Bajo", "Velocidad Extrema", "Acua Jet", "Puño Bala", "Sombra Vil", "Ataque Rápido"])],
    ["Recuperación", "Respiro, Recuperación o Regeneración", (m) => hasM(m, ["Respiro", "Recuperación", "Luz Lunar", "Síntesis", "Sol Matinal", "Deseo", "Descanso", "Relajo"]) || hasA(m, ["Regeneración"])],
    ["Estados", "Fuego Fatuo, Tóxico, Onda Trueno…", (m) => hasM(m, ["Fuego Fatuo", "Tóxico", "Onda Trueno", "Espora", "Somnífero", "Bostezo", "Deslumbrar"])],
  ],
};
const IMM = { Levitación: "ground", "Absorbe Fuego": "fire", "Absorbe Agua": "water", Colector: "water", "Piel Seca": "water", "Absorbe Elec": "electric", Pararrayos: "electric", Electromotor: "electric", Herbívoro: "grass", "Cuerpo Llama": "" };
export const isMega = (m) => m.es.startsWith("Mega ");
export const fmtN = (n) => String(Math.round(n)).replace(".", ",");

/* Crea el motor de análisis para una lista de Pokémon `M` y la tabla de efectividad `EFF`. */
export function crearMotor(M, fmtKey, EFF) {
  const RL = ROLES[fmtKey === "vgc" ? "dbl" : "sgl"];
  const mult = (m, a) => {
    const ai = TKL.indexOf(a); let x = 1;
    m.t.forEach((d) => { x *= EFF[ai][TKL.indexOf(d)] / 100; });
    const ab = m.ab[0];
    if (ab && ab[1] >= 50 && IMM[ab[0]] === a) x = 0;
    return x;
  };
  const tmP = (i, j) => { const x = M[i].tm.find((t) => t[3] === j); return x ? x[2] : 0; };
  const analyse = (tm) => {
    const w = {}; const r = {};
    TKL.forEach((a) => { w[a] = 0; r[a] = 0; tm.forEach((i) => { const x = mult(M[i], a); if (x > 1) w[a]++; else if (x < 1) r[a]++; }); });
    const roles = RL.map((ro) => ({ n: ro[0], d: ro[1], who: tm.filter((i) => ro[2](M[i])).map((i) => M[i].es) }));
    return { w, r, roles, megas: tm.filter((i) => isMega(M[i])).length };
  };
  const score = (tm, c) => {
    const A = analyse(tm); const m = M[c]; let sc = m.u * 0.3; const why = [];
    const mates = tm.map((i) => [i, tmP(i, c)]).sort((a, b) => b[1] - a[1]);
    mates.forEach((x) => { sc += x[1]; });
    if (mates.length && mates[0][1] >= 12) why.push({ n: "Va con " + M[mates[0][0]].es + " (" + Math.round(mates[0][1]) + " %)", k: "mate" });
    const cov = [];
    TKL.forEach((a) => {
      const net = A.w[a] - A.r[a];
      if (net >= 1 && tm.length) { const x = mult(m, a); if (x < 1) { sc += 5 * net; cov.push(a); } else if (x > 1) sc -= 4 * net; }
    });
    if (cov.length) {
      const t = cov.slice(0, 2).map((a) => (mult(m, a) === 0 ? "inmune a " : "resiste ") + TNM[a]).join(" · ");
      why.push({ n: t.charAt(0).toUpperCase() + t.slice(1), k: "def" });
    }
    A.roles.forEach((ro, i) => { if (!ro.who.length && RL[i][2](m)) { sc += 8; if (why.length < 3) why.push({ n: "Aporta " + ro.n, k: "role" }); } });
    if (isMega(m) && A.megas >= 2) sc -= 30;
    if (!why.length) why.push({ n: "Muy usado: " + pct(m.u), k: "" });
    return { sc, why };
  };
  const free = (tm) => M.map((m, i) => i).filter((i) => !tm.includes(i) && !tm.some((j) => M[j].id === M[i].id));
  const fillBest = (tm) => {
    const t = tm.length ? tm.slice() : [0];
    while (t.length < 6) {
      const c = free(t).map((i) => [i, score(t, i).sc]).sort((a, b) => b[1] - a[1])[0];
      if (!c) break;
      t.push(c[0]);
    }
    return t;
  };

  /* Todo el análisis de un equipo (lista de índices en M). */
  function evaluar(team) {
    const A = analyse(team);
    const cands = team.length < 6 ? free(team).map((i) => ({ i, ...score(team, i) })).sort((a, b) => b.sc - a.sc).slice(0, 4) : [];
    const mx = cands.length ? Math.max(...cands.map((c) => c.sc), 1) : 1;
    let swaps = [];
    if (team.length >= 6) {
      team.forEach((i) => {
        const rest = team.filter((x) => x !== i); const base = score(rest, i).sc;
        const c = free(rest).filter((x) => x !== i).map((x) => ({ i: x, ...score(rest, x) })).sort((a, b) => b.sc - a.sc)[0];
        if (c && c.sc > base + 3) swaps.push({ out: i, gain: c.sc - base, ...c });
      });
      swaps = swaps.sort((a, b) => b.gain - a.gain).slice(0, 4);
    }
    let syn = 0; let np = 0;
    team.forEach((i) => team.forEach((j) => { if (i !== j) { syn += tmP(i, j); np++; } }));
    syn = np ? syn / np : 0;
    const met = team.length ? team.reduce((s, i) => s + M[i].u, 0) / team.length : 0;
    const bad = TKL.filter((a) => (A.w[a] >= 3 && A.w[a] > A.r[a]) || (A.w[a] >= 2 && A.r[a] === 0));
    const def = team.length ? Math.max(0, 100 - bad.length * 18 - TKL.filter((a) => A.w[a] - A.r[a] >= 2).length * 8) : 0;
    const rolesOn = A.roles.filter((r) => r.who.length).length;
    const total = team.length ? Math.min(100, syn * 2.2) * 0.35 + Math.min(100, met * 2.5) * 0.2 + def * 0.25 + (rolesOn / RL.length) * 100 * 0.2 : 0;
    const grade = !team.length ? "Sin equipo" : team.length < 6 ? "En construcción" : total >= 75 ? "Equipo sólido" : total >= 58 ? "Buena base" : "Necesita ajustes";
    const gradeTxt = !team.length
      ? "Añade Pokémon o pulsa «Generar el mejor equipo»."
      : (bad.length ? "Ojo con " + bad.slice(0, 3).map((a) => TNM[a]).join(", ") + ": varios de tu equipo son débiles." : "Sin debilidades graves compartidas.")
        + (rolesOn < RL.length ? " Te falta: " + A.roles.filter((r) => !r.who.length).map((r) => r.n.toLowerCase()).slice(0, 2).join(" y ") + "." : " Cubres todas las funciones clave.");
    return { A, cands, mx, swaps, syn, met, bad, def, rolesOn, grade, gradeTxt, nroles: RL.length };
  }

  return { evaluar, fillBest, free };
}
