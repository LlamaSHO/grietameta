<template>
  <!-- Imagen de un objeto sobre el brillo de su rareza. Sin imagen (o si
       falla) muestra la inicial. -->
  <span class="art" :class="rarityClass(item.rarity)">
    <img v-if="item.hasImage && !failed" :src="arcItemImageUrl(item.id)" alt="" loading="lazy" decoding="async" @error="failed = true">
    <span v-else class="ph" aria-hidden="true">{{ (item.name || "?").charAt(0).toUpperCase() }}</span>
  </span>
</template>

<script setup>
import { ref, watch } from "vue";
import { arcItemImageUrl } from "@/services/arcRaiders";
import { rarityClass } from "./arcLabels";

const props = defineProps({ item: { type: Object, required: true } });
const failed = ref(false);
watch(() => props.item.id, () => (failed.value = false));
</script>

<style scoped>
.art {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 1px solid var(--rc);
  background: radial-gradient(circle at 50% 30%, var(--rb), #100E14 75%);
}
.art img { width: 80%; height: 80%; object-fit: contain; }
.ph { font-family: var(--font-arc); font-size: 34px; font-weight: 800; color: var(--rt); }
</style>
