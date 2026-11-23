# LoL: tareas pendientes para los agentes ligeros

Para trabajar **en paralelo** con modelos más ligeros: Claude Sonnet 5.5 o Haiku 5.5, y Codex en
un nivel de razonamiento medio. Cada tarea toca **sus propios archivos**, para que dos agentes no
editen el mismo archivo a la vez. El diseño aprobado está en el lienzo de diseño de GrietaMeta
(página League of Legends) y en `models/paginas/Lol*.dc.html`. El plan completo está en
`docs/plan-lol-final.md`.

## Cómo se trabaja (léelo antes de empezar)

1. **Una tarea, una rama**: `feat/lol-<id>` (por ejemplo, `feat/lol-T3`), creada desde `feat/lol-final`.
2. **Solo los archivos de tu tarea.** Si necesitas tocar otro, para y apúntalo en la tarea.
3. **Imágenes:** el lienzo bloquea las imágenes externas. En los diseños (`models/`), solo se usa
   `../assets/...`. En la web (`src/`), Data Dragon sí se puede usar.
4. **Textos en español de España**, con tildes. Los datos inventados llevan la etiqueta «Datos de ejemplo».
5. **Animaciones con anime.js** (import dinámico, como en `prepareMotion`), respetando
   `prefers-reduced-motion`.
6. **Pruebas:** escritorio, tableta y móvil (1440, 768 y 375 px), sin scroll horizontal.
7. **Al terminar:** pasa la tarea a `revisión` en Obsidian (`tareas/`) y escribe una línea en la sesión del día.
   La revisión cruzada la hace el otro agente (si la tarea es de Claude, la revisa Codex, y al revés).
8. **Pagos:** `src/services/premium.js`, `api/` y Stripe no se tocan.

## A. Diseño (lienzo) · rápidas, en paralelo

| Id | Tarea | Archivos | Criterio de aceptación | Modelo |
|---|---|---|---|---|
| D1 | **Logos de equipos**: sustituir las insignias CSS con siglas por los logos reales | `models/assets/lol/equipos/*.png` (nuevos), `LolEsports.dc.html`, `LolNoticias.dc.html` | Cada equipo con su logo en local; si falta alguno, se queda la insignia. Antes de usar los logos, revisar sus derechos (ver C7 en `docs/plan-nuevos-juegos.md`) | Haiku |
| D2 | **Retratos de campeones que faltan**: revisar `campeones.webp` (173 iconos) y añadir los campeones nuevos | `models/assets/lol/campeones.webp`, `models/data/lol/iconos-indices.json` | Todos los campeones del parche 16.23 tienen retrato | Sonnet |
| D3 | El **mega-menú de la ficha** carga los retratos de Data Dragon, que el lienzo bloquea: pasar al sprite | `LolCampeon.dc.html` (solo el mega-menú) | Ninguna `<img>` externa en la ficha | Haiku |
| D4 | **Carga de imágenes**: esqueletos de carga y `loading="lazy"` en todas las imágenes de LoL | `Lol.dc.html`, `LolBuilds.dc.html`, `LolNoticias.dc.html` (un agente por archivo) | Sin saltos al cargar las imágenes | Haiku |
| D5 | Transición de página de **cada juego** (Zelda, ARC, Pokémon…), cada una con su estilo (como el barrido dorado de LoL) | Un archivo `.dc.html` por juego | Cada juego con su transición propia, sin la de LoL | Sonnet |
| D6 | **Vistas móviles** de las páginas nuevas en el lienzo (`*-movil.dc.html`) | Nuevos `LolBuilds-movil`, `LolEsports-movil`, `LolNoticias-movil` | A 390 px, todo legible y sin cortes | Sonnet |

## B. Datos (script de Riot) · Sonnet, en orden

Todo sale de partidas que **ya se descargan**: ver «Qué sale de las partidas» en `docs/plan-lol-final.md`.

