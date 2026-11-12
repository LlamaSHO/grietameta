<template>
  <section class="card" aria-labelledby="run-h">
    <div class="card-h"><h2 id="run-h" class="disp">Runas</h2><span class="meta">Más usadas</span></div>
    <div v-if="runes" class="tree">
      <div class="tree-h">
        <img v-if="primary?.icon" :src="runeIconUrl(primary.icon)" alt="">
        {{ runes.primaryTree }} · principal
      </div>
      <div class="ks">
        <span v-for="k in keystones" :key="k.name" class="k1" :class="{ on: k.on }">
          <img :src="k.icon" alt="">{{ k.name }}
        </span>
      </div>
      <div v-if="runes.secondaryTree" class="sec">
        <img v-if="secondary?.icon" :src="runeIconUrl(secondary.icon)" alt="">
        <span>Rama secundaria: <b>{{ runes.secondaryTree }}</b></span>
      </div>
    </div>
    <p v-else class="loading">{{ emptyText }}</p>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { runeIconUrl } from "@/services/lol/ddragon";
import { normalizeSearch } from "@/services/lol/format";

const props = defineProps({
  runes: { type: Object, default: null }, // { keystone, icon, primaryTree, secondaryTree }
  trees: { type: Array, default: () => [] }, // runesReforged.json (es_ES)
  emptyText: { type: String, default: "Aún no hay partidas suficientes para recomendar runas." },
});

const same = (a, b) => normalizeSearch(a || "") === normalizeSearch(b || "");
const primary = computed(() => {
  const r = props.runes;
  if (!r) return null;
  return (
    props.trees.find((t) => same(t.name, r.primaryTree)) ||
    props.trees.find((t) => t.slots?.[0]?.runes?.some((k) => same(k.name, r.keystone))) ||
    null
  );
});
const secondary = computed(() => props.trees.find((t) => same(t.name, props.runes?.secondaryTree)) || null);

// Las piedras angulares de la rama principal, con la elegida resaltada. Si no
// se ha podido leer runesReforged.json, solo se enseña la elegida.
const keystones = computed(() => {
  const r = props.runes;
  if (!r) return [];
  const list = primary.value?.slots?.[0]?.runes || [];
  if (!list.length) return r.icon ? [{ name: r.keystone, icon: runeIconUrl(r.icon), on: true }] : [];
  return list.map((k) => ({ name: k.name, icon: runeIconUrl(k.icon), on: same(k.name, r.keystone) }));
});
</script>

<style scoped>
.tree { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 16px; }
.tree-h { display: flex; align-items: center; gap: 10px; font-weight: 600; }
.tree-h img { width: 28px; height: 28px; }
.ks { display: flex; gap: 12px; flex-wrap: wrap; }
.k1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 72px;
  font-size: 11.5px;
  text-align: center;
  color: var(--ink-faint);
}
.k1 img {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  padding: 3px;
  background: #0A0C10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  filter: grayscale(1) brightness(0.55);
  transition: filter 0.2s;
}
.k1:hover img { filter: grayscale(0.3) brightness(0.85); }
.k1.on { color: var(--accent); font-weight: 600; }
.k1.on img { filter: none; border-color: rgba(226, 181, 102, 0.7); box-shadow: 0 0 22px -4px rgba(226, 181, 102, 0.8); }
.sec {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13.5px;
  color: #C6CBD2;
}
.sec img { width: 30px; height: 30px; }
.sec b { color: var(--ink); }
@media (max-width: 560px) {
  .tree { padding: 0 16px 18px; }
  .ks { gap: 8px; }
  .k1 { width: 64px; }
  .k1 img { width: 46px; height: 46px; }
}
</style>
