<template>
  <!-- Noticias de LoL (/lol/noticias). Diseño: models/paginas/LolNoticias.dc.html.
       Datos de ejemplo en datos/lol/noticias.json. -->
  <div class="news lol-page">
    <LolPageHead crumb="Noticias" lede="Mercado de fichajes, rumores, cambios de formato y lo que cuenta Riot sobre el juego, en un solo sitio.">
      <template #title>Noticias de <em>League of Legends</em></template>
      <template #scope><span class="criterion">Fuentes: {{ data?.fuentes || "Sheep Esports y la sección «Desarrollo» de Riot" }} · Datos de ejemplo</span></template>
    </LolPageHead>

    <div class="wrap news-wrap">
      <p v-if="feed.status === 'loading'" class="loading">Cargando noticias…</p>
      <p v-else-if="feed.status === 'error'" class="loading err">No se han podido cargar las noticias. <button type="button" class="retry" @click="feed.reload()">Reintentar</button></p>

      <template v-else-if="data">
        <div class="news-main">
          <div class="cats" role="group" aria-label="Tipo de noticia">
            <button v-for="c in CATS" :key="c.key" type="button" :aria-pressed="cat === c.key" @click="cat = c.key">{{ c.label }}</button>
          </div>
          <div class="lgs" role="group" aria-label="Liga">
            <button v-for="l in LEAGUES" :key="l" type="button" :aria-pressed="lg === l" @click="lg = l">{{ l === "Todas" ? "Todas las ligas" : l }}</button>
          </div>

          <section v-if="cat === 'todo' || cat === 'mercado'" class="nsec" aria-labelledby="mkt-h">
            <div class="nsec-h"><h2 id="mkt-h">Mercado y rumores</h2><span>{{ mktCount }} <span class="tag-demo">Datos de ejemplo</span></span></div>
            <p v-if="!mkt.length" class="empty">No hay movimientos de ejemplo para esta liga.</p>
            <table v-else class="mkt">
              <thead><tr><th>Jugador</th><th>Movimiento</th><th>Estado</th><th>Fecha</th></tr></thead>
              <tbody>
                <tr v-for="m in mkt" :key="m.nick">
                  <td class="pl"><span class="pos">{{ m.pos }}</span><b>{{ m.nick }}</b><small>{{ m.liga }}</small></td>
                  <td class="mvc">
                    <span class="mv">
                      <span class="tm"><i :style="team(m.de).style" aria-hidden="true">{{ team(m.de).code }}</i>{{ team(m.de).name }}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      <span class="tm"><i :style="team(m.a).style" aria-hidden="true">{{ team(m.a).code }}</i>{{ team(m.a).name }}</span>
                    </span>
                  </td>
                  <td><span class="st" :class="m.estado">{{ data.estados[m.estado] }}<span class="conf" :aria-label="`Fiabilidad ${m.fiabilidad} de 3`"><i v-for="n in 3" :key="n" :class="{ on: m.fiabilidad >= n }"></i></span></span></td>
                  <td class="src">{{ m.fecha }}<br>{{ m.fuente }}</td>
                </tr>
              </tbody>
            </table>
            <p class="note">«Oficial»: anunciado por el club. «Acuerdo»: varias fuentes lo dan por cerrado. «Rumor»: una sola fuente; las barras indican lo fiable que es.</p>
          </section>

          <section v-if="cat === 'todo' || cat === 'esports'" class="nsec" aria-labelledby="esp-h">
            <div class="nsec-h"><h2 id="esp-h">Esports</h2><span>Resúmenes con enlace a la fuente <span class="tag-demo">Datos de ejemplo</span></span></div>
            <div class="ncards">
              <a v-for="a in esp" :key="a.titulo" class="nc" :href="a.url" target="_blank" rel="noopener noreferrer">
                <span class="thumb">Imagen de la noticia</span>
                <span class="meta"><span class="lg">{{ a.liga }}</span>{{ a.tipo }} · {{ a.fecha }} · {{ a.fuente }}</span>
                <b>{{ a.titulo }}</b><p>{{ a.resumen }}</p>
              </a>
            </div>
          </section>

          <section v-if="cat === 'todo' || cat === 'dev'" class="nsec" aria-labelledby="dev-h">
            <div class="nsec-h"><h2 id="dev-h">Desarrollo de Riot</h2><span>Notas y vídeos de los desarrolladores <span class="tag-demo">Datos de ejemplo</span></span></div>
            <div class="devl">
              <a v-for="d in data.desarrollo" :key="d.titulo" class="dv" href="https://www.leagueoflegends.com/es-es/news/dev/" target="_blank" rel="noopener noreferrer">
                <span class="thumb" aria-hidden="true">{{ d.icono }}</span>
                <span><span class="k">Desarrollo · {{ d.fecha }}</span><b>{{ d.titulo }}</b><small>{{ d.resumen }}</small></span>
                <span class="ty">{{ d.tipo }}</span>
              </a>
            </div>
          </section>
        </div>

        <aside class="side" aria-label="Más información">
          <section class="nsec">
            <h3>Formato de la temporada 2027</h3>
            <ul class="fmt">
              <li v-for="f in data.formato2027" :key="f[0]"><b>{{ f[0] }}</b>{{ f[1] }}</li>
            </ul>
            <p class="note">Resumen de ejemplo: cuando se conecte la fuente, aquí saldrán los cambios de formato confirmados.</p>
          </section>
          <section class="nsec">
            <h3>Fuentes</h3>
            <ul class="srcs">
              <li><a href="https://www.sheepesports.com" target="_blank" rel="noopener noreferrer">Sheep Esports</a>: fichajes, rumores, entrevistas y formatos.</li>
              <li><a href="https://www.leagueoflegends.com/es-es/news/dev/" target="_blank" rel="noopener noreferrer">Riot Games · Desarrollo</a>: notas y vídeos de los desarrolladores.</li>
              <li><a href="https://lolesports.com/es-ES/" target="_blank" rel="noopener noreferrer">LoL Esports</a>: calendario y resultados oficiales.</li>
            </ul>
            <p class="note">Solo se muestra el titular y un resumen propio, siempre con enlace a la fuente original.</p>
          </section>
        </aside>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useGameData } from "@/composables/useGameData";
