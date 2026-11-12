<template>
  <!-- Una misión de la lista: casilla de completada, nombre y datos, estado,
       estrella para seguirla y, desplegada, objetivos (marcables), mapas,
       objetos, recompensas y misiones anteriores / siguientes. -->
  <article class="q" :class="st" :data-id="quest.id">
    <div class="qrow">
      <label class="ck">
        <input type="checkbox" :checked="st === 'done'" :aria-label="`Marcar «${quest.name}» como completada`" @change="progress.setDone(quest.id, $event.target.checked)">
        <span aria-hidden="true"></span>
      </label>
      <span class="av" :class="trader.cls" aria-hidden="true"><img v-if="trader.img" :src="trader.img" alt="" loading="lazy" width="30" height="30"></span>
      <button class="qhead" type="button" :aria-expanded="String(open)" @click="emit('toggle')">
        <span class="qname">{{ quest.name }}</span>
        <span class="qmeta">{{ meta }}</span>
      </button>
      <span class="pill" :class="st">{{ STATUS_LABEL[st] }}</span>
      <button
        class="star"
        type="button"
        :aria-pressed="String(!!progress.pin[quest.id])"
        :aria-label="`${progress.pin[quest.id] ? 'Dejar de seguir' : 'Seguir'} «${quest.name}»`"
        :title="progress.pin[quest.id] ? 'Dejar de seguir' : 'Seguir esta misión'"
        @click="progress.togglePin(quest.id)"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" :fill="progress.pin[quest.id] ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2.5 15 8.8 21.8 9.6 16.8 14.3 18.1 21.1 12 17.8 5.9 21.1 7.2 14.3 2.2 9.6 9 8.8" /></svg>
      </button>
    </div>

    <div v-if="open" class="qbody">
      <p v-if="st === 'locked'" class="lock">Completa antes: {{ pendingPrev.join(", ") }}.</p>
      <p v-if="quest.description" class="desc">{{ quest.description }}</p>

      <template v-if="quest.objectives.length">
        <h3 class="cond">Objetivos</h3>
        <ul class="obj">
          <li v-for="(o, i) in quest.objectives" :key="i">
            <label>
              <input type="checkbox" :checked="ticks.includes(i)" @change="progress.toggleObj(quest.id, i)">
              <span :class="{ ticked: ticks.includes(i) }">{{ o }}</span>
            </label>
          </li>
        </ul>
      </template>

      <template v-if="quest.mapIds.length">
        <h3 class="cond">Dónde se juega</h3>
        <div class="maplinks">
          <RouterLink v-for="id in quest.mapIds" :key="id" class="maplink" :to="mapRoute(id)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
            Ver {{ mapNames[id] || id }} en el mapa →
          </RouterLink>
        </div>
      </template>

      <template v-for="s in sections" :key="s.title">
        <h3 class="cond">{{ s.title }}</h3>
        <ul>
          <li v-for="(t, i) in s.rows" :key="i">{{ t }}</li>
        </ul>
      </template>

      <template v-for="l in links" :key="l.title">
        <h3 class="cond">{{ l.title }}</h3>
        <ul>
          <li v-for="id in l.ids" :key="id">
            <button class="linkbtn" type="button" @click="emit('go', id)">{{ byId[id].name }}</button>
            <span v-if="progress.done[id]" class="ok" aria-label="completada"> ✓</span>
          </li>
        </ul>
      </template>

      <button v-if="progress.hasPendingPrevious(quest.id)" class="btn-s markall" type="button" @click="progress.markWithPrevious(quest.id)">
        Marcar esta y todas las anteriores como completadas
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { fmt, mapRoute, traderInfo } from "./arcLabels";

const STATUS_LABEL = { done: "Completada", avail: "Disponible", locked: "Bloqueada" };

