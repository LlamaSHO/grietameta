<template>
  <!-- Acceso (models/paginas/Login.dc.html): iniciar sesión, crear cuenta y
       recuperar contraseña. El nav, el footer y la barra móvil los pinta App.vue. -->
  <div class="view-login">
    <div class="fx" aria-hidden="true">
      <div class="bg-grid" />
      <div class="glow g1" />
      <div class="glow g2" />
    </div>

    <div class="main">
      <AuthDecor />
      <div class="wrap">
        <div class="auth">
          <AuthShowcase />

          <section class="panel">
            <AuthSignedIn
              v-if="isLoggedIn && !justSignedIn"
              :name="displayName"
              :email="state.user?.email || ''"
              :premium="isPremium"
              :continue-to="redirectTo"
              :busy="loggingOut"
              @logout="onLogout"
            />

            <template v-else>
              <AuthTabs v-if="mode !== 'reset'" :model-value="mode" controls="auth-form" @update:model-value="setMode" />
              <button v-else type="button" class="backlink" @click="setMode('login')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 6 5 12 11 18" /></svg>
                Volver a iniciar sesión
              </button>

              <h1 :key="`t-${mode}`" class="title">{{ copy.title }}</h1>
              <p :key="`l-${mode}`" class="lead">{{ copy.lead }}</p>

              <AuthAlert v-if="!state.available" class="unavailable">
                El inicio de sesión no está disponible ahora mismo. Inténtalo más tarde.
              </AuthAlert>

              <template v-if="mode !== 'reset'">
                <SocialLogin :busy="busy === 'google' ? 'go' : busy ? 'form' : ''" @google="onGoogle" />
                <div class="or">o con tu email</div>
              </template>

              <form
                id="auth-form"
                class="form"
                novalidate
                :role="mode !== 'reset' ? 'tabpanel' : undefined"
                :aria-labelledby="mode !== 'reset' ? `tab-${mode}` : undefined"
                @submit.prevent="onSubmit"
              >
                <AuthField
                  v-if="mode === 'register'"
                  id="f-user"
                  v-model="form.displayName"
                  label="Nombre de usuario"
                  icon="user"
                  autocomplete="nickname"
                  maxlength="40"
                  placeholder="Cómo quieres que te veamos"
                />

                <AuthField
                  id="f-mail"
                  v-model="form.email"
                  label="Email"
                  type="email"
                  autocomplete="email"
                  placeholder="tu@email.com"
                  :bad="badFields"
                />

                <PasswordField
                  v-if="mode !== 'reset'"
                  :key="`p-${mode}`"
                  v-model="form.password"
                  :is-new="mode === 'register'"
                  :meter="mode === 'register'"
                  :bad="badFields"
                >
                  <template v-if="mode === 'login'" #aside>
                    <button type="button" class="link" @click="setMode('reset')">¿La has olvidado?</button>
                  </template>
                </PasswordField>

                <AuthAlert v-if="error">{{ error }}</AuthAlert>
                <AuthAlert v-if="notice" type="ok">{{ notice }}</AuthAlert>

                <button type="submit" class="submit" :disabled="!!busy || !state.available">
                  <span v-if="busy === 'form'" class="spinner" aria-hidden="true" />
                  {{ busy === "form" ? "Un momento…" : copy.submit }}
                </button>
              </form>

              <p v-if="mode === 'login'" class="switch">
                ¿Aún no tienes cuenta? <button type="button" class="link" @click="setMode('register')">Créala gratis</button>
              </p>
              <template v-else-if="mode === 'register'">
                <p class="switch">
                  ¿Ya tienes cuenta? <button type="button" class="link" @click="setMode('login')">Inicia sesión</button>
                </p>
                <p class="fine">
                  Al crear una cuenta aceptas nuestra <RouterLink to="/privacidad">política de privacidad</RouterLink>.
                </p>
              </template>
            </template>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import AuthDecor from "@/components/auth/AuthDecor.vue";
import AuthShowcase from "@/components/auth/AuthShowcase.vue";
import AuthTabs from "@/components/auth/AuthTabs.vue";
import AuthSignedIn from "@/components/auth/AuthSignedIn.vue";
import AuthField from "@/components/auth/AuthField.vue";
import PasswordField from "@/components/auth/PasswordField.vue";
import AuthAlert from "@/components/auth/AuthAlert.vue";
import SocialLogin from "@/components/auth/SocialLogin.vue";