import LolPageHead from "@/components/lol/LolPageHead.vue";
import "@/components/lol/lol.css";

const feed = useGameData("/data/lol/noticias.json");
const data = computed(() => (feed.status === "ready" ? feed.data : null));

const CATS = [
  { key: "todo", label: "Todo" },
  { key: "mercado", label: "Mercado y rumores" },
  { key: "esports", label: "Esports" },
  { key: "dev", label: "Desarrollo de Riot" },
];
const LEAGUES = ["Todas", "LEC", "LCK", "LPL", "LTA"];
const cat = ref("todo");
const lg = ref("Todas");

const team = (code) => {
  const t = data.value.equipos[code];
  return { code: code === "SIN" ? "—" : code, name: t[0], style: { "--c1": t[1], "--c2": t[2] } };
};
const mkt = computed(() => (data.value?.mercado || []).filter((m) => lg.value === "Todas" || m.liga === lg.value));
const esp = computed(() => (data.value?.esports || []).filter((e) => lg.value === "Todas" || e.liga === lg.value));
const mktCount = computed(() => `${mkt.value.length} ${mkt.value.length === 1 ? "movimiento" : "movimientos"}`);
</script>

<style scoped>
.news { --raised: #141922; --line: #282D35; --muted: #A3ACBA; --gold: #F3C878; color: var(--ink); font-variant-numeric: tabular-nums; }
.news-wrap { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 22px; align-items: start; padding-block: 22px 56px; }
.news-main { min-width: 0; }
.cats { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 6px; }
.cats button, .lgs button { min-height: 40px; padding: 6px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--panel); color: #cfd3da; font: 600 13.5px var(--font-body); cursor: pointer; }
.cats button[aria-pressed="true"] { border-color: var(--gold); color: #120d04; background: var(--gold); }
.lgs { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 18px; }
.lgs button { min-height: 34px; padding: 4px 12px; font-size: 12.5px; }
.lgs button[aria-pressed="true"] { border-color: #5fc4b8; color: #bff3ea; background: rgba(95, 196, 184, 0.12); }
.nsec { background: #0D1017; border: 1px solid var(--line); border-radius: 18px; padding: 18px 20px; margin-bottom: 18px; }
.nsec-h { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.nsec-h h2 { margin: 0; font: 700 24px var(--font-display); }
.nsec-h > span { color: var(--muted); font-size: 12.5px; }
.tag-demo { display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 999px; border: 1px dashed rgba(243, 200, 120, 0.6); color: var(--gold); font-size: 11px; font-weight: 600; margin-left: 6px; }
.mkt { width: 100%; border-collapse: collapse; font-size: 14px; }
.mkt th { text-align: left; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 600; padding: 0 10px 8px; }
.mkt td { padding: 10px; border-top: 1px solid var(--line); vertical-align: middle; }
.mkt tbody tr:hover td { background: rgba(255, 255, 255, 0.025); }
.pl b { display: inline; }
.pl small { display: block; color: var(--muted); }
.pos { display: inline-flex; align-items: center; justify-content: center; min-width: 44px; height: 22px; border-radius: 6px; background: var(--raised); color: #d9dde4; font-size: 11px; font-weight: 700; letter-spacing: 0.04em; margin-right: 8px; }
.mv { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.tm { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
.tm i { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; font-style: normal; font-size: 11px; font-weight: 800; color: #fff; background: linear-gradient(160deg, var(--c1), var(--c2)); }
.mv svg { color: var(--muted); }
.st { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.st.of { background: rgba(117, 221, 169, 0.14); color: #8ff0bd; }
.st.ac { background: rgba(243, 200, 120, 0.14); color: var(--gold); }
.st.ru { background: rgba(158, 140, 255, 0.14); color: #c8bdff; }
.conf { display: inline-flex; gap: 2px; margin-left: 4px; }
.conf i { width: 6px; height: 10px; border-radius: 2px; background: #3a4150; }
.conf i.on { background: currentColor; }
.src { color: var(--muted); font-size: 12.5px; }
.ncards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.nc { display: flex; flex-direction: column; gap: 6px; padding: 14px; border-radius: 14px; background: var(--raised); border: 1px solid var(--line); color: inherit; text-decoration: none; transition: transform 0.2s ease, border-color 0.2s ease; }
.lol-page .nc:hover { transform: translateY(-3px); border-color: var(--gold); color: inherit; }
.nc .meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 12px; color: var(--muted); }
.nc .lg { padding: 2px 8px; border-radius: 6px; background: #1d2530; color: #bff3ea; font-weight: 700; font-size: 11px; }
.nc b { font: 700 17px/1.3 var(--font-display); }
.nc p { margin: 0; color: #c9ccd2; font-size: 13.5px; }
.nc .thumb { height: 120px; border-radius: 10px; background: linear-gradient(135deg, rgba(243, 200, 120, 0.18), rgba(95, 196, 184, 0.12)), repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 0 10px, transparent 10px 20px); display: grid; place-items: center; color: var(--muted); font-size: 12px; border: 1px dashed var(--line); }
.devl { display: grid; gap: 10px; }
.dv { display: grid; grid-template-columns: 120px minmax(0, 1fr) auto; gap: 14px; align-items: center; padding: 10px; border-radius: 14px; background: var(--raised); border: 1px solid var(--line); color: inherit; text-decoration: none; }
.lol-page .dv:hover { border-color: var(--gold); color: inherit; }
.dv .thumb { height: 68px; border-radius: 10px; display: grid; place-items: center; background: linear-gradient(135deg, #1b2230, #2a1f12); color: var(--gold); border: 1px dashed var(--line); }
.dv .k { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--gold); }
.dv b { display: block; font-size: 15px; }
.dv small { color: var(--muted); }
.dv .ty { font-size: 12px; color: var(--muted); white-space: nowrap; }
.side .nsec h3 { margin: 0 0 10px; font: 700 18px var(--font-display); }
.fmt { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.fmt li { padding: 10px 12px; border-radius: 12px; background: var(--raised); border: 1px solid var(--line); font-size: 13.5px; }
.fmt li b { display: block; color: var(--gold); font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; }
.srcs { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; font-size: 13.5px; }
.srcs a { color: var(--gold); }
.note { color: var(--muted); font-size: 12.5px; margin: 10px 0 0; }
.empty { padding: 16px; border: 1px dashed var(--line); border-radius: 12px; color: var(--muted); }
.loading { grid-column: 1 / -1; padding: 28px 0; color: var(--ink-mute); }
.retry { margin-left: 8px; height: 34px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--raised); color: var(--ink); cursor: pointer; font: inherit; }

@media (max-width: 1000px) { .news-wrap { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 700px) {
  .ncards { grid-template-columns: minmax(0, 1fr); }
  .mkt thead { display: none; }
  .mkt tr { display: grid; grid-template-columns: 1fr auto; gap: 6px; padding: 10px 0; border-top: 1px solid var(--line); }
  .mkt td { border: 0; padding: 0 4px; }
  .mkt td.mvc { grid-column: 1 / -1; overflow-x: auto; }
  .dv { grid-template-columns: 72px minmax(0, 1fr); }
  .dv .ty { display: none; }
  .dv .thumb { height: 56px; }
  .nsec { padding: 14px; }
}
</style>
