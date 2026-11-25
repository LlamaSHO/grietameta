# GrietaMeta v1 · Cómo pasar los diseños a vistas de Vue

Rama de trabajo: `claude/grietameta-v1` (sale de `claude/disenos-v1`).
Los diseños aprobados están en `models/paginas/*.dc.html` y sus imágenes en
`models/assets/`. Esta guía es la misma para todos los agentes (Claude y
Codex) que pasan los diseños a código en paralelo.

## Reglas de convivencia (importante)

- **Trabajáis varios agentes a la vez en la misma carpeta.** Cada uno toca
  **solo sus archivos** (tabla de abajo). Si necesitas cambiar algo compartido
  (router, `App.vue`, `SiteNav.vue`, `base.css`, `nav.css`, `games.json`,
  `package.json`, componentes de otros juegos…), **no lo cambies**: apúntalo
  en tu informe final y lo hace el coordinador.
- **No hagas commits ni pushes**, no cambies de rama, no hagas `git stash`,
  `git checkout` ni `git reset`. El coordinador revisa y hace los commits.
- No ejecutes `npm install` ni añadas dependencias. Si de verdad hace falta
  una, dilo en el informe.
- No toques la lógica de pagos (`api/`, Stripe, `src/services/premium.js`,
  `subscription.js`): solo el diseño de sus pantallas.
- Codificación: UTF-8 sin BOM. Revisa al final que no haya `Ã` ni `Â` en tus
  archivos (acentos rotos).

## Qué es de cada uno

| Juego | Carpetas y archivos propios | Diseños | Puerto de prueba |
|---|---|---|---|
| LoL | `src/views/lol/`, `src/views/LolView.vue`, `src/components/lol/`, `src/composables/useLolData.js`, `src/services/lol/`, `src/components/nav/games/LolNav.vue`, `src/assets/styles/games/lol.css`, `public/data/lol/`, `public/images/lol/` | `Lol`, `LolCampeon`, `LolEsports`, `LolBuilds`, `LolNoticias` | 5191 |
| ARC Raiders | `src/views/arc-raiders/`, `src/components/arc/`, `src/services/arc*.js`, `src/assets/styles/views/arc-*.css`, `ArcRaidersNav.vue`, `src/assets/styles/games/arc.css`, `public/data/arc-raiders/`, `public/images/arc-raiders/` | `Arc`, `ArcMapa`, `ArcObjetos`, `ArcEnemigos`, `ArcMisiones` | 5192 |
| Zelda | `src/views/ZeldaView.vue`, `src/views/zelda/`, `src/components/zelda/`, `src/data/zelda*.js`, `src/composables/useZeldaProgress.js`, `ZeldaNav.vue`, `src/assets/styles/games/zelda.css`, `public/data/zelda/`, `public/images/zelda/` | `Zelda`, `ZeldaGuia` | 5193 |
| Pokémon | `src/views/pokemon/`, `src/components/pokemon/`, `PokemonNav.vue`, `src/assets/styles/games/pokemon.css`, `public/data/pokemon/`, `public/images/pokemon/` | `Pokemon`, `PokemonDex`, `PokemonTipos`, `PokemonHabilidades`, `PokemonMecanicas`, `PokemonKanto`, `PokemonKantoMapa`, `PokemonKanto100`, `PokemonCompetitivo`, `PokemonShowdown`, `PokemonEquipo` | 5194 |
| Assassin's Creed | `src/views/assassins-creed/`, `src/components/assassins-creed/`, `AssassinsCreedNav.vue`, `src/assets/styles/games/ac.css`, `public/data/assassins-creed/`, `public/images/assassins-creed/` | `AssassinsCreed`, `ACUnity` | 5195 |
| CoD Zombis | `src/views/cod-zombis/`, `src/components/cod-zombis/`, `CodZombiesNav.vue`, `src/assets/styles/games/cod.css`, `public/data/cod-zombis/`, `public/images/cod-zombis/` | `CodZombies`, `CodBO1`–`CodBO4`, `CodMapas` | 5196 |
| ARK | `src/views/ark/`, `src/components/ark/`, `ArkNav.vue`, `src/assets/styles/games/ark.css`, `public/data/ark/`, `public/images/ark/` | `Ark`, `ArkCriaturas`, `ArkEngramas`, `ArkRecursos`, `ArkGuias` | 5197 |
| General | `src/views/HomeView.vue`, `src/components/home/`, `LoginView.vue`, `src/components/auth/`, `ContactView.vue`, `src/components/contact/`, `src/views/account/`, `src/components/account/`, `src/views/premium/`, `src/components/premium/*.vue` (no la lógica), `CheckoutSuccessView.vue`, `NotFoundView.vue`, `src/views/legal/`, `SiteNav.vue`, `NavAccount.vue`, `MobileTabBar.vue`, `SiteFooter.vue`, `GameSearch.vue`, `src/assets/styles/{base,nav,games-nav}.css`, `public/images/home/` | `Main`, `Login`, `Contacto`, `Premium`, `MiPremium`, `PremiumExito` | 5198 |

