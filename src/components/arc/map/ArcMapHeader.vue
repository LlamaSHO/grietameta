<template>
  <!-- Cabecera del mapa: migas, nombre, datos rápidos y selector de planta. -->
  <div class="mh">
    <div>
      <nav class="crumbs" aria-label="Migas de pan">
        <RouterLink :to="{ name: 'arc' }">ARC Raiders</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink :to="{ name: 'arc-map' }">Mapas</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ map.name }}</span>
      </nav>
      <h1 class="h1 cond">{{ map.name }}</h1>
      <div class="meta">
        <span class="chip"><span class="num">{{ questCount }}</span> {{ questCount === 1 ? "misión" : "misiones" }}</span>
        <span class="chip">
          <template v-if="enemyCount"><span class="num">{{ enemyCount }}</span> tipos de ARC</template>
          <template v-else>Sin datos de ARC</template>
        </span>
        <span v-if="map.desc" class="chip">{{ map.desc }}</span>
      </div>
    </div>

    <div v-if="map.views.length > 1" class="floors" role="group" aria-label="Planta">
      <button
        v-for="(v, i) in map.views"
        :key="v.file"
        type="button"
        class="fl"
        :class="{ on: i === viewIndex }"
        :aria-pressed="i === viewIndex"
        @click="$emit('update:viewIndex', i)"
      >
        {{ v.label || `Vista ${i + 1}` }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  map: { type: Object, required: true },
  viewIndex: { type: Number, default: 0 },
  questCount: { type: Number, default: 0 },
  enemyCount: { type: Number, default: 0 },
});
defineEmits(["update:viewIndex"]);
</script>

<style scoped>
.mh {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;
  flex-wrap: wrap;
  padding: 26px 0 18px;
  animation: am-rise 0.5s var(--ease-out) both;
}
.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: var(--am-faint);
}
.crumbs a {
  color: var(--am-mute);
  text-decoration: none;
}
.crumbs a:hover {
  color: var(--am-ink);
}
.h1 {
  margin: 6px 0 0;
  font-size: clamp(40px, 5vw, 68px);
  font-weight: 800;
  line-height: 0.92;
}
.meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--am-panel);
  border: 1px solid var(--am-line);
  font-size: 13px;
  font-weight: 600;
  color: var(--am-ink-2);
}
.floors {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: var(--am-panel);
  border: 1px solid var(--am-line);
}
.fl {
  height: 38px;
  padding: 0 14px;
  border-radius: 9px;
  border: 0;
  background: transparent;
  color: var(--am-mute);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.fl:hover {
  color: var(--am-ink);
}
.fl.on {
  background: var(--am-yellow);
  color: #141007;
}
.fl:focus-visible {
  outline: 2px solid var(--am-yellow);
  outline-offset: 2px;
}

@media (max-width: 560px) {
  .mh {
    padding: 20px 0 14px;
  }
  .chip {
    height: 28px;
    font-size: 12px;
    padding: 0 10px;
  }
  .floors {
    display: flex;
    width: 100%;
  }
  .fl {
    flex: 1;
    padding: 0 8px;
  }
}
</style>
