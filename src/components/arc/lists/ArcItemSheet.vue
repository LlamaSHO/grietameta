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

    <dl class="stats">
      <div v-for="[label, value] in stats" :key="label"><dt>{{ label }}</dt><dd>{{ value }}</dd></div>
    </dl>

    <template v-for="s in sections" :key="s.title">
      <h3 class="cond">{{ s.title }}</h3>
      <ul class="materials">
        <li v-for="(t, i) in s.rows" :key="i">{{ t }}</li>
      </ul>
    </template>
    <template v-if="item.effects?.length">
      <h3 class="cond">Efectos</h3>
      <ul class="materials"><li v-for="[label, value] in item.effects" :key="label">{{ label }} <b>{{ value }}</b></li></ul>
    </template>
    <p v-if="item.description" class="desc">{{ item.description }}</p>
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
  const rows = [["Valor", fmt(it.value)]];
  if (typeof it.weightKg === "number") rows.push(["Peso", it.weightKg.toLocaleString("es-ES") + " kg"]);
  if (typeof it.stackSize === "number") rows.push(["Pila", "×" + fmt(it.stackSize)]);
  return rows;
});

const mats = (list) => (list || []).map((m) => `${m.name} ×${m.qty}`);
const sections = computed(() => {
  const it = props.item;
  const out = [
    {
      title: "Lo piden",
      rows: (it.neededFor || []).map((n) => `${n.kind}: ${n.name}${n.label ? " " + n.label : ""} (×${n.qty})`),
    },
    { title: it.recycleValue ? `Al reciclarlo da · valor ${fmt(it.recycleValue)}` : "Al reciclarlo da", rows: mats(it.recyclesInto) },
    { title: "Se desguaza en", rows: mats(it.salvagesInto) },
  ];
  if (it.recipe) {
    const bench = it.recipe.bench ? ` (${it.recipe.bench}${it.recipe.level ? " nivel " + it.recipe.level : ""})` : "";
    out.push({ title: "Se fabrica" + bench, rows: mats(it.recipe.materials) });
  }
  return out.filter((s) => s.rows.length);
});
</script>

<style scoped>
.isheet { padding: 22px 24px 26px; }
.top { display: flex; align-items: center; gap: 16px;  }
.top .big { width: 78px; flex-shrink: 0; }
h2 { margin: 0; font-size: 30px; font-weight: 800; line-height: 0.95; }
.imeta { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 8px; font-size: 13px; color: var(--arc-mute); }
.rar { color: var(--rt); font-weight: 600; }
.rec {
  margin: 18px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--ac) 9%, transparent);
  border: 1px solid color-mix(in srgb, var(--ac) 35%, transparent);
  border-top: 3px solid var(--ac);
}
.rec strong { font-size: 22px; font-weight: 800; color: var(--ac); line-height: 1; }
.rec p { margin: 4px 0 0; font-size: 14px; color: var(--arc-ink-2); }
.desc { margin: 14px 0 0; font-size: 14px; color: var(--arc-dim); }



.stats { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 0; }
.stats div { flex: 1; padding: 8px; border-radius: 8px; background: var(--arc-bg); }
.stats dt { color: var(--arc-mute); font-size: 12px; }
.stats dd { margin: 0; font-weight: 700; }
h3 { margin: 16px 0 6px; font: 700 12px var(--font-body); letter-spacing: .07em; font-weight: 800; color: var(--arc-yellow); }
.materials { display: flex; flex-wrap: wrap; gap: 5px; margin: 0; padding: 0; list-style: none; }
.materials li { padding: 4px 6px; border-radius: 6px; background: #1b1921; font-size: 12px; color: var(--arc-ink-2); }
.materials b { color: var(--arc-yellow); }
@media (max-width: 560px) {
  .isheet { padding: 20px 16px 28px; }
  .top .big { width: 80px; }
  h2 { font-size: 26px; }
}
</style>
