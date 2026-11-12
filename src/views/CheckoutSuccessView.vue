<template>
  <!-- Pantalla tras pagar en Stripe. Diseño: models/paginas/PremiumExito.dc.html
       Stripe vuelve aquí con ?session_id=… (ver api/create-checkout-session.js). -->
  <div class="pm-page success-view">
    <div class="confetti" aria-hidden="true"><i v-for="n in 14" :key="n" /></div>

    <div class="wrap stage">
      <div class="halo-wrap" aria-hidden="true">
        <span class="halo" />
        <span class="rays"><i v-for="n in 8" :key="n" /></span>
        <span class="ring" />
        <span class="ring r2" />
        <GmMark :size="108" animated />
        <span class="okb">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7" /></svg>
        </span>
      </div>

      <div class="eyebrow">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>
        {{ trial ? "Prueba activada" : "Pago confirmado" }}
      </div>
      <h1 class="h1 pm-disp">
        {{ trial ? `Tus ${TRIAL_DAYS} días` : "¡Ya eres" }}<br>
        <span>{{ trial ? "sin anuncios empiezan ya" : "Premium!" }}</span>
      </h1>
      <p class="lead">
        {{ trial
          ? "Ya navegas sin anuncios en LoL, ARC Raiders y Zelda. No se te cobrará nada hasta que acabe la prueba y puedes cancelar cuando quieras."
          : "Tu suscripción está activa. Ya navegas sin anuncios en LoL, ARC Raiders y Zelda y puedes elegir tus avisos por juego." }}
      </p>

      <div class="sum">
        <div class="srow">
          <span>Plan</span>
          <b class="gold">{{ plan ? plan.title : "Premium" }}</b>
        </div>
        <div class="srow">
          <span>{{ trial ? "Primer cobro" : "Importe" }}</span>
          <b>{{ chargeText }}</b>
        </div>
        <div class="srow">
          <span>Cuenta</span>
          <b class="ellipsis">{{ accountText }}</b>
        </div>
        <div class="srow">
          <span>Referencia de pago</span>
          <code v-if="sessionId" :title="sessionId">{{ shortSession }}</code>
          <b v-else class="dim">—</b>
        </div>
      </div>

      <PmNotice v-if="syncNote" type="info" class="sync">{{ syncNote }}</PmNotice>

      <div class="cta">
        <RouterLink class="pm-btn-gold" :to="{ name: 'account-premium' }">
          Ir a Mi Premium
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
        </RouterLink>
        <RouterLink class="pm-btn-out" to="/">Volver a la portada</RouterLink>
      </div>

      <section class="next" aria-labelledby="next-h">
        <h2 id="next-h" class="pm-disp">¿Y ahora qué?</h2>
        <div class="steps">
          <RouterLink class="step" :to="{ name: 'account-premium', hash: '#alertas' }">
            <span class="n">01</span>
            <b>Elige tus avisos</b>
            <span>Dinos de qué juegos quieres enterarte cuando haya cambios.</span>
            <svg class="go" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
          </RouterLink>
          <div class="step">
            <span class="n">02</span>
            <b>Vuelve a tu juego</b>
            <span>Ya sin anuncios en todas las páginas.</span>
            <div class="games">
              <RouterLink to="/lol" aria-label="League of Legends"><img src="/images/games/logo-lol.png" alt=""></RouterLink>
              <RouterLink to="/arc-raiders" aria-label="ARC Raiders"><img src="/images/games/logo-arc.png" alt=""></RouterLink>
              <RouterLink to="/zelda" aria-label="Zelda: Tears of the Kingdom"><img src="/images/games/logo-zelda.png" alt=""></RouterLink>
            </div>
          </div>
          <RouterLink class="step" :to="{ name: 'account-premium' }">
            <span class="n">03</span>
            <b>Gestiona tu suscripción</b>
            <span>Cambia de plan, revisa tus facturas o cancela cuando quieras.</span>
            <svg class="go" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
          </RouterLink>
        </div>
        <p class="help">¿Algún problema con el pago? <RouterLink to="/contacto">Escríbenos</RouterLink> con tu referencia de pago.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth, whenAuthReady } from "@/composables/useAuth";
