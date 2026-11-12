<template>
  <!-- Planes Gratis / Premium. Diseño: models/paginas/Premium.dc.html -->
  <div class="pm-page premium-view">
    <!-- HERO + PLANES -->
    <section class="hero">
      <div class="hero-grid" aria-hidden="true" />
      <div class="pm-glow g1" aria-hidden="true" />
      <div class="pm-glow g2" aria-hidden="true" />

      <div class="wrap">
        <PremiumCrown class="hero-crown" :size="76" />

        <div class="eyebrow">
          <span class="eb-logos">
            <img src="/images/games/logo-lol.png" alt="">
            <img src="/images/games/logo-arc.png" alt="">
            <img src="/images/games/logo-zelda.png" alt="">
          </span>
          GrietaMeta Premium · una suscripción para los tres juegos
        </div>

        <h1 class="h1 pm-disp">
          Toda la meta,<br>
          <span class="gold">cero anuncios<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14 C 50 4, 120 4, 197 11" fill="none" stroke="#D4A04A" stroke-width="4" stroke-linecap="round" /></svg></span>
        </h1>

        <p class="lead">
          Las guías, tier lists y mapas siguen siendo gratis para todos. Premium quita la publicidad en LoL, ARC Raiders y
          Zelda y te avisa de los cambios antes que nadie.
        </p>

        <BillingToggle v-model="plan" class="hero-bill" />

        <div class="plans">
          <PlanCard
            name="Gratis"
            description="Para seguir la meta y tus guías."
            price="0€"
            per="siempre"
            sub="Sin tarjeta. Crea una cuenta si quieres guardar tus favoritos y tu progreso."
            :features="FREE_FEATURES"
          >
            <template #action>
              <RouterLink v-if="!isLoggedIn" class="pm-btn-out" :to="{ name: 'login', query: { modo: 'registro' } }">
                Crear cuenta gratis
              </RouterLink>
              <span v-else class="pm-btn-out static">{{ isPremium ? "Incluido en tu Premium" : "Es tu plan actual" }}</span>
            </template>
          </PlanCard>

          <PlanCard
            featured
            name="Premium"
            :ribbon="premiumRibbon"
            description="Para quien entra en cada parche."
            :price="current.perMonth"
            per="/mes"
            :sub="current.billLine"
            :sub-strong="current.saveLine"
            :fine="premiumFine"
            :features="PREMIUM_FEATURES"
          >
            <template #action>
              <CheckoutButton where="card" />
            </template>
            <template #after-action>
              <PmNotice v-if="error && errorAt === 'card'">{{ error }}</PmNotice>
            </template>
          </PlanCard>
        </div>

        <div class="trust">
          <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>Pago seguro con Stripe</span>
          <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 3 3 9 9 9" /></svg>Cancela cuando quieras, sin permanencia</span>
          <span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>Vale para los tres juegos</span>
        </div>
      </div>
    </section>

    <!-- VENTAJAS -->
    <section class="sec">
      <div class="wrap">
        <div class="pm-kicker">Qué ganas</div>
        <h2 class="h2 pm-disp">Lo mismo de siempre, sin ruido</h2>
        <p class="sec-lead">
          Premium no bloquea contenido: todo lo que ves ya es gratis. Pagas por navegar limpio, enterarte antes y ayudar a
          mantener los datos al día.
        </p>
        <div class="perks">
          <div class="perk">
            <div class="pico" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 15l2-6 2 6" /><path d="M7.7 13h2.6" /><path d="M14 9h1.5a3 3 0 0 1 0 6H14z" /><line class="strike" x1="2" y1="21" x2="22" y2="3" stroke="#FF8A5F" stroke-width="2.2" /></svg>
            </div>
            <h3>Sin anuncios</h3>
            <p>Ni banners ni huecos de publicidad en ninguna página, en los tres juegos.</p>
          </div>
          <div class="perk">
            <div class="pico" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g class="bell"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></g></svg>
            </div>
            <h3>Avisos antes que nadie</h3>
            <p>Te escribimos cuando cambia un parche o llega una actualización de tus juegos.</p>
          </div>
          <div class="perk">
            <div class="pico" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6" /><path d="M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" /><path d="M7 15h10" /><circle class="b1" cx="10" cy="13" r=".9" fill="currentColor" /><circle class="b2" cx="13.5" cy="13.5" r=".7" fill="currentColor" /><circle class="b3" cx="12" cy="12" r=".6" fill="currentColor" /></svg>
            </div>
            <h3>Acceso anticipado</h3>
            <p>Prueba las herramientas nuevas antes de que salgan para todo el mundo.</p>
          </div>
          <div class="perk">
            <div class="pico" aria-hidden="true">
              <span class="av"><b>{{ initials }}</b></span>
            </div>
            <h3>Insignia Premium</h3>
            <p>Tu avatar lleva el anillo dorado y la etiqueta Premium en el menú de tu cuenta.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMPARATIVA -->
    <section id="comparar" class="sec">
      <div class="wrap">
        <div class="pm-kicker">Comparativa</div>
        <h2 class="h2 pm-disp">Qué incluye cada plan</h2>
        <PlanCompare />
      </div>
    </section>

    <!-- PREGUNTAS -->
    <section class="sec">
      <div class="wrap faq-grid">
        <div>
          <div class="pm-kicker">Preguntas</div>
          <h2 class="h2 pm-disp">Antes de suscribirte</h2>
          <div class="help">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A04A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <span>¿No está tu duda? <RouterLink to="/contacto">Escríbenos</RouterLink> y te respondemos.</span>
          </div>
        </div>
        <FaqAccordion :items="FAQS" id-base="premium-faq" />
      </div>
    </section>

    <!-- LLAMADA FINAL -->
    <section class="wrap">
      <div class="cta">
        <div>
          <h2 class="pm-disp">{{ ctaTitle }}</h2>
          <p>Cada suscripción ayuda a mantener las estadísticas, los mapas y las guías al día.</p>
          <PmNotice v-if="error && errorAt === 'cta'" class="cta-notice">{{ error }}</PmNotice>
        </div>
        <CheckoutButton where="cta" label="Hazte Premium" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { createCheckoutSession } from "@/services/premium";
