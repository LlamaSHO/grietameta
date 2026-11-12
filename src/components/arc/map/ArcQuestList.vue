<template>
  <!-- Pestaña Misiones del panel: filtro por comerciante y lista. -->
  <div class="qwrap">
    <div class="filt" role="group" aria-label="Filtrar por comerciante">
      <button
        v-for="f in filters"
        :key="f.name"
        type="button"
        class="fc"
        :class="[f.cls, { on: f.name === trader }]"
        :aria-pressed="f.name === trader"
        @click="$emit('update:trader', f.name)"
      >
        <i v-if="f.cls" aria-hidden="true"></i>{{ f.name }} · <span class="num">{{ f.count }}</span>
      </button>
    </div>

    <div class="list">
      <article
        v-for="q in rows"
        :key="q.quest.id"
        :ref="(el) => setRow(q.quest.id, el)"
        class="q"
        :class="[q.quest.traderCls, { sel: q.quest.id === selectedId }]"
      >
        <button type="button" class="qbtn" :aria-expanded="q.quest.id === selectedId" @click="$emit('select', q.quest.id)">
          <img class="qav" :src="q.quest.portrait" alt="" loading="lazy">
          <span class="qt">
            <span class="q-h"><b>{{ q.quest.name }}</b><span class="tp">{{ q.quest.trader }}</span></span>
            <span v-if="q.quest.id !== selectedId && q.quest.objectives[0]" class="qo">{{ q.quest.objectives[0] }}</span>
          </span>
        </button>
        <template v-if="q.quest.id === selectedId">
          <ol>
            <li v-for="(o, i) in q.quest.objectives" :key="i">{{ o }}</li>
          </ol>
          <!-- La lista de misiones acepta ?mapa=<id>&comerciante=<nombre> como filtros. -->
          <RouterLink class="more" :to="{ name: 'arc-quests', query: { mapa: mapId || undefined, comerciante: q.quest.trader } }">
            Seguir esta misión en la lista de misiones →
          </RouterLink>
        </template>
        <div class="ft">
          <span class="pts" :class="{ no: !q.count }">{{ q.status }}</span>
          <span>{{ q.quest.rewardText ? "Recompensa: " + q.quest.rewardText : "Sin recompensa de objetos" }}</span>
        </div>
      </article>

      <div v-if="!rows.length" class="none">No hay misiones de este comerciante en {{ mapName }}.</div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, watch } from "vue";

const props = defineProps({
  // [{ quest, count, status }] ya filtradas por comerciante
  rows: { type: Array, required: true },
  // [{ name, count, cls }]
  filters: { type: Array, required: true },
  trader: { type: String, default: "Todos" },
  selectedId: { type: String, default: "" },
  mapName: { type: String, default: "" },
  mapId: { type: String, default: "" },
});
defineEmits(["update:trader", "select"]);

// Al elegir una misión desde el mapa, la lista la enseña.
const rowEls = new Map();
function setRow(id, el) {
  if (el) rowEls.set(id, el);
  else rowEls.delete(id);
}
watch(
  () => props.selectedId,
  async (id) => {
    if (!id) return;
    await nextTick();
    const el = rowEls.get(id);
    const list = el?.parentElement;
    if (!el || !list) return;
    // Solo se desplaza la lista (no la página); .list es el offsetParent.
    const top = Math.max(0, el.offsetTop - 10);
    if (top < list.scrollTop || top + el.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = top;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.qwrap {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
.filt {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(242, 235, 221, 0.06);
}
.fc {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(242, 235, 221, 0.12);
  background: transparent;
  color: var(--am-mute);
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}
.fc:hover {
  color: var(--am-ink);
}
.fc.on {
  background: rgba(245, 192, 42, 0.14);
  border-color: rgba(245, 192, 42, 0.5);
  color: var(--am-yellow);
}
.fc i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tc);
}
.fc:focus-visible,
.qbtn:focus-visible {
  outline: 2px solid var(--am-yellow);
  outline-offset: 2px;
}
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
.q {
  padding: 12px 12px 12px 14px;
  border-radius: 12px;
  background: var(--am-card);
  border: 1px solid var(--am-line-soft);
  animation: am-pop 0.25s ease-out both;
  transition: border-color 0.2s;
}
.q:hover {
  border-color: rgba(245, 192, 42, 0.35);
}
.q.sel {
  border-color: rgba(245, 192, 42, 0.65);
  background: var(--am-card-sel);
}
.qbtn {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.qav {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid var(--tc);
  flex-shrink: 0;
}
.qt {
  flex: 1;
  min-width: 0;
}
.q-h {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.q-h b {
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.3;
}
.tp {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--tc);
  background: rgba(242, 235, 221, 0.06);
}
.tp::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tc);
}
.qo {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--am-dim);
}
.q ol {
  margin: 10px 0 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.45;
  color: #d8d1c5;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.more {
  display: inline-block;
  margin-top: 8px;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
}
.ft {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--am-faint);
}
.ft span:last-child {
  color: var(--am-ink-2);
  text-align: right;
}
.pts {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--am-yellow);
  font-weight: 600;
  flex-shrink: 0;
}
.pts.no {
  color: var(--am-faint);
  font-weight: 500;
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
@media (max-width: 860px) {
  .ft {
    flex-direction: column;
    gap: 2px;
  }
  .ft span:last-child {
    text-align: left;
  }
}
</style>
