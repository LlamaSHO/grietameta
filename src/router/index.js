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
      if (["santuarios", "semillas", "raices", "misiones", "armaduras", "conjuntos"].includes(guia)) {
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
    path: "/zelda/:guia(santuarios|semillas|raices|misiones|armaduras|conjuntos)",
    name: "zelda-guide",
    component: () => import("@/views/zelda/ZeldaGuideView.vue"),
    meta: { game: "zelda-totk", title: "Zelda: Tears of the Kingdom · Guía | GrietaMeta" },
  },
  // ---- GrietaMeta v1: juegos nuevos y páginas nuevas de LoL ----
  {
    path: "/lol/esports",
    name: "lol-esports",
    component: () => import("@/views/lol/LolEsportsView.vue"),
    meta: { game: "lol", title: "League of Legends · eSports | GrietaMeta" },
  },
  {
    path: "/lol/builds",
    name: "lol-builds",
    component: () => import("@/views/lol/LolBuildsView.vue"),
    meta: { game: "lol", title: "League of Legends · Builds | GrietaMeta" },
  },
  {
    path: "/lol/noticias",
    name: "lol-news",
    component: () => import("@/views/lol/LolNewsView.vue"),
    meta: { game: "lol", title: "League of Legends · Noticias | GrietaMeta" },
  },
  {
    path: "/pokemon",
    name: "pokemon",
    component: () => import("@/views/pokemon/PokemonView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Guía | GrietaMeta" },
  },
  {
    path: "/pokemon/pokedex",
    name: "pokemon-dex",
    component: () => import("@/views/pokemon/PokemonDexView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Pokédex | GrietaMeta" },
  },
  {
    path: "/pokemon/tipos",
    name: "pokemon-types",
    component: () => import("@/views/pokemon/PokemonTypesView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Tabla de tipos | GrietaMeta" },
  },
  {
    path: "/pokemon/habilidades",
    name: "pokemon-abilities",
    component: () => import("@/views/pokemon/PokemonAbilitiesView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Habilidades, movimientos y naturalezas | GrietaMeta" },
  },
  {
    path: "/pokemon/mecanicas",
    name: "pokemon-mechanics",
    component: () => import("@/views/pokemon/PokemonMechanicsView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Megaevolución, Z, Dinamax y teracristalización | GrietaMeta" },
  },
  {
    path: "/pokemon/kanto",
    name: "pokemon-kanto",
    component: () => import("@/views/pokemon/PokemonKantoView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Kanto | GrietaMeta" },
  },
  {
    path: "/pokemon/kanto/mapa",
    name: "pokemon-kanto-map",
    component: () => import("@/views/pokemon/PokemonKantoMapView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Mapa de Kanto | GrietaMeta" },
  },
  {
    path: "/pokemon/kanto/100",
    name: "pokemon-kanto-100",
    component: () => import("@/views/pokemon/PokemonKanto100View.vue"),
    meta: { game: "pokemon", title: "Pokémon · Kanto al 100 % | GrietaMeta" },
  },
  {
    path: "/pokemon/competitivo",
    name: "pokemon-competitive",
    component: () => import("@/views/pokemon/PokemonCompetitiveView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Competitivo | GrietaMeta" },
  },
  {
    path: "/pokemon/competitivo/showdown",
    name: "pokemon-showdown",
    component: () => import("@/views/pokemon/PokemonShowdownView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Showdown | GrietaMeta" },
  },
  {
    path: "/pokemon/competitivo/equipo",
    name: "pokemon-team",
    component: () => import("@/views/pokemon/PokemonTeamView.vue"),
    meta: { game: "pokemon", title: "Pokémon · Crea tu equipo | GrietaMeta" },
  },
  {
    path: "/assassins-creed",
    name: "ac",
    component: () => import("@/views/assassins-creed/AcSagaView.vue"),
    meta: { game: "assassins-creed", title: "Assassin's Creed · La saga | GrietaMeta" },
  },
  {
    path: "/assassins-creed/unity",
    name: "ac-unity",
    component: () => import("@/views/assassins-creed/AcUnityView.vue"),
    meta: { game: "assassins-creed", title: "Assassin's Creed Unity · Guía | GrietaMeta" },
  },
  {
    path: "/cod-zombis",
    name: "cod",
    component: () => import("@/views/cod-zombis/CodHomeView.vue"),
    meta: { game: "cod-zombis", title: "CoD Zombis · Guía | GrietaMeta" },
  },
  {
    path: "/cod-zombis/black-ops",
    name: "cod-bo1",
    component: () => import("@/views/cod-zombis/CodBo1View.vue"),
    meta: { game: "cod-zombis", title: "Black Ops · Zombis | GrietaMeta" },
  },
  {
    path: "/cod-zombis/black-ops-2",
    name: "cod-bo2",
    component: () => import("@/views/cod-zombis/CodBo2View.vue"),
    meta: { game: "cod-zombis", title: "Black Ops II · Zombis | GrietaMeta" },
  },
  {
    path: "/cod-zombis/black-ops-3",
    name: "cod-bo3",
    component: () => import("@/views/cod-zombis/CodBo3View.vue"),
    meta: { game: "cod-zombis", title: "Black Ops III · Zombis | GrietaMeta" },
  },
  {
    path: "/cod-zombis/black-ops-4",
    name: "cod-bo4",
    component: () => import("@/views/cod-zombis/CodBo4View.vue"),
    meta: { game: "cod-zombis", title: "Black Ops 4 · Zombis | GrietaMeta" },
  },
  {
    path: "/cod-zombis/planos/:mapa?",
    name: "cod-maps",
    component: () => import("@/views/cod-zombis/CodMapsView.vue"),
    meta: { game: "cod-zombis", title: "CoD Zombis · Planos de los mapas | GrietaMeta" },
  },
  {
    path: "/ark",
    name: "ark",
    component: () => import("@/views/ark/ArkHomeView.vue"),
    meta: { game: "ark", title: "ARK: Survival Evolved · Guía | GrietaMeta" },
  },
  {
    path: "/ark/criaturas",
    name: "ark-creatures",
    component: () => import("@/views/ark/ArkCreaturesView.vue"),
    meta: { game: "ark", title: "ARK · Criaturas | GrietaMeta" },
  },
  {
    path: "/ark/engramas",
    name: "ark-engrams",
    component: () => import("@/views/ark/ArkEngramsView.vue"),
    meta: { game: "ark", title: "ARK · Engramas | GrietaMeta" },
  },
  {
    path: "/ark/recursos",
    name: "ark-resources",
    component: () => import("@/views/ark/ArkResourcesView.vue"),
    meta: { game: "ark", title: "ARK · Recursos | GrietaMeta" },
  },
  {
    path: "/ark/guias",
    name: "ark-guides",
    component: () => import("@/views/ark/ArkGuidesView.vue"),
    meta: { game: "ark", title: "ARK · Guías | GrietaMeta" },
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
    // Planos y mapas: al cambiar de mapa (cambia el parámetro de la ruta) no se
    // vuelve arriba, para que el plano siga a la vista.
    if (from.name && to.name === from.name && ["cod-maps", "arc-map"].includes(to.name)) return false;
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