import BillingToggle from "@/components/premium/BillingToggle.vue";
import PlanCard from "@/components/premium/PlanCard.vue";
import PlanCompare from "@/components/premium/PlanCompare.vue";
import FaqAccordion from "@/components/premium/FaqAccordion.vue";
import PremiumCrown from "@/components/premium/PremiumCrown.vue";
import PmNotice from "@/components/premium/PmNotice.vue";
import { PLANS, TRIAL_DAYS } from "@/components/premium/plans.js";
import "@/components/premium/premium-ui.css";

const { state, isLoggedIn, isPremium, displayName } = useAuth();

// El diseño abre con el anual (Tweaks → pagoInicial). ?plan=mensual abre el
// mensual (p. ej. desde los enlaces "Probar 7 días gratis", la prueba solo va con él).
const route = useRoute();
const plan = ref(/^(mensual|monthly)$/i.test(String(route.query.plan || "")) ? "monthly" : "yearly");
const current = computed(() => PLANS[plan.value]);

const initials = computed(() => {
  const s = displayName.value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return s || "TU";
});

// La prueba gratis solo va con el plan mensual (api/create-checkout-session
// solo pone trial_period_days al mensual): los textos de prueba dependen del plan.
const hasTrial = computed(() => plan.value === "monthly");

const premiumRibbon = computed(() => {
  if (isPremium.value) return "Tu plan";
  return hasTrial.value ? `${TRIAL_DAYS} días gratis` : "Mejor precio";
});

const premiumFine = computed(() => {
  if (isPremium.value) return "Gestiona tu plan, tus avisos y tus facturas desde Mi Premium.";
  if (state.ready && !isLoggedIn.value) return "Primero inicia sesión: tu Premium va unido a tu cuenta.";
  return hasTrial.value
    ? "No se cobra nada hasta que acaba la prueba."
    : `Se cobra al empezar. La prueba de ${TRIAL_DAYS} días gratis es solo del plan mensual.`;
});

