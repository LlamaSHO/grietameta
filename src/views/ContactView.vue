<template>
  <!-- Contacto (models/paginas/Contacto.dc.html). El formulario se envía a
       /api/contact; si eso falla (o en local, donde no hay /api) se ofrece
       abrir el correo con el mensaje ya escrito. -->
  <div class="view-contact">
    <div class="glow g1" aria-hidden="true" />
    <div class="glow g2" aria-hidden="true" />

    <div class="wrap">
      <ContactHeader />

      <div class="grid">
        <section ref="card" class="card" aria-label="Formulario de contacto">
          <ContactSent v-if="status === 'sent'" :subject="sentSubject" :copy-to="copySentTo" @again="again" />

          <form v-else class="form" novalidate @submit.prevent="onSubmit">
            <ReasonPicker v-model="form.reason" :reasons="REASONS" />

            <div class="two">
              <label class="field" for="c-name">Nombre
                <span class="inp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                  <input id="c-name" v-model.trim="form.name" type="text" autocomplete="name" maxlength="80" placeholder="Cómo te llamas">
                </span>
              </label>
              <label class="field" for="c-mail">Tu email
                <span class="inp" :class="{ bad: badField === 'email' }">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>
                  <input id="c-mail" v-model.trim="form.email" type="email" autocomplete="email" maxlength="254" placeholder="Para poder responderte" required :aria-invalid="badField === 'email' ? 'true' : undefined">
                </span>
              </label>
            </div>

            <label v-if="form.reason === 'juego'" class="field" for="c-game">¿Qué juego quieres ver en GrietaMeta?
              <span class="inp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="12" rx="4" /><line x1="7" y1="11" x2="7" y2="15" /><line x1="5" y1="13" x2="9" y2="13" /><circle cx="16" cy="12" r="1" /><circle cx="18" cy="14" r="1" /></svg>
                <input id="c-game" v-model.trim="form.gameName" type="text" maxlength="80" placeholder="Ej. Valorant, Elden Ring…">
              </span>
            </label>
            <GameChips v-else v-model="form.game" :games="GAMES" />

            <label class="field" for="c-msg">Mensaje
              <textarea
                id="c-msg"
                v-model="form.message"
                rows="7"
                :maxlength="MAX_MESSAGE"
                :placeholder="currentReason.placeholder"
                required
                :class="{ bad: badField === 'message' }"
                :aria-invalid="badField === 'message' ? 'true' : undefined"
                aria-describedby="c-count"
              />
              <!-- Sin aria-live: anunciaría el contador con cada tecla. -->
              <span id="c-count" class="count">{{ form.message.length }} / {{ MAX_MESSAGE }}</span>
            </label>

            <!-- Campo trampa para bots: las personas no lo ven ni lo rellenan. -->
            <div class="trap" aria-hidden="true">
              <label>No rellenes este campo <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off"></label>
            </div>

            <label class="check" :class="{ off: !canCopy }" for="c-copy">
              <input id="c-copy" v-model="form.copy" type="checkbox" :disabled="!canCopy" aria-describedby="c-copy-hint">
              Enviarme una copia a mi email
            </label>
            <span v-if="!canCopy" id="c-copy-hint" class="copy-hint">
              <template v-if="!state.user">Para recibir una copia, <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }">inicia sesión</RouterLink>.</template>
              <template v-else>La copia solo se envía al email de tu cuenta ({{ state.user.email }}).</template>
            </span>

            <div v-if="error" class="alert" role="alert">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><line x1="12" y1="7.5" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.6" /></svg>
              <span>{{ error }}</span>
            </div>
            <div v-else-if="status === 'error'" class="alert" role="alert">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><line x1="12" y1="7.5" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.6" /></svg>
              <span>
                {{ sendError || sendErrorFallbackText }}
                <template v-if="showFallback">
                  También puedes <a :href="mailtoHref">enviarlo desde tu correo</a>: el mensaje ya va escrito.
                </template>
              </span>
            </div>

            <div class="actions">
              <button type="submit" class="send" :class="{ busy: status === 'sending' }" :disabled="status === 'sending'">
                {{ status === "sending" ? "Enviando…" : "Enviar mensaje" }}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></svg>
              </button>
              <span class="hint">Solo usamos tu email para responderte.</span>
            </div>
          </form>
        </section>

        <ContactSidebar :email="CONTACT_EMAIL" @pick="pickFromShortcut" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { CONTACT_EMAIL, buildMailto, sendContactMessage } from "@/services/contact";
