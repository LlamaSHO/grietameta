<template>
  <!-- Barra de Zelda: Tears of the Kingdom bajo el nav (diseño: .sub de Zelda.dc.html).
       Inicio · Mapas (Superficie, Cielo, Subsuelo) · Información (5 guías).
       Estilos base (.slink, .dd, .mega) en assets/styles/nav.css. -->
  <RouterLink class="slink" :class="{ on: section === 'inicio' }" :to="LINK.inicio" @click="sameHash(LINK.inicio)">Inicio</RouterLink>

  <div class="dd">
    <RouterLink class="slink" :class="{ on: section === 'mapa' }" :to="LINK.mapa" aria-haspopup="true" @click="sameHash(LINK.mapa)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
      Mapas
      <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="mega zmega">
      <div class="mapsm">
        <RouterLink v-for="m in MAPS" :key="m.id" class="mapo" :to="m.to" @click="pickLayer(m)">
          <span class="th"><img :src="m.img" alt="" loading="lazy"></span>
          <b>{{ m.name }}</b><span>{{ m.sub }}</span>
        </RouterLink>
        <span class="mapo off" aria-disabled="true">
          <span class="th">Próximamente</span>
          <b>Subsuelo</b><span>Raíces de luz y minas</span>
        </span>
      </div>
    </div>
  </div>

  <div class="dd">
    <RouterLink class="slink" :class="{ on: section === 'info' }" :to="LINK.info" aria-haspopup="true" @click="sameHash(LINK.info)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-1.5z" /><path d="M8 7h6M8 11h6" /></svg>
      Información
      <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="mega zmega">
      <div class="infom">
        <RouterLink v-for="g in GUIDES" :key="g.id" class="io" :class="{ cur: route.params.guia === g.id }" :to="`/zelda/${g.id}`">
          <span class="ic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path v-for="(d, i) in g.icon" :key="i" :d="d" />
            </svg>
          </span>
          <span><b>{{ g.name }}</b><span>{{ g.sub }}</span></span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { mapLayer } from "@/components/zelda/mapLayer";

const route = useRoute();

const LINK = {
  inicio: { path: "/zelda", hash: "#inicio" },
  mapa: { path: "/zelda", hash: "#mapa" },
  info: { path: "/zelda", hash: "#info" },
};

const MAPS = [
  { id: "surf", name: "Superficie", sub: "120 santuarios · 838 semillas", img: "/images/zelda/mapas/thumb-superficie.jpg", to: { path: "/zelda", query: { capa: "superficie" }, hash: "#mapa" } },
  { id: "sky", name: "Cielo", sub: "32 santuarios · 37 semillas", img: "/images/zelda/mapas/thumb-cielo.jpg", to: { path: "/zelda", query: { capa: "cielo" }, hash: "#mapa" } },
];

const GUIDES = [
  { id: "santuarios", name: "Santuarios", sub: "Los 152, con coordenadas y altitud", icon: ["M5 21V10a7 7 0 0 1 14 0v11", "M9 21v-6a3 3 0 0 1 6 0v6", "M3 21h18"] },
  { id: "semillas", name: "Semillas kolog", sub: "875 semillas en superficie y cielo", icon: ["M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z", "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"] },
  { id: "misiones", name: "Misiones", sub: "23 principales, 50 aventuras y 105 secundarias", icon: ["M8 3h11a2 2 0 0 1 2 2v2h-4", "M17 7v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2h11", "M8 3a2 2 0 0 0-2 2v12", "M10 8h4M10 12h4"] },
  { id: "armaduras", name: "Armaduras", sub: "Las de más defensa, de mayor a menor", icon: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"] },
  { id: "conjuntos", name: "Conjuntos", sub: "57 sets y sus materiales de mejora", icon: ["M12 2l9 5-9 5-9-5z", "M3 12l9 5 9-5", "M3 16.5l9 5 9-5"] },
];

// En el hub, la sección que se está viendo (se sigue al hacer scroll).
const spy = ref(null);
let raf = 0;
// Tras navegar a un ancla, el scroll suave pasa por otras secciones: durante
// ese rato manda el ancla de la dirección.
let quietUntil = 0;
let quietTimer = 0;
function readSpy() {
  raf = 0;
  if (Date.now() < quietUntil) return;
  if (route.name !== "zelda") return (spy.value = null);
  const line = (parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10) || 0) + 2;
  let cur = null;
  for (const id of ["inicio", "mapa", "info"]) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) cur = id;
  }
  // Al final de la página, la última sección aunque no llegue arriba.
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && document.getElementById("info")) cur = "info";
  spy.value = cur;
}
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(readSpy);
};
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  cancelAnimationFrame(raf);
  clearTimeout(quietTimer);
});