const ctaTitle = computed(() => {
  if (isPremium.value) return "Ya navegas sin anuncios";
  return hasTrial.value ? `¿Probamos ${TRIAL_DAYS} días sin anuncios?` : "¿Un año entero sin anuncios?";
});

const checkoutLabel = computed(() => (hasTrial.value ? `Empezar ${TRIAL_DAYS} días gratis` : "Hazte Premium anual"));

// ---- Pago ----
const busy = ref(false);
const error = ref("");
const errorAt = ref(""); // "card" | "cta": dónde se enseña el error

async function startCheckout(where) {
  if (busy.value) return;
  error.value = "";
  errorAt.value = where;
  busy.value = true;
  try {
    const url = await createCheckoutSession(plan.value);
    // /exito lee el plan elegido para el resumen (Stripe solo devuelve session_id).
    try {
      sessionStorage.setItem("gm-checkout-plan", plan.value);
    } catch {
      /* sin sessionStorage: /exito usa el plan del perfil */
    }
    window.location.assign(url);
  } catch (err) {
    error.value = checkoutErrorText(err);
    busy.value = false;
  }
}

// Mensaje en español para el aviso. Sin conexión, fetch lanza TypeError; si
// /api no existe (en local) la respuesta no es JSON y llega el error genérico.
function checkoutErrorText(err) {
  if (err instanceof TypeError) return "No hay conexión con el servidor de pagos. Revisa tu conexión e inténtalo de nuevo.";
  const base = err?.message && err.message !== "No se pudo iniciar el pago." ? err.message : "No se ha podido abrir el pago. Inténtalo de nuevo en unos minutos.";
  return import.meta.env.DEV
    ? `${base} (En local no existe el servidor de /api: el pago solo funciona en la web publicada o con «vercel dev».)`
    : base;
}

