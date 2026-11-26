/* Lógica de «Pokémon · Guía (portada)» portada del diseño (models/paginas/Pokemon.dc.html):
   las tablas viven en datos/pokemon/ y llegan por parámetro; el estado
   es el reactive de la vista. renderVals() devuelve lo que pinta la plantilla. */

export function createHomeEngine(DATA, st) {
  const { META } = DATA;
  const TN = {"normal": "Normal", "fighting": "Lucha", "flying": "Volador", "poison": "Veneno", "ground": "Tierra", "rock": "Roca", "bug": "Bicho", "ghost": "Fantasma", "steel": "Acero", "fire": "Fuego", "water": "Agua", "grass": "Planta", "electric": "Eléctrico", "psychic": "Psíquico", "ice": "Hielo", "dragon": "Dragón", "dark": "Siniestro", "fairy": "Hada"};
  const TC = {"normal": "#A8A77A", "fighting": "#D3425F", "flying": "#8FA8DD", "poison": "#B567CE", "ground": "#D97845", "rock": "#C5B78C", "bug": "#91C12F", "ghost": "#5269AD", "steel": "#5A8EA2", "fire": "#FF9D55", "water": "#4D90D5", "grass": "#63BC5A", "electric": "#F4D23C", "psychic": "#FA7179", "ice": "#73CEC0", "dragon": "#0B6DC3", "dark": "#5A5465", "fairy": "#EC8FE6"};
  const sp = (id) => { const i = id - 1; return ((i % 32) / 31 * 100).toFixed(3) + '% ' + (Math.floor(i / 32) / 32 * 100).toFixed(3) + '%'; };
  const ap = (k) => ((k % 15) / 14 * 100).toFixed(3) + '% ' + (Math.floor(k / 15) / 14 * 100).toFixed(3) + '%';
  const ty = (k) => ({ k, n: TN[k] });

  const C = {
    state: st,
    props: { animaciones: true },
    setState(o) { Object.assign(st, o); },

  renderVals() {
    const S = this.state;
    const on = this.props.animaciones ?? true;
    const now = Date.now();
    const day = 86400000;
    const regA = Date.UTC(2026, 8, 9, 2), regB = Date.UTC(2026, 11, 2, 2);
    const rows = META.slice(S.page * 10, S.page * 10 + 10).map((m, j) => {
      const i = S.page * 10 + j;
      return { r: m.r, n: m.n, mp: m.mp, bp: sp(m.id), t: m.t.map(ty), u: String(m.u).replace('.', ',') + ' %', w: (m.u / 50 * 100).toFixed(1) + '%',
        c: TC[m.t[0]], on: i === S.sel ? 'on' : '', pick: () => this.setState({ sel: i }) };
    });
    const m = META[S.sel];
    const sel = { r: m.r, n: m.n, ap: ap(m.a), t: m.t.map(ty), u: String(m.u).replace('.', ',') + ' %', deg: (m.u * 3.6).toFixed(1) + 'deg',
      i: m.i, w: m.w, c: TC[m.t[0]], c2: TC[m.t[1] || m.t[0]], m: m.m.map((x) => ({ n: x[0], k: x[1] })) };
    return {
      motionClass: on ? '' : 'still',
      rows, sel,
      t1: S.page === 0 ? 'on' : '', t2: S.page === 1 ? 'on' : '', s1: S.page === 0 ? 'true' : 'false', s2: S.page === 1 ? 'true' : 'false',
      setP0: () => this.setState({ page: 0, sel: 0 }), setP1: () => this.setState({ page: 1, sel: 10 }),
      daysReg: Math.max(0, Math.ceil((regB - now) / day)),
      regPct: Math.min(100, Math.max(0, (now - regA) / (regB - regA) * 100)).toFixed(1) + '%',
      daysCd: Math.max(0, Math.ceil((Date.UTC(2026, 10, 30, 14) - now) / day)),
      top5: META.slice(0, 5).map((x) => ({ mp: x.mp, bp: sp(x.id), w: (x.u / 50 * 100).toFixed(1) + '%', c: TC[x.t[0]] })),
    };
  },
  };
  return C;
}
