<template>
  <!-- Cabecera de las listas de ARC (objetos, misiones, enemigos): migas,
       título condensado con la segunda línea en amarillo, entradilla y cifras. -->
  <section class="lhead">
    <img v-if="img" class="lhead-img" :src="img" alt="" aria-hidden="true">
    <div class="wrap lhead-in">
      <nav class="crumbs" aria-label="Migas de pan">
        <RouterLink :to="{ name: 'arc' }">ARC Raiders</RouterLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ crumb }}</span>
      </nav>
      <h1 class="h1 cond">{{ title }}<span v-if="accent">{{ accent }}</span></h1>
      <p v-if="lead" class="lead">{{ lead }}</p>
      <div v-if="$slots.default" class="pills"><slot /></div>
    </div>
    <div class="stripes" aria-hidden="true"></div>
  </section>
</template>

<script setup>
defineProps({
  crumb: { type: String, required: true },
  title: { type: String, required: true },
  accent: { type: String, default: "" },
  lead: { type: String, default: "" },
  // Imagen decorativa a la derecha (un objeto, un ARC…).
  img: { type: String, default: "" },
});
</script>

<style scoped>
.lhead {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.lhead::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background: radial-gradient(640px 360px at 82% 30%, rgba(242, 138, 30, 0.14), transparent 70%), radial-gradient(480px 300px at 0% 0%, rgba(59, 201, 232, 0.07), transparent 70%);
}
.lhead-img {
  position: absolute;
  right: max(28px, calc((100vw - 1240px) / 2 + 28px));
  top: 50%;
  width: 300px;
  height: 300px;
  object-fit: contain;
  transform: translateY(-50%);
  z-index: -1;
  opacity: 0.55;
  filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.7));
  mask-image: radial-gradient(circle, #000 55%, transparent 75%);
  -webkit-mask-image: radial-gradient(circle, #000 55%, transparent 75%);
}
.lhead-in {
  padding-top: 32px;
  padding-bottom: 32px;
  animation: arc-rise 0.7s var(--ease-out) both;
}
.crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 13px; color: var(--arc-faint); }
.lhead .crumbs a { color: var(--arc-mute); text-decoration: none; }
.lhead .crumbs a:hover { color: var(--arc-ink); }
.crumbs [aria-current] { color: var(--arc-ink-2); }
.h1 {
  margin: 14px 0 0;
  font-size: clamp(40px, 5vw, 66px);
  font-weight: 800;
  line-height: 0.92;
  max-width: 760px;
}
.h1 span { display: block; color: var(--arc-yellow); }
.lead { margin: 16px 0 0; color: var(--arc-dim); font-size: 16.5px; max-width: 620px; text-wrap: pretty; }
.pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.pills :slotted(.pill) {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  min-height: 34px;
  padding: 6px 12px;
  border-radius: 9px;
  background: rgba(11, 10, 14, 0.7);
  border: 1px solid rgba(242, 235, 221, 0.12);
  font-size: 13px;
  color: var(--arc-mute);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.pills :slotted(.pill b) { font-family: var(--font-brand); font-size: 16px; font-weight: 700; color: var(--arc-ink); }

@media (max-width: 860px) {
  .lhead-img { width: 220px; height: 220px; opacity: 0.3; right: -30px; }
}
@media (max-width: 560px) {
  .lhead-in { padding-top: 22px; padding-bottom: 24px; }
  .lead { font-size: 15px; }
  .lhead-img { width: 170px; height: 170px; top: 40%; }
}
</style>
