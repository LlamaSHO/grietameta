<template>
  <!-- "¿A qué juegas hoy?": los 9 juegos en filas de 3, con paneles que se
       expanden al pasar el ratón (.grid9 de models/paginas/Main.dc.html).
       Orden, ruta y estado salen de nav/gamesCatalog.js (+ games.json). -->
  <section id="juegos" class="games">
    <div class="wrap">
      <div class="sec-head">
        <div>
          <div class="kicker">Juegos</div>
          <h2 class="h2">¿A qué juegas hoy?</h2>
        </div>
        <div class="hint">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="6" /><line x1="12" y1="6.5" x2="12" y2="10" /></svg>
          Nueve juegos · pasa el ratón por una portada para ver qué incluye
        </div>
      </div>

      <div class="grid9">
        <div v-for="(row, r) in rows" :key="r" class="panels">
          <component
            :is="p.url ? 'RouterLink' : 'div'"
            v-for="(p, c) in row"
            :key="p.slug"
            class="panel"
            :class="`p-${p.look.kind}`"
            v-bind="p.url ? { to: p.url } : { 'aria-disabled': 'true' }"
          >
            <template v-if="p.look.kind === 'zelda'">
              <img class="p-bg z-surface" :src="p.look.bg" alt="" loading="lazy" decoding="async">
              <img class="p-bg z-sky" :src="p.look.bgAlt" alt="" loading="lazy" decoding="async">
            </template>
            <div v-else-if="p.look.kind === 'pk'" class="pk-bg">
              <img class="a1" src="/images/home/art-10035.webp" alt="" loading="lazy" decoding="async">
              <img class="a2" src="/images/home/art-25.webp" alt="" loading="lazy" decoding="async">
            </div>
            <img v-else class="p-bg" :src="p.slug === 'lol' ? '/images/lol/yasuo-splash.webp' : p.img" alt="" loading="lazy" decoding="async">
            <div class="p-shade"></div>
            <div class="p-tint"></div>

            <!-- Efectos al pasar el ratón -->
            <div v-if="p.look.kind === 'lol'" class="fx" aria-hidden="true">
              <div class="ring">
                <svg viewBox="0 0 200 200">
                  <g class="r-a">
                    <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(10,200,185,.55)" stroke-width=".8" stroke-dasharray="1.5 5" />
                    <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(217,181,110,.7)" stroke-width="1.2" stroke-dasharray="46 10 6 10" />
                  </g>
                  <g class="r-b">
                    <polygon points="100,30 160.6,65 160.6,135 100,170 39.4,135 39.4,65" fill="none" stroke="rgba(10,200,185,.6)" stroke-width="1" />
                    <circle cx="100" cy="30" r="3" fill="#0AC8B9" />
                    <circle cx="100" cy="170" r="3" fill="#D9B56E" />
                  </g>
                </svg>
              </div>
              <span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span><span class="spark s4"></span>
            </div>
            <div v-else-if="p.look.kind === 'arc'" class="fx" aria-hidden="true">
              <div class="hud"><i></i><i></i><i></i><i></i></div>
              <div class="reticle">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="18 10" />
                  <circle cx="60" cy="60" r="4" fill="currentColor" />
                  <line x1="60" y1="4" x2="60" y2="22" stroke="currentColor" stroke-width="2" />
                  <line x1="60" y1="98" x2="60" y2="116" stroke="currentColor" stroke-width="2" />
                  <line x1="4" y1="60" x2="22" y2="60" stroke="currentColor" stroke-width="2" />
                  <line x1="98" y1="60" x2="116" y2="60" stroke="currentColor" stroke-width="2" />
                </svg>
              </div>
              <span class="reticle-label">ARC DETECTADO</span>
              <div class="scan"></div>
            </div>
            <div v-else-if="p.look.kind === 'zelda'" class="fx" aria-hidden="true">
              <div class="halo"></div>
              <span class="mote m1"></span><span class="mote m2"></span><span class="mote m3"></span>
              <span class="mote m4"></span><span class="mote m5"></span><span class="mote m6"></span>
            </div>
            <div v-else-if="p.look.kind === 'ac'" class="fx" aria-hidden="true">
              <svg class="ac-eagle" viewBox="0 0 120 120"><path d="M60 10 L74 52 L60 44 L46 52 Z" fill="currentColor" /><path d="M60 50 L82 104 L60 92 L38 104 Z" fill="currentColor" opacity=".85" /></svg>
              <span class="ac-line l1"></span><span class="ac-line l2"></span>
            </div>
            <div class="p-sheen" aria-hidden="true"></div>

            <div class="p-top">
              <span class="badge" :class="badgeClass(p)"><span class="dot"></span>{{ statusLabel(p) }}</span>
              <span class="p-num">{{ String(r * 3 + c + 1).padStart(2, "0") }}</span>
            </div>

            <div class="p-body">
              <img v-if="p.look.logo" class="p-logo" :src="p.look.logo" alt="" loading="lazy" decoding="async">
              <span v-else-if="p.look.txtlogo" class="p-txtlogo">{{ p.look.txtlogo }}</span>
              <h3 class="p-name">{{ p.name }}</h3>
              <p class="p-tag">{{ p.look.tag || p.tagline || p.small }}</p>
              <div class="p-more">
                <div class="p-more-in">
                  <div v-if="p.look.chips.length" class="chips">
                    <span v-for="ch in p.look.chips" :key="ch" class="chip">{{ ch }}</span>
                  </div>
                  <div class="p-cta">
                    <span>{{ p.url ? p.look.cta : "Próximamente en GrietaMeta" }}</span>
                    <span class="arrow" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg></span>
                  </div>
                </div>
              </div>
            </div>
            <span class="p-bar" aria-hidden="true"></span>
          </component>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { statusLabel, useCatalog } from "@/components/nav/gamesCatalog";

