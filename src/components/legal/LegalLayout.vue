<template>
  <!-- Plantilla de las páginas legales (/privacidad, /publicidad). No tiene
       diseño propio: sigue el estilo de los diseños nuevos (cabecera de
       MiPremium.dc.html). El índice lateral se arma solo con los <h2> del texto. -->
  <div class="legal-page">
    <div class="glow" aria-hidden="true" />

    <div class="wrap">
      <header class="head">
        <nav class="crumbs" aria-label="Migas de pan">
          <RouterLink to="/">Inicio</RouterLink>
          <span aria-hidden="true">/</span>
          <span>Legal</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ crumb || title }}</span>
        </nav>
        <h1 class="h1">{{ title }}</h1>
        <p class="updated">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /></svg>
          {{ updated }}
        </p>
      </header>

      <div class="layout" :class="{ 'no-toc': !toc.length }">
        <aside v-if="toc.length" class="toc">
          <!-- En móvil el índice se pliega -->
          <details ref="tocBox" class="toc-box" :open="tocOpen">
            <summary @click.prevent="isWide || (tocOpen = !tocOpen)">
              <span>En esta página</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
            </summary>
            <nav aria-label="Índice">
              <ol>
                <li v-for="item in toc" :key="item.id">
                  <a :href="`#${item.id}`" :class="{ on: item.id === activeId }" :aria-current="item.id === activeId ? 'true' : undefined" @click="onTocClick($event, item.id)">
                    {{ item.text }}
                  </a>
                </li>
              </ol>
            </nav>
          </details>
          <div class="side-note">
            <span>¿Dudas?</span>
            <RouterLink to="/contacto">Escríbenos desde Contacto</RouterLink>
          </div>
        </aside>

        <article ref="body" class="legal-body">
          <slot />
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  title: { type: String, required: true },
  updated: { type: String, default: "" }, // "Última actualización: …"
  crumb: { type: String, default: "" },
});

const body = ref(null);
const toc = ref([]);
const activeId = ref("");
// En escritorio el índice va siempre abierto; en móvil (≤ 860px) se pliega.
const wideMq = typeof window === "undefined" ? null : window.matchMedia("(min-width: 861px)");
const isWide = ref(!wideMq || wideMq.matches);
const tocOpen = ref(isWide.value);
function onWideChange(e) {
  isWide.value = e.matches;
  tocOpen.value = e.matches;
}

function slug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

let observer = null;

onMounted(async () => {
  await nextTick();
  const heads = [...(body.value?.querySelectorAll("h2") || [])];
  const used = new Set();
  toc.value = heads.map((h) => {
    let id = h.id || slug(h.textContent);
    while (used.has(id)) id += "-2";
    used.add(id);
    h.id = id;
    return { id, text: h.textContent.trim() };
  });

  // Marca en el índice la sección que se está leyendo.
  if ("IntersectionObserver" in window && heads.length) {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) activeId.value = visible[0].target.id;
      },
      { rootMargin: "-120px 0px -65% 0px" }
    );
    heads.forEach((h) => observer.observe(h));
  }
  activeId.value = toc.value[0]?.id || "";
  wideMq?.addEventListener("change", onWideChange);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  wideMq?.removeEventListener("change", onWideChange);
});

// Salto suave dentro de la página sin pasar por el router.
function onTocClick(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(history.state, "", `#${id}`);
  activeId.value = id;
  if (!isWide.value) tocOpen.value = false;
}
</script>

<style scoped>
.legal-page {
  position: relative;
  isolation: isolate;
  overflow-x: clip;
}
.glow {
  position: absolute;
  z-index: -1;
  top: -240px;
  left: 18%;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: #B9832F;
  filter: blur(110px);
  opacity: 0.2;
  pointer-events: none;
}

