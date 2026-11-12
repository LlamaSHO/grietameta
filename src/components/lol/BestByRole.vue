<template>
  <section class="card">
    <div class="card-h"><h3 class="disp">Mejores por rol</h3><span class="meta">{{ rankLabel }}</span></div>
    <div class="w-list">
      <RouterLink v-for="b in best" :key="b.role" class="wl" :to="{ name: 'lol-champion', params: { id: b.e.c.ddId } }">
        <img :src="b.e.c.icon" alt="" loading="lazy" width="38" height="38">
        <span class="tx"><b>{{ b.e.c.name }}</b><span>{{ b.role }}</span></span>
        <span class="tier" :class="b.e.tc">{{ b.e.tier }}</span>
        <span class="rv" :class="wrClass(b.e.wr)">{{ pct(b.e.wr) }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { ROLES } from "@/services/lol/roster";
import { pct, wrClass } from "@/services/lol/format";

const props = defineProps({
  entries: { type: Array, required: true }, // del rango elegido, ordenadas por tier
  rankLabel: { type: String, default: "" },
});
const best = computed(() =>
  ROLES.map((role) => ({ role, e: props.entries.find((e) => e.role === role) })).filter((b) => b.e)
);
</script>
