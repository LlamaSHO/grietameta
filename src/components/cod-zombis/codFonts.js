/* Tipografías propias de CoD Zombis (Saira Condensed y Saira Stencil One).
   El resto (IBM Plex Sans, Chakra Petch) ya las carga index.html. Se añade un
   único <link> la primera vez que entra una vista o la barra de este juego. */
const ID = "cod-zombis-fonts";
const HREF = "https://fonts.googleapis.com/css2?family=Saira+Stencil+One&family=Saira+Condensed:wght@500;600;700;800&display=swap";

export function loadCodFonts() {
  if (typeof document === "undefined" || document.getElementById(ID)) return;
  const link = document.createElement("link");
  link.id = ID;
  link.rel = "stylesheet";
  link.href = HREF;
  document.head.appendChild(link);
}
