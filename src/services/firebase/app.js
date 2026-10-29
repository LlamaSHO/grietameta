/* Conexión con Firebase.
   La configuración se lee de las variables VITE_FIREBASE_* del archivo .env
   (no se sube al repositorio; ver .env.example). En Vercel van en
   Settings → Environment Variables. Lo que protege los datos son las reglas
   de seguridad de firestore.rules. */

import { initializeApp } from "firebase/app";

// En la web, Vite inyecta import.meta.env; en los scripts de tools/ (Node con
// --env-file=.env) se leen de process.env.
const env = import.meta.env ?? process.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error("Falta la configuración de Firebase: copia .env.example como .env y rellénalo.");
}

export const firebaseApp = initializeApp(firebaseConfig);

// Analytics solo en producción y en navegadores que lo admiten.
if (import.meta.env?.PROD && typeof window !== "undefined") {
  import("firebase/analytics").then(async ({ getAnalytics, isSupported }) => {
    if (await isSupported()) getAnalytics(firebaseApp);
  });
}
