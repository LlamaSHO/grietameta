<template>
  <!-- «Navega sin anuncios»: lleva a /premium con el plan mensual (el que
       tiene la prueba de 7 días). Con Premium activo se oculta. -->
  <div v-if="!isPremium" class="premini">
    <h3 class="disp">Navega sin anuncios</h3>
    <p>Premium quita la publicidad y te avisa de los cambios de parche antes que nadie.</p>
    <RouterLink class="btn-gold" :to="{ path: '/premium', query: { plan: 'mensual' } }">Probar 7 días gratis</RouterLink>
  </div>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";

const { isPremium } = useAuth();
</script>

<style scoped>
.premini {
  position: relative;
  overflow: hidden;
  padding: 20px;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(226, 181, 102, 0.16), #0D1017 60%);
  border: 1px solid rgba(226, 181, 102, 0.3);
}
.premini h3 { margin: 0; font-size: 18px; }
.premini p { margin: 6px 0 14px; font-size: 13.5px; color: #C6CBD2; }
.premini .btn-gold { width: 100%; }
</style>
