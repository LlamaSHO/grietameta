import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { whenAuthReady } from "@/composables/useAuth";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: "Juegos | GrietaMeta" },
  },
  {
    path: "/lol",
    name: "lol",
    component: () => import("@/views/LolView.vue"),
    meta: { game: "lol", title: "League of Legends — Builds, tier list y winrates | GrietaMeta" },
  },
  {
    path: "/lol/campeon/:id",
    name: "lol-champion",
    component: () => import("@/views/lol/LolChampionView.vue"),
    meta: { game: "lol", title: "Campeón — League of Legends | GrietaMeta" },
  },
  // ---- ARC Raiders: hub y secciones bajo /arc-raiders ----
  {
    path: "/arc-raiders",
    name: "arc",
    component: () => import("@/views/arc-raiders/ArcHubView.vue"),
    meta: {
      game: "arc-raiders",
      title: "ARC Raiders · Guía | GrietaMeta",
      description: "Guía de ARC Raiders en español: mapas con misiones y enemigos, qué hacer con cada objeto, misiones por comerciante y puntos débiles de los ARC.",
    },
  },
  {
    path: "/arc-raiders/objetos",
    name: "arc-items",
    component: () => import("@/views/arc-raiders/ArcItemsView.vue"),
    meta: {
      game: "arc-raiders",
      title: "ARC Raiders · Objetos | GrietaMeta",
      description: "Objetos de ARC Raiders en español: qué vender, reciclar, guardar o usar, con valores, reciclaje y recetas.",
    },
  },
  {
    path: "/arc-raiders/misiones",
    name: "arc-quests",
    component: () => import("@/views/arc-raiders/ArcQuestsView.vue"),
    meta: {
      game: "arc-raiders",
      title: "ARC Raiders · Misiones | GrietaMeta",
      description: "Seguimiento de misiones de ARC Raiders en español: marca las que completas, mira cuáles tienes disponibles y qué objetos debes guardar.",
    },
  },
  {
    path: "/arc-raiders/enemigos",
    name: "arc-enemies",
    component: () => import("@/views/arc-raiders/ArcEnemiesView.vue"),
    meta: {
      game: "arc-raiders",
      title: "ARC Raiders · Enemigos | GrietaMeta",
      description: "Todos los enemigos ARC de ARC Raiders en español: puntos débiles, qué sueltan y las mejores armas y balas para cada uno.",
    },
  },
  {
    // Sin :mapa se abre el primer mapa.
    path: "/arc-raiders/mapas/:mapa?",
    name: "arc-map",
    component: () => import("@/views/arc-raiders/ArcMapView.vue"),
    meta: {
      game: "arc-raiders",
      title: "ARC Raiders · Mapas | GrietaMeta",
      description: "Mapas de ARC Raiders con las misiones y las zonas de cada enemigo.",
    },
  },

  // ---- Zelda: hub (mapa + información) y guías ----
  {
    path: "/zelda",
    name: "zelda",
    component: () => import("@/views/ZeldaView.vue"),
    // Direcciones antiguas: /zelda#semillas, #santuarios… son ahora guías propias.
    beforeEnter: (to) => {
      const guia = to.hash.slice(1);
      if (["santuarios", "semillas", "misiones", "armaduras", "conjuntos"].includes(guia)) {
        return { name: "zelda-guide", params: { guia }, replace: true };
      }
      return true;
    },
    meta: {
      game: "zelda-totk",
      title: "Zelda: Tears of the Kingdom · Guía | GrietaMeta",
      description: "Guía de Zelda: Tears of the Kingdom en español: mapa de semillas kolog y santuarios, misiones principales y secundarias y armaduras con más defensa.",
    },
  },
  {
    path: "/zelda/:guia(santuarios|semillas|misiones|armaduras|conjuntos)",
    name: "zelda-guide",
    component: () => import("@/views/zelda/ZeldaGuideView.vue"),
    meta: { game: "zelda-totk", title: "Zelda: Tears of the Kingdom · Guía | GrietaMeta" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
    meta: { title: "Iniciar sesión | GrietaMeta" },
  },
  {
    path: "/contacto",
    name: "contact",
    component: () => import("@/views/ContactView.vue"),
    meta: {
      title: "Contacto | GrietaMeta",
      description: "Escríbenos si falta algo, necesitas ayuda o quieres que añadamos un juego a GrietaMeta.",
    },
  },
  {
    path: "/premium",
    name: "premium",
    component: () => import("@/views/premium/PremiumView.vue"),
    meta: {
      title: "Premium | GrietaMeta",
      description: "GrietaMeta Premium: navega sin anuncios y recibe las alertas de parche antes que nadie.",
    },
  },
  {
    path: "/cuenta",
    name: "account",
    component: () => import("@/views/account/AccountView.vue"),
    meta: { title: "Mi cuenta | GrietaMeta", requiresAuth: true },
  },
  {
    path: "/cuenta/premium",
    name: "account-premium",
    component: () => import("@/views/account/AccountPremiumView.vue"),
    meta: { title: "Mi Premium | GrietaMeta", requiresAuth: true },
  },
  {
    path: "/privacidad",
    name: "privacy",
    component: () => import("@/views/legal/PrivacyView.vue"),
    meta: { title: "Política de privacidad — GrietaMeta" },
  },
  {
    path: "/publicidad",
    name: "advertising",
    component: () => import("@/views/legal/AdvertisingView.vue"),
    meta: {
      title: "Publicidad y enlaces de afiliado — GrietaMeta",
      description: "Cómo se financia GrietaMeta: anuncios de Google AdSense y enlaces de afiliado.",
    },
  },
  {
    path: "/exito",
    name: "checkout-success",
    component: () => import("@/views/CheckoutSuccessView.vue"),
    meta: { title: "¡Bienvenido a Premium! — GrietaMeta" },
  },

  // Direcciones antiguas (antes de pasar a Vue).
  { path: "/juegos", redirect: "/" },
  { path: "/arc-misiones", redirect: { name: "arc-quests" } },
  { path: "/arc-enemigos", redirect: { name: "arc-enemies" } },
  { path: "/registro", redirect: { name: "login", query: { modo: "registro" } } },
  { path: "/index.html", redirect: (to) => ({ path: "/lol", hash: to.hash }) },
  { path: "/privacidad.html", redirect: "/privacidad" },
  { path: "/publicidad.html", redirect: "/publicidad" },
  { path: "/exito.html", redirect: (to) => ({ path: "/exito", query: to.query }) },

  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
    meta: { title: "Página no encontrada | GrietaMeta" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    // El nav es fijo: se deja su alto de margen (scroll-padding-top de base.css).
    if (to.hash) {
      const navOffset = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop, 10) || 0;
      return { el: to.hash, top: navOffset, behavior: "smooth" };
    }
    // Misma página y solo cambia la query (filtros, ficha abierta, misión
    // elegida en el mapa…): no se mueve el scroll.
    if (to.path === from.path) return false;
    // Al cambiar de página se aparece arriba del todo, sin animar el scroll.
    return { top: 0, behavior: "instant" };
  },
});

// Rutas de usuario: sin sesión se va a /login y luego se vuelve aquí.
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;
  const loggedIn = await whenAuthReady();
  return loggedIn ? true : { name: "login", query: { redirect: to.fullPath } };
});

const DEFAULT_DESCRIPTION = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

router.afterEach((to) => {
  document.title = to.meta.title || "GrietaMeta";
  document.querySelector('meta[name="description"]')?.setAttribute("content", to.meta.description || DEFAULT_DESCRIPTION);
});

export default router;