const props = defineProps({
  quest: { type: Object, required: true },
  open: { type: Boolean, default: false },
  // De useQuestProgress().
  progress: { type: Object, required: true },
  byId: { type: Object, required: true },
  // { id del mapa: nombre }
  mapNames: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["toggle", "go"]);

const st = computed(() => props.progress.statusOf(props.quest));
const trader = computed(() => traderInfo(props.quest.trader));
const ticks = computed(() => props.progress.obj[props.quest.id] || []);
const meta = computed(() => {
  const q = props.quest;
  const parts = [q.trader];
  if (q.maps.length) parts.push(q.maps.join(", "));
  if (q.xp) parts.push(fmt(q.xp) + " XP");
  return parts.filter(Boolean).join(" · ");
});
const pendingPrev = computed(() => props.quest.prev.filter((p) => !props.progress.done[p]).map((p) => props.byId[p].name));

const itemLines = (arr) => arr.map((r) => `${r.name} ×${fmt(r.qty)}`);
const sections = computed(() => {
  const q = props.quest;
  const rewards = itemLines(q.rewards);
  if (q.xp) rewards.push(fmt(q.xp) + " XP");
  return [
    { title: "Objetos que debes entregar", rows: itemLines(q.required) },
    { title: "Otros requisitos", rows: q.other },
    { title: "Objetos que te da al empezar", rows: itemLines(q.granted) },
    { title: "Recompensas", rows: rewards },
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
.q {
  border-radius: 14px;
  background: var(--arc-panel);
  border: 1px solid var(--arc-line);
  border-left: 4px solid var(--arc-line-2);
  scroll-margin-top: calc(var(--nav-h) + var(--subnav-h) + 16px);
  transition: border-color 0.2s;
}
.q.avail { border-left-color: var(--arc-yellow); }
.q.done { border-left-color: var(--arc-green); }
.q:hover { border-top-color: rgba(242, 235, 221, 0.14); border-right-color: rgba(242, 235, 221, 0.14); border-bottom-color: rgba(242, 235, 221, 0.14); }

.qrow { display: flex; align-items: center; gap: 12px; padding: 10px 12px; }

/* Casilla de completada */
.ck { position: relative; flex: none; width: 26px; height: 26px; cursor: pointer; }
.ck input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: pointer; }
.ck span {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 2px solid rgba(242, 235, 221, 0.25);
  transition: background 0.2s, border-color 0.2s;
}
.ck:hover span { border-color: var(--arc-green); }
.ck input:checked + span { background: var(--arc-green); border-color: var(--arc-green); }
.ck input:checked + span::after {
  content: "";
  width: 6px;
  height: 11px;
  border: solid #0B0A0E;
  border-width: 0 2.5px 2.5px 0;
  transform: translateY(-1px) rotate(45deg);
}
.ck input:focus-visible + span { outline: 2px solid var(--arc-yellow); outline-offset: 2px; }

.av { flex: none; width: 34px; height: 34px; padding: 2px; border-radius: 10px; background: var(--tc, var(--arc-line-2)); overflow: hidden; }
.av img { display: block; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
.c-y { --tc: #F5C02A; }
.c-c { --tc: #3BC9E8; }
.c-r { --tc: #E5372B; }
.c-o { --tc: #F28A1E; }
.c-g { --tc: #2FB45A; }
.q.locked .av { filter: grayscale(0.8) brightness(0.8); }

.qhead { flex: 1; min-width: 0; padding: 2px 0; border: 0; background: none; text-align: left; cursor: pointer; }
.qname { display: block; font-size: 15.5px; font-weight: 600; color: var(--arc-ink); }
.qhead:hover .qname { color: #fff; }
.q.locked .qname { color: var(--arc-mute); }
.q.done .qname { text-decoration: line-through; text-decoration-color: var(--arc-faint); color: var(--arc-dim); }
.qmeta { display: block; margin-top: 1px; font-size: 12.5px; color: var(--arc-faint); }

.pill {
  flex: none;
  height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 9px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.pill.done { color: #7FD9A0; background: rgba(47, 180, 90, 0.14); }
.pill.avail { color: var(--arc-yellow); background: rgba(245, 192, 42, 0.14); }
.pill.locked { color: var(--arc-faint); background: rgba(242, 235, 221, 0.06); }

.star {
  flex: none;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--arc-line-2);
  background: transparent;
  color: var(--arc-faint);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.star:hover { color: var(--arc-ink); border-color: rgba(245, 192, 42, 0.5); }
.star[aria-pressed="true"] { color: var(--arc-yellow); border-color: var(--arc-yellow); background: rgba(245, 192, 42, 0.1); }

.qbody { padding: 4px 18px 18px 62px; border-top: 1px solid var(--arc-line); font-size: 14px; color: var(--arc-dim); }
.lock { margin: 12px 0 0; color: var(--arc-err); }
.desc { margin: 12px 0 0; white-space: pre-line; }
h3 { margin: 18px 0 6px; font-size: 17px; font-weight: 800; color: var(--arc-yellow); }
ul { margin: 0; padding-left: 20px; color: var(--arc-ink-2); }
li { margin: 3px 0; }
.obj { list-style: none; padding-left: 0; }
.obj label { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.obj input { margin-top: 4px; width: 16px; height: 16px; accent-color: var(--arc-green); cursor: pointer; flex: none; }
.obj .ticked { color: var(--arc-faint); text-decoration: line-through; }
.maplinks { display: flex; flex-wrap: wrap; gap: 8px; }
.q .maplink {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(59, 201, 232, 0.35);
  background: rgba(59, 201, 232, 0.08);
  color: #7FD6F0;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}
.q .maplink:hover { color: #BDEBF7; border-color: var(--arc-cyan); background: rgba(59, 201, 232, 0.16); }
.linkbtn { padding: 0; border: 0; background: none; color: var(--arc-yellow); text-decoration: underline; text-underline-offset: 2px; cursor: pointer; text-align: left; }
.linkbtn:hover { color: #FFD45A; }
.ok { color: #7FD9A0; }
.markall { margin-top: 16px; }

@media (max-width: 640px) {
  .qrow { flex-wrap: wrap; gap: 10px; padding: 10px; }
  .av { display: none; }
  .qhead { flex: 1 1 calc(100% - 90px); order: 1; }
  .ck { order: 0; }
  .star { order: 2; }
  .pill { order: 3; margin-left: 36px; }
  .qbody { padding: 4px 14px 16px; }
}
</style>
