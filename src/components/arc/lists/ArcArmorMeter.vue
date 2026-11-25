<template>
  <span class="armor-meter" :data-level="level" aria-hidden="true">
    <i v-for="n in 4" :key="n" :class="{ filled: n <= level }"></i>
  </span>
</template>

<script setup>
defineProps({ level: { type: Number, required: true } });
</script>

<style scoped>
.armor-meter {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  width: 84px;
  flex-shrink: 0;
  --meter-color: #7fd6f0;
}
.armor-meter[data-level="2"] { --meter-color: #f5c02a; }
.armor-meter[data-level="3"] { --meter-color: #ffa24a; }
.armor-meter[data-level="4"] { --meter-color: #ff6b5b; }
i { height: 6px; border-radius: 2px; background: rgba(242, 235, 221, .12); }
i.filled { background: var(--meter-color); }
</style>
