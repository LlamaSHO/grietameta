/* Lee la suscripción del perfil users/{uid}.

   Hoy el perfil solo garantiza "is-premium": una lista con al menos un
   elemento si el usuario es Premium (ver services/userStatus.js). Lo que haya
   dentro lo escribirá el webhook de Stripe; esta función entiende dos formas:

     "is-premium": ["yearly"]                       (solo el plan)
     "is-premium": [{                               (forma completa, recomendada)
        id: "sub_…", plan: "monthly" | "yearly",
        status: "active" | "trialing" | "canceled",
        cancelAtPeriodEnd: false,
        since, currentPeriodEnd, trialEnd,          (Timestamp, segundos o ISO)
        cardLast4: "4242"
     }]

   Lo que no venga se devuelve como null y la vista lo marca como ejemplo. */

import { isPremiumProfile } from "@/services/userStatus";
import { toDate } from "./plans.js";

function planFrom(value) {
  const s = String(value || "").toLowerCase();
  if (/year|anual|annual/.test(s)) return "yearly";
  if (/month|mensual/.test(s)) return "monthly";
  return null;
}

export function readSubscription(profile) {
  if (!isPremiumProfile(profile)) {
    return { status: "none", plan: null, since: null, periodEnd: null, trialEnd: null, cardLast4: null };
  }
  const entry = profile["is-premium"][0];

  if (!entry || typeof entry !== "object") {
    return { status: "active", plan: planFrom(entry), since: null, periodEnd: null, trialEnd: null, cardLast4: null };
  }

  const rawStatus = String(entry.status || "").toLowerCase();
  let status = "active";
  if (rawStatus === "trialing") status = "trialing";
  if (rawStatus === "canceled" || entry.cancelAtPeriodEnd || entry.cancel_at_period_end) status = "canceled";

  return {
    status,
    plan: planFrom(entry.plan || entry.interval || entry.price),
    since: toDate(entry.since || entry.startedAt || entry.start || entry.createdAt),
    periodEnd: toDate(entry.currentPeriodEnd || entry.current_period_end || entry.renewsAt || entry.endsAt),
    trialEnd: toDate(entry.trialEnd || entry.trial_end),
    cardLast4: entry.cardLast4 || entry.last4 || null,
  };
}
