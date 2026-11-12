<template>
  <!-- Leyenda del mapa de Zelda (abajo a la izquierda; oculta en móvil). -->
  <div class="legend" aria-hidden="true">
    <span><i class="zpin lg p-sh"></i>Santuario</span>
    <span><i class="zpin lg p-tw"></i>Torre</span>
    <span><i class="zpin lg p-cv"></i>Cueva o túnel</span>
    <span><i class="zpin lg p-sd"></i>Semilla kolog</span>
    <span><i class="zpin lg p-sd2"></i>Kolog con amigo</span>
    <span><i class="zpin lg done"></i>Hecho</span>
  </div>
</template>

<script setup>
import "./zelda-pins.css";
</script>

<style scoped>
.legend {
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 5;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  max-width: calc(100% - 140px);
  padding: 9px 12px;
  border-radius: 11px;
  background: rgba(8, 20, 18, 0.88);
  border: 1px solid rgba(127, 235, 203, 0.16);
  font-size: 12px;
  color: #C3D3CD;
}
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.legend .zpin.lg {
  width: 16px;
  height: 16px;
  border-width: 1.5px;
}
@media (max-width: 860px) {
  .legend {
    display: none;
  }
}
</style>
