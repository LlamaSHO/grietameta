<template>
  <!-- Barra de League of Legends bajo el nav (diseño: .sub de Lol.dc.html).
       Estilos base (.slink, .dd, .mega…) en assets/styles/nav.css y los
       propios de LoL en assets/styles/games/lol.css. -->
  <RouterLink class="slink" :class="{ on: section === 'tierlist' }" :to="{ path: '/lol', hash: '#tierlist' }" :aria-current="section === 'tierlist' ? 'page' : null">Tier list</RouterLink>

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
        <span>Build, runas y estadísticas por rango de cada campeón</span>
        <div>
          <RouterLink to="/lol/builds">Builds</RouterLink>
          <RouterLink :to="{ path: '/lol', hash: '#campeones' }">Ver los {{ champions.length }} →</RouterLink>
        </div>
      </div>
    </div>
  </div>

  <RouterLink class="slink" :class="{ on: section === 'builds' }" to="/lol/builds" :aria-current="section === 'builds' ? 'page' : null">Builds</RouterLink>
  <RouterLink class="slink" :class="{ on: section === 'esports' }" to="/lol/esports" :aria-current="section === 'esports' ? 'page' : null">eSports <span class="nw">Mundial</span></RouterLink>
  <RouterLink class="slink" :class="{ on: section === 'noticias' }" to="/lol/noticias" :aria-current="section === 'noticias' ? 'page' : null">Noticias</RouterLink>
  <RouterLink class="slink" :class="{ on: section === 'premium' }" to="/premium">Premium</RouterLink>
</template>

<script setup>
import { computed, nextTick, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useLolData } from "@/composables/useLolData";
import { ROLES, ROLE_ICON } from "@/services/lol/roster";
import "@/assets/styles/games/lol.css";

const route = useRoute();
const { state, filters, champions, rankEntries } = useLolData();

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

// Apartado actual de la barra.
const section = computed(() => {
  switch (route.name) {
    case "premium": return "premium";
    case "lol-champion": return "campeones";
    case "lol-builds": return "builds";
    case "lol-esports": return "esports";
    case "lol-news": return "noticias";
    case "lol":
      if (route.hash === "#campeones") return "campeones";
      if (route.hash === "#premium") return "premium";
      return "tierlist";
    default: return null;
  }
});

// En móvil la barra se desliza en horizontal: el apartado activo se trae a la
// vista. Solo mueve la barra, no la página.
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
