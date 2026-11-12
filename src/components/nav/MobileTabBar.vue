<template>
  <!-- Barra inferior en móvil (≤ 860 px). Diseño: .tabbar de los .dc.html. -->
  <nav class="tabbar" aria-label="Navegación principal">
    <RouterLink class="tb" :class="{ on: active === 'home' }" to="/">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></svg>
      Inicio
    </RouterLink>
    <RouterLink class="tb" :class="{ on: active === 'lol' }" to="/lol">
      <img src="/images/games/logo-lol.png" alt="">LoL
    </RouterLink>
    <RouterLink class="tb" :class="{ on: active === 'arc-raiders' }" to="/arc-raiders">
      <img src="/images/games/logo-arc.png" alt="">ARC
    </RouterLink>
    <RouterLink class="tb" :class="{ on: active === 'zelda-totk' }" to="/zelda">
      <img src="/images/games/logo-zelda.png" alt="">Zelda
    </RouterLink>
    <RouterLink class="tb" :class="{ on: active === 'account' }" :to="isLoggedIn ? '/cuenta' : '/login'">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
      Cuenta
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const route = useRoute();
const { isLoggedIn } = useAuth();

// Pestaña activa: el juego de la ruta, la portada o la cuenta.
const active = computed(() => {
  if (route.meta.game) return route.meta.game;
  if (route.name === "home") return "home";
  if (route.name === "login" || String(route.path).startsWith("/cuenta")) return "account";
  return null;
});
</script>

<style scoped>
.tabbar {
  display: none;
}
@media (max-width: 860px) {
  .tabbar {
    position: sticky;
    bottom: 0;
    z-index: 60;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 4px;
    padding: 8px 10px calc(10px + env(safe-area-inset-bottom));
    background: rgba(9, 11, 15, 0.94);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    border-top: 1px solid rgba(255, 255, 255, 0.09);
    box-shadow: 0 -14px 30px -18px rgba(0, 0, 0, 0.9);
  }
  .tb {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 52px;
    border-radius: 13px;
    color: var(--ink-mute);
    font: 600 11px/1 var(--font-body);
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .tb:hover {
    color: var(--ink);
  }
  .tb img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: grayscale(0.7) brightness(0.85);
  }
  .tb svg {
    width: 22px;
    height: 22px;
  }
  .tb.on {
    color: var(--gm-gold);
    background: rgba(212, 160, 74, 0.12);
  }
  .tb.on img {
    filter: none;
  }
}
</style>
