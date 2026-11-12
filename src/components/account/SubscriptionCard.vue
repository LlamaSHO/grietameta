<template>
  <!-- Tarjeta de la suscripción (.sw / .sub-card de MiPremium.dc.html).
       Solo pinta: la vista decide los textos (prop "card") y qué hace cada botón. -->
  <div id="suscripcion" class="sw" :class="{ off: card.status === 'canceled' || card.status === 'none' }">
    <span class="spin" aria-hidden="true" />
    <section class="sub-card" aria-label="Tu suscripción">
      <div class="st-top">
        <PremiumCrown :size="60" :off="card.status === 'none'" />
        <div class="st-name">
          <span class="pill" :class="card.status"><i aria-hidden="true" />{{ card.pillText }}</span>
          <h2 class="pm-disp">{{ card.title }}<span v-if="card.planDemo" class="pm-demo">ejemplo</span></h2>
          <p>
            {{ card.statusLine }}
            <span v-if="card.statusDemo" class="pm-demo">fecha de ejemplo</span>
          </p>
        </div>
        <div class="price">
          <b class="pm-num">{{ card.priceBig }}</b><span>{{ card.pricePer }}</span>
        </div>
      </div>

      <div v-if="card.trial" class="trial">
        <div class="trial-h">
          <span>Prueba gratis · día {{ card.trial.day }} de {{ card.trial.total }}</span>
          <span>{{ card.trial.leftText }}<span v-if="card.trial.demo" class="pm-demo">ejemplo</span></span>
        </div>
        <div class="track" role="img" :aria-label="`${card.trial.day} de ${card.trial.total} días de prueba usados`">
          <i :style="{ width: `${card.trial.pct}%` }" />
        </div>
      </div>

      <div class="stats">
        <div v-for="s in card.stats" :key="s.label" class="stat">
          <span>{{ s.label }}</span>
          <b>{{ s.value }}<em v-if="s.demo" class="pm-demo">ejemplo</em></b>
        </div>
      </div>

      <div class="acts">
        <template v-if="card.status === 'none'">
          <RouterLink class="pm-btn gold" :to="{ name: 'premium' }">
            Ver planes Premium
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
          </RouterLink>
        </template>
        <template v-else>
          <button v-if="card.status === 'canceled'" type="button" class="pm-btn gold" :disabled="!!busy" :aria-busy="busy === 'reactivate'" @click="emit('reactivate')">
            {{ busy === "reactivate" ? "Abriendo…" : "Reactivar Premium" }}
          </button>
          <button v-else type="button" class="pm-btn gold" :disabled="!!busy" :aria-busy="busy === 'switch'" @click="emit('switch')">
            {{ busy === "switch" ? "Abriendo…" : card.switchText }}
          </button>
          <button type="button" class="pm-btn" :disabled="!!busy" :aria-busy="busy === 'manage'" @click="emit('manage')">
            {{ busy === "manage" ? "Abriendo…" : "Gestionar pago y facturas" }}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6" /><line x1="20" y1="4" x2="11" y2="13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
          </button>
          <button v-if="card.status !== 'canceled' && !confirming" type="button" class="pm-btn danger push" :disabled="!!busy" @click="confirming = true">
            Cancelar suscripción
          </button>
        </template>
      </div>

      <div v-if="confirming && card.status !== 'canceled' && card.status !== 'none'" class="confirm" role="alertdialog" aria-labelledby="cancel-q" aria-describedby="cancel-d">
        <p>
          <strong id="cancel-q">¿Seguro que quieres cancelar?</strong>
          <span id="cancel-d"> {{ card.confirmLine }}</span>
        </p>
        <div class="acts">
          <button ref="yesBtn" type="button" class="pm-btn danger" :disabled="!!busy" :aria-busy="busy === 'cancel'" @click="onConfirmCancel">
            {{ busy === "cancel" ? "Abriendo…" : "Sí, cancelar" }}
          </button>
          <button type="button" class="pm-btn" :disabled="busy === 'cancel'" @click="confirming = false">Seguir con Premium</button>
        </div>
      </div>

      <slot />
    </section>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import PremiumCrown from "@/components/premium/PremiumCrown.vue";

