<template>
  <div class="view-checkout-success">
    <nav class="nav">
      <div class="wrap">
        <div class="brand">
          <div class="brand-mark"></div>
          <div class="brand-name">GRIETA<span>META</span></div>
        </div>
        <div class="nav-links">
          <a href="/lol#tierlist">Tier list</a>
          <a href="/lol#campeones">Campeones</a>
          <a href="/lol#premium">Premium</a>
        </div>
        <button class="nav-cta" @click="$router.push('/lol#premium')">Hazte Premium</button>
      </div>
    </nav>

    <main class="confirm-wrap">
      <div class="confirm-badge">✓</div>
      <h1>Ya eres Premium</h1>
      <p>Tu suscripción se ha activado correctamente. Ya puedes ver las builds completas, las runas óptimas por matchup y los objetos situacionales de los 165+ campeones, sin publicidad.</p>
      <a class="btn-gold" style="text-decoration:none; display:inline-block; padding:13px 28px;" href="/lol#campeones">Ir a los campeones</a>
      <p v-if="sessionId" class="session-id">Referencia de pago: {{ sessionId }}</p>
    </main>

    <footer>
      <div class="wrap">
        <div class="foot-top">
          <div style="max-width:360px;">
            <div class="brand-name" style="margin-bottom:10px;">GRIETA<span>META</span></div>
            <p>GrietaMeta no está afiliado a Riot Games. League of Legends y Riot Games son marcas registradas o marcas comerciales de Riot Games, Inc.</p>
          </div>
          <div class="foot-cols">
            <div class="foot-col">
              <h5>Producto</h5>
              <a href="/lol#tierlist">Tier list</a>
              <a href="/lol#campeones">Campeones</a>
              <a href="/lol#premium">Premium</a>
            </div>
            <div class="foot-col">
              <h5>Legal</h5>
              <a href="/privacidad">Privacidad</a>
              <a href="#">Términos</a>
              <a href="#">Publicidad</a>
            </div>
          </div>
        </div>
        <div>© 2026 GrietaMeta. Datos de ejemplo con fines de demostración.</div>
      </div>
    </footer>
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
