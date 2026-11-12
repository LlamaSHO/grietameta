<template>
  <!-- Barra de ARC Raiders bajo el nav (diseño: .sub de Arc.dc.html).
       Estilos base (.slink, .dd, .mega, .mega-f) en assets/styles/nav.css. -->
  <RouterLink class="slink" :class="{ on: section === 'inicio' }" :to="{ name: 'arc' }">Inicio</RouterLink>

  <div class="dd" @mouseenter="primed = true" @focusin="primed = true">
    <RouterLink class="slink" :class="{ on: section === 'mapas' }" :to="{ name: 'arc-map' }" aria-haspopup="true">
      Mapas
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="mega arc-maps">
      <div class="mm">
        <RouterLink v-for="m in maps" :key="m.id" class="mo" :class="{ cur: route.name === 'arc-map' && route.params.mapa === m.id }" :to="mapRoute(m.id)">
          <!-- Las imágenes de los mapas pesan: se piden al abrir el menú por primera vez. -->
          <span class="th"><img v-if="primed" :src="m.img" alt="" decoding="async"></span>
          <b>{{ m.name }}</b>
          <span>{{ m.meta || m.sub }}</span>
        </RouterLink>
      </div>
      <div class="mega-f">
        <span>Mapas con misiones y enemigos de cada zona</span>
        <RouterLink :to="{ name: 'arc-map' }">Todos los mapas →</RouterLink>
      </div>
    </div>
  </div>

  <RouterLink class="slink" :class="{ on: section === 'objetos' }" :to="{ name: 'arc-items' }">Objetos y reciclaje</RouterLink>
  <RouterLink class="slink" :class="{ on: section === 'misiones' }" :to="{ name: 'arc-quests' }">Misiones</RouterLink>
  <RouterLink class="slink" :class="{ on: section === 'enemigos' }" :to="{ name: 'arc-enemies' }">Enemigos</RouterLink>

  <div class="dd">
    <RouterLink class="slink" :to="{ name: 'arc', hash: '#objetos' }" aria-haspopup="true">
      Guías
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="mega arc-guides">
      <div class="gl">
        <RouterLink v-for="g in GUIDES" :key="g.title" class="gi" :to="g.to">
          <b>{{ g.title }}</b><span>{{ g.text }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { loadArcEnemies, loadArcQuests, summarizeMaps } from "@/components/arc/hub/arcData";
import { mapRoute } from "@/components/arc/lists/arcLabels";

const route = useRoute();

// Lista de mapas: primero la fija (nombre e imagen) y, al llegar los datos,
// con su número de misiones y de tipos de ARC.
const questsJson = ref(null);
const enemiesJson = ref(null);
loadArcQuests().then((d) => (questsJson.value = d), () => {});
loadArcEnemies().then((d) => (enemiesJson.value = d), () => {});
const maps = computed(() => summarizeMaps(questsJson.value, enemiesJson.value));
const primed = ref(false);

const GUIDES = [
  { title: "Qué guardar, reciclar o vender", text: "Decide qué hacer con cada objeto al volver", to: { name: "arc", hash: "#objetos" } },
  { title: "Misiones por comerciante", text: "Shani, Celeste, Tian Wen, Apollo y Lance", to: { name: "arc", hash: "#misiones" } },
  { title: "Puntos débiles de cada ARC", text: "Dónde disparar y qué blindaje tienen", to: { name: "arc", hash: "#arc" } },
  { title: "Guía por mapas", text: "Misiones y enemigos de cada zona", to: { name: "arc-map" } },
];

// Apartado actual de la barra (incluye /arc-raiders/mapas/...).
const SECTION_BY_ROUTE = { arc: "inicio", "arc-map": "mapas", "arc-items": "objetos", "arc-quests": "misiones", "arc-enemies": "enemigos" };
const section = computed(() => SECTION_BY_ROUTE[route.name] || null);

// En móvil la barra se desliza en horizontal: se trae a la vista el apartado
// activo. Solo mueve la barra, no la página.
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
const reveal = () =>
  nextTick(() => {
    revealActive();
    document.fonts?.ready.then(revealActive);
  });
onMounted(reveal);
watch(section, reveal);
</script>

<style scoped>
/* Mega-menú de mapas (.mm / .mo del diseño) */
.mega.arc-maps { width: 640px; padding: 12px; border-radius: 16px; background: #15131A; border-color: rgba(242, 235, 221, 0.1); }
.mm { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.mo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px;
  border-radius: 12px;
  text-decoration: none;
  color: #F2EBDD;
  transition: background 0.2s;
}
.mo:hover,
.mo.cur { background: rgba(242, 235, 221, 0.05); color: #F2EBDD; }
.mo .th { display: block; height: 70px; border-radius: 9px; overflow: hidden; border: 1px solid rgba(242, 235, 221, 0.1); background: #0E0C12; }
.mo .th img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.mo:hover .th img { transform: scale(1.1); }
.mo b { font-family: var(--font-arc); font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.1; }
.mo > span:last-child { font-size: 11.5px; color: #9A938A; }
.arc-maps .mega-f { margin-top: 8px; padding: 10px 6px 2px; border-top-color: rgba(242, 235, 221, 0.08); color: #9A938A; }
.arc-maps .mega-f a { color: #F5C02A; }
.arc-maps .mega-f a:hover { color: #FFD45A; }

/* Mega-menú de guías (.gl / .gi del diseño) */
.mega.arc-guides { width: 340px; padding: 12px; border-radius: 16px; background: #15131A; border-color: rgba(242, 235, 221, 0.1); }
.gl { display: flex; flex-direction: column; gap: 2px; }
.gi {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #F2EBDD;
  transition: background 0.2s;
}
.gi:hover { background: rgba(242, 235, 221, 0.05); color: #F2EBDD; }
.gi b { font-size: 14px; }
.gi span { font-size: 12px; color: #9A938A; }
</style>
