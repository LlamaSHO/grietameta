/* Envío del formulario de contacto a la función /api/contact (Vercel).
   En local (vite dev) no existe /api: la petición falla o no devuelve JSON y
   la vista ofrece abrir el correo con mailto: como alternativa. */

export const CONTACT_EMAIL = "ekainarlla@gmail.com";

// Error con el código HTTP (0 si no hubo respuesta) y si merece la pena
// ofrecer el mailto (fallo de red o del servidor, no un dato mal escrito).
export class ContactError extends Error {
  constructor(message, { status = 0, fallback = true } = {}) {
    super(message);
    this.name = "ContactError";
    this.status = status;
    this.fallback = fallback;
  }
}

/**
 * @param {{ reason: string, name?: string, email: string, game?: string,
 *           message: string, copy?: boolean, website?: string, elapsedMs?: number }} data
 *   (si copy es true se añade el idToken de la sesión, si la hay)
 * @returns {Promise<{ ok: true, copySent: boolean }>}
 */
export async function sendContactMessage(data) {
  // Con «enviarme una copia» va el token de sesión: el servidor solo manda la
  // copia si el email del formulario es el de la cuenta.
  const idToken = data.copy ? await currentIdToken() : null;
  let res;
  try {
    res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(idToken ? { ...data, idToken } : data),
    });
  } catch {
    throw new ContactError("No hay conexión con el servidor.");
  }

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (res.ok && body?.ok) return { ok: true, copySent: !!body.copySent };

  // 400 con mensaje propio = algún campo no es válido: se enseña tal cual.
  if (res.status === 400 && body?.error) {
    throw new ContactError(body.error, { status: 400, fallback: false });
  }
  if (res.status === 429) {
    throw new ContactError(body?.error || "Has enviado muchos mensajes seguidos. Espera unos minutos.", { status: 429 });
  }
  throw new ContactError(body?.error || "No se pudo enviar el mensaje.", { status: res.status });
}

async function currentIdToken() {
  try {
    const { auth } = await import("./firebase/auth.js");
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  } catch {
    return null;
  }
}

// Enlace mailto: con el asunto y el cuerpo ya escritos (alternativa al envío).
export function buildMailto({ subject, message, name, email }) {
  const lines = [message, "", "—"];
  if (name) lines.push(`Nombre: ${name}`);
  if (email) lines.push(`Email: ${email}`);
  const body = lines.join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