import ContactHeader from "@/components/contact/ContactHeader.vue";
import ReasonPicker from "@/components/contact/ReasonPicker.vue";
import GameChips from "@/components/contact/GameChips.vue";
import ContactSent from "@/components/contact/ContactSent.vue";
import ContactSidebar from "@/components/contact/ContactSidebar.vue";

const MAX_MESSAGE = 2000;
const MIN_MESSAGE = 10;

const REASONS = [
  { id: "falta", label: "Falta algo", hint: "Un dato, un campeón, una misión…", placeholder: "Cuéntanos qué echas en falta y dónde.", icon: "M12 5v14M5 12h14" },
  { id: "juego", label: "Añadir un juego", hint: "Quieres verlo en GrietaMeta", placeholder: "¿Qué te gustaría encontrar de ese juego?", icon: "M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.4 1.8L9 15h6l1.6 1.8A3 3 0 0 0 22 15l-.7-6.4A4 4 0 0 0 17.3 5z" },
  { id: "error", label: "Hay un error", hint: "Algo no funciona o está mal", placeholder: "¿Qué ha pasado? ¿En qué página?", icon: "M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" },
  { id: "ayuda", label: "Necesito ayuda", hint: "Con tu cuenta o con Premium", placeholder: "Explícanos en qué te podemos ayudar.", icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" },
  { id: "otro", label: "Otra cosa", hint: "Sugerencias, colaboraciones…", placeholder: "Escribe tu mensaje.", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
];
const GAMES = [
  { id: "lol", label: "League of Legends", img: "/images/games/logo-lol.png" },
  { id: "arc", label: "ARC Raiders", img: "/images/games/logo-arc.png" },
  { id: "zelda", label: "Zelda TotK", img: "/images/games/logo-zelda.png" },
  { id: "web", label: "La web en general", img: "" },
];

const route = useRoute();
const { state, displayName } = useAuth();

const reasonFromQuery = (q) => (REASONS.some((r) => r.id === q) ? q : null);
// ?juego=<nombre> (lo manda el buscador cuando no encuentra un juego).
const gameFromQuery = (q) => (typeof q === "string" ? q.trim().slice(0, 80) : "");

const form = reactive({
  reason: reasonFromQuery(route.query.motivo) || (gameFromQuery(route.query.juego) ? "juego" : "falta"),
  name: "",
  email: "",
  game: "",      // chip elegido (lol, arc, zelda, web)
  gameName: gameFromQuery(route.query.juego), // juego que piden añadir
  message: "",
  copy: false,
  website: "",   // trampa para bots
});
const status = ref("idle"); // idle | sending | error | sent
const error = ref("");      // error de validación (antes de enviar)
const badField = ref("");
const sendError = ref("");  // error devuelto al enviar
const sendStatus = ref(0);  // código HTTP del fallo (0 = sin conexión)
const showFallback = ref(false);

// Texto según la causa: sin red, envío no disponible (404) o fallo del servidor.
const sendErrorFallbackText = computed(() => {
  if (sendStatus.value === 0) return "No hemos podido enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.";
  if (sendStatus.value === 404) return "El envío desde la web no está disponible ahora mismo.";
  return "El servidor no ha podido enviar el mensaje. Inténtalo de nuevo en un rato.";
});

// La copia solo se manda al email de la cuenta con sesión iniciada (api/contact.js lo comprueba).
const canCopy = computed(
  () => !!state.user?.email && form.email.trim().toLowerCase() === state.user.email.toLowerCase()
);
watch(canCopy, (ok) => {
  if (!ok) form.copy = false;
});
const sentSubject = ref("");
const copySentTo = ref("");
const card = ref(null);
const startedAt = Date.now();

const currentReason = computed(() => REASONS.find((r) => r.id === form.reason) || REASONS[0]);

const subject = computed(() => {
  const r = currentReason.value;
  let extra = "";
  if (r.id === "juego") extra = form.gameName ? `: ${form.gameName}` : "";
  else if (form.game) extra = ` · ${GAMES.find((g) => g.id === form.game)?.label}`;
  return `[GrietaMeta] ${r.label}${extra}`;
});

const mailtoHref = computed(() =>
  buildMailto({ subject: subject.value, message: form.message.trim(), name: form.name, email: form.email })
);

// /contacto?motivo=juego&juego=… también si ya estás en la página.
watch(() => [route.query.motivo, route.query.juego], ([m, j]) => {
  const game = gameFromQuery(j);
  const r = reasonFromQuery(m) || (game ? "juego" : null);
  if (r) form.reason = r;
  if (game) form.gameName = game;
  if (r && status.value === "sent") status.value = "idle";
});

// Al cambiar de motivo se quitan los avisos antiguos.
watch(() => form.reason, () => {
  error.value = "";
  badField.value = "";
  if (status.value === "error") status.value = "idle";
});

// Si hay sesión, se rellenan nombre y email (el nombre puede llegar después, con el perfil).
watch(
  [() => state.user, displayName],
  ([u, name]) => {
    if (!u) return;
    if (!form.name && name) form.name = name;
    if (!form.email && u.email) form.email = u.email;
  },
  { immediate: true }
);

function validate() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    badField.value = "email";
    return form.email ? "Revisa tu email, no parece válido." : "Escribe tu email para poder responderte.";
  }
  const len = form.message.trim().length;
  if (!len) {
    badField.value = "message";
    return "Escribe un mensaje.";
  }
  if (len < MIN_MESSAGE) {
    badField.value = "message";
    return `Cuéntanos un poco más (mínimo ${MIN_MESSAGE} caracteres).`;
  }
  badField.value = "";
  return "";
}

