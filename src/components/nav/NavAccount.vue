<template>
  <!-- Extremo derecho del nav: "Hazte Premium" (si no lo es) y la cuenta. -->
  <div class="account">
    <template v-if="state.ready">
      <RouterLink v-if="!isPremium" class="btn-prem" to="/premium" aria-label="Hazte Premium">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" /></svg>
        <span class="lbl">Hazte Premium</span>
      </RouterLink>

      <RouterLink v-if="!isLoggedIn && !onLoginPage" class="btn-ghost" :to="loginLink">
        Iniciar sesión
      </RouterLink>

      <div v-else-if="isLoggedIn" ref="menuBox" class="user">
        <button
          type="button"
          class="btn-user"
          :class="{ premium: isPremium }"
          :aria-expanded="menuOpen"
          aria-haspopup="menu"
          @click="menuOpen = !menuOpen"
        >
          <span class="avatar" aria-hidden="true">{{ initials }}</span>
          <span class="name">{{ displayName }}</span>
          <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
        </button>

        <Transition name="pop">
          <div v-show="menuOpen" class="menu" role="menu">
            <div class="menu-head">
              <strong>{{ displayName }}</strong>
              <span>{{ state.user.email }}</span>
              <span v-if="isPremium" class="tag-premium">Premium</span>
            </div>
            <RouterLink class="menu-item" role="menuitem" to="/cuenta">Mi cuenta</RouterLink>
            <RouterLink class="menu-item" role="menuitem" to="/cuenta/premium">{{ isPremium ? "Mi Premium" : "Premium" }}</RouterLink>
            <button type="button" class="menu-item" role="menuitem" @click="onLogout">Cerrar sesión</button>
          </div>
        </Transition>
      </div>
    </template>
    <span v-else class="placeholder" aria-hidden="true" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { state, isLoggedIn, isPremium, displayName, logout } = useAuth();
const route = useRoute();
const router = useRouter();

const onLoginPage = computed(() => route.name === "login");
// Al iniciar sesión se vuelve a la página en la que estaba.
const loginLink = computed(() => ({ name: "login", query: route.fullPath !== "/" ? { redirect: route.fullPath } : {} }));

const initials = computed(() =>
  displayName.value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?"
);

const menuOpen = ref(false);
const menuBox = ref(null);
watch(() => route.fullPath, () => (menuOpen.value = false));

function onDocumentClick(e) {
  if (menuBox.value && !menuBox.value.contains(e.target)) menuOpen.value = false;
}
onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));

async function onLogout() {
  menuOpen.value = false;
  await logout();
  if (route.meta.requiresAuth) router.push("/");
}
</script>

<style scoped>
.account {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-self: end;
}

.btn-prem,
.btn-ghost,
.btn-user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 11px;
  font-family: inherit;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}

/* Botón dorado del diseño */
.btn-prem {
  background: linear-gradient(180deg, #E0AE58, #C8913A);
  color: #17120A;
  font-weight: 600;
  border: 0;
  box-shadow: 0 8px 24px -10px rgba(212, 160, 74, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-prem:hover {
  color: #17120A;
  transform: translateY(-1px);
  box-shadow: 0 12px 30px -10px rgba(212, 160, 74, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.btn-prem svg {
  transition: transform 0.4s var(--ease-out);
}
.btn-prem:hover svg {
  transform: rotate(-12deg) scale(1.15);
}

.btn-ghost {
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--ink);
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.22);
}

.user {
  position: relative;
}
.btn-user {
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0 12px 0 5px;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}
.btn-user:hover,
.btn-user[aria-expanded="true"] {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.22);
}
.avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: linear-gradient(135deg, #2A3344, #161B25);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-family: var(--font-brand);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.btn-user.premium .avatar {
  border-color: var(--gm-gold);
  box-shadow: 0 0 0 2px rgba(243, 200, 120, 0.22);
}
.name {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chev {
  color: var(--ink-mute);
}

.menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  min-width: 240px;
  background: #0F131B;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 14px;
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.95);
  padding: 6px;
  z-index: 70;
}
.menu-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: 6px;
  font-size: 13px;
}
.menu-head span {
  color: var(--ink-dim);
  overflow: hidden;
  text-overflow: ellipsis;
}
.menu-head .tag-premium {
  align-self: flex-start;
  margin-top: 6px;
  padding: 2px 9px;
  border-radius: 999px;
  border: 1px solid rgba(243, 200, 120, 0.5);
  color: var(--gm-gold);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-radius: 9px;
  color: var(--ink);
  font-family: inherit;
  font-size: 14px;
  text-decoration: none;
  padding: 9px 10px;
  cursor: pointer;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.18s, transform 0.22s var(--ease-out);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.placeholder {
  display: block;
  width: 120px;
  height: 40px;
}

/* En móvil la cuenta está en la barra inferior. */
@media (max-width: 860px) {
  .btn-ghost,
  .user {
    display: none;
  }
}
@media (max-width: 480px) {
  .btn-prem {
    padding: 0 12px;
  }
  .btn-prem .lbl {
    display: none;
  }
}
</style>
