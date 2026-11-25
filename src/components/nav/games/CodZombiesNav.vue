<template>
  <!-- Barra de CoD Zombis bajo el nav (diseño: .sub de CodZombies.dc.html).
       Portada · Juegos (menú con la saga y los «Próximamente») · Planos ·
       Historia · Personajes. Estilos en assets/styles/games/cod.css; las clases
       base (.slink, .dd, .mega) están en assets/styles/nav.css. -->
  <RouterLink class="slink" :class="{ on: section === 'portada' }" to="/cod-zombis">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
    Portada
  </RouterLink>

  <div class="dd">
    <a class="slink" :class="{ on: section === 'juegos' }" href="/cod-zombis#juegos" aria-haspopup="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a8 8 0 0 0-8 8c0 2.6 1.2 4.4 3 5.5V20h10v-3.5c1.8-1.1 3-2.9 3-5.5a8 8 0 0 0-8-8z" /><circle cx="9" cy="11.5" r="1.6" /><circle cx="15" cy="11.5" r="1.6" /><path d="M10 20v-2M14 20v-2" /></svg>
      Juegos
      <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </a>
    <div class="mega cdmega">
      <div class="cdm">
        <div v-for="g in COD_MENU" :key="g.title" class="cdg">
          <p>{{ g.title }}<small>{{ g.sub }}</small></p>
          <template v-for="it in g.items" :key="it.name">
            <RouterLink v-if="it.to" class="cdo" :class="{ on: route.path === it.to }" :to="it.to">
              <span class="th"><img v-if="it.img" :src="it.img" alt="" loading="lazy" decoding="async" /><i v-else>{{ it.ini }}</i></span>
              <span><b>{{ it.name }}</b><small>{{ it.sub }}</small></span>
            </RouterLink>
            <span v-else class="cdo off" aria-disabled="true">
              <span class="th"><i>{{ it.ini }}</i></span>
              <span><b>{{ it.name }}</b><small>{{ it.sub }}</small></span>
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>

  <RouterLink class="slink" :class="{ on: section === 'planos' }" to="/cod-zombis/planos">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
    Planos
  </RouterLink>
  <a class="slink" href="/cod-zombis#historia">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-1.5z" /><path d="M8 7h6" /></svg>
    Historia
  </a>
  <a class="slink" href="/cod-zombis#personajes">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0" /><path d="M17 4a4 4 0 0 1 0 8" /><path d="M22 21a6 6 0 0 0-4-5.6" /></svg>
    Personajes
  </a>
  <span class="status"><i></i>Nuevo</span>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { COD_MENU } from "@/components/cod-zombis/games.js";
import { loadCodFonts } from "@/components/cod-zombis/codFonts.js";
import "@/assets/styles/games/cod.css";

loadCodFonts();

const route = useRoute();
const section = computed(() => {
  const p = route.path.replace(/\/$/, "");
  if (p === "/cod-zombis") return "portada";
  if (p.startsWith("/cod-zombis/planos")) return "planos";
  if (p.startsWith("/cod-zombis/black-ops")) return "juegos";
  return "";
});
</script>
