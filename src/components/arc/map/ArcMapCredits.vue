<template>
  <!-- Créditos y atribución de los datos del visor (models/README.md, «Notas sobre los datos»). -->
  <aside class="credits" aria-label="Fuentes de los datos">
    <p>
      Mapas, misiones y enemigos: <a href="https://github.com/RaidTheory/arcraiders-data" target="_blank" rel="noopener">RaidTheory/arcraiders-data</a>
      (licencia MIT, <a :href="licenseUrl" target="_blank" rel="noopener">texto de la licencia</a>).
      Zonas de aparición y puntos de misión: <a href="https://metaforge.app/arc-raiders" target="_blank" rel="noopener">MetaForge</a>,
      calibrados sobre las imágenes de cada mapa; pueden tener un pequeño desvío.
      Retratos de los comerciantes: wiki de ARC Raiders en Fandom.
    </p>
    <p>
      El contenido de ARC Raiders pertenece a Embark Studios AB y sus licenciantes. GrietaMeta no está afiliado ni respaldado por Embark Studios.
      <span v-if="generated">Datos del juego actualizados el {{ generated }}.</span>
    </p>
  </aside>
</template>

<script setup>
import { ARC_DATA_LICENSE_URL } from "@/services/arcRaiders";

defineProps({
  generated: { type: String, default: "" },
});
const licenseUrl = ARC_DATA_LICENSE_URL;
</script>

<style scoped>
.credits {
  margin-top: 28px;
  padding: 18px 0 8px;
  border-top: 1px solid rgba(242, 235, 221, 0.08);
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--am-faint);
}
.credits p {
  margin: 0 0 8px;
  max-width: 820px;
}
.credits a {
  color: var(--am-mute);
}
.credits a:hover {
  color: var(--am-ink);
}
</style>