Los `*-movil.dc.html` son vistas móviles antiguas: úsalas solo como
referencia. **El móvil se hace en la misma vista con `@media`**, no hay vistas
móviles aparte.

## Rutas (ya creadas en `src/router/index.js`)

Cada página nueva tiene ya su ruta y una vista provisional («Página en
preparación») en el archivo que tienes que rellenar. Los enlaces entre
diseños (`href="X.dc.html"`) se cambian por estas rutas con `<RouterLink>`:

- LoL: `/lol`, `/lol/campeon/:id`, `/lol/esports`, `/lol/builds`, `/lol/noticias`
- ARC: `/arc-raiders`, `/arc-raiders/mapas/:mapa?`, `/arc-raiders/objetos`, `/arc-raiders/enemigos`, `/arc-raiders/misiones`
- Zelda: `/zelda` (anclas `#inicio`, `#mapa`, `#info`), `/zelda/:guia`
- Pokémon: `/pokemon`, `/pokemon/pokedex`, `/pokemon/tipos`, `/pokemon/habilidades`, `/pokemon/mecanicas`, `/pokemon/kanto`, `/pokemon/kanto/mapa`, `/pokemon/kanto/100`, `/pokemon/competitivo`, `/pokemon/competitivo/showdown`, `/pokemon/competitivo/equipo`
- AC: `/assassins-creed`, `/assassins-creed/unity`
- CoD: `/cod-zombis`, `/cod-zombis/black-ops`, `/cod-zombis/black-ops-2`, `/cod-zombis/black-ops-3`, `/cod-zombis/black-ops-4`, `/cod-zombis/planos/:mapa?`
- ARK: `/ark`, `/ark/criaturas`, `/ark/engramas`, `/ark/recursos`, `/ark/guias`
- General: `/`, `/login`, `/contacto`, `/premium`, `/cuenta`, `/cuenta/premium`, `/exito`

Si una página tuya necesita una ruta que no está, pídela en el informe.

## Cómo convertir un `.dc.html`

1. **Qué NO copiar.** Cada diseño trae dentro el nav global, el menú de
   juegos, el buscador, la barra inferior del móvil, el pie y sus estilos
   (`/* gm-transiciones */`, `/* nav global */`, `/* submenú */`,
   `/* menú global de juegos */`, `/* barra inferior en móvil */`, `.foot`).
   La app ya los tiene (`SiteNav`, `MobileTabBar`, `SiteFooter`). Tú solo
   pasas el **contenido de la página** y la **barra de tu juego** (`.sub`).
2. **La barra de tu juego** (`<nav class="sub">` del diseño) va en tu
   componente `src/components/nav/games/<Juego>Nav.vue` (ahora es
   provisional). Solo los enlaces y desplegables: el chip con el logo y el
   nombre ya lo pone `SiteNav`. Sus estilos, en
   `src/assets/styles/games/<zona>.css` con todos los selectores bajo
   `[data-zone="<zona>"]`, importado desde tu `<Juego>Nav.vue`. Zonas:
   `lol`, `arc`, `zelda`, `pokemon`, `ac`, `cod`, `ark`.
