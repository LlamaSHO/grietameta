<template>
  <div class="gl-screen ac-loader">
    <div class="animus-mark" aria-hidden="true">
      <svg class="insignia" viewBox="0 0 96 96" fill="none">
        <path d="M48 9 76 81 48 64 20 81 48 9Z" />
        <path d="m48 26-16 42 16-10 16 10-16-42Z" />
        <path d="M37 48h22M42 36h12M42 57h12M48 14v72" />
      </svg>
      <svg class="orbit orbit-outer" viewBox="0 0 142 142" fill="none">
        <circle cx="71" cy="71" r="67" />
        <path d="M71 1v12M141 71h-12M71 141v-12M1 71h12" />
      </svg>
      <svg class="orbit orbit-inner" viewBox="0 0 118 118" fill="none">
        <circle cx="59" cy="59" r="55" />
        <path d="M59 4v9m55 46h-9m-46 55v-9M4 59h9" />
      </svg>
      <span class="dna-strand dna-first"></span>
      <span class="dna-strand dna-second"></span>
    </div>
    <svg class="memory-lines" viewBox="0 0 240 22" fill="none" aria-hidden="true">
      <path d="M1 11h61l9-7 8 14 9-14 8 14 9-7h74" />
      <circle cx="220" cy="11" r="7" />
      <circle cx="220" cy="11" r="2" />
    </svg>
    <span class="gl-txt" aria-live="off">{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const message = computed(() =>
  route.path.startsWith("/assassins-creed/unity")
    ? "Cargando la memoria de Arno"
    : "Cargando antepasados",
);
</script>

<style scoped>
.ac-loader {
  isolation: isolate;
  color: #e6f1f7;
  background:
    radial-gradient(ellipse at 50% 42%, #112630 0%, #09121b 40%, #05080d 78%);
  --ice: #8fe3ff;
}
.ac-loader::before,
.ac-loader::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  content: "";
}
.ac-loader::before {
  opacity: .55;
  background-image:
    linear-gradient(#8fe3ff09 1px, transparent 1px),
    linear-gradient(90deg, #8fe3ff09 1px, transparent 1px);
  background-size: 44px 44px;
}
.ac-loader::after {
  inset: 18px;
  border: 1px solid #8fe3ff18;
  clip-path: polygon(0 0, 14% 0, 14% 1px, 1px 1px, 1px 14%, 0 14%, 0 0,
    86% 0, 100% 0, 100% 14%, calc(100% - 1px) 14%, calc(100% - 1px) 1px, 86% 1px,
    86% 0, 0 86%, 14% 86%, 14% calc(100% - 1px), 1px calc(100% - 1px),
    1px 86%, 0 86%, 100% 86%, 100% 100%, 86% 100%, 86% calc(100% - 1px),
    calc(100% - 1px) calc(100% - 1px), calc(100% - 1px) 86%, 100% 86%);
}
.animus-mark {
  position: relative;
  display: grid;
  width: 142px;
  aspect-ratio: 1;
  place-items: center;
  margin-bottom: 30px;
  color: var(--ice);
}
.insignia { position: relative; z-index: 1; width: 62px; height: 62px; }
.insignia > *:first-child {
  fill: #8fe3ff08;
  stroke: #bcf0ff;
  stroke-width: 1.8;
  stroke-linejoin: bevel;
}
.insignia > *:not(:first-child) {
  stroke: #68b9d0;
  stroke-width: 1;
  stroke-linecap: square;
}
.orbit { position: absolute; inset: 0; width: 100%; height: 100%; }
.orbit circle { stroke: #8fe3ff40; stroke-width: 1; }
.orbit path { stroke: #8fe3ff90; stroke-width: 1.5; stroke-linecap: square; }
.orbit-inner { inset: 12px; width: calc(100% - 24px); height: calc(100% - 24px); opacity: .5; }
.dna-strand {
  position: absolute;
  left: 70px;
  top: 15px;
  width: 2px;
  height: 112px;
  border-radius: 2px;
  background: repeating-linear-gradient(180deg, transparent 0 5px, #8fe3ffb0 5px 7px, transparent 7px 12px);
  transform-origin: 1px 56px;
  animation: ac-strand-out 1.05s cubic-bezier(.2,.7,.2,1) 1 both;
}
.dna-first { animation-name: ac-strand-first; }
.dna-second { animation-name: ac-strand-second; background-image: repeating-linear-gradient(180deg, transparent 0 5px, #e9f8ff70 5px 7px, transparent 7px 12px); }
.memory-lines { width: min(240px, 62vw); height: 22px; margin-top: 2px; }
.memory-lines path { stroke: #8fe3ff72; stroke-width: 1; stroke-linecap: square; stroke-linejoin: bevel; }
.memory-lines circle:first-of-type { fill: #09141d; stroke: #8fe3ffb0; stroke-width: 1; }
.memory-lines circle:last-of-type { fill: #e9f8ff; }
.gl-txt {
  bottom: 14vh;
  color: #dceef6;
  font-size: 12px;
  letter-spacing: .22em;
}
@keyframes ac-strand-first {
  0% { opacity: .25; transform: rotate(-24deg) scaleY(.35) translateX(-16px); }
  75% { opacity: 1; }
  100% { opacity: .78; transform: rotate(0) scaleY(1); }
}
@keyframes ac-strand-second {
  0% { opacity: .2; transform: rotate(24deg) scaleY(.35) translateX(16px); }
  75% { opacity: .85; }
  100% { opacity: .62; transform: rotate(0) scaleY(1); }
}
@media (prefers-reduced-motion: reduce) {
  .dna-strand { animation: none; opacity: .7; }
}
</style>
