# Plan del rediseño (rama `rediseno-models`)

Inventario de todas las vistas que había que remodelar con los diseños de
`models/`, comparadas con lo que había en `src/` antes del rediseño. El
estado actual está justo debajo.

Cada diseño (`models/paginas/*.dc.html`) es responsive (cortes en 860, 640
y 560 px) e incluye la versión móvil; no hay archivos móviles aparte. La
versión móvil es obligatoria en todas las vistas.

## Estado (11 de noviembre de 2026)

**Hecho y probado (escritorio, tablet y móvil):** las cuatro secciones:
Principal (P1–P16), League of Legends (L1–L4), Zelda (Z1–Z3.5) y ARC Raiders
(A1–A8). Revisión final: 37 rutas sin errores de consola, sin imágenes rotas
y sin scroll horizontal a 1440, 768 y 375 px. Salvedades:

- **Pagos: solo diseño.** `src/services/premium.js` y `api/` (checkout y
  webhook) no se han tocado. En Mi Premium, cambiar plan, gestionar el pago y
  cancelar muestran «Próximamente». La prueba de 7 días solo se anuncia con
  el plan mensual, que es como funciona hoy el checkout.
- **Login:** Google listo en código, falta activar el proveedor en la consola
  de Firebase. Discord, Riot, Epic y Steam muestran «Próximamente» (necesitan
  backend).
- **Contacto:** `api/contact.js` envía con Resend (variables `RESEND_API_KEY`,
  `CONTACT_FROM`, `CONTACT_TO` y la clave web de Firebase para la copia).
  En local ofrece el `mailto:`.
- **LoL:** Matchups «Pronto» (sin datos); región solo EUW; «Builds» lleva a
  la ficha del campeón del parche.
- **Zelda:** las 5 guías de detalle no tenían diseño (📐) y se han hecho con
  el lenguaje visual de Zelda. Subsuelo sigue «Próximamente» (sin mapa ni
  datos). Cuevas: 72 de 147 con coordenadas. El mapa carga una versión media
  (~360 KB) y la HD de 6000 px solo al acercar.
- **ARC:** las listas de objetos, misiones y enemigos no tenían diseño (📐) y
  se han rehecho en Vue con el estilo del hub, sin perder funciones; el
  progreso de misiones antiguo (`arcmeta.misiones.v1`) se sigue leyendo.
  «Guías» no tiene vista propia (lleva a las secciones del hub). Sin datos de
  zonas: Riven Tides, Stella Montis (planta inferior), Leaper, Spotter y
  Surveyor.
- **`firestore.rules`:** actualizado (lista de campos permitidos, avisos,
  favoritos y progreso de Zelda) pero **sin desplegar**; hasta entonces el
  progreso de Zelda solo se guarda en el navegador.
- **Sin probar con sesión iniciada en el navegador:** Mi cuenta, Mi Premium y
  el progreso de Zelda en la cuenta.
- **Antes de publicar (derechos):** mapas HD de Zelda (teselas de objmap,
  © Nintendo), retratos de comerciantes de ARC (wiki de Fandom, © Embark) y
  datos de mapas de MetaForge (piden atribución y contacto si hay ingresos).

**Pendiente:** «Cuenta» puede crecer (hoy: nombre, favoritos, Premium);
Matchups de LoL; envío real del contacto y login social cuando haya backend.

## Qué significa cada acción

| Acción | Significado |
|---|---|
| 🔄 **Actualizar** | Existe en `src/` y hay diseño nuevo: rehacerla con el diseño. |
| ✨ **Nueva** | Hay diseño pero no existe en `src/`: crear vista o componente. |
| 📐 **Falta esquema** | Existe (o hace falta) pero **no hay diseño** en `models/`: hay que diseñarla o decidir cómo adaptar la actual al estilo nuevo. |
| ⚙️ **Datos / backend** | No es diseño: hacen falta datos, una función en `/api` o reglas de Firestore. |

---

## 1. Principal (sitio general)

### 1.1 Base común

