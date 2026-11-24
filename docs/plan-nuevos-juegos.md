# Plan de los juegos nuevos

Seis juegos nuevos para GrietaMeta: **Pokémon, ARK, Assassin's Creed (empezando
por Unity), Call of Duty (historia y Zombies), Resident Evil y Rust**. Es solo
el plan: no se toca código hasta cerrar el diseño de cada juego, y se avanza
**de juego en juego**.

Todos comparten la misma idea que ARC Raiders y Zelda:

- **Portada del juego (hub)** con un resumen y accesos a todo.
- **Subsecciones por juego o por mapa** (como los mapas de ARC): cada entrega
  de la saga o cada mapa tiene su página.
- **Mapa interactivo** con zoom (el `PanZoomMap` de Zelda/ARC) y puntos que se
  pueden pulsar: coleccionables, misiones secundarias, recursos, spawns…
- **Guía para completar el juego al 100 %**, con progreso que se marca (en el
  navegador y en la cuenta, como en Zelda).
- **Bases de datos con filtros** (Pokémon, dinos, engramas, armas…) y
  **mini-guías** sacadas de foros, wikis y páginas, citando la fuente.

**Objetivo principal de cada tabla: el diseño de todas sus páginas** (fila
`·D`), igual que se hizo con `models/paginas/*.dc.html`. Sin diseño aprobado no
se empieza su código.

## Decisiones (12 de noviembre de 2026)

- **Primer juego: Pokémon.**
- **En todos los juegos se va del más antiguo al más reciente.** Cada entrega
  nueva reutiliza las plantillas de la anterior.
- **Call of Duty: primero Zombies.** La historia (campañas) se queda con un
  aviso de «Próximamente» hasta que le toque.
- **Assassin's Creed: primero Unity** (el que se está jugando ahora) y luego
  del más antiguo al más reciente. La portada de la saga lista todos los
  juegos desde el principio, aunque solo Unity tenga contenido.
- **Resident Evil: los remakes son juegos aparte**, con su propia página.
- **Diseño:** no hay modelos previos; los diseños se hacen desde cero en
  `models/paginas/`, como los del rediseño.

## Leyenda

| Tipo | Significado |
|---|---|
| 📐 **Diseño** | Hay que diseñar la página (modelo `.dc.html`, con versión móvil). |
| ✨ **Vista** | Código de la página o componente, una vez hay diseño. |
| ⚙️ **Datos** | Reunir, limpiar y convertir datos (JSON en `public/data/<juego>/`). |
| 🗺️ **Mapa** | Imagen del mapa, calibración de coordenadas y capas de puntos. |
| ⚖️ **Derechos** | Comprobar licencia de datos e imágenes antes de publicar. |
| ❓ **Decisión** | Algo que hay que decidir antes de seguir. |

Estado: ⬜ pendiente · 🟨 en curso · ✅ hecho.

---

## Tablero general (tipo Trello)

Cada columna es un juego y cada fila una meta. Se va de arriba abajo dentro
de un juego, y de un juego al siguiente.

| Meta | Pokémon | ARK | Assassin's Creed | Call of Duty | Resident Evil | Rust |
|---|---|---|---|---|---|---|
| **0. Alcance** | ✅ 1.ª gen (Rojo, Azul, Amarillo) y en adelante | ✅ Survival Evolved (The Island) y en adelante | ✅ Unity primero; luego del primero en adelante | ✅ Zombies primero, desde World at War; historia «Próximamente» | ✅ Del primero en adelante | ❓ Mapa procedural: cómo mostrarlo |
| **1. Diseño de todas las páginas** | PK·D | AK·D | AC·D | CD·D | RE·D | RS·D |
| **2. Portada del juego** | Novedades + meta competitivo | Mapas, dinos, guías | Juegos de la saga | Zombies + aviso «Historia: próximamente» | Entregas de la saga | Monumentos, raideo, builds |
| **3. Subsecciones** | Una por juego/región | Una por mapa | Una por juego | Una por mapa Zombies (campañas, más adelante) | Una por juego | Una por monumento |
| **4. Mapa interactivo** | Rutas, objetos, capturas | Spawns, recursos, cuevas | París: cofres, escarapelas… | Coleccionables y Easter eggs | Objetos, documentos, cajas fuertes | Monumentos y su botín |
| **5. Base de datos** | Pokédex, movs, habilidades, naturalezas | Dinos, engramas | Equipo y habilidades | Armas, ventajas, armas maravilla | Armas, enemigos, desbloqueables | Objetos, planos, costes de raideo |
| **6. Guía 100 %** | Historia, Pokédex, extras | Jefes y progreso | Secuencias y secundarias | Campaña y Easter eggs | Historia, rangos, extras | — (no tiene final) |
| **7. Mini-guías** | Competitivo, crianza, EVs/IVs | Casas, fuertes, agua, cría | Rutas de farmeo, sets | Estrategias por ronda | Puzles, speedrun | Bases, electricidad, granjas |
| **8. Pruebas** | Escritorio, tablet, móvil | ← | ← | ← | ← | ← |

