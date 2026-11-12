<template>
  <!-- Footer común. Diseño: .foot de models/paginas/Main.dc.html. -->
  <footer class="foot">
    <div class="wrap">
      <div class="foot-top">
        <div class="foot-about">
          <RouterLink class="brand" to="/" aria-label="GrietaMeta, inicio">
            <GmMark :size="26" />
            <span class="gm-brand-name">GRIETA<span>META</span></span>
          </RouterLink>
          <p>{{ notice }}</p>
        </div>

        <div class="foot-cols">
          <nav class="foot-col" aria-label="Juegos">
            <h4>Juegos</h4>
            <RouterLink v-for="g in games" :key="g.slug" :to="g.url">{{ g.name }}</RouterLink>
          </nav>
          <nav class="foot-col" aria-label="Ayuda">
            <h4>Ayuda</h4>
            <RouterLink to="/contacto">Contáctanos</RouterLink>
            <RouterLink :to="{ path: '/contacto', query: { motivo: 'juego' } }">Pedir un juego</RouterLink>
            <RouterLink :to="{ path: '/contacto', query: { motivo: 'error' } }">Avisar de un error</RouterLink>
          </nav>
          <nav class="foot-col" aria-label="Legal">
            <h4>Legal</h4>
            <RouterLink to="/privacidad">Privacidad</RouterLink>
            <RouterLink to="/publicidad">Publicidad</RouterLink>
          </nav>
        </div>
      </div>

      <div class="foot-bottom">© 2026 GrietaMeta. Todos los derechos reservados. Prohibida su reproducción total o parcial sin permiso.</div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref } from "vue";
import GmMark from "@/components/brand/GmMark.vue";
import { fetchGames } from "@/services/games";

const props = defineProps({ gameSlug: { type: String, default: null } });

// Aviso legal según el juego de la página.
const NOTICES = {
  lol: "GrietaMeta no está afiliado a Riot Games. League of Legends y Riot Games son marcas registradas o marcas comerciales de Riot Games, Inc. GrietaMeta se avala en los \"Legal Jibber Jabber\" de Riot Games con contenido creado bajo la política de terceros.",
  "arc-raiders": "El contenido de ARC Raiders pertenece a Embark Studios AB y sus licenciantes. GrietaMeta no está afiliado ni respaldado por Embark Studios.",
  "zelda-totk": "GrietaMeta es un sitio de fans y no está afiliado a Nintendo. The Legend of Zelda y Tears of the Kingdom son marcas de Nintendo. Todo el contenido es texto e iconos propios, sin material oficial.",
};
const DEFAULT_NOTICE = "GrietaMeta es un sitio de fans, no está afiliado a los estudios de los juegos mencionados. Las marcas pertenecen a sus propietarios.";
const notice = computed(() => NOTICES[props.gameSlug] || DEFAULT_NOTICE);

const games = ref([]);
fetchGames().then((g) => (games.value = g));
</script>

<style scoped>
.foot {
  margin-top: 72px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 48px 0 40px;
  font-size: 13.5px;
  color: var(--ink-mute);
  background: var(--bg);
}
.foot-top {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
.foot-about {
  max-width: 400px;
}
.foot-about p {
  margin: 12px 0 0;
  line-height: 1.7;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--ink);
  text-decoration: none;
}
.foot-cols {
  display: flex;
  gap: 64px;
  flex-wrap: wrap;
}
.foot-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.foot-col h4 {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink);
}
.foot-col a {
  color: #A0A8B4;
  text-decoration: none;
  transition: color 0.2s;
}
.foot-col a:hover {
  color: var(--gold-hi);
}
.foot-bottom {
  margin-top: 40px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12.5px;
  color: var(--ink-faint);
}

@media (max-width: 860px) {
  .foot-cols {
    gap: 36px;
  }
}
</style>
