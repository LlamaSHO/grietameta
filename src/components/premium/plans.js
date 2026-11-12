/* Precios y textos de los planes Premium (models/paginas/Premium.dc.html).
   Los importes deben coincidir con los precios creados en Stripe
   (STRIPE_PRICE_MONTHLY y STRIPE_PRICE_YEARLY de api/create-checkout-session). */

export const TRIAL_DAYS = 7;

export const PLANS = {
  monthly: {
    id: "monthly",
    name: "Mensual",
    title: "Premium Mensual",
    price: "4,99€",
    per: "al mes",
    perMonth: "4,99€", // lo que se ve en grande en la tarjeta (/mes)
    billLine: "Se cobra cada mes. Cancela cuando quieras.",
    saveLine: "",
  },
  yearly: {
    id: "yearly",
    name: "Anual",
    title: "Premium Anual",
    price: "39,99€",
    per: "al año",
    perMonth: "3,33€",
    billLine: "Un pago de 39,99€ al año.",
    saveLine: "Ahorras 19,89€ frente al mensual.",
  },
};

export const planInfo = (id) => PLANS[id] || null;

// Fecha corta en español: "4 nov 2026".
export function shortDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" })
    .format(date)
    .replace(/\./g, "");
}

// Convierte lo que venga de Firestore o Stripe en Date: Timestamp, segundos, milisegundos o texto ISO.
export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  if (typeof value === "number") return new Date(value < 1e12 ? value * 1000 : value);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