// Aspecto de cada juego en la portada (lo que no está en el catálogo):
// tipo de efecto, logo, chips y texto del botón.
const LOOKS = {
  lol: { kind: "lol", logo: "/images/games/logo-lol.png", tag: "Tier list, winrates y builds de todos los campeones", chips: ["Tier list", "Campeones", "Premium"], cta: "Entrar en LoL" },
  "arc-raiders": { kind: "arc", logo: "/images/games/logo-arc.png", tag: "Objetos, misiones, enemigos y mapas", chips: ["Objetos", "Misiones", "Enemigos"], cta: "Entrar en ARC Raiders" },
  "zelda-totk": {
    kind: "zelda",
    logo: "/images/games/logo-zelda.png",
    bg: "/images/zelda/hyrule.jpg",
    bgAlt: "/images/zelda/hyrule-cielo.jpg",
    tag: "Mapa de semillas kolog y santuarios, misiones y armaduras",
    chips: ["Semillas", "Santuarios", "Misiones", "Armaduras", "Conjuntos"],
    cta: "Entrar en Zelda",
  },
  pokemon: { kind: "pk", tag: "Pokédex, tabla de tipos, meta competitivo y Kanto al 100 %", chips: ["Pokédex", "Tipos", "Competitivo", "Kanto"], cta: "Entrar en Pokémon" },
  ark: { kind: "ark", logo: "/images/games/logo-ark.webp", tag: "Criaturas, engramas, recursos y guías de supervivencia", chips: ["Criaturas", "Engramas", "Recursos", "Guías"], cta: "Entrar en ARK" },
  "assassins-creed": {
    kind: "ac",
    txtlogo: "Saga + Unity",
    tag: "De Altaïr a Naoe: la saga en orden y la guía completa de Unity",
    chips: ["Saga", "Unity", "Mapa de París", "Historia"],
    cta: "Entrar en Assassin's Creed",
  },
  "cod-zombis": { kind: "cod", logo: "/images/home/logo-cod.png", tag: "Zombis de Black Ops 1 a 4: Pack-a-Punch, armas y Easter eggs paso a paso", chips: ["26 mapas", "Easter eggs", "Historia del Aether"], cta: "Entrar en CoD Zombis" },
  "resident-evil": { kind: "re", txtlogo: "Toda la saga", tag: "Mapas por planta, puzles resueltos y códigos de cajas fuertes", chips: ["Remakes", "Puzles", "Rangos"], cta: "" },
  rust: { kind: "rust", logo: "/images/home/logo-rust.png", tag: "Monumentos, objetos y calculadora de raid", chips: ["Monumentos", "Raid", "Bases"], cta: "" },
};

