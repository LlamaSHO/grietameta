<template>
  <!-- LoL: hexágono hextech dorado que se dibuja, anillo de runas y núcleo azul. -->
  <div class="gl-screen gl-lol">
    <svg class="hex" viewBox="0 0 200 200" aria-hidden="true">
      <circle class="ring" cx="100" cy="100" r="92" />
      <polygon class="frame" points="100,22 167.5,61 167.5,139 100,178 32.5,139 32.5,61" />
      <polygon class="frame in" points="100,48 145,74 145,126 100,152 55,126 55,74" />
      <path class="core" d="M100 74 L118 100 L100 126 L82 100 Z" />
    </svg>
    <span class="gl-txt">Invocando la Grieta…</span>
  </div>
</template>

<style scoped>
.gl-lol { background: radial-gradient(520px 380px at 50% 46%, rgba(10, 200, 185, 0.14), transparent 70%), #0a0e14; color: #d9b56e; }
.hex { width: min(230px, 56vw); height: auto; overflow: visible; }
.ring { fill: none; stroke: rgba(10, 200, 185, 0.55); stroke-width: 1.2; stroke-dasharray: 2 7; transform-origin: 100px 100px; animation: spin 6s linear infinite; }
.frame { fill: none; stroke: #d9b56e; stroke-width: 2.4; stroke-linejoin: round; stroke-dasharray: 470; stroke-dashoffset: 470; animation: draw 1s cubic-bezier(0.6, 0, 0.2, 1) forwards; }
.frame.in { stroke: rgba(217, 181, 110, 0.55); stroke-width: 1.4; stroke-dasharray: 312; stroke-dashoffset: 312; animation-delay: 0.25s; }
.core { fill: #0ac8b9; opacity: 0; transform-origin: 100px 100px; animation: core 0.6s ease-out 0.75s forwards, pulse 1.6s ease-in-out 1.35s infinite; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes core { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: none; } }
@keyframes pulse { 50% { opacity: 0.55; } }
</style>