| # | Vista / pieza | Ruta | Hoy en `src/` | Diseño nuevo (`models/`) | Acción | Qué falta |
|---|---|---|---|---|---|---|
| P1 | Tokens de color y fuentes | — | `base.css`: paleta antigua (dorado/turquesa), Cinzel + IBM Plex | Tabla «Estilo por juego» del README: tricolor GM, Bricolage Grotesque, Chakra Petch, Barlow Condensed, Cinzel (Zelda) | 🔄 Actualizar | Variables por zona (portada, LoL, Zelda, ARC) y cargar las fuentes nuevas. |
| P2 | Logo y favicon | — | Hexágono hecho con CSS + `favicon.png` | `logo/Logo.dc.html` (GM tricolor animado) + `assets/brand/*.svg` | 🔄 Actualizar | Componente `GmEmblem.vue` (animado) y versión mono para nav/footer; `gm-favicon.svg` en `public/`. Hay 3 logos alternativos (grieta, hex, wordmark): decidir si se descartan. |
| P3 | Nav global | todas | `SiteNav.vue` (logo, buscador centrado, Premium, cuenta) | Nav de cada diseño con mini-logo GM | 🔄 Actualizar | Restilar; «Hazte Premium» pasa a apuntar a `/premium`. |
| P4 | Barra inferior móvil | todas | No existe | `.tabbar` (Inicio · LoL · ARC · Zelda · Cuenta) en todos los diseños | ✨ Nueva | `MobileTabBar.vue` global en `App.vue`. |
| P5 | Footer | todas | `SiteFooter.vue` (Juegos, Ayuda, Legal, franja de contacto) | Footer de los diseños (mismas columnas) | 🔄 Actualizar | Solo estilo; el contenido ya coincide. |
| P6 | Buscador de juegos | nav + portada | `GameSearch.vue` | Buscador del hero + chips de atajos (Main) | 🔄 Actualizar | Añadir chips de atajos y el estilo nuevo. |

### 1.2 Páginas

