<template>
  <!-- Barra inferior en móvil (≤ 860 px). Con 9 juegos no caben todos como
       pestañas, así que son cuatro: Inicio · Juegos (abre la lista de los 9)
       · Buscar (lleva el cursor al buscador del nav) · Cuenta. -->
  <div class="tabwrap">
    <Transition name="sheet">
      <div v-if="open" class="sheet-back" @click.self="open = false">
        <div class="sheet" role="dialog" aria-modal="true" aria-label="Todos los juegos">
          <div class="sheet-h">
            <b>Todos los juegos</b>
            <button type="button" class="sheet-x" aria-label="Cerrar" @click="open = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
            </button>
          </div>
          <div class="sheet-g">
            <template v-for="g in games" :key="g.slug">
              <RouterLink v-if="g.url" class="sg-t" :class="{ on: g.slug === route.meta.game }" :to="g.url" :style="{ '--ga': g.accent }">
                <img :src="g.mon ? '/images/home/art-25.webp' : g.img" alt="" loading="lazy" decoding="async" :class="{ mon: g.mon }">
                <span class="st">{{ statusLabel(g) }}</span>
                <b>{{ g.name }}</b>
              </RouterLink>
              <span v-else class="sg-t off" :style="{ '--ga': g.accent }" aria-disabled="true">
                <img :src="g.img" alt="" loading="lazy" decoding="async">
                <span class="st">{{ statusLabel(g) }}</span>
                <b>{{ g.name }}</b>
              </span>
            </template>
          </div>
          <RouterLink class="sheet-f" :to="{ path: '/contacto', query: { motivo: 'juego' } }">¿Falta tu juego? <span>Pídelo →</span></RouterLink>
        </div>
      </div>
    </Transition>

    <nav class="tabbar" aria-label="Navegación principal">
      <RouterLink class="tb" :class="{ on: active === 'home' }" to="/">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></svg>
        Inicio
      </RouterLink>
      <button type="button" class="tb" :class="{ on: active === 'games' || open }" :aria-expanded="open" aria-haspopup="dialog" @click="open = !open">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.8" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.8" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.8" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.8" /></svg>
        Juegos
      </button>
      <button type="button" class="tb" @click="focusSearch">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        Buscar
      </button>
      <RouterLink class="tb" :class="{ on: active === 'account' }" :to="isLoggedIn ? '/cuenta' : '/login'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
        Cuenta
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { statusLabel, useCatalog } from "./gamesCatalog";

const route = useRoute();
const { isLoggedIn } = useAuth();
const { games } = useCatalog();
const open = ref(false);

// Pestaña activa: un juego, la portada o la cuenta.
const active = computed(() => {
  if (route.meta.game) return "games";
  if (route.name === "home") return "home";
  if (route.name === "login" || String(route.path).startsWith("/cuenta")) return "account";
  return null;
});

watch(() => route.fullPath, () => (open.value = false));

function onKey(e) {
  if (e.key === "Escape") open.value = false;
}
watch(open, (v) => {
  document.documentElement.style.overflow = v ? "hidden" : "";
  if (v) document.addEventListener("keydown", onKey);
  else document.removeEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
  document.removeEventListener("keydown", onKey);
});

function focusSearch() {
  open.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  const input = document.querySelector(".site-nav .game-search input");
  input?.focus({ preventScroll: true });
}
</script>

<style scoped>
.tabwrap {
  display: contents;
}
.tabbar,
.sheet-back {
  display: none;
}
@media (max-width: 860px) {
  .tabbar {
    position: sticky;
    bottom: 0;
    z-index: 60;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 4px;
    padding: 8px 10px calc(10px + env(safe-area-inset-bottom));
    background: rgba(9, 11, 15, 0.97);
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
    border: 0;
    background: transparent;
    color: var(--ink-mute);
    font: 600 11px/1 var(--font-body);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .tb:hover {
    color: var(--ink);
  }
  .tb svg {
    width: 22px;
    height: 22px;
  }
  .tb.on {
    color: var(--gm-gold);
    background: rgba(212, 160, 74, 0.12);
  }

  /* Lista de los 9 juegos */
  .sheet-back {
    position: fixed;
    inset: 0;
    z-index: 59;
    display: flex;
    align-items: flex-end;
    background: rgba(3, 4, 7, 0.7);
  }
  .sheet {
    width: 100%;
    max-height: calc(100dvh - 90px);
    overflow-y: auto;
    margin-bottom: calc(72px + env(safe-area-inset-bottom));
    padding: 16px 14px 14px;
    border-radius: 22px 22px 0 0;
    background: #0E121A;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 0;
    box-shadow: 0 -30px 80px -20px rgba(0, 0, 0, 0.95);
  }
  .sheet-h {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 4px 12px;
  }
  .sheet-h b {
    font: 700 18px/1 var(--font-display);
    letter-spacing: -0.01em;
  }
  .sheet-x {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: var(--ink);
    cursor: pointer;
  }
  .sheet-g {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .sg-t {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 84px;
    padding: 10px 12px;
    border-radius: 14px;
    overflow: hidden;
    isolation: isolate;
    color: #F3F1EC;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .sg-t.on {
    border-color: var(--ga);
  }
  .sg-t img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2;
    filter: saturate(0.9) brightness(0.6);
  }
  .sg-t img.mon {
    object-fit: contain;
    background: radial-gradient(120% 120% at 100% 0%, #FFCB3D 0%, #FF7A59 38%, #5B6CFF 78%, #2A2F6B 100%);
    filter: none;
  }
  .sg-t::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(180deg, rgba(7, 9, 13, 0.05), rgba(7, 9, 13, 0.88));
  }
  .sg-t b {
    font: 700 14px/1.15 var(--font-display);
  }
  .sg-t .st {
    position: absolute;
    top: 7px;
    left: 7px;
    padding: 2px 7px;
    border-radius: 999px;
    font: 700 10px/1.3 var(--font-body);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: rgba(7, 9, 13, 0.75);
    color: var(--ga);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .sg-t.off {
    opacity: 0.85;
  }
  .sheet-f {
    display: flex;
    justify-content: space-between;
    margin: 12px 4px 0;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    font-size: 13px;
    color: var(--ink-mute);
    text-decoration: none;
  }
  .sheet-f span {
    font-weight: 600;
    color: var(--gm-gold);
  }
  .sheet-back {
    display: flex;
  }
  .sheet-enter-active,
  .sheet-leave-active {
    transition: opacity 0.2s;
  }
  .sheet-enter-active .sheet,
  .sheet-leave-active .sheet {
    transition: transform 0.28s var(--ease-out);
  }
  .sheet-enter-from,
  .sheet-leave-to {
    opacity: 0;
  }
  .sheet-enter-from .sheet,
  .sheet-leave-to .sheet {
    transform: translateY(30px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .sheet-enter-active,
  .sheet-leave-active,
  .sheet-enter-active .sheet,
  .sheet-leave-active .sheet {
    transition: none;
  }
}
</style>
