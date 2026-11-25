<template>
  <!-- Progreso total y por comerciante. Cada comerciante es un filtro:
       pulsarlo enseña solo sus misiones (y otra vez, todas). -->
  <div class="tiles" role="group" aria-label="Filtrar por comerciante">
    <button type="button" class="tile" :aria-pressed="trader === ''" @click="emit('update:trader', '')">
      <span class="av all">{{ quests.length }}</span>
      <span class="tx"><b class="cond">Todos</b><span>{{ doneCount }} de {{ quests.length }} hechas</span></span>
    </button>
    <button
      v-for="t in tiles"
      :key="t.name"
      type="button"
      class="tile"
      :class="t.cls"
      :aria-pressed="String(trader === t.name)"
      @click="emit('update:trader', trader === t.name ? '' : t.name)"
    >
      <span class="av" aria-hidden="true"><img v-if="t.img" :src="t.img" alt="" width="40" height="40"></span>
      <span class="tx">
        <b class="cond">{{ t.name || "Sin comerciante" }}</b>
        <span>{{ t.done }} de {{ t.total }} hechas</span>
        <span class="tb" aria-hidden="true"><i :style="{ width: t.pct + '%' }"></i></span>
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { traderInfo } from "./arcLabels";

const props = defineProps({
  quests: { type: Array, required: true },
  progress: { type: Object, required: true },
  trader: { type: String, default: "" },
});
const emit = defineEmits(["update:trader"]);

const doneCount = computed(() => props.quests.filter((q) => props.progress.done[q.id]).length);

// Comerciantes de más a menos misiones (como en el hub).
const tiles = computed(() => {
  const by = {};
  props.quests.forEach((q) => {
    const x = by[q.trader] || (by[q.trader] = { name: q.trader, total: 0, done: 0 });
    x.total++;
    if (props.progress.done[q.id]) x.done++;
  });
  return Object.values(by)
    .sort((a, b) => b.total - a.total || (a.name || "").localeCompare(b.name || "", "es"))
    .map((x) => ({ ...x, ...traderInfo(x.name), pct: x.total ? Math.round((x.done * 100) / x.total) : 0 }));
});
</script>

<style scoped>
.tiles { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; margin-bottom: 16px; }
.all { display: grid; place-items: center; color: var(--arc-yellow); font: 800 24px var(--font-arc); }
.c-y { --tc: #F5C02A; }
.c-c { --tc: #3BC9E8; }
.c-r { --tc: #E5372B; }
.c-o { --tc: #F28A1E; }
.c-g { --tc: #2FB45A; }
.tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--arc-line);
  background: var(--arc-panel);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.tile:hover { border-color: rgba(242, 235, 221, 0.2); }
.tile[aria-pressed="true"] { border-color: var(--tc, var(--arc-yellow)); background: color-mix(in srgb, var(--tc) 10%, transparent); }
.av { flex: none; width: 44px; height: 44px; padding: 2px; border-radius: 12px; background: var(--tc, var(--arc-line-2)); overflow: hidden; }
.av img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
.tx { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.tx b { font-size: 19px; font-weight: 800; line-height: 1; color: var(--arc-ink); }
.tx > span { font-size: 12px; color: var(--arc-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tb { display: block; height: 5px; margin-top: 4px; border-radius: 5px; background: rgba(242, 235, 221, 0.08); overflow: hidden; }
.tb i { display: block; height: 100%; background: var(--tc); }

@media (max-width: 1100px) {
  .tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .tile { padding: 8px; gap: 8px; }
  .av { width: 36px; height: 36px; border-radius: 10px; }
}
</style>
