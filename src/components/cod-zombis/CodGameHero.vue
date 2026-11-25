<template>
  <!-- Cabecera de un juego (diseño: .gh de CodBO1..4.dc.html) -->
  <section class="gh" :class="g.slug" id="inicio" :style="{ '--gc': g.color }">
    <div class="gh-bg" aria-hidden="true">
      <img v-if="g.img" :src="g.img" alt="" fetchpriority="high" decoding="async" />
      <span class="grain"></span>
    </div>
    <div class="wrap gh-in">
      <div class="gh-t">
        <span class="kicker">{{ g.kicker }}</span>
        <h1 class="stencil">{{ g.title }}</h1>
        <p class="lead">{{ g.lead }}</p>
        <p class="packs"><b>{{ g.packsTitle }}</b>{{ g.packs }}</p>
      </div>
      <dl class="gh-st">
        <div v-for="s in g.stats" :key="s.t"><dt class="sc">{{ s.v }}</dt><dd>{{ s.t }}</dd></div>
      </dl>
    </div>
    <span class="hz" aria-hidden="true"></span>
  </section>
</template>

<script setup>
defineProps({ g: { type: Object, required: true } });
</script>