async function onSubmit() {
  if (status.value === "sending") return;
  sendError.value = "";
  showFallback.value = false;
  error.value = validate();
  if (error.value) {
    status.value = "idle";
    // Se lleva el foco al campo que hay que corregir.
    document.getElementById(badField.value === "email" ? "c-mail" : "c-msg")?.focus();
    return;
  }
  status.value = "sending";
  try {
    const res = await sendContactMessage({
      reason: form.reason,
      name: form.name,
      email: form.email,
      game: form.reason === "juego" ? "" : form.game,
      gameName: form.reason === "juego" ? form.gameName : "",
      message: form.message.trim(),
      copy: form.copy && canCopy.value,
      website: form.website,
      elapsedMs: Date.now() - startedAt,
    });
    sentSubject.value = subject.value;
    copySentTo.value = form.copy && res.copySent ? form.email : "";
    status.value = "sent";
    // La tarjeta de "enviado" es más baja que el formulario: se sube hasta ella.
    await nextTick();
    if ((card.value?.getBoundingClientRect().top ?? 0) < 0) card.value.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    // El texto del formulario se conserva: se puede reintentar o abrir el correo.
    status.value = "error";
    sendStatus.value = err.status || 0;
    sendError.value = err.fallback === false || err.status === 429 ? err.message : "";
    showFallback.value = err.fallback !== false;
    if (err.status !== 400) console.warn("No se pudo enviar el formulario de contacto:", err);
  }
}

function again() {
  form.message = "";
  form.game = "";
  form.gameName = "";
  form.copy = false;
  error.value = "";
  badField.value = "";
  status.value = "idle";
}

