<template>
  <!-- Emblema GM animado con halo que respira y anillo discontinuo que gira
       (.emblem de models/paginas/Main.dc.html). Se usa en la portada y en la 404. -->
  <div class="emblem" aria-hidden="true">
    <span class="eh"></span>
    <span class="er"></span>
    <GmMark :size="104" animated />
  </div>
</template>

<script setup>
import GmMark from "@/components/brand/GmMark.vue";
</script>

<style scoped>
.emblem {
  position: relative;
  width: 132px;
  height: 154px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  animation: gm-rise 0.9s var(--ease-out) both;
}
.eh {
  position: absolute;
  width: 230px;
  height: 230px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(243, 200, 120, 0.18), rgba(255, 106, 61, 0.08) 42%, rgba(79, 224, 182, 0.06) 58%, transparent 70%);
  animation: breathe 5s ease-in-out infinite;
  pointer-events: none;
}
.er {
  position: absolute;
  width: 196px;
  height: 196px;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  animation: gm-spin 40s linear infinite;
  pointer-events: none;
}
@keyframes breathe {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}
</style>
