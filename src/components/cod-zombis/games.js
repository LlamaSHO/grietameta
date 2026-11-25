/* Catálogo de los juegos de la saga de zombis de Call of Duty.
   Lo usan la barra del juego (menú «Juegos»), las tarjetas de la portada y el
   bloque «Los otros Black Ops» de cada página de juego. Los datos de cada
   juego (mapas, Easter eggs…) están en public/data/cod-zombis/bo*.json. */

const IMG = "/images/cod-zombis/";

export const COD_GAMES = [
  {
    id: "bo1", route: "/cod-zombis/black-ops", name: "Black Ops", year: 2010, color: "#7FD3E8",
    img: IMG + "cod-bo1.webp", nMaps: 6, nEggs: 4,
    blurb: "El juego que convirtió Zombies en una saga: los Ultimis viajan del cine de Kino der Toten hasta la Luna, y Richtofen pone en marcha su plan.",
    teaser: "Kino der Toten, «Five», Ascension, Call of the Dead…",
    chips: [["kino", "Kino der Toten", "#E2B866"], ["five", "«Five»", "#B9C2CC"], ["ascension", "Ascension", "#E2364B"], ["cotd", "Call of the Dead", "#8FB2F2"], ["shangri", "Shangri-La", "#7FE0A3"], ["moon", "Moon", "#BCD0F2"]],
  },
  {
    id: "bo2", route: "/cod-zombis/black-ops-2", name: "Black Ops II", year: 2012, color: "#F0B35A",
    img: IMG + "cod-bo2.webp", nMaps: 6, nEggs: 5,
    blurb: "La Tierra está rota. Los Victis sobreviven en el futuro entre Maxis y Richtofen, mientras en Alcatraz y en 1918 empiezan otras historias.",
    teaser: "TranZit, Nuketown Zombies, Die Rise, Mob of the Dead…",
    chips: [["tranzit", "TranZit", "#F0B35A"], ["nuketown", "Nuketown Zombies", "#E8C98A"], ["dierise", "Die Rise", "#E2364B"], ["mob", "Mob of the Dead", "#F28FA0"], ["buried", "Buried", "#C9A45C"], ["origins", "Origins", "#E8C98A"]],
  },
  {
    id: "bo3", route: "/cod-zombis/black-ops-3", name: "Black Ops III", year: 2015, color: "#E2364B",
    img: IMG + "cod-bo3.webp", nMaps: 6, nEggs: 6,
    blurb: "Los Primis recorren el multiverso con la Llave de la Invocación para arreglar el plan de Richtofen, de Morg City a Agartha.",
    teaser: "Shadows of Evil, The Giant, Der Eisendrache, Zetsubou No Shima…",
    chips: [["soe", "Shadows of Evil", "#B9A3E8"], ["giant", "The Giant", "#BCD0F2"], ["de", "Der Eisendrache", "#F28FA0"], ["zns", "Zetsubou No Shima", "#7FE0A3"], ["gk", "Gorod Krovi", "#E2364B"], ["rev", "Revelations", "#8FB2F2"]],
  },
  {
    id: "bo4", route: "/cod-zombis/black-ops-4", name: "Black Ops 4", year: 2018, color: "#C9A45C",
    img: "", ph: "IIII", nMaps: 8, nEggs: 7,
    blurb: "Dos historias en paralelo: la nueva tripulación del Caos persigue artefactos antiguos y el Aether llega a su final.",
    teaser: "IX, Voyage of Despair, Blood of the Dead, Classified…",
    chips: [["ix", "IX", "#E2364B"], ["vod", "Voyage of Despair", "#8FB2F2"], ["botd", "Blood of the Dead", "#F28FA0"], ["classified", "Classified", "#B9C2CC"], ["dotn", "Dead of the Night", "#B9A3E8"], ["ae", "Ancient Evil", "#E8C98A"], ["ao", "Alpha Omega", "#7FE0A3"], ["tdt", "Tag der Toten", "#BCD0F2"]],
  },
];

/* Menú «Juegos» de la barra: los de la guía y los «Próximamente». */
const soon = (ini, name, year) => ({ ini, name, sub: year + " · Próximamente" });
export const COD_MENU = [
  {
    title: "Saga del Aether", sub: "Ultimis, Primis y Victis: la historia principal",
    items: [
      soon("WaW", "World at War", 2008),
      ...COD_GAMES.map((g) => ({ ini: g.id === "bo4" ? "4" : "", img: g.img, name: g.name, sub: String(g.year), to: g.route, id: g.id })),
    ],
  },
  {
    title: "Saga del Aether Oscuro", sub: "La historia nueva, desde Cold War",
    items: [soon("CW", "Black Ops Cold War", 2020), soon("VG", "Vanguard", 2021), soon("MW3", "Modern Warfare III", 2023), soon("6", "Black Ops 6", 2024), soon("7", "Black Ops 7", 2025)],
  },
  {
    title: "Otros zombis", sub: "Historias aparte de otros estudios",
    items: [soon("AW", "Advanced Warfare · Exo Zombies", 2014), soon("IW", "Infinite Warfare", 2016), soon("WW2", "WWII · Nazi Zombies", 2017)],
  },
];
