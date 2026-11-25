<template>
  <!-- ARC Raiders: las cinco franjas de color entran en diagonal y una retícula fija el objetivo. -->
  <div class="gl-screen gl-arc">
    <div class="stripes" aria-hidden="true"><i v-for="c in COLORS" :key="c" :style="{ '--c': c }"></i></div>
    <div class="ret" aria-hidden="true"><b></b><b></b><b></b><b></b><span class="scan"></span></div>
    <span class="gl-txt">Subiendo a la superficie…</span>
  </div>
</template>

<script setup>
const COLORS = ["#E5372B", "#F28A1E", "#F5C02A", "#2FB45A", "#3BC9E8"];
</script>

<style scoped>
.gl-arc { background: #0b0b0e; color: #f5c02a; }
.stripes { position: absolute; top: -30%; right: 12%; width: min(300px, 40vw); height: 160%; display: flex; transform: rotate(24deg); }
.stripes i { flex: 1; background: var(--c); transform: translateY(120%); animation: up 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.stripes i:nth-child(2) { animation-delay: 0.07s; } .stripes i:nth-child(3) { animation-delay: 0.14s; }
.stripes i:nth-child(4) { animation-delay: 0.21s; } .stripes i:nth-child(5) { animation-delay: 0.28s; }
.ret { position: relative; width: 150px; height: 150px; opacity: 0; animation: fade 0.4s ease 0.55s forwards; }
.ret b { position: absolute; width: 26px; height: 26px; border: 3px solid #f5c02a; }
.ret b:nth-child(1) { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.ret b:nth-child(2) { top: 0; right: 0; border-left: 0; border-bottom: 0; }
.ret b:nth-child(3) { bottom: 0; left: 0; border-right: 0; border-top: 0; }
.ret b:nth-child(4) { bottom: 0; right: 0; border-left: 0; border-top: 0; }
.scan { position: absolute; left: 10px; right: 10px; top: 0; height: 2px; background: #f5c02a; box-shadow: 0 0 12px #f5c02a; animation: scan 1.4s ease-in-out 0.8s infinite alternate; }
@keyframes up { to { transform: none; } }
@keyframes fade { to { opacity: 1; } }
@keyframes scan { to { transform: translateY(146px); } }
</style>
