<template>
  <!-- Región: de momento solo hay datos de EUW (se avisa en el panel). -->
  <div ref="box" class="ddw" @mouseleave="open = false">
    <button
      type="button"
      class="ddb"
      :class="{ on: open }"
      aria-haspopup="true"
      :aria-expanded="open ? 'true' : 'false'"
      aria-label="Región: EUW"
      @click="open = !open"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>
      <span>EUW</span>
      <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
    <div v-if="open" class="panel">
      <div class="rlist">
        <div class="ri on">
          EUW · Europa Oeste
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>
        </div>
        <p class="rnote">De momento analizamos partidas de EUW.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDropdownClose } from "./useDropdownClose";

const open = ref(false);
const box = ref(null);
useDropdownClose(box, open);
</script>

<style scoped>
.ddw { position: relative; }
.ddb {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px 0 10px;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.ddb:hover,
.ddb.on { border-color: rgba(226, 181, 102, 0.45); background: rgba(226, 181, 102, 0.08); }
.ddb .chev { color: #8A93A0; transition: transform 0.2s; }
.ddb.on .chev { transform: rotate(180deg); }
.panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 70;
  padding: 8px;
  border-radius: 16px;
  background: #11151D;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.95);
  animation: lol-pop 0.18s ease-out;
}
/* Puente invisible sobre el hueco botón-panel (ver RankDropdown). */
.panel::before { content: ""; position: absolute; left: 0; right: 0; top: -10px; height: 10px; }
.rlist { width: 230px; display: flex; flex-direction: column; gap: 2px; }
.ri {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink);
}
.ri.on { background: rgba(226, 181, 102, 0.12); color: var(--accent); }
.ri svg { margin-left: auto; }
.rnote {
  margin: 4px 0 0;
  padding: 8px 10px 4px;
  font-size: 12px;
  color: var(--ink-mute);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
@media (max-width: 640px) {
  /* En móvil el botón puede quedar a la derecha: el panel se alinea a ese lado. */
  .panel { left: auto; right: 0; }
}
</style>
