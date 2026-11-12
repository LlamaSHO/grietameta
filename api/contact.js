// /api/contact.js
//
// Función serverless de Vercel. Recibe el formulario de /contacto, lo valida
// y manda el email con Resend (https://resend.com) usando su API REST con
// fetch, sin dependencias. Si el usuario tiene sesión y marca «enviarme una
// copia», le llega también una copia a su email (ver verifiedEmail).
//
// Protección básica contra spam:
//   - Campo trampa "website" (oculto en la web): si viene relleno es un bot.
//   - Tiempo mínimo para rellenar el formulario (elapsedMs).
//   - Límite de envíos por IP (en memoria: vale por instancia de la función,
//     no es global; para algo más serio, usar @vercel/kv o Cloudflare Turnstile).
//
// Variables de entorno necesarias en Vercel (Settings → Environment Variables):
//   RESEND_API_KEY  -> clave de la API de Resend (re_...)
//   CONTACT_TO      -> a quién llegan los mensajes (por defecto ekainarlla@gmail.com)
//   CONTACT_FROM    -> remitente, de un dominio verificado en Resend,
//                      ej. "GrietaMeta <contacto@tudominio.com>".
//                      Sin dominio verificado solo vale "onboarding@resend.dev",
//                      que únicamente entrega al email de la cuenta de Resend
//                      (las copias a los usuarios no llegarían).

const REASONS = {
  falta: "Falta algo",
  juego: "Añadir un juego",
  error: "Hay un error",
  ayuda: "Necesito ayuda",
  otro: "Otra cosa",
};
const GAMES = {
  lol: "League of Legends",
  arc: "ARC Raiders",
  zelda: "Zelda TotK",
  web: "La web en general",
};

// Más estricta que la del cliente: el email va en reply_to y, con «enviarme
// una copia», en to. No se aceptan comas, ;, <>, comillas ni espacios, que
// permitirían colar varios destinatarios o un nombre visible falso.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;
const MIN_FILL_MS = 2500;

// Límite: 5 envíos cada 10 minutos por IP.
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Limpieza para que el mapa no crezca sin fin.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return false;
}

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneLine = (s) => s.replace(/[\r\n]+/g, " ");
const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// La copia solo se manda a usuarios con sesión y a su propio email (si no,
// cualquiera podría hacer que GrietaMeta enviase un texto suyo a cualquier
// dirección). El token de Firebase se comprueba con la API REST de Firebase
// Auth, sin dependencias. Necesita la clave web de Firebase en Vercel
// (FIREBASE_API_KEY o la misma VITE_FIREBASE_API_KEY del cliente).
async function verifiedEmail(idToken) {
  const key = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  if (typeof idToken !== "string" || !idToken || idToken.length > 4096 || !key) return null;
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!res.ok) return null;
    const user = (await res.json())?.users?.[0];
    return user?.email ? String(user.email).toLowerCase() : null;
  } catch {
    return null;
  }
}

async function sendEmail(payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend respondió ${res.status}: ${detail}`);
  }
  return res.json().catch(() => ({}));
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  let body = req.body || {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Datos no válidos." });
    }
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Datos no válidos." });
  }

  // Bots: se responde como si todo fuera bien, pero no se envía nada. La web
  // siempre manda elapsedMs; si falta o es demasiado bajo, no es una persona.
  const elapsed = Number(body.elapsedMs);
  if (clean(body.website, 200) || !(elapsed >= MIN_FILL_MS)) {
    return res.status(200).json({ ok: true, copySent: false });
  }

  const reason = REASONS[body.reason] ? body.reason : "";
  const name = oneLine(clean(body.name, 80));
  const email = clean(body.email, 254);
  const game = GAMES[body.game] ? body.game : "";
  const gameName = oneLine(clean(body.gameName, 80));
  const message = clean(body.message, MAX_MESSAGE + 1);
  const wantsCopy = body.copy === true;

  if (!reason) return res.status(400).json({ error: "Elige sobre qué nos escribes." });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Revisa tu email, no parece válido." });
  if (message.length < MIN_MESSAGE) {
    return res.status(400).json({ error: `Escribe un mensaje de al menos ${MIN_MESSAGE} caracteres.` });
  }
  if (message.length > MAX_MESSAGE) {
    return res.status(400).json({ error: `El mensaje no puede pasar de ${MAX_MESSAGE} caracteres.` });
  }

  // En Vercel, x-real-ip lo pone la plataforma (el cliente no lo puede falsear).
  const ip = String(req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "desconocida")
    .split(",")[0]
    .trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Has enviado muchos mensajes seguidos. Espera unos minutos y vuelve a probar." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("Falta RESEND_API_KEY en las variables de entorno de Vercel.");
    return res.status(500).json({ error: "El envío por email no está configurado todavía." });
  }

  const to = process.env.CONTACT_TO || "ekainarlla@gmail.com";
  const from = process.env.CONTACT_FROM || "GrietaMeta <onboarding@resend.dev>";

  const extra = reason === "juego" ? (gameName ? `: ${gameName}` : "") : game ? ` · ${GAMES[game]}` : "";
  const subject = `[GrietaMeta] ${REASONS[reason]}${extra}`;

  const details = [
    ["Motivo", REASONS[reason]],
    reason === "juego" ? ["Juego pedido", gameName || "—"] : ["Juego", game ? GAMES[game] : "—"],
    ["Nombre", name || "—"],
    ["Email", email],
  ];
  const text = `${message}\n\n—\n${details.map(([k, v]) => `${k}: ${v}`).join("\n")}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1b1b1b">
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      <hr style="border:none;border-top:1px solid #ddd">
      <table style="font-size:13px;color:#555">
        ${details.map(([k, v]) => `<tr><td style="padding-right:12px"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}
      </table>
    </div>`;

  try {
    await sendEmail({ from, to: [to], reply_to: email, subject, text, html });
  } catch (err) {
    console.error("Error enviando el mensaje de contacto:", err);
    return res.status(502).json({ error: "No se pudo enviar el mensaje. Inténtalo de nuevo." });
  }

  // La copia es opcional: si falla, el mensaje principal ya ha llegado.
  let copySent = false;
  if (wantsCopy && (await verifiedEmail(body.idToken)) === email.toLowerCase()) {
    try {
      await sendEmail({
        from,
        to: [email],
        reply_to: to,
        subject: `Copia de tu mensaje: ${subject}`,
        text: `Hola${name ? ` ${name}` : ""}, esta es una copia del mensaje que nos has enviado. Te responderemos en cuanto podamos.\n\n${text}`,
        html: `<p style="font-family:system-ui,sans-serif;font-size:15px">Hola${name ? ` ${escapeHtml(name)}` : ""}, esta es una copia del mensaje que nos has enviado. Te responderemos en cuanto podamos.</p>${html}`,
      });
      copySent = true;
    } catch (err) {
      console.error("No se pudo enviar la copia al usuario:", err);
    }
  }

  return res.status(200).json({ ok: true, copySent });
}
