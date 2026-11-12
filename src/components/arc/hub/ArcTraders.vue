<template>
  <!-- «Misiones por comerciante»: retrato, especialidad y número de misiones.
       Cada tarjeta abre la lista de misiones filtrada por ese comerciante. -->
  <section id="misiones" class="sec">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kick"><i></i>Misiones</span>
          <h2 class="h2 cond">Misiones por comerciante</h2>
          <p v-if="total">{{ total }} misiones con sus objetivos y recompensas. {{ onMap }} transcurren en un mapa concreto: las tienes también dentro de cada mapa.</p>
          <p v-else>Misiones con sus objetivos y recompensas, también dentro de cada mapa.</p>
        </div>
        <RouterLink class="more" :to="{ name: 'arc-quests' }">Ver todas las misiones →</RouterLink>
      </div>
      <div class="traders">
        <RouterLink v-for="t in traders" :key="t.name" class="tr" :class="t.cls" :to="{ name: 'arc-quests', query: { comerciante: t.name } }">
          <span class="tt">
            <span class="av"><img v-if="t.img" :src="t.img" alt="" loading="lazy" width="54" height="54"></span>
            <span><b class="cond">{{ t.name }}</b><span class="role">{{ t.role ? t.role + " · " : "" }}{{ t.quests }} misiones</span></span>
          </span>
          <span class="pb" aria-hidden="true"><i :style="{ width: t.width }"></i></span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  // De summarizeTraders (arcData.js).
  traders: { type: Array, required: true },
  total: { type: Number, default: 0 },
  onMap: { type: Number, default: 0 },
});
</script>

<style scoped>
.traders {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: 12px;
}
.c-y { --tc: #F5C02A; }
.c-c { --tc: #3BC9E8; }
.c-r { --tc: #E5372B; }
.c-o { --tc: #F28A1E; }
.c-g { --tc: #2FB45A; }
.tr {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 16px;
  background: var(--arc-panel);
  border: 1px solid var(--arc-line);
  text-decoration: none;
  color: var(--arc-ink);
  transition: border-color 0.2s, transform 0.2s;
}
.tr:hover { color: var(--arc-ink); border-color: rgba(245, 192, 42, 0.45); transform: translateY(-2px); }
.tt { display: flex; align-items: center; gap: 12px; }
.av {
  position: relative;
  flex-shrink: 0;
  width: 58px;
  height: 58px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--tc);
  padding: 2px;
}
.av img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 14px; transition: transform 0.4s var(--ease-out); }
.tr:hover .av img { transform: scale(1.08); }
b { display: block; font-size: 24px; font-weight: 800; line-height: 1; }
.role { display: block; margin-top: 3px; font-size: 12px; color: var(--arc-faint); }
.pb { height: 6px; border-radius: 6px; background: rgba(242, 235, 221, 0.08); overflow: hidden; }
.pb i { display: block; height: 100%; background: var(--tc); }
</style>
