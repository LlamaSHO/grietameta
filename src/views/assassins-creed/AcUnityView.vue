<script setup>
import { computed, ref, watch } from "vue";
import { useGameData } from "@/composables/useGameData";
import AcDna from "@/components/assassins-creed/AcDna.vue";
import AcParisMap from "@/components/assassins-creed/AcParisMap.vue";
import AcUnityStory from "@/components/assassins-creed/AcUnityStory.vue";
import AcUnityExtras from "@/components/assassins-creed/AcUnityExtras.vue";

const dataset = useGameData("/data/assassins-creed/unity.json");
const progressKey = "grietameta:ac-unity:memories";
const done = ref(initialProgress());
const selected = ref("");
const mapTarget = ref(null);

const memories = computed(() => (dataset.data?.seqs ?? []).flatMap(sequence =>
  sequence.mems.map((item, position) => ({ ...item, sequence: sequence.id, position }))));
const places = computed(() => Object.fromEntries((dataset.data?.lms ?? []).map(item => [item.id, item])));
const completed = computed(() => memories.value.filter(item => done.value[item.id]).length);
const next = computed(() => memories.value.find(item => !done.value[item.id]));
const memory = computed(() => memories.value.find(item => item.id === selected.value) ?? next.value ?? memories.value[0]);

watch(done, value => {
  try {
    localStorage.setItem(progressKey, JSON.stringify(value));
  } catch {
    // El progreso sigue disponible en la visita actual.
  }
});

function initialProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(progressKey) ?? "{}");
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
  } catch {
    // El almacenamiento puede estar deshabilitado.
  }
  return {};
}

function selectMemory(id) {
  selected.value = id;
}

function toggleMemory(id) {
  selected.value = id;
  const updated = { ...done.value };
  if (updated[id]) delete updated[id];
  else updated[id] = true;
  done.value = updated;
}

function toggleSequence(sequence) {
  selected.value = memory.value.id;
  const updated = { ...done.value };
  const full = sequence.mems.every(item => updated[item.id]);
  for (const { id } of sequence.mems) {
    if (full) delete updated[id];
    else updated[id] = true;
  }
  done.value = updated;
}

function showPlace(item) {
  mapTarget.value = { sequence: item.sequence, place: item.pl };
}

</script>

<template>
  <div class="ac-page">
    <section id="inicio" class="ac-hero unity-hero">
      <img class="unity-art" src="/images/assassins-creed/hero-ac.webp" alt="" width="1550" height="501" fetchpriority="high">
      <AcDna />
      <div class="ac-wrap unity-hero-inner">
        <div>
          <RouterLink class="crumb" to="/assassins-creed">Assassin's Creed <span aria-hidden="true">›</span> Unity</RouterLink>
          <div class="hud"><i></i> Animus · memoria genética · sincronización <b>100 %</b></div>
          <p class="ac-period">Guía completa · París, 1789–1794</p>
          <h1>Assassin's Creed <em>Unity</em></h1>
          <p class="lead">El París de la Revolución barrio a barrio, la historia de Arno memoria a memoria y todo lo que hay que hacer para completar la ciudad.</p>
          <div class="ac-actions">
            <RouterLink class="ac-button primary" to="#mapa">Abrir el mapa <span aria-hidden="true">→</span></RouterLink>
            <RouterLink class="ac-button" to="#historia">Historia paso a paso</RouterLink>
          </div>
          <ul class="facts">
            <li>2014 · Ubisoft Montreal</li><li>PS4 · Xbox One · PC</li><li>Cooperativo 1–4</li><li>60 FPS en PS5 y Xbox Series</li>
          </ul>
        </div>

        <aside v-if="memories.length" class="hero-progress" aria-label="Tu progreso en la historia">
          <p class="progress-title">Tu progreso en la historia</p>
          <p class="progress-count"><b>{{ completed }}</b> / {{ memories.length }} memorias</p>
          <progress :value="completed" :max="memories.length" aria-label="Memorias completadas"></progress>
          <RouterLink v-if="next" class="progress-next" to="#historia" @click="selectMemory(next.id)">
            <span><small>Siguiente</small><b>{{ next.t }}</b></span><span aria-hidden="true">→</span>
          </RouterLink>
          <p v-else>¡Historia completada! Ahora toca Dead Kings y el 100 % de París.</p>
          <p class="progress-help">Marca cada memoria al terminarla en las diapositivas de la historia.</p>
        </aside>
      </div>
    </section>

    <div v-if="dataset.status === 'error'" class="ac-section ac-wrap" role="alert">
      <p>No se pudieron cargar el mapa y las memorias.</p>
      <button class="ac-button" type="button" @click="dataset.reload()">Reintentar</button>
    </div>
    <section id="mapa" class="ac-section ac-wrap">
      <AcParisMap v-if="dataset.status === 'ready'" :data="dataset.data" :done="done" :target="mapTarget"
        :memories="memories" :places="places" @memory="selectMemory" />
    </section>
    <section id="historia" class="ac-section ac-wrap">
      <AcUnityStory v-if="memory" :sequences="dataset.data.seqs" :memory="memory" :memories="memories" :done="done" :places="places"
        @select="selectMemory" @toggle="toggleMemory" @toggle-sequence="toggleSequence" @place="showPlace" @reset="done = {}; selected = ''" />
    </section>
    <AcUnityExtras />
  </div>
