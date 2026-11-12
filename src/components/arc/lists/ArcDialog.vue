<template>
  <!-- Ficha emergente de las listas de ARC (objeto, enemigo). Se cierra con
       la X, con Escape o pulsando fuera; al cerrar, el foco vuelve a la
       tarjeta que la abrió. En móvil sube desde abajo a pantalla casi completa. -->
  <Transition name="arc-dlg">
    <div v-if="open" class="dlg" role="dialog" aria-modal="true" :aria-labelledby="labelledby" @mousedown="onDown" @click.self="clickOutside">
      <div ref="sheet" class="sheet" :class="{ wide }">
        <button ref="closeBtn" class="x" type="button" aria-label="Cerrar" @click="close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  labelledby: { type: String, default: "" },
  wide: { type: Boolean, default: false },
});
const emit = defineEmits(["close"]);

const closeBtn = ref(null);
const sheet = ref(null);
let opener = null;
// Solo se cierra al pulsar fuera si el clic empezó fuera (al seleccionar
// texto de la ficha y soltar fuera no se cierra).
let downOutside = false;

function close() {
  emit("close");
}
function onDown(e) {
  downOutside = e.target === e.currentTarget;
}
function clickOutside() {
  if (downOutside) close();
  downOutside = false;
}
// Tab y Mayús+Tab dan la vuelta dentro de la ficha (es modal).
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function trapTab(e) {
  const els = [...(sheet.value?.querySelectorAll(FOCUSABLE) || [])].filter((el) => el.offsetParent !== null);
  if (!els.length) return;
  const first = els[0];
  const last = els[els.length - 1];
  const inside = sheet.value.contains(document.activeElement);
  if (e.shiftKey && (document.activeElement === first || !inside)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
    e.preventDefault();
    first.focus();
  }
}
function onKey(e) {
  if (e.key === "Escape") close();
  else if (e.key === "Tab") trapTab(e);
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      opener = document.activeElement;
      document.documentElement.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
      nextTick(() => closeBtn.value?.focus());
    } else {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (opener && opener.focus && document.contains(opener)) opener.focus();
      opener = null;
    }
  },
  { immediate: true }
);
onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
  document.removeEventListener("keydown", onKey);
});
</script>

<style scoped>
.dlg {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(5, 4, 8, 0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.sheet {
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: calc(100vh - 48px);
  max-height: calc(100dvh - 48px);
  overflow: auto;
  overscroll-behavior: contain;
  border-radius: 20px;
  background: var(--arc-panel);
  border: 1px solid rgba(242, 235, 221, 0.12);
  border-top: 0;
  box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.95);
}
.sheet.wide { max-width: 720px; }
.sheet::before {
  content: "";
  position: sticky;
  top: 0;
  z-index: 2;
  display: block;
  height: 5px;
  background: var(--arc-stripes);
}
.x {
  position: absolute;
  top: 16px;
  right: 14px;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(242, 235, 221, 0.18);
  background: rgba(11, 10, 14, 0.75);
  color: var(--arc-ink);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.x:hover { background: var(--arc-yellow); color: #141007; }

.arc-dlg-enter-active,
.arc-dlg-leave-active { transition: opacity 0.2s; }
.arc-dlg-enter-active .sheet,
.arc-dlg-leave-active .sheet { transition: transform 0.25s var(--ease-out); }
.arc-dlg-enter-from,
.arc-dlg-leave-to { opacity: 0; }
.arc-dlg-enter-from .sheet,
.arc-dlg-leave-to .sheet { transform: translateY(16px); }

@media (max-width: 560px) {
  .dlg { align-items: flex-end; padding: 0; }
  .sheet {
    max-width: none;
    max-height: 92vh;
    max-height: 92dvh;
    border-radius: 20px 20px 0 0;
  }
  .arc-dlg-enter-from .sheet,
  .arc-dlg-leave-to .sheet { transform: translateY(100%); }
}
</style>
