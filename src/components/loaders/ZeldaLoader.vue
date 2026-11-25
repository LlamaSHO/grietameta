<template>
  <!-- Zelda: círculos de luz que se trazan sobre el cielo de Hyrule y motas que suben. -->
  <div class="gl-screen gl-zelda">
    <svg class="orb" viewBox="0 0 200 200" aria-hidden="true">
      <circle class="c c1" cx="100" cy="100" r="86" />
      <circle class="c c2" cx="100" cy="100" r="62" />
      <circle class="c c3" cx="100" cy="100" r="38" />
      <path class="spiral" d="M100 100m0-14a14 14 0 1 1-14 14a20 20 0 0 1 20-20a26 26 0 0 1 26 26" />
      <circle class="dot" cx="100" cy="100" r="5" />
    </svg>
    <i v-for="n in 7" :key="n" class="mote" :style="{ left: `${12 + n * 11}%`, animationDelay: `${n * 0.12}s` }" aria-hidden="true"></i>
    <span class="gl-txt">Despertando en Hyrule…</span>
  </div>
</template>

<style scoped>
.gl-zelda { background: radial-gradient(560px 420px at 50% 44%, rgba(79, 224, 182, 0.16), transparent 70%), #071211; color: #4fe0b6; }
.orb { width: min(220px, 54vw); height: auto; overflow: visible; }
.c { fill: none; stroke: #4fe0b6; stroke-width: 1.6; stroke-dasharray: 560; stroke-dashoffset: 560; animation: draw 1.1s cubic-bezier(0.6, 0, 0.2, 1) forwards; }
.c2 { stroke-opacity: 0.7; animation-delay: 0.15s; } .c3 { stroke-opacity: 0.5; animation-delay: 0.3s; }
.spiral { fill: none; stroke: #b8fbe6; stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 160; stroke-dashoffset: 160; animation: draw 0.9s ease 0.55s forwards; }
.dot { fill: #e9fff7; opacity: 0; animation: fade 0.4s ease 1s forwards, pulse 1.8s ease-in-out 1.4s infinite; }
.mote { position: absolute; bottom: 18vh; width: 5px; height: 5px; border-radius: 50%; background: #9ff5d9; box-shadow: 0 0 10px #4fe0b6; opacity: 0; animation: rise 2.4s ease-out forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes fade { to { opacity: 1; } }
@keyframes pulse { 50% { opacity: 0.45; } }
@keyframes rise { 20% { opacity: 1; } to { opacity: 0; transform: translateY(-46vh); } }
</style>
