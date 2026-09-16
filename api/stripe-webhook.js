// /api/stripe-webhook.js
//
// Stripe llama a esta URL automáticamente cuando pasa algo con un pago:
// se completa una suscripción, se cancela, falla un cobro, etc.
//
// IMPORTANTE — esto es la base, no un sistema completo de cuentas:
// Ahora mismo GrietaMeta no tiene login de usuarios ni base de datos, así
// que este webhook solo confirma que el evento es legítimo y lo registra
// en los logs de Vercel. Para que un usuario real "se convierta en
// Premium" de forma persistente (y el muro premium se desbloquee para
// él en futuras visitas) hace falta añadir:
//   1) un sistema de cuentas/login (email + contraseña o magic link), y
//   2) una base de datos (ej. Vercel Postgres, Supabase, etc.) donde
//      guardar qué email tiene una suscripción activa.
// Ese es el siguiente paso lógico después de tener Stripe conectado.
//
// Variables de entorno necesarias:
//   STRIPE_SECRET_KEY         -> tu clave secreta
//   STRIPE_WEBHOOK_SECRET     -> la firma del webhook (whsec_...), la da
//                                 Stripe al crear el endpoint en su panel.

import Stripe from "stripe";

export const config = {
  api: { bodyParser: false }, // Stripe necesita el cuerpo "en crudo" para verificar la firma
};

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (chunk) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Método no permitido");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Firma de webhook inválida:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      // Aquí es donde, con una base de datos, marcaríamos como Premium
      // al email de session.customer_details.email
      console.log("Nueva suscripción completada para:", session.customer_details?.email);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      console.log("Suscripción cancelada:", sub.id);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log("Pago fallido para el cliente:", invoice.customer);
      break;
    }
    default:
      console.log("Evento de Stripe recibido sin manejar:", event.type);
  }

  return res.status(200).json({ received: true });
}