3. **Plantilla.** `<sc-for list="{{x}}" as="i">` → `v-for="i in x"`;
   `<sc-if value="{{c}}">` → `v-if="c"`; `{{a.b}}` → `{{ a.b }}`;
   `onClick="{{f}}"` → `@click="f"`; `style="--x: {{v}}"` →
   `:style="{ '--x': v }"`. Divide las páginas largas en componentes de tu
   carpeta `src/components/<juego>/`.
4. **Lógica.** `class Component extends DCLogic { renderVals() }` →
   `<script setup>` con `ref`/`reactive`/`computed`. Lo que el diseño guarda
   en `this.state` es estado local (o query de la ruta si conviene poder
   compartir el enlace, como en ARC).
5. **Estilos.** El CSS de la página va con `<style scoped>` en la vista o en
   un `.css` de tu carpeta. Quita las reglas de la parte 1. Ojo: en el diseño
   cada `{{valor}}` iba envuelto en `<span class="sc-interp">`; si alguna regla
   tipo `.x span` dependía de eso, revísala.
6. **Datos.** Las tablas grandes que el diseño lleva dentro del script
   (`const DEX = [...]`, `const MAPS = {...}`) van a `public/data/<juego>/*.json`
   y se cargan al entrar en la página con
   `useGameData("/data/<juego>/archivo.json")` (`src/composables/useGameData.js`).
   Las tablas pequeñas pueden ir en un `.js` de tu carpeta. Nada de importar
   todos los JSON de golpe. Muestra un estado de carga y uno de error.
7. **Imágenes.** Copia las que uses de `models/assets/...` a
   `public/images/<juego>/...` y enlázalas como `/images/<juego>/...`. No
   enlaces imágenes de otras webs que bloqueen el enlace directo (la wiki de
   ARK, Fandom). Las de Data Dragon (Riot), PokeAPI o Steam sí se pueden enlazar.
   Usa `loading="lazy"` y `decoding="async"` fuera de la primera pantalla.
8. **Textos.** Se respetan los del diseño (español, con tildes).

## Rendimiento (obligatorio)

Resumen de `models/README.md` («Rendimiento y pantallas de carga») y de las
notas de Jorge:

- Nada de `backdrop-filter`. Anima solo `transform` y `opacity`, y que las
  animaciones terminen (nada de `infinite` salvo indicadores muy pequeños).
- Sin `will-change` fijo. Sin `filter` en elementos grandes ni capas fijas a
  pantalla completa con efectos.
- Arrastres de mapas: mueve la capa con `style.transform` directamente y
  guarda el estado al soltar; captura el puntero; limita el zoom.
- Las pantallas de carga bloquean la interacción (`pointer-events:auto`),
  duran lo justo y terminan con `visibility:hidden`. Respeta
  `prefers-reduced-motion`.
- **Assassin's Creed** iba lento en el diseño: mídelo y aligéralo (efectos
  solo al entrar, portadas a su tamaño, quitar efecto por efecto hasta que
  vaya fluido).

## Responsive

Revisa cada página a **1440 px** y a **390 px**. Rejillas que pasen a una
columna, tablas con desplazamiento horizontal, menús de la barra del juego
que no se salgan de la pantalla, nada de texto cortado ni desbordes
horizontales (`document.documentElement.scrollWidth` igual al ancho).

## Cómo probar

- Compilar sin pisar a los demás: `npx vite build --outDir <carpeta temporal tuya> --emptyOutDir`
  (por ejemplo `C:/Users/jorge/AppData/Local/Temp/gm-build-<juego>`). Nunca
  compiles a `dist/`.
- Servidor propio: `npx vite --port <tu puerto> --strictPort` (tabla de
  arriba). Páralo al acabar.
- Capturas con Chrome sin ventana:
  `"C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,2400 --virtual-time-budget=8000 --user-data-dir=<carpeta temporal> --screenshot=<ruta>.png http://localhost:<puerto>/<ruta>`
  y lo mismo con ancho 390 para el móvil.
- Compara con el diseño (`http://127.0.0.1:5180/paginas/<Diseño>.dc.html` si
  el servidor de diseños está en marcha, o abre el archivo).

## Informe final

Al terminar, responde con: páginas hechas (y cuáles no), archivos creados o
cambiados, cambios compartidos que necesitas del coordinador, problemas o
dudas, y rutas de las capturas finales (escritorio y móvil).