---

## Común a todos (C)

Lo que conviene preparar una vez y reutilizar en los seis juegos.

| # | Apartado | Qué incluye | Tipo | Estado |
|---|---|---|---|---|
| C1 | Alta de cada juego | `games.json` (slug, alias, logo, `status: building`), `GAME_NAVS` con su barra, `data-zone` con acento propio, rutas en el router, sitemap | ✨ | ⬜ |
| C2 | Mapa interactivo genérico | Pasar lo del mapa de Zelda a un componente común: capas de puntos, filtros por tipo, buscador, ficha al pulsar, marcar como hecho, enlace directo a un punto (`?p=`) | ✨ | ⬜ |
| C3 | Progreso genérico | Lo de `useZeldaProgress` para cualquier juego: navegador + cuenta (`users/{uid}.progress.<juego>`), y su hueco en `firestore.rules` | ✨ ⚙️ | ⬜ |
| C4 | Tabla/lista con filtros genérica | Lista con buscador, filtros, orden y ficha (base de las Pokédex, dinos, armas, objetos…) | ✨ | ⬜ |
| C5 | Plantilla de guía | Página de guía con índice, pasos, imágenes, avisos de spoiler y casillas de progreso | 📐 ✨ | ⬜ |
| C6 | Mapas: herramienta de calibración | Pasar coordenadas del juego a % del mapa, como `calibracion-mapas.json` de ARC | ⚙️ 🗺️ | ⬜ |
| C7 | Fuentes y derechos | Lista de fuentes por juego, licencia de cada una (p. ej. wikis CC BY-NC-SA piden atribución), y qué imágenes no se pueden usar tal cual | ⚖️ | ⬜ |
| C8 | Portada principal | Añadir los seis juegos a la portada, el buscador y el menú de juegos | ✨ | ⬜ |

---

## Pokémon (PK)

Portada con un **mini resumen de lo nuevo** y, como meta principal, el
**competitivo**. Cada juego/región es una subsección con su guía 100 % y su
mapa. Pokémon, habilidades, naturalezas, movimientos y matchups son comunes a
todos los juegos.

