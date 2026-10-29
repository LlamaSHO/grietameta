import { onBeforeUnmount, onMounted } from "vue";

// Ejecuta la lógica de una vista migrada (src/scripts/*.js) cuando su
// plantilla ya está en el DOM, y la limpia al salir: todo listener global
// registrado con `signal` se quita automáticamente.
export function usePageScript(rootRef, init) {
  let controller = null;

  onMounted(() => {
    controller = new AbortController();
    init({ root: rootRef.value, signal: controller.signal });
  });

  onBeforeUnmount(() => {
    controller?.abort();
    document.documentElement.style.overflow = "";
  });
}