const ARROW = () =>
  h("svg", { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2.4, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, [
    h("line", { x1: 5, y1: 12, x2: 19, y2: 12 }),
    h("polyline", { points: "13 6 19 12 13 18" }),
  ]);

// Botón de Premium según la sesión: ya premium → Mi Premium; sin sesión →
// iniciar sesión y volver aquí; con sesión → Stripe Checkout.
const CheckoutButton = defineComponent({
  props: { where: { type: String, required: true }, label: { type: String, default: "" } },
  setup(p) {
    return () => {
      if (isPremium.value) {
        return h(RouterLink, { class: "pm-btn-gold", to: { name: "account-premium" } }, () => ["Ir a Mi Premium", ARROW()]);
      }
      if (state.ready && !isLoggedIn.value) {
        // Al volver del login se conserva el plan elegido (mensual o anual).
        const redirect = `/premium?plan=${plan.value === "monthly" ? "mensual" : "anual"}`;
        return h(RouterLink, { class: "pm-btn-gold", to: { name: "login", query: { redirect } } }, () => [
          p.label ? "Inicia sesión y hazte Premium" : "Inicia sesión para empezar",
          ARROW(),
        ]);
      }
      const loading = busy.value && errorAt.value === p.where;
      return h(
        "button",
        {
          type: "button",
          class: "pm-btn-gold shine",
          disabled: !state.ready || busy.value,
          "aria-busy": loading ? "true" : "false",
          onClick: () => startCheckout(p.where),
        },
        [loading ? "Abriendo el pago…" : p.label || checkoutLabel.value, ARROW()]
      );
    };
  },
});

const FREE_FEATURES = [
  { text: "Guías, tier lists y mapas de los tres juegos", included: true },
  { text: "Winrate, pickrate, banrate y builds completas de LoL", included: true },
  { text: "Favoritos y progreso guardados en tu cuenta", included: true },
  { text: "Con publicidad", included: false },
];

const PREMIUM_FEATURES = [
  { text: "Todo lo del plan Gratis", included: true },
  { text: "Sin anuncios en toda la web", included: true },
  { text: "Avisos de parche y actualizaciones, juego a juego", included: true },
  { text: "Acceso anticipado a herramientas nuevas", included: true },
  { text: "Insignia Premium en tu perfil", included: true },
];

const MI_PREMIUM = { text: "Mi Premium", to: { name: "account-premium" } };
const CONTACT = { text: "Contacto", to: "/contacto" };

const FAQS = [
  {
    q: `¿Qué pasa cuando acaban los ${TRIAL_DAYS} días de prueba?`,
    a: [
      `La prueba gratis es del plan mensual: al acabar se hace el primer cobro de ${PLANS.monthly.price} y sigue mes a mes. Si cancelas antes desde `,
      MI_PREMIUM,
      ", no se te cobra nada. El plan anual no lleva prueba: se cobra al empezar.",
    ],
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: ["Sí, en un clic desde ", MI_PREMIUM, ". Sigues siendo Premium hasta el final del periodo que ya pagaste y no hay permanencia."],
  },
  {
    q: "¿Una suscripción vale para los tres juegos?",
    a: ["Sí. Premium va con tu cuenta, no con un juego: quita los anuncios en LoL, ARC Raiders y Zelda, y en los juegos que añadamos después."],
  },
  {
    q: "¿Cómo se paga? ¿Es seguro?",
    a: ["Con tarjeta, a través de Stripe. El pago se hace en su página segura y GrietaMeta nunca ve ni guarda los datos de tu tarjeta."],
  },
  {
    q: "¿Puedo pasar de mensual a anual?",
    a: ["Sí, cuando quieras, desde ", MI_PREMIUM, ". También puedes volver al mensual."],
  },
  {
    q: "Ya he pagado y sigo viendo anuncios",
    a: ["Inicia sesión con el mismo email que usaste al pagar. Si sigue igual, escríbenos desde ", CONTACT, " con tu referencia de pago y lo revisamos."],
  },
];
</script>

<style scoped>
/* ---------- hero ---------- */
.hero {
  position: relative;
  padding: 72px 0 40px;
  text-align: center;
  isolation: isolate;
}
.hero-grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1.2px);
  background-size: 30px 30px;
  -webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 72%);
  mask-image: radial-gradient(ellipse 60% 70% at 50% 30%, #000 20%, transparent 72%);
}
.g1 {
  top: -200px;
  left: 12%;
  background: #B9832F;
  opacity: 0.36;
}
.g2 {
  top: -160px;
  right: 10%;
  background: #7A3A1E;
  opacity: 0.36;
  animation-duration: 19s;
  animation-direction: alternate-reverse;
}
.hero-crown {
  margin: 0 auto;
  animation: gm-rise 0.8s var(--ease-out) both;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.035);
  font-size: 13px;
  color: #C3C8CF;
  animation: gm-rise 0.8s 0.08s var(--ease-out) both;
}
.eb-logos {
  display: flex;
  flex-shrink: 0;
}
.eb-logos img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 50%;
  background: var(--bg-raised);
  border: 1.5px solid var(--bg);
  padding: 2px;
  margin-left: -6px;
}
.eb-logos img:first-child {
  margin-left: 0;
}
.h1 {
  margin: 22px 0 0;
  font-size: clamp(44px, 6.6vw, 88px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.04em;
  animation: gm-rise 0.9s 0.14s var(--ease-out) both;
}
.h1 .gold {
  position: relative;
  display: inline-block;
  color: var(--gold-hi);
}
.h1 .gold svg {
  position: absolute;
  left: -2%;
  bottom: -0.12em;
  width: 104%;
  height: 0.28em;
  overflow: visible;
}
.h1 .gold path {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: draw 1.1s 0.8s cubic-bezier(0.6, 0, 0.2, 1) forwards;
}
.lead {
  max-width: 620px;
  margin: 22px auto 0;
  font-size: 18px;
  color: var(--ink-dim);
  text-wrap: pretty;
  animation: gm-rise 0.9s 0.24s var(--ease-out) both;
}
.hero-bill {
  margin-top: 34px;
  animation: gm-rise 0.9s 0.3s var(--ease-out) both;
}

/* ---------- planes ---------- */
.plans {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  max-width: 940px;
  margin: 44px auto 0;
  text-align: left;
  align-items: stretch;
}
.trust {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin: 30px auto 0;
  color: var(--ink-dim);
  font-size: 13.5px;
}
.trust span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.trust svg {
  color: var(--gold);
}

/* ---------- secciones ---------- */
.sec {
  padding: 88px 0 0;
}
.h2 {
  margin: 10px 0 0;
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.sec-lead {
  max-width: 560px;
  margin: 12px 0 0;
  color: var(--ink-dim);
  font-size: 16px;
}

/* ---------- ventajas ---------- */
.perks {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-top: 36px;
}
.perk {
  position: relative;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
  transition: transform 0.35s var(--ease-out), border-color 0.3s, background 0.3s;
}
.perk:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 160, 74, 0.4);
  background: rgba(212, 160, 74, 0.04);
}
.perk h3 {
  margin: 18px 0 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.perk p {
  margin: 6px 0 0;
  color: var(--ink-dim);
  font-size: 14px;
}
.pico {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(212, 160, 74, 0.1);
  border: 1px solid rgba(212, 160, 74, 0.28);
  color: var(--gm-gold);
}
.pico .strike {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: strike 3s ease-in-out infinite alternate;
}
.pico .bell {
  transform-origin: 12px 3px;
  animation: ring 2.8s ease-in-out infinite;
}
.pico .b1 {
  animation: bub 2.2s ease-out infinite;
}
.pico .b2 {
  animation: bub 2.2s 0.7s ease-out infinite;
}
.pico .b3 {
  animation: bub 2.2s 1.4s ease-out infinite;
}
.av {
  position: relative;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
}
.av::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(#F3C878, #C8913A, #F3C878 50%, #8A6326, #F3C878);
  animation: gm-spin 4s linear infinite;
}
.av b {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #1B2230;
  color: var(--ink);
  font: 700 11px/1 var(--font-body);
}

/* ---------- preguntas ---------- */
.faq-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: 48px;
  align-items: start;
}
.help {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  font-size: 14px;
  color: var(--ink-dim);
}
.help svg {
  flex-shrink: 0;
}
.help a {
  font-weight: 600;
  color: var(--gold);
}

