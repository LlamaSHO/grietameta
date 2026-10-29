import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

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
    meta: { title: "League of Legends — Builds, tier list y winrates | GrietaMeta" },
  },
  {
    path: "/arc-raiders",
    name: "arc-items",
    component: () => import("@/views/arc-raiders/ArcItemsView.vue"),
    meta: {
      title: "ARC Raiders · Objetos | ArcMeta",
      description: "Objetos de ARC Raiders en español: qué vender, reciclar, guardar o usar, con valores, reciclaje y recetas.",
    },
  },
  {
    path: "/arc-misiones",
    name: "arc-quests",
    component: () => import("@/views/arc-raiders/ArcQuestsView.vue"),
    meta: {
      title: "ARC Raiders · Misiones | ArcMeta",
      description: "Seguimiento de misiones de ARC Raiders en español: marca las que completas, mira cuáles tienes disponibles y qué objetos debes guardar.",
    },
  },
  {
    path: "/arc-enemigos",
    name: "arc-enemies",
    component: () => import("@/views/arc-raiders/ArcEnemiesView.vue"),
    meta: {
      title: "ARC Raiders · Enemigos | ArcMeta",
      description: "Todos los enemigos ARC de ARC Raiders en español: puntos débiles, qué sueltan y las mejores armas y balas para cada uno.",
    },
  },
  {
    path: "/zelda",
    name: "zelda",
    component: () => import("@/views/ZeldaView.vue"),
    meta: {
      title: "Zelda: Tears of the Kingdom · Guía | ZeldaMeta",
      description: "Guía de Zelda: Tears of the Kingdom en español: mapa de semillas kolog y santuarios, misiones principales y secundarias y armaduras con más defensa.",
    },
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
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});

const DEFAULT_DESCRIPTION = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";

router.afterEach((to) => {
  document.title = to.meta.title || "GrietaMeta";
  document.querySelector('meta[name="description"]')?.setAttribute("content", to.meta.description || DEFAULT_DESCRIPTION);
});

export default router;
