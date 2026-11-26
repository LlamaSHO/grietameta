/* Los 9 juegos del sitio tal y como salen en el menú «Juegos», en la barra
   inferior del móvil y en la portada (diseño: Main.dc.html).
   El orden, las imágenes y los textos cortos están aquí; la ruta, el estado y el
   nombre salen de src/data/games.json cuando el juego existe allí. Los juegos
   que no están en games.json (Resident Evil, Rust) son «Próximamente» y no
   tienen enlace. */

import { computed, ref } from "vue";
import { fetchGames } from "@/services/games";

export const CATALOG = [
  { slug: "lol", name: "League of Legends", small: "Tier list y builds", accent: "#D9B56E", img: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg", url: "/lol", status: "live" },
  { slug: "arc-raiders", name: "ARC Raiders", small: "Objetos, misiones y mapas", accent: "#FF6A3D", img: "/images/arc-raiders/bots/arc_the_queen.webp", url: "/arc-raiders", status: "live" },
  { slug: "zelda-totk", name: "Zelda: Tears of the Kingdom", small: "Mapa, semillas y santuarios", accent: "#4FE0B6", img: "/images/zelda/hyrule.jpg", url: "/zelda", status: "building" },
  { slug: "pokemon", name: "Pokémon", small: "Pokédex, tipos y meta", accent: "#FFCB3D", img: "/images/home/art-25.webp", url: "/pokemon", status: "live", isNew: true, mon: true },
  { slug: "ark", name: "ARK", small: "Dinos, mapas y bases", accent: "#62B43C", img: "/images/home/hero-ark.webp", url: "/ark", status: "progress" },
  { slug: "assassins-creed", name: "Assassin's Creed", small: "La saga y la guía de Unity", accent: "#E8E2D0", img: "/images/home/ac-saga.webp", url: "/assassins-creed", status: "live", isNew: true },
  { slug: "cod-zombis", name: "Call of Duty", small: "Zombis de Black Ops 1 a 4", accent: "#FF7A1A", img: "/images/home/cod-bo1.webp", url: "/cod-zombis", status: "live", isNew: true },
  { slug: "resident-evil", name: "Resident Evil", small: "Mapas, puzles y cajas fuertes", accent: "#E2364B", img: "/images/home/hero-re.webp", url: null, status: "soon", short: "RE", aliases: ["resident evil", "re", "biohazard", "capcom"] },
  { slug: "rust", name: "Rust", small: "Monumentos y calculadora de raid", accent: "#CE422B", img: "/images/home/hero-rust.webp", url: null, status: "soon", short: "Rust", aliases: ["rust", "facepunch", "raid"] },
];

export function statusLabel(g) {
  if (g.isNew && g.status === "live") return "Nuevo";
  if (g.status === "building") return "En construcción";
  if (g.status === "progress") return "En progreso";
  if (g.status === "soon") return "Próximamente";
  return "Disponible";
}

const remote = ref([]);
let started = false;

// Catálogo reactivo: al principio con los datos locales; al llegar
// games.json se completan estado, ruta y nombre.
export function useCatalog() {
  if (!started) {
    started = true;
    fetchGames().then((g) => (remote.value = g));
  }
  const games = computed(() =>
    CATALOG.map((c) => {
      const r = remote.value.find((x) => x.slug === c.slug);
      return r ? { ...c, status: r.status || c.status, url: r.url || c.url, tagline: r.tagline, aliases: r.aliases, short: r.short, icon: r.icon } : c;
    })
  );
  const available = computed(() => games.value.filter((g) => g.url && g.status !== "soon").length);
  return { games, available };
}
