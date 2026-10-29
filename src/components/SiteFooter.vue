<template>
  <footer class="site-footer">
    <div class="wrap">
      <div class="top">
        <div class="about">
          <RouterLink class="brand-name" to="/">GRIETA<span>META</span></RouterLink>
          <p>{{ notice }}</p>
        </div>

        <div class="cols">
          <div class="col">
            <h5>Juegos</h5>
            <RouterLink v-for="g in games" :key="g.slug" :to="g.url">{{ g.name }}</RouterLink>
          </div>
          <div class="col">
            <h5>Ayuda</h5>
            <RouterLink to="/contacto">Contáctanos</RouterLink>
            <RouterLink :to="{ path: '/contacto', query: { motivo: 'juego' } }">Pedir un juego</RouterLink>
            <RouterLink :to="{ path: '/contacto', query: { motivo: 'error' } }">Avisar de un error</RouterLink>
          </div>
          <div class="col">
            <h5>Legal</h5>
            <RouterLink to="/privacidad">Privacidad</RouterLink>
            <RouterLink to="/publicidad">Publicidad</RouterLink>
          </div>
        </div>
      </div>

      <div class="contact">
        <div>
          <strong>¿Echas algo en falta?</strong>
          <span>Si falta un dato, necesitas algo o quieres que añadamos un juego, escríbenos.</span>
        </div>
        <RouterLink class="btn-contact" to="/contacto">Contáctanos</RouterLink>
      </div>

      <div class="bottom">© 2026 GrietaMeta. Todos los derechos reservados. Prohibida su reproducción total o parcial sin permiso.</div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref } from "vue";
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
.site-footer {
  border-top: 1px solid var(--panel-line);
  background: var(--bg);
  color: var(--ink-faint);
  font-size: 13px;
  line-height: 1.7;
  padding: 44px 0 48px;
}
.wrap {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 28px;
}
a {
  color: var(--ink-dim);
  text-decoration: none;
}
a:hover {
  color: var(--gold);
}

.top {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
.about {
  max-width: 380px;
}
.brand-name {
  font-family: "Cinzel", serif;
  font-size: 17px;
  font-weight: 600;
  color: var(--ink);
}
.brand-name span {
  color: var(--gold);
}
.about p {
  margin: 10px 0 0;
}

.cols {
  display: flex;
  gap: 56px;
  flex-wrap: wrap;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.col h5 {
  margin: 0 0 6px;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink);
}

.contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin: 32px 0 24px;
  padding: 18px 22px;
  background: var(--panel);
  border: 1px solid var(--panel-line);
  border-left: 3px solid var(--gold);
}
.contact div {
  display: flex;
  flex-direction: column;
}
.contact strong {
  color: var(--ink);
  font-size: 14.5px;
}
.btn-contact {
  padding: 9px 18px;
  border: 1px solid var(--gold-soft);
  color: var(--ink);
  font-weight: 600;
  white-space: nowrap;
}
.btn-contact:hover {
  background: rgba(200, 150, 62, 0.1);
  color: var(--ink);
}

.bottom {
  font-size: 12px;
}

@media (max-width: 640px) {
  .wrap {
    padding: 0 16px;
  }
  .cols {
    gap: 32px;
  }
}
</style>