// Apartado actual: las guías cuentan como «Información».
const section = computed(() => {
  if (route.name === "zelda-guide") return "info";
  if (route.name !== "zelda") return null;
  if (spy.value) return spy.value;
  if (route.hash === "#mapa") return "mapa";
  if (route.hash === "#info") return "info";
  return "inicio";
});

// En móvil la barra se desliza en horizontal: se trae a la vista el apartado
// activo al cambiar de página (p. ej. «Información» en una guía).
function revealActive() {
  const link = document.querySelector(".sub .slink.on");
  if (!link) return;
  let box = link.parentElement;
  while (box && box.scrollWidth <= box.clientWidth) box = box.parentElement;
  if (!box || box === document.body || box === document.documentElement) return;
  const b = box.getBoundingClientRect();
  const l = link.getBoundingClientRect();
  if (l.left < b.left || l.right > b.right) box.scrollBy({ left: l.left - b.left - 16, behavior: "instant" });
}
watch(
  () => route.fullPath,
  () => {
    spy.value = null;
    quietUntil = Date.now() + 1000;
    clearTimeout(quietTimer);
    quietTimer = setTimeout(readSpy, 1050);
    nextTick(() => {
      revealActive();
      document.fonts?.ready.then(revealActive);
    });
  },
  { immediate: true }
);

// Si la dirección no cambia (ya estamos en ese ancla), el router no navega:
// se baja a mano hasta la sección.
function sameHash(to) {
  const target = to.hash || "";
  const sameQuery = JSON.stringify(to.query || {}) === JSON.stringify(route.query || {});
  if (route.path === to.path && route.hash === target && sameQuery) {
    const el = document.querySelector(target);
    if (!el) return;
    spy.value = el.id;
    quietUntil = Date.now() + 1000;
    clearTimeout(quietTimer);
    quietTimer = setTimeout(readSpy, 1050);
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Mapas → capa elegida. La capa es compartida con el mapa del hub, así que
// también funciona aunque la dirección ya tenga esa ?capa=.
function pickLayer(m) {
  mapLayer.value = m.id;
  sameHash(m.to);
}
</script>

<style scoped>
.mega.zmega {
  width: auto;
  padding: 10px;
  background: #0A1816;
  border-color: rgba(127, 235, 203, 0.16);
  left: -8px;
}
.chev {
  transition: transform 0.25s;
}

/* Mapas */
.mapsm {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  width: 540px;
  max-width: calc(100vw - 52px);
}
.mapo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 13px;
  text-decoration: none;
  color: #E6EEEA;
  transition: background 0.2s;
}
.mapo:hover,
.mapo:focus-visible {
  background: rgba(127, 235, 203, 0.06);
  color: #E6EEEA;
  outline: none;
}
.mapo .th {
  position: relative;
  height: 84px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(127, 235, 203, 0.14);
}
.mapo .th img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.mapo:hover .th img {
  transform: scale(1.08);
}
.mapo b {
  font-family: var(--font-zelda);
  font-size: 14px;
}
.mapo > span:last-child {
  font-size: 12px;
  color: #93AAA3;
}
.mapo.off {
  opacity: 0.55;
  cursor: default;
}
.mapo.off:hover {
  background: transparent;
}
.mapo.off .th {
  display: grid;
  place-items: center;
  background: repeating-linear-gradient(135deg, #0C1D1A 0 8px, #0A1715 8px 16px);
  color: #7F978F;
  font-size: 12px;
}

/* Información */
.infom {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 340px;
}
.io {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  text-decoration: none;
  color: #E6EEEA;
  transition: background 0.2s;
}
.io:hover,
.io:focus-visible,
.io.cur {
  background: rgba(127, 235, 203, 0.06);
  color: #E6EEEA;
  outline: none;
}
.io .ic {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(79, 224, 182, 0.1);
  border: 1px solid rgba(79, 224, 182, 0.25);
  color: #7FEBCB;
  flex-shrink: 0;
}
.io b {
  display: block;
  font-size: 14px;
  font-weight: 600;
}
.io span span {
  font-size: 12px;
  color: #93AAA3;
}

/* Con teclado, además del fondo, un contorno visible. */
.mapo:focus-visible,
.io:focus-visible {
  outline: 2px solid #4FE0B6;
  outline-offset: -2px;
}
</style>
