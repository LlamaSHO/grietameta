// Proxy con caché hacia la API de MetaForge (ARC Raiders) para /items.
// Los datos los mantiene MetaForge y su comunidad: https://metaforge.app/arc-raiders
// Se llama desde el navegador como /api/arc-items?page=1&limit=48&search=ferro

const UPSTREAM = 'https://metaforge.app/api/arc-raiders/items';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Solo se reenvían parámetros conocidos y saneados.
  const q = req.query || {};
  const params = new URLSearchParams();

  const page = parseInt(q.page, 10);
  params.set('page', String(Number.isFinite(page) && page > 0 ? Math.min(page, 1000) : 1));

  const limit = parseInt(q.limit, 10);
  params.set('limit', String(Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 48));

  if (typeof q.search === 'string' && q.search.trim()) {
    params.set('search', q.search.trim().slice(0, 60));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const upstream = await fetch(`${UPSTREAM}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: `MetaForge respondió ${upstream.status}` });
    }

    const json = await upstream.json();

    // Caché en el CDN de Vercel: 1 h fresca, hasta 1 día sirviendo versión antigua mientras se refresca.
    // Así se hacen muy pocas peticiones a MetaForge.
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(json);
  } catch (err) {
    const timeout = err && err.name === 'AbortError';
    return res.status(timeout ? 504 : 502).json({
      error: timeout ? 'MetaForge tardó demasiado en responder' : 'No se pudo contactar con MetaForge',
    });
  } finally {
    clearTimeout(timer);
  }
}
