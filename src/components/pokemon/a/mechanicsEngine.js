/* Lógica de «Mecánicas» portada del diseño (models/paginas/PokemonMecanicas.dc.html):
   las tablas viven en public/data/pokemon/ y llegan por parámetro; el estado
   es el reactive de la vista. renderVals() devuelve lo que pinta la plantilla. */

export function createMechanicsEngine(DATA, st) {
  const { MEG, STONES, OBJ_MS, OBJ_ZE, OBJ_GX, MEGI, ZM, ZX, GMX, OBJ_ZT, OBJ_TE } = DATA;
  const mgp = (pid) => { const k = Math.max(0, MEGI.indexOf(pid)); return ((k % 10) / 9 * 100).toFixed(3) + '% ' + (Math.floor(k / 10) / 9 * 100).toFixed(3) + '%'; };
  const TK = ["normal","fighting","flying","poison","ground","rock","bug","ghost","steel","fire","water","grass","electric","psychic","ice","dragon","dark","fairy"];
  const TN = ["Normal","Lucha","Volador","Veneno","Tierra","Roca","Bicho","Fantasma","Acero","Fuego","Agua","Planta","Eléctrico","Psíquico","Hielo","Dragón","Siniestro","Hada"];
  const TC = ["#A8A77A","#D3425F","#8FA8DD","#B567CE","#D97845","#C5B78C","#91C12F","#5269AD","#5A8EA2","#FF9D55","#4D90D5","#63BC5A","#F4D23C","#FA7179","#73CEC0","#0B6DC3","#5A5465","#EC8FE6"];
  const sp = (id) => { const i = id - 1; return ((i % 32) / 31 * 100).toFixed(3) + '% ' + (Math.floor(i / 32) / 32 * 100).toFixed(3) + '%'; };
  const OBJ_KEY = {"mega": [145, "Megapulsera"], "z": [141, "Pulsera Z"], "dmax": [143, "Maximuñequera"], "maxi": [147, "Maxiseta"], "tera": [144, "Orbe Teracristal"]};
  const obp = (i) => ((i % 16) / 15 * 100).toFixed(3) + '% ' + (Math.floor(i / 16) / 10 * 100).toFixed(3) + '%';
  const gxp = (i) => ((i % 6) / 5 * 100).toFixed(3) + '% ' + (Math.floor(i / 6) / 5 * 100).toFixed(3) + '%';

  const C = {
    state: st,
    props: { animaciones: true },
    setState(o) { Object.assign(st, o); },

  renderVals() {
    const S = this.state || {};
    const motion = this.props.animaciones ?? true;
    const mf = S.mf || 'all';
    const all = [];
    Object.keys(MEG).forEach((k) => MEG[k].forEach((m) => all.push(m)));
    all.sort((a, b) => a[0] - b[0]);
    const tc = (k) => TC[TK.indexOf(k)];
    const base = (n) => n.replace(/^Mega /, '');
    const megas = all.filter((m) => mf === 'all' || (mf === 'new' ? m[0] >= 10100 : m[0] < 10100)).map((m) => ({
      n: m[1], bp: mgp(m[0]), t: m[2].map((k) => ({ k, n: TN[TK.indexOf(k)] })), c1: tc(m[2][0]), c2: tc(m[2][1] || m[2][0]),
      ab: m[4] || '—', tot: m[3].reduce((a, b) => a + b, 0), isNew: m[0] >= 10100, stone: OBJ_MS[m[0]] ? OBJ_MS[m[0]][1] : 'Sin piedra: Ascenso del Dragón', sbp: obp(OBJ_MS[m[0]] ? OBJ_MS[m[0]][0] : OBJ_KEY.mega[0]) }));
    const mfil = [['all', 'Todas'], ['old', 'X, Y, ROZA, Sol y Luna'], ['new', 'Nuevas']].map((f) => ({ n: f[1], pr: mf === f[0] ? 'true' : 'false', pick: () => this.setState({ mf: f[0] }) }));
    return { motionClass: motion ? '' : 'still', megas, mfil, megaCount: all.length,
      zmoves: ZM.map((z) => ({ k: z[0], n: TN[TK.indexOf(z[0])], m: z[1], bp: obp(OBJ_ZT[z[0]][0]), c: OBJ_ZT[z[0]][1] })),
      zx: ZX.map((z) => { const e = OBJ_ZE[z[0]] || OBJ_ZT.normal; return { bp: sp(z[0]), n: z[1], m: z[2], cbp: obp(e[0]), c: e[1] }; }),
      gmax: Object.keys(OBJ_GX).map(Number).sort((a, b) => a - b).flatMap((k) => OBJ_GX[k].map((x) => ({ bp: gxp(x[0]), n: x[1] }))), gmaxCount: GMX.length,
      key_mega: obp(OBJ_KEY.mega[0]), key_z: obp(OBJ_KEY.z[0]), key_dmax: obp(OBJ_KEY.dmax[0]), key_tera: obp(OBJ_KEY.tera[0]),
      tera: TK.map((k, i) => ({ k, n: TN[i], cls: '', bp: obp(OBJ_TE[k][0]), sbp: obp(OBJ_TE[k][1]), sh: OBJ_TE[k][2], hasSh: true })).concat([{ k: 'normal', n: 'Astral', cls: 'stellar', bp: obp(OBJ_TE.stellar[0]), hasSh: false }]) };
  },
  };
  return C;
}
