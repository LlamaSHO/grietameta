<template>
  <!-- «Campeón del parche»: el de mejor puntuación con todos los rangos.
       Toda la tarjeta lleva a su ficha. -->
  <div class="spot-wrap">
  <span id="destacado" class="lol-anchor" aria-hidden="true"></span>
  <RouterLink v-if="spot" class="spot" :to="{ name: 'lol-champion', params: { id: spot.c.ddId } }" aria-labelledby="spot-h">
    <img class="spot-bg" :src="spot.c.splash" alt="" loading="lazy">
    <div class="spot-in">
      <div class="kicker">Campeón del parche</div>
      <div class="spot-top">
        <img :src="spot.c.icon" alt="" width="72" height="72">
        <div>
          <h3 id="spot-h" class="disp">{{ spot.c.name }}</h3>
          <div class="sb">{{ spot.c.role }} · {{ spot.c.cls }}</div>
        </div>
        <span class="tier big" :class="spot.tc">{{ spot.tier }}</span>
      </div>
      <div class="stats">
        <div class="stat"><div class="k">Winrate</div><div class="v" :class="{ hi: spot.wr >= 51.5 }">{{ pct(spot.wr) }}</div></div>
        <div class="stat"><div class="k">Pickrate</div><div class="v">{{ pct(spot.pr) }}</div></div>
        <div class="stat"><div class="k">Banrate</div><div class="v">{{ pct(spot.br) }}</div></div>
        <div class="stat"><div class="k">Partidas</div><div class="v">{{ fmtInt(spot.games) }}</div></div>
      </div>
      <template v-if="b">
        <div class="build">
          <div v-if="b.runes" class="bblock">
            <h4>Runas</h4>
            <div class="rune">
              <img v-if="b.runes.icon" :src="runeIconUrl(b.runes.icon)" alt="" loading="lazy">
              <div>
                <b>{{ b.runes.keystone }}</b>
                <span>{{ b.runes.primaryTree }}<template v-if="b.runes.secondaryTree"> · secundaria {{ b.runes.secondaryTree }}</template></span>
              </div>
            </div>
          </div>
          <div v-if="b.starter.length || b.boots.length" class="bblock">
            <h4>Inicio y botas</h4>
            <div class="start">
              <BuildItems :focusable="false" :items="b.starter" join="or" />
              <template v-if="b.boots.length">
                <span class="dotsep" aria-hidden="true">·</span>
                <BuildItems :focusable="false" :items="b.boots" />
              </template>
            </div>
          </div>
          <div v-if="b.core.length" class="bblock">
            <h4>Núcleo</h4>
            <BuildItems :focusable="false" :items="b.core" join="seq" />
            <div class="iname">{{ b.core.map((i) => i.name).join(" → ") }}</div>
          </div>
          <div v-if="b.situational.length" class="bblock">
            <h4>Situacional</h4>
            <BuildItems :focusable="false" :items="b.situational" />
          </div>
        </div>
        <p class="bnote">Build basada en {{ fmtInt(b.sampleGames) }} partidas analizadas de todos los rangos.</p>
      </template>
      <span class="spot-cta">
        Ver la página de {{ spot.c.name }}: build, runas y estadísticas por rango
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
      </span>
    </div>
  </RouterLink>
  <div v-else class="spot placeholder" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import BuildItems from "./BuildItems.vue";
import { fmtInt, pct } from "@/services/lol/format";
import { runeIconUrl } from "@/services/lol/ddragon";

const props = defineProps({ spot: { type: Object, default: null } });
const b = computed(() => props.spot?.build || null);
</script>

<style scoped>
/* El ancla #destacado va fuera del enlace (que tiene overflow: hidden). */
.spot-wrap { position: relative; }
.spot {
  position: relative;
  display: block;
  overflow: hidden;
  isolation: isolate;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0D1017;
  text-decoration: none;
  color: var(--ink);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.lol-page .spot:hover {
  color: var(--ink);
  border-color: rgba(242, 169, 59, 0.5);
  box-shadow: 0 30px 80px -40px rgba(242, 169, 59, 0.6);
}
.spot.placeholder { min-height: 320px; }
.spot-bg {
  position: absolute;
  right: -6%;
  top: 0;
  width: 78%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 20%;
  z-index: -2;
  opacity: 0.5;
  transition: transform 1.4s var(--ease-out), opacity 0.6s;
}
.spot:hover .spot-bg { transform: scale(1.06); opacity: 0.62; }
.spot::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, #0D1017 34%, rgba(13, 17, 23, 0.82) 58%, rgba(13, 17, 23, 0.4));
}
.spot-in { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.spot-top { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.spot-top img {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  border: 2px solid rgba(242, 169, 59, 0.6);
  box-shadow: 0 0 30px -6px rgba(242, 169, 59, 0.7);
}
.spot-top h3 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
.spot-top .sb { font-size: 14px; color: var(--ink-dim); margin-top: 4px; }
.tier.big { height: 34px; min-width: 46px; font-size: 16px; }
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(120px, 100%), 1fr));
  gap: 10px;
  max-width: 620px;
}
.stat {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(7, 9, 13, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.stat .k { font-size: 11.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-mute); }
.stat .v { margin-top: 2px; font-size: 22px; font-weight: 700; font-family: var(--font-display); }
.stat .v.hi { color: #62D99C; }
.build {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: 12px;
  max-width: 760px;
}
.bblock {
  padding: 14px;
  border-radius: 14px;
  background: rgba(7, 9, 13, 0.66);
  border: 1px solid rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.bblock h4 { margin: 0 0 10px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-mute); }
.start { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dotsep { color: var(--ink-faint); }
.iname { font-size: 12.5px; color: #C6CBD2; margin-top: 8px; }
.rune { display: flex; align-items: center; gap: 12px; }
.rune img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0A0C10;
  border: 1px solid rgba(226, 181, 102, 0.45);
  padding: 3px;
}
.rune b { display: block; font-size: 15px; }
.rune span { font-size: 12.5px; color: var(--ink-dim); }
.bnote { font-size: 12.5px; color: var(--ink-mute); margin: 0; }
.spot-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  min-height: 42px;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(242, 169, 59, 0.14);
  border: 1px solid rgba(242, 169, 59, 0.45);
  color: var(--accent);
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s, gap 0.2s;
}
.spot:hover .spot-cta { background: rgba(242, 169, 59, 0.24); gap: 12px; }
@media (max-width: 560px) {
  .spot-in { padding: 18px; }
  .spot-top h3 { font-size: 26px; }
  .spot-bg { width: 100%; right: 0; opacity: 0.3; }
  .stat .v { font-size: 19px; }
}
</style>
