/* Giros y finales tapados hasta que el lector los pide. `all` los abre todos. */
import { reactive } from "vue";

export function useSpoilers() {
  const s = reactive({
    all: false,
    sp: {},
    shown: (k) => s.all || !!s.sp[k],
    toggle: (k) => {
      s.sp[k] = !s.sp[k];
    },
    toggleAll: () => {
      s.all = !s.all;
      s.sp = {};
    },
  });
  return s;
}
