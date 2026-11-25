<template>
  <!-- Pantalla de carga de CoD Zombis (diseño: .cz-load de CodZombies.dc.html).
       variant="pistolero" (por defecto) o "iniciales" (C O D con brillo naranja).
       Bloquea la interacción mientras dura (~2,9 s) y termina en visibility:hidden. -->
  <div class="cz-load" :class="variant === 'iniciales' ? 'ini' : 'pis'" aria-hidden="true" @animationend.self="onEnd">
    <i class="cz-fog"></i>
    <div v-if="variant !== 'iniciales'" class="cz-gun">
      <svg viewBox="0 0 200 262" aria-hidden="true">
        <ellipse cx="100" cy="36" rx="15" ry="18" />
        <path d="M84 50h32l2 10H82z" />
        <path d="M68 62Q100 50 132 62L140 118L152 198Q134 204 118 198L114 252H100L100 204L100 204L86 252H72L82 198Q66 204 48 198L60 118Z" />
        <path d="M70 62L82 74L40 142L28 136Z" />
        <path d="M130 62L118 74L160 142L172 136Z" />
        <path d="M18 132L34 127L36 135L28 138L31 150L24 152L21 140L16 141Z" />
        <path d="M182 132L166 127L164 135L172 138L169 150L176 152L179 140L184 141Z" />
        <path d="M100 120L96 196L104 196Z" opacity=".55" />
      </svg>
    </div>
    <div v-else class="cz-ini"><b>C</b><b>O</b><b>D</b><span>ZOMBIS</span></div>
    <span class="cz-txt">Cargando ronda 1…</span>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: "pistolero" },
});
const emit = defineEmits(["done"]);
function onEnd(e) {
  if (e.animationName.endsWith("czOut")) emit("done");
}
</script>

<style>
/* Sin filter: el borde naranja del pistolero es un trazo y el resplandor, un degradado. */
.cz-load {
  position: fixed;
  inset: 0;
  z-index: 400;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(55% 50% at 50% 55%, #2a1206 0, #120804 45%, #060504 75%);
  pointer-events: auto;
  cursor: progress;
  animation: cod-czOut 0.5s ease 2.4s forwards;
}
.cz-fog {
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: -6%;
  height: 40%;
  background: radial-gradient(50% 60% at 50% 100%, rgba(255, 110, 40, 0.22), transparent 70%);
  animation: cod-czFog 2.4s ease-out both;
}
.cz-gun,
.cz-ini {
  grid-area: 1 / 1;
  position: relative;
}
.cz-gun::before {
  content: "";
  position: absolute;
  inset: -18%;
  background: radial-gradient(closest-side, rgba(255, 90, 20, 0.32), transparent);
  animation: cod-czRise 1.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.cz-gun svg {
  position: relative;
  display: block;
  width: min(300px, 60vw);
  height: auto;
  aspect-ratio: 200 / 262;
  fill: #060504;
  stroke: #ff9a4d;
  stroke-width: 1.1;
  stroke-linejoin: round;
  animation: cod-czRise 1.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.cz-ini {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font: 400 clamp(64px, 18vw, 120px) / 1 "Saira Stencil One", sans-serif;
}
.cz-ini b {
  font-weight: 400;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 122, 26, 0.35);
  animation: cod-czLight 0.7s ease-out both;
}
.cz-ini b:nth-child(2) {
  animation-delay: 0.45s;
}
.cz-ini b:nth-child(3) {
  animation-delay: 0.9s;
}
.cz-ini span {
  align-self: center;
  margin-left: 14px;
  font: 700 22px/1 "Saira Condensed", sans-serif;
  letter-spacing: 0.4em;
  color: #ffc08a;
  opacity: 0;
  animation: cod-czFade 0.6s ease 1.4s forwards;
}
.cz-txt {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14vh;
  text-align: center;
  font: 600 12px/1 "IBM Plex Sans", sans-serif;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #b9a48c;
  opacity: 0;
  animation: cod-czFade 0.5s ease 0.6s forwards;
}
@keyframes cod-czRise {
  0% { opacity: 0; transform: translateY(30px) scale(0.92); }
  35% { opacity: 0.4; }
  100% { opacity: 1; transform: none; }
}
@keyframes cod-czLight {
  0% { color: transparent; -webkit-text-stroke-color: rgba(255, 122, 26, 0.2); text-shadow: none; }
  30% { color: rgba(255, 122, 26, 0.25); }
  45% { color: transparent; }
  100% { color: #ff7a1a; -webkit-text-stroke-color: #ffb070; text-shadow: 0 0 18px rgba(255, 90, 20, 0.9), 0 0 46px rgba(255, 60, 10, 0.5); }
}
@keyframes cod-czFade {
  to { opacity: 1; }
}
@keyframes cod-czFog {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}
@keyframes cod-czOut {
  to { opacity: 0; visibility: hidden; }
}
@media (prefers-reduced-motion: reduce) {
  .cz-load {
    display: none;
  }
}
</style>
