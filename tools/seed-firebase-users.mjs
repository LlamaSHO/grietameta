// Crea usuarios de prueba en Firebase (Auth + perfil en Firestore) usando
// los mismos servicios que la web (src/services/firebase).
//
// Uso:  npm run seed:users
//
// Las cuentas se leen de tools/seed/test-users.local.json (no se sube al
// repositorio). Si no existe, se genera con contraseñas aleatorias.
// Si una cuenta ya existe, se inicia sesión con ella y se crea su perfil si
// le falta, así que se puede ejecutar varias veces.

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { login, logout, register } from "../src/services/firebase/auth.js";
import { createUserProfile, getUserProfile } from "../src/services/firebase/users.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_FILE = path.join(__dirname, "seed", "test-users.local.json");

const DEFAULT_USERS = [
  { email: "prueba1@grietameta.test", displayName: "Invocador de prueba" },
  { email: "prueba2@grietameta.test", displayName: "Raider de prueba" },
  { email: "prueba3@grietameta.test", displayName: "Hyliano de prueba" },
];

async function loadSeed() {
  if (existsSync(SEED_FILE)) return JSON.parse(await readFile(SEED_FILE, "utf8"));
  const users = DEFAULT_USERS.map((u) => ({ ...u, password: randomBytes(9).toString("base64url") }));
  await mkdir(path.dirname(SEED_FILE), { recursive: true });
  await writeFile(SEED_FILE, JSON.stringify({ users }, null, 2) + "\n");
  console.log(`Creado ${path.relative(process.cwd(), SEED_FILE)} con ${users.length} cuentas de prueba.`);
  return { users };
}

const { users } = await loadSeed();

for (const u of users) {
  try {
    const user = await register(u);
    console.log(`✓ creado   ${u.email} (${user.uid})`);
  } catch (err) {
    if (err.code !== "auth/email-already-in-use") {
      console.error(`✗ ${u.email}: ${err.code || err.message}`);
      process.exitCode = 1;
      continue;
    }
    const user = await login(u.email, u.password);
    if (!(await getUserProfile(user.uid))) await createUserProfile(user, u);
    console.log(`= ya existía ${u.email} (${user.uid})`);
  }
  await logout();
}

process.exit();
