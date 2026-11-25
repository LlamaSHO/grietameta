/* Posición de cada recorte en las láminas de imágenes (background-position). */

// mapas-aether.webp: 6 columnas x 5 filas
export const mapBp = (i) => ((i % 6) / 5 * 100).toFixed(3) + "% " + (Math.floor(i / 6) / 4 * 100).toFixed(3) + "%";
// personajes-aether.webp: 7 columnas x 4 filas
export const portraitBp = (i) => ((i % 7) / 6 * 100).toFixed(3) + "% " + (Math.floor(i / 7) / 3 * 100).toFixed(3) + "%";
// ventajas.webp: 8 columnas x 2 filas
export const perkBp = (i) => ((i % 8) / 7 * 100).toFixed(3) + "% " + Math.floor(i / 8) * 100 + "%";

export const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
