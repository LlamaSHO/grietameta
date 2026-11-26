import { nextTick, watch } from "vue";
import { loadTracker } from "./loadTracker";

const frame = () => new Promise(requestAnimationFrame);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function inViewport(element) {
  const box = element.getBoundingClientRect();
  return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight &&
    box.right > 0 && box.left < innerWidth;
}

// Las portadas declaran cuándo han montado sus datos. El resto de vistas usa el contador compartido.
async function waitForFirstScreen(signal) {
  await nextTick();
  await frame();
  if (signal.aborted) return;
  const main = document.querySelector(".app-main");
  if (!main) return;

  const decoded = new Map();
  function decodeVisible() {
    const elements = document.querySelectorAll(".site-nav .gchip img, .app-main img, .app-main [data-critical-background]");
    const jobs = [];
    for (const element of elements) {
      if (!inViewport(element)) continue;
      const source = element.dataset.criticalBackground || element.currentSrc || element.src;
      if (!source) continue;
      if (!decoded.has(source)) {
        const image = element instanceof HTMLImageElement ? element : new Image();
        if (element.dataset.criticalBackground) image.src = source;
        if (image.loading === "lazy") image.loading = "eager";
        decoded.set(source, image.decode().catch(() => {}));
      }
      jobs.push(decoded.get(source));
    }
    return Promise.all(jobs);
  }

  const bar = document.querySelector(".site-nav .sub-in");
  // El primer hijo es el enlace del juego. Vue monta los demás al llegar su módulo.
  const navigation = new Promise((resolve) => {
    if (!bar || bar.childElementCount > 1) return resolve();
    const timer = setTimeout(done, 8000); // Una barra opcional que falla no bloquea el contenido.
    const observer = new MutationObserver(() => { if (bar.childElementCount > 1) done(); });
    function done() {
      clearTimeout(timer);
      observer.disconnect();
      signal.removeEventListener("abort", done);
      resolve();
    }
    observer.observe(bar, { childList: true });
    signal.addEventListener("abort", done, { once: true });
  });
  const earlyImages = decodeVisible();
  const sheet = document.getElementById("gm-fonts");
  const fontStyles = new Promise((resolve) => {
    if (!sheet || sheet.media === "all") return resolve();
    function done() {
      sheet.removeEventListener("load", done);
      sheet.removeEventListener("error", done);
      signal.removeEventListener("abort", done);
      resolve();
    }
    sheet.addEventListener("load", done);
    sheet.addEventListener("error", done);
    signal.addEventListener("abort", done, { once: true });
  });
  const page = main.querySelector("[data-screen-status]");
  if (page?.dataset.screenStatus === "loading") {
    await new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (!page.isConnected || page.dataset.screenStatus !== "loading") done();
      });
      function done() {
        observer.disconnect();
        signal.removeEventListener("abort", done);
        resolve();
      }
      observer.observe(main, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-screen-status"] });
      signal.addEventListener("abort", done, { once: true });
    });
  } else if (!page && loadTracker.pending) {
    await new Promise((resolve) => {
      const stop = watch(() => loadTracker.pending, (count) => { if (!count) done(); });
      function done() {
        stop();
        signal.removeEventListener("abort", done);
        resolve();
      }
      signal.addEventListener("abort", done, { once: true });
    });
  }
  await Promise.all([navigation, fontStyles]);
  await nextTick();
  await frame();
  if (signal.aborted) return;
  await Promise.all([earlyImages, decodeVisible(), document.fonts.ready]);
  await frame();
}

export async function awaitScreen(signal) {
  if (signal.aborted) return;
  const local = new AbortController();
  const cancel = () => local.abort();
  signal.addEventListener("abort", cancel, { once: true });
  await nextTick();
  if (local.signal.aborted) return;
  const declared = document.querySelector(".app-main [data-screen-status]");
  const timer = declared ? null : setTimeout(cancel, 8000);
  try {
    await Promise.race([
      waitForFirstScreen(local.signal),
      new Promise((resolve) => local.signal.addEventListener("abort", resolve, { once: true })),
    ]);
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", cancel);
  }
}

export async function endSplash() {
  const splash = document.getElementById("gm-splash");
  const finish = () => {
    splash?.remove();
    document.documentElement.classList.remove("booting");
  };
  if (!splash) return finish();
  const elapsed = performance.now() - (window.__gmSplashStart ?? 0);
  await Promise.all([awaitScreen(new AbortController().signal), wait(Math.max(0, 900 - elapsed))]);
  splash.classList.add("out");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
  splash.addEventListener("transitionend", (event) => { if (event.target === splash) finish(); });
  setTimeout(finish, 500);
}