| # | Apartado | Qué incluye | Tipo | Estado |
|---|---|---|---|---|
| PK·D | **Diseño de todas las páginas** | Portada, ficha de juego/región, Pokédex y ficha de Pokémon, habilidades, naturalezas, movimientos, tabla de tipos/matchups, competitivo, guía 100 %, mapa. **Hecho para Gen I** en `models/paginas/pokemon/` (8 páginas); falta revisarlo y aprobarlo. Los `.dc.html` nuevos ya incluyen Movimientos (919) y Naturalezas con recomendador como pestañas de `PokemonHabilidades.dc.html` (comprobado el 2026-11-25) | 📐 | 🟨 |
| PK0 | Alcance | Por generaciones, de la 1.ª a la última. Se empieza por **Rojo, Azul y Amarillo** (Kanto, 151 Pokémon) | ❓ | ✅ |
| PK1 | Portada | Novedades (juego, evento, temporada), resumen de cada apartado, bloque de meta competitivo (top uso, equipos destacados) | ✨ | ⬜ |
| PK2 | Pokédex | Todos los Pokémon con filtros (tipo, generación, juego, estadística); ficha con stats, tipos, habilidades, evoluciones, movimientos y dónde capturarlo en cada juego | ⚙️ ✨ | ⬜ |
| PK3 | Habilidades | Lista con descripción, quién la tiene y valoración (buenas / malas / situacionales) | ⚙️ ✨ | ⬜ |
| PK4 | Naturalezas | Tabla de las 25 (+/−), y la mejor y peor por Pokémon según su uso | ⚙️ ✨ | ⬜ |
| PK5 | Movimientos | Lista filtrable (tipo, categoría, potencia, precisión) y quién los aprende | ⚙️ ✨ | ⬜ |
| PK6 | Tipos y matchups | Tabla de tipos interactiva, debilidades por Pokémon y comparador de enfrentamientos | ✨ | ⬜ |
| PK7 | Competitivo | Tiers y uso por formato (VGC / Smogon), sets recomendados, equipos y counters | ⚙️ ✨ | ⬜ |
| PK8 | Subsección por juego | Una página por juego/región: resumen, Pokémon exclusivos, novedades | ✨ | ⬜ |
| PK9 | Guía 100 % por juego | Historia paso a paso (gimnasios, líderes, rivales), Pokédex completa, secundarias, postgame, logros | ⚙️ ✨ | ⬜ |
| PK10 | Mapa por juego | Zonas, Pokémon por zona, objetos, MT, NPC y secundarias | 🗺️ ⚙️ ✨ | ⬜ |
| PK11 | Mini-guías | Crianza, EVs/IVs, shinies, teraestalización (u otra mecánica del juego), cómo empezar en competitivo | ⚙️ ✨ | ⬜ |
| PK12 | Derechos | Datos de PokeAPI (abierta) y Smogon/Showdown (uso público); sprites y mapas son de Nintendo/The Pokémon Company: decidir qué imágenes usar | ⚖️ | ⬜ |
| PK13 | Selector de generación | Las páginas comunes (Pokédex, movimientos, tipos, competitivo) se filtran por generación, porque los datos cambian entre una y otra | 📐 ✨ | ⬜ |

### Primera entrega: 1.ª generación (Kanto)

**Juegos:** Pokémon Rojo, Azul y Amarillo. **Región:** Kanto.

Lo que el diseño tiene que tener en cuenta, porque la 1.ª generación es
distinta de las demás:

- **151 Pokémon**, 15 tipos (aún no existen Siniestro, Acero ni Hada) y
  **unos 165 movimientos**.
- **No hay habilidades, naturalezas, objetos equipados, crianza, sexos ni
  shinies.** Las páginas de habilidades y naturalezas muestran «Desde la
  3.ª generación» al elegir la 1.ª.
- **Una sola estadística «Especial»** (se separa en ataque y defensa
  especiales en la 2.ª).
- **La tabla de tipos tiene diferencias** con la actual (p. ej. Fantasma no
  afecta a Psíquico por un error del juego, y Psíquico domina el metajuego).
- Si un movimiento es físico o especial lo decide su **tipo**, no el
  movimiento.
- **Pokédex al 100 %:** hace falta intercambiar entre Rojo y Azul (Pokémon
  exclusivos de cada versión) y Mew solo se conseguía en eventos.
- **Amarillo** cambia cosas: Pikachu de inicial y siguiéndote, los otros
  tres iniciales se regalan, algunos Pokémon salvajes y entrenadores
  distintos.

**Páginas de esta entrega:**

