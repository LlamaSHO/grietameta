import { computed, reactive, readonly } from "vue";
import { isPremiumProfile } from "@/services/userStatus";

// Estado de sesión compartido por toda la app. Firebase se carga en segundo
// plano la primera vez que alguien usa useAuth(), para no frenar la carga
// inicial de la página.
const state = reactive({
  ready: false,      // ya se sabe si hay sesión o no
  available: true,   // false si Firebase no se pudo iniciar (p. ej. falta el .env)
  user: null,        // { uid, email, displayName }
  profile: null,     // documento users/{uid} de Firestore
});

let firebase = null;

function start() {
  if (!firebase) {
    firebase = Promise.all([import("@/services/firebase/auth.js"), import("@/services/firebase/users.js")])
      .then(([auth, users]) => {
        auth.onUserChange(async (user) => {
          state.user = user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null;
          state.profile = user ? await users.getUserProfile(user.uid).catch(() => null) : null;
          state.ready = true;
        });
        return { auth, users };
      })
      .catch((err) => {
        console.error("No se pudo iniciar Firebase:", err);
        state.available = false;
        state.ready = true;
        throw err;
      });
  }
  return firebase;
}

async function refreshProfile() {
  const { users } = await start();
  state.profile = state.user ? await users.getUserProfile(state.user.uid) : null;
}

export function useAuth() {
  start().catch(() => {});

  const isLoggedIn = computed(() => !!state.user);
  const displayName = computed(
    () => state.profile?.displayName || state.user?.displayName || state.user?.email?.split("@")[0] || ""
  );
  const isPremium = computed(() => isPremiumProfile(state.profile));

  return {
    state: readonly(state),
    isLoggedIn,
    isPremium,
    displayName,
    async login(email, password) {
      const { auth } = await start();
      await auth.login(email, password);
      await refreshProfile();
    },
    async register(data) {
      const { auth } = await start();
      const user = await auth.register(data);
      // onUserChange salta antes de que exista el perfil: se vuelve a leer.
      state.user = { uid: user.uid, email: user.email, displayName: data.displayName || user.displayName };
      await refreshProfile();
    },
    async logout() {
      const { auth } = await start();
      await auth.logout();
    },
    async resetPassword(email) {
      const { auth } = await start();
      await auth.resetPassword(email);
    },
  };
}
