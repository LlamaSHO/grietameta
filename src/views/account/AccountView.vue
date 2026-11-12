<template>
  <!-- Mi cuenta: perfil, Premium, juegos favoritos y sesión. No tiene diseño
       propio: sigue el estilo de models/paginas/MiPremium.dc.html. -->
  <AccountShell title="Mi cuenta" sub="Tu perfil, tus juegos y tu suscripción.">
    <!-- PERFIL -->
    <section class="pm-box pm-sec">
      <div class="pm-sec-h">
        <div>
          <h2>Perfil</h2>
          <p>Así te verás en GrietaMeta.</p>
        </div>
      </div>

      <div class="me">
        <UserAvatar :name="displayName" :premium="isPremium" :size="64" />
        <div class="me-t">
          <strong>{{ displayName || "Sin nombre" }}</strong>
          <span>{{ state.user?.email }}</span>
        </div>
        <span v-if="isPremium" class="pm-tagp">Premium</span>
      </div>

      <form class="name-form" novalidate @submit.prevent="saveName">
        <label class="field">
          <span class="lbl">Nombre visible</span>
          <input
            v-model="nameInput"
            type="text"
            name="displayName"
            autocomplete="nickname"
            maxlength="40"
            :aria-invalid="!!nameError"
            aria-describedby="name-help"
          >
        </label>
        <button type="submit" class="pm-btn gold" :disabled="!nameChanged || nameSaving" :aria-busy="nameSaving">
          {{ nameSaving ? "Guardando…" : "Guardar" }}
        </button>
      </form>
      <p id="name-help" class="help">Entre 2 y 40 caracteres. Sale en el menú de tu cuenta.</p>
      <PmNotice v-if="nameError" class="msg">{{ nameError }}</PmNotice>
      <PmNotice v-else-if="nameSaved" type="ok" class="msg">Nombre guardado.</PmNotice>

      <div class="stats">
        <div class="stat">
          <span>Email</span>
          <b class="ellipsis">{{ state.user?.email }}</b>
        </div>
        <div class="stat">
          <span>Cuenta creada</span>
          <b>{{ createdText }}</b>
        </div>
        <div class="stat">
          <span>Plan</span>
          <b>{{ isPremium ? "Premium" : "Gratis" }}</b>
        </div>
      </div>
      <p class="help">¿Quieres cambiar el email? Escríbenos desde <RouterLink to="/contacto">Contacto</RouterLink>.</p>
    </section>

    <!-- PREMIUM -->
    <section class="pm-box pm-sec prem" :class="{ on: isPremium }">
      <PremiumCrown :size="56" :off="!isPremium" />
      <div class="prem-t">
        <h2 class="pm-disp">{{ isPremium ? "Eres Premium" : "Navega sin anuncios" }}</h2>
        <p>
          {{ isPremium
            ? "Gestiona tu suscripción, tus avisos por juego y tus facturas."
            : `Premium quita la publicidad en LoL, ARC Raiders y Zelda y te avisa de cada parche. Desde ${PLANS.yearly.perMonth}/mes.` }}
        </p>
      </div>
      <div class="prem-acts">
        <RouterLink v-if="isPremium" class="pm-btn gold" :to="{ name: 'account-premium' }">Ir a Mi Premium</RouterLink>
        <template v-else>
          <RouterLink class="pm-btn gold" :to="{ name: 'premium' }">Ver planes</RouterLink>
          <RouterLink class="pm-btn" :to="{ name: 'account-premium' }">Mi Premium</RouterLink>
        </template>
      </div>
    </section>

    <!-- JUEGOS FAVORITOS -->
    <section class="pm-box pm-sec">
      <div class="pm-sec-h">
        <div>
          <h2>Juegos favoritos</h2>
          <p>Márcalos para tenerlos a mano.</p>
        </div>
        <span class="save-state" :class="favState" aria-live="polite">{{ favText }}</span>
      </div>
      <div class="games" role="group" aria-label="Juegos favoritos">
        <button
          v-for="g in games"
          :key="g.slug"
          type="button"
          class="game"
          :class="{ on: favorites.includes(g.slug) }"
          :aria-pressed="favorites.includes(g.slug)"
          :disabled="favState === 'saving'"
          @click="toggleFavorite(g.slug)"
        >
          <img :src="g.icon" alt="">
          <span class="gn">{{ g.name }}</span>
          <svg class="star" width="18" height="18" viewBox="0 0 24 24" :fill="favorites.includes(g.slug) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15 9 22 9.5 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.5 9 9" /></svg>
        </button>
      </div>
      <PmNotice v-if="favError" class="msg">{{ favError }}</PmNotice>
    </section>

    <!-- SESIÓN -->
    <section class="pm-box pm-sec session">
      <div>
        <h2>Sesión</h2>
        <p>Cerrarás la sesión en este navegador. Tus favoritos y tu Premium se quedan en tu cuenta.</p>
      </div>
      <button type="button" class="pm-btn danger" :disabled="loggingOut" @click="onLogout">
        {{ loggingOut ? "Cerrando sesión…" : "Cerrar sesión" }}
      </button>
    </section>
  </AccountShell>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { fetchGames } from "@/services/games";
import AccountShell from "@/components/account/AccountShell.vue";
import UserAvatar from "@/components/account/UserAvatar.vue";
import PremiumCrown from "@/components/premium/PremiumCrown.vue";
import PmNotice from "@/components/premium/PmNotice.vue";
import { PLANS, shortDate, toDate } from "@/components/premium/plans.js";

const { state, isPremium, displayName, refreshProfile, logout } = useAuth();
const router = useRouter();

