<template>
  <!-- Preguntas frecuentes en acordeón (.faqs de Premium.dc.html): una abierta a la vez. -->
  <div class="faqs">
    <div v-for="(item, i) in items" :key="item.q" class="faq" :class="{ open: open === i }">
      <h3 class="fh">
        <button
          :id="`${idBase}-q${i}`"
          type="button"
          class="fq"
          :aria-expanded="open === i"
          :aria-controls="`${idBase}-a${i}`"
          @click="open = open === i ? -1 : i"
        >
          {{ item.q }}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
      </h3>
      <div v-show="open === i" :id="`${idBase}-a${i}`" role="region" :aria-labelledby="`${idBase}-q${i}`">
        <p class="fa">
          <template v-for="(part, j) in item.a" :key="j">
            <RouterLink v-if="part.to" :to="part.to">{{ part.text }}</RouterLink>
            <template v-else>{{ part }}</template>
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  // [{ q: "pregunta", a: ["texto", { text: "enlace", to: "/ruta" }, "más texto"] }]
  items: { type: Array, required: true },
  initial: { type: Number, default: 0 },
  idBase: { type: String, default: "faq" },
});

const open = ref(props.initial);
</script>

<style scoped>
.faqs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.faq {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.3s, background 0.3s;
}
.faq.open {
  border-color: rgba(212, 160, 74, 0.4);
  background: rgba(212, 160, 74, 0.04);
}
.fh {
  margin: 0;
  font: inherit;
}
.fq {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 58px;
  padding: 16px 20px;
  border: none;
  background: none;
  color: var(--ink);
  font: 600 15.5px/1.35 var(--font-body);
  text-align: left;
  cursor: pointer;
}
.fq svg {
  flex-shrink: 0;
  color: var(--ink-dim);
  transition: transform 0.35s var(--ease-out), color 0.3s;
}
.faq.open .fq svg {
  transform: rotate(45deg);
  color: var(--gm-gold);
}
.fa {
  margin: 0;
  padding: 0 20px 18px;
  color: var(--ink-dim);
  font-size: 14.5px;
  animation: gm-rise 0.4s var(--ease-out) both;
}
.fa a {
  color: var(--gold);
  font-weight: 600;
}
</style>
