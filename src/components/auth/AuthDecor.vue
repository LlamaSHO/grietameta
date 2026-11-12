<template>
  <!-- Iconos flotantes alrededor de la tarjeta de acceso (armas, escudo,
       mapa y los logos de los 3 juegos). Solo decoración. -->
  <div class="deco" aria-hidden="true">
    <div class="fl tile f1"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5" /><path d="M13 19l6-6" /><path d="M16 16l4 4" /><path d="M19 21l2-2" /></svg></div>
    <div class="fl tile logo f2"><img src="/images/games/logo-lol.png" alt=""></div>
    <div class="fl tile f3"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg></div>
    <div class="fl tile f4"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2" /><line x1="12" y1="1.5" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22.5" /><line x1="1.5" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22.5" y2="12" /></svg></div>
    <div class="fl bare f5"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3L8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></svg></div>
    <div class="fl tile logo f6"><img src="/images/games/logo-arc.png" alt=""></div>
    <div class="fl tile f7"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 7v9" /><path d="M8.5 10.5h7" /></svg></div>
    <div class="fl tile logo f8"><img src="/images/games/logo-zelda.png" alt=""></div>
    <div class="fl tile f9"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6" /><path d="M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" /><path d="M7 15h10" /></svg></div>
    <div class="fl bare f10"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
    <div class="fl tile f11"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" /></svg></div>
    <div class="fl tile f12"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg></div>
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
  width: 58px;
  height: 58px;
  border-radius: 17px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.11);
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.fl.logo {
  width: 66px;
  height: 66px;
  border-radius: 50%;
}
.fl.logo img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.fl.bare {
  opacity: 0.5;
}

.f1 { top: 6%; left: 2.5%; color: var(--gold-hi); --t: 7s; --r0: -10deg; --r1: -3deg; }
.f2 { top: 30%; left: 5.5%; --t: 8.5s; --dl: -2s; --r0: 6deg; --r1: -4deg; }
.f3 { top: 52%; left: 1.5%; color: var(--gm-teal); --t: 6s; --dl: -1s; --r0: 0deg; --r1: 14deg; }
.f4 { top: 74%; left: 5%; color: #FF7A50; --t: 9s; --dl: -4s; --r0: -6deg; --r1: 6deg; }
.f5 { top: 97%; left: 30%; color: #C3C8CF; --t: 7.4s; --dl: -3s; --r0: 8deg; --r1: -6deg; }
.f6 { top: 4%; right: 3%; --t: 7.5s; --dl: -3s; --r0: 8deg; --r1: 2deg; }
.f7 { top: 26%; right: 1.5%; color: var(--gold-hi); --t: 8s; --dl: -1.5s; --r0: -4deg; --r1: 8deg; }
.f8 { top: 48%; right: 5%; --t: 6.5s; --dl: -2.5s; --r0: 10deg; --r1: -6deg; }
.f9 { top: 70%; right: 2%; color: var(--gm-teal); --t: 9.5s; --dl: -5s; --r0: -12deg; --r1: -2deg; }
.f10 { top: 96%; right: 30%; color: #FF7A50; --t: 8.2s; --dl: -1s; --r0: 4deg; --r1: -8deg; }
.f11 { top: -1%; left: 40%; color: var(--gold-hi); --t: 7.8s; --dl: -2s; --r0: -8deg; --r1: 4deg; }
.f12 { top: 95%; left: 52%; color: var(--gm-teal); --t: 8.8s; --dl: -4s; --r0: 6deg; --r1: -6deg; }

@keyframes bob {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--r0)); }
  50% { transform: translate3d(0, -16px, 0) rotate(var(--r1)); }
}

@media (max-width: 980px) {
  .f2, .f3, .f4, .f7, .f8, .f9, .f11, .f12 { display: none; }
}
@media (max-width: 560px) {
  .deco { display: none; }
}
</style>
