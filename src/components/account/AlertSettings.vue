<template>
  <!-- Avisos por juego y canal (#alertas de MiPremium.dc.html). Cada cambio se
       guarda en users/{uid} como alerts { lol, arc, zelda } y alertChannels
       { email, browser }. En la vista previa (preview) no se guarda nada. -->
  <section id="alertas" class="pm-box pm-sec alerts">
    <div class="pm-sec-h">
      <div>
        <h2>Avisos por juego</h2>
        <p>Elige de qué juegos quieres enterarte y dónde te avisamos.</p>
      </div>
      <span class="save-state" :class="saveState" aria-live="polite">{{ saveText }}</span>
    </div>

    <div class="rows">
      <div v-for="g in GAMES" :key="g.key" class="arow">
        <img :src="g.logo" alt="">
        <div class="t">
          <b>{{ g.name }} · {{ g.what }}</b>
          <span>{{ g.desc }}</span>
        </div>
        <ToggleSwitch
          :model-value="alerts[g.key]"
          :label="`Avisos de ${g.name}`"
          :disabled="saveState === 'saving'"
          @update:model-value="(v) => change('alerts', g.key, v)"
        />
      </div>
    </div>

    <div class="chan" role="group" aria-label="Canal de los avisos">
      <span>Avisarme por:</span>
      <button
        type="button"
        class="chip"
        :class="{ on: channels.email }"
        :aria-pressed="channels.email"
        :disabled="saveState === 'saving'"
        @click="change('alertChannels', 'email', !channels.email)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>
        Email
      </button>
      <button
        type="button"
        class="chip"
        :class="{ on: channels.browser }"
        :aria-pressed="channels.browser"
        :disabled="saveState === 'saving'"
        @click="change('alertChannels', 'browser', !channels.browser)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
        Notificaciones del navegador
      </button>
    </div>

    <PmNotice v-if="error" class="note">{{ error }}</PmNotice>
    <p v-if="note" class="note warn">{{ note }}</p>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useAuth } from "@/composables/useAuth";
import PmNotice from "@/components/premium/PmNotice.vue";
import ToggleSwitch from "./ToggleSwitch.vue";

const props = defineProps({
  // Aviso bajo los canales (p. ej. "Los avisos se apagarán cuando termine tu Premium…").
  note: { type: String, default: "" },
  // Vista previa de estados (solo en desarrollo): cambia los interruptores sin guardar.
  preview: { type: Boolean, default: false },
});

const { state, refreshProfile } = useAuth();

const GAMES = [
  { key: "lol", logo: "/images/games/logo-lol.png", name: "League of Legends", what: "Cambios de parche", desc: "Los campeones y objetos que cambian, en cuanto sale el parche." },
  { key: "arc", logo: "/images/games/logo-arc.png", name: "ARC Raiders", what: "Actualizaciones", desc: "Objetos, misiones y enemigos nuevos o cambiados." },
  { key: "zelda", logo: "/images/games/logo-zelda.png", name: "Zelda TotK", what: "Guías nuevas", desc: "Cuando añadimos guías o puntos al mapa." },
];

// Valores por defecto (los del diseño) mientras el usuario no guarde nada.
const DEFAULT_ALERTS = { lol: true, arc: true, zelda: false };
const DEFAULT_CHANNELS = { email: true, browser: false };

const alerts = reactive({ ...DEFAULT_ALERTS });
const channels = reactive({ ...DEFAULT_CHANNELS });

// Copia lo guardado en el perfil (y lo vuelve a copiar si el perfil cambia).
function syncFromProfile() {
  Object.assign(alerts, DEFAULT_ALERTS, pickBools(state.profile?.alerts, Object.keys(DEFAULT_ALERTS)));
  Object.assign(channels, DEFAULT_CHANNELS, pickBools(state.profile?.alertChannels, Object.keys(DEFAULT_CHANNELS)));
}
function pickBools(obj, keys) {
  const out = {};
  for (const k of keys) if (typeof obj?.[k] === "boolean") out[k] = obj[k];
  return out;
}
watch(() => state.profile, syncFromProfile, { immediate: true });
watch(() => props.preview, syncFromProfile); // al salir de la vista previa se vuelve a lo guardado

const saveState = ref("idle"); // idle | saving | saved | error
const error = ref("");
const saveText = computed(
  () => ({ saving: "Guardando…", saved: "Guardado", error: "Sin guardar" })[saveState.value] || (props.preview ? "Vista previa: no se guarda" : "")
);

let savedTimer = null;

async function change(field, key, value) {
  const target = field === "alerts" ? alerts : channels;
  const before = { ...target };
  target[key] = value;
  error.value = "";
  if (props.preview) return;

  saveState.value = "saving";
  clearTimeout(savedTimer);
  try {
    const { updateUserProfile } = await import("@/services/firebase/users.js");
    await updateUserProfile(state.user.uid, { [field]: { ...target } });
    await refreshProfile().catch(() => {});
    saveState.value = "saved";
    savedTimer = setTimeout(() => (saveState.value = "idle"), 2500);
  } catch (err) {
    Object.assign(target, before); // se deja como estaba: lo que se ve es lo guardado
    saveState.value = "error";
    if (err?.code === "permission-denied") {
      console.warn("Firestore rechazó guardar los avisos: publica firestore.rules (firebase deploy --only firestore:rules).", err);
      error.value = "No se han podido guardar tus avisos: el servidor todavía no acepta este cambio (permiso denegado). Inténtalo más tarde.";
    } else if (err?.code === "unavailable") {
      error.value = "No hay conexión con el servidor. Revisa tu conexión y vuelve a intentarlo.";
    } else {
      console.error("No se pudieron guardar los avisos:", err);
      error.value = "No se han podido guardar tus avisos. Vuelve a intentarlo.";
    }
  }
}
</script>

<style scoped>
.alerts {
  scroll-margin-top: 0; /* el hueco del nav lo pone scroll-padding-top (base.css) */
}
.save-state {
  min-height: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-mute);
}
.save-state.saved {
  color: #7FEBCB;
}
.save-state.error {
  color: #FFB59C;
}
.rows {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
}
.arow {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.arow img {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  object-fit: contain;
  padding: 5px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.arow .t {
  flex: 1;
  min-width: 0;
}
.arow .t b {
  display: block;
  font-size: 15px;
  font-weight: 600;
}
.arow .t span {
  display: block;
  color: var(--ink-dim);
  font-size: 13.5px;
}
.chan {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 6px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13.5px;
  color: var(--ink-dim);
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: none;
  color: #C6CBD2;
  font: 500 13.5px/1 var(--font-body);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.chip:hover {
  border-color: rgba(255, 255, 255, 0.26);
  color: var(--ink);
}
.chip.on {
  border-color: rgba(232, 184, 101, 0.6);
  background: rgba(212, 160, 74, 0.1);
  color: var(--gm-gold);
}
.chip:disabled {
  cursor: progress;
}
.note {
  margin-top: 14px;
}
.note.warn {
  margin-bottom: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 106, 61, 0.06);
  border: 1px solid rgba(255, 106, 61, 0.25);
  color: #E6C2B5;
  font-size: 13.5px;
}
@media (max-width: 560px) {
  .arow {
    gap: 12px;
  }
  .arow img {
    width: 36px;
    height: 36px;
  }
}
</style>
