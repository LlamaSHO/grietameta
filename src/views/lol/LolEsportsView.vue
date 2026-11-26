<template>
  <!-- eSports de LoL (/lol/esports). Diseño: models/paginas/LolEsports.dc.html.
       Todo es de ejemplo y sale de datos/lol/esports.json (archivo del
       14 de noviembre de 2026). -->
  <div class="es lol-page">
    <main class="wrap es-main">
      <header class="season-title"><h1 class="disp">Temporada de eSports <em>2026</em></h1><small>Datos de ejemplo · Archivo del 14 de noviembre</small></header>

      <p v-if="feed.status === 'loading'" class="loading">Cargando el calendario…</p>
      <p v-else-if="feed.status === 'error'" class="loading">No se han podido cargar los datos de eSports. <button type="button" class="spoiler" @click="feed.reload()">Reintentar</button></p>

      <template v-else-if="data">
        <ol class="timeline" aria-label="Línea de la temporada">
          <li v-for="t in TIMELINE" :key="t[0] + t[1]" :class="{ current: t[2] }" :aria-current="t[2] ? 'step' : null">
            <b>{{ t[0] }}</b><small>{{ t[1] }}</small><em v-if="t[2]">Fase actual · Final</em>
          </li>
        </ol>

        <div class="section-line">
          <h2 id="featured-title" class="disp">Partido destacado</h2>
          <div class="league-picks" role="group" aria-label="Partido destacado por liga">
            <button v-for="l in leagues" :key="l.key" type="button" :aria-pressed="l.key === league" @click="changeLeague(l.key)">{{ l.title }}</button>
          </div>
        </div>

        <section class="hero" aria-labelledby="featured-title" :style="hero.colors">
          <div class="h-bg" aria-hidden="true"></div>
          <div class="hero-tools"><span class="lg-chip worlds">{{ hero.lg }}</span><span class="h-meta">{{ hero.stage }} · {{ hero.format }} · {{ hero.venue }}</span></div>
          <div class="h-grid">
            <div class="tm2 a"><span class="tb2 crest" :style="hero.a.style" aria-hidden="true">{{ hero.a.code }}</span><div><b class="disp">{{ hero.a.name }}</b><small>{{ hero.a.origin }}</small></div></div>
            <section class="h-corner h2hc" aria-label="Cara a cara">
              <h3 class="hc-title"><span>Cara a cara<small>{{ hero.h2h }}</small></span></h3>
              <ul><li v-for="h in hero.meetings" :key="h.label"><small>{{ h.label }}</small><span>{{ hero.a.code }} <b>{{ h.score }}</b> {{ hero.b.code }}</span></li></ul>
              <p v-if="hero.noMeetings">Todavía no se han enfrentado en la muestra. Abajo tienes sus últimos partidos.</p>
            </section>
            <section v-for="(side, i) in [hero.pa, hero.pb]" :key="side.code" class="h-corner" :class="i ? 'pb' : 'pa'" :aria-label="`${side.name}: ${side.title}`">
              <h3 class="hc-title"><i class="tb2 crest xs" :style="side.style" aria-hidden="true">{{ side.code }}</i><span>{{ side.name }}<small>{{ side.title }}</small></span></h3>
              <ul><li v-for="r in side.rows" :key="r.stage + r.opponent"><span><small>{{ r.stage }}</small>{{ r.opponent }}</span><b>{{ r.score }}</b></li></ul>
              <p v-if="side.empty">Sin partidos anteriores en la muestra.</p>
            </section>
            <div class="mid">
              <span class="when disp">{{ hero.date }}</span><span class="hr disp">{{ hero.time }} <small>hora peninsular</small></span>
              <template v-if="countdown">
                <strong class="match-kicker">Próximo partido</strong>
                <div class="cd" aria-label="Cuenta atrás"><span><b>{{ cd.d }}</b><small>días</small></span><span><b>{{ cd.h }}</b><small>horas</small></span><span><b>{{ cd.m }}</b><small>min</small></span></div>
              </template>
              <strong v-else class="now-score">{{ finalText }}</strong>
            </div>
            <div class="h-act">
              <a class="btn-gold" href="https://lolesports.com/es-ES/" target="_blank" rel="noopener noreferrer">LoL Esports ↗</a>
              <a class="btn-ln" :href="hero.twitch" target="_blank" rel="noopener noreferrer">Twitch ↗</a>
              <a class="btn-ln" :href="hero.youtube" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
              <button class="spoiler hero-spoiler" type="button" :aria-pressed="spoilers" @click="spoilers = !spoilers">{{ spoilerLabel }}</button>
            </div>
            <div class="tm2 b"><div><b class="disp">{{ hero.b.name }}</b><small>{{ hero.b.origin }}</small></div><span class="tb2 crest" :style="hero.b.style" aria-hidden="true">{{ hero.b.code }}</span></div>
          </div>
        </section>

        <!-- Split regional -->
        <section v-if="regional" class="split card" aria-labelledby="split-title">
          <header class="split-head">
            <div><small class="match-kicker">{{ league }} · {{ split.region }}</small><h2 id="split-title" class="disp">{{ split.title }}</h2></div>
            <div class="split-actions"><span class="stamp">Datos de ejemplo</span><button class="spoiler" type="button" :aria-pressed="spoilers" @click="spoilers = !spoilers">{{ spoilerLabel }}</button></div>
          </header>
          <div class="split-layout">
            <div class="phase-pane">
              <div class="phase-picks" role="group" aria-label="Fases del split">
                <button v-for="p in split.phases" :key="p" type="button" :aria-pressed="p === split.phase" @click="phase = p">{{ p }}</button>
              </div>
              <template v-if="split.regular">
                <h3 id="table-title" class="pane-title">Clasificación de la fase regular</h3>
                <div class="standings" role="table" aria-labelledby="table-title">
                  <div role="row"><span role="columnheader">Pos.</span><span role="columnheader">Equipo</span><span role="columnheader">Victorias</span><span role="columnheader">Derrotas</span></div>
                  <div v-for="t in split.standings" :key="t.code" role="row">
                    <span role="cell">{{ t.pos }}</span>
                    <span role="rowheader" class="table-team"><i class="tb2 crest xs" :style="t.style" aria-hidden="true">{{ t.code }}</i>{{ t.name }}</span>
                    <span role="cell">{{ t.w }}</span><span role="cell">{{ t.l }}</span>
                  </div>
                </div>
              </template>
              <template v-else>
                <h3 class="pane-title">{{ split.phaseTitle }}</h3>
                <div class="bracket">
                  <section v-for="r in split.rounds" :key="r.name" class="round">
                    <h4>{{ r.name }}</h4>
                    <div class="ties"><div v-for="tie in r.ties" :key="tie.a + tie.b" class="tie"><span>{{ tie.a }}<b>{{ tie.left }}</b></span><span>{{ tie.b }}<b>{{ tie.right }}</b></span></div></div>
                  </section>
                </div>
              </template>
              <p v-if="!spoilers" class="mask-note">Activa «Mostrar spoilers» para ver los resultados.</p>
            </div>
            <div class="squads">
              <h3 class="pane-title">Equipos del split</h3>
              <div class="team-picks" role="group" aria-label="Plantillas por equipo">
                <button v-for="t in split.clubs" :key="t.code" type="button" :aria-label="`Plantilla de ${t.name}`" :aria-expanded="club === t.code" aria-controls="split-roster" @click="club = club === t.code ? null : t.code"><i class="tb2 crest xs" :style="t.style" aria-hidden="true">{{ t.code }}</i>{{ t.name }}</button>
              </div>
              <div id="split-roster">
                <section v-if="split.roster" class="roster">
                  <header><h4>{{ split.roster.name }}</h4><small>Plantilla titular</small></header>
                  <ul>
                    <li v-for="p in split.roster.players" :key="p.nick">
                      <span class="role"><img :src="`/images/lol/posiciones/${p.icon}.png`" alt="" width="23" height="23">{{ p.role }}</span>
                      <span class="player"><b>{{ p.nick }}</b><small>{{ p.name }}</small></span>
                      <span class="country">{{ p.country }}</span>
                    </li>
                  </ul>
                  <p><span>Entrenador</span><b>{{ split.roster.coach }}</b></p>
                </section>
              </div>
            </div>
          </div>
        </section>

        <div class="egrid">
          <section id="calendario" class="card calendar" aria-labelledby="calendar-title">
            <header class="calendar-head">
              <div class="section-line"><h2 id="calendar-title" class="disp">Calendario por días</h2><span class="stamp">Hora peninsular española</span></div>
              <div class="calendar-tools">
                <label>Liga
                  <select aria-label="Liga" :value="league" @change="changeLeague($event.target.value)">
                    <option value="Todas">Todas las ligas</option>
                    <option v-for="k in Object.keys(data.regions)" :key="k">{{ k }}</option>
                  </select>
                </label>
                <label v-if="worlds">Jornadas
                  <select v-model="period" aria-label="Jornadas" @change="openId = null">
                    <option value="final">Eliminatorias</option>
                    <option value="swiss">Fase suiza</option>
                    <option value="next">Próximas jornadas</option>
                  </select>
                </label>
                <label v-else>Jornadas
                  <select v-model="period" aria-label="Jornadas de liga" @change="openId = null">
                    <option value="next">Apertura 2027</option>
                    <option value="split">Split 2026</option>
                  </select>
                </label>
                <button class="spoiler" type="button" :aria-pressed="spoilers" @click="spoilers = !spoilers">{{ spoilerLabel }}</button>
              </div>
            </header>
            <p v-if="!days.length" class="nomatch">No hay partidos en esta selección.</p>
            <section v-for="d in days" :key="d.day" class="day-group">
              <h3>{{ d.label }}</h3>
              <template v-for="m in d.matches" :key="m.id">
                <button :id="m.id + '-button'" class="fixture" type="button" :aria-expanded="m.open" :aria-controls="m.id" @click="openId = m.open ? null : m.id">
                  <time>{{ m.time }}</time>
                  <span class="duel">
                    <span class="side-team"><b>{{ m.a.name }}</b><i class="tb2 crest" :style="m.a.style" aria-hidden="true">{{ m.a.code }}</i></span>
                    <span class="result" :aria-label="m.status">{{ m.result }}</span>
                    <span class="side-team"><i class="tb2 crest" :style="m.b.style" aria-hidden="true">{{ m.b.code }}</i><b>{{ m.b.name }}</b></span>
                  </span>
                  <span class="event-info"><b>{{ m.lg }} · {{ m.stage }}</b>{{ m.format }}</span>
                  <span class="disclosure" aria-hidden="true"></span>
                </button>
                <div :id="m.id" class="match-panel">
                  <article v-if="m.open" class="match-sheet" :aria-labelledby="m.id + '-button'" :style="m.colors">
                    <div class="sheet-head"><span class="lg-chip">{{ m.lg }}</span><span>{{ m.stage }} · {{ m.format }} · {{ m.d.venue }}</span></div>
                    <div class="sheet-versus">
                      <div class="sheet-side"><i class="tb2 crest" :style="m.a.style" aria-hidden="true">{{ m.a.code }}</i><b>{{ m.a.name }}</b><small>{{ m.a.origin }}</small></div>
                      <div class="sheet-time"><span>{{ m.d.shortDate }}</span><strong>{{ m.time }}</strong><small>Hora peninsular</small><b>{{ m.d.detailStatus }}</b></div>
                      <div class="sheet-side"><i class="tb2 crest" :style="m.b.style" aria-hidden="true">{{ m.b.code }}</i><b>{{ m.b.name }}</b><small>{{ m.b.origin }}</small></div>
                    </div>
                    <h4 class="sheet-title">Recorrido en el torneo</h4>
                    <div class="paths">
                      <section v-for="path in m.d.paths" :key="path.code" class="path" :style="path.style">
                        <h5>{{ path.name }}</h5>
                        <ul><li v-for="r in path.rows" :key="r.stage + r.opponent"><span><small>{{ r.stage }}</small>{{ r.opponent }}</span><b>{{ r.score }}</b></li></ul>
                        <p v-if="path.empty">Sin partidos anteriores en la muestra.</p>
                      </section>
                    </div>
                    <div class="meetings">
                      <h4 class="sheet-title">Cara a cara <small>{{ m.d.h2h }}</small></h4>
                      <ul><li v-for="h in m.d.meetings" :key="h.label"><small>{{ h.label }}</small><span>{{ m.a.code }} <b>{{ h.score }}</b> {{ m.b.code }}</span></li></ul>
                      <p v-if="m.d.noMeetings">Sin cruces anteriores en la muestra.</p>
                    </div>
                    <div class="broadcast"><b>Dónde verlo</b><a href="https://lolesports.com/es-ES/" target="_blank" rel="noopener noreferrer">LoL Esports ↗</a><a :href="m.d.twitch" target="_blank" rel="noopener noreferrer">Twitch ↗</a><a :href="m.d.youtube" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div>
                  </article>
                </div>
              </template>
            </section>
          </section>

          <aside class="ecol">
            <section class="card">
              <header class="side-head"><h2 class="disp">Power Rankings</h2><span>Top 5 global</span></header>
              <ol class="ranking"><li v-for="(t, i) in ranking" :key="t.code"><span class="rank-pos">{{ i + 1 }}</span><i class="tb2 xs" :style="t.style" aria-hidden="true">{{ t.code }}</i><b>{{ t.name }}</b><small>{{ t.league }}</small></li></ol>
            </section>
            <section class="card">
              <header class="side-head"><h2 class="disp">Noticias</h2><span>Datos de ejemplo</span></header>
              <div class="news-list">
                <article v-for="n in news" :key="n.title"><small>{{ n.tag }}</small><h3>{{ n.title }}</h3><p>{{ n.body }}</p></article>
              </div>
              <p class="more-news"><RouterLink to="/lol/noticias">Ver todas las noticias →</RouterLink></p>
            </section>
          </aside>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useGameData } from "@/composables/useGameData";
