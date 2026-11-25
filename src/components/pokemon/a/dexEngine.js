/* Lógica de «Pokédex» portada del diseño (models/paginas/PokemonDex.dc.html):
   las tablas viven en public/data/pokemon/ y llegan por parámetro; el estado
   es el reactive de la vista. renderVals() devuelve lo que pinta la plantilla. */

export function createDexEngine(DATA, st) {
  const { DX, MV, TM, PS, LOC, NAT, AB, ART, MEGI, EFF, OBJ_ZT, OBJ_TE, G1, MEG, OBJ_MS, OBJ_ZE, OBJ_GX, RECO, ABDESC } = DATA;
  const PT = {"35":[[5,[1]]],"36":[[5,[1]]],"39":[[5,[1]]],"40":[[5,[1]]],"81":[[1,[13]]],"82":[[1,[13]]],"122":[[5,[14]]],"173":[[5,[1]]],"174":[[5,[1]]],"175":[[5,[1]]],"176":[[5,[1,3]]],"183":[[5,[11]]],"184":[[5,[11]]],"209":[[5,[1]]],"210":[[5,[1]]],"280":[[5,[14]]],"281":[[5,[14]]],"282":[[5,[14]]],"298":[[5,[1]]],"303":[[5,[9]]],"439":[[5,[14]]],"468":[[5,[1,3]]],"546":[[5,[12]]],"547":[[5,[12]]]};
  const mgp = (pid) => { const k = Math.max(0, MEGI.indexOf(pid)); return ((k % 10) / 9 * 100).toFixed(3) + '% ' + (Math.floor(k / 10) / 9 * 100).toFixed(3) + '%'; };
  const EPAST = [[4,7,200,1],[7,4,200,1],[8,14,0,1],[15,10,100,1],[8,9,50,5],[17,9,50,5]];
  const TK = ["normal","fighting","flying","poison","ground","rock","bug","ghost","steel","fire","water","grass","electric","psychic","ice","dragon","dark","fairy"];
  const TN = ["Normal","Lucha","Volador","Veneno","Tierra","Roca","Bicho","Fantasma","Acero","Fuego","Agua","Planta","Eléctrico","Psíquico","Hielo","Dragón","Siniestro","Hada"];
  const TC = ["#A8A77A","#D3425F","#8FA8DD","#B567CE","#D97845","#C5B78C","#91C12F","#5269AD","#5A8EA2","#FF9D55","#4D90D5","#63BC5A","#F4D23C","#FA7179","#73CEC0","#0B6DC3","#5A5465","#EC8FE6"];
  const TX = ["#1B1A12","#FFF","#10172A","#FFF","#1F1206","#1D1A10","#141B05","#FFF","#FFF","#2A1300","#FFF","#0D1F0A","#2A2300","#FFF","#0B2420","#FFF","#FFF","#2A0E28"];
  const GR = ['I','II','III','IV','V','VI','VII','VIII','IX'];
  const GLIM = [151, 251, 386, 493, 649, 721, 809, 905, 1025];
  const SN = ['PS', 'Ataque', 'Defensa', 'At. Esp.', 'Def. Esp.', 'Velocidad'];
  const SC = ['#7CF3B0', '#FF7A59', '#FFCB3D', '#5B8CFF', '#62D2E8', '#FF5AA5'];
  const BY = {}; DX.forEach((d) => { BY[d[0]] = d; });
  const ARTI = {}; ART.forEach((id, k) => { ARTI[id] = k; });
  const sp = (id) => { const i = id - 1; return ((i % 32) / 31 * 100).toFixed(3) + '% ' + (Math.floor(i / 32) / 32 * 100).toFixed(3) + '%'; };
  const g1p = (id) => { const i = id - 1; return ((i % 16) / 15 * 100).toFixed(3) + '% ' + (Math.floor(i / 16) / 9 * 100).toFixed(3) + '%'; };
  const ap = (k) => ((k % 15) / 14 * 100).toFixed(3) + '% ' + (Math.floor(k / 15) / 14 * 100).toFixed(3) + '%';
  const nTypes = (g) => g === 1 ? 15 : g <= 5 ? 17 : 18;
  const typesFor = (d, g) => {
    const pt = PT[d[0]];
    if (pt) { const c = pt.filter((x) => x[0] >= g).sort((a, b) => a[0] - b[0])[0]; if (c) return c[1]; }
    return d[3];
  };
  const statsFor = (d, g) => {
    const s = d[4].slice();
    const ps = PS[d[0]] || [];
    for (let k = 1; k <= 6; k++) {
      const c = ps.filter((x) => x[1] === k && x[0] >= g).sort((a, b) => a[0] - b[0])[0];
      if (c) s[k - 1] = c[2];
    }
    return s;
  };
  const eff = (a, dfn, g) => {
    let f = EFF[a - 1][dfn - 1];
    EPAST.forEach((r) => { if (r[0] === a && r[1] === dfn && r[3] >= g) f = r[2]; });
    return f / 100;
  };
  const pad = (n) => String(n).padStart(4, '0');
  const ty = (i) => ({ k: TK[i - 1], n: TN[i - 1] });
  const METH = { walk: ['Hierba', 'm-walk'], 'old-rod': ['Caña Vieja', 'm-fish'], 'good-rod': ['Caña Buena', 'm-fish'], 'super-rod': ['Supercaña', 'm-fish'], surf: ['Surf', 'm-surf'], gift: ['Regalo', 'm-gift'], 'npc-trade': ['Intercambio', 'm-trade'], static: ['Fijo', 'm-static'] };
  const natFor = (s) => {
    const [hp, at, df, sa, sd, spe] = s;
    const phys = at >= sa;
    const N = (inc, dec) => NAT.find((n) => n[2] === inc && n[3] === dec)[1];
    if (Math.max(at, sa) < 70 && hp + df + sd > 260) return [[N(3, 2), '+Def −Atq'], [N(5, 2), '+DefE −Atq']];
    if (spe < 50) return phys ? [[N(2, 4), '+Atq −AtE'], [N(2, 6), '+Atq −Vel (Espacio Raro)']] : [[N(4, 2), '+AtE −Atq'], [N(4, 6), '+AtE −Vel (Espacio Raro)']];
    if (spe >= 80) return phys ? [[N(6, 4), '+Vel −AtE'], [N(2, 4), '+Atq −AtE']] : [[N(6, 2), '+Vel −Atq'], [N(4, 2), '+AtE −Atq']];
    return phys ? [[N(2, 4), '+Atq −AtE'], [N(6, 4), '+Vel −AtE']] : [[N(4, 2), '+AtE −Atq'], [N(6, 2), '+Vel −Atq']];
  };
  const fmtGen = { 1: 'Gen I', 2: 'Gen II', 3: 'Gen III', 4: 'Gen IV', 5: 'Gen V', 6: 'Gen VI', 7: 'Gen VII', 8: 'Gen VIII', 9: 'Gen IX' };
  const OBJ_KEY = {"mega": [145, "Megapulsera"], "z": [141, "Pulsera Z"], "dmax": [143, "Maximuñequera"], "maxi": [147, "Maxiseta"], "tera": [144, "Orbe Teracristal"]};
  const obp = (i) => ((i % 16) / 15 * 100).toFixed(3) + '% ' + (Math.floor(i / 16) / 10 * 100).toFixed(3) + '%';
  const gxp = (i) => ((i % 6) / 5 * 100).toFixed(3) + '% ' + (Math.floor(i / 6) / 5 * 100).toFixed(3) + '%';

  const C = {
    state: st,
    props: { animaciones: true },
    setState(o) { Object.assign(st, o); },

  pick(id) {
    this.setState({ sel: id });
    if (typeof window !== 'undefined' && window.innerWidth < 860) { const el = document.getElementById('ficha'); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  },
  baseVals() {
    const S = this.state; const g = S.g;
    const on = this.props.animaciones ?? true;
    const nt = nTypes(g);
    const q = S.q.trim().toLowerCase();
    let list = DX.filter((d) => d[0] <= GLIM[g - 1] && (!S.only || d[2] === g));
    if (q) list = list.filter((d) => d[1].toLowerCase().includes(q) || String(d[0]) === q.replace('#', ''));
    if (S.ft.length) list = list.filter((d) => { const t = typesFor(d, g); return S.ft.every((x) => t.includes(x)); });
    const tot = (d) => statsFor(d, g).reduce((a, b) => a + b, 0);
    if (S.sort === 'az') list = list.slice().sort((a, b) => a[1].localeCompare(b[1]));
    if (S.sort === 'tot') list = list.slice().sort((a, b) => tot(b) - tot(a));
    if (S.sort === 'spe') list = list.slice().sort((a, b) => statsFor(b, g)[5] - statsFor(a, g)[5]);
    const shown = list.slice(0, S.lim);
    const useG1 = g === 1;
    const cards = shown.map((d) => {
      const t = typesFor(d, g);
      return { num: pad(d[0]), n: d[1], t: t.map(ty), c: TC[t[0] - 1], c2: TC[(t[1] || t[0]) - 1], on: d[0] === S.sel ? 'on' : '',
        sc: useG1 ? 'g1s' : 'spr', bp: useG1 ? g1p(d[0]) : sp(d[0]), pick: () => this.pick(d[0]) };
    });
    // ficha
    const d = BY[S.sel] && BY[S.sel][0] <= GLIM[g - 1] ? BY[S.sel] : (shown[0] || BY[1]);
    const t = typesFor(d, g);
    const st = statsFor(d, g);
    const k1 = g === 1 ? G1[d[0]] : null;
    let rows;
    if (g === 1 && k1) {
      rows = [['PS', st[0], SC[0]], ['Ataque', st[1], SC[1]], ['Defensa', st[2], SC[2]], ['Especial', k1.sp, '#B98CFF'], ['Velocidad', st[5], SC[5]]];
    } else {
      rows = SN.map((n, i) => [n, st[i], SC[i]]);
    }
    const total = rows.reduce((a, r) => a + r[1], 0);
    const groups = { 4: [], 2: [], 0.5: [], 0.25: [], 0: [] };
    for (let a = 1; a <= nt; a++) {
      const m = t.reduce((x, dt) => x * eff(a, dt, g), 1);
      if (groups[m]) groups[m].push(a);
    }
    const wk = [[4, '×4', 'x4'], [2, '×2', 'x2'], [0.5, '×½', 'x05'], [0.25, '×¼', 'x025'], [0, '×0', 'x0']]
      .filter((x) => groups[x[0]].length).map((x) => ({ m: x[1], cls: x[2], t: groups[x[0]].map(ty) }));
    // evoluciones
    let root = d; let guard = 0;
    while (root[10] && BY[root[10]] && guard++ < 5) root = BY[root[10]];
    const chain = []; const walk = (r, depth) => { if (r[0] > GLIM[g - 1]) return; chain.push(r); DX.filter((x) => x[10] === r[0]).forEach((c) => walk(c, depth + 1)); };
    walk(root, 0);
    const evo = chain.slice(0, 8).map((e) => ({ n: e[1], bp: sp(e[0]), on: e[0] === d[0] ? 'on' : '', m: e === root ? 'Base' : (G1[e[0]] && G1[e[0]].evo) || '↑', pick: () => this.pick(e[0]) }));
    const hasArt = ARTI[d[0]] !== undefined;
    const rc = RECO[d[0]] || {};
    const recAb = rc.ab ? rc.ab[0] : '';
    const ab = d[8] ? [[d[8][0], 'Normal', ''], [d[8][1], 'Normal', ''], [d[8][2], 'Oculta', 'hid']].filter((a) => a[0] && (a[1] !== 'Oculta' || g >= 5)).map((a) => { const n = AB[a[0]] || '—'; const r = n === recAb;
      return { n, k: a[1], cls: a[2] + (r ? ' rec' : ''), rec: r ? '★ Recomendada' : '', d: ABDESC[a[0]] || '' }; }) : [];
    const recIn = ab.some((a) => a.n === recAb);
    const abWhy = !recIn ? '' : rc.ab[1] ? 'La lleva el ' + rc.ab[1] + ' % de los ' + d[1] + ' en ' + rc.ab[2] + ' (Pokémon Showdown, octubre de 2026).' : 'Elegida por lo que hace cada habilidad con sus estadísticas y su tipo.';
    const megs = (MEG[d[0]] || []).filter((m) => g >= 6 && (m[0] < 10100 || g >= 9));
    const megas = megs.map((m) => { const tt = m[3].reduce((a, b) => a + b, 0); const ms = OBJ_MS[m[0]]; return { n: m[1], bp: mgp(m[0]), stone: ms ? ms[1] : 'Sin piedra: necesita Ascenso del Dragón', sbp: obp(ms ? ms[0] : OBJ_KEY.mega[0]), t: m[2].map((k) => ({ k, n: TN[TK.indexOf(k)] })), c1: TC[TK.indexOf(m[2][0])], c2: TC[TK.indexOf(m[2][1] || m[2][0])], ab: m[4] || '—', tot: tt,
      st: m[3].map((v, i) => ({ n: ['PS', 'Atq', 'Def', 'AtE', 'DfE', 'Vel'][i], v, d: v > d[4][i] ? 'up' : v < d[4][i] ? 'dn' : '' })) }; });
    const kanto = d[0] <= 151;
    const ver = S.ver;
    const locs = kanto ? (G1[d[0]].e[ver] || []).map((l) => {
      const m = METH[l[1]] || [l[1], 'm-gift'];
      return { n: LOC[l[0]] || l[0], mt: m[0], mc: m[1], lv: l[1] === 'npc-trade' ? 'Intercambio con un NPC' : (l[2] === l[3] ? 'Nv. ' + l[2] : 'Nv. ' + l[2] + '–' + l[3]), r: Math.min(100, l[4]) + ' %', w: Math.min(100, l[4]) + '%' };
    }) : [];
    const evoNote = kanto && !locs.length && d[10] ? 'Evoluciona de ' + BY[d[10]][1] : '';
    const tk = t.map((x) => TK[x - 1]);
    const it = (e) => ({ bp: obp(e[0]), n: e[1] });
    const mech = [];
    if (megas.length) mech.push({ k: 'Megaevolución · Gen VI', t: megas.length === 1 ? 'Megapiedra: ' + megas[0].stone : megas.length + ' megapiedras: ' + Array.from(new Set(megas.map((m) => m.stone))).join(', '), d: 'Equípasela y megaevoluciona una vez por combate con la Megapulsera.', its: megas.filter((m, i, a) => a.findIndex((x) => x.stone === m.stone) === i).map((m) => ({ bp: m.sbp, n: m.stone })) });
    if (g >= 7) { const ze = OBJ_ZE[d[0]]; mech.push(ze ? { k: 'Movimiento Z · Gen VII', t: ze[1] + ' → ' + ze[2], d: 'Cristal Z exclusivo. Con la Pulsera Z, su movimiento propio se convierte en este movimiento Z.', its: [it(ze)] }
      : { k: 'Movimiento Z · Gen VII', t: tk.map((k) => OBJ_ZT[k][1]).join(' o '), d: 'Cristal Z de su tipo: con la Pulsera Z, un movimiento de ese tipo pasa a ser su movimiento Z una vez por combate.', its: tk.map((k) => it(OBJ_ZT[k])) }); }
    if (g >= 8) { const gx = OBJ_GX[d[0]]; mech.push(gx ? { k: 'Gigamax · Gen VIII', t: gx.map((x) => x[1]).join(' · '), d: 'Tiene forma Gigamax con su propio movimiento G-Max. En Espada y Escudo se le da con la Maxiseta.', gx: true, gxp: gxp(gx[0][0]), gxl: gx[0][1], its: [it(OBJ_KEY.dmax), it(OBJ_KEY.maxi)] }
      : { k: 'Dinamax · Gen VIII', t: 'Dinamax con la Maximuñequera', d: 'No tiene forma Gigamax, pero puede dinamizarse 3 turnos: dobla sus PS y usa movimientos Max.', its: [it(OBJ_KEY.dmax)] }); }
    if (g >= 9) mech.push({ k: 'Teracristalización · Gen IX', t: 'Teratipo natural: ' + tk.map((k) => TN[TK.indexOf(k)]).join(' o '), d: 'Con el Orbe Teracristal cambia a su teratipo. Con 50 teralitos de otro tipo puedes cambiárselo.', its: tk.map((k) => ({ bp: obp(OBJ_TE[k][0]), n: 'Teratipo ' + TN[TK.indexOf(k)] })).concat(tk.map((k) => ({ bp: obp(OBJ_TE[k][1]), n: OBJ_TE[k][2] }))) });
    const p = {
      num: pad(d[0]), n: d[1], genus: d[5], gen: GR[d[2] - 1], t: t.map(ty), c: TC[t[0] - 1], c2: TC[(t[1] || t[0]) - 1], tx: TX[t[0] - 1],
      artCls: hasArt ? 'art' : (useG1 && kanto ? 'g1s big' : 'spr big'), ap: hasArt ? ap(ARTI[d[0]]) : (useG1 && kanto ? g1p(d[0]) : sp(d[0])),
      st: rows.map((r) => ({ n: r[0], v: r[1], w: Math.min(100, r[1] / 180 * 100).toFixed(1) + '%', c: r[2] })), tot: total,
      stNote: g === 1 ? 'Gen I: Ataque Especial y Defensa Especial eran una sola estadística, Especial.' : '',
      weak: [4, 2].flatMap((m) => groups[m].map((a) => ({ k: TK[a - 1], n: TN[a - 1], m: m === 4 ? '×4' : '×2' }))).slice(0, 7),
      recAb: recIn ? recAb : (ab[0] ? ab[0].n : ''), abWhy, hasMega: megas.length > 0, megas, megaLate: megas.length === 0 && (MEG[d[0]] || []).length > 0 && g < 6, megaN: megas.length === 1 ? '1 mega' : megas.length + ' megas', megaTxt: megas.length ? ' y megaevoluciones' : '', mech, hasMech: mech.length > 0, mechN: mech.length === 1 ? '1 mecánica' : mech.length + ' mecánicas',
      rmv: (rc.mv || []).map((m) => ({ n: m[0], k: m[1], tn: TN[TK.indexOf(m[1])] })), mvSrc: rc.src === 'uso' ? 'los más usados en competitivo (Showdown)' : 'según su tipo, sus estadísticas y lo que aprende',
      wk, ab, hasAb: g >= 3 && ab.length > 0, noAb: g < 3, hasNat: g >= 3, noNat: g < 3,
      nat: natFor(st).map((x) => ({ n: x[0], k: x[1] })), evo,
      h: (d[6] / 10).toFixed(1).replace('.', ',') + ' m', w: (d[7] / 10).toFixed(1).replace('.', ',') + ' kg', cat: d[9] === 2 ? 'Singular' : d[9] === 1 ? 'Legendario' : 'Normal',
      fl: kanto ? G1[d[0]].fl : '', hasFl: kanto && !!G1[d[0]].fl,
      kanto, notKanto: !kanto, locs, noLoc: kanto && locs.length === 0,
      noLocT: evoNote ? 'No aparece en estado salvaje' : 'No está en esta versión',
      noLocS: evoNote ? evoNote + '. Captura su preevolución y súbela de nivel.' : 'Consíguelo por intercambio con otra versión.',
      lv: kanto ? G1[d[0]].lv.map((x) => { const m = MV[x[1]]; return { l: x[0] <= 1 ? 'Inicio' : 'Nv. ' + x[0], n: m[0], k: TK[m[1] - 1], tn: TN[m[1] - 1], p: m[2] || '—' }; }) : [],
      tm: kanto ? G1[d[0]].tm.map((id) => { const m = MV[id]; const no = TM[id]; return { n: m[0], k: TK[m[1] - 1], no: no > 100 ? 'MO' + String(no - 100).padStart(2, '0') : 'MT' + String(no).padStart(2, '0') }; }) : [],
    };
    const rules = g === 1
      ? [{ t: '15 tipos', cls: 'hl' }, { t: 'Estadística Especial única', cls: 'hl' }, { t: 'Sin habilidades', cls: 'no' }, { t: 'Sin naturalezas ni crianza', cls: 'no' }, { t: 'Sin objetos equipados', cls: 'no' }]
      : g === 2 ? [{ t: '17 tipos (llegan Siniestro y Acero)', cls: 'hl' }, { t: 'Ataque y Defensa Especial separados', cls: '' }, { t: 'Crianza y objetos equipados', cls: '' }, { t: 'Sin habilidades ni naturalezas', cls: 'no' }]
      : g <= 4 ? [{ t: '17 tipos', cls: '' }, { t: 'Habilidades y naturalezas', cls: 'hl' }, { t: g === 4 ? 'División física/especial por movimiento' : 'Físico/especial según el tipo', cls: g === 4 ? 'hl' : '' }]
      : g === 5 ? [{ t: '17 tipos', cls: '' }, { t: 'Habilidades ocultas', cls: 'hl' }, { t: 'Naturalezas', cls: '' }]
      : [{ t: '18 tipos (llega Hada)', cls: g === 6 ? 'hl' : '' }, { t: 'Habilidades ocultas', cls: '' }, { t: g >= 9 ? 'Teracristalización' : g === 8 ? 'Dinamax' : g === 7 ? 'Movimientos Z' : 'Megaevolución', cls: 'hl' }];
    const gb = {}; const setGen = {};
    for (let i = 1; i <= 9; i++) { gb['g' + i] = i === g ? 'on' : ''; setGen['g' + i] = () => this.setState({ g: i, ft: S.ft.filter((x) => x <= nTypes(i)), lim: 48 }); }
    const tchips = []; for (let i = 1; i <= nt; i++) {
      const isOn = S.ft.includes(i);
      tchips.push({ k: TK[i - 1], n: TN[i - 1], on: isOn ? 'on' : '', pr: isOn ? 'true' : 'false',
        pick: () => this.setState({ lim: 48, ft: isOn ? S.ft.filter((x) => x !== i) : (S.ft.length >= 2 ? [S.ft[1], i] : S.ft.concat(i)) }) });
    }
    const sortDef = [['num', 'Nº'], ['az', 'A–Z'], ['tot', 'Total'], ['spe', 'Velocidad']];
    const tabs = [['f', 'Ficha'], ['d', 'Dónde capturarlo'], ['m', 'Movimientos']];
    return {
      motionClass: on ? '' : 'still',
      gb, setGen, genR: GR[g - 1], rules,
      countTxt: GLIM[g - 1] + ' Pokémon',
      q: S.q, onQ: (e) => this.setState({ q: e.target.value, lim: 48 }),
      sorts: sortDef.map((s) => ({ n: s[1], on: S.sort === s[0] ? 'on' : '', pick: () => this.setState({ sort: s[0] }) })),
      onlyCls: S.only ? 'on' : '', onlyPr: S.only ? 'true' : 'false', togOnly: () => this.setState({ only: !S.only, lim: 48 }),
      tchips, hasT: S.ft.length > 0, clearT: () => this.setState({ ft: [] }),
      cards, empty: list.length === 0, more: list.length > S.lim, moreN: Math.min(48, list.length - S.lim), loadMore: () => this.setState({ lim: S.lim + 48 }),
      shownTxt: list.length + ' resultados', spriteTxt: useG1 ? 'Sprites originales de Rojo y Azul' : 'Sprites de los juegos de Nintendo DS',
      p, chartTxt: 'tabla de la ' + fmtGen[g],
      ptabs: tabs.map((x) => ({ n: x[1], on: S.tab === x[0] ? 'on' : '', pr: S.tab === x[0] ? 'true' : 'false', pick: () => this.setState({ tab: x[0] }) })),
      tabFicha: S.tab === 'f', tabDonde: S.tab === 'd', tabMov: S.tab === 'm',
      modal: S.modal, openM: () => this.setState({ modal: true, mtab: 'f' }), closeM: () => this.setState({ modal: false }),
      mtabs: [['f', 'Ficha'], ['d', 'Dónde capturarlo'], ['m', 'Movimientos']].map((x) => ({ n: x[1], on: S.mtab === x[0] ? 'on' : '', pick: () => this.setState({ mtab: x[0] }) })),
      mF: S.mtab === 'f', mD: S.mtab === 'd', mM: S.mtab === 'm', mG: S.mtab === 'g', megaOk: g >= 6, megaOld: g < 6,
      vers: [['r', 'Rojo', 'vr'], ['b', 'Azul', 'va'], ['y', 'Amarillo', 'vy']].map((v) => ({ n: v[1], cls: v[2], on: ver === v[0] ? 'on' : '', pick: () => this.setState({ ver: v[0] }) })),
    };
  },
  // Megaevolución como forma: al elegirla, la ficha entera pasa a la mega (imagen, tipos, estadísticas, debilidades y habilidad)
  renderVals() {
    const v = this.baseVals(); const S = this.state; const p = v.p;
    if (!p || !p.hasMega) return { ...v, forms: [] };
    const id = parseInt(p.num, 10);
    const fi = S.form && S.form.id === id ? S.form.i : -1;
    const forms = [{ n: 'Normal', i: -1 }].concat(p.megas.map((m, i) => ({ n: m.n, i }))).map((f) => ({ n: f.n, cls: f.i === fi ? 'on' : '', pressed: f.i === fi ? 'true' : 'false', pick: () => this.setState({ form: f.i < 0 ? null : { id, i: f.i } }) }));
    if (fi < 0 || !p.megas[fi]) return { ...v, forms };
    const m = p.megas[fi]; const g = S.g; const nt = nTypes(g);
    const ti = m.t.map((x) => TK.indexOf(x.k) + 1);
    const sv = m.st.map((x) => x.v);
    const groups = { 4: [], 2: [], 0.5: [], 0.25: [], 0: [] };
    for (let a = 1; a <= nt; a++) { const k = ti.reduce((x, dt) => x * eff(a, dt, g), 1); if (groups[k]) groups[k].push(a); }
    const wk = [[4, '×4', 'x4'], [2, '×2', 'x2'], [0.5, '×½', 'x05'], [0.25, '×¼', 'x025'], [0, '×0', 'x0']].filter((x) => groups[x[0]].length).map((x) => ({ m: x[1], cls: x[2], t: groups[x[0]].map(ty) }));
    const weak = [4, 2].flatMap((k) => groups[k].map((a) => ({ k: TK[a - 1], n: TN[a - 1], m: k === 4 ? '×4' : '×2' }))).slice(0, 7);
    const mp = { ...p, n: m.n, t: m.t, c: m.c1, c2: m.c2, artCls: 'mgs big', ap: m.bp, scrCls: 'is-mega', isMegaForm: true, stoneN: m.stone, stoneBp: m.sbp,
      st: SN.map((n, i) => ({ n, v: sv[i], w: Math.min(100, sv[i] / 180 * 100).toFixed(1) + '%', c: SC[i] })), tot: m.tot, stNote: 'Estadísticas de ' + m.n + '.',
      weak, wk, ab: [{ n: m.ab, k: 'Mega', cls: 'rec', rec: '★ Habilidad de la mega', d: 'La megaevolución cambia la habilidad por esta durante el combate.' }], recAb: m.ab, abWhy: 'Al megaevolucionar, el Pokémon pasa a tener siempre esta habilidad.',
      nat: natFor(sv).map((x) => ({ n: x[0], k: x[1] })) };
    return { ...v, p: mp, forms };
  },
  };
  return C;
}
