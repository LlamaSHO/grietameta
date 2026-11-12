<template>
  <!-- Barra de League of Legends bajo el nav (diseño: .sub de Lol.dc.html).
       Estilos base (.slink, .dd, .mega…) en assets/styles/nav.css. -->
  <RouterLink class="slink" :class="{ on: section === 'tierlist' }" :to="{ path: '/lol', hash: '#tierlist' }">Tier list</RouterLink>

  <div class="dd">
    <RouterLink class="slink" :class="{ on: section === 'campeones' }" :to="{ path: '/lol', hash: '#campeones' }" aria-haspopup="true">
      Campeones
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </RouterLink>
    <div class="mega lol-mega">
      <div class="mega-h">
        <b>Campeones</b>
        <div class="mega-roles">
          <RouterLink
            v-for="r in ROLES"
            :key="r"
            class="r"
            :to="{ path: '/lol', hash: '#tierlist' }"
            :title="`Tier list de ${r}`"
            :aria-label="`Tier list de ${r}`"
            @click="filters.role = r"
          >
            <span class="pi" :class="`pi-${ROLE_ICON[r]}`" aria-hidden="true"></span>
          </RouterLink>
        </div>
      </div>
      <div class="mega-grid">
        <RouterLink v-for="c in popular" :key="c.id" class="mc" :to="{ name: 'lol-champion', params: { id: c.ddId } }">
          <img :src="c.icon" alt="" loading="lazy" width="44" height="44"><span>{{ c.name }}</span>
        </RouterLink>
      </div>
      <div class="mega-f">
        <span>Los más jugados del parche. Build, runas y estadísticas por rango de cada campeón.</span>
        <RouterLink :to="{ path: '/lol', hash: '#campeones' }">Ver los {{ champions.length }} →</RouterLink>
      </div>
    </div>
  </div>

  <!-- «Builds» no tiene vista propia: lleva a la ficha del campeón del parche
       (su pestaña Build). Mientras cargan los datos, al bloque destacado. -->
  <RouterLink class="slink" :class="{ on: section === 'builds' }" :to="buildsLink" :title="spotlight ? `Build de ${spotlight.c.name}, el campeón del parche` : 'Build del campeón del parche'">Builds</RouterLink>

  <RouterLink class="slink" :class="{ on: section === 'premium' }" to="/premium">Premium</RouterLink>
</template>

<script setup>
import { computed, nextTick, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useLolData } from "@/composables/useLolData";
import { ROLES, ROLE_ICON } from "@/services/lol/roster";
import "@/components/lol/lol.css";

const route = useRoute();
const { state, filters, champions, spotlight, rankEntries } = useLolData();

// Los 24 campeones con más pickrate (todos los rangos), por orden alfabético.
const popular = computed(() => {
  if (state.status !== "ready") return [];
  return rankEntries("ALL")
    .slice()
    .sort((a, b) => b.pr - a.pr)
    .slice(0, 24)
    .map((e) => e.c)
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
});

const buildsLink = computed(() =>
  spotlight.value ? { name: "lol-champion", params: { id: spotlight.value.c.ddId } } : { path: "/lol", hash: "#destacado" }
);

// Apartado actual de la barra.
const section = computed(() => {
  if (route.name === "premium") return "premium";
  if (route.name === "lol-champion") {
    const id = String(route.params.id || "").toLowerCase();
    return spotlight.value && spotlight.value.c.ddId.toLowerCase() === id ? "builds" : "campeones";
  }
  if (route.name !== "lol") return null;
  if (route.hash === "#campeones") return "campeones";
  if (route.hash === "#destacado") return "builds";
  if (route.hash === "#premium") return "premium";
  return "tierlist";
});

// En móvil la barra se desliza en horizontal: el apartado activo (p. ej.
// «Builds» en una ficha) se trae a la vista. Solo mueve la barra, no la página.
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
// También al cargar las fuentes: antes los enlaces miden menos y puede que aún
// no se salgan de la barra.
const reveal = () => nextTick(() => {
  revealActive();
  document.fonts?.ready.then(revealActive);
});
onMounted(reveal);
watch(section, reveal);
</script>

<style scoped>
.mega-roles { display: flex; gap: 6px; }
.mega-roles .r {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  color: #A0A8B4;
  transition: background 0.2s, color 0.2s;
}
.mega-roles .r:hover { background: rgba(226, 181, 102, 0.14); color: var(--accent); }
.mega-grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; }
.mc {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 6px 2px;
  border-radius: 10px;
  text-decoration: none;
  color: #C6CBD2;
  font-size: 11.5px;
  transition: background 0.2s;
}
.mc:hover { background: rgba(255, 255, 255, 0.06); color: var(--ink); }
.mc img { width: 44px; height: 44px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.1); transition: transform 0.2s; }
.mc:hover img { transform: scale(1.08); }
.mc span { max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