| # | Vista / subvista | Ruta | Hoy en `src/` | Diseño nuevo | Acción | Qué falta |
|---|---|---|---|---|---|---|
| P7 | **Portada** | `/` | `HomeView.vue`: título, buscador grande y 3 tarjetas | `Main.dc.html` | 🔄 Actualizar | — |
| P7.1 | ↳ Hero con emblema GM animado | | No existe | Emblema con trazo y brillo | ✨ Nueva | `HomeHero.vue` + `GmEmblem.vue`. |
| P7.2 | ↳ Iconos flotantes y «Juegos destacados» | | No existe | `.deco` f1–f8, `.floaters` | ✨ Nueva | `FloatingDeco.vue`. |
| P7.3 | ↳ Paneles de juego que se expanden | | 3 tarjetas planas | Paneles con splash (`.p-lol`, `.p-arc`, `.p-zelda`) | 🔄 Actualizar | `GamePanels.vue`. |
| P7.4 | ↳ «¿Echas de menos algún juego?» | | Una línea de texto | Bloque CTA | 🔄 Actualizar | `RequestGameCta.vue`. |
| P8 | **Login** | `/login` | `LoginView.vue`: email/contraseña, crear cuenta, recuperar | `Login.dc.html` | 🔄 Actualizar | Tarjeta de alto fijo, iconos flotantes, medidor de contraseña. |
| P8.1 | ↳ Acceso con Google | | No existe | Botón Google | ✨ Nueva + ⚙️ | Activar Google en Firebase Auth (`signInWithPopup`). |
| P8.2 | ↳ Acceso con Discord, Riot, Epic y Steam | | No existe | Botones con sus logos | ✨ Nueva + ⚙️ | Cada uno necesita una función en `/api` + custom token de Firebase. Riot Sign On requiere aprobación de Riot. |
| P9 | **Premium** (planes) | `/premium` (nueva) | No existe: los planes están dentro de `/lol#premium` | `Premium.dc.html` | ✨ Nueva | Selector mensual/anual, tarjetas, comparativa por juego, FAQ. |
| P9.1 | ↳ Pago anual | | Solo mensual en Stripe | 39,99 €/año | ⚙️ | Crear el precio anual en Stripe y aceptarlo en `api/create-checkout-session`. Confirmar el precio. |
| P10 | **Mi Premium** | `/cuenta/premium` (nueva) | No existe | `MiPremium.dc.html` | ✨ Nueva | Estados activa / prueba / cancelada; cambiar plan; cancelar. |
| P10.1 | ↳ Avisos por juego y canal | | No existe | Interruptores LoL / ARC / Zelda + email/navegador | ✨ Nueva + ⚙️ | Guardar en `users/{uid}` y ampliar `firestore.rules`. |
| P10.2 | ↳ Pagos y facturas | | No existe | Enlace al portal de Stripe | ⚙️ | Función `/api` que cree la sesión del Customer Portal; el webhook debe escribir `is-premium`. |
| P11 | **Pago completado** | `/exito` | `CheckoutSuccessView.vue` (diseño antiguo) | `PremiumExito.dc.html` | 🔄 Actualizar | Confeti, resumen del plan, «¿Y ahora qué?». |
| P12 | **Contacto** | `/contacto` | `ContactView.vue` (abre el correo con `mailto:`) | `Contacto.dc.html` | 🔄 Actualizar | Chips de juego, contador, «enviarme una copia», estados enviando/error/enviado. |
| P12.1 | ↳ Envío real del formulario | | `mailto:` | Estado «enviado» | ⚙️ | Función `/api/contact` (Resend/SendGrid/SMTP) con límite y captcha. |
| P13 | **Cuenta / perfil** | `/cuenta` | Solo el menú del avatar (cerrar sesión) | No hay diseño (la tabbar tiene «Cuenta» y Login enlaza a Mi Premium) | 📐 Falta esquema | Decidir qué es «Cuenta»: perfil, favoritos, progreso, Premium. |
| P14 | **Privacidad** | `/privacidad` | `PrivacyView.vue` (estilo antiguo) | Sin diseño | 📐 Falta esquema | Probablemente basta una plantilla de texto legal con el estilo nuevo. |
| P15 | **Publicidad** | `/publicidad` | `AdvertisingView.vue` (estilo antiguo) | Sin diseño | 📐 Falta esquema | La misma plantilla legal que Privacidad. |
| P16 | **Página no encontrada** | `/*` | `NotFoundView.vue` | Sin diseño | 📐 Falta esquema | Pequeña; se puede derivar de la portada. |

---

## 2. League of Legends