const { games } = useCatalog();

const panels = computed(() =>
  games.value.map((g) => ({
    ...g,
    look: { chips: [], cta: `Entrar en ${g.short || g.name}`, ...(LOOKS[g.slug] || { kind: "generic" }) },
  }))
);
// Filas de tres, como en el diseño.
const rows = computed(() => [0, 3, 6].map((i) => panels.value.slice(i, i + 3)));

function badgeClass(p) {
  if (p.status === "soon") return "next";
  if (p.isNew && p.status === "live") return "new";
  return p.status === "live" ? "live" : "soon";
}
</script>

<style scoped>
.games {
  position: relative;
  padding: 24px 0 72px;
}
.sec-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin-bottom: 28px;
}
.kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
}
.kicker::before {
  content: "";
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: var(--gold);
}
.h2 {
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.hint {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #A0A8B4;
}
.hint svg {
  color: var(--gold);
}
@keyframes bob {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -4px, 0); }
}

/* ---------- paneles ---------- */
.panels {
  content-visibility: auto;
  contain-intrinsic-size: auto 380px;
  display: flex;
  gap: 14px;
  height: 540px;
  min-height: 540px;
}
.panel {
  position: relative;
  display: block;
  flex: 1 1 0;
  min-width: 0;
  border-radius: 24px;
  overflow: hidden;
  isolation: isolate;
  text-decoration: none;
  color: var(--ink);
  background: var(--bg-raised);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: flex-grow 0.75s var(--ease-out), border-color 0.5s, box-shadow 0.6s;
  outline: none;
  --acc: var(--gold);
  --acc2: var(--gold-hi);
  --glow: rgba(212, 160, 74, 0.45);
}
.panel:nth-child(1) { animation-delay: 0.12s; }
.panel:nth-child(2) { animation-delay: 0.22s; }
.panel:nth-child(3) { animation-delay: 0.32s; }
.panel:hover {
  color: var(--ink);
}
.panels:hover .panel,
.panels:focus-within .panel {
  flex-grow: 0.82;
}
.panels .panel:hover,
.panels .panel:focus-visible {
  flex-grow: 1.9;
  border-color: var(--acc);
  box-shadow: 0 0 0 1px var(--acc), 0 50px 100px -40px var(--glow);
}
.panel:focus-visible {
  outline: 2px solid var(--acc);
  outline-offset: 4px;
}

