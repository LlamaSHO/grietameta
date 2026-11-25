<script setup>
import ArkDataState from './ArkDataState.vue';

defineProps({
  request: { type: Object, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  titleAccent: { type: String, required: true },
  summary: { type: String, required: true },
  notice: { type: String, required: true },
  noticeTitle: { type: String, required: true },
});
</script>

<template>
  <div class="ark-catalogue" :style="{ '--ark-hero-image': 'url(/images/ark/fondos/' + image + '.webp)' }">
    <section class="hero">
      <div class="catalogue-wrap">
        <span class="eyeline">ARK: SURVIVAL EVOLVED · BASE DE DATOS</span>
        <h1>{{ title }} <span>{{ titleAccent }}</span></h1>
        <p class="lead">{{ summary }}</p>
        <p class="notice"><b>{{ noticeTitle }}:</b> {{ notice }}</p>
      </div>
    </section>
    <div class="catalogue-wrap catalog">
      <ArkDataState :request="request"><slot /></ArkDataState>
    </div>
  </div>
</template>

<style scoped src="./catalogue.css"></style>
