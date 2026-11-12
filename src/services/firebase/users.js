/* Perfiles de usuario en Cloud Firestore: colección "users", un documento
   por usuario con el mismo id (uid) que su cuenta de Firebase Auth.

   users/{uid} = {
     email, displayName,
     role: "user" | "admin",
     "is-premium": [...],         // suscripciones activas; lo escribe el servidor (Stripe)
     favoriteGames: [],           // slugs de public/data/games.json
     alerts: { lol, arc, zelda }, // avisos por juego (booleanos; opcional)
     alertChannels: { email, browser }, // canal de los avisos (booleanos; opcional)
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

// Deja solo las claves conocidas y con valor booleano (las reglas lo exigen).
function boolMap(value, keys) {
  const out = {};
  for (const k of keys) if (typeof value?.[k] === "boolean") out[k] = value[k];
  return out;
}

export const ALERT_GAMES = ["lol", "arc", "zelda"];
export const ALERT_CHANNELS = ["email", "browser"];

// Solo campos que el propio usuario puede cambiar (las reglas impiden tocar
// role, is-premium, premium, email y createdAt).
//   alerts:        { lol, arc, zelda }   avisos por juego (Mi Premium)
//   alertChannels: { email, browser }    por dónde se avisa
export async function updateUserProfile(uid, { displayName, favoriteGames, alerts, alertChannels }) {
  const changes = { updatedAt: serverTimestamp() };
  if (displayName !== undefined) changes.displayName = displayName;
  if (favoriteGames !== undefined) changes.favoriteGames = favoriteGames;
  if (alerts !== undefined) changes.alerts = boolMap(alerts, ALERT_GAMES);
  if (alertChannels !== undefined) changes.alertChannels = boolMap(alertChannels, ALERT_CHANNELS);
  await updateDoc(userRef(uid), changes);
}
