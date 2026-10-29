# GrietaMeta

Web de guías y estadísticas de videojuegos (League of Legends, ARC Raiders y
Zelda: Tears of the Kingdom), hecha con **Vue 3 + Vite + Vue Router** y
desplegada en Vercel. Los usuarios irán en **Firebase** (Authentication +
Cloud Firestore).

## Puesta en marcha

Antes de nada, copia `.env.example` como `.env` y rellena la configuración de
Firebase (Consola de Firebase → Configuración del proyecto → Tus apps). El
`.env` no se sube al repositorio. En Vercel, las mismas variables
`VITE_FIREBASE_*` van en **Settings → Environment Variables**.

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build     # genera la web en dist/
npm run preview   # sirve dist/ para probar el build
```

## Estructura

```
├── index.html                 # entrada de Vite (fuentes, AdSense, <div id="app">)
├── src/
│   ├── main.js                # arranca Vue + router
│   ├── App.vue                # <RouterView> y navegación sin recargar
│   ├── router/index.js        # rutas, títulos y redirecciones de URLs antiguas
│   ├── views/                 # una vista por página
│   │   ├── HomeView.vue       #   /             portada: elige tu juego
│   │   ├── LolView.vue        #   /lol          League of Legends
│   │   ├── arc-raiders/       #   /arc-raiders, /arc-misiones, /arc-enemigos
│   │   ├── ZeldaView.vue      #   /zelda
│   │   ├── legal/             #   /privacidad, /publicidad
│   │   └── CheckoutSuccessView.vue  # /exito (vuelta de Stripe)
│   ├── components/            # piezas reutilizables (buscador de juegos…)
│   ├── composables/           # lógica Vue reutilizable
│   ├── scripts/               # lógica de cada vista migrada desde los HTML antiguos
│   ├── services/              # todo lo que se consume de fuera
│   │   ├── firebase/          #   app, auth (usuarios) y users (perfiles en Firestore)
│   │   ├── riotStats.js       #   estadísticas de LoL + Data Dragon
│   │   ├── arcRaiders.js      #   datos e imágenes de ARC Raiders
│   │   ├── games.js           #   catálogo de juegos
│   │   └── premium.js         #   Stripe, vía las funciones de /api
│   ├── data/                  # datos que van dentro del código (guía de Zelda)
│   └── assets/styles/         # CSS global y uno por vista (styles/views/)
├── public/                    # se sirve tal cual
│   ├── data/                  # JSON (games.json, champion-stats.json, arc-raiders/)
│   └── images/                # games/, arc-raiders/{items,bots,maps}/, zelda/
├── api/                       # funciones serverless de Vercel (ver abajo)
├── tools/                     # scripts de mantenimiento (Riot, ARC, Firebase)
├── data/raw-stats.json.gz     # estado interno del Action de Riot (no se sirve)
├── firebase.json, firestore.rules, .firebaserc
└── vercel.json
```

### Cómo están hechas las vistas

Las páginas venían de HTML sueltos con todo dentro. En la migración cada una
se ha separado en tres piezas que se pueden ir convirtiendo a Vue "de verdad"
poco a poco:

- **Plantilla** en `src/views/…View.vue`.
- **Estilos** en `src/assets/styles/views/<vista>.css`. `postcss.config.js`
  los encierra solos en `.view-<vista>` (la clase raíz de la vista), para que
  los estilos de una página no afecten a otra.
- **Lógica** en `src/scripts/<vista>.js`, una función `init({ root, signal })`
  que se ejecuta al montar la vista (`usePageScript`). Los listeners de
  `document`/`window` deben registrarse con `{ signal }` para limpiarse al
  salir de la vista.

La portada (`HomeView`) y el buscador de juegos (`GameSearch`) ya son
componentes Vue completos y sirven de modelo para las demás.

Para añadir un juego basta con añadirlo a `public/data/games.json` (y crear
su vista y su ruta en `src/router/index.js`).

### `services/` y `api/`

`src/services/` es lo que la web consume de fuera: Firebase, los JSON de
datos, Data Dragon de Riot y las funciones de `/api`.

`api/` son las **funciones serverless de Vercel** (proxy de MetaForge para
ARC Raiders y Stripe). Tienen que llamarse `api/` porque es la carpeta que
Vercel convierte en funciones; guardan las claves secretas, así que no pueden
ir en el navegador. En `docs/borradores-premium-kv/` quedan las versiones de
Stripe con Vercel KV que estaban sueltas en la raíz y no se llegaron a usar
(probablemente se sustituyan por Firestore).

## Usuarios con Firebase

- `src/services/firebase/app.js`: conexión con Firebase; lee la configuración
  de las variables `VITE_FIREBASE_*` del `.env`.
- `src/services/firebase/auth.js`: `register`, `login`, `logout`,
  `resetPassword`, `onUserChange`.
- `src/services/firebase/users.js`: perfil en Firestore, colección `users`
  (un documento por usuario, con el mismo id que su cuenta).
- `firestore.rules`: cada usuario solo lee y edita su perfil y no puede
  cambiarse `role` ni `premium`. Se publican con
  `firebase deploy --only firestore:rules`.

Usuarios de prueba: `npm run seed:users` crea varias cuentas (Auth +
perfil). Las credenciales se guardan en `tools/seed/test-users.local.json`,
que no se sube al repositorio.

## Estadísticas reales de Riot Games

La vista de LoL intenta cargar `/data/champion-stats.json` al entrar. Si
existe, usa esos winrate/pickrate/banrate reales; si no existe, se queda con
los datos ilustrativos de siempre. **La web nunca se rompe por esto.**

`public/data/champion-stats.json` lo genera y actualiza solo el GitHub
Action `.github/workflows/update-riot-stats.yml` (cada 6 horas), ejecutando
`tools/fetch-riot-stats.mjs`. Para activarlo:

1. Consigue una clave en <https://developer.riotgames.com> (inicia sesión
   con tu cuenta de Riot). La "Development API Key" caduca cada 24h; para no
   tener que tocarla nunca, solicita una **Personal API Key** desde
   "REGISTER PRODUCT" en el mismo panel.
2. En GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**, nombre `RIOT_API_KEY`, pega tu clave.
3. Listo. El Action hace commit de `public/data/champion-stats.json` y
   `data/raw-stats.json.gz` si hay cambios, y Vercel redespliega solo.
4. Para forzar una ejecución manual: pestaña **Actions** del repo →
   "Actualizar estadísticas de Riot" → **Run workflow**.
5. Para probarlo en tu máquina:
   ```
   RIOT_API_KEY=RGAPI-tu-clave npm run stats:riot
   ```

**Qué son realmente estos datos:** una muestra de partidas clasificatorias
de EUW, no el 100% de las partidas del juego (eso requeriría una
"Production Key" de Riot). Es el mismo enfoque que usan la mayoría de sitios
de estadísticas no oficiales. Los campeones con poca muestra conservan el
dato ilustrativo hasta que el Action acumule suficientes partidas suyas.

### Builds y runas reales

Además de winrate/pickrate/banrate, el script calcula por campeón: objeto
inicial, botas, núcleo en el **orden real de compra** y objetos
situacionales, usando el *Timeline* de cada partida (se descuenta si el
jugador deshizo una compra). También calcula la combinación de runas más
usada. Los nombres se piden en español (`es_ES`) a Data Dragon.

Un campeón solo recibe build real si aparece en al menos 5 partidas de la
muestra; si no, conserva el build ilustrativo en esa parte concreta.

### Acumulación entre ejecuciones

El script no empieza de cero cada vez: guarda sus contadores en
`data/raw-stats.json.gz` (el Action lo sube junto a `champion-stats.json`)
y en cada ejecución suma las partidas nuevas. Cuando detecta un parche nuevo
(por el `gameVersion` de las partidas) reinicia el acumulado, porque mezclar
metas distintos daría estadísticas falsas.

Para forzar un reinicio manual, borra `data/raw-stats.json.gz` del repo y
vuelve a lanzar el workflow.

## Datos de ARC Raiders

`tools/build-arc-data.py` regenera `public/data/arc-raiders/*.json` y las
imágenes de `public/images/arc-raiders/` a partir del
[Proyecto de datos ARC](https://github.com/RaidTheory/arcraiders-data)
(licencia MIT). Instrucciones dentro del propio script.

## Despliegue en Vercel

`vercel.json` ya indica que es un proyecto Vite (`npm run build`, salida en
`dist/`), redirige las URLs antiguas (`/juegos`, `/index.html`,
`/privacidad.html`…) y envía el resto de rutas a la SPA.

- **Con GitHub:** cada `git push` a la rama principal redespliega solo.
- **Con la CLI:** `npm install -g vercel`, `vercel` (preview) y
  `vercel --prod` (producción).

Para un dominio propio: **Settings → Domains → Add** en el panel del
proyecto en Vercel.

## AdSense

El script de AdSense se carga una vez en `index.html` para todo el sitio.
Los bloques de anuncio están en `src/views/LolView.vue` (`data-ad-slot`).
