<template>
  <!-- Desplegable de rango con los emblemas oficiales. -->
  <div ref="box" class="ddw" @mouseleave="open = false">
    <button
      type="button"
      class="ddb"
      :class="{ on: open }"
      aria-haspopup="true"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-label="`Rango: ${current.key === 'ALL' ? 'todos' : current.label}`"
      @click="open = !open"
    >
      <span v-if="current.key === 'ALL'" class="stack" aria-hidden="true">
        <img src="/images/lol/rangos/iron.png" alt=""><img src="/images/lol/rangos/gold.png" alt=""><img src="/images/lol/rangos/diamond.png" alt="">
      </span>
      <img v-else :src="current.img" alt="">
      <span>{{ current.label }}</span>
      <svg class="chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </button>
    <div v-if="open" class="panel">
      <div class="rgrid">
        <button
          v-for="r in items"
          :key="r.key"
          type="button"
          class="rt"
          :class="{ on: modelValue === r.key }"
          :aria-pressed="modelValue === r.key ? 'true' : 'false'"
          :disabled="!r.enabled"
          :title="r.enabled ? '' : 'Aún sin partidas suficientes en este rango'"
          @click="pick(r.key)"
        >
          <img :src="r.img" alt=""><span>{{ r.label }}</span>
        </button>
        <button type="button" class="rt all" :class="{ on: modelValue === 'ALL' }" :aria-pressed="modelValue === 'ALL' ? 'true' : 'false'" @click="pick('ALL')">
          <span class="stack" aria-hidden="true">
            <img src="/images/lol/rangos/iron.png" alt=""><img src="/images/lol/rangos/gold.png" alt=""><img src="/images/lol/rangos/diamond.png" alt="">
          </span>
          <span>Todos los rangos</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RANK_PICKER_ORDER, rankInfo } from "@/services/lol/roster";
import { useDropdownClose } from "./useDropdownClose";

const props = defineProps({
  modelValue: { type: String, default: "ALL" },
  // (rango) => boolean: los rangos sin datos salen desactivados.
  hasData: { type: Function, default: () => true },
});
const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const box = ref(null);
useDropdownClose(box, open);

const current = computed(() => rankInfo(props.modelValue));
const items = computed(() => RANK_PICKER_ORDER.map((k) => ({ ...rankInfo(k), enabled: props.hasData(k) })));

function pick(key) {
  emit("update:modelValue", key);
  open.value = false;
}
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
.ddb img { width: 24px; height: 24px; object-fit: contain; }
.ddb .chev { color: #8A93A0; transition: transform 0.2s; }
.ddb.on .chev { transform: rotate(180deg); }
.stack { display: flex; align-items: center; }
.stack img { width: 20px; height: 20px; object-fit: contain; margin-left: -8px; }
.stack img:first-child { margin-left: 0; }
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
/* Puente invisible sobre el hueco botón-panel: al bajar el ratón despacio no
   salta el mouseleave y el panel no se cierra. */
.panel::before { content: ""; position: absolute; left: 0; right: 0; top: -10px; height: 10px; }
.rgrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  width: 312px;
  max-width: calc(100vw - 48px);
}
.rt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 4px 8px;
  border-radius: 11px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.03);
  color: #A0A8B4;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
}
.rt:hover:not(:disabled) { background: rgba(255, 255, 255, 0.07); color: var(--ink); transform: translateY(-1px); }
.rt.on { background: rgba(226, 181, 102, 0.12); border-color: rgba(226, 181, 102, 0.45); color: var(--accent); }
.rt:disabled { opacity: 0.4; cursor: not-allowed; }
.rt img { width: 32px; height: 32px; object-fit: contain; }
.rt.all { grid-column: 1 / -1; flex-direction: row; justify-content: center; gap: 10px; padding: 10px; }
</style>
