<template>
  <!-- Iconos flotantes de fondo del hero (.deco f1–f8 del diseño). Solo decoran. -->
  <div class="deco" aria-hidden="true">
    <div class="fl tile f1"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5" /><path d="M13 19l6-6" /><path d="M16 16l4 4" /><path d="M19 21l2-2" /></svg></div>
    <div class="fl tile f2"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="1.5" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22.5" /><line x1="1.5" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22.5" y2="12" /></svg></div>
    <div class="fl bare f3"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3L8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg></div>
    <div class="fl tile f4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6" /><path d="M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" /><path d="M7 15h10" /></svg></div>
    <div class="fl tile f5"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 7v9" /><path d="M8.5 10.5h7" /></svg></div>
    <div class="fl tile f6"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg></div>
    <div class="fl bare f7"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
    <div class="fl tile f8"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg></div>
  </div>
</template>

<style scoped>
.deco {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}
.fl {
  position: absolute;
  display: grid;
  place-items: center;
  animation: bob var(--t, 7s) ease-in-out infinite;
  animation-delay: var(--dl, 0s);
}
.fl.tile {
  width: 60px;
  height: 60px;
  border-radius: 17px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.fl.bare {
  opacity: 0.55;
}
.f1 { top: 12%; left: 9%; color: var(--gold-hi); --t: 7s; --r0: -10deg; --r1: -3deg; }
.f2 { top: 68%; left: 12%; color: #FF7A50; --t: 8.5s; --dl: -2s; --r0: 6deg; --r1: -4deg; }
.f3 { top: 23%; left: 21%; color: #19D3C5; --t: 6s; --dl: -1s; --r0: 0deg; --r1: 14deg; }
.f4 { top: 85%; left: 26%; color: #C3C8CF; --t: 9s; --dl: -4s; --r0: -6deg; --r1: 6deg; }
.f5 { top: 5%; right: 14%; color: #19D3C5; --t: 7.5s; --dl: -3s; --r0: 8deg; --r1: 2deg; }
.f6 { top: 45%; right: 3%; color: var(--gm-teal); --t: 8s; --dl: -1.5s; --r0: -4deg; --r1: 8deg; }
.f7 { top: 49%; right: 21%; color: var(--gold-hi); --t: 6.5s; --dl: -2.5s; --r0: 10deg; --r1: -6deg; }
.f8 { top: 88%; right: 22%; color: #F5A524; --t: 9.5s; --dl: -5s; --r0: -12deg; --r1: -2deg; }

@keyframes bob {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r0)); }
  50% { transform: translate3d(0, -18px, 0) rotate(var(--r1)); }
}

@media (max-width: 1200px) {
  .f3, .f7 { display: none; }
}
@media (max-width: 860px) {
  .f2, .f4, .f6, .f8 { display: none; }
  .f1 { top: 4%; left: 4%; }
  .f5 { top: 3%; right: 4%; }
}
/* En pantallas muy estrechas se quedan pequeños para no tapar el emblema. */
@media (max-width: 560px) {
  .fl.tile {
    width: 48px;
    height: 48px;
    border-radius: 14px;
  }
  .fl.tile svg {
    width: 22px;
    height: 22px;
  }
}
</style>
