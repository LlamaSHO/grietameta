<template>
  <section class="card">
    <div class="card-h"><h3 class="disp">Más baneados</h3><span class="meta">{{ rankLabel }}</span></div>
    <div class="w-list">
      <RouterLink v-for="(x, i) in bans" :key="x.id" class="ban" :to="{ name: 'lol-champion', params: { id: x.c.ddId } }">
        <span class="pos">{{ i + 1 }}</span>
        <img :src="x.c.icon" alt="" loading="lazy" width="32" height="32">
        <span class="tx"><b>{{ x.c.name }}</b><span class="bb"><i :style="{ width: `${((x.br / max) * 100).toFixed(0)}%` }"></i></span></span>
        <span class="rv">{{ pct(x.br) }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { pct } from "@/services/lol/format";

const props = defineProps({
  entries: { type: Array, required: true },
  rankLabel: { type: String, default: "" },
});
const bans = computed(() => props.entries.slice().sort((a, b) => b.br - a.br).slice(0, 5));
const max = computed(() => bans.value[0]?.br || 1);
</script>

<style scoped>
.ban {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s;
}
.lol-page .ban,
.lol-page .ban:hover { color: var(--ink); }
.ban:hover { background: rgba(255, 255, 255, 0.04); }
.pos { width: 18px; font-size: 12px; font-weight: 700; color: var(--ink-faint); }
.ban img { width: 32px; height: 32px; border-radius: 9px; }
.tx { flex: 1; min-width: 0; }
.tx b { display: block; font-size: 13.5px; font-weight: 600; }
.bb { display: block; height: 5px; border-radius: 5px; background: rgba(255, 255, 255, 0.06); margin-top: 5px; overflow: hidden; }
.bb i { display: block; height: 100%; border-radius: 5px; background: linear-gradient(90deg, #B4554A, #F08A7A); transition: width 0.6s var(--ease-out); }
.rv { font-size: 13px; font-weight: 600; color: #F08A7A; min-width: 48px; text-align: right; }
</style>
