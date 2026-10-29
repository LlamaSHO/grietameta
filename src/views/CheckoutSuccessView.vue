<template>
  <div class="view-checkout-success">

    <main class="confirm-wrap">
      <div class="confirm-badge">✓</div>
      <h1>Ya eres Premium</h1>
      <p>Tu suscripción se ha activado correctamente. Ya puedes ver las builds completas, las runas óptimas por matchup y los objetos situacionales de los 165+ campeones, sin publicidad.</p>
      <a class="btn-gold" style="text-decoration:none; display:inline-block; padding:13px 28px;" href="/lol#campeones">Ir a los campeones</a>
      <p v-if="sessionId" class="session-id">Referencia de pago: {{ sessionId }}</p>
    </main>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import "@/assets/styles/views/checkout-success.css";

// Stripe vuelve aquí con ?session_id=... (ver api/create-checkout-session.js).
const route = useRoute();
const sessionId = computed(() => route.query.session_id || "");
</script>