defineProps({
  // { status, pillText, title, planDemo, statusLine, statusDemo, priceBig, pricePer,
  //   trial: { day, total, pct, leftText, demo } | null, stats: [{ label, value, demo }],
  //   switchText, confirmLine }
  card: { type: Object, required: true },
  busy: { type: String, default: "" }, // acción en curso: switch | manage | cancel | reactivate
});
const emit = defineEmits(["switch", "manage", "cancel", "reactivate"]);

const confirming = ref(false);
const yesBtn = ref(null);
watch(confirming, async (v) => {
  if (v) {
    await nextTick();
    yesBtn.value?.focus();
  }
});

function onConfirmCancel() {
  emit("cancel", () => (confirming.value = false));
}
</script>

<style scoped>
.sw {
  position: relative;
  padding: 1.5px;
  border-radius: 25px;
  overflow: hidden;
  isolation: isolate;
  scroll-margin-top: 0; /* el hueco del nav lo pone scroll-padding-top (base.css) */
  animation: gm-rise 0.7s 0.1s var(--ease-out) both;
}
.sw .spin {
  position: absolute;
  z-index: -1;
  inset: -80%;
  background: conic-gradient(from 0deg, #F3C878 0deg, #FF6A3D 70deg, transparent 120deg, transparent 190deg, #4FE0B6 260deg, #F3C878 360deg);
  animation: gm-spin 7s linear infinite;
}
.sw.off .spin {
  background: conic-gradient(from 0deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.25));
}
.sub-card {
  padding: 28px;
  border-radius: 23.5px;
  background: radial-gradient(90% 90% at 0% 0%, rgba(212, 160, 74, 0.14), transparent 55%), #0D0F14;
}
.sw.off .sub-card {
  background: radial-gradient(90% 90% at 0% 0%, rgba(255, 255, 255, 0.05), transparent 55%), #0D0F14;
}
.st-top {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.st-name {
  flex: 1;
  min-width: 200px;
}
.st-name h2 {
  margin: 10px 0 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.1;
}
.st-name p {
  margin: 6px 0 0;
  color: var(--ink-dim);
  font-size: 15px;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}
.pill i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.pill.active {
  background: rgba(79, 224, 182, 0.1);
  border: 1px solid rgba(79, 224, 182, 0.4);
  color: #7FEBCB;
}
.pill.active i {
  animation: ping 1.8s ease-out infinite;
}
.pill.trialing {
  background: rgba(59, 201, 232, 0.1);
  border: 1px solid rgba(59, 201, 232, 0.4);
  color: #8EDDF0;
}
.pill.canceled {
  background: rgba(255, 106, 61, 0.1);
  border: 1px solid rgba(255, 106, 61, 0.4);
  color: #FFB59C;
}
.pill.none {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #C6CBD2;
}
.price {
  text-align: right;
}
.price b {
  display: block;
  font-size: 34px;
  line-height: 1;
  color: #F7E3B8;
}
.sw.off .price b {
  color: var(--ink);
}
.price span {
  font-size: 13px;
  color: var(--ink-dim);
}

.trial {
  margin-top: 22px;
}
.trial-h {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13.5px;
  color: #C6CBD2;
  margin-bottom: 8px;
}
.track {
  height: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}
.track i {
  display: block;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #3BC9E8, #4FE0B6);
  transition: width 0.6s var(--ease-out);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}
.stat {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.stat span {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.stat b {
  display: block;
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
}
.stat em {
  font-style: normal;
}

.acts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}
.acts .push {
  margin-left: auto;
}
.confirm {
  margin-top: 18px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(255, 106, 61, 0.35);
  background: rgba(255, 106, 61, 0.06);
  animation: pm-fade 0.35s ease both;
}
.confirm p {
  margin: 0;
  color: #E6D2CA;
  font-size: 14.5px;
}
.confirm .acts {
  margin-top: 14px;
}

@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(79, 224, 182, 0.6); }
  80%, 100% { box-shadow: 0 0 0 7px rgba(79, 224, 182, 0); }
}

@media (max-width: 860px) {
  .price {
    text-align: left;
  }
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .stats .stat:last-child {
    grid-column: 1 / -1;
  }
  .acts .pm-btn {
    flex: 1 1 100%;
  }
  .acts .push {
    margin-left: 0;
  }
}
@media (max-width: 560px) {
  .sub-card {
    padding: 22px 18px;
  }
  .st-name h2 {
    font-size: 24px;
  }
}
</style>
