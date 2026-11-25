<template>
  <!-- Icono con tooltip (objeto, runa, hechizo o habilidad). Diseño: .ic/.tt de
       LolCampeon.dc.html. El icono sale de una imagen (img) o de un sprite
       (sheet: "ms" = iconos.webp, "cs" = campeones.webp) con su posición. -->
  <span class="ic" :class="[round ? 'round' : '']" tabindex="0" :aria-label="label || tip?.name">
    <img v-if="img" class="sp" :src="img" alt="" loading="lazy" decoding="async">
    <span v-else class="sp" :class="sheet" :style="{ backgroundPosition: pos }"></span>
    <slot />
    <span v-if="tip" class="tt" :class="side" role="tooltip">
      <b class="tt-n">{{ tip.name }}</b>
      <small v-if="tip.meta" class="tt-m">{{ tip.meta }}</small>
      <span v-if="tip.stats?.length" class="tt-s"><span v-for="s in tip.stats" :key="s">{{ s }}</span></span>
      <span v-if="tip.desc" class="tt-d" v-html="tip.desc"></span>
    </span>
  </span>
</template>

<script setup>
// El contenido de «tip.desc» sale de nuestros JSON (nunca de texto del usuario).
defineProps({
  img: { type: String, default: "" },
  sheet: { type: String, default: "ms" },
  pos: { type: String, default: "0% 0%" },
  tip: { type: Object, default: null }, // { name, meta, stats, desc }
  label: { type: String, default: "" },
  side: { type: String, default: "" }, // "" · "l" · "r" · "dn"
  round: { type: Boolean, default: false },
});
</script>

<style scoped>
.ic { position: relative; display: inline-block; flex-shrink: 0; outline: none; width: var(--ic, 40px); height: var(--ic, 40px); border-radius: var(--ic-r, 10px); }
.ic.round { border-radius: 50%; }
.sp { display: block; width: 100%; height: 100%; border-radius: inherit; background-repeat: no-repeat; }
.sp.cs { background-image: url(/images/lol/campeones.webp); background-size: 1400% 1300%; }
.sp.ms { background-image: url(/images/lol/iconos.webp); background-size: 1000% 700%; }
.tt {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  z-index: 80;
  width: 300px;
  max-width: 78vw;
  padding: 12px 14px;
  border-radius: 14px;
  background: #141922;
  border: 1px solid rgba(226, 181, 102, 0.35);
  box-shadow: 0 24px 50px -16px rgba(0, 0, 0, 0.95);
  color: #ECE9E1;
  text-align: left;
  font: 400 12.5px/1.5 var(--font-body);
  letter-spacing: 0;
  text-transform: none;
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 6px);
  transition: opacity 0.16s, transform 0.16s, visibility 0.16s;
  pointer-events: none;
}
.tt::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -7px; border: 7px solid transparent; border-top-color: #141922; }
.ic:hover .tt, .ic:focus .tt, .ic:focus-within .tt { opacity: 1; visibility: visible; transform: translate(-50%, 0); }
.tt.l { left: 0; transform: translate(0, 6px); }
.ic:hover .tt.l, .ic:focus .tt.l { transform: none; }
.tt.l::after { left: 24px; }
.tt.r { left: auto; right: 0; transform: translate(0, 6px); }
.ic:hover .tt.r, .ic:focus .tt.r { transform: none; }
.tt.r::after { left: auto; right: 18px; }
/* Hacia abajo (habilidades de la cabecera) */
.tt.dn { bottom: auto; top: calc(100% + 12px); }
.tt.dn::after { top: auto; bottom: 100%; border-top-color: transparent; border-bottom-color: #141922; }
.tt-n { display: block; font: 700 14.5px/1.25 var(--font-display); color: #F3C878; }
.tt-m { display: block; margin-top: 2px; font-size: 11.5px; color: #8F98A5; }
.tt-s { display: flex; flex-direction: column; gap: 1px; margin-top: 8px; padding: 8px 10px; border-radius: 9px; background: rgba(255, 255, 255, 0.04); font-size: 12px; color: #BFE9C9; }
.tt-d { display: block; margin-top: 8px; color: #C6CBD2; }
.tt-d :deep(b) { color: #ECE9E1; }
@media (max-width: 640px) {
  .tt { width: 240px; }
  /* En móvil los tooltips laterales se centran para no salirse de la pantalla. */
  .tt.l, .tt.r { left: 50%; right: auto; transform: translate(-50%, 6px); }
  .ic:hover .tt.l, .ic:focus .tt.l, .ic:hover .tt.r, .ic:focus .tt.r { transform: translate(-50%, 0); }
  .tt.l::after, .tt.r::after { left: 50%; right: auto; }
}
@media (prefers-reduced-motion: reduce) { .tt { transition: none; } }
</style>
