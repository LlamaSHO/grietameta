<template>
  <!-- Nota al pie de una guía o aviso de «sin resultados». -->
  <div class="gn" :class="{ empty }" :role="empty ? 'status' : undefined">
    <GuideIcon :name="empty ? 'buscar' : 'info'" :size="18" class="gn-ic" />
    <div><slot /></div>
  </div>
</template>

<script setup>
import GuideIcon from "./GuideIcon.vue";

defineProps({ empty: { type: Boolean, default: false } });
</script>

<style scoped>
.gn {
  display: flex;
  gap: 12px;
  margin-top: 22px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(216, 194, 122, 0.05);
  border: 1px solid rgba(216, 194, 122, 0.2);
  font-size: 13px;
  line-height: 1.6;
  color: #a9bdb6;
  text-wrap: pretty;
}
.gn :slotted(a) {
  color: #7febcb;
  font-weight: 600;
  text-underline-offset: 3px;
}
.gn :slotted(a:hover) {
  color: #a8f5de;
}
.gn-ic {
  flex-shrink: 0;
  margin-top: 1px;
  color: #d8c27a;
}
.gn.empty {
  justify-content: center;
  align-items: center;
  margin-top: 0;
  padding: 34px 18px;
  border-style: dashed;
  border-color: rgba(127, 235, 203, 0.2);
  background: transparent;
  font-size: 14px;
  text-align: center;
}
.gn.empty .gn-ic {
  color: #7febcb;
}
</style>
