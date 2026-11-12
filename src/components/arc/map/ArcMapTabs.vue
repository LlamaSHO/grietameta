<template>
  <!-- Selector de mapas: cada pestaña cambia :mapa en la URL. -->
  <nav ref="nav" class="tabs" aria-label="Mapas de ARC Raiders">
    <RouterLink
      v-for="m in maps"
      :key="m.id"
      class="mt"
      :class="{ on: m.id === currentId }"
      :to="{ name: 'arc-map', params: { mapa: m.id } }"
      :aria-current="m.id === currentId ? 'page' : undefined"
      @click="$emit('pick', m.id)"
    >
      <img :src="m.views[0]?.thumb" alt="" loading="lazy" decoding="async" draggable="false">
      <b class="cond">{{ m.name }}</b>
      <span><span class="num">{{ m.questCount }}</span> {{ m.questCount === 1 ? "misión" : "misiones" }}</span>
      <span class="bar" aria-hidden="true"></span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from "vue";

const props = defineProps({
  // [{ id, name, views, questCount }]
  maps: { type: Array, required: true },
  currentId: { type: String, default: "" },
});
defineEmits(["pick"]);

// En móvil las pestañas son un carrusel: se desplaza hasta la del mapa abierto.
const nav = ref(null);
async function showCurrent() {
  await nextTick();
  const box = nav.value;
  const el = box?.querySelector(".mt.on");
  if (!box || !el || box.scrollWidth <= box.clientWidth) return;
  const left = el.offsetLeft; // .tabs es el offsetParent (position: relative)
  if (left < box.scrollLeft || left + el.offsetWidth > box.scrollLeft + box.clientWidth) {
    box.scrollLeft = Math.max(0, left - 16);
  }
}
onMounted(showCurrent);
watch(() => props.currentId, showCurrent);
</script>

<style scoped>
.tabs {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(170px, 100%), 1fr));
  gap: 10px;
  padding: 22px 0 0;
}
.mt {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 96px;
  padding: 10px 12px;
  border-radius: 14px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid var(--am-line);
  background: var(--am-panel);
  color: var(--am-ink);
  text-align: left;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}
.mt:hover {
  color: var(--am-ink);
  transform: translateY(-2px);
  border-color: rgba(242, 235, 221, 0.3);
}
.mt:focus-visible {
  outline: 2px solid var(--am-yellow);
  outline-offset: 2px;
}
.mt img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  filter: saturate(0.7) brightness(0.55);
  transform: scale(1.3);
  transition: transform 0.6s, filter 0.4s;
}
.mt::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, transparent, rgba(11, 10, 14, 0.9));
}
.mt:hover img {
  transform: scale(1.45);
  filter: saturate(0.9) brightness(0.7);
}
.mt b {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}
.mt > span:not(.bar) {
  font-size: 12px;
  color: var(--am-dim);
}
.mt.on {
  border-color: var(--am-yellow);
  box-shadow: 0 0 0 1px var(--am-yellow), 0 20px 40px -24px rgba(245, 192, 42, 0.7);
}
.mt.on img {
  filter: saturate(1) brightness(0.75);
}
.bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--am-stripe);
  opacity: 0;
  transition: opacity 0.2s;
}
.mt.on .bar {
  opacity: 1;
}

/* Móvil: carrusel horizontal en vez de rejilla. */
@media (max-width: 640px) {
  .tabs {
    display: flex;
    gap: 8px;
    padding-top: 16px;
    margin: 0 -16px;
    padding-inline: 16px;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  .mt {
    flex: 0 0 148px;
    height: 76px;
    scroll-snap-align: start;
  }
  .mt b {
    font-size: 18px;
  }
}
</style>
