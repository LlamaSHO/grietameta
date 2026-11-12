<template>
  <!-- Bloque de Google AdSense. Los usuarios Premium (useAuth().isPremium)
       nunca lo cargan; mientras no se sabe si hay sesión tampoco se pide. -->
  <div v-if="show" class="ad-slot" :class="variant" aria-label="Publicidad">
    <ins
      ref="ins"
      class="adsbygoogle"
      style="display: block; width: 100%"
      data-ad-client="ca-pub-6908736829395141"
      :data-ad-slot="adSlot"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { useAuth } from "@/composables/useAuth";

const props = defineProps({
  adSlot: { type: String, required: true },
  variant: { type: String, default: "box" }, // box (lateral) · banner
});

const { state: auth, isPremium } = useAuth();
const show = computed(() => auth.ready && !isPremium.value);
const ins = ref(null);

watch(
  show,
  async (v) => {
    if (!v) return;
    await nextTick();
    if (!ins.value || ins.value.dataset.adStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense no ha cargado o lo bloquea el navegador.
      console.warn("AdSense no se pudo inicializar:", e);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.ad-slot {
  border-radius: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  overflow: hidden;
}
.ad-slot.box { min-height: 250px; }
.ad-slot.banner { min-height: 100px; }
/* Si AdSense no tiene anuncio que servir, el hueco desaparece. */
.ad-slot ins[data-ad-status="unfilled"] { display: none !important; }
.ad-slot:has(ins[data-ad-status="unfilled"]) { display: none; }
</style>
