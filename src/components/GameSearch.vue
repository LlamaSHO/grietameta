<template>
  <div ref="box" class="game-search" :class="{ big }">
    <svg class="gs-icon" :width="big ? 20 : 16" :height="big ? 20 : 16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    <input
      ref="input"
      v-model="query"
      type="search"
      :placeholder="placeholder"
      autocomplete="off"
      aria-label="Buscar juego"
      role="combobox"
      aria-autocomplete="list"
      :aria-controls="listId"
      :aria-expanded="open"
      :aria-activedescendant="open && active >= 0 ? `${listId}-${active}` : undefined"
      @input="show"
      @focus="show"
      @keydown="onKeydown"
    >
    <kbd v-if="shortcut" class="gs-kbd" aria-hidden="true">/</kbd>
    <ul v-show="open" :id="listId" class="game-results" role="listbox">
      <li v-if="!items.length" class="g-empty">
        No tenemos «{{ query.trim() }}» todavía.
        <RouterLink :to="requestLink" @click="close">Pídelo aquí</RouterLink>
      </li>
      <li
        v-for="(g, i) in items"
        v-else
        :id="`${listId}-${i}`"
        :key="g.slug"
        role="option"
        :class="{ 'is-active': i === active }"
        :aria-selected="i === active"
      >
        <RouterLink :to="g.url" @click="close">
          <GameIcon :game="g" />
          <span class="g-body">
            <span class="g-name">{{ g.name }}</span>
            <span class="g-tag">{{ g.tagline }}</span>
          </span>
          <GameBadge :status="g.status" />
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import GameIcon from "@/components/GameIcon.vue";
import GameBadge from "@/components/GameBadge.vue";
import { fetchGames, matchGames } from "@/services/games";

const props = defineProps({
  big: { type: Boolean, default: false },
  placeholder: { type: String, default: "Busca un juego…" },
  // Atajo "/" para enfocarlo. Solo uno por página (el del nav).
  shortcut: { type: Boolean, default: true },
});

const route = useRoute();
const router = useRouter();
const listId = `gs-${useId()}`;
const box = ref(null);
const input = ref(null);
const query = ref("");
const items = ref([]);
const active = ref(-1);
const open = ref(false);

// Si el juego no está, se pide desde Contacto con el nombre ya escrito.
const requestLink = computed(() => ({
  path: "/contacto",
  query: { motivo: "juego", ...(query.value.trim() ? { juego: query.value.trim() } : {}) },
}));

// Al cambiar de página el buscador se vacía y se cierra.
watch(
  () => route.path,
  () => {
    query.value = "";
    close();
  }
);

async function show() {
  const games = await fetchGames();
  items.value = matchGames(games, query.value);
  active.value = items.value.length ? 0 : -1;
  open.value = true;
}

function close() {
  open.value = false;
}

function onKeydown(e) {
  const n = items.value.length;
  if (e.key === "ArrowDown" && n) {
    e.preventDefault();
    active.value = (active.value + 1) % n;
  } else if (e.key === "ArrowUp" && n) {
    e.preventDefault();
    active.value = (active.value - 1 + n) % n;
  } else if (e.key === "Enter" && items.value[active.value]) {
    e.preventDefault();
    close();
    router.push(items.value[active.value].url);
  } else if (e.key === "Escape") {
    close();
    input.value?.blur();
  }
}

function onDocumentClick(e) {
  if (box.value && !box.value.contains(e.target)) close();
}

// Atajo: pulsar "/" fuera de un campo de texto lleva el cursor al buscador.
function onDocumentKeydown(e) {
  if (!props.shortcut) return;
  const tag = document.activeElement?.tagName || "";
  if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) {
    e.preventDefault();
    input.value?.focus();
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onDocumentKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>
