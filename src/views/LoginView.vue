<template>
  <div class="view-login">
    <div class="shell">
      <!-- Panel de presentación -->
      <aside class="showcase" aria-hidden="true">
        <div class="glow" />
        <span class="hex" />
        <h2>Tu meta,<br><em>siempre contigo</em>.</h2>
        <ul class="perks">
          <li><span class="dot" />Guarda tus juegos favoritos y tu progreso.</li>
          <li><span class="dot" />Tu cuenta funciona en todos los juegos de GrietaMeta.</li>
          <li><span class="dot" />Con Premium navegas sin anuncios y recibes las alertas de parche antes que nadie.</li>
        </ul>
        <div class="games">
          <GameIcon v-for="g in games" :key="g.slug" :game="g" />
        </div>
      </aside>

      <!-- Formulario -->
      <section class="panel">
        <template v-if="isLoggedIn && !justSignedIn">
          <h1>Ya has iniciado sesión</h1>
          <p class="lead">Estás conectado como <strong>{{ displayName }}</strong> ({{ state.user.email }}).</p>
          <div class="row-actions">
            <RouterLink class="btn-primary" :to="redirectTo">Continuar</RouterLink>
            <button type="button" class="btn-ghost" @click="logout">Cerrar sesión</button>
          </div>
        </template>

        <template v-else>
          <div v-if="mode !== 'reset'" class="tabs" role="tablist">
            <button type="button" role="tab" :aria-selected="mode === 'login'" :class="{ on: mode === 'login' }" @click="setMode('login')">Iniciar sesión</button>
            <button type="button" role="tab" :aria-selected="mode === 'register'" :class="{ on: mode === 'register' }" @click="setMode('register')">Crear cuenta</button>
          </div>

          <h1>{{ copy.title }}</h1>
          <p class="lead">{{ copy.lead }}</p>

          <div v-if="!state.available" class="alert err">
            El inicio de sesión no está disponible ahora mismo. Inténtalo más tarde.
          </div>

          <form novalidate @submit.prevent="onSubmit">
            <label v-if="mode === 'register'" class="field">
              <span>Nombre de usuario</span>
              <input v-model.trim="form.displayName" type="text" autocomplete="nickname" maxlength="40" placeholder="Cómo quieres que te veamos" required>
            </label>

            <label class="field">
              <span>Email</span>
              <input v-model.trim="form.email" type="email" autocomplete="email" placeholder="tu@email.com" required>
            </label>

            <label v-if="mode !== 'reset'" class="field">
              <span class="field-head">
                Contraseña
                <button v-if="mode === 'login'" type="button" class="link" @click="setMode('reset')">¿La has olvidado?</button>
              </span>
              <span class="pw">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :autocomplete="mode === 'register' ? 'new-password' : 'current-password'"
                  :placeholder="mode === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña'"
                  required
                >
                <button type="button" class="pw-toggle" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                </button>
              </span>
            </label>

            <div v-if="error" class="alert err" role="alert">{{ error }}</div>
            <div v-if="notice" class="alert ok" role="status">{{ notice }}</div>

            <button type="submit" class="btn-primary block" :disabled="busy || !state.available">
              <span v-if="busy" class="spinner" aria-hidden="true" />
              {{ busy ? "Un momento…" : copy.submit }}
            </button>
          </form>

          <p class="switch">
            <template v-if="mode === 'login'">¿Aún no tienes cuenta? <button type="button" class="link" @click="setMode('register')">Créala gratis</button></template>
            <template v-else-if="mode === 'register'">¿Ya tienes cuenta? <button type="button" class="link" @click="setMode('login')">Inicia sesión</button></template>
            <template v-else><button type="button" class="link" @click="setMode('login')">← Volver a iniciar sesión</button></template>
          </p>

          <p v-if="mode === 'register'" class="fine">
            Al crear una cuenta aceptas nuestra <RouterLink to="/privacidad">política de privacidad</RouterLink>.
          </p>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import GameIcon from "@/components/GameIcon.vue";
