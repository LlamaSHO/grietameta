<template>
  <!-- Marco de las páginas de cuenta (/cuenta y /cuenta/premium): cabecera
       con migas, menú lateral con el usuario y el contenido en el slot.
       Diseño: models/paginas/MiPremium.dc.html (.head, .side, .content). -->
  <div class="pm-page account-shell">
    <div class="pm-glow g1" aria-hidden="true" />
    <div class="pm-glow g2" aria-hidden="true" />

    <div class="wrap">
      <div class="head">
        <nav class="crumbs" aria-label="Migas de pan">
          <RouterLink to="/">Inicio</RouterLink>
          <span aria-hidden="true">/</span>
          <template v-if="crumb">
            <RouterLink :to="{ name: 'account' }">Mi cuenta</RouterLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ crumb }}</span>
          </template>
          <span v-else aria-current="page">Mi cuenta</span>
        </nav>
        <h1 class="h1 pm-disp">{{ title }}</h1>
        <p class="sub">{{ sub }}</p>
      </div>

      <div class="layout">
        <aside class="side">
          <div class="box who">
            <UserAvatar :name="displayName" :premium="isPremium" :size="52" />
            <strong>{{ displayName || "Tu cuenta" }}</strong>
            <span class="mail">{{ state.user?.email }}</span>
            <span v-if="isPremium" class="pm-tagp">Premium</span>
            <span v-else class="free-tag">Plan Gratis</span>
          </div>

          <nav class="box menu" aria-label="Mi cuenta">
            <RouterLink
              v-for="item in MENU"
              :key="item.key"
              class="mi"
              :class="{ on: item.key === activeKey }"
              :aria-current="item.key === activeKey ? 'page' : undefined"
              :to="item.to"
            >
              <span class="ico" aria-hidden="true" v-html="item.icon" />
              {{ item.label }}
            </RouterLink>
            <div class="msep" />
            <RouterLink class="mi" to="/">
              <span class="ico" aria-hidden="true" v-html="ICONS.back" />
              Volver a la web
            </RouterLink>
            <button type="button" class="mi" :disabled="loggingOut" @click="onLogout">
              <span class="ico" aria-hidden="true" v-html="ICONS.logout" />
              {{ loggingOut ? "Cerrando sesión…" : "Cerrar sesión" }}
            </button>
          </nav>
        </aside>

        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import UserAvatar from "./UserAvatar.vue";
import "@/components/premium/premium-ui.css";

defineProps({
  title: { type: String, required: true },
  sub: { type: String, default: "" },
  crumb: { type: String, default: "" }, // última miga (vacía en /cuenta)
});

const { state, isPremium, displayName, logout } = useAuth();
const route = useRoute();
const router = useRouter();

// Iconos (SVG fijos y propios, sin datos del usuario).
const ICONS = {
  user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  crown: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z"/></svg>',
  bell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  card: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.5 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.5 9 9"/></svg>',
  back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 6 5 12 11 18"/></svg>',
  logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
};

const PREMIUM_PATH = "/cuenta/premium";
const MENU = [
  { key: "perfil", label: "Perfil", to: { name: "account" }, icon: ICONS.user },
  { key: "#suscripcion", label: "Suscripción", to: { path: PREMIUM_PATH, hash: "#suscripcion" }, icon: ICONS.crown },
  { key: "#alertas", label: "Avisos", to: { path: PREMIUM_PATH, hash: "#alertas" }, icon: ICONS.bell },
  { key: "#pago", label: "Pago y facturas", to: { path: PREMIUM_PATH, hash: "#pago" }, icon: ICONS.card },
  { key: "#ventajas", label: "Ventajas", to: { path: PREMIUM_PATH, hash: "#ventajas" }, icon: ICONS.star },
];

// Entrada activa: Perfil en /cuenta; en /cuenta/premium, la sección del ancla.
const activeKey = computed(() => {
  if (route.name === "account") return "perfil";
  return MENU.some((m) => m.key === route.hash) ? route.hash : "#suscripcion";
});

const loggingOut = ref(false);
async function onLogout() {
  loggingOut.value = true;
  try {
    await logout();
    router.push("/");
  } finally {
    loggingOut.value = false;
  }
}
</script>

<style scoped>
.g1 {
  top: -220px;
  left: 20%;
  background: #B9832F;
  opacity: 0.28;
}
.g2 {
  top: 200px;
  right: -120px;
  background: #0F8F88;
  opacity: 0.28;
  animation-duration: 19s;
  animation-direction: alternate-reverse;
}

/* ---------- cabecera ---------- */
.head {
  padding: 44px 0 30px;
  animation: gm-rise 0.7s var(--ease-out) both;
}
.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13.5px;
  color: var(--ink-mute);
}
.crumbs a {
  color: var(--ink-dim);
  text-decoration: none;
}
.crumbs a:hover {
  color: var(--gold-hi);
}
.h1 {
  margin: 10px 0 0;
  font-size: clamp(34px, 4.4vw, 52px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
}
.sub {
  margin: 10px 0 0;
  color: var(--ink-dim);
  font-size: 16px;
}

/* ---------- layout ---------- */
.layout {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  align-items: flex-start;
}
.side {
  flex: 1 1 240px;
  min-width: 0; /* en móvil el menú se desplaza en horizontal en vez de ensanchar la página */
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: gm-rise 0.7s 0.05s var(--ease-out) both;
}
.content {
  flex: 999 1 560px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.box {
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
}
.who {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.who .ava {
  margin-bottom: 10px;
}
.who strong {
  font-size: 16px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.who .mail {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--ink-dim);
  font-size: 13.5px;
}
.who .pm-tagp,
.who .free-tag {
  margin-top: 8px;
}
.free-tag {
  padding: 2px 7px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--ink-dim);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.menu {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mi {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 0;
  border-radius: 11px;
  background: none;
  color: #C6CBD2;
  text-decoration: none;
  font: 500 14.5px/1.2 var(--font-body);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.mi .ico {
  display: inline-grid;
  color: var(--ink-mute);
  transition: color 0.2s;
}
.mi:hover {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.05);
}
.mi.on {
  color: var(--gm-gold);
  background: rgba(212, 160, 74, 0.1);
}
.mi.on .ico {
  color: var(--gm-gold);
}
.msep {
  height: 1px;
  margin: 6px 10px;
  background: rgba(255, 255, 255, 0.07);
}

@media (max-width: 980px) {
  .side {
    max-width: none;
    flex-basis: 100%;
  }
}
@media (max-width: 860px) {
  .head {
    padding-top: 28px;
  }
  .who {
    display: none;
  }
  .menu {
    flex-direction: row;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 6px;
    gap: 6px;
  }
  .menu::-webkit-scrollbar {
    display: none;
  }
  .mi {
    flex-shrink: 0;
    width: auto;
    min-height: 40px;
    padding: 0 12px;
    white-space: nowrap;
    font-size: 13.5px;
  }
  .msep {
    display: none;
  }
}
</style>
