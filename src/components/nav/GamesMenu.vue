<template>
  <!-- Menú «Juegos» del nav (.gdd de Main.dc.html). Solo en escritorio: en
       móvil lo abre la barra inferior (MobileTabBar). -->
  <div class="gdd">
    <button type="button" class="gdd-b" aria-haspopup="true">
      Juegos
      <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
    <div class="gmenu">
      <div class="gm-h"><b>Todos los juegos</b><span>{{ games.length }} juegos · {{ available }} disponibles</span></div>
      <div class="gm-g">
        <template v-for="g in games" :key="g.slug">
          <RouterLink v-if="g.url" class="gm-t" :class="{ pkt: g.mon }" :to="g.url" :style="{ '--ga': g.accent }">
            <img v-if="!g.mon" class="bg" :src="g.img" alt="" loading="lazy" decoding="async">
            <img v-else class="mon" :src="g.img" alt="" loading="lazy" decoding="async">
            <span class="st">{{ statusLabel(g) }}</span>
            <b>{{ g.name }}</b>
            <small>{{ g.small }}</small>
          </RouterLink>
          <span v-else class="gm-t off" :style="{ '--ga': g.accent }" aria-disabled="true">
            <img class="bg" :src="g.img" alt="" loading="lazy" decoding="async">
            <span class="st">{{ statusLabel(g) }}</span>
            <b>{{ g.name }}</b>
            <small>{{ g.small }}</small>
          </span>
        </template>
      </div>
      <div class="gm-f"><span>¿Falta tu juego?</span><RouterLink :to="{ path: '/contacto', query: { motivo: 'juego' } }">Pídelo →</RouterLink></div>
    </div>
  </div>
</template>

<script setup>
import { statusLabel, useCatalog } from "./gamesCatalog";

const { games, available } = useCatalog();
</script>
