import { onBeforeUnmount, onMounted } from "vue";

// Cierra un desplegable al pulsar fuera de él o con Escape (en móvil no hay
// "mouseleave", así que hace falta esto).
export function useDropdownClose(boxRef, openRef) {
  const onDoc = (e) => {
    if (openRef.value && boxRef.value && !boxRef.value.contains(e.target)) openRef.value = false;
  };
  const onKey = (e) => {
    if (e.key === "Escape") openRef.value = false;
  };
  onMounted(() => {
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", onDoc);
    document.removeEventListener("keydown", onKey);
  });
}
