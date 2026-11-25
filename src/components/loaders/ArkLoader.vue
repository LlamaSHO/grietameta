<template>
  <!-- ARK: los tres obeliscos (rojo, azul y verde) se encienden y lanzan su haz
       sobre la jungla; el diario se abre con una nota manuscrita. -->
  <div class="gl-screen gl-ark">
    <div class="obs" aria-hidden="true">
      <span v-for="(c, i) in COLORS" :key="c" class="ob" :style="{ '--c': c, animationDelay: `${0.15 + i * 0.2}s` }"><i class="beam"></i><svg viewBox="0 0 40 120"><path d="M20 0 L40 30 L32 120 L8 120 L0 30 Z" /></svg></span>
    </div>
    <i class="leaf l1" aria-hidden="true"></i><i class="leaf l2" aria-hidden="true"></i>
    <span class="note">Abriendo el diario…</span>
  </div>
</template>

<script setup>
const COLORS = ["#E0493A", "#3E92E0", "#62B43C"];
</script>

<style scoped>
.gl-ark { background: radial-gradient(70% 60% at 50% 60%, rgba(60, 100, 30, 0.35), transparent 70%), #0f170c; }
.obs { display: flex; align-items: flex-end; gap: 46px; height: 170px; }
.ob { position: relative; width: 34px; opacity: 0; transform: translateY(30px); animation: rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.ob svg { display: block; width: 34px; height: auto; fill: #1d2416; stroke: var(--c); stroke-width: 2; }
.ob:nth-child(2) svg { width: 34px; transform: scale(1.18); transform-origin: bottom; }
.beam { position: absolute; left: 50%; bottom: 100%; width: 10px; height: 46vh; margin-left: -5px; background: linear-gradient(to top, var(--c), transparent); opacity: 0; transform: scaleY(0); transform-origin: bottom; animation: beam 0.9s ease-out 0.7s forwards; }
.leaf { position: absolute; width: 150px; height: 110px; background: radial-gradient(60% 40% at 30% 60%, #4e7a1e 60%, transparent 62%), radial-gradient(40% 30% at 70% 40%, #6c9a33 60%, transparent 62%); opacity: 0.8; }
.l1 { left: -20px; top: -10px; transform: rotate(20deg); }
.l2 { right: -20px; bottom: -10px; transform: rotate(200deg); }
.note { position: absolute; bottom: 13vh; padding: 8px 16px; background: #eae0c8; color: #2b2a1e; font: 700 20px/1.2 "Kalam", "Segoe Print", cursive; border-radius: 3px; box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45); opacity: 0; transform: rotate(-2deg) translateY(10px); animation: note 0.6s ease 1s forwards; }
@keyframes rise { to { opacity: 1; transform: none; } }
@keyframes beam { to { opacity: 0.55; transform: none; } }
@keyframes note { to { opacity: 1; transform: rotate(-2deg); } }
</style>
