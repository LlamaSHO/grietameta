<template>
  <!-- Iconos de las guías de Zelda (los mismos trazos que models/paginas/Zelda.dc.html). -->
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'santuario'">
      <path d="M5 21V10a7 7 0 0 1 14 0v11" /><path d="M9 21v-6a3 3 0 0 1 6 0v6" /><path d="M3 21h18" />
    </template>
    <template v-else-if="name === 'semilla'">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </template>
    <template v-else-if="name === 'mision'">
      <path d="M8 3h11a2 2 0 0 1 2 2v2h-4" /><path d="M17 7v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2h11" /><path d="M8 3a2 2 0 0 0-2 2v12" /><path d="M10 8h4M10 12h4" />
    </template>
    <template v-else-if="name === 'armadura'">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </template>
    <template v-else-if="name === 'conjunto'">
      <path d="M12 2l9 5-9 5-9-5z" /><path d="M3 12l9 5 9-5" /><path d="M3 16.5l9 5 9-5" />
    </template>
    <template v-else-if="name === 'mapa'">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </template>
    <template v-else-if="name === 'buscar'">
      <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </template>
    <template v-else-if="name === 'externo'">
      <path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
    </template>
    <template v-else-if="name === 'check'">
      <polyline points="5 12.5 10 17.5 19 7" />
    </template>
    <template v-else-if="name === 'flecha'">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
    </template>
    <template v-else-if="name === 'atras'">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 6 5 12 11 18" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><circle cx="12" cy="7.8" r=".6" fill="currentColor" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
});
</script>
