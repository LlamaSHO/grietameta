<script setup>
defineProps({
  game: { type: Object, required: true },
  era: { type: Array, required: true },
  index: { type: Number, required: true },
  chronological: Boolean,
});
</script>

<template>
  <article class="memory" :class="{ unity: game.id === 'acu', upcoming: game.tag }" :style="{ '--era-color': era[2] }">
    <div class="cover">
      <img v-if="game.bp" :src="`/images/assassins-creed/covers/${game.id}.webp`" width="360" height="180" alt="" loading="lazy" decoding="async">
      <span v-else>Codename Hexe</span>
    </div>
    <div class="memory-head">
      <span class="sequence"><span>SEC</span> {{ String(index + 1).padStart(2, "0") }}</span>
      <div>
        <b>{{ chronological ? game.per : game.y < 9000 ? game.y : "Próximamente" }}</b>
        <small>{{ chronological ? game.y < 9000 ? `Salió en ${game.y}` : "Sin fecha" : game.date }}</small>
      </div>
    </div>
    <span class="era"><i></i>{{ era[1] }}</span>
    <h3>{{ game.t }}</h3>
    <dl><dt>Protagonista</dt><dd>{{ game.who }}</dd><dt>Dónde</dt><dd>{{ game.where }}</dd></dl>
    <p>{{ game.note }}</p>
    <RouterLink v-if="game.id === 'acu'" class="memory-link" to="/assassins-creed/unity">Abrir la guía completa <span aria-hidden="true">→</span></RouterLink>
    <span v-else class="tag">{{ game.tag || "Guía próximamente" }}</span>
  </article>
</template>

<style scoped>
.memory { display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 0 17px 18px; overflow: hidden; border: 1px solid #263a46; border-radius: 5px; background: linear-gradient(150deg,#101d27,#0a1018 55%); position: relative; }
.memory::before { content: ""; position: absolute; z-index: 1; top: 0; right: 0; width: 18px; height: 18px; background: linear-gradient(45deg, transparent 48%, #45616d 49% 53%, #060b11 54%); pointer-events: none; }
.memory:hover, .memory:focus-within { border-color: #6ca7bc; }
.memory.unity { background: linear-gradient(150deg,#321720,#0a1018 55%); border-color: #9b4b5a; }
.cover { aspect-ratio: 2; margin: 0 -17px; position: relative; display: grid; place-items: center; background: repeating-linear-gradient(135deg,#101c27 0 8px,#121e29 8px 16px); }
.cover::after { content: ""; position: absolute; inset: 40% 0 0; background: linear-gradient(transparent,#0a1018); }
.cover img { width: 100%; height: 100%; object-fit: cover; }
.cover span { color: #a9bed0; font: 700 1.25rem/1.2 var(--ac-display); letter-spacing: .12em; }
.memory-head { display: flex; justify-content: space-between; gap: 8px; align-items: start; margin-top: -26px; position: relative; }
.memory-head div { display: grid; text-align: right; color: #e6f1f7; }
.memory-head small { font-size: .75rem; color: #adbbc5; }
.sequence { color: #88c4db; font: 750 1.9rem/1 "IBM Plex Sans", sans-serif; }
.sequence span { font-size: .75rem; letter-spacing: .13em; vertical-align: middle; }
.era { display: flex; align-items: center; gap: 7px; color: #b6c6d1; font: 700 .75rem/1.3 "IBM Plex Sans", sans-serif; letter-spacing: .11em; text-transform: uppercase; }
.era i { width: 7px; height: 7px; border-radius: 50%; background: var(--era-color); }
h3 { margin: 0; font: 700 1.7rem/1.03 var(--ac-display); }
dl { display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; margin: 0; font-size: .83rem; }
dt { color: #a6b6c3; }
dd { margin: 0; color: #d6e2ea; }
p { margin: 0 0 4px; color: #b6c6d1; font-size: .83rem; }
.tag, .memory-link { margin-top: auto; align-self: start; border-radius: 3px; font-size: .78rem; }
.tag { padding: 5px 9px; border: 1px solid #354958; color: #bdc9d4; }
.upcoming .tag { border-color: #834454; color: #f4acb7; }
.memory-link { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; padding-inline: 12px; background: #bb213c; color: white; font-weight: 700; text-decoration: none; }
.memory-link:is(:hover,:focus-visible) { background: #ca2846; color: white; }
</style>
