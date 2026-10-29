/* Perfiles de usuario en Cloud Firestore: colección "users", un documento
   por usuario con el mismo id (uid) que su cuenta de Firebase Auth.

   users/{uid} = {
     email, displayName,
     role: "user" | "admin",
     "is-premium": [...],         // suscripciones activas; lo escribe el servidor (Stripe)
     favoriteGames: [],           // slugs de public/data/games.json
     createdAt, updatedAt         // marcas de tiempo del servidor
   } */

import { doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { firebaseApp } from "./app.js";

export const db = getFirestore(firebaseApp);

const userRef = (uid) => doc(db, "users", uid);

export async function createUserProfile(user, extra = {}) {
  await setDoc(userRef(user.uid), {
    email: user.email,
    displayName: extra.displayName || user.displayName || "",
    role: "user",
    favoriteGames: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(userRef(uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Solo campos que el propio usuario puede cambiar (las reglas impiden tocar role e is-premium).
export async function updateUserProfile(uid, { displayName, favoriteGames }) {
  const changes = { updatedAt: serverTimestamp() };
  if (displayName !== undefined) changes.displayName = displayName;
  if (favoriteGames !== undefined) changes.favoriteGames = favoriteGames;
  await updateDoc(userRef(uid), changes);
}