/* ---------- llamada final ---------- */
.cta {
  position: relative;
  overflow: hidden;
  margin-top: 96px;
  padding: 48px;
  border-radius: 28px;
  border: 1px solid rgba(212, 160, 74, 0.3);
  background:
    radial-gradient(80% 140% at 0% 0%, rgba(212, 160, 74, 0.18), transparent 60%),
    radial-gradient(70% 120% at 100% 100%, rgba(255, 106, 61, 0.12), transparent 60%),
    #0D0F14;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}
.cta h2 {
  margin: 0;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.cta p {
  margin: 10px 0 0;
  color: var(--ink-dim);
  font-size: 15.5px;
  max-width: 520px;
}
.cta .cta-notice {
  margin-top: 14px;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes ring {
  0%, 60%, 100% { transform: rotate(0); }
  8% { transform: rotate(16deg); }
  16% { transform: rotate(-14deg); }
  24% { transform: rotate(10deg); }
  32% { transform: rotate(-6deg); }
  40% { transform: rotate(3deg); }
}
@keyframes bub {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-16px); opacity: 0; }
}
@keyframes strike {
  0%, 25% { stroke-dashoffset: 30; }
  55%, 100% { stroke-dashoffset: 0; }
}

/* ---------- responsive ---------- */
@media (max-width: 1040px) {
  .perks {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
@media (max-width: 860px) {
  .plans {
    grid-template-columns: 1fr;
    max-width: 520px;
  }
  .hero {
    padding-top: 52px;
  }
  .lead {
    font-size: 16px;
  }
  .cta {
    padding: 32px 24px;
  }
}
@media (max-width: 640px) {
  .perks {
    gap: 10px;
  }
  .perk {
    padding: 16px;
  }
  .perk h3 {
    font-size: 15.5px;
  }
  .perk p {
    font-size: 13px;
  }
  .sec {
    padding-top: 64px;
  }
  .cta .pm-btn-gold {
    width: 100%;
  }
}
@media (max-width: 560px) {
  .eyebrow {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .h1 .gold path,
  .pico .strike {
    animation: none;
    stroke-dashoffset: 0;
  }
  .pico .bell,
  .pico .b1,
  .pico .b2,
  .pico .b3,
  .av::before {
    animation: none;
  }
}
</style>
