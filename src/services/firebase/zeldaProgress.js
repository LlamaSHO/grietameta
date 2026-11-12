/* Progreso del mapa de Zelda (santuarios, torres, cuevas y semillas marcados
   como hechos) en el perfil del usuario: users/{uid}.zeldaProgress.

   users/{uid}.zeldaProgress = {
     v: 1,            // versión del formato
     done: [claves],  // claves "<cat>:<capa>:<id>" (ver composables/useZeldaProgress.js)
   }
   La lectura no pasa por aquí: el composable lo toma del perfil que ya carga
   useAuth (state.profile.zeldaProgress).

   Ojo: firestore.rules tiene una lista blanca de campos que el usuario puede
   cambiar; hasta que incluya "zeldaProgress" esta escritura se rechaza
   (permission-denied) y el progreso se queda solo en este navegador. */

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./users.js";

// Tope de claves que se guardan (hay ~1.040 puntos en el mapa).
export const MAX_ZELDA_KEYS = 1500;

export async function saveZeldaProgress(uid, done) {
  const list = [...new Set(done)].filter((k) => typeof k === "string" && k.length <= 80).slice(0, MAX_ZELDA_KEYS);
  await updateDoc(doc(db, "users", uid), {
    zeldaProgress: { v: 1, done: list },
    updatedAt: serverTimestamp(),
  });
}
