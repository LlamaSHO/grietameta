<template>
  <!-- CoD Zombis: el pistolero a contraluz, manos de zombi que salen del suelo,
       brasas que suben y las rayas rojas de la ronda que se dibujan. -->
  <div class="gl-screen gl-cod">
    <i class="glow" aria-hidden="true"></i>
    <svg class="gun" viewBox="0 0 200 262" aria-hidden="true">
      <g class="body">
        <ellipse cx="100" cy="36" rx="15" ry="18" />
        <path d="M84 50h32l2 10H82z" />
        <path d="M68 62Q100 50 132 62L140 118L152 198Q134 204 118 198L114 252H100L100 204L86 252H72L82 198Q66 204 48 198L60 118Z" />
        <path d="M70 62L82 74L40 142L28 136Z" />
        <path d="M130 62L118 74L160 142L172 136Z" />
        <path d="M18 132L34 127L36 135L28 138L31 150L24 152L21 140L16 141Z" />
        <path d="M182 132L166 127L164 135L172 138L169 150L176 152L179 140L184 141Z" />
      </g>
    </svg>
    <svg class="hands" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
      <path class="h h1" d="M40 120L46 70L40 52L46 50L50 66L52 44L58 44L58 64L62 46L68 48L66 68L72 56L77 59L68 82L72 120Z" />
      <path class="h h2" d="M330 120L334 78L326 62L332 58L338 72L340 52L346 52L346 72L351 56L357 58L354 76L361 66L366 69L356 90L360 120Z" />
      <path class="h h3" d="M250 120L253 92L247 82L252 79L256 88L258 74L263 74L263 88L267 77L271 79L269 92L276 86L279 89L271 102L274 120Z" />
    </svg>
    <i v-for="n in 9" :key="n" class="ember" :style="{ left: `${8 + n * 9.5}%`, animationDelay: `${(n % 4) * 0.35}s` }" aria-hidden="true"></i>
    <div class="round" aria-hidden="true">
      <svg viewBox="0 0 120 70"><path class="t t1" d="M18 8 L14 62" /><path class="t t2" d="M38 8 L34 62" /><path class="t t3" d="M58 8 L54 62" /><path class="t t4" d="M78 8 L74 62" /><path class="t t5" d="M4 50 L100 18" /></svg>
    </div>
    <span class="gl-txt">Cargando ronda 1…</span>
  </div>
</template>

<style scoped>
.gl-cod { background: radial-gradient(55% 50% at 50% 55%, #2a1206 0, #120804 45%, #050404 78%); color: #ffb070; }
.glow { position: absolute; width: 60vmin; height: 60vmin; border-radius: 50%; background: radial-gradient(closest-side, rgba(255, 90, 20, 0.35), transparent); opacity: 0; animation: fade 1.2s ease forwards; }
.gun { position: relative; width: min(250px, 52vw); height: auto; overflow: visible; opacity: 0; transform: translateY(26px) scale(0.94); animation: rise 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards; }
.body path, .body ellipse { fill: #050404; stroke: #ff8a3d; stroke-width: 1.3; stroke-linejoin: round; }
.hands { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 22vh; }
.h { fill: #0b0705; stroke: #7a2a10; stroke-width: 1; transform: translateY(70%); animation: claw 0.9s cubic-bezier(0.3, 1.4, 0.5, 1) forwards; }
.h1 { animation-delay: 0.5s; } .h2 { animation-delay: 0.75s; } .h3 { animation-delay: 1s; }
.ember { position: absolute; bottom: 8vh; width: 3px; height: 3px; border-radius: 50%; background: #ff9a4d; box-shadow: 0 0 8px #ff6a1a; opacity: 0; animation: ember 2.6s ease-out infinite; }
.round { position: absolute; top: 12vh; left: 50%; width: 120px; margin-left: -60px; }
.round svg { width: 100%; overflow: visible; }
.t { fill: none; stroke: #c4170f; stroke-width: 7; stroke-linecap: round; stroke-dasharray: 110; stroke-dashoffset: 110; animation: draw 0.28s ease-out forwards; }
.t1 { animation-delay: 0.6s; } .t2 { animation-delay: 0.85s; } .t3 { animation-delay: 1.1s; } .t4 { animation-delay: 1.35s; } .t5 { animation-delay: 1.6s; }
@keyframes fade { to { opacity: 1; } }
@keyframes rise { to { opacity: 1; transform: none; } }
@keyframes claw { to { transform: none; } }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes ember { 15% { opacity: 1; } to { opacity: 0; transform: translate(14px, -50vh); } }
</style>
