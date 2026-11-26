/* Lógica de «Habilidades, movimientos y naturalezas» portada del diseño (models/paginas/PokemonHabilidades.dc.html):
   las tablas viven en datos/pokemon/ y llegan por parámetro; el estado
   es el reactive de la vista. renderVals() devuelve lo que pinta la plantilla. */

export function createAbilitiesEngine(DATA, st) {
  const { AB2, MV, NAT, DM, FEAT } = DATA;
  const NUSE = {"Firme":"Atacantes físicos","Alegre":"Atacantes físicos rápidos","Modesta":"Atacantes especiales","Miedosa":"Atacantes especiales rápidos","Osada":"Muros físicos especiales","Agitada":"Muros físicos que pegan","Serena":"Muros especiales","Cauta":"Muros especiales físicos","Audaz":"Espacio Raro físico","Mansa":"Espacio Raro especial","Plácida":"Muros lentos","Grosera":"Espacio Raro defensivo"};
  const TK = ["normal","fighting","flying","poison","ground","rock","bug","ghost","steel","fire","water","grass","electric","psychic","ice","dragon","dark","fairy"];
  const TN = ["Normal","Lucha","Volador","Veneno","Tierra","Roca","Bicho","Fantasma","Acero","Fuego","Agua","Planta","Eléctrico","Psíquico","Hielo","Dragón","Siniestro","Hada"];
  const TC = ["#A8A77A","#D3425F","#8FA8DD","#B567CE","#D97845","#C5B78C","#91C12F","#5269AD","#5A8EA2","#FF9D55","#4D90D5","#63BC5A","#F4D23C","#FA7179","#73CEC0","#0B6DC3","#5A5465","#EC8FE6"];
  const SL = ['Ataque', 'Defensa', 'At. Esp.', 'Def. Esp.', 'Velocidad'];
  const SLS = ['Atq', 'Def', 'AtE', 'DfE', 'Vel'];
  const SC = ['#FF7A59', '#FFCB3D', '#5B8CFF', '#62D2E8', '#FF5AA5'];
  const sp = (id) => { const i = id - 1; return ((i % 32) / 31 * 100).toFixed(3) + '% ' + (Math.floor(i / 32) / 32 * 100).toFixed(3) + '%'; };
  const VT = { g: 'Buena', b: 'Mala', s: 'Situacional', n: 'Normal' };
  const GR = ['I','II','III','IV','V','VI','VII','VIII','IX'];
  const BY = {}; DM.forEach((d) => { BY[d[0]] = d; });
  const N = (inc, dec) => NAT.find((n) => n[2] === inc && n[3] === dec);
  const rec = (s) => {
    const [hp, at, df, sa, sd, spe] = s; const phys = at >= sa; const main = phys ? 2 : 4, off = phys ? 4 : 2;
    let best, worst;
    if (Math.max(at, sa) < 70 && hp + df + sd > 260) {
      const dmain = df >= sd ? 3 : 5;
      best = [[N(dmain, 2), 'Aguanta más y no usa el Ataque'], [N(dmain === 3 ? 5 : 3, 2), 'Reparte la defensa']];
      worst = [[N(2, dmain), 'Baja la defensa que mejor tiene'], [N(6, dmain), 'Sacrifica aguante por Velocidad']];
    } else if (spe < 50) {
      best = [[N(main, 6), 'Ideal bajo Espacio Raro'], [N(main, off), 'Más daño sin perder nada']];
      worst = [[N(6, main), 'Sube una Velocidad que no aprovecha'], [N(off, main), 'Baja su estadística de ataque']];
    } else {
      best = spe >= 80 ? [[N(6, off), 'Supera en Velocidad a más rivales'], [N(main, off), 'Golpea más fuerte']] : [[N(main, off), 'Golpea más fuerte'], [N(6, off), 'Por si necesitas superar a alguien']];
      worst = [[N(off, main), 'Baja su estadística de ataque principal'], [N(main === 2 ? 4 : 2, 6), 'Sube la que no usa y baja Velocidad']];
    }
    const fmt = (x) => ({ n: x[0][1], k: '+' + SLS[x[0][2] - 2] + ' −' + SLS[x[0][3] - 2], why: x[1], inc: x[0][2], dec: x[0][3] });
    return { best: best.map(fmt), worst: worst.map(fmt) };
  };

  const C = {
    state: st,
    props: { animaciones: true },
    setState(o) { Object.assign(st, o); },

  renderVals() {
    const S = this.state; const on = this.props.animaciones ?? true;
    const q = S.q.trim().toLowerCase();
    // ---- habilidades ----
    const CH = {}; AB2.chips.forEach((c) => { CH[c[0]] = c[1]; });
    const ORDK = TK.concat(['']);
    const typeName = (k) => (k ? TN[TK.indexOf(k)] : 'General');
    let al = AB2.list.filter((a) => (S.at === null || a[4] === S.at) && (!S.ac || a[5].includes(S.ac)) && (!q || a[1].toLowerCase().includes(q) || a[3].toLowerCase().includes(q)));
    al = al.slice().sort((x, y) => (ORDK.indexOf(x[4]) - ORDK.indexOf(y[4])) || x[1].localeCompare(y[1], 'es'));
    const shown = al.slice(0, S.lim); const groups = [];
    shown.forEach((a) => { let g = groups[groups.length - 1]; if (!g || g.k !== a[4]) { g = { k: a[4], items: [] }; groups.push(g); } g.items.push(a); });
    const tot = {}; al.forEach((a) => { tot[a[4]] = (tot[a[4]] || 0) + 1; });
    const cntT = {}; AB2.list.forEach((a) => { cntT[a[4]] = (cntT[a[4]] || 0) + 1; });
    const groupsV = groups.map((g) => ({ n: typeName(g.k), c: tot[g.k] + (tot[g.k] === 1 ? ' habilidad' : ' habilidades'), cls: g.k ? 'ty t-' + g.k : 'ty gen', ic: g.k ? '' : 'dot',
      items: g.items.map((a) => ({ n: a[1], g: GR[a[2] - 1], t: a[3] || 'Descripción pendiente.', c: a[4] ? TC[TK.indexOf(a[4])] : '#8E97A5', ch: a[5].map((k) => ({ k, n: CH[k] })) })) }));
    // ---- movimientos ----
    const CATN = ['Físico', 'Especial', 'Estado'];
    const MCH = [['up', 'Sube stats', (c) => c.includes('Sube stats')], ['down', 'Baja stats', (c) => c.includes('Baja stats')], ['st', 'Estados', (c) => c.some((x) => ['Parálisis', 'Sueño', 'Congelación', 'Quemadura', 'Veneno', 'Confusión'].includes(x))],
      ['pri', 'Prioridad', (c) => c.some((x) => x.startsWith('Prioridad'))], ['heal', 'Cura', (c) => c.includes('Cura')], ['multi', 'Varios golpes', (c) => c.includes('Varios golpes')], ['crit', 'Crítico alto', (c) => c.includes('Crítico alto')], ['fl', 'Amedrenta', (c) => c.includes('Amedrenta')]];
    const mq = S.mq.trim().toLowerCase(); const mf = MCH.find((x) => x[0] === S.mch);
    let ml = MV.filter((m) => (!S.mt || m[2] === S.mt) && (S.mc < 0 || m[3] === S.mc) && (!mf || mf[2](m[8])) && (!mq || m[1].toLowerCase().includes(mq)));
    ml = ml.slice().sort((x, y) => (S.ms === 'p' ? (y[4] - x[4]) : S.ms === 'a' ? ((y[5] || 101) - (x[5] || 101)) : 0) || x[1].localeCompare(y[1], 'es'));
    const mvs = ml.slice(0, S.mlim).map((m) => ({ n: m[1], d: m[9], k: m[2], tn: TN[TK.indexOf(m[2])], c: m[3], cn: CATN[m[3]], p: m[4] || '—', a: m[5] ? m[5] + '%' : '—', pp: m[6] || '—', ch: m[8] }));
    const [inc, dec] = S.nat; const nn = N(inc, dec);
    const POP = ['Firme', 'Alegre', 'Modesta', 'Miedosa', 'Osada', 'Cauta', 'Audaz', 'Mansa', 'Agitada', 'Serena'];
    const rows = [0, 1, 2, 3, 4].map((r) => ({ n: SL[r], c: SC[r], cells: [0, 1, 2, 3, 4].map((c) => { const x = N(r + 2, c + 2);
      return { n: x[1], c: SC[r], cls: (r === c ? 'neu ' : '') + (inc === r + 2 && dec === c + 2 ? 'on ' : '') + (POP.includes(x[1]) ? 'pop' : ''), pick: () => this.setState({ nat: [r + 2, c + 2] }) }; }) }));
    // mejores usuarios de la naturaleza
    const fits = DM.filter((d) => { const r = rec(d[4]); return r.best[0].inc === inc && r.best[0].dec === dec; }).sort((a, b) => b[4].reduce((x, y) => x + y) - a[4].reduce((x, y) => x + y)).slice(0, 6);
    const nd = { n: nn[1], c: inc === dec ? '#8E97A5' : SC[inc - 2], up: inc === dec ? 'Nada' : SL[inc - 2] + ' +10 %', dn: inc === dec ? 'Nada' : SL[dec - 2] + ' −10 %',
      use: inc === dec ? 'Naturaleza neutra: no cambia ninguna estadística. Nunca es la mejor opción.' : (NUSE[nn[1]] ? 'Típica de: ' + NUSE[nn[1]].toLowerCase() + '.' : 'Poco habitual en competitivo: suele haber una opción mejor.'),
      mons: fits.map((d) => ({ n: d[1], bp: sp(d[0]), pick: () => this.setState({ rec: d[0] }) })) };
    const m = BY[S.rec]; const r = rec(m[4]);
    const SN = ['PS'].concat(SL); const SCC = ['#7CF3B0'].concat(SC);
    const rc = { n: m[1], bp: sp(m[0]), t: m[3].map((i) => ({ k: TK[i - 1], n: TN[i - 1] })), c1: TC[m[3][0] - 1], c2: TC[(m[3][1] || m[3][0]) - 1],
      st: m[4].map((v, i) => ({ n: SN[i], v, w: Math.min(100, v / 160 * 100).toFixed(1) + '%', c: SCC[i], cls: i > 0 && r.best[0].inc === i + 1 ? 'up' : i > 0 && r.best[0].dec === i + 1 ? 'dn' : '' })),
      best: r.best, worst: r.worst };
    const rq = S.rq.trim().toLowerCase();
    const rs = rq.length >= 2 ? DM.filter((d) => d[1].toLowerCase().startsWith(rq)).slice(0, 5).map((d) => ({ n: d[1], bp: sp(d[0]), pick: () => this.setState({ rec: d[0], rq: '' }) })) : [];
    return {
      motionClass: on ? '' : 'still',
      tabs: [['ab', 'Habilidades', AB2.list.length + ' · por tipo'], ['mv', 'Movimientos', MV.length + ' · con su tipo'], ['nat', 'Naturalezas', '25 · y recomendador']].map((t) => ({ n: t[1], s: t[2], on: S.tab === t[0] ? 'on' : '', pr: S.tab === t[0] ? 'true' : 'false', pick: () => this.setState({ tab: t[0] }) })),
      tabAb: S.tab === 'ab', tabMv: S.tab === 'mv', tabNat: S.tab === 'nat',
      q: S.q, onQ: (e) => this.setState({ q: e.target.value, lim: 36 }), abShown: al.length + (al.length === 1 ? ' habilidad' : ' habilidades'),
      gOn: S.at === '' ? 'on' : '', gCnt: cntT[''] || 0, pickGen: () => this.setState({ at: S.at === '' ? null : '', lim: 36 }),
      abTypes: TK.filter((k) => cntT[k]).map((k) => ({ k, n: TN[TK.indexOf(k)], c: cntT[k], on: S.at === k ? 'on' : '', pick: () => this.setState({ at: S.at === k ? null : k, lim: 36 }) })),
      abChips: AB2.chips.map((c) => ({ k: c[0], n: c[1], on: S.ac === c[0] ? 'on' : '', pick: () => this.setState({ ac: S.ac === c[0] ? null : c[0], lim: 36 }) })),
      groups: groupsV, abEmpty: !al.length, more: al.length > S.lim, loadMore: () => this.setState({ lim: S.lim + 36 }),
      mq: S.mq, onMq: (e) => this.setState({ mq: e.target.value, mlim: 50 }),
      cats: [[-1, 'Todas'], [0, 'Físico'], [1, 'Especial'], [2, 'Estado']].map((c) => ({ n: c[1], on: S.mc === c[0] ? 'on' : '', pick: () => this.setState({ mc: c[0], mlim: 50 }) })),
      msorts: [['n', 'A-Z'], ['p', 'Potencia'], ['a', 'Precisión']].map((c) => ({ n: c[1], on: S.ms === c[0] ? 'on' : '', pick: () => this.setState({ ms: c[0] }) })),
      mvTypes: TK.map((k) => ({ k, n: TN[TK.indexOf(k)], on: S.mt === k ? 'on' : '', pick: () => this.setState({ mt: S.mt === k ? null : k, mlim: 50 }) })),
      mvChips: MCH.map((c) => ({ n: c[1], on: S.mch === c[0] ? 'on' : '', pick: () => this.setState({ mch: S.mch === c[0] ? null : c[0], mlim: 50 }) })),
      mvs, mvShown: 'Mostrando ' + mvs.length + ' de ' + ml.length + ' movimientos', mvMore: ml.length > S.mlim, mvLoad: () => this.setState({ mlim: S.mlim + 50 }),
      rows, nd, rc, rq: S.rq, onRq: (e) => this.setState({ rq: e.target.value }), rs, hasRs: rs.length > 0,
    };
  },
  };
  return C;
}
