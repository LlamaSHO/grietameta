<template>
  <div class="zg">
    <header class="gh" id="guias">
      <img class="hero-bg" src="/images/zelda/hyrule.jpg" alt="" decoding="async">
      <div class="wrap gh-in">
        <div>
          <nav class="crumbs" aria-label="Migas de pan">
            <RouterLink :to="{ name: 'zelda' }">Tears of the Kingdom</RouterLink>
            <span aria-hidden="true">/</span>
            <RouterLink :to="{ name: 'zelda', hash: '#info' }">Guías</RouterLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ guide.title }}</span>
          </nav>
          <h1 class="serif">{{ guide.h1 }}</h1>
          <p class="lead">{{ guide.desc }}</p>
        </div>
        <div class="gprog" aria-label="Tu progreso">
          <div v-for="item in progress" :key="item.label" class="gp">
            <div class="gpv"><b>{{ fmt(item.done) }}</b><small>de {{ fmt(item.total) }}</small></div>
            <span>{{ item.label }}</span>
            <progress class="bar" :aria-label="item.label" :value="item.done" :max="item.total"></progress>
          </div>
        </div>
      </div>
    </header>

    <nav class="gtabs" aria-label="Guías de Tears of the Kingdom">
      <div class="wrap gtabs-in">
        <RouterLink v-for="item in GUIDES" :key="item.key" class="gtab"
          :class="{ on: item.key === guide.key, deep: item.key === 'raices' }" :to="link(item.key)">
          {{ item.title }} <span class="n">{{ fmt(item.n) }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="wrap">
      <GuideContent :key="guide.key" :guide="guide" />
      <nav class="pn" aria-label="Otras guías">
        <RouterLink :to="link(previous.key)"><small>Anterior</small><b>{{ previous.title }}</b></RouterLink>
        <RouterLink class="nx" :to="link(next.key)"><small>Siguiente</small><b>{{ next.title }}</b></RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import GuideContent from "@/components/zelda/guides/GuideContent.vue";
import { GUIDES, guideByKey } from "@/components/zelda/guides/catalog";
import { useGuideProgress } from "@/components/zelda/guides/useGuideProgress";
import { fmt, seedCountForKey } from "@/components/zelda/mapPoints";
import "@/components/zelda/guides/zelda-guide.css";

const route = useRoute();
const guide = computed(() => guideByKey(route.params.guia));
const link = (guia) => ({ name: "zelda-guide", params: { guia } });
const position = computed(() => GUIDES.indexOf(guide.value));
const previous = computed(() => GUIDES[(position.value - 1 + GUIDES.length) % GUIDES.length]);
const next = computed(() => GUIDES[(position.value + 1) % GUIDES.length]);
const { done } = useGuideProgress();

const progress = computed(() => {
  const keys = Object.keys(done);
  return [
    { label: "Santuarios", total: 152, done: keys.filter((key) => key.startsWith("sh:")).length },
    { label: "Raíces de luz", total: 120, done: keys.filter((key) => key.startsWith("lr:")).length },
    { label: "Semillas", total: 875, done: keys.reduce((sum, key) => sum + (key.startsWith("sd:") ? seedCountForKey(key) : 0), 0) },
  ];
});

watch(guide, async (item) => {
  document.title = item.h1 + " de Zelda: Tears of the Kingdom | GrietaMeta";
  document.querySelector('meta[name="description"]')?.setAttribute("content", item.desc);
  await nextTick();
  const tab = document.querySelector(".zg .gtab.on");
  if (tab && tab.parentElement.scrollWidth > tab.parentElement.clientWidth) {
    tab.parentElement.scrollLeft = tab.offsetLeft - tab.parentElement.offsetLeft - 12;
  }
}, { immediate: true });
</script>
