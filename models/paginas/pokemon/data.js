/* Datos de ejemplo para los diseños de Pokémon (1.ª generación).
   Lista de los 151 con sus tipos de la 1.ª gen (sin Acero ni Hada: Magnemite
   es solo Eléctrico, Clefairy solo Normal…). Las estadísticas, evoluciones y
   lugares solo están en los destacados: al implementar saldrán de PokeAPI. */

window.PK = (() => {
  const TYPES = {
    NOR: { n: "Normal", c: "#A8A39A" },
    FUE: { n: "Fuego", c: "#F2803A" },
    AGU: { n: "Agua", c: "#4F92F0" },
    PLA: { n: "Planta", c: "#5DBB5A" },
    ELE: { n: "Eléctrico", c: "#F2CC3A" },
    HIE: { n: "Hielo", c: "#7FD6E0" },
    LUC: { n: "Lucha", c: "#D2533E" },
    VEN: { n: "Veneno", c: "#A960B8" },
    TIE: { n: "Tierra", c: "#D9B062" },
    VOL: { n: "Volador", c: "#93A8F0" },
    PSI: { n: "Psíquico", c: "#F2668E" },
    BIC: { n: "Bicho", c: "#A6B832" },
    ROC: { n: "Roca", c: "#BBA35A" },
    FAN: { n: "Fantasma", c: "#7A6AB8" },
    DRA: { n: "Dragón", c: "#7A5AF0" },
  };
  const ORDER = Object.keys(TYPES);

  // nombre|tipos  (en orden de Pokédex)
  const RAW = `Bulbasaur|PLA VEN;Ivysaur|PLA VEN;Venusaur|PLA VEN;Charmander|FUE;Charmeleon|FUE;Charizard|FUE VOL;Squirtle|AGU;Wartortle|AGU;Blastoise|AGU;Caterpie|BIC;Metapod|BIC;Butterfree|BIC VOL;Weedle|BIC VEN;Kakuna|BIC VEN;Beedrill|BIC VEN;Pidgey|NOR VOL;Pidgeotto|NOR VOL;Pidgeot|NOR VOL;Rattata|NOR;Raticate|NOR;Spearow|NOR VOL;Fearow|NOR VOL;Ekans|VEN;Arbok|VEN;Pikachu|ELE;Raichu|ELE;Sandshrew|TIE;Sandslash|TIE;Nidoran♀|VEN;Nidorina|VEN;Nidoqueen|VEN TIE;Nidoran♂|VEN;Nidorino|VEN;Nidoking|VEN TIE;Clefairy|NOR;Clefable|NOR;Vulpix|FUE;Ninetales|FUE;Jigglypuff|NOR;Wigglytuff|NOR;Zubat|VEN VOL;Golbat|VEN VOL;Oddish|PLA VEN;Gloom|PLA VEN;Vileplume|PLA VEN;Paras|BIC PLA;Parasect|BIC PLA;Venonat|BIC VEN;Venomoth|BIC VEN;Diglett|TIE;Dugtrio|TIE;Meowth|NOR;Persian|NOR;Psyduck|AGU;Golduck|AGU;Mankey|LUC;Primeape|LUC;Growlithe|FUE;Arcanine|FUE;Poliwag|AGU;Poliwhirl|AGU;Poliwrath|AGU LUC;Abra|PSI;Kadabra|PSI;Alakazam|PSI;Machop|LUC;Machoke|LUC;Machamp|LUC;Bellsprout|PLA VEN;Weepinbell|PLA VEN;Victreebel|PLA VEN;Tentacool|AGU VEN;Tentacruel|AGU VEN;Geodude|ROC TIE;Graveler|ROC TIE;Golem|ROC TIE;Ponyta|FUE;Rapidash|FUE;Slowpoke|AGU PSI;Slowbro|AGU PSI;Magnemite|ELE;Magneton|ELE;Farfetch'd|NOR VOL;Doduo|NOR VOL;Dodrio|NOR VOL;Seel|AGU;Dewgong|AGU HIE;Grimer|VEN;Muk|VEN;Shellder|AGU;Cloyster|AGU HIE;Gastly|FAN VEN;Haunter|FAN VEN;Gengar|FAN VEN;Onix|ROC TIE;Drowzee|PSI;Hypno|PSI;Krabby|AGU;Kingler|AGU;Voltorb|ELE;Electrode|ELE;Exeggcute|PLA PSI;Exeggutor|PLA PSI;Cubone|TIE;Marowak|TIE;Hitmonlee|LUC;Hitmonchan|LUC;Lickitung|NOR;Koffing|VEN;Weezing|VEN;Rhyhorn|TIE ROC;Rhydon|TIE ROC;Chansey|NOR;Tangela|PLA;Kangaskhan|NOR;Horsea|AGU;Seadra|AGU;Goldeen|AGU;Seaking|AGU;Staryu|AGU;Starmie|AGU PSI;Mr. Mime|PSI;Scyther|BIC VOL;Jynx|HIE PSI;Electabuzz|ELE;Magmar|FUE;Pinsir|BIC;Tauros|NOR;Magikarp|AGU;Gyarados|AGU VOL;Lapras|AGU HIE;Ditto|NOR;Eevee|NOR;Vaporeon|AGU;Jolteon|ELE;Flareon|FUE;Porygon|NOR;Omanyte|ROC AGU;Omastar|ROC AGU;Kabuto|ROC AGU;Kabutops|ROC AGU;Aerodactyl|ROC VOL;Snorlax|NOR;Articuno|HIE VOL;Zapdos|ELE VOL;Moltres|FUE VOL;Dratini|DRA;Dragonair|DRA;Dragonite|DRA VOL;Mewtwo|PSI;Mew|PSI`;

  // Exclusivos de versión (Rojo / Azul occidentales).
  const ONLY_RED = [23, 24, 43, 44, 45, 56, 57, 58, 59, 123, 125];
  const ONLY_BLUE = [27, 28, 37, 38, 52, 53, 69, 70, 71, 126, 127];

  const DEX = RAW.split(";").map((s, i) => {
    const [name, t] = s.split("|");
    const id = i + 1;
    return {
      id,
      name,
      types: t.split(" "),
      ver: ONLY_RED.includes(id) ? "rojo" : ONLY_BLUE.includes(id) ? "azul" : id === 151 ? "evento" : "ambas",
    };
  });

  // Estadísticas base de la 1.ª gen: PS, Ataque, Defensa, Velocidad, Especial.
  const STATS = {
    3: [80, 82, 83, 80, 100], 6: [78, 84, 78, 100, 85], 9: [79, 83, 100, 78, 85],
    25: [35, 55, 30, 90, 50], 26: [60, 90, 55, 100, 90], 53: [65, 70, 60, 115, 65],
    65: [55, 50, 45, 120, 135], 76: [80, 110, 130, 45, 55], 80: [95, 75, 110, 30, 80],
    91: [50, 95, 180, 70, 85], 94: [60, 65, 60, 110, 130], 103: [95, 95, 85, 55, 125],
    112: [105, 130, 120, 40, 45], 113: [250, 5, 5, 50, 105], 121: [60, 75, 85, 115, 100],
    124: [65, 50, 35, 95, 95], 128: [75, 100, 95, 110, 70], 130: [95, 125, 79, 81, 100],
    131: [130, 85, 80, 60, 95], 135: [65, 65, 60, 130, 110], 143: [160, 110, 65, 30, 65],
    145: [90, 90, 85, 100, 125], 149: [91, 134, 95, 80, 100], 150: [106, 110, 90, 130, 154],
    151: [100, 100, 100, 100, 100],
  };

  // Ficha de ejemplo completa (Pikachu).
  const DETAIL = {
    25: {
      evo: [[25, "Inicial en Amarillo"], [26, "Piedra Trueno"]],
      where: [
        ["Bosque Verde", "Rojo / Azul", "Nv. 3–5", "5 %"],
        ["Central Energía", "Rojo / Azul", "Nv. 20–24", "25 %"],
        ["Pueblo Paleta", "Amarillo", "Regalo del Prof. Oak", "—"],
      ],
      moves: [
        ["Inicio", "Impactrueno", "ELE", 40, 100],
        ["Inicio", "Gruñido", "NOR", "—", 100],
        ["Nv. 9", "Onda Trueno", "ELE", "—", 100],
        ["Nv. 16", "Ataque Rápido", "NOR", 40, 100],
        ["Nv. 26", "Rapidez", "NOR", 60, "—"],
        ["Nv. 33", "Agilidad", "PSI", "—", "—"],
        ["Nv. 43", "Trueno", "ELE", 120, 70],
        ["MT 24", "Rayo", "ELE", 95, 100],
        ["MO 05", "Destello", "NOR", "—", 70],
      ],
    },
  };

  // Tabla de tipos de la 1.ª gen: [atacante][defensor] = multiplicador (1 si no está).
  const CHART = {
    NOR: { ROC: 0.5, FAN: 0 },
    FUE: { FUE: 0.5, AGU: 0.5, PLA: 2, HIE: 2, BIC: 2, ROC: 0.5, DRA: 0.5 },
    AGU: { FUE: 2, AGU: 0.5, PLA: 0.5, TIE: 2, ROC: 2, DRA: 0.5 },
    ELE: { AGU: 2, ELE: 0.5, PLA: 0.5, TIE: 0, VOL: 2, DRA: 0.5 },
    PLA: { FUE: 0.5, AGU: 2, PLA: 0.5, VEN: 0.5, TIE: 2, VOL: 0.5, BIC: 0.5, ROC: 2, DRA: 0.5 },
    HIE: { AGU: 0.5, PLA: 2, HIE: 0.5, TIE: 2, VOL: 2, DRA: 2 },
    LUC: { NOR: 2, HIE: 2, VEN: 0.5, VOL: 0.5, PSI: 0.5, BIC: 0.5, ROC: 2, FAN: 0 },
    VEN: { PLA: 2, VEN: 0.5, TIE: 0.5, BIC: 2, ROC: 0.5, FAN: 0.5 },
    TIE: { FUE: 2, ELE: 2, PLA: 0.5, VEN: 2, VOL: 0, BIC: 0.5, ROC: 2 },
    VOL: { ELE: 0.5, PLA: 2, LUC: 2, BIC: 2, ROC: 0.5 },
    PSI: { LUC: 2, VEN: 2, PSI: 0.5 },
    BIC: { FUE: 0.5, PLA: 2, LUC: 0.5, VEN: 2, VOL: 0.5, PSI: 2, FAN: 0.5 },
    ROC: { FUE: 2, HIE: 2, LUC: 0.5, TIE: 0.5, VOL: 2, BIC: 2 },
    FAN: { NOR: 0, PSI: 0, FAN: 2 },
    DRA: { DRA: 2 },
  };
  // Lo que cambia respecto a hoy: [atacante, defensor, hoy].
  const GEN1_DIFF = [
    ["BIC", "VEN", 0.5, "Bicho pegaba ×2 a Veneno"],
    ["VEN", "BIC", 1, "Veneno pegaba ×2 a Bicho"],
    ["FAN", "PSI", 2, "Por un error del juego, Fantasma no afectaba a Psíquico"],
    ["HIE", "FUE", 0.5, "Hielo hacía daño normal a Fuego"],
  ];

  const eff = (atk, def) => (CHART[atk][def] ?? 1);
  const defending = (types) =>
    Object.fromEntries(ORDER.map((a) => [a, types.reduce((m, d) => m * eff(a, d), 1)]));

  const GYMS = [
    { city: "Ciudad Plateada", leader: "Brock", type: "ROC", medal: "Medalla Roca", ace: "Onix", lvl: 14 },
    { city: "Ciudad Celeste", leader: "Misty", type: "AGU", medal: "Medalla Cascada", ace: "Starmie", lvl: 21 },
    { city: "Ciudad Carmín", leader: "Teniente Surge", type: "ELE", medal: "Medalla Trueno", ace: "Raichu", lvl: 24 },
    { city: "Ciudad Azulona", leader: "Erika", type: "PLA", medal: "Medalla Arcoíris", ace: "Vileplume", lvl: 29 },
    { city: "Ciudad Fucsia", leader: "Koga", type: "VEN", medal: "Medalla Alma", ace: "Weezing", lvl: 43 },
    { city: "Ciudad Azafrán", leader: "Sabrina", type: "PSI", medal: "Medalla Pantano", ace: "Alakazam", lvl: 43 },
    { city: "Isla Canela", leader: "Blaine", type: "FUE", medal: "Medalla Volcán", ace: "Arcanine", lvl: 47 },
    { city: "Ciudad Verde", leader: "Giovanni", type: "TIE", medal: "Medalla Tierra", ace: "Rhydon", lvl: 50 },
  ];

  const GENS = [
    { n: "I", region: "Kanto", games: "Rojo, Azul y Amarillo", year: 1996, live: true },
    { n: "II", region: "Johto", games: "Oro, Plata y Cristal", year: 1999 },
    { n: "III", region: "Hoenn", games: "Rubí, Zafiro y Esmeralda", year: 2002 },
    { n: "IV", region: "Sinnoh", games: "Diamante, Perla y Platino", year: 2006 },
    { n: "V", region: "Teselia", games: "Negro y Blanco", year: 2010 },
    { n: "VI", region: "Kalos", games: "X e Y", year: 2013 },
    { n: "VII", region: "Alola", games: "Sol y Luna", year: 2016 },
    { n: "VIII", region: "Galar", games: "Espada y Escudo", year: 2019 },
    { n: "IX", region: "Paldea", games: "Escarlata y Púrpura", year: 2022 },
  ];

  return { TYPES, ORDER, DEX, STATS, DETAIL, CHART, GEN1_DIFF, GYMS, GENS, eff, defending };
})();