| # | Página | Qué incluye |
|---|---|---|
| K1 | Portada de Kanto | Resumen de los tres juegos, diferencias entre versiones y accesos |
| K2 | Pokédex de Kanto | Los 151, con versión en la que aparece cada uno, dónde capturarlo, evoluciones y movimientos que aprende (por nivel, MT/MO) |
| K3 | Guía de historia | Pueblo Paleta → 8 gimnasios → Calle Victoria → Alto Mando, con equipo recomendado en cada tramo |
| K4 | Guía 100 % | Pokédex completa (intercambios y exclusivos), todas las MT/MO, objetos ocultos, Mewtwo y legendarios, checklist con progreso |
| K5 | Mapa de Kanto | Ciudades, rutas, cuevas y edificios: Pokémon por zona y versión, objetos (visibles y ocultos), MT, entrenadores y gimnasios |
| K6 | Competitivo de 1.ª gen | Meta de RBY (Smogon «RBY OU»): Pokémon más usados, sets y equipos |

**Datos:** PokeAPI tiene encuentros, movimientos y nombres en español por
versión (`red-blue`, `yellow`). Las guías de historia, los objetos ocultos y
el mapa de Kanto hay que reunirlos de wikis (citando la fuente).

---

## ARK (AK)

Lo importante de ARK no es la historia sino **tamear, construir y sobrevivir
en tribu**. Además de mostrar todos los engramas y crafteables, cada cosa
lleva una guía de cómo hacerla. Cada mapa tiene su sección y su mapa con zoom.

| # | Apartado | Qué incluye | Tipo | Estado |
|---|---|---|---|---|
| AK·D | **Diseño de todas las páginas** | Portada, página de mapa, ficha de dino, lista de engramas, ficha de crafteable, guía de construcción, guía de jefes | 📐 | ⬜ |
| AK0 | Alcance | Del más antiguo al más reciente: **Survival Evolved**, mapas en orden de salida empezando por **The Island**; Survival Ascended después | ❓ | ✅ |
| AK1 | Portada | Mapas disponibles, dinos destacados, guías más útiles, novedades | ✨ | ⬜ |
| AK2 | Sección por mapa | Resumen, biomas, dinos exclusivos, jefes, mejores spots para base | ✨ | ⬜ |
| AK3 | Mapa interactivo por mapa | Spawns de cada dino, recursos (metal, cristal, obsidiana, petróleo…), cuevas y artefactos, obeliscos, notas de explorador, agua, spots de base | 🗺️ ⚙️ ✨ | ⬜ |
| AK4 | Dinos | Lista con filtros (dieta, uso, mapa); ficha: cómo tamearlo, comida y kibble, tiempo, nivel de montura, para qué sirve, dónde aparece | ⚙️ ✨ | ⬜ |
| AK5 | Calculadora de tameo | Comida necesaria y tiempo según nivel y comida (cálculo propio) | ✨ | ⬜ |
| AK6 | Engramas y crafteables | Todos, con filtros (nivel, estación, recursos); ficha con receta, dónde craftearlo y dónde conseguir cada recurso | ⚙️ ✨ | ⬜ |
| AK7 | Guías de construcción | Casas, fuertes, bases en cuevas, puertas y defensas, diseño por fases | ⚙️ ✨ | ⬜ |
| AK8 | Guías de sistemas | Agua y riego (tuberías, drenaje), electricidad, granjas y cultivos, cría y mutaciones | ⚙️ ✨ | ⬜ |
| AK9 | Guía para «completar» | Progresión: jefes, tributos, ascensiones y orden recomendado de mapas | ⚙️ ✨ | ⬜ |
| AK10 | Tribu | Roles, organización, cómo defenderse en PvP/PvE | ⚙️ ✨ | ⬜ |
| AK11 | Derechos | Wiki de ARK (CC BY-NC-SA, con atribución); las calculadoras de otras webs no se copian; mapas del juego son de Studio Wildcard | ⚖️ | ⬜ |

---

## Assassin's Creed (AC)

La portada es de la saga y cada juego es una subsección. Se empieza por
**Unity** y los demás se añaden con la misma plantilla. Por juego: historia,
secundarias, coleccionables y mapa interactivo.

