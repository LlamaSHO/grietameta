# Plan: terminar League of Legends (rama `feat/lol-final`)

Objetivo: cerrar la sección de LoL con **matchups**, una **ficha de campeón
mejorada** y un **índice de builds** con el winrate de cada objeto. La
referencia es [dpm.lol](https://dpm.lol), revisado el 23 de noviembre de 2026.

Mismo método que el resto del sitio: **primero el diseño** (`models/paginas/*.dc.html`),
después el código. El diseño se reparte entre Claude y Codex (GPT-6.2-Astra)
**cuando esté aprobada la lista de páginas** de abajo, y cada uno revisa lo
del otro. Las animaciones se hacen con anime.js y CSS (el proyecto es Vue, así
que nada de librerías solo para React).

## Fuentes de datos

| Fuente | Qué da | Notas |
|---|---|---|
| **API de Riot** ([developer.riotgames.com](https://developer.riotgames.com)) | Partidas, timeline y ligas | Ya la usamos: la clave está en el secreto `RIOT_API_KEY` de GitHub y el workflow `update-riot-stats.yml` la usa cada 6 h. Una clave «Personal» o «Production» se pide en el mismo portal. |
| **Data Dragon** (`ddragon.leagueoflegends.com`) | Imágenes y textos de campeones, objetos y runas, por versión del parche | Es el CDN estático de Riot. Ya se lee la última versión de `versions.json`: no hay nada pendiente. |
| **CommunityDragon** ([communitydragon.org](https://www.communitydragon.org)) | Imágenes que Data Dragon no tiene (emblemas, iconos de posición) | Comunitaria y no oficial. |
| China | — | Los servidores chinos son de Tencent y **no están en la API de Riot**. No hay fuente pública fiable. |

**Regiones:** con la misma clave se puede leer **KR**, que tiene su propio
límite de peticiones y no le quita nada a EUW. China no se puede. Se empieza
con **EUW + KR**.

## Qué sale de las partidas que ya descargamos (sin peticiones extra)

El script `tools/fetch-riot-stats.mjs` ya descarga cada partida entera. Hoy
solo cuenta partidas, victorias y baneos por campeón, pero cada partida trae
mucho más:

| Dato | De dónde sale | Para qué |
|---|---|---|
| **Línea de cada jugador** (`teamPosition`) | Partida | Stats por rol y % de juego en cada línea (Ahri: 95,7 % mid) |
| **Matchups**: rival directo de la misma línea | Partida | Winrate contra cada campeón: «bueno contra» y «malo contra» |
| **Sinergias**: aliado del mismo equipo (p. ej. ADC + support) | Partida | Mejores compañeros |
| **Hechizos de invocador** | Partida | Pareja de hechizos más usada y su winrate |
| **Stats medias**: KDA, daño, oro, CS/min, visión, KP, primera sangre | Partida | Bloque «Estadísticas» de la ficha |
| **Winrate según duración** de la partida | Partida | Gráfica «fuerte al principio / al final» |
| **Diferencias a los 15 min** (CS, oro y XP contra el rival) | Timeline (ya se pide) | Ventaja de línea en el matchup |
| **Orden de habilidades** (`SKILL_LEVEL_UP`) | Timeline | Orden más usado y su winrate |
| **Winrate por objeto y por posición** (1.º, 2.º, 3.º…) | Timeline | Índice de builds y tablas «Objeto 1…5» |
| **Runas completas** (las 9 elecciones) | Partida | Página de runas entera con el % de cada runa |

Solo crece el archivo de estado (`data/raw-stats.json.gz`). Hay que vigilar
que no pase de unos pocos MB, y por eso los matchups solo guardan rivales con
un mínimo de partidas.

## Ideas de dpm.lol y qué hacemos con cada una

| # | Idea | ¿Se hace? |
|---|---|---|
| D1 | Cabecera de la ficha: tier, puesto en su rol, WR, PR, BR y partidas | ✅ Mejorar la actual |
| D2 | % de juego por línea, con un selector de rol | ✅ |
| D3 | Variantes de build («AP haste», «AP burst») con sus partidas y WR | ✅ Agrupando por objeto principal |
| D4 | Hechizos de invocador y orden de habilidades con WR y % | ✅ |
| D5 | Botas, objetos iniciales y objetos 1–5 con WR, PR y partidas | ✅ |
| D6 | Runas completas, con el % de cada runa | ✅ |
| D7 | Matchups: bueno contra / malo contra, y la lista completa | ✅ Es el objetivo principal |
| D8 | Sinergias | ✅ |
| D9 | Evolución de WR, PR y BR en los últimos 30 días | ✅ Guardando un histórico diario |
| D10 | Winrate según la duración de la partida | ✅ |
| D11 | Stats medias (CS@15, oro@15, KDA, daño, visión…) | ✅ |
| D12 | Tier list con filtros de rol, rango, región y parche, y columna de cambio de WR | ✅ Mejorar la actual |
| D13 | Leaderboard de OTPs (mejores jugadores de cada campeón) | 🟨 Más adelante: muchas peticiones extra |
| D14 | Pro builds y esports | ❌ Fuera: hacen falta datos de pro |
| D15 | Data Studio, InHouse y app de escritorio | ❌ Fuera de alcance |
| D16 | Buscador de invocador | 🟨 Más adelante: cada búsqueda gasta peticiones |
| D17 | Importar la build al cliente con un clic | ❌ Necesita una app de escritorio |

## Páginas que hay que diseñar

| # | Página | Qué tiene | Diseño |
|---|---|---|---|
| LF1 | **Ficha de campeón (rehecha)** | Cabecera D1–D2 · pestañas Build / Matchups / Por rango / Estadísticas | 🟨 En el lienzo, pendiente de aprobar |
| LF1.1 | ↳ Pestaña Build | D3–D6 | 🟨 En el lienzo, pendiente de aprobar |
| LF1.2 | ↳ Pestaña Matchups | D7–D8, con la lista completa ordenable y el detalle de un matchup (WR, diferencia a los 15 min) | 🟨 En el lienzo, pendiente de aprobar |
| LF1.3 | ↳ Pestaña Estadísticas | D9–D11 con gráficas | 🟨 En el lienzo, pendiente de aprobar |
| LF2 | **Índice de builds** (`/lol/builds`) | Objetos con su WR, PR y campeones que mejor lo usan; al pulsar un objeto, su ficha con los campeones ordenados por WR | 🟨 En el lienzo, pendiente de aprobar |
| LF3 | **Tier list mejorada** | D12: columnas nuevas, región EUW/KR y cambio de WR | 🟨 En el lienzo, pendiente de aprobar |

## Estado (2026-11-23)

LF1 la ha diseñado Claude (pestaña Estadísticas y sinergias, sobre `LolCampeon.dc.html`). LF2 (`LolBuilds.dc.html`) y LF3 (tier list en `Lol.dc.html`) las ha hecho Codex con GPT-6.2-Astra. Las tres están subidas al lienzo de diseño de GrietaMeta, en la página League of Legends, a falta de que Jorge las revise.

## Orden

1. Aprobar esta lista de páginas.
2. Repartir el diseño entre Claude y Codex, y hacer la revisión cruzada.
3. Ampliar el script de datos (línea, matchups, hechizos, habilidades, objetos y KR).
4. El código de cada página, probado en escritorio, tablet y móvil.

## Revisión cruzada (2026-11-23)

Hecha con las páginas dibujadas en el lienzo, no solo con el código. Codex revisó LF1 y Claude revisó LF2 y LF3. La tabla completa con las decisiones se le pasó a Jorge en el chat. Lo principal:

- **El lienzo bloquea las imágenes externas** (Data Dragon). Hay que usar el sprite `campeones.webp`, ya subido, o subir los iconos como recursos del lienzo. Afecta a «Mejores por rol», a las sinergias y a los objetos de Builds.
- **LF1:** los filtros de rol y rango no cambian todos los bloques; faltan el detalle de cada matchup y la vista móvil de los matchups y de las pestañas. Los datos de ejemplo deben ir rotulados y con un parche coherente.
- **Cambios de alcance que ha pedido Jorge:** el índice de builds pasa a ser «Builds» dentro de cada campeón, con las builds de más winrate; eSports se rediseña inspirándose en lolesports.com y conserva el partido destacado.

## Ronda 3 (2026-11-23)

Se han resuelto los puntos parciales de la segunda revisión de Codex:

- Ficha del campeón (Claude): una sola muestra según la línea y el rango, en la que los tramos de duración suman las partidas de la cabecera; builds con un mínimo de 1.000 partidas y un aviso si no hay muestra; el detalle del duelo se cierra al quedar fuera del filtro; «pp» y color según el signo; paneles enfocables; «Primeros minutos» separado de la diferencia al minuto 15.
- Builds y eSports (Codex): la misma build y las mismas cifras de Yasuo que en la ficha, con un mínimo de 1.000 partidas; la etiqueta MUNDIAL recuperada; el calendario con escudos de 42 px y el marcador centrado.
- Pendiente: ver la ronda 3 dibujada en el lienzo (la conexión con Chrome falló) y la aprobación de Jorge.

## Cierre de LoL (2026-11-23)

- Builds: muestra de ejemplo escalada y repartida por rangos como la de Yasuo (subida al lienzo).
- eSports: «Cuartos de final» ya no se parte; transición al cambiar de partido destacado (los equipos entran por los lados, los escudos aparecen con un pequeño rebote y el calendario entra fila a fila).
- Las cuatro páginas: cada bloque aparece suavemente al llegar a él con el scroll (anime.js, una vez por bloque, respetando el movimiento reducido).
- Subido al lienzo (versión 37) y comprobado en Chrome. Pendiente: que Jorge lo apruebe.

## Versión final del diseño (2026-11-25)

Sin cambios de contenido: se da por cerrada tras las tres rondas de revisión. Solo recibe la pasada común de accesibilidad (foco visible, letra mínima de 11 px y contraste AA). Falta la aprobación de Jorge.
