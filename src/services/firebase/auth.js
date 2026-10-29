/* Usuarios: registro, inicio y cierre de sesión con Firebase Authentication
   (email + contraseña). Al registrarse se crea también su perfil en
   Firestore (ver users.js). */

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseApp } from "./app.js";
import { createUserProfile } from "./users.js";

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

export const logout = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Llama a callback(user|null) cada vez que cambia la sesión. Devuelve la función para dejar de escuchar.
export const onUserChange = (callback) => onAuthStateChanged(auth, callback);