| # | Vista / subvista | Ruta | Hoy en `src/` | Diseño nuevo | Acción | Qué falta |
|---|---|---|---|---|---|---|
| L1 | **Hub de LoL** | `/lol` | `LolView.vue` + `scripts/lol.js` (todo en una página, lógica antigua con DOM) | `Lol.dc.html` | 🔄 Actualizar | Rehacer en componentes Vue; deja de usar `scripts/lol.js`. |
| L1.1 | ↳ Barra de LoL con mega-menú «Campeones» | | `LolNav.vue` (Tier list, Campeones, Premium) | Mega-menú con roles y campeones + «Builds» + «Premium» | 🔄 Actualizar | — |
| L1.2 | ↳ Cabecera (estado del parche) | | Hero «Sube de división…» + etiqueta del parche | Cabecera nueva | 🔄 Actualizar | — |
| L1.3 | ↳ Tier list | `#tierlist` | Filas S/A/B/C, filtro por rango (chips) | Filtro por línea con iconos, desplegable de rango con emblemas, desplegable de región | 🔄 Actualizar | `LolTierList.vue`, `RoleFilter.vue`, `RankDropdown.vue`, `RegionDropdown.vue`. |
| L1.4 | ↳ Cálculo de tiers | | Fórmula que da casi todo C | Percentiles dentro de cada línea | ⚙️ | Cambiar la fórmula (README de `models/`). |
| L1.5 | ↳ Campeón del parche | `#destacado` | No existe | Bloque destacado que abre la ficha | ✨ Nueva | `PatchSpotlight.vue`. |
| L1.6 | ↳ Todos los campeones | `#campeones` | Rejilla con buscador, filtros de rango y rol | Rejilla con buscador | 🔄 Actualizar | Cada carta lleva a la ficha (hoy abre un modal). |
| L1.7 | ↳ Resumen del parche | | No existe | Widget | ✨ Nueva | — |
| L1.8 | ↳ Mejores por rol | | No existe | Widget | ✨ Nueva | — |
| L1.9 | ↳ Más baneados | | No existe | Widget | ✨ Nueva | — |
| L1.10 | ↳ Partidas por rango | | No existe | Widget | ✨ Nueva | — |
| L1.11 | ↳ Bloque Premium | `#premium` | Planes + «desbloquear por email» (Vercel KV, que no existe) | «Navega sin anuncios» que lleva a `/premium` | 🔄 Actualizar | Quitar el desbloqueo por email: Premium ya va por la cuenta (`is-premium`). |
| L2 | **Ficha de campeón** | `/lol/campeon/:id` (nueva) | Modal dentro de `/lol` (winrate, build, runas) | `LolCampeon.dc.html` (plantilla con Yasuo) | ✨ Nueva | `LolChampionView.vue` con ruta dinámica. |
| L2.1 | ↳ Cabecera con splash y habilidades | | No existe | Splash + habilidades | ✨ Nueva | Textos de habilidades de Data Dragon `es_ES`. |
| L2.2 | ↳ Pestaña Build: runas y objetos | | Build y runas en el modal | Runas y objetos | 🔄 Actualizar | Pasar del modal a la ficha. |
| L2.3 | ↳ Pestaña Por rango | | No existe | El rango cambia WR, PR, BR, partidas, tier y puesto | ✨ Nueva | Ya hay datos por rango en `champion-stats.json`. |
| L2.4 | ↳ Pestaña Matchups | | No existe | Marcada «Pronto» | ⚙️ | No hay datos de matchups: hay que añadirlos a `fetch-riot-stats.mjs`. |
| L2.5 | ↳ Otros campeones de la línea | | No existe | Lista lateral | ✨ Nueva | — |
| L3 | **Builds** (enlace del mega-menú) | ? | No existe | Apunta a la ficha de campeón; no tiene vista propia | 📐 Falta esquema | Decidir: ¿índice de builds o se quita el enlace? |
| L4 | Datos de LoL | — | Data Dragon fijo en una versión | Igual | ⚙️ | Leer la versión de `versions.json`. Región: solo EUW (se avisa en el desplegable). |

---

## 3. Zelda: Tears of the Kingdom