import "@/components/lol/lol.css";

const feed = useGameData("/data/lol/esports.json");
const data = computed(() => (feed.status === "ready" ? feed.data : null));

const TIMELINE = [
  ["Split regional", "12 ene – 8 mar"],
  ["First Stand", "16 – 22 mar"],
  ["MSI", "28 jun – 12 jul"],
  ["Split regional", "Jul – oct"],
  ["Mundial", "15 oct – 14 nov", true],
];
const VENUES = { Mundial: "Nueva York", LEC: "Berlín", LCK: "Seúl", LPL: "Shanghái", LTA: "Los Ángeles", LCP: "Taipéi" };
const SOURCES = { LEC: ["lec", "LEC"], LCK: ["lck", "LCKglobal"], LPL: ["lpl", "LPL_English"] };
const RANKING = ["BLG", "GEN", "HLE", "T1", "IG"];

// --- estado ---
const league = ref("Todas");
const period = ref("final");
const spoilers = ref(false);
const openId = ref(null);
const phase = ref("Fase regular");
const club = ref(null);
const clock = ref(Date.now());
const worlds = computed(() => league.value === "Todas");
const regional = computed(() => !worlds.value);
const spoilerLabel = computed(() => (spoilers.value ? "Ocultar spoilers" : "Mostrar spoilers"));

