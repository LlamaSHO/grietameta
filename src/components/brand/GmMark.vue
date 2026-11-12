<template>
  <!-- Marca GM tricolor (models/logo/Logo.dc.html): G dorada = LoL,
       cara izquierda naranja = ARC, cara derecha turquesa = Zelda.
       "mini" para nav y footer; "animated" traza el logo, lo rellena y
       hace correr un brillo por los bordes. -->
  <span class="mk" :class="{ mini: !animated, anim: animated }" :style="{ width: `${size}px` }" aria-hidden="true">
    <svg v-if="animated" class="l-b" viewBox="0 0 240 280"><line class="beam" x1="120" y1="8" x2="120" y2="36" /></svg>
    <svg class="l-ml" viewBox="0 0 240 280">
      <polygon class="face" :points="LEFT" />
      <polygon v-if="animated" class="cmt cm" :points="LEFT" />
    </svg>
    <svg class="l-mr" viewBox="0 0 240 280">
      <polygon class="face" :points="RIGHT" />
      <polygon v-if="animated" class="cmt cm" :points="RIGHT" />
      <path v-if="animated" class="drop" d="M120 136 L120 256" />
    </svg>
    <svg class="l-g" viewBox="0 0 240 280">
      <polygon class="face" :points="G" />
      <polygon v-if="animated" class="cmt cg" :points="G" />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 26 },
  animated: { type: Boolean, default: false },
});

const LEFT = "36.9,88 120,136 120,256 109,152.7 58.9,123.8 58.9,196.7 36.9,184";
const RIGHT = "203.1,88 120,136 120,256 131,152.7 181.1,123.8 181.1,196.7 203.1,184";
const G = "150.7,66.3 120,48.6 51.8,88 120,127.4 181,92.2 181,84 128,84 122,90.2 128,96.5 143.5,96.5 120,110.1 81.8,88 120,65.9 143.2,79.3";
</script>

<style scoped>
.mk {
  position: relative;
  display: inline-block;
  aspect-ratio: 240 / 280;
  flex-shrink: 0;
}
.mk svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  transition: transform 0.8s var(--ease-out);
  filter: drop-shadow(0 0 2px var(--c)) drop-shadow(0 0 12px var(--g));
}
.mk .face {
  fill: var(--f);
  stroke: var(--c);
  stroke-width: 1.8;
  stroke-linejoin: miter;
  stroke-miterlimit: 8;
}
.l-g { --c: #F3C878; --g: rgba(243, 200, 120, 0.55); --f: #231B0E; }
.l-ml { --c: #FF6A3D; --g: rgba(255, 106, 61, 0.55); --f: #25110A; }
.l-mr { --c: #4FE0B6; --g: rgba(79, 224, 182, 0.5); --f: #08221C; }
.l-b { --c: #F3C878; --g: rgba(243, 200, 120, 0.6); }

.mk.mini svg {
  filter: drop-shadow(0 0 3px var(--g));
}
.mk.mini .face {
  stroke-width: 7;
}

.cmt {
  fill: none;
  stroke: #FFFFFF;
  stroke-width: 2.4;
  stroke-linecap: round;
  opacity: 0.9;
}
.cg {
  stroke-dasharray: 24 490.7;
  animation: run-g 4.5s linear infinite;
}
.cm {
  stroke-dasharray: 28 544;
  animation: run-m 4.5s linear infinite;
}
.l-mr .cm {
  animation-delay: -2.25s;
}
.beam {
  stroke: var(--c);
  stroke-width: 2;
  stroke-linecap: round;
  animation: flick 3.2s ease-in-out infinite;
}
.drop {
  fill: none;
  stroke: #FFFFFF;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-dasharray: 18 140;
  stroke-dashoffset: 18;
  animation: drop 2.8s cubic-bezier(0.5, 0, 0.8, 1) 1.8s infinite;
}

.mk.anim {
  animation: mkfloat 6s ease-in-out infinite;
}
.mk.anim .face {
  stroke-dasharray: 580;
  animation: trace 1.8s cubic-bezier(0.6, 0, 0.2, 1) both, fillin 1s 1.1s ease both;
}
.mk.anim .l-ml .face {
  animation-delay: 0.15s, 1.25s;
}
.mk.anim .l-mr .face {
  animation-delay: 0.3s, 1.4s;
}
.mk.anim:hover .l-g { transform: translateY(-10px); }
.mk.anim:hover .l-ml { transform: translate(-8px, 4px); }
.mk.anim:hover .l-mr { transform: translate(8px, 4px); }
.mk.anim:hover .l-b { transform: translateY(-14px); }

@keyframes run-g { to { stroke-dashoffset: -514.7; } }
@keyframes run-m { to { stroke-dashoffset: -572; } }
@keyframes drop {
  0% { stroke-dashoffset: 18; }
  70%, 100% { stroke-dashoffset: -122; }
}
@keyframes trace {
  from { stroke-dashoffset: 580; }
  to { stroke-dashoffset: 0; }
}
@keyframes fillin {
  from { fill-opacity: 0; }
  to { fill-opacity: 1; }
}
@keyframes flick {
  0%, 100% { opacity: 1; }
  44% { opacity: 0.3; }
  48% { opacity: 1; }
  53% { opacity: 0.5; }
  58% { opacity: 1; }
}
@keyframes mkfloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
</style>
