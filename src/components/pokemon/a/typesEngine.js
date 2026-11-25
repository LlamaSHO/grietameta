/* Lógica de «Tabla de tipos» portada del diseño (models/paginas/PokemonTipos.dc.html):
   las tablas viven en public/data/pokemon/ y llegan por parámetro; el estado
   es el reactive de la vista. renderVals() devuelve lo que pinta la plantilla. */

export function createTypesEngine(DATA, st) {
  const { EFF, DM, QUIRKS } = DATA;
  const EPAST = [[4,7,200,1],[7,4,200,1],[8,14,0,1],[15,10,100,1],[8,9,50,5],[17,9,50,5]];
  const PT = {"35":[[5,[1]]],"36":[[5,[1]]],"39":[[5,[1]]],"40":[[5,[1]]],"81":[[1,[13]]],"82":[[1,[13]]],"122":[[5,[14]]],"173":[[5,[1]]],"174":[[5,[1]]],"175":[[5,[1]]],"176":[[5,[1,3]]],"183":[[5,[11]]],"184":[[5,[11]]],"209":[[5,[1]]],"210":[[5,[1]]],"280":[[5,[14]]],"281":[[5,[14]]],"282":[[5,[14]]],"298":[[5,[1]]],"303":[[5,[9]]],"439":[[5,[14]]],"468":[[5,[1,3]]],"546":[[5,[12]]],"547":[[5,[12]]]};
  const TK = ["normal","fighting","flying","poison","ground","rock","bug","ghost","steel","fire","water","grass","electric","psychic","ice","dragon","dark","fairy"];
  const TN = ["Normal","Lucha","Volador","Veneno","Tierra","Roca","Bicho","Fantasma","Acero","Fuego","Agua","Planta","Eléctrico","Psíquico","Hielo","Dragón","Siniestro","Hada"];
  const TC = ["#A8A77A","#D3425F","#8FA8DD","#B567CE","#D97845","#C5B78C","#91C12F","#5269AD","#5A8EA2","#FF9D55","#4D90D5","#63BC5A","#F4D23C","#FA7179","#73CEC0","#0B6DC3","#5A5465","#EC8FE6"];
  const sp = (id) => { const i = id - 1; return ((i % 32) / 31 * 100).toFixed(3) + '% ' + (Math.floor(i / 32) / 32 * 100).toFixed(3) + '%'; };
  const SETS = [{ g: 1, n: 'Gen I', d: '15 tipos · Rojo y Azul', c: '#E3350D', c2: '#FFB703', nt: 15 }, { g: 5, n: 'Gen II a V', d: '17 tipos · Oro a Blanco 2', c: '#4C6CC9', c2: '#6A35A6', nt: 17 }, { g: 9, n: 'Gen VI en adelante', d: '18 tipos · X a Escarlata', c: '#DB2777', c2: '#7C3AED', nt: 18 }];
  const eff = (a, d, g) => { let f = EFF[a - 1][d - 1]; EPAST.forEach((r) => { if (r[0] === a && r[1] === d && r[3] >= g) f = r[2]; }); return f / 100; };
  const changed = (a, d, g) => g < 9 && eff(a, d, g) !== eff(a, d, 9);
  const typesFor = (m, g) => { const pt = PT[m[0]]; if (pt) { const c = pt.filter((x) => x[0] >= g).sort((a, b) => a[0] - b[0])[0]; if (c) return c[1]; } return m[3]; };
  const ty = (i) => ({ k: TK[i - 1], n: TN[i - 1] });
  const fmt = (m) => m === 4 ? '×4' : m === 2 ? '×2' : m === 1 ? '×1' : m === 0.5 ? '×½' : m === 0.25 ? '×¼' : '×0';
  const cls = (m) => m === 4 ? 'x4' : m === 2 ? 'x2' : m === 1 ? 'x1' : m === 0.5 ? 'x05' : m === 0.25 ? 'x025' : 'x0';
  const LBL = { 4: 'Muy débil', 2: 'Débil', 1: 'Normal', 0.5: 'Resiste', 0.25: 'Resiste mucho', 0: 'Inmune' };

  const C = {
    state: st,
    props: { animaciones: true },
    setState(o) { Object.assign(st, o); },

  renderVals() {
    const S = this.state; const st = SETS[S.set]; const g = st.g; const nt = st.nt;
    const on = this.props.animaciones ?? true;
    const T = []; for (let i = 1; i <= nt; i++) T.push(i);
    const dt = S.dt.filter((x) => x <= nt);
    const cols = T.map((d) => ({ k: TK[d - 1], n: TN[d - 1], hl: S.hc === d ? 'hl' : '', sel: S.mode === 'def' && dt.includes(d) ? 'sel' : '',
      pick: () => this.setState({ mode: 'def', who: 0, dt: dt.includes(d) ? dt.filter((x) => x !== d) : (dt.length >= 2 ? [dt[1], d] : dt.concat(d)) }) }));
    const rows = T.map((a) => ({ k: TK[a - 1], n: TN[a - 1], hl: S.hr === a ? 'hl' : '', pick: () => this.setState({ mode: 'atk', at: a }),
      c: T.map((d) => { const m = eff(a, d, g); const c = m === 2 ? 'x2' : m === 0.5 ? 'x5' : m === 0 ? 'x0' : 'x1';
        return { v: m === 2 ? '2' : m === 0.5 ? '½' : m === 0 ? '0' : '', cls: c + (S.hr === a || S.hc === d ? ' hl' : '') + (S.hr === a && S.hc === d ? ' hv' : '') + (changed(a, d, g) ? ' chg' : ''),
          hov: () => this.setState({ hr: a, hc: d }) }; }) }));
    let hoverTxt = 'Pasa el ratón por la tabla';
    if (S.hr && S.hc && S.hr <= nt && S.hc <= nt) { const m = eff(S.hr, S.hc, g); hoverTxt = TN[S.hr - 1] + ' contra ' + TN[S.hc - 1] + ': ' + fmt(m); }
    let groups = []; let sumTxt = '';
    if (S.mode === 'def') {
      const by = {};
      T.forEach((a) => { const m = dt.reduce((x, d) => x * eff(a, d, g), 1); (by[m] = by[m] || []).push(a); });
      groups = [4, 2, 0.5, 0.25, 0].filter((m) => by[m]).map((m) => ({ m: fmt(m), cls: cls(m), lbl: LBL[m], t: by[m].map(ty) }));
      const w = (by[4] || []).length + (by[2] || []).length, r = (by[0.5] || []).length + (by[0.25] || []).length, z = (by[0] || []).length;
      const pl = (n, a, b) => n + ' ' + (n === 1 ? a : b);
      sumTxt = dt.length ? pl(w, 'debilidad', 'debilidades') + ' · ' + pl(r, 'resistencia', 'resistencias') + ' · ' + pl(z, 'inmunidad', 'inmunidades') : 'Elige un tipo o un Pokémon';
    } else {
      const by = {};
      T.forEach((d) => { const m = eff(S.at, d, g); (by[m] = by[m] || []).push(d); });
      groups = [2, 0.5, 0].filter((m) => by[m]).map((m) => ({ m: fmt(m), cls: cls(m), lbl: m === 2 ? 'Súper eficaz contra' : m === 0.5 ? 'Poco eficaz contra' : 'No afecta a', t: by[m].map(ty) }));
      sumTxt = 'Ataques de tipo ' + TN[S.at - 1] + ': súper eficaz contra ' + ((by[2] || []).length) + ' tipos';
    }
    const picks = T.map((i) => { const isOn = S.mode === 'def' ? dt.includes(i) : S.at === i;
      return { k: TK[i - 1], n: TN[i - 1], on: isOn ? 'on' : '', pr: isOn ? 'true' : 'false',
        pick: () => S.mode === 'def' ? this.setState({ who: 0, dt: isOn ? dt.filter((x) => x !== i) : (dt.length >= 2 ? [dt[1], i] : dt.concat(i)) }) : this.setState({ at: i }) }; });
    const q = S.q.trim().toLowerCase();
    const lim = [151, 251, 386, 493, 649, 721, 809, 905, 1025][g - 1];
    const sug = q.length >= 2 ? DM.filter((m) => m[0] <= lim && m[1].toLowerCase().startsWith(q)).slice(0, 5).map((m) => ({ n: m[1], bp: sp(m[0]),
      pick: () => this.setState({ who: m[0], dt: typesFor(m, g).slice(), q: '' }) })) : [];
    const whoM = S.who ? DM[S.who - 1] : null;
    // combos
    const combos = [];
    for (let a = 1; a <= nt; a++) for (let b = a + 1; b <= nt; b++) {
      let res = 0, imm = 0, weak = 0;
      T.forEach((x) => { const m = eff(x, a, g) * eff(x, b, g); if (m === 0) imm++; else if (m < 1) res++; else if (m > 1) weak++; });
      const mon = DM.find((m) => m[0] <= lim && (() => { const t = typesFor(m, g); return t.length === 2 && t.includes(a) && t.includes(b); })());
      if (mon) combos.push({ a, b, res, imm, weak, score: res + imm * 1.5 - weak * 1.6, mon });
    }
    combos.sort((x, y) => y.score - x.score);
    return {
      motionClass: on ? '' : 'still',
      n: nt, setName: st.n,
      sets: SETS.map((s, i) => ({ n: s.n, d: s.d, c: s.c, c2: s.c2, on: i === S.set ? 'on' : '', pr: i === S.set ? 'true' : 'false', pick: () => this.setState({ set: i }) })),
      cols, rows, hoverTxt,
      modes: [['def', 'Defensa'], ['atk', 'Ataque']].map((m) => ({ n: m[1], on: S.mode === m[0] ? 'on' : '', pick: () => this.setState({ mode: m[0] }) })),
      isDef: S.mode === 'def', isAtk: S.mode === 'atk',
      dts: dt.map(ty), d1c: TC[(dt[0] || 1) - 1], d2c: TC[(dt[1] || dt[0] || 1) - 1],
      whoName: whoM ? whoM[1] : (dt.length ? dt.map((x) => TN[x - 1]).join(' / ') : 'Sin tipo'), whoBp: sp(whoM ? whoM[0] : 132),
      q: S.q, onQ: (e) => this.setState({ q: e.target.value }), sug, hasSug: sug.length > 0,
      picks, groups, sumTxt,
      quirks: QUIRKS[g].map((x) => ({ a: TK[x.a - 1], an: TN[x.a - 1], d: TK[x.d - 1], dn: TN[x.d - 1], op: x.op, c: x.c, t: x.t, p: x.p })),
      combos: combos.slice(0, 6).map((c, i) => ({ r: '#' + (i + 1), a: TK[c.a - 1], an: TN[c.a - 1], b: TK[c.b - 1], bn: TN[c.b - 1], c1: TC[c.a - 1], c2: TC[c.b - 1],
        res: c.res, imm: c.imm, weak: c.weak, mon: c.mon[1], bp: sp(c.mon[0]) })),
    };
  },
  };
  return C;
}
