<template>
  <!-- Pantalla de carga al entrar en un juego. Sale nada más pulsar el enlace
       (antes de que llegue el código de la página), bloquea la interacción y
       se va cuando la página, sus datos y las imágenes de la primera pantalla
       están listos. Cada juego tiene su pantalla en esta carpeta; todas son
       SVG y CSS, sin imágenes, y se importan bajo demanda. -->
  <div v-if="game" class="gl-host" :class="{ out: leaving }" role="status" aria-live="polite" :aria-label="`Cargando ${label}`" @transitionend.self="onFaded">
    <component :is="LOADERS[game]" />
    <span class="gl-static">Cargando {{ label }}…</span>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { awaitScreen } from "@/services/splash";
import { GAME_NAVS } from "@/components/nav/games";

const importers = {
  lol: () => import("./LolLoader.vue"),
  "arc-raiders": () => import("./ArcLoader.vue"),
  "zelda-totk": () => import("./ZeldaLoader.vue"),
  pokemon: () => import("./PokemonLoader.vue"),
  "assassins-creed": () => import("./AcLoader.vue"),
  "cod-zombis": () => import("./CodLoader.vue"),
  ark: () => import("./ArkLoader.vue"),
};
const LOADERS = Object.fromEntries(Object.entries(importers).map(([k, f]) => [k, defineAsyncComponent(f)]));

const router = useRouter();
const game = ref(null);
const leaving = ref(false);
const label = ref("");
let current;
let fadeTimer;
let target;
let startedAt;

function clear() {
  clearTimeout(fadeTimer);
  current?.abort();
  current = null;
  target = null;
  leaving.value = false;
  game.value = null;
  document.documentElement.classList.remove("game-loading");
}

const removeBefore = router.beforeEach((to, from) => {
  if (current) clear();
  const slug = to.meta.game;
  if (!importers[slug] || slug === from.meta.game || (!from.matched.length && document.querySelector("#gm-splash"))) return;
  current = new AbortController();
  target = to;
  startedAt = performance.now();
  game.value = slug;
  label.value = GAME_NAVS[slug]?.name || "";
  document.documentElement.classList.add("game-loading");
});

const removeAfter = router.afterEach(async (to, from, failure) => {
  if (to !== target) return;
  if (failure) return clear();
  const ticket = current;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minimum = reduced ? 0 : Math.max(0, 1100 - (performance.now() - startedAt));
  await Promise.all([awaitScreen(ticket.signal), new Promise((resolve) => setTimeout(resolve, minimum))]);
  if (ticket !== current) return;
  if (reduced) return clear();
  leaving.value = true;
  fadeTimer = setTimeout(onFaded, 450);
});

function onFaded() {
  if (leaving.value) clear();
}

const removeError = router.onError((_error, to) => { if (to === target) clear(); });
onBeforeUnmount(() => {
  removeBefore();
  removeAfter();
  removeError();
  clear();
});
</script>

<style>
.gl-host {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: auto;
  background: #0a0e14;
  cursor: progress;
  opacity: 1;
  transition: opacity 0.38s ease;
}
.gl-host.out {
  opacity: 0;
}
html.game-loading .app-main *,
html.game-loading .app-main *::before,
html.game-loading .app-main *::after { animation-play-state: paused !important; }
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
.gl-static { display: none; }
@media (prefers-reduced-motion: reduce) {
  .gl-static { position:absolute; inset:0; display:grid; place-items:center; background:#0a0e14; color:#eee6d5; }
  .gl-screen { visibility:hidden; }
  .gl-host { transition: none; }
  .gl-screen *, .gl-screen *::after, .gl-screen *::before { animation: none !important; }
}
</style>
