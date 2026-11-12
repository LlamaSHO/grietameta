<template>
  <!-- Escaparate (columna izquierda en escritorio): tarjetas de los juegos,
       emblema GM y ventajas de tener cuenta. -->
  <aside class="show" aria-hidden="true">
    <div class="stack">
      <div v-for="c in CARDS" :key="c.cls" class="cw" :class="c.cls">
        <div class="card">
          <img class="bgi" :src="c.img" alt="" loading="lazy">
          <span class="cap">
            <img :src="c.logo" alt="">
            <span>{{ c.title }}<small>{{ c.sub }}</small></span>
          </span>
        </div>
      </div>
    </div>
    <div class="emb"><GmMark :size="46" animated /></div>
    <h2 class="disp">Tu meta,<br><em>siempre contigo.</em></h2>
    <ul class="perks">
      <li>
        <span class="pk"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></span>
        Guarda tus juegos favoritos y tu progreso.
      </li>
      <li>
        <span class="pk"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg></span>
        Tu cuenta funciona en todos los juegos de GrietaMeta.
      </li>
      <li>
        <span class="pk"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" /></svg></span>
        Con Premium navegas sin anuncios y recibes los avisos de parche antes que nadie.
      </li>
    </ul>
  </aside>
</template>

<script setup>
import GmMark from "@/components/brand/GmMark.vue";

const CARDS = [
  { cls: "c1", img: "/images/zelda/hyrule.jpg", logo: "/images/games/logo-zelda.png", title: "Zelda TotK", sub: "Santuarios y semillas" },
  { cls: "c2", img: "/images/arc-raiders/bots/arc_the_queen.webp", logo: "/images/games/logo-arc.png", title: "ARC Raiders", sub: "Misiones completadas" },
  { cls: "c3", img: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg", logo: "/images/games/logo-lol.png", title: "League of Legends", sub: "Campeones favoritos" },
];
</script>

<style scoped>
.show {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 22px;
  padding: 44px;
  background:
    radial-gradient(90% 60% at 30% 10%, rgba(212, 160, 74, 0.16), transparent 60%),
    radial-gradient(70% 50% at 90% 40%, rgba(79, 224, 182, 0.1), transparent 60%),
    linear-gradient(160deg, var(--panel-2) 0%, #0C1017 60%, #090C11 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.07);
}
.stack {
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  height: 430px;
}
.cw {
  position: absolute;
  width: 276px;
  transition: transform 0.7s var(--ease-out);
}
.cw.c1 { left: 4%; top: 24px; transform: rotate(-9deg); }
.cw.c2 { right: 4%; top: 0; transform: rotate(8deg); }
.cw.c3 { left: 50%; top: 214px; margin-left: -138px; transform: rotate(-2deg); z-index: 2; }
.show:hover .cw.c1 { transform: translate(-18px, -6px) rotate(-13deg); }
.show:hover .cw.c2 { transform: translate(18px, -10px) rotate(12deg); }
.show:hover .cw.c3 { transform: translateY(-14px) rotate(0deg); }

.card {
  position: relative;
  height: 180px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.85);
  background: var(--bg-raised);
  animation: floaty 6s ease-in-out infinite;
}
.c1 .card { animation-delay: -2s; }
.c2 .card { animation-delay: -4s; animation-duration: 7s; }
.card img.bgi {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.c1 .card img.bgi { object-position: 50% 40%; }
.c2 .card img.bgi { object-position: 50% 30%; }
.c3 .card img.bgi { object-position: 62% 22%; }
.card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(7, 9, 13, 0.92));
}
.c3 .card {
  border-color: rgba(232, 184, 101, 0.55);
  box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.9), 0 0 0 4px rgba(212, 160, 74, 0.12);
}
.cap {
  position: absolute;
  z-index: 1;
  left: 12px;
  right: 12px;
  bottom: 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 600;
}
.cap img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  padding: 3px;
  border-radius: 8px;
  background: rgba(7, 9, 13, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.cap small {
  display: block;
  font-size: 11.5px;
  font-weight: 500;
  color: #C6CBD2;
}

.emb {
  position: relative;
}
.show h2 {
  position: relative;
  margin: 0;
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.03em;
}
.show h2 em {
  font-style: normal;
  color: var(--gold-hi);
}
.perks {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14.5px;
  color: #C6CBD2;
}
.perks li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.perks .pk {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(212, 160, 74, 0.12);
  border: 1px solid rgba(212, 160, 74, 0.3);
  color: var(--gm-gold);
}

@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 980px) {
  .show { display: none; }
}
</style>