| # | Apartado | Qué incluye | Tipo | Estado |
|---|---|---|---|---|
| AC·D | **Diseño de todas las páginas** | Portada de la saga, portada de un juego, mapa, guía de historia, lista de coleccionables, equipo. Hechas la saga y Unity (`AssassinsCreed.dc.html`, `ACUnity.dc.html`), adaptadas a móvil el 2026-11-25; falta la aprobación de Jorge | 📐 | 🟨 |
| AC0 | Alcance | **Unity primero**; después, del más antiguo (2007) al más reciente. La portada lista todos desde el principio | ❓ | ✅ |
| AC1 | Portada de la saga | Juegos por orden de lanzamiento y cronológico, con acceso a cada uno | ✨ | ⬜ |
| AC2 | Unity: portada | Resumen, distritos de París, accesos a historia, secundarias, coleccionables y mapa | ✨ | ⬜ |
| AC3 | Unity: mapa interactivo | París por distritos: puntos de sincronización, cofres, escarapelas, fragmentos de Helix, enigmas de Nostradamus, asesinatos misteriosos, historias de París, clubes sociales, Franciade (Dead Kings) | 🗺️ ⚙️ ✨ | ⬜ |
| AC4 | Unity: historia | Secuencias y memorias paso a paso, con objetivos de sincronización completa | ⚙️ ✨ | ⬜ |
| AC5 | Unity: secundarias | Asesinatos misteriosos, historias de París, misiones de cooperativo, Dead Kings | ⚙️ ✨ | ⬜ |
| AC6 | Unity: equipo y habilidades | Armas, atuendos, habilidades y qué conviene desbloquear antes | ⚙️ ✨ | ⬜ |
| AC7 | Unity: guía 100 % | Checklist de todo, con progreso | ✨ | ⬜ |
| AC8 | Derechos | Wiki de Fandom (CC BY-SA); mapa e imágenes son de Ubisoft | ⚖️ | ⬜ |

---

## Call of Duty (CD)

Dos partes: **Zombies**, que va primero, y la **historia** (campañas), que
de momento solo tiene un aviso de «Próximamente». Zombies se hace por
entregas, de la más antigua a la más reciente: **World at War** (Nacht der
Untoten, Verrückt, Shi No Numa, Der Riese), luego Black Ops, etc.

| # | Apartado | Qué incluye | Tipo | Estado |
|---|---|---|---|---|
| CD·D | **Diseño de todas las páginas** | Portada, portada de Zombies por entrega, mapa Zombies con Easter egg, armas y ventajas, y el bloque «Historia: próximamente». Hechas la portada y BO1–BO4 (`CodZombies`, `CodBO1`…`CodBO4`), adaptadas a móvil el 2026-11-25; falta la aprobación de Jorge | 📐 | 🟨 |
| CD0 | Alcance | **Zombies primero**, desde World at War hasta el último; la historia después | ❓ | ✅ |
| CD1 | Portada | Entregas y mapas Zombies, lo más buscado y el aviso de la historia | ✨ | ⬜ |
| CD2 | Zombies: página por entrega | Mapas de esa entrega, mecánicas propias, novedades | ✨ | ⬜ |
| CD3 | Zombies: mapa interactivo | Por mapa: caja misteriosa, ventajas, Pack-a-Punch, armas de pared, piezas, trampas y pasos del Easter egg | 🗺️ ⚙️ ✨ | ⬜ |
| CD4 | Zombies: Easter eggs | Paso a paso del principal y de los secundarios, con progreso | ⚙️ ✨ | ⬜ |
| CD5 | Zombies: armas y ventajas | Armas maravilla (cómo conseguirlas y mejorarlas), ventajas, aumentos | ⚙️ ✨ | ⬜ |
| CD6 | Zombies: estrategias | Rutas de entrenamiento, rondas altas, builds | ⚙️ ✨ | ⬜ |
| CD7 | Historia: «Próximamente» | Bloque en la portada y en el menú que avisa de que la historia llegará más adelante | ✨ | ⬜ |
| CD8 | Historia: misiones *(más adelante)* | Misión por misión: objetivos, coleccionables/inteligencia, desafíos y logros | ⚙️ ✨ | ⬜ |
| CD9 | Historia: mapa por misión *(más adelante)* | Dónde está cada coleccionable | 🗺️ ⚙️ ✨ | ⬜ |
| CD10 | Derechos | Mapas e imágenes de Activision; wikis con atribución | ⚖️ | ⬜ |

