// /api/check-premium.js
//
// Comprueba si un email está marcado como Premium en la base de datos
// (Vercel KV). El webhook de Stripe (stripe-webhook.js) es quien escribe
// ahí cuando alguien paga o cancela.
//
// Variables de entorno necesarias (Vercel las añade solas al crear una
// base de datos KV y conectarla a este proyecto):
//   KV_REST_API_URL
//   KV_REST_API_TOKEN

import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Falta el email." });
    }

    const key = `premium:${email.trim().toLowerCase()}`;
    const record = await kv.get(key);

    return res.status(200).json({
      premium: Boolean(record),
      plan: record?.plan || null,
    });
  } catch (err) {
    console.error("Error comprobando premium:", err);
    return res.status(500).json({ error: "No se pudo comprobar el estado premium." });
  }
}
