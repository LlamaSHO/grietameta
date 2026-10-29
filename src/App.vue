<template>
  <div @click="onLinkClick">
    <RouterView />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// Las vistas migradas generan HTML con <a href="/..."> normales. Este
// manejador convierte esos clics en navegación del router (sin recargar la
// página). Los enlaces externos, a archivos, con target o con teclas
// modificadoras se dejan al navegador.
function onLinkClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest("a[href]");
  if (!a || a.target || a.hasAttribute("download")) return;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin || /\.[a-z0-9]+$/i.test(url.pathname)) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname === window.location.pathname && url.hash) return; // ancla dentro de la misma vista
  e.preventDefault();
  router.push(url.pathname + url.search + url.hash);
}
</script>
