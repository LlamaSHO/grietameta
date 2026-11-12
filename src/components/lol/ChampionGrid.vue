<template>
  <!-- Todos los campeones (de la línea elegida). Cada carta lleva a su ficha. -->
  <section class="card cgrid" aria-labelledby="ch-h">
    <span id="campeones" class="lol-anchor" aria-hidden="true"></span>
    <div class="card-h">
      <h2 id="ch-h" class="disp">Campeones</h2>
      <span class="meta">{{ roleLabel }} · toca uno para ver su build</span>
    </div>
    <p v-if="loading" class="loading">Cargando campeones…</p>
    <div v-else-if="items.length" class="grid">
      <RouterLink
        v-for="g in items"
        :key="g.c.id"
        class="gc"
        :class="{ nodata: !g.tier }"
        :to="{ name: 'lol-champion', params: { id: g.c.ddId } }"
        :title="g.tier ? `${g.c.name} · tier ${g.tier}` : `${g.c.name} · sin partidas suficientes en este rango`"
      >
        <img :src="g.c.icon" alt="" loading="lazy" width="52" height="52">
        <span class="n">{{ g.c.name }}</span>
        <span class="tier" :class="g.tc || 't-none'">{{ g.tier || "–" }}</span>
      </RouterLink>
    </div>
    <p v-else class="empty">No encontramos campeones con ese nombre. Prueba con otra búsqueda.</p>
  </section>
</template>

<script setup>
defineProps({
  // [{ c, tier, tc }] (tier null = sin datos en el rango elegido)
  items: { type: Array, required: true },
  roleLabel: { type: String, default: "Todos los roles" },
  loading: { type: Boolean, default: false },
});
</script>

<style scoped>
.cgrid { position: relative; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 10px;
  padding: 0 20px 20px;
}
.gc {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px 8px;
  border-radius: 12px;
  text-decoration: none;
  color: #C6CBD2;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.2s, transform 0.2s;
}
.lol-page .gc { color: #C6CBD2; }
.lol-page .gc:hover { background: rgba(255, 255, 255, 0.05); color: var(--ink); transform: translateY(-2px); }
.gc img { width: 52px; height: 52px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); }
.gc.nodata img { filter: grayscale(0.8); opacity: 0.6; }
.gc .tier {
  position: absolute;
  top: 4px;
  right: 8px;
  min-width: 24px;
  height: 18px;
  font-size: 10.5px;
  border-radius: 6px;
  padding: 0 4px;
}
.gc .n { max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.empty { margin: 0; padding: 8px 20px 24px; color: #A0A8B4; font-size: 14px; }
@media (max-width: 560px) {
  .grid { grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 6px; padding: 0 12px 16px; }
  .gc img { width: 46px; height: 46px; }
  .gc .tier { right: 4px; }
}
</style>
