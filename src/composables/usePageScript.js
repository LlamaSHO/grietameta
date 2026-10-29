import { onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";

// Ejecuta la lógica de una vista migrada (src/scripts/*.js) cuando su
// plantilla ya está en el DOM, y la limpia al salir: todo listener global
// registrado con `signal` se quita automáticamente.
export function usePageScript(rootRef, init) {
  const route = useRoute();
  let controller = null;

  onMounted(() => {
    controller = new AbortController();
    init({ root: rootRef.value, signal: controller.signal });
    // Estas vistas pintan su contenido desde el script, así que el router no
    // encuentra el ancla (#semillas, #campeones…) al entrar: se baja aquí.
    if (route.hash) {
      setTimeout(() => document.querySelector(route.hash)?.scrollIntoView({ behavior: "instant" }), 0);
    }
  });

  onBeforeUnmount(() => {
    controller?.abort();
    document.documentElement.style.overflow = "";
  });
}
