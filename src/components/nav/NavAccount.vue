<template>
  <!-- Extremo derecho del nav: "Hazte Premium" (si no lo es) y la cuenta. -->
  <div class="account">
    <template v-if="state.ready">
      <RouterLink v-if="!isPremium" class="btn-premium" to="/lol#premium">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 7l4.5 4L12 4l4.5 7L21 7l-2 12H5L3 7z" /></svg>
        Hazte Premium
      </RouterLink>

      <RouterLink v-if="!isLoggedIn && !onLoginPage" class="btn-signin" :to="loginLink">
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

        <div v-show="menuOpen" class="menu" role="menu">
          <div class="menu-head">
            <strong>{{ displayName }}</strong>
            <span>{{ state.user.email }}</span>
            <span v-if="isPremium" class="tag-premium">Premium</span>
          </div>
          <button type="button" class="menu-item" role="menuitem" @click="onLogout">Cerrar sesión</button>
        </div>
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

.btn-premium,
.btn-signin,
.btn-user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.btn-premium {
  background: linear-gradient(180deg, #E3B55C, var(--gold));
  color: #17120A;
  border: 1px solid #E3B55C;
}
.btn-premium:hover {
  transform: translateY(-1px);
  background: linear-gradient(180deg, #EEC572, #D3A14A);
}

.btn-signin {
  background: var(--panel);
  color: var(--ink);
  border: 1px solid var(--panel-line);
}
.btn-signin:hover {
  border-color: var(--gold-soft);
}

.user {
  position: relative;
}
.btn-user {
  background: var(--panel);
  color: var(--ink);
  border: 1px solid var(--panel-line);
  padding: 0 12px 0 5px;
}
.btn-user:hover,
.btn-user[aria-expanded="true"] {
  border-color: var(--gold-soft);
}
.avatar {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2A3344, #1B2230);
  border: 1px solid var(--panel-line);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.btn-user.premium .avatar {
  border-color: var(--gold);
  box-shadow: 0 0 0 2px rgba(200, 150, 62, 0.25);
}
.name {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chev {
  color: var(--ink-dim);
}

.menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 230px;
  background: var(--panel);
  border: 1px solid var(--panel-line);
  border-radius: 8px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  padding: 6px;
}
.menu-head {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 10px 12px;
  border-bottom: 1px solid var(--panel-line);
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
  padding: 1px 8px;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.menu-item {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-radius: 5px;
  color: var(--ink);
  font-family: inherit;
  font-size: 14px;
  padding: 9px 10px;
  cursor: pointer;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.placeholder {
  display: block;
  width: 120px;
  height: 38px;
}

@media (max-width: 640px) {
  .btn-premium {
    padding: 0 11px;
    font-size: 0;
    gap: 0;
  }
  .name {
    display: none;
  }
}
</style>
