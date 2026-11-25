<template>
  <article class="quest-detail">
    <header class="detail-head">
      <img v-if="trader.img" :src="trader.img" alt="" width="64" height="64" decoding="async">
      <div>
        <span>{{ quest.trader }} · Misión {{ quest.traderNumber }}</span>
        <h2 :id="titleId" class="cond">{{ quest.name }}</h2>
      </div>
    </header>
    <div class="detail-body">
      <p v-if="st === 'locked'" class="lock">Completa antes: {{ pendingPrev.join(", ") }}.</p>
      <p v-if="quest.description" class="desc">{{ quest.description }}</p>

      <template v-if="quest.objectives.length">
        <h3>Objetivos</h3>
        <ul class="obj">
          <li v-for="(o, i) in quest.objectives" :key="i">
            <label>
              <input type="checkbox" :checked="ticks.includes(i)" @change="progress.toggleObj(quest.id, i)">
              <span :class="{ ticked: ticks.includes(i) }">{{ o }}</span>
            </label>
          </li>
        </ul>
      </template>

      <template v-if="quest.rewards.length || quest.xp">
        <h3>Recompensas</h3>
        <ul class="rewards">
          <li v-for="(reward, index) in quest.rewards" :key="index">
            <ArcItemArt v-if="reward.isItem" :item="{ ...reward, hasImage: true }" />
            <span><b>× {{ fmt(reward.qty) }}</b>{{ reward.name }}</span>
          </li>
          <li v-if="quest.xp">{{ fmt(quest.xp) }} XP</li>
        </ul>
      </template>
      <template v-if="quest.required.length">
        <h3>Guarda esto para la misión</h3>
        <ul class="keep">
          <li v-for="(item, index) in quest.required" :key="index">{{ fmt(item.qty) }} × {{ item.name }}</li>
        </ul>
      </template>
      <template v-if="quest.mapIds.length">
        <h3>Dónde se hace</h3>
        <div class="maplinks">
          <RouterLink v-for="id in quest.mapIds" :key="id" class="maplink" :to="{ ...mapRoute(id), query: { mision: quest.id } }">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
            Ver {{ mapNames[id] || id }} en el mapa →
          </RouterLink>
        </div>
      </template>

      <template v-for="s in sections" :key="s.title">
        <h3>{{ s.title }}</h3>
        <ul><li v-for="(t, i) in s.rows" :key="i">{{ t }}</li></ul>
      </template>
      <template v-for="l in links" :key="l.title">
        <h3>{{ l.title }}</h3>
        <ul>
          <li v-for="id in l.ids" :key="id">
            <button class="linkbtn" type="button" @click="emit('go', id)">{{ byId[id].name }}</button>
            <span v-if="progress.done[id]" class="ok" aria-label="completada"> ✓</span>
          </li>
        </ul>
      </template>
      <div class="actions">
        <button class="finish" type="button" :aria-pressed="st === 'done'" @click="progress.setDone(quest.id, st !== 'done')">
          {{ st === 'done' ? 'Misión completada' : 'Marcar como completada' }}
        </button>
        <button class="btn-s" type="button" :aria-pressed="!!progress.pin[quest.id]" @click="progress.togglePin(quest.id)">
          {{ progress.pin[quest.id] ? 'Dejar de seguir' : 'Seguir misión' }}
        </button>
        <button v-if="progress.hasPendingPrevious(quest.id)" class="btn-s" type="button" @click="progress.markWithPrevious(quest.id)">
          Completar esta y las anteriores
        </button>
      </div>
      <p class="save-note">El progreso se guarda en este navegador.</p>
    </div>
  </article>
</template>
<script setup>
import { computed } from "vue";
import ArcItemArt from "./ArcItemArt.vue";
import { fmt, mapRoute, traderInfo } from "./arcLabels";

const props = defineProps({
  quest: { type: Object, required: true },
  titleId: { type: String, required: true },
  // De useQuestProgress().
  progress: { type: Object, required: true },
  byId: { type: Object, required: true },
  // { id del mapa: nombre }
  mapNames: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["go"]);

const st = computed(() => props.progress.statusOf(props.quest));
const trader = computed(() => traderInfo(props.quest.trader));
const ticks = computed(() => props.progress.obj[props.quest.id] || []);
const pendingPrev = computed(() => props.quest.prev.filter((p) => !props.progress.done[p]).map((p) => props.byId[p].name));

const itemLines = (arr) => arr.map((r) => `${r.name} ×${fmt(r.qty)}`);
const sections = computed(() => {
  const q = props.quest;
  return [
    { title: "Otros requisitos", rows: q.other },
    { title: "Objetos que te da al empezar", rows: itemLines(q.granted) },
  ].filter((s) => s.rows.length);
});
const links = computed(() =>
  [
    { title: "Misiones anteriores", ids: props.quest.prev },
    { title: "Desbloquea", ids: props.quest.next },
  ].filter((l) => l.ids.length)
);
</script>

<style scoped>
.detail-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 42px 14px 18px;
  background: linear-gradient(180deg, rgba(245, 192, 42, .07), transparent);
}
.detail-head img { flex: none; object-fit: cover; object-position: top; border-radius: 10px; }
.detail-head span { color: var(--arc-yellow); font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
h2 { margin: 4px 0 0; font-size: 34px; font-weight: 800; line-height: .95; }
.detail-body { padding: 0 18px 18px; color: var(--arc-ink-2); font-size: 14px; }
.desc { margin: 0; padding: 12px 14px; border-radius: 8px; background: #18171d; font-style: italic; white-space: pre-line; }
.lock { margin: 0 0 10px; color: var(--arc-err); }
h3 { margin: 16px 0 8px; padding-top: 14px; border-top: 1px solid var(--arc-line); color: var(--arc-mute); font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }
ul { margin: 0; padding-left: 20px; }
.obj, .rewards, .keep { padding: 0; list-style: none; }
.obj li + li { margin-top: 8px; }
.obj label { display: flex; align-items: flex-start; gap: 8px; cursor: pointer; }
.obj input { flex: none; width: 16px; height: 16px; margin-top: 3px; accent-color: var(--arc-green); }
.ticked { color: var(--arc-faint); text-decoration: line-through; }
.rewards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.rewards li { display: flex; align-items: center; gap: 6px; padding: 6px; border-radius: 8px; background: #18171d; font-size: 12px; }
.rewards .art { flex: 0 0 42px; border-radius: 6px; }
.rewards b { display: block; color: var(--arc-yellow); }
.keep, .maplinks { display: flex; flex-wrap: wrap; gap: 6px; }
.keep li, .maplink { padding: 6px 8px; border: 1px solid var(--arc-line-2); border-radius: 6px; font-size: 12px; }
.keep li { background: rgba(245, 192, 42, .09); color: #ffe9a8; }
.maplink { display: inline-flex; align-items: center; gap: 6px; background: #18171d; text-decoration: none; }
.linkbtn { padding: 0; border: 0; background: none; color: var(--arc-yellow); text-decoration: underline; cursor: pointer; text-align: left; }
.ok { color: #7fd9a0; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.actions .finish {
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  background: var(--arc-yellow);
  color: #17130a;
  font-weight: 700;
  cursor: pointer;
}
.actions .finish[aria-pressed="true"] { background: #1f4d33; color: #dffbea; }
.save-note { margin: 10px 0 0; color: var(--arc-mute); text-align: center; font-size: 12px; }
</style>
