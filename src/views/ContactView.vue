<template>
  <div class="view-contact">
    <div class="wrap">
      <header class="head">
        <h1>Contáctanos</h1>
        <p>¿Falta algo, necesitas ayuda o quieres que añadamos un juego? Cuéntanoslo y te respondemos por email.</p>
      </header>

      <div class="grid">
        <form class="card" novalidate @submit.prevent="onSubmit">
          <fieldset class="reasons">
            <legend>¿Sobre qué nos escribes?</legend>
            <label v-for="r in REASONS" :key="r.id" class="reason" :class="{ on: form.reason === r.id }">
              <input v-model="form.reason" type="radio" name="reason" :value="r.id">
              <strong>{{ r.label }}</strong>
              <span>{{ r.hint }}</span>
            </label>
          </fieldset>

          <div class="two">
            <label class="field">
              <span>Nombre</span>
              <input v-model.trim="form.name" type="text" autocomplete="name" placeholder="Cómo te llamas">
            </label>
            <label class="field">
              <span>Tu email</span>
              <input v-model.trim="form.email" type="email" autocomplete="email" placeholder="Para poder responderte">
            </label>
          </div>

          <label v-if="form.reason === 'juego'" class="field">
            <span>¿Qué juego?</span>
            <input v-model.trim="form.game" type="text" placeholder="Ej. Valorant, Elden Ring…">
          </label>

          <label class="field">
            <span>Mensaje</span>
            <textarea v-model.trim="form.message" rows="6" :placeholder="currentReason.placeholder" />
          </label>

          <div v-if="error" class="alert" role="alert">{{ error }}</div>

          <div class="actions">
            <button type="submit" class="btn-primary">Preparar email</button>
            <span class="hint">Se abrirá tu aplicación de correo con el mensaje listo para enviar.</span>
          </div>
        </form>

        <aside class="side">
          <div class="card small">
            <h3>Email directo</h3>
            <p>Si lo prefieres, escríbenos a:</p>
            <a class="mail" :href="`mailto:${CONTACT_EMAIL}`">{{ CONTACT_EMAIL }}</a>
          </div>
          <div class="card small">
            <h3>Qué nos ayuda</h3>
            <ul>
              <li>En qué página y juego estabas.</li>
              <li>Qué esperabas ver y qué viste.</li>
              <li>Si es un dato, de dónde lo has sacado.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const CONTACT_EMAIL = "ekainarlla@gmail.com";

const REASONS = [
  { id: "falta", label: "Falta algo", hint: "Un dato, un campeón, una misión…", placeholder: "Cuéntanos qué echas en falta y dónde." },
  { id: "juego", label: "Añadir un juego", hint: "Quieres verlo en GrietaMeta", placeholder: "¿Qué te gustaría encontrar de ese juego?" },
  { id: "error", label: "Hay un error", hint: "Algo no funciona o está mal", placeholder: "¿Qué ha pasado? ¿En qué página?" },
  { id: "ayuda", label: "Necesito ayuda", hint: "Con tu cuenta o con Premium", placeholder: "Explícanos en qué te podemos ayudar." },
  { id: "otro", label: "Otra cosa", hint: "Sugerencias, colaboraciones…", placeholder: "Escribe tu mensaje." },
];

const route = useRoute();
const { state, displayName } = useAuth();

const form = reactive({
  reason: REASONS.some((r) => r.id === route.query.motivo) ? route.query.motivo : "falta",
  name: "",
  email: "",
  game: "",
  message: "",
});
const error = ref("");
const currentReason = computed(() => REASONS.find((r) => r.id === form.reason));

// Si hay sesión, se rellenan nombre y email.
watch(
  () => state.user,
  (u) => {
    if (!u) return;
    form.name ||= displayName.value;
    form.email ||= u.email;
  },
  { immediate: true }
);

function onSubmit() {
  error.value = "";
  if (!form.message) {
    error.value = "Escribe un mensaje.";
    return;
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    error.value = "Revisa tu email, no parece válido.";
    return;
  }
  const subject = `[GrietaMeta] ${currentReason.value.label}${form.reason === "juego" && form.game ? `: ${form.game}` : ""}`;
  const body = [
    form.message,
    "",
    "—",
    form.name && `Nombre: ${form.name}`,
    form.email && `Email: ${form.email}`,
  ]
    .filter((l) => l !== false && l !== "")
    .join("\n");
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
</script>

<style scoped>
.view-contact {
  padding: 56px 0 80px;
  background: radial-gradient(900px 340px at 50% 0%, rgba(200, 150, 62, 0.08), transparent 70%);
}
.wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 28px;
}
.head h1 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 38px;
  font-weight: 600;
}
.head p {
  margin: 10px 0 34px;
  max-width: 560px;
  color: var(--ink-dim);
  font-size: 16px;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 20px;
  align-items: start;
}
.card {
  background: var(--panel);
  border: 1px solid var(--panel-line);
  padding: 28px;
}
form.card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.reasons {
  border: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 10px;
}
.reasons legend {
  padding: 0;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
}
.reason {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 14px;
  background: var(--bg-raised);
  border: 1px solid var(--panel-line);
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.reason input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.reason strong {
  font-size: 14px;
}
.reason span {
  font-size: 12.5px;
  color: var(--ink-dim);
}
.reason:hover {
  border-color: #343D4D;
}
.reason.on {
  border-color: var(--gold);
  background: rgba(200, 150, 62, 0.07);
}
.reason:focus-within {
  box-shadow: 0 0 0 3px rgba(200, 150, 62, 0.18);
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
}
.field input,
.field textarea {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-raised);
  border: 1px solid var(--panel-line);
  color: var(--ink);
  font-family: inherit;
  font-size: 15px;
  font-weight: 400;
  outline: none;
  resize: vertical;
}
.field input::placeholder,
.field textarea::placeholder {
  color: var(--ink-faint);
}
.field input:focus,
.field textarea:focus {
  border-color: var(--gold-soft);
  box-shadow: 0 0 0 3px rgba(200, 150, 62, 0.14);
}

.alert {
  padding: 11px 14px;
  font-size: 13.5px;
  border-left: 3px solid #C0574F;
  background: rgba(192, 87, 79, 0.1);
  color: #E7A39D;
}
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.btn-primary {
  height: 46px;
  padding: 0 24px;
  background: linear-gradient(180deg, #E3B55C, var(--gold));
  border: 1px solid #E3B55C;
  color: #17120A;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:hover {
  background: linear-gradient(180deg, #EEC572, #D3A14A);
}
.hint {
  color: var(--ink-faint);
  font-size: 12.5px;
}

.side {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card.small {
  padding: 22px;
}
.card.small h3 {
  margin: 0 0 8px;
  font-family: "Cinzel", serif;
  font-size: 16px;
  font-weight: 600;
}
.card.small p,
.card.small ul {
  margin: 0;
  color: var(--ink-dim);
  font-size: 13.5px;
}
.card.small ul {
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mail {
  display: inline-block;
  margin-top: 8px;
  color: var(--gold);
  text-decoration: none;
  font-weight: 600;
  word-break: break-all;
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .two {
    grid-template-columns: 1fr;
  }
  .wrap {
    padding: 0 16px;
  }
}
</style>
