<template>
  <!-- Pestaña Enemigos del panel: al tocar un ARC se pinta su mapa de calor. -->
  <div ref="listEl" class="list">
    <div v-for="r in rows" :key="r.enemy.id" class="e" :class="{ sel: r.enemy.id === selectedId }">
      <button type="button" class="ebtn" :aria-pressed="r.enemy.id === selectedId" @click="$emit('select', r.enemy.id)">
        <img v-if="r.enemy.img" :src="r.enemy.img" alt="" loading="lazy">
        <span v-else class="noimg" aria-hidden="true"></span>
        <span class="tx">
          <b class="cond">{{ r.enemy.name }}</b>
          <span class="thr" :class="r.enemy.threatCls">{{ r.enemy.threat }}</span>
          <span class="ty">{{ r.enemy.type }}</span>
          <span v-if="r.enemy.weakness" class="wk">{{ r.enemy.weakness }}</span>
          <span class="zn" :class="{ no: !r.count }"><i v-if="r.count" aria-hidden="true"></i>{{ r.status }}</span>
        </span>
      </button>
      <RouterLink v-if="r.enemy.id === selectedId" class="more" :to="{ name: 'arc-enemies', query: { ver: r.enemy.id } }">
        Ficha completa: botín, armas y balas →
      </RouterLink>
    </div>

    <div v-if="!rows.length" class="none">Todavía no tenemos datos de los ARC de {{ mapName }}.</div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";

const props = defineProps({
  // [{ enemy, count, status }]
  rows: { type: Array, required: true },
  selectedId: { type: String, default: "" },
  mapName: { type: String, default: "" },
});
defineEmits(["select"]);

// Con un enemigo en la URL, la lista lo enseña (solo se desplaza la lista).
const listEl = ref(null);
watch(
  () => props.selectedId,
  async (id) => {
    if (!id) return;
    await nextTick();
    const list = listEl.value;
    const el = list?.querySelector(".e.sel");
    if (!el || !list.clientHeight) return;
    const top = Math.max(0, el.offsetTop - 10);
    if (top < list.scrollTop || top + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top;
  },
  { immediate: true },
);
</script>

<style scoped>
.list {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
}
.e {
  border-radius: 12px;
  background: var(--am-card);
  border: 1px solid var(--am-line-soft);
  animation: am-pop 0.25s ease-out both;
  transition: border-color 0.2s, background 0.2s;
}
.e:hover {
  border-color: rgba(255, 92, 48, 0.45);
}
.e.sel {
  border-color: rgba(255, 92, 48, 0.75);
  background: #21161a;
}
.ebtn {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: 0;
  background: none;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.ebtn:focus-visible {
  outline: 2px solid var(--am-yellow);
  outline-offset: -2px;
  border-radius: 12px;
}
.ebtn img,
.noimg {
  width: 84px;
  height: 60px;
  border-radius: 9px;
  object-fit: cover;
  flex-shrink: 0;
  background: #1f1c25;
}
.tx {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.tx b {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}
.ty {
  font-size: 12px;
  color: var(--am-mute);
}
.wk {
  font-size: 12.5px;
  color: var(--am-dim);
}
.zn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #ff8a66;
}
.zn.no {
  color: var(--am-faint);
  font-weight: 500;
}
.zn i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--am-heat);
  box-shadow: 0 0 6px var(--am-heat);
}
.more {
  display: block;
  padding: 0 12px 10px 106px;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
}
.none {
  padding: 28px 16px;
  text-align: center;
  color: var(--am-mute);
  font-size: 14px;
}

@media (max-width: 1040px) {
  .list {
    max-height: 560px;
  }
}
@media (max-width: 560px) {
  .ebtn img,
  .noimg {
    width: 64px;
    height: 48px;
  }
  .more {
    padding-left: 86px;
  }
}
</style>
