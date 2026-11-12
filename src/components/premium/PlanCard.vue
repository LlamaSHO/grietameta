<template>
  <!-- Tarjeta de plan (.plan de Premium.dc.html). "featured" le pone el borde
       tricolor que gira (.pwrap). El botón va en el slot "action". -->
  <component :is="featured ? 'div' : 'article'" :class="featured ? 'pwrap' : 'plan solo'">
    <span v-if="featured" class="pspin" aria-hidden="true" />
    <component :is="featured ? 'article' : 'div'" :class="featured ? 'plan' : 'plan-in'">
      <div class="ptop">
        <span class="pn">
          <svg v-if="featured" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" /></svg>
          {{ name }}
        </span>
        <span v-if="ribbon" class="ribbon">{{ ribbon }}</span>
      </div>
      <p class="pd">{{ description }}</p>
      <div class="pp">
        <!-- La clave nueva vuelve a montar el número y repite la animación de entrada. -->
        <b :key="price" class="num">{{ price }}</b>
        <span>{{ per }}</span>
      </div>
      <p class="psub">{{ sub }} <strong v-if="subStrong">{{ subStrong }}</strong></p>
      <slot name="action" />
      <p v-if="fine" class="fine">{{ fine }}</p>
      <slot name="after-action" />
      <ul class="feats">
        <li v-for="f in features" :key="f.text" :class="f.included ? 'ok' : 'no'">
          <svg v-if="f.included" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8F98A5" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12" /></svg>
          <span>{{ f.text }}<span v-if="!f.included" class="sr-only"> (no incluido)</span></span>
        </li>
      </ul>
    </component>
  </component>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: String, required: true },
  per: { type: String, default: "" },
  sub: { type: String, default: "" },
  subStrong: { type: String, default: "" },
  fine: { type: String, default: "" },
  ribbon: { type: String, default: "" },
  featured: { type: Boolean, default: false },
  features: { type: Array, default: () => [] }, // [{ text, included }]
});
</script>

<style scoped>
.plan {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
  padding: 30px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  text-align: left;
}
.plan.solo {
  animation: gm-rise 0.9s 0.38s var(--ease-out) both;
}
/* La tarjeta simple no anida: su contenido va en .plan-in con el mismo flujo. */
.plan-in {
  display: contents;
}

.pwrap {
  position: relative;
  height: 100%;
  padding: 1.5px;
  border-radius: 25.5px;
  overflow: hidden;
  isolation: isolate;
  animation: gm-rise 0.9s 0.46s var(--ease-out) both;
  box-shadow: 0 40px 90px -40px rgba(212, 160, 74, 0.55);
}
.pspin {
  position: absolute;
  z-index: -1;
  inset: -60%;
  background: conic-gradient(from 0deg, #F3C878 0deg, #FF6A3D 70deg, transparent 120deg, transparent 180deg, #4FE0B6 250deg, #F3C878 360deg);
  animation: gm-spin 6s linear infinite;
}
.pwrap .plan {
  border: none;
  background: radial-gradient(120% 70% at 50% 0%, #1E1709 0%, #0E0C08 55%, #0B0A08 100%);
}

.ptop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 30px;
}
.pn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-brand);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C6CBD2;
}
.pwrap .pn {
  color: var(--gm-gold);
}
.ribbon {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(79, 224, 182, 0.12);
  border: 1px solid rgba(79, 224, 182, 0.4);
  color: #7FEBCB;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.pd {
  margin: -8px 0 0;
  color: var(--ink-dim);
  font-size: 14.5px;
}
.pp {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.pp b {
  display: inline-block;
  font-size: 56px;
  line-height: 1;
  letter-spacing: -0.02em;
  font-weight: 700;
}
.pwrap .pp b {
  color: #F7E3B8;
}
.pp span {
  color: var(--ink-dim);
  font-size: 15px;
}
.psub {
  margin: -8px 0 0;
  min-height: 44px;
  color: var(--ink-dim);
  font-size: 13.5px;
}
.psub strong {
  color: #7FEBCB;
  font-weight: 600;
}
.fine {
  margin: -8px 0 0;
  font-size: 12.5px;
  color: var(--ink-mute);
  text-align: center;
}
.feats {
  list-style: none;
  margin: 6px 0 0;
  padding: 18px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14.5px;
  color: #D6D3CB;
}
.feats li {
  display: flex;
  gap: 11px;
  align-items: flex-start;
}
.feats svg {
  flex-shrink: 0;
  margin-top: 3px;
}
.feats .ok svg {
  color: var(--ink-dim);
}
.pwrap .feats .ok svg {
  color: var(--gm-gold);
}
.feats .no {
  color: var(--ink-mute);
}

/* Cambio de precio al pasar de mensual a anual */
.pp b {
  animation: flip 0.35s var(--ease-out) both;
}
@keyframes flip {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 520px) {
  .plan {
    padding: 24px;
  }
  .pp b {
    font-size: 46px;
  }
}
</style>