function changeLeague(l) {
  league.value = l;
  period.value = l === "Todas" ? "final" : "next";
  phase.value = "Fase regular";
  club.value = null;
  openId.value = null;
}

// --- datos ---
const teams = computed(() => {
  const out = {};
  for (const [code, t] of Object.entries(data.value?.teams || {})) out[code] = { ...t, style: `--c1:${t.color};--c2:${t.shade}` };
  return out;
});
const games = computed(() => (data.value ? data.value.games : []).map((g) => ({ ...g, a: teams.value[g.a], b: teams.value[g.b] })));

const longDate = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" });
const shortDate = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Madrid" });

const leagues = computed(() => ["Todas", ...Object.keys(data.value.regions)].map((l) => ({ key: l, title: l === "Todas" ? "Mundial" : l })));

// --- lógica de partidos (port de renderVals del diseño) ---
const now = computed(() => clock.value);
const scoreText = (pair) => (spoilers.value ? pair.join(" – ") : "Oculto");
const oriented = (g, t) => (g.a === t ? g.score : [g.score[1], g.score[0]]);
const history = (m) => games.value.filter((g) => g.score && g.start < Math.min(now.value, m.start));
const priorMeetings = (m, prior) => prior.filter((g) => (m.a === g.a && m.b === g.b) || (m.a === g.b && m.b === g.a));
const status = (m) => {
  if (m.start > now.value) return "Próximo partido";
  if (!m.score) return "Pendiente de resultado";
  return spoilers.value ? "Finalizado · " + scoreText(m.score) : "Finalizado · Resultado oculto";
};
const h2h = (m, series) => {
  if (!series.length) return "Sin cruces previos";
  if (!spoilers.value) return "Balance oculto";
  const wins = series.filter((g) => {
    const [a, b] = oriented(g, m.a);
    return a > b;
  }).length;
  return `${m.a.code} ${wins} – ${series.length - wins} ${m.b.code}`;
};
const colors = (m) => `--left:${m.a.color};--right:${m.b.color}`;
const channels = (m) => {
  const [twitch, youtube] = SOURCES[m.lg] || ["riotgames", "lolesports"];
  return { twitch: "https://www.twitch.tv/" + twitch, youtube: "https://www.youtube.com/@" + youtube };
};
const detail = (m) => {
  const prior = history(m);
  const series = priorMeetings(m, prior);
  return {
    ...channels(m),
    detailStatus: status(m),
    shortDate: shortDate.format(m.start),
    venue: VENUES[m.lg],
    h2h: h2h(m, series),
    noMeetings: !series.length,
    paths: [m.a, m.b].map((t) => {
      const rows = prior
        .filter((g) => g.edition === m.edition && (g.a === t || g.b === t))
        .reverse()
        .map((g) => ({ stage: g.stage, opponent: (g.a === t ? g.b : g.a).name, score: scoreText(oriented(g, t)) }));
      return { ...t, rows, empty: !rows.length };
    }),
    meetings: series.slice(0, 4).map((g) => ({ label: shortDate.format(g.start) + " · " + g.lg, score: scoreText(oriented(g, m.a)) })),
  };
};

