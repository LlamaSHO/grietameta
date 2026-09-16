// /api/create-checkout-session.js
//
// Función serverless de Vercel. Recibe qué plan quiere el usuario
// ("monthly" o "yearly") y crea una sesión de Stripe Checkout: una página
// de pago alojada por Stripe (no tenemos que construir ni asegurar nuestro
// propio formulario de tarjeta).
//
// Variables de entorno necesarias en Vercel (Settings → Environment Variables):
//   STRIPE_SECRET_KEY        -> tu clave secreta (sk_test_... o sk_live_...)
//   STRIPE_PRICE_MONTHLY     -> el Price ID del plan mensual (price_...)
//   STRIPE_PRICE_YEARLY      -> el Price ID del plan anual (price_...)
//   SITE_URL                 -> ej. https://grietameta.vercel.app (sin barra final)

import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: "Falta STRIPE_SECRET_KEY en las variables de entorno de Vercel.",
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { plan } = req.body || {};

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY
        : process.env.STRIPE_PRICE_MONTHLY;

    if (!priceId) {
      return res.status(400).json({
        error: `Falta el Price ID para el plan "${plan}". Revisa STRIPE_PRICE_MONTHLY / STRIPE_PRICE_YEARLY en Vercel.`,
      });
    }

    const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: plan === "yearly" ? undefined : 7,
      },
      success_url: `${siteUrl}/exito.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/index.html#premium`,
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creando la sesión de Stripe:", err);
    return res.status(500).json({ error: "No se pudo iniciar el pago. Inténtalo de nuevo." });
  }
}