/* ---------- cabecera ---------- */
.head {
  padding: 44px 0 34px;
  animation: gm-rise 0.7s var(--ease-out) both;
}
.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13.5px;
  color: var(--ink-mute);
}
.crumbs a {
  color: var(--ink-dim);
  text-decoration: none;
}
.crumbs a:hover {
  color: var(--gold-hi);
}
.h1 {
  margin: 10px 0 0;
  max-width: 820px;
  font-family: var(--font-display);
  font-size: clamp(34px, 4.4vw, 52px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.02;
  text-wrap: balance;
}
.updated {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.035);
  color: var(--ink-dim);
  font-size: 13px;
}
.updated svg {
  color: var(--gold);
}

/* ---------- cuerpo ---------- */
.layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 760px);
  gap: 48px;
  align-items: start;
}
.layout.no-toc {
  grid-template-columns: minmax(0, 760px);
}
.toc {
  position: sticky;
  top: calc(var(--nav-h) + var(--subnav-h) + 24px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: gm-rise 0.7s 0.05s var(--ease-out) both;
}
.toc-box {
  padding: 8px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
}
.toc-box summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px 10px;
  font-family: var(--font-brand);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  list-style: none;
  cursor: default;
}
.toc-box summary::-webkit-details-marker {
  display: none;
}
.toc-box summary svg {
  display: none;
  transition: transform 0.25s var(--ease-out);
}
.toc-box[open] summary svg {
  transform: rotate(180deg);
}
.toc ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toc ol a {
  display: block;
  padding: 8px 10px;
  border-radius: 10px;
  color: #C6CBD2;
  font-size: 13.5px;
  line-height: 1.35;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.toc ol a:hover {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.05);
}
.toc ol a.on {
  color: var(--gm-gold);
  background: rgba(212, 160, 74, 0.1);
}
.side-note {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  font-size: 13px;
  color: var(--ink-mute);
}
.side-note a {
  color: var(--gold);
  font-weight: 600;
  text-decoration: none;
}
.side-note a:hover {
  color: var(--gold-hi);
}

.legal-body {
  min-width: 0;
  padding: 34px 38px 38px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  animation: gm-rise 0.7s 0.1s var(--ease-out) both;
}
.legal-body :slotted(h2) {
  /* El hueco del nav ya lo pone scroll-padding-top en base.css: aquí solo un respiro. */
  scroll-margin-top: 8px;
  margin: 36px 0 12px;
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: var(--ink);
}
.legal-body :slotted(h2:first-child) {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
.legal-body :slotted(p),
.legal-body :slotted(ul) {
  margin: 0 0 14px;
  color: #BFC5CE;
  font-size: 15.5px;
  line-height: 1.75;
}
.legal-body :slotted(ul) {
  padding-left: 22px;
}
.legal-body :slotted(li) {
  margin-bottom: 6px;
}
.legal-body :slotted(li)::marker {
  color: var(--gold);
}
.legal-body :slotted(strong) {
  color: var(--ink);
  font-weight: 600;
}
.legal-body :slotted(a) {
  color: var(--gm-gold);
  text-decoration: underline;
  text-decoration-color: rgba(243, 200, 120, 0.4);
  text-underline-offset: 3px;
  overflow-wrap: anywhere;
}
.legal-body :slotted(a:hover) {
  text-decoration-color: currentColor;
}
.legal-body :slotted(code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  font: 500 0.88em/1.3 "IBM Plex Mono", ui-monospace, monospace;
  color: var(--ink);
}
.legal-body :slotted(.intro) {
  color: var(--ink);
  font-size: 17px;
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  .toc {
    position: static;
  }
  .toc-box summary {
    padding: 10px;
    cursor: pointer;
  }
  .toc-box summary svg {
    display: block;
  }
  .side-note {
    display: none;
  }
  .head {
    padding-top: 28px;
    padding-bottom: 24px;
  }
  .legal-body {
    padding: 24px 20px 26px;
  }
  .legal-body :slotted(h2) {
    font-size: 19px;
  }
  .legal-body :slotted(p),
  .legal-body :slotted(ul) {
    font-size: 15px;
  }
}
</style>
