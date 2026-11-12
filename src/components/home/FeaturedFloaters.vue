<template>
  <!-- Tarjetas de "Juegos destacados" que flotan a los lados del hero
     (.floaters del diseño). Se ocultan por debajo de 1200 px. -->
  <div class="floaters">
    <RouterLink class="feat ft1" :to="champ.to">
      <span class="th"><img :src="champ.img" alt="" width="54" height="54" @error="onChampImgError"></span>
      <span class="tx">
        <span class="k">LoL · Campeón del parche</span>
        <span class="t">{{ champ.name }}</span>
        <span class="m"><span class="tier">{{ champ.tier }}</span>{{ champ.winrateText }} de victorias</span>
      </span>
    </RouterLink>
    <RouterLink class="feat ft2" to="/arc-raiders/enemigos">
      <span class="th"><img src="/images/arc-raiders/bots/arc_the_queen.webp" alt="" width="54" height="54"></span>
      <span class="tx">
        <span class="k">ARC Raiders · Jefe</span>
        <span class="t">The Queen</span>
        <span class="m">Amenaza extrema</span>
      </span>
    </RouterLink>
    <RouterLink class="feat ft3" to="/zelda/semillas">
      <span class="th"><img src="/images/zelda/hyrule.jpg" alt="" width="54" height="54"></span>
      <span class="tx">
        <span class="k">Zelda TotK · Guía</span>
        <span class="t">Semillas kolog</span>
        <span class="m">y los 152 santuarios</span>
      </span>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLolData } from "@/composables/useLolData";

// "Campeón del parche": el mismo que destaca el hub de LoL (spotlight de
// useLolData), para que la portada y /lol no digan cosas distintas.
const { spotlight } = useLolData();

const fmtPct = (n) => `${n.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

// Mientras cargan los datos (o si faltan): Yasuo, como en el diseño.
const FALLBACK = {
  name: "Yasuo",
  img: "https://ddragon.leagueoflegends.com/cdn/16.21.1/img/champion/Yasuo.png",
  tier: "S+",
  winrateText: fmtPct(52.5),
  to: "/lol",
};

const champ = computed(() => {
  const s = spotlight.value;
  if (!s || typeof s.wr !== "number") return FALLBACK;
  return {
    name: s.c.name,
    img: s.c.icon,
    tier: s.tier,
    winrateText: fmtPct(s.wr),
    to: { name: "lol-champion", params: { id: s.c.ddId } },
  };
});

function onChampImgError(e) {
  e.target.style.visibility = "hidden";
}
</script>

<style scoped>
.floaters {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}
.feat {
  position: absolute;
  width: 244px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px 10px 10px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(22, 27, 37, 0.82), rgba(12, 15, 21, 0.82));
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 26px 50px -24px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  text-decoration: none;
  color: var(--ink);
  text-align: left;
  pointer-events: auto;
  /* La aparición va primero para que el balanceo (bob) mande en el transform
     una vez terminada; si no, el "both" de gm-rise lo dejaría quieto. */
  animation: gm-rise 0.9s var(--ease-out) both, bob var(--t, 7s) ease-in-out infinite;
  animation-delay: var(--ri, 0.5s), var(--dl, 0s);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.feat:hover {
  color: var(--ink);
  border-color: var(--fc);
  box-shadow: 0 26px 50px -20px var(--fg), inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
.feat:focus-visible {
  outline: 2px solid var(--fc);
  outline-offset: 3px;
}
.th {
  position: relative;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 13px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: var(--bg-raised);
}
.th img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s;
}
.feat:hover .th img {
  transform: scale(1.12);
}
.tx {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 1px;
}
.k {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--fc);
}
.k::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--fc);
  box-shadow: 0 0 8px var(--fc);
}
.t {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.01em;
  line-height: 1.15;
}
.m {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink-dim);
}
.tier {
  display: inline-grid;
  place-items: center;
  height: 18px;
  padding: 0 5px;
  border-radius: 5px;
  font-size: 10.5px;
  font-weight: 800;
  color: #1B1204;
  background: linear-gradient(110deg, #FFD27A, #F2A93B);
}
.ft1 { left: 4.5%; top: 36%; --fc: #E2C27E; --fg: rgba(226, 194, 126, 0.55); --t: 7s; --r0: -2deg; --r1: 1deg; --ri: 0.55s; }
.ft2 { right: 4.5%; top: 20%; --fc: #FF8A5F; --fg: rgba(255, 106, 61, 0.5); --t: 8s; --dl: -2s; --r0: 2deg; --r1: -1deg; --ri: 0.7s; }
.ft3 { right: 7%; top: 62%; --fc: var(--gm-teal); --fg: rgba(79, 224, 182, 0.45); --t: 7.5s; --dl: -4s; --r0: -1deg; --r1: 2deg; --ri: 0.85s; }

@keyframes bob {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r0)); }
  50% { transform: translate3d(0, -18px, 0) rotate(var(--r1)); }
}

@media (max-width: 1200px) {
  .floaters {
    display: none;
  }
}
</style>