| Id | Tarea | Archivos | Criterio | Depende de |
|---|---|---|---|---|
| B1 | Guardar la **línea** de cada jugador y los **matchups** (rival de la misma línea) | `tools/fetch-riot-stats.mjs` | `champion-stats.json` incluye `roles` y `matchups` por campeón | — |
| B2 | **Hechizos, orden de habilidades y runas completas** | `tools/fetch-riot-stats.mjs` | Builds con hechizos, orden de habilidades y las 9 runas | B1 |
| B3 | **Winrate por objeto** y por posición de compra, y **builds por variante** con un mínimo de 1.000 partidas | `tools/fetch-riot-stats.mjs` | Lo que necesitan las pestañas de builds de la ficha y «Builds por campeón»: por variante, runas completas, botas, núcleo, situacionales y winrate y % de uso de cada pareja de hechizos (Destello + Extenuación / Prender / Teleportar) | B1 |
| B4 | **Estadísticas medias**, diferencias al minuto 15 y WR por duración | `tools/fetch-riot-stats.mjs` | La pestaña Estadísticas con datos reales | B1 |
| B5 | **Región KR** (host `kr.api.riotgames.com` y `asia.api.riotgames.com`) | `tools/fetch-riot-stats.mjs`, `.github/workflows/update-riot-stats.yml` | Un archivo por región; la tier list cambia con EUW/KR | B1 |
| B6 | **Histórico diario** de WR, PR y BR (30 días) | `tools/fetch-riot-stats.mjs` | Gráficas de 30 días con datos reales | B1 |

Vigilar que `data/raw-stats.json.gz` no crezca sin control: los matchups solo se guardan con un mínimo de partidas.

## C. Web (Vue) · una vista por agente, cuando estén los datos

| Id | Vista | Archivos | Depende de |
|---|---|---|---|
| C1 | Ficha de campeón con las pestañas Build, Matchups, Por rango y Estadísticas | `src/views/lol/LolChampionView.vue`, `src/components/lol/champion/*` | B1–B4 |
| C2 | Builds por campeón (`/lol/builds`) | `src/views/lol/LolBuildsView.vue` (nueva) y el router | B3 |
| C3 | Tier list con región y columnas nuevas | `src/views/LolView.vue`, `src/components/lol/LolTierList.vue` | B5 |
| C4 | eSports (`/lol/esports`) | `src/views/lol/LolEsportsView.vue` (nueva) | E1 |
| C5 | Noticias (`/lol/noticias`) | `src/views/lol/LolNewsView.vue` (nueva) | E2, E3 |
| C6 | Transiciones de página (la de LoL y la de cada juego) y entre pestañas | `src/App.vue`, `<Transition>` por juego | D5 |

## E. Fuentes externas · investigar antes de programar

| Id | Tarea | Notas |
|---|---|---|
| E1 | Datos de esports: calendario, resultados, clasificaciones y plantillas | Mirar la API no oficial de lolesports, Leaguepedia (Cargo, CC BY-SA) y la API de Riot. Hacer un caché diario en `public/data/esports.json` |
| E2 | **Sheep Esports**: fichajes, rumores y formatos | Su web no deja leerse de forma automática (devuelve 403). Hay que preguntarles si tienen RSS o un acuerdo de contenido. Mostrar solo el titular y un resumen propio, con enlace a la fuente |
| E3 | **Riot · Desarrollo** (`leagueoflegends.com/es-es/news/dev/`) | Se puede leer. Hay artículos y vídeos con la etiqueta «Desarrollo», del más nuevo al más antiguo. Solo título, fecha, resumen y enlace |
| E4 | Derechos de los logos de equipos y ligas | Antes de D1 |

## Ideas para más adelante

- Clasificación de OTPs (los mejores jugadores de cada campeón): gasta muchas peticiones a Riot.
- Buscador de invocador.
- Página de runas, con el % de uso de cada runa.