.p-lol { --acc: #D9B56E; --acc2: #0AC8B9; --glow: rgba(10, 200, 185, 0.55); }
.p-arc { --acc: var(--gm-orange); --acc2: #F5A524; --glow: rgba(255, 106, 61, 0.5); }
.p-zelda { --acc: var(--gm-teal); --acc2: #F1E7C8; --glow: rgba(79, 224, 182, 0.45); }

.p-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -3;
  transform: scale(1.06);
  transition: transform 1.6s var(--ease-out), opacity 0.9s;
}
.panel:hover .p-bg,
.panel:focus-visible .p-bg {
  transform: scale(1.15);
}
.p-lol .p-bg { object-position: 58% 30%; }
.p-arc .p-bg { object-position: 48% 50%; }
.p-zelda .p-bg {
  object-position: 50% 55%;
}
/* Zelda: al pasar el ratón la superficie se va y aparece el cielo */
.p-zelda:hover .p-bg.z-surface,
.p-zelda:focus-visible .p-bg.z-surface {
  opacity: 0;
  transform: scale(1.2) translateY(6%);
}
.p-zelda .p-bg.z-sky {
  opacity: 0;
  transform: scale(1.25) translateY(-8%);
}
.p-zelda:hover .p-bg.z-sky,
.p-zelda:focus-visible .p-bg.z-sky {
  opacity: 1;
  transform: scale(1.08);
}

.p-shade {
  position: absolute;
  inset: 0;
  z-index: -2;
  background: linear-gradient(180deg, rgba(7, 9, 13, 0.6) 0%, rgba(7, 9, 13, 0) 26%, rgba(7, 9, 13, 0.25) 52%, rgba(7, 9, 13, 0.97) 100%);
}
.p-tint {
  position: absolute;
  inset: 0;
  z-index: -2;
  background: radial-gradient(130% 70% at 50% 115%, var(--glow), transparent 62%);
  opacity: 0.45;
  transition: opacity 0.7s;
}
.panel:hover .p-tint,
.panel:focus-visible .p-tint {
  opacity: 1;
}
.p-sheen {
  position: absolute;
  top: -30%;
  bottom: -30%;
  left: -80%;
  width: 60%;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.16), transparent);
  transform: translateX(0) skewX(-12deg);
  opacity: 0;
}
.panel:hover .p-sheen {
  opacity: 1;
  transform: translateX(420%) skewX(-12deg);
  transition: transform 1.2s var(--ease-out), opacity 0.2s;
}
.p-bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  z-index: 4;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.9s var(--ease-out);
  background: linear-gradient(90deg, var(--acc), var(--acc2));
}
.panel:hover .p-bar,
.panel:focus-visible .p-bar {
  transform: scaleX(1);
}
.p-lol .p-bar { background: linear-gradient(90deg, #D9B56E, #0AC8B9); }
.p-arc .p-bar { background: linear-gradient(90deg, #E5372B 0 25%, #F5A524 25% 50%, #2FB45A 50% 75%, #3BC9E8 75%); }
.p-zelda .p-bar { background: linear-gradient(90deg, var(--gm-teal), #F1E7C8); }

.p-top {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 10px;
  border-radius: 999px;
  background: rgba(7, 9, 13, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
.badge .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.badge.live { color: #5FE6DA; }
.badge.soon { color: #F2C36B; }
@keyframes ping {
  0% { box-shadow: 0 0 0 0 currentColor; }
  70% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
.p-num {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(236, 233, 225, 0.72);
  font-variant-numeric: tabular-nums;
}
.p-body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.p-logo {
  height: 84px;
  width: auto;
  max-width: 180px;
  object-fit: contain;
  align-self: flex-start;
  margin-bottom: 6px;
  transform-origin: left bottom;
  transition: transform 0.8s var(--ease-out);
}
.p-arc .p-logo {
  height: 74px;
  border-radius: 50%;
}
.panel:hover .p-logo,
.panel:focus-visible .p-logo {
  transform: translateY(-6px) scale(1.08);
}
.p-name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
}
.p-tag {
  margin: 0;
  font-size: 14.5px;
  color: #C6CBD2;
  max-width: 38ch;
  text-wrap: pretty;
}
.p-more {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.6s var(--ease-out), opacity 0.35s;
}
.panel:hover .p-more,
.panel:focus-visible .p-more {
  grid-template-rows: 1fr;
  opacity: 1;
  transition-delay: 0.12s;
}
.p-more-in {
  overflow: hidden;
  min-height: 0;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 6px;
}
.chip {
  font-size: 12.5px;
  font-weight: 500;
  padding: 6px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #E6E3DB;
  white-space: nowrap;
}
.p-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  font-weight: 600;
}
.arrow {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: var(--ink);
  transition: background 0.4s, color 0.4s, transform 0.6s var(--ease-out), border-color 0.4s;
}
.panel:hover .arrow,
.panel:focus-visible .arrow {
  background: var(--acc);
  border-color: var(--acc);
  color: #0A0C10;
  transform: rotate(-45deg);
}

/* ---------- efectos ---------- */
.fx {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  display: none;
}
.panel:hover .fx,
.panel:focus-visible .fx {
  display: block;
}

/* LoL: anillo hextech y chispas */
.ring {
  position: absolute;
  left: 50%;
  top: 36%;
  width: 400px;
  height: 400px;
  margin: -200px 0 0 -200px;
  transform: scale(0.8);
  transition: transform 1.1s var(--ease-out);
}
.panel:hover .ring {
  transform: scale(1);
}
.ring svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.r-a {
  animation: gm-spin 24s linear 1;
  transform-origin: 50% 50%;
}
.r-b {
  animation: spin-r 16s linear 1;
  transform-origin: 50% 50%;
}
@keyframes spin-r {
  to { transform: rotate(-360deg); }
}
.spark {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #0AC8B9;
  transform: rotate(45deg);
  box-shadow: 0 0 12px 2px rgba(10, 200, 185, 0.8);
  animation: mote 5s ease-out 1;
}
.s1 { left: 24%; bottom: 30%; }
.s2 { left: 70%; bottom: 22%; animation-delay: -1.6s; background: #E2C27E; box-shadow: 0 0 12px 2px rgba(226, 194, 126, 0.8); }
.s3 { left: 46%; bottom: 12%; animation-delay: -3.1s; }
.s4 { left: 84%; bottom: 40%; animation-delay: -2.3s; background: #E2C27E; box-shadow: 0 0 12px 2px rgba(226, 194, 126, 0.8); }

/* ARC: escáner, esquinas de HUD y retícula */
.scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gm-orange) 30%, #FFB27A 50%, var(--gm-orange) 70%, transparent);
  box-shadow: 0 0 22px 3px rgba(255, 106, 61, 0.65);
  animation: scan 2.6s cubic-bezier(0.45, 0, 0.55, 1) 1;
}
.scan::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 70px;
  background: linear-gradient(0deg, rgba(255, 106, 61, 0.16), transparent);
}
@keyframes scan {
  0% { top: 6%; opacity: 0; }
  8% { opacity: 1; }
  92% { opacity: 1; }
  100% { top: 94%; opacity: 0; }
}
.hud {
  position: absolute;
  inset: 34px;
  transition: inset 0.8s var(--ease-out);
}
.panel:hover .hud {
  inset: 16px;
}
.hud i {
  position: absolute;
  width: 26px;
  height: 26px;
  border-color: #FF8A5F;
  border-style: solid;
  border-width: 0;
}
.hud i:nth-child(1) { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 8px; }
.hud i:nth-child(2) { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 8px; }
.hud i:nth-child(3) { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 8px; }
.hud i:nth-child(4) { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 8px; }
.reticle {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  color: #FF8A5F;
}
.reticle svg {
  width: 100%;
  height: 100%;
  animation: gm-spin 9s linear 1;
}
.reticle-label {
  position: absolute;
  left: 50%;
  top: calc(40% + 70px);
  transform: translateX(-50%);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #FFB08F;
  white-space: nowrap;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(7, 9, 13, 0.6);
  animation: blink 1.4s steps(2) 1;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

/* Zelda: motas de luz y halo */
.mote {
  position: absolute;
  bottom: -10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #B8FBE6;
  box-shadow: 0 0 14px 3px rgba(79, 224, 182, 0.75);
  animation: mote 6s ease-out 1;
}
.m1 { left: 12%; }
.m2 { left: 28%; animation-delay: -2s; animation-duration: 7s; width: 4px; height: 4px; }
.m3 { left: 45%; animation-delay: -4s; }
.m4 { left: 61%; animation-delay: -1s; animation-duration: 5.5s; width: 4px; height: 4px; }
.m5 { left: 77%; animation-delay: -3s; animation-duration: 7.5s; }
.m6 { left: 90%; animation-delay: -5s; width: 5px; height: 5px; }
@keyframes mote {
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(-320px) scale(1.1); opacity: 0; }
}
.halo {
  position: absolute;
  left: 50%;
  top: 34%;
  width: 300px;
  height: 300px;
  margin: -150px 0 0 -150px;
  border-radius: 50%;
  border: 1px solid rgba(79, 224, 182, 0.45);
  box-shadow: 0 0 60px rgba(79, 224, 182, 0.25), inset 0 0 60px rgba(79, 224, 182, 0.18);
  transform: scale(0.7);
  transition: transform 1.2s var(--ease-out);
}
.halo::before {
  content: "";
  position: absolute;
  inset: 26px;
  border-radius: 50%;
  border: 1px dashed rgba(241, 231, 200, 0.4);
  animation: gm-spin 30s linear 1;
}
.panel:hover .halo {
  transform: scale(1);
}

/* ---------- responsive ---------- */
@media (max-width: 860px) {
  .panels {
    flex-direction: column;
    height: auto;
    min-height: 0;
  }
  /* Alto mínimo del diseño (400 px), pero el panel crece si el contenido
     no cabe (en táctil se ven siempre los chips y el botón). */
  .panel {
    flex: none;
    height: auto;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .p-body {
    position: relative;
    padding-top: 84px;
  }
  .panels:hover .panel,
  .panels:focus-within .panel,
  .panels .panel:hover {
    flex-grow: 0;
  }
}
@media (max-width: 560px) {
  .games {
    padding-bottom: 56px;
  }
  .panel {
    min-height: 380px;
  }
  .p-body {
    padding: 76px 22px 22px;
  }
  .p-logo {
    height: 68px;
  }
  .p-arc .p-logo {
    height: 60px;
  }
  .p-name {
    font-size: 26px;
  }
}

/* Táctil: no hay hover, así que el contenido de cada panel se ve siempre
   y el aviso de "pasa el ratón" sobra. */
@media (hover: none) {
  .p-more {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  .p-bar {
    transform: scaleX(1);
  }
  .hint {
    display: none;
  }
}

/* ---------- rejilla de 9 (3 filas de 3) ---------- */
.grid9 {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.grid9 .panels {
  height: 420px;
  min-height: 420px;
}
.grid9 .p-logo { height: 72px; max-width: 170px; }
.grid9 .p-name { font-size: 27px; }
.grid9 .p-tag { font-size: 14px; }
.grid9 .p-num { display: none; }
.grid9 .panels:nth-child(2) .panel:nth-child(1) { animation-delay: 0.4s; }
.grid9 .panels:nth-child(2) .panel:nth-child(2) { animation-delay: 0.48s; }
.grid9 .panels:nth-child(2) .panel:nth-child(3) { animation-delay: 0.56s; }
.grid9 .panels:nth-child(3) .panel:nth-child(1) { animation-delay: 0.64s; }
.grid9 .panels:nth-child(3) .panel:nth-child(2) { animation-delay: 0.72s; }
.grid9 .panels:nth-child(3) .panel:nth-child(3) { animation-delay: 0.8s; }
div.panel[aria-disabled="true"] { cursor: default; }

.p-pk { --acc: #FFCB3D; --acc2: #FF5A5F; --glow: rgba(255, 203, 61, 0.55); }
.p-ark { --acc: #7ED957; --acc2: #2FA4D9; --glow: rgba(126, 217, 87, 0.5); }
.p-ac { --acc: #E8E2D0; --acc2: #C8102E; --glow: rgba(232, 226, 208, 0.4); }
.p-cod { --acc: #FF7A1A; --acc2: #9BE15D; --glow: rgba(255, 122, 26, 0.5); }
.p-re { --acc: #E2364B; --acc2: #3FA7D6; --glow: rgba(226, 54, 75, 0.5); }
.p-rust { --acc: #CE422B; --acc2: #F2A33A; --glow: rgba(206, 66, 43, 0.5); }
.p-pk .p-bar { background: linear-gradient(90deg, #FF5A5F, #FFCB3D, #7AD27A, #5B8CFF, #EC8FE6); }
.p-ark .p-bar { background: linear-gradient(90deg, #7ED957, #2FA4D9); }
.p-ac .p-bar { background: linear-gradient(90deg, #C8102E, #E8E2D0); }
.p-cod .p-bar { background: linear-gradient(90deg, #FF7A1A, #9BE15D); }
.p-re .p-bar { background: linear-gradient(90deg, #8B0F1E, #E2364B); }
.p-rust .p-bar { background: linear-gradient(90deg, #CE422B, #F2A33A); }
.p-ark .p-bg { object-position: 60% 40%; }
.p-ac .p-bg { object-position: 75% 30%; }
.p-cod .p-bg { object-position: 40% 40%; }
.p-re .p-bg { object-position: 30% 40%; }
.p-rust .p-bg { object-position: 55% 50%; }
.p-cod .p-shade { background: linear-gradient(180deg, rgba(7, 9, 13, 0.55) 0%, rgba(7, 9, 13, 0.05) 24%, rgba(7, 9, 13, 0.4) 48%, rgba(7, 9, 13, 0.9) 68%, rgba(7, 9, 13, 0.98) 100%); }
.p-ac .p-shade { background: linear-gradient(180deg, rgba(7, 9, 13, 0.6) 0%, rgba(7, 9, 13, 0.1) 22%, rgba(7, 9, 13, 0.45) 46%, rgba(7, 9, 13, 0.9) 66%, rgba(7, 9, 13, 0.98) 100%); }
.p-ac .p-tag { color: #D9DCE1; }
.badge.new { color: #FFCB3D; }
.badge.next { color: #C6CBD2; }
.p-txtlogo {
  align-self: flex-start;
  margin-bottom: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  font: 800 15px/1 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(7, 9, 13, 0.6);
  border: 1px solid var(--acc);
  color: var(--acc);
}
/* Pokémon: arte oficial sobre degradado */
.pk-bg {
  position: absolute;
  inset: 0;
  z-index: -3;
  background: radial-gradient(120% 80% at 70% 10%, #FFCB3D 0%, #FF7A59 30%, #7C3AED 70%, #1E1B4B 100%);
}
.pk-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-conic-gradient(rgba(255, 255, 255, 0.08) 0 10deg, transparent 10deg 20deg);
  -webkit-mask: radial-gradient(circle at 60% 30%, #000 10%, transparent 60%);
  mask: radial-gradient(circle at 60% 30%, #000 10%, transparent 60%);
}
.pk-bg img {
  position: absolute;
  object-fit: contain;
  transition: transform 1s var(--ease-out);
}
.pk-bg .a1 { width: 78%; right: -14%; top: -2%; }
.pk-bg .a2 { width: 46%; left: -6%; top: 20%; transform: rotate(-8deg); }
.p-pk:hover .pk-bg .a1 { transform: scale(1.08) translateY(-4px); }
.p-pk:hover .pk-bg .a2 { transform: rotate(-14deg) scale(1.1); }
/* Assassin's Creed: águila y líneas al entrar el ratón */
.ac-eagle {
  position: absolute;
  right: 22px;
  top: 58px;
  width: 64px;
  height: 64px;
  color: rgba(232, 226, 208, 0.9);
  transform: translateY(-8px) scale(0.85);
  opacity: 0;
  transition: transform 0.7s var(--ease-out), opacity 0.4s;
}
.panel:hover .ac-eagle { transform: none; opacity: 1; }
.ac-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 16, 46, 0.75), transparent);
  transform: scaleX(0);
  transition: transform 0.9s var(--ease-out);
}
.ac-line.l1 { top: 34%; }
.ac-line.l2 { top: 36%; transition-delay: 0.12s; background: linear-gradient(90deg, transparent, rgba(232, 226, 208, 0.55), transparent); }
.panel:hover .ac-line { transform: scaleX(1); }
@media (max-width: 860px) {
  .grid9 .panels { height: auto; min-height: 0; }
  .pk-bg .a1 { width: 56%; right: -4%; }
  .pk-bg .a2 { width: 30%; }
}
</style>