| # | Vista / subvista | Ruta | Hoy en `src/` | Diseño nuevo | Acción | Qué falta |
|---|---|---|---|---|---|---|
| Z1 | **Hub de Zelda** | `/zelda` | `ZeldaView.vue` + `scripts/zelda.js` (todo en una página larga) | `Zelda.dc.html` | 🔄 Actualizar | Rehacer en componentes Vue. |
| Z1.1 | ↳ Barra de Zelda con mega-menú | | `ZeldaNav.vue` (5 anclas) | Inicio · Mapas (Superficie, Cielo, Subsuelo) · Información (5 guías) | 🔄 Actualizar | — |
| Z1.2 | ↳ Inicio / cabecera | `#inicio` | Hero «No te dejes nada en Hyrule» | Cabecera nueva | 🔄 Actualizar | — |
| Z2 | **Mapa interactivo** | `#mapa` | Dos mapas SVG fijos y separados (semillas y santuarios) con capas | Mapa HD único con pan/zoom, todos los pines, tarjeta al pasar, ficha, «marcar como hecho», filtro de estado y progreso | ✨ Nueva | `ZeldaMap.vue`, `MapPin.vue`, `MapLegend.vue`, `ProgressCard.vue`. Mapas HD en `models/assets/zelda/mapas`. |
| Z2.1 | ↳ Capa Superficie | | Imagen actual | `superficie-hd.webp` | ✨ Nueva | — |
| Z2.2 | ↳ Capa Cielo | | Imagen actual | `cielo-hd.webp` | ✨ Nueva | — |
| Z2.3 | ↳ Capa Subsuelo | | No existe | Marcada «Próximamente» | 📐 Falta esquema + ⚙️ | Sin datos ni mapa. |
| Z2.4 | ↳ Guardar progreso | | No existe | Marcar pines como hechos | ⚙️ | Firestore (con sesión) + `localStorage` de respaldo; ampliar reglas. |
| Z2.5 | ↳ Cuevas y torres | | No existen | Pines de cuevas y torres | ⚙️ | Cuevas: solo 72 de 147 con coordenadas. |
| Z3 | **Información** (índice de guías) | `#info` | No existe como índice | 5 tarjetas resumen con «Ver … →» | ✨ Nueva | — |
| Z3.1 | ↳ Guía de santuarios (lista completa) | | Sección «Santuarios» (mapa + lista) | Solo la tarjeta resumen | 📐 Falta esquema | Diseñar la vista de detalle o adaptar la actual. |
| Z3.2 | ↳ Guía de semillas kolog | | Sección «Semillas» (mapa) | Solo la tarjeta | 📐 Falta esquema | Probablemente la absorbe el mapa interactivo. |
| Z3.3 | ↳ Guía de misiones | | Sección «Misiones» (filtro principal/aventura/secundaria) | Solo la tarjeta | 📐 Falta esquema | — |
| Z3.4 | ↳ Guía de armaduras | | Sección «Armaduras» | Solo la tarjeta (top 10) | 📐 Falta esquema | — |
| Z3.5 | ↳ Guía de conjuntos | | Sección «Conjuntos» | Solo la tarjeta | 📐 Falta esquema | — |

---

## 4. ARC Raiders

| # | Vista / subvista | Ruta | Hoy en `src/` | Diseño nuevo | Acción | Qué falta |
|---|---|---|---|---|---|---|
| A1 | **Hub de ARC** | `/arc-raiders` | No existe: esa ruta es hoy la lista de objetos | `Arc.dc.html` | ✨ Nueva | — |
| A1.1 | ↳ Barra de ARC con mega-menú | | `ArcRaidersNav.vue` (3 enlaces) | Inicio · Mapas (lista) · Objetos · Misiones · Enemigos · Guías | 🔄 Actualizar | — |
| A1.2 | ↳ Hero «Sube a la superficie» y KPIs | | No existe | Hero + cifras | ✨ Nueva | — |
| A1.3 | ↳ «Elige tu zona» (rejilla de mapas) | `#mapas` | No existe | Tarjetas de mapa → visor | ✨ Nueva | — |
| A1.4 | ↳ Objetos y reciclaje (resumen) | `#objetos` | El bloque «¿Cómo se calcula…?» está en la lista de objetos | Resumen por acción + «¿Cómo se calcula la recomendación?» | ✨ Nueva | — |
| A1.5 | ↳ Misiones por comerciante | `#misiones` | No existe así | Retratos de Shani, Celeste, Tian Wen, Apollo y Lance | ✨ Nueva | Retratos en `models/assets/arc/comerciantes`. |
| A1.6 | ↳ Los ARC más peligrosos | `#arc` | No existe así | Tarjetas con punto débil | ✨ Nueva | — |
| A2 | **Lista completa de objetos** | `/arc-raiders/objetos` (nueva ruta) | `ArcItemsView.vue` en `/arc-raiders` (buscador, filtros, paginación, ficha) | Sin diseño: el hub enlaza a «Ver todos los objetos →» | 📐 Falta esquema | Mover de ruta y adaptarla al estilo ARC nuevo. |
| A3 | **Misiones** (seguimiento) | `/arc-raiders/misiones` (nueva ruta) | `ArcQuestsView.vue` en `/arc-misiones` (progreso, filtros, mapas, objetos a guardar, copia de seguridad) | Sin diseño: «Ver todas las misiones →» | 📐 Falta esquema | Mover de ruta; el visor de mapas actual lo sustituye A5. |
| A4 | **Enemigos** | `/arc-raiders/enemigos` (nueva ruta) | `ArcEnemiesView.vue` en `/arc-enemigos` (rejilla + ficha) | Sin diseño: «Ver los 17 ARC →» | 📐 Falta esquema | Mover de ruta y adaptar al estilo. |
| A5 | **Mapa de ARC** | `/arc-raiders/mapas/:mapa` (nueva) | Visor sencillo dentro de Misiones (zoom) | `ArcMapa.dc.html` | ✨ Nueva | Puede reutilizar la base del mapa de Zelda. |
| A5.1 | ↳ Pestañas de mapa y plantas | | No existe | Stella Montis con plantas | ✨ Nueva | — |
| A5.2 | ↳ Panel de misiones del mapa (mini guías) | | No existe | Retrato del comerciante en el mapa, puntos numerados por misión | ✨ Nueva + ⚙️ | Datos en `models/data/arc-misiones-puntos.json`. |
| A5.3 | ↳ Zonas de enemigos (mapa de calor) | | No existe | Al tocar un ARC | ✨ Nueva + ⚙️ | `models/data/arc-zonas-enemigos.json`. Sin datos: Riven Tides, Stella Montis (planta inferior), Leaper, Spotter y Surveyor. |
| A6 | **Guías** (enlace del mega-menú) | ? | No existe | Apunta a `#objetos` | 📐 Falta esquema | Decidir si habrá vista propia de guías. |
| A7 | Redirecciones antiguas | `/arc-misiones`, `/arc-enemigos` | Son las rutas actuales | Rutas nuevas bajo `/arc-raiders/` | ⚙️ | Redirecciones en el router y en `vercel.json` (SEO). |
| A8 | Datos de MetaForge | — | Proxy `api/arc-items.js` sin usar | Zonas y puntos de misión de MetaForge | ⚙️ | **MetaForge pide atribución y que les contactes** antes de usarlo en una web con ingresos (anuncios + Premium). |