const route = useRoute();
const router = useRouter();
const { state, isLoggedIn, isPremium, displayName, login, register, logout, resetPassword, loginWithGoogle } = useAuth();

// ?modo=registro | recuperar (sin modo = iniciar sesión).
const MODES = { login: "login", registro: "register", recuperar: "reset" };
const QUERY = { login: undefined, register: "registro", reset: "recuperar" };
const mode = ref(MODES[route.query.modo] || "login");

const COPY = {
  login: { title: "Bienvenido de nuevo", lead: "Entra con tu cuenta de juego o con tu email.", submit: "Iniciar sesión" },
  register: { title: "Crea tu cuenta", lead: "Es gratis y tardas menos de un minuto.", submit: "Crear cuenta" },
  reset: { title: "Recupera tu contraseña", lead: "Te enviaremos un enlace para elegir una nueva.", submit: "Enviar enlace" },
};
const copy = computed(() => COPY[mode.value]);

const form = reactive({ displayName: "", email: "", password: "" });
const busy = ref("");          // "" | "form" | "google"
const error = ref("");
const errorFromCredentials = ref(false); // marca en rojo email y contraseña
const notice = ref("");
const justSignedIn = ref(false);
const loggingOut = ref(false);

const badFields = computed(() => !!error.value && errorFromCredentials.value && mode.value !== "reset");

// Solo se vuelve a rutas internas (evita redirecciones a otras webs). Se
// rechazan "//x" y "/\x" (el navegador trata "\" como "/") y volver a /login.
const redirectTo = computed(() => {
  const r = route.query.redirect;
  if (typeof r !== "string" || !/^\/(?![/\\])/.test(r) || r.includes("\\")) return "/";
  return /^\/login(?:[/?#]|$)/.test(r) ? "/" : r;
});

function clearMessages() {
  error.value = "";
  errorFromCredentials.value = false;
  notice.value = "";
}

function setMode(m) {
  if (m === mode.value) return;
  mode.value = m;
  clearMessages();
  router.replace({ query: { ...route.query, modo: QUERY[m] } });
}
// También si se cambia el modo desde la URL estando ya en la página.
watch(() => route.query.modo, (q) => {
  const m = MODES[q] || "login";
  if (m === mode.value) return;
  mode.value = m;
  clearMessages();
});

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
  // Google
  "auth/operation-not-allowed": "El acceso con Google aún no está disponible. De momento, entra con tu email.",
  "auth/popup-closed-by-user": "Has cerrado la ventana de Google antes de terminar. Vuelve a intentarlo cuando quieras.",
  "auth/popup-blocked": "Tu navegador ha bloqueado la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.",
  "auth/account-exists-with-different-credential": "Ya hay una cuenta con ese email. Entra con tu email y tu contraseña.",
  "auth/unauthorized-domain": "El acceso con Google no está disponible en esta dirección.",
};
const CREDENTIAL_ERRORS = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"];

// Devuelve [mensaje, id del campo que hay que corregir] o null si todo está bien.
function validate() {
  if (mode.value === "register" && !form.displayName) return ["Escribe un nombre de usuario.", "f-user"];
  if (!form.email) return ["Escribe tu email.", "f-mail"];
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return ["Escribe un email válido.", "f-mail"];
  if (mode.value !== "reset" && !form.password) return ["Escribe tu contraseña.", "f-pass"];
  if (mode.value === "register" && form.password.length < 6) return [ERRORS["auth/weak-password"], "f-pass"];
  return null;
}

async function onSubmit() {
  clearMessages();
  const invalid = validate();
  if (invalid) {
    error.value = invalid[0];
    // El foco va al campo que hay que corregir (útil con teclado y lector de pantalla).
    document.getElementById(invalid[1])?.focus();
    return;
  }
  busy.value = "form";
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
      errorFromCredentials.value = CREDENTIAL_ERRORS.includes(err.code);
      console.error(err);
    }
  } finally {
    busy.value = "";
  }
}

async function onGoogle() {
  if (busy.value || !state.available) return;
  clearMessages();
  busy.value = "google";
  justSignedIn.value = true;
  try {
    await loginWithGoogle();
    router.replace(redirectTo.value);
  } catch (err) {
    justSignedIn.value = false;
    // Si el usuario abre otra ventana encima de la primera no hace falta avisar.
    if (err.code !== "auth/cancelled-popup-request") {
      error.value = ERRORS[err.code] || "No se pudo entrar con Google. Inténtalo de nuevo.";
      // Cerrar o bloquear la ventana es cosa del usuario/navegador, no un fallo.
      if (!["auth/popup-closed-by-user", "auth/popup-blocked"].includes(err.code)) console.error(err);
    }
  } finally {
    busy.value = "";
  }
}

