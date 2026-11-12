<template>
  <!-- Botones de acceso con otras cuentas. Solo Google funciona de verdad
       (Firebase). Discord, Riot, Epic y Steam necesitan una función en /api
       que haga el OAuth/OpenID y devuelva un custom token de Firebase: hasta
       entonces avisan de que llegarán pronto. -->
  <div>
    <div class="socials" role="group" aria-label="Entrar con otra cuenta">
      <button
        v-for="p in PROVIDERS"
        :key="p.id"
        type="button"
        class="soc"
        :class="[`s-${p.id}`, { wait: busy === p.id }]"
        :aria-label="`Continuar con ${p.name}`"
        :disabled="!!busy"
        @click="onClick(p)"
      >
        <span v-if="busy === p.id" class="spinner" aria-hidden="true" />
        <img v-else :src="p.icon" alt="">
        {{ p.short }}
      </button>
    </div>
    <p v-if="soon" :key="soon" class="soc-note" role="status">
      El acceso con {{ soon }} llegará próximamente. De momento, entra con Google o con tu email.
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  // id del proveedor que está cargando (p. ej. "go") o "" si ninguno.
  busy: { type: String, default: "" },
});
const emit = defineEmits(["google"]);

const PROVIDERS = [
  { id: "go", name: "Google", short: "Google", icon: "/images/social/google.png", ready: true },
  { id: "dc", name: "Discord", short: "Discord", icon: "/images/social/discord.svg" },
  { id: "ri", name: "Riot Games", short: "Riot", icon: "/images/social/riotgames.svg" },
  { id: "ep", name: "Epic Games", short: "Epic", icon: "/images/social/epicgames.svg" },
  { id: "st", name: "Steam", short: "Steam", icon: "/images/social/steam.svg" },
];

// Nombre del proveedor que aún no está disponible y se acaba de pulsar.
const soon = ref("");

function onClick(p) {
  if (p.ready) {
    soon.value = "";
    emit("google");
  } else {
    soon.value = p.name;
  }
}
</script>

<style scoped>
.socials {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}
.soc {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 72px;
  padding: 0 4px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: #C6CBD2;
  font: 600 12px/1 var(--font-body);
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s, transform 0.25s, box-shadow 0.25s, color 0.25s;
}
.soc img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: transform 0.35s var(--ease-out);
}
.soc:hover:not(:disabled) {
  color: var(--ink);
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--bc);
  box-shadow: 0 14px 30px -14px var(--bc);
}
.soc:hover:not(:disabled) img {
  transform: scale(1.15);
}
.soc:focus-visible {
  outline: 2px solid var(--gold-hi);
  outline-offset: 2px;
}
.soc:disabled {
  cursor: default;
  opacity: 0.6;
}
.soc.wait {
  opacity: 1;
  border-color: var(--bc);
}
.s-go { --bc: rgba(66, 133, 244, 0.75); }
.s-dc { --bc: rgba(88, 101, 242, 0.8); }
.s-ri { --bc: rgba(235, 0, 41, 0.75); }
.s-ep { --bc: rgba(255, 255, 255, 0.55); }
.s-st { --bc: rgba(102, 192, 244, 0.7); }

.spinner {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--ink);
  animation: gm-spin 0.7s linear infinite;
}

.soc-note {
  margin: 10px 0 0;
  text-align: center;
  font-size: 12.5px;
  color: var(--ink-mute);
  animation: fade 0.3s ease both;
}
@keyframes fade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 560px) {
  .soc {
    height: 66px;
    font-size: 11px;
  }
}
</style>