import { useAuth } from "@/composables/useAuth";
import { fetchGames } from "@/services/games";

const route = useRoute();
const router = useRouter();
const { state, isLoggedIn, displayName, login, register, logout, resetPassword } = useAuth();

const games = ref([]);
fetchGames().then((g) => (games.value = g));

const MODES = { login: "login", registro: "register", recuperar: "reset" };
const QUERY = { login: undefined, register: "registro", reset: "recuperar" };
const mode = ref(MODES[route.query.modo] || "login");

const COPY = {
  login: { title: "Bienvenido de nuevo", lead: "Entra con tu email y tu contraseña.", submit: "Iniciar sesión" },
  register: { title: "Crea tu cuenta", lead: "Es gratis y tardas menos de un minuto.", submit: "Crear cuenta" },
  reset: { title: "Recupera tu contraseña", lead: "Te enviaremos un enlace para elegir una nueva.", submit: "Enviar enlace" },
};
const copy = computed(() => COPY[mode.value]);

const form = reactive({ displayName: "", email: "", password: "" });
const showPassword = ref(false);
const busy = ref(false);
const error = ref("");
const notice = ref("");
const justSignedIn = ref(false);

// Solo se vuelve a rutas internas (evita redirecciones a otras webs).
const redirectTo = computed(() => {
  const r = route.query.redirect;
  return typeof r === "string" && r.startsWith("/") && !r.startsWith("//") ? r : "/";
});

function setMode(m) {
  mode.value = m;
  error.value = "";
  notice.value = "";
  router.replace({ query: { ...route.query, modo: QUERY[m] } });
}
watch(() => route.query.modo, (q) => (mode.value = MODES[q] || "login"));

const ERRORS = {
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/wrong-password": "Email o contraseña incorrectos.",
  "auth/user-not-found": "Email o contraseña incorrectos.",
  "auth/invalid-email": "Ese email no es válido.",
  "auth/email-already-in-use": "Ya hay una cuenta con ese email. Prueba a iniciar sesión.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Espera un poco y vuelve a probar.",
  "auth/network-request-failed": "No hay conexión. Revisa tu internet e inténtalo de nuevo.",
  "auth/user-disabled": "Esta cuenta está desactivada.",
  "permission-denied": "Tu cuenta se creó, pero no pudimos guardar tu perfil. Inténtalo más tarde.",
};

function validate() {
  if (mode.value === "register" && !form.displayName) return "Escribe un nombre de usuario.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Escribe un email válido.";
  if (mode.value !== "reset" && !form.password) return "Escribe tu contraseña.";
  if (mode.value === "register" && form.password.length < 6) return ERRORS["auth/weak-password"];
  return "";
}

async function onSubmit() {
  error.value = validate();
  notice.value = "";
  if (error.value) return;
  busy.value = true;
  try {
    if (mode.value === "reset") {
      await resetPassword(form.email);
      notice.value = "Si hay una cuenta con ese email, te hemos enviado un enlace para cambiar la contraseña.";
    } else {
      justSignedIn.value = true;
      if (mode.value === "login") await login(form.email, form.password);
      else await register({ email: form.email, password: form.password, displayName: form.displayName });
      router.replace(redirectTo.value);
    }
  } catch (err) {
    justSignedIn.value = false;
    // Para recuperar contraseña no se revela si el email existe.
    if (mode.value === "reset" && err.code === "auth/user-not-found") {
      notice.value = "Si hay una cuenta con ese email, te hemos enviado un enlace para cambiar la contraseña.";
    } else {
      error.value = ERRORS[err.code] || "Algo ha fallado. Inténtalo de nuevo.";
      console.error(err);
    }
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.view-login {
  display: flex;
  justify-content: center;
  padding: 56px 20px 80px;
  background: radial-gradient(900px 420px at 50% 0%, rgba(200, 150, 62, 0.08), transparent 70%);
}

.shell {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 980px;
  min-height: 560px;
  background: var(--panel);
  border: 1px solid var(--panel-line);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}

/* ---- panel de presentación ---- */
.showcase {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 22px;
  padding: 44px;
  background: linear-gradient(160deg, #18202C 0%, #0E131B 60%, #0A0D12 100%);
  border-right: 1px solid var(--panel-line);
}
.glow {
  position: absolute;
  inset: -30% -30% auto auto;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(20, 195, 184, 0.16), transparent 65%);
  pointer-events: none;
}
.hex {
  position: absolute;
  top: 40px;
  left: 44px;
  width: 58px;
  height: 58px;
  background: linear-gradient(135deg, var(--gold), var(--teal));
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  box-shadow: 0 0 40px rgba(200, 150, 62, 0.3);
}
.showcase h2 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 34px;
  line-height: 1.15;
  font-weight: 600;
  color: var(--ink);
}
.showcase h2 em {
  font-style: normal;
  color: var(--gold);
}
.perks {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--ink-dim);
  font-size: 14.5px;
}
.perks li {
  display: flex;
  gap: 12px;
  align-items: baseline;
}
.dot {
  flex: 0 0 7px;
  height: 7px;
  transform: rotate(45deg) translateY(-1px);
  background: var(--teal);
}
.games {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}
.games :deep(.g-ico) {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  font-size: 10px;
}

