/* Datos de ejemplo de la ficha de campeón (hoy solo Yasuo, en Mid).
   Vienen de public/data/lol/campeon-ejemplo.json (lo que el diseño
   LolCampeon.dc.html lleva dentro del script) y aquí se adaptan al rango
   elegido con las mismas fórmulas que el diseño. Todo lo que sale de aquí se
   marca «Datos de ejemplo» en la interfaz: matchups, compañeros, variantes de
   build, estadísticas de los últimos 30 días, duración, fase de líneas y
   medias por partida. Cuando el script de Riot calcule estos datos de verdad,
   basta con cambiar el JSON. */

const RANK_KEYS = ["ALL", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER_PLUS"];
const OBJ = "/images/lol/objetos/";

export const SAMPLE_CHAMPIONS = ["Yasuo"]; // ddId de los campeones con datos de ejemplo

const es1 = (v, d = 1) => v.toFixed(d).replace(".", ",");
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const pc2 = (v) => `${es1(v)} %`;

// Matchups con filtro de rival, orden y mínimo de partidas.
export function matchups(raw, rank, { q = "", sort = "wd", big = true } = {}) {
  const Y = raw.ranks;
  const sh = (Y[rank] || Y.ALL)[0] - 52.5;
  const ratio = (Y[rank] || Y.ALL)[3] / 4060;
  const all = raw.MU.map((m) => ({
    n: m[0],
    pos: m[1],
    wr: Math.max(30, Math.min(70, m[2] + sh)),
    d: m[3],
    g: Math.round(m[4] * ratio),
  }));
  const needle = q.trim().toLowerCase();
  let list = all.filter((m) => (!big || m.g >= 1000) && (!needle || m.n.toLowerCase().includes(needle)));
  list = list.slice().sort((a, b) => (sort === "wd" ? b.wr - a.wr : sort === "wa" ? a.wr - b.wr : b.g - a.g));
  return { total: raw.MU.length, list: list.map((m) => decorateMatchup(m)) };
}

function decorateMatchup(m) {
  const off = ((m.wr - 50) / 20) * 50;
  return {
    ...m,
    wrText: pc2(m.wr),
    gText: fmt(m.g),
    dText: `${m.d >= 0 ? "+" : "−"}${es1(Math.abs(m.d))} pp`,
    cls: m.d >= 0 ? "g" : "b",
    left: `${(off >= 0 ? 50 : 50 + Math.max(-50, off)).toFixed(1)}%`,
    width: `${Math.min(50, Math.abs(off)).toFixed(1)}%`,
  };
}

// Detalle de un duelo (oro, CS y experiencia al minuto 15 y consejo).
export function matchupDetail(m) {
  const dlt = (m.wr - 50) / 4;
  const sgn = (v, d, suf) => `${v >= 0 ? "+" : "−"}${es1(Math.abs(v), d)}${suf}`;
  const gold = Math.round(dlt * 90);
  const cs = dlt * 1.6;
  const xp = Math.round(dlt * 55);
  const tip =
    m.wr >= 52
      ? "Duelo a favor: busca intercambios cortos con la Q cargada y presiona antes del nivel 6."
      : m.wr >= 48
        ? "Duelo igualado: juega la oleada y guarda el Muro de viento para su habilidad clave."
        : "Duelo en contra: farmea seguro, no gastes la E sin súbditos cerca y espera a tu jungla.";
  return {
    wr: pc2(m.wr),
    up: m.wr >= 50,
    games: `${fmt(m.g)} partidas`,
    gold: sgn(gold, 0, ""), goldUp: gold >= 0,
    cs: sgn(cs, 1, ""), csUp: cs >= 0,
    xp: sgn(xp, 0, ""), xpUp: xp >= 0,
    tip,
  };
}

// Resumen de la pestaña Build: los 5 mejores y los 5 peores duelos con 1.000+ partidas.
export function matchupSummary(raw, rank) {
  const { list } = matchups(raw, rank, { sort: "wd", big: true });
  return { strong: list.slice(0, 5), weak: list.slice(-5).reverse(), total: raw.MU.length };
}

export function synergies(raw, rank) {
  const y = raw.ranks[rank] || raw.ranks.ALL;
  const wrBase = y[0];
  return raw.SYN.map((a) => ({
    n: a[0] === "JarvanIV" ? "Jarvan IV" : a[0],
    role: a[1],
    pos: raw.SPOS[a[0]],
    wr: `${es1(wrBase + a[2])} %`,
    d: `+${es1(a[2])} pp`,
    g: fmt(Math.round(a[3] * (y[3] / 4060))),
  }));
}

// --- Gráficas, duración, fase de líneas y medias ---------------------------------
const series = (end, amp, n, sd) => {
  const raw = Array.from({ length: n }, (_, i) => Math.sin(i / 3.1 + sd) * amp * 0.6 + Math.cos(i / 1.7 + sd * 2) * amp * 0.4 + (i > 18 ? amp * 0.5 : 0));
  const off = end - raw[n - 1];
  return raw.map((v) => v + off);
};
const chart = (k, arr, col) => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const span = max - min || 1;
  const pts = arr.map((v, i) => [(i / (arr.length - 1)) * 300, 78 - ((v - min) / span) * 68]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const last = arr[arr.length - 1];
  const d = last - arr[0];
  return {
    k,
    line,
    area: `${line} L300 86 L0 86 Z`,
    col,
    px: ((19 / (arr.length - 1)) * 300).toFixed(1),
    pxp: `${((19 / (arr.length - 1)) * 100).toFixed(1)}%`,
    v: `${es1(last)} %`,
    min: `${es1(min)} %`,
    max: `${es1(max)} %`,
    d: `${d >= 0 ? "▲ " : "▼ "}${es1(Math.abs(d))} pp`,
    dc: k === "Banrate" ? "nt" : d >= 0 ? "up" : "dn",
    sr: `${k} en los últimos 30 días: empezó en ${es1(arr[0])} % y hoy está en ${es1(last)} %, con un mínimo de ${es1(min)} % y un máximo de ${es1(max)} %.`,
  };
};

export function statsTab(raw, rank) {
  const y = raw.ranks[rank] || raw.ranks.ALL;
  const [wrBase, prBase, brBase, games] = y;
  const shift = wrBase - 52.5;
  const seed = 1 * 3.7 + RANK_KEYS.indexOf(rank) * 1.3; // línea Mid
  const charts = [
    chart("Winrate", series(wrBase, 1.1, 30, 1 + seed), "#62D99C"),
    chart("Pickrate", series(prBase, 0.9, 30, 4 + seed), "#E2B566"),
    chart("Banrate", series(brBase, 1.6, 30, 7 + seed), "#F08A7A"),
  ];

  const tot = raw.DUR.reduce((t, x) => t + x[2], 0);
  const DUR = raw.DUR.map((d) => [d[0], Math.max(40, Math.min(62, d[1] + shift)), d[2] / tot]);
  let acc = 0;
  DUR.forEach((d, i) => {
    const v = i === DUR.length - 1 ? games - acc : Math.round(d[2] * games);
    d[2] = v;
    acc += v;
  });
  const DMIN = 44;
  const DMAX = 58;
  const dh = (v) => Math.max(4, ((v - DMIN) / (DMAX - DMIN)) * 100);
  const dur = DUR.map((d) => ({
    l: d[0],
    w: `${es1(d[1])} %`,
    g: fmt(Math.max(1, d[2])),
    h: `${dh(d[1]).toFixed(0)}%`,
    c: d[1] >= 51.5 ? "hi" : d[1] < 49 ? "lo" : "",
  }));
  const best = DUR.reduce((a, b) => (b[1] > a[1] ? b : a));
  const durTitle = `Su mejor tramo: ${best[0].includes("min") ? best[0] : "de " + best[0].replace("–", " a ") + " min"} (${es1(best[1])} %)`;

  const k15 = 1 + shift / 20;
  const lane = raw.LANE.map((x) => {
    const v = x[1] * k15;
    return { k: x[0], v: `${v >= 0 ? "+" : "−"}${es1(Math.abs(v), x[2])}${x[3]}`, c: v >= 0 ? "up" : "dn" };
  });
  const lvl2 = `${es1(54.2 + shift)} % de partidas`;

  const avg = raw.AVG.map((x) => {
    const v = x[1] * (1 + shift / 60);
    const good = x[5] === 0 ? null : x[4] * x[5] >= 0;
    const unit = x[3] === " %" ? " pp" : "";
    return {
      k: x[0],
      v: es1(v, x[2]) + x[3],
      d: `${x[4] >= 0 ? "+" : "−"}${es1(Math.abs(x[4]), x[2])}${unit}`,
      c: good === null ? "nt" : good ? "up" : "dn",
    };
  });

  return { charts, dur, durTitle, durRef: `${dh(50).toFixed(0)}%`, lane, lvl2, avg };
}

// --- Variantes de build (runas, hechizos, objetos) ------------------------------
function runeRow(row, pick, tree) {
  return row.map((r, i) => ({ ...r, on: i === pick, label: r.n + (i === pick ? " (elegida)" : ""), meta: tree + (i === pick ? " · elegida" : "") }));
}

export function buildVariants(raw, rank) {
  const y = raw.ranks[rank] || raw.ranks.ALL;
  const shift = y[0] - 52.5;
  const totalG = raw.BV.reduce((t, b) => t + b.g, 0);
  const item = (id, extra) => ({ id, icon: OBJ + id + ".png", n: raw.ITN[id], ...extra });
  const all = raw.BV.map((b, k) => {
    const w = b.w + shift;
    const gn = Math.round(b.g * (y[3] / 4060));
    return {
      key: "bv" + k,
      n: b.n,
      tag: b.tag,
      ks: raw.RU_P[0][b.k].p,
      sub: `${raw.RU_P[0][b.k].n} · Precisión + Valor`,
      w: `${es1(w)} %`,
      gn,
      g: fmt(gn),
      share: `${es1((b.g / totalG) * 100)} %`,
      pRows: raw.RU_P.map((row, ri) => ({ keystone: ri === 0, r: runeRow(row, ri === 0 ? b.k : b.p[ri - 1], "Precisión") })),
      sRows: raw.RU_V.map((row, ri) => ({ r: runeRow(row, (b.s.find((x) => x[0] === ri) || [0, -1])[1], "Valor") })),
      shRows: raw.RU_SH.map((row, ri) => ({ r: runeRow(row, b.sh[ri], "Fragmento") })),
      spells: b.sp.map((x, si) => ({ a: raw.SPL[x[0][0]], b: raw.SPL[x[0][1]], n: x[0][1], al: `${x[0][0]} + ${x[0][1]}`, w: `${es1(x[1] + shift)} %`, u: `${x[2]} %`, top: si === 0 })),
      boots: [item(b.b, { m: "Botas · las de esta build" })],
      core: b.c.map((id, ci) => item(id, { k: ci + 1, more: ci < b.c.length - 1, m: `${ci + 1}.º objeto · ${es1(w + 1.2 - ci * 0.6)} % de winrate` })),
      situ: b.x.map((id, xi) => item(id, { m: `Situacional · ${es1(w - 0.4 - xi * 0.5)} % de winrate` })),
      note: `Runas, hechizos y objetos de las ${fmt(gn)} partidas de Yasuo con esta build.`,
    };
  });
  // Las 3 variantes más usadas con 1.000+ partidas; si ninguna llega, la principal.
  const top = all.filter((b) => b.gn >= 1000).sort((a, b) => b.gn - a.gn).slice(0, 3);
  return { list: top.length ? top : [all[0]], onlyMain: top.length === 0 };
}
