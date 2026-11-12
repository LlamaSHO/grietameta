<template>
  <!-- Contenido de la ficha de un objeto: recomendación y su porqué,
       descripción, valores, para qué se necesita, reciclaje y receta. -->
  <div class="isheet" :class="rarityClass(item.rarity)">
    <div class="top">
      <ArcItemArt :item="item" class="big" />
      <div class="ttl">
        <h2 :id="titleId" class="cond">{{ item.name }}</h2>
        <div class="imeta">
          <span class="rar">{{ rarityLabel(item.rarity) }}</span>
          <span v-if="item.type">{{ typeEs(item.type) }}</span>
        </div>
      </div>
    </div>

    <div class="rec" :class="actionClass(item.action)">
      <strong class="cond">{{ item.action }}</strong>
      <p>{{ item.reason }}</p>
    </div>

    <p v-if="item.description" class="desc">{{ item.description }}</p>

    <table class="stats">
      <tbody>
        <tr v-for="r in stats" :key="r[0]"><td>{{ r[0] }}</td><td>{{ r[1] }}</td></tr>
      </tbody>
    </table>

    <template v-for="s in sections" :key="s.title">
      <h3 class="cond">{{ s.title }}</h3>
      <ul>
        <li v-for="(t, i) in s.rows" :key="i">{{ t }}</li>
      </ul>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ArcItemArt from "./ArcItemArt.vue";
import { actionClass, fmt, rarityClass, rarityLabel, typeEs } from "./arcLabels";

const props = defineProps({
  item: { type: Object, required: true },
  titleId: { type: String, required: true },
});

const stats = computed(() => {
  const it = props.item;
  const rows = [["Valor de venta", fmt(it.value)]];
  if (it.recycleValue) rows.push(["Valor de lo que da al reciclar", fmt(it.recycleValue)]);
  if (typeof it.weightKg === "number") rows.push(["Peso", it.weightKg.toLocaleString("es-ES") + " kg"]);
  if (typeof it.stackSize === "number") rows.push(["Pila máxima", fmt(it.stackSize)]);
  (it.effects || []).forEach((e) => rows.push([e[0], e[1]]));
  return rows;
});

const mats = (list) => (list || []).map((m) => `${m.name} ×${m.qty}`);
const sections = computed(() => {
  const it = props.item;
  const out = [
    {
      title: "Necesario para",
      rows: (it.neededFor || []).map((n) => `${n.kind}: ${n.name}${n.label ? " " + n.label : ""} (×${n.qty})`),
    },
    { title: "Se recicla en", rows: mats(it.recyclesInto) },
    { title: "Se desguaza en", rows: mats(it.salvagesInto) },
  ];
  if (it.recipe) {
    const bench = it.recipe.bench ? ` (${it.recipe.bench}${it.recipe.level ? " nivel " + it.recipe.level : ""})` : "";
    out.push({ title: "Se fabrica con" + bench, rows: mats(it.recipe.materials) });
  }
  return out.filter((s) => s.rows.length);
});
</script>

<style scoped>
.isheet { padding: 22px 24px 26px; }
.top { display: flex; align-items: center; gap: 16px; padding-right: 44px; }
.top .big { width: 104px; flex-shrink: 0; }
h2 { margin: 0; font-size: 32px; font-weight: 800; line-height: 0.95; }
.imeta { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 8px; font-size: 13px; color: var(--arc-mute); }
.rar { color: var(--rt); font-weight: 600; }
.rec {
  margin: 18px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--ac) 9%, transparent);
  border: 1px solid color-mix(in srgb, var(--ac) 35%, transparent);
  border-left: 4px solid var(--ac);
}
.rec strong { font-size: 22px; font-weight: 800; color: var(--ac); line-height: 1; }
.rec p { margin: 4px 0 0; font-size: 14px; color: var(--arc-ink-2); }
.desc { margin: 14px 0 0; font-size: 14px; color: var(--arc-dim); }
.stats { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 14px; }
.stats td { padding: 7px 0; border-top: 1px solid var(--arc-line); color: var(--arc-dim); }
.stats td:last-child { text-align: right; font-weight: 600; color: var(--arc-ink); }
h3 { margin: 20px 0 6px; font-size: 18px; font-weight: 800; color: var(--arc-yellow); }
ul { margin: 0; padding-left: 20px; color: var(--arc-ink-2); font-size: 14px; }
li { margin: 3px 0; }
@media (max-width: 560px) {
  .isheet { padding: 20px 16px 28px; }
  .top .big { width: 80px; }
  h2 { font-size: 26px; }
}
</style>
