<template>
  <!-- Contenido de la ficha de un ARC: imagen, amenaza, punto débil, datos,
       mejores armas y balas, y botín. -->
  <div class="esheet">
    <div class="hero">
      <img v-if="enemy.hasImage && !imgFailed" :src="arcBotImageUrl(enemy.id)" alt="" decoding="async" @error="imgFailed = true">
      <div class="heading">
        <span class="thr" :class="threatClass(enemy.threat)">{{ enemy.threatEs || threatLabel(enemy.threat) }}</span>
        <h2 :id="titleId" class="cond">{{ enemy.name }}</h2>
        <span class="type">{{ enemy.type }}</span>
      </div>
    </div>
    <div class="in">
      <template v-if="enemy.armor">
        <h3 class="cond">Blindaje</h3>
        <div class="armor-label"><ArcArmorMeter :level="enemy.armorLevel" /><b>{{ enemy.armorLabel }}</b></div>
        <p class="armor">{{ enemy.armorNote }}</p>
      </template>
      <template v-if="enemy.weakness">
        <h3 class="cond">Dónde darle</h3>
        <p class="weak">{{ enemy.weakness }}</p>
      </template>
      <template v-if="(enemy.weapons || []).length">
        <h3 class="cond">Armas que funcionan</h3>
        <ul class="rows">
          <li v-for="(w, i) in enemy.weapons" :key="w.id" class="row" :class="[rarityClass(w.rarity), { best: i === 0 }]">
            <ArcItemArt :item="{ id: w.icon, name: w.name, hasImage: !!w.icon, rarity: w.rarity }" class="ic" />
            <span class="t">{{ w.name }}<small>{{ w.type }} · penetración {{ (w.penEs || "").toLowerCase() }}</small></span>
            <span v-if="i === 0" class="tag">La mejor</span>
          </li>
        </ul>
      </template>

      <template v-if="(enemy.drops || []).length">
        <h3 class="cond">Botín ({{ enemy.drops.length }})</h3>
        <ul class="drops">
          <li v-for="d in enemy.drops" :key="d.id" class="row" :class="rarityClass(d.rarity)">
            <ArcItemArt :item="d" class="ic" />
            <span class="t">
              {{ d.name }}
              <small><span class="rar">{{ rarityLabel(d.rarity) }}</span> · {{ fmtN(d.value) }} · <span class="ac" :class="actionClass(d.action)">{{ d.action }}</span></small>
            </span>
          </li>
        </ul>
        <p class="note">El botín listado es el de la lista de datos del juego: no todos los objetos caen siempre. La acción (Guardar, Reciclar, Vender o Usar) es la misma recomendación de la página de Objetos.</p>
      </template>
      <dl class="facts">
        <div><dt>Dónde aparece</dt><dd>{{ (enemy.maps || []).join(", ") || "—" }}</dd></div>
        <div><dt>XP al destruirlo</dt><dd>{{ fmtN(enemy.destroyXp) }}</dd></div>
        <div><dt>XP al saquearlo</dt><dd>{{ fmtN(enemy.lootXp) }}</dd></div>
      </dl>
      <div v-if="mapLinks.length" class="maplinks">
        <RouterLink v-for="m in mapLinks" :key="m.id" class="maplink" :to="{ ...mapRoute(m.id), query: { enemigo: enemy.id } }">{{ m.name }} →</RouterLink>
      </div>

      <template v-if="(enemy.ammo || []).length">
        <h3 class="cond">Mejores balas</h3>
        <ul class="rows">
          <li v-for="a in enemy.ammo" :key="a.id" class="row">
            <ArcItemArt :item="{ id: a.id, name: a.name, hasImage: a.hasImage, rarity: 'common' }" class="ic" />
            <span class="t">{{ a.name }}<small>Valor: {{ fmtN(a.value) }} por unidad</small></span>
          </li>
        </ul>
      </template>

      <p v-if="enemy.description" class="desc">{{ enemy.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import ArcArmorMeter from "./ArcArmorMeter.vue";
import ArcItemArt from "./ArcItemArt.vue";
import { arcBotImageUrl } from "@/services/arcRaiders";
import { MAP_INFO, actionClass, mapRoute, rarityClass, rarityLabel, threatClass, threatLabel } from "./arcLabels";

const props = defineProps({
  enemy: { type: Object, required: true },
  titleId: { type: String, required: true },
});
const imgFailed = ref(false);
watch(() => props.enemy.id, () => (imgFailed.value = false));

const fmtN = (n) => (typeof n === "number" ? n.toLocaleString("es-ES") : n ?? "—");

// Enlaces al visor de los mapas donde aparece (por nombre del mapa).
const mapLinks = computed(() => MAP_INFO.filter((m) => (props.enemy.maps || []).includes(m.name)));
</script>

<style scoped>
.hero { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #100E14; }
.hero img { width: 100%; height: 100%; object-fit: cover; }
.hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 50%, var(--arc-panel)); }
.heading { position: absolute; z-index: 1; left: 18px; right: 48px; bottom: 12px; }
.heading .thr { background: #100e14; }
.heading h2 { margin-top: 6px; color: #fff; }
.type { color: var(--arc-ink-2); font-size: 13px; }
.armor-label { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 8px; }
.in { padding: 4px 18px 20px; }
.in > h3:first-child { margin-top: 0; }
.esheet:not(:has(.hero)) .in { padding-top: 26px; }
h2 { margin: 0; font-size: 36px; font-weight: 800; line-height: 0.95; }
.desc { margin: 14px 0 0; font-size: 14px; color: var(--arc-dim); }
.weak {
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(245, 192, 42, 0.06);
  border: 1px solid rgba(245, 192, 42, 0.2);
  font-size: 14px;
  color: var(--arc-ink-2);
}
.weak b { color: var(--arc-yellow); font-weight: 600; }
.facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin: 14px 0 0; }
.facts div { padding: 10px 12px; border-radius: 10px; background: rgba(242, 235, 221, 0.04); }
.facts dt { font-size: 11.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--arc-faint); }
.facts dd { margin: 2px 0 0; font-size: 14px; font-weight: 600; color: var(--arc-ink); }
.maplinks { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.esheet .maplink {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 11px;
  border-radius: 9px;
  border: 1px solid rgba(59, 201, 232, 0.35);
  background: rgba(59, 201, 232, 0.08);
  color: #7FD6F0;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}
.esheet .maplink:hover { color: #BDEBF7; border-color: var(--arc-cyan); }
h3 { margin: 15px 0 8px; font: 700 12px var(--font-body); letter-spacing: .1em; color: var(--arc-mute); }
.armor { margin: 0 0 8px; font-size: 13.5px; color: var(--arc-dim); }
.rows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.row { display: flex; align-items: center; gap: 12px; padding: 7px 8px; border-radius: 12px; background: rgba(242, 235, 221, 0.03); }
.row.best { background: rgba(47, 180, 90, 0.1); box-shadow: inset 0 0 0 1px rgba(47, 180, 90, 0.4); }
.row .ic { width: 44px; flex-shrink: 0; border-radius: 10px; }
.row .ic :deep(.ph) { font-size: 20px; }
.drops { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(67px, 100%), 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
.drops .row { flex-direction: column; align-items: center; gap: 4px; padding: 6px; text-align: center; }
.drops .t { font-size: 12px; overflow-wrap: anywhere; }
.drops .t small { font-size: 10px; }
.t { flex: 1; min-width: 0; font-size: 14px; font-weight: 600; color: var(--arc-ink); }
.t small { display: block; font-size: 12px; font-weight: 500; color: var(--arc-faint); }
.rar { color: var(--rt); }
.ac { color: var(--ac); font-weight: 700; }
.tag { flex: none; padding: 2px 8px; border-radius: 6px; background: rgba(47, 180, 90, 0.18); color: #7FD9A0; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.note { margin: 12px 0 0; font-size: 12.5px; color: var(--arc-faint); }
@media (max-width: 560px) {
  .hero { min-height: 170px; }
  .heading { position: absolute; z-index: 1; left: 18px; right: 48px; bottom: 12px; }
.heading .thr { background: #100e14; }
.heading h2 { margin-top: 6px; color: #fff; }
.type { color: var(--arc-ink-2); font-size: 13px; }
.armor-label { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 8px; }
.in { padding: 16px 16px 28px; }
  h2 { font-size: 30px; }
}
</style>
