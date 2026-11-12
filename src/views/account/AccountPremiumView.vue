<template>
  <!-- Mi Premium: suscripción, avisos, pago y ventajas. Diseño: models/paginas/MiPremium.dc.html -->
  <AccountShell title="Mi Premium" sub="Tu suscripción, tus avisos y tus pagos en un solo sitio." crumb="Premium">
    <!-- Solo en desarrollo: ver los estados del diseño sin tocar Stripe ni el perfil. -->
    <div v-if="IS_DEV" class="preview-bar" role="group" aria-label="Vista previa del estado (solo en desarrollo)">
      <span>Vista previa <small>(solo dev)</small>:</span>
      <button v-for="o in PREVIEW_OPTIONS" :key="o.id" type="button" class="pv" :class="{ on: preview === o.id }" :aria-pressed="preview === o.id" @click="setPreview(o.id)">
        {{ o.label }}
      </button>
    </div>
    <PmNotice v-if="preview" type="info">
      Estás viendo una vista previa con datos de ejemplo. Los botones simulan las acciones y no se guarda nada.
    </PmNotice>

    <SubscriptionCard :card="card" :busy="busy" @switch="onSwitch" @manage="onManage" @cancel="onCancel" @reactivate="onReactivate">
      <PmNotice v-if="actionMsg" :type="actionMsg.type" class="act-msg">{{ actionMsg.text }}</PmNotice>
    </SubscriptionCard>

    <AlertSettings :preview="!!preview" :note="alertsNote" />

    <!-- PAGO -->
    <section id="pago" class="pm-box pm-sec anchor">
      <div class="pm-sec-h">
        <div>
          <h2>Pago y facturas</h2>
          <p>El pago lo gestiona Stripe. GrietaMeta no guarda los datos de tu tarjeta.</p>
        </div>
      </div>
      <div class="pay">
        <div class="pcard">
          <span class="ic" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="6" y1="15" x2="10" y2="15" /></svg></span>
          <div>
            <span>Método de pago</span>
            <b>{{ payMethod.text }}<em v-if="payMethod.demo" class="pm-demo">ejemplo</em></b>
          </div>
        </div>
        <div class="pcard">
          <span class="ic" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg></span>
          <div>
            <span>Facturas</span>
            <b class="ellipsis">{{ sub.status === "none" ? "Aún no tienes facturas" : `Se envían a ${email}` }}</b>
          </div>
        </div>
      </div>
      <div class="pay-foot">
        <span>
          {{ sub.status === "none"
            ? "Cuando te suscribas, desde el portal de pago podrás cambiar la tarjeta y descargar tus facturas."
            : "Cambia la tarjeta o descarga tus facturas desde el portal de pago." }}
        </span>
        <button type="button" class="pm-btn" @click="openPortal">
          Abrir portal de pago
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6" /><line x1="20" y1="4" x2="11" y2="13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
        </button>
      </div>
      <PmNotice v-if="portalMsg" :type="portalMsg.type" class="act-msg">{{ portalMsg.text }}</PmNotice>
    </section>

    <!-- VENTAJAS -->
    <section id="ventajas" class="pm-box pm-sec anchor">
      <div class="pm-sec-h">
        <div>
          <h2>Tus ventajas</h2>
          <p>{{ sub.status === "none" ? "Lo que incluye Premium y aún no tienes." : "Todo lo que incluye tu Premium ahora mismo." }}</p>
        </div>
        <RouterLink :to="{ name: 'premium', hash: '#comparar' }">Ver la comparativa completa</RouterLink>
      </div>
      <div class="perks">
        <div v-for="p in PERKS" :key="p.name" class="perk">
          <span class="pi" aria-hidden="true" v-html="p.icon" />
          <b>{{ p.name }}</b>
          <span class="st" :class="{ off: perkOff }">{{ perkState }}</span>
        </div>
      </div>
    </section>
  </AccountShell>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import AccountShell from "@/components/account/AccountShell.vue";
import SubscriptionCard from "@/components/account/SubscriptionCard.vue";
import AlertSettings from "@/components/account/AlertSettings.vue";
import PmNotice from "@/components/premium/PmNotice.vue";
import { readSubscription } from "@/components/premium/subscription.js";
import { PLANS, TRIAL_DAYS, addDays, addMonths, shortDate, toDate } from "@/components/premium/plans.js";

const IS_DEV = import.meta.env.DEV;
const { state } = useAuth();
const route = useRoute();

const email = computed(() => state.user?.email || "tu email");