import GmMark from "@/components/brand/GmMark.vue";
import PmNotice from "@/components/premium/PmNotice.vue";
import { readSubscription } from "@/components/premium/subscription.js";
import { PLANS, TRIAL_DAYS, addDays, shortDate } from "@/components/premium/plans.js";
import "@/components/premium/premium-ui.css";

const route = useRoute();
const { state, isPremium, refreshProfile } = useAuth();

const sessionId = computed(() => String(route.query.session_id || ""));
const shortSession = computed(() => (sessionId.value.length > 20 ? `${sessionId.value.slice(0, 18)}…` : sessionId.value));

// Plan elegido: el que guardó /premium antes de ir a Stripe, o el del perfil.
let storedPlan = null;
try {
  storedPlan = sessionStorage.getItem("gm-checkout-plan");
} catch {
  /* sin sessionStorage */
}
const sub = computed(() => readSubscription(state.profile));
const plan = computed(() => PLANS[sub.value.plan] || PLANS[storedPlan] || null);

// ¿Prueba o pago? Si el perfil lo dice, eso; si no, la regla de
// api/create-checkout-session (la prueba de 7 días solo va con el mensual).
// Sin plan conocido no se anuncia ninguna prueba.
const trial = computed(() => {
  if (sub.value.status === "trialing") return true;
  if (sub.value.status === "active" || sub.value.status === "canceled") return false;
  return plan.value?.id === "monthly";
});

const chargeText = computed(() => {
  const price = plan.value ? `${plan.value.price} ${plan.value.per}` : "según tu plan";
  if (!trial.value) return price;
  const first = sub.value.trialEnd || addDays(new Date(), TRIAL_DAYS);
  return `${shortDate(first)} · ${price}`;
});

const accountText = computed(() => state.user?.email || "La del email con el que pagaste");

// Tras volver de Stripe el webhook puede tardar unos segundos en marcar
// "is-premium": se vuelve a leer el perfil un par de veces.
const syncNote = ref("");
let timer = null;
let alive = true;

async function syncProfile() {
  const loggedIn = await whenAuthReady();
  if (!alive) return;
  if (!loggedIn) {
    syncNote.value = "Inicia sesión con el email con el que pagaste para que tu cuenta quede como Premium.";
    return;
  }
  for (let i = 0; i < 4 && alive; i++) {
    await refreshProfile().catch(() => {});
    if (isPremium.value || !alive) break;
    if (i === 0) syncNote.value = "Estamos activando Premium en tu cuenta. Puede tardar unos segundos…";
    await new Promise((r) => (timer = setTimeout(r, 3000)));
  }
  if (!alive) return;
  syncNote.value = isPremium.value
    ? ""
    : "Tu pago está hecho, pero tu cuenta aún no aparece como Premium. Recarga en un rato; si sigue igual, escríbenos con tu referencia de pago.";
}

onMounted(() => {
  syncProfile();
});
onBeforeUnmount(() => {
  alive = false;
  clearTimeout(timer);
  try {
    sessionStorage.removeItem("gm-checkout-plan");
  } catch {
    /* sin sessionStorage */
  }
});
</script>

<style scoped>
.success-view {
  overflow: clip;
}

