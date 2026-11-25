<template>
  <!-- Cabecera de las páginas nuevas de LoL (Builds, eSports, Noticias).
       Diseño: .mast de LolBuilds.dc.html y LolNoticias.dc.html. -->
  <header class="mast">
    <div class="wrap mast-in">
      <div class="crumb"><RouterLink to="/lol">League of Legends</RouterLink><span aria-hidden="true">/</span> {{ crumb }}</div>
      <h1><slot name="title" /></h1>
      <p v-if="lede" class="lede">{{ lede }}</p>
      <div v-if="$slots.scope" class="scope"><slot name="scope" /></div>
    </div>
  </header>
</template>

<script setup>
defineProps({ crumb: { type: String, required: true }, lede: { type: String, default: "" } });
</script>

<style scoped>
.mast {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-bottom: 1px solid #292A29;
  background: repeating-linear-gradient(128deg, transparent 0 70px, #d9b56e0a 71px, transparent 72px 100px), radial-gradient(ellipse at 85% 115%, #463924, transparent 58%), #101419;
}
.mast::after {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 8% 9% 0 auto;
  aspect-ratio: 1;
  background: url(/images/games/logo-lol.png) center / contain no-repeat;
  opacity: 0.23;
  transform: rotate(-8deg);
}
.mast-in { padding-block: 24px 30px; }
.crumb, .scope { display: flex; gap: 10px; align-items: center; font-size: 12px; color: #B9BFCA; }
.crumb a { color: #B9BFCA; text-decoration: none; }
.crumb a:hover { text-decoration: underline; color: var(--ink); }
h1 {
  margin: 12px 0 0;
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 52px);
  letter-spacing: -0.04em;
  line-height: 1.07;
}
h1 :deep(em) { font-style: normal; color: #E2B566; }
.lede { max-width: 53ch; margin: 8px 0 0; color: #C1C7CF; }
.scope { margin-top: 18px; flex-wrap: wrap; gap: 8px 14px; }
.scope :deep(.patch) { color: var(--gm-gold); font-weight: 700; }
.scope :deep(.criterion) { color: var(--gm-gold); font-size: 13px; font-weight: 600; }
@media (max-width: 680px) {
  .mast-in { padding-block: 18px; }
  .mast::after { opacity: 0.08; }
}
</style>
