<template>
  <!-- Panel lateral del mapa: pestañas Misiones / Enemigos. -->
  <aside class="side" aria-label="Información del mapa">
    <div class="stabs" role="tablist" aria-label="Contenido del panel">
      <button
        id="am-tab-q"
        type="button"
        class="stab cond"
        :class="{ on: tab === 'q' }"
        role="tab"
        aria-controls="am-panel-q"
        :aria-selected="tab === 'q'"
        @click="$emit('update:tab', 'q')"
      >
        Misiones · <span class="num">{{ questCount }}</span>
      </button>
      <button
        id="am-tab-e"
        type="button"
        class="stab cond"
        :class="{ on: tab === 'e' }"
        role="tab"
        aria-controls="am-panel-e"
        :aria-selected="tab === 'e'"
        @click="$emit('update:tab', 'e')"
      >
        Enemigos · <span class="num">{{ enemyCount }}</span>
      </button>
    </div>

    <div v-show="tab === 'q'" id="am-panel-q" class="pane" role="tabpanel" aria-labelledby="am-tab-q">
      <slot name="quests" />
    </div>
    <div v-show="tab === 'e'" id="am-panel-e" class="pane" role="tabpanel" aria-labelledby="am-tab-e">
      <slot name="enemies" />
    </div>
  </aside>
</template>

<script setup>
defineProps({
  tab: { type: String, default: "q" },
  questCount: { type: Number, default: 0 },
  enemyCount: { type: Number, default: 0 },
});
defineEmits(["update:tab"]);
</script>

<style scoped>
.side {
  flex: 1 1 360px;
  max-width: 420px;
  min-width: 0;
  /* Mismo alto que el visor (variable de .board en la vista); las listas hacen scroll. */
  height: var(--am-vp-h, auto);
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(242, 235, 221, 0.08);
  background: var(--am-side);
}
.stabs {
  display: flex;
  border-bottom: 1px solid rgba(242, 235, 221, 0.08);
}
.stab {
  position: relative;
  flex: 1;
  height: 52px;
  border: 0;
  background: transparent;
  color: var(--am-mute);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}
.stab .num {
  font-size: 15px;
}
.stab:hover,
.stab.on {
  color: var(--am-ink);
}
.stab.on::after {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: -1px;
  height: 3px;
  background: var(--am-yellow);
}
.stab:focus-visible {
  outline: 2px solid var(--am-yellow);
  outline-offset: -4px;
}
.pane {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* Debajo del mapa en cuanto no caben los dos (mismo corte que .board de la vista). */
@media (max-width: 1040px) {
  .side {
    height: auto;
    max-width: none;
    border-left: 0;
    border-top: 1px solid rgba(242, 235, 221, 0.08);
  }
}
</style>
