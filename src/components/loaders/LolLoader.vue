<template>
  <div ref="screen" class="atlas">
    <div class="plate">
      <svg viewBox="0 0 440 310" aria-hidden="true">
        <defs>
          <linearGradient id="astra-brass" x2=".36" y2="1" gradientUnits="objectBoundingBox">
            <stop stop-color="#fff0b0"/><stop offset=".32" stop-color="#b39056"/>
            <stop offset=".58" stop-color="#efd49a"/><stop offset="1" stop-color="#705131"/>
          </linearGradient>
          <linearGradient id="astra-water" x2="1" y2="1"><stop stop-color="#104653"/><stop offset="1" stop-color="#07212c"/></linearGradient>
          <clipPath id="astra-map"><path d="m220 48 98 98-98 98-98-98z"/></clipPath>
        </defs>
        <g fill="none" stroke="#59716e">
          <circle cx="220" cy="146" r="122" stroke-dasharray="1 8"/>
          <path d="M38 146h51m262 0h51M220 7v12m0 254v14"/>
        </g>
        <g v-for="side in [1,-1]" :key="side" :transform="side === 1 ? '' : 'translate(440 0) scale(-1 1)'">
          <path d="m53 102 79 37 44 64-51-33-28-30 28 14-43-31z" fill="url(#astra-brass)"/>
          <path d="m79 138 39 22 31 37-44-27z" fill="#876742"/>
          <path d="m102 171 34 23 24 24-38-24z" fill="#4e4839"/>
        </g>
        <path d="m220 29 117 117-117 117-117-117z" fill="#0e2027" stroke="url(#astra-brass)" stroke-width="3"/>
        <g clip-path="url(#astra-map)">
          <path fill="url(#astra-water)" d="M115 44h210v205H115z"/>
          <g fill="none" stroke="#37615d" stroke-width="1.4">
            <path v-for="n in 6" :key="n" :transform="`translate(${n*5} ${-n*3})`" d="M109 141q18-42 47-29t31-34q6-26 40-25m-38 181q39-8 36-32t36-41q23-9 20-39t38-36"/>
          </g>
          <path d="M134 90q19 43 49 47t49 25 48 13 31 29" fill="none" stroke="#16434b" stroke-width="17"/>
          <path class="engrave" d="M134 90q19 43 49 47t49 25 48 13 31 29" fill="none" stroke="#72ccca" stroke-width="2"/>
          <g fill="none" stroke="#cdb779" stroke-width="2.4" stroke-linejoin="round">
            <path class="engrave" d="m191 195-42-46 74-75 33 24m-65 97 65-97m-65 97 29 22 65-68-29-51"/>
          </g>
          <g v-for="point in [[191,195],[256,98],[180,118],[256,179]]" :key="point[0]+'-'+point[1]" :transform="`translate(${point.join(' ')})`">
            <path class="rune" d="m0-6 5 6-5 6-5-6z" fill="#ffe3a0" stroke="#312b21"/>
          </g>
        </g>
        <path class="engrave" d="m220 43 103 103-103 103-103-103z" fill="none" stroke="url(#astra-brass)" stroke-width="2"/>
        <g transform="translate(220 37)">
          <path d="m0-20 13 19L0 17-13-1z" fill="#45c3c9" stroke="#e0bd80" stroke-width="2"/>
          <path d="M0-17V12l10-13z" fill="#166073"/>
        </g>
        <path d="m198 249 22 14 22-14-22 32z" fill="url(#astra-brass)"/>
      </svg>
      <p>La Grieta del Invocador</p>
      <small><i></i>Invocando</small>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { createTimeline, stagger, svg } from "animejs";

const screen = ref(null);
let entry;
onMounted(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const find = (selector) => screen.value.querySelectorAll(selector);
  entry = createTimeline()
    .add(find(".plate"), { opacity: [0, 1], y: [8, 0], duration: 430 }, 0)
    .add(svg.createDrawable(find(".engrave")), { draw: ["0 0", "0 1"], ease: "inOutQuad", duration: 700, delay: stagger(65) }, 100)
    .add(find(".rune"), { opacity: [0, 1], duration: 250, delay: stagger(65) }, 750);
});
onBeforeUnmount(() => entry?.revert());
</script>

<style scoped>
.atlas { position:absolute; inset:0; display:grid; place-items:center; overflow:hidden; color:#edd4a2; background:radial-gradient(ellipse at 50% 43%,#153339 0%,#0a1a21 35%,#070e14 75%); }
.plate { width:min(92vw,510px,90vh); text-align:center; }
svg { display:block; width:100%; }
p { margin:-2% 0 15px; font:500 clamp(22px,4.8vw,36px)/1.1 Cinzel,Georgia,serif; }
small { display:inline-flex; align-items:center; gap:10px; font:600 10px/1.4 system-ui; letter-spacing:.24em; text-transform:uppercase; color:#a7c2c2; }
i { width:5px; height:5px; background:#75d6d7; transform:rotate(45deg); }
@media (prefers-reduced-motion:no-preference) { i { animation: beacon 1.4s ease-in-out 1.2s infinite alternate; } }
@keyframes beacon { to { opacity:.3; } }
</style>
