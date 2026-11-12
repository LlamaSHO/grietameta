<template>
  <!-- Créditos de los datos de ARC (hub y listas). El aviso de Embark ya va
       en el footer del sitio (SiteFooter). -->
  <aside class="arc-credits">
    <div class="wrap">
      <p v-if="note" class="note">{{ note }}</p>
      <p>
        Datos de objetos, misiones y enemigos del
        <a :href="DATA_SOURCE_URL" target="_blank" rel="noopener">Proyecto de datos ARC (RaidTheory/arcraiders-data)</a>,
        con licencia MIT (<a :href="ARC_DATA_LICENSE_URL" target="_blank" rel="noopener">texto de la licencia</a>)<template v-if="arcTracker">, y de la comunidad de
        <a href="https://arctracker.io" target="_blank" rel="noopener">ARC Tracker</a></template><template v-if="metaForge">. Zonas de enemigos y puntos de misión de los mapas:
        <a href="https://metaforge.app/arc-raiders" target="_blank" rel="noopener">MetaForge</a></template>.
      </p>
    </div>
  </aside>
</template>

<script setup>
import { ARC_DATA_LICENSE_URL } from "@/services/arcRaiders";
import { DATA_SOURCE_URL } from "@/components/arc/lists/arcLabels";

defineProps({
  // Línea con la fecha de los datos (opcional).
  note: { type: String, default: "" },
  arcTracker: { type: Boolean, default: false },
  metaForge: { type: Boolean, default: false },
});
</script>

<style scoped>
.arc-credits {
  margin-top: 64px;
  border-top: 1px solid var(--arc-line);
  padding-top: 24px;
  font-size: 13px;
  color: var(--arc-faint);
}
p { margin: 0 0 8px; max-width: 760px; line-height: 1.7; }
.note { color: var(--arc-mute); }
.arc-credits a { color: var(--arc-mute); text-decoration: underline; text-underline-offset: 2px; }
.arc-credits a:hover { color: var(--arc-ink); }
</style>
