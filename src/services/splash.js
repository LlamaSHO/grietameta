/* Pantalla de carga inicial (#gm-splash, dibujada en index.html para que salga
   antes que nada). Se quita cuando la primera página ya está montada, las
   fuentes están listas y las imágenes de la primera pantalla decodificadas.
   Mientras tanto, <html class="booting"> pausa las animaciones de la página
   (base.css), que arrancan desde el principio al quitarse la pantalla. */

const MIN_MS = 900;
const MAX_MS = 4000;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function endSplash() {
  const el = document.getElementById("gm-splash");
  const html = document.documentElement;
  if (!el) {
    html.classList.remove("booting");
    return;
  }
  const t0 = window.__gmSplashStart || performance.now();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const imgs = [...document.querySelectorAll(".app-main img")].filter((im) => {
    if (im.loading === "lazy") return false;
    const b = im.getBoundingClientRect();
    return b.top < innerHeight && b.bottom > 0;
  });
  await Promise.race([
    Promise.all([document.fonts?.ready, ...imgs.map((im) => im.decode().catch(() => {}))]),
    wait(MAX_MS),
  ]);
  const left = MIN_MS - (performance.now() - t0);
  if (left > 0) await wait(left);
  html.classList.remove("booting");
  el.classList.add("out");
  el.addEventListener("transitionend", () => el.remove(), { once: true });
  setTimeout(() => el.remove(), 800);
}