/* ---------- escena ---------- */
.stage {
  position: relative;
  padding-top: 56px;
  text-align: center;
}
.confetti {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 560px;
  pointer-events: none;
  overflow: hidden;
}
.confetti i {
  position: absolute;
  top: 0;
  width: 8px;
  height: 14px;
  border-radius: 2px;
  opacity: 0;
  animation: fall 4.2s cubic-bezier(0.3, 0.6, 0.6, 1) infinite;
}
.confetti i:nth-child(3n) { background: #F3C878; }
.confetti i:nth-child(3n + 1) { background: #FF6A3D; }
.confetti i:nth-child(3n + 2) { background: #4FE0B6; }
.confetti i:nth-child(1) { left: 18%; --dx: -30px; --rot: 300deg; animation-delay: 0.2s; }
.confetti i:nth-child(2) { left: 24%; --dx: 40px; --rot: -260deg; animation-delay: 1.4s; width: 6px; height: 10px; }
.confetti i:nth-child(3) { left: 31%; --dx: -20px; --rot: 420deg; animation-delay: 0.7s; }
.confetti i:nth-child(4) { left: 37%; --dx: 30px; --rot: -380deg; animation-delay: 2.1s; width: 10px; height: 6px; }
.confetti i:nth-child(5) { left: 43%; --dx: -40px; --rot: 280deg; animation-delay: 0.1s; }
.confetti i:nth-child(6) { left: 56%; --dx: 24px; --rot: -300deg; animation-delay: 1.1s; width: 6px; height: 12px; }
.confetti i:nth-child(7) { left: 62%; --dx: -26px; --rot: 360deg; animation-delay: 0.5s; }
.confetti i:nth-child(8) { left: 68%; --dx: 36px; --rot: -420deg; animation-delay: 1.8s; width: 10px; height: 6px; }
.confetti i:nth-child(9) { left: 74%; --dx: -34px; --rot: 310deg; animation-delay: 0.9s; }
.confetti i:nth-child(10) { left: 80%; --dx: 22px; --rot: -280deg; animation-delay: 2.6s; width: 6px; height: 10px; }
.confetti i:nth-child(11) { left: 13%; --dx: 20px; --rot: 400deg; animation-delay: 3s; }
.confetti i:nth-child(12) { left: 86%; --dx: -20px; --rot: -340deg; animation-delay: 0.4s; }
.confetti i:nth-child(13) { left: 48%; --dx: 44px; --rot: 260deg; animation-delay: 3.3s; width: 6px; height: 12px; }
.confetti i:nth-child(14) { left: 52%; --dx: -44px; --rot: -300deg; animation-delay: 2.3s; }

.halo-wrap {
  position: relative;
  width: 260px;
  height: 260px;
  margin: 0 auto;
  display: grid;
  place-items: center;
  animation: gm-rise 0.8s var(--ease-out) both;
}
.halo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(243, 200, 120, 0.24), rgba(255, 106, 61, 0.08) 45%, rgba(79, 224, 182, 0.06) 60%, transparent 70%);
  animation: breathe 4s ease-in-out infinite;
}
.ring {
  position: absolute;
  inset: 22px;
  border-radius: 50%;
  border: 1px dashed rgba(243, 200, 120, 0.35);
  animation: gm-spin 30s linear infinite;
}
.ring.r2 {
  inset: 46px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.07);
  animation: spin-r 22s linear infinite;
}
.rays {
  position: absolute;
  inset: 0;
  animation: gm-spin 40s linear infinite;
}
.rays i {
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 44px;
  margin-left: -1px;
  border-radius: 2px;
  background: linear-gradient(180deg, rgba(243, 200, 120, 0.9), transparent);
  transform-origin: 1px 130px;
  animation: ray 2.6s ease-in-out infinite;
}
.rays i:nth-child(2) { transform: rotate(45deg); animation-delay: 0.3s; }
.rays i:nth-child(3) { transform: rotate(90deg); animation-delay: 0.6s; }
.rays i:nth-child(4) { transform: rotate(135deg); animation-delay: 0.9s; }
.rays i:nth-child(5) { transform: rotate(180deg); animation-delay: 1.2s; }
.rays i:nth-child(6) { transform: rotate(225deg); animation-delay: 1.5s; }
.rays i:nth-child(7) { transform: rotate(270deg); animation-delay: 1.8s; }
.rays i:nth-child(8) { transform: rotate(315deg); animation-delay: 2.1s; }
.okb {
  position: absolute;
  right: 58px;
  bottom: 56px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--gm-teal);
  color: #062019;
  box-shadow: 0 0 0 6px var(--bg), 0 10px 30px -6px rgba(79, 224, 182, 0.8);
  animation: pop 0.6s 1.6s var(--ease-out) both;
}
.okb polyline {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: check 0.5s 2s ease forwards;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(79, 224, 182, 0.4);
  background: rgba(79, 224, 182, 0.08);
  color: #7FEBCB;
  font-size: 13px;
  font-weight: 600;
  animation: gm-rise 0.8s 0.2s var(--ease-out) both;
}
.h1 {
  margin: 18px 0 0;
  font-size: clamp(44px, 6vw, 76px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  animation: gm-rise 0.8s 0.3s var(--ease-out) both;
}
.h1 span {
  background: linear-gradient(90deg, #F3C878, #FF8A5F 50%, #4FE0B6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.lead {
  max-width: 600px;
  margin: 18px auto 0;
  color: var(--ink-dim);
  font-size: 17.5px;
  text-wrap: pretty;
  animation: gm-rise 0.8s 0.4s var(--ease-out) both;
}

/* ---------- resumen ---------- */
.sum {
  max-width: 640px;
  margin: 36px auto 0;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(255, 255, 255, 0.03);
  text-align: left;
  animation: gm-rise 0.8s 0.5s var(--ease-out) both;
}
.srow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 14.5px;
}
.srow:first-child {
  border-top: none;
}
.srow > span {
  flex-shrink: 0;
  color: var(--ink-dim);
}
.srow b {
  min-width: 0;
  font-weight: 600;
  text-align: right;
}
.srow b.gold {
  color: var(--gm-gold);
}
.srow b.dim {
  color: var(--ink-mute);
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.srow code {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font: 500 13px/1.3 "IBM Plex Mono", ui-monospace, monospace;
  color: #C6CBD2;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
}
.sync {
  max-width: 640px;
  margin: 16px auto 0;
}
.cta {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
  animation: gm-rise 0.8s 0.6s var(--ease-out) both;
}

/* ---------- siguientes pasos ---------- */
.next {
  margin-top: 72px;
}
.next h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
}
.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
  text-align: left;
}
.step {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
  color: var(--ink);
  text-decoration: none;
  transition: transform 0.35s var(--ease-out), border-color 0.3s, background 0.3s;
}
a.step:hover {
  color: var(--ink);
  transform: translateY(-4px);
  border-color: rgba(212, 160, 74, 0.45);
  background: rgba(212, 160, 74, 0.04);
}
.step .n {
  font: 700 13px/1 var(--font-brand);
  letter-spacing: 0.14em;
  color: var(--gold);
}
.step b {
  margin-top: 8px;
  font-size: 17px;
  font-weight: 700;
}
.step > span:not(.n) {
  color: var(--ink-dim);
  font-size: 14px;
}
.step .go {
  position: absolute;
  top: 22px;
  right: 22px;
  color: var(--ink-mute);
  transition: transform 0.3s, color 0.3s;
}
a.step:hover .go {
  transform: translateX(4px);
  color: var(--gm-gold);
}
.games {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.games a {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  transition: transform 0.25s, border-color 0.25s;
}
.games a:hover {
  transform: translateY(-3px);
  border-color: rgba(212, 160, 74, 0.55);
}
.games img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.help {
  margin: 28px 0 0;
  text-align: center;
  font-size: 13.5px;
  color: var(--ink-mute);
}
.help a {
  color: var(--gold);
}

@keyframes spin-r { to { transform: rotate(-360deg); } }
@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); }
}
@keyframes ray {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.75; }
}
@keyframes fall {
  0% { transform: translate3d(0, -40px, 0) rotate(0); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translate3d(var(--dx), 520px, 0) rotate(var(--rot)); opacity: 0; }
}
@keyframes breathe {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes check { to { stroke-dashoffset: 0; } }

@media (max-width: 860px) {
  .stage {
    padding-top: 36px;
  }
  .steps {
    grid-template-columns: 1fr;
  }
  .srow {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .srow b {
    max-width: 100%;
    text-align: left;
  }
  .lead {
    font-size: 16px;
  }
}
@media (max-width: 560px) {
  .cta a {
    flex: 1 1 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .confetti {
    display: none;
  }
  .okb polyline {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
