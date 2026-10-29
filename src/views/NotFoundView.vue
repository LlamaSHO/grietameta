<template>
  <div class="view-home">
    <header class="hub-hero">
      <div class="wrap">
        <h1>Página no <em>encontrada</em></h1>
        <p class="lead">Esta dirección no existe o ha cambiado de sitio.</p>
        <RouterLink to="/" class="back">← Volver al inicio</RouterLink>
      </div>
    </header>
  </div>
</template>

<script setup>
import "@/assets/styles/views/home.css";
</script>

<style scoped>
.back {
  color: var(--gold);
  text-decoration: none;
}
</style>
