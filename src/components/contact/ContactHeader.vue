<template>
  <!-- Cabecera de /contacto: avión de papel animado, título e iconos flotantes. -->
  <div class="head">
    <div class="deco" aria-hidden="true">
      <span class="fl d1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg></span>
      <span class="fl d2"><img src="/images/games/logo-lol.png" alt=""></span>
      <span class="fl d3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></span>
      <span class="fl d4"><img src="/images/games/logo-zelda.png" alt=""></span>
    </div>
    <div class="plane" aria-hidden="true">
      <svg class="t" width="44" height="24" viewBox="0 0 44 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 20 C 14 18, 26 12, 42 4" /></svg>
      <svg class="p" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></svg>
    </div>
    <div>
      <h1>Escríbenos, <span>te leemos</span></h1>
      <p>¿Falta algo, ves un error o quieres que añadamos un juego? Cuéntanoslo y te respondemos por email.</p>
    </div>
  </div>
</template>

<style scoped>
.head {
  position: relative;
  padding: 56px 0 36px;
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  animation: rise 0.8s var(--ease-out) both;
}
.plane {
  position: relative;
  width: 92px;
  height: 92px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 28px;
  background: linear-gradient(160deg, rgba(212, 160, 74, 0.2), rgba(79, 224, 182, 0.08));
  border: 1px solid rgba(232, 184, 101, 0.35);
  color: var(--gm-gold);
}
.plane svg.p {
  animation: fly 3.6s ease-in-out infinite;
}
.plane svg.t {
  position: absolute;
  left: -30px;
  bottom: 6px;
  color: rgba(232, 184, 101, 0.45);
}
.plane svg.t path {
  stroke-dasharray: 6 6;
  animation: trail 1.2s linear infinite;
}
h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(40px, 5.4vw, 68px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
h1 span {
  color: var(--gold-hi);
}
.head p {
  margin: 10px 0 0;
  max-width: 620px;
  color: var(--ink-dim);
  font-size: 17px;
}

.deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}
.fl {
  position: absolute;
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: bob var(--t, 7s) ease-in-out infinite;
  animation-delay: var(--dl, 0s);
}
.fl img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.d1 { top: 30px; right: 22%; color: var(--gold-hi); --t: 7s; --r0: -8deg; --r1: -2deg; }
.d2 { top: 110px; right: 6%; --t: 8.4s; --dl: -2s; --r0: 6deg; --r1: -4deg; }
.d3 { top: 20px; right: 2%; color: var(--gm-teal); --t: 6.4s; --dl: -1s; --r0: 0deg; --r1: 10deg; }
.d4 { top: 150px; right: 19%; --t: 9s; --dl: -3s; --r0: -6deg; --r1: 6deg; }

@keyframes rise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: none; }
}
@keyframes fly {
  0% { transform: translate(-6px, 6px) rotate(0); }
  50% { transform: translate(6px, -6px) rotate(-6deg); }
  100% { transform: translate(-6px, 6px) rotate(0); }
}
@keyframes trail {
  0% { stroke-dashoffset: 60; }
  100% { stroke-dashoffset: 0; }
}
@keyframes bob {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r0)); }
  50% { transform: translate3d(0, -14px, 0) rotate(var(--r1)); }
}

@media (max-width: 860px) {
  .head {
    padding: 34px 0 24px;
    gap: 18px;
  }
  .plane {
    width: 70px;
    height: 70px;
    border-radius: 22px;
  }
  .deco {
    display: none;
  }
}
</style>
