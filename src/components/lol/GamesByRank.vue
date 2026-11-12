<template>
  <!-- Partidas analizadas por rango. Pulsar un rango filtra la tier list. -->
  <section class="card">
    <div class="card-h"><h3 class="disp">Partidas por rango</h3></div>
    <div class="ranks">
      <button
        v-for="r in bars"
        :key="r.key"
        type="button"
        class="rb"
        :class="{ on: r.key === modelValue }"
        :aria-pressed="r.key === modelValue ? 'true' : 'false'"
        :disabled="!r.m"
        @click="emit('update:modelValue', r.key === modelValue ? 'ALL' : r.key)"
      >
        <span class="lb"><img class="rbimg" :src="r.img" alt="">{{ r.label }}</span>
        <span class="tr2"><i :style="{ width: r.w, background: r.color }"></i></span>
        <span class="ct">{{ fmtInt(r.m) }}</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { RANKS } from "@/services/lol/roster";
import { fmtInt } from "@/services/lol/format";

const props = defineProps({
  modelValue: { type: String, default: "ALL" },
  matches: { type: Function, required: true }, // (rango) => partidas
});
const emit = defineEmits(["update:modelValue"]);

const bars = computed(() => {
  const list = RANKS.slice(1).map((r) => ({ ...r, m: props.matches(r.key) }));
  const max = Math.max(1, ...list.map((r) => r.m));
  return list.map((r) => ({ ...r, w: `${((r.m / max) * 100).toFixed(0)}%` }));
});
</script>

<style scoped>
.ranks { display: flex; flex-direction: column; gap: 4px; padding: 0 12px 14px; }
.rb {
  display: grid;
  grid-template-columns: 104px 1fr 52px;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 10px;
  border: 0;
  background: transparent;
  color: #C6CBD2;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}
.rb:hover:not(:disabled) { background: rgba(255, 255, 255, 0.04); }
.rb.on { background: rgba(226, 181, 102, 0.1); color: var(--ink); }
.rb:disabled { opacity: 0.45; cursor: default; }
.lb { display: flex; align-items: center; gap: 8px; }
.rbimg { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
.tr2 { height: 8px; border-radius: 8px; background: rgba(255, 255, 255, 0.05); overflow: hidden; }
.tr2 i { display: block; height: 100%; border-radius: 8px; opacity: 0.85; transition: width 0.6s var(--ease-out); }
.ct { font-size: 12px; color: var(--ink-mute); text-align: right; }
</style>