// Partido destacado de la liga elegida: el próximo, o el último jugado.
const match = computed(() => {
  const list = games.value.filter((m) => m.lg === (worlds.value ? "Mundial" : league.value));
  return list.filter((m) => m.start > now.value).at(-1) || list[0] || null;
});
const hero = computed(() => {
  const m = match.value;
  const d = detail(m);
  const prior = history(m);
  const side = (t, i) => {
    const p = d.paths[i];
    if (!p.empty) return { ...p, title: "Su camino hasta aquí" };
    const rows = prior
      .filter((g) => g.a === t || g.b === t)
      .sort((x, y) => y.start - x.start)
      .slice(0, 3)
      .map((g) => ({ stage: g.edition + " · " + g.stage, opponent: (g.a === t ? g.b : g.a).name, score: scoreText(oriented(g, t)) }));
    return { ...t, rows, empty: !rows.length, title: "Últimos partidos" };
  };
  return { ...m, ...d, colors: colors(m), date: longDate.format(m.start), pa: side(m.a, 0), pb: side(m.b, 1) };
});

// Cuenta atrás hasta el partido destacado (si todavía no se ha jugado).
const remaining = computed(() => (match.value ? Math.max(0, Math.ceil((match.value.start - now.value) / 60000)) : 0));
const countdown = computed(() => remaining.value > 0);
const cd = computed(() => ({
  d: Math.floor(remaining.value / 1440),
  h: String(Math.floor(remaining.value / 60) % 24).padStart(2, "0"),
  m: String(remaining.value % 60).padStart(2, "0"),
}));
const finalText = computed(() => status(match.value));
let tick = null;
watch(
  [remaining, () => match.value?.start],
  () => {
    clearTimeout(tick);
    if (remaining.value) tick = setTimeout(() => (clock.value = Date.now()), (match.value.start - now.value) % 60000 || 60000);
  },
  { immediate: true }
);
onBeforeUnmount(() => clearTimeout(tick));

// Calendario por días
const days = computed(() => {
  const matches = games.value
    .filter((m) => {
      if (period.value === "next") return m.stage === "Apertura" && (worlds.value || m.lg === league.value);
      if (!worlds.value) return m.edition === league.value + " 2026";
      return m.edition === "Mundial 2026" && (period.value === "swiss") === (m.stage === "Fase suiza");
    })
    .sort((a, b) => (period.value === "next" || a.day === b.day ? a.start - b.start : b.start - a.start));
  const groups = new Map();
  for (const m of matches) {
    if (!groups.has(m.day)) groups.set(m.day, { day: m.day, label: longDate.format(m.start), matches: [] });
    const open = openId.value === m.id;
    const played = m.score && m.start <= now.value;
    groups.get(m.day).matches.push({
      ...m,
      open,
      d: open ? detail(m) : null,
      colors: colors(m),
      result: played && spoilers.value ? scoreText(m.score) : played ? "• •" : "vs",
      status: status(m),
    });
  }
  return [...groups.values()];
});

// Split regional (clasificación, play-in/playoffs y plantillas)
const split = computed(() => {
  if (!regional.value) return null;
  const [title, ...codes] = data.value.splits[league.value];
  const ph = phase.value;
  const fixtures = games.value.filter((m) => m.edition === league.value + " 2026");
  const results = fixtures.filter((m) => m.stage === "Fase regular");
  const phases = ["Fase regular", ...(fixtures.some((m) => m.stage === "Play-in") ? ["Play-in"] : []), "Playoffs"];
  const clubs = codes.map((c) => teams.value[c]).sort((a, b) => a.name.localeCompare(b.name, "es"));
  const standings = clubs.map((t) => {
    const played = results.filter((m) => m.a === t || m.b === t);
    const wins = played.filter((m) => m.score[m.a === t ? 0 : 1] > m.score[m.a === t ? 1 : 0]).length;
    return { ...t, w: wins, l: played.length - wins };
  });
  if (spoilers.value) standings.sort((a, b) => b.w - a.w || a.l - b.l);
  const roundNames = ph === "Play-in" ? ["Play-in"] : ["Semifinal", "Final"];
  const rounds = roundNames
    .map((name) => ({
      name: name === "Semifinal" ? "Semifinales" : name,
      ties: fixtures
        .filter((m) => m.stage === name)
        .sort((a, b) => a.start - b.start)
        .map((m) => ({
          a: spoilers.value ? m.a.name : m.seeds[0],
          b: spoilers.value ? m.b.name : m.seeds[1],
          left: spoilers.value ? m.score[0] : "—",
          right: spoilers.value ? m.score[1] : "—",
        })),
    }))
    .filter((r) => r.ties.length);
  return {
    title,
    region: data.value.regions[league.value],
    phase: ph,
    phases,
    regular: ph === "Fase regular",
    phaseTitle: ph === "Play-in" ? "Acceso a playoffs" : "Cuadro de playoffs",
    rounds,
    clubs,
    standings: standings.map((t, i) => ({ ...t, pos: spoilers.value ? i + 1 : "—", w: spoilers.value ? t.w : "—", l: spoilers.value ? t.l : "—" })),
    roster: codes.includes(club.value) ? teams.value[club.value] : null,
  };
});

const ranking = computed(() => RANKING.map((c) => teams.value[c]));
const news = computed(() => {
  const showWinner = spoilers.value && now.value >= games.value.find((m) => m.edition === "Mundial 2026" && m.stage === "Final").start;
  return [
    {
      tag: "14 nov · Mundial",
      title: showWinner ? "BLG levanta la Copa del Invocador" : "La final llega a Nueva York",
      body: showWinner ? "Bilibili Gaming supera a Gen.G en el quinto mapa." : "El Barclays Center acoge el último duelo entre la LCK y la LPL.",
    },
    { tag: "13 nov · Análisis", title: "La pelea por el primer dragón", body: "Gen.G y BLG llegan a la final con dos formas de preparar la visión en el río." },
    { tag: "12 nov · Ligas regionales", title: "La próxima cita, en enero", body: "Consulta en el calendario las jornadas regionales de apertura de este ejemplo." },
  ];
});
</script>