</template>

<style scoped src="@/components/assassins-creed/ac-page.css"></style>
<style scoped>
.unity-hero { border-bottom: 3px solid transparent; border-image: linear-gradient(90deg,#426fae,#ebe5d6,#be2041) 1; background: #0c1018; }
.unity-hero::before { z-index: -1; background: linear-gradient(90deg,#070d16 5%,#0a111bdd 41%,#10182645 80%),linear-gradient(0deg,#080e16 0%,transparent 54%); opacity: 1; }
.unity-art { position: absolute; z-index: -2; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 64% 40%; }
.unity-hero-inner { position: relative; display: grid; grid-template-columns: minmax(0,1fr) minmax(250px,330px); align-items: end; gap: 24px; min-height: 450px; padding-block: clamp(36px,5.5vw,72px); }
.crumb { display: block; width: fit-content; margin-bottom: 12px; color: #d6e3ed; font-size: .85rem; text-decoration: none; }
.crumb:hover { color: #fff; }
.crumb span { color: #f290a3; padding-inline: 3px; }
.unity-hero h1 em { display: block; color: #fff0d3; }
.facts { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; padding: 0; margin: 20px 0 0; }
.facts li { padding: 4px 8px; border: 1px solid #516070; border-radius: 4px; background: #101722; color: #d6e0e9; font-size: .79rem; }
.facts li:last-child { border-color: #a55668; color: #ffd0db; }
.hero-progress { padding: 17px; border: 1px solid #596679; border-radius: 6px; background: #151923; }
.hero-progress p { margin: 8px 0 0; }
.hero-progress .progress-title { margin: 0; color: #c5ced8; font-size: .79rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.progress-count { color: #c8d4de; }
.progress-count b { font: 700 3.3rem/.9 var(--ac-display); color: #f6f6f2; }
.hero-progress progress { display: block; width: 100%; height: 5px; margin-top: 13px; border: 0; appearance: none; accent-color: #f094a7; background: #344352; }
.hero-progress progress::-webkit-progress-bar { background: #344352; }
.hero-progress progress::-webkit-progress-value { background: #f094a7; }
.progress-next { display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 8px 11px; margin-top: 10px; color: #ffedf0; border: 1px solid #824d60; border-radius: 4px; background: #332332; text-decoration: none; }
.progress-next small { display: block; color: #ffb7c6; }
.progress-next:hover { background: #4b2b3e; color: #fff; }
.progress-help { font-size: .8rem; color: #c1cad3; }
@media (max-width: 720px) {
  .unity-hero-inner { grid-template-columns: minmax(0,1fr); }
  .unity-art { object-position: 61% top; }
  .unity-hero::before { background: linear-gradient(90deg,#070d16ed,#10182693),linear-gradient(0deg,#080e16 7%,transparent 90%); }
}
</style>
