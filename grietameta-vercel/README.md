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

No hay `package.json` ni proceso de build: es HTML estático puro, así que
Vercel lo sirve directamente.

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
