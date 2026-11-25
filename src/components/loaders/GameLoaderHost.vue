<template>
  <!-- Pantalla de carga al entrar en un juego. Sale nada más pulsar el enlace
       (antes de que llegue el código de la página), bloquea la interacción y
       se va cuando la página, sus datos y las imágenes de la primera pantalla
       están listos. Cada juego tiene su pantalla en esta carpeta; todas son
       SVG y CSS, sin imágenes, y se precargan al abrir la web para que salgan
       al instante. -->
  <div v-if="game" class="gl-host" :class="{ out: leaving }" role="status" aria-live="polite" :aria-label="`Cargando ${label}`" @transitionend.self="onFaded">
    <component :is="LOADERS[game]" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, nextTick, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { loadTracker } from "@/services/loadTracker";
import { GAME_NAVS } from "@/components/nav/games";

const importers = {
  lol: () => import("./LolLoader.vue"),
  "arc-raiders": () => import("./ArcLoader.vue"),
  "zelda-totk": () => import("./ZeldaLoader.vue"),
  pokemon: () => import("./PokemonLoader.vue"),
  "cod-zombis": () => import("./CodLoader.vue"),
  ark: () => import("./ArkLoader.vue"),
};
const LOADERS = Object.fromEntries(Object.entries(importers).map(([k, f]) => [k, defineAsyncComponent(f)]));

const MIN_MS = 1100; // lo justo para que se vea la animación de entrada
const MAX_MS = 7000; // nunca se queda colgada

const router = useRouter();
const game = ref(null);
const leaving = ref(false);
const label = ref("");
let startedAt = 0;
let routeReady = false;
let run = 0;

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Precarga de las pantallas (pesan muy poco) cuando el navegador está libre.
const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
idle(() => Object.values(importers).forEach((f) => f().catch(() => {})));

router.beforeEach((to, from) => {
  const g = to.meta.game;
  // Solo al entrar en un juego desde fuera de él (no entre sus páginas).
  if (!g || g === from.meta.game || !importers[g] || reduced) return true;
  run++;
  game.value = g;
  label.value = GAME_NAVS[g]?.name || "";
  leaving.value = false;
  routeReady = false;
  startedAt = performance.now();
  return true;
});

router.afterEach((to, from, failure) => {
  if (!game.value) return;
  if (failure) { finish(); return; }
  routeReady = true;
  settle(run);
});

async function settle(id) {
  await nextTick();
  // 1. Que terminen las peticiones de datos de la página.
  await until(() => loadTracker.pending === 0, id);
  await nextTick();
  // 2. Que estén decodificadas las imágenes que se ven nada más entrar.
  const imgs = [...document.querySelectorAll(".app-main img")].filter((im) => {
    if (im.loading === "lazy") return false;
    const r = im.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0 && r.width > 0;
  });
  await Promise.race([Promise.all(imgs.map((im) => im.decode().catch(() => {}))), wait(2500)]);
  // 3. Un mínimo para que la animación se lea.
  const left = MIN_MS - (performance.now() - startedAt);
  if (left > 0) await wait(left);
  if (id === run) finish();
}

function until(cond, id) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = () => {
      if (id !== run || cond() || performance.now() - t0 > MAX_MS) resolve();
      else setTimeout(tick, 60);
    };
    tick();
  });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function finish() {
  if (!game.value || leaving.value) return;
  leaving.value = true;
  // No depende solo de transitionend (no llega si las transiciones están desactivadas).
  const id = run;
  setTimeout(() => { if (id === run) onFaded(); }, 450);
}
function onFaded() {
  if (leaving.value) {
    game.value = null;
    leaving.value = false;
  }
}

// Seguridad: si algo falla, se va igualmente.
watch(game, (g) => {
  if (!g) return;
  const id = run;
  setTimeout(() => { if (id === run && game.value) finish(); }, MAX_MS + 1500);
});
</script>

<style>
.gl-host {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: auto;
  cursor: progress;
  opacity: 1;
  transition: opacity 0.38s ease;
}
.gl-host.out {
  opacity: 0;
  pointer-events: none;
}
/* Base común de las pantallas: ocupan todo y centran su dibujo. */
.gl-screen {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
}
.gl-txt {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14vh;
  text-align: center;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}
@media (prefers-reduced-motion: reduce) {
  .gl-host { display: none; }
}
</style>