const createdText = computed(() => {
  const d = toDate(state.profile?.createdAt);
  return d ? shortDate(d) : "—";
});

// Mensaje claro para los errores de Firestore.
function saveErrorText(err, what) {
  if (err?.code === "permission-denied") return `No se ha podido guardar ${what}: el servidor no acepta este cambio (permiso denegado).`;
  if (err?.code === "unavailable") return "No hay conexión con el servidor. Revisa tu conexión y vuelve a intentarlo.";
  return `No se ha podido guardar ${what}. Vuelve a intentarlo.`;
}

async function saveProfile(changes) {
  const { updateUserProfile } = await import("@/services/firebase/users.js");
  await updateUserProfile(state.user.uid, changes);
  await refreshProfile().catch(() => {});
}

// ---- Nombre ----
const nameInput = ref(displayName.value);
watch(displayName, (v) => {
  if (!nameSaving.value) nameInput.value = v;
});
const nameChanged = computed(() => nameInput.value.trim() !== displayName.value);
const nameSaving = ref(false);
const nameError = ref("");
const nameSaved = ref(false);

async function saveName() {
  const name = nameInput.value.trim().replace(/\s+/g, " ");
  nameSaved.value = false;
  nameError.value = "";
  if (name.length < 2 || name.length > 40) {
    nameError.value = "El nombre debe tener entre 2 y 40 caracteres.";
    return;
  }
  nameSaving.value = true;
  try {
    await saveProfile({ displayName: name });
    nameInput.value = name;
    nameSaved.value = true;
  } catch (err) {
    console.error("No se pudo guardar el nombre:", err);
    nameError.value = saveErrorText(err, "el nombre");
  } finally {
    nameSaving.value = false;
  }
}

// ---- Juegos favoritos ----
const games = ref([]);
fetchGames().then((g) => (games.value = g));

const favorites = ref([]);
watch(
  () => state.profile?.favoriteGames,
  (v) => (favorites.value = Array.isArray(v) ? [...v] : []),
  { immediate: true }
);
const favState = ref("idle");
const favError = ref("");
const favText = computed(() => ({ saving: "Guardando…", saved: "Guardado", error: "Sin guardar" })[favState.value] || "");
let favTimer = null;

async function toggleFavorite(slug) {
  const before = [...favorites.value];
  favorites.value = before.includes(slug) ? before.filter((s) => s !== slug) : [...before, slug];
  favError.value = "";
  favState.value = "saving";
  clearTimeout(favTimer);
  try {
    await saveProfile({ favoriteGames: favorites.value });
    favState.value = "saved";
    favTimer = setTimeout(() => (favState.value = "idle"), 2500);
  } catch (err) {
    console.error("No se pudieron guardar los favoritos:", err);
    favorites.value = before;
    favState.value = "error";
    favError.value = saveErrorText(err, "tus favoritos");
  }
}

// ---- Sesión ----
const loggingOut = ref(false);
async function onLogout() {
  loggingOut.value = true;
  try {
    await logout();
    router.push("/");
  } finally {
    loggingOut.value = false;
  }
}
</script>

<style scoped>
.me {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}
.me-t {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.me-t strong {
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.me-t span {
  color: var(--ink-dim);
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-form {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-top: 22px;
}
.field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lbl {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.field input {
  height: 46px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.035);
  color: var(--ink);
  font: 500 15px/1 var(--font-body);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.field input:focus {
  border-color: rgba(232, 184, 101, 0.6);
  background: rgba(212, 160, 74, 0.05);
}
.field input[aria-invalid="true"] {
  border-color: rgba(255, 106, 61, 0.6);
}
.name-form .pm-btn:disabled {
  cursor: default;
  opacity: 0.5;
}
.help {
  margin: 8px 0 0;
  color: var(--ink-mute);
  font-size: 13px;
}
.help a {
  color: var(--gold);
}
.msg {
  margin-top: 12px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}
.stat {
  min-width: 0;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.stat span {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-mute);
}
.stat b {
  display: block;
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Premium */
.prem {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.prem.on {
  border-color: rgba(212, 160, 74, 0.35);
  background: radial-gradient(90% 120% at 0% 0%, rgba(212, 160, 74, 0.14), transparent 60%), rgba(255, 255, 255, 0.025);
}
.prem-t {
  flex: 1;
  min-width: 220px;
}
.prem-t h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.prem-t p {
  margin: 4px 0 0;
  color: var(--ink-dim);
  font-size: 14.5px;
}
.prem-acts {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Favoritos */
.save-state {
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
.games {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.game {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 64px;
  padding: 10px 14px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.035);
  color: var(--ink);
  font: 600 14.5px/1.25 var(--font-body);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.25s var(--ease-out);
}
.game:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}
.game.on {
  border-color: rgba(232, 184, 101, 0.55);
  background: rgba(212, 160, 74, 0.08);
}
.game:disabled {
  cursor: progress;
}
.game img {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  object-fit: contain;
}
.gn {
  flex: 1;
  min-width: 0;
}
.star {
  flex-shrink: 0;
  color: var(--ink-mute);
}
.game.on .star {
  color: var(--gm-gold);
}

/* Sesión */
.session {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.session h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 700;
}
.session p {
  margin: 4px 0 0;
  color: var(--ink-dim);
  font-size: 14.5px;
  max-width: 520px;
}

@media (max-width: 860px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .stats .stat:first-child {
    grid-column: 1 / -1;
  }
  .games {
    grid-template-columns: 1fr;
  }
  .prem-acts,
  .prem-acts .pm-btn,
  .session .pm-btn {
    flex: 1 1 100%;
  }
}
@media (max-width: 560px) {
  .name-form {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
