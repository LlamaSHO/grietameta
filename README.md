# GrietaMeta

Sitio estático (un único `index.html` autocontenido: HTML + CSS + JS) con
tier list, builds y winrates de campeones de League of Legends. Preparado
para desplegarse en Vercel sin build ni dependencias.

## Estructura

```
grietameta-vercel/
├── index.html     # el sitio completo
├── vercel.json     # configuración de despliegue (headers, URLs limpias)
└── README.md
```

No hay proceso de build para el sitio: es HTML estático puro, así que Vercel
lo sirve directamente. El `package.json` solo existe para las funciones
serverless de `/api` y para el script de estadísticas de Riot.

## Estadísticas reales de Riot Games

`index.html` intenta cargar `champion-stats.json` al entrar. Si existe, usa
esos winrate/pickrate/banrate reales (calculados a partir de partidas de
Elo alto de EUW); si no existe, se queda con los datos ilustrativos de
siempre. **La web nunca se rompe por esto.**

`champion-stats.json` lo genera y actualiza solo el GitHub Action
`.github/workflows/update-riot-stats.yml`, cada noche, ejecutando
`scripts/fetch-riot-stats.mjs`. Para activarlo:

1. Consigue una clave en <https://developer.riotgames.com> (inicia sesión
   con tu cuenta de Riot). La clave de "Development API Key" de la propia
   página caduca cada 24h — vale para probar en local, pero para que el
   GitHub Action funcione solo hace falta pegarla una vez como secreto (ver
   paso 2); si quieres que no haga falta tocarla nunca, puedes solicitar una
   **Personal API Key** desde "REGISTER PRODUCT" en el mismo panel (no
   caduca, aprobación normalmente rápida).
2. En GitHub: **Settings → Secrets and variables → Actions → New repository
   secret**, nombre `RIOT_API_KEY`, pega tu clave.
3. Listo. El Action corre solo cada noche (cron `17 3 * * *`, hora UTC) y
   hace commit de `champion-stats.json` si hay cambios. Vercel redespliega
   automáticamente con cada commit.
4. Para forzar una ejecución manual: pestaña **Actions** del repo →
   "Actualizar estadísticas de Riot" → **Run workflow**.
5. Para probarlo en tu máquina antes de automatizarlo:
   ```
   RIOT_API_KEY=RGAPI-tu-clave node scripts/fetch-riot-stats.mjs
   ```

**Qué son realmente estos datos:** una muestra de partidas clasificatorias
de jugadores Challenger/Grandmaster/Master de EUW, no el 100% de las
partidas del juego (eso requeriría una "Production Key" de Riot, con
aprobación previa). Es el mismo enfoque que usan la mayoría de sitios de
estadísticas no oficiales. Los campeones con poca muestra conservan el dato
ilustrativo hasta que el Action acumule suficientes partidas suyas.

### Builds y runas reales

Además de winrate/pickrate/banrate, el script también calcula por campeón:
objeto inicial, botas, núcleo en el **orden real de compra** y objetos
situacionales, usando el *Timeline* de cada partida (eventos de compra con
marca de tiempo — se descuenta automáticamente si el jugador deshizo una
compra por error de click). También calcula la combinación de runas
(keystone + árbol principal + árbol secundario) más usada. Los nombres de
objetos y runas se piden en español (`es_ES`) a Data Dragon, para encajar
con el resto del sitio.

Esto añade una petición extra a Riot por cada partida analizada (el
Timeline es un endpoint aparte), así que el script tarda aproximadamente
**el doble** que si solo calculara winrate/pickrate/banrate — con los
valores por defecto, cuenta unos 20-25 minutos en vez de ~11.

Un campeón solo recibe build real si aparece en al menos 5 partidas de la
muestra; si no, conserva el build ilustrativo de siempre en esa parte
concreta (puede pasar que tenga winrate real pero build ilustrativo, o
build real pero falte alguna categoría puntual como "situacionales" si no
hubo suficientes compras variadas). Los objetos y la runa principal
muestran su icono real (vía Data Dragon) en cuanto hay dato real; mientras
tanto se ve la cajita de color de siempre, sin icono.

### Acumulación entre ejecuciones (no se recalcula de cero cada noche)

El script no empieza de cero cada vez: guarda un archivo interno,
`riot-stats-state.json` (en la raíz del repo, junto a `champion-stats.json`
— **debe subirse igual que él**, el Action ya lo hace solo), con las
partidas ya contabilizadas. Cada noche suma las partidas nuevas que
encuentra a ese acumulado, así la muestra por campeón crece noche a noche
dentro del mismo parche — cuantas más noches pasen, más fiables son los
números.

En cuanto el script detecta (mirando el `gameVersion` real de las partidas)
que ha salido un parche nuevo, reinicia el acumulado automáticamente:
mezclar partidas de metas distintos daría estadísticas falsas. Así que es
normal ver que la muestra "se resetea" a un número bajo justo después de
cada parche, y que vaya subiendo cada noche hasta el siguiente.

Si alguna vez quieres forzar un reinicio manual (por ejemplo, si crees que
el acumulado se ha corrompido), simplemente borra `riot-stats-state.json`
del repo y vuelve a lanzar el workflow — empezará de cero sin que tengas
que tocar nada más.

## Opción A — Desplegar con la web de Vercel (sin terminal)

1. Sube esta carpeta a un repositorio de GitHub (crea uno nuevo, arrastra
   estos 3 archivos y haz commit).
2. Entra en https://vercel.com y accede con tu cuenta de GitHub.
3. Pulsa **Add New → Project**, elige el repositorio que acabas de crear.
4. Framework Preset: **Other** (o "Static"). No hace falta tocar el Build
   Command ni el Output Directory — déjalos vacíos.
5. Pulsa **Deploy**. En menos de un minuto tendrás una URL tipo
   `grietameta.vercel.app`.

## Opción B — Desplegar con la CLI de Vercel (más rápido)

```bash
npm install -g vercel
cd grietameta-vercel
vercel login
vercel        # despliegue de prueba (preview)
vercel --prod # despliegue definitivo a producción
```

La CLI detecta que es un sitio estático automáticamente; no pide más
configuración.

## Conectar un dominio propio

En el panel del proyecto en Vercel: **Settings → Domains → Add**, escribe
tu dominio (ej. `grietameta.com`) y sigue las instrucciones para apuntar
los DNS (Vercel te da los registros A / CNAME exactos). Esto es lo que
necesitarás como "dominio real" para que Google AdSense apruebe el sitio.

## Antes de pedir la revisión de AdSense

- [ ] Sustituir `ca-pub-0000000000000000` (5 apariciones en `index.html`)
      por tu Publisher ID real de AdSense.
- [ ] Sustituir los `data-ad-slot` (`0000000000`, `0000000001`,
      `0000000002`) por los IDs de tus bloques de anuncio reales.
- [ ] Tener el dominio ya desplegado y accesible públicamente (no vale
      una URL de preview que caduque).
- [ ] Añadir una página de política de privacidad (AdSense la exige).

## Actualizar el sitio tras el primer despliegue

Cualquier cambio en `index.html` se publica solo con:

```bash
vercel --prod
```

o, si lo conectaste a GitHub, simplemente haciendo `git push` — Vercel
vuelve a desplegar automáticamente en cada commit a la rama principal.
