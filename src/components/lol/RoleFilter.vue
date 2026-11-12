<template>
  <!-- Filtro por línea con los iconos oficiales de posición. -->
  <div class="roles" role="group" aria-label="Filtrar por rol">
    <button
      v-for="r in options"
      :key="r"
      type="button"
      class="role"
      :class="{ on: modelValue === r }"
      :aria-pressed="modelValue === r ? 'true' : 'false'"
      :title="r"
      @click="emit('update:modelValue', r)"
    >
      <span class="pi" :class="`pi-${ROLE_ICON[r]}`" aria-hidden="true"></span>
      <span class="lbl">{{ r }}</span>
    </button>
  </div>
</template>

<script setup>
import { ROLES, ROLE_ICON } from "@/services/lol/roster";

defineProps({ modelValue: { type: String, default: "Todos" } });
const emit = defineEmits(["update:modelValue"]);
const options = ["Todos", ...ROLES];
</script>

<style scoped>
.roles { display: flex; gap: 4px; flex-wrap: wrap; }
.role {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 11px;
  border: 0;
  background: transparent;
  color: #A0A8B4;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.role:hover { background: rgba(255, 255, 255, 0.05); color: var(--ink); }
.role.on { background: rgba(226, 181, 102, 0.14); color: var(--accent); box-shadow: inset 0 0 0 1px rgba(226, 181, 102, 0.35); }
@media (max-width: 860px) {
  .role { padding: 0 12px; }
  .role .lbl { display: none; }
}
</style>