---

## Resumen

| Sección | 🔄 Actualizar | ✨ Nueva | 📐 Falta esquema | ⚙️ Datos / backend |
|---|---|---|---|---|
| Principal | 11 | 8 | 4 | 6 |
| League of Legends | 7 | 9 | 1 | 3 |
| Zelda | 3 | 4 | 6 | 3 |
| ARC Raiders | 1 | 10 | 4 | 4 |

(Cuenta cada fila; las que tienen dos acciones cuentan en las dos.)

**Vistas sin diseño todavía (📐):** Cuenta/perfil, Privacidad, Publicidad,
404, «Builds» de LoL, Subsuelo de Zelda, las 5 guías de detalle de Zelda, y
las listas de Objetos, Misiones y Enemigos de ARC más «Guías».

## Orden propuesto

Sigue el orden del README de `models/`, con las vistas sin diseño al final:

1. **Base:** tokens, fuentes, logo y favicon (P1–P2), nav, footer y barra
   móvil (P3–P5).
2. **Portada** (P6–P7).
3. **LoL:** tier list y filtros (L1) → ficha de campeón con ruta dinámica (L2).
4. **Zelda:** componente de mapa reutilizable (Z2) → hub e información (Z1, Z3).
5. **ARC:** hub (A1) → rutas nuevas y redirecciones (A7) → visor de mapas (A5).
6. **Cuenta y pago:** Login (P8, Google primero) → Premium (P9) → Mi Premium
   (P10) → Pago completado (P11) → Contacto con envío real (P12).
7. **Vistas sin diseño (📐):** diseñarlas o adaptar las actuales al estilo
   nuevo.

## Decisiones pendientes

- ¿Se versiona la carpeta `models/` en git? Pesa 3,7 MB y lleva material con
  copyright (mapas HD de Zelda, retratos de ARC) que el README recomienda no
  usar tal cual en producción.
- Precio del plan anual (el diseño propone 39,99 €/año).
- Qué es la página «Cuenta» y si «Builds» (LoL) y «Guías» (ARC) tendrán vista
  propia.
- Contactar con MetaForge antes de usar sus datos de mapas.