function pickFromShortcut(reason) {
  form.reason = reason;
  if (status.value !== "sending") {
    if (status.value === "sent") again();
    status.value = "idle";
  }
  // En móvil la columna lateral va debajo del formulario: se sube hasta él.
  const top = card.value?.getBoundingClientRect().top ?? 0;
  if (top < 0) card.value.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<style scoped>
.view-contact {
  position: relative;
  overflow: clip;
  isolation: isolate;
  padding-bottom: 80px;
}
.glow {
  position: absolute;
  z-index: -1;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: drift 16s ease-in-out infinite alternate;
  pointer-events: none;
}
.glow.g1 {
  top: -200px;
  left: 10%;
  background: #B9832F;
}
.glow.g2 {
  top: 120px;
  right: -120px;
  background: #0F8F88;
  animation-duration: 19s;
  animation-direction: alternate-reverse;
}

/* ---------- layout ---------- */
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.card {
  flex: 999 1 600px;
  min-width: 0;
  border-radius: 26px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(13, 16, 22, 0.85);
  box-shadow: 0 40px 100px -50px rgba(0, 0, 0, 0.9);
  padding: 30px;
  animation: rise 0.8s 0.08s var(--ease-out) both;
}

/* ---------- formulario ---------- */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: #D6D3CB;
  animation: fade 0.35s ease both;
}
.inp {
  position: relative;
  display: flex;
  align-items: center;
}
.inp > svg {
  position: absolute;
  left: 15px;
  color: #8A93A0;
  pointer-events: none;
}
.inp input,
.field textarea {
  width: 100%;
  border-radius: 13px;
  border: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(255, 255, 255, 0.035);
  color: var(--ink);
  font: 400 15px/1.5 var(--font-body);
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
  appearance: none;
}
.inp input {
  height: 50px;
  padding: 0 14px 0 44px;
}
.field textarea {
  min-height: 170px;
  padding: 14px;
  resize: vertical;
}
.inp input::placeholder,
.field textarea::placeholder {
  color: var(--ink-faint);
}
.inp input:hover,
.field textarea:hover {
  border-color: rgba(255, 255, 255, 0.2);
}
.inp input:focus,
.field textarea:focus {
  border-color: rgba(212, 160, 74, 0.65);
  background: rgba(10, 13, 19, 0.9);
  box-shadow: 0 0 0 4px rgba(212, 160, 74, 0.14);
}
.inp:focus-within > svg {
  color: var(--gold-hi);
}
.inp.bad input,
.field textarea.bad {
  border-color: rgba(255, 106, 61, 0.6);
}
.count {
  align-self: flex-end;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-mute);
}
.trap {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.check {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #C6CBD2;
  cursor: pointer;
}
.check input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--gold);
}
.check.off {
  color: var(--ink-faint);
  cursor: default;
}
.copy-hint {
  margin-top: -8px;
  padding-left: 28px;
  font-size: 12.5px;
  color: var(--ink-faint);
}
.copy-hint a {
  color: var(--gold-hi);
}
.alert {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13.5px;
  background: rgba(255, 106, 61, 0.09);
  border: 1px solid rgba(255, 106, 61, 0.35);
  color: #FFB59C;
  animation: fade 0.3s ease both;
}
.alert svg {
  flex-shrink: 0;
  margin-top: 1px;
}
.alert a {
  color: var(--gm-gold);
  font-weight: 600;
}
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.send {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 54px;
  padding: 0 26px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #E8B865, #C8913A);
  color: #17120A;
  font: 600 15.5px/1 var(--font-body);
  cursor: pointer;
  box-shadow: 0 14px 34px -14px rgba(212, 160, 74, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.2s;
}
.send:hover:not(:disabled) {
  transform: translateY(-2px);
}
.send:focus-visible {
  outline: 2px solid var(--gm-gold);
  outline-offset: 3px;
}
.send svg {
  transition: transform 0.35s var(--ease-out);
}
.send:hover:not(:disabled) svg {
  transform: translate(4px, -4px) rotate(-8deg);
}
.send.busy svg {
  animation: launch 0.9s ease-in infinite;
}
.send:disabled {
  opacity: 0.75;
  cursor: default;
  transform: none;
}
.hint {
  font-size: 13px;
  color: var(--ink-mute);
}

@keyframes rise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: none; }
}
@keyframes drift {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(60px, 30px, 0) scale(1.15); }
}
@keyframes fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@keyframes launch {
  0% { transform: translate(0, 0) rotate(0); opacity: 1; }
  100% { transform: translate(160px, -120px) rotate(-18deg); opacity: 0; }
}

@media (max-width: 860px) {
  .card {
    padding: 20px;
  }
  .two {
    grid-template-columns: 1fr;
  }
}
</style>
