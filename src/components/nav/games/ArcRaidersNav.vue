<template>
  <RouterLink class="slink arc-link" :class="{ on: route.name === 'arc' }" :to="{ name: 'arc' }">Inicio</RouterLink>

  <div ref="mapMenu" class="arc-dropdown" :data-open="menu === 'maps'" @mouseenter="hover('maps')" @mouseleave="leave('maps')">
    <button class="slink arc-link" :class="{ on: route.name === 'arc-map' }" type="button" :aria-expanded="menu === 'maps'" aria-controls="arc-nav-map-list" @click="toggle('maps')">
      Mapas
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    <div id="arc-nav-map-list" v-show="menu === 'maps'" class="arc-mega arc-maps">
      <div class="mm">
        <RouterLink v-for="m in maps" :key="m.id" class="mo" :aria-current="route.name === 'arc-map' && route.params.mapa === m.id ? 'page' : undefined" :to="mapRoute(m.id)" @click="menu = ''">
          <span class="th"><img v-if="primed" :src="m.img" alt="" decoding="async"></span>
          <b>{{ m.name }}</b><span>{{ m.meta || m.sub }}</span>
        </RouterLink>
        <div class="mm-f">
          <span>Mapas con misiones y enemigos de cada zona</span>
          <RouterLink :to="{ name: 'arc-map', params: { mapa: '' } }" @click="menu = ''">Todos los mapas →</RouterLink>
        </div>
      </div>
    </div>
  </div>

  <RouterLink v-for="link in links" :key="link.name" class="slink arc-link" :class="{ on: route.name === link.name }" :to="{ name: link.name }">{{ link.label }}</RouterLink>

  <div ref="guideMenu" class="arc-dropdown" :data-open="menu === 'guides'" @mouseenter="hover('guides')" @mouseleave="leave('guides')">
    <button class="slink arc-link" type="button" :aria-expanded="menu === 'guides'" aria-controls="arc-nav-guide-list" @click="toggle('guides')">
      Guías
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    <div id="arc-nav-guide-list" v-show="menu === 'guides'" class="arc-mega arc-guides">
      <div class="gl">
        <RouterLink v-for="g in guides" :key="g.name" class="gi" :to="{ name: g.name }" @click="menu = ''">
          <b>{{ g.title }}</b><span>{{ g.text }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { loadArcEnemies, loadArcQuests, summarizeMaps } from "@/components/arc/hub/arcData";
import { mapRoute } from "@/components/arc/lists/arcLabels";
import "@/assets/styles/games/arc.css";

const route = useRoute();
const menu = ref("");
let openedByHover = false;
const mapMenu = ref(null);
const guideMenu = ref(null);
const primed = ref(false);
const questsJson = ref(null);
const enemiesJson = ref(null);
const maps = computed(() => summarizeMaps(questsJson.value, enemiesJson.value));

const links = [
  { name: "arc-items", label: "Objetos y reciclaje" },
  { name: "arc-quests", label: "Misiones" },
  { name: "arc-enemies", label: "Enemigos" },
];
const guides = [
  { name: "arc-items", title: "Qué guardar, reciclar o vender", text: "Decide qué hacer con cada objeto al volver" },
  { name: "arc-quests", title: "Misiones por comerciante", text: "Shani, Celeste, Tian Wen, Apollo y Lance" },
  { name: "arc-enemies", title: "Puntos débiles de cada ARC", text: "Dónde disparar y qué blindaje tienen" },
  { name: "arc-map", title: "Guía por mapas", text: "Misiones y enemigos de cada zona" },
];

const group = (id) => id === "maps" ? mapMenu.value : guideMenu.value;
const hoverDevice = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
function hover(id) {
  if (!hoverDevice() || menu.value === id) return;
  openedByHover = true;
  menu.value = id;
}
function leave(id) {
  if (openedByHover && menu.value === id && !group(id)?.contains(document.activeElement)) menu.value = "";
}
function toggle(id) {
  menu.value = menu.value === id && !openedByHover ? "" : id;
  openedByHover = false;
}

watch(menu, (id) => {
  if (id !== "maps" || primed.value) return;
  primed.value = true;
  loadArcQuests().then((data) => { questsJson.value = data; }).catch(() => {});
  loadArcEnemies().then((data) => { enemiesJson.value = data; }).catch(() => {});
});

function onOutside(event) {
  if (menu.value && !group(menu.value)?.contains(event.target)) menu.value = "";
}
function onEscape(event) {
  if (event.key !== "Escape" || !menu.value) return;
  const button = group(menu.value)?.querySelector("button");
  menu.value = "";
  button?.focus();
  event.preventDefault();
}
async function revealActive() {
  await nextTick();
  const box = mapMenu.value?.parentElement;
  const active = box?.querySelector(".arc-link.on");
  if (!active || box.scrollWidth <= box.clientWidth) return;
  const bounds = box.getBoundingClientRect();
  const rect = active.getBoundingClientRect();
  if (rect.left < bounds.left || rect.right > bounds.right) box.scrollLeft += rect.left - bounds.left - 16;
}
watch(() => route.fullPath, () => { menu.value = ""; });
watch(() => route.name, revealActive);
onMounted(() => {
  revealActive();
  document.fonts?.ready.then(revealActive);
  document.addEventListener("pointerdown", onOutside);
  document.addEventListener("focusin", onOutside);
  document.addEventListener("keydown", onEscape, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onOutside);
  document.removeEventListener("focusin", onOutside);
  document.removeEventListener("keydown", onEscape, true);
});
</script>
