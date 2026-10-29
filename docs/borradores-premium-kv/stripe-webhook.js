// /api/stripe-webhook.js
//
// Stripe llama a esta URL automáticamente cuando pasa algo con un pago:
// se completa una suscripción, se cancela, falla un cobro, etc.
// Aquí es donde guardamos en la base de datos (Vercel KV) qué email tiene
// una suscripción Premium activa, para que check-premium.js pueda
// consultarlo después.
//
// Variables de entorno necesarias:
//   STRIPE_SECRET_KEY         -> tu clave secreta
//   STRIPE_WEBHOOK_SECRET     -> la firma del webhook (whsec_...)
//   KV_REST_API_URL / KV_REST_API_TOKEN -> las añade Vercel solo al
//                                           conectar una base de datos KV

import Stripe from "stripe";
import { kv } from "@vercel/kv";

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
      const email = session.customer_details?.email;
      if (email) {
        const key = `premium:${email.trim().toLowerCase()}`;
        await kv.set(key, {
          plan: session.mode === "subscription" ? "subscription" : "one_time",
          customerId: session.customer,
          subscriptionId: session.subscription || null,
          since: new Date().toISOString(),
        });
        console.log("Marcado como Premium:", email);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      // Buscamos el email del cliente para poder borrar su acceso.
      try {
        const customer = await stripe.customers.retrieve(sub.customer);
        const email = customer?.email;
        if (email) {
          const key = `premium:${email.trim().toLowerCase()}`;
          await kv.del(key);
          console.log("Premium retirado (suscripción cancelada):", email);
        }
      } catch (e) {
        console.error("No se pudo recuperar el email del cliente cancelado:", e);
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log("Pago fallido para el cliente:", invoice.customer);
      // No retiramos el acceso automáticamente en el primer fallo: Stripe
      // suele reintentar el cobro varios días. Si tras los reintentos la
      // suscripción se cancela de verdad, llegará el evento
      // customer.subscription.deleted de arriba y ahí sí se retira.
      break;
    }
    default:
      console.log("Evento de Stripe recibido sin manejar:", event.type);
  }

  return res.status(200).json({ received: true });
}
