<template>
  <!-- Corona en un hexágono con borde tricolor que gira (.crown de los diseños de Premium). -->
  <div class="crown" :class="{ off }" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
    <span class="cs" />
    <span class="ci">
      <svg :width="Math.round(size * 0.45)" :height="Math.round(size * 0.45)" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" />
      </svg>
    </span>
  </div>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 76 },
  // Apagada (suscripción cancelada o sin Premium): borde gris y sin giro.
  off: { type: Boolean, default: false },
});
</script>

<style scoped>
.crown {
  position: relative;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  overflow: hidden;
}
.cs {
  position: absolute;
  inset: -45%;
  background: conic-gradient(from 0deg, #F3C878, #FF6A3D, #4FE0B6, #F3C878);
  animation: gm-spin 7s linear infinite;
}
.ci {
  position: absolute;
  inset: 3px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: #14110B;
  display: grid;
  place-items: center;
  color: #F3C878;
}
.ci svg {
  animation: floaty 3.4s ease-in-out infinite;
}
.off .cs {
  background: conic-gradient(from 0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0.3));
  animation: none;
}
.off .ci {
  color: #8F98A5;
  background: #11141A;
}
@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>
