/* Utilidades compartidas del bloque B de Pokémon (Kanto y Competitivo). */

export const TIPOS = {
  normal: "Normal", fighting: "Lucha", flying: "Volador", poison: "Veneno", ground: "Tierra",
  rock: "Roca", bug: "Bicho", ghost: "Fantasma", steel: "Acero", fire: "Fuego", water: "Agua",
  grass: "Planta", electric: "Eléctrico", psychic: "Psíquico", ice: "Hielo", dragon: "Dragón",
  dark: "Siniestro", fairy: "Hada",
};

/* Posición de un Pokémon (1–151) en la hoja de sprites de Gen I (16 columnas × 10 filas). */
export function g1p(id) {
  const i = id - 1;
  return ((i % 16) / 15 * 100).toFixed(3) + "% " + (Math.floor(i / 16) / 9 * 100).toFixed(3) + "%";
}

/* Posición en la hoja de sprites frontales (32 columnas × 33 filas) a partir de su índice. */
export function sprPos(k) {
  return ((k % 32) / 31 * 100).toFixed(3) + "% " + (Math.floor(k / 32) / 32 * 100).toFixed(3) + "%";
}

/* Artwork oficial desde PokeAPI (se permite enlazarlo directamente). */
export function artUrl(id) {
  return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + id + ".png";
}

/* Guardado local sencillo (progreso del jugador). Nunca debe romper la página. */
export function leer(clave, defecto) {
  try {
    const v = localStorage.getItem(clave);
    return v ? JSON.parse(v) : defecto;
  } catch (e) {
    return defecto;
  }
}
export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (e) {
    /* sin almacenamiento: se sigue funcionando */
  }
}

/* Sprites de «meta» (hoja de 12 columnas × 11 filas) a partir del id de la lista IDS del JSON. */
export function metaPos(ids, pid) {
  const k = Math.max(0, ids.indexOf(pid));
  return ((k % 12) / 11 * 100).toFixed(3) + "% " + (Math.floor(k / 12) / 10 * 100).toFixed(3) + "%";
}
export const pct = (v) => String(v).replace(".", ",") + " %";
