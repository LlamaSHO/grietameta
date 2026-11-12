/* Usuarios: registro, inicio y cierre de sesión con Firebase Authentication
   (email + contraseña y Google). Al registrarse se crea también su perfil en
   Firestore (ver users.js). */

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseApp } from "./app.js";
import { createUserProfile, getUserProfile } from "./users.js";

export const auth = getAuth(firebaseApp);
auth.languageCode = "es";

export async function register({ email, password, displayName }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(user, { displayName });
  await createUserProfile(user, { displayName });
  return user;
}

export async function login(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

// Acceso con Google en una ventana emergente. La primera vez se crea el
// perfil users/{uid} en Firestore. Necesita el proveedor Google activado en
// la consola de Firebase (si no, Firebase lanza "auth/operation-not-allowed").
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const { user } = await signInWithPopup(auth, provider);

  // Si no se puede leer el perfil no se crea otro encima (setDoc lo
  // sobrescribiría): la sesión ya está iniciada y se reintenta la próxima vez.
  try {
    const profile = await getUserProfile(user.uid);
    if (!profile) await createUserProfile(user, { displayName: user.displayName });
  } catch (err) {
    console.error("No se pudo preparar el perfil del usuario de Google:", err);
  }
  return user;
}

export const logout = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Llama a callback(user|null) cada vez que cambia la sesión. Devuelve la función para dejar de escuchar.
export const onUserChange = (callback) => onAuthStateChanged(auth, callback);
