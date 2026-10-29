/* Reglas sobre el perfil de usuario que no necesitan cargar Firebase. */

// Premium = "is-premium" es una lista con al menos un elemento. Da igual qué
// suscripción sea; si el campo no existe o la lista está vacía, no es premium.
export function isPremiumProfile(profile) {
  const subs = profile?.["is-premium"];
  return Array.isArray(subs) && subs.length > 0;
}
