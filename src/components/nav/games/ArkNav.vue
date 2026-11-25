<script setup>
import '@/assets/styles/games/ark.css';

const sections = [
  ['/ark', 'Portada', 'o-g'],
  ['/ark/criaturas', 'Criaturas', 'o-g'],
  ['/ark/engramas', 'Engramas', 'o-b'],
  ['/ark/recursos', 'Recursos', 'o-r'],
  ['/ark/guias', 'Guías', 'o-a'],
];
</script>

<template>
  <RouterLink v-for="[to, label, crystal] in sections" :key="to" :to="to" class="slink" :class="crystal" exact-active-class="on">
    {{ label }}
  </RouterLink>
  <span class="ark-status">
    <span class="ark-ed">Survival Evolved</span>
    <span class="ark-wip" title="Esta sección aún se está completando">En progreso</span>
    <span class="ark-obs" aria-hidden="true"><i></i><i></i><i></i></span>
  </span>
</template>