<style scoped>
.card{border-radius:18px;background:#0d1017;border:1px solid #292e35;overflow:hidden}
.hero{position:relative;isolation:isolate;overflow:hidden;padding:22px 26px 24px;border-radius:24px;border:1px solid #635238;background:#0d1017}
.h-bg{position:absolute;inset:0;z-index:-1}.h-bg::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(115deg,#ffffff08 0 2px,transparent 2px 26px)}
.h-meta,.h-tz,.h2h{font-size:13px;color:#c6cbd2}.lg-chip{display:inline-flex;align-items:center;height:26px;padding:0 9px;border-radius:7px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:linear-gradient(90deg,#53472f,#234441);color:#f5e7c6}
.vs{display:grid;grid-template-columns:minmax(0,1fr) 280px minmax(0,1fr);align-items:center;gap:18px;margin-top:20px}
.tm2{display:flex;align-items:center;gap:15px}.tm2.b{text-align:right;justify-content:flex-end}.tm2 b{display:block;font-size:clamp(22px,2.3vw,34px);line-height:1.05}.tm2 small{display:block;margin-top:5px;color:#b4bcc6;font-size:13px}
.tb2{display:grid;place-items:center;flex:none;width:100px;height:108px;background:linear-gradient(145deg,var(--c1),var(--c2));color:#fff;font:800 28px/1 'Bricolage Grotesque',sans-serif;text-shadow:0 2px 8px #0009;box-shadow:inset 0 0 0 2px #ffffff25}
.tb2.xs{width:30px;height:32px;font-size:11px}.mid,.cd span{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px}.when{color:#f3e2bc;font-size:15px}.hr{font-weight:800;line-height:1.1}.hr small{font:500 13px 'IBM Plex Sans',sans-serif;color:#adb5be}
.cd{display:flex;gap:6px;margin:6px 0}.cd span{min-width:48px;padding:6px;border-radius:8px;background:#07090daa;border:1px solid #ffffff19}.cd b{font:700 24px/1 'Chakra Petch',sans-serif}.cd small{font-size:11px;color:#b7bfc8}
.h-act{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:20px;padding-top:16px;border-top:1px solid #ffffff1a}.h-act a{display:inline-flex;align-items:center;min-height:42px;border-radius:10px;padding:0 15px;font-weight:600;font-size:14px;text-decoration:none}.h-act .btn-gold{background:linear-gradient(#ebbf71,#ce9f52);color:#17120a}.h-act .btn-ln{color:#eee;border:1px solid #ffffff30}.h-tz{margin-left:auto}
.es-main{padding-bottom:40px}.es-main h1,.es-main h2,.es-main h3{margin:0}.season-title,.section-line,.hero-tools,.calendar-tools{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.season-title{padding:24px 0 14px}.season-title h1{font-size:clamp(26px,3.4vw,44px);letter-spacing:-.045em}.season-title small,.stamp,.calendar-tools label{color:#b5bdc7;font-size:12px}
.timeline{display:grid;grid-template-columns:repeat(5,1fr);list-style:none;padding:0;margin:0 0 24px;border:1px solid #31343a;border-radius:15px;overflow:hidden;background:#101319}
.timeline li{position:relative;display:grid;gap:5px;padding:12px 14px 15px;border-right:1px solid #282d34}.timeline li:last-child{border:0}.timeline b{font-size:15px}.timeline small{font-size:12px;color:#aeb5bf}.timeline .current{background:linear-gradient(105deg,#3b3020,#1b1c1c);box-shadow:inset 0 -3px #efc375}.timeline em{color:#f4cc85;font:600 11px 'IBM Plex Sans',sans-serif}
.section-line h2,.calendar-head h2{font-size:clamp(21px,2.3vw,29px);letter-spacing:-.035em}.es-main button,.es-main select{font-family:inherit;cursor:pointer;color-scheme:dark}
.league-picks{display:flex;flex-wrap:wrap;gap:5px}.league-picks button,.spoiler,.archive{min-height:38px;padding:5px 13px;border:1px solid #373c45;background:#13171e;color:#c6cbd3;border-radius:8px;font-weight:600}.league-picks button[aria-pressed=true],.spoiler[aria-pressed=true]{border-color:#ae8a4e;background:#2a251c;color:#f3c878}
.hero{margin-top:12px}.h-bg{background:radial-gradient(65% 140% at 0 50%,color-mix(in srgb,var(--left) 27%,transparent),transparent 62%),radial-gradient(65% 140% at 100% 50%,color-mix(in srgb,var(--right) 28%,transparent),transparent 62%),#101419}
.hero-tools{justify-content:flex-start}.hero-tools .archive{margin-left:auto}.hr{font-size:clamp(26px,3vw,40px)}.tb2{clip-path:polygon(0 0,100% 0,100% 69%,50% 100%,0 69%);border-radius:12px 12px 0 0;padding-bottom:10px}.tb2.xs{border-radius:5px;padding-bottom:3px}.now-score{font:700 21px 'Chakra Petch',sans-serif;color:#f3c878}.h2h b{margin-left:4px}
.egrid{grid-template-columns:minmax(0,1fr) minmax(250px, .43fr);margin-top:24px}.calendar-head,.side-head{padding:16px 18px}.calendar-head{border-bottom:1px solid #30343b}.calendar-tools{margin-top:12px;justify-content:flex-start}.calendar-tools label{display:flex;gap:6px;align-items:center}.calendar-tools select{background:#191d24;color:#edece7;border:1px solid #3b4049;border-radius:7px;padding:7px;min-height:38px}.calendar-tools .spoiler{margin-left:auto}
.day-group h3{padding:9px 18px;background:#191e25;color:#cfccbf;font:600 13px 'IBM Plex Sans',sans-serif}.fixture{display:grid;grid-template-columns:minmax(52px,.7fr) minmax(0,4fr) minmax(190px,1.4fr);gap:12px;align-items:center;min-height:62px;padding:10px 18px;border-top:1px solid #232730}.fixture time,.day-group h3,.ranking .rank-pos{font-variant-numeric:tabular-nums}.fixture time{font:600 16px 'Chakra Petch',sans-serif}.duel{display:grid;grid-template-columns:1fr 48px 1fr;align-items:center;gap:5px}.side-team{display:flex;align-items:center;min-width:0;gap:10px;font-size:15px;line-height:1.2}.side-team:first-child{justify-content:flex-end;text-align:right}
.side-team .crest{width:42px;height:44px;padding-bottom:7px;border-radius:7px 7px 0 0;font-size:12px;font-style:normal;background:linear-gradient(150deg,color-mix(in srgb,var(--c1) 70%,var(--c2)),var(--c2) 80%)}
.result{text-align:center;font:600 14px 'Chakra Petch',sans-serif;color:#ddcaa0}.event-info{text-align:right;font-size:12px;color:#b2b9c2}.event-info b{display:block;color:#e1e1db;font-size:13px}
.ranking{list-style:none;margin:0;padding:0 16px 10px;counter-reset:team}.ranking li{display:grid;grid-template-columns:18px 32px 1fr auto;align-items:center;gap:10px;padding:8px 0;border-top:1px solid #292e35}.rank-pos{color:#bca373}.ranking small{color:#a6aeb9}.side-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px}.side-head h2{font-size:21px}.side-head span{color:#a6aeb9;font-size:12px}
.news-list{padding:0 16px 8px}.news-list article{border-top:1px solid #292e35;padding:11px 0}.news-list small{color:#d6b67b;font-size:12px}.news-list h3{margin:3px 0;font-size:16px}.news-list p{margin:0;color:#b9bec7;font-size:13px}
@media(max-width:1050px){.vs{grid-template-columns:1fr 220px 1fr;gap:8px}.tm2,.tm2.b{flex-direction:column;text-align:center;justify-content:center;gap:9px}.tm2.b .tb2{order:-1}.tm2 b{font-size:24px}.tm2 .tb2{width:76px;height:76px;font-size:22px}.duel{grid-template-columns:minmax(0,1fr) 38px minmax(0,1fr)}}
@media(max-width:860px){.egrid{grid-template-columns:1fr}.ecol{display:grid;grid-template-columns:1fr 1fr;align-items:start}.es-main{padding-bottom:28px}.timeline li{padding-inline:10px}.hero .tm2 .tb2{padding-bottom:8px}.h-tz{margin-left:0}}
@media(max-width:580px){.season-title{padding-top:16px;gap:3px}.timeline{grid-template-columns:1fr;margin-bottom:20px}.timeline li{grid-template-columns:1fr auto;align-items:center;gap:4px;padding:6px 12px 6px 25px;border:0;border-bottom:1px solid #242931}.timeline li::before{content:"";position:absolute;left:12px;top:0;bottom:0;width:1px;background:#54504b}.timeline li::after{content:"";position:absolute;left:9px;width:7px;height:7px;top:calc(50% - 3px);background:#8b8271;border-radius:50%}.timeline .current{box-shadow:inset 3px 0 #f3c878}.timeline .current::after{background:#f3c878}.timeline .current em{grid-column:1/-1}.timeline b{font-size:13px}.section-line{gap:8px}.league-picks{display:grid;grid-template-columns:repeat(3,1fr);width:100%}.league-picks button{padding:4px;font-size:13px}
.hero{padding:14px;border-radius:16px}.hero-tools{gap:6px}.h-meta{font-size:12px}.hero-tools .archive{margin:0}.vs{grid-template-columns:1fr 1fr;grid-template-areas:"a b" "mid mid";gap:10px}.tm2.a{grid-area:a}.tm2.b{grid-area:b}.mid{grid-area:mid;border-top:1px solid #ffffff15;padding-top:10px}.tm2 b{font-size:20px}.tm2 small{font-size:11px}.h-act{gap:6px;margin-top:12px;padding-top:10px}.h-act a{padding-inline:10px;font-size:12px}.h-tz{flex-basis:100%}.calendar-head,.side-head{padding:13px}.calendar-tools{gap:6px}.calendar-tools label{display:grid;gap:2px}.calendar-tools .spoiler{margin:0;align-self:end}.ecol{grid-template-columns:1fr}.fixture{grid-template-columns:auto 1fr;grid-template-areas:"hour event" "duel duel";gap:8px;padding:10px 12px}.fixture time{grid-area:hour}.duel{grid-area:duel}.side-team{gap:6px;font-size:13px}.side-team .crest{width:36px;height:38px;font-size:11px}.event-info{grid-area:event}.event-info b{display:inline}.event-info b::after{content:" · "}.day-group h3{padding-inline:12px}.egrid{gap:14px}.ecol{gap:14px}}

.ranking .tb2{font-style:normal}

@media(min-width:861px){.event-info b{white-space:nowrap}}
.crest{background-position:center;background-size:cover;font-style:normal}
.hero-spoiler{margin-left:auto}
.split-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.fixture,.team-picks button,.phase-picks button{scroll-margin-block:135px 24px}
.bracket .round:only-child{grid-column:1/-1}
.match-kicker,.sheet-head,.round h4,.role{font-weight:700;font-size:12px;letter-spacing:.06em}
.match-kicker{color:#e4c68b;text-transform:uppercase}
.fixture{width:100%;background:transparent;color:inherit;font:inherit;text-align:left;border:0;border-top:1px solid #292d35;grid-template-columns:52px minmax(0,1fr) minmax(120px,auto) 14px}
.fixture:hover,.team-picks button:hover,.phase-picks button:hover{background-color:#1c2028}
.fixture[aria-expanded=true]{background:#29251e;box-shadow:inset 3px 0 #e6bf79}
.fixture:focus-visible{outline-offset:-3px}
.disclosure{width:8px;height:8px;border-right:2px solid #d7bd8b;border-bottom:2px solid #d7bd8b;transform:rotate(45deg);justify-self:center}
.fixture[aria-expanded=true] .disclosure{transform:rotate(225deg)}
.match-panel{overflow:hidden}
.match-sheet{margin:8px;padding:18px;border:1px solid #655539;border-radius:14px;background:radial-gradient(ellipse at 0 0,color-mix(in srgb,var(--left) 18%,transparent),transparent 48%),radial-gradient(ellipse at 100% 0,color-mix(in srgb,var(--right) 20%,transparent),transparent 50%),#12161c}
.sheet-head,.sheet-versus,.broadcast,.sheet-title,.path li,.meetings li,.split-head,.roster header,.roster p{display:flex;align-items:center;gap:10px}
.sheet-head{color:#c6cbd2;letter-spacing:0;font-weight:500;flex-wrap:wrap}
.sheet-versus{display:grid;grid-template-columns:minmax(0,1fr) minmax(110px,.85fr) minmax(0,1fr);align-items:start;padding:22px 0;text-align:center}
.sheet-side,.sheet-time{display:grid;justify-items:center;gap:3px}
.sheet-side .crest{width:clamp(54px,6vw,80px);height:clamp(62px,6.7vw,88px);font-size:clamp(18px,2.2vw,26px);margin-bottom:5px}
.sheet-side b,.pane-title,.sheet-title,.roster h4{font-family:'Bricolage Grotesque',sans-serif}
.sheet-side b{font-size:clamp(15px,1.5vw,21px);line-height:1.1}
.sheet-side small,.sheet-time small,.sheet-head,.sheet-title small,.path small,.meetings small,.country,.player small,.roster header small,.roster p span,.mask-note,.path p,.meetings p{color:#b5bdc7;font-size:12px}
.sheet-time{align-self:center;line-height:1.25}.sheet-time span{color:#efdbb2;font-size:13px}.sheet-time strong{font:700 clamp(24px,3vw,37px)/1 'Chakra Petch',sans-serif}.sheet-time b{margin-top:5px;font-size:12px;color:#f4cb83}
.sheet-title{justify-content:space-between;flex-wrap:wrap;margin:0 0 9px;font-size:16px}.sheet-title small{font-family:'IBM Plex Sans',sans-serif;font-weight:500}
.paths,.split-layout,.bracket{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.path,.tie,.roster{border:1px solid #343941;border-radius:10px;background:#101319}
.path{padding:10px 12px}.path h5{margin:0 0 4px;border-left:3px solid var(--c1);padding-left:7px;font-size:14px}
.match-sheet ul,.roster ul{padding:0;margin:0;list-style:none}
.path li,.meetings li{justify-content:space-between;border-top:1px solid #ffffff12;padding:6px 0;font-size:13px}
.path small,.player small{display:block}.path li b,.meetings li b,.tie b{font-family:'Chakra Petch',sans-serif;white-space:nowrap;color:#ebcc94}
.meetings{margin-top:16px}.meetings li b{margin:0 5px}.meetings li span{white-space:nowrap}
.path p,.meetings p{margin:6px 0}.broadcast{border-top:1px solid #ffffff20;margin-top:12px;padding-top:8px;flex-wrap:wrap;column-gap:16px;row-gap:0;font-size:13px}
.broadcast a{display:inline-flex;align-items:center;min-height:40px;text-underline-offset:4px}
.split{margin-top:24px}.split-head{justify-content:space-between;flex-wrap:wrap;padding:16px 20px;border-bottom:1px solid #31353d;background:linear-gradient(110deg,#24221e,#12161d 62%)}
.split-head h2{font-size:clamp(21px,2vw,28px);letter-spacing:-.035em}.split-layout{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:0}
.phase-pane,.squads{min-width:0;padding:18px 20px}.squads{border-left:1px solid #2b2f37}
.phase-picks,.team-picks{display:flex;flex-wrap:wrap;gap:6px}.phase-picks{margin-bottom:16px}
.phase-picks button,.team-picks button{color:#d5d9df;min-height:44px;border:1px solid #373c45;border-radius:8px;background:#151920;font-size:13px;font-weight:600}
.phase-picks button{padding:4px 12px}.phase-picks button[aria-pressed=true],.team-picks button[aria-expanded=true]{color:#f2ce90;border-color:#977948;background:#28241d}
.es-main .pane-title{font-size:17px;margin:0 0 12px}
.standings [role=row]{display:grid;grid-template-columns:36px minmax(0,1fr) repeat(2,68px);min-height:42px;align-items:center;border-bottom:1px solid #272d35;font-size:14px}
.standings [role=columnheader]{color:#b8c0ca;font-size:12px}.standings [role=row]>:nth-last-child(-n+2){text-align:center}.table-team,.team-picks button{display:flex;align-items:center;gap:8px}
.table-team{font-weight:600}.team-picks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.team-picks button{padding:6px 10px;text-align:left;line-height:1.2}
.mask-note{margin:12px 0 0}.round{min-width:0}.round h4{color:#d8c49d;margin:0 0 8px}.ties{display:grid;gap:12px}
.bracket{align-items:stretch;gap:16px}.round{display:flex;flex-direction:column}.round .ties{flex:1;align-content:center;position:relative}
.round+.round .ties::before{content:"";position:absolute;right:100%;top:50%;width:16px;border-top:1px solid #76623e}
.tie{padding:4px 10px}.tie span{display:flex;justify-content:space-between;gap:6px;align-items:center;padding:5px 0;font-size:13px}.tie span+span{border-top:1px solid #30353d}
.roster{margin-top:12px;padding:12px}.roster header,.roster p{justify-content:space-between}.roster h4,.roster p{margin:0}.roster li{display:grid;grid-template-columns:80px minmax(0,1fr) auto;align-items:center;gap:8px;padding:7px 0;border-top:1px solid #292e35}.roster ul{margin:7px 0}
.role{display:flex;align-items:center;gap:5px;color:#dcc18d;letter-spacing:0}.role img{width:23px;height:23px;object-fit:contain}.player b{font-size:14px}.country{text-align:right}.roster p{border-top:1px solid #30353d;padding-top:8px;font-size:13px}
@media(max-width:860px){.split-layout{grid-template-columns:1fr 1fr}.phase-pane,.squads{padding:14px}.standings [role=row]{grid-template-columns:30px minmax(0,1fr) repeat(2,49px)}.team-picks button{padding-inline:7px}.fixture{grid-template-columns:48px minmax(0,1fr) auto 12px}}
@media(max-width:680px){.split-layout{grid-template-columns:1fr}.squads{border-left:0;border-top:1px solid #2b2f37}}
@media(max-width:580px){.fixture{grid-template-columns:auto minmax(0,1fr) 14px;grid-template-areas:"hour event toggle" "duel duel duel"}.disclosure{grid-area:toggle}.match-sheet{margin:5px;padding:12px}.sheet-versus{grid-template-columns:minmax(0,1fr) 94px minmax(0,1fr);gap:4px;padding:16px 0}.sheet-side small{font-size:11px}.paths{gap:7px}.path{padding:8px}.path li{align-items:flex-start;flex-direction:column;gap:1px}.hero-spoiler{margin-left:0}.sheet-title{gap:4px}.split-head{padding:13px}.broadcast{column-gap:12px}.standings [role=row]{grid-template-columns:29px minmax(0,1fr) repeat(2,51px)}}

/* === Partido destacado grande, con esquinas === */
.hero{padding:26px 30px 28px}
.h-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px 28px;align-items:start}
.h-top{margin-top:18px}
.h-bottom{align-items:end;margin-top:22px;padding-top:18px;border-top:1px solid #ffffff1a}
.h-bottom .h-act{margin:0;padding:0;border:0}
.h-corner{width:min(100%,380px);padding:12px 14px 10px;border-radius:14px;background:#07090dB3;border:1px solid #ffffff17}
.h-corner.tl{border-color:color-mix(in srgb,var(--left) 45%,#ffffff17)}
.h-corner.br{justify-self:end;border-color:color-mix(in srgb,var(--right) 45%,#ffffff17)}
.h-corner.tr{justify-self:end}
.hc-title{display:flex;align-items:center;gap:10px;margin:0 0 4px;font:700 15px 'Bricolage Grotesque',sans-serif}
.hc-title small{display:block;font:500 11.5px 'IBM Plex Sans',sans-serif;color:#b4bcc6;letter-spacing:.02em}
.h-corner ul{margin:0;padding:0;list-style:none}
.h-corner li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px solid #ffffff12;font-size:13px}
.h-corner li small{display:block;font-size:11px;color:#9aa3ae}
.h-corner li b{font-family:'Chakra Petch',sans-serif;white-space:nowrap;color:#ebcc94}
.h-corner li span{min-width:0}
.h-corner p{margin:6px 0 2px;font-size:12.5px;color:#b4bcc6}
.hero .vs{margin-top:26px}
.hero .tm2 .tb2{width:122px;height:132px;font-size:34px}
.hero .tm2 b{font-size:clamp(26px,2.7vw,40px)}
@media(max-width:1050px){.hero .tm2 .tb2{width:88px;height:92px;font-size:25px}}
@media(max-width:760px){.h-row{grid-template-columns:minmax(0,1fr)}.h-corner,.h-corner.tr,.h-corner.br{width:100%;justify-self:stretch}.h-bottom .h-corner{order:-1}}
@media(max-width:580px){.hero{padding:14px}.hero .tm2 .tb2{width:66px;height:70px;font-size:19px}}

/* === Destacado en cuadrícula: equipos en esquinas opuestas, recorridos a los lados de la hora === */
.h-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,360px) minmax(0,1fr);grid-template-areas:"ta h2h ." "pa mid pb" "act act tb";gap:22px 30px;align-items:center;margin-top:18px}
.h-grid .tm2.a{grid-area:ta;align-self:start}
.h-grid .tm2.b{grid-area:tb;justify-self:end;align-self:end}
.h-grid .h2hc{grid-area:h2h;justify-self:stretch;width:100%;align-self:start}
.h-grid .pa{grid-area:pa;justify-self:start}
.h-grid .pb{grid-area:pb;justify-self:end}
.h-grid .mid{grid-area:mid}
.h-grid .h-act{grid-area:act;align-self:end;margin:0;padding:0;border:0}
.h-grid .h-corner{width:min(100%,380px)}
.h-grid .h2hc{width:100%}
@media(max-width:1050px){.h-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:"ta tb" "h2h h2h" "mid mid" "pa pb" "act act"}.h-grid .tm2.a,.h-grid .tm2.b{justify-self:center;align-self:center}.h-grid .pa,.h-grid .pb{justify-self:stretch;width:100%}}
@media(max-width:640px){.h-grid{grid-template-areas:"ta tb" "h2h h2h" "mid mid" "pa pa" "pb pb" "act act";gap:14px}}


/* propuesta Claude: marcador simétrico */
.hero{padding:24px 28px 26px}
.h-grid{grid-template-columns:minmax(0,1fr) minmax(280px,380px) minmax(0,1fr);grid-template-areas:"ta mid tb" "pa h2h pb" "act act act";gap:20px 28px;align-items:stretch;margin-top:20px}
.h-grid .tm2.a{grid-area:ta;align-self:center;justify-self:start}
.h-grid .tm2.b{grid-area:tb;align-self:center;justify-self:end}
.h-grid .mid{grid-area:mid;align-self:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:18px 12px;border-radius:16px;background:#07090d99;border:1px solid #ffffff17;text-align:center}
.h-grid .mid::before{content:"VS";display:block;margin-bottom:6px;font:800 13px/1 'Chakra Petch',sans-serif;letter-spacing:.3em;color:#ffffff66}
.h-grid .h-corner,.h-grid .pa,.h-grid .pb,.h-grid .h2hc{width:100%;justify-self:stretch;align-self:stretch}
.h-grid .pa{grid-area:pa;border-color:color-mix(in srgb,var(--left) 45%,#ffffff17)}
.h-grid .pb{grid-area:pb;border-color:color-mix(in srgb,var(--right) 45%,#ffffff17)}
.h-grid .h2hc{grid-area:h2h}
.h-grid .h-act{grid-area:act;display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:4px 0 0;padding-top:18px;border-top:1px solid #ffffff1a}
.h-grid .h-act .hero-spoiler{margin-left:0}
.hero .tm2 .tb2{width:104px;height:112px;font-size:30px}
@media(max-width:1050px){.h-grid{grid-template-columns:minmax(0,1fr) minmax(220px,300px) minmax(0,1fr)}.hero .tm2 .tb2{width:76px;height:82px;font-size:22px}}
@media(max-width:860px){
  .h-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:"ta tb" "mid mid" "pa pb" "h2h h2h" "act act"}
  .h-grid .tm2.a,.h-grid .tm2.b{justify-self:center}
}
@media(max-width:640px){.h-grid{grid-template-areas:"ta tb" "mid mid" "pa pa" "pb pb" "h2h h2h" "act act";gap:14px}}


.egrid { display: grid; gap: 20px; align-items: start; }
.ecol { display: flex; flex-direction: column; gap: 16px; }
.es { color: var(--ink); font-variant-numeric: tabular-nums; }
.es-main button, .es-main select { font-family: inherit; cursor: pointer; color-scheme: dark; }
.es-main :focus-visible { outline: 2px solid #f3c878; outline-offset: 2px; }
.es-main a { color: #E2B566; }
.es-main a.btn-gold, .es-main a.btn-gold:hover { color: #17120A; }
.btn-gold { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 0 16px; border-radius: 10px; border: 0; background: linear-gradient(180deg, #E0AE58, #C8913A); font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35); }
.loading { padding: 28px 0; color: var(--ink-mute); }
.nomatch { margin: 0; padding: 22px 18px; color: #b5bdc7; font-size: 14px; }
.more-news { margin: 0; padding: 0 16px 14px; font-size: 13px; }
.more-news a { font-weight: 600; text-decoration: none; }
.es-main .card { overflow: hidden; }
.es-main h1, .es-main h2, .es-main h3 { margin: 0; }

</style>
