<template>
  <RouterLink class="slink" :class="{ on: active === 'inicio' }" :to="home" @click="sameAnchor(home)">Inicio</RouterLink>

  <div v-for="menu in menus" :key="menu.id" class="dd zelda-dd" @pointerenter="hover($event, menu.id)"
    @pointerleave="leave($event)" @keydown.esc.stop.prevent="escapeMenu($event)">
    <button type="button" class="slink" :class="{ on: active === menu.id }"
      :aria-expanded="open === menu.id" :aria-controls="'zelda-nav-' + menu.id" @click="toggle(menu.id)">
      <GuideIcon :name="menu.icon" :size="16" />
      {{ menu.title }}
      <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>

    <div :id="'zelda-nav-' + menu.id" class="mega zelda-menu" :class="{ shown: open === menu.id }">
      <div v-if="menu.id === 'mapa'" class="zelda-map-links">
        <RouterLink v-for="item in mapLinks" :key="item.title" :to="item.to" @click="chooseMap(item)">
          <span class="zelda-map-thumb" :class="{ deep: !item.layer }"><img :src="item.img" alt="" loading="lazy" decoding="async"></span>
          <b>{{ item.title }}</b><small>{{ item.description }}</small>
        </RouterLink>
      </div>
      <div v-else class="zelda-guide-links">
        <RouterLink v-for="guide in GUIDES" :key="guide.key" :to="{ name: 'zelda-guide', params: { guia: guide.key } }"
          :class="{ current: route.params.guia === guide.key }" @click="close">
          <span class="zelda-guide-icon"><GuideIcon :name="guide.icon" /></span>
          <span><b>{{ guide.title }}</b><small>{{ guide.short }}</small></span>
        </RouterLink>
        <RouterLink :to="info" @click="sameAnchor(info)">Todas las guías</RouterLink>
      </div>
    </div>
  </div>
  <span class="zelda-status">En construcción</span>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import GuideIcon from "@/components/zelda/guides/GuideIcon.vue";
import { GUIDES } from "@/components/zelda/guides/catalog";
import { mapLayer } from "@/components/zelda/mapLayer";
import "@/assets/styles/games/zelda.css";

const route = useRoute();
const home = { path: "/zelda", hash: "#inicio" };
const info = { path: "/zelda", hash: "#info" };
const menus = [
  { id: "mapa", title: "Mapas", icon: "mapa" },
  { id: "info", title: "Información", icon: "libro" },
];
const mapLinks = [
  { title: "Superficie", description: "120 santuarios · 838 semillas", layer: "surf", img: "/images/zelda/mapas/thumb-superficie.jpg", to: { path: "/zelda", hash: "#mapa", query: { capa: "superficie" } } },
  { title: "Cielo", description: "32 santuarios · 37 semillas", layer: "sky", img: "/images/zelda/mapas/thumb-cielo.jpg", to: { path: "/zelda", hash: "#mapa", query: { capa: "cielo" } } },
  { title: "Profundidades", description: "Guía de las 120 raíces de luz", img: "/images/zelda/mapas/thumb-superficie.jpg", to: { path: "/zelda/raices" } },
];
const open = ref(null);
const visibleSection = ref(null);
const active = computed(() => route.name === "zelda-guide" ? "info" : visibleSection.value || route.hash.slice(1) || "inicio");
let pinned = false;
let frame = 0;
let anchorTime = 0;

function close() {
  open.value = null;
  pinned = false;
}
function hover(event, id) {
  if (event.pointerType === "mouse" && !pinned) open.value = id;
}
function leave(event) {
  if (event.pointerType === "mouse" && !pinned && !event.currentTarget.contains(document.activeElement)) close();
}
function toggle(id) {
  if (open.value === id && pinned) close();
  else {
    open.value = id;
    pinned = true;
  }
}
function escapeMenu(event) {
  close();
  event.currentTarget.querySelector("button").focus();
}
function closeOutside(event) {
  if (!event.target.closest(".zelda-dd")) close();
}
function sameAnchor(to) {
  close();
  if (route.path !== to.path || route.hash !== to.hash || route.query.capa !== to.query?.capa) return;
  document.getElementById(to.hash.slice(1))?.scrollIntoView();
}
function chooseMap(item) {
  if (item.layer) mapLayer.value = item.layer;
  sameAnchor(item.to);
}
function trackSection() {
  if (frame || route.name !== "zelda" || Date.now() < anchorTime) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const header = document.querySelector(".site-nav")?.getBoundingClientRect().bottom || 0;
    visibleSection.value = ["info", "mapa", "inicio"].find((id) =>
      document.getElementById(id)?.getBoundingClientRect().top <= header + 12) || "inicio";
  });
}
watch(() => route.fullPath, () => {
  close();
  visibleSection.value = null;
  anchorTime = Date.now() + 800;
});
onMounted(() => {
  document.addEventListener("pointerdown", closeOutside);
  document.addEventListener("focusin", closeOutside);
  window.addEventListener("scroll", trackSection, { passive: true });
});
onUnmounted(() => {
  document.removeEventListener("pointerdown", closeOutside);
  document.removeEventListener("focusin", closeOutside);
  window.removeEventListener("scroll", trackSection);
  cancelAnimationFrame(frame);
});
</script>
