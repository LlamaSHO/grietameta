# models/ — diseños de referencia de GrietaMeta

Esta carpeta guarda los diseños del rediseño (portada, LoL, Zelda, ARC Raiders, Pokémon, Assassin's Creed, Call of Duty Zombies, Premium, cuenta, contacto y logo) para ir pasándolos a Vue.
**No forma parte de la build**: Vite solo empaqueta lo que importa `src/` y copia `public/`, así que `models/` no llega a producción.

Lienzo original (para verlos funcionando, con animaciones y clics):
https://claude.ai/code/artifact/7a6dd2b8-227b-4e01-946c-2a1a4e1ccc68
En el lienzo, pulsa **Play** para navegar entre páginas, arrastrar los mapas, etc. En modo edición los clics seleccionan elementos.
El lienzo está dividido en una página por franquicia (GrietaMeta, League of Legends, ARC Raiders, Zelda, Pokémon, Assassin's Creed, Call of Duty Zombies) más una con las vistas móviles anteriores.

---

## Estructura

```
models/
├── paginas/
│   ├── Main.dc.html         → Portada (/): los 9 juegos en «¿A qué juegas hoy?», en filas de 3
│   ├── AssassinsCreed.dc.html → Saga de Assassin's Creed: los 16 juegos con su imagen, por lanzamiento o por época, por dónde empezar, guía destacada y novedades
│   ├── ACUnity.dc.html      → Guía de AC Unity: mapa de París sobre el plano de 1790 (zoom con la rueda, filtro por secuencia, coleccionables y misiones por barrio), «La revolución de Arno» en diapositivas, actividades, personajes y ficha
│   ├── CodZombies.dc.html   → Portada de Call of Duty Zombies: los 4 Black Ops, buscador de mapas, historia del Aether con spoilers ocultos, personajes clave, tripulaciones y glosario
│   ├── CodBO1.dc.html … CodBO4.dc.html → Una página por juego: selector de mapas y ficha de cada mapa (Pack-a-Punch, ventajas, armas de pared, armas especiales, Easter egg paso a paso, canción secreta), historia y personajes
│   ├── Lol.dc.html          → Hub de LoL: tier list, filtros, campeón del parche (/lol)
│   ├── LolCampeon.dc.html   → Ficha de campeón al estilo dpm.lol (Yasuo): build completa, orden de habilidades, winrate por objeto, matchups y descripciones al pasar el ratón
│   ├── LolEsports.dc.html   → eSports: final del Mundial 2026 con cuenta atrás, calendario y resultados por liga, cuadro final, historias y jugadores
│   ├── Zelda.dc.html        → Hub de Zelda TotK: mapa interactivo + información (/zelda)
│   ├── ZeldaGuia.dc.html    → Guías de Zelda (/zelda/:guia): santuarios, raíces de luz, semillas por zona, misiones, armaduras y conjuntos
│   ├── Arc.dc.html          → Hub de ARC Raiders (estilo arcraidershub)
│   ├── ArcMapa.dc.html      → Mapa de ARC con misiones y enemigos por mapa
│   ├── ArcObjetos.dc.html   → Objetos de ARC (/arc-raiders/objetos): los 581 con recomendación, filtros y ficha
│   ├── ArcEnemigos.dc.html  → Enemigos de ARC (/arc-raiders/enemigos): filtros, punto débil, botín y armas
│   ├── ArcMisiones.dc.html  → Misiones de ARC (/arc-raiders/misiones): progreso por comerciante, objetivos y recompensas
│   ├── Premium.dc.html      → Planes Gratis / Premium (mensual o anual), comparativa y preguntas
│   ├── MiPremium.dc.html    → Panel de la suscripción: estado, avisos por juego y pagos
│   ├── PremiumExito.dc.html → Pantalla tras pagar en Stripe (/exito)
│   ├── Login.dc.html        → Iniciar sesión, crear cuenta y recuperar contraseña
│   ├── Contacto.dc.html     → Formulario de contacto con envío de email (/contacto)
│   ├── Pokemon.dc.html            → Portada de Pokémon: meta competitivo, novedades, regiones y herramientas
│   ├── PokemonDex.dc.html         → Pokédex de los 1025 con selector de generación y ficha lateral
│   ├── PokemonTipos.dc.html       → Tabla de tipos (15/17/18) con calculadora de debilidades
│   ├── PokemonHabilidades.dc.html → Tres pestañas: habilidades por tipo con chips de efecto, 919 movimientos con tipo/categoría/potencia, y naturalezas con recomendador
│   ├── PokemonCompetitivo.dc.html → Pokémon Champions (oficial): uso en dobles e individuales con sets, equipos de torneo, parejas, arquetipos, megas y Mundial
│   ├── PokemonShowdown.dc.html    → Pokémon Showdown (simulador): Champions vs Showdown, tiers OU/SV OU/VGC/BSS, sets, núcleos y primeros pasos
│   ├── PokemonEquipo.dc.html      → Crea tu equipo: asistente con sugerencias, «Generar el mejor equipo», funciones, debilidades y equipos parecidos
│   ├── PokemonKanto.dc.html       → Kanto: historia en 16 pasos, gimnasios, iniciales y exclusivos
│   ├── PokemonKantoMapa.dc.html   → Mapa interactivo de Kanto (ilustración v2) con zoom, buscador que resalta rutas y recomienda dónde capturar
│   ├── PokemonKanto100.dc.html    → Kanto al 100 %: los 151, medallas, MT/MO, objetos clave y legendarios
│   └── pokemon/             → Primer intento de Pokémon (HTML normal, no .dc.html; ver abajo)
├── logo/
│   ├── Logo.dc.html            → Logo GM tricolor + animación (el principal)
│   ├── Logo-Grieta.dc.html     → Alternativa: grieta
│   ├── Logo-Hex.dc.html        → Alternativa: hexágono
│   └── Logo-Wordmark.dc.html   → Alternativa: solo texto
└── assets/
    ├── brand/        gm-logo.svg (tricolor), gm-logo-verde.svg (verde original),
    │                 gm-logo-mono.svg (una tinta, currentColor), gm-favicon.svg
    ├── games/        logo-lol.png, logo-arc.png, logo-zelda.png (fondo transparente)
    ├── lol/rangos/   iron … master .png (emblemas oficiales, Community Dragon)
    ├── lol/posiciones/ top, jungle, middle, bottom, utility, fill .png
    ├── lol/          campeones.webp (173 iconos, 14×13 celdas de 96 px), iconos.webp (objetos, runas, hechizos y habilidades, 10×7 de 64 px), yasuo-splash.webp
    ├── zelda/iconos/ santuario, semilla, torre, cueva, hecho .svg (iconos propios)
    ├── zelda/mapas/  superficie-hd.webp y cielo-hd.webp (6000×5000, mapa completo del juego)
    ├── arc/comerciantes/ shani, celeste, tian-wen, apollo, lance .webp (retratos)
    ├── social/       google.png, discord.svg, riotgames.svg, epicgames.svg, steam.svg
    ├── pokemon/      sprites-front.png (hoja de 1025 sprites, 32×33 celdas de 64 px),
    │                 sprites-gen1.png (151 sprites de Rojo/Azul, 16×10 celdas de 56 px),
    │                 artwork.webp (212 ilustraciones, 15×15 celdas de 200 px) y art-<id>.webp grandes,
│                 artwork-meta.webp (125 ilustraciones de Competitivo con formas y megas, 12×11 celdas de 128 px),
│                 artwork-megas.webp (las 97 megaevoluciones con su ilustración oficial, 10×10 de 128 px);
│                 sprites-gen1.png rehecho: cada sprite de Rojo/Azul ocupa su celda de 56 px entera (antes salía cortado)
    ├── juegos/       hero-*.webp y logo-*.webp/png de ARK, Assassin's Creed, Call of Duty, Resident Evil y Rust;
    │                 ac-saga.webp (arte oficial de Ubisoft con todos los asesinos, portada de la saga) y hero-ac.webp (arte de Unity)
    ├── assassins-creed/ paris-1790.webp (2400×1652, plano de 1790 recoloreado: fondo del mapa de Unity), paris-1790-mini.webp (miniatura),
    │                 juegos.webp (hoja de 15 portadas de 520×260 en 4×4: posiciones en la página de la saga)
    └── call-of-duty/ cod-hero.webp (Ascension, fondo de la portada), cod-bo1/2/3.webp (portadas de cada juego) y
                      capturas de mapas: cod-cotd, cod-shangri, cod-tranzit, cod-mob, cod-buried, cod-origins (1280×720)
data/
├── arc-calibracion-mapas.json  → cómo pasar lat/lng de MetaForge a píxeles de cada mapa
├── arc-zonas-enemigos.json     → puntos de aparición por enemigo y mapa (en %)
├── arc-misiones-puntos.json    → puntos de cada misión por mapa (en %), por id de misión
├── assassins-creed/
│   ├── saga.json           → 14 juegos + Black Flag Resynced y Hexe: fechas, protagonista, lugar, época, era; «por dónde empezar» y novedades
│   ├── unity-mapa.json     → v2 sobre el plano de 1790: lienzo 2928×2016, los 22 barrios como paths (contorno + etiqueta), coleccionables y misiones
│   │                         secundarias por barrio, tipos de misión con color, 33 lugares con x/y (en px del lienzo) y sus memorias, y la ruta
│   ├── unity-historia.json → prólogo y 12 secuencias (34 memorias): objetivo, pasos, objetivos opcionales, oportunidades, asesinato único,
│   │                         lo que desbloquea, spoiler y si es un fallo del Helix (campos ocultos por defecto en la web)
│   └── unity-extras.json   → actividades, consejos, personajes y ficha del juego
├── call-of-duty/zombies.json   → Black Ops 1 a 4: 26 mapas (Pack-a-Punch, ventajas, armas de pared con precio, armas especiales, Easter egg, canción,
│                                 imagen), tripulaciones, personajes clave con spoiler, historia en 6 capítulos y glosario
├── lol/iconos-indices.json     → orden de campeones e iconos dentro de campeones.webp e iconos.webp
└── pokemon/
    ├── dex.json            → 1025 Pokémon: [nº, nombre, gen, tipos, stats, categoría, altura, peso, habilidades, legendario, preevolución, ratio]
    ├── gen1.json           → Gen I: tipos de la época, Especial, evolución, descripción, movimientos y encuentros en Rojo/Azul/Amarillo
    ├── past.json           → tipos y estadísticas que cambiaron entre generaciones
    ├── types.json          → tabla de tipos actual + excepciones por generación
    ├── kantomap.json       → lugares del mapa de Kanto (en %), MT, MO, objetos clave y especiales
    ├── k151.json           → cómo se consigue cada uno de los 151 en cada versión
    ├── abilities*.json, natures.json, g1moves.json, locnames.json
    ├── meta.json           → top 20 del Reglamento M-C (octubre de 2026) con objeto, movimientos y texto «por qué funciona»
    ├── smogon-uso.json     → top 40 de 4 formatos de Showdown (VGC M-C, BSS M-C, Champions OU, SV OU): uso, objetos, habilidades, movimientos, reparto y compañeros
    ├── competitivo.json    → lo que usan las 3 páginas de Competitivo: formatos con compañeros resueltos, núcleos (parejas) y 8 equipos de torneo de Pikalytics
    ├── sprites-meta-indices.json → orden de las ilustraciones dentro de artwork-meta.webp
    ├── habilidades-v2.json → 314 habilidades: [id, nombre, gen, descripción, tipo relacionado o vacío, chips de efecto]
    ├── movimientos.json    → 919 movimientos: [id, nombre, tipo, categoría 0 físico/1 especial/2 estado, potencia, precisión, PP, prioridad, chips, descripción, gen]
    ├── megas.json          → megaevoluciones por especie: [id de forma, nombre, tipos, stats, habilidad]; megas-indices.json → orden en artwork-megas.webp
    ├── recomendaciones.json → por Pokémon: habilidad recomendada (con % de uso si está en el meta) y 4 movimientos recomendados
    └── sprites-indices.json → orden de las ilustraciones dentro de artwork.webp
```

**Vistas móviles**: no hay archivos aparte. Cada `.dc.html` es responsive (cortes en 860, 640 y 560 px). Las páginas de Pokémon nuevas se han centrado en la versión web; las vistas a 390 px del lienzo son solo de las páginas anteriores.

## Pokémon: primer intento (`paginas/pokemon/`)

Los diseños nuevos del lienzo principal son los `Pokemon*.dc.html` de `paginas/` (ver «Pokémon → /pokemon» en «Página por página»). Esta carpeta se queda tal cual como referencia.

Lienzo con los diseños (las mismas 8 páginas como artboards, con Play):
https://claude.ai/artifact/Ge5SV5Lh2DNf4kwSn8pfsj

Diseños de Pokémon empezando por la 1.ª generación (Kanto). A diferencia de
los `.dc.html`, son **HTML normales** con `pokemon.css` (estilos comunes),
`shell.js` (nav, barra del juego, pie y barra de móvil) y `data.js` (datos de
ejemplo). Para verlos: `npx vite models --port 5180` y abre
`http://localhost:5180/paginas/pokemon/`.

| Archivo | Página |
|---|---|
| `index.html` | Portada de Pokémon: novedades, meta competitivo, generaciones y herramientas |
| `kanto.html` | Portada de Kanto: versiones, progreso, gimnasios en orden y exclusivos |
| `pokedex.html` | Pokédex con filtros y ficha (estadísticas de Gen I, daño recibido, evolución, lugares, movimientos) |
| `mapa-kanto.html` | Mapa interactivo (esquema propio, no el del juego) con capas, zoom y «hecho» |
| `guia-kanto.html` | Guía de la historia por tramos y checklist del 100 % |
| `tipos.html` | Tabla de tipos de Gen I, diferencias con hoy y calculador de debilidades |
| `habilidades.html` | Habilidades y naturalezas: estado «no existen en Gen I» y vista previa |
| `competitivo.html` | Tiers de Gen I OU, sets, reglas propias de Gen I y equipos de ejemplo |

Zona Pokémon: rojo Pokédex `#FF5A4E` + amarillo `#FFD35C`. En Kanto el acento
pasa a la pantalla de Game Boy (`#8BAC0F`, `#C4D96A`, `#0F2A12`) y los números
usan Pixelify Sans. Los sprites son un hueco (`.sprite`) hasta decidir qué
imágenes se pueden usar (PK12 en `docs/plan-nuevos-juegos.md`).

## Accesibilidad y móvil (pasada del 2026-11-25)

- Todas las páginas llevan un bloque `/* gm-a11y */`: anillo de foco visible con el color de cada juego, color de selección, `prefers-reduced-motion` global y el botón Premium sin cambiar de color al pasar el ratón.
- Letra mínima de 11 px (8 px solo en la fuente pixelada de Kanto). Grises y botones rojos ajustados a contraste AA.
- Assassin's Creed y CoD Zombis tienen un bloque `/* gm-responsive */` con cortes a 1100, 860 y 560 px.
- **Ojo con el runtime**: cada `{{valor}}` se pinta dentro de un `<span>`. Una regla como `.h1 span{font-size:.5em}` se aplica dos veces y deja el texto diminuto. Usa el hijo directo (`.h1>span`). En Vue no pasa, pero conviene copiar el CSS ya corregido.

## Cómo leer un `.dc.html`

Son HTML del lienzo de diseño. Usan un runtime propio (`support.js`, `<x-dc>`), así que **no se abren solos con doble clic**: úsalos como referencia de maquetación, CSS y lógica.

| En el diseño | En Vue |
|---|---|
| `<helmet><style>…</style></helmet>` | CSS normal → `src/assets/styles/views/<vista>.css` (se copia casi tal cual) |
| `{{ algo.campo }}` | `{{ algo.campo }}` (igual) |
| `<sc-for list="{{items}}" as="r">` | `<template v-for="r in items" :key="…">` |
| `<sc-if value="{{cond}}">` | `<template v-if="cond">` |
| `onclick="{{fn}}"` | `@click="fn"` |
| `this.state` / `this.setState({...})` | `ref()` / `reactive()` |
| `renderVals()` (valores derivados) | `computed()` |
| `data-props` → `animaciones` | Clase en `<html>` o `@media (prefers-reduced-motion)` |
| `href="Lol.dc.html"` | `<RouterLink :to="{ name: 'lol' }">` |

Rutas de imágenes ya convertidas:
- `/images/...` → ya existen en `public/images/` del proyecto.
- `https://ddragon.leagueoflegends.com/cdn/16.21.1/...` → Data Dragon (campeones, objetos, runas, habilidades, splash).
- `../assets/...` → están en `models/assets/`. Al portar, muévelas a `public/images/` (misma subcarpeta) y cambia la ruta a `/images/...`.

---

## Página por página

### Main → `/` (`HomeView.vue`)
- Nav con mini-logo GM, hero con el emblema GM animado (trazo + brillo), iconos flotantes (`.deco` f1–f8) y tarjetas de "Juegos destacados" (`.floaters`).
- Buscador + chips de atajos → reutilizar `GameSearch.vue`.
- Paneles de juego con splash que se expanden al hover, ahora **los 9 juegos en «¿A qué juegas hoy?»** en tres filas de 3 (`.grid9 > .panels`, 420 px de alto cada fila): LoL, ARC, Zelda · Pokémon, Assassin's Creed, ARK · CoD, RE, Rust. Ya no existe la fila «Llegan seis juegos más». En Vue: un `v-for` por filas (`chunk(juegos, 3)`).
- CTA "pedir juego" y footer.
- Componentes sugeridos: `GmEmblem.vue`, `HomeHero.vue`, `FloatingDeco.vue`, `GamePanels.vue`, `RequestGameCta.vue`.

### Lol → `/lol` (`LolView.vue`)
- Mega-menú con sub-secciones (Campeones detallados, Tier list, etc.).
- Tier list con filtro por línea (iconos de posición), desplegable de rango con emblemas oficiales y desplegable de región.
- Bloque "Campeón del parche" clicable → ficha del campeón. Widgets laterales y Premium.
- Datos: `services/riotStats.js` + `champion-stats.json` (parche 16.21, EUW).
- Componentes: `LolTierList.vue`, `RankDropdown.vue`, `RegionDropdown.vue`, `RoleFilter.vue`, `PatchSpotlight.vue`.

### LolCampeon → ruta nueva `/lol/campeon/:id` (`LolChampionView.vue`)
- Inspirada en dpm.lol. Cabecera con splash, habilidades P/Q/W/E/R y tres datos rápidos (mejor duelo, peor duelo, pico de poder). Pestañas **Build · Matchups · Por rango**.
- Barra de filtros: posición con % de partidas, rango (emblemas), región y parche. Franja de estadísticas: tier, puesto, winrate, pickrate, banrate y partidas.
- **Build más usada**: árbol de runas completo (principal, secundaria y fragmentos, con las elegidas resaltadas), hechizos, orden de mejora, inicio, botas, núcleo en orden real de compra y situacionales.
- **Orden de habilidades** nivel a nivel (1-18), **Qué comprar después** (opciones para el 1.º-4.º objeto con winrate y partidas), **Cómo jugarlo** (4 recomendaciones) y **Winrate con cada objeto** con aviso del sesgo de los objetos tardíos.
- **Matchups**: 5 duelos fuertes y 5 débiles (con 1.000+ partidas) y botón «Lista completa»; la pestaña Matchups tiene buscador, orden (mejores, peores, más jugados) y filtro de 1.000+ partidas.
- **Descripciones en todo**: cada objeto, runa, fragmento, hechizo y habilidad tiene tarjeta al pasar el ratón (o al enfocarlo con teclado) con nombre, coste o enfriamiento, estadísticas y texto de Data Dragon `es_ES` 16.22.1. Componente `IconTooltip.vue`.
- Qué tiene que calcular el Action además de lo actual: orden de habilidades (Timeline: `SKILL_LEVEL_UP`), hechizos, runas menores y fragmentos (`perks`), winrate por objeto y por posición del objeto, y matchups (rival de la misma `teamPosition`) con partidas y winrate. En el diseño, esas partes llevan datos de LoLalytics (Esmeralda+, 16.22) como ejemplo, y está indicado al pie.
- Tier list (`Lol.dc.html`): el campeón del parche también tiene las tarjetas de descripción en objetos y runa clave. El sub-menú de LoL suma **eSports**.

- **Orden de la pestaña Build**: Orden de habilidades → Matchups (resumen) → Build completa → Qué comprar después / Cómo jugarlo → Winrate por objeto.

### LolEsports → `/lol/esports` (`LolEsportsView.vue`)
- Barra propia (Calendario y resultados · Cuadro del Mundial · La final). Partido destacado con cuenta atrás (Gen.G vs BLG, sábado 14 de noviembre, 20:00 hora peninsular, Barclays Center), camino de cada equipo y enlaces a lolesports.com, Twitch y YouTube.
- Filtro por competición: Mundial, MSI, First Stand, LCK, LPL, LEC y LCS (la LTA dejó de existir en 2026; las Américas volvieron a LCS y CBLOL). Próximos partidos y resultados, con mensaje cuando una liga no tiene calendario.
- Cuadro final (cuartos, semis y final), historias de la final y jugadores a seguir. Los equipos se muestran con monograma y colores, sin logotipos.
- Datos en producción: la API de lolesports (`getSchedule` para calendario y resultados, `getEventDetails` para cada serie), desde una función de Vercel en `/api` con caché de pocos minutos; la clave que pide esa API va en una variable de entorno, nunca en el cliente. En el diseño, los resultados están tomados de Inven Global, GGRecon, note.com y Wikipedia.

### Zelda → `/zelda` (`ZeldaView.vue`), con sub-menús **Mapas** e **Información**
- Mapa nítido (`assets/zelda/mapas/*-hd.webp`, 6000×5000) con capas Superficie / Cielo, arrastrar para mover, doble clic o botones para zoom (1 · 1,6 · 2,4 · 3,4 · 4,6).
- Se muestran **todos** los puntos: santuarios, torres, cuevas y las 875 semillas (los kologs con amigo llevan su círculo de destino). Todos son clicables y se pueden marcar como hechos.
- Al pasar el ratón por un icono sale una tarjeta con nombre, tipo, zona y estado. Al tocarlo se abre la ficha con coordenadas y el botón de marcar.
- Filtro **Estado**: Todos · Pendientes · Completados, con contadores. Progreso de santuarios, torres y semillas.
- Proyección nueva (mapa completo): `x% = (x + 6000) / 120` · `y% = (5000 − y) / 100`, con `x, y` las coordenadas del juego que ya tiene `src/data/zelda.js`.
- Los pines usan `mask-image` con los SVG de `assets/zelda/iconos/` y se contra-escalan con el zoom (`.zl0`…`.zl4`).
- Componentes: `ZeldaMap.vue` (pan/zoom), `MapPin.vue`, `MapLegend.vue`, `ProgressCard.vue`. Progreso → Firestore (usuario con sesión) y `localStorage` como respaldo.

### ZeldaGuia → `/zelda/:guia` (`ZeldaGuideView.vue`)
- Una pestaña por guía: **Santuarios** (152), **Raíces de luz** (120), **Semillas kolog** (por zona), **Misiones** (178), **Armaduras** y **Conjuntos** (57). La pestaña inicial se puede elegir con `#santuarios`, `#raices`…
- **Raíces de luz** es nueva: cada una está justo debajo de un santuario de la superficie (mismas x, y) y se llama como él escrito al revés (Tajikats → Stakijat). Se calculan desde `src/data/zelda.js`, sin datos nuevos. El mapa de las Profundidades es un esquema: el de la superficie invertido con un filtro CSS.
- Lista + ficha lateral con miniatura del mapa y el punto, coordenadas, «Marcar como hecho» y «Ver en el mapa». Progreso de santuarios, raíces y semillas en la cabecera (en Vue: el mismo progreso que el mapa).
- En móvil la ficha queda debajo de la lista: en Vue, ábrela como hoja inferior.
- El hub enlaza aquí desde «Ver las guías», las tarjetas de Información y el submenú; la capa **Profundidades** del menú Mapas lleva a Raíces de luz.

### Arc → hub de ARC Raiders
- Sub-menús, hero, KPIs, rejilla de mapas, acciones de objetos (vender / reciclar / guardar / usar), comerciantes y "ARC peligrosos".
- Recuperado el bloque **«¿Cómo se calcula la recomendación?»** con las 4 reglas, el aviso de guía orientativa y el total de 581 objetos.
- Comerciantes con su retrato (`assets/arc/comerciantes/`).
- Sugerencia de rutas: `/arc-raiders` como hub y `/arc-raiders/objetos`, `/arc-raiders/misiones`, `/arc-raiders/enemigos`, `/arc-raiders/mapas/:mapa`. Deja redirecciones desde `/arc-misiones` y `/arc-enemigos` para no perder SEO.

### ArcObjetos, ArcEnemigos y ArcMisiones → `/arc-raiders/objetos`, `/enemigos` y `/misiones`
- **Objetos** (Claude): las cuatro acciones (guardar, reciclar, vender, usar) son a la vez resumen y filtro; buscador que también busca por material de reciclaje, rareza, categoría, orden y ficha con la recomendación y su motivo, lo que da al reciclarlo, quién lo pide, receta y efectos. Datos: `public/data/arc-raiders/items.json` (los 581).
- **Enemigos** y **Misiones** (Codex, revisadas por Claude): filtros de amenaza/tipo/mapa, punto débil, botín y armas; progreso por comerciante, objetivos paso a paso y recompensas.

### Diseños de Codex sustituidos (2026-11-25)

Jorge eligió las versiones de Claude: Enemigos, Misiones, Builds, eSports y la tier list por niveles (con la tabla como segunda vista) sustituyen a las de Codex con el mismo nombre de archivo. En la ficha del campeón, los matchups van antes de las builds y solo se muestran las 3 builds más usadas.

En el lienzo, las imágenes de ARC que el lienzo no sirve (`/images/arc-raiders/...`) se sustituyen al publicar por recursos subidos: los ARC y los comerciantes uno a uno y los 556 objetos en un solo sprite. En el repo las páginas mantienen las rutas `/images/...`.
- Imágenes de objetos y ARC con rutas `/images/arc-raiders/...` (en el lienzo habría que subirlas como recursos).

### ArcMapa → `/arc-raiders/mapas/:mapa`
- Pestañas de mapa, plantas (Stella Montis), visor con arrastre y zoom (1 · 1.5 · 2.2 · 3), panel lateral con Misiones (filtro por comerciante) y Enemigos.
- **Mini guías de misiones**: sin nada seleccionado, el mapa enseña el retrato del comerciante donde se hace cada misión; al pasar el ratón sale una tarjeta con los objetivos. Al elegir una misión (en el mapa o en la lista) el mapa se centra y numera sus puntos; cada número tiene su tarjeta desplegable (al pasar o al tocar).
- **Zonas de enemigos**: al tocar un ARC en la pestaña Enemigos se pinta un mapa de calor con sus puntos de aparición en ese mapa.
- Datos: `public/data/arc-raiders` + `models/data/arc-zonas-enemigos.json` y `arc-misiones-puntos.json` (coordenadas ya pasadas a % de cada imagen).
- Sin zonas todavía: Riven Tides (su imagen no tiene referencias para calibrar) y la planta inferior de Stella Montis. Leaper, Spotter y Surveyor no tienen posiciones en la fuente.

### Premium → ruta nueva `/premium` (`PremiumView.vue`)
- Selector Mensual / Anual que cambia el precio: 4,99€/mes o 39,99€/año (3,33€/mes, ahorras 19,89€). El anual es una propuesta: cámbialo si quieres otro precio.
- Tarjetas Gratis y Premium (borde animado, prueba de 7 días), ventajas, comparativa por juego y preguntas frecuentes (acordeón).
- El botón de Premium llama a `createCheckoutSession(plan)` de `services/premium.js` con `plan: "monthly"` o `"yearly"`. Hace falta un segundo precio en Stripe (anual) y que `api/create-checkout-session` acepte `yearly`.
- Los enlaces "Hazte Premium" del nav de todas las páginas apuntan ya aquí (antes iban a `/lol#premium`).
- Componentes: `BillingToggle.vue`, `PlanCard.vue`, `PlanCompare.vue`, `FaqAccordion.vue`.

### MiPremium → ruta nueva `/cuenta/premium` (`AccountPremiumView.vue`, con `meta.requiresAuth`)
- Tarjeta de suscripción con 3 estados (activa, prueba, cancelada): en el lienzo se cambian desde Tweaks → `estado`.
- Acciones: cambiar mensual ↔ anual, abrir el portal de pago de Stripe y cancelar con confirmación.
- Avisos por juego (interruptores LoL / ARC / Zelda) y canal (email / navegador). Se guardarían en `users/{uid}` (p. ej. `alerts: { lol, arc, zelda }`, `alertChannels`).
- Pago y facturas: todo vía Stripe Customer Portal (una función en `/api` que cree la sesión del portal).
- Las fechas, la tarjeta `···· 4242` (la de pruebas de Stripe) y `TuUsuario` son datos de ejemplo.

### PremiumExito → `/exito` (`CheckoutSuccessView.vue`)
- Emblema GM con confeti y check, resumen (plan, primer cobro, cuenta, referencia de pago con `session_id`) y "¿Y ahora qué?".
- Tweaks `tipo` (prueba / pago) y `plan` (anual / mensual) para ver los dos textos.

### Login → `/login` (`LoginView.vue`)
- Pestañas Iniciar sesión / Crear cuenta y modo Recuperar contraseña (mismos textos y errores que el `LoginView.vue` actual).
- Tarjeta de **tamaño fijo** (860 px de alto en escritorio): cambiar de pestaña ya no la hace saltar. Iconos flotantes alrededor (armas, escudo, mapa y los logos de los 3 juegos).
- Acceso con **Google, Discord, Riot Games, Epic Games y Steam**, cada uno con su icono (`assets/social/`), además de email y contraseña con mostrar/ocultar y medidor de seguridad.
- Tweaks `modo` y `estado` (normal, error, cargando, conectado) para ver cada pantalla.
- Google: `GoogleAuthProvider` + `signInWithPopup` de Firebase (sigue sus pautas de botón).
- Discord, Riot, Epic y Steam no vienen en Firebase. Patrón común: una función en `/api` hace el login con el proveedor (OAuth2 en Discord y Epic; Riot Sign On necesita que Riot apruebe la app; Steam usa OpenID 2.0), crea un *custom token* con Firebase Admin y el cliente entra con `signInWithCustomToken`.
- Los logos de las marcas solo deben usarse en sus botones de acceso, siguiendo la guía de cada una.

### Contacto → `/contacto` (`ContactView.vue`)
- Motivos como tarjetas (Falta algo · Añadir un juego · Hay un error · Necesito ayuda · Otra cosa), nombre y email, juego relacionado (chips), mensaje con contador y «enviarme una copia».
- Estados: normal, enviando, error y enviado (Tweaks `estado`). Atajos laterales para pedir un juego o avisar de un error.
- Hoy el formulario abre el cliente de correo (`mailto:`). Para enviarlo de verdad: una función `/api/contact` (Vercel) que mande el email con un servicio tipo Resend, SendGrid o Nodemailer + SMTP, con límite de envíos y un captcha (p. ej. Cloudflare Turnstile).

### Menú «Juegos» y buscador (todas las páginas)
- En la barra superior, junto al logo, hay un botón **Juegos** con un menú desplegable de los 9 juegos (estado: disponible, en construcción, nuevo o próximamente). Componente global `GamesMenu.vue`.
- En la portada, el buscador muestra sugerencias mientras escribes (juegos y secciones como Pokédex o Mapa de Kanto). Los juegos sin guía aparecen como «Próximamente».
- El menú cuenta «9 juegos · 5 disponibles»: LoL, ARC, Pokémon, Assassin's Creed (enlazado a la saga) y Call of Duty (enlazado a la portada de Zombies). Zelda sigue «en construcción». En la portada, el panel de Call of Duty ya enlaza con imagen de zombis (`cod-bo1.webp`) y en el buscador aparece «Call of Duty Zombis».

### Pokémon → `/pokemon`
- **Portada** (`/pokemon`): la ilustración principal cambia de Pokémon cada 3,5 s con una animación de glitch (6 Pokémon, con su etiqueta; sin animación si el sistema pide movimiento reducido); el meta competitivo es lo principal (top 20 con set al tocar), novedades, regiones de la Gen I a la X en orden y accesos a las herramientas.
- **Pokédex** (`/pokemon/pokedex`): la ficha lateral es corta (ilustración, stats, «débil a» y habilidad recomendada) y el botón **Ver ficha completa** abre una ventana con pestañas Ficha (stats, debilidades y resistencias, habilidades con descripción y la recomendada, naturaleza), Dónde capturarlo, Movimientos (4 recomendados + los de la Gen I) y **Megaevoluciones** (ilustración oficial de cada mega, tipos, habilidad y stats con lo que sube o baja; las de Leyendas Z-A y Champions solo en la Gen IX). Antes: rejilla con filtro por tipos (máx. 2), orden y búsqueda; el **selector de generación** cambia los tipos, las estadísticas (Especial en la Gen I), si hay habilidades y la tabla de debilidades. En la Gen I usa los sprites originales. Ficha lateral con estadísticas, debilidades, habilidades, naturaleza recomendada, evoluciones, dónde capturarlo (Rojo/Azul/Amarillo) y movimientos.
- **Tabla de tipos** (`/pokemon/tipos`): matriz de 15, 17 o 18 tipos según la generación, celdas que cambiaron marcadas, calculadora de defensa (tipos o Pokémon) y de ataque, y las mejores combinaciones defensivas calculadas.
- **Habilidades, movimientos y naturalezas** (`/pokemon/habilidades`): tres pestañas. **Habilidades**: sin Pokémon ni nota de buena/mala; cada una con su descripción, chips de efecto (más daño, sube o baja stats, inmunidad, curación, clima, campo, estados…) y agrupadas por el tipo con el que tienen que ver (las que no dependen de un tipo, en «General»); filtros por tipo y por efecto. **Movimientos**: los 919 con tipo, categoría física/especial/estado, potencia, precisión, PP, chips y descripción; filtros por tipo, categoría y efecto, y orden por nombre, potencia o precisión. **Naturalezas**: tabla 5×5 y recomendador.
- **Competitivo**: en el menú de Pokémon es un desplegable con tres páginas y comparten una barra propia (Champions · Showdown · Crea tu equipo).
  - **Pokémon Champions** (`/pokemon/competitivo`): reglamento M-C y temporada clasificatoria M-8 con cuenta atrás; top 20 en **dobles (VGC) o individuales** con filtros por modalidad y, al tocar, el set completo (objetos, habilidades, 6 movimientos con %, naturaleza y puntos de stats, compañeros, por qué funciona y cómo pararlo); 8 equipos de torneo con récord; parejas más repetidas; arquetipos, megas nuevas y Mundial 2026.
  - **Pokémon Showdown** (`/pokemon/competitivo/showdown`): qué es y en qué se diferencia de Champions (tabla comparativa y respuesta corta: en dobles es lo mismo; en individuales no); 4 formatos (Champions OU, Escarlata/Púrpura OU, VGC M-C, BSS M-C) con 24 tarjetas y panel lateral con el set; núcleos; cómo empezar y glosario de tiers.
  - **Crea tu equipo** (`/pokemon/competitivo/equipo`): eliges formato y hasta 6 Pokémon de los 40 más usados. Sugiere los que mejor encajan (compañeros habituales según Smogon, tipos que cubren tus debilidades y funciones que faltan), «Generar el mejor equipo / Completar» (voraz: añade uno a uno el de mejor puntuación, sin repetir especie y penalizando un tercer mega), cambios que mejorarían un equipo completo, funciones (Sorpresa, Intimidación, control de velocidad… en dobles; trampas, pivotes, prioridad… en individuales), tabla de debilidades y equipos de torneo parecidos.
  - Datos: el uso es de Smogon (escalera de Showdown, octubre de 2026, ≥1760; SV OU ≥1825). Para el formato oficial es la mejor muestra pública, pero no son cifras del juego: está indicado en la página. Para actualizar, cada mes: `smogon.com/stats/<año-mes>/chaos/<formato>-<corte>.json`.
- **Kanto** (`/pokemon/kanto`, `/pokemon/kanto/mapa`, `/pokemon/kanto/100`): barra de región propia con las tres secciones. Historia en 16 pasos marcables con gimnasios y la **Liga Pokémon** paso a paso (Alto Mando y Campeón con sus equipos según versión e inicial); mapa ilustrado propio (SVG v2: bosques, montañas, ciudades con Centro y Tienda, rutas con textura) con zoom y arrastre, ficha de cada zona y búsqueda «¿dónde está…?» que **resalta las rutas en el mapa**, pone el % en cada zona y recomienda el mejor sitio y el primero de la aventura (si no es salvaje, explica regalo, encuentro fijo, evolución o intercambio); guía al 100 % con progreso por categorías.
- El progreso (pasos, capturados, MT, zonas visitadas) está en estado local: en Vue, guardarlo por usuario.

### Assassin's Creed → `/assassins-creed` (`AcSagaView.vue`) y `/assassins-creed/unity` (`AcUnityView.vue`)
- **Saga** (`AssassinsCreed.dc.html`): hero con el arte oficial de todos los asesinos (`ac-saga.webp`). Rejilla de 16 tarjetas **con la imagen de cada juego** (hoja `assets/assassins-creed/juegos.webp`, 4×4 celdas; `background-position` en %; Hexe sin imagen lleva un marcador) y dos órdenes (**por lanzamiento** o **por época de la historia**) con filtro por era. La guía destacada usa la miniatura del plano de 1790 con la ruta de la historia encima. Datos en `data/assassins-creed/saga.json`.
- **Unity** (`ACUnity.dc.html`):
  - **Mapa de París (v2)**: fondo = el plano real de 1790 de Mondhare et Jean recoloreado en pizarra oscura con trazos crema y el Sena oscuro (`paris-1790.webp`). Encima, los 22 barrios del juego como zonas con nombre (las etiquetas no crecen con el zoom), 33 lugares históricos y los puntos de memoria. **Zoom con la rueda del ratón** hacia el cursor, arrastre y botones +/−; Versalles va en un recuadro aparte.
  - **Filtro por secuencia**: barra de chips (Prólogo, 1…12). Al elegir una, el mapa ilumina solo sus memorias, numera el recorrido y apaga el resto; un panel resume la secuencia (año, memorias, desbloqueos).
  - **Capas**: lugares históricos, memorias, misiones secundarias (agrupadas en burbujas por barrio con el color de su tipo) y ruta de la historia.
  - **Ficha de barrio** (cajón lateral): cofres, cofres cerrados, escarapelas y artefactos del barrio, nota y las misiones secundarias agrupadas por tipo (Historias de París, Misterios de asesinato, Enigmas de Nostradamus, Cooperativo, Atracos, Club social, Fallos del Helix, Café Théâtre).
  - **«La revolución de Arno» en diapositivas**: línea temporal de 13 nodos (prólogo + 12 secuencias) arriba y, debajo, una diapositiva por memoria con los colores de AC (crema, rojo y franja tricolor). Cada diapositiva muestra lugar y objetivo; **los bloques se abren al pulsar**: objetivos opcionales, paso a paso, oportunidades, asesinato único y «qué pasa» (spoiler). Lista lateral, anterior/siguiente (salta de secuencia), «Ver en el mapa», casilla de hecha y progreso.
  - **No están marcados** los puntos de sincronización (saltos de fe) ni los cofres uno a uno: no hay una fuente pública fiable con sus posiciones (las guías los dan en capturas). Los recuentos por barrio sí están.
  - Actividades (11 tipos), consejos, personajes sin spoilers y ficha del juego, como antes.
  - Componentes sugeridos: `ParisMap.vue` (imagen + capa SVG/HTML en px del lienzo 2928×2016; para el zoom, `transform: translate() scale()` y contraescalar los pines con `1/zoom`), `StorySlides.vue`, `DistrictDrawer.vue`. Progreso en `localStorage` o por usuario.
- Estilo: crema `#EFE9DD`, rojo `#E2364B`/`#C8102E` y la franja tricolor francesa (`#2F5FA7` · `#EFE9DD` · `#C8102E`); títulos en Cormorant Garamond y etiquetas del mapa en Cormorant SC.

### Call of Duty Zombies → `/call-of-duty/zombies` (`CodZombiesView.vue`) y `/call-of-duty/zombies/:juego` (`CodGameView.vue`)
- **Portada** (`CodZombies.dc.html`): hero con Ascension de fondo (`cod-hero.webp`, sirve para todos los Zombies, no solo Black Ops). Cuatro tarjetas (Black Ops, II, III y 4) con sus mapas como enlaces directos (`CodBO2.dc.html#mob` abre la ficha de Mob of the Dead). **Buscador de mapas** por nombre, juego o lugar («Alcatraz», «Luna», «Titanic») con filtro por juego. **La saga del Aether** en 6 capítulos con el giro tapado (botón por capítulo o «Mostrar todos los spoilers»). **Personajes clave** (Samantha, Maxis, Richtofen, Monty, el Hombre Sombra, los Guardianes) con spoiler aparte. **Tripulaciones** (Ultimis, invitados de BO1, Victis, banda de Alcatraz, Primis, Morg City y Caos) y glosario (Grupo 935, Aether, Agartha, Llave de la Invocación, Pack-a-Punch…).
- **Página de juego** (`CodBO1…4.dc.html`, ruta `:juego` = `bo1`…`bo4`): hero con imagen y cifras, selector de mapas (6 u 8 tarjetas) y la **ficha del mapa**: imagen (o marcador con las siglas si no hay captura), dónde, época, personajes y enemigos; **Pack-a-Punch** (cómo llegar), **ventajas** con su color y dónde están, **armas de pared** (arma · dónde · precio), **armas especiales**, **Easter egg principal paso a paso** (cada paso tapado: «Ver el paso N», «Mostrar todos», «Ocultar», barra de progreso; recompensa y final con spoiler aparte), **canción secreta** (pasos ocultos) y «A tener en cuenta». Mapa anterior/siguiente, y abajo la historia y las tripulaciones de ese juego.
- Lo que está y lo que falta (marcado en la página, no inventado):
  - Pasos completos de Easter egg: Die Rise y Buried; el resto tiene objetivo, recompensa y final, con «paso a paso en preparación».
  - Armas de pared con ubicación: Kino, «Five», Moon y Nuketown completas; Call of the Dead y Shangri-La solo las de la zona de inicio; el resto, «pendiente».
  - Canciones con ubicaciones: Kino, «Five», Ascension, Call of the Dead, Moon y Nuketown; otras 10 solo con el nombre.
  - Sin mapas dibujados todavía (el usuario lo dejó como opcional). Capturas oficiales solo en 8 mapas; BO4 no está en Steam y va sin imágenes.
- Estilo: negro `#0A0A0B`, naranja `#FF7A1A` (claro `#FFB066`) y cian del Elemento 115 `#4FD8FF` para lo de la historia y los Easter eggs; franja de peligro naranja/negra; títulos en Saira Stencil One y Saira Condensed, texto en IBM Plex Sans. Cada mapa tiene su color de acento (`color` en el JSON).

### Zoom con la rueda del ratón (todos los mapas)
- Unity, Kanto, Zelda y ARC hacen zoom con la rueda hacia la posición del cursor (antes solo con botones).
- En el lienzo no se puede llamar a `preventDefault` en `wheel`, así que se usa un truco: el visor es un contenedor con scroll oculto (`overflow-y:scroll`, `overscroll-behavior:contain`) con el mapa en `position:sticky` y un relleno alto; el scroll se lee, se devuelve al centro y se convierte en zoom.
- **En Vue no hace falta el truco**: `@wheel.prevent="onWheel"` en el visor y
  `zoom = clamp(zoom * Math.exp(-e.deltaY * 0.0025), min, max)`, ajustando `tx/ty` para que el punto bajo el cursor no se mueva (`tx = mx - (mx - tx) * k`). Añade `{ passive: false }` si lo registras con `addEventListener`.

### Transiciones entre páginas y pestañas (todas las páginas)
- En el lienzo cada página lleva `@view-transition{navigation:auto}` (fundido suave al cambiar de página en Chrome/Edge) y `html{background:#07090D}` para que no haya destello blanco. Los paneles de pestañas llevan `data-pane` y entran con un fundido + subida de 8 px (`gmFade`, 0,32 s). Todo se desactiva con `prefers-reduced-motion`.
- En Vue (SPA) el parpadeo viene de cambiar de vista sin transición. En `App.vue`:

```vue
<RouterView v-slot="{ Component, route }">
  <Transition name="page" mode="out-in">
    <component :is="Component" :key="route.path" />
  </Transition>
</RouterView>
```

```css
.page-enter-active { transition: opacity .32s cubic-bezier(.2,.8,.2,1), transform .32s cubic-bezier(.2,.8,.2,1); }
.page-leave-active { transition: opacity .18s ease-in; }
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .page-enter-active, .page-leave-active { transition: none; } }
```

- Para las pestañas dentro de una vista, el mismo patrón con `<Transition name="tab" mode="out-in">` envolviendo el panel activo (con `:key` = pestaña). Fija una altura mínima en el contenedor de pestañas para que la página no salte al cambiar.
- Con `scrollBehavior` en el router (`return savedPosition || { top: 0 }`) evitas que la página nueva aparezca a media altura.

### Logos
- `Logo.dc.html` es el principal (GM tricolor: G dorado = LoL, cara izquierda naranja = ARC, cara derecha turquesa = Zelda).
- Para usar ya: `assets/brand/gm-logo.svg`. Para el favicon: `gm-favicon.svg` en `public/` y `<link rel="icon" type="image/svg+xml" href="/gm-favicon.svg">` en `index.html`.
- `gm-logo-mono.svg` hereda el color del texto (`currentColor`), útil en nav y footer.

---

## Estilo por juego

| Zona | Acento | Tipografía de títulos | Texto |
|---|---|---|---|
| Portada | Tricolor GM: `#F3C878` · `#FF6A3D` · `#4FE0B6` | Bricolage Grotesque | IBM Plex Sans |
| LoL | Dorado hextech `#F3C878` / `#D9B56E` | Bricolage Grotesque | IBM Plex Sans |
| Zelda | Turquesa `#4FE0B6` + crema `#F1E7C8` | Cinzel | IBM Plex Sans |
| ARC Raiders | Franja `#E5372B` `#F28A1E` `#F5C02A` `#2FB45A` `#3BC9E8` | Barlow Condensed | IBM Plex Sans |
| Pokémon | Colores de los 18 tipos (franja) + amarillo `#FFCB3D`; cada región con sus dos colores | Fredoka (y Press Start 2P en Kanto) | IBM Plex Sans |
| Assassin's Creed | Rojo `#E2364B` + crema `#EFE9DD`; franja tricolor `#2F5FA7` `#EFE9DD` `#C8102E` | Cormorant Garamond (y Cormorant SC en el mapa) | IBM Plex Sans |
| Call of Duty Zombies | Naranja `#FF7A1A` + cian 115 `#4FD8FF` sobre negro `#0A0A0B`; franja de peligro | Saira Stencil One / Saira Condensed | IBM Plex Sans |
| Logo / cifras | — | Chakra Petch | — |

Verde original del logo: `#6BFF4A`.

---

## Notas sobre los datos

- **Tiers de LoL**: con los datos reales, la fórmula actual daba casi todo C (1 S, 2 A, 87 C). El diseño usa **percentiles dentro de cada línea** sobre esta puntuación: `(wr-46.5)/8.5·0.55 + (pr/18)·0.25 + (br/22.5)·0.2`.
- **Data Dragon** está fijado en `16.21.1`. En Vue conviene leer la versión de `https://ddragon.leagueoflegends.com/api/versions.json`.
- **Región**: solo hay datos de EUW; el desplegable muestra EUW con la nota "De momento analizamos partidas de EUW".
- **Matchups** de la ficha de campeón: marcados como "Pronto" (no hay datos todavía).
- **Zelda – cuevas**: lista parcial (72 de 147). Faltan coordenadas del resto.
- **Zelda – Subsuelo**: marcado como "Próximamente".
- **ARC – zonas y puntos de misión**: vienen de la API pública de MetaForge (`/api/game-map-data`). Se han calibrado sobre las imágenes del proyecto con ascensores, trampillas y respiraderos que salen en las dos fuentes (error de 2-6 px sobre 3000). **Ojo**: MetaForge pide atribución y que les contactes antes de usar sus datos en un producto con ingresos (GrietaMeta tiene anuncios y Premium).
- **ARC – retratos de comerciantes**: recortados de los retratos del juego que publica la wiki de ARC Raiders en Fandom (© Embark Studios).
- **Zelda – mapa HD**: montado con las teselas del mapa de objmap-totk (zeldamods), que salen de los archivos del juego (© Nintendo). Para producción, mejor servir tus propias teselas.
- Fuente de ARC: RaidTheory/arcraiders-data (MIT). Emblemas de rango y posiciones: Community Dragon (material de Riot, bajo su política de contenido de fans).

- **Pokémon**: datos de PokeAPI (CSV del repositorio, licencia BSD) y de la desensambladura `pret/pokered` (objetos y MT de Rojo/Azul). Sprites e ilustraciones de PokeAPI/sprites (© Nintendo, Game Freak y The Pokémon Company). El mapa de Kanto es un dibujo propio, no el del juego.
- **Pokémon – meta**: uso del Reglamento M-C en octubre de 2026 (Poketools, 1,65 M de combates). Hay que actualizarlo con cada reglamento; el M-C acaba el 2 de diciembre de 2026.
- **Pokémon – huecos con etiqueta**: arte de Viento y Oleaje y equipo del campeón del Mundial 2026.
- **Assassin's Creed**: fechas de lanzamiento de Ubisoft; nombres de memorias y lugares de la historia contrastados con las guías de gamepressure y dtgre; los títulos están traducidos por nosotros (en el juego pueden variar). El mapa de París (v2) usa de fondo el «Plan de la ville et faubourg de Paris divisé en ses 48 sections» (Mondhare et Jean, 1790), digitalizado por la Universidad de Princeton (sin restricciones de copyright conocidas); recoloreado y retocado por nosotros. Lugares georreferenciados con una transformación afín desde lat/lon y ajustados a mano; los marcados «aproximado» (p. ej. Corte de los Milagros, Café Théâtre) no son exactos. Memorias según Gamer Guides; coleccionables y misiones secundarias por barrio según gamepressure. Los enigmas de Nostradamus (18) y su recompensa, según el wiki de Assassin's Creed y gamepressure. Parche de 60 FPS: actualización 1.06 del 5 de marzo de 2026 (PS5 y Xbox Series X|S). Black Flag Resynced: 9 de julio de 2026. Hexe: sin fecha oficial (las filtraciones hablan de 2027). Las imágenes `ac-saga.webp` y `hero-ac.webp` son arte oficial de Ubisoft.
- **Call of Duty Zombies**: textos propios a partir de Call of Duty Wiki (Fandom) y de las guías de SegmentNext, Shacknews y Gfinity (cómo llegar a la Pack-a-Punch en Buried, Zetsubou No Shima, Der Eisendrache, Revelations, Blood of the Dead y Alpha Omega). Capturas oficiales de las páginas de Steam (© Activision). Antes de producción conviene revisar cada Easter egg en una partida.
- **Juegos nuevos**: imágenes de las tiendas de Steam (© de cada editora). Sustituir por arte propio o con permiso antes de producción.

## Mapas más nítidos (para la web real)

- **Zelda**: en vez de una imagen, usar Leaflet (`L.CRS.Simple`) con una pirámide de teselas de 256 px hasta el zoom 7 (24000×20000 px), como hace objmap. Se ve nítido a cualquier zoom y solo descarga lo visible.
- **ARC**: las imágenes del proyecto están reducidas a 3000 px. El repositorio de RaidTheory tiene los mapas originales más grandes y, en algunos mapas, teselas (`images/maps/<mapa>/v2/high/<z>`). Con Leaflet + esas teselas (o generándolas con `gdal2tiles`/`vips dzsave` desde el PNG original) el zoom deja de verse borroso. La calibración de `data/arc-calibracion-mapas.json` sigue valiendo si se respeta el mismo encuadre.

## Orden sugerido para construir

1. Logo + favicon + tokens de color y fuentes en `base.css`.
2. Portada (`HomeView`).
3. LoL: tier list → desplegables → ficha de campeón con ruta dinámica.
4. Zelda: componente de mapa reutilizable → información.
5. ARC: hub → reorganizar rutas → mapas (el visor puede reutilizar la base del mapa de Zelda).
6. Login (Google primero, el resto después) → Premium → Mi Premium → pantalla de éxito → Contacto con envío real.
7. Barra inferior de móvil como componente global (`MobileTabBar.vue`) en `App.vue`.
8. Menú «Juegos» global y buscador con sugerencias.
9. Pokémon: datos en `public/data/pokemon` → Pokédex y tabla de tipos (comparten la lógica de tipos por generación) → portada → habilidades → competitivo → Kanto (historia, mapa reutilizando el visor de Zelda, 100 %).
10. Assassin's Creed: saga (`AcSagaView`) → mapa de París reutilizando el visor de Kanto/Zelda → historia con progreso.