/* ---- formulario ---- */
.panel {
  padding: 44px 48px;
  display: flex;
  flex-direction: column;
}
.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--panel-line);
}
.tabs button {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 12px 0;
  color: var(--ink-dim);
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
}
.tabs button.on {
  color: var(--ink);
  border-color: var(--gold);
}
h1 {
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 26px;
  font-weight: 600;
  color: var(--ink);
}
.lead {
  margin: 8px 0 24px;
  color: var(--ink-dim);
  font-size: 14.5px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}
.field-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.field input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  background: var(--bg-raised);
  border: 1px solid var(--panel-line);
  color: var(--ink);
  font-family: inherit;
  font-size: 15px;
  font-weight: 400;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.field input::placeholder {
  color: var(--ink-faint);
}
.field input:focus {
  border-color: var(--gold-soft);
  box-shadow: 0 0 0 3px rgba(200, 150, 62, 0.14);
}
.pw {
  position: relative;
}
.pw input {
  padding-right: 46px;
}
.pw-toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  background: none;
  border: none;
  color: var(--ink-dim);
  cursor: pointer;
}
.pw-toggle:hover {
  color: var(--ink);
}

.link {
  background: none;
  border: none;
  padding: 0;
  color: var(--gold);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.link:hover {
  text-decoration: underline;
}

.alert {
  padding: 11px 14px;
  font-size: 13.5px;
  border-left: 3px solid;
}
.alert.err {
  background: rgba(192, 87, 79, 0.1);
  border-color: #C0574F;
  color: #E7A39D;
}
.alert.ok {
  background: rgba(79, 169, 122, 0.1);
  border-color: #4FA97A;
  color: #9ED3B5;
}

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 46px;
  padding: 0 22px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.btn-primary {
  background: linear-gradient(180deg, #E3B55C, var(--gold));
  border: 1px solid #E3B55C;
  color: #17120A;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #EEC572, #D3A14A);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: default;
}
.btn-primary.block {
  width: 100%;
  margin-top: 6px;
}
.btn-ghost {
  background: none;
  border: 1px solid var(--panel-line);
  color: var(--ink);
}
.btn-ghost:hover {
  border-color: var(--gold-soft);
}
.row-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(23, 18, 10, 0.3);
  border-top-color: #17120A;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.switch {
  margin: 22px 0 0;
  text-align: center;
  color: var(--ink-dim);
  font-size: 14px;
}
.switch .link {
  font-size: 14px;
}
.fine {
  margin: 14px 0 0;
  text-align: center;
  color: var(--ink-faint);
  font-size: 12px;
}
.fine a {
  color: var(--ink-dim);
}

@media (max-width: 820px) {
  .shell {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .showcase {
    display: none;
  }
  .panel {
    padding: 32px 24px;
  }
  .view-login {
    padding-top: 28px;
  }
}
</style>