---

## Resident Evil (RE)

Portada de la saga y una subsección por juego. Cada juego: historia, mapa con
objetos y documentos, puzles y extras.

| # | Apartado | Qué incluye | Tipo | Estado |
|---|---|---|---|---|
| RE·D | **Diseño de todas las páginas** | Portada de la saga, portada de juego, guía, mapa, puzles, armas y extras | 📐 | ⬜ |
| RE0 | Alcance | Del más antiguo al más reciente, empezando por **Resident Evil (1996)**. **Los remakes son juegos aparte**, cada uno con su página | ❓ | ✅ |
| RE1 | Portada de la saga | Juegos y orden cronológico, accesos a cada uno | ✨ | ⬜ |
| RE2 | Guía de historia | Capítulo a capítulo, con dificultad y rutas (p. ej. personajes A/B) | ⚙️ ✨ | ⬜ |
| RE3 | Mapa interactivo | Por zona/planta: objetos clave, munición, documentos, coleccionables, cajas fuertes y códigos | 🗺️ ⚙️ ✨ | ⬜ |
| RE4 | Puzles | Solución de cada puzle y códigos, con aviso de spoiler | ⚙️ ✨ | ⬜ |
| RE5 | Armas y mejoras | Dónde está cada arma, mejoras y comerciante | ⚙️ ✨ | ⬜ |
| RE6 | Enemigos y jefes | Debilidades y estrategia | ⚙️ ✨ | ⬜ |
| RE7 | Guía 100 % | Coleccionables, desbloqueables, rangos (S/S+), logros, speedrun | ⚙️ ✨ | ⬜ |
| RE8 | Derechos | Mapas e imágenes de Capcom; wikis con atribución | ⚖️ | ⬜ |

---

## Rust (RS)

Como ARK: no hay historia, todo es supervivencia, construir y raidear. **El
mapa es procedural** (cambia en cada wipe), así que el mapa interactivo es
de cada **monumento**, no del mundo entero.

| # | Apartado | Qué incluye | Tipo | Estado |
|---|---|---|---|---|
| RS·D | **Diseño de todas las páginas** | Portada, monumento, lista de objetos y ficha, calculadora de raideo, guía de construcción | 📐 | ⬜ |
| RS0 | Alcance | Cómo tratar el mapa: solo monumentos, o también ver un mapa por semilla/servidor | ❓ | ⬜ |
| RS1 | Portada | Novedades del parche/wipe, monumentos, calculadoras y guías | ✨ | ⬜ |
| RS2 | Monumentos | Uno por página: plano interactivo con botín, puzles de tarjetas, radiación, NPC y rutas | 🗺️ ⚙️ ✨ | ⬜ |
| RS3 | Objetos y planos | Todos con filtros; ficha con coste, banco de trabajo, de dónde sale y para qué sirve | ⚙️ ✨ | ⬜ |
| RS4 | Calculadora de raideo | Explosivos necesarios por pared/puerta/material (cálculo propio) | ✨ | ⬜ |
| RS5 | Guías de construcción | Bases por tamaño (solo, dúo, clan), honeycomb, búnkeres, cómo proteger el TC | ⚙️ ✨ | ⬜ |
| RS6 | Guías de sistemas | Electricidad, granjas y genes, agua, automatización | ⚙️ ✨ | ⬜ |
| RS7 | Guía de inicio | Primeros pasos de un wipe y progresión | ⚙️ ✨ | ⬜ |
| RS8 | Derechos | Wiki con atribución; los datos de webs de terceros no se copian; imágenes de Facepunch | ⚖️ | ⬜ |

---

## Orden propuesto

1. **Común (C1–C7)** a la vez que el diseño del primer juego, porque el mapa,
   el progreso y las listas se usan en todos.
2. Un juego cada vez: alcance (`0`) → diseño (`·D`) → portada → resto de
   apartados → pruebas en escritorio, tablet y móvil.
3. Antes de publicar cada juego, su fila ⚖️.