// ---- Vista previa de estados (solo dev; ?estado=activa|prueba|cancelada|sin) ----
const PREVIEW_OPTIONS = [
  { id: null, label: "Real" },
  { id: "activa", label: "Activa" },
  { id: "prueba", label: "Prueba" },
  { id: "cancelada", label: "Cancelada" },
  { id: "sin", label: "Sin Premium" },
];
const preview = ref(IS_DEV && PREVIEW_OPTIONS.some((o) => o.id && o.id === route.query.estado) ? route.query.estado : null);
const previewPlan = ref("yearly");
function setPreview(id) {
  preview.value = id;
  actionMsg.value = null;
  portalMsg.value = null;
}

// ---- Suscripción: la real del perfil o la simulada ----
const NOW = new Date();
const sub = computed(() => {
  if (!preview.value) return readSubscription(state.profile);
  const status = { activa: "active", prueba: "trialing", cancelada: "canceled", sin: "none" }[preview.value];
  // La prueba gratis solo existe con el plan mensual (api/create-checkout-session).
  const plan = status === "none" ? null : status === "trialing" ? "monthly" : previewPlan.value;
  return { status, plan, since: null, periodEnd: null, trialEnd: null, cardLast4: null, preview: true };
});

const card = computed(() => {
  const s = sub.value;

  if (s.status === "none") {
    const created = toDate(state.profile?.createdAt);
    return {
      status: "none",
      pillText: "Sin Premium",
      title: "Plan Gratis",
      statusLine: "Navegas con anuncios. Con Premium los quitas en LoL, ARC Raiders y Zelda y recibes avisos de cada parche.",
      priceBig: "0€",
      pricePer: "siempre",
      trial: null,
      stats: [
        { label: "Plan", value: "Gratis" },
        { label: "Cuenta creada", value: created ? shortDate(created) : "—" },
        { label: "Premium", value: `Desde ${PLANS.yearly.perMonth}/mes` },
      ],
    };
  }

  // Lo que no venga del perfil se rellena con fechas de ejemplo (marcadas en la tarjeta).
  const plan = PLANS[s.plan] || PLANS.monthly;
  const planDemo = !s.plan;
  const yearly = plan.id === "yearly";
  const trialEnd = s.trialEnd || (s.status === "trialing" ? addDays(NOW, TRIAL_DAYS - 2) : null);
  const since = s.since || (s.status === "trialing" ? addDays(trialEnd, -TRIAL_DAYS) : NOW);
  const periodEnd = s.periodEnd || (s.status === "trialing" ? trialEnd : addMonths(since, yearly ? 12 : 1));
  const demo = { since: !s.since, end: s.status === "trialing" ? !s.trialEnd && !s.periodEnd : !s.periodEnd };

  const price = plan.price;
  const end = shortDate(periodEnd);
  const trialing = s.status === "trialing";
  const canceled = s.status === "canceled";

  let trial = null;
  if (trialing) {
    const left = Math.max(0, Math.ceil((trialEnd - NOW) / 86400000));
    const day = Math.min(TRIAL_DAYS, Math.max(1, TRIAL_DAYS - left));
    trial = {
      day,
      total: TRIAL_DAYS,
      pct: (day / TRIAL_DAYS) * 100,
      leftText: left === 1 ? "Te queda 1 día" : `Te quedan ${left} días`,
      demo: !s.trialEnd,
    };
  }

  return {
    status: s.status,
    pillText: trialing ? "Prueba gratis" : canceled ? "Cancelada" : "Activa",
    title: plan.title,
    planDemo,
    statusLine: trialing
      ? `El ${end} se cobrarán ${price} si no cancelas antes.`
      : canceled
        ? `Sigues siendo Premium hasta el ${end}. Después volverás a ver anuncios.`
        : `Se renueva el ${end} por ${price}.`,
    statusDemo: demo.end,
    priceBig: price,
    pricePer: plan.per,
    trial,
    stats: [
      { label: "Plan", value: `${plan.name} · ${price}`, demo: planDemo },
      { label: trialing ? "Primer cobro" : canceled ? "Termina el" : "Próximo cobro", value: end, demo: demo.end },
      { label: "Premium desde", value: shortDate(since), demo: demo.since },
    ],
    switchText: yearly ? "Cambiar a mensual" : "Cambiar a anual (-33%)",
    confirmLine: trialing
      ? `No se te cobrará nada y Premium termina el ${end}.`
      : `Seguirás teniendo Premium hasta el ${end}. Después volverás a ver anuncios y se apagarán los avisos.`,
    end,
  };
});

const alertsNote = computed(() => {
  if (sub.value.status === "canceled") return `Los avisos se apagarán cuando termine tu Premium, el ${card.value.end}.`;
  if (sub.value.status === "none") return "Los avisos se envían solo con Premium. Puedes dejarlos elegidos desde ya.";
  return "";
});

