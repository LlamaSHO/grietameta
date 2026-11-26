<template>
  <div ref="screen" class="camp">
    <div class="journal">
      <svg viewBox="0 0 520 322" aria-hidden="true">
        <defs>
          <linearGradient id="astra-paper"><stop stop-color="#c9b584"/><stop offset=".09" stop-color="#eddfb9"/><stop offset=".84" stop-color="#e8d7ae"/><stop offset="1" stop-color="#bfaa7d"/></linearGradient>
          <path id="astra-track" d="M0 8q-4-3-2-7l-4-6q-1-3 2-1l4 3 1-8q1-3 2 0l1 8 5-4q3-1 1 2l-5 7q0 6-5 6z"/>
          <g id="astra-frond" fill="#647548" stroke="#475639" stroke-width=".8">
            <path d="M0 0Q9-36 3-83" fill="none" stroke-width="2"/>
            <path v-for="n in 6" :key="n" :transform="`translate(${n<4 ? n : 7-n} ${-n*10}) scale(${1.1-n*.09})`" d="M0 0q-16-2-23-21Q-6-19 0 0m1-3q2-18 21-24Q17-11 1-3"/>
          </g>
        </defs>
        <g transform="rotate(-3 260 160)">
          <path fill="#634932" stroke="#352d20" stroke-width="3" d="M31 44Q142 19 260 49q108-30 228-6v239q-120-20-228 5-102-22-229-1z"/>
          <path fill="url(#astra-paper)" stroke="#ab956b" d="M39 35q107-23 221 8v235q-115-24-221-2z"/>
          <g opacity=".38" fill="none" stroke="#b69e73">
            <path v-for="n in 11" :key="n" :d="`M55 ${59+n*17}q91-17 186 5`"/>
          </g>
          <text x="62" y="75" class="ink">Notas de campo</text>
          <path class="pencil" d="M61 82q59-11 115-3" fill="none" stroke="#806e50" stroke-width="1.6"/>
          <g transform="translate(123 205) rotate(-19) scale(1.26)"><use href="#astra-frond"/></g>
          <g transform="translate(132 205) rotate(34) scale(.86)"><use href="#astra-frond"/></g>
          <path fill="#d7bb81" opacity=".83" d="m101 190 49-12 4 12-50 13z"/>
          <g transform="translate(194 118) rotate(14)" fill="#72654a">
            <use v-for="(p,i) in tracks" :key="i" href="#astra-track" class="track" :transform="`translate(${p}) scale(.64)`"/>
          </g>
          <text x="68" y="244" class="annotation">Rastro de terópodo</text>
          <g class="leaf">
            <path fill="url(#astra-paper)" stroke="#ab956b" d="M260 43q104-27 219-9v238q-105-19-219 6z"/>
            <path fill="none" stroke="#b6a27d" d="M269 51q93-22 199-10v220q-100-14-199 6z"/>
            <text x="290" y="75" class="annotation">Los tres obeliscos</text>
            <g fill="none" stroke="#8b9475">
              <path d="m278 197 29-27 18 12 34-46 24 31 17-16 61 40m-181 13 43-15 29 5 36-20 59 22"/>
              <path d="m280 211 55-10 43 6 60-9m-135 21 44-8 38 4"/>
            </g>
            <g v-for="(ob,i) in obelisks" :key="ob.color" :transform="`translate(${ob.x} ${ob.y})`">
              <path class="stone" :fill="ob.color" stroke="#5d574b" d="m0-29 9 10-4 31-5 13-5-13-4-31z"/>
              <path d="m0-25 5 7-5 5-5-5z" fill="#f8ecd0"/>
              <path class="pencil" d="m0-12 0 30m-12 19h24" fill="none" stroke="#615e4e"/>
              <text y="51" text-anchor="middle" class="field-num">{{ ['I','II','III'][i] }}</text>
            </g>
            <path class="pencil" d="M281 230q64-13 123-3m-123 9q40-8 75-6" fill="none" stroke="#ae9a74"/>
            <path fill="#ab5544" d="m435 29 13 1v30l-6-6-7 5z"/>
          </g>
          <path d="M260 43v235" stroke="#82704f" stroke-width="2"/>
        </g>
      </svg>
      <p>Diario del explorador</p>
      <small><i></i>Abriendo el dosier</small>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { createTimeline, stagger, svg } from "animejs";

const obelisks = [
  { x: 305, y: 143, color: "#af594a" },
  { x: 365, y: 113, color: "#648d9f" },
  { x: 426, y: 141, color: "#789456" },
];
const tracks = ["0 0", "9 19", "2 38", "11 57"];
const screen = ref(null);
let entry;
onMounted(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const find = (selector) => screen.value.querySelectorAll(selector);
  entry = createTimeline()
    .add(find(".journal"), { opacity: [0, 1], y: [10, 0], duration: 360 }, 0)
    .add(find(".leaf"), { scaleX: [.025, 1], duration: 670, ease: "outCubic" }, 60)
    .add(svg.createDrawable(find(".pencil")), { draw: ["0 0", "0 1"], duration: 430, delay: stagger(45) }, 420)
    .add(find(".track"), { opacity: [0, .85], duration: 210, delay: stagger(80) }, 770);
});
onBeforeUnmount(() => entry?.revert());
</script>

<style scoped>
@font-face { font-family:AstraKalam; src:local("Kalam Bold"),url("/images/ark/fonts/Kalam-Bold.ttf") format("truetype"); font-weight:700; font-display:swap; }
.camp { position:absolute; inset:0; display:grid; place-items:center; overflow:hidden; background:radial-gradient(ellipse at 50% 38%,#344438,#202e25 45%,#121d19 86%); }
.journal { width:min(96vw,590px,105vh); text-align:center; }
svg { display:block; width:100%; }
.ink,.annotation { fill:#494833; font:700 18px AstraKalam,"Segoe Print",cursive; }
.annotation { font-size:13px; }
.field-num { font:10px Georgia,serif; fill:#565240; }
.leaf { transform-box:fill-box; transform-origin:left center; }
p { margin:0 0 2px; font:700 clamp(25px,5vw,38px)/1.4 AstraKalam,"Segoe Print",cursive; color:#ece1bd; }
small { display:inline-flex; gap:9px; align-items:center; color:#bbcab5; font:500 12px/1.5 system-ui; letter-spacing:.08em; }
i { width:6px; height:6px; border-radius:50%; background:#bfce95; }
@media (prefers-reduced-motion:no-preference) { i { animation: ink 1.4s ease-in-out 1.2s infinite alternate; } }
@keyframes ink { to { opacity:.3; } }
</style>