async function onLogout() {
  loggingOut.value = true;
  try {
    await logout();
    clearMessages();
    form.password = "";
  } finally {
    loggingOut.value = false;
  }
}
</script>

<style scoped>
.view-login {
  position: relative;
  min-height: 100%;
  overflow: clip;
  isolation: isolate;
}
/* Fondo: rejilla de puntos y dos brillos. Se desvanece abajo para que el
   brillo no se corte de golpe donde acaba la vista. */
.fx {
  position: absolute;
  inset: 0;
  z-index: -2;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent);
  mask-image: linear-gradient(180deg, #000 70%, transparent);
}
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1.2px);
  background-size: 30px 30px;
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 20%, transparent 75%);
}
.glow {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: drift 16s ease-in-out infinite alternate;
  pointer-events: none;
}
.glow.g1 {
  top: -120px;
  left: 4%;
  background: #B9832F;
}
.glow.g2 {
  bottom: -160px;
  right: 4%;
  background: #0F8F88;
  animation-duration: 19s;
  animation-direction: alternate-reverse;
}

/* ---------- contenedor ---------- */
.main {
  position: relative;
  display: flex;
  align-items: center;
  padding: 44px 0 56px;
  isolation: isolate;
}
.wrap {
  width: 100%;
}
.auth {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  width: 100%;
  /* Alto fijo: cambiar de pestaña no hace saltar la tarjeta. */
  height: 860px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(11, 14, 20, 0.82);
  box-shadow: 0 50px 120px -50px rgba(0, 0, 0, 0.9);
  overflow: hidden;
  animation: rise 0.8s var(--ease-out) both;
}

/* ---------- formulario ---------- */
.panel {
  display: flex;
  flex-direction: column;
  /* "safe": si avisos y errores no caben en la tarjeta de alto fijo, el
     contenido empieza arriba y se desplaza en vez de cortarse. */
  justify-content: safe center;
  padding: 40px 52px;
  overflow-x: hidden;
  overflow-y: auto;
}
.backlink {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 26px;
  padding: 0;
  border: none;
  background: none;
  color: #C6CBD2;
  font: 500 14px/1 var(--font-body);
  cursor: pointer;
}
.backlink:hover {
  color: var(--gm-gold);
}
.title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  animation: fade 0.4s ease both;
}
.lead {
  margin: 8px 0 26px;
  color: var(--ink-dim);
  font-size: 15px;
  animation: fade 0.4s 0.05s ease both;
}
.unavailable {
  margin-bottom: 18px;
}

.or {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 20px 0;
  color: var(--ink-mute);
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.or::before,
.or::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.09);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.link {
  padding: 0;
  border: none;
  background: none;
  color: var(--gold-hi);
  font: 500 13px/1.4 var(--font-body);
  cursor: pointer;
}
.link:hover {
  color: var(--gm-gold);
  text-decoration: underline;
}

.submit {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  margin-top: 4px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #E8B865, #C8913A);
  color: #17120A;
  font: 600 15.5px/1 var(--font-body);
  cursor: pointer;
  box-shadow: 0 14px 34px -14px rgba(212, 160, 74, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}
.submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 40px -14px rgba(212, 160, 74, 1), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.submit:disabled {
  opacity: 0.7;
  cursor: default;
  transform: none;
}
.submit:focus-visible {
  outline: 2px solid var(--gm-gold);
  outline-offset: 3px;
}
.spinner {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 2px solid rgba(23, 18, 10, 0.3);
  border-top-color: #17120A;
  animation: gm-spin 0.7s linear infinite;
}
.switch {
  margin: 22px 0 0;
  text-align: center;
  color: var(--ink-dim);
  font-size: 14px;
}
.switch .link {
  font-size: 14px;
  font-weight: 600;
}
.fine {
  margin: 12px 0 0;
  text-align: center;
  color: var(--ink-mute);
  font-size: 12.5px;
}
.fine a {
  color: #C6CBD2;
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

@media (max-width: 980px) {
  .auth {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 860px;
  }
  .panel {
    padding: 36px 28px;
  }
}
@media (max-width: 560px) {
  .main {
    padding: 20px 0 36px;
  }
  .auth {
    border-radius: 22px;
    min-height: 820px;
  }
  .panel {
    padding: 28px 20px;
  }
}
</style>
