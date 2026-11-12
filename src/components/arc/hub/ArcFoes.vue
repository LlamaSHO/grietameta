<template>
  <!-- «Los ARC más peligrosos»: amenaza, tipo, mapas y punto débil. Cada
       tarjeta abre la ficha del ARC en la página de enemigos. -->
  <section id="arc" class="sec">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kick"><i></i>Enemigos</span>
          <h2 class="h2 cond">Los ARC más peligrosos</h2>
          <p>Amenaza, blindaje y dónde disparar. Los {{ total || "" }} tipos de ARC están en la página de enemigos.</p>
        </div>
        <RouterLink class="more" :to="{ name: 'arc-enemies' }">Ver los {{ total || "" }} ARC →</RouterLink>
      </div>
      <div class="foes">
        <RouterLink v-for="f in foes" :key="f.id" class="foe" :to="{ name: 'arc-enemies', query: { ver: f.id } }">
          <span class="im">
            <img v-if="f.img" :src="f.img" alt="" loading="lazy" decoding="async">
            <span class="thr" :class="f.tc">{{ f.threat }}</span>
          </span>
          <span class="bd">
            <h3 class="cond">{{ f.name }}</h3>
            <span class="ty">{{ f.type }} · {{ f.maps }}</span>
            <span class="wk"><b>Punto débil:</b> {{ f.weakness }}</span>
          </span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  // De topEnemies (arcData.js).
  foes: { type: Array, required: true },
  total: { type: Number, default: 0 },
});
</script>

<style scoped>
.foes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 14px;
}
.foe {
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: var(--arc-panel);
  border: 1px solid var(--arc-line);
  color: var(--arc-ink);
  text-decoration: none;
  transition: border-color 0.3s, transform 0.3s;
}
.foe:hover { color: var(--arc-ink); border-color: rgba(242, 138, 30, 0.5); transform: translateY(-3px); }
.im { position: relative; display: block; height: 150px; overflow: hidden; background: #100E14; }
.im img { width: 100%; height: 100%; object-fit: cover; transition: transform 1s var(--ease-out); }
.foe:hover .im img { transform: scale(1.08); }
.im .thr { position: absolute; top: 12px; left: 12px; }
.bd { display: flex; flex-direction: column; gap: 6px; padding: 14px 16px 16px; }
h3 { margin: 0; font-size: 26px; font-weight: 800; line-height: 1; }
.ty { font-size: 13px; color: var(--arc-mute); }
.wk {
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(245, 192, 42, 0.06);
  border: 1px solid rgba(245, 192, 42, 0.18);
  font-size: 13px;
  color: var(--arc-ink-2);
}
.wk b { color: var(--arc-yellow); font-weight: 600; }
</style>