const payMethod = computed(() => {
  if (sub.value.status === "none") return { text: "Ninguno todavía" };
  if (sub.value.cardLast4) return { text: `Tarjeta ···· ${sub.value.cardLast4}` };
  if (sub.value.preview) return { text: "Tarjeta ···· 4242", demo: true };
  return { text: "Guardado en Stripe" };
});

const perkOff = computed(() => sub.value.status === "canceled" || sub.value.status === "none");
const perkState = computed(() => {
  if (sub.value.status === "canceled") return `Hasta el ${card.value.end}`;
  if (sub.value.status === "none") return "No incluida";
  return "Activa";
});

// ---- Acciones de pago ----
// De momento son solo diseño: no llaman a Stripe ni a /api. Enseñan un aviso
// de "Próximamente" (en la vista previa de desarrollo simulan el cambio).
const busy = ref(""); // ninguna acción en curso: no hay llamadas
const actionMsg = ref(null); // { type, text } bajo la tarjeta
const portalMsg = ref(null); // { type, text } en Pago y facturas
const SOON = "Próximamente: la gestión del pago estará disponible pronto.";

function soon(target) {
  actionMsg.value = null;
  portalMsg.value = null;
  target.value = { type: "info", text: SOON };
}
const openPortal = () => soon(portalMsg);

function onSwitch() {
  if (preview.value) {
    // En prueba el plan es siempre el mensual: pasar al anual termina la prueba.
    const wasTrial = preview.value === "prueba";
    previewPlan.value = wasTrial || previewPlan.value === "monthly" ? "yearly" : "monthly";
    if (wasTrial) preview.value = "activa";
    actionMsg.value = {
      type: "ok",
      text: `Simulado: ahora tienes el plan ${PLANS[previewPlan.value].name.toLowerCase()}.${wasTrial ? " La prueba gratis es solo del mensual, así que termina." : ""}`,
    };
    return;
  }
  soon(actionMsg);
}
const onManage = () => soon(actionMsg);
function onCancel(done) {
  done?.();
  if (preview.value) {
    preview.value = "cancelada";
    actionMsg.value = { type: "ok", text: "Simulado: suscripción cancelada." };
    return;
  }
  soon(actionMsg);
}
function onReactivate() {
  if (preview.value) {
    preview.value = "activa";
    actionMsg.value = { type: "ok", text: "Simulado: Premium reactivado." };
    return;
  }
  soon(actionMsg);
}

const PERKS = [
  { name: "Sin anuncios", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="21" x2="21" y2="3"/></svg>' },
  { name: "Avisos por juego", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>' },
  { name: "Acceso anticipado", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3"/></svg>' },
  { name: "Insignia Premium", icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z"/></svg>' },
];
</script>

<style scoped>
.anchor {
  scroll-margin-top: 0; /* el hueco del nav lo pone scroll-padding-top (base.css) */
}
.act-msg {
  margin-top: 16px;
}

/* Vista previa (dev) */
.preview-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  font-size: 13px;
  color: var(--ink-mute);
}
.preview-bar small {
  font-size: 11.5px;
}
.pv {
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: none;
  color: #C6CBD2;
  font: 500 13px/1 var(--font-body);
  cursor: pointer;
}
.pv.on {
  border-color: rgba(232, 184, 101, 0.6);
  background: rgba(212, 160, 74, 0.1);
  color: var(--gm-gold);
}

/* ---------- pago ---------- */
.pay {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}
.pcard {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.pcard > div {
  min-width: 0;
}
.pcard .ic {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(212, 160, 74, 0.1);
  border: 1px solid rgba(212, 160, 74, 0.28);
  color: var(--gm-gold);
}
.pcard span {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.pcard b {
  display: block;
  margin-top: 2px;
  font-size: 15px;
  font-weight: 600;
}
.pcard em {
  font-style: normal;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pay-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 16px;
  font-size: 13.5px;
  color: var(--ink-mute);
}

/* ---------- ventajas ---------- */
.perks {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.perk {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.perk .pi {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(212, 160, 74, 0.1);
  color: var(--gm-gold);
}
.perk b {
  display: block;
  margin-top: 12px;
  font-size: 14.5px;
  font-weight: 600;
}
.perk .st {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 12.5px;
  color: #7FEBCB;
}
.perk .st.off {
  color: #FFB59C;
}

@media (max-width: 980px) {
  .perks {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 860px) {
  .pay {
    grid-template-columns: 1fr;
  }
  .pay-foot .pm-btn {
    flex: 1 1 100%;
  }
}
</style>
