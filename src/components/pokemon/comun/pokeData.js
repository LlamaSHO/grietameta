/* Datos y utilidades comunes de Pokémon (nombres y colores de tipo, recortes
   de las hojas de sprites). Las usan los componentes de comun/ y las vistas. */

export const TYPE_ORDER = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];

export const TN = { normal: "Normal", fighting: "Lucha", flying: "Volador", poison: "Veneno", ground: "Tierra", rock: "Roca", bug: "Bicho", ghost: "Fantasma", steel: "Acero", fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico", psychic: "Psíquico", ice: "Hielo", dragon: "Dragón", dark: "Siniestro", fairy: "Hada" };

export const TC = { normal: "#A8A77A", fighting: "#D3425F", flying: "#8FA8DD", poison: "#B567CE", ground: "#D97845", rock: "#C5B78C", bug: "#91C12F", ghost: "#5269AD", steel: "#5A8EA2", fire: "#FF9D55", water: "#4D90D5", grass: "#63BC5A", electric: "#F4D23C", psychic: "#FA7179", ice: "#73CEC0", dragon: "#0B6DC3", dark: "#5A5465", fairy: "#EC8FE6" };

/* Hoja de sprites frontales (/images/pokemon/sprites-front.png): 32 columnas x 33 filas, por número de Pokédex. */
export const sp = (id) => {
  const i = id - 1;
  return ((i % 32) / 31 * 100).toFixed(3) + "% " + (Math.floor(i / 32) / 32 * 100).toFixed(3) + "%";
};

/* Hoja de artworks (/images/pokemon/artwork.webp): 15 x 15, por índice de hoja. */
export const ap = (k) => ((k % 15) / 14 * 100).toFixed(3) + "% " + (Math.floor(k / 15) / 14 * 100).toFixed(3) + "%";

/* Hoja de sprites de Gen I (/images/pokemon/sprites-gen1.png): 16 x 10, por número de Pokédex (1-151). */
export const g1 = (n) => {
  const i = n - 1;
  return ((i % 16) / 15 * 100).toFixed(3) + "% " + (Math.floor(i / 16) / 9 * 100).toFixed(3) + "%";
};

export const ty = (k) => ({ k, n: TN[k] });
