/* Premium (Stripe). El navegador no habla con Stripe directamente: llama a
   las funciones serverless de /api (Vercel), que son las que guardan las
   claves secretas. */

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

// Crea una sesión de Stripe Checkout y devuelve la URL de pago.
export async function createCheckoutSession(plan) {
  const { ok, data } = await postJson("/api/create-checkout-session", { plan });
  if (!ok || !data.url) throw new Error(data.error || "No se pudo iniciar el pago.");
  return data.url;
}

// { premium: boolean, plan: string|null }
export async function checkPremium(email) {
  const { ok, data } = await postJson("/api/check-premium", { email });
  if (!ok) throw new Error(data.error || "No se pudo comprobar el estado premium.");
  return data;
}
