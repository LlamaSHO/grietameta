<template>
  <!-- Pantalla de carga de la Poké Ball (diseño: .pk-load de Pokemon*.dc.html).
       Se lanza al entrar en la página, bloquea la interacción ~2 s y acaba con
       visibility:hidden (estilos en assets/styles/games/pokemon.css). -->
  <div class="pk-load" aria-hidden="true"><i class="pk-shadow"></i><div class="pk-throw"><svg class="pk-ball" viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="pkLoadR" cx="38%" cy="28%" r="75%"><stop offset="0" stop-color="#FF8A7A" /><stop offset=".45" stop-color="#EE3B36" /><stop offset="1" stop-color="#A3161C" /></radialGradient><radialGradient id="pkLoadW" cx="40%" cy="70%" r="70%"><stop offset="0" stop-color="#FFFFFF" /><stop offset=".6" stop-color="#E9ECF2" /><stop offset="1" stop-color="#A9AFBC" /></radialGradient><radialGradient id="pkLoadB" cx="42%" cy="38%" r="65%"><stop offset="0" stop-color="#FFFFFF" /><stop offset="1" stop-color="#D5D9E2" /></radialGradient></defs><path d="M3 50a47 47 0 0 1 94 0z" fill="url(#pkLoadR)" /><path d="M3 50a47 47 0 0 0 94 0z" fill="url(#pkLoadW)" /><rect x="2" y="45.5" width="96" height="9" fill="#14161D" /><circle cx="50" cy="50" r="47" fill="none" stroke="#14161D" stroke-width="3.4" /><circle cx="50" cy="50" r="15.5" fill="#14161D" /><circle cx="50" cy="50" r="10.5" fill="url(#pkLoadB)" stroke="#9AA1AE" stroke-width="1.2" /><circle class="pk-btn" cx="50" cy="50" r="6" fill="#F4F5F8" /><ellipse cx="33" cy="22" rx="13" ry="6.5" fill="#FFFFFF" opacity=".45" transform="rotate(-28 33 22)" /><ellipse cx="62" cy="83" rx="18" ry="5" fill="#FFFFFF" opacity=".35" /></svg></div><span>{{ text }}</span></div>
</template>

<script setup>
defineProps({ text: { type: String, default: "Atrapando datos…" } });
</script>
